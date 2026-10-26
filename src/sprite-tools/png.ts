/**
 * Minimal PNG codec for GBA sprite work: decodes indexed sprites (1/2/4/8-bit)
 * and 8-bit RGB/RGBA ones into a palette + index grid, and encodes indexed or
 * RGB images. No interlace support (GBA sprite PNGs are never interlaced).
 */

import zlib from "node:zlib";

export type Rgb = [number, number, number];

/** A sprite as palette indices. Index 0 is the transparent background. */
export interface IndexedImage {
  width: number;
  height: number;
  palette: Rgb[];
  /** Row-major palette indices, length width * height. */
  pixels: Uint8Array;
}

/** An RGB image (used for previews). */
export interface RgbImage {
  width: number;
  height: number;
  /** Row-major RGB triples, length width * height * 3. */
  data: Uint8Array;
}

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readChunks(buf: Buffer): { type: string; data: Buffer }[] {
  if (buf.length < 8 || !buf.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG file");
  const chunks: { type: string; data: Buffer }[] = [];
  let o = 8;
  while (o + 8 <= buf.length) {
    const len = buf.readUInt32BE(o);
    const type = buf.toString("ascii", o + 4, o + 8);
    chunks.push({ type, data: buf.subarray(o + 8, o + 8 + len) });
    o += 12 + len;
    if (type === "IEND") break;
  }
  return chunks;
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

/** Undo PNG scanline filters; returns the raw rows (no filter bytes). */
function unfilter(raw: Buffer, height: number, rowBytes: number, bpp: number): Uint8Array {
  const out = new Uint8Array(height * rowBytes);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (rowBytes + 1)];
    const src = y * (rowBytes + 1) + 1, dst = y * rowBytes;
    for (let i = 0; i < rowBytes; i++) {
      const x = raw[src + i];
      const a = i >= bpp ? out[dst + i - bpp] : 0;
      const b = y > 0 ? out[dst - rowBytes + i] : 0;
      const c = i >= bpp && y > 0 ? out[dst - rowBytes + i - bpp] : 0;
      const pred = filter === 0 ? 0 : filter === 1 ? a : filter === 2 ? b : filter === 3 ? (a + b) >> 1 : paeth(a, b, c);
      out[dst + i] = (x + pred) & 255;
    }
  }
  return out;
}

/**
 * Decode a sprite PNG. Indexed PNGs keep their palette order. Truecolor PNGs
 * (as some fetched sprites are) get a palette built on the fly, with the
 * top-left pixel's color (or full transparency) as index 0.
 */
export function decodePng(buf: Buffer): IndexedImage {
  const chunks = readChunks(buf);
  const ihdr = chunks.find((c) => c.type === "IHDR")?.data;
  if (!ihdr) throw new Error("PNG missing IHDR");
  const width = ihdr.readUInt32BE(0), height = ihdr.readUInt32BE(4);
  const depth = ihdr[8], colorType = ihdr[9];
  if (ihdr[12] !== 0) throw new Error("interlaced PNGs are not supported");
  const raw = zlib.inflateSync(Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data)));

  if (colorType === 3) {
    const plte = chunks.find((c) => c.type === "PLTE")?.data;
    if (!plte) throw new Error("indexed PNG missing PLTE");
    const palette: Rgb[] = [];
    for (let i = 0; i + 2 < plte.length; i += 3) palette.push([plte[i], plte[i + 1], plte[i + 2]]);
    const rowBytes = Math.ceil((width * depth) / 8);
    const rows = unfilter(raw, height, rowBytes, 1);
    const pixels = new Uint8Array(width * height);
    const mask = (1 << depth) - 1;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const bit = x * depth;
        const byte = rows[y * rowBytes + (bit >> 3)];
        pixels[y * width + x] = (byte >> (8 - depth - (bit & 7))) & mask;
      }
    return { width, height, palette, pixels };
  }

  if ((colorType === 2 || colorType === 6) && depth === 8) {
    const channels = colorType === 6 ? 4 : 3;
    const rows = unfilter(raw, height, width * channels, channels);
    const at = (i: number) => {
      const o = i * channels;
      return channels === 4 && rows[o + 3] === 0 ? "t" : `${rows[o]},${rows[o + 1]},${rows[o + 2]}`;
    };
    const bgKey = at(0);
    const index = new Map<string, number>([[bgKey, 0]]);
    const palette: Rgb[] = [bgKey === "t" ? [0, 0, 0] : [rows[0], rows[1], rows[2]]];
    const pixels = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const key = at(i) === "t" ? bgKey : at(i);
      let idx = index.get(key);
      if (idx === undefined) {
        idx = palette.length;
        if (idx > 255) throw new Error("truecolor PNG has more than 256 colors");
        index.set(key, idx);
        palette.push([rows[i * channels], rows[i * channels + 1], rows[i * channels + 2]]);
      }
      pixels[i] = idx;
    }
    return { width, height, palette, pixels };
  }

  throw new Error(`unsupported PNG format (color type ${colorType}, depth ${depth})`);
}

function chunk(type: string, data: Buffer): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([head.subarray(4), data])) >>> 0, 0);
  return Buffer.concat([head, data, crc]);
}

function encode(width: number, height: number, colorType: 2 | 3, rows: Buffer, plte?: Buffer): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = colorType;
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    ...(plte ? [chunk("PLTE", plte)] : []),
    chunk("IDAT", zlib.deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Encode an 8-bit indexed PNG. */
export function encodeIndexedPng(img: IndexedImage): Buffer {
  const rows = Buffer.alloc((img.width + 1) * img.height);
  for (let y = 0; y < img.height; y++)
    rows.set(img.pixels.subarray(y * img.width, (y + 1) * img.width), y * (img.width + 1) + 1);
  return encode(img.width, img.height, 3, rows, Buffer.from(img.palette.flat()));
}

/** Encode an 8-bit RGB PNG. */
export function encodeRgbPng(img: RgbImage): Buffer {
  const stride = img.width * 3;
  const rows = Buffer.alloc((stride + 1) * img.height);
  for (let y = 0; y < img.height; y++)
    rows.set(img.data.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  return encode(img.width, img.height, 2, rows);
}

/** Parse a JASC-PAL file into RGB entries. */
export function parseJascPal(text: string): Rgb[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines[0] !== "JASC-PAL") throw new Error("not a JASC-PAL file");
  const count = Number(lines[2]);
  return lines.slice(3, 3 + count).map((l) => {
    const [r, g, b] = l.split(/\s+/).map(Number);
    return [r, g, b] as Rgb;
  });
}
