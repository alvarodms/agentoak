/**
 * Minimal indexed PNG decoder for GBA tileset images.
 *
 * These are 4-bit (or 8-bit) indexed-color PNGs (color type 3) where each
 * pixel value is a palette index (0-15). The actual palette to apply depends
 * on the metatile's tile entry, not the palette embedded in the PNG.
 */

import fs from "node:fs/promises";
import zlib from "node:zlib";
import { promisify } from "node:util";

const inflate = promisify(zlib.inflate);

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export interface IndexedPngData {
  width: number;
  height: number;
  /** Raw palette indices, one byte per pixel (row-major, values 0-15). */
  indices: Buffer;
}

/**
 * Decode an indexed-color PNG and return the raw palette indices
 * without applying the embedded palette.
 */
export async function readIndexedPng(filePath: string): Promise<IndexedPngData> {
  const buf = await fs.readFile(filePath);

  if (buf.compare(PNG_SIGNATURE, 0, 8, 0, 8) !== 0) {
    throw new Error("Not a valid PNG file");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks: Buffer[] = [];

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (colorType !== 3) {
        throw new Error(
          `Expected indexed-color PNG (color type 3), got ${colorType}`,
        );
      }
    } else if (type === "IDAT") {
      idatChunks.push(Buffer.from(data));
    } else if (type === "IEND") {
      break;
    }

    offset += 8 + length + 4;
  }

  const compressedData = Buffer.concat(idatChunks);
  const rawData = await inflate(compressedData);

  const scanlineBytes = Math.ceil((width * bitDepth) / 8);
  const stride = scanlineBytes + 1;
  const bpp = 1; // for sub-byte depths, filter operates on whole bytes

  const indices = Buffer.alloc(width * height);
  const prevRow = Buffer.alloc(scanlineBytes);
  const currentRow = Buffer.alloc(scanlineBytes);

  for (let y = 0; y < height; y++) {
    const filterType = rawData[y * stride];
    const rowData = rawData.subarray(y * stride + 1, y * stride + 1 + scanlineBytes);

    for (let i = 0; i < scanlineBytes; i++) {
      const raw = rowData[i];
      const a = i >= bpp ? currentRow[i - bpp] : 0;
      const b = prevRow[i];
      const c = i >= bpp ? prevRow[i - bpp] : 0;

      switch (filterType) {
        case 0: currentRow[i] = raw; break;
        case 1: currentRow[i] = (raw + a) & 0xff; break;
        case 2: currentRow[i] = (raw + b) & 0xff; break;
        case 3: currentRow[i] = (raw + Math.floor((a + b) / 2)) & 0xff; break;
        case 4: currentRow[i] = (raw + paethPredictor(a, b, c)) & 0xff; break;
        default: throw new Error(`Unknown PNG filter type: ${filterType}`);
      }
    }

    if (bitDepth === 4) {
      for (let x = 0; x < width; x++) {
        const byteIdx = x >> 1;
        indices[y * width + x] =
          (x & 1) === 0
            ? (currentRow[byteIdx] >> 4) & 0xf
            : currentRow[byteIdx] & 0xf;
      }
    } else if (bitDepth === 8) {
      currentRow.copy(indices, y * width, 0, width);
    } else {
      throw new Error(`Unsupported bit depth for indexed PNG: ${bitDepth}`);
    }

    currentRow.copy(prevRow);
  }

  return { width, height, indices };
}

function paethPredictor(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// ─── JASC-PAL reader ─────────────────────────────────────────────────────────

export type RgbColor = [number, number, number];

/**
 * Parse a JASC-PAL file into an array of RGB triples.
 *
 * Format:
 *   JASC-PAL
 *   0100
 *   16
 *   R G B  (repeated N times)
 */
export async function readJascPalette(filePath: string): Promise<RgbColor[]> {
  const text = await fs.readFile(filePath, "utf-8");
  const lines = text.trim().split(/\r?\n/).map((l) => l.trim());
  const numColors = parseInt(lines[2], 10);
  const colors: RgbColor[] = [];

  for (let i = 0; i < numColors; i++) {
    const parts = lines[3 + i].split(/\s+/).map(Number);
    colors.push([parts[0], parts[1], parts[2]]);
  }

  return colors;
}

/**
 * Load all 13 palettes for a map's combined primary+secondary tileset.
 *
 * pokeemerald palette assignment (from include/fieldmap.h):
 *   NUM_PALS_IN_PRIMARY = 6  → palettes 0-5 from primary tileset
 *   NUM_PALS_TOTAL      = 13 → palettes 6-12 from secondary tileset
 *
 * Returns an array of 13 palettes, each with 16 [r,g,b] colors.
 */
export async function loadCombinedPalettes(
  primaryPalDir: string,
  secondaryPalDir: string,
): Promise<RgbColor[][]> {
  const NUM_PALS_IN_PRIMARY = 6;
  const NUM_PALS_TOTAL = 13;
  const palettes: RgbColor[][] = [];

  for (let i = 0; i < NUM_PALS_TOTAL; i++) {
    const nn = i.toString().padStart(2, "0");
    const dir = i < NUM_PALS_IN_PRIMARY ? primaryPalDir : secondaryPalDir;
    const palPath = `${dir}/${nn}.pal`;
    try {
      palettes.push(await readJascPalette(palPath));
    } catch {
      palettes.push(Array.from({ length: 16 }, () => [0, 0, 0] as RgbColor));
    }
  }

  return palettes;
}
