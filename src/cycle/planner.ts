import { runClaudeCode } from "../agent/claude-cli.js";
import type { ClaudeCodeResult } from "../agent/output-parser.js";
import type { CycleMode } from "./modes.js";
import { CYCLE_MODES } from "./modes.js";
import { logger } from "../utils/logger.js";
import { getCycleModeHistorySummary } from "../memory/store.js";
import type { IssueAction, HelpRequest } from "../github/client.js";
import { shouldUseTeamPlanning, planCycleWithTeam } from "./team-planner.js";
import {
  formatJournalContext,
  buildPlannerContextSections,
  formatImplementationPlanGuidance,
  formatGameplayDesignBriefGuidance,
  formatSpriteDesignBriefGuidance,
  formatPlannerClosingInstructions,
  formatPersonalityGuidance,
} from "../agent/prompt-sections.js";

export interface CyclePlan {
  mode: CycleMode;
  objective: string;
  reasoning: string;
  implementationPlan: string;
  /** Optional brief for the Gameplay Designer agent. When set, Phase 1.5 spawns a specialist to produce detailed gameplay specs. For large tasks, the designer can internally parallelize using Agent Teams. */
  gameplayDesignBrief?: string;
  /** Optional engineering investment recommended by the Tech Lead. Captured even when the cycle's main objective is content work, so it can be persisted in the tech debt backlog for future cycles. */
  engineeringInvestment?: string;
  /** Optional creative investment identified by the Creative Visionary. Captured when a bold creative idea is deferred so it can be tracked in the creative backlog for future cycles. */
  creativeInvestment?: string;
  /** Optional brief for the Sprite Designer agent. When set, Phase 1.75 spawns a specialist to create or iterate on regional form sprites. For fresh sprites: describe the species, target typing, and aesthetic direction. For iterations: include community feedback quotes from the sprite-feedback issue. */
  spriteDesignBrief?: string;
  /** When true, indicates this sprite brief is an iteration on existing sprites (community feedback rework) rather than fresh sprite creation. Iterations run in parallel with the implementation phase instead of blocking it. */
  isSpriteIteration?: boolean;
  issueActions: IssueAction[];
  helpRequests: HelpRequest[];
}

/** JSON schema for validated structured output from the planning phase */
export const CYCLE_PLAN_SCHEMA: Record<string, unknown> = {
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
    implementationPlan: {
      type: "string",
      description: "Step-by-step implementation plan for the implementation agent. Be clear and actionable so the agent can execute without ambiguity. Describe: (1) logical actions to take in order, (2) what to read or understand first, (3) what kind of changes to make and where (describe patterns/conventions — no need to hard-code exact file paths), (4) how to verify the work is correct (e.g. run make, check a value in a specific system). Be concise but actionable — numbered steps work well.",
    },
    gameplayDesignBrief: {
      type: "string",
      description: "Optional brief for the Gameplay Designer agent. Set this when the cycle involves gameplay changes (trainer teams, wild encounters, difficulty tuning, etc.). The Gameplay Designer has access to Pokédex MCP tools and will produce detailed, data-driven specifications. When you set this, your implementationPlan should focus on implementation steps (which files to modify, patterns to follow) rather than exact gameplay values — the Gameplay Designer will provide those.",
    },
    engineeringInvestment: {
      type: "string",
      description: "Optional engineering investment opportunity identified by the Tech Lead or your own analysis. Capture it here even if this cycle focuses on content — it will be persisted in the tech debt backlog so future cycles can act on it. Examples: 'Extract wild encounter tables into a JSON config so adding species to a route is a 1-file edit instead of 3', 'Create a helper script that auto-generates species constant boilerplate'.",
    },
    creativeInvestment: {
      type: "string",
      description: "Optional creative investment opportunity identified by the Creative Visionary or your own analysis. Capture a deferred bold creative idea here — it will be persisted in the creative backlog so future cycles can act on it when prerequisites are met. Examples: 'Regional Forms for Hoenn migration species — needs sprite pipeline first', 'Route 119 thunderstorm should darken screen and play rain ambiance — needs scripted event macros'.",
    },
    spriteDesignBrief: {
      type: "string",
      description: "Optional brief for the Sprite Designer agent. Set this when the cycle involves creating or iterating on regional form sprites. The Sprite Designer has access to Pillow, the sprite fetcher MCP tool, and memory of accumulated sprite techniques. For fresh sprites: describe the base species, target typing, and aesthetic direction (e.g., 'Create Hoenn Growlithe sprites: Electric/Fire. Base: growlithe. Electric-gold palette with lightning glyph accents.'). For iterations: include community feedback quotes from the sprite-feedback GitHub issue (e.g., 'Iterate on Arcanine Hoenn sprites based on feedback: gold is too close to original orange, needs more blue-electric accents on the mane.').",
    },
    isSpriteIteration: {
      type: "boolean",
      description: "Set to true when spriteDesignBrief is an iteration on existing sprites based on community feedback (not a fresh sprite creation). Iteration work runs in parallel with the implementation phase so it doesn't block or slow down the main cycle. Only relevant when spriteDesignBrief is set.",
    },
    issueActions: {
      type: "array",
      description: "Actions to take on community issues. Only include entries for issues you reviewed.",
      items: {
        type: "object",
        properties: {
          issueNumber: { type: "number", description: "The issue number" },
          action: {
            type: "string",
            enum: ["accept", "defer", "reject", "need-info"],
            description: "What to do with the issue. For multi-item issues, use the dominant action: accept if any item is accepted, defer if all deferred, reject if all rejected.",
          },
          response: {
            type: "string",
            description: "A concise 1-3 sentence response (40 words max) to post as a comment. Be warm but direct — no preamble or filler. For multi-item issues, this is a one-sentence summary — per-item detail goes in items[].",
          },
          partial: {
            type: "boolean",
            description: "Set to true when accepting a complex issue that will require multiple cycles to fully implement. The issue will stay open and remain in the backlog so you can continue working on it next cycle. Only valid with action 'accept'. For multi-item issues, set this if ANY item is partial.",
          },
          items: {
            type: "array",
            description: "Per-item breakdown when an issue contains multiple distinct asks (bugs, feature requests, balance complaints, etc.). Each item gets its own action and response. Omit entirely for single-ask issues.",
            items: {
              type: "object",
              properties: {
                label: { type: "string", description: "Short name for this item (e.g., 'Dragon Rage damage bug')" },
                action: {
                  type: "string",
                  enum: ["accept", "defer", "reject", "need-info"],
                  description: "What to do with this specific item",
                },
                response: { type: "string", description: "One sentence (20 words max) explaining the decision for this item" },
                partial: { type: "boolean", description: "This item needs multi-cycle work" },
              },
              required: ["label", "action", "response"],
              additionalProperties: false,
            },
          },
        },
        required: ["issueNumber", "action", "response"],
        additionalProperties: false,
      },
    },
    helpRequests: {
      type: "array",
      description: "Issues to create asking the community for help. Only use when genuinely stuck or need human input.",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short title for the help request" },
          body: { type: "string", description: "Detailed description of what help is needed" },
        },
        required: ["title", "body"],
        additionalProperties: false,
      },
    },
  },
  required: ["mode", "objective", "reasoning", "implementationPlan"],
  additionalProperties: false,
};

/**
 * Parse a ClaudeCodeResult into a CyclePlan.
 * Shared by both the single planner and team planner (Producer).
 */
export function parsePlanResult(result: ClaudeCodeResult): CyclePlan {
  interface PlanJson {
    mode?: string;
    objective?: string;
    reasoning?: string;
    implementationPlan?: string;
    gameplayDesignBrief?: string;
    engineeringInvestment?: string;
    spriteDesignBrief?: string;
    isSpriteIteration?: boolean;
    issueActions?: IssueAction[];
    helpRequests?: HelpRequest[];
  }
  let parsed: PlanJson | null = null;

  // Try the resultText first (structured output via --json-schema)
  if (result.resultText) {
    try {
      parsed = JSON.parse(result.resultText) as PlanJson;
    } catch {
      // Not valid JSON
    }
  }

  // Fallback: merge ALL StructuredOutput inputs (Claude sometimes splits across multiple calls)
  if (!parsed) {
    const merged: PlanJson = {};
    for (const action of result.actions) {
      if (action.tool === "StructuredOutput" && action.input) {
        Object.assign(merged, action.input as PlanJson);
      }
    }
    if (merged.mode && merged.objective) {
      parsed = merged;
    }
  }

  // Fallback: look through action results for valid JSON
  if (!parsed) {
    for (const action of result.actions) {
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
    const issueActions = Array.isArray(parsed.issueActions) ? parsed.issueActions : [];
    const helpRequests = Array.isArray(parsed.helpRequests) ? parsed.helpRequests : [];
    if (!CYCLE_MODES[mode]) {
      logger.warn(`Invalid mode "${parsed.mode}", defaulting to research`);
      return { mode: "research", objective: parsed.objective, reasoning: parsed.reasoning, implementationPlan: parsed.implementationPlan ?? "", issueActions, helpRequests };
    }
    logger.info(`Cycle plan: [${mode}] ${parsed.objective}`);
    if (issueActions.length > 0) {
      logger.info(`  Issue actions: ${issueActions.length} (${issueActions.map(a => `#${a.issueNumber}:${a.action}`).join(", ")})`);
    }
    if (helpRequests.length > 0) {
      logger.info(`  Help requests: ${helpRequests.length}`);
    }

    const planResult: CyclePlan = {
      mode,
      objective: parsed.objective,
      reasoning: parsed.reasoning,
      implementationPlan: parsed.implementationPlan ?? "",
      gameplayDesignBrief: parsed.gameplayDesignBrief || undefined,
      engineeringInvestment: parsed.engineeringInvestment || undefined,
      spriteDesignBrief: parsed.spriteDesignBrief || undefined,
      isSpriteIteration: parsed.isSpriteIteration ?? false,
      issueActions,
      helpRequests,
    };

    logger.info(`[DONE] Final cycle plan: ${JSON.stringify(planResult, null, 2)}`);

    return planResult;
  }

  throw new Error("Could not parse structured plan from CLI output");
}

/** Use Claude Code CLI to decide what the next cycle should focus on */
export async function planCycle(
  recentJournalSummaries: string[],
  cycleNumber: number,
  issueContext: string = "",
  issueBacklog: string = "",
  staleIssues?: Array<{ issueNumber: number; title: string; deferredAtCycle: number; deferralCount?: number }>,
): Promise<CyclePlan> {
  // Dispatch to team planner if conditions are met
  if (shouldUseTeamPlanning(cycleNumber, undefined, issueContext.length > 0)) {
    logger.info("[Planning] Using team planning (multi-perspective advisory)");
    return planCycleWithTeam(recentJournalSummaries, cycleNumber, issueContext, issueBacklog, staleIssues);
  }

  logger.info("[Planning] Using single planner");
  const model = process.env.ANTHROPIC_MODEL;

  const modeHistorySummary = getCycleModeHistorySummary();
  const journalContext = formatJournalContext(recentJournalSummaries);

  const sharedContext = buildPlannerContextSections({
    cycleNumber,
    journalContext,
    modeHistorySummary,
    issueContext,
    issueBacklog,
    staleIssues,
  });

  const prompt = `You are Agent Oak's planning module. Decide what the next autonomous cycle should focus on.

Cycle ${cycleNumber} is about to start.

${sharedContext}
${formatPersonalityGuidance()}

Decide: What mode should this cycle use, and what should the objective be?

If a previous cycle had build failures and the changes were REVERTED (look for "[REVERTED" in the journal), do NOT choose "repair" — the broken code no longer exists. Instead, choose a productive mode (feature, patch, planning, etc.) and either retry the same objective with a different approach or move on to something else. Only choose "repair" if the build is currently broken with un-reverted changes still in place.


${formatImplementationPlanGuidance()}

${formatGameplayDesignBriefGuidance()}

${formatSpriteDesignBriefGuidance()}

${formatPlannerClosingInstructions()}`;

  try {
    logger.info(`-> Planner prompt:\n\n\n${prompt}\n\n\n`);

    const result = await runClaudeCode(prompt, {
      maxTurns: 50,
      timeout: 5 * 60 * 1000,
      model,
      jsonSchema: CYCLE_PLAN_SCHEMA,
    });

    logger.info(`-> Planning result:\n\n\n${JSON.stringify(result, null, 2)}\n\n\n`);

    return parsePlanResult(result);
  } catch (err) {
    throw new Error(`Planning phase failed: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
  }
}
