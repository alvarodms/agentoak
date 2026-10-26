/**
 * Read one species' data out of the pokeemerald source tree.
 *
 * A species is spread across a dozen large data files (species_info.h alone
 * is ~13k lines). Reading or grepping them costs the agent tens of thousands
 * of context tokens per lookup, which every later turn then re-reads. This
 * module pulls out only the entries for one species and formats them as a
 * compact report.
 */

import fs from "node:fs";
import path from "node:path";

export const SPECIES_SECTIONS = [
  "stats",
  "pokedex",
  "learnset",
  "tmhm",
  "tutor",
  "egg_moves",
  "evolution",
  "wild",
  "trainers",
] as const;

export type SpeciesSection = (typeof SPECIES_SECTIONS)[number];

const FILES = {
  speciesConstants: "include/constants/species.h",
  speciesInfo: "src/data/pokemon/species_info.h",
  speciesNames: "src/data/text/species_names.h",
  pokedexEntries: "src/data/pokemon/pokedex_entries.h",
  pokedexText: "src/data/pokemon/pokedex_text.h",
  learnsets: "src/data/pokemon/level_up_learnsets.h",
  learnsetPointers: "src/data/pokemon/level_up_learnset_pointers.h",
  tmhm: "src/data/pokemon/tmhm_learnsets.h",
  tutor: "src/data/pokemon/tutor_learnsets.h",
  eggMoves: "src/data/pokemon/egg_moves.h",
  evolution: "src/data/pokemon/evolution.h",
  wild: "src/data/wild_encounters.json",
  trainerParties: "src/data/trainer_parties.h",
  trainers: "src/data/trainers.h",
} as const;

/** "ludicolo hoenn", "Ludicolo-Hoenn" or "SPECIES_LUDICOLO_HOENN" → "LUDICOLO_HOENN" */
export function normalizeSpeciesName(query: string): string {
  return query
    .trim()
    .toUpperCase()
    .replace(/^SPECIES_/, "")
    .replace(/[\s-]+/g, "_");
}

/**
 * Report on one species, or a "not found" message with close matches.
 * `sections` limits the report to the parts asked for (default: all).
 */
export function speciesReport(
  root: string,
  query: string,
  sections: readonly SpeciesSection[] = SPECIES_SECTIONS,
): string {
  const name = normalizeSpeciesName(query);
  const read = (file: keyof typeof FILES) => readOptional(path.join(root, FILES[file]));

  const constants = read("speciesConstants");
  const id = constants.match(new RegExp(`^#define SPECIES_${name}\\s+(\\d+)`, "m"))?.[1];
  if (!id) {
    const similar = [...constants.matchAll(/^#define SPECIES_(\w+)\s+\d+/gm)]
      .map((m) => m[1])
      .filter((n) => n.includes(name) || name.includes(n))
      .slice(0, 10);
    return `Unknown species: SPECIES_${name}.` +
      (similar.length ? ` Did you mean: ${similar.map((n) => `SPECIES_${n}`).join(", ")}?` : "");
  }

  const displayName = read("speciesNames").match(
    new RegExp(`\\[SPECIES_${name}\\]\\s*=\\s*_\\("([^"]*)"\\)`),
  )?.[1];
  const lines = [`SPECIES_${name} (#${id})${displayName ? ` — "${displayName}"` : ""}`];

  const render: Record<SpeciesSection, () => string> = {
    stats: () => statsSection(read("speciesInfo"), name),
    pokedex: () => pokedexSection(read("pokedexEntries"), read("pokedexText"), name),
    learnset: () => learnsetSection(read("learnsetPointers"), read("learnsets"), name),
    tmhm: () => tmhmSection(read("tmhm"), name),
    tutor: () => tutorSection(read("tutor"), name),
    egg_moves: () => eggMovesSection(read("eggMoves"), name),
    evolution: () => evolutionSection(read("evolution"), name),
    wild: () => wildSection(read("wild"), name),
    trainers: () => trainersSection(read("trainerParties"), read("trainers"), name),
  };
  for (const section of sections) lines.push(render[section]());
  return lines.join("\n");
}

// ─── Sections ────────────────────────────────────────────────────────────────

function statsSection(source: string, name: string): string {
  const block = designatedBlock(source, `SPECIES_${name}`);
  if (!block) return "Stats: (no species_info entry)";
  const f = fields(block);
  const stat = (key: string) => Number(f[key] ?? 0);
  const bst = ["baseHP", "baseAttack", "baseDefense", "baseSpeed", "baseSpAttack", "baseSpDefense"]
    .reduce((sum, key) => sum + stat(key), 0);
  const evs = Object.entries(f)
    .filter(([key, value]) => key.startsWith("evYield_") && value !== "0")
    .map(([key, value]) => `${key.slice("evYield_".length)} ${value}`);
  const strip = (value: string | undefined, prefix: string) =>
    (value ?? "?").replace(/[{}]/g, "").split(",").map((v) => v.trim().replace(prefix, "")).filter(Boolean).join(" / ");
  return [
    `Stats: HP ${stat("baseHP")} / Atk ${stat("baseAttack")} / Def ${stat("baseDefense")} / ` +
      `SpA ${stat("baseSpAttack")} / SpD ${stat("baseSpDefense")} / Spe ${stat("baseSpeed")} (BST ${bst})`,
    `Types: ${strip(f.types, "TYPE_")} | Abilities: ${strip(f.abilities, "ABILITY_")}`,
    `Catch rate ${f.catchRate}, EXP ${f.expYield}, EVs ${evs.join(", ") || "none"}, ` +
      `growth ${f.growthRate?.replace("GROWTH_", "")}, gender ${f.genderRatio}, egg groups ${strip(f.eggGroups, "EGG_GROUP_")}, ` +
      `items ${f.itemCommon}/${f.itemRare}, egg cycles ${f.eggCycles}, friendship ${f.friendship}, ` +
      `color ${f.bodyColor?.replace("BODY_COLOR_", "")}`,
  ].join("\n");
}

function pokedexSection(entries: string, texts: string, name: string): string {
  const block = designatedBlock(entries, `NATIONAL_DEX_${name}`);
  if (!block) return "Pokédex: (no pokedex_entries entry)";
  const f = fields(block);
  const category = f.categoryName?.match(/_\("([^"]*)"\)/)?.[1] ?? f.categoryName;
  const textBlock = f.description
    ? texts.match(new RegExp(`const u8 ${f.description}\\[\\]\\s*=\\s*_\\(([\\s\\S]*?)\\);`))?.[1]
    : undefined;
  const text = textBlock
    ? [...textBlock.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).join("").replace(/\\n/g, " ")
    : "(text not found)";
  return [
    `Pokédex: category "${category}", height ${f.height}, weight ${f.weight}, ` +
      `scale ${f.pokemonScale}/${f.pokemonOffset}, trainer scale ${f.trainerScale}/${f.trainerOffset} (${f.description})`,
    `  "${text}"`,
  ].join("\n");
}

function learnsetSection(pointers: string, learnsets: string, name: string): string {
  const symbol = pointers.match(new RegExp(`\\[SPECIES_${name}\\]\\s*=\\s*(\\w+)`))?.[1];
  const body = symbol
    ? learnsets.match(new RegExp(`${symbol}\\[\\]\\s*=\\s*\\{([\\s\\S]*?)\\};`))?.[1]
    : undefined;
  if (!body) return "Level-up: (no learnset)";
  const moves = [...body.matchAll(/LEVEL_UP_MOVE\(\s*(\d+),\s*MOVE_(\w+)\)/g)].map((m) => `${m[1]} ${m[2]}`);
  return `Level-up (${symbol}): ${moves.join(", ")}`;
}

function tmhmSection(source: string, name: string): string {
  const block = designatedBlock(source, `SPECIES_${name}`);
  if (!block) return "TM/HM: (no entry)";
  const moves = [...block.matchAll(/\.(\w+)\s*=\s*TRUE/g)].map((m) => m[1]);
  return `TM/HM (${moves.length}): ${moves.join(", ") || "none"}`;
}

function tutorSection(source: string, name: string): string {
  const block = designatedBlock(source, `SPECIES_${name}`);
  if (!block) return "Tutor: none";
  const moves = [...block.matchAll(/TUTOR\(MOVE_(\w+)\)/g)].map((m) => m[1]);
  return `Tutor: ${moves.join(", ") || "none"}`;
}

/**
 * Egg move lists are flat: a species header (via the `egg_moves(NAME, ...)`
 * macro or a raw `EGG_MOVES_SPECIES_OFFSET + SPECIES_NAME`) followed by moves
 * until the next header.
 */
function eggMovesSection(source: string, name: string): string {
  const tokens = [...source.matchAll(/egg_moves\(\s*(\w+)|EGG_MOVES_SPECIES_OFFSET\s*\+\s*SPECIES_(\w+)|MOVE_(\w+)/g)]
    .filter((m) => m.index! > source.indexOf("gEggMoves"));
  const moves: string[] = [];
  let inSpecies = false;
  for (const m of tokens) {
    const header = m[1] ?? m[2];
    if (header) {
      if (inSpecies) break;
      inSpecies = header === name;
    } else if (inSpecies) {
      moves.push(m[3]);
    }
  }
  return `Egg moves: ${moves.join(", ") || "none"}`;
}

function evolutionSection(source: string, name: string): string {
  const evolutions: string[] = [];
  for (const [, from, body] of source.matchAll(/^\s*\[SPECIES_(\w+)\]\s*=\s*\{(.*)\},?\s*$/gm)) {
    for (const [, method, param, to] of body.matchAll(/\{\s*(\w+),\s*(\w+),\s*SPECIES_(\w+)\s*\}/g)) {
      if (from === name) evolutions.push(`→ ${to} (${method.replace("EVO_", "")} ${param})`);
      if (to === name) evolutions.push(`← ${from} (${method.replace("EVO_", "")} ${param})`);
    }
  }
  return `Evolution: ${evolutions.join("; ") || "none"}`;
}

interface WildMon { min_level: number; max_level: number; species: string }
interface WildField { type: string; encounter_rates: number[]; groups?: Record<string, number[]> }
interface WildGroup {
  label: string;
  fields?: WildField[];
  encounters: Array<Record<string, unknown> & { map?: string; base_label: string }>;
}

function wildSection(source: string, name: string): string {
  if (!source) return "Wild: (no wild_encounters.json)";
  const groups = (JSON.parse(source) as { wild_encounter_groups: WildGroup[] }).wild_encounter_groups;
  const species = `SPECIES_${name}`;
  // Many maps share a slot table (e.g. every old-rod spot), so group maps by slot
  const mapsBySlot = new Map<string, string[]>();
  for (const group of groups) {
    for (const encounter of group.encounters) {
      for (const field of group.fields ?? []) {
        const mons = (encounter[field.type] as { mons?: WildMon[] } | undefined)?.mons;
        if (!mons) continue;
        // Fishing slots are split by rod; everything else is one table
        const slotGroups = field.groups ?? { [field.type.replace(/_mons$/, "")]: mons.map((_, i) => i) };
        for (const [label, slots] of Object.entries(slotGroups)) {
          const hits = slots.filter((i) => mons[i]?.species === species);
          if (!hits.length) continue;
          const total = slots.reduce((sum, i) => sum + field.encounter_rates[i], 0);
          const chance = hits.reduce((sum, i) => sum + field.encounter_rates[i], 0);
          const min = Math.min(...hits.map((i) => mons[i].min_level));
          const max = Math.max(...hits.map((i) => mons[i].max_level));
          const where = (encounter.map ?? encounter.base_label).replace(/^MAP_/, "");
          const slot = `${label} ${Math.round((chance / total) * 100)}% Lv${min === max ? min : `${min}-${max}`}`;
          mapsBySlot.set(slot, [...(mapsBySlot.get(slot) ?? []), where]);
        }
      }
    }
  }
  if (!mapsBySlot.size) return "Wild: none";
  return ["Wild:", ...[...mapsBySlot].map(([slot, maps]) => `  ${slot}: ${maps.join(", ")}`)].join("\n");
}

function trainersSection(parties: string, trainers: string, name: string): string {
  const partyOwners = new Map<string, string>();
  for (const [, trainer, party] of trainers.matchAll(/\[(TRAINER_\w+)\]\s*=\s*\{[\s\S]*?\.party\s*=\s*\w+\((\w+)\)/g)) {
    partyOwners.set(party, trainer);
  }
  const found: string[] = [];
  for (const [, party, body] of parties.matchAll(/(sParty_\w+)\[\]\s*=\s*\{([\s\S]*?)\n\};/g)) {
    for (const mon of body.split(/\}\s*,?\s*\{/)) {
      if (!new RegExp(`\\.species\\s*=\\s*SPECIES_${name}\\b`).test(mon)) continue;
      const level = mon.match(/\.lvl\s*=\s*(\d+)/)?.[1];
      const owner = (partyOwners.get(party) ?? party).replace(/^TRAINER_/, "");
      found.push(`${owner} Lv${level}`);
    }
  }
  return `Trainers (${found.length}): ${found.join(", ") || "none"}`;
}

// ─── Parsing helpers ─────────────────────────────────────────────────────────

function readOptional(file: string): string {
  try {
    return fs.readFileSync(file, "utf-8");
  } catch {
    return "";
  }
}

/**
 * Text of a designated initializer `[KEY] = ...` up to the end of its value,
 * matching braces and parentheses so nested initializers stay whole.
 */
export function designatedBlock(source: string, key: string): string | undefined {
  const start = source.search(new RegExp(`\\[${key}\\]\\s*=`));
  if (start < 0) return undefined;
  let depth = 0;
  let opened = false;
  for (let i = source.indexOf("=", start) + 1; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{" || ch === "(") {
      depth++;
      opened = true;
    } else if (ch === "}" || ch === ")") {
      depth--;
      if (opened && depth === 0) return source.slice(start, i + 1);
    } else if (ch === "," && !opened) {
      // A plain value such as `[SPECIES_X] = sSymbol,`
      return source.slice(start, i);
    }
  }
  return undefined;
}

/** `.field = value` pairs at any depth; brace-wrapped values are kept whole */
function fields(block: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [, key, value] of block.matchAll(/\.(\w+)\s*=\s*(\{[^}]*\}|[^,\n]+)/g)) {
    result[key] = value.trim();
  }
  return result;
}
