import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { parseCharmap } from "./charmap.js";
import {
  LAYOUT_VERSION,
  PLAYTEST_MAGIC_ACTIVE,
  PLAYTEST_MAGIC_INACTIVE,
  SCENARIO_SIZE,
  encodeScenario,
  scenarioConstants,
  writeScenarioRom,
  type Scenario,
} from "./scenario.js";
import { SymbolTable } from "./symbols.js";

const charmap = parseCharmap(`
'A' = BB
'K' = C5
'O' = C9
'$' = FF
`);

const CONSTANTS = new Map<string, number>([
  ["MAP_ROUTE104", 19 | (0 << 8)],
  ["MAP_METEOR_FALLS_B1F_2R", 3 | (24 << 8)],
  ["FLAG_BADGE01_GET", 0x867],
  ["FLAG_TEMP_11", 0x11],
  ["VAR_STARTER_MON", 0x4023],
  ["SPECIES_BAGON", 395],
  ["SPECIES_LOTAD_HOENN", 434],
  ["SPECIES_NONE", 0],
  ["ITEM_ORAN_BERRY", 139],
  ["ITEM_POTION", 13],
  ["MOVE_ABSORB", 71],
  ["MOVE_GROWL", 45],
]);

const SCENARIO: Scenario = {
  map: "MAP_METEOR_FALLS_B1F_2R",
  x: 6,
  y: 4,
  gender: "female",
  money: 12345,
  flags: ["FLAG_BADGE01_GET"],
  clearFlags: ["FLAG_TEMP_11"],
  vars: { VAR_STARTER_MON: 1 },
  party: [
    { species: "SPECIES_BAGON", level: 12, item: "ITEM_ORAN_BERRY" },
    { species: "SPECIES_LOTAD_HOENN", level: 9, moves: ["MOVE_ABSORB", "MOVE_GROWL"] },
  ],
  bag: { ITEM_POTION: 5 },
  caught: ["SPECIES_LOTAD_HOENN"],
};

describe("encodeScenario", () => {
  const buf = encodeScenario(SCENARIO, CONSTANTS, charmap);

  it("writes the header fields at the include/playtest.h offsets", () => {
    expect(buf.length).toBe(SCENARIO_SIZE);
    expect(buf.readUInt32LE(0x00)).toBe(PLAYTEST_MAGIC_ACTIVE);
    expect(buf.readUInt16LE(0x04)).toBe(LAYOUT_VERSION);
    expect([buf.readInt8(0x06), buf.readInt8(0x07), buf.readInt8(0x08), buf.readInt8(0x09)]).toEqual([24, 3, 6, 4]);
    expect(buf.readUInt8(0x0a)).toBe(1); // female
    // party, flags (set + clear), vars, items, dex
    expect([...buf.subarray(0x0b, 0x10)]).toEqual([2, 2, 1, 1, 1]);
    expect(buf.readUInt32LE(0x10)).toBe(12345);
    expect([...buf.subarray(0x14, 0x18)]).toEqual([0xc9, 0xbb, 0xc5, 0xff]); // "OAK" + EOS
  });

  it("marks cleared flags with the high bit, after the set flags", () => {
    expect(buf.readUInt16LE(0x1c)).toBe(0x867);
    expect(buf.readUInt16LE(0x1e)).toBe(0x8011);
  });

  it("writes vars, party, bag and dex entries", () => {
    expect([buf.readUInt16LE(0x9c), buf.readUInt16LE(0x9e)]).toEqual([0x4023, 1]);
    // mon 0: species, level, held item, no moves (level-up moveset)
    expect([buf.readUInt16LE(0x11c), buf.readUInt8(0x11e), buf.readUInt16LE(0x120), buf.readUInt16LE(0x122)]).toEqual([395, 12, 139, 0]);
    // mon 1 starts 0x10 later (agbcc pads PlaytestMon to 16 bytes)
    expect([buf.readUInt16LE(0x12c), buf.readUInt8(0x12e), buf.readUInt16LE(0x132), buf.readUInt16LE(0x134)]).toEqual([434, 9, 71, 45]);
    expect([buf.readUInt16LE(0x17c), buf.readUInt16LE(0x17e)]).toEqual([13, 5]);
    expect(buf.readUInt16LE(0x1bc)).toBe(434);
  });

  it("defaults to a male player named OAK with new-game money", () => {
    const minimal = encodeScenario({ map: "MAP_ROUTE104", x: 1, y: 2 }, CONSTANTS, charmap);
    expect(minimal.readUInt8(0x0a)).toBe(0);
    expect(minimal.readUInt32LE(0x10)).toBe(3000);
    expect([...minimal.subarray(0x0b, 0x10)]).toEqual([0, 0, 0, 0, 0]);
  });

  it("sets a beaten trainer's flag (TRAINER_FLAGS_START + id) before cleared flags", () => {
    const constants = new Map([...CONSTANTS, ["TRAINER_FLAGS_START", 0x500], ["TRAINER_ROUTE119_STORM_CHASER", 117]]);
    const buf = encodeScenario({ ...SCENARIO, defeatedTrainers: ["TRAINER_ROUTE119_STORM_CHASER"] }, constants, charmap);
    expect(buf.readUInt8(0x0c)).toBe(3); // 1 set + 1 trainer + 1 clear
    expect([buf.readUInt16LE(0x1c), buf.readUInt16LE(0x1e), buf.readUInt16LE(0x20)]).toEqual([0x867, 0x500 + 117, 0x8011]);
    expect(scenarioConstants({ map: "MAP_ROUTE104", x: 0, y: 0, defeatedTrainers: ["TRAINER_X"] })).toEqual([
      "MAP_ROUTE104",
      "TRAINER_FLAGS_START",
      "TRAINER_X",
    ]);
  });

  it("rejects scenarios the ROM cannot represent", () => {
    const bad = (patch: Partial<Scenario>) => () => encodeScenario({ ...SCENARIO, ...patch }, CONSTANTS, charmap);
    expect(bad({ x: 200 })).toThrow(/x must be 0-127/);
    expect(bad({ party: [{ species: "SPECIES_BAGON", level: 0 }] })).toThrow(/level/);
    expect(bad({ party: [{ species: "SPECIES_NONE", level: 5 }] })).toThrow(/not a real species/);
    expect(bad({ caught: ["SPECIES_NONE"] })).toThrow(/not a real species/);
    expect(bad({ name: "OAKOAKOA" })).toThrow(/name/);
    expect(bad({ name: "Z" })).toThrow(/not in the charmap/);
    expect(bad({ flags: ["FLAG_MISSING"] })).toThrow(/unresolved constant FLAG_MISSING/);
  });
});

describe("scenarioConstants", () => {
  it("lists every name the scenario uses", () => {
    expect(new Set(scenarioConstants(SCENARIO))).toEqual(
      new Set([...CONSTANTS.keys()].filter((k) => k !== "MAP_ROUTE104" && k !== "SPECIES_NONE")),
    );
  });
});

describe("writeScenarioRom", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "oak-scenario-test-"));
  afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

  const romWith = (magic: number, version: number) => {
    const rom = Buffer.alloc(0x1000);
    rom.writeUInt32LE(magic, 0x800);
    rom.writeUInt16LE(version, 0x804);
    const file = path.join(tmp, `in-${magic}-${version}.gba`);
    fs.writeFileSync(file, rom);
    return file;
  };
  const symbols = (size = SCENARIO_SIZE) =>
    new SymbolTable([{ name: "gPlaytestScenario", address: 0x08000800, size, type: "R" }]);
  const scenario = encodeScenario(SCENARIO, CONSTANTS, charmap);

  it("patches the struct into a copy and leaves the original alone", () => {
    const input = romWith(PLAYTEST_MAGIC_INACTIVE, LAYOUT_VERSION);
    const output = path.join(tmp, "out.gba");
    writeScenarioRom(input, output, scenario, symbols());
    expect(fs.readFileSync(output).subarray(0x800, 0x800 + SCENARIO_SIZE).equals(scenario)).toBe(true);
    expect(fs.readFileSync(input).readUInt32LE(0x800)).toBe(PLAYTEST_MAGIC_INACTIVE);
  });

  it("refuses ROMs without a matching playtest hook", () => {
    const out = path.join(tmp, "x.gba");
    expect(() => writeScenarioRom(romWith(0, LAYOUT_VERSION), out, scenario, symbols())).toThrow(/magic/);
    expect(() => writeScenarioRom(romWith(PLAYTEST_MAGIC_INACTIVE, 99), out, scenario, symbols())).toThrow(/layout version 99/);
    expect(() => writeScenarioRom(romWith(PLAYTEST_MAGIC_INACTIVE, LAYOUT_VERSION), out, scenario, symbols(0x1f0))).toThrow(/bytes/);
  });
});
