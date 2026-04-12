/**
 * Read/write pokeemerald map blockdata (map.bin files).
 *
 * Format: each block is 2 bytes, little-endian.
 *   Bits  0-9:  metatile ID (0-1023)
 *   Bits 10-11: collision   (0-3)
 *   Bits 12-15: elevation   (0-15)
 *
 * File size = width * height * 2 bytes.
 */

import fs from "node:fs/promises";

export interface Block {
  metatile: number;
  collision: number;
  elevation: number;
}

/** Decode a single 16-bit block value. */
export function decodeBlock(raw: number): Block {
  return {
    metatile: raw & 0x3ff,
    collision: (raw >> 10) & 0x3,
    elevation: (raw >> 12) & 0xf,
  };
}

/** Encode a Block into a 16-bit value. */
export function encodeBlock(block: Block): number {
  return (
    (block.metatile & 0x3ff) |
    ((block.collision & 0x3) << 10) |
    ((block.elevation & 0xf) << 12)
  );
}

/**
 * Read a map.bin file and return a 2D grid of blocks.
 * Returns blocks[y][x] (row-major, matching the file's storage order).
 */
export async function readBlockdata(
  filePath: string,
  width: number,
  height: number,
): Promise<Block[][]> {
  const buf = await fs.readFile(filePath);
  const expected = width * height * 2;

  if (buf.length !== expected) {
    throw new Error(
      `Blockdata size mismatch: expected ${expected} bytes (${width}x${height}), got ${buf.length}`,
    );
  }

  const grid: Block[][] = [];
  let offset = 0;

  for (let y = 0; y < height; y++) {
    const row: Block[] = [];
    for (let x = 0; x < width; x++) {
      const raw = buf.readUInt16LE(offset);
      row.push(decodeBlock(raw));
      offset += 2;
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Read a border.bin file (typically 2x2 = 4 blocks = 8 bytes).
 */
export async function readBorder(filePath: string): Promise<Block[]> {
  const buf = await fs.readFile(filePath);
  const blocks: Block[] = [];

  for (let i = 0; i < buf.length; i += 2) {
    blocks.push(decodeBlock(buf.readUInt16LE(i)));
  }

  return blocks;
}

/**
 * Read metatile_attributes.bin — 2 bytes per metatile.
 * Returns an array indexed by metatile ID.
 *
 * In vanilla pokeemerald, the attribute format is:
 *   Bits  0-7:  behavior (e.g. MB_NORMAL, MB_TALL_GRASS, MB_WATER)
 *   Bits  8-11: unused / layer type in some forks
 *   Bits 12-15: unused
 */
export interface MetatileAttribute {
  behavior: number;
  raw: number;
}

export async function readMetatileAttributes(
  filePath: string,
): Promise<MetatileAttribute[]> {
  const buf = await fs.readFile(filePath);
  const attrs: MetatileAttribute[] = [];

  for (let i = 0; i < buf.length; i += 2) {
    const raw = buf.readUInt16LE(i);
    attrs.push({
      behavior: raw & 0xff,
      raw,
    });
  }

  return attrs;
}

// ─── Metatile composition (metatiles.bin) ────────────────────────────────────

const NUM_TILES_PER_METATILE = 8;

/** A single tile entry within a metatile (decoded GBA BG tilemap u16). */
export interface TileEntry {
  tileIndex: number;
  hflip: boolean;
  vflip: boolean;
  palette: number;
}

/** One metatile = 8 tile entries (bottom 2x2 + top 2x2). */
export interface MetatileTiles {
  tiles: TileEntry[];
}

/** Decode a single u16 GBA tilemap entry. */
export function decodeTileEntry(raw: number): TileEntry {
  return {
    tileIndex: raw & 0x3ff,
    hflip: !!(raw & 0x400),
    vflip: !!(raw & 0x800),
    palette: (raw >> 12) & 0xf,
  };
}

/**
 * Read metatiles.bin — 8 x u16 per metatile.
 *
 * Each metatile is composed of 8 tile references (GBA BG tilemap entries):
 *   [0-3] = bottom layer 2x2 tiles (left-to-right, top-to-bottom)
 *   [4-7] = top layer 2x2 tiles
 *
 * Each u16:
 *   Bits  0-9:  tile index into the tileset's tile sheet
 *   Bit  10:    horizontal flip
 *   Bit  11:    vertical flip
 *   Bits 12-15: palette number (0-15)
 */
export async function readMetatiles(
  filePath: string,
): Promise<MetatileTiles[]> {
  const buf = await fs.readFile(filePath);
  const bytesPerMetatile = NUM_TILES_PER_METATILE * 2;
  const count = Math.floor(buf.length / bytesPerMetatile);
  const metatiles: MetatileTiles[] = [];

  for (let m = 0; m < count; m++) {
    const tiles: TileEntry[] = [];
    for (let t = 0; t < NUM_TILES_PER_METATILE; t++) {
      const offset = m * bytesPerMetatile + t * 2;
      tiles.push(decodeTileEntry(buf.readUInt16LE(offset)));
    }
    metatiles.push({ tiles });
  }

  return metatiles;
}
