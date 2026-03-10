import fs from "fs";
import path from "path";
import { JOURNAL_DIR } from "../utils/paths.js";
import { logger } from "../utils/logger.js";
import type { ActionRecord } from "../agent/output-parser.js";
import type { CycleMode } from "../cycle/modes.js";
import type { TokenUsage } from "../memory/types.js";
import type { IssueAction, HelpRequest } from "../github/client.js";

export interface JournalData {
  cycleNumber: number;
  mode: CycleMode;
  objective: string;
  reasoning: string;
  actions: ActionRecord[];
  filesModified: string[];
  buildResult: { success: boolean; errors: string[] } | null;
  cycleSummary: string;
  nextSteps: string;
  reflectionText: string;
  tokenUsage: TokenUsage;
  toolCallCount: number;
  issueActions?: IssueAction[];
  helpRequests?: HelpRequest[];
  validationWarnings?: string[];
  validationStatus?: string;
}

/** Write a journal entry for a completed cycle */
export function writeJournalEntry(data: JournalData): string {
  fs.mkdirSync(JOURNAL_DIR, { recursive: true });

  const paddedNumber = String(data.cycleNumber).padStart(4, "0");
  const filename = `cycle-${paddedNumber}.md`;
  const filePath = path.join(JOURNAL_DIR, filename);
  const timestamp = new Date().toISOString();

  const fileList =
    data.filesModified.length > 0
      ? data.filesModified.map((f) => `- ${f}`).join("\n")
      : "No files modified.";

  const buildSection = data.buildResult
    ? `**Result**: ${data.buildResult.success ? "✅ SUCCESS" : "❌ FAILED"}\n\n${
        data.buildResult.errors.length > 0
          ? "**Errors**:\n" + data.buildResult.errors.map((e) => `- ${e}`).join("\n")
          : "No errors."
      }`
    : "No build was attempted this cycle.";

  const issueSection = formatIssueSection(data.issueActions, data.helpRequests);
  const validationSection = formatValidationSection(data.validationWarnings, data.validationStatus);

  const content = `# Cycle ${paddedNumber}

**Date**: ${timestamp}  
**Mode**: ${data.mode}  
**Objective**: ${data.objective}  

## Reasoning

${data.reasoning}
${issueSection}
## Files Modified

${fileList}

## Build Result

${buildSection}

## Summary

${data.cycleSummary || "No summary provided."}
${validationSection}
## Reflection

${data.reflectionText || "No reflection generated."}

## Next Steps

${data.nextSteps || "No next steps specified."}

## Stats

- Tokens used: ${data.tokenUsage.totalTokens.toLocaleString()} (input: ${data.tokenUsage.inputTokens.toLocaleString()}, output: ${data.tokenUsage.outputTokens.toLocaleString()})
`;

  fs.writeFileSync(filePath, content, "utf-8");
  logger.info(`Journal entry written: ${filename}`);
  return filename;
}

/** Get the current cycle number by counting existing journal entries */
export function getNextCycleNumber(): number {
  if (!fs.existsSync(JOURNAL_DIR)) return 1;
  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.match(/^cycle-\d{4}\.md$/));
  return files.length + 1;
}

/** Read recent journal entries as text summaries */
export function getRecentJournalSummaries(count: number): string[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];

  const files = fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.match(/^cycle-\d{4}\.md$/))
    .sort()
    .slice(-count);

  return files.map((f) => {
    const content = fs.readFileSync(path.join(JOURNAL_DIR, f), "utf-8");
    // Return a truncated version for context
    if (content.length > 3000) {
      return content.slice(0, 3000) + "\n\n...(truncated)";
    }
    return content;
  });
}

/** Format the Community Issues section for the journal entry */
function formatIssueSection(
  issueActions?: IssueAction[],
  helpRequests?: HelpRequest[],
): string {
  const hasIssues = issueActions && issueActions.length > 0;
  const hasHelp = helpRequests && helpRequests.length > 0;
  if (!hasIssues && !hasHelp) return "\n";

  const parts: string[] = ["\n## Community Issues\n"];

  if (hasIssues) {
    parts.push("### Issue Actions\n");
    for (const action of issueActions) {
      parts.push(`- **#${action.issueNumber}** — ${action.action}: ${action.response.slice(0, 120)}${action.response.length > 120 ? "..." : ""}`);
    }
    parts.push("");
  }

  if (hasHelp) {
    parts.push("### Help Requests Created\n");
    for (const hr of helpRequests) {
      parts.push(`- **${hr.title}**: ${hr.body.slice(0, 120)}${hr.body.length > 120 ? "..." : ""}`);
    }
    parts.push("");
  }

  return parts.join("\n");
}

/** Format the Validation Warnings section for the journal entry */
function formatValidationSection(
  warnings?: string[],
  status?: string,
): string {
  if (!warnings || warnings.length === 0) return "\n";

  const parts: string[] = [
    "\n## Validation Warnings\n",
    `**Status**: ${(status ?? "unknown").toUpperCase()}\n`,
  ];

  for (const warning of warnings) {
    parts.push(`- ⚠ ${warning}`);
  }
  parts.push("");

  return parts.join("\n");
}
