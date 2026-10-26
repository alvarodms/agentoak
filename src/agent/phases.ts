/**
 * Per-phase agent profiles: how much reasoning effort each phase gets, which
 * MCP servers it can reach, and which instruction fragments it is given.
 *
 * Every CLI call loads the shared core in CLAUDE.md automatically. The
 * fragments here carry the phase-specific rules, so an advisor never pays
 * for the CYCLE_COMPLETE spec and the build fixer never reads issue policy.
 */

import fs from "fs";
import path from "path";
import { PROJECT_ROOT } from "../utils/paths.js";

export type EffortLevel = "low" | "medium" | "high" | "xhigh" | "max";
export type McpServerName = "pokedex" | "porymap";
export type InstructionFragment = "vision" | "community" | "implementation" | "completion";

export type AgentPhase =
  | "advisor"
  | "planner"
  | "gameplay-designer"
  | "sprite-designer"
  | "implementation"
  | "build-fix"
  | "validation-fix"
  | "reflection";

export interface PhaseProfile {
  effort: EffortLevel;
  mcpServers: McpServerName[];
  instructions: InstructionFragment[];
}

export const PHASE_PROFILES: Record<AgentPhase, PhaseProfile> = {
  "advisor": { effort: "medium", mcpServers: [], instructions: [] },
  "planner": { effort: "high", mcpServers: ["pokedex"], instructions: ["vision", "community"] },
  "gameplay-designer": { effort: "high", mcpServers: ["pokedex"], instructions: [] },
  "sprite-designer": { effort: "medium", mcpServers: ["pokedex"], instructions: [] },
  "implementation": { effort: "high", mcpServers: ["pokedex", "porymap"], instructions: ["implementation"] },
  "build-fix": { effort: "medium", mcpServers: [], instructions: [] },
  "validation-fix": { effort: "medium", mcpServers: ["pokedex", "porymap"], instructions: ["implementation"] },
  "reflection": { effort: "medium", mcpServers: [], instructions: ["completion"] },
};

const EFFORT_LEVELS: readonly EffortLevel[] = ["low", "medium", "high", "xhigh", "max"];
const INSTRUCTIONS_DIR = path.join(PROJECT_ROOT, "src", "agent", "instructions");
const MCP_CONFIG_PATH = path.join(PROJECT_ROOT, ".mcp.json");

/**
 * Effort for a phase. `OAK_EFFORT_<PHASE>` (e.g. OAK_EFFORT_BUILD_FIX)
 * overrides one phase and `OAK_EFFORT` overrides every phase.
 */
export function effortFor(phase: AgentPhase): EffortLevel {
  const phaseVar = `OAK_EFFORT_${phase.toUpperCase().replace(/-/g, "_")}`;
  for (const value of [process.env[phaseVar], process.env.OAK_EFFORT]) {
    const level = value?.trim().toLowerCase();
    if (level && (EFFORT_LEVELS as readonly string[]).includes(level)) {
      return level as EffortLevel;
    }
  }
  return PHASE_PROFILES[phase].effort;
}

/** Concatenate a phase's instruction fragments (empty string if it has none). */
export function loadInstructions(fragments: InstructionFragment[]): string {
  return fragments
    .map((name) => fs.readFileSync(path.join(INSTRUCTIONS_DIR, `${name}.md`), "utf-8").trim())
    .join("\n\n");
}

/**
 * The `--mcp-config` JSON holding only the named servers from `.mcp.json`.
 * Paired with `--strict-mcp-config` so a phase sees no other MCP tools.
 */
export function buildMcpConfig(servers: McpServerName[]): string {
  const all = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, "utf-8")) as {
    mcpServers: Record<string, unknown>;
  };
  const selected = Object.fromEntries(
    servers.filter((name) => name in all.mcpServers).map((name) => [name, all.mcpServers[name]]),
  );
  return JSON.stringify({ mcpServers: selected });
}
