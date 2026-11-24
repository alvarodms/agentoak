#!/usr/bin/env node
'use strict';

// Hex grid to indexed PNG (C394, v3.11 "Still warm").
//
// Turns a hand-written 16x16 grid of palette indices into a 4-bit indexed PNG
// that gbagfx converts to .4bpp with the generic `%.4bpp: %.png` rule. The
// grid is the source of truth for small object-event art (the grave lantern),
// so a redraw is a text diff, not a binary blob.
//
// Grid file: 16 lines of 16 hex characters (0-F, one palette index each).
// Blank lines and lines starting with '#' are ignored. Index 0 is transparent.
// Palette file: JASC-PAL with exactly 16 colours (the object event's .pal).
//
// Usage:
//   node scripts/grid_to_png.cjs <grid.txt> <jasc.pal> <out.png>
//
// Node built-ins only (fs, zlib, path). Exits 1 on a bad grid or palette.

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const SIZE = 16;

function fail(msg) {
  console.error(`grid_to_png: ${msg}`);
  process.exit(1);
}

function readGrid(file) {
  const rows = fs.readFileSync(file, 'utf8').split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('#'));
  if (rows.length !== SIZE) fail(`${file}: expected ${SIZE} rows, found ${rows.length}`);
  return rows.map((row, i) => {
    if (!/^[0-9A-Fa-f]+$/.test(row) || row.length !== SIZE) {
      fail(`${file}: row ${i + 1} must be ${SIZE} hex characters, got "${row}"`);
    }
    return [...row].map((c) => parseInt(c, 16));
  });
}

function readPal(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines[0] !== 'JASC-PAL') fail(`${file}: not a JASC-PAL file`);
  const count = parseInt(lines[2], 10);
  const colours = lines.slice(3).map((l) => l.split(/\s+/).map(Number));
  if (count !== SIZE || colours.length !== SIZE) fail(`${file}: expected ${SIZE} colours, found ${colours.length}`);
  for (const c of colours) {
    if (c.length !== 3 || c.some((v) => !Number.isInteger(v) || v < 0 || v > 255)) fail(`${file}: bad colour line "${c.join(' ')}"`);
  }
  return colours;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encode(grid, pal) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 4; // bit depth
  ihdr[9] = 3; // colour type: indexed
  // compression, filter, interlace all 0
  const plte = Buffer.from(pal.flat());
  const rowBytes = SIZE / 2;
  const raw = Buffer.alloc(SIZE * (rowBytes + 1));
  grid.forEach((row, y) => {
    const o = y * (rowBytes + 1);
    raw[o] = 0; // filter: none
    for (let x = 0; x < SIZE; x += 2) raw[o + 1 + x / 2] = (row[x] << 4) | row[x + 1];
  });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('PLTE', plte),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function main(argv) {
  if (argv.length !== 3) fail('usage: node scripts/grid_to_png.cjs <grid.txt> <jasc.pal> <out.png>');
  const [gridFile, palFile, outFile] = argv;
  const png = encode(readGrid(gridFile), readPal(palFile));
  fs.writeFileSync(outFile, png);
  console.log(`grid_to_png: wrote ${path.relative(process.cwd(), path.resolve(outFile))} (${SIZE}x${SIZE}, 4bpp indexed)`);
}

main(process.argv.slice(2));
