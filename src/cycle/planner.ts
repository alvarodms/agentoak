import { runClaudeCode } from "../agent/claude-cli.js";
import type { ClaudeCodeResult } from "../agent/output-parser.js";
import type { CycleMode } from "./modes.js";
import { CYCLE_MODES } from "./modes.js";
import { logger } from "../utils/logger.js";
import { getCycleModeHistorySummary } from "../memory/store.js";
import type { IssueAction, HelpRequest } from "../github/client.js";
import { shouldUseTeamPlanning, planCycleWithTeam } from "./team-planner.js";

export interface CyclePlan {
  mode: CycleMode;
  objective: string;
  reasoning: string;
  implementationPlan: string;
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
            description: "What to do with the issue",
          },
          response: {
            type: "string",
            description: "A brief, friendly response to post as a comment on the issue",
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
    return { mode, objective: parsed.objective, reasoning: parsed.reasoning, implementationPlan: parsed.implementationPlan ?? "", issueActions, helpRequests };
  }

  throw new Error("Could not parse structured plan from CLI output");
}

/** Use Claude Code CLI to decide what the next cycle should focus on */
export async function planCycle(
  recentJournalSummaries: string[],
  cycleNumber: number,
  issueContext: string = "",
  issueBacklog: string = "",
): Promise<CyclePlan> {
  // Dispatch to team planner if conditions are met
  if (shouldUseTeamPlanning(cycleNumber, undefined, issueContext.length > 0)) {
    logger.info("[Planning] Using team planning (multi-perspective advisory)");
    return planCycleWithTeam(recentJournalSummaries, cycleNumber, issueContext, issueBacklog);
  }

  logger.info("[Planning] Using single planner");
  const model = process.env.ANTHROPIC_MODEL;

  const modeHistorySummary = getCycleModeHistorySummary();
  const journalContext =
    recentJournalSummaries.length > 0
      ? recentJournalSummaries.join("\n\n---\n\n")
      : "No previous cycles. This is the very first cycle.";

  const modeList = Object.values(CYCLE_MODES)
    .map((m) => `- **${m.name}**: ${m.description}`)
    .join("\n");

  const issueSection = issueContext
    ? `\n\n${issueContext}\n`
    : "";

  const backlogSection = issueBacklog
    ? `\n\n## Deferred Issue Backlog\n\nThe following issues were deferred from earlier cycles. You may pick one up this cycle if the timing is right — include it in \`issueActions\` with action \"accept\" along with a brief response.\n\n${issueBacklog}\n`
    : "";

  const prompt = `You are Agent Oak's planning module. Decide what the next autonomous cycle should focus on.

Cycle ${cycleNumber} is about to start.

## Last Cycle's Journal
${journalContext}

## Cycle Mode History
Use this summary of past cycle modes to inform your decision, but do not feel constrained by it.
If the previous few cycles were all "research", maybe it's time for a "feature". If there was a recent "repair", maybe a "patch" or "refactor" is next.
Use your judgment to choose the best mode for the current situation and objective — the goal is to build a great ROM hack, not to follow a rigid pattern.

${modeHistorySummary}


## Memory Files (on demand)

Your full memory is in the \`memory/\` directory. Read these files if you need more context before deciding — don't pre-emptively read them all, only fetch what is relevant:

- \`memory/strategy-notes.md\` — game design direction, multi-cycle roadmap, and goals
- \`memory/codebase-facts.md\` — discovered facts about the pokeemerald codebase
- \`memory/failure-patterns.md\` — build failures encountered and their solutions
- \`memory/project-facts.md\` — build system details and configuration notes

You can also read specific cycle journals in \`memory/cycles/cycle-<n>.md\` for more details on past cycles if needed.

## Available Modes
${modeList}
${issueSection}${backlogSection}
Decide: What mode should this cycle use, and what should the objective be?

If previous cycles had build failures, consider "repair".


Once you have decided on the objective, write a precise \`implementationPlan\` field. The implementation agent should execute your plan, not make design decisions — keep creative choices in the plan, not left to the implementer. Your instructions should be clear and actionable:

**General structure**:
1. What to read or understand first
2. Logical actions to take in order
3. Conventions or patterns to follow
4. How to verify the work compiled and is correct

**CRITICAL — Specifying creative content**:
When the plan involves game content (dialogue, encounter tables, trainer rosters, item placements, stat values, move sets, evolution changes, etc.), you MUST provide the complete, verbatim content in the plan itself. The implementation agent should NOT be inventing dialogue, choosing Pokémon species, deciding stat values, or making any creative choices.

**What to specify completely (not exhaustive - use your own judgment)**:
- Full dialogue text (exact wording)
- Complete encounter tables (species, levels, encounter rates)
- Exact trainer rosters (species, levels, held items, moves)
- Specific numerical values (stats, experience yields, catch rates)
- Item lists and placement locations
- Evolution conditions and methods

The implementation agent's job is to locate the right files and make the necessary changes — not to design the content itself. When in doubt, over-specify.

If there are community issues listed above, review each one and include your decisions in the \`issueActions\` array. You have full freedom to accept, defer, reject, or ask for more info. If an accepted issue should shape this cycle's objective, incorporate it.

**Important**: When writing issue responses, adopt Professor Oak's warm, encouraging voice — treat contributors like promising young trainers. Be kind, curious, and use gentle Pokémon metaphors. See the /communicate skill for voice examples, though you cannot invoke it during structured output.

You may also include \`helpRequests\` if you are stuck on something and want to ask the community for help.

Respond with a JSON object containing mode, objective, reasoning, implementationPlan, and optionally issueActions and helpRequests.`;

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
