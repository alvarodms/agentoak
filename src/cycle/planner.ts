import { runClaudeCode } from "../agent/claude-cli.js";
import type { Memory } from "../memory/types.js";
import type { CycleMode } from "./modes.js";
import { CYCLE_MODES } from "./modes.js";
import { logger } from "../utils/logger.js";
import { getMemorySummary } from "../memory/store.js";
import type { IssueAction, HelpRequest } from "../github/client.js";

export interface CyclePlan {
  mode: CycleMode;
  objective: string;
  reasoning: string;
  issueActions: IssueAction[];
  helpRequests: HelpRequest[];
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
  required: ["mode", "objective", "reasoning"],
  additionalProperties: false,
};

/** Use Claude Code CLI to decide what the next cycle should focus on */
export async function planCycle(
  memory: Memory,
  recentJournalSummaries: string[],
  cycleNumber: number,
  issueContext: string = "",
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

  const issueSection = issueContext
    ? `\n\n${issueContext}\n`
    : "";

  const prompt = `You are Agent Oak's planning module. Decide what the next autonomous cycle should focus on.

Cycle ${cycleNumber} is about to start.

## Current Memory
${memorySummary}

## Recent Cycles
${journalContext}

## Available Modes
${modeList}
${issueSection}
Decide: What mode should this cycle use, and what should the objective be?

If previous cycles had build failures, consider "repair".

### Incomplete Work — MANDATORY RETRY

**CRITICAL**: Check the most recent cycle in "Recent Cycles" above. If it contains a "## Validation Warnings" section with status UNSUBSTANTIATED or INCOMPLETE, you **MUST** retry that cycle's objective. This means the previous cycle's agent claimed to have completed work but the automated validator found no evidence of actual file changes. Do NOT move on to new work — the previous objective was not actually accomplished.

When retrying:
- Use the same mode as the failed cycle
- Set the objective to the same objective (you may rephrase it slightly for clarity)
- In the reasoning, explain that this is a retry because the previous attempt did not produce the expected file changes
- Do NOT pick a different task or try to work around it

### Strategic Vision

You are building a complete ROM hack — not just making isolated tweaks. Every cycle should serve a larger game design vision. Think like a game designer:

- **What kind of game experience are you creating?** Have a clear creative direction (theme, difficulty curve, narrative hooks, what makes this hack unique).
- **What's the multi-cycle roadmap?** Plan 5–10 cycles ahead. Each cycle should build on previous work toward a coherent whole.
- **Prefer ambitious, interconnected changes** over safe, isolated ones. Changing wild encounters on one route is fine — but designing an entire regional encounter philosophy across all routes is better.
- **Use "planning" mode** to develop comprehensive game design documents in strategy-notes.md when you need to think through a major system (encounter design, difficulty curve, story beats, regional themes).
- **Use "feature" mode** when implementing multi-file changes that transform a game system.
- **Use "research" mode** when you need deep understanding of a system before a major feature — not as a default safe choice.

Don't play it safe. The goal is a ROM hack with a strong creative identity, not a collection of minor data edits.

If there are community issues listed above, review each one and include your decisions in the \`issueActions\` array. You have full freedom to accept, defer, reject, or ask for more info. If an accepted issue should shape this cycle's objective, incorporate it.

You may also include \`helpRequests\` if you are stuck on something and want to ask the community for help.

Respond with a JSON object containing mode, objective, reasoning, and optionally issueActions and helpRequests.`;

  try {
    const result = await runClaudeCode(prompt, {
      maxTurns: 10,
      timeout: 2 * 60 * 1000,
      model,
      jsonSchema: CYCLE_PLAN_SCHEMA,
    });

    console.log('Planning result:', result);

    // With --json-schema, the structured JSON is in the result message's result field
    interface PlanJson {
      mode?: string;
      objective?: string;
      reasoning?: string;
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
        return { mode: "research", objective: parsed.objective, reasoning: parsed.reasoning, issueActions, helpRequests };
      }
      logger.info(`Cycle plan: [${mode}] ${parsed.objective}`);
      if (issueActions.length > 0) {
        logger.info(`  Issue actions: ${issueActions.length} (${issueActions.map(a => `#${a.issueNumber}:${a.action}`).join(", ")})`);
      }
      if (helpRequests.length > 0) {
        logger.info(`  Help requests: ${helpRequests.length}`);
      }
      return { mode, objective: parsed.objective, reasoning: parsed.reasoning, issueActions, helpRequests };
    }

    logger.warn("Could not parse structured plan from CLI output, using fallback");
  } catch (err) {
    logger.warn(`Planning phase failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  return {
    mode: "research",
    objective: "Explore the pokeemerald codebase and understand its structure",
    reasoning: "Default fallback — planner could not produce a structured plan.",
    issueActions: [],
    helpRequests: [],
  };
}
