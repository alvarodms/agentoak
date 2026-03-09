import path from "node:path";
import { simpleGit } from "simple-git";
import { PROJECT_ROOT } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

const git = simpleGit(PROJECT_ROOT);

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
): Promise<string | null> {
  const paddedCycle = String(cycleNumber).padStart(4, "0");

  try {
    // Stage memory, journal, and build logs
    await git.add("memory/*");
    await git.add("journal/*");
    await git.add("artifacts/build-logs/*");

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

    // Check if there's anything to commit
    const status = await git.status();
    if (status.staged.length === 0) {
      logger.info("No changes to commit");
      return null;
    }

    // Clean the summary for commit message (single line, max 72 chars for first line)
    const shortSummary = summary.replace(/\n/g, " ").slice(0, 60);
    const commitMessage = `agent-oak: cycle ${paddedCycle} – ${shortSummary}`;

    const result = await git.commit(commitMessage);
    // Resolve full SHA — simple-git returns a short hash
    const fullSha = await git.revparse(["HEAD"]);
    logger.info(`Committed: ${commitMessage} (${fullSha.trim()})`);
    return fullSha.trim();
  } catch (err) {
    logger.error(`Git commit failed: ${err instanceof Error ? err.message : String(err)}`);
    return null;
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
