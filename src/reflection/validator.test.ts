import { describe, it, expect } from "vitest";
import { validateCycle } from "./validator.js";
import type { ChangeSet } from "../repo/game-tree.js";
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

/** A change set touching the given game-tree files */
function changeSetOf(...files: string[]): ChangeSet {
  return {
    files,
    stats: { filesChanged: files.length, insertions: files.length, deletions: 0, summary: "" },
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
      changeSet: changeSetOf("pokeemerald/src/data/wild_encounters.json"),
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
      changeSet: changeSetOf(),
    });
    expect(result.status).toBe("unsubstantiated");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("returns verified when the game tree changed through Bash rather than Write/Edit", () => {
    const result = validateCycle({
      mode: "patch",
      objective: "Fix trainer levels",
      implResult: makeResult({
        actions: [
          { tool: "Read", input: {}, result: "", timestamp: "" },
          { tool: "Bash", input: { command: "sed -i s/5/7/ pokeemerald/src/data/trainers.h" }, result: "", timestamp: "" },
        ],
      }),
      changeSet: changeSetOf("pokeemerald/src/data/trainers.h"),
    });
    expect(result.status).toBe("verified");
    expect(result.warnings).toHaveLength(0);
  });

  it("returns verified for research mode regardless of diff", () => {
    const result = validateCycle({
      mode: "research",
      objective: "Study battle system",
      implResult: makeResult(),
      changeSet: changeSetOf(),
    });
    expect(result.status).toBe("verified");
    expect(result.warnings).toHaveLength(0);
  });

  it("returns verified for planning mode regardless of diff", () => {
    const result = validateCycle({
      mode: "planning",
      objective: "Plan new features",
      implResult: makeResult(),
      changeSet: changeSetOf(),
    });
    expect(result.status).toBe("verified");
    expect(result.warnings).toHaveLength(0);
  });

  it("warns when feature mode changes only files outside the game tree", () => {
    const result = validateCycle({
      mode: "feature",
      objective: "Add encounters",
      implResult: makeResult({
        filesModified: ["memory/strategy-notes.md"],
        actions: [
          { tool: "Write", input: { file_path: "memory/strategy-notes.md" }, result: "", timestamp: "" },
        ],
      }),
      changeSet: changeSetOf(),
    });
    expect(result.warnings.some((w) => w.includes("no pokeemerald/ files"))).toBe(true);
  });

  it("detects repair mode as expecting code changes", () => {
    const result = validateCycle({
      mode: "repair",
      objective: "Fix build",
      implResult: makeResult(),
      changeSet: changeSetOf(),
    });
    // repair mode expects changes but got none
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("detects refactor mode as expecting code changes", () => {
    const result = validateCycle({
      mode: "refactor",
      objective: "Clean up code",
      implResult: makeResult(),
      changeSet: changeSetOf(),
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
