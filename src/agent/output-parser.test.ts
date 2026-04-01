import { describe, it, expect } from "vitest";
import { parseClaudeOutput } from "./output-parser.js";

/** Helper to build an NDJSON message line */
function msg(
  type: string,
  content?: unknown[],
  extra?: Record<string, unknown>,
): string {
  return JSON.stringify({ type, content, ...extra });
}

/** Helper to build a text content block */
function textBlock(text: string) {
  return { type: "text", text };
}

/** Helper to build a tool_use content block */
function toolUse(name: string, input: Record<string, unknown> = {}) {
  return { type: "tool_use", name, input };
}

/** Helper to build a tool_result content block */
function toolResult(content: string) {
  return { type: "tool_result", content };
}

describe("parseClaudeOutput", () => {
  // --- Basic parsing ---

  it("returns defaults for empty input", () => {
    const result = parseClaudeOutput("");
    expect(result.cycleSummary).toBe("");
    expect(result.cycleChanges).toEqual([]);
    expect(result.nextSteps).toBe("");
    expect(result.issueOutcomes).toEqual([]);
    expect(result.versionBump).toBeUndefined();
    expect(result.releaseStage).toBeUndefined();
    expect(result.actions).toEqual([]);
    expect(result.filesModified).toEqual([]);
    expect(result.buildResult).toBeNull();
    expect(result.toolCallCount).toBe(0);
    expect(result.tokenUsage.totalTokens).toBe(0);
  });

  it("returns defaults for whitespace-only input", () => {
    const result = parseClaudeOutput("   \n  \n  ");
    expect(result.actions).toEqual([]);
    expect(result.toolCallCount).toBe(0);
  });

  it("parses NDJSON format (one JSON object per line)", () => {
    const input = [
      msg("assistant", [textBlock("hello world - this is a long enough message to be considered")]),
      msg("assistant", [toolUse("Read", { file_path: "/tmp/test.ts" })]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.toolCallCount).toBe(1);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].tool).toBe("Read");
  });

  it("parses JSON array format", () => {
    const messages = [
      { type: "assistant", content: [toolUse("Read", { file_path: "/tmp/a.ts" })] },
      { type: "assistant", content: [toolUse("Write", { file_path: "/tmp/b.ts" })] },
    ];
    const result = parseClaudeOutput(JSON.stringify(messages));
    expect(result.toolCallCount).toBe(2);
  });

  it("skips non-JSON lines in NDJSON input", () => {
    const input = [
      "this is not json",
      msg("assistant", [toolUse("Read", { file_path: "/tmp/a.ts" })]),
      "another non-json line",
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.toolCallCount).toBe(1);
  });

  // --- CYCLE_COMPLETE marker ---

  it("extracts CYCLE_COMPLETE marker with all fields", () => {
    const marker = JSON.stringify({
      summary: "Did great stuff",
      changes: ["Added feature X", "Fixed bug Y"],
      next_steps: "Continue with Z",
      issue_outcomes: [{ number: 42, status: "complete" }],
      version_bump: "minor",
      release_stage: "Beta",
    });
    const input = msg("assistant", [
      textBlock(`Some text\n<!-- CYCLE_COMPLETE: ${marker} -->\nMore text`),
    ]);
    const result = parseClaudeOutput(input);
    expect(result.cycleSummary).toBe("Did great stuff");
    expect(result.cycleChanges).toEqual(["Added feature X", "Fixed bug Y"]);
    expect(result.nextSteps).toBe("Continue with Z");
    expect(result.issueOutcomes).toEqual([{ number: 42, status: "complete" }]);
    expect(result.versionBump).toBe("minor");
    expect(result.releaseStage).toBe("Beta");
  });

  it("handles CYCLE_COMPLETE with partial fields", () => {
    const marker = JSON.stringify({ summary: "Partial work" });
    const input = msg("assistant", [
      textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`),
    ]);
    const result = parseClaudeOutput(input);
    expect(result.cycleSummary).toBe("Partial work");
    expect(result.cycleChanges).toEqual([]);
    expect(result.nextSteps).toBe("");
    expect(result.issueOutcomes).toEqual([]);
    expect(result.versionBump).toBeUndefined();
    expect(result.releaseStage).toBeUndefined();
  });

  it("handles CYCLE_COMPLETE with malformed JSON gracefully", () => {
    const input = msg("assistant", [
      textBlock("<!-- CYCLE_COMPLETE: {this is not valid json} -->"),
    ]);
    const result = parseClaudeOutput(input);
    // Should not crash, fields stay default
    expect(result.cycleSummary).toBe("");
    expect(result.cycleChanges).toEqual([]);
  });

  // --- issue_outcomes ---

  it("parses complete and partial issue outcomes", () => {
    const marker = JSON.stringify({
      summary: "s",
      issue_outcomes: [
        { number: 1, status: "complete" },
        { number: 2, status: "partial", decision: "defer", reason: "needs more work" },
      ],
    });
    const input = msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`)]);
    const result = parseClaudeOutput(input);
    expect(result.issueOutcomes).toHaveLength(2);
    expect(result.issueOutcomes[0]).toEqual({ number: 1, status: "complete" });
    expect(result.issueOutcomes[1]).toEqual({
      number: 2,
      status: "partial",
      decision: "defer",
      reason: "needs more work",
    });
  });

  it("filters out invalid issue outcomes", () => {
    const marker = JSON.stringify({
      summary: "s",
      issue_outcomes: [
        { number: 1, status: "complete" },
        { status: "complete" }, // missing number
        { number: 3, status: "invalid_status" }, // wrong status
        null,
        "not an object",
      ],
    });
    const input = msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`)]);
    const result = parseClaudeOutput(input);
    expect(result.issueOutcomes).toHaveLength(1);
    expect(result.issueOutcomes[0].number).toBe(1);
  });

  it("parses item_outcomes for multi-item issues", () => {
    const marker = JSON.stringify({
      summary: "s",
      issue_outcomes: [
        {
          number: 42,
          status: "partial",
          decision: "defer",
          reason: "2 of 4 done",
          item_outcomes: [
            { label: "Bug A", status: "complete" },
            { label: "Bug B", status: "not-started", decision: "defer", reason: "later" },
          ],
        },
      ],
    });
    const input = msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`)]);
    const result = parseClaudeOutput(input);
    expect(result.issueOutcomes).toHaveLength(1);
    expect(result.issueOutcomes[0].itemOutcomes).toHaveLength(2);
    expect(result.issueOutcomes[0].itemOutcomes![0].label).toBe("Bug A");
    expect(result.issueOutcomes[0].itemOutcomes![1].status).toBe("not-started");
  });

  // --- version_bump and release_stage ---

  it("extracts version_bump 'major'", () => {
    const marker = JSON.stringify({ summary: "s", version_bump: "major" });
    const input = msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`)]);
    expect(parseClaudeOutput(input).versionBump).toBe("major");
  });

  it("ignores invalid version_bump values", () => {
    const marker = JSON.stringify({ summary: "s", version_bump: "patch" });
    const input = msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`)]);
    expect(parseClaudeOutput(input).versionBump).toBeUndefined();
  });

  it("ignores empty/whitespace-only release_stage", () => {
    const marker1 = JSON.stringify({ summary: "s", release_stage: "" });
    const input1 = msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker1} -->`)]);
    expect(parseClaudeOutput(input1).releaseStage).toBeUndefined();

    const marker2 = JSON.stringify({ summary: "s", release_stage: "   " });
    const input2 = msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker2} -->`)]);
    expect(parseClaudeOutput(input2).releaseStage).toBeUndefined();
  });

  // --- Tool call tracking ---

  it("counts tool calls correctly", () => {
    const input = [
      msg("assistant", [
        toolUse("Read", { file_path: "/a" }),
        toolUse("Write", { file_path: "/b" }),
      ]),
      msg("assistant", [toolUse("Bash", { command: "ls" })]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.toolCallCount).toBe(3);
  });

  it("tracks file modifications from Write/Edit/MultiEdit", () => {
    const input = [
      msg("assistant", [toolUse("Write", { file_path: "/tmp/a.ts" })]),
      msg("assistant", [toolUse("Edit", { file_path: "/tmp/b.ts" })]),
      msg("assistant", [toolUse("MultiEdit", { file_path: "/tmp/c.ts" })]),
      msg("assistant", [toolUse("Read", { file_path: "/tmp/d.ts" })]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.filesModified).toContain("/tmp/a.ts");
    expect(result.filesModified).toContain("/tmp/b.ts");
    expect(result.filesModified).toContain("/tmp/c.ts");
    expect(result.filesModified).not.toContain("/tmp/d.ts");
  });

  it("tracks file modifications from fetch_pokemon_sprites", () => {
    const input = msg("assistant", [
      toolUse("fetch_pokemon_sprites", { name: "Lucario" }),
    ]);
    const result = parseClaudeOutput(input);
    expect(result.filesModified).toHaveLength(7);
    expect(result.filesModified).toContain("pokeemerald/graphics/pokemon/lucario/front.png");
    expect(result.filesModified).toContain("pokeemerald/graphics/pokemon/lucario/normal.pal");
    expect(result.filesModified).toContain("pokeemerald/graphics/pokemon/lucario/shiny.pal");
  });

  it("deduplicates file modifications", () => {
    const input = [
      msg("assistant", [toolUse("Write", { file_path: "/tmp/a.ts" })]),
      msg("assistant", [toolUse("Edit", { file_path: "/tmp/a.ts" })]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.filesModified.filter((f) => f === "/tmp/a.ts")).toHaveLength(1);
  });

  // --- Build result detection ---

  it("detects successful build from make command", () => {
    const input = [
      msg("assistant", [toolUse("Bash", { command: "cd pokeemerald && make" })]),
      msg("assistant", [toolResult("make: Nothing to be done for 'all'.")]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.buildResult).not.toBeNull();
    expect(result.buildResult!.success).toBe(true);
  });

  it("detects failed build with errors", () => {
    const input = [
      msg("assistant", [toolUse("Bash", { command: "make" })]),
      msg("assistant", [
        toolResult(
          "make[1]: Entering directory\nsrc/main.c:10:5: error: undeclared identifier\nmake[1]: *** [target] Error 2",
        ),
      ]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.buildResult).not.toBeNull();
    expect(result.buildResult!.success).toBe(false);
    expect(result.buildResult!.errors.length).toBeGreaterThan(0);
  });

  it("does not detect build for make_tools commands", () => {
    const input = msg("assistant", [
      toolUse("Bash", { command: "make make_tools" }),
    ]);
    // make_tools is excluded from build detection
    // The command contains "make_tools" so the !cmd.includes("make_tools") check filters it
    // But it also contains "make" — let's verify the implementation's behavior
    const result = parseClaudeOutput(input);
    expect(result.buildResult).toBeNull();
  });

  // --- Token usage ---

  it("accumulates token usage from message usage fields", () => {
    const input = [
      msg("assistant", [textBlock("hello")], {
        usage: { input_tokens: 100, output_tokens: 50 },
      }),
      msg("assistant", [textBlock("world")], {
        usage: { input_tokens: 200, output_tokens: 75 },
      }),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.tokenUsage.inputTokens).toBe(300);
    expect(result.tokenUsage.outputTokens).toBe(125);
    expect(result.tokenUsage.totalTokens).toBe(425);
  });

  it("uses cumulative result usage when no per-message usage exists", () => {
    const input = msg("result", [textBlock("done")], {
      result: "final result",
      usage: { input_tokens: 500, output_tokens: 200 },
    });
    const result = parseClaudeOutput(input);
    expect(result.tokenUsage.inputTokens).toBe(500);
    expect(result.tokenUsage.outputTokens).toBe(200);
  });

  // --- Narrative text ---

  it("collects pre-marker text as narrative", () => {
    const longText =
      "This is a substantial piece of narrative text that describes what the agent did during this cycle in great detail.";
    const marker = JSON.stringify({ summary: "Done" });
    const input = [
      msg("assistant", [textBlock(longText)]),
      msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`)]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.narrativeText).toContain("substantial piece of narrative");
  });

  it("uses post-marker text as fallback summary when summary is empty", () => {
    const marker = JSON.stringify({ summary: "" });
    const longText =
      "This is a long post-marker text that the agent wrote after the CYCLE_COMPLETE marker as an Oak-voiced reflection.";
    const input = [
      msg("assistant", [textBlock(`<!-- CYCLE_COMPLETE: ${marker} -->`)]),
      msg("assistant", [textBlock(longText)]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    expect(result.cycleSummary).toContain("post-marker text");
  });

  // --- Result text ---

  it("captures result text from result-type messages", () => {
    const input = msg("result", [], { result: "the final answer" });
    const result = parseClaudeOutput(input);
    expect(result.resultText).toBe("the final answer");
  });

  it("filters out '(no content)' from result text", () => {
    const input = msg("result", [], { result: "(no content)" });
    const result = parseClaudeOutput(input);
    expect(result.resultText).toBe("");
  });

  // --- StructuredOutput merging ---

  it("merges StructuredOutput tool inputs into resultText", () => {
    const input = [
      msg("assistant", [toolUse("StructuredOutput", { mode: "research", objective: "test" })]),
      msg("assistant", [toolUse("StructuredOutput", { issueActions: [] })]),
    ].join("\n");
    const result = parseClaudeOutput(input);
    const parsed = JSON.parse(result.resultText);
    expect(parsed.mode).toBe("research");
    expect(parsed.objective).toBe("test");
    expect(parsed.issueActions).toEqual([]);
  });

  // --- Stream-json nested message format ---

  it("handles stream-json format with nested msg.message content", () => {
    const input = JSON.stringify({
      type: "assistant",
      message: {
        content: [textBlock("nested content that is long enough to be considered substantial text for narrative")],
        usage: { input_tokens: 42, output_tokens: 10 },
      },
    });
    const result = parseClaudeOutput(input);
    expect(result.tokenUsage.inputTokens).toBe(42);
    expect(result.tokenUsage.outputTokens).toBe(10);
  });
});
