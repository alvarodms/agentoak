import Anthropic from "@anthropic-ai/sdk";
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

/** Use Claude to decide what the next cycle should focus on */
export async function planCycle(
  memory: Memory,
  recentJournalSummaries: string[],
  cycleNumber: number,
): Promise<CyclePlan> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
  const client = new Anthropic({ apiKey });

  const memorySummary = getMemorySummary(memory);
  const journalContext =
    recentJournalSummaries.length > 0
      ? recentJournalSummaries.join("\n\n---\n\n")
      : "No previous cycles. This is the very first cycle.";

  const modeList = Object.values(CYCLE_MODES)
    .map((m) => `- **${m.name}**: ${m.description}`)
    .join("\n");

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    system:
      "You are Agent Oak's planning module. You decide what the next autonomous cycle should focus on. Respond ONLY with valid JSON.",
    messages: [
      {
        role: "user",
        content: `Cycle ${cycleNumber} is about to start.

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

Respond with JSON:
{
  "mode": "research|patch|repair|refactor|feature|planning",
  "objective": "Clear one-sentence description of what to do this cycle",
  "reasoning": "Why this mode and objective make sense right now"
}`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";

  try {
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[0]) as { mode: string; objective: string; reasoning: string };

    // Validate mode
    const mode = parsed.mode as CycleMode;
    if (!CYCLE_MODES[mode]) {
      logger.warn(`Invalid mode "${parsed.mode}", defaulting to research`);
      return { mode: "research", objective: parsed.objective, reasoning: parsed.reasoning };
    }

    logger.info(`Cycle plan: [${mode}] ${parsed.objective}`);
    return { mode, objective: parsed.objective, reasoning: parsed.reasoning };
  } catch (err) {
    logger.warn(`Failed to parse cycle plan, defaulting to research: ${err}`);
    return {
      mode: "research",
      objective: "Explore the pokeemerald codebase and understand its structure",
      reasoning: "Default fallback — planning failed, so defaulting to safe exploration.",
    };
  }
}
