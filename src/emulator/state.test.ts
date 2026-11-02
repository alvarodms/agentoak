import { describe, expect, it } from "vitest";
import { LAYOUT, LAYOUT_COUNT, decodeBattleMon, decodePartyMon, facingName, parseLayout, type Layout } from "./state.js";

// Vanilla Emerald offsets, as the ROM's gPlaytestLayout reports them.
const VANILLA: Layout = {
  version: 1,
  saveBlock1Location: 0x04,
  saveBlock1Flags: 0x1270,
  saveBlock1Vars: 0x139c,
  objectEventSize: 0x24,
  objectEventCoords: 0x10,
  playerAvatarObjectEventId: 0x05,
  pokemonSize: 100,
  pokemonLevel: 0x54,
  pokemonHp: 0x56,
  pokemonMaxHp: 0x58,
  boxPokemonSecure: 0x20,
  battlePokemonSize: 0x58,
  battlePokemonSpecies: 0x00,
  battlePokemonHp: 0x28,
  battlePokemonMaxHp: 0x2c,
  battlePokemonLevel: 0x2a,
  flagsCount: 0x900,
  varsStart: 0x4000,
  varsCount: 0x100,
};

/** Builds an encrypted struct Pokemon the way the game stores it. */
function partyMon(personality: number, otId: number, species: number, growthSlot: number): Buffer {
  const raw = Buffer.alloc(VANILLA.pokemonSize);
  raw.writeUInt32LE(personality, 0);
  raw.writeUInt32LE(otId, 4);
  const key = (personality ^ otId) >>> 0;
  // Species and held item (0) are the first word of the growth substruct.
  for (let slot = 0; slot < 4; slot++) {
    for (let w = 0; w < 3; w++) {
      const plain = slot === growthSlot && w === 0 ? species : 0;
      raw.writeUInt32LE((plain ^ key) >>> 0, VANILLA.boxPokemonSecure + slot * 12 + w * 4);
    }
  }
  raw.writeUInt8(37, VANILLA.pokemonLevel);
  raw.writeUInt16LE(80, VANILLA.pokemonHp);
  raw.writeUInt16LE(101, VANILLA.pokemonMaxHp);
  return raw;
}

describe("parseLayout", () => {
  it("reads the u16 table in PlaytestLayoutField order", () => {
    const raw = Buffer.alloc(LAYOUT_COUNT * 2);
    for (const [key, index] of Object.entries(LAYOUT)) raw.writeUInt16LE(VANILLA[key as keyof Layout], index * 2);
    expect(parseLayout(raw)).toEqual(VANILLA);
  });
});

describe("decodePartyMon", () => {
  // personality % 24 picks where the growth substruct sits (first column of
  // SUBSTRUCT_CASE in src/pokemon.c): [personality % 24, growth slot].
  it.each([
    [0, 0],
    [6, 1],
    [8, 2],
    [9, 3],
    [23, 3],
  ])("finds species when personality mod 24 is %i (growth slot %i)", (mod, slot) => {
    const personality = 0x12345600 + mod - (0x12345600 % 24);
    expect(personality % 24).toBe(mod);
    const mon = decodePartyMon(partyMon(personality, 0xdeadbeef, 434, slot), VANILLA);
    expect(mon).toEqual({ species: 434, level: 37, hp: 80, maxHp: 101 });
  });
});

describe("decodeBattleMon", () => {
  it("reads the unencrypted battle struct", () => {
    const raw = Buffer.alloc(VANILLA.battlePokemonSize);
    raw.writeUInt16LE(439, 0);
    raw.writeUInt16LE(92, 0x28);
    raw.writeUInt8(40, 0x2a);
    raw.writeUInt16LE(92, 0x2c);
    expect(decodeBattleMon(raw, VANILLA)).toEqual({ species: 439, level: 40, hp: 92, maxHp: 92 });
  });
});

describe("facingName", () => {
  it("maps DIR_* values", () => {
    expect([0, 1, 2, 3, 4, 9].map(facingName)).toEqual(["none", "down", "up", "left", "right", "none"]);
  });
});
