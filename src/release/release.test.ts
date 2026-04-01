import { describe, it, expect, vi } from "vitest";
import type { GameVersion } from "../repo/version.js";

// Mock logger
vi.mock("../utils/logger.js", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Mock formatVersion — return a predictable string
vi.mock("../repo/version.js", () => ({
  formatVersion: (v: GameVersion) => `v${v.major}.${v.minor}.${v.cycle}+build.${v.build}`,
}));

import { getReleaseStage, patchFilename, formatChangelog } from "./release.js";

function makeVersion(overrides: Partial<GameVersion> = {}): GameVersion {
  return {
    major: 0,
    minor: 0,
    patch: 0,
    build: 0,
    cycle: 0,
    builtAt: "",
    ...overrides,
  };
}

describe("getReleaseStage", () => {
  it("returns explicit releaseStage when set", () => {
    expect(getReleaseStage(makeVersion({ releaseStage: "Demo" }))).toBe("Demo");
  });

  it("returns Alpha when major is 0", () => {
    expect(getReleaseStage(makeVersion({ major: 0, minor: 3 }))).toBe("Alpha");
  });

  it("returns Beta when major >= 1 and minor < 5", () => {
    expect(getReleaseStage(makeVersion({ major: 1, minor: 4 }))).toBe("Beta");
  });

  it("returns Stable when major >= 1 and minor >= 5", () => {
    expect(getReleaseStage(makeVersion({ major: 1, minor: 5 }))).toBe("Stable");
  });

  it("returns Stable for high version numbers", () => {
    expect(getReleaseStage(makeVersion({ major: 3, minor: 10 }))).toBe("Stable");
  });

  it("explicit releaseStage takes precedence over auto-compute", () => {
    // major=0 would auto-compute to Alpha, but explicit stage wins
    expect(getReleaseStage(makeVersion({ major: 0, releaseStage: "Beta" }))).toBe("Beta");
  });
});

describe("patchFilename", () => {
  it("formats filename correctly", () => {
    const v = makeVersion({ major: 0, minor: 3, cycle: 42, build: 7 });
    expect(patchFilename(v)).toBe("agentoak-v0.3.42-build7.ips");
  });

  it("handles initial version", () => {
    expect(patchFilename(makeVersion())).toBe("agentoak-v0.0.0-build0.ips");
  });

  it("handles large numbers", () => {
    const v = makeVersion({ major: 2, minor: 10, cycle: 999, build: 100 });
    expect(patchFilename(v)).toBe("agentoak-v2.10.999-build100.ips");
  });
});

describe("formatChangelog", () => {
  it("renders bullet list when cycleChanges is non-empty", () => {
    const v = makeVersion({ major: 0, minor: 1, cycle: 5 });
    const result = formatChangelog(v, "Summary text", "Objective text", [
      "Added new encounters",
      "Tuned gym levels",
    ]);
    expect(result).toContain("- Added new encounters");
    expect(result).toContain("- Tuned gym levels");
    expect(result).not.toContain("Summary text");
  });

  it("falls back to cycleSummary when cycleChanges is empty", () => {
    const v = makeVersion({ major: 0, minor: 1, cycle: 5 });
    const result = formatChangelog(v, "Summary text", "Objective text", []);
    expect(result).toContain("Summary text");
    expect(result).not.toContain("Objective text");
  });

  it("falls back to objective when both cycleChanges and cycleSummary are empty", () => {
    const v = makeVersion({ major: 0, minor: 1, cycle: 5 });
    const result = formatChangelog(v, "", "Objective text", []);
    expect(result).toContain("Objective text");
  });

  it("includes release date", () => {
    const v = makeVersion({ cycle: 5 });
    const result = formatChangelog(v, "Summary", "Obj", []);
    expect(result).toMatch(/\*\*Released:\*\* \d{4}-\d{2}-\d{2}/);
  });

  it("includes cycle number in footer", () => {
    const v = makeVersion({ cycle: 42 });
    const result = formatChangelog(v, "Summary", "Obj", []);
    expect(result).toContain("cycle 42");
  });

  it("includes What's New section header", () => {
    const v = makeVersion({ cycle: 1 });
    const result = formatChangelog(v, "Summary", "Obj", []);
    expect(result).toContain("## What's New");
  });
});
