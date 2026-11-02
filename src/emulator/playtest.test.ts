import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { loadPlaytests, parsePlaytest, type PlaytestResult } from "./playtest.js";
import { PLAYTESTS_DIR, formatReport } from "./run-playtests.js";

const MINIMAL = {
  name: "minimal",
  checks: "boots",
  scenario: { map: "MAP_ROUTE101", x: 1, y: 2 },
  steps: [{ expectPlayer: { map: "MAP_ROUTE101" } }],
};

describe("parsePlaytest", () => {
  it("accepts a minimal playtest", () => {
    expect(parsePlaytest(MINIMAL).name).toBe("minimal");
  });

  it("rejects unknown step keys and typos with the file name", () => {
    const bad = { ...MINIMAL, steps: [{ expectTxt: "hello" }] };
    expect(() => parsePlaytest(bad, "typo.json")).toThrow(/typo\.json/);
  });

  it("rejects unknown scenario fields", () => {
    const bad = { ...MINIMAL, scenario: { ...MINIMAL.scenario, badges: 8 } };
    expect(() => parsePlaytest(bad)).toThrow();
  });

  it("rejects names that cannot be screenshot directories", () => {
    expect(() => parsePlaytest({ ...MINIMAL, name: "has spaces" })).toThrow();
  });
});

describe("pokeemerald/playtests", () => {
  it.skipIf(!fs.existsSync(PLAYTESTS_DIR))("every playtest file parses and names are unique", () => {
    const tests = loadPlaytests([PLAYTESTS_DIR]);
    expect(tests.length).toBeGreaterThan(0);
    const names = tests.map((t) => t.test.name);
    expect(new Set(names).size).toBe(names.length);
    for (const { file, test } of tests) {
      expect(file.endsWith(`${test.name}.json`), `${file} should be named ${test.name}.json`).toBe(true);
    }
  });
});

describe("formatReport", () => {
  const base: PlaytestResult = { name: "a", checks: "x | y", passed: true, transcripts: [], screenshots: [], frames: 10, ms: 5 };

  it("summarises passes and details failures with the dialogue seen", () => {
    const report = formatReport([
      base,
      { ...base, name: "b", passed: false, failedStep: 3, error: "text missing", file: "b.json", transcripts: [["Hi\nthere"]] },
    ]);
    expect(report).toContain("1/2 passed.");
    expect(report).toContain("| ✅ | `a` | x \\| y | 10 |");
    expect(report).toContain("## ❌ b");
    expect(report).toContain("step 3");
    expect(report).toContain("Hi / there");
  });
});
