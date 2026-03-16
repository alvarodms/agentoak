/**
 * Multi-perspective team planning: runs parallel advisory agents,
 * then feeds their memos into the existing planner (Producer) for synthesis.
 */

import { runClaudeCode } from "../agent/claude-cli.js";
import type { CyclePlan } from "./planner.js";
import { CYCLE_PLAN_SCHEMA, parsePlanResult } from "./planner.js";
import { CYCLE_MODES } from "./modes.js";
import { getCycleModeHistorySummary } from "../memory/store.js";
import { TEAM_ROLES } from "./team-roles.js";
import type { TeamRole, TeamContext } from "./team-roles.js";
import { logger } from "../utils/logger.js";

/** Run a single advisory agent and return its memo text */
async function runAdvisoryRole(
  role: TeamRole,
  ctx: TeamContext,
): Promise<{ name: string; label: string; memo: string }> {
  const prompt = role.buildPrompt(ctx);
  try {
    logger.info(`  [Team] Running ${role.label} advisor...`);
    const result = await runClaudeCode(prompt, {
      maxTurns: role.maxTurns,
      timeout: role.timeout,
      tools: role.tools,
      model: process.env.ANTHROPIC_MODEL,
    });
    const memo = result.narrativeText || result.resultText || "(no memo produced)";
    logger.info(`  [Team] ${role.label} memo: ${memo.length} chars`);
    return { name: role.name, label: role.label, memo };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    logger.warn(`  [Team] ${role.label} advisor failed: ${errMsg}`);
    return {
      name: role.name,
      label: role.label,
      memo: `(The ${role.label} was unavailable for this session.)`,
    };
  }
}

/** Build the advisory memo section injected into the Producer prompt */
function buildMemoSection(
  memos: Array<{ name: string; label: string; memo: string }>,
): string {
  const successfulMemos = memos.filter(
    (m) => !m.memo.startsWith("(The "),
  );
  if (successfulMemos.length === 0) return "";

  const parts = memos.map(
    (m) => `### ${m.label}\n${m.memo}`,
  );

  return `\n\n## Advisory Team Memos

Before making your decision, consider these perspectives from your advisory team. You may agree or disagree with any advisor — the final decision is yours. In your \`reasoning\` field, briefly note which perspectives influenced your decision.

${parts.join("\n\n")}`;
}

/**
 * Plan the next cycle using parallel advisory agents + a synthesis producer.
 *
 * 1. Build shared context from journal, mode history, issues
 * 2. Run 3 advisory roles in parallel (game designer, tech lead, QA lead)
 * 3. Inject their memos into the existing planner prompt
 * 4. Run the Producer with --json-schema to get a CyclePlan
 */
export async function planCycleWithTeam(
  recentJournalSummaries: string[],
  cycleNumber: number,
  issueContext: string = "",
  issueBacklog: string = "",
): Promise<CyclePlan> {
  const model = process.env.ANTHROPIC_MODEL;

  // Build shared context (same as planner.ts)
  const modeHistorySummary = getCycleModeHistorySummary();
  const journalContext =
    recentJournalSummaries.length > 0
      ? recentJournalSummaries.join("\n\n---\n\n")
      : "No previous cycles. This is the very first cycle.";

  const modeList = Object.values(CYCLE_MODES)
    .map((m) => `- **${m.name}**: ${m.description}`)
    .join("\n");

  const issueSection = issueContext ? `\n\n${issueContext}\n` : "";
  const backlogSection = issueBacklog
    ? `\n\n## Deferred Issue Backlog\n\nThe following issues were deferred from earlier cycles. You may pick one up this cycle if the timing is right — include it in \`issueActions\` with action "accept" along with a brief response.\n\n${issueBacklog}\n`
    : "";

  const teamCtx: TeamContext = {
    cycleNumber,
    journalContext,
    modeHistorySummary,
    modeList,
    issueSection,
    backlogSection,
  };

  // Phase A: Run advisory roles in parallel
  logger.info(`[Team Planning] Running ${TEAM_ROLES.length} advisory agents in parallel...`);
  const memos = await Promise.all(
    TEAM_ROLES.map((role) => runAdvisoryRole(role, teamCtx)),
  );

  const successCount = memos.filter((m) => !m.memo.startsWith("(The ")).length;
  logger.info(`[Team Planning] ${successCount}/${TEAM_ROLES.length} advisors produced memos`);

  // If ALL advisors failed, fall back to single-planner (imported dynamically to avoid circular dep)
  if (successCount === 0) {
    logger.warn("[Team Planning] All advisors failed — falling back to single planner");
    // Dynamic import to avoid circular dependency with planner.ts
    const { planCycle } = await import("./planner.js");
    return planCycle(recentJournalSummaries, cycleNumber, issueContext, issueBacklog);
  }

  // Phase B: Build Producer prompt (existing planner prompt + memos)
  const memoSection = buildMemoSection(memos);

  const prompt = `You are Agent Oak's planning module (the **Producer**). Decide what the next autonomous cycle should focus on.

Your advisory team has provided their perspectives below. Consider all viewpoints, but the final decision is yours — you may disagree with any advisor. In your \`reasoning\` field, note which perspectives influenced your decision.

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
${issueSection}${backlogSection}${memoSection}

Decide: What mode should this cycle use, and what should the objective be?

If previous cycles had build failures, consider "repair".


Once you have decided on the objective, write a precise \`implementationPlan\` field. The implementation agent runs on a less capable model — it should execute your plan, not make design decisions. Your instructions must be complete and specific:

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

  logger.info(`[Team Planning] Running Producer (synthesis) with advisory memos...`);
  logger.info(`-> Producer prompt:\n\n\n${prompt}\n\n\n`);

  const result = await runClaudeCode(prompt, {
    maxTurns: 10,
    timeout: 5 * 60 * 1000,
    model,
    jsonSchema: CYCLE_PLAN_SCHEMA,
  });

  logger.info(`-> Producer result:\n\n\n${JSON.stringify(result, null, 2)}\n\n\n`);

  return parsePlanResult(result);
}

/**
 * Determine whether team planning should be used for this cycle.
 *
 * Controlled by env var AGENT_TEAM_PLANNING=auto|always|never (default: auto).
 */
export function shouldUseTeamPlanning(
  cycleNumber: number,
  lastCycleMode?: string,
  hasIssues: boolean = false,
): boolean {
  const setting = (process.env.AGENT_TEAM_PLANNING ?? "auto").toLowerCase();

  if (setting === "never") return false;
  if (setting === "always") return true;

  // Auto logic:
  // - Skip if last cycle was repair (answer is obvious — fix the build)
  if (lastCycleMode === "repair") return false;
  // - Skip early cycles (not enough history for advisors to add value)
  if (cycleNumber < 3) return false;
  // - Use teams when community issues are present (multiple perspectives help)
  if (hasIssues) return true;
  // - Default: use team planning for mature projects
  return true;
}
