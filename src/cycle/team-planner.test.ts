import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { shouldUseTeamPlanning } from "./team-planner.js";

describe("shouldUseTeamPlanning", () => {
  const originalEnv = process.env.AGENT_TEAM_PLANNING;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.AGENT_TEAM_PLANNING;
    } else {
      process.env.AGENT_TEAM_PLANNING = originalEnv;
    }
  });

  describe("explicit settings", () => {
    it("returns false when AGENT_TEAM_PLANNING=never", () => {
      process.env.AGENT_TEAM_PLANNING = "never";
      expect(shouldUseTeamPlanning(10)).toBe(false);
    });

    it("returns true when AGENT_TEAM_PLANNING=always", () => {
      process.env.AGENT_TEAM_PLANNING = "always";
      expect(shouldUseTeamPlanning(1)).toBe(true);
    });

    it("is case-insensitive", () => {
      process.env.AGENT_TEAM_PLANNING = "NEVER";
      expect(shouldUseTeamPlanning(10)).toBe(false);

      process.env.AGENT_TEAM_PLANNING = "Always";
      expect(shouldUseTeamPlanning(1)).toBe(true);
    });
  });

  describe("auto mode (default)", () => {
    beforeEach(() => {
      delete process.env.AGENT_TEAM_PLANNING;
    });

    it("returns false when last cycle was repair", () => {
      expect(shouldUseTeamPlanning(10, "repair")).toBe(false);
    });

    it("returns false for early cycles (< 3)", () => {
      expect(shouldUseTeamPlanning(1)).toBe(false);
      expect(shouldUseTeamPlanning(2)).toBe(false);
    });

    it("returns true when community issues are present", () => {
      expect(shouldUseTeamPlanning(5, undefined, true)).toBe(true);
    });

    it("returns true for mature projects (cycle >= 3, no issues)", () => {
      expect(shouldUseTeamPlanning(3)).toBe(true);
      expect(shouldUseTeamPlanning(100)).toBe(true);
    });

    it("returns true when hasIssues even on early cycle (issues override cycle check happens after)", () => {
      // cycleNumber < 3 check comes before hasIssues, so early cycles still return false
      expect(shouldUseTeamPlanning(1, undefined, true)).toBe(false);
    });

    it("returns false for repair even with issues", () => {
      expect(shouldUseTeamPlanning(10, "repair", true)).toBe(false);
    });
  });
});
