import path from "path";
import { loadMemory, updateCycleModeHistory } from "../memory/store.js";
import { planCycle } from "./planner.js";
import { getModeDescription, isCodingMode } from "./modes.js";
import {
  buildDynamicContext,
  buildTaskPrompt,
  buildBuildFixPrompt,
  buildCommitFixPrompt,
  buildReflectionPrompt,
} from "../agent/prompts.js";
import { runClaudeCode } from "../agent/claude-cli.js";
import type { ClaudeCodeResult } from "../agent/output-parser.js";
import type { ActionRecord } from "../agent/output-parser.js";
import { runReflection } from "../reflection/reflect.js";
import { runBuild, saveBuildLog } from "../repo/build.js";
import { recordSuccessfulBuild, formatVersion, loadVersion } from "../repo/version.js";
import { writeJournalEntry, getNextCycleNumber, getRecentJournalSummaries } from "../journal/writer.js";
import {
  commitCycle,
  commitJournalOnly,
  getHeadSha,
  revertPokeemerald,
  getDiffStats,
  getGitStatusText,
  getRecentGitLogText,
} from "../git/committer.js";
import { validateCycle } from "../reflection/validator.js";
import type { ValidationResult } from "../reflection/validator.js";
import { fetchNewCommunityIssues, formatIssuesForPrompt, executeIssueActions, createHelpRequest, readIssueBacklog, updateIssueBacklog } from "../github/issues.js";
import { closeIssue, addLabelsToIssue, AGENT_LABELS } from "../github/client.js";
import { logger, cycleLogger } from "../utils/logger.js";
import { PROJECT_ROOT } from "../utils/paths.js";
import { createCycleRelease } from "../release/release.js";
import type { TokenUsage } from "../memory/types.js";

const MAX_BUILD_FIX_ATTEMPTS = 3;
const MAX_COMMIT_FIX_ATTEMPTS = 3;
const CODING_PHASE_DEFAULT_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

/**
 * Build env overrides to route the Claude CLI subprocess to DeepSeek.
 * Returns undefined if DEEPSEEK_BASE_URL is not configured, so callers
 * can cheaply check for DeepSeek being active.
 */
function buildDeepSeekOverrides(): Record<string, string | undefined> | undefined {
  const baseUrl = process.env.DEEPSEEK_BASE_URL;
  if (!baseUrl) return undefined;
  return {
    ANTHROPIC_BASE_URL: baseUrl,
    ANTHROPIC_API_KEY: process.env.DEEPSEEK_API_KEY,
    ANTHROPIC_MODEL: process.env.DEEPSEEK_MODEL,
    ANTHROPIC_SMALL_FAST_MODEL: process.env.DEEPSEEK_MODEL,
    API_TIMEOUT_MS: process.env.DEEPSEEK_API_TIMEOUT_MS ?? CODING_PHASE_DEFAULT_TIMEOUT_MS.toString(),
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: process.env.DEEPSEEK_DISABLE_NONESSENTIAL_TRAFFIC ?? "1",
  };
}

/** Aggregate token usage from multiple phases */
function mergeTokenUsage(...usages: TokenUsage[]): TokenUsage {
  return usages.reduce(
    (acc, u) => ({
      inputTokens: acc.inputTokens + u.inputTokens,
      outputTokens: acc.outputTokens + u.outputTokens,
      totalTokens: acc.totalTokens + u.totalTokens,
    }),
    { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
  );
}

/** Phase 1: Planning — ask Claude to decide mode, objective, and task list */
async function runPlanningPhase(
  cycleNumber: number,
  log: ReturnType<typeof cycleLogger>,
) {
  log.info("Phase 1: Planning...");

  const memory = loadMemory();
  const recentJournals = getRecentJournalSummaries(3); // used by implementation, build-fix, and commit phases

  // Only pass the single most-recent journal to the planner to keep its prompt lean.
  // The planner can read memory files on demand via its tools if it needs more context.
  const lastJournal = getRecentJournalSummaries(1);

  // Fetch new community issues (silently skipped if GitHub is not configured)
  log.info("  Checking for community issues...");
  const communityIssues = await fetchNewCommunityIssues();
  const issueContext = formatIssuesForPrompt(communityIssues);
  const issueBacklog = readIssueBacklog();

  const plan = await planCycle(lastJournal, cycleNumber, issueContext, issueBacklog);
  log.info(`Plan: [${plan.mode}] ${plan.objective}`);

  // Execute issue actions decided by the planner (comment + label)
  if (plan.issueActions.length > 0) {
    log.info(`  Executing ${plan.issueActions.length} issue action(s)...`);
    await executeIssueActions(plan.issueActions);
  }

  // Update the deferred-issue backlog based on this cycle's actions
  const issueMap = new Map(communityIssues.map((i) => [i.number, i]));
  updateIssueBacklog(plan.issueActions, issueMap);

  // Any issue presented to the planner but NOT included in issueActions must
  // still be marked agent-reviewed so it doesn't resurface on the next cycle.
  const actedNumbers = new Set(plan.issueActions.map((a) => a.issueNumber));
  const unhandled = communityIssues.filter((i) => !actedNumbers.has(i.number));
  if (unhandled.length > 0) {
    log.info(`  Marking ${unhandled.length} unhandled issue(s) as reviewed...`);
    for (const issue of unhandled) {
      await addLabelsToIssue(issue.number, [AGENT_LABELS.reviewed]);
    }
  }

  // Create help-request issues if the planner asked for human input
  if (plan.helpRequests.length > 0) {
    log.info(`  Creating ${plan.helpRequests.length} help request(s)...`);
    for (const hr of plan.helpRequests) {
      const issueNum = await createHelpRequest(hr.title, hr.body);
      if (issueNum) {
        log.info(`  Created help request issue #${issueNum}: ${hr.title}`);
      }
    }
  }

  return { memory, recentJournals, plan };
}

/**
 * Phase 2: Implementation — run the planned task in a separate agent context
 * with its own system prompt and fresh conversation.
 */
async function runImplementationPhase(
  cycleNumber: number,
  plan: { mode: string; objective: string; reasoning: string; implementationPlan?: string },
  memory: ReturnType<typeof loadMemory>,
  recentJournals: string[],
  log: ReturnType<typeof cycleLogger>,
) {
  log.info("Phase 2: Implementation...");

  const modeDescription = getModeDescription(plan.mode as Parameters<typeof getModeDescription>[0]);
  const isCoding = isCodingMode(plan.mode as Parameters<typeof isCodingMode>[0]);
  const dynamicContext = isCoding ? "" : buildDynamicContext(memory, recentJournals, cycleNumber, modeDescription);
  const taskPrompt = buildTaskPrompt(cycleNumber, plan.objective, plan.reasoning, plan.mode, plan.implementationPlan);

  // Only route to DeepSeek for coding-focused modes; research and planning
  // require richer reasoning and stay on the Anthropic model.
  const deepSeekOverrides = isCoding
    ? buildDeepSeekOverrides()
    : undefined;
  const usingDeepSeek = !!deepSeekOverrides;
  const model = usingDeepSeek
    ? process.env.DEEPSEEK_MODEL
    : process.env.ANTHROPIC_MODEL;
  const timeout = usingDeepSeek
    ? parseInt(process.env.DEEPSEEK_API_TIMEOUT_MS ?? CODING_PHASE_DEFAULT_TIMEOUT_MS.toString(), 10)
    : 30 * 60 * 1000;
  const maxTurns = parseInt(process.env.MAX_TOOL_CALLS_PER_CYCLE ?? "50", 10);

  log.info(`  → Model profile: ${usingDeepSeek ? `DeepSeek (${model ?? "deepseek-chat"})` : `Anthropic (${model ?? "default"})`} [mode: ${plan.mode}]`);
  log.info(`  → Task: ${plan.objective}`);
  log.info(`  → Prompt: ${taskPrompt}`);
  log.info(`  → Dynamic context: ${dynamicContext}`);
  const result = await runClaudeCode(taskPrompt, {
    appendSystemPrompt: dynamicContext,
    maxTurns,
    model,
    timeout,
    envOverrides: deepSeekOverrides,
  });

  log.info(
    `  Implementation complete: ${result.toolCallCount} tool calls, ${result.filesModified.length} files modified`,
  );

  return result;
}

/**
 * Phase 3: Build verification with auto-fix loop.
 *
 * If the agent modified files, run the build. If it fails, spawn a focused
 * "fix build" agent up to MAX_BUILD_FIX_ATTEMPTS times. If all attempts fail,
 * revert pokeemerald changes to the pre-cycle state.
 */
async function runBuildVerifyPhase(
  cycleNumber: number,
  implResult: ClaudeCodeResult,
  sessionStartSha: string,
  memory: ReturnType<typeof loadMemory>,
  recentJournals: string[],
  log: ReturnType<typeof cycleLogger>,
): Promise<{
  finalBuildResult: { success: boolean; errors: string[] } | null;
  fixActions: ActionRecord[];
  fixTokenUsage: TokenUsage;
  reverted: boolean;
  gameVersion: string | null;
}> {
  const fixActions: ActionRecord[] = [];
  let fixTokenUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

  // Check if any modified files are within pokeemerald/
  const hasPokeemeraldChanges = implResult.filesModified.some((filePath) => {
    const rel = path.isAbsolute(filePath)
      ? path.relative(PROJECT_ROOT, filePath)
      : filePath;
    return rel.startsWith("pokeemerald/") || rel.startsWith("pokeemerald\\");
  });

  // No pokeemerald files modified — skip build verification
  if (implResult.filesModified.length === 0 || !hasPokeemeraldChanges) {
    if (implResult.filesModified.length > 0) {
      log.info("Phase 3: No pokeemerald/ files modified — skipping build verification.");
    } else {
      log.info("Phase 3: No files modified — skipping build verification.");
    }
    return {
      finalBuildResult: null, // No build verification = no build result
      fixActions,
      fixTokenUsage,
      reverted: false,
      gameVersion: null,
    };
  }

  log.info("Phase 3: Build verification...");
  let buildResult = await runBuild();
  saveBuildLog(cycleNumber, buildResult);

  if (buildResult.success) {
    const version = recordSuccessfulBuild(cycleNumber);
    log.info(`  Build: PASS — ${formatVersion(version)}`);
    return {
      finalBuildResult: { success: true, errors: [] },
      fixActions,
      fixTokenUsage,
      reverted: false,
      gameVersion: formatVersion(version),
    };
  }

  // Build failed — enter fix loop
  for (let attempt = 1; attempt <= MAX_BUILD_FIX_ATTEMPTS; attempt++) {
    log.info(`  Build: FAIL — running fix agent (attempt ${attempt}/${MAX_BUILD_FIX_ATTEMPTS})...`);

    const fixPrompt = buildBuildFixPrompt(cycleNumber, buildResult.errors, buildResult.stderr);

    const deepSeekOverrides = buildDeepSeekOverrides();
    const usingDeepSeek = deepSeekOverrides != null;
    const model = usingDeepSeek
      ? process.env.DEEPSEEK_MODEL
      : process.env.ANTHROPIC_MODEL;
    const timeout = usingDeepSeek
      ? parseInt(process.env.DEEPSEEK_API_TIMEOUT_MS ?? CODING_PHASE_DEFAULT_TIMEOUT_MS.toString(), 10)
      : 30 * 60 * 1000;
    const fixResult = await runClaudeCode(fixPrompt, {
      maxTurns: 15,
      tools: "Bash,Read,Edit,Write,Grep",
      model,
      timeout,
      envOverrides: deepSeekOverrides,
    });
    fixActions.push(...fixResult.actions);
    fixTokenUsage = mergeTokenUsage(fixTokenUsage, fixResult.tokenUsage);

    // Re-run build to check if fix worked
    buildResult = await runBuild();
    saveBuildLog(cycleNumber, buildResult);

    if (buildResult.success) {
      const version = recordSuccessfulBuild(cycleNumber);
      log.info(`  Build: PASS (fixed on attempt ${attempt}) — ${formatVersion(version)}`);
      return {
        finalBuildResult: { success: true, errors: [] },
        fixActions,
        fixTokenUsage,
        reverted: false,
        gameVersion: formatVersion(version),
      };
    }
  }

  // All fix attempts exhausted — revert pokeemerald changes
  log.warn(
    `  Build: FAIL after ${MAX_BUILD_FIX_ATTEMPTS} fix attempts — reverting pokeemerald to pre-cycle state.`,
  );
  const reverted = await revertPokeemerald(sessionStartSha);
  if (reverted) {
    log.info("  Reverted pokeemerald/ to pre-cycle state.");
  } else {
    log.warn("  Revert failed or no changes to revert.");
  }

  return {
    finalBuildResult: { success: false, errors: buildResult.errors },
    fixActions,
    fixTokenUsage,
    reverted: true,
    gameVersion: null,
  };
}

/**
 * Phase 4: Reflection — a fresh agent context analyzes what happened during
 * the cycle and updates memory.
 */
async function runReflectionPhase(
  cycleNumber: number,
  plan: { mode: string; objective: string },
  implResult: ClaudeCodeResult,
  buildResult: { success: boolean; errors: string[] } | null,
  validationResult: ValidationResult | null,
  log: ReturnType<typeof cycleLogger>,
) {
  log.info("Phase 4: Reflection...");
  return runReflection({
    cycleNumber,
    objective: plan.objective,
    actions: implResult.actions,
    filesModified: implResult.filesModified,
    buildResult,
    cycleSummary: implResult.cycleSummary,
    cycleChanges: implResult.cycleChanges,
    validationResult,
  });
}

/**
 * Phase 5 helper: commit with auto-fix loop and fallback commit guarantee.
 */
async function runCommitPhase(params: {
  cycleNumber: number;
  summary: string;
  filesModified: string[];
  acceptedIssueNumbers: number[];
  memory: ReturnType<typeof loadMemory>;
  recentJournals: string[];
  log: ReturnType<typeof cycleLogger>;
}): Promise<{ commitHash: string | null; commitFailed: boolean }> {
  const {
    cycleNumber,
    summary,
    filesModified,
    acceptedIssueNumbers,
    memory,
    recentJournals,
    log,
  } = params;

  let commitResult = await commitCycle(
    cycleNumber,
    summary,
    filesModified,
    acceptedIssueNumbers,
  );

  if (commitResult.success) {
    return { commitHash: commitResult.hash, commitFailed: false };
  }

  let lastFailure = `${commitResult.reason}: ${commitResult.message}`;

  for (let attempt = 1; attempt <= MAX_COMMIT_FIX_ATTEMPTS; attempt++) {
    log.warn(
      `  Commit: FAIL (${lastFailure}) — running commit-fix agent `
      + `(attempt ${attempt}/${MAX_COMMIT_FIX_ATTEMPTS})...`,
    );

    const gitStatus = await getGitStatusText();
    const recentGitLog = await getRecentGitLogText(5);
    const fixPrompt = buildCommitFixPrompt(cycleNumber, lastFailure, gitStatus, recentGitLog);

    const model = process.env.ANTHROPIC_MODEL;
    await runClaudeCode(fixPrompt, {
      maxTurns: 10,
      tools: "Bash,Read,Write",
      model,
    });

    commitResult = await commitCycle(
      cycleNumber,
      summary,
      filesModified,
      acceptedIssueNumbers,
    );
    if (commitResult.success) {
      log.info(`  Commit: PASS (fixed on attempt ${attempt})`);
      return { commitHash: commitResult.hash, commitFailed: false };
    }

    lastFailure = `${commitResult.reason}: ${commitResult.message}`;
  }

  log.error("  Commit: FAIL after fix attempts — trying fallback journal commit...");
  const fallbackResult = await commitJournalOnly(cycleNumber, "commit recovery fallback");
  if (fallbackResult.success) {
    log.warn("  Fallback journal commit succeeded after commit failure.");
    return { commitHash: fallbackResult.hash, commitFailed: false };
  }

  log.error(`  Fallback commit failed: ${fallbackResult.reason}: ${fallbackResult.message}`);
  return { commitHash: null, commitFailed: true };
}

/** Run a single autonomous cycle with multi-phase pipeline */
export async function runCycle(): Promise<void> {
  const cycleNumber = getNextCycleNumber();
  const log = cycleLogger(cycleNumber);

  log.info("═══════════════════════════════════════════════════");
  log.info(`  Agent Oak — Cycle ${String(cycleNumber).padStart(4, "0")} starting`);
  log.info("═══════════════════════════════════════════════════");

  // Snapshot current HEAD so we can revert on build failure
  const sessionStartSha = await getHeadSha();
  log.info(`Session start SHA: ${sessionStartSha}`);

  try {
    // ── Phase 1: Planning (separate agent context) ──
    const { memory, recentJournals, plan } = await runPlanningPhase(cycleNumber, log);

    // Record the chosen mode in history so future planners can see the pattern
    updateCycleModeHistory(plan.mode);

    // ── Phase 2: Implementation (separate agent context) ──
    const implResult = await runImplementationPhase(
      cycleNumber,
      plan,
      memory,
      recentJournals,
      log,
    );

    // ── Phase 3: Build verification + auto-fix loop ──
    const {
      finalBuildResult,
      fixActions,
      fixTokenUsage,
      reverted,
      gameVersion,
    } = await runBuildVerifyPhase(
      cycleNumber,
      implResult,
      sessionStartSha,
      memory,
      recentJournals,
      log,
    );

    // ── Phase 3.5: Validation — programmatic claim cross-check ──
    let validationResult: ValidationResult | null = null;
    if (!reverted) {
      log.info("Phase 3.5: Validating implementation claims...");
      const diffStats = await getDiffStats();
      validationResult = validateCycle({
        mode: plan.mode as Parameters<typeof validateCycle>[0]["mode"],
        objective: plan.objective,
        implResult,
        diffStats,
      });

      if (validationResult.status !== "verified") {
        log.warn(`  ⚠ Validation: ${validationResult.status.toUpperCase()}`);
        for (const w of validationResult.warnings) {
          log.warn(`    - ${w}`);
        }
      }
    }

    // ── Phase 4: Reflection (separate agent context) ──
    const reflection = await runReflectionPhase(
      cycleNumber,
      plan,
      implResult,
      finalBuildResult,
      validationResult,
      log,
    );

    // ── Phase 5: Journal + Commit ──
    const allActions = [...implResult.actions, ...fixActions, ...reflection.actions];
    const totalTokenUsage = mergeTokenUsage(
      implResult.tokenUsage,
      fixTokenUsage,
      reflection.tokenUsage,
    );

    const filesModified = reverted ? [] : implResult.filesModified;

    log.info("Phase 5: Writing journal entry...");
    const journalFile = writeJournalEntry({
      cycleNumber,
      mode: plan.mode as Parameters<typeof writeJournalEntry>[0]["mode"],
      objective: plan.objective,
      reasoning: plan.reasoning,
      actions: allActions,
      filesModified,
      buildResult: finalBuildResult,
      cycleSummary: reflection.cycleSummary
        + (reverted ? " [REVERTED: build could not be fixed]" : "")
        + (validationResult && validationResult.status !== "verified"
          ? ` [${validationResult.status.toUpperCase()}: agent claimed changes not reflected in file modifications]`
          : ""),
      validationWarnings: validationResult && validationResult.warnings.length > 0
        ? validationResult.warnings
        : undefined,
      validationStatus: validationResult?.status,
      nextSteps: reflection.nextSteps,
      reflectionText: reflection.reflectionText,
      tokenUsage: totalTokenUsage,
      toolCallCount: implResult.toolCallCount + fixActions.length,
      issueActions: plan.issueActions.length > 0 ? plan.issueActions : undefined,
      helpRequests: plan.helpRequests.length > 0 ? plan.helpRequests : undefined,
    });

    log.info("Phase 5: Committing to git...");
    const acceptedIssueNumbers = plan.issueActions
      .filter(a => a.action === "accept")
      .map(a => a.issueNumber);
    const { commitHash, commitFailed } = await runCommitPhase({
      cycleNumber,
      summary: reflection.cycleSummary || plan.objective,
      filesModified,
      acceptedIssueNumbers,
      memory,
      recentJournals,
      log,
    });

    if (commitFailed) {
      log.error("CRITICAL: Cycle completed without producing a git commit.");
      process.exitCode = 1;
    }

    // Close accepted issues after successful commit (not reverted)
    if (acceptedIssueNumbers.length > 0 && commitHash && !reverted) {
      log.info(`  Closing ${acceptedIssueNumbers.length} accepted issue(s)...`);
      for (const issueNumber of acceptedIssueNumbers) {
        await closeIssue(issueNumber, "completed");
      }
    }

    // Create GitHub release with IPS patch if build succeeded with pokeemerald changes
    let releaseUrl: string | null = null;
    if (gameVersion && commitHash && !reverted) {
      log.info("Phase 5: Creating GitHub release with IPS patch...");
      const version = loadVersion();
      releaseUrl = await createCycleRelease(
        version,
        commitHash,
        reflection.cycleSummary || "",
        plan.objective,
        reflection.cycleChanges,
      );
      if (releaseUrl) {
        log.info(`  Release: ${releaseUrl}`);
      }
    }

    // Summary
    log.info("═══════════════════════════════════════════════════");
    log.info(`  Cycle ${String(cycleNumber).padStart(4, "0")} complete`);
    log.info(`  Mode: ${plan.mode}`);
    log.info(`  Objective: ${plan.objective}`);
    log.info(`  Files modified: ${filesModified.length}${reverted ? " (reverted)" : ""}`);
    log.info(`  Build: ${finalBuildResult ? (finalBuildResult.success ? "SUCCESS" : "FAILED") : "not attempted"}`);
    if (gameVersion) {
      log.info(`  Version: ${gameVersion}`);
    }
    log.info(`  Tool calls: ${implResult.toolCallCount}`);
    log.info(`  Tokens: ${totalTokenUsage.totalTokens.toLocaleString()}`);
    log.info(`  Journal: ${journalFile}`);
    log.info(`  Commit: ${commitHash ?? "none"}${commitFailed ? " [COMMIT_FAILED]" : ""}`);
    if (releaseUrl) {
      log.info(`  Release: ${releaseUrl}`);
    }
    log.info("═══════════════════════════════════════════════════");
  } catch (err) {
    log.error(`Cycle failed with error: ${err instanceof Error ? err.message : String(err)}`);
    if (err instanceof Error && err.stack) {
      log.error(err.stack);
    }

    // Write a crash journal entry so the failure is recorded
    try {
      writeJournalEntry({
        cycleNumber,
        mode: "research",
        objective: "Cycle crashed before completion",
        reasoning: "N/A — cycle crashed",
        actions: [],
        filesModified: [],
        buildResult: null,
        cycleSummary: `Cycle crashed: ${err instanceof Error ? err.message : String(err)}`,
        nextSteps: "Investigate the crash and retry",
        reflectionText: `The cycle crashed with error: ${err instanceof Error ? err.message : String(err)}`,
        tokenUsage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        toolCallCount: 0,
      });
      const crashCommit = await commitCycle(cycleNumber, "cycle crashed", []);
      if (!crashCommit.success) {
        await commitJournalOnly(cycleNumber, "crash fallback commit");
      }
    } catch {
      log.error("Failed to write crash journal entry");
    }

    throw err;
  }
}
