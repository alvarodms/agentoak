/**
 * One GitHub issue per failing playtest.
 *
 * After each cycle's playtest run, the runner keeps exactly one open issue
 * per failing playtest, titled "Playtest failing: <name>":
 * - a new failure opens one;
 * - a different failure of an already-reported playtest adds a comment;
 * - a playtest that passes again, or was removed, closes its issue.
 *
 * Issues carry `bug-report`, so the planner triages them like any bug report,
 * plus `playtest-failure`, which marks them as the runner's to open and close.
 * The issue body ends with a hidden marker holding the failure's signature,
 * so a repeat of the same failure stays silent.
 */

import crypto from "node:crypto";
import type { PlaytestResult } from "../emulator/playtest.js";
import {
  closeIssue,
  commentOnIssue,
  createIssue,
  ensureLabel,
  fetchOpenIssues,
  updateIssueBody,
  type GitHubIssue,
} from "./client.js";

export const PLAYTEST_LABEL = "playtest-failure";
/**
 * More new failures than this in one run points at the harness or the build,
 * not at the game: open no issues and leave it to the run's report.
 */
export const MAX_NEW_ISSUES_PER_RUN = 5;
const TITLE_PREFIX = "Playtest failing: ";
const MARKER = /<!-- playtest-failure sig=([0-9a-f]+) -->/;

export function playtestIssueTitle(name: string): string {
  return `${TITLE_PREFIX}${name}`;
}

/** The playtest an issue tracks, from its title, or null if it isn't one of ours. */
export function playtestNameFromTitle(title: string): string | null {
  return title.startsWith(TITLE_PREFIX) ? title.slice(TITLE_PREFIX.length).trim() : null;
}

/** Identifies a failure: same step, same error → same signature. */
export function failureSignature(result: PlaytestResult): string {
  return crypto
    .createHash("sha1")
    .update(`${result.failedStep}|${result.error ?? ""}`)
    .digest("hex")
    .slice(0, 12);
}

export interface SyncContext {
  cycleNumber: number;
  /** Link to the CI run whose artifact holds the report and screenshots. */
  runUrl?: string;
}

function failureDetails(result: PlaytestResult, ctx: SyncContext): string {
  const dialogue = result.transcripts.flat().map((t) => t.replace(/\n/g, " / "));
  const evidence = ctx.runUrl
    ? `Report and screenshots (\`failure.png\`): the \`playtests\` artifact of [this run](${ctx.runUrl}) (kept for 14 days).`
    : "Report and screenshots: `artifacts/playtests/` after running it locally.";
  return [
    `- **Checks:** ${result.checks}`,
    `- **File:** \`${result.file ?? "?"}\``,
    `- **Failed at:** ${result.failedStep === -1 ? "before the first step (boot or invalid file)" : `step ${result.failedStep}`} (cycle ${ctx.cycleNumber})`,
    "",
    "```text",
    (result.error ?? "").slice(0, 3000),
    "```",
    ...(dialogue.length ? ["", "<details><summary>Dialogue seen</summary>", "", "```text", ...dialogue, "```", "</details>"] : []),
    "",
    evidence,
  ].join("\n");
}

function issueBody(result: PlaytestResult, ctx: SyncContext, firstCycle: number): string {
  return [
    `🤖 The playtest \`${result.name}\` fails on the game as of cycle ${ctx.cycleNumber} (first failed in cycle ${firstCycle}).`,
    "",
    failureDetails(result, ctx),
    "",
    `Reproduce: build the ROM, then \`npm run playtest -- --filter ${result.name}\`. Either the game or the playtest is wrong; the playtest instructions explain how to tell. The runner closes this issue when the playtest passes or is removed.`,
    "",
    `<!-- playtest-failure sig=${failureSignature(result)} -->`,
  ].join("\n");
}

export type PlaytestIssueAction =
  | { kind: "open"; name: string; title: string; body: string; labels: string[] }
  | { kind: "update"; name: string; issueNumber: number; body: string; comment: string }
  | { kind: "known"; name: string; issueNumber: number }
  | { kind: "close"; name: string; issueNumber: number; comment: string; reason: "completed" | "not_planned" };

/**
 * Decides what to do with GitHub issues after a playtest run. `results` must
 * cover the whole suite: an open issue whose playtest is not in it is closed
 * as removed.
 */
export function planPlaytestIssueSync(
  results: PlaytestResult[],
  openIssues: GitHubIssue[],
  ctx: SyncContext,
): PlaytestIssueAction[] {
  const issueByName = new Map<string, GitHubIssue>();
  for (const issue of openIssues) {
    const name = playtestNameFromTitle(issue.title);
    if (name && issue.labels.includes(PLAYTEST_LABEL) && !issueByName.has(name)) issueByName.set(name, issue);
  }
  const actions: PlaytestIssueAction[] = [];

  for (const result of results) {
    const issue = issueByName.get(result.name);
    issueByName.delete(result.name);
    if (result.passed) {
      if (issue) {
        actions.push({
          kind: "close",
          name: result.name,
          issueNumber: issue.number,
          reason: "completed",
          comment: `✅ \`${result.name}\` passes again as of cycle ${ctx.cycleNumber}.`,
        });
      }
      continue;
    }
    if (!issue) {
      actions.push({
        kind: "open",
        name: result.name,
        title: playtestIssueTitle(result.name),
        body: issueBody(result, ctx, ctx.cycleNumber),
        labels: [PLAYTEST_LABEL, "bug-report"],
      });
      continue;
    }
    const known = MARKER.exec(issue.body)?.[1];
    if (known === failureSignature(result)) {
      actions.push({ kind: "known", name: result.name, issueNumber: issue.number });
      continue;
    }
    const firstCycle = Number(/first failed in cycle (\d+)/.exec(issue.body)?.[1] ?? ctx.cycleNumber);
    actions.push({
      kind: "update",
      name: result.name,
      issueNumber: issue.number,
      body: issueBody(result, ctx, firstCycle),
      comment: `The failure changed in cycle ${ctx.cycleNumber}:\n\n${failureDetails(result, ctx)}`,
    });
  }

  for (const [name, issue] of issueByName) {
    actions.push({
      kind: "close",
      name,
      issueNumber: issue.number,
      reason: "not_planned",
      comment: `The playtest \`${name}\` no longer exists as of cycle ${ctx.cycleNumber}, so this issue is closed. If it was removed to hide a failure rather than because its behaviour was deliberately dropped, reopen this issue.`,
    });
  }
  return actions;
}

export interface SyncedIssue {
  name: string;
  issueNumber: number | null;
  /**
   * "opened" is a new failure; "known" an already-reported one; "suppressed"
   * a new failure left unreported because too many failed at once.
   */
  status: "opened" | "updated" | "known" | "closed" | "suppressed";
}

/** Applies the planned actions. Without a GitHub client, it does nothing and returns []. */
export async function syncPlaytestIssues(results: PlaytestResult[], ctx: SyncContext): Promise<SyncedIssue[]> {
  const open = await fetchOpenIssues([PLAYTEST_LABEL]);
  const synced: SyncedIssue[] = [];
  const actions = planPlaytestIssueSync(results, open, ctx);
  const tooMany = actions.filter((a) => a.kind === "open").length > MAX_NEW_ISSUES_PER_RUN;
  if (actions.some((a) => a.kind === "open") && !tooMany) {
    // Finding open issues relies on this label, so make sure it exists before
    // tagging new issues with it.
    await ensureLabel(PLAYTEST_LABEL, "d93f0b", "A playtest fails; opened and closed by the runner");
  }
  for (const action of actions) {
    switch (action.kind) {
      case "open":
        synced.push(
          tooMany
            ? { name: action.name, issueNumber: null, status: "suppressed" }
            : { name: action.name, issueNumber: await createIssue(action.title, action.body, action.labels), status: "opened" },
        );
        break;
      case "update":
        await commentOnIssue(action.issueNumber, action.comment);
        await updateIssueBody(action.issueNumber, action.body);
        synced.push({ name: action.name, issueNumber: action.issueNumber, status: "updated" });
        break;
      case "known":
        synced.push({ name: action.name, issueNumber: action.issueNumber, status: "known" });
        break;
      case "close":
        await commentOnIssue(action.issueNumber, action.comment);
        await closeIssue(action.issueNumber, action.reason);
        synced.push({ name: action.name, issueNumber: action.issueNumber, status: "closed" });
        break;
    }
  }
  return synced;
}
