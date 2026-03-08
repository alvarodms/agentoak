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
      "Explore the codebase to understand how systems work. Read files, search for patterns, build mental models. No code changes required.",
    promptAddendum:
      "This is a research cycle. Focus on understanding the codebase. Read source files, trace function calls, understand data structures. Record everything you learn in your memory files. You do not need to make any code changes.",
  },
  patch: {
    name: "patch",
    label: "Patch & Modify",
    description:
      "Make targeted code modifications — tweak values, change data, small functional changes.",
    promptAddendum:
      "This is a patch cycle. You're making targeted modifications to the codebase. Be surgical — understand the code before editing, make focused changes, and try to build afterward to verify.",
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
    label: "Feature Attempt",
    description:
      "Attempt to implement a new feature or significant gameplay change.",
    promptAddendum:
      "This is a feature cycle. You're attempting something ambitious — a new feature, a gameplay modification, or a significant change. Break the work into steps. Research first, then implement incrementally. Record your progress in memory even if you don't finish.",
  },
  planning: {
    name: "planning",
    label: "Plan & Strategize",
    description:
      "Step back, review progress, brainstorm ideas, and plan future work. Update strategy notes.",
    promptAddendum:
      "This is a planning cycle. Step back from implementation and think about the big picture. Review your memory, reflect on what you've learned, brainstorm ROM hack ideas, and update your strategy notes with a plan. No code changes needed.",
  },
};

/** Get the full mode description for the system prompt */
export function getModeDescription(mode: CycleMode): string {
  const config = CYCLE_MODES[mode];
  return `${config.label} — ${config.description}\n\n${config.promptAddendum}`;
}
