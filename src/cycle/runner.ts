import fs from "fs";
import path from "path";
import { loadMemory, updateCycleModeHistory } from "../memory/store.js";
import { upsertBacklogItem } from "../memory/backlog.js";
import { planCycle } from "./planner.js";
import type { CyclePlan } from "./planner.js";
import { runGameplayDesigner, GAMEPLAY_DESIGNER_TIMEOUT_MS } from "./gameplay-designer.js";
import { runSpriteDesigner, SPRITE_DESIGNER_TIMEOUT_MS, type SpriteDesignResult } from "./sprite-designer.js";
import { CYCLE_MODES, isCodingMode } from "./modes.js";
import {
  buildDynamicContext,
  buildTaskPrompt,
  buildBuildFixPrompt,
  buildValidationFixPrompt,
} from "../agent/prompts.js";
import { runClaudeCode } from "../agent/claude-cli.js";
import type { ClaudeCodeResult, IssueOutcome } from "../agent/output-parser.js";
import type { ActionRecord } from "../agent/output-parser.js";
import { runReflection } from "../reflection/reflect.js";
import { saveBuildLog } from "../repo/build.js";
import { beginGameTree, type BuildFixer, type GameTree } from "../repo/game-tree.js";
import { recordSuccessfulBuild, formatVersion, loadVersion, applyVersionBump, setReleaseStage } from "../repo/version.js";
import { writeJournalEntry, getNextCycleNumber, getRecentJournalDigests } from "../journal/writer.js";
import { commitCycle, commitJournalOnly, getStrategyNotesDiff } from "../git/committer.js";
import { validateCycle, getUnsubstantiatedIssueCompletions } from "../reflection/validator.js";
import type { ValidationResult, ValidationStatus } from "../reflection/validator.js";
import { fetchNewCommunityIssues, formatIssuesForPrompt, executeIssueActions, createHelpRequest, readIssueBacklog, updateIssueBacklog, addIssueToBacklog, getStaleBacklogIssues, postIssueClosingComment, postIssuePartialDeliveryComment, formatSpriteFeedbackForPlanner, createSpriteFeedbackIssue, postSpriteIterationUpdate } from "../github/issues.js";
import { closeIssue, addLabelsToIssue, setDecisionLabel, commentOnIssue, AGENT_LABELS, getRepoInfo } from "../github/client.js";
import type { IssueAction } from "../github/client.js";
import { cycleLogger, logger } from "../utils/logger.js";
import { PROJECT_ROOT, ARTIFACTS_DIR, MEMORY_DIR } from "../utils/paths.js";
import { createCycleRelease } from "../release/release.js";
import { EMPTY_TOKEN_USAGE, mergeTokenUsage, type TokenUsage } from "../memory/types.js";

const TECH_DEBT_BACKLOG_PATH = path.join(MEMORY_DIR, "tech-debt-backlog.md");
const CREATIVE_BACKLOG_PATH = path.join(MEMORY_DIR, "creative-backlog.md");
const SPRITE_ITERATIONS_PATH = path.join(MEMORY_DIR, "sprite-iterations.md");

const TECH_DEBT_HEADER = "# Tech Debt Backlog\n\nEngineering investment opportunities identified by the Tech Lead across cycles.\nThe Producer should review this list when planning — picking up even one item per few cycles compounds over time.\n\n| Cycle | Investment | Status |\n|-------|-----------|--------|\n";
const CREATIVE_BACKLOG_HEADER = "# Creative Backlog\n\nCreative investment opportunities identified by the Creative Visionary across cycles.\nThe Producer should review this list when planning — bold ideas that have been deferred multiple times may be ready when prerequisites are met.\n\n| Cycle | Idea | Status |\n|-------|------|--------|\n";

/**
 * Fill in the Issue column of the matching row in `memory/sprite-iterations.md`
 * after the runner creates a fresh sprite-feedback issue. The Sprite Designer
 * writes the row with `—` expecting the runner to complete it. Matches by
 * species name (case-insensitive, allowing any surrounding prefix/suffix) and
 * version. Idempotent — if no matching row is found, logs a warning and leaves
 * the file untouched.
 */
function updateSpriteIterationsIssueNumber(
  speciesName: string,
  version: number,
  issueNumber: number,
): void {
  if (!fs.existsSync(SPRITE_ITERATIONS_PATH)) {
    logger.warn(
      `sprite-iterations.md does not exist — cannot record issue #${issueNumber}`,
    );
    return;
  }
  const content = fs.readFileSync(SPRITE_ITERATIONS_PATH, "utf-8");
  const escapedSpecies = speciesName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Row shape:  | Species line | Type | vN | Cycle | Issue | Status |
  // Species line may be "Corsola Hoenn", "Hoenn Corsola", etc. — we match on
  // the base species name appearing anywhere in the first column.
  const pattern = new RegExp(
    `(\\|[^|\\n]*${escapedSpecies}[^|\\n]*\\|[^|\\n]*\\|\\s*v${version}\\s*\\|[^|\\n]*\\|\\s*)—(\\s*\\|)`,
    "i",
  );
  const updated = content.replace(pattern, `$1#${issueNumber}$2`);
  if (updated === content) {
    logger.warn(
      `Could not find sprite-iterations.md row for ${speciesName} v${version} to update with #${issueNumber}`,
    );
    return;
  }
  fs.writeFileSync(SPRITE_ITERATIONS_PATH, updated, "utf-8");
}

const MAX_VALIDATION_FIX_ATTEMPTS = 1;
const CODING_PHASE_DEFAULT_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes
const AGENT_PHASE_DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Wall-clock budget for one cycle. The GitHub job (60 minutes) also covers
 * setup and pushing, and the phase timeouts alone add up to well over an hour,
 * so phases after planning are clamped to what is left of this budget —
 * otherwise a slow cycle is killed before it writes a journal.
 */
const CYCLE_BUDGET_MS = parseInt(process.env.OAK_CYCLE_BUDGET_MINUTES ?? "45", 10) * 60 * 1000;
/** Time held back for reflection, which runs last */
const REFLECTION_RESERVE_MS = 8 * 60 * 1000;
const MIN_PHASE_TIMEOUT_MS = 3 * 60 * 1000;

/** Deadline for the current cycle; set when the cycle starts */
let cycleDeadline = Date.now() + CYCLE_BUDGET_MS;

/** A phase's timeout, clamped to the cycle budget minus `reserveMs` (never below the minimum). */
function phaseTimeout(desiredMs: number, reserveMs: number = REFLECTION_RESERVE_MS): number {
  const remaining = cycleDeadline - Date.now() - reserveMs;
  return Math.max(MIN_PHASE_TIMEOUT_MS, Math.min(desiredMs, remaining));
}

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

/** Phase 1: Planning — ask Claude to decide mode, objective, and task list */
async function runPlanningPhase(
  cycleNumber: number,
  log: ReturnType<typeof cycleLogger>,
) {
  log.info("Phase 1: Planning...");

  const memory = loadMemory();
  const recentJournals = getRecentJournalDigests(3); // used by the implementation phase

  // Only pass the single most-recent journal to the planner to keep its prompt lean.
  // The planner can read memory files on demand via its tools if it needs more context.
  const lastJournal = getRecentJournalDigests(1);

  // Fetch new community issues (silently skipped if GitHub is not configured)
  log.info("  Checking for community issues...");
  const communityIssues = await fetchNewCommunityIssues();
  const spriteFeedbackSection = await formatSpriteFeedbackForPlanner();
  const issueContext = formatIssuesForPrompt(communityIssues) + spriteFeedbackSection;
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
  // The label alone is sufficient — no comment needed.
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
  plan: CyclePlan,
  memory: ReturnType<typeof loadMemory>,
  recentJournals: string[],
  log: ReturnType<typeof cycleLogger>,
) {
  log.info("Phase 2: Implementation...");

  const isCoding = isCodingMode(plan.mode);
  const dynamicContext = isCoding ? "" : buildDynamicContext(memory, recentJournals, cycleNumber, CYCLE_MODES[plan.mode].label);
  const taskPrompt = buildTaskPrompt(
    cycleNumber,
    plan.objective,
    plan.mode,
    plan.implementationPlan,
    acceptedIssueActions(plan),
  );

  // Only route to DeepSeek for coding-focused modes; research and planning
  // require richer reasoning and stay on the Anthropic model.
  const deepSeekOverrides = isCoding
    ? buildDeepSeekOverrides()
    : undefined;
  const usingDeepSeek = !!deepSeekOverrides;
  const model = usingDeepSeek
    ? process.env.DEEPSEEK_MODEL
    : process.env.ANTHROPIC_MODEL;
  const timeout = phaseTimeout(usingDeepSeek
    ? parseInt(process.env.DEEPSEEK_API_TIMEOUT_MS ?? CODING_PHASE_DEFAULT_TIMEOUT_MS.toString(), 10)
    : AGENT_PHASE_DEFAULT_TIMEOUT_MS);
  const maxTurns = parseInt(process.env.MAX_TOOL_CALLS_PER_CYCLE ?? "100", 10);

  log.info(`  → Model profile: ${usingDeepSeek ? `DeepSeek (${model ?? "deepseek-chat"})` : `Anthropic (${model ?? "default"})`} [mode: ${plan.mode}]`);
  log.info(`  → Task: ${plan.objective}`);
  log.info(`  → Prompt: ${taskPrompt}`);
  log.info(`  → Dynamic context: ${dynamicContext}`);
  const result = await runClaudeCode(taskPrompt, {
    phase: "implementation",
    appendSystemPrompt: dynamicContext || undefined,
    maxTurns,
    model,
    timeout,
    envOverrides: deepSeekOverrides,
  });

  log.info(
    `  Implementation complete: ${result.toolCallCount} tool calls, ${result.filesModified.length} files modified`,
  );

  // The implementer ends with a plain summary rather than a CYCLE_COMPLETE marker
  return result.cycleSummary ? result : { ...result, cycleSummary: result.resultText.trim() };
}

/**
 * Phase 3: Build verification with auto-fix loop.
 *
 * The game tree builds itself, hands failures to a "fix build" agent, and
 * rolls back on its own when the build can't be fixed. A rollback to the
 * baseline reverts the cycle; a rollback to an earlier verified change set
 * keeps that work.
 */
async function runBuildVerifyPhase(
  cycleNumber: number,
  gameTree: GameTree,
  log: ReturnType<typeof cycleLogger>,
): Promise<{
  finalBuildResult: { success: boolean; errors: string[] } | null;
  fixActions: ActionRecord[];
  fixTokenUsage: TokenUsage;
  reverted: boolean;
}> {
  const fixActions: ActionRecord[] = [];
  let fixTokenUsage: TokenUsage = EMPTY_TOKEN_USAGE;

  const fixer: BuildFixer = async ({ errors, stderr, attempt }) => {
    log.info(`  Build: FAIL — running fix agent (attempt ${attempt})...`);
    const deepSeekOverrides = buildDeepSeekOverrides();
    const usingDeepSeek = deepSeekOverrides != null;
    const model = usingDeepSeek
      ? process.env.DEEPSEEK_MODEL
      : process.env.ANTHROPIC_MODEL;
    const timeout = phaseTimeout(usingDeepSeek
      ? parseInt(process.env.DEEPSEEK_API_TIMEOUT_MS ?? CODING_PHASE_DEFAULT_TIMEOUT_MS.toString(), 10)
      : AGENT_PHASE_DEFAULT_TIMEOUT_MS);
    const fixResult = await runClaudeCode(buildBuildFixPrompt(cycleNumber, errors, stderr), {
      phase: "build-fix",
      maxTurns: 15,
      tools: "Bash,Read,Edit,Write,Grep",
      model,
      timeout,
      envOverrides: deepSeekOverrides,
    });
    fixActions.push(...fixResult.actions);
    fixTokenUsage = mergeTokenUsage(fixTokenUsage, fixResult.tokenUsage);
  };

  log.info("Phase 3: Build verification...");
  const outcome = await gameTree.verify(fixer);

  if (outcome.status === "unchanged") {
    log.info("  No game-tree changes since the last verification — skipping build.");
    return { finalBuildResult: null, fixActions, fixTokenUsage, reverted: false };
  }

  saveBuildLog(cycleNumber, outcome.build);

  if (outcome.status === "verified") {
    log.info(`  Build: PASS${outcome.fixAttempts > 0 ? ` (fixed on attempt ${outcome.fixAttempts})` : ""}`);
    return { finalBuildResult: { success: true, errors: [] }, fixActions, fixTokenUsage, reverted: false };
  }

  if (outcome.rolledBackTo === "verified") {
    log.warn(
      `  Build: FAIL after ${outcome.fixAttempts} fix attempts — rolled back to the last verified change set.`,
    );
    return { finalBuildResult: { success: true, errors: [] }, fixActions, fixTokenUsage, reverted: false };
  }

  log.warn(`  Build: FAIL after ${outcome.fixAttempts} fix attempts — rolled back to the baseline.`);
  return {
    finalBuildResult: { success: false, errors: outcome.build.errors },
    fixActions,
    fixTokenUsage,
    reverted: true,
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
  gameTree: GameTree,
  log: ReturnType<typeof cycleLogger>,
): Promise<{
  updatedImplResult: ClaudeCodeResult;
  finalValidationResult: ValidationResult;
  buildResult: { success: boolean; errors: string[] } | null;
  fixActions: ActionRecord[];
  fixTokenUsage: TokenUsage;
  reverted: boolean;
}> {
  const fixActions: ActionRecord[] = [];
  let fixTokenUsage: TokenUsage = EMPTY_TOKEN_USAGE;
  let currentImplResult = implResult;
  let currentValidation = validationResult;
  let buildResult: { success: boolean; errors: string[] } | null = null;
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
    const timeout = phaseTimeout(usingDeepSeek
      ? parseInt(process.env.DEEPSEEK_API_TIMEOUT_MS ?? CODING_PHASE_DEFAULT_TIMEOUT_MS.toString(), 10)
      : AGENT_PHASE_DEFAULT_TIMEOUT_MS);

    const fixResult = await runClaudeCode(fixPrompt, {
      phase: "validation-fix",
      maxTurns: 30,
      model,
      timeout,
      envOverrides: deepSeekOverrides,
    });
    fixActions.push(...fixResult.actions);
    fixTokenUsage = mergeTokenUsage(fixTokenUsage, fixResult.tokenUsage);

    // Merge files the agents reported (deduplicated) — for prompts and the journal
    const mergedFiles = [...new Set([...currentImplResult.filesModified, ...fixResult.filesModified])];
    currentImplResult = { ...currentImplResult, filesModified: mergedFiles };

    // Re-verify the game tree; skipped if the fix agent didn't change it
    const buildVerify = await runBuildVerifyPhase(cycleNumber, gameTree, log);
    fixActions.push(...buildVerify.fixActions);
    fixTokenUsage = mergeTokenUsage(fixTokenUsage, buildVerify.fixTokenUsage);
    if (buildVerify.finalBuildResult) {
      buildResult = buildVerify.finalBuildResult;
    }

    if (buildVerify.reverted) {
      reverted = true;
      // Build fix exhausted and rolled back to the baseline — no point re-validating
      break;
    }

    // Re-validate
    if (!reverted) {
      currentValidation = validateCycle({
        mode: plan.mode as Parameters<typeof validateCycle>[0]["mode"],
        objective: plan.objective,
        implResult: currentImplResult,
        changeSet: await gameTree.changeSet(),
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
  };
}

/**
 * Phase 4: Reflection — a fresh agent context analyzes what happened during
 * the cycle and updates memory.
 */
async function runReflectionPhase(
  cycleNumber: number,
  plan: CyclePlan,
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
    acceptedIssues: acceptedIssueActions(plan),
    timeout: phaseTimeout(AGENT_PHASE_DEFAULT_TIMEOUT_MS, 0),
  });
}

/** The planner's accept actions — the issues this cycle's reflection reports outcomes for */
function acceptedIssueActions(plan: CyclePlan): IssueAction[] {
  return plan.issueActions.filter((a) => a.action === "accept");
}

/**
 * Phase 5 helper: commit with a fallback commit guarantee.
 *
 * The game tree has already staged its verified change set. If the commit
 * still fails, fall back to a journal-only commit so the cycle is recorded.
 */
async function runCommitPhase(params: {
  cycleNumber: number;
  summary: string;
  acceptedIssueNumbers: number[];
  log: ReturnType<typeof cycleLogger>;
}): Promise<{ commitHash: string | null; commitFailed: boolean }> {
  const { cycleNumber, summary, acceptedIssueNumbers, log } = params;

  const commitResult = await commitCycle(cycleNumber, summary, acceptedIssueNumbers);
  if (commitResult.success) {
    return { commitHash: commitResult.hash, commitFailed: false };
  }

  log.error(
    `  Commit: FAIL (${commitResult.reason}: ${commitResult.message}) — trying fallback journal commit...`,
  );
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
  cycleDeadline = Date.now() + CYCLE_BUDGET_MS;

  log.info("═══════════════════════════════════════════════════");
  log.info(`  Agent Oak — Cycle ${String(cycleNumber).padStart(4, "0")} starting`);
  log.info("═══════════════════════════════════════════════════");

  // Hoisted so the catch block can suppress unhandled rejections on crash
  let spriteIterationPromise: Promise<SpriteDesignResult> | null = null;
  // Hoisted so the catch block can roll the game tree back on crash
  let gameTree: GameTree | null = null;

  try {
    // Start the game tree from its baseline; leftovers from a crashed attempt are stashed
    gameTree = await beginGameTree({
      repoRoot: PROJECT_ROOT,
      label: `cycle ${String(cycleNumber).padStart(4, "0")}`,
    });
    if (gameTree.setAside.length > 0) {
      log.warn(`Set aside ${gameTree.setAside.length} leftover game-tree change(s) in a git stash before starting.`);
    }

    // ── Phase 1: Planning (separate agent context) ──
    const { memory, recentJournals, plan } = await runPlanningPhase(cycleNumber, log);

    // Record the chosen mode in history so future planners can see the pattern
    updateCycleModeHistory(plan.mode);

    // Persist any engineering investment to the tech debt backlog
    if (plan.engineeringInvestment) {
      upsertBacklogItem(TECH_DEBT_BACKLOG_PATH, TECH_DEBT_HEADER, cycleNumber, plan.engineeringInvestment);
      log.info(`  Engineering investment captured: ${plan.engineeringInvestment.slice(0, 100)}...`);
    }

    // Persist any creative investment to the creative backlog
    if (plan.creativeInvestment) {
      upsertBacklogItem(CREATIVE_BACKLOG_PATH, CREATIVE_BACKLOG_HEADER, cycleNumber, plan.creativeInvestment);
      log.info(`  Creative investment captured: ${plan.creativeInvestment.slice(0, 100)}...`);
    }

    // ── Phase 1.5: Gameplay Design (conditional — only when Producer sets a brief) ──
    let activePlan: CyclePlan = plan;
    let gameplayDesignTokenUsage: TokenUsage = EMPTY_TOKEN_USAGE;

    if (plan.gameplayDesignBrief) {
      log.info("Phase 1.5: Gameplay Design...");
      try {
        const designResult = await runGameplayDesigner(
          plan.objective,
          plan.gameplayDesignBrief,
          plan.implementationPlan,
          { timeout: phaseTimeout(GAMEPLAY_DESIGNER_TIMEOUT_MS) },
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

    // ── Phase 1.75: Sprite Design (conditional — only when Producer sets a sprite brief) ──
    let spriteResult: SpriteDesignResult | null = null;
    let spriteDesignTokenUsage: TokenUsage = EMPTY_TOKEN_USAGE;

    if (activePlan.spriteDesignBrief) {
      if (activePlan.isSpriteIteration) {
        // ITERATION: Launch sprite designer in parallel — don't block implementation.
        // The species is already registered; iteration only overwrites existing PNGs/PALs.
        log.info("Phase 1.75: Sprite Iteration (launching in parallel with implementation)...");
        spriteIterationPromise = runSpriteDesigner(
          activePlan.objective,
          activePlan.spriteDesignBrief,
          activePlan.implementationPlan,
          { timeout: phaseTimeout(SPRITE_DESIGNER_TIMEOUT_MS) },
        );
        // Don't await — continues to Phase 2 immediately
      } else {
        // FRESH: Run sequentially — implementation needs the sprite report
        log.info("Phase 1.75: Sprite Design (fresh)...");
        try {
          spriteResult = await runSpriteDesigner(
            activePlan.objective,
            activePlan.spriteDesignBrief,
            activePlan.implementationPlan,
            { timeout: phaseTimeout(SPRITE_DESIGNER_TIMEOUT_MS) },
          );
          activePlan = {
            ...activePlan,
            implementationPlan: `${activePlan.implementationPlan}\n\n## Sprite Design Report (from Sprite Designer)\n\n${spriteResult.spriteReport}\n\nFiles created/modified:\n${spriteResult.filesCreated.map(f => `- ${f}`).join("\n")}`,
          };
          spriteDesignTokenUsage = spriteResult.tokenUsage;
          log.info(`  Sprite design complete: ${spriteResult.toolCallCount} tool calls, ${spriteResult.filesCreated.length} files`);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          log.warn(`  Sprite Designer failed, proceeding with placeholder approach: ${errMsg}`);
          // Fall through — implementation agent can copy sprites from base species as fallback
        }
      }
    }

    // ── Phase 2: Implementation (separate agent context) ──
    // (runs concurrently with sprite iteration if one was launched above)
    let implResult = await runImplementationPhase(
      cycleNumber,
      activePlan,
      memory,
      recentJournals,
      log,
    );

    // ── Collect parallel sprite iteration result (if launched) ──
    if (spriteIterationPromise) {
      log.info("  Collecting parallel sprite iteration result...");
      try {
        spriteResult = await spriteIterationPromise;
        spriteDesignTokenUsage = spriteResult.tokenUsage;
        log.info(`  Sprite iteration complete: ${spriteResult.toolCallCount} tool calls, ${spriteResult.filesCreated.length} files`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        log.warn(`  Sprite iteration (parallel) failed, continuing without sprite changes: ${errMsg}`);
        // spriteResult stays null — Phase 3.6 will be skipped, main cycle unaffected
      }
    }

    // ── Phase 3: Build verification + auto-fix loop ──
    let {
      finalBuildResult,
      fixActions,
      fixTokenUsage,
      reverted,
    } = await runBuildVerifyPhase(cycleNumber, gameTree, log);

    // ── Phase 3.5: Validation — programmatic claim cross-check ──
    let validationResult: ValidationResult | null = null;
    let validationFixActions: ActionRecord[] = [];
    let validationFixTokenUsage: TokenUsage = EMPTY_TOKEN_USAGE;

    if (!reverted) {
      log.info("Phase 3.5: Validating implementation claims...");
      validationResult = validateCycle({
        mode: plan.mode,
        objective: plan.objective,
        implResult,
        changeSet: await gameTree.changeSet(),
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
          gameTree,
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
      plan.tokenUsage ?? EMPTY_TOKEN_USAGE,
      gameplayDesignTokenUsage,
      spriteDesignTokenUsage,
      implResult.tokenUsage,
      fixTokenUsage,
      validationFixTokenUsage,
      reflection.tokenUsage,
    );

    const filesModified = reverted ? [] : implResult.filesModified;

    // Stage exactly the verified change set; edits made after verification
    // (e.g. during reflection) are restored and listed in the journal.
    const { staged: stagedGameFiles, discarded: discardedChanges } = await gameTree.stage();
    if (discardedChanges.length > 0) {
      log.warn(`  Discarded ${discardedChanges.length} game-tree change(s) made after verification.`);
    }

    // Stamp the build number once, on the cycle's final verdict
    const gameVersion = stagedGameFiles.length > 0
      ? formatVersion(recordSuccessfulBuild(cycleNumber))
      : null;

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
      discardedChanges,
    });

    // Apply agent-declared version bump / release stage before committing
    // so that the updated version.json is included in the commit and persists
    // across cycles (fixes minor version being lost after a bump).
    // Reflection owns the CYCLE_COMPLETE marker; an implementer that still
    // emits one is honoured only when reflection leaves the field out.
    const versionBump = reflection.versionBump ?? implResult.versionBump;
    const releaseStage = reflection.releaseStage ?? implResult.releaseStage;
    if (gameVersion && !reverted) {
      if (versionBump) {
        log.info(`Phase 5: Applying version bump (${versionBump}) declared by agent...`);
        applyVersionBump(versionBump, releaseStage);
      } else if (releaseStage) {
        log.info(`Phase 5: Setting release stage to "${releaseStage}" declared by agent...`);
        setReleaseStage(releaseStage);
      }
    }

    log.info("Phase 5: Committing to git...");
    const acceptedIssueNumbers = plan.issueActions
      .filter(a => a.action === "accept")
      .map(a => a.issueNumber);
    const { commitHash, commitFailed } = await runCommitPhase({
      cycleNumber,
      summary: reflection.cycleSummary || plan.objective,
      acceptedIssueNumbers,
      log,
    });

    if (commitFailed) {
      log.error("CRITICAL: Cycle completed without producing a git commit.");
      process.exitCode = 1;
    }

    // ── Phase 3.6 (post-commit): Sprite Feedback Issue ──
    // Posted after commit so we can use SHA-pinned image URLs that resolve
    // once the CI push lands. Failures are logged as warnings — we never
    // let issue-creation errors fail the cycle.
    if (spriteResult && !reverted && finalBuildResult?.success && commitHash) {
      if (!spriteResult.metadata) {
        log.warn(
          "  ⚠ Phase 3.6: Sprite Designer ran and build succeeded, but no sprite-metadata block was parsed — cannot post feedback issue. Fix the Sprite Designer output or backfill manually.",
        );
      } else {
        const meta = spriteResult.metadata;
        const imagePaths = spriteResult.filesCreated.filter(
          (f) => f.includes("graphics/pokemon/") && f.endsWith(".png"),
        );
        const repoInfo = getRepoInfo();
        const repoSlug = repoInfo ? `${repoInfo.owner}/${repoInfo.repo}` : undefined;
        log.info("Phase 3.6: Posting sprite feedback issue...");
        try {
          if (meta.isIteration && meta.existingIssueNumber) {
            await postSpriteIterationUpdate(
              meta.existingIssueNumber,
              spriteResult.spriteReport,
              imagePaths,
              meta.version,
              repoSlug,
              commitHash,
            );
            log.info(
              `  Posted sprite iteration v${meta.version} to #${meta.existingIssueNumber}`,
            );
          } else {
            const issueNumber = await createSpriteFeedbackIssue(
              meta.speciesName,
              meta.typing,
              spriteResult.spriteReport,
              imagePaths,
              meta.version,
              repoSlug,
              commitHash,
            );
            if (issueNumber) {
              updateSpriteIterationsIssueNumber(
                meta.speciesName,
                meta.version,
                issueNumber,
              );
              log.info(
                `  Created sprite-feedback issue #${issueNumber} for ${meta.speciesName} v${meta.version}`,
              );
            } else {
              log.warn(
                "  createSpriteFeedbackIssue returned null — issue may not have been created",
              );
            }
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          log.warn(
            `  Sprite feedback issue creation failed, continuing: ${errMsg}`,
          );
        }
      }
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
      const issueOutcomes = reflection.issueOutcomes.length > 0
        ? reflection.issueOutcomes
        : implResult.issueOutcomes;

      // Guard: if validation found the cycle unsubstantiated, do NOT close any
      // issues the agent claims are "complete" — the work likely wasn't done.
      const unsubstantiatedIssues = new Set(
        validationResult
          ? getUnsubstantiatedIssueCompletions(validationResult, issueOutcomes)
          : [],
      );
      if (unsubstantiatedIssues.size > 0) {
        log.warn(
          `  ⚠ Skipping closure of ${unsubstantiatedIssues.size} issue(s) with unsubstantiated completion claims: ` +
          `${[...unsubstantiatedIssues].map((n) => `#${n}`).join(", ")}`,
        );
      }

      // Issues the planner explicitly flagged as multi-cycle at planning time
      const plannedPartialNumbers = new Set(
        plan.issueActions
          .filter((a) => a.action === "accept" && a.partial)
          .map((a) => a.issueNumber),
      );

      // Post-implementation outcomes reported in the CYCLE_COMPLETE marker
      const outcomeMap = new Map(
        issueOutcomes.map((o) => [o.number, o]),
      );

      const closingNumbers: number[] = [];
      const deferNumbers: number[] = [];
      const rejectNumbers: number[] = [];

      for (const issueNumber of acceptedIssueNumbers) {
        if (plannedPartialNumbers.has(issueNumber)) {
          // Already handled as a planned multi-cycle issue — leave open, skip.
          continue;
        }
        // Skip issues with unsubstantiated completion claims
        if (unsubstantiatedIssues.has(issueNumber)) {
          deferNumbers.push(issueNumber);
          continue;
        }
        const outcome = outcomeMap.get(issueNumber);
        if (!outcome) {
          // No outcome reported — never assume delivery. Closing here is how
          // #178 was closed with nothing shipped.
          log.warn(`  ⚠ No outcome reported for accepted issue #${issueNumber} — keeping it open`);
          deferNumbers.push(issueNumber);
        } else if (outcome.status === "partial") {
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
          // status="complete" — fully delivered.
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
          const outcome = outcomeMap.get(issueNumber);
          const reason = outcome
            ? outcome.reason ?? "This cycle's work partially addressed this issue."
            : "This cycle's report didn't confirm that this issue was delivered, so I'm keeping it open rather than closing it prematurely.";
          const partialComment = outcome ? formatPartialCommentWithItems(reason, outcome) : reason;
          await postIssuePartialDeliveryComment(issueNumber, partialComment, "defer");
          await setDecisionLabel(issueNumber, AGENT_LABELS.deferred);
          // Re-add to backlog with remaining items tracked
          const remainingItems = outcome ? resolveMultiItemOutcome(outcome).remainingItems : [];
          addIssueToBacklog(
            issueNumber,
            `Issue #${issueNumber}`,
            cycleNumber,
            remainingItems.length > 0 ? remainingItems : undefined,
          );
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
          await setDecisionLabel(issueNumber, AGENT_LABELS.rejected);
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
    // Suppress unhandled rejection from any in-flight sprite iteration
    spriteIterationPromise?.catch(() => {});

    log.error(`Cycle failed with error: ${err instanceof Error ? err.message : String(err)}`);
    if (err instanceof Error && err.stack) {
      log.error(err.stack);
    }

    // A crash reverts the cycle, even if a verified change set existed (ADR 0001)
    try {
      await gameTree?.discard();
    } catch (discardErr) {
      log.error(`Failed to roll back the game tree: ${discardErr instanceof Error ? discardErr.message : String(discardErr)}`);
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
        tokenUsage: EMPTY_TOKEN_USAGE,
        toolCallCount: 0,
      });
      const crashCommit = await commitCycle(cycleNumber, "cycle crashed");
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
