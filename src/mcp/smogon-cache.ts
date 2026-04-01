/**
 * Smogon Sets Data Provider
 *
 * Provides competitive Pokémon sets from @smogon/sets, which bundles
 * Smogon analysis data directly in the npm package. No network access required.
 *
 * Data covers Gen 4 formats: ou, uu, nu, ubers, lc, 1v1
 */

import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Available Gen 4 format files in @smogon/sets
const GEN4_FORMATS = ["gen4ou", "gen4uu", "gen4nu", "gen4ubers", "gen4lc", "gen41v1"] as const;
type Gen4Format = (typeof GEN4_FORMATS)[number];

export interface SmogonSet {
  moves: string[];
  ability?: string;
  item?: string;
  nature?: string;
  evs?: Partial<Record<string, number>>;
  ivs?: Partial<Record<string, number>>;
  level?: number;
  hpType?: string;
}

interface FormatFileData {
  dex: { [species: string]: { [setName: string]: SmogonSet } };
  stats?: unknown;
}

// Lazy-loaded format data
const formatCache = new Map<string, FormatFileData>();

function loadFormat(format: Gen4Format): FormatFileData {
  const cached = formatCache.get(format);
  if (cached) return cached;

  const data = require(`@smogon/sets/${format}.json`) as FormatFileData;
  formatCache.set(format, data);
  return data;
}

function normalizeFormat(format: string): Gen4Format | null {
  const lower = format.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Allow shorthand: "ou" -> "gen4ou"
  const full = lower.startsWith("gen4") ? lower : `gen4${lower}`;
  return GEN4_FORMATS.includes(full as Gen4Format)
    ? (full as Gen4Format)
    : null;
}

/**
 * Get competitive sets for a Pokémon, optionally filtered by format.
 * Returns sets grouped by format.
 */
export function getSmogonSets(
  pokemonName: string,
  format?: string,
): Array<{ format: string; sets: { [name: string]: SmogonSet } }> {
  const formats = format
    ? [normalizeFormat(format)].filter(Boolean) as Gen4Format[]
    : [...GEN4_FORMATS];

  const results: Array<{ format: string; sets: { [name: string]: SmogonSet } }> = [];

  for (const fmt of formats) {
    const data = loadFormat(fmt);
    const dex = data?.dex;
    if (!dex) continue;

    // Try exact match, then case-insensitive search
    let pokemonSets = dex[pokemonName];
    if (!pokemonSets) {
      const key = Object.keys(dex).find(
        (k) => k.toLowerCase() === pokemonName.toLowerCase(),
      );
      if (key) pokemonSets = dex[key];
    }

    if (pokemonSets && Object.keys(pokemonSets).length > 0) {
      // Strip "gen4" prefix for cleaner display
      const displayFormat = fmt.replace("gen4", "").toUpperCase() || fmt;
      results.push({ format: displayFormat, sets: pokemonSets });
    }
  }

  return results;
}

/**
 * List all Pokémon with competitive sets in a given format.
 */
export function listFormatPokemon(
  format: string,
): Array<{ name: string; sets: string[] }> {
  const normalized = normalizeFormat(format);
  if (!normalized) return [];

  const data = loadFormat(normalized);
  const dex = data?.dex;
  if (!dex) return [];

  return Object.entries(dex).map(([name, sets]) => ({
    name,
    sets: sets ? Object.keys(sets) : [],
  }));
}

/**
 * List all available Gen 4 formats with Pokémon counts.
 */
export function listAvailableFormats(): Array<{ format: string; count: number }> {
  return GEN4_FORMATS.map((fmt) => {
    const data = loadFormat(fmt);
    const dex = data?.dex;
    return {
      format: fmt.replace("gen4", "").toUpperCase(),
      count: dex ? Object.keys(dex).length : 0,
    };
  });
}
