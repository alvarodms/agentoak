import { simpleGit } from "simple-git";
import { PROJECT_ROOT } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

const git = simpleGit(PROJECT_ROOT);

export type CommitFailureReason = "nothing-to-stage" | "commit-error";

export type CommitOutcome =
  | { success: true; hash: string }
  | { success: false; reason: CommitFailureReason; message: string };

/**
 * Stage the cycle's records (README, memory, journal, artifacts) and commit
 * them together with whatever game-tree changes are already staged. The game
 * tree stages its own verified change set; see GameTree.stage().
 */
export async function commitCycle(
  cycleNumber: number,
  summary: string,
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
 * Last-resort fallback commit that captures at least the journal/memory updates
 * (plus any verified game-tree changes the game tree already staged).
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
