import path from "node:path";
import { simpleGit } from "simple-git";
import { PROJECT_ROOT } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

const git = simpleGit(PROJECT_ROOT);

export type CommitFailureReason = "nothing-to-stage" | "commit-error";

export type CommitOutcome =
  | { success: true; hash: string }
  | { success: false; reason: CommitFailureReason; message: string };

/** Get the current HEAD commit SHA */
export async function getHeadSha(): Promise<string> {
  try {
    const sha = await git.revparse(["HEAD"]);
    return sha.trim();
  } catch {
    return "unknown";
  }
}

/**
 * Revert all pokeemerald/ changes back to a given commit SHA.
 * This restores the pokeemerald directory to exactly how it was at that commit.
 */
export async function revertPokeemerald(sha: string): Promise<boolean> {
  if (sha === "unknown") {
    logger.warn("Cannot revert: unknown start SHA");
    return false;
  }

  try {
    await git.checkout([sha, "--", "pokeemerald/"]);
    logger.info(`Reverted pokeemerald/ to ${sha}`);
    return true;
  } catch (err) {
    logger.error(`Failed to revert pokeemerald/: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

/** Stage and commit all cycle artifacts */
export async function commitCycle(
  cycleNumber: number,
  summary: string,
  filesModified: string[],
  closedIssueNumbers?: number[],
): Promise<CommitOutcome> {
  const paddedCycle = String(cycleNumber).padStart(4, "0");

  try {
    // Stage README, memory, journal, build logs, and cycle counter
    await git.add("README.md");
    await git.add("memory/*");
    await git.add("journal/*");
    await git.add("artifacts/build-logs/*");
    await git.add("artifacts/cycle.json");
    await git.add("artifacts/version.json");

    // Stage modified pokeemerald files
    for (const rawPath of filesModified) {
      // Convert absolute paths to relative (from PROJECT_ROOT)
      const relPath = path.isAbsolute(rawPath)
        ? path.relative(PROJECT_ROOT, rawPath)
        : rawPath;

      // Skip files already staged by the glob patterns above (memory, journal, build-logs)
      if (
        relPath.startsWith("memory/") ||
        relPath.startsWith("journal/") ||
        relPath.startsWith("artifacts/")
      ) {
        continue;
      }

      // Ensure pokeemerald/ prefix for files that don't already have it
      const gitPath = relPath.startsWith("pokeemerald/")
        ? relPath
        : `pokeemerald/${relPath}`;
      await git.add(gitPath);
    }

    // Safety net: stage any new/modified sprite files not tracked by output parser
    // (catches MCP tool outputs like fetch_pokemon_sprites, Bash cp commands, etc.)
    try {
      await git.add("pokeemerald/graphics/pokemon/*");
    } catch {
      // Ignore — no new sprite files or directory doesn't exist
    }

    // Check if there's anything to commit
    const status = await git.status();
    if (status.staged.length === 0) {
      logger.info("No changes to commit");
      return {
        success: false,
        reason: "nothing-to-stage",
        message: "No changes were staged for commit.",
      };
    }

    // Clean the summary for commit message (single line, max 72 chars for first line)
    const shortSummary = summary.replace(/\n/g, " ").slice(0, 60);
    const issueRefs = closedIssueNumbers?.length
      ? `\n\n${closedIssueNumbers.map(n => `Fixes #${n}`).join("\n")}`
      : "";
    const commitMessage = `agent-oak: cycle ${paddedCycle} – ${shortSummary}${issueRefs}`;

    await git.commit(commitMessage);
    // Resolve full SHA — simple-git returns a short hash
    const fullSha = await git.revparse(["HEAD"]);
    logger.info(`Committed: ${commitMessage} (${fullSha.trim()})`);
    return { success: true, hash: fullSha.trim() };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(`Git commit failed: ${message}`);
    return { success: false, reason: "commit-error", message };
  }
}

/**
 * Last-resort fallback commit that captures at least the journal/memory updates.
 */
export async function commitJournalOnly(
  cycleNumber: number,
  note: string,
): Promise<CommitOutcome> {
  const paddedCycle = String(cycleNumber).padStart(4, "0");

  try {
    await git.add("journal/*");
    await git.add("memory/*");
    await git.add("artifacts/version.json");

    const status = await git.status();
    if (status.staged.length === 0) {
      return {
        success: false,
        reason: "nothing-to-stage",
        message: "No journal/memory changes were staged for fallback commit.",
      };
    }

    const shortNote = note.replace(/\n/g, " ").slice(0, 48);
    const commitMessage = `agent-oak: cycle ${paddedCycle} – [FALLBACK] ${shortNote}`;

    await git.commit(commitMessage);
    const fullSha = await git.revparse(["HEAD"]);
    logger.info(`Fallback commit created: ${commitMessage} (${fullSha.trim()})`);
    return { success: true, hash: fullSha.trim() };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(`Fallback git commit failed: ${message}`);
    return { success: false, reason: "commit-error", message };
  }
}

/** Snapshot git status for commit-fix agent context. */
export async function getGitStatusText(): Promise<string> {
  try {
    const output = await git.raw(["status", "--short", "--branch"]);
    return output.trim() || "(empty git status output)";
  } catch (err) {
    return `Failed to get git status: ${err instanceof Error ? err.message : String(err)}`;
  }
}

/** Snapshot recent commits for commit-fix agent context. */
export async function getRecentGitLogText(limit = 5): Promise<string> {
  try {
    const output = await git.raw(["log", "--oneline", `-${limit}`]);
    return output.trim() || "(no git log output)";
  } catch (err) {
    return `Failed to get git log: ${err instanceof Error ? err.message : String(err)}`;
  }
}

/** Get the current diff of unstaged changes in pokeemerald */
export async function getDiff(): Promise<string> {
  try {
    return await git.diff(["pokeemerald/"]);
  } catch {
    return "";
  }
}

export interface DiffStats {
  filesChanged: number;
  insertions: number;
  deletions: number;
  summary: string;
}

/** Get structured diff statistics for pokeemerald/ changes (staged + unstaged) */
export async function getDiffStats(): Promise<DiffStats> {
  try {
    // Include both staged and unstaged changes
    const stat = await git.diff(["--stat", "HEAD", "--", "pokeemerald/"]);
    const lines = stat.trim().split("\n");
    const summaryLine = lines[lines.length - 1] ?? "";

    const filesMatch = summaryLine.match(/(\d+)\s+files?\s+changed/);
    const insertMatch = summaryLine.match(/(\d+)\s+insertions?\(\+\)/);
    const deleteMatch = summaryLine.match(/(\d+)\s+deletions?\(-\)/);

    return {
      filesChanged: filesMatch ? parseInt(filesMatch[1], 10) : 0,
      insertions: insertMatch ? parseInt(insertMatch[1], 10) : 0,
      deletions: deleteMatch ? parseInt(deleteMatch[1], 10) : 0,
      summary: stat.trim() || "No changes in pokeemerald/",
    };
  } catch {
    return { filesChanged: 0, insertions: 0, deletions: 0, summary: "Could not compute diff stats" };
  }
}
