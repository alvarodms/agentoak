import path from "path";
import type { ClaudeCodeResult } from "../agent/output-parser.js";
import type { CycleMode } from "../cycle/modes.js";
import { PROJECT_ROOT } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

export type ValidationStatus = "verified" | "unsubstantiated" | "incomplete";

export interface ValidationResult {
  status: ValidationStatus;
  warnings: string[];
  diffSummary: string;
}

export interface DiffStats {
  filesChanged: number;
  insertions: number;
  deletions: number;
  summary: string;
}

/** Modes that are expected to produce pokeemerald file changes */
const CODE_CHANGE_MODES: CycleMode[] = ["feature", "patch", "repair", "refactor"];

/**
 * Programmatic claim validator — cross-checks the agent's self-reported results
 * against actual git diff stats to detect hallucinated or incomplete work.
 *
 * Runs between implementation (Phase 2) and reflection (Phase 4).
 */
export function validateCycle(params: {
  mode: CycleMode;
  objective: string;
  implResult: ClaudeCodeResult;
  diffStats: DiffStats;
}): ValidationResult {
  const { mode, objective, implResult, diffStats } = params;
  const warnings: string[] = [];

  const expectsCodeChanges = CODE_CHANGE_MODES.includes(mode);

  // --- Check 1: File-objective consistency ---
  // If mode expects code changes, verify at least one pokeemerald file was modified
  if (expectsCodeChanges) {
    const pokeemeraldFiles = implResult.filesModified.filter((f) => {
      const rel = path.isAbsolute(f) ? path.relative(PROJECT_ROOT, f) : f;
      return rel.startsWith("pokeemerald/") || rel.startsWith("pokeemerald\\");
    });

    if (pokeemeraldFiles.length === 0) {
      warnings.push(
        `Mode is "${mode}" but no pokeemerald/ files were modified. ` +
        `Only modified: ${implResult.filesModified.length > 0 ? implResult.filesModified.join(", ") : "nothing"}.`,
      );
    }
  }

  // --- Check 2: Diff substance ---
  // If no actual lines changed in pokeemerald but the summary claims modifications
  if (expectsCodeChanges && diffStats.filesChanged === 0) {
    if (implResult.cycleSummary && implResult.cycleSummary.length > 20) {
      warnings.push(
        `Git diff shows 0 files changed in pokeemerald/, but the agent produced a detailed summary ` +
        `claiming work was done. The summary is likely unsubstantiated.`,
      );
    }
  }

  // --- Check 3: Action-log scan ---
  // Count write/edit actions vs read-only actions targeting pokeemerald
  if (expectsCodeChanges) {
    const writeTools = ["Write", "Edit", "MultiEdit"];
    const writeActions = implResult.actions.filter((a) => writeTools.includes(a.tool));
    const pokeemeraldWrites = writeActions.filter((a) => {
      const filePath = (a.input?.file_path as string) ?? "";
      return filePath.includes("pokeemerald");
    });

    if (pokeemeraldWrites.length === 0 && implResult.actions.length > 0) {
      warnings.push(
        `Agent performed ${implResult.actions.length} tool calls but none were write/edit operations ` +
        `on pokeemerald/ files. This looks like research-only execution on a "${mode}" objective.`,
      );
    }
  }

  // --- Determine status ---
  let status: ValidationStatus;
  if (warnings.length === 0) {
    status = "verified";
  } else if (
    expectsCodeChanges &&
    diffStats.filesChanged === 0
  ) {
    // No actual code changes on a code-change mode = unsubstantiated
    status = "unsubstantiated";
  } else {
    status = "incomplete";
  }

  if (warnings.length > 0) {
    logger.warn(`Validation: ${status.toUpperCase()} — ${warnings.length} warning(s)`);
    for (const w of warnings) {
      logger.warn(`  ⚠ ${w}`);
    }
  } else {
    logger.info("Validation: VERIFIED — no issues detected");
  }

  return {
    status,
    warnings,
    diffSummary: diffStats.summary,
  };
}
