/** Cycle modes define the kind of work Agent Oak does in a cycle */

export type CycleMode = "research" | "patch" | "repair" | "refactor" | "feature" | "planning";

export interface CycleModeConfig {
  name: CycleMode;
  label: string;
  description: string;
  promptAddendum: string;
}

export const CYCLE_MODES: Record<CycleMode, CycleModeConfig> = {
  research: {
    name: "research",
    label: "Research & Explore",
    description:
      "Deep-dive into a specific game system to understand how it works end-to-end. Best used when preparing for a major feature implementation. Read files, trace function calls, build mental models.",
    promptAddendum:
      "This is a research cycle. Conduct a deep, targeted investigation of a specific game system. Don't just browse — go deep enough to understand how you would modify this system for the ROM hack. Map out data flows, identify all the files involved, understand constraints. Record detailed findings in codebase-facts.md with specific file paths, function names, and data structure details. Your research should directly enable a future implementation cycle.",
  },
  patch: {
    name: "patch",
    label: "Patch & Modify",
    description:
      "Make code modifications — change data, tune gameplay values, modify game systems. Can range from focused edits to broad sweeping changes across many files.",
    promptAddendum:
      "This is a patch cycle. Understand the code before editing, and build afterward to verify. If the objective involves a broad change (e.g. redesigning encounters across multiple routes), don't limit yourself to one file — make all the changes needed to deliver a cohesive result.",
  },
  repair: {
    name: "repair",
    label: "Repair Build",
    description:
      "Fix build errors from previous cycles. Analyze error logs and make corrective changes.",
    promptAddendum:
      "This is a repair cycle. Previous changes caused build failures. Your priority is to fix the build. Review the failure patterns in memory, analyze the errors, and make corrections. Try building after each fix.",
  },
  refactor: {
    name: "refactor",
    label: "Refactor Code",
    description:
      "Reorganize or restructure code to prepare for future changes.",
    promptAddendum:
      "This is a refactor cycle. Restructure code to make it cleaner or prepare for future features. Be careful — the codebase is a decompilation, so changes should preserve behavior unless you intend to modify it.",
  },
  feature: {
    name: "feature",
    label: "Feature Implementation",
    description:
      "Implement a significant gameplay change or new feature that may span multiple files and systems. This is where the ROM hack takes shape.",
    promptAddendum:
      "This is a feature cycle. You're implementing something substantial — a new gameplay system, a major overhaul, or a significant creative change. Break the work into steps, implement them methodically, and build to verify. If the feature is too large for one cycle, implement as much as you can and document the remaining work in strategy-notes.md for the next cycle. Don't be afraid of touching multiple files — real features require it.",
  },
  planning: {
    name: "planning",
    label: "Plan & Strategize",
    description:
      "Design the game — develop a comprehensive vision, plan multi-cycle roadmaps, design game systems (encounter tables, difficulty curves, story beats, regional themes). Write detailed game design documents in strategy-notes.md.",
    promptAddendum:
      "This is a planning cycle. Think like a game designer, not just a programmer. Develop a comprehensive creative vision for the ROM hack. Consider: What makes this hack unique? What's the player experience from start to finish? Design specific systems — encounter philosophy per area, difficulty progression, thematic elements, narrative hooks. Write a detailed game design document in strategy-notes.md that future cycles can execute against. Plan a concrete multi-cycle roadmap with dependencies. No code changes needed, but the output should be a rich, actionable design document.",
  },
};

/** Get the full mode description for the system prompt */
export function getModeDescription(mode: CycleMode): string {
  const config = CYCLE_MODES[mode];
  return `${config.label} — ${config.description}\n\n${config.promptAddendum}`;
}
