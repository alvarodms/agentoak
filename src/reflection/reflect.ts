import { runClaudeCode } from "../agent/claude-cli.js";
import type { ClaudeCodeResult } from "../agent/output-parser.js";
import type { ActionRecord } from "../agent/output-parser.js";
import { buildReflectionPrompt } from "../agent/prompts.js";
import { buildDynamicContext } from "../agent/prompts.js";
import { loadMemory } from "../memory/store.js";
import { logger } from "../utils/logger.js";
import type { ValidationResult } from "./validator.js";

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
  validationResult?: ValidationResult | null;
}): Promise<ReflectionResult> {
  logger.info("Starting reflection phase...");

  const memory = loadMemory();
  const dynamicContext = buildDynamicContext(memory, [], context.cycleNumber, "Reflection");
  const reflectionPrompt = buildReflectionPrompt(context);

  const model = process.env.ANTHROPIC_MODEL;
  const result = await runClaudeCode(reflectionPrompt, {
    appendSystemPrompt: dynamicContext,
    maxTurns: 10,
    tools: "Read,Write,Bash",
    model,
  });

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
