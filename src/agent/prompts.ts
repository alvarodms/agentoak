import type { Memory } from "../memory/types.js";
import { getMemorySummary } from "../memory/store.js";
import type { ValidationResult, ValidationStatus } from "../reflection/validator.js";
import type { IssueAction } from "../github/client.js";
import { formatAcceptedIssues, formatJournalContext } from "./prompt-sections.js";
import { PromptBuilder } from "./prompt-builder.js";
import { getReflectionPersonalityNudge } from "../config/personality.js";

/**
 * Build dynamic per-cycle context to append to the system prompt.
 *
 * Static instructions live in CLAUDE.md (loaded automatically by the CLI)
 * and in the phase's instruction fragments (see phases.ts). This function
 * only provides the per-cycle state: cycle number, mode, memory overview,
 * and recent journal digests.
 */
export function buildDynamicContext(
  memory: Memory,
  recentJournalDigests: string[],
  cycleNumber: number,
  modeLabel: string,
): string {
  return new PromptBuilder()
    .heading("Current State", `- **Cycle**: ${cycleNumber}\n- **Mode**: ${modeLabel}`)
    .heading("Current Memory", getMemorySummary(memory))
    .sectionIf(recentJournalDigests.length > 0, () =>
      `## Recent Journal Entries\n\n${formatJournalContext(recentJournalDigests)}`)
    .build();
}

type TaskMode = "patch" | "repair" | "refactor" | "feature" | "research" | "planning";

interface ModePromptConfig {
  planSectionLabel: string;
  intro: string;
  guidelines: string[];
}

const MODE_PROMPT_CONFIGS: Record<TaskMode, ModePromptConfig> = {
  patch: {
    planSectionLabel: "Implementation Plan",
    intro: "You are in the implementation phase. A planning agent has decided what changes to make — your job is to execute them precisely.",
    guidelines: [
      "Read the relevant files before editing. Understand the code and data structures first.",
      "Make all the changes described in the plan. Don't stop at one file if more are needed.",
      "When modifying data (encounters, trainers, items), think holistically — changes should be consistent across routes and progression.",
      "Do not run the full `make` — the pipeline builds after you finish and hands any errors to a build-fix agent. Cheap validators (`make check_all_quick`) are fine for early feedback.",
      "Update memory files with anything you discover — especially failure-patterns.md if you hit a tricky issue.",
    ],
  },
  repair: {
    planSectionLabel: "Build Errors / Repair Plan",
    intro: "You are in the repair phase. The build is broken and your only job is to fix it. Do NOT add features or make unrelated changes.",
    guidelines: [
      "Review the error list carefully. Identify the root cause before editing anything.",
      "Read the files mentioned in the errors to understand the context around each failure.",
      "Fix each error with targeted, minimal edits. Prefer the simplest correction that preserves intent.",
      "After fixing, run `make` in the pokeemerald/ directory to confirm the build passes.",
      "Record the failure pattern and its solution in memory/failure-patterns.md so future cycles avoid the same mistake.",
    ],
  },
  refactor: {
    planSectionLabel: "Refactoring Plan",
    intro: "You are in the refactoring phase. Your goal is to restructure or reorganize code while preserving existing behaviour.",
    guidelines: [
      "Read and understand the code you are restructuring before touching anything — the pokeemerald codebase is a decompilation with subtle constraints.",
      "Make incremental, safe changes. Preserve behaviour unless the plan explicitly calls for a behavioural change.",
      "Do not run the full `make` — the pipeline builds after you finish and hands any errors to a build-fix agent. Cheap validators (`make check_all_quick`) are fine for early feedback.",
      "Update codebase-facts.md with any structural insights you gain during the refactor.",
    ],
  },
  feature: {
    planSectionLabel: "Implementation Plan",
    intro: "You are in the feature implementation phase. A planning agent has designed what to build — your job is to implement it fully and cohesively.",
    guidelines: [
      "Break the feature into logical steps and work through them methodically.",
      "Read all relevant files before writing code. Understand existing patterns and conventions.",
      "Don't be timid — a real feature touches multiple files. Implement everything needed for the feature to feel complete.",
      "Do not run the full `make` — the pipeline builds after you finish and hands any errors to a build-fix agent. Cheap validators (`make check_all_quick`) are fine for early feedback.",
      "If the feature is too large to finish in one cycle, implement as much as possible and document remaining work in strategy-notes.md.",
      "Update codebase-facts.md with any new system knowledge and/or code base insights.",
    ],
  },
  research: {
    planSectionLabel: "Research Agenda",
    intro: "You are in the research phase. Your goal is deep exploration — understand a game system end-to-end so future cycles can confidently modify it.",
    guidelines: [
      "Don't just skim — go deep. Trace function calls, map data flows, understand every file involved in the system.",
      "Identify all constraints relevant to future modifications: what is safe to change, what is fragile, what depends on what.",
      "Do NOT modify any source files or run the build. Research only.",
      "Record detailed findings in memory/codebase-facts.md: specific file paths, function names, data structure layouts, offset tables, and any gotchas.",
      "Conclude by noting what a future implementation cycle would need to do, so the next cycle can act on your findings immediately.",
    ],
  },
  planning: {
    planSectionLabel: "Planning Agenda",
    intro: "You are in the planning phase. Think like a game designer: your job is to shape the vision for this ROM hack and create a concrete roadmap future cycles can execute against.",
    guidelines: [
      "Review memory/strategy-notes.md first — understand what has already been planned and what has shipped.",
      "Think holistically: what is the player experience from start to finish? What makes this hack unique and worth playing?",
      "Design specific systems where needed: encounter philosophy per area, trainer difficulty curve, story hooks, thematic elements.",
      "Write a detailed, actionable game design document in memory/strategy-notes.md. Future implementation cycles will use this as their marching orders, so be specific.",
      "Define a multi-cycle roadmap with dependencies and priorities. Name the next 3–5 cycles and what each one should accomplish.",
      "Do NOT modify source files or run the build. This is a design cycle.",
    ],
  },
};

/** Build a focused task prompt for the implementation phase (Phase 2) */
export function buildTaskPrompt(
  cycleNumber: number,
  objective: string,
  mode: string,
  implementationPlan?: string,
  acceptedIssues: IssueAction[] = [],
): string {
  const config = MODE_PROMPT_CONFIGS[mode as TaskMode] ?? MODE_PROMPT_CONFIGS.patch;
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return new PromptBuilder()
    .heading(`Cycle ${cycleNumber} — ${capitalize(mode)} Phase`, config.intro)
    .list("Guidelines", config.guidelines)
    .raw(`**Your task**: ${objective}`)
    .sectionIf(acceptedIssues.length > 0, () =>
      `## Accepted Community Issues\n\nThis cycle delivers on these issues. The plan below already covers them — they are listed so you know what the work is for.\n\n${formatAcceptedIssues(acceptedIssues)}`)
    .sectionIf(implementationPlan, () =>
      `## ${config.planSectionLabel}\n\n${implementationPlan}`)
    .heading("When You Finish",
      "Stop once your changes are made. Do NOT call the `/communicate` skill, update README.md, or output a CYCLE_COMPLETE marker — the reflection phase does that once the build is verified. End with a short plain summary of what you changed and anything you could not finish.")
    .raw("Begin your work now.")
    .build();
}

/** Build a prompt for the build-fix agent (Phase 3 repair loop) */
export function buildBuildFixPrompt(
  cycleNumber: number,
  errors: string[],
  stderr: string,
): string {
  const errorList = errors.length > 0
    ? errors.slice(0, 30).join("\n")
    : "(no parsed errors — see raw stderr below)";

  const stderrPreview = stderr
    ? stderr.split("\n").slice(0, 50).join("\n")
    : "(no stderr output)";

  return new PromptBuilder()
    .heading(`Cycle ${cycleNumber} — Build Fix Required`,
      "The build has FAILED. Your only job is to fix the build errors. Do NOT add features or make unrelated changes.")
    .heading("Parsed Errors", errorList, 3)
    .heading("Raw Build Output (stderr)", stderrPreview, 3)
    .numberedList("Instructions", [
      "Read the files mentioned in the errors to understand the context.",
      "Fix each error with targeted edits.",
      "Do NOT run `make` yourself — the pipeline will re-run it automatically after you finish.",
    ], 3)
    .raw("Focus only on fixing these errors. Nothing else.")
    .build();
}

/** Build a prompt for the validation-fix agent (Phase 3.5b retry loop) */
export function buildValidationFixPrompt(
  cycleNumber: number,
  mode: string,
  objective: string,
  validationStatus: Exclude<ValidationStatus, "verified">,
  warnings: string[],
  diffSummary: string,
  filesModified: string[],
): string {
  const statusExplanation = validationStatus === "unsubstantiated"
    ? "The implementation agent claimed to make changes, but **no pokeemerald/ files were actually modified**. The agent's work was unsubstantiated — it either hallucinated its edits or only modified memory/non-game files."
    : "The implementation agent made some changes, but key expected modifications are **missing or incomplete**. The validation check detected gaps between what was planned and what was actually delivered.";

  const warningList = warnings.length > 0
    ? warnings.map(w => `- ⚠ ${w}`).join("\n")
    : "(no specific warnings)";

  const fileList = filesModified.length > 0
    ? filesModified.join("\n")
    : "(no files were modified)";

  return new PromptBuilder()
    .heading(`Cycle ${cycleNumber} — Validation Fix Required`,
      `The previous implementation attempt was **${validationStatus.toUpperCase()}**.\n\n${statusExplanation}\n\nYour job is to **actually implement** the objective by making real edits to pokeemerald/ source files.`)
    .heading("Original Objective", objective, 3)
    .heading("Validation Warnings", warningList, 3)
    .heading("Actual Git Diff (ground truth)", `\`\`\`\n${diffSummary || "(no changes detected)"}\n\`\`\``, 3)
    .heading("Files Agent Claimed to Modify", fileList, 3)
    .numberedList("Instructions", [
      "Read the relevant pokeemerald/ files to understand the current state of the code.",
      "Make the actual edits needed to fulfil the objective. You MUST write/edit pokeemerald/ files.",
      "Do NOT run `make` — the pipeline will handle build verification after you finish.",
      "Do NOT produce a CYCLE_COMPLETE marker — just make the changes and stop.",
      "Focus on delivering the objective. Do not add unrelated features or refactors.",
    ], 3)
    .raw("Begin your work now. Make real, substantive changes to pokeemerald/ files.")
    .build();
}

/** Format a ValidationResult into a markdown section. */
function formatValidationSection(v: ValidationResult): string {
  const warnings = v.warnings.length > 0
    ? `**Warnings**:\n${v.warnings.map(w => `- ⚠ ${w}`).join("\n")}`
    : "No warnings.";
  return `## Validation Result\n\n**Status**: ${v.status.toUpperCase()}\n\n${warnings}\n\n**Git Diff Summary** (ground truth of actual changes):\n\`\`\`\n${v.diffSummary}\n\`\`\``;
}

/** Build the reflection prompt sent after the main agent loop */
export function buildReflectionPrompt(cycleContext: {
  cycleNumber: number;
  objective: string;
  actions: { tool: string; input: Record<string, unknown>; result: string }[];
  filesModified: string[];
  buildResult: { success: boolean; errors: string[] } | null;
  cycleSummary: string;
  validationResult?: ValidationResult | null;
  acceptedIssues?: IssueAction[];
}): string {
  const actionLog = cycleContext.actions
    .map((a, i) => `${i + 1}. ${a.tool}(${JSON.stringify(a.input).slice(0, 80)}) → ${a.result.slice(0, 100)}`)
    .join("\n");

  const buildInfo = cycleContext.buildResult
    ? `Build: ${cycleContext.buildResult.success ? "SUCCESS" : "FAILED"}\nErrors: ${cycleContext.buildResult.errors.join("; ") || "none"}`
    : "No build was attempted this cycle.";

  const acceptedIssues = cycleContext.acceptedIssues ?? [];
  const nudge = getReflectionPersonalityNudge();

  return new PromptBuilder()
    .raw(`Reflect on Cycle ${cycleContext.cycleNumber}.`)
    .heading("Objective", cycleContext.objective)
    .heading("Actions Taken", actionLog)
    .heading("Files Modified",
      cycleContext.filesModified.length > 0 ? cycleContext.filesModified.join("\n") : "None")
    .heading("Build Result", buildInfo)
    .heading("Implementation Agent's Summary", cycleContext.cycleSummary || "(none)")
    .sectionIf(cycleContext.validationResult, () =>
      formatValidationSection(cycleContext.validationResult!))
    .sectionIf(acceptedIssues.length > 0, () =>
      `## Accepted Community Issues\n\nReport an \`issue_outcomes\` entry for each of these.\n\n${formatAcceptedIssues(acceptedIssues)}`)
    .raw(`---

Work through these steps:

1. **Reflect** in plain text:
   1. **What did I attempt?** — the cycle's actual work
   2. **What assumptions did I make?** — were any wrong?
   3. **What evidence supports or contradicts them?** — cite specific files, errors, or observations
   4. **What did I learn about the codebase?** — new concrete facts
   5. **What should I try next?** — specific, actionable next steps
   6. **How does this cycle fit the larger game design?** — is the \`memory/strategy-notes.md\` roadmap still right? Think about the player experience holistically.${nudge ? `\n   7. **Personality check** — ${nudge}` : ""}

   **CRITICAL**: The Files Modified list and Git Diff are the ground truth, not the implementation agent's summary. If the objective called for game data changes (encounters, trainers, maps, etc.) and the relevant pokeemerald/ files are not in Files Modified, the cycle is **INCOMPLETE** — say so explicitly.
2. **Update memory** with what this cycle established: \`memory/strategy-notes.md\` (roadmap and design direction), \`memory/completed-work.md\` and its detail files (check the implementation agent recorded every modified file), \`memory/codebase-facts.md\`, \`memory/failure-patterns.md\`, \`memory/project-facts.md\`. Follow the memory budgets.
3. **Update README.md** if this cycle shipped something players should know about.
4. **Call the \`/communicate\` skill** to write the summary and next steps in Professor Oak's voice, and wait for it to return.
5. **Output the CYCLE_COMPLETE marker** as specified in your instructions, with \`summary\`, \`changes\`, \`next_steps\`${acceptedIssues.length > 0 ? ", \`issue_outcomes\`" : ""}, and \`version_bump\`/\`release_stage\` only if this cycle earned them.`)
    .build();
}
