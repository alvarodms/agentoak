import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ClaudeCodeResult, ActionRecord } from "../agent/output-parser.js";

// Mock logger to avoid winston initialization
vi.mock("../utils/logger.js", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Mock modes — only need the lookup table
vi.mock("./modes.js", () => ({
  CYCLE_MODES: {
    research: { name: "research" },
    patch: { name: "patch" },
    repair: { name: "repair" },
    refactor: { name: "refactor" },
    feature: { name: "feature" },
    planning: { name: "planning" },
  },
}));

import { parsePlanResult } from "./planner.js";

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

function makeAction(overrides: Partial<ActionRecord> = {}): ActionRecord {
  return {
    tool: "StructuredOutput",
    input: {},
    result: "",
    timestamp: "",
    ...overrides,
  };
}

const validPlan = {
  mode: "feature",
  objective: "Add new encounters",
  reasoning: "Because the game needs more variety",
  implementationPlan: "Step 1: Read files. Step 2: Edit data.",
  issueActions: [],
  helpRequests: [],
};

describe("parsePlanResult", () => {
  describe("primary path: resultText JSON", () => {
    it("parses valid plan from resultText", () => {
      const result = makeResult({ resultText: JSON.stringify(validPlan) });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("feature");
      expect(plan.objective).toBe("Add new encounters");
      expect(plan.reasoning).toBe("Because the game needs more variety");
      expect(plan.implementationPlan).toBe("Step 1: Read files. Step 2: Edit data.");
    });

    it("includes optional gameplayDesignBrief when present", () => {
      const planWithBrief = { ...validPlan, gameplayDesignBrief: "Design trainer teams for Route 110" };
      const result = makeResult({ resultText: JSON.stringify(planWithBrief) });
      const plan = parsePlanResult(result);
      expect(plan.gameplayDesignBrief).toBe("Design trainer teams for Route 110");
    });

    it("includes optional engineeringInvestment when present", () => {
      const planWithInvestment = { ...validPlan, engineeringInvestment: "Extract encounter config to JSON" };
      const result = makeResult({ resultText: JSON.stringify(planWithInvestment) });
      const plan = parsePlanResult(result);
      expect(plan.engineeringInvestment).toBe("Extract encounter config to JSON");
    });

    it("converts empty string gameplayDesignBrief to undefined", () => {
      const planWithEmpty = { ...validPlan, gameplayDesignBrief: "" };
      const result = makeResult({ resultText: JSON.stringify(planWithEmpty) });
      const plan = parsePlanResult(result);
      expect(plan.gameplayDesignBrief).toBeUndefined();
    });

    it("converts empty string engineeringInvestment to undefined", () => {
      const planWithEmpty = { ...validPlan, engineeringInvestment: "" };
      const result = makeResult({ resultText: JSON.stringify(planWithEmpty) });
      const plan = parsePlanResult(result);
      expect(plan.engineeringInvestment).toBeUndefined();
    });
  });

  describe("fallback: StructuredOutput actions merge", () => {
    it("merges plan fields split across multiple StructuredOutput actions", () => {
      const result = makeResult({
        actions: [
          makeAction({ tool: "StructuredOutput", input: { mode: "patch", objective: "Tune levels" } }),
          makeAction({ tool: "StructuredOutput", input: { reasoning: "Levels are too easy", implementationPlan: "Edit trainers" } }),
        ],
      });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("patch");
      expect(plan.objective).toBe("Tune levels");
      expect(plan.reasoning).toBe("Levels are too easy");
    });

    it("ignores non-StructuredOutput actions", () => {
      const result = makeResult({
        actions: [
          makeAction({ tool: "Edit", input: { mode: "patch" } }),
          makeAction({ tool: "StructuredOutput", input: { mode: "research", objective: "Study encounters", reasoning: "Need data" } }),
        ],
      });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("research");
    });
  });

  describe("fallback: action result JSON", () => {
    it("parses plan from action result string", () => {
      const result = makeResult({
        actions: [
          makeAction({ tool: "SomeOther", result: JSON.stringify(validPlan) }),
        ],
      });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("feature");
      expect(plan.objective).toBe("Add new encounters");
    });

    it("skips action results that are not valid JSON", () => {
      const result = makeResult({
        actions: [
          makeAction({ tool: "SomeOther", result: "not json" }),
          makeAction({ tool: "Another", result: JSON.stringify(validPlan) }),
        ],
      });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("feature");
    });

    it("skips action results that are valid JSON but missing required fields", () => {
      const result = makeResult({
        actions: [
          makeAction({ result: JSON.stringify({ mode: "feature" }) }), // missing objective
          makeAction({ result: JSON.stringify(validPlan) }),
        ],
      });
      const plan = parsePlanResult(result);
      expect(plan.objective).toBe("Add new encounters");
    });
  });

  describe("fallback: cycleSummary", () => {
    it("parses plan from cycleSummary when all other sources fail", () => {
      const result = makeResult({ cycleSummary: JSON.stringify(validPlan) });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("feature");
      expect(plan.objective).toBe("Add new encounters");
    });
  });

  describe("mode validation", () => {
    it("defaults invalid mode to research", () => {
      const invalidModePlan = { ...validPlan, mode: "nonexistent" };
      const result = makeResult({ resultText: JSON.stringify(invalidModePlan) });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("research");
    });

    it("accepts all valid modes", () => {
      for (const mode of ["research", "patch", "repair", "refactor", "feature", "planning"]) {
        const planWithMode = { ...validPlan, mode };
        const result = makeResult({ resultText: JSON.stringify(planWithMode) });
        const plan = parsePlanResult(result);
        expect(plan.mode).toBe(mode);
      }
    });
  });

  describe("error handling", () => {
    it("throws when no source produces a valid plan", () => {
      const result = makeResult();
      expect(() => parsePlanResult(result)).toThrow("Could not parse structured plan");
    });

    it("throws when plan has mode and objective but missing reasoning", () => {
      const partial = { mode: "feature", objective: "Do something" };
      const result = makeResult({ resultText: JSON.stringify(partial) });
      expect(() => parsePlanResult(result)).toThrow("Could not parse structured plan");
    });

    it("throws when resultText is invalid JSON and no fallbacks match", () => {
      const result = makeResult({ resultText: "not json at all" });
      expect(() => parsePlanResult(result)).toThrow("Could not parse structured plan");
    });
  });

  describe("array coercion", () => {
    it("coerces non-array issueActions to empty array", () => {
      const planWithBadActions = { ...validPlan, issueActions: "not an array" };
      const result = makeResult({ resultText: JSON.stringify(planWithBadActions) });
      const plan = parsePlanResult(result);
      expect(plan.issueActions).toEqual([]);
    });

    it("coerces non-array helpRequests to empty array", () => {
      const planWithBadHelp = { ...validPlan, helpRequests: { title: "help" } };
      const result = makeResult({ resultText: JSON.stringify(planWithBadHelp) });
      const plan = parsePlanResult(result);
      expect(plan.helpRequests).toEqual([]);
    });

    it("preserves valid issueActions array", () => {
      const actions = [{ issueNumber: 1, action: "accept", response: "Will do!" }];
      const planWithActions = { ...validPlan, issueActions: actions };
      const result = makeResult({ resultText: JSON.stringify(planWithActions) });
      const plan = parsePlanResult(result);
      expect(plan.issueActions).toEqual(actions);
    });

    it("preserves valid helpRequests array", () => {
      const requests = [{ title: "Need help", body: "With sprites" }];
      const planWithHelp = { ...validPlan, helpRequests: requests };
      const result = makeResult({ resultText: JSON.stringify(planWithHelp) });
      const plan = parsePlanResult(result);
      expect(plan.helpRequests).toEqual(requests);
    });
  });

  describe("missing optional fields", () => {
    it("defaults implementationPlan to empty string when missing", () => {
      const { implementationPlan: _, ...planNoImpl } = validPlan;
      const withReasoning = { ...planNoImpl, reasoning: "Because reasons" };
      const result = makeResult({ resultText: JSON.stringify(withReasoning) });
      const plan = parsePlanResult(result);
      expect(plan.implementationPlan).toBe("");
    });

    it("defaults issueActions to empty array when missing", () => {
      const { issueActions: _, ...planNoActions } = validPlan;
      const result = makeResult({ resultText: JSON.stringify(planNoActions) });
      const plan = parsePlanResult(result);
      expect(plan.issueActions).toEqual([]);
    });

    it("defaults helpRequests to empty array when missing", () => {
      const { helpRequests: _, ...planNoHelp } = validPlan;
      const result = makeResult({ resultText: JSON.stringify(planNoHelp) });
      const plan = parsePlanResult(result);
      expect(plan.helpRequests).toEqual([]);
    });
  });

  describe("fallback priority", () => {
    it("prefers resultText over StructuredOutput actions", () => {
      const result = makeResult({
        resultText: JSON.stringify(validPlan),
        actions: [
          makeAction({
            tool: "StructuredOutput",
            input: { mode: "research", objective: "Different", reasoning: "Other" },
          }),
        ],
      });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("feature"); // from resultText, not StructuredOutput
    });

    it("prefers StructuredOutput over action results", () => {
      const result = makeResult({
        actions: [
          makeAction({
            tool: "StructuredOutput",
            input: { mode: "patch", objective: "From structured", reasoning: "Yes" },
          }),
          makeAction({ result: JSON.stringify({ ...validPlan, mode: "repair" }) }),
        ],
      });
      const plan = parsePlanResult(result);
      expect(plan.mode).toBe("patch"); // from StructuredOutput
    });
  });
});
