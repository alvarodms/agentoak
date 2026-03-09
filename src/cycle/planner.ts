import { runClaudeCode } from "../agent/claude-cli.js";
import type { Memory } from "../memory/types.js";
import type { CycleMode } from "./modes.js";
import { CYCLE_MODES } from "./modes.js";
import { logger } from "../utils/logger.js";
import { getMemorySummary } from "../memory/store.js";

export interface CyclePlan {
  mode: CycleMode;
  objective: string;
  reasoning: string;
}

/** JSON schema for validated structured output from the planning phase */
const CYCLE_PLAN_SCHEMA = {
  type: "object",
  properties: {
    mode: {
      type: "string",
      enum: ["research", "patch", "repair", "refactor", "feature", "planning"],
      description: "The cycle mode to use.",
    },
    objective: {
      type: "string",
      description: "Clear one-sentence description of what to do this cycle.",
    },
    reasoning: {
      type: "string",
      description: "Why this mode and objective make sense right now.",
    },
  },
  required: ["mode", "objective", "reasoning"],
  additionalProperties: false,
};

/** Use Claude Code CLI to decide what the next cycle should focus on */
export async function planCycle(
  memory: Memory,
  recentJournalSummaries: string[],
  cycleNumber: number,
): Promise<CyclePlan> {
  const model = process.env.ANTHROPIC_MODEL;

  const memorySummary = getMemorySummary(memory);
  const journalContext =
    recentJournalSummaries.length > 0
      ? recentJournalSummaries.join("\n\n---\n\n")
      : "No previous cycles. This is the very first cycle.";

  const modeList = Object.values(CYCLE_MODES)
    .map((m) => `- **${m.name}**: ${m.description}`)
    .join("\n");

  const prompt = `You are Agent Oak's planning module. Decide what the next autonomous cycle should focus on.

Cycle ${cycleNumber} is about to start.

## Current Memory
${memorySummary}

## Recent Cycles
${journalContext}

## Available Modes
${modeList}

Decide: What mode should this cycle use, and what should the objective be?

For early cycles (1–5), prefer "research" or "planning" to build up knowledge.
If previous cycles had build failures, consider "repair".
Choose freely based on what seems most valuable given the current state.

Respond with a JSON object containing mode, objective, and reasoning.`;

  try {
    const result = await runClaudeCode(prompt, {
      maxTurns: 10,
      timeout: 2 * 60 * 1000,
      model,
      jsonSchema: CYCLE_PLAN_SCHEMA,
    });

    console.log('Planning result:', result);

    // With --json-schema, the structured JSON is in the result message's result field
    interface PlanJson { mode?: string; objective?: string; reasoning?: string }
    let parsed: PlanJson | null = null;

    // Try the resultText first (structured output via --json-schema)
    if (result.resultText) {
      try {
        parsed = JSON.parse(result.resultText) as PlanJson;
      } catch {
        // Not valid JSON
      }
    }

    // Fallback: look through action results for valid JSON
    if (!parsed) {
      for (const action of result.actions) {
        // Check StructuredOutput tool input directly (contains the plan object)
        if (action.tool === "StructuredOutput" && action.input) {
          const candidate = action.input as PlanJson;
          if (candidate?.mode && candidate?.objective) {
            parsed = candidate;
            break;
          }
        }
        if (action.result) {
          try {
            const candidate = JSON.parse(action.result) as PlanJson;
            if (candidate?.mode && candidate?.objective) {
              parsed = candidate;
              break;
            }
          } catch {
            // Not JSON, continue
          }
        }
      }
    }

    // Fallback: try cycleSummary
    if (!parsed && result.cycleSummary) {
      try {
        parsed = JSON.parse(result.cycleSummary) as PlanJson;
      } catch {
        // Not JSON
      }
    }

    if (parsed?.mode && parsed?.objective && parsed?.reasoning) {
      const mode = parsed.mode as CycleMode;
      if (!CYCLE_MODES[mode]) {
        logger.warn(`Invalid mode "${parsed.mode}", defaulting to research`);
        return { mode: "research", objective: parsed.objective, reasoning: parsed.reasoning };
      }
      logger.info(`Cycle plan: [${mode}] ${parsed.objective}`);
      return { mode, objective: parsed.objective, reasoning: parsed.reasoning };
    }

    logger.warn("Could not parse structured plan from CLI output, using fallback");
  } catch (err) {
    logger.warn(`Planning phase failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  return {
    mode: "research",
    objective: "Explore the pokeemerald codebase and understand its structure",
    reasoning: "Default fallback — planner could not produce a structured plan.",
  };
}
