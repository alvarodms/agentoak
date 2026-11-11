import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { battleWeatherName, loadPlaytestFiles, loadPlaytests, parsePlaytest, type PlaytestResult } from "./playtest.js";
import { PLAYTESTS_DIR, formatReport, preflight } from "./run-playtests.js";

describe("preflight", () => {
  it("says how to fix a missing ROM and a missing emulator", () => {
    const build = { rom: "/nope/a.gba", elf: "/nope/a.elf", map: "/nope/a.map", charmap: "/nope/charmap.txt" };
    const problems = preflight(build, "/nope/mgba-driver");
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/make -j/);
    expect(problems[1]).toMatch(/MGBA_DRIVER/);
  });
});

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

  it("accepts YES/NO answers on talk and rejects anything else", () => {
    const withAnswers = { ...MINIMAL, steps: [{ talk: { answers: ["no", "yes"] } }] };
    expect(parsePlaytest(withAnswers).steps[0]).toEqual({ talk: { answers: ["no", "yes"] } });
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ talk: { answers: ["maybe"] } }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ talk: { answers: [] } }] })).toThrow();
  });

  it("accepts a battle weather check", () => {
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectBattleWeather: "hail" }] })).not.toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectBattleWeather: "fog" }] })).toThrow();
  });

  it("rejects names that cannot be screenshot directories", () => {
    expect(() => parsePlaytest({ ...MINIMAL, name: "has spaces" })).toThrow();
  });
});

describe("loadPlaytestFiles", () => {
  it("keeps an invalid file as an entry with an error instead of throwing", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oak-pt-"));
    try {
      fs.writeFileSync(path.join(dir, "good.json"), JSON.stringify({ ...MINIMAL, name: "good" }));
      fs.writeFileSync(path.join(dir, "bad.json"), "{ not json");
      const loaded = loadPlaytestFiles([dir]);
      expect(loaded.map((l) => [l.name, !!l.test, !!l.error])).toEqual([
        ["bad", false, true],
        ["good", true, false],
      ]);
      expect(() => loadPlaytests([dir])).toThrow();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
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

describe("battleWeatherName", () => {
  it("names each B_WEATHER_* family", () => {
    expect(battleWeatherName(0)).toBe("none");
    expect(battleWeatherName(1 << 0)).toBe("rain");
    expect(battleWeatherName(1 << 2)).toBe("rain");
    expect(battleWeatherName(1 << 3)).toBe("sandstorm");
    expect(battleWeatherName(1 << 4)).toBe("sandstorm");
    expect(battleWeatherName(1 << 5)).toBe("sun");
    expect(battleWeatherName(1 << 6)).toBe("sun");
    expect(battleWeatherName(1 << 7)).toBe("hail");
  });
});
