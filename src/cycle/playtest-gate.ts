/**
 * Phase 3.7: the advisory playtest gate.
 *
 * After the game tree is verified, replay every playtest in
 * pokeemerald/playtests/ against a ROM built from it, keep GitHub issues in
 * step with the failures (see github/playtest-issues.ts), and summarise the
 * run for the reflection phase. It never fails or reverts a cycle: anything
 * that goes wrong here is logged and the cycle carries on.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import { PLAYTESTS_DIR, PLAYTEST_OUT_DIR, runSuite } from "../emulator/run-playtests.js";
import { loadPlaytestFiles, type PlaytestResult } from "../emulator/playtest.js";
import { syncPlaytestIssues, type SyncedIssue } from "../github/playtest-issues.js";
import { POKEEMERALD_DIR } from "../utils/paths.js";

export interface PlaytestGateResult {
  status: "ran" | "skipped";
  /** Why the gate did not run. */
  reason?: string;
  results: PlaytestResult[];
  issues: SyncedIssue[];
}

const BUILD_TIMEOUT_MS = 10 * 60 * 1000;

type Log = { info: (msg: string) => void; warn: (msg: string) => void };

/** Link to this CI run, whose `playtests` artifact holds the report and screenshots. */
export function ciRunUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = env;
  return GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
    ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
    : undefined;
}

export async function runPlaytestGate(cycleNumber: number, log: Log): Promise<PlaytestGateResult> {
  const skipped = (reason: string): PlaytestGateResult => {
    log.warn(`  Playtests skipped: ${reason}`);
    return { status: "skipped", reason, results: [], issues: [] };
  };
  try {
    if (!fs.existsSync(PLAYTESTS_DIR) || loadPlaytestFiles([PLAYTESTS_DIR]).length === 0) {
      return skipped("no playtests in pokeemerald/playtests/");
    }

    // The verified tree has already built, so this is usually a no-op; it
    // makes sure the ROM on disk is the one the tree describes.
    const build = spawnSync("make", [`-j${os.availableParallelism()}`], {
      cwd: POKEEMERALD_DIR,
      encoding: "utf8",
      timeout: BUILD_TIMEOUT_MS,
      maxBuffer: 64 * 1024 * 1024,
    });
    if (build.status !== 0) {
      return skipped(`the ROM did not build (${build.error?.message ?? `exit ${build.status}`})`);
    }

    const { problems, results } = await runSuite({
      onResult: (r) => log.info(`  ${r.passed ? "✓" : "✗"} ${r.name}${r.passed ? "" : ` — step ${r.failedStep}: ${r.error?.slice(0, 200)}`}`),
    });
    if (problems.length) return skipped(problems.join(" "));

    const failed = results.filter((r) => !r.passed).length;
    log.info(`  Playtests: ${results.length - failed}/${results.length} passed (report: ${PLAYTEST_OUT_DIR}/report.md)`);

    let issues: SyncedIssue[] = [];
    if (process.env.GITHUB_TOKEN) {
      issues = await syncPlaytestIssues(results, { cycleNumber, runUrl: ciRunUrl() });
      for (const i of issues.filter((i) => i.status !== "known")) {
        log.info(`  Playtest issue ${i.status}: ${i.name}${i.issueNumber ? ` (#${i.issueNumber})` : ""}`);
      }
    }
    return { status: "ran", results, issues };
  } catch (err) {
    return skipped(`the playtest run crashed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** The reflection prompt's "Playtests" section. */
export function formatPlaytestSection(gate: PlaytestGateResult): string {
  if (gate.status === "skipped") {
    return `## Playtests\n\nThe playtest suite did not run this cycle: ${gate.reason}`;
  }
  const failed = gate.results.filter((r) => !r.passed);
  const header = `## Playtests\n\nThe runner replayed every playtest in \`pokeemerald/playtests/\` against this cycle's verified ROM: **${gate.results.length - failed.length}/${gate.results.length} passed**.`;
  if (failed.length === 0) return header;

  const issueFor = new Map(gate.issues.map((i) => [i.name, i]));
  const describe = (r: PlaytestResult): string => {
    const issue = issueFor.get(r.name);
    const tag = !issue
      ? ""
      : issue.status === "known"
        ? ` — already reported (#${issue.issueNumber}), not new this cycle`
        : issue.status === "suppressed"
          ? " — NEW this cycle (no issue opened: too many failures at once, likely the harness or build)"
          : ` — ${issue.status === "opened" ? "NEW this cycle" : "failure changed this cycle"}${issue.issueNumber ? `, issue #${issue.issueNumber}` : ""}`;
    return `- \`${r.name}\`${tag}\n  - Checks: ${r.checks}\n  - Step ${r.failedStep}: ${(r.error ?? "").slice(0, 600)}`;
  };
  return [
    header,
    "",
    "Failing:",
    ...failed.map(describe),
    "",
    "For each NEW failure, decide from this cycle's changes whether the game broke (a bug for the next cycle to fix), the playtest went stale because this cycle changed that behaviour on purpose (the next cycle updates the playtest), or the playtest itself is wrong. Your game-tree edits are discarded after verification, so don't fix them now: record the call in `next_steps` and, for a bug, in `memory/failure-patterns.md`.",
  ].join("\n");
}
