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

/**
 * Get added lines from the memory/strategy-notes.md diff (staged + unstaged vs HEAD).
 * Used to capture plan output for planning cycles.
 */
export async function getStrategyNotesDiff(): Promise<string> {
  try {
    const diff = await git.diff(["HEAD", "--", "memory/strategy-notes.md"]);
    if (!diff) return "";
    // Extract only added lines (skip diff headers)
    return diff
      .split("\n")
      .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
      .map((line) => line.slice(1))
      .join("\n")
      .trim();
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

/**
 * Count untracked files under pokeemerald/ that aren't covered by gitignore.
 * `git diff --stat HEAD` is blind to never-added files, so cycles whose work
 * is primarily *new* files (new scripts, new data, new sprite directories)
 * would otherwise be flagged as unsubstantiated even though the work shipped.
 *
 * Returns a zero-length list on any failure so the caller can fall back to
 * the tracked-only stats without losing them.
 */
async function listUntrackedPokeemeraldFiles(): Promise<string[]> {
  try {
    const output = await git.raw([
      "ls-files",
      "--others",
      "--exclude-standard",
      "--",
      "pokeemerald/",
    ]);
    return output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch {
    return [];
  }
}

/**
 * Pure helper: combine the raw `git diff --stat` output and the list of
 * untracked files into a `DiffStats`. Extracted so it can be unit-tested
 * without touching the real git repo.
 */
export function buildDiffStats(rawDiffStat: string, untrackedFiles: string[]): DiffStats {
  const stat = rawDiffStat.trim();
  const lines = stat.split("\n");
  const summaryLine = lines[lines.length - 1] ?? "";

  const filesMatch = summaryLine.match(/(\d+)\s+files?\s+changed/);
  const insertMatch = summaryLine.match(/(\d+)\s+insertions?\(\+\)/);
  const deleteMatch = summaryLine.match(/(\d+)\s+deletions?\(-\)/);

  const trackedFilesChanged = filesMatch ? parseInt(filesMatch[1], 10) : 0;
  const insertions = insertMatch ? parseInt(insertMatch[1], 10) : 0;
  const deletions = deleteMatch ? parseInt(deleteMatch[1], 10) : 0;

  const filesChanged = trackedFilesChanged + untrackedFiles.length;

  let summary = stat || "No changes in pokeemerald/";
  if (untrackedFiles.length > 0) {
    const preview = untrackedFiles.slice(0, 5).join(", ");
    const more = untrackedFiles.length > 5 ? `, +${untrackedFiles.length - 5} more` : "";
    summary += `\n ${untrackedFiles.length} untracked file(s) (newly created): ${preview}${more}`;
  }

  return { filesChanged, insertions, deletions, summary };
}

/** Get structured diff statistics for pokeemerald/ changes (staged + unstaged + untracked) */
export async function getDiffStats(): Promise<DiffStats> {
  try {
    // Tracked changes: staged + unstaged vs HEAD.
    const stat = await git.diff(["--stat", "HEAD", "--", "pokeemerald/"]);
    // Untracked files: not visible to `git diff`, but still real work.
    const untrackedFiles = await listUntrackedPokeemeraldFiles();
    return buildDiffStats(stat, untrackedFiles);
  } catch {
    return { filesChanged: 0, insertions: 0, deletions: 0, summary: "Could not compute diff stats" };
  }
}
