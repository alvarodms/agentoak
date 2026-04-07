import { describe, it, expect } from "vitest";
import { unifiedDiff } from "./diff.js";

describe("unifiedDiff", () => {
  it("returns empty string for identical inputs", () => {
    const text = '{\n  "a": 1\n}';
    expect(unifiedDiff(text, text, "test.json")).toBe("");
  });

  it("shows added lines", () => {
    const old = '{\n  "a": 1\n}';
    const neu = '{\n  "a": 1,\n  "b": 2\n}';
    const diff = unifiedDiff(old, neu, "test.json");

    expect(diff).toContain("--- a/test.json");
    expect(diff).toContain("+++ b/test.json");
    expect(diff).toContain("@@");
    expect(diff).toContain('+  "b": 2');
  });

  it("shows removed lines", () => {
    const old = '{\n  "a": 1,\n  "b": 2\n}';
    const neu = '{\n  "a": 1\n}';
    const diff = unifiedDiff(old, neu, "test.json");

    expect(diff).toContain('-  "b": 2');
  });

  it("shows modified lines as remove+add", () => {
    const old = '{\n  "weather": "WEATHER_NONE"\n}';
    const neu = '{\n  "weather": "WEATHER_RAIN"\n}';
    const diff = unifiedDiff(old, neu, "map.json");

    expect(diff).toContain('-  "weather": "WEATHER_NONE"');
    expect(diff).toContain('+  "weather": "WEATHER_RAIN"');
  });

  it("includes context lines around changes", () => {
    const lines = [];
    for (let i = 0; i < 20; i++) lines.push(`  "line${i}": ${i}`);
    const oldLines = ["{", ...lines, "}"].join("\n");

    const modifiedLines = [...lines];
    modifiedLines[10] = '  "line10": 999';
    const newLines = ["{", ...modifiedLines, "}"].join("\n");

    const diff = unifiedDiff(oldLines, newLines, "big.json", 3);

    // The hunk should contain context but not the entire file
    const diffLines = diff.split("\n");
    const contextLines = diffLines.filter((l) => l.startsWith(" "));
    // Should have at most 6 context lines (3 before + 3 after the change)
    expect(contextLines.length).toBeLessThanOrEqual(6);

    expect(diff).toContain('-  "line10": 10');
    expect(diff).toContain('+  "line10": 999');
  });

  it("handles appending to an array (typical event add)", () => {
    const old = JSON.stringify(
      {
        object_events: [{ local_id: "1", x: 0, y: 0 }],
      },
      null,
      2,
    );
    const neu = JSON.stringify(
      {
        object_events: [
          { local_id: "1", x: 0, y: 0 },
          { local_id: "2", x: 5, y: 5 },
        ],
      },
      null,
      2,
    );
    const diff = unifiedDiff(old, neu, "TestMap/map.json");

    expect(diff).toContain("+");
    expect(diff).toContain("local_id");
    // The new event lines should appear as additions
    const addedLines = diff.split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++"));
    expect(addedLines.length).toBeGreaterThan(0);
  });

  it("handles complete replacement", () => {
    const diff = unifiedDiff("old content", "new content", "f.txt");
    expect(diff).toContain("-old content");
    expect(diff).toContain("+new content");
  });
});
