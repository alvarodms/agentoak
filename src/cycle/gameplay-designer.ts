/**
 * Gameplay Designer agent — a specialist that produces detailed, data-driven
 * gameplay specifications (trainer teams, encounters, difficulty tuning, etc.)
 * using the Pokédex MCP tools.
 *
 * Runs as Phase 1.5 between Planning and Implementation, only when the
 * Producer signals gameplay design is needed via `gameplayDesignBrief`.
 */

import { runClaudeCode } from "../agent/claude-cli.js";
import { formatPokedexToolsSection } from "../agent/prompt-sections.js";
import { logger } from "../utils/logger.js";
import type { TokenUsage } from "../memory/types.js";

export interface GameplayDesignResult {
  /** The detailed gameplay specifications (narrative text) */
  specs: string;
  /** Number of tool calls made during design */
  toolCallCount: number;
  /** Token usage for this phase */
  tokenUsage: TokenUsage;
}

const GAMEPLAY_DESIGNER_MAX_TURNS = 30;
const GAMEPLAY_DESIGNER_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Run the Gameplay Designer agent to produce detailed gameplay specs.
 *
 * The agent has access to Pokédex MCP tools and memory files (read-only)
 * to make data-driven decisions about trainer teams, encounters, etc.
 *
 * If the agent fails, the caller should fall back to the Producer's
 * original implementation plan.
 */
export async function runGameplayDesigner(
  objective: string,
  brief: string,
  implementationPlan: string,
): Promise<GameplayDesignResult> {
  const prompt = buildGameplayDesignerPrompt(objective, brief, implementationPlan);

  logger.info("[Gameplay Designer] Starting design phase...");
  logger.info(`[Gameplay Designer] Brief: ${brief.slice(0, 200)}${brief.length > 200 ? "..." : ""}`);

  const result = await runClaudeCode(prompt, {
    maxTurns: GAMEPLAY_DESIGNER_MAX_TURNS,
    timeout: GAMEPLAY_DESIGNER_TIMEOUT_MS,
    tools: "Read",
    model: process.env.ANTHROPIC_MODEL,
  });

  const specs = result.narrativeText || result.resultText || "";

  if (!specs.trim()) {
    throw new Error("Gameplay Designer produced no output");
  }

  logger.info(
    `[Gameplay Designer] Design complete: ${result.toolCallCount} tool calls, ${specs.length} chars of specs`,
  );

  return {
    specs,
    toolCallCount: result.toolCallCount,
    tokenUsage: result.tokenUsage,
  };
}

function buildGameplayDesignerPrompt(
  objective: string,
  brief: string,
  implementationPlan: string,
): string {
  return `You are the **Gameplay Designer** for a Pokémon Emerald ROM hack called Legends of Hoenn.

Your job: produce detailed, data-driven gameplay specifications based on the Producer's brief. Your output will be handed directly to an implementation agent that modifies game data files — so be precise and complete.

## Your Brief
${brief}

## Cycle Objective
${objective}

## Implementation Context
The Producer has outlined these implementation steps. Your gameplay specs will be combined with this plan:
${implementationPlan}

## Your Tools

${formatPokedexToolsSection()}

**USE THESE TOOLS.** Don't guess stats, learnsets, or type matchups — look them up. Your value is in making data-informed decisions that the Producer alone cannot make.

## Design Principles

- **Physical/Special split**: This ROM hack has implemented the modern physical/special split (Gen 4+). Each move has its own category — a move like Shadow Ball is Special and a move like Shadow Claw is Physical, regardless of type. Use the \`move_data\` tool to check whether a specific move is Physical or Special. This is critical for team design — match a Pokémon's higher attacking stat to moves of the correct category.
- **Difficulty progression**: Consider where the player is in the game. What level are their Pokémon likely to be? What TMs, items, and Pokémon are available to the player at this point?
- **Team composition**: Think about type coverage, held items, move synergy. A good team tells a story about its trainer. Gym Leaders should have a clear theme but not be one-dimensional.
- **Smogon context**: Use smogon_sets to see competitive movesets for inspiration, but adapt for in-game context (limited move access at lower levels, AI behavior, no EVs for wild encounters).
- **Player experience**: Is this fight fun? Is it fair? Does it teach the player something? Will they remember it? A great battle has tension and a moment where the player has to think.
- **Move availability**: Always check learnsets. A Pokémon can't use a move it doesn't learn by the required level. Check level-up moves specifically — TM/tutor moves are available to trainers but should be used intentionally.

## Output Format

Produce your gameplay specifications as structured text. For each element you design:

1. **State what you're designing** (e.g., "Roxanne's Team — Rustboro Gym")
2. **Provide the exact specification** — species, levels, moves, held items, abilities. Use a clear format that's easy for the implementation agent to parse.
3. **Brief justification** grounding your choices in data (e.g., "Nosepass at Lv.15 with Rock Tomb (60 BP, lowers Speed) creates an early speed control challenge. Its 135 Def / 90 SpD at base makes it tanky but beatable with Grass/Water/Fighting moves available to the player by this point.")

Be complete — the implementation agent should not need to make ANY gameplay decisions. Every species, level, move, held item, and ability should be specified.

## Memory

Read \`memory/strategy-notes.md\` for the game's creative vision and difficulty philosophy.
Read \`memory/completed-work.md\` to understand what's already been modified — avoid contradicting previous design work unless the brief explicitly asks for a redesign.`;
}
