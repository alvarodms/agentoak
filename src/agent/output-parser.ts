/**
 * Parse Claude Code CLI `--output-format json` output into a structured result.
 *
 * The CLI emits newline-delimited JSON (NDJSON) where each line is a message
 * object, OR a single JSON array containing all messages.
 */

export interface ClaudeCodeResult {
  actions: ActionRecord[];
  filesModified: string[];
  buildResult: { success: boolean; errors: string[] } | null;
  cycleSummary: string;
  nextSteps: string;
  tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number };
  toolCallCount: number;
  /** The text from the final "result" message (e.g. structured JSON from --json-schema) */
  resultText: string;
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
  let nextSteps = "";
  let toolCallCount = 0;
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
          try {
            const parsed = JSON.parse(markerMatch[1]) as {
              summary?: string;
              next_steps?: string;
            };
            cycleSummary = parsed.summary ?? cycleSummary;
            nextSteps = parsed.next_steps ?? nextSteps;
          } catch {
            // Malformed JSON in marker — ignore
          }
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

        // Detect build from Bash tool calls running `make`
        if (toolName === "Bash" && typeof input.command === "string") {
          const cmd = input.command as string;
          if (cmd.includes("make") && !cmd.includes("make_tools")) {
            // We'll update buildResult when we see the tool_result
            buildResult = { success: true, errors: [] }; // optimistic, overwritten below
          }
        }

        // Capture StructuredOutput tool input as resultText (--json-schema uses this tool)
        if (toolName === "StructuredOutput" && !resultText) {
          resultText = JSON.stringify(input);
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

  return {
    actions,
    filesModified: [...filesModified],
    buildResult,
    cycleSummary,
    nextSteps,
    tokenUsage: {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      totalTokens: totalInputTokens + totalOutputTokens,
    },
    toolCallCount,
    resultText,
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
