import type { Memory } from "../memory/types.js";
import { getMemorySummary } from "../memory/store.js";

/**
 * Build dynamic per-cycle context to append to the system prompt.
 *
 * Static instructions (identity, safety rules, repo layout, build system,
 * memory system docs) live in CLAUDE.md and are loaded automatically by
 * the Claude Code CLI. This function only provides the per-cycle dynamic
 * state: cycle number, mode, memory contents, and recent journal entries.
 */
export function buildDynamicContext(
  memory: Memory,
  recentJournalSummaries: string[],
  cycleNumber: number,
  modeDescription: string,
): string {
  const memorySummary = getMemorySummary(memory);
  const journalContext =
    recentJournalSummaries.length > 0
      ? recentJournalSummaries.join("\n\n---\n\n")
      : "No previous cycles yet. This is the first cycle.";

  return `## Current State

- **Cycle**: ${cycleNumber}
- **Mode**: ${modeDescription}

## Current Memory

${memorySummary}

## Recent Journal Entries

${journalContext}`;
}

/** Build a focused task prompt for the implementation phase (Phase 2) */
export function buildTaskPrompt(
  cycleNumber: number,
  objective: string,
  reasoning: string,
  mode: string,
): string {
  return `## Cycle ${cycleNumber} — Implementation Phase

**Your task**: ${objective}

**Mode**: ${mode}

**Reasoning**: ${reasoning}

You are in the implementation phase. A planning agent has already decided what to work on — your job is to execute this task.

Guidelines:
- Focus exclusively on this task. Do not plan other work or diverge.
- Read relevant files before making changes. Understand the code first.
- Make targeted, surgical edits. Change the minimum needed.
- If you modify code, run \`make\` in the pokeemerald/ directory to verify your changes compile.
- Update your memory files with anything you learn or discover.
- When you are done, output the CYCLE_COMPLETE marker with a summary.

Begin your work now.`;
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

  return `## Cycle ${cycleNumber} — Build Fix Required

The build has FAILED. Your only job is to fix the build errors. Do NOT add features or make unrelated changes.

### Parsed Errors
${errorList}

### Raw Build Output (stderr)
${stderrPreview}

### Instructions
1. Read the files mentioned in the errors to understand the context.
2. Fix each error with targeted edits.
3. After fixing, output the CYCLE_COMPLETE marker to report what you changed.

Do NOT run \`make\` yourself — the pipeline will re-run it automatically after you finish.
Focus only on fixing these errors. Nothing else.`;
}

/** Build the reflection prompt sent after the main agent loop */
export function buildReflectionPrompt(cycleContext: {
  cycleNumber: number;
  objective: string;
  actions: { tool: string; input: Record<string, unknown>; result: string }[];
  filesModified: string[];
  buildResult: { success: boolean; errors: string[] } | null;
  cycleSummary: string;
}): string {
  const actionLog = cycleContext.actions
    .map((a, i) => `${i + 1}. ${a.tool}(${JSON.stringify(a.input).slice(0, 80)}) → ${a.result.slice(0, 100)}`)
    .join("\n");

  const buildInfo = cycleContext.buildResult
    ? `Build: ${cycleContext.buildResult.success ? "SUCCESS" : "FAILED"}\nErrors: ${cycleContext.buildResult.errors.join("; ") || "none"}`
    : "No build was attempted this cycle.";

  return `Reflect on Cycle ${cycleContext.cycleNumber}.

## Objective
${cycleContext.objective}

## Actions Taken
${actionLog}

## Files Modified
${cycleContext.filesModified.length > 0 ? cycleContext.filesModified.join("\n") : "None"}

## Build Result
${buildInfo}

## Agent Summary
${cycleContext.cycleSummary}

---

Please provide a structured reflection:

1. **What did I attempt?** — Brief description of the cycle's actual work
2. **What assumptions did I make?** — Were any of them wrong?
3. **What evidence supports or contradicts my assumptions?** — Cite specific files, errors, or observations
4. **What did I learn about the codebase?** — New concrete facts
5. **What should I try next?** — Specific, actionable next steps

Update the memory files in the memory/ directory as needed:
- memory/codebase-facts.md — new codebase facts
- memory/failure-patterns.md — new failure patterns
- memory/strategy-notes.md — strategy updates
- memory/project-facts.md — project facts

When done reflecting, output the CYCLE_COMPLETE marker with your summary.`;
}
