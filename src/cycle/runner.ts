import { loadMemory } from "../memory/store.js";
import { planCycle } from "./planner.js";
import { getModeDescription } from "./modes.js";
import { buildSystemPrompt, buildCycleKickoff } from "../agent/prompts.js";
import { runAgentLoop } from "../agent/claude.js";
import { runReflection } from "../reflection/reflect.js";
import { saveBuildLog } from "../repo/build.js";
import { writeJournalEntry, getNextCycleNumber, getRecentJournalSummaries } from "../journal/writer.js";
import { commitCycle } from "../git/committer.js";
import { logger, cycleLogger } from "../utils/logger.js";

/** Run a single autonomous cycle */
export async function runCycle(): Promise<void> {
  const cycleNumber = getNextCycleNumber();
  const log = cycleLogger(cycleNumber);

  log.info("═══════════════════════════════════════════════════");
  log.info(`  Agent Oak — Cycle ${String(cycleNumber).padStart(4, "0")} starting`);
  log.info("═══════════════════════════════════════════════════");

  try {
    // 1. Load memory
    log.info("Phase 1: Loading memory...");
    const memory = loadMemory();

    // 2. Load recent journal entries for context
    log.info("Phase 2: Loading recent journals...");
    const recentJournals = getRecentJournalSummaries(3);

    // 3. Plan the cycle — ask Claude to decide mode and objective
    log.info("Phase 3: Planning cycle...");
    const plan = await planCycle(memory, recentJournals, cycleNumber);
    log.info(`Plan: [${plan.mode}] ${plan.objective}`);

    // 4. Build system prompt
    log.info("Phase 4: Building system prompt...");
    const modeDescription = getModeDescription(plan.mode);
    const systemPrompt = buildSystemPrompt(memory, recentJournals, cycleNumber, modeDescription);
    const kickoff = buildCycleKickoff(cycleNumber, plan.objective, plan.reasoning);

    // 5. Run the main agent loop
    log.info("Phase 5: Running agent loop...");
    const agentResult = await runAgentLoop(systemPrompt, kickoff);

    log.info(
      `Agent loop complete: ${agentResult.toolCallCount} tool calls, ${agentResult.filesModified.length} files modified`,
    );

    // 6. Save build log if a build was attempted
    if (agentResult.buildResult) {
      log.info("Saving build log...");
      // We need to get the full build result from the actions
      saveBuildLog(cycleNumber, {
        success: agentResult.buildResult.success,
        exitCode: agentResult.buildResult.success ? 0 : 1,
        stdout: "",
        stderr: agentResult.buildResult.errors.join("\n"),
        duration: 0,
        timestamp: new Date().toISOString(),
        errors: agentResult.buildResult.errors,
      });
    }

    // 7. Reflection phase
    log.info("Phase 6: Running reflection...");
    const reflection = await runReflection({
      cycleNumber,
      objective: plan.objective,
      actions: agentResult.actions,
      filesModified: agentResult.filesModified,
      buildResult: agentResult.buildResult,
      cycleSummary: agentResult.cycleSummary,
    });

    // Combine token usage
    const totalTokenUsage = {
      inputTokens: agentResult.tokenUsage.inputTokens + reflection.tokenUsage.inputTokens,
      outputTokens: agentResult.tokenUsage.outputTokens + reflection.tokenUsage.outputTokens,
      totalTokens: agentResult.tokenUsage.totalTokens + reflection.tokenUsage.totalTokens,
    };

    // 8. Write journal entry
    log.info("Phase 7: Writing journal entry...");
    const journalFile = writeJournalEntry({
      cycleNumber,
      mode: plan.mode,
      objective: plan.objective,
      reasoning: plan.reasoning,
      actions: [...agentResult.actions, ...reflection.actions],
      filesModified: agentResult.filesModified,
      buildResult: agentResult.buildResult,
      cycleSummary: agentResult.cycleSummary,
      nextSteps: agentResult.nextSteps,
      reflectionText: reflection.reflectionText,
      tokenUsage: totalTokenUsage,
      toolCallCount: agentResult.toolCallCount,
    });

    // 9. Git commit
    log.info("Phase 8: Committing to git...");
    const commitHash = await commitCycle(
      cycleNumber,
      agentResult.cycleSummary || plan.objective,
      agentResult.filesModified,
    );

    // Summary
    log.info("═══════════════════════════════════════════════════");
    log.info(`  Cycle ${String(cycleNumber).padStart(4, "0")} complete`);
    log.info(`  Mode: ${plan.mode}`);
    log.info(`  Objective: ${plan.objective}`);
    log.info(`  Files modified: ${agentResult.filesModified.length}`);
    log.info(`  Build: ${agentResult.buildResult ? (agentResult.buildResult.success ? "SUCCESS" : "FAILED") : "not attempted"}`);
    log.info(`  Tool calls: ${agentResult.toolCallCount}`);
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
