/**
 * Parse Claude Code CLI `--output-format json` output into a structured result.
 *
 * The CLI emits newline-delimited JSON (NDJSON) where each line is a message
 * object, OR a single JSON array containing all messages.
 */

import { getSpriteGraphicsSubpath } from "../mcp/sprite-fetcher.js";

/**
 * Per-issue delivery outcome reported by the implementation agent in CYCLE_COMPLETE.
 *
 * The agent must include an entry for every accepted issue.
 * - "complete": the issue was fully implemented; the runner will close it.
 * - "partial": the implementation only partially addressed the issue.
 *   The agent must also set `decision` ("defer" to keep it open for a future
 *   cycle, or "reject" to close it without completing the work) and `reason`
 *   (a plain-English explanation posted as a comment on the issue).
 */
/** Per-item delivery outcome for multi-item issues. */
export interface IssueItemOutcome {
  label: string;
  status: "complete" | "partial" | "not-started";
  decision?: "defer" | "reject";
  reason?: string;
}

export interface IssueOutcome {
  number: number;
  status: "complete" | "partial";
  decision?: "defer" | "reject";
  reason?: string;
  /** Optional per-item outcomes for multi-item issues. */
  itemOutcomes?: IssueItemOutcome[];
}

export interface ClaudeCodeResult {
  actions: ActionRecord[];
  filesModified: string[];
  buildResult: { success: boolean; errors: string[] } | null;
  cycleSummary: string;
  /** Structured changelog entries for the release (e.g. ["Reduced TM prices", "Added held items"]) */
  cycleChanges: string[];
  nextSteps: string;
  /**
   * Delivery outcomes for accepted issues, keyed by issue number.
   * Populated from the issueOutcomes field in the CYCLE_COMPLETE marker.
   * Issues not listed here are treated as fully complete (backward compat).
   */
  issueOutcomes: IssueOutcome[];
  /**
   * Optional version bump declared by the agent in the CYCLE_COMPLETE marker.
   * "major": increment major, reset minor to 0.
   * "minor": increment minor, keep major unchanged.
   * Omitted: no change to major/minor (normal patch release).
   */
  versionBump?: "major" | "minor";
  /**
   * Optional release stage label declared by the agent in the CYCLE_COMPLETE marker.
   * When set, overrides the auto-computed stage in the GitHub release name.
   * Examples: "Alpha", "Beta", "Demo", "Stable", "Chapter 1"
   */
  releaseStage?: string;
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number };
  toolCallCount: number;
  /** The text from the final "result" message (e.g. structured JSON from --json-schema) */
  resultText: string;
  /** Narrative text the agent wrote (pre-CYCLE_COMPLETE); useful as reflection body */
  narrativeText: string;
}

export interface ActionRecord {
  tool: string;
  input: Record<string, unknown>;
  result: string;
  timestamp: string;
}

/** Parse raw CLI output (NDJSON or JSON array) into a structured result */
export function parseClaudeOutput(rawOutput: string): ClaudeCodeResult {
  const messages = parseMessages(rawOutput);

  const actions: ActionRecord[] = [];
  const filesModified = new Set<string>();
  let buildResult: { success: boolean; errors: string[] } | null = null;
  let cycleSummary = "";
  let cycleChanges: string[] = [];
  let nextSteps = "";
  let issueOutcomes: IssueOutcome[] = [];
  let versionBump: "major" | "minor" | undefined;
  let releaseStage: string | undefined;
  let toolCallCount = 0;
  let cycleMarkerFound = false;
  const preMarkerTexts: string[] = [];
  const postMarkerTexts: string[] = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let resultText = "";

  for (const msg of messages) {
    // Normalize stream-json format: content and usage are nested under msg.message
    const inner = msg.message as Record<string, unknown> | undefined;
    if (inner && typeof inner === "object") {
      if (inner.content && !msg.content) msg.content = inner.content;
      if (inner.usage && !msg.usage) msg.usage = inner.usage;
    }

    // Capture the "result" field from result-type messages (structured output via --json-schema)
    // Only use it if it contains actual content (not "(no content)" placeholder)
    if (msg.type === "result" && typeof msg.result === "string") {
      const r = msg.result.trim();
      if (r && r !== "(no content)") {
        resultText = r;
      }
    }
    // Accumulate token usage from usage fields
    if (msg.usage && typeof msg.usage === "object") {
      const usage = msg.usage as Record<string, number>;
      totalInputTokens += usage.input_tokens ?? 0;
      totalOutputTokens += usage.output_tokens ?? 0;
    }

    // Also capture total usage from result messages (stream-json puts cumulative usage here)
    if (msg.type === "result") {
      const resultUsage = msg.usage as Record<string, number> | undefined;
      if (resultUsage?.input_tokens || resultUsage?.output_tokens) {
        // Result usage is cumulative — use it if we haven't accumulated anything yet
        if (totalInputTokens === 0 && totalOutputTokens === 0) {
          totalInputTokens = resultUsage.input_tokens ?? 0;
          totalOutputTokens = resultUsage.output_tokens ?? 0;
        }
      }
    }

    const content = msg.content;
    if (!Array.isArray(content)) continue;

    for (const block of content as Array<Record<string, unknown>>) {
      // Extract CYCLE_COMPLETE marker from text blocks
      if (block.type === "text" && typeof block.text === "string") {
        const markerMatch = block.text.match(
          /<!--\s*CYCLE_COMPLETE:\s*(\{.*?\})\s*-->/s,
        );
        if (markerMatch) {
          cycleMarkerFound = true;
          try {
            const parsed = JSON.parse(markerMatch[1]) as {
              summary?: string;
              changes?: string[];
              next_steps?: string;
              issue_outcomes?: IssueOutcome[];
              version_bump?: string;
              release_stage?: string;
            };
            cycleSummary = parsed.summary ?? cycleSummary;
            if (Array.isArray(parsed.changes) && parsed.changes.length > 0) {
              cycleChanges = parsed.changes.filter((c): c is string => typeof c === "string");
            }
            nextSteps = parsed.next_steps ?? nextSteps;
            if (Array.isArray(parsed.issue_outcomes) && parsed.issue_outcomes.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              issueOutcomes = (parsed.issue_outcomes as any[])
                .filter(
                  (o) =>
                    o !== null &&
                    typeof o === "object" &&
                    typeof o.number === "number" &&
                    (o.status === "complete" || o.status === "partial"),
                )
                .map((o): IssueOutcome => ({
                  number: o.number as number,
                  status: o.status as "complete" | "partial",
                  decision: o.decision as "defer" | "reject" | undefined,
                  reason: o.reason as string | undefined,
                  itemOutcomes: Array.isArray(o.item_outcomes)
                    ? (o.item_outcomes as IssueItemOutcome[])
                    : undefined,
                }));
            }
            if (parsed.version_bump === "major" || parsed.version_bump === "minor") {
              versionBump = parsed.version_bump;
            }
            if (typeof parsed.release_stage === "string" && parsed.release_stage.trim()) {
              releaseStage = parsed.release_stage.trim();
            }
          } catch {
            // Malformed JSON in marker — ignore
          }
          // Also capture any text in this block that comes before the marker
          const beforeMarker = block.text.slice(0, markerMatch.index).trim();
          if (beforeMarker.length > 50) {
            preMarkerTexts.push(beforeMarker);
          }
        } else if (cycleMarkerFound && block.text.trim().length > 50) {
          // Capture substantial text after the CYCLE_COMPLETE marker as
          // fallback summary (e.g. when Oak-voiced text comes in a later turn)
          postMarkerTexts.push(block.text.trim());
        } else if (!cycleMarkerFound && block.text.trim().length > 50) {
          // Capture substantial text before the CYCLE_COMPLETE marker as
          // the narrative reflection body
          preMarkerTexts.push(block.text.trim());
        }
      }

      // Track tool_use blocks
      if (block.type === "tool_use" && block.name) {
        toolCallCount++;
        const input = (block.input as Record<string, unknown>) ?? {};

        actions.push({
          tool: block.name as string,
          input,
          result: "", // Result comes in a separate tool_result message
          timestamp: new Date().toISOString(),
        });

        // Track file modifications from Write/Edit/MultiEdit
        const toolName = block.name as string;
        if (
          ["Write", "Edit", "MultiEdit"].includes(toolName) &&
          typeof input.file_path === "string"
        ) {
          filesModified.add(input.file_path);
        }

        // Track files created by fetch_pokemon_sprites MCP tool
        if (toolName === "fetch_pokemon_sprites" && typeof input.name === "string") {
          const outDir =
            typeof input.output_dir === "string" ? input.output_dir : undefined;
          const subpath = getSpriteGraphicsSubpath(input.name, outDir);
          if (subpath !== null) {
            const spriteDir = `pokeemerald/graphics/pokemon/${subpath}`;
            for (const f of [
              "anim_front.png", "front.png", "back.png",
              "icon.png", "footprint.png", "normal.pal", "shiny.pal",
            ]) {
              filesModified.add(`${spriteDir}/${f}`);
            }
          }
        }

        // Detect build from Bash tool calls running `make`
        if (toolName === "Bash" && typeof input.command === "string") {
          const cmd = input.command as string;
          if (cmd.includes("make") && !cmd.includes("make_tools")) {
            // We'll update buildResult when we see the tool_result
            buildResult = { success: true, errors: [] }; // optimistic, overwritten below
          }
        }

        // Capture StructuredOutput tool input as resultText (--json-schema uses this tool)
        // Merge all StructuredOutput inputs — Claude sometimes splits across multiple calls
        if (toolName === "StructuredOutput") {
          try {
            const existing = resultText ? JSON.parse(resultText) : {};
            Object.assign(existing, input);
            resultText = JSON.stringify(existing);
          } catch {
            if (!resultText) {
              resultText = JSON.stringify(input);
            }
          }
        }
      }

      // Track tool_result blocks to fill in action results and build status
      if (block.type === "tool_result" && typeof block.content === "string") {
        const resultText = block.content;

        // Update the last matching action's result
        if (actions.length > 0) {
          const lastAction = actions[actions.length - 1];
          if (!lastAction.result) {
            lastAction.result =
              resultText.length > 500
                ? resultText.slice(0, 500) + "...(truncated)"
                : resultText;
          }
        }

        // Detect build result from make output
        if (
          resultText.includes("make") &&
          (resultText.includes("Error") || resultText.includes("error:"))
        ) {
          const errors = resultText
            .split("\n")
            .filter((l) => /error:/i.test(l))
            .slice(0, 30);
          buildResult = { success: false, errors };
        }
      }
    }
  }

  // Fallback: if the CYCLE_COMPLETE marker had an empty summary but Claude
  // output substantial text afterward (e.g. the Oak-voiced summary came in
  // a later turn), use the longest post-marker text block as the summary.
  if (!cycleSummary && postMarkerTexts.length > 0) {
    cycleSummary = postMarkerTexts.reduce((a, b) => (a.length >= b.length ? a : b));
  }

  // Narrative text: the agent's substantive writing before the CYCLE_COMPLETE marker.
  // Falls back to post-marker text if nothing was written before the marker.
  const allNarrativeTexts = preMarkerTexts.length > 0 ? preMarkerTexts : postMarkerTexts;
  const narrativeText = allNarrativeTexts.join("\n\n");

  return {
    actions,
    filesModified: [...filesModified],
    buildResult,
    cycleSummary,
    cycleChanges,
    nextSteps,
    issueOutcomes,
    versionBump,
    releaseStage,
    tokenUsage: {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      totalTokens: totalInputTokens + totalOutputTokens,
    },
    toolCallCount,
    resultText,
    narrativeText,
  };
}

/** Parse NDJSON lines or a JSON array from raw output */
function parseMessages(raw: string): Array<Record<string, unknown>> {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // Try parsing as a single JSON array first
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed) as unknown[];
      return arr.filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object",
      );
    } catch {
      // Fall through to NDJSON parsing
    }
  }

  // Parse as NDJSON (one JSON object per line)
  const messages: Array<Record<string, unknown>> = [];
  for (const line of trimmed.split("\n")) {
    const l = line.trim();
    if (!l) continue;
    try {
      const parsed = JSON.parse(l) as unknown;
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        messages.push(parsed as Record<string, unknown>);
      }
    } catch {
      // Skip non-JSON lines
    }
  }
  return messages;
}
