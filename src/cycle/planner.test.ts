import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ClaudeCodeResult } from "../agent/output-parser.js";

function cliResult(resultText: string): ClaudeCodeResult {
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
    resultText,
    narrativeText: "",
  };
}

const PLAN = {
  mode: "patch",
  objective: "Fix Phoebe's rematch roster",
  reasoning: "Backlog item",
  implementationPlan: "Edit trainer parties",
  creativeInvestment: "Field Notes key item",
};

const runClaudeCode = vi.fn();

beforeEach(() => {
  vi.resetModules();
  runClaudeCode.mockReset();
  vi.doMock("../agent/claude-cli.js", () => ({
    runClaudeCode,
    extractMcpTools: () => [],
  }));
  vi.doMock("../utils/logger.js", () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  }));
});

describe("parsePlanResult", () => {
  it("keeps the creativeInvestment field", async () => {
    const { parsePlanResult } = await import("./planner.js");
    const plan = parsePlanResult(cliResult(JSON.stringify(PLAN)));
    expect(plan.creativeInvestment).toBe("Field Notes key item");
  });
});

describe("planCycle", () => {
  it("falls back to the single planner once when every advisor fails", async () => {
    // Advisors run without a JSON schema; the planners run with one. Advisors
    // recover after 50 calls so a regression fails the assertions below
    // instead of looping forever.
    let advisorCalls = 0;
    runClaudeCode.mockImplementation(async (_prompt: string, opts: { jsonSchema?: unknown }) => {
      if (opts.jsonSchema) return cliResult(JSON.stringify(PLAN));
      if (++advisorCalls > 50) return cliResult("memo");
      throw new Error("authentication failed");
    });
    vi.stubEnv("AGENT_TEAM_PLANNING", "always");

    const { planCycle } = await import("./planner.js");
    const { TEAM_ROLES } = await import("./team-roles.js");
    const plan = await planCycle([], 308);

    expect(plan.objective).toBe(PLAN.objective);
    expect(advisorCalls).toBe(TEAM_ROLES.length);
    const plannerCalls = runClaudeCode.mock.calls.filter(([, opts]) => opts.jsonSchema);
    expect(plannerCalls).toHaveLength(1);
    vi.unstubAllEnvs();
  });
});
