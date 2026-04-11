import { runClaudeCode } from "../agent/claude-cli.js";
import type { ClaudeCodeResult } from "../agent/output-parser.js";
import type { ActionRecord } from "../agent/output-parser.js";
import { buildReflectionPrompt } from "../agent/prompts.js";
import { buildDynamicContext } from "../agent/prompts.js";
import { loadMemory } from "../memory/store.js";
import { logger } from "../utils/logger.js";
import type { ValidationResult } from "./validator.js";
import type { SpriteFeedbackOutcome } from "../cycle/runner.js";

export interface ReflectionResult {
  reflectionText: string;
  cycleSummary: string;
  /** Structured changelog entries from CYCLE_COMPLETE changes[] field */
  cycleChanges: string[];
  nextSteps: string;
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
  cycleChanges: string[];
  validationResult?: ValidationResult | null;
  spriteFeedbackOutcome?: SpriteFeedbackOutcome | null;
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

  // Use the narrative text the reflection agent actually wrote (before its CYCLE_COMPLETE marker).
  // This captures the substantive "what did I learn / what should I try next" content
  // rather than duplicating the summary or dumping raw tool call outputs.
  const narrative = result.narrativeText?.trim() || "";
  const reflectionText = narrative
    ? `## Reflection on Cycle ${context.cycleNumber}\n\n${narrative}`
    : `## Reflection on Cycle ${context.cycleNumber}\n\n*No reflection narrative generated.*`;

  logger.info("Reflection phase complete");

  return {
    reflectionText,
    cycleSummary: result.cycleSummary || context.cycleSummary,
    cycleChanges: result.cycleChanges.length > 0 ? result.cycleChanges : context.cycleChanges,
    nextSteps: result.nextSteps,
    actions: result.actions,
    tokenUsage: result.tokenUsage,
  };
}
