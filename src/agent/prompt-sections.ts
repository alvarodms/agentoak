/**
 * Reusable prompt section factories.
 *
 * Each function returns a plain string representing a self-contained
 * section of a prompt. They can be used standalone or composed through
 * PromptBuilder for larger prompts.
 */

import { CYCLE_MODES } from "../cycle/modes.js";
import type { TeamContext } from "../cycle/team-roles.js";
import type { IssueAction } from "../github/client.js";
import { PromptBuilder } from "./prompt-builder.js";
import { getPersonalityGuidance, getIssueEvaluationGuidance } from "../config/personality.js";

// ---------------------------------------------------------------------------
// Small reusable fragments
// ---------------------------------------------------------------------------

/** Format journal summaries into a single block, with a fallback for first-cycle. */
export function formatJournalContext(summaries: string[]): string {
  return summaries.length > 0
    ? summaries.join("\n\n---\n\n")
    : "No previous cycles. This is the very first cycle.";
}

/** List the issues the planner accepted, with its per-item decisions. */
export function formatAcceptedIssues(actions: IssueAction[]): string {
  return actions
    .map((a) => {
      const scope = a.partial ? " (multi-cycle — only part is due this cycle)" : "";
      const items = (a.items ?? [])
        .map((item) => `\n  - ${item.label} — ${item.action}${item.partial ? " (multi-cycle)" : ""}: ${item.response}`)
        .join("");
      return `- #${a.issueNumber}${scope}: ${a.response}${items}`;
    })
    .join("\n");
}

/** Build the bullet list of available cycle modes. */
export function formatModeList(): string {
  return Object.values(CYCLE_MODES)
    .map((m) => `- **${m.name}**: ${m.description}`)
    .join("\n");
}

/** Wrap raw issue context in a conditional section (returns empty string if absent). */
export function formatIssueSection(issueContext: string): string {
  return issueContext ? `\n\n${issueContext}\n` : "";
}

/** Build the "Deferred Issue Backlog" section (returns empty string if absent). */
export function formatBacklogSection(
  issueBacklog: string,
  staleIssues?: Array<{ issueNumber: number; title: string; deferredAtCycle: number; deferralCount?: number; pendingItems?: string[] }>,
): string {
  const hasBacklog = !!issueBacklog;
  const hasStale = staleIssues && staleIssues.length > 0;
  if (!hasBacklog && !hasStale) return "";

  let section = "\n\n## Deferred Issue Backlog\n\n";

  if (hasBacklog) {
    section += `Deferred from earlier cycles and carried forward automatically:\n\n${issueBacklog}\n`;
  }

  if (hasStale) {
    const MAX_DEFERRALS = 5;
    const staleLines = staleIssues.map((i) => {
      const count = i.deferralCount ?? 1;
      const mustDecide = count >= MAX_DEFERRALS;
      let line = `- #${i.issueNumber}: ${i.title} (deferred since cycle ${i.deferredAtCycle}, ${count} deferral(s))`;
      if (i.pendingItems && i.pendingItems.length > 0) {
        line += ` — Pending items: ${i.pendingItems.join(", ")}`;
      }
      if (mustDecide) {
        line += ` ⚠️ **MAX DEFERRALS REACHED — you MUST accept or reject this issue. Deferring again is NOT allowed.**`;
      }
      return line;
    }).join("\n");
    section += `\n### Stale Issues (deferred 10+ cycles)\n\nThese issues have been sitting in the backlog for a long time. Please re-evaluate each one and include it in \`issueActions\`:\n- **accept**: Pick it up this cycle\n- **reject**: It no longer aligns with the project direction — close it with a reason\n- **defer**: Still worth keeping — provide a brief justification for why (NOT allowed if max deferrals reached)\n\n${staleLines}\n`;
  }

  return section;
}

/**
 * Map from MCP tool name (as registered in the pokedex server) to its
 * human-readable prompt documentation line.
 */
const POKEDEX_TOOL_DOCS: Record<string, string> = {
  "mcp__pokedex__pokemon_stats":
    "`pokemon_stats(name)` — base stats, types, BST, competitive tier for a species",
  "mcp__pokedex__search_pokemon":
    "`search_pokemon(type?, minBst?, maxBst?, limit?)` — find species by type and/or stat range",
  "mcp__pokedex__move_data":
    "`move_data(name)` — power, accuracy, type, category (Physical/Special/Status), PP",
  "mcp__pokedex__type_matchup":
    "`type_matchup(attacking, defending[])` — exact effectiveness multiplier for a type interaction",
  "mcp__pokedex__pokemon_learnset":
    "`pokemon_learnset(name, gen?)` — all moves a species can learn (level-up, TM, egg, tutor)",
  "mcp__pokedex__smogon_sets":
    "`smogon_sets(name, format?)` — competitive movesets and strategy from Smogon (moves, item, nature, EVs). Defaults to Gen 3.",
  "mcp__pokedex__smogon_format_pokemon":
    "`smogon_format_pokemon(format, limit?)` — list all Pokémon with competitive sets in a Smogon tier (ou, uu, ubers, etc.)",
  "mcp__pokedex__team_type_coverage":
    "`team_type_coverage(team[], gen?)` — analyse a team's defensive weaknesses, resistances, immunities, and offensive coverage",
  "mcp__pokedex__rom_species":
    "`rom_species(name, sections?)` — one species as it stands in THIS ROM (custom species included): stats, Pokédex entry, learnsets, evolutions, wild slots, trainers. Use it instead of reading or grepping the large species data files",
};

/** All Pokédex MCP tool names — use to grant an agent access to the full set. */
export const ALL_POKEDEX_TOOLS = Object.keys(POKEDEX_TOOL_DOCS);

/**
 * Build the Pokédex MCP tools reference block for agent prompts.
 *
 * @param mcpTools  When provided, only tools in this list are shown.
 *                  Pass `undefined` or omit to include all Pokédex tools.
 */
export function formatPokedexToolsSection(mcpTools?: string[]): string {
  const entries = mcpTools
    ? mcpTools
        .filter((t) => t in POKEDEX_TOOL_DOCS)
        .map((t) => POKEDEX_TOOL_DOCS[t])
    : Object.values(POKEDEX_TOOL_DOCS);

  if (entries.length === 0) return "";

  return `## Pokédex MCP tools (structured, authoritative Gen 3 data)
${entries.map((e) => `- ${e}`).join("\n")}

Use these tools to ground your advice in hard numbers: "Blaziken has 120 Atk / 80 Spe" is more useful than vague claims.`;
}

/** The "Memory Files (on demand)" pointer; the files themselves are listed in CLAUDE.md. */
export function formatMemoryFilesSection(): string {
  return `## Memory Files (on demand)

Your memory files are listed in CLAUDE.md. Read the ones relevant to this decision — don't pre-emptively read them all. \`memory/tech-debt-backlog.md\` and \`memory/creative-backlog.md\` hold deferred engineering and creative investments worth reviewing when planning. Past cycles are in \`journal/cycle-<NNNN>.md\` (zero-padded, e.g. \`journal/cycle-0307.md\`).`;
}

/** The mode history heading + "don't feel constrained" preamble. */
export function formatModeHistorySection(summary: string): string {
  return `## Cycle Mode History
Use this summary of past cycle modes to inform your decision, but do not feel constrained by it.
If the previous few cycles were all "research", maybe it's time for a "feature". If a recent cycle failed and was reverted, do NOT choose "repair" — the broken code was rolled back. Instead retry the objective differently or pick new work.
Use your judgment to choose the best mode for the current situation and objective — the goal is to build a great ROM hack, not to follow a rigid pattern.

${summary}`;
}

/** The rule against choosing "repair" after a revert, shared by both planner variants. */
export function formatRevertRule(): string {
  return `If a previous cycle had build failures and the changes were REVERTED (look for "[REVERTED" in the journal), do NOT choose "repair" — the broken code no longer exists. Instead, choose a productive mode (feature, patch, planning, etc.) and either retry the same objective with a different approach or move on to something else. Only choose "repair" if the build is currently broken with un-reverted changes still in place.`;
}

/** The ~20-line implementation plan guidance block shared by both planner variants. */
export function formatImplementationPlanGuidance(): string {
  return `Once you have decided on the objective, write a precise \`implementationPlan\` field. The implementation agent should execute your plan, not make design decisions — keep creative choices in the plan, not left to the implementer. Your instructions should be clear and actionable:

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

The implementation agent's job is to locate the right files and make the necessary changes — not to design the content itself. When in doubt, over-specify.`;
}

/** Guidance for the Producer on when and how to use the gameplayDesignBrief field. */
export function formatGameplayDesignBriefGuidance(): string {
  return `## Gameplay Designer (optional Phase 1.5)

You have access to a **Gameplay Designer** agent that can produce detailed, data-driven gameplay specifications. It has access to Pokédex MCP tools (stats, learnsets, type matchups, Smogon sets) and can reason deeply about difficulty, balance, and progression.

**When to use it**: Set the \`gameplayDesignBrief\` field when this cycle involves gameplay changes — trainer teams, wild encounters, difficulty tuning, rival battles, gym leader redesigns, Elite Four, etc.

**What to write in the brief**: Describe what needs designing. Be specific about constraints and context:
- Which trainers/routes/encounters need designing
- What point in the game this is (early/mid/late, which badges the player has)
- Difficulty intent (challenging, balanced, tutorial-like)
- Any thematic constraints (Gym Leader must use Rock types, rival should counter the starter)
- References to previous design decisions if relevant

**When you set a brief**: Your \`implementationPlan\` should focus on **implementation steps** (which files to modify, data format patterns, how to verify) rather than specifying exact gameplay values. The Gameplay Designer will provide the specific teams, encounters, and values.

**When NOT to use it**: Research cycles, planning cycles, repairs, refactors, pure narrative/dialogue work, or any cycle that doesn't involve gameplay balancing decisions. Skip it to avoid unnecessary latency.`;
}

/** Guidance for the Producer on when and how to use the spriteDesignBrief field. */
export function formatSpriteDesignBriefGuidance(): string {
  return `## Sprite Designer (optional Phase 1.75)

You have access to a **Sprite Designer** agent that creates and iterates on regional form sprites. It works programmatically — recoloring palettes, stamping pixel accents, and self-reviewing its output (it can view PNGs). After sprites are committed, the runner creates a GitHub issue soliciting community feedback.

**When to use it**: Set the \`spriteDesignBrief\` field when this cycle involves:
- Creating new regional form sprites (a new variant species)
- Iterating on existing sprites based on community feedback (check the "Sprite Feedback Pending" section above)

**For fresh sprites**, describe:
- The base species (e.g., "growlithe")
- The target typing (e.g., "Electric/Fire")
- Aesthetic direction (e.g., "Electric-gold palette with lightning glyph accents on the body")

**For iteration sprites**, include:
- The species being iterated
- Specific community feedback quotes from the sprite-feedback issue
- What changes to prioritize
- **Set \`isSpriteIteration: true\`** so the runner runs the iteration in parallel with implementation (faster cycles, no blocking)

**When you set a brief**: Your \`implementationPlan\` should focus on species registration (constants, tables, stats) — the Sprite Designer handles the sprite files.

**When NOT to use it**: Research cycles, planning cycles, repairs, non-sprite work, or cycles adding species that use existing canonical sprites (use \`fetch_pokemon_sprites\` directly instead).`;
}

/**
 * Build a personality guidance section for planner/Producer prompts.
 * Returns empty string when all traits are at moderate defaults.
 */
export function formatPersonalityGuidance(): string {
  const guidance = getPersonalityGuidance();
  if (!guidance) return "";
  return `\n\n## Decision-Making Personality\n\nThe following personality configuration shapes how you make decisions this cycle:\n\n${guidance}`;
}

/** The issue-response and help-request instructions appended to planner prompts. */
export function formatPlannerClosingInstructions(): string {
  const issuePersonality = getIssueEvaluationGuidance();
  return `**Issue handling rules:**
- **New community issues**: include a decision for each in \`issueActions\`. You have full freedom to accept, defer, reject, or ask for more info.
- **Multi-item issues**: if an issue contains several distinct asks, give each its own entry in \`items\` and set the top-level \`action\` to the dominant one (accept if any item is accepted, defer if all deferred, reject if all rejected). Omit \`items\` for single-ask issues.
- **Regular backlog issues**: leave them out of \`issueActions\` — they carry forward automatically — unless you **accept** one this cycle.
- **Stale backlog issues**: you MUST include each one in \`issueActions\` with accept, reject, or defer.
- If an accepted issue should shape this cycle's objective, incorporate it.

**Responses** are 1-3 sentences, under 40 words: acknowledge, state your decision, and if deferring say when. No opening preamble ("Well now..."), no restating the suggestion, no long technical justification, one Pokémon metaphor at most.

You may also include \`helpRequests\` if you are stuck on something and want to ask the community for help.

Respond with a **single** JSON object containing mode, objective, reasoning, implementationPlan, and optionally gameplayDesignBrief, issueActions, and helpRequests. All fields must be in one JSON object — do NOT output multiple responses.${issuePersonality}`;
}

// ---------------------------------------------------------------------------
// Composite sections
// ---------------------------------------------------------------------------

export interface PlannerContextParams {
  cycleNumber: number;
  journalContext: string;
  modeHistorySummary: string;
  issueContext: string;
  issueBacklog: string;
  staleIssues?: Array<{ issueNumber: number; title: string; deferredAtCycle: number; deferralCount?: number; pendingItems?: string[] }>;
}

/**
 * Build the shared middle portion of the planner / Producer prompt.
 *
 * Covers: journal → mode history → memory files → Pokédex tools → modes → issues → backlog.
 * The preamble and closing instructions are left to each caller.
 */
export function buildPlannerContextSections(params: PlannerContextParams): string {
  const b = new PromptBuilder();
  b.heading("Last Cycle's Journal", params.journalContext);
  b.raw(formatModeHistorySection(params.modeHistorySummary));
  b.raw("\n" + formatMemoryFilesSection());
  b.raw("\n" + formatPokedexToolsSection());
  b.heading("Available Modes", formatModeList());
  b.raw(formatIssueSection(params.issueContext));
  b.raw(formatBacklogSection(params.issueBacklog, params.staleIssues));
  return b.build();
}

/**
 * Build the shared Context block used by all advisory team roles.
 *
 * Contains: strategy notes (optional), journal, mode history, available modes,
 * issues, backlog — all at ### level. Inlining the strategy notes saves each
 * advisor that needs them a Read turn.
 */
export function buildAdvisorContextBlock(
  ctx: TeamContext,
  options: { includeStrategyNotes?: boolean } = {},
): string {
  const b = new PromptBuilder();
  if (options.includeStrategyNotes) {
    b.heading("Strategy Notes (`memory/strategy-notes.md`)", ctx.strategyNotes || "(no strategy notes yet)", 3);
  }
  b.heading("Last Cycle Journal", ctx.journalContext, 3);
  b.heading("Cycle Mode History", ctx.modeHistorySummary, 3);
  b.heading("Available Modes", ctx.modeList, 3);
  b.heading("New Community Issues", ctx.issueSection || "No new community issues", 3);
  b.heading("Community Backlog", ctx.backlogSection || "No backlog items", 3);
  return b.build();
}
