import { simpleGit } from "simple-git";
import { PROJECT_ROOT } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

const git = simpleGit(PROJECT_ROOT);

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
    for (const file of filesModified) {
      await git.add(`pokeemerald/${file}`);
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
    logger.info(`Committed: ${commitMessage} (${result.commit})`);
    return result.commit;
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
