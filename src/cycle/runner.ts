import { loadMemory } from "../memory/store.js";
import { planCycle } from "./planner.js";
import { getModeDescription } from "./modes.js";
import { buildSystemPrompt, buildTaskPrompt, buildBuildFixPrompt } from "../agent/prompts.js";
import { runAgentLoop } from "../agent/claude.js";
import type { AgentLoopResult, ActionRecord } from "../agent/claude.js";
import { runReflection } from "../reflection/reflect.js";
import { runBuild, saveBuildLog } from "../repo/build.js";
import { writeJournalEntry, getNextCycleNumber, getRecentJournalSummaries } from "../journal/writer.js";
import { commitCycle, getHeadSha, revertPokeemerald } from "../git/committer.js";
import { logger, cycleLogger } from "../utils/logger.js";
import type { TokenUsage } from "../memory/types.js";

const MAX_BUILD_FIX_ATTEMPTS = 3;

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
  const recentJournals = getRecentJournalSummaries(3);
  const plan = await planCycle(memory, recentJournals, cycleNumber);
  log.info(`Plan: [${plan.mode}] ${plan.objective}`);

  return { memory, recentJournals, plan };
}

/**
 * Phase 2: Implementation — run the planned task in a separate agent context
 * with its own system prompt and fresh conversation.
 */
async function runImplementationPhase(
  cycleNumber: number,
  plan: { mode: string; objective: string; reasoning: string },
  memory: ReturnType<typeof loadMemory>,
  recentJournals: string[],
  log: ReturnType<typeof cycleLogger>,
) {
  log.info("Phase 2: Implementation...");

  const modeDescription = getModeDescription(plan.mode as Parameters<typeof getModeDescription>[0]);
  const systemPrompt = buildSystemPrompt(memory, recentJournals, cycleNumber, modeDescription);
  const taskPrompt = buildTaskPrompt(cycleNumber, plan.objective, plan.reasoning, plan.mode);

  log.info(`  → Task: ${plan.objective}`);
  const result = await runAgentLoop(systemPrompt, taskPrompt);

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
  implResult: AgentLoopResult,
  sessionStartSha: string,
  memory: ReturnType<typeof loadMemory>,
  recentJournals: string[],
  log: ReturnType<typeof cycleLogger>,
): Promise<{
  finalBuildResult: { success: boolean; errors: string[] } | null;
  fixActions: ActionRecord[];
  fixTokenUsage: TokenUsage;
  reverted: boolean;
}> {
  const fixActions: ActionRecord[] = [];
  let fixTokenUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

  // No files modified — skip build verification
  if (implResult.filesModified.length === 0) {
    log.info("Phase 3: No files modified — skipping build verification.");
    return {
      finalBuildResult: implResult.buildResult,
      fixActions,
      fixTokenUsage,
      reverted: false,
    };
  }

  log.info("Phase 3: Build verification...");
  let buildResult = runBuild();
  saveBuildLog(cycleNumber, buildResult);

  if (buildResult.success) {
    log.info("  Build: PASS");
    return {
      finalBuildResult: { success: true, errors: [] },
      fixActions,
      fixTokenUsage,
      reverted: false,
    };
  }

  // Build failed — enter fix loop
  for (let attempt = 1; attempt <= MAX_BUILD_FIX_ATTEMPTS; attempt++) {
    log.info(`  Build: FAIL — running fix agent (attempt ${attempt}/${MAX_BUILD_FIX_ATTEMPTS})...`);

    const modeDescription = getModeDescription("repair");
    const fixSystemPrompt = buildSystemPrompt(memory, recentJournals, cycleNumber, modeDescription);
    const fixPrompt = buildBuildFixPrompt(cycleNumber, buildResult.errors, buildResult.stderr);

    const fixResult = await runAgentLoop(fixSystemPrompt, fixPrompt);
    fixActions.push(...fixResult.actions);
    fixTokenUsage = mergeTokenUsage(fixTokenUsage, fixResult.tokenUsage);

    // Re-run build to check if fix worked
    buildResult = runBuild();
    saveBuildLog(cycleNumber, buildResult);

    if (buildResult.success) {
      log.info(`  Build: PASS (fixed on attempt ${attempt})`);
      return {
        finalBuildResult: { success: true, errors: [] },
        fixActions,
        fixTokenUsage,
        reverted: false,
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
  };
}

/**
 * Phase 4: Reflection — a fresh agent context analyzes what happened during
 * the cycle and updates memory.
 */
async function runReflectionPhase(
  cycleNumber: number,
  plan: { mode: string; objective: string },
  implResult: AgentLoopResult,
  buildResult: { success: boolean; errors: string[] } | null,
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
  });
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
    } = await runBuildVerifyPhase(
      cycleNumber,
      implResult,
      sessionStartSha,
      memory,
      recentJournals,
      log,
    );

    // ── Phase 4: Reflection (separate agent context) ──
    const reflection = await runReflectionPhase(
      cycleNumber,
      plan,
      implResult,
      finalBuildResult,
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
      cycleSummary: implResult.cycleSummary + (reverted ? " [REVERTED: build could not be fixed]" : ""),
      nextSteps: implResult.nextSteps,
      reflectionText: reflection.reflectionText,
      tokenUsage: totalTokenUsage,
      toolCallCount: implResult.toolCallCount + fixActions.length,
    });

    log.info("Phase 5: Committing to git...");
    const commitHash = await commitCycle(
      cycleNumber,
      implResult.cycleSummary || plan.objective,
      filesModified,
    );

    // Summary
    log.info("═══════════════════════════════════════════════════");
    log.info(`  Cycle ${String(cycleNumber).padStart(4, "0")} complete`);
    log.info(`  Mode: ${plan.mode}`);
    log.info(`  Objective: ${plan.objective}`);
    log.info(`  Files modified: ${filesModified.length}${reverted ? " (reverted)" : ""}`);
    log.info(`  Build: ${finalBuildResult ? (finalBuildResult.success ? "SUCCESS" : "FAILED") : "not attempted"}`);
    log.info(`  Tool calls: ${implResult.toolCallCount}`);
    log.info(`  Tokens: ${totalTokenUsage.totalTokens.toLocaleString()}`);
    log.info(`  Journal: ${journalFile}`);
    log.info(`  Commit: ${commitHash ?? "none"}`);
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
      await commitCycle(cycleNumber, "cycle crashed", []);
    } catch {
      log.error("Failed to write crash journal entry");
    }

    throw err;
  }
}
