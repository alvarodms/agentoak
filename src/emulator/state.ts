/**
 * Decoding of game state read out of RAM. Struct offsets come from
 * gPlaytestLayout, a table the ROM's own compiler fills in
 * (pokeemerald/src/playtest.c), so they follow the hack's structs.
 */

/** Indexes into gPlaytestLayout; mirrors enum PlaytestLayoutField. */
export const LAYOUT = {
  version: 0,
  saveBlock1Location: 1,
  saveBlock1Flags: 2,
  saveBlock1Vars: 3,
  objectEventSize: 4,
  objectEventCoords: 5,
  playerAvatarObjectEventId: 6,
  pokemonSize: 7,
  pokemonLevel: 8,
  pokemonHp: 9,
  pokemonMaxHp: 10,
  boxPokemonSecure: 11,
  battlePokemonSize: 12,
  battlePokemonSpecies: 13,
  battlePokemonHp: 14,
  battlePokemonMaxHp: 15,
  battlePokemonLevel: 16,
  flagsCount: 17,
  varsStart: 18,
  varsCount: 19,
  objectEventLocalId: 20,
  objectEventMapNum: 21,
  objectEventMapGroup: 22,
  objectEventGraphicsId: 23,
  objectEventsCount: 24,
} as const;
export const LAYOUT_COUNT = 25;

export type Layout = Record<keyof typeof LAYOUT, number>;

export function parseLayout(raw: Buffer, expectedVersion: number): Layout {
  if (raw.length < LAYOUT_COUNT * 2) throw new Error("gPlaytestLayout is shorter than expected");
  const version = raw.readUInt16LE(LAYOUT.version * 2);
  if (version !== expectedVersion) {
    throw new Error(`ROM playtest layout version ${version}, harness expects ${expectedVersion}; rebuild the ROM`);
  }
  const out = {} as Layout;
  for (const [key, index] of Object.entries(LAYOUT)) {
    out[key as keyof Layout] = raw.readUInt16LE(index * 2);
  }
  return out;
}

/** Field maps are stored with this border, so object coords are map coords + 7 (fieldmap.h). */
export const MAP_OFFSET = 7;

/** ObjectEvent.facingDirection is the low nibble of byte 0x18 (a bitfield, so not in the layout table). */
export const OBJECT_EVENT_FACING_OFFSET = 0x18;
/** ObjectEvent.active: byte 0, bit 0. ObjectEvent.invisible: byte 1, bit 5. Bitfields, vanilla layout. */
export const OBJECT_EVENT_ACTIVE = { byte: 0, mask: 1 << 0 } as const;
export const OBJECT_EVENT_INVISIBLE = { byte: 1, mask: 1 << 5 } as const;

/** script.c's CONTEXT_SHUTDOWN: the global script context has nothing running. */
export const SCRIPT_CONTEXT_SHUTDOWN = 2;

export type Facing = "none" | "down" | "up" | "left" | "right";
const FACINGS: Facing[] = ["none", "down", "up", "left", "right"];

export function facingName(dir: number): Facing {
  return FACINGS[dir] ?? "none";
}

/**
 * Index (0-3) of the growth substruct, which holds species, for each
 * personality % 24. First column of SUBSTRUCT_CASE in src/pokemon.c.
 */
const GROWTH_POSITION = [0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3];
const SUBSTRUCT_SIZE = 12;

export interface PartyMon {
  species: number;
  level: number;
  hp: number;
  maxHp: number;
}

/** Decodes one struct Pokemon; species lives in the encrypted growth substruct. */
export function decodePartyMon(raw: Buffer, layout: Layout): PartyMon {
  const personality = raw.readUInt32LE(0);
  const otId = raw.readUInt32LE(4);
  const key = (personality ^ otId) >>> 0;
  const growth = layout.boxPokemonSecure + GROWTH_POSITION[personality % 24] * SUBSTRUCT_SIZE;
  const species = ((raw.readUInt32LE(growth) ^ key) >>> 0) & 0xffff;
  return {
    species,
    level: raw.readUInt8(layout.pokemonLevel),
    hp: raw.readUInt16LE(layout.pokemonHp),
    maxHp: raw.readUInt16LE(layout.pokemonMaxHp),
  };
}

export function decodeBattleMon(raw: Buffer, layout: Layout): PartyMon {
  return {
    species: raw.readUInt16LE(layout.battlePokemonSpecies),
    level: raw.readUInt8(layout.battlePokemonLevel),
    hp: raw.readUInt16LE(layout.battlePokemonHp),
    maxHp: raw.readUInt16LE(layout.battlePokemonMaxHp),
  };
}
