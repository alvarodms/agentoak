import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { describe, it, expect } from "vitest";
import { decodePng, encodeIndexedPng, parseJascPal, type IndexedImage, type Rgb } from "./png.js";
import { findNearDuplicates, gateAgainstBase, lintSprite, rgbToHsl, type LintResult } from "./lint.js";
import { hueShiftedRamp, parseColor } from "./ramp.js";
import { asciiDump, lintVariant } from "./spritekit.js";

const GRAY: Rgb[] = Array.from({ length: 16 }, (_, i) => [i * 16, i * 16, i * 16] as Rgb);

function image(w: number, h: number, fill: (x: number, y: number) => number, palette = GRAY): IndexedImage {
  const pixels = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) pixels[y * w + x] = fill(x, y);
  return { width: w, height: h, palette, pixels };
}

/** Hand-built 4-bit indexed PNG using the Sub filter, as GBA sprite tools write them. */
function png4bit(img: IndexedImage): Buffer {
  const rowBytes = Math.ceil(img.width / 2);
  const rows = Buffer.alloc((rowBytes + 1) * img.height);
  for (let y = 0; y < img.height; y++) {
    const packed = Buffer.alloc(rowBytes);
    for (let x = 0; x < img.width; x++) packed[x >> 1] |= img.pixels[y * img.width + x] << (x & 1 ? 0 : 4);
    rows[y * (rowBytes + 1)] = 1;
    for (let i = 0; i < rowBytes; i++) rows[y * (rowBytes + 1) + 1 + i] = (packed[i] - (i ? packed[i - 1] : 0)) & 255;
  }
  const chunk = (type: string, data: Buffer) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length);
    head.write(type, 4, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(Buffer.concat([head.subarray(4), data])) >>> 0);
    return Buffer.concat([head, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.width, 0);
  ihdr.writeUInt32BE(img.height, 4);
  ihdr[8] = 4;
  ihdr[9] = 3;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("PLTE", Buffer.from(img.palette.flat())),
    chunk("IDAT", zlib.deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const pal = (colors: Rgb[]) => `JASC-PAL\n0100\n${colors.length}\n${colors.map((c) => c.join(" ")).join("\n")}\n`;

describe("png", () => {
  it("round-trips an 8-bit indexed image", () => {
    const img = image(5, 3, (x, y) => (x + y) % 16);
    const back = decodePng(encodeIndexedPng(img));
    expect(back.width).toBe(5);
    expect([...back.pixels]).toEqual([...img.pixels]);
    expect(back.palette.slice(0, 16)).toEqual(GRAY);
  });

  it("decodes 4-bit indexed PNGs with odd widths and filters", () => {
    const img = image(7, 4, (x, y) => (x * 3 + y * 5) % 16);
    expect([...decodePng(png4bit(img)).pixels]).toEqual([...img.pixels]);
  });

  it("parses JASC-PAL files", () => {
    expect(parseJascPal(pal([[1, 2, 3], [4, 5, 6]]))).toEqual([[1, 2, 3], [4, 5, 6]]);
  });
});

describe("lintSprite", () => {
  it("flags a low-contrast stray pixel but not a high-contrast glint", () => {
    const noisy = image(8, 8, (x, y) => (x === 4 && y === 4 ? 9 : 8));
    expect(lintSprite(noisy).orphans).toEqual([[4, 4]]);
    const glint = image(8, 8, (x, y) => (x === 4 && y === 4 ? 15 : 2));
    expect(lintSprite(glint).orphans).toEqual([]);
  });

  it("flags a doubled corner in a 1-px diagonal line", () => {
    // diagonal from (0,0) to (7,7) with an extra pixel at (3,2) making an L
    const img = image(10, 10, (x, y) => (x === y || (x === 3 && y === 2) ? 5 : 0));
    expect(lintSprite(img).jaggies).toContainEqual([3, 2]);
    const clean = image(10, 10, (x, y) => (x === y ? 5 : 0));
    expect(lintSprite(clean).jaggies).toEqual([]);
  });

  it("detects pillow shading but not directional light", () => {
    const greens: Rgb[] = [[0, 0, 0], ...Array.from({ length: 15 }, (_, i) => [20, 40 + i * 13, 20] as Rgb)];
    const r = (x: number, y: number) => Math.hypot(x - 15.5, y - 15.5);
    const pillow = image(32, 32, (x, y) => (r(x, y) > 14 ? 0 : 15 - Math.floor(r(x, y))), greens);
    expect(lintSprite(pillow).pillow).toBeGreaterThan(0.55);
    const directional = image(32, 32, (x, y) => (r(x, y) > 14 ? 0 : 1 + Math.min(14, Math.floor((64 - x - y) / 4.5))), greens);
    expect(lintSprite(directional).pillow).toBe(0);
  });

  it("lints a single frame of a stacked anim sheet", () => {
    const sheet = image(8, 16, (x, y) => (y >= 8 && x === 4 && y === 12 ? 9 : 8));
    expect(lintSprite(sheet, { top: 0, height: 8 }).orphans).toEqual([]);
    expect(lintSprite(sheet, { top: 8, height: 8 }).orphans).toEqual([[4, 4]]);
  });
});

describe("findNearDuplicates", () => {
  it("flags used colors the GBA's 15-bit color cannot tell apart", () => {
    const p: Rgb[] = [[0, 0, 0], [230, 238, 255], [235, 242, 255], [100, 0, 0], [101, 1, 7]];
    expect(findNearDuplicates(p, [1, 2, 3, 4]).map((d) => [d.a, d.b])).toEqual([[1, 2], [3, 4]]);
    expect(findNearDuplicates(p, [1, 3])).toEqual([]);
  });
});

describe("gateAgainstBase", () => {
  const result = (orphans: number, jaggies = 0, pillow = 0): LintResult => ({
    orphans: Array.from({ length: orphans }, () => [0, 0]),
    jaggies: Array.from({ length: jaggies }, () => [0, 0]),
    pillow,
    colorCount: 15,
  });

  it("tolerates the base's own dithering and small regressions", () => {
    expect(gateAgainstBase(result(40, 3), result(30, 2))).toEqual([]);
  });

  it("fails on speckle noise, new jaggies and new pillow shading", () => {
    expect(gateAgainstBase(result(49), result(15)).map((i) => i.rule)).toEqual(["orphan"]);
    expect(gateAgainstBase(result(0, 5), result(0, 1)).map((i) => i.rule)).toEqual(["jaggy"]);
    expect(gateAgainstBase(result(0, 0, 0.7), result(0)).map((i) => i.rule)).toEqual(["pillow"]);
  });
});

describe("hueShiftedRamp", () => {
  it("goes dark to light, keeps the base in the middle, cools shadows and warms lights", () => {
    const base: Rgb = [200, 50, 60];
    const ramp = hueShiftedRamp(base, 5);
    const lightness = ramp.map((c) => rgbToHsl(...c)[2]);
    expect(lightness).toEqual([...lightness].sort((a, b) => a - b));
    expect(ramp[2]).toEqual(base);
    const hue = (c: Rgb) => rgbToHsl(...c)[0];
    expect(hue(ramp[0])).toBeGreaterThan(300); // red rotated toward violet
    expect(hue(base)).toBeGreaterThan(350);
    expect(hue(ramp[4])).toBeGreaterThan(10); // wrapped past 0° toward yellow (55°)
    expect(hue(ramp[4])).toBeLessThan(55);
  });

  it("parses hex and r,g,b colors", () => {
    expect(parseColor("#c8323c")).toEqual([200, 50, 60]);
    expect(parseColor("200,50,60")).toEqual([200, 50, 60]);
    expect(() => parseColor("red")).toThrow();
  });
});

describe("asciiDump", () => {
  it("prints indices with rulers and dots for transparency", () => {
    const img = image(12, 2, (x) => (x < 2 ? 0 : x));
    expect(asciiDump(img, { x: 0, y: 0, w: 12, h: 2 })).toBe(
      ["    0         1 ", "    012345678901", "  0 ..23456789ab", "  1 ..23456789ab"].join("\n"),
    );
  });
});

describe("lintVariant", () => {
  function writeSet(dir: string, opts: { normal: Rgb[]; shiny?: Rgb[]; png?: IndexedImage }) {
    fs.mkdirSync(dir, { recursive: true });
    const sprite = opts.png ?? image(64, 64, (x, y) => (x > 10 && x < 50 && y > 10 && y < 50 ? 1 + ((x >> 3) % 3) : 0), opts.normal);
    fs.writeFileSync(path.join(dir, "front.png"), encodeIndexedPng(sprite));
    fs.writeFileSync(path.join(dir, "normal.pal"), pal(opts.normal));
    if (opts.shiny) fs.writeFileSync(path.join(dir, "shiny.pal"), pal(opts.shiny));
  }
  const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "spritekit-test-"));
  const colors: Rgb[] = [[0, 0, 0], [200, 40, 40], [40, 200, 40], [40, 40, 200]];

  it("passes a clean variant", () => {
    const root = tmp();
    writeSet(path.join(root, "mon"), { normal: colors });
    writeSet(path.join(root, "mon_hoenn"), { normal: colors, shiny: colors.map(([r, g, b]) => [b, r, g] as Rgb) });
    const report = lintVariant(path.join(root, "mon_hoenn"), path.join(root, "mon"));
    expect(report.text).toContain("RESULT: PASS");
    expect(report.passed).toBe(true);
  });

  it("fails on near-duplicate colors and an embedded palette that disagrees with normal.pal", () => {
    const root = tmp();
    const dup: Rgb[] = [[0, 0, 0], [200, 40, 40], [203, 42, 41], [40, 40, 200]];
    const sprite = image(64, 64, (x, y) => (x > 10 && x < 50 && y > 10 && y < 50 ? 1 + ((x >> 3) % 3) : 0), colors);
    writeSet(path.join(root, "mon_hoenn"), { normal: dup, png: sprite });
    const report = lintVariant(path.join(root, "mon_hoenn"));
    expect(report.passed).toBe(false);
    expect(report.text).toContain("indices 1 (200,40,40) and 2 (203,42,41)");
    expect(report.text).toContain("embedded PNG palette differs from normal.pal");
  });

  it("allows identical entries that the other palette splits apart", () => {
    const root = tmp();
    const normal: Rgb[] = [[0, 0, 0], [200, 40, 40], [200, 40, 40], [40, 40, 200]];
    const shiny: Rgb[] = [[0, 0, 0], [240, 200, 40], [120, 40, 160], [40, 200, 200]];
    writeSet(path.join(root, "mon_hoenn"), { normal, shiny });
    expect(lintVariant(path.join(root, "mon_hoenn")).passed).toBe(true);
  });
});
