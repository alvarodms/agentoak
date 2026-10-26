/**
 * Pixel-art critic for GBA sprites, ported from pxl's `lint`
 * (https://github.com/uilianks/pxl, src/core/lint.ts, MIT). Finds stray
 * pixels, doubled corners in 1-px lines, pillow shading and near-duplicate
 * colors, with coordinates, so the Sprite Designer fixes exact pixels.
 *
 * Official Game Freak sprites already trip the orphan/jaggy rules dozens of
 * times (intentional dithering and anti-aliasing), so absolute counts mean
 * little; `gateAgainstBase` judges a variant by how much worse it is than the
 * sprite it was derived from.
 */

import type { IndexedImage, Rgb } from "./png.js";

export type Point = [number, number];

export interface LintResult {
  /** Opaque pixels with no same-index neighbor and little contrast: noise. */
  orphans: Point[];
  /** L-shaped doubled corners inside 1-px lines. */
  jaggies: Point[];
  /** Strongest pillow-shading correlation found (0 when none). */
  pillow: number;
  /** Distinct opaque palette indices used. */
  colorCount: number;
}

const N8: Point[] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

export const luminance = ([r, g, b]: Rgb) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

/**
 * Lint one frame of a sprite. `palette` overrides the image's own palette
 * (e.g. to judge the sprite under shiny.pal). Rows outside `[top, top+height)`
 * are ignored, which lets callers lint each frame of a stacked anim sheet.
 */
export function lintSprite(
  img: IndexedImage,
  opts: { palette?: Rgb[]; top?: number; height?: number } = {},
): LintResult {
  const w = img.width, top = opts.top ?? 0, h = opts.height ?? img.height - top;
  const pal = opts.palette ?? img.palette;
  // -1 = transparent (index 0 or off-canvas)
  const get = (x: number, y: number) =>
    x < 0 || y < 0 || x >= w || y >= h ? -1 : img.pixels[(y + top) * w + x] || -1;
  const lum = (i: number) => (i < 0 ? 0 : luminance(pal[i] ?? [0, 0, 0]));

  const orphans: Point[] = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = get(x, y);
      if (c < 0 || N8.some(([dx, dy]) => get(x + dx, y + dy) === c)) continue;
      if ([get(x - 1, y), get(x + 1, y), get(x, y - 1), get(x, y + 1)].some((n) => n < 0)) continue;
      const around = N8.reduce((s, [dx, dy]) => s + lum(get(x + dx, y + dy)), 0) / 8;
      if (Math.abs(lum(c) - around) < 48) orphans.push([x, y]);
    }

  // Only lines count for jaggies: 8-connected same-index strokes of 6+ pixels
  // without a 2x2 block. Small clusters (pupils, glints) are shapes.
  const comp = new Int32Array(w * h).fill(-1), compSize: number[] = [], compThin: boolean[] = [];
  for (let y0 = 0; y0 < h; y0++)
    for (let x0 = 0; x0 < w; x0++) {
      const c = get(x0, y0);
      if (c < 0 || comp[y0 * w + x0] >= 0) continue;
      const id = compSize.length, stack = [y0 * w + x0];
      comp[stack[0]] = id;
      let size = 0, thin = true;
      while (stack.length) {
        const i = stack.pop()!, x = i % w, y = (i / w) | 0;
        size++;
        if (get(x + 1, y) === c && get(x, y + 1) === c && get(x + 1, y + 1) === c) thin = false;
        for (const [dx, dy] of N8) {
          const nx = x + dx, ny = y + dy;
          if (get(nx, ny) !== c || comp[ny * w + nx] >= 0) continue;
          comp[ny * w + nx] = id;
          stack.push(ny * w + nx);
        }
      }
      compSize.push(size);
      compThin.push(thin);
    }
  const jaggies: Point[] = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = get(x, y);
      if (c < 0) continue;
      const same = (dx: number, dy: number) => get(x + dx, y + dy) === c;
      const id = comp[y * w + x];
      if (N8.filter(([dx, dy]) => same(dx, dy)).length !== 2 || compSize[id] < 6 || !compThin[id]) continue;
      // A curve turning a corner keeps going straight on both arms; a doubled
      // pixel sits inside a diagonal, so neither arm continues.
      for (const [hx, vy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]])
        if (same(hx, 0) && same(0, vy) && !same(hx, vy) && !same(2 * hx, 0) && !same(0, 2 * vy)) {
          jaggies.push([x, y]);
          break;
        }
    }

  // Pillow shading: brightness that rises with distance from the region's own
  // edge, with the light centered, measured per hue family.
  const family = (i: number) => {
    const [hu, sa, li] = rgbToHsl(...(pal[i] ?? [0, 0, 0]));
    return sa < 0.15 || li < 0.1 || li > 0.88 ? -1 : Math.round(hu / 40) % 9;
  };
  const fam = new Int8Array(w * h).fill(-2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = get(x, y); if (c >= 0) fam[y * w + x] = family(c); }
  const famAt = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? -2 : fam[y * w + x]);
  let pillow = 0;
  for (const f of new Set(fam)) {
    if (f < 0) continue;
    const inside = (x: number, y: number) => { const g = famAt(x, y); return g === f || g === -1; };
    const dist = new Int32Array(w * h).fill(-1), q: number[] = [];
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (inside(x, y) && N8.some(([dx, dy]) => !inside(x + dx, y + dy))) { dist[y * w + x] = 0; q.push(y * w + x); }
    for (let k = 0; k < q.length; k++) {
      const i = q[k], x = i % w, y = (i / w) | 0;
      for (const [dx, dy] of N8) {
        const nx = x + dx, ny = y + dy, j = ny * w + nx;
        if (!inside(nx, ny) || dist[j] >= 0) continue;
        dist[j] = dist[i] + 1;
        q.push(j);
      }
    }
    let n = 0, sd = 0, sl = 0, sdd = 0, sll = 0, sdl = 0, cx = 0, cy = 0, lx = 0, ly = 0, lw = 0;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const d = dist[y * w + x];
        if (d < 1 || fam[y * w + x] !== f) continue;
        const l = lum(get(x, y));
        n++; sd += d; sl += l; sdd += d * d; sll += l * l; sdl += d * l;
        cx += x; cy += y; lx += x * l; ly += y * l; lw += l;
      }
    if (n < 40 || lw === 0) continue;
    const corr = (n * sdl - sd * sl) / Math.sqrt(Math.max(1e-9, (n * sdd - sd * sd) * (n * sll - sl * sl)));
    const offset = Math.hypot(lx / lw - cx / n, ly / lw - cy / n) / Math.sqrt(n);
    if (corr > 0.55 && offset < 0.04) pillow = Math.max(pillow, corr);
  }

  const used = new Set<number>();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = get(x, y); if (c >= 0) used.add(c); }
  return { orphans, jaggies, pillow, colorCount: used.size };
}

export interface NearDuplicate {
  a: number;
  b: number;
  colorA: Rgb;
  colorB: Rgb;
}

/**
 * Pairs of used palette entries that read as one color: within 10 RGB units,
 * or identical once the GBA truncates them to 15-bit color (5 bits/channel).
 * Each pair wastes one of only 15 usable slots and flattens the shading.
 */
export function findNearDuplicates(palette: Rgb[], used: Iterable<number>): NearDuplicate[] {
  const idx = [...new Set(used)].filter((i) => i > 0 && i < palette.length).sort((x, y) => x - y);
  const out: NearDuplicate[] = [];
  for (let i = 0; i < idx.length; i++)
    for (let j = i + 1; j < idx.length; j++) {
      const a = palette[idx[i]], b = palette[idx[j]];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      const same15 = a.every((v, k) => v >> 3 === b[k] >> 3);
      if (same15 || d < 10) out.push({ a: idx[i], b: idx[j], colorA: a, colorB: b });
    }
  return out;
}

export interface GateIssue {
  rule: "orphan" | "jaggy" | "pillow";
  message: string;
}

/**
 * Judge a variant frame against the base frame it was derived from. Fails when
 * the variant adds noticeably more stray pixels (more than max(10, 50% of the
 * base's count)), more than 2 extra jaggies, or pillow shading the base lacked.
 */
export function gateAgainstBase(variant: LintResult, base: LintResult): GateIssue[] {
  const issues: GateIssue[] = [];
  const orphanDelta = variant.orphans.length - base.orphans.length;
  if (orphanDelta > Math.max(10, base.orphans.length * 0.5))
    issues.push({
      rule: "orphan",
      message: `${variant.orphans.length} stray pixels vs ${base.orphans.length} in the base (+${orphanDelta}): speckle noise. Merge them into a neighboring color or group them into a shape.`,
    });
  const jaggyDelta = variant.jaggies.length - base.jaggies.length;
  if (jaggyDelta > 2)
    issues.push({
      rule: "jaggy",
      message: `${variant.jaggies.length} doubled corners in 1-px lines vs ${base.jaggies.length} in the base (+${jaggyDelta}). Remove the corner pixel so the line steps diagonally.`,
    });
  if (variant.pillow > 0 && base.pillow === 0)
    issues.push({
      rule: "pillow",
      message: `pillow shading (correlation ${variant.pillow.toFixed(2)}): brightness rises toward the middle on every side. Shade from one direction (light from the top-left).`,
    });
  return issues;
}
