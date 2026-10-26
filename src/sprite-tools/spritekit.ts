/**
 * spritekit — self-review tools for the Sprite Designer phase. Ideas from pxl
 * (https://github.com/uilianks/pxl): a pixel-art critic, upscaled previews with
 * a pixel grid, an index dump with rulers, and hue-shifted ramps.
 *
 *   npx tsx src/sprite-tools/spritekit.ts lint    <variant> [--base <dir>]
 *   npx tsx src/sprite-tools/spritekit.ts preview <variant> [--base <dir>] [--scale 5] [--out file.png]
 *   npx tsx src/sprite-tools/spritekit.ts ascii   <png> [--frame 2] [--region x,y,w,h]
 *   npx tsx src/sprite-tools/spritekit.ts ramp    <#rrggbb|r,g,b> [--n 5] [--shift 24] [--spread 0.56]
 *
 * <variant> is a folder under pokeemerald/graphics/pokemon (a bare name like
 * `corsola_hoenn` works). The base defaults to the same name without `_hoenn`.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findNearDuplicates, gateAgainstBase, lintSprite, type LintResult, type Point } from "./lint.js";
import { decodePng, encodeRgbPng, parseJascPal, type IndexedImage, type Rgb } from "./png.js";
import { hueShiftedRamp, parseColor } from "./ramp.js";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const GRAPHICS_DIR = path.join(PROJECT_ROOT, "pokeemerald", "graphics", "pokemon");
const FRAME = 64;
/** Battle sprites the critic checks; icons use the shared icon palettes and are skipped. */
const SPRITE_FILES = ["front.png", "back.png", "anim_front.png"];

/** Resolve a sprite folder given as a path or a bare graphics/pokemon name. */
export function resolveSpriteDir(arg: string): string {
  if (fs.existsSync(arg) && fs.statSync(arg).isDirectory()) return path.resolve(arg);
  const named = path.join(GRAPHICS_DIR, arg);
  if (fs.existsSync(named)) return named;
  throw new Error(`sprite folder not found: ${arg}`);
}

/** The base species folder a regional variant was derived from, if it exists. */
export function defaultBaseDir(variantDir: string): string | undefined {
  const name = path.basename(variantDir);
  if (!name.endsWith("_hoenn")) return undefined;
  const base = path.join(path.dirname(variantDir), name.slice(0, -"_hoenn".length));
  return fs.existsSync(base) ? base : undefined;
}

interface SpriteSet {
  dir: string;
  images: Map<string, IndexedImage>;
  normal?: Rgb[];
  shiny?: Rgb[];
}

function loadSet(dir: string): SpriteSet {
  const images = new Map<string, IndexedImage>();
  for (const f of SPRITE_FILES) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) images.set(f, decodePng(fs.readFileSync(p)));
  }
  const pal = (f: string) => (fs.existsSync(path.join(dir, f)) ? parseJascPal(fs.readFileSync(path.join(dir, f), "utf8")) : undefined);
  return { dir, images, normal: pal("normal.pal"), shiny: pal("shiny.pal") };
}

/** Frames of a sprite: 64-px tall slices (anim_front stacks two). */
function frames(img: IndexedImage): { label: string; top: number }[] {
  const n = Math.max(1, Math.floor(img.height / FRAME));
  return Array.from({ length: n }, (_, i) => ({ label: n > 1 ? `frame ${i + 1}` : "", top: i * FRAME }));
}

function lintFrame(set: SpriteSet, file: string, top: number): LintResult | undefined {
  const img = set.images.get(file);
  if (!img) return undefined;
  return lintSprite(img, { palette: set.normal, top, height: Math.min(FRAME, img.height - top) });
}

const fmtPoints = (pts: Point[], max = 12) =>
  pts.slice(0, max).map(([x, y]) => `(${x},${y})`).join(" ") + (pts.length > max ? ` …+${pts.length - max}` : "");

export interface LintReport {
  passed: boolean;
  text: string;
}

/** Lint a regional variant folder, gating against its base species when one exists. */
export function lintVariant(variantDir: string, baseDir?: string): LintReport {
  const variant = loadSet(variantDir);
  const base = baseDir ? loadSet(baseDir) : undefined;
  const lines: string[] = [`spritekit lint ${path.basename(variantDir)}${base ? ` (base: ${path.basename(base.dir)})` : " (no base folder: reporting only)"}`];
  let failures = 0;

  if (!variant.normal) lines.push("  ! normal.pal missing");
  for (const [file, img] of variant.images) {
    // The GBA uses the .pal; the PNG's embedded palette must match it or the
    // previews (and the build's own palette extraction) disagree with the game.
    if (variant.normal && variant.normal.some((c, i) => i > 0 && img.palette[i] && c.some((v, k) => v !== img.palette[i][k]))) {
      lines.push(`  FAIL ${file}: embedded PNG palette differs from normal.pal (apply the .pal to the PNG)`);
      failures++;
    }
    for (const { label, top } of frames(img)) {
      const v = lintFrame(variant, file, top)!;
      const b = base ? lintFrame(base, file, top) : undefined;
      const name = `${file}${label ? ` ${label}` : ""}`;
      const issues = b ? gateAgainstBase(v, b) : [];
      failures += issues.length;
      lines.push(
        `  ${issues.length ? "FAIL" : "ok  "} ${name}: ${v.colorCount} colors, ${v.orphans.length} stray${b ? ` (base ${b.orphans.length})` : ""}, ${v.jaggies.length} jaggies${b ? ` (base ${b.jaggies.length})` : ""}${v.pillow ? `, pillow ${v.pillow.toFixed(2)}` : ""}`,
      );
      for (const issue of issues) lines.push(`       - ${issue.message}`);
      if (issues.some((i) => i.rule === "orphan")) lines.push(`         stray at ${fmtPoints(v.orphans)}`);
      if (issues.some((i) => i.rule === "jaggy")) lines.push(`         jaggies at ${fmtPoints(v.jaggies)}`);
    }
  }

  const used = new Set<number>();
  for (const img of variant.images.values()) for (const p of img.pixels) used.add(p);
  const pals = [["normal.pal", variant.normal, variant.shiny], ["shiny.pal", variant.shiny, variant.normal]] as const;
  for (const [palName, pal, other] of pals) {
    if (!pal) continue;
    const otherDups = other ? findNearDuplicates(other, used) : [];
    // Identical entries split apart in the other palette are deliberate: they
    // let normal and shiny color two body parts differently (Torchic line).
    const dups = findNearDuplicates(pal, used).filter(
      (d) => !(other && d.colorA.every((v, k) => v === d.colorB[k]) && !otherDups.some((o) => o.a === d.a && o.b === d.b)),
    );
    failures += dups.length;
    for (const d of dups)
      lines.push(`  FAIL ${palName}: indices ${d.a} (${d.colorA.join(",")}) and ${d.b} (${d.colorB.join(",")}) read as one color on the GBA. Push them apart or merge them and free a slot.`);
  }

  lines.push(failures ? `RESULT: FAIL (${failures} issue${failures > 1 ? "s" : ""})` : "RESULT: PASS");
  return { passed: failures === 0, text: lines.join("\n") };
}

// ─── Preview sheet ──────────────────────────────────────────────────────────

const CHECKER: [Rgb, Rgb] = [[204, 204, 204], [238, 238, 238]];
const MARK_ORPHAN: Rgb = [255, 0, 255];
const MARK_JAGGY: Rgb = [0, 220, 255];
const GAP = 6;

interface Tile {
  img: IndexedImage;
  palette: Rgb[];
  top: number;
  lint?: LintResult;
}

/**
 * Render a comparison sheet: one row per frame (front, back, anim frames),
 * columns base | variant normal | variant shiny, upscaled with a pixel grid
 * (stronger every 8 px), transparency as a checkerboard, and the variant's
 * stray pixels (magenta) and jaggies (cyan) boxed.
 */
export function renderPreview(variantDir: string, baseDir: string | undefined, scale: number): Buffer {
  const variant = loadSet(variantDir);
  const base = baseDir ? loadSet(baseDir) : undefined;
  const rows: Tile[][] = [];
  for (const [file, img] of variant.images)
    for (const { top } of frames(img)) {
      const row: Tile[] = [];
      const baseImg = base?.images.get(file);
      if (base) row.push(baseImg && top < baseImg.height ? { img: baseImg, palette: base.normal ?? baseImg.palette, top } : { img, palette: [], top: -1 });
      row.push({ img, palette: variant.normal ?? img.palette, top, lint: lintFrame(variant, file, top) });
      if (variant.shiny) row.push({ img, palette: variant.shiny, top });
      rows.push(row);
    }
  if (!rows.length) throw new Error(`no sprites found in ${variantDir}`);

  const cell = FRAME * scale, cols = rows[0].length;
  const width = cols * cell + (cols - 1) * GAP, height = rows.length * cell + (rows.length - 1) * GAP;
  const data = new Uint8Array(width * height * 3).fill(60);
  const put = (x: number, y: number, c: Rgb) => data.set(c, (y * width + x) * 3);

  rows.forEach((row, r) =>
    row.forEach((tile, c) => {
      const ox = c * (cell + GAP), oy = r * (cell + GAP);
      for (let py = 0; py < cell; py++)
        for (let px = 0; px < cell; px++) {
          const x = Math.floor(px / scale), y = Math.floor(py / scale);
          const idx = tile.top < 0 || y + tile.top >= tile.img.height ? 0 : tile.img.pixels[(y + tile.top) * tile.img.width + x];
          let col: Rgb = idx === 0 ? CHECKER[(Math.floor(px / 4) + Math.floor(py / 4)) & 1] : (tile.palette[idx] ?? [255, 0, 0]);
          const edge = px % scale === 0 || py % scale === 0;
          if (edge && scale >= 4) {
            const major = (px % (8 * scale) === 0 && px > 0) || (py % (8 * scale) === 0 && py > 0);
            const k = major ? 0.55 : 0.82;
            col = [col[0] * k, col[1] * k, col[2] * k];
          }
          put(ox + px, oy + py, col);
        }
      const box = (pts: Point[], color: Rgb) => {
        for (const [x, y] of pts)
          for (let i = 0; i < scale; i++)
            for (const [bx, by] of [[i, 0], [i, scale - 1], [0, i], [scale - 1, i]])
              put(ox + x * scale + bx, oy + y * scale + by, color);
      };
      if (tile.lint) {
        box(tile.lint.orphans, MARK_ORPHAN);
        box(tile.lint.jaggies, MARK_JAGGY);
      }
    }),
  );
  return encodeRgbPng({ width, height, data });
}

// ─── ASCII dump ─────────────────────────────────────────────────────────────

/** Palette indices as hex digits ('.' = transparent) with x/y rulers. */
export function asciiDump(img: IndexedImage, region: { x: number; y: number; w: number; h: number }): string {
  const xs = Array.from({ length: region.w }, (_, i) => region.x + i);
  const lines = [
    "    " + xs.map((x) => (x % 10 === 0 ? String(Math.floor(x / 10) % 10) : " ")).join(""),
    "    " + xs.map((x) => String(x % 10)).join(""),
  ];
  for (let y = region.y; y < region.y + region.h; y++)
    lines.push(String(y).padStart(3) + " " + xs.map((x) => { const i = img.pixels[y * img.width + x]; return i === 0 ? "." : i.toString(16); }).join(""));
  return lines.join("\n");
}

// ─── CLI ────────────────────────────────────────────────────────────────────

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

export function main(argv: string[]): number {
  const [cmd, target, ...rest] = argv;
  switch (cmd) {
    case "lint":
    case "preview": {
      if (!target) throw new Error(`usage: spritekit ${cmd} <variant folder> [--base <folder>]`);
      const variantDir = resolveSpriteDir(target);
      const baseArg = flag(rest, "base");
      const baseDir = baseArg ? resolveSpriteDir(baseArg) : defaultBaseDir(variantDir);
      if (cmd === "lint") {
        const report = lintVariant(variantDir, baseDir);
        console.log(report.text);
        return report.passed ? 0 : 1;
      }
      const scale = Number(flag(rest, "scale") ?? 5);
      const out = flag(rest, "out") ?? path.join(os.tmpdir(), "spritekit", `${path.basename(variantDir)}.preview.png`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, renderPreview(variantDir, baseDir, scale));
      console.log(`wrote ${out}\nrows: front, back, anim_front frames; columns: ${baseDir ? "base | " : ""}variant normal | variant shiny. Magenta boxes = stray pixels, cyan = jaggies. Read it to review.`);
      return 0;
    }
    case "ascii": {
      if (!target) throw new Error("usage: spritekit ascii <png> [--frame N] [--region x,y,w,h]");
      const img = decodePng(fs.readFileSync(target));
      const frame = Number(flag(rest, "frame") ?? 1);
      const [x, y, w, h] = (flag(rest, "region") ?? `0,0,${img.width},${Math.min(FRAME, img.height)}`).split(",").map(Number);
      const top = (frame - 1) * FRAME;
      const clampedW = Math.min(w, img.width - x), clampedH = Math.min(h, img.height - top - y);
      console.log(`${path.basename(target)}${img.height > FRAME ? ` frame ${frame} (rows offset by ${top} in the file)` : ""}`);
      console.log(asciiDump({ ...img, pixels: img.pixels.subarray(top * img.width) }, { x, y, w: clampedW, h: clampedH }));
      return 0;
    }
    case "ramp": {
      if (!target) throw new Error("usage: spritekit ramp <#rrggbb|r,g,b> [--n 5] [--shift 24] [--spread 0.56]");
      const n = Number(flag(rest, "n") ?? 5);
      const ramp = hueShiftedRamp(parseColor(target), n, {
        shift: flag(rest, "shift") ? Number(flag(rest, "shift")) : undefined,
        spread: flag(rest, "spread") ? Number(flag(rest, "spread")) : undefined,
      });
      console.log(`hue-shifted ramp, dark -> light (JASC-PAL lines):`);
      for (const c of ramp) console.log(`${c.join(" ").padEnd(12)} #${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`);
      return 0;
    }
    default:
      console.log("usage: spritekit <lint|preview|ascii|ramp> ... (see header of src/sprite-tools/spritekit.ts)");
      return cmd ? 2 : 0;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 2;
  }
}
