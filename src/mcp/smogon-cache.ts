/**
 * Smogon Sets Data Provider
 *
 * Provides competitive Pokémon sets from @smogon/sets, which bundles
 * Smogon analysis data directly in the npm package. No network access required.
 *
 * Data covers Gen 3 formats: ou, uu, nu, ubers, 1v1
 */

import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Available Gen 3 format files in @smogon/sets
const GEN3_FORMATS = ["gen3ou", "gen3uu", "gen3nu", "gen3ubers", "gen31v1"] as const;
type Gen3Format = (typeof GEN3_FORMATS)[number];

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

function loadFormat(format: Gen3Format): FormatFileData {
  const cached = formatCache.get(format);
  if (cached) return cached;

  const data = require(`@smogon/sets/${format}.json`) as FormatFileData;
  formatCache.set(format, data);
  return data;
}

function normalizeFormat(format: string): Gen3Format | null {
  const lower = format.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Allow shorthand: "ou" -> "gen3ou"
  const full = lower.startsWith("gen3") ? lower : `gen3${lower}`;
  return GEN3_FORMATS.includes(full as Gen3Format)
    ? (full as Gen3Format)
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
    ? [normalizeFormat(format)].filter(Boolean) as Gen3Format[]
    : [...GEN3_FORMATS];

  const results: Array<{ format: string; sets: { [name: string]: SmogonSet } }> = [];

  for (const fmt of formats) {
    const data = loadFormat(fmt);
    // Try exact match, then case-insensitive search
    let pokemonSets = data.dex[pokemonName];
    if (!pokemonSets) {
      const key = Object.keys(data.dex).find(
        (k) => k.toLowerCase() === pokemonName.toLowerCase(),
      );
      if (key) pokemonSets = data.dex[key];
    }

    if (pokemonSets && Object.keys(pokemonSets).length > 0) {
      // Strip "gen3" prefix for cleaner display
      const displayFormat = fmt.replace("gen3", "").toUpperCase() || fmt;
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
  return Object.entries(data.dex).map(([name, sets]) => ({
    name,
    sets: Object.keys(sets),
  }));
}

/**
 * List all available Gen 3 formats with Pokémon counts.
 */
export function listAvailableFormats(): Array<{ format: string; count: number }> {
  return GEN3_FORMATS.map((fmt) => {
    const data = loadFormat(fmt);
    return {
      format: fmt.replace("gen3", "").toUpperCase(),
      count: Object.keys(data.dex).length,
    };
  });
}
