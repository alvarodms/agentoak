/**
 * Hue-shifted color ramps, ported from pxl's `shades()`
 * (https://github.com/uilianks/pxl, src/core/color.ts, MIT). Shadows rotate
 * toward blue-violet and gain saturation; highlights rotate toward warm yellow
 * and lose some, the way hand-made pixel-art palettes do. A ramp that only
 * scales brightness looks flat and muddy by comparison.
 */

import { rgbToHsl } from "./lint.js";
import type { Rgb } from "./png.js";

function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/** Rotate hue a toward b by at most `by` degrees, the short way round. */
function toward(a: number, b: number, by: number): number {
  const d = ((b - a + 540) % 360) - 180;
  return (a + Math.sign(d) * Math.min(Math.abs(d), by) + 360) % 360;
}

export interface RampOptions {
  /** Max hue rotation in degrees at the ends (default 24). */
  shift?: number;
  /** Lightness range around the base, 0..1 (default 0.56). */
  spread?: number;
  /** Saturation multiplier (default 1). */
  sat?: number;
}

/** A dark -> light ramp of `n` colors centered on `base`. */
export function hueShiftedRamp(base: Rgb, n: number, o: RampOptions = {}): Rgb[] {
  const [h, s0, l0] = rgbToHsl(...base);
  const shift = o.shift ?? 24, spread = o.spread ?? 0.56, sat = o.sat ?? 1;
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5; // -0.5 (darkest) .. 0.5 (lightest)
    const l = Math.max(0.04, Math.min(0.96, l0 + t * spread));
    const hh = t < 0 ? toward(h, 250, shift * -t * 2) : toward(h, 55, shift * t * 2);
    const s = Math.max(0, Math.min(1, s0 * sat * (t < 0 ? 1 + 0.15 * -t * 2 : 1 - 0.3 * t * 2)));
    return hslToRgb(hh, s, l);
  });
}

/** Parse "#rrggbb", "rrggbb" or "r,g,b". */
export function parseColor(s: string): Rgb {
  const hex = s.replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(hex)) return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
  const parts = s.split(/[,\s]+/).map(Number);
  if (parts.length === 3 && parts.every((v) => Number.isInteger(v) && v >= 0 && v <= 255)) return parts as Rgb;
  throw new Error(`cannot parse color "${s}" (use #rrggbb or r,g,b)`);
}
