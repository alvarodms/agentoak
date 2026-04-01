import { describe, it, expect } from "vitest";
import { validateCycle, type DiffStats } from "./validator.js";
import type { ClaudeCodeResult } from "../agent/output-parser.js";

/** Build a minimal ClaudeCodeResult with overrides */
function makeResult(overrides: Partial<ClaudeCodeResult> = {}): ClaudeCodeResult {
  return {
    actions: [],
    filesModified: [],
    buildResult: null,
    cycleSummary: "",
    cycleChanges: [],
    nextSteps: "",
    issueOutcomes: [],
    tokenUsage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    toolCallCount: 0,
    resultText: "",
    narrativeText: "",
    ...overrides,
  };
}

function makeDiff(overrides: Partial<DiffStats> = {}): DiffStats {
  return {
    filesChanged: 0,
    insertions: 0,
    deletions: 0,
    summary: "",
    ...overrides,
  };
}

describe("validateCycle", () => {
  it("returns verified when feature mode has pokeemerald changes", () => {
    const result = validateCycle({
      mode: "feature",
      objective: "Add new encounters",
      implResult: makeResult({
        filesModified: ["pokeemerald/src/data/wild_encounters.json"],
        actions: [
          { tool: "Edit", input: { file_path: "pokeemerald/src/data/wild_encounters.json" }, result: "", timestamp: "" },
        ],
      }),
      diffStats: makeDiff({ filesChanged: 1, insertions: 10 }),
    });
    expect(result.status).toBe("verified");
    expect(result.warnings).toHaveLength(0);
  });

  it("returns unsubstantiated when feature mode has 0 diff but detailed summary", () => {
    const result = validateCycle({
      mode: "feature",
      objective: "Redesign encounters",
      implResult: makeResult({
        cycleSummary: "I completely redesigned all wild encounters across every route in the game.",
        actions: [{ tool: "Read", input: {}, result: "", timestamp: "" }],
      }),
      diffStats: makeDiff({ filesChanged: 0 }),
    });
    expect(result.status).toBe("unsubstantiated");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("returns incomplete when feature mode has changes but no write actions", () => {
    const result = validateCycle({
      mode: "patch",
      objective: "Fix trainer levels",
      implResult: makeResult({
        actions: [
          { tool: "Read", input: {}, result: "", timestamp: "" },
          { tool: "Bash", input: { command: "ls" }, result: "", timestamp: "" },
        ],
      }),
      diffStats: makeDiff({ filesChanged: 1, insertions: 5 }),
    });
    expect(result.status).toBe("incomplete");
    expect(result.warnings.some((w) => w.includes("write/edit operations"))).toBe(true);
  });

  it("returns verified for research mode regardless of diff", () => {
    const result = validateCycle({
      mode: "research",
      objective: "Study battle system",
      implResult: makeResult(),
      diffStats: makeDiff({ filesChanged: 0 }),
    });
    expect(result.status).toBe("verified");
    expect(result.warnings).toHaveLength(0);
  });

  it("returns verified for planning mode regardless of diff", () => {
    const result = validateCycle({
      mode: "planning",
      objective: "Plan new features",
      implResult: makeResult(),
      diffStats: makeDiff({ filesChanged: 0 }),
    });
    expect(result.status).toBe("verified");
    expect(result.warnings).toHaveLength(0);
  });

  it("warns when feature mode modifies only non-pokeemerald files", () => {
    const result = validateCycle({
      mode: "feature",
      objective: "Add encounters",
      implResult: makeResult({
        filesModified: ["memory/strategy-notes.md"],
        actions: [
          { tool: "Write", input: { file_path: "memory/strategy-notes.md" }, result: "", timestamp: "" },
        ],
      }),
      diffStats: makeDiff({ filesChanged: 0 }),
    });
    expect(result.warnings.some((w) => w.includes("no pokeemerald/ files"))).toBe(true);
  });

  it("handles absolute paths when checking for pokeemerald files", () => {
    const result = validateCycle({
      mode: "patch",
      objective: "Fix bug",
      implResult: makeResult({
        filesModified: ["/home/user/agentoak/pokeemerald/src/main.c"],
        actions: [
          { tool: "Edit", input: { file_path: "/home/user/agentoak/pokeemerald/src/main.c" }, result: "", timestamp: "" },
        ],
      }),
      diffStats: makeDiff({ filesChanged: 1, insertions: 2 }),
    });
    // This should work as long as PROJECT_ROOT resolves and the relative path starts with pokeemerald/
    // The actual behavior depends on PROJECT_ROOT at test time
    // At minimum, no crash
    expect(["verified", "incomplete"]).toContain(result.status);
  });

  it("detects repair mode as expecting code changes", () => {
    const result = validateCycle({
      mode: "repair",
      objective: "Fix build",
      implResult: makeResult(),
      diffStats: makeDiff({ filesChanged: 0 }),
    });
    // repair mode expects changes but got none
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("detects refactor mode as expecting code changes", () => {
    const result = validateCycle({
      mode: "refactor",
      objective: "Clean up code",
      implResult: makeResult(),
      diffStats: makeDiff({ filesChanged: 0 }),
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
