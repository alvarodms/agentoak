/**
 * Playtest scenarios: "start a new game, with this party and these flags,
 * standing on this tile". The harness writes a scenario into a copy of the
 * ROM (gPlaytestScenario, see pokeemerald/include/playtest.h) and the game
 * applies it on boot, so a test reaches Meteor Falls B1F in about two
 * seconds instead of an hour of play.
 *
 * Names are pokeemerald constants ("MAP_ROUTE104", "FLAG_BADGE07_GET",
 * "SPECIES_TREECKO_HOENN"), resolved against the hack's own headers.
 */

import fs from "node:fs";
import { encodeGameText, type Charmap } from "./charmap.js";
import { resolveConstants, type ResolveOptions } from "./constants.js";
import type { SymbolTable } from "./symbols.js";

export interface ScenarioMon {
  species: string;
  level: number;
  item?: string;
  /** Up to 4 MOVE_* names. Omit for the level-up moveset. */
  moves?: string[];
}

export interface Scenario {
  map: string;
  x: number;
  y: number;
  /** Default "OAK". At most 7 characters. */
  name?: string;
  /** Default "male". */
  gender?: "male" | "female";
  /** Default 3000, the new-game amount. */
  money?: number;
  flags?: string[];
  /** Flags to clear after the new-game defaults (e.g. a hide flag). */
  clearFlags?: string[];
  vars?: Record<string, number>;
  party?: ScenarioMon[];
  /** ITEM_* name -> quantity. */
  bag?: Record<string, number>;
  /** SPECIES_* marked seen and caught in the Pokédex. */
  caught?: string[];
  /** TRAINER_* already beaten (their trainer flag, TRAINER_FLAGS_START + id, is set). */
  defeatedTrainers?: string[];
  /**
   * ITEM_* registered to SELECT. Not part of the ROM struct: bootScenario
   * writes it into gSaveBlock1Ptr->registeredItem as soon as the overworld
   * runs, before any field script can wait on A. A map's ON_RESUME has run by
   * then but its script cannot have read the slot yet.
   */
  registeredItem?: string;
}

/** Offset of registeredItem in struct SaveBlock1 (include/global.h marks it 0x496; a unit test checks). */
export const SAVEBLOCK1_REGISTERED_ITEM = 0x496;

/* Mirrors include/playtest.h. Keep in sync; bump LAYOUT_VERSION together. */
export const PLAYTEST_MAGIC_INACTIVE = 0x584b414f;
export const PLAYTEST_MAGIC_ACTIVE = 0x504b414f;
export const LAYOUT_VERSION = 2;
export const SCENARIO_SIZE = 0x1fc;
const LIMITS = { flags: 64, vars: 32, party: 6, items: 16, dex: 32, name: 7 } as const;
const FLAG_CLEAR = 0x8000;
const OFFSET = {
  magic: 0x000,
  layoutVersion: 0x004,
  mapGroup: 0x006,
  mapNum: 0x007,
  x: 0x008,
  y: 0x009,
  gender: 0x00a,
  partyCount: 0x00b,
  flagCount: 0x00c,
  varCount: 0x00d,
  itemCount: 0x00e,
  dexCount: 0x00f,
  money: 0x010,
  playerName: 0x014,
  flags: 0x01c,
  vars: 0x09c,
  party: 0x11c,
  items: 0x17c,
  dexCaught: 0x1bc,
} as const;
const MON_SIZE = 0x10;

const ROM_BASE = 0x08000000;

function check(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`invalid scenario: ${msg}`);
}

function u16(value: number, what: string): number {
  check(Number.isInteger(value) && value >= 0 && value <= 0xffff, `${what} must fit in 16 bits (got ${value})`);
  return value;
}

/** Every constant name a scenario refers to. */
export function scenarioConstants(s: Scenario): string[] {
  return [
    s.map,
    ...(s.flags ?? []),
    ...(s.clearFlags ?? []),
    ...Object.keys(s.vars ?? {}),
    ...(s.party ?? []).flatMap((m) => [m.species, ...(m.item ? [m.item] : []), ...(m.moves ?? [])]),
    ...Object.keys(s.bag ?? {}),
    ...(s.caught ?? []),
    ...(s.defeatedTrainers?.length ? ["TRAINER_FLAGS_START", ...s.defeatedTrainers] : []),
    ...(s.registeredItem ? [s.registeredItem] : []),
  ];
}

/**
 * Encodes a scenario as the PlaytestScenario struct bytes. `constants` must
 * hold every name from scenarioConstants(); see resolveScenario().
 */
export function encodeScenario(s: Scenario, constants: Map<string, number>, charmap: Charmap): Buffer {
  const value = (name: string): number => {
    const v = constants.get(name);
    if (v === undefined) throw new Error(`unresolved constant ${name}`);
    return v;
  };
  const flags = s.flags ?? [];
  const clearFlags = s.clearFlags ?? [];
  const trainerFlags = (s.defeatedTrainers ?? []).map((t) => value("TRAINER_FLAGS_START") + value(t));
  const vars = Object.entries(s.vars ?? {});
  const party = s.party ?? [];
  const bag = Object.entries(s.bag ?? {});
  const caught = s.caught ?? [];
  const name = s.name ?? "OAK";

  check(Number.isInteger(s.x) && s.x >= 0 && s.x <= 127, `x must be 0-127 (got ${s.x})`);
  check(Number.isInteger(s.y) && s.y >= 0 && s.y <= 127, `y must be 0-127 (got ${s.y})`);
  check(flags.length + clearFlags.length + trainerFlags.length <= LIMITS.flags, `at most ${LIMITS.flags} flags (including defeated trainers)`);
  check(vars.length <= LIMITS.vars, `at most ${LIMITS.vars} vars`);
  check(party.length <= LIMITS.party, `at most ${LIMITS.party} party members`);
  check(bag.length <= LIMITS.items, `at most ${LIMITS.items} bag entries`);
  check(caught.length <= LIMITS.dex, `at most ${LIMITS.dex} caught species`);
  check([...name].length >= 1 && [...name].length <= LIMITS.name, `name must be 1-${LIMITS.name} characters`);

  const buf = Buffer.alloc(SCENARIO_SIZE);
  buf.writeUInt32LE(PLAYTEST_MAGIC_ACTIVE, OFFSET.magic);
  buf.writeUInt16LE(LAYOUT_VERSION, OFFSET.layoutVersion);

  const map = value(s.map);
  buf.writeInt8(map >> 8, OFFSET.mapGroup);
  buf.writeInt8(map & 0xff, OFFSET.mapNum);
  buf.writeInt8(s.x, OFFSET.x);
  buf.writeInt8(s.y, OFFSET.y);
  buf.writeUInt8(s.gender === "female" ? 1 : 0, OFFSET.gender);
  buf.writeUInt8(party.length, OFFSET.partyCount);
  buf.writeUInt8(flags.length + trainerFlags.length + clearFlags.length, OFFSET.flagCount);
  buf.writeUInt8(vars.length, OFFSET.varCount);
  buf.writeUInt8(bag.length, OFFSET.itemCount);
  buf.writeUInt8(caught.length, OFFSET.dexCount);
  const money = s.money ?? 3000;
  check(Number.isInteger(money) && money >= 0 && money <= 999999, "money must be 0-999999");
  buf.writeUInt32LE(money, OFFSET.money);
  Buffer.from(encodeGameText(name, charmap)).copy(buf, OFFSET.playerName);

  [...flags.map((f) => value(f)), ...trainerFlags, ...clearFlags.map((f) => value(f) | FLAG_CLEAR)].forEach((flag, i) => {
    buf.writeUInt16LE(u16(flag, "flag"), OFFSET.flags + i * 2);
  });
  vars.forEach(([name, v], i) => {
    buf.writeUInt16LE(u16(value(name), name), OFFSET.vars + i * 4);
    buf.writeUInt16LE(u16(v, `${name} value`), OFFSET.vars + i * 4 + 2);
  });
  party.forEach((mon, i) => {
    const base = OFFSET.party + i * MON_SIZE;
    check(Number.isInteger(mon.level) && mon.level >= 1 && mon.level <= 100, `${mon.species} level must be 1-100`);
    check((mon.moves ?? []).length <= 4, `${mon.species} has more than 4 moves`);
    check(value(mon.species) > 0, `party species ${mon.species} is not a real species`);
    buf.writeUInt16LE(u16(value(mon.species), mon.species), base);
    buf.writeUInt8(mon.level, base + 2);
    buf.writeUInt16LE(mon.item ? value(mon.item) : 0, base + 4);
    (mon.moves ?? []).forEach((move, j) => buf.writeUInt16LE(u16(value(move), move), base + 6 + j * 2));
  });
  bag.forEach(([item, quantity], i) => {
    check(Number.isInteger(quantity) && quantity >= 1 && quantity <= 999, `${item} quantity must be 1-999`);
    buf.writeUInt16LE(u16(value(item), item), OFFSET.items + i * 4);
    buf.writeUInt16LE(quantity, OFFSET.items + i * 4 + 2);
  });
  caught.forEach((species, i) => {
    check(value(species) > 0, `caught species ${species} is not a real species`);
    buf.writeUInt16LE(u16(value(species), species), OFFSET.dexCaught + i * 2);
  });
  return buf;
}

/** Resolves a scenario's names and encodes it. */
export function resolveScenario(s: Scenario, charmap: Charmap, opts: ResolveOptions = {}): Buffer {
  return encodeScenario(s, resolveConstants(scenarioConstants(s), opts), charmap);
}

/**
 * Writes a copy of `romPath` with the scenario patched in. Fails if the ROM
 * has no playtest hook, or one from a different layout version.
 */
export function writeScenarioRom(romPath: string, outPath: string, scenario: Buffer, symbols: SymbolTable): void {
  const sym = symbols.get("gPlaytestScenario");
  if (sym.size !== SCENARIO_SIZE) {
    throw new Error(`gPlaytestScenario is ${sym.size} bytes in this ROM, harness expects ${SCENARIO_SIZE}`);
  }
  const rom = fs.readFileSync(romPath);
  const offset = sym.address - ROM_BASE;
  const magic = rom.readUInt32LE(offset);
  const version = rom.readUInt16LE(offset + OFFSET.layoutVersion);
  if (magic !== PLAYTEST_MAGIC_INACTIVE) {
    throw new Error(`gPlaytestScenario magic is 0x${magic.toString(16)}; expected the inactive marker`);
  }
  if (version !== LAYOUT_VERSION) {
    throw new Error(`ROM playtest layout version ${version}, harness expects ${LAYOUT_VERSION}`);
  }
  scenario.copy(rom, offset);
  fs.writeFileSync(outPath, rom);
}
