import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BAG_POSITION,
  MAIN_STATE,
  SAVEBLOCK1_LOCATION,
  SAVEBLOCK1_POS,
  SAVEBLOCK1_POKEBALLS,
  SAVEBLOCK1_REGISTERED_ITEM,
  ballListIndex,
  battleWeatherName,
  encodeWarpData,
  loadPlaytestFiles,
  loadPlaytests,
  parsePlaytest,
  walkToDirections,
  type PlaytestResult,
} from "./playtest.js";
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

  it("accepts useKeyItem by ITEM_ name only", () => {
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ useKeyItem: "ITEM_FIELD_NOTES" }] })).not.toThrow();
    const full = { useKeyItem: { item: "ITEM_FIELD_NOTES", read: false, maxPresses: 50 } };
    expect(parsePlaytest({ ...MINIMAL, steps: [full] }).steps[0]).toEqual(full);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ useKeyItem: 377 }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ useKeyItem: "FIELD_NOTES" }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ useKeyItem: { item: 377 } }] })).toThrow();
  });

  it("accepts useKeyItem register: false (SELECT must already hold it)", () => {
    const step = { useKeyItem: { item: "ITEM_FIELD_NOTES", register: false } };
    expect(parsePlaytest({ ...MINIMAL, steps: [step] }).steps[0]).toEqual(step);
  });

  it("accepts a species filter on findWildBattle and a catchWild ball", () => {
    const find = { findWildBattle: { directions: ["left", "right"], maxSteps: 600, species: "SPECIES_LOTAD_HOENN" } };
    expect(parsePlaytest({ ...MINIMAL, steps: [find] }).steps[0]).toEqual(find);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ findWildBattle: { directions: ["left"], species: "LOTAD" } }] })).toThrow();
    const catchStep = { catchWild: { ball: "ITEM_MASTER_BALL" } };
    expect(parsePlaytest({ ...MINIMAL, steps: [catchStep] }).steps[0]).toEqual(catchStep);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ catchWild: { ball: "ITEM_MASTER_BALL", nickname: false } }] })).not.toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ catchWild: { ball: "ITEM_MASTER_BALL", nickname: true } }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ catchWild: { ball: "MASTER_BALL" } }] })).toThrow();
  });

  it("accepts a registered SELECT item in the scenario", () => {
    const scenario = { ...MINIMAL.scenario, registeredItem: "ITEM_MACH_BIKE" };
    expect(parsePlaytest({ ...MINIMAL, scenario }).scenario.registeredItem).toBe("ITEM_MACH_BIKE");
    expect(() => parsePlaytest({ ...MINIMAL, scenario: { ...scenario, registeredItem: "MACH_BIKE" } })).toThrow();
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

const GLOBAL_H = path.join(path.dirname(PLAYTESTS_DIR), "include", "global.h");

describe("SAVEBLOCK1_REGISTERED_ITEM", () => {
  it.skipIf(!fs.existsSync(GLOBAL_H))("matches registeredItem's offset in include/global.h", () => {
    const line = fs.readFileSync(GLOBAL_H, "utf8").split("\n").find((l) => /\bregisteredItem;/.test(l));
    const offset = line?.match(/\/\*(0x[0-9A-Fa-f]+)\*\//)?.[1];
    expect(offset, "registeredItem line with a /*0x...*/ offset").toBeDefined();
    expect(Number(offset)).toBe(SAVEBLOCK1_REGISTERED_ITEM);
  });
});

describe("SAVEBLOCK1_POKEBALLS", () => {
  it.skipIf(!fs.existsSync(GLOBAL_H))("matches bagPocket_PokeBalls's offset in include/global.h", () => {
    const line = fs.readFileSync(GLOBAL_H, "utf8").split("\n").find((l) => /\bbagPocket_PokeBalls\[/.test(l));
    const offset = line?.match(/\/\*(0x[0-9A-Fa-f]+)\*\//)?.[1];
    expect(offset, "bagPocket_PokeBalls line with a /*0x...*/ offset").toBeDefined();
    expect(Number(offset)).toBe(SAVEBLOCK1_POKEBALLS);
  });
});

const MAIN_H = path.join(path.dirname(PLAYTESTS_DIR), "include", "main.h");
const ITEM_MENU_H = path.join(path.dirname(PLAYTESTS_DIR), "include", "item_menu.h");

describe("BAG_POSITION", () => {
  it.skipIf(!fs.existsSync(ITEM_MENU_H))("matches struct BagPosition's field order in include/item_menu.h", () => {
    const body = fs.readFileSync(ITEM_MENU_H, "utf8").match(/struct BagPosition\s*\{([^}]*)\}/)?.[1] ?? "";
    const fields = body.split(";").map((f) => f.trim().replace(/\s+/g, " ")).filter(Boolean);
    // 4-byte callback, u8 location, u8 pocket, u16 arrow, u16[5] cursor, u16[5] scroll
    expect(fields).toEqual([
      "MainCallback exitCallback",
      "u8 location",
      "u8 pocket",
      "u16 pocketSwitchArrowPos",
      "u16 cursorPosition[POCKETS_COUNT]",
      "u16 scrollPosition[POCKETS_COUNT]",
    ]);
    expect(BAG_POSITION).toEqual({ pocket: 5, cursorPosition: 8, scrollPosition: 8 + 5 * 2 });
  });
});

describe("ballListIndex", () => {
  it("counts only filled slots, in bag order", () => {
    const pocket = Buffer.alloc(16 * 4);
    pocket.writeUInt16LE(4, 0); // POKE_BALL
    pocket.writeUInt16LE(3, 4); // GREAT_BALL
    pocket.writeUInt16LE(1, 12); // MASTER_BALL after an empty slot
    expect(ballListIndex(pocket, 4)).toBe(0);
    expect(ballListIndex(pocket, 1)).toBe(2);
    expect(ballListIndex(pocket, 2)).toBe(-1);
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

describe("warp step", () => {
  it("parses a warp to a MAP_* tile and rejects a bare map name", () => {
    const step = { warp: { map: "MAP_ROUTE104", x: 33, y: 50 } };
    expect(parsePlaytest({ ...MINIMAL, steps: [step] }).steps[0]).toEqual(step);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ warp: { map: "ROUTE104", x: 33, y: 50 } }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ warp: { map: "MAP_ROUTE104" } }] })).toThrow();
  });

  it("encodes struct WarpData: group, num, WARP_ID_NONE, pad, s16 x, s16 y", () => {
    // MAP_ROUTE104 = (19 | (0 << 8)); MAP_PETALBURG_WOODS = (11 | (24 << 8))
    expect([...encodeWarpData(19, 33, 50)]).toEqual([0, 19, 0xff, 0, 33, 0, 50, 0]);
    expect([...encodeWarpData(11 | (24 << 8), 300, 2)]).toEqual([24, 11, 0xff, 0, 0x2c, 0x01, 2, 0]);
  });

  it.skipIf(!fs.existsSync(GLOBAL_H))("matches pos and location offsets in include/global.h", () => {
    const lines = fs.readFileSync(GLOBAL_H, "utf8").split("\n");
    const offsetOf = (re: RegExp) => Number(lines.find((l) => re.test(l))?.match(/\/\*(0x[0-9A-Fa-f]+)\*\//)?.[1]);
    expect(offsetOf(/struct Coords16 pos;/)).toBe(SAVEBLOCK1_POS);
    expect(offsetOf(/struct WarpData location;/)).toBe(SAVEBLOCK1_LOCATION);
    const warpData = fs.readFileSync(GLOBAL_H, "utf8").match(/struct WarpData\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(warpData.replace(/\/\/.*$/gm, "").replace(/\s+/g, " ").trim()).toBe("s8 mapGroup; s8 mapNum; s8 warpId; s16 x, y;");
  });

  it.skipIf(!fs.existsSync(MAIN_H))("matches gMain.state's offset in include/main.h", () => {
    const line = fs.readFileSync(MAIN_H, "utf8").split("\n").find((l) => /\bu8 state;/.test(l));
    expect(Number(line?.match(/\/\*(0x[0-9A-Fa-f]+)\*\//)?.[1])).toBe(MAIN_STATE);
  });
});

describe("walkTo and setVar steps", () => {
  it("parses walkTo with an optional yFirst and setVar on VAR_ names only", () => {
    const steps = [{ walkTo: { x: 19, y: 34 } }, { walkTo: { x: 19, y: 34, yFirst: true } }, { setVar: { VAR_REPEL_STEP_COUNT: 250 } }];
    expect(parsePlaytest({ ...MINIMAL, steps }).steps).toEqual(steps);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ walkTo: { x: 19 } }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ setVar: { FLAG_X: 1 } }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ setVar: { VAR_X: 0x10000 } }] })).toThrow();
  });

  it("walks the row first, or the column first with yFirst", () => {
    expect(walkToDirections(23, 33, 19, 34, false)).toEqual(["left", "left", "left", "left", "down"]);
    expect(walkToDirections(22, 33, 19, 34, true)).toEqual(["down", "left", "left", "left"]);
    expect(walkToDirections(5, 5, 6, 3, false)).toEqual(["right", "up", "up"]);
    expect(walkToDirections(5, 5, 5, 5, false)).toEqual([]);
  });
});
