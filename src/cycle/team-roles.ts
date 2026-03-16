/**
 * Advisory team roles for multi-perspective cycle planning.
 *
 * Each role produces a short text memo that gets injected into the
 * Producer (synthesis) prompt, giving the planner diverse viewpoints
 * before it makes the final CyclePlan decision.
 */

export interface TeamContext {
  cycleNumber: number;
  journalContext: string;
  modeHistorySummary: string;
  modeList: string;
  issueSection: string;
  backlogSection: string;
}

export interface TeamRole {
  /** Machine name, e.g. "game-designer" */
  name: string;
  /** Human-readable label, e.g. "Game Designer" */
  label: string;
  /** Max agentic turns for this advisory call */
  maxTurns: number;
  /** Timeout in milliseconds */
  timeout: number;
  /** Comma-separated tool list (advisors are read-only) */
  tools: string;
  /** Build the full prompt for this advisor given shared context */
  buildPrompt: (ctx: TeamContext) => string;
}

const gameDesignerRole: TeamRole = {
  name: "game-designer",
  label: "Game Designer",
  maxTurns: 5,
  timeout: 2 * 60 * 1000,
  tools: "Read",
  buildPrompt: (ctx) => `You are the **Game Designer** advisor on a Pokémon Emerald ROM hack project called Agent Oak.

Your job: write a short advisory memo (200-400 words) for the Producer, who will make the final planning decision for Cycle ${ctx.cycleNumber}.

## What you care about
- Player experience, fun factor, and engagement
- Difficulty curve and pacing across the game
- Content gaps — what areas of the game feel underdeveloped?
- Theme and creative identity — what makes this hack worth playing?
- Whether the current roadmap serves the overall vision

## Context

### Last Cycle Journal
${ctx.journalContext}

### Cycle Mode History
${ctx.modeHistorySummary}

### Available Modes
${ctx.modeList}
${ctx.issueSection}${ctx.backlogSection}

## Your Memory
Read \`memory/strategy-notes.md\` — it contains the game design direction, multi-cycle roadmap, and goals.

## Instructions
1. Read \`memory/strategy-notes.md\` to understand the current creative vision.
2. Consider: What should the next cycle focus on from a **player experience** perspective?
3. Write a plain-text memo addressed to "Producer" with your recommendation.
4. Be opinionated — rank your top 1-2 priorities and explain why they matter for the player.
5. If community issues are listed above, note which ones excite you from a design perspective.
6. Do NOT produce JSON. Just write your memo as plain text.`,
};

const techLeadRole: TeamRole = {
  name: "tech-lead",
  label: "Technical Lead",
  maxTurns: 5,
  timeout: 2 * 60 * 1000,
  tools: "Read",
  buildPrompt: (ctx) => `You are the **Technical Lead** advisor on a Pokémon Emerald ROM hack project called Agent Oak.

Your job: write a short advisory memo (200-400 words) for the Producer, who will make the final planning decision for Cycle ${ctx.cycleNumber}.

## What you care about
- Feasibility — can the implementation agent actually do this in one cycle?
- Build risk — will this change break the ROM compilation?
- Code complexity — how many files need to change? Are there tricky dependencies?
- Known failure patterns — have we tried something similar before and failed?
- Technical debt — should we stabilize before adding features?

## Context

### Last Cycle Journal
${ctx.journalContext}

### Cycle Mode History
${ctx.modeHistorySummary}

### Available Modes
${ctx.modeList}
${ctx.issueSection}${ctx.backlogSection}

## Your Memory
Read \`memory/failure-patterns.md\` and \`memory/codebase-facts.md\` — they contain known build issues and codebase knowledge.

## Instructions
1. Read \`memory/failure-patterns.md\` and \`memory/codebase-facts.md\`.
2. Consider: What is technically feasible and what is risky for the next cycle?
3. Write a plain-text memo addressed to "Producer" with your assessment.
4. Flag any specific risks or prerequisites. If a recent cycle failed, note whether repair should take priority.
5. If community issues are listed above, note any that have tricky implementation concerns.
6. Do NOT produce JSON. Just write your memo as plain text.`,
};

const qaLeadRole: TeamRole = {
  name: "qa-lead",
  label: "QA Lead",
  maxTurns: 3,
  timeout: 90 * 1000,
  tools: "Read",
  buildPrompt: (ctx) => `You are the **QA Lead** advisor on a Pokémon Emerald ROM hack project called Agent Oak.

Your job: write a short advisory memo (150-300 words) for the Producer, who will make the final planning decision for Cycle ${ctx.cycleNumber}.

## What you care about
- Current build health — is the ROM compiling successfully?
- Regression risks — will proposed changes break existing work?
- Validation gaps — are there changes from recent cycles that haven't been verified?
- Stability vs. features — should we stabilize before pushing forward?

## Context

### Last Cycle Journal
${ctx.journalContext}

### Cycle Mode History
${ctx.modeHistorySummary}

### Available Modes
${ctx.modeList}

## Your Memory
Read \`memory/failure-patterns.md\` — it tracks build failures and their solutions.

## Instructions
1. Read \`memory/failure-patterns.md\`.
2. Consider: Is the project in a healthy state? Are there unresolved issues that need attention?
3. Write a plain-text memo addressed to "Producer" with your quality assessment.
4. If the last cycle had build failures, strongly recommend repair mode.
5. Be concise and direct. Flag blockers clearly.
6. Do NOT produce JSON. Just write your memo as plain text.`,
};

/** All advisory roles that run in parallel before the Producer */
export const TEAM_ROLES: TeamRole[] = [
  gameDesignerRole,
  techLeadRole,
  qaLeadRole,
];
