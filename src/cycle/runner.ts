import fs from "fs";
import path from "path";
import { loadMemory, updateCycleModeHistory } from "../memory/store.js";
import { planCycle } from "./planner.js";
import type { CyclePlan } from "./planner.js";
import { runGameplayDesigner } from "./gameplay-designer.js";
import { getModeDescription, isCodingMode } from "./modes.js";
import {
  buildDynamicContext,
  buildTaskPrompt,
  buildBuildFixPrompt,
  buildCommitFixPrompt,
  buildValidationFixPrompt,
} from "../agent/prompts.js";
import { runClaudeCode } from "../agent/claude-cli.js";
import type { ClaudeCodeResult, IssueOutcome } from "../agent/output-parser.js";
import type { ActionRecord } from "../agent/output-parser.js";
import { runReflection } from "../reflection/reflect.js";
import { runBuild, saveBuildLog } from "../repo/build.js";
import { recordSuccessfulBuild, formatVersion, loadVersion, applyVersionBump, setReleaseStage } from "../repo/version.js";
import { writeJournalEntry, getNextCycleNumber, getRecentJournalSummaries } from "../journal/writer.js";
import {
  commitCycle,
  commitJournalOnly,
  getHeadSha,
  revertPokeemerald,
  getDiffStats,
  getStrategyNotesDiff,
  getGitStatusText,
  getRecentGitLogText,
} from "../git/committer.js";
import { validateCycle } from "../reflection/validator.js";
import type { ValidationResult, ValidationStatus } from "../reflection/validator.js";
import { fetchNewCommunityIssues, formatIssuesForPrompt, executeIssueActions, createHelpRequest, readIssueBacklog, updateIssueBacklog, addIssueToBacklog, getStaleBacklogIssues, postIssueClosingComment, postIssuePartialDeliveryComment } from "../github/issues.js";
import { closeIssue, addLabelsToIssue, AGENT_LABELS } from "../github/client.js";
import { cycleLogger } from "../utils/logger.js";
import { PROJECT_ROOT, ARTIFACTS_DIR, MEMORY_DIR } from "../utils/paths.js";
import { createCycleRelease } from "../release/release.js";
import type { TokenUsage } from "../memory/types.js";

const TECH_DEBT_BACKLOG_PATH = path.join(MEMORY_DIR, "tech-debt-backlog.md");
const CREATIVE_BACKLOG_PATH = path.join(MEMORY_DIR, "creative-backlog.md");

/** Append an engineering investment to the persistent tech debt backlog. */
function persistEngineeringInvestment(
  cycleNumber: number,
  investment: string,
): void {
  const header = "# Tech Debt Backlog\n\nEngineering investment opportunities identified by the Tech Lead across cycles.\nThe Producer should review this list when planning — picking up even one item per few cycles compounds over time.\n\n| Cycle | Investment | Status |\n|-------|-----------|--------|\n";

  let content: string;
  if (fs.existsSync(TECH_DEBT_BACKLOG_PATH)) {
    content = fs.readFileSync(TECH_DEBT_BACKLOG_PATH, "utf-8");
  } else {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
    content = header;
  }

  // Append the new investment as a table row
  const sanitized = investment.replace(/\|/g, "—").replace(/\n/g, " ").trim();
  content += `| ${cycleNumber} | ${sanitized} | pending |\n`;
  fs.writeFileSync(TECH_DEBT_BACKLOG_PATH, content, "utf-8");
}

/** Append a creative investment to the persistent creative backlog. */
function persistCreativeInvestment(
  cycleNumber: number,
  idea: string,
): void {
  const header = "# Creative Backlog\n\nCreative investment opportunities identified by the Creative Visionary across cycles.\nThe Producer should review this list when planning — bold ideas that have been deferred multiple times may be ready when prerequisites are met.\n\n| Cycle | Idea | Status |\n|-------|------|--------|\n";

  let content: string;
  if (fs.existsSync(CREATIVE_BACKLOG_PATH)) {
    content = fs.readFileSync(CREATIVE_BACKLOG_PATH, "utf-8");
  } else {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
    content = header;
  }

  // Append the new idea as a table row
  const sanitized = idea.replace(/\|/g, "—").replace(/\n/g, " ").trim();
  content += `| ${cycleNumber} | ${sanitized} | pending |\n`;
  fs.writeFileSync(CREATIVE_BACKLOG_PATH, content, "utf-8");
}

const MAX_BUILD_FIX_ATTEMPTS = 3;
const MAX_COMMIT_FIX_ATTEMPTS = 3;
const MAX_VALIDATION_FIX_ATTEMPTS = 1;
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
  const staleIssues = getStaleBacklogIssues(cycleNumber);

  if (staleIssues.length > 0) {
    log.info(`  Found ${staleIssues.length} stale backlog issue(s) for re-review.`);
  }

  const plan = await planCycle(lastJournal, cycleNumber, issueContext, issueBacklog, staleIssues);
  log.info(`Plan: [${plan.mode}] ${plan.objective}`);

  // Execute issue actions only for newly fetched community issues — not for
  // backlog issues that were already reviewed and commented on in a prior cycle.
  const communityIssueNumbers = new Set(communityIssues.map((i) => i.number));
  const newIssueActions = plan.issueActions.filter((a) =>
    communityIssueNumbers.has(a.issueNumber),
  );
  if (newIssueActions.length > 0) {
    log.info(`  Executing ${newIssueActions.length} issue action(s)...`);
    await executeIssueActions(newIssueActions);
  }

  // Post comments on backlog issues being accepted this cycle.
  const backlogAcceptActions = plan.issueActions.filter(
    (a) => !communityIssueNumbers.has(a.issueNumber) && a.action === "accept",
  );
  if (backlogAcceptActions.length > 0) {
    log.info(`  Posting comments on ${backlogAcceptActions.length} backlog issue(s) being accepted...`);
    await executeIssueActions(backlogAcceptActions);
  }

  // Post comments on stale backlog issues that the planner re-evaluated
  // (accept is handled above; this covers reject and re-defer responses).
  const staleIssueNumbers = new Set(staleIssues.map((i) => i.issueNumber));
  const staleReviewActions = plan.issueActions.filter(
    (a) =>
      staleIssueNumbers.has(a.issueNumber) &&
      !communityIssueNumbers.has(a.issueNumber) &&
      a.action !== "accept", // accepts already handled above
  );
  if (staleReviewActions.length > 0) {
    log.info(`  Posting comments on ${staleReviewActions.length} stale issue(s) re-reviewed...`);
    await executeIssueActions(staleReviewActions);
  }

  // Update the deferred-issue backlog based on this cycle's actions
  // (all actions, including planner decisions on backlog issues)
  const issueMap = new Map(communityIssues.map((i) => [i.number, i]));
  updateIssueBacklog(plan.issueActions, issueMap, cycleNumber, staleIssueNumbers);

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
  const maxTurns = parseInt(process.env.MAX_TOOL_CALLS_PER_CYCLE ?? "100", 10);

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
 * Phase 3.5b: Validation fix loop.
 *
 * When validation detects that the implementation was "unsubstantiated" (no real
 * pokeemerald changes) or "incomplete" (key changes missing), spawn a focused
 * agent to complete the work before proceeding to reflection.
 */
async function runValidationFixPhase(
  cycleNumber: number,
  plan: { mode: string; objective: string; reasoning: string; implementationPlan?: string },
  implResult: ClaudeCodeResult,
  validationResult: ValidationResult,
  sessionStartSha: string,
  log: ReturnType<typeof cycleLogger>,
): Promise<{
  updatedImplResult: ClaudeCodeResult;
  finalValidationResult: ValidationResult;
  buildResult: { success: boolean; errors: string[] } | null;
  fixActions: ActionRecord[];
  fixTokenUsage: TokenUsage;
  reverted: boolean;
  gameVersion: string | null;
}> {
  const fixActions: ActionRecord[] = [];
  let fixTokenUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  let currentImplResult = implResult;
  let currentValidation = validationResult;
  let buildResult: { success: boolean; errors: string[] } | null = null;
  let gameVersion: string | null = null;
  let reverted = false;

  for (let attempt = 1; attempt <= MAX_VALIDATION_FIX_ATTEMPTS; attempt++) {
    log.info(
      `  Validation: ${currentValidation.status.toUpperCase()} — running fix agent `
      + `(attempt ${attempt}/${MAX_VALIDATION_FIX_ATTEMPTS})...`,
    );

    const fixPrompt = buildValidationFixPrompt(
      cycleNumber,
      plan.mode,
      plan.objective,
      currentValidation.status as Exclude<ValidationStatus, "verified">,
      currentValidation.warnings,
      currentValidation.diffSummary,
      currentImplResult.filesModified,
    );

    // Route model same as Phase 2 — coding modes use DeepSeek if configured
    const deepSeekOverrides = isCodingMode(plan.mode as Parameters<typeof isCodingMode>[0])
      ? buildDeepSeekOverrides()
      : undefined;
    const usingDeepSeek = !!deepSeekOverrides;
    const model = usingDeepSeek
      ? process.env.DEEPSEEK_MODEL
      : process.env.ANTHROPIC_MODEL;
    const timeout = usingDeepSeek
      ? parseInt(process.env.DEEPSEEK_API_TIMEOUT_MS ?? CODING_PHASE_DEFAULT_TIMEOUT_MS.toString(), 10)
      : 30 * 60 * 1000;

    const fixResult = await runClaudeCode(fixPrompt, {
      maxTurns: 30,
      model,
      timeout,
      envOverrides: deepSeekOverrides,
    });
    fixActions.push(...fixResult.actions);
    fixTokenUsage = mergeTokenUsage(fixTokenUsage, fixResult.tokenUsage);

    // Merge files modified (deduplicated)
    const mergedFiles = [...new Set([...currentImplResult.filesModified, ...fixResult.filesModified])];
    currentImplResult = { ...currentImplResult, filesModified: mergedFiles };

    // If fix agent modified pokeemerald files, re-run build verification
    const hasPokeemeraldChanges = fixResult.filesModified.some((filePath) => {
      const rel = path.isAbsolute(filePath)
        ? path.relative(PROJECT_ROOT, filePath)
        : filePath;
      return rel.startsWith("pokeemerald/") || rel.startsWith("pokeemerald\\");
    });

    if (hasPokeemeraldChanges) {
      log.info("  Validation fix modified pokeemerald/ files — running build verification...");
      const buildVerify = await runBuildVerifyPhase(
        cycleNumber,
        currentImplResult,
        sessionStartSha,
        log,
      );
      fixActions.push(...buildVerify.fixActions);
      fixTokenUsage = mergeTokenUsage(fixTokenUsage, buildVerify.fixTokenUsage);
      buildResult = buildVerify.finalBuildResult;
      gameVersion = buildVerify.gameVersion;

      if (buildVerify.reverted) {
        reverted = true;
        // Build fix exhausted and reverted — no point re-validating
        break;
      }
    }

    // Re-validate
    if (!reverted) {
      const diffStats = await getDiffStats();
      currentValidation = validateCycle({
        mode: plan.mode as Parameters<typeof validateCycle>[0]["mode"],
        objective: plan.objective,
        implResult: currentImplResult,
        diffStats,
      });

      if (currentValidation.status === "verified") {
        log.info(`  Validation: VERIFIED (fixed on attempt ${attempt})`);
        break;
      }

      log.warn(`  Validation: still ${currentValidation.status.toUpperCase()} after attempt ${attempt}`);
    }
  }

  return {
    updatedImplResult: currentImplResult,
    finalValidationResult: currentValidation,
    buildResult,
    fixActions,
    fixTokenUsage,
    reverted,
    gameVersion,
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

    // Persist any engineering investment to the tech debt backlog
    if (plan.engineeringInvestment) {
      persistEngineeringInvestment(cycleNumber, plan.engineeringInvestment);
      log.info(`  Engineering investment captured: ${plan.engineeringInvestment.slice(0, 100)}...`);
    }

    // Persist any creative investment to the creative backlog
    if (plan.creativeInvestment) {
      persistCreativeInvestment(cycleNumber, plan.creativeInvestment);
      log.info(`  Creative investment captured: ${plan.creativeInvestment.slice(0, 100)}...`);
    }

    // ── Phase 1.5: Gameplay Design (conditional — only when Producer sets a brief) ──
    let activePlan: CyclePlan = plan;
    let gameplayDesignTokenUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

    if (plan.gameplayDesignBrief) {
      log.info("Phase 1.5: Gameplay Design...");
      try {
        const designResult = await runGameplayDesigner(
          plan.objective,
          plan.gameplayDesignBrief,
          plan.implementationPlan,
        );
        activePlan = {
          ...plan,
          implementationPlan: `${plan.implementationPlan}\n\n## Gameplay Specifications (from Gameplay Designer)\n\n${designResult.specs}`,
        };
        gameplayDesignTokenUsage = designResult.tokenUsage;
        log.info(`  Gameplay design complete: ${designResult.toolCallCount} tool calls, ${designResult.specs.length} chars`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        log.warn(`  Gameplay Designer failed, proceeding with Producer's plan: ${errMsg}`);
        // Fall through with original plan
      }
    }

    // ── Phase 2: Implementation (separate agent context) ──
    let implResult = await runImplementationPhase(
      cycleNumber,
      activePlan,
      memory,
      recentJournals,
      log,
    );

    // ── Phase 3: Build verification + auto-fix loop ──
    let {
      finalBuildResult,
      fixActions,
      fixTokenUsage,
      reverted,
      gameVersion,
    } = await runBuildVerifyPhase(
      cycleNumber,
      implResult,
      sessionStartSha,
      log,
    );

    // ── Phase 3.5: Validation — programmatic claim cross-check ──
    let validationResult: ValidationResult | null = null;
    let validationFixActions: ActionRecord[] = [];
    let validationFixTokenUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

    if (!reverted) {
      log.info("Phase 3.5: Validating implementation claims...");
      const diffStats = await getDiffStats();
      validationResult = validateCycle({
        mode: plan.mode,
        objective: plan.objective,
        implResult,
        diffStats,
      });

      if (validationResult.status !== "verified") {
        log.warn(`  ⚠ Validation: ${validationResult.status.toUpperCase()}`);
        for (const w of validationResult.warnings) {
          log.warn(`    - ${w}`);
        }

        // ── Phase 3.5b: Validation fix loop ──
        const valFix = await runValidationFixPhase(
          cycleNumber,
          activePlan,
          implResult,
          validationResult,
          sessionStartSha,
          log,
        );

        implResult = valFix.updatedImplResult;
        validationResult = valFix.finalValidationResult;
        validationFixActions = valFix.fixActions;
        validationFixTokenUsage = valFix.fixTokenUsage;

        // If fix triggered a build, update build/version tracking
        if (valFix.buildResult) {
          finalBuildResult = valFix.buildResult;
        }
        if (valFix.gameVersion) {
          gameVersion = valFix.gameVersion;
        }
        if (valFix.reverted) {
          reverted = true;
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
    const allActions = [...implResult.actions, ...fixActions, ...validationFixActions, ...reflection.actions];
    const totalTokenUsage = mergeTokenUsage(
      gameplayDesignTokenUsage,
      implResult.tokenUsage,
      fixTokenUsage,
      validationFixTokenUsage,
      reflection.tokenUsage,
    );

    const filesModified = reverted ? [] : implResult.filesModified;

    // Write cycle.json so the README dynamic badge can read the latest cycle number
    const cycleJsonPath = path.join(ARTIFACTS_DIR, "cycle.json");
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    fs.writeFileSync(cycleJsonPath, JSON.stringify({ cycle: String(cycleNumber).padStart(4, "0") }, null, 2) + "\n", "utf-8");

    // For planning cycles, capture the strategy-notes additions as plan output
    let planOutput: string | undefined;
    if (plan.mode === "planning") {
      planOutput = await getStrategyNotesDiff() || undefined;
    }

    log.info("Phase 5: Writing journal entry...");
    const journalFile = writeJournalEntry({
      cycleNumber,
      mode: plan.mode,
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
      toolCallCount: implResult.toolCallCount + fixActions.length + validationFixActions.length,
      issueActions: plan.issueActions.length > 0 ? plan.issueActions : undefined,
      helpRequests: plan.helpRequests.length > 0 ? plan.helpRequests : undefined,
      planOutput,
    });

    // Apply agent-declared version bump / release stage before committing
    // so that the updated version.json is included in the commit and persists
    // across cycles (fixes minor version being lost after a bump).
    if (gameVersion && !reverted) {
      if (implResult.versionBump) {
        log.info(`Phase 5: Applying version bump (${implResult.versionBump}) declared by agent...`);
        applyVersionBump(implResult.versionBump, implResult.releaseStage);
      } else if (implResult.releaseStage) {
        log.info(`Phase 5: Setting release stage to "${implResult.releaseStage}" declared by agent...`);
        setReleaseStage(implResult.releaseStage);
      }
    }

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

    // Close accepted issues after successful commit (not reverted).
    //
    // Three categories of accepted issues:
    // 1. "partial" flag at planning time — multi-cycle work, stays open in backlog (unchanged).
    // 2. issueOutcomes[status="partial"] from CYCLE_COMPLETE — agent delivered only part of
    //    what was asked. Post a partial-delivery comment; either defer (keep open, re-backlog)
    //    or reject (close as not_planned) based on the agent's decision field.
    // 3. Everything else — fully implemented; post closing comment and close as "completed".
    if (acceptedIssueNumbers.length > 0 && commitHash && !reverted) {
      // Issues the planner explicitly flagged as multi-cycle at planning time
      const plannedPartialNumbers = new Set(
        plan.issueActions
          .filter((a) => a.action === "accept" && a.partial)
          .map((a) => a.issueNumber),
      );

      // Post-implementation outcomes reported in the CYCLE_COMPLETE marker
      const outcomeMap = new Map(
        implResult.issueOutcomes.map((o) => [o.number, o]),
      );

      const closingNumbers: number[] = [];
      const deferNumbers: number[] = [];
      const rejectNumbers: number[] = [];

      for (const issueNumber of acceptedIssueNumbers) {
        if (plannedPartialNumbers.has(issueNumber)) {
          // Already handled as a planned multi-cycle issue — leave open, skip.
          continue;
        }
        const outcome = outcomeMap.get(issueNumber);
        if (outcome?.status === "partial") {
          // For multi-item issues, check if there are remaining items
          const resolution = resolveMultiItemOutcome(outcome);
          if (resolution.canClose) {
            if (resolution.closingReason === "not_planned") {
              rejectNumbers.push(issueNumber);
            } else {
              closingNumbers.push(issueNumber);
            }
          } else if ((outcome.decision ?? "defer") === "reject") {
            rejectNumbers.push(issueNumber);
          } else {
            deferNumbers.push(issueNumber);
          }
        } else {
          // No outcome entry or status="complete" — treat as fully delivered.
          closingNumbers.push(issueNumber);
        }
      }

      // Fully completed issues
      if (closingNumbers.length > 0) {
        log.info(`  Closing ${closingNumbers.length} completed issue(s)...`);
        const closingSummary = reflection.cycleSummary || plan.objective;
        for (const issueNumber of closingNumbers) {
          const outcome = outcomeMap.get(issueNumber);
          const closingComment = formatClosingCommentWithItems(closingSummary, outcome);
          await postIssueClosingComment(issueNumber, closingComment);
          await closeIssue(issueNumber, "completed");
        }
      }

      // Partially delivered → defer: keep open, re-add to backlog
      if (deferNumbers.length > 0) {
        log.info(`  Deferring ${deferNumbers.length} partially-delivered issue(s) back to backlog...`);
        for (const issueNumber of deferNumbers) {
          const outcome = outcomeMap.get(issueNumber)!;
          const reason = outcome.reason ?? "This cycle's work partially addressed this issue.";
          const resolution = resolveMultiItemOutcome(outcome);
          const partialComment = formatPartialCommentWithItems(reason, outcome);
          await postIssuePartialDeliveryComment(issueNumber, partialComment, "defer");
          await addLabelsToIssue(issueNumber, [AGENT_LABELS.deferred]);
          // Re-add to backlog with remaining items tracked
          addIssueToBacklog(issueNumber, `Issue #${issueNumber}`, cycleNumber);
          // If there are remaining items, update the backlog entry with pending items
          if (resolution.remainingItems.length > 0) {
            const { parseBacklogEntries } = await import("../github/issues.js");
            const entries = parseBacklogEntries();
            const entry = entries.find((e) => e.issueNumber === issueNumber);
            if (entry) {
              entry.pendingItems = resolution.remainingItems;
              // Re-write backlog with updated pending items
              addIssueToBacklog(issueNumber, entry.title, cycleNumber);
            }
          }
        }
      }

      // Partially delivered → reject: close without completing
      if (rejectNumbers.length > 0) {
        log.info(`  Closing ${rejectNumbers.length} partially-delivered issue(s) as rejected...`);
        for (const issueNumber of rejectNumbers) {
          const outcome = outcomeMap.get(issueNumber)!;
          const reason = outcome.reason ?? "This cycle's work only partially addressed this issue, and the remaining work will not be pursued.";
          const rejectComment = formatPartialCommentWithItems(reason, outcome);
          await postIssuePartialDeliveryComment(issueNumber, rejectComment, "reject");
          await addLabelsToIssue(issueNumber, [AGENT_LABELS.rejected]);
          await closeIssue(issueNumber, "not_planned");
        }
      }

      if (plannedPartialNumbers.size > 0) {
        log.info(`  Kept ${plannedPartialNumbers.size} planned multi-cycle issue(s) open.`);
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

// ---------------------------------------------------------------------------
// Multi-item issue outcome helpers
// ---------------------------------------------------------------------------

/**
 * Resolve whether a multi-item issue can be closed, and which items remain.
 * For single-item issues (no itemOutcomes), falls through to existing behavior.
 */
function resolveMultiItemOutcome(outcome: IssueOutcome): {
  canClose: boolean;
  remainingItems: string[];
  closingReason: "completed" | "not_planned";
} {
  if (!outcome.itemOutcomes || outcome.itemOutcomes.length === 0) {
    // Single-item fallback
    return {
      canClose: outcome.status === "complete" || outcome.decision === "reject",
      remainingItems: [],
      closingReason: outcome.decision === "reject" ? "not_planned" : "completed",
    };
  }

  const remaining = outcome.itemOutcomes.filter(
    (i) =>
      i.status === "not-started" ||
      (i.status === "partial" && (i.decision ?? "defer") === "defer"),
  );

  const allRejected = outcome.itemOutcomes.every(
    (i) => i.decision === "reject",
  );

  return {
    canClose: remaining.length === 0,
    remainingItems: remaining.map((i) => i.label),
    closingReason: allRejected ? "not_planned" : "completed",
  };
}

/**
 * Format a closing comment with per-item detail for multi-item issues.
 * Falls back to plain summary for single-item issues.
 */
function formatClosingCommentWithItems(summary: string, outcome?: IssueOutcome): string {
  if (!outcome?.itemOutcomes || outcome.itemOutcomes.length === 0) {
    return summary;
  }

  const itemLines = outcome.itemOutcomes.map((item) => {
    if (item.status === "complete") return `- ✅ **${item.label}** — Done`;
    if (item.decision === "reject") return `- ❌ **${item.label}** — Declined${item.reason ? `: ${item.reason}` : ""}`;
    return `- ⏳ **${item.label}** — ${item.reason ?? "Pending"}`;
  });

  return `${summary}\n\n**Item breakdown:**\n${itemLines.join("\n")}`;
}

/**
 * Format a partial delivery comment with per-item detail for multi-item issues.
 * Falls back to plain reason for single-item issues.
 */
function formatPartialCommentWithItems(reason: string, outcome: IssueOutcome): string {
  if (!outcome.itemOutcomes || outcome.itemOutcomes.length === 0) {
    return reason;
  }

  const itemLines = outcome.itemOutcomes.map((item) => {
    if (item.status === "complete") return `- ✅ **${item.label}** — Done`;
    if (item.status === "not-started") return `- ⬜ **${item.label}** — Not started${item.reason ? `: ${item.reason}` : ""}`;
    if (item.decision === "reject") return `- ❌ **${item.label}** — Declined${item.reason ? `: ${item.reason}` : ""}`;
    return `- ⏳ **${item.label}** — Partially done${item.reason ? `: ${item.reason}` : ""}`;
  });

  return `${reason}\n\n**Item breakdown:**\n${itemLines.join("\n")}`;
}
