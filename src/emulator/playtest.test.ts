import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BAG_POSITION,
  BATTLE_TYPE_INGAME_PARTNER,
  BATTLER_HP_MARK,
  battlerHpMarker,
  parseBattlerHpMarker,
  PARTNER_MENU_BENCH_END,
  PARTNER_PARTY_MARK,
  PARTY_MENU_CONFIRM,
  PARTY_MENU_TYPE_BYTE,
  PARTY_MENU_TYPE_CHOOSE_HALF,
  checkPartnerSides,
  needsPartnerMarker,
  parsePartnerPartyMarker,
  partnerPartyMarker,
  partyCursorButton,
  MAIN_STATE,
  MATCH_CALL_CONTACTS,
  POKENAV,
  SAVEBLOCK1_LOCATION,
  SAVEBLOCK1_POS,
  SAVEBLOCK1_POKEBALLS,
  SAVEBLOCK1_REGISTERED_ITEM,
  SAVEBLOCK1_WEATHER,
  START_MENU_ACTION_POKENAV,
  ballListIndex,
  battleWeatherName,
  checkBattleSummary,
  checkFieldWeather,
  encodeWarpData,
  loadPlaytestFiles,
  loadPlaytests,
  messageBoxes,
  parsePlaytest,
  PARTY_MENU_SLOT_ID,
  pickMoveSlot,
  pickSendOutIndex,
  pickTargetBattler,
  summarizeBattle,
  summarizeBattles,
  talkStopsAt,
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

  it("accepts a party hpPercent of 1-100 only", () => {
    const withHp = (hpPercent: number) => ({
      ...MINIMAL,
      scenario: { ...MINIMAL.scenario, party: [{ species: "SPECIES_BAGON", level: 5, hpPercent }] },
    });
    expect(() => parsePlaytest(withHp(50))).not.toThrow();
    expect(() => parsePlaytest(withHp(0))).toThrow();
  });

  it("accepts battleSwitch to party slots 2-6 with an optional forbid", () => {
    const step = (battleSwitch: unknown) => ({ ...MINIMAL, steps: [{ battleSwitch }] });
    expect(() => parsePlaytest(step({ slot: 3 }))).not.toThrow();
    expect(() => parsePlaytest(step({ slot: 3, forbid: "fainted" }))).not.toThrow();
    expect(() => parsePlaytest(step({ slot: 1 }))).toThrow();
    expect(() => parsePlaytest(step({ slot: 7 }))).toThrow();
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

const POKEMON_H = path.join(path.dirname(PLAYTESTS_DIR), "include", "pokemon.h");
const PLAYTEST_C = path.join(path.dirname(PLAYTESTS_DIR), "src", "playtest.c");

describe("party hp fields (hpPercent writes layout.pokemonHp)", () => {
  it.skipIf(!fs.existsSync(POKEMON_H) || !fs.existsSync(PLAYTEST_C))("sit at hp 0x56 / maxHP 0x58 of struct Pokemon, outside BoxPokemon", () => {
    const body = fs.readFileSync(POKEMON_H, "utf8").match(/struct Pokemon\s*\{([^}]*)\}/)?.[1] ?? "";
    const fields = body.split(";").map((f) => f.trim().replace(/\s+/g, " ")).filter(Boolean);
    // 80-byte BoxPokemon + u32 status + u8 level + u8 mail = 0x56
    expect(fields.slice(0, 6)).toEqual(["struct BoxPokemon box", "u32 status", "u8 level", "u8 mail", "u16 hp", "u16 maxHP"]);
    const c = fs.readFileSync(PLAYTEST_C, "utf8");
    expect(c).toMatch(/\[PLAYTEST_LAYOUT_POKEMON_HP\]\s*=\s*offsetof\(struct Pokemon, hp\)/);
    expect(c).toMatch(/\[PLAYTEST_LAYOUT_POKEMON_MAX_HP\]\s*=\s*offsetof\(struct Pokemon, maxHP\)/);
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

describe("expectFieldWeather step", () => {
  const WEATHER = { WEATHER_NONE: 0, WEATHER_RAIN: 3 } as Record<string, number>;
  const resolve = (name: string) => WEATHER[name];

  it("parses a WEATHER_* name or a number and rejects anything else", () => {
    const steps = [{ expectFieldWeather: "WEATHER_RAIN" }, { expectFieldWeather: 0 }];
    expect(parsePlaytest({ ...MINIMAL, steps }).steps).toEqual(steps);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectFieldWeather: "rain" }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectFieldWeather: 256 }] })).toThrow();
  });

  it("passes on a match and fails on a mismatch (planted: rain saved, none expected)", () => {
    expect(() => checkFieldWeather(3, "WEATHER_RAIN", resolve)).not.toThrow();
    expect(() => checkFieldWeather(0, 0, resolve)).not.toThrow();
    expect(() => checkFieldWeather(3, "WEATHER_NONE", resolve)).toThrow(/field weather is 3, expected WEATHER_NONE \(0\)/);
  });

  it.skipIf(!fs.existsSync(GLOBAL_H))("matches u8 weather's offset in struct SaveBlock1 (include/global.h)", () => {
    const sb1 = fs.readFileSync(GLOBAL_H, "utf8").match(/struct SaveBlock1\s*\{([^}]*)\}/)?.[1] ?? "";
    const line = sb1.split("\n").find((l) => /\bu8 weather;/.test(l));
    expect(Number(line?.match(/\/\*(0x[0-9A-Fa-f]+)\*\//)?.[1])).toBe(SAVEBLOCK1_WEATHER);
  });
});

describe("battle summaries (expectBattleSummary)", () => {
  // Trimmed from C381's wi-shelly-full-party / wi-shelly-worn-party battleLog in report.json.
  const WIN = [
    "What will MIGHTYENA do?",
    "MIGHTYENA used BITE!",
    "Foe CARVANHA fainted! ",
    "What will MIGHTYENA do?",
    "Foe QWILFISH used WATER GUN!",
    "MIGHTYENA fainted! ",
    "[sent out party menu slot 2]",
    "What will PELIPPER do?",
    "Foe QWILFISH fainted! ",
    "Player defeated AQUA ADMIN SHELLY! ",
    "Ahahahaha! You're disgustingly strong!",
    "[party hp% 0,62,100]",
  ];
  const LOSS = [
    "What will MIGHTYENA do?",
    "Foe CARVANHA fainted! ",
    "Foe CARVANHA's ROUGH SKIN hurt MIGHTYENA!",
    "MIGHTYENA fainted! ",
    "What will PELIPPER do?",
    "PELIPPER fainted! ",
    "OAK is out of usable POKéMON! ",
    "OAK whited out!",
  ];

  it("summarizes a win and a loss from their battle messages", () => {
    expect(summarizeBattle(WIN)).toEqual({ index: 0, outcome: "win", turns: 3, playerFaints: 1, opponentFaints: 2, foeKOOrder: ["CARVANHA", "QWILFISH"], foeKOTurns: [1, 3], foeMoveFirstTurn: { "WATER GUN": 2 }, playerEndHpPercent: [0, 62, 100], faintCauses: { "QWILFISH/WATER GUN": 1 } });
    expect(summarizeBattle(LOSS)).toEqual({ index: 0, outcome: "loss", turns: 2, playerFaints: 2, opponentFaints: 1, foeKOOrder: ["CARVANHA"], foeKOTurns: [1], foeMoveFirstTurn: {}, faintCauses: { "?": 2 } });
    expect(summarizeBattle(["What will LOTAD do?", "Wild ZIGZAGOON fainted! "])).toMatchObject({ outcome: "unknown", opponentFaints: 1 });
  });

  it("summarizeBattle tallies faint causes by the last foe move", () => {
    const log = [
      "What will SHELGON do?",
      "Foe XATU used PSYCHIC!",
      "SHELGON fainted! ",
      "Foe CLAYDOL used EARTHQUAKE!",
      "LINOONE fainted!",
      "Foe XATU used PSYCHIC!",
      "WHISCASH fainted!",
      "Foe CLAYDOL fainted!",
    ];
    expect(summarizeBattle(log)).toMatchObject({ playerFaints: 3, opponentFaints: 1 });
    expect(summarizeBattle(log).faintCauses).toEqual({ "XATU/PSYCHIC": 2, "CLAYDOL/EARTHQUAKE": 1 });
    expect(summarizeBattle(["What will LOTAD do?", "Wild ZIGZAGOON fainted! "])).not.toHaveProperty("faintCauses");
  });

  it("summarizeBattle lists foe KOs in order and each foe move's first turn (a failed use doesn't count)", () => {
    // Shape of a C397 Route 110 ISABEL double: MINUN's HELPING HAND fails once PLUSLE is gone.
    const log = [
      "What will COMBUSKEN do?",
      "[partner MAKUHITA]",
      "Foe MINUN used HELPING HAND!",
      "Foe MINUN is ready to help Foe PLUSLE!",
      "Foe PLUSLE used SHOCK WAVE!",
      "What will COMBUSKEN do?",
      "[partner MAKUHITA]",
      "Foe PLUSLE fainted! ",
      "What will COMBUSKEN do?",
      "Foe MINUN used QUICK ATTACK!",
      "Foe MINUN used GROWL!",
      "But it failed!",
      "Foe MINUN fainted!",
      "Player defeated POKéFAN ISABEL!",
    ];
    const got = summarizeBattle(log);
    expect(got.turns).toBe(3);
    expect(got.foeKOOrder).toEqual(["PLUSLE", "MINUN"]);
    expect(got.foeKOTurns).toEqual([2, 3]);
    expect(got.foeMoveFirstTurn).toEqual({ "HELPING HAND": 1, "SHOCK WAVE": 1, "QUICK ATTACK": 3 });
    expect(summarizeBattle(["What will LOTAD do?", "Wild ZIGZAGOON fainted! "]).foeKOOrder).toEqual(["ZIGZAGOON"]);
    // A HELPING HAND that only ever failed has no first turn.
    expect(summarizeBattle(["What will A do?", "Foe MINUN used HELPING HAND!", "But it failed!"]).foeMoveFirstTurn).toEqual({});
  });

  it("firstFoeKO and foeMoveByTurn pass on the measured values and fail on planted ones", () => {
    const summaries = summarizeBattles([
      "What will COMBUSKEN do?",
      "Foe MINUN used HELPING HAND!",
      "Foe MINUN is ready to help Foe PLUSLE!",
      "Foe MINUN fainted!",
      "What will COMBUSKEN do?",
      "Foe PLUSLE used SWIFT!",
      "Foe PLUSLE fainted!",
      "Player defeated POKéFAN ISABEL!",
    ]);
    expect(() => checkBattleSummary(summaries, { firstFoeKO: "MINUN", foeMoveByTurn: { move: "HELPING HAND", byTurn: 1 } })).not.toThrow();
    expect(() => checkBattleSummary(summaries, { firstFoeKO: "PLUSLE" })).toThrow(/first foe KO MINUN, expected PLUSLE/);
    expect(() => checkBattleSummary(summaries, { foeMoveByTurn: { move: "HELPING HAND", byTurn: 0 } })).toThrow(/no foe HELPING HAND by turn 0 \(first: turn 1\)/);
    expect(() => checkBattleSummary(summaries, { foeMoveByTurn: { move: "THUNDER WAVE", byTurn: 5 } })).toThrow(/first: turn never/);
    expect(() => checkBattleSummary(summarizeBattles(["What will A do?"]), { firstFoeKO: "MINUN" })).toThrow(/first foe KO \(none\)/);
    expect(parsePlaytest({ ...MINIMAL, steps: [{ expectBattleSummary: { firstFoeKO: "MINUN", foeMoveByTurn: { move: "HELPING HAND", byTurn: 2 } } }] }).steps).toHaveLength(1);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectBattleSummary: { foeMoveByTurn: { move: "HELPING HAND" } } }] })).toThrow();
  });

  it("splits a log into battles at the first prompt after an outcome", () => {
    const got = summarizeBattles([...WIN, ...LOSS]);
    expect(got.map((b) => [b.index, b.outcome, b.turns])).toEqual([[0, "win", 3], [1, "loss", 2]]);
  });

  it("passes inside the bounds and fails with the summary outside them (planted: 2 faints, max 0)", () => {
    const summaries = summarizeBattles(LOSS);
    expect(() => checkBattleSummary(summaries, { outcome: "loss", minPlayerFaints: 1, maxTurns: 2 })).not.toThrow();
    expect(() => checkBattleSummary(summaries, { maxPlayerFaints: 0 })).toThrow(/2 player faints > max 0; summary \{"index":0,"outcome":"loss"/);
    expect(() => checkBattleSummary(summarizeBattles(WIN), { outcome: "loss" })).toThrow(/outcome win, expected loss/);
    expect(() => checkBattleSummary([], {})).toThrow(/no battle/);
    expect(parsePlaytest({ ...MINIMAL, steps: [{ expectBattleSummary: { outcome: "win", maxPlayerFaints: 2 } }] }).steps).toHaveLength(1);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectBattleSummary: { outcome: "draw" } }] })).toThrow();
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

const POKEEMERALD = path.dirname(PLAYTESTS_DIR);
const source = (file: string) => fs.readFileSync(path.join(POKEEMERALD, file), "utf8");
/** Index of `name` in the first plain enum (no explicit values) that lists it. */
const enumIndex = (text: string, name: string) => {
  const body = [...text.matchAll(/enum\s*\{([^}]*)\}/g)].map((m) => m[1]).find((b) => new RegExp(`\\b${name}\\b`).test(b)) ?? "";
  const members = body.replace(/\/\/.*$/gm, "").split(",").map((m) => m.trim()).filter(Boolean);
  return members.findIndex((m) => m === name);
};
/** A C struct's fields, flattened to "type name" strings. */
const structFields = (text: string, struct: string) =>
  (text.match(new RegExp(`struct ${struct}\\s*\\{([^}]*)\\}`))?.[1] ?? "")
    .replace(/\/\/.*$/gm, "")
    .split(";")
    .map((f) => f.trim().replace(/\s+/g, " "))
    .filter(Boolean);

describe("pokenavCall step", () => {
  it("accepts a known contact, alone or with read/maxPresses, and rejects anything else", () => {
    expect(parsePlaytest({ ...MINIMAL, steps: [{ pokenavCall: "BIRCH" }] }).steps[0]).toEqual({ pokenavCall: "BIRCH" });
    const full = { pokenavCall: { contact: "BIRCH", read: false, maxPresses: 50 } };
    expect(parsePlaytest({ ...MINIMAL, steps: [full] }).steps[0]).toEqual(full);
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ pokenavCall: "MOM" }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ pokenavCall: "birch" }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ pokenavCall: { read: true } }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ pokenavCall: { contact: "BIRCH", maxPresses: 0 } }] })).toThrow();
  });

  it.skipIf(!fs.existsSync(path.join(POKEEMERALD, "include", "pokenav.h")))("matches the game's enums and struct layouts", () => {
    expect(enumIndex(source("include/pokenav.h"), "MC_HEADER_PROF_BIRCH")).toBe(MATCH_CALL_CONTACTS.BIRCH.header);
    expect(enumIndex(source("src/start_menu.c"), "MENU_ACTION_POKENAV")).toBe(START_MENU_ACTION_POKENAV);
    // POKENAV_MAIN_MENU = POKENAV_MENU_IDS_START, so the enum index is currentMenuIndex
    const menus = source("include/pokenav.h").replace("POKENAV_MAIN_MENU = POKENAV_MENU_IDS_START", "POKENAV_MAIN_MENU");
    expect(enumIndex(menus, "POKENAV_MATCH_CALL")).toBe(POKENAV.matchCallMenuIndex);
    expect(["POKENAV_MAIN_MENU", "POKENAV_MAIN_MENU_CURSOR_ON_MAP", "POKENAV_MAIN_MENU_CURSOR_ON_MATCH_CALL", "POKENAV_MAIN_MENU_CURSOR_ON_RIBBONS"].map((m) => enumIndex(menus, m))).toEqual([...POKENAV.mainMenuIndexes]);
    expect(enumIndex(source("include/pokenav.h"), "POKENAV_SUBSTRUCT_MAIN_MENU_HANDLER")).toBe(POKENAV.substructMainMenuHandler);
    expect(enumIndex(source("include/pokenav.h"), "POKENAV_SUBSTRUCT_MATCH_CALL_MAIN")).toBe(POKENAV.substructMatchCallMain);

    // 4 + 4 + 2 + 2 + 4 bytes before substructPtrs (16); currentMenuIndex at 4
    expect(structFields(source("src/pokenav.c"), "PokenavResources")).toEqual([
      "u32 (*currentMenuCb1)(void)",
      "u32 currentMenuIndex",
      "u16 mode",
      "u16 conditionSearchId",
      "bool32 hasAnyRibbons",
      "void *substructPtrs[POKENAV_SUBSTRUCT_COUNT]",
    ]);
    expect(structFields(source("src/pokenav_menu_handler.c"), "Pokenav_Menu").slice(0, 2)).toEqual(["u16 menuType", "s16 cursorPos"]);
    // 2 + 2 + 4 + 2 + 2 + 2 (+2 pad) + 4 + 4 + 4 = 28 bytes before the entries
    expect(structFields(source("src/pokenav_match_call_list.c"), "Pokenav_MatchCallMenu")).toEqual([
      "u16 optionCursorPos",
      "u16 maxOptionId",
      "const u8 *matchCallOptions",
      "u16 headerId",
      "u16 numRegistered",
      "u16 numSpecialTrainers",
      "bool32 initFinished",
      "u32 loopedTaskId",
      "u32 (*callback)(struct Pokenav_MatchCallMenu *)",
      "struct PokenavMatchCallEntry matchCallEntries[MAX_REMATCH_ENTRIES - 1]",
    ]);
    expect(structFields(source("include/pokenav.h"), "PokenavMatchCallEntry")).toEqual(["bool8 isSpecialTrainer", "mapsec_u8_t mapSec", "u16 headerId"]);
    expect(POKENAV).toMatchObject({ mcNumRegistered: 10, mcInitFinished: 16, mcCallback: 24, mcEntries: 28, mcEntrySize: 4 });
  });
});

describe("expectBoxCount step", () => {
  it("parses a non-negative count", () => {
    expect(parsePlaytest({ ...MINIMAL, steps: [{ talk: true }, { expectBoxCount: 0 }] }).steps[1]).toEqual({ expectBoxCount: 0 });
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectBoxCount: -1 }] })).toThrow();
    expect(() => parsePlaytest({ ...MINIMAL, steps: [{ expectBoxCount: 1.5 }] })).toThrow();
  });

  it("counts message boxes, not the screen-change or YES/NO markers talk adds", () => {
    expect(messageBoxes([])).toEqual([]);
    expect(messageBoxes(["Hi!", "Battle me?", "[answered YES]", "Go!", "[screen: CB2_OverworldBasic]"])).toEqual([
      "Hi!",
      "Battle me?",
      "Go!",
    ]);
    expect(messageBoxes(["[screen: CB2_OverworldBasic]"])).toHaveLength(0);
  });
});

describe("scenario checkpoint", () => {
  const steps = [{ expectPlayer: { map: "MAP_ROUTE109" } }];
  it("lets a checkpoint stand in for map/x/y, and requires them without one", () => {
    expect(parsePlaytest({ name: "c", checks: "x", scenario: { checkpoint: "slateport_arrival" }, steps }).scenario.checkpoint).toBe(
      "slateport_arrival",
    );
    expect(() => parsePlaytest({ name: "c", checks: "x", scenario: { x: 1, y: 2 }, steps })).toThrow(/map, x and y/);
    expect(() => parsePlaytest({ name: "c", checks: "x", scenario: { checkpoint: "slateport_arrival", x: 1 }, steps })).toThrow(
      /all of map, x and y/,
    );
    expect(() => parsePlaytest({ name: "c", checks: "x", scenario: { checkpoint: "nowhere" }, steps })).toThrow();
  });
});

describe("battleTurns step and waitForBattleText forbid", () => {
  const parse = (step: unknown) => parsePlaytest({ ...MINIMAL, steps: [step] }).steps[0];
  it("parses battleTurns with and without forbid/maxTurns", () => {
    expect(parse({ battleTurns: { move: 2, until: ["used MEGA DRAIN", "super effective"], maxTurns: 8 } })).toEqual({
      battleTurns: { move: 2, until: ["used MEGA DRAIN", "super effective"], maxTurns: 8 },
    });
    expect(parse({ battleTurns: { move: 1, until: "fainted" } })).toEqual({ battleTurns: { move: 1, until: "fainted" } });
    expect(() => parse({ battleTurns: { move: 1, until: "fainted", forbid: ["super effective", "not very effective"] } })).not.toThrow();
  });

  it("parses battleTurns any and replace (a fight that may be won or lost, with forced send-outs)", () => {
    const step = { battleTurns: { move: 1, until: ["disgustingly strong", "whited out"], any: true, replace: true, maxTurns: 30 } };
    expect(parse(step)).toEqual(step);
    expect(() => parse({ battleTurns: { move: 1, until: "x", replace: "yes" } })).toThrow();
  });

  it("parses battleTurns moveFor (a per-foe move slot) and rejects slots outside 1-4", () => {
    const step = { battleTurns: { move: 1, moveFor: { SPECIES_BRELOOM: 2, SPECIES_BLAZIKEN: 3 }, until: ["defeated", "whited out"], any: true } };
    expect(parse(step)).toEqual(step);
    expect(() => parse({ battleTurns: { move: 1, moveFor: { SPECIES_BRELOOM: 0 }, until: "x" } })).toThrow();
    expect(() => parse({ battleTurns: { move: 1, moveFor: { SPECIES_BRELOOM: 5 }, until: "x" } })).toThrow();
    expect(() => parse({ battleTurns: { move: 1, moveFor: { SPECIES_BRELOOM: 1.5 }, until: "x" } })).toThrow();
  });

  it("pickMoveSlot uses the foe's moveFor slot, else the default move", () => {
    const moveFor = { SPECIES_BRELOOM: 2, SPECIES_BLAZIKEN: 3 };
    expect(pickMoveSlot(moveFor, "SPECIES_BLAZIKEN", 1)).toBe(3);
    expect(pickMoveSlot(moveFor, "SPECIES_DRAGONAIR", 1)).toBe(1);
    expect(pickMoveSlot(moveFor, undefined, 4)).toBe(4);
    expect(pickMoveSlot(undefined, "SPECIES_BRELOOM", 2)).toBe(2);
  });

  it("parses battleTurns target (doubles) and rejects other targets", () => {
    for (const target of ["opponentLeft", "opponentRight"]) {
      const step = { battleTurns: { move: 1, target, until: "x" } };
      expect(parse(step)).toEqual(step);
    }
    expect(() => parse({ battleTurns: { move: 1, target: "ally", until: "x" } })).toThrow();
    expect(() => parse({ battleTurns: { move: 1, target: "OPPONENT_LEFT", until: "x" } })).toThrow();
  });

  it("pickSendOutIndex skips the battlers on the field (one in singles, two in doubles)", () => {
    expect(pickSendOutIndex([0, 50, 80], true)).toBe(2);
    expect(pickSendOutIndex([0, 50], false)).toBe(1);
    expect(pickSendOutIndex([0, 50], true)).toBe(-1);
    expect(pickSendOutIndex([0, 0, 0, 0], false)).toBe(-1);
    expect(pickSendOutIndex([0, 0, 40, 30], true, 2)).toBe(3); // the second menu after a double faint
    expect(pickSendOutIndex([0, 0, 40, 0], true, 2)).toBe(-1);
  });

  it("pickTargetBattler (moveFor in doubles) uses opponent-right when opponent-left is down", () => {
    expect(pickTargetBattler([100, 80, 100, 90])).toBe(1);
    expect(pickTargetBattler([100, 0, 100, 90])).toBe(3);
    expect(pickTargetBattler([100, 0, 100, 90], "opponentLeft")).toBe(3);
    expect(pickTargetBattler([100, 80, 100, 90], "opponentRight")).toBe(3);
    expect(pickTargetBattler([100, 80, 100, 0], "opponentRight")).toBe(1);
    expect(pickTargetBattler([100, 80])).toBe(1);
  });

  it("summarizeBattle counts a doubles turn once: the partner prompt is logged as [partner X]", () => {
    const log = [
      "What will SHELGON do?",
      "[partner LINOONE]",
      "Foe CLAYDOL used EARTHQUAKE!",
      "It doesn't affect Foe XATU…",
      "LINOONE fainted!",
      "[sent out party menu slot 3]",
      "What will SHELGON do?",
      "[partner WHISCASH]",
      "Foe XATU fainted!",
    ];
    expect(summarizeBattle(log)).toMatchObject({ turns: 2, playerFaints: 1, opponentFaints: 1 });
  });

  it("PARTY_MENU_SLOT_ID is slotId in struct PartyMenu (include/party_menu.h)", () => {
    const header = fs.readFileSync(path.join(PLAYTESTS_DIR, "..", "include", "party_menu.h"), "utf8");
    const fields = /struct PartyMenu\s*\{([^}]*)\}/.exec(header)![1];
    expect(fields).toMatch(/MainCallback exitCallback;\s*TaskFunc task;\s*u8 menuType:4;\s*u8 layout:2;\s*s8 slotId;/);
    expect(PARTY_MENU_SLOT_ID).toBe(4 + 4 + 1);
  });

  it("rejects a move slot outside 1-4 and a missing until", () => {
    expect(() => parse({ battleTurns: { move: 5, until: "fainted" } })).toThrow();
    expect(() => parse({ battleTurns: { move: 0, until: "fainted" } })).toThrow();
    expect(() => parse({ battleTurns: { move: 1 } })).toThrow();
    expect(() => parse({ battleTurns: { move: 1, until: "x", maxTurns: 0 } })).toThrow();
  });

  it("accepts forbid on waitForBattleText", () => {
    expect(parse({ waitForBattleText: "What will", fresh: true, forbid: "super effective" })).toEqual({
      waitForBattleText: "What will",
      fresh: true,
      forbid: "super effective",
    });
  });
});

describe("in-game partner battles (C391: Steven at the Space Center)", () => {
  const INCLUDE = path.join(PLAYTESTS_DIR, "..", "include");
  const SRC = path.join(PLAYTESTS_DIR, "..", "src");
  const parse = (step: unknown) => parsePlaytest({ ...MINIMAL, steps: [step] }).steps[0];
  const MARK = partnerPartyMarker(["METANG", "SKARMORY", "AGGRON"], ["SHELGON", "LINOONE", "WHISCASH"]);
  // Trimmed from C391's space-center-steven-full / -worn battleLog, plus a planted TOXIC on SHELGON.
  const PARTNER_LOG = [
    MARK,
    "PKMN TRAINER STEVEN sent out METANG! Go, SHELGON!",
    "What will SHELGON do?",
    "METANG used REFLECT!",
    "Ally's REFLECT raised DEFENSE a little!",
    "Foe WEEZING used SLUDGE BOMB!",
    "SHELGON fainted! ",
    "[sent out party menu slot 3]",
    "Go! LINOONE!",
    "What will LINOONE do?",
    "LINOONE used FACADE!",
    "METANG used PSYCHIC!",
    "It's super effective!",
    "Foe MUK fainted! ",
    "Foe MAGMAR used BRICK BREAK!",
    "METANG fainted! ",
    "Go! SKARMORY!",
    "What will LINOONE do?",
    "SKARMORY used TOXIC!",
    "Foe MAGMAR is badly poisoned!",
    "SKARMORY used PROTECT!",
    "LINOONE used FACADE!",
    "Foe WEEZING fainted! ",
    "What will LINOONE do?",
    "SKARMORY used TOXIC!",
    "LINOONE was badly poisoned!",
    "LINOONE used FACADE!",
    "Foe HOUNDOOM fainted! ",
    "MAGMA LEADER MAXIE and MAGMA ADMIN TABITHA were defeated! ",
    "I'm with our leader... Always have been. ...Right?",
    "[party hp% 0,62,100,0,40,100]",
  ];

  it("chooseHalfParty takes exactly three different party slots 1-6", () => {
    expect(parse({ chooseHalfParty: { slots: [1, 2, 3] } })).toEqual({ chooseHalfParty: { slots: [1, 2, 3] } });
    expect(() => parse({ chooseHalfParty: { slots: [4, 1, 6], maxFrames: 2400 } })).not.toThrow();
    expect(() => parse({ chooseHalfParty: { slots: [1, 2] } })).toThrow();
    expect(() => parse({ chooseHalfParty: { slots: [1, 2, 3, 4] } })).toThrow();
    expect(() => parse({ chooseHalfParty: { slots: [1, 1, 2] } })).toThrow(/different/);
    expect(() => parse({ chooseHalfParty: { slots: [0, 1, 2] } })).toThrow();
    expect(() => parse({ chooseHalfParty: { slots: [1, 2, 7] } })).toThrow();
  });

  it("choose-half menu constants match the source (menu type, CONFIRM slot, the bitfield byte)", () => {
    const constants = fs.readFileSync(path.join(INCLUDE, "constants", "party_menu.h"), "utf8");
    expect(constants).toMatch(new RegExp(`#define PARTY_MENU_TYPE_CHOOSE_HALF\\s+${PARTY_MENU_TYPE_CHOOSE_HALF}\\b`));
    const header = fs.readFileSync(path.join(INCLUDE, "party_menu.h"), "utf8");
    expect(/struct PartyMenu\s*\{([^}]*)\}/.exec(header)![1]).toMatch(/MainCallback exitCallback;\s*TaskFunc task;\s*u8 menuType:4;/);
    expect(PARTY_MENU_TYPE_BYTE).toBe(4 + 4);
    const global = fs.readFileSync(path.join(INCLUDE, "constants", "global.h"), "utf8");
    expect(global).toMatch(new RegExp(`#define PARTY_SIZE ${PARTY_MENU_CONFIRM}\\b`));
    const menu = fs.readFileSync(path.join(SRC, "party_menu.c"), "utf8");
    expect(menu).toContain("// PARTY_SIZE + 1 is Cancel, PARTY_SIZE is Confirm");
    expect(menu).toContain("gSelectedOrderFromParty[i] = gPartyMenu.slotId + 1;"); // CursorCb_Enter: 1-based slots
  });

  it("partyCursorButton: DOWN toward a higher slotId (CONFIRM is 6), UP toward a lower one", () => {
    expect(partyCursorButton(0, 2)).toBe("DOWN");
    expect(partyCursorButton(2, PARTY_MENU_CONFIRM)).toBe("DOWN");
    expect(partyCursorButton(7, PARTY_MENU_CONFIRM)).toBe("UP"); // CANCEL → CONFIRM
    expect(partyCursorButton(PARTY_MENU_CONFIRM, 1)).toBe("UP");
  });

  it("BATTLE_TYPE_INGAME_PARTNER and the multi send-out menu order match the source", () => {
    const battle = fs.readFileSync(path.join(INCLUDE, "constants", "battle.h"), "utf8");
    const bit = /#define BATTLE_TYPE_INGAME_PARTNER\s+\(1 << (\d+)\)/.exec(battle);
    expect(bit && 1 << Number(bit[1])).toBe(BATTLE_TYPE_INGAME_PARTNER);
    const menu = fs.readFileSync(path.join(SRC, "party_menu.c"), "utf8");
    // Flank 0 (the player): battle order 0, 3, 1, 2, 4, 5, so menu slots 3-4 (indexes 2-3) are the player's bench.
    expect(menu).toMatch(/partyBattleOrder\[0\] = 3 \| \(0 << 4\);\s*partyBattleOrder\[1\] = 2 \| \(1 << 4\);\s*partyBattleOrder\[2\] = 5 \| \(4 << 4\);/);
    expect(menu).toContain("gPartyMenu.layout == PARTY_LAYOUT_MULTI && (slot == 1 || slot == 4 || slot == 5)");
    expect(PARTNER_MENU_BENCH_END).toBe(4);
  });

  it("pickSendOutIndex in a partner battle picks only your bench (menu indexes 2-3), never the partner's", () => {
    // menu order: SHELGON (fainted), METANG, LINOONE, WHISCASH, SKARMORY, AGGRON
    expect(pickSendOutIndex([0, 80, 50, 90, 100, 100], true, -1, PARTNER_MENU_BENCH_END)).toBe(2);
    expect(pickSendOutIndex([0, 80, 0, 90, 100, 100], true, -1, PARTNER_MENU_BENCH_END)).toBe(3);
    expect(pickSendOutIndex([0, 80, 0, 0, 100, 100], true, -1, PARTNER_MENU_BENCH_END)).toBe(-1);
    expect(pickSendOutIndex([0, 80, 0, 0, 100, 100], true)).toBe(4); // without the end, the old doubles pick
  });

  it("the partner marker round-trips and fails on a name on both sides", () => {
    expect(MARK).toBe(`${PARTNER_PARTY_MARK}METANG,SKARMORY,AGGRON; player: SHELGON,LINOONE,WHISCASH]`);
    expect(parsePartnerPartyMarker(MARK)).toEqual({ partner: ["METANG", "SKARMORY", "AGGRON"], player: ["SHELGON", "LINOONE", "WHISCASH"] });
    expect(parsePartnerPartyMarker("[partner LINOONE]")).toBeUndefined(); // the doubles prompt marker
    expect(() => checkPartnerSides("battleTurns move 1", { partner: ["METANG", "SKARMORY"], player: ["SKARMORY", "LINOONE"] })).toThrow(/SKARMORY is on both/);
    expect(() => checkPartnerSides("x", { partner: ["METANG"], player: ["SHELGON"] })).not.toThrow();
  });

  it("needsPartnerMarker: once per battle, again after a win or loss", () => {
    expect(needsPartnerMarker([])).toBe(true);
    expect(needsPartnerMarker([MARK, "What will SHELGON do?"])).toBe(false);
    expect(needsPartnerMarker([MARK, "were defeated! "])).toBe(true);
    expect(needsPartnerMarker([MARK, "OAK whited out!", MARK])).toBe(false);
  });

  it("summarizeBattle splits faints and KOs by owner (planted: Steven's METANG faint, SKARMORY TOXIC on LINOONE)", () => {
    expect(summarizeBattle(PARTNER_LOG)).toEqual({
      index: 0,
      outcome: "win",
      turns: 4,
      playerFaints: 1, // SHELGON only: METANG is Steven's
      opponentFaints: 3,
      foeKOOrder: ["MUK", "WEEZING", "HOUNDOOM"],
      foeKOTurns: [2, 3, 4],
      foeMoveFirstTurn: { "SLUDGE BOMB": 1, "BRICK BREAK": 2 },
      playerEndHpPercent: [0, 62, 100, 0, 40, 100],
      faintCauses: { "WEEZING/SLUDGE BOMB": 1 }, // not MAGMAR/BRICK BREAK, which downed METANG
      partnerFaints: 1,
      foeKOsBy: { player: 2, partner: 1 }, // MUK after METANG's PSYCHIC; WEEZING, HOUNDOOM after LINOONE
      partnerGuards: [
        { turn: 1, message: "METANG used REFLECT!" },
        { turn: 3, message: "SKARMORY used PROTECT!" },
      ],
      partnerHitsAlly: 1, // turn 4's TOXIC on LINOONE, not turn 3's on Foe MAGMAR
    });
  });

  it("foeHitsBySide counts each damaging foe move by the side whose HP dropped (C395)", () => {
    // Battlers: 0 SHELGON (yours), 1 Foe RHYDON, 2 METANG (Steven's), 3 Foe MUK. Species ids are arbitrary here.
    const hp = (a: number, c: number, sp0 = 372) => battlerHpMarker([{ species: sp0, hp: a }, { species: 112, hp: 150 }, { species: 375, hp: c }, { species: 89, hp: 140 }]);
    expect(hp(120, 110)).toBe(`${BATTLER_HP_MARK}372:120,112:150,375:110,89:140]`);
    expect(parseBattlerHpMarker(hp(1, 2))?.[2]).toEqual({ species: 375, hp: 2 });
    const log = [
      MARK,
      hp(120, 110),
      "What will SHELGON do?",
      "Foe RHYDON used ROCK SLIDE!",
      hp(100, 104), // both sides: one hit each
      "Foe MUK used SLUDGE BOMB!",
      hp(70, 104), // MUK, yours only
      "Foe RHYDON used FIRE PUNCH!",
      hp(70, 60),
      "It's super effective!", // still FIRE PUNCH's message
      "SHELGON is hurt by poison!",
      hp(62, 60), // residual: nobody's hit
      "What will SHELGON do?",
      "Foe RHYDON used DIG!",
      "It doesn't affect SKARMORY...", // immune: no drop, no count
      "Foe RHYDON used THUNDER PUNCH!",
      "Foe RHYDON's attack missed!",
      "Foe MUK used SLUDGE BOMB!",
      hp(0, 60),
      "SHELGON fainted! ",
      hp(90, 60, 264), // LINOONE replaces SHELGON while MUK's move is still open: a different species, not a hit
      "Go! LINOONE!",
    ];
    expect(summarizeBattle(log).foeHitsBySide).toEqual({ RHYDON: { player: 1, partner: 2 }, MUK: { player: 2, partner: 0 } });
  });

  it("foeHitsBySide is left out when the log has no battler HP markers (logs from before C395)", () => {
    expect(summarizeBattle(PARTNER_LOG)).not.toHaveProperty("foeHitsBySide");
  });

  it("a foe KO before any of your side has moved is credited to unknown", () => {
    const got = summarizeBattle([MARK, "What will SHELGON do?", "Foe WEEZING used EXPLOSION!", "Foe WEEZING fainted! "]);
    expect(got.foeKOsBy).toEqual({ player: 0, partner: 0, unknown: 1 });
  });

  it("summarizeBattles starts a new battle at a partner marker after an outcome", () => {
    const got = summarizeBattles(["What will MIGHTYENA do?", "Foe CARVANHA fainted! ", "Player defeated AQUA ADMIN SHELLY! ", ...PARTNER_LOG]);
    expect(got.map((b) => [b.index, b.outcome, b.turns, b.partnerFaints])).toEqual([[0, "win", 1, undefined], [1, "win", 4, 1]]);
  });

  it("non-partner battles summarize byte-identically to C397 (no partner keys, same key order)", () => {
    // C397 added foeKOOrder / foeKOTurns / foeMoveFirstTurn after opponentFaints; nothing else moved since C390.
    // Real logs: C381 wi-shelly-full-party (singles) and C388 tate-liza-y7-ground (doubles, [partner X] prompts).
    const singles = ["What will MIGHTYENA do?", "MIGHTYENA used BITE!", "Foe CARVANHA fainted! ", "What will MIGHTYENA do?", "Foe QWILFISH used WATER GUN!", "MIGHTYENA fainted! ", "[sent out party menu slot 2]", "What will PELIPPER do?", "Foe QWILFISH fainted! ", "Player defeated AQUA ADMIN SHELLY! ", "[party hp% 0,62,100]"];
    expect(JSON.stringify(summarizeBattles(singles))).toBe(
      '[{"index":0,"outcome":"win","turns":3,"playerFaints":1,"opponentFaints":2,"foeKOOrder":["CARVANHA","QWILFISH"],"foeKOTurns":[1,3],"foeMoveFirstTurn":{"WATER GUN":2},"playerEndHpPercent":[0,62,100],"faintCauses":{"QWILFISH/WATER GUN":1}}]',
    );
    const doubles = ["What will SHELGON do?", "[partner LINOONE]", "Foe CLAYDOL used EARTHQUAKE!", "SHELGON fainted! ", "LINOONE used FACADE!", "Foe XATU fainted! ", "What will WHISCASH do?", "[partner LINOONE]", "OAK whited out!"];
    expect(JSON.stringify(summarizeBattles(doubles))).toBe(
      '[{"index":0,"outcome":"loss","turns":2,"playerFaints":1,"opponentFaints":1,"foeKOOrder":["XATU"],"foeKOTurns":[1],"foeMoveFirstTurn":{"EARTHQUAKE":1},"faintCauses":{"CLAYDOL/EARTHQUAKE":1}}]',
    );
  });

  it("expectBattleSummary partner: true fails on a battle without a partner, and false the other way", () => {
    expect(() => checkBattleSummary(summarizeBattles(PARTNER_LOG), { partner: true, outcome: "win" })).not.toThrow();
    expect(() => checkBattleSummary(summarizeBattles(["What will LOTAD do?", "OAK whited out!"]), { partner: true })).toThrow(/no in-game partner summary/);
    expect(() => checkBattleSummary(summarizeBattles(PARTNER_LOG), { partner: false })).toThrow(/expected none/);
    expect(() => parse({ expectBattleSummary: { partner: true } })).not.toThrow();
  });

  describe("partner summary bounds (C392)", () => {
    const sums = summarizeBattles(PARTNER_LOG); // foeKOsBy 2/1, guards REFLECT t1 + PROTECT t3, partnerHitsAlly 1
    const NO_PARTNER = summarizeBattles(["What will LOTAD do?", "LOTAD used ABSORB!", "Foe POOCHYENA fainted! ", "Player defeated YOUNGSTER CALVIN! "]);

    it("the schema takes the four bounds and rejects malformed ones", () => {
      const step = { expectBattleSummary: { minPlayerKOs: 1, maxPartnerKOs: 2, guardByTurn: { move: "REFLECT", byTurn: 2 }, maxPartnerHitsAlly: 0 } };
      expect(parse(step)).toEqual(step);
      expect(() => parse({ expectBattleSummary: { guardByTurn: { byTurn: 2 } } })).not.toThrow();
      expect(() => parse({ expectBattleSummary: { guardByTurn: { move: "REFLECT" } } })).toThrow();
      expect(() => parse({ expectBattleSummary: { guardByTurn: { byTurn: 2, turn: 1 } } })).toThrow();
      expect(() => parse({ expectBattleSummary: { minPlayerKOs: -1 } })).toThrow();
    });

    it("minPlayerKOs: foeKOsBy.player >= n", () => {
      expect(() => checkBattleSummary(sums, { minPlayerKOs: 2 })).not.toThrow();
      expect(() => checkBattleSummary(sums, { minPlayerKOs: 3 })).toThrow(/2 player KOs < minPlayerKOs 3.*"foeKOsBy"/);
    });

    it("maxPartnerKOs: foeKOsBy.partner <= n", () => {
      expect(() => checkBattleSummary(sums, { maxPartnerKOs: 1 })).not.toThrow();
      expect(() => checkBattleSummary(sums, { maxPartnerKOs: 0 })).toThrow(/1 partner KOs > maxPartnerKOs 0/);
    });

    it("guardByTurn: a partner guard (that move, when given) by the turn", () => {
      expect(() => checkBattleSummary(sums, { guardByTurn: { move: "REFLECT", byTurn: 1 } })).not.toThrow();
      expect(() => checkBattleSummary(sums, { guardByTurn: { byTurn: 3 } })).not.toThrow();
      expect(() => checkBattleSummary(sums, { guardByTurn: { move: "PROTECT", byTurn: 2 } })).toThrow(/no partner PROTECT by turn 2/);
      expect(() => checkBattleSummary(sums, { guardByTurn: { move: "LIGHT SCREEN", byTurn: 4 } })).toThrow(/no partner LIGHT SCREEN by turn 4/);
      expect(() => checkBattleSummary(sums, { guardByTurn: { byTurn: 0 } })).toThrow(/no partner guard by turn 0/);
    });

    it("maxPartnerHitsAlly: partnerHitsAlly <= n", () => {
      expect(() => checkBattleSummary(sums, { maxPartnerHitsAlly: 1 })).not.toThrow();
      expect(() => checkBattleSummary(sums, { maxPartnerHitsAlly: 0 })).toThrow(/1 partner hits on yours > maxPartnerHitsAlly 0/);
    });

    it("each fails cleanly on a battle without a partner", () => {
      for (const want of [{ minPlayerKOs: 0 }, { maxPartnerKOs: 3 }, { guardByTurn: { byTurn: 9 } }, { maxPartnerHitsAlly: 3 }]) {
        expect(() => checkBattleSummary(NO_PARTNER, want)).toThrow(/no in-game partner summary/);
      }
      expect(() => checkBattleSummary(NO_PARTNER, { outcome: "win" })).not.toThrow(); // non-partner bounds unaffected
    });
  });
});

describe("talk until (C392)", () => {
  const parse = (step: unknown) => parsePlaytest({ ...MINIMAL, steps: [step] }).steps[0];

  it("the schema takes until (a string or a list) with start/answers", () => {
    expect(parse({ talk: { start: false, until: ["to look back"] } })).toEqual({ talk: { start: false, until: ["to look back"] } });
    expect(() => parse({ talk: { until: "to look back", answers: ["yes"] } })).not.toThrow();
    expect(() => parse({ talk: { until: 3 } })).toThrow();
  });

  it("talkStopsAt: stops on the box with any substring, ignoring line breaks and curly quotes", () => {
    expect(talkStopsAt("STEVEN: I didn’t need\nto look back.", ["to look back"])).toBe(true);
    expect(talkStopsAt("STEVEN: I didn’t need\nto look back.", ["didn't need to look"])).toBe(true);
    expect(talkStopsAt("STEVEN: Whew, that was too tense.", ["to look back", "Whew"])).toBe(true);
    expect(talkStopsAt("MAXIE: We failed…", ["to look back"])).toBe(false);
  });
});
