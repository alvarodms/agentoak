/** Cycle modes define the kind of work Agent Oak does in a cycle */

export type CycleMode = "research" | "patch" | "repair" | "refactor" | "feature" | "planning";

export interface CycleModeConfig {
  name: CycleMode;
  label: string;
  description: string;
}

export const CYCLE_MODES: Record<CycleMode, CycleModeConfig> = {
  research: {
    name: "research",
    label: "Research & Explore",
    description:
      "Deep-dive into a specific game system to understand how it works end-to-end. Best used when preparing for a major feature implementation. Read files, trace function calls, build mental models.",
  },
  patch: {
    name: "patch",
    label: "Patch & Modify",
    description:
      "Make code modifications — change data, tune gameplay values, modify game systems. Can range from focused edits to broad sweeping changes across many files.",
  },
  repair: {
    name: "repair",
    label: "Repair Build",
    description:
      "Fix build errors from UN-REVERTED previous changes still in the source tree. Do NOT use this mode if the previous cycle's changes were reverted — there is nothing to repair.",
  },
  refactor: {
    name: "refactor",
    label: "Refactor Code",
    description:
      "Reorganize or restructure code to prepare for future changes.",
  },
  feature: {
    name: "feature",
    label: "Feature Implementation",
    description:
      "Implement a significant gameplay change or new feature that may span multiple files and systems. This is where the ROM hack takes shape.",
  },
  planning: {
    name: "planning",
    label: "Plan & Strategize",
    description:
      "Design the game — develop a comprehensive vision, plan multi-cycle roadmaps, design game systems (encounter tables, difficulty curves, story beats, regional themes). Write detailed game design documents in strategy-notes.md.",
  },
};

/**
 * Returns true for modes that involve code/data changes and benefit from
 * a cost-optimised coding model (DeepSeek). Research and planning modes
 * stay on the Anthropic model for richer reasoning.
 */
export function isCodingMode(mode: CycleMode): boolean {
  return mode === "patch" || mode === "repair" || mode === "refactor" || mode === "feature";
}
