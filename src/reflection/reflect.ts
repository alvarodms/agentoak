import { runAgentLoop } from "../agent/claude.js";
import type { AgentLoopResult, ActionRecord } from "../agent/claude.js";
import { buildReflectionPrompt } from "../agent/prompts.js";
import { buildSystemPrompt } from "../agent/prompts.js";
import { loadMemory } from "../memory/store.js";
import { logger } from "../utils/logger.js";

export interface ReflectionResult {
  reflectionText: string;
  actions: ActionRecord[];
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number };
}

/** Run the reflection phase after the main agent loop */
export async function runReflection(context: {
  cycleNumber: number;
  objective: string;
  actions: ActionRecord[];
  filesModified: string[];
  buildResult: { success: boolean; errors: string[] } | null;
  cycleSummary: string;
}): Promise<ReflectionResult> {
  logger.info("Starting reflection phase...");

  const memory = loadMemory();
  const systemPrompt = buildSystemPrompt(memory, [], context.cycleNumber, "Reflection");
  const reflectionPrompt = buildReflectionPrompt(context);

  const result = await runAgentLoop(systemPrompt, reflectionPrompt);

  // Collect the reflection text from actions
  const reflectionText = [
    `## Reflection on Cycle ${context.cycleNumber}`,
    "",
    `**Summary**: ${result.cycleSummary || context.cycleSummary}`,
    "",
    `**Next Steps**: ${result.nextSteps || "Not specified"}`,
    "",
    "### Tool calls during reflection:",
    ...result.actions.map((a) => `- ${a.tool}: ${a.result.slice(0, 100)}`),
  ].join("\n");

  logger.info("Reflection phase complete");

  return {
    reflectionText,
    actions: result.actions,
    tokenUsage: result.tokenUsage,
  };
}
