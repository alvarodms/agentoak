import { describe, it, expect, afterEach } from "vitest";
import { buildArgs } from "./claude-cli.js";
import { buildMcpConfig, effortFor, loadInstructions, PHASE_PROFILES } from "./phases.js";

describe("buildArgs", () => {
  it("puts variadic flags first so they cannot swallow the prompt", () => {
    const args = buildArgs({ tools: "Read,Grep", mcpConfig: '{"mcpServers":{}}', model: "opus", effort: "high" });
    expect(args.slice(0, 5)).toEqual(["--tools", "Read,Grep", "--mcp-config", '{"mcpServers":{}}', "--strict-mcp-config"]);
    // The last flag before the prompt takes exactly one value
    expect(args.slice(-2)).toEqual(["--effort", "high"]);
  });

  it("drops MCP tool names from --tools", () => {
    const args = buildArgs({ tools: "Read,mcp__pokedex__move_data" });
    expect(args[args.indexOf("--tools") + 1]).toBe("Read");
  });

  it("omits --effort and MCP flags when not given", () => {
    const args = buildArgs({ maxTurns: 5 });
    expect(args).not.toContain("--effort");
    expect(args).not.toContain("--strict-mcp-config");
  });
});

describe("phase profiles", () => {
  afterEach(() => {
    delete process.env.OAK_EFFORT;
    delete process.env.OAK_EFFORT_BUILD_FIX;
  });

  it("uses the phase default effort", () => {
    expect(effortFor("planner")).toBe(PHASE_PROFILES.planner.effort);
  });

  it("lets a per-phase env var beat the global one, and ignores invalid levels", () => {
    process.env.OAK_EFFORT = "low";
    process.env.OAK_EFFORT_BUILD_FIX = "max";
    expect(effortFor("build-fix")).toBe("max");
    expect(effortFor("advisor")).toBe("low");
    process.env.OAK_EFFORT = "turbo";
    expect(effortFor("advisor")).toBe(PHASE_PROFILES.advisor.effort);
  });

  it("builds an MCP config holding only the requested servers", () => {
    expect(Object.keys(JSON.parse(buildMcpConfig(["pokedex"])).mcpServers)).toEqual(["pokedex"]);
    expect(JSON.parse(buildMcpConfig([])).mcpServers).toEqual({});
  });

  it("has an instruction file for every fragment a phase uses", () => {
    for (const profile of Object.values(PHASE_PROFILES)) {
      expect(() => loadInstructions(profile.instructions)).not.toThrow();
    }
  });
});
