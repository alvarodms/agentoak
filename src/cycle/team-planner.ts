/**
 * Multi-perspective team planning: runs parallel advisory agents,
 * then feeds their memos into the existing planner (Producer) for synthesis.
 */

import { runClaudeCode } from "../agent/claude-cli.js";
import type { CyclePlan } from "./planner.js";
import { CYCLE_PLAN_SCHEMA, parsePlanResult } from "./planner.js";
import { getCycleModeHistorySummary } from "../memory/store.js";
import { TEAM_ROLES } from "./team-roles.js";
import type { TeamRole, TeamContext } from "./team-roles.js";
import { logger } from "../utils/logger.js";
import {
  formatJournalContext,
  formatModeList,
  formatIssueSection,
  formatBacklogSection,
  buildPlannerContextSections,
  formatImplementationPlanGuidance,
  formatGameplayDesignBriefGuidance,
  formatSpriteDesignBriefGuidance,
  formatPlannerClosingInstructions,
  formatPersonalityGuidance,
} from "../agent/prompt-sections.js";

/** Run a single advisory agent and return its memo text */
async function runAdvisoryRole(
  role: TeamRole,
  ctx: TeamContext,
): Promise<{ name: string; label: string; memo: string }> {
  try {
    const prompt = role.buildPrompt(ctx);
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

**Engineering investments**: If the Technical Lead proposes an engineering improvement (tooling, abstractions, config-driven patterns), you must either (a) incorporate it into this cycle's objective, (b) capture it in the \`engineeringInvestment\` field so it is preserved for a future cycle, or (c) explain in your \`reasoning\` why it is not worth pursuing. Do not silently ignore engineering suggestions — they compound across cycles.

**Creative investments**: If the Creative Visionary proposes a bold idea that you're deferring (not incorporating this cycle), capture it in the \`creativeInvestment\` field so it is tracked in the creative backlog. This prevents good ideas from being "noted and valued" but never tracked. Do not capture ideas you're rejecting outright — only ones worth revisiting when prerequisites are met.

**Design hypothesis**: If the Game Designer states a design hypothesis (a testable claim about how the player should feel), include it in your \`reasoning\` field. This becomes the design intent against which the next cycle evaluates success. If the Game Designer challenges the roadmap, engage with the argument directly — explain why you agree or disagree rather than defaulting to the planned next step.

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
  staleIssues?: Array<{ issueNumber: number; title: string; deferredAtCycle: number; deferralCount?: number }>,
): Promise<CyclePlan> {
  const model = process.env.ANTHROPIC_MODEL;

  // Build shared context using prompt-sections utilities
  const modeHistorySummary = getCycleModeHistorySummary();
  const journalContext = formatJournalContext(recentJournalSummaries);
  const modeList = formatModeList();
  const issueSection = formatIssueSection(issueContext);
  const backlogSection = formatBacklogSection(issueBacklog);

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
    return planCycle(recentJournalSummaries, cycleNumber, issueContext, issueBacklog, staleIssues);
  }

  // Phase B: Build Producer prompt (shared planner context + memos)
  const memoSection = buildMemoSection(memos);

  const sharedContext = buildPlannerContextSections({
    cycleNumber,
    journalContext,
    modeHistorySummary,
    issueContext,
    issueBacklog,
    staleIssues,
    extraMemoryFiles: [
      "`memory/pokemon-knowledge.md` — Pokémon game/ROM hack research findings (maintained by the Pokémon Specialist advisor)",
    ],
  });

  const prompt = `You are Agent Oak's planning module (the **Producer**). Decide what the next autonomous cycle should focus on.

Your advisory team has provided their perspectives below. Consider all viewpoints, but the final decision is yours — you may disagree with any advisor. In your \`reasoning\` field, note which perspectives influenced your decision.

Cycle ${cycleNumber} is about to start.

${sharedContext}
${memoSection}
${formatPersonalityGuidance()}

Decide: What mode should this cycle use, and what should the objective be?

If previous cycles had build failures, consider "repair".

## Engineering Investment (optional field)

Even when the main objective is content work, capture any valuable engineering improvement opportunity in the \`engineeringInvestment\` field. This is persisted in a tech debt backlog across cycles, building a visible record of deferred infrastructure work. Engineering investments that reduce file-touch counts or automate repetitive operations accelerate all future content cycles — they are not in opposition to the creative vision, they are force multipliers for it.

## Creative Investment (optional field)

When deferring a bold creative idea from the Creative Visionary, capture it in the \`creativeInvestment\` field. This is persisted in a creative backlog across cycles, preventing good ideas from being acknowledged but never tracked. Only capture ideas worth revisiting — not ones you're rejecting outright.

${formatImplementationPlanGuidance()}

${formatGameplayDesignBriefGuidance()}

${formatSpriteDesignBriefGuidance()}

${formatPlannerClosingInstructions()}`;

  logger.info(`[Team Planning] Running Producer (synthesis) with advisory memos...`);
  logger.info(`-> Producer prompt:\n\n\n${prompt}\n\n\n`);

  const result = await runClaudeCode(prompt, {
    maxTurns: 50,
    timeout: 15 * 60 * 1000,
    model,
    jsonSchema: CYCLE_PLAN_SCHEMA,
  });

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
