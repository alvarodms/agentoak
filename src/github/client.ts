/**
 * GitHub integration for Agent Oak.
 *
 * Enables the agent to:
 * - Read community issues (suggestions, bug reports, ideas)
 * - Respond to issues with comments and labels
 * - Open "agent-help-request" issues when it needs human guidance
 *
 * Graceful degradation: if GITHUB_TOKEN or GITHUB_REPO are not set,
 * all operations return empty results / no-ops without throwing.
 */

import { Octokit } from "@octokit/rest";
import { logger } from "../utils/logger.js";

// ── Types ──────────────────────────────────────────────────────

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  labels: string[];
  state: "open" | "closed";
  author: string;
  createdAt: string;
  upvotes: number;
}

export interface GitHubComment {
  id: number;
  body: string;
  author: string;
  createdAt: string;
}

/** A per-item action within a multi-item issue */
export interface IssueActionItem {
  /** Short label identifying the item (e.g., "Dragon Rage damage bug") */
  label: string;
  action: "accept" | "defer" | "reject" | "need-info";
  response: string;
  /** When true, this item requires multiple cycles to complete. */
  partial?: boolean;
}

/** An action the planner decided to take on a community issue */
export interface IssueAction {
  issueNumber: number;
  /** Overall action for the issue. For multi-item issues, this is the "dominant" action:
   *  accept if any item is accepted, defer if all deferred, reject if all rejected. */
  action: "accept" | "defer" | "reject" | "need-info";
  response: string;
  /** When true, the issue requires multiple cycles to complete. The issue stays open and
   *  remains in the backlog for future cycles. Only meaningful with action "accept". */
  partial?: boolean;
  /** Optional per-item breakdown for issues containing multiple distinct asks.
   *  When present, each item gets its own action and response. */
  items?: IssueActionItem[];
}

/** A help request the agent wants to raise */
export interface HelpRequest {
  title: string;
  body: string;
}

// ── Label constants ────────────────────────────────────────────

/** Labels the agent adds to issues it has processed */
export const AGENT_LABELS = {
  reviewed: "agent-reviewed",
  accepted: "agent-accepted",
  deferred: "agent-deferred",
  rejected: "agent-rejected",
  needsInfo: "agent-needs-info",
  helpRequest: "agent-help-request",
  spriteFeedback: "sprite-feedback",
} as const;

/** Labels that indicate a community issue */
export const COMMUNITY_LABELS = [
  "suggestion",
  "trainer-tip",
  "bug-report",
  "idea",
] as const;

// ── Client singleton ──────────────────────────────────────────

let _octokit: Octokit | null = null;
let _initAttempted = false;

interface RepoInfo {
  owner: string;
  repo: string;
}

let _repoInfo: RepoInfo | null = null;

function parseRepoEnv(): RepoInfo | null {
  const raw = process.env.GITHUB_REPO;
  if (!raw) return null;
  const parts = raw.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    logger.warn(`Invalid GITHUB_REPO format: "${raw}" — expected "owner/repo"`);
    return null;
  }
  return { owner: parts[0], repo: parts[1] };
}

/**
 * Lazily initialise and return the Octokit client.
 * Returns null if GITHUB_TOKEN or GITHUB_REPO are not configured.
 */
export function getGitHubClient(): Octokit | null {
  if (_initAttempted) return _octokit;
  _initAttempted = true;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    logger.info("GITHUB_TOKEN not set — GitHub integration disabled.");
    return null;
  }

  _repoInfo = parseRepoEnv();
  if (!_repoInfo) {
    logger.info("GITHUB_REPO not set or invalid — GitHub integration disabled.");
    return null;
  }

  _octokit = new Octokit({ auth: token });
  logger.info(`GitHub integration enabled for ${_repoInfo.owner}/${_repoInfo.repo}`);
  return _octokit;
}

/** Get the parsed owner/repo. Returns null if not configured. */
export function getRepoInfo(): RepoInfo | null {
  if (!_initAttempted) getGitHubClient();
  return _repoInfo;
}

// ── API operations ────────────────────────────────────────────

/** Fetch open issues, optionally filtered by labels */
export async function fetchOpenIssues(labels?: string[]): Promise<GitHubIssue[]> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) return [];

  try {
    const response = await octokit.issues.listForRepo({
      owner: repo.owner,
      repo: repo.repo,
      state: "open",
      labels: labels?.join(","),
      per_page: 30,
      sort: "created",
      direction: "desc",
    });

    return response.data
      .filter((issue) => !issue.pull_request) // exclude PRs
      .map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body ?? "",
        labels: issue.labels
          .map((l) => (typeof l === "string" ? l : l.name ?? ""))
          .filter(Boolean),
        state: issue.state as "open" | "closed",
        author: issue.user?.login ?? "unknown",
        createdAt: issue.created_at,
        upvotes: issue.reactions?.["+1"] ?? 0,
      }));
  } catch (err) {
    logger.error(`Failed to fetch GitHub issues: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

/** Post a comment on an issue */
export async function commentOnIssue(issueNumber: number, body: string): Promise<void> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) return;

  try {
    await octokit.issues.createComment({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      body,
    });
    logger.info(`Commented on issue #${issueNumber}`);
  } catch (err) {
    logger.error(`Failed to comment on issue #${issueNumber}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Add labels to an issue */
export async function addLabelsToIssue(issueNumber: number, labels: string[]): Promise<void> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) return;

  try {
    await octokit.issues.addLabels({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      labels,
    });
    logger.info(`Added labels [${labels.join(", ")}] to issue #${issueNumber}`);
  } catch (err) {
    logger.error(`Failed to add labels to issue #${issueNumber}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Remove a label from an issue. Silently ignores if the label doesn't exist. */
export async function removeLabelFromIssue(issueNumber: number, label: string): Promise<void> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) return;

  try {
    await octokit.issues.removeLabel({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      name: label,
    });
    logger.info(`Removed label "${label}" from issue #${issueNumber}`);
  } catch (err) {
    // 404 means the label wasn't on the issue — not an error
    if (err instanceof Error && "status" in err && (err as { status: number }).status === 404) return;
    logger.error(`Failed to remove label from issue #${issueNumber}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * The set of mutually exclusive decision labels. When applying one,
 * the others should be removed to avoid contradictory signals.
 */
export const DECISION_LABELS = [
  AGENT_LABELS.accepted,
  AGENT_LABELS.deferred,
  AGENT_LABELS.rejected,
  AGENT_LABELS.needsInfo,
] as const;

/**
 * Set the decision label on an issue, removing any conflicting decision labels first.
 * Always adds `agent-reviewed` alongside the decision label.
 */
export async function setDecisionLabel(issueNumber: number, newDecisionLabel: string): Promise<void> {
  // Remove conflicting decision labels
  const conflicting = DECISION_LABELS.filter((l) => l !== newDecisionLabel);
  await Promise.all(conflicting.map((l) => removeLabelFromIssue(issueNumber, l)));

  // Add the new decision label + reviewed
  await addLabelsToIssue(issueNumber, [AGENT_LABELS.reviewed, newDecisionLabel]);
}

/** Fetch recent comments on an issue (most recent first, up to `count`). */
export async function fetchIssueComments(issueNumber: number, count = 10): Promise<GitHubComment[]> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) return [];

  try {
    const response = await octokit.issues.listComments({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      per_page: count,
      sort: "created",
      direction: "desc",
    });

    return response.data.map((c) => ({
      id: c.id,
      body: c.body ?? "",
      author: c.user?.login ?? "unknown",
      createdAt: c.created_at,
    }));
  } catch (err) {
    logger.error(`Failed to fetch comments for issue #${issueNumber}: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

/** Close an issue with a reason */
export async function closeIssue(
  issueNumber: number,
  reason: "completed" | "not_planned" = "completed",
): Promise<void> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) return;

  try {
    await octokit.issues.update({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issueNumber,
      state: "closed",
      state_reason: reason,
    });
    logger.info(`Closed issue #${issueNumber} (reason: ${reason})`);
  } catch (err) {
    logger.error(`Failed to close issue #${issueNumber}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Create a new issue and return its number, or null on failure */
export async function createIssue(
  title: string,
  body: string,
  labels: string[],
): Promise<number | null> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) return null;

  try {
    const response = await octokit.issues.create({
      owner: repo.owner,
      repo: repo.repo,
      title,
      body,
      labels,
    });
    logger.info(`Created issue #${response.data.number}: ${title}`);
    return response.data.number;
  } catch (err) {
    logger.error(`Failed to create GitHub issue: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}
