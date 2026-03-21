#!/usr/bin/env node
/**
 * Pokédex MCP Server
 *
 * Provides structured Pokémon game data to the agent using @pkmn/dex
 * (Pokémon Showdown's data layer). Optimised for Gen 3 (Pokémon Emerald)
 *
 * Tools exposed:
 *   pokemon_stats          — base stats, types, BST, tier for a single species
 *   search_pokemon         — filter species by type and/or BST range
 *   move_data              — power, accuracy, type, category for a move
 *   type_matchup           — effectiveness multiplier for an attack
 *   pokemon_learnset       — all moves a species can learn in a given gen
 *   smogon_sets            — competitive sets from Smogon (moves, items, EVs, nature)
 *   smogon_format_pokemon  — list Pokémon with competitive sets in a tier/format
 *   team_type_coverage     — analyse a team's defensive/offensive type coverage
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Dex } from "@pkmn/dex";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getSmogonSets,
  listFormatPokemon,
  listAvailableFormats,
} from "./smogon-cache.js";
import { fetchPokemonSprites, formatSpriteResult } from "./sprite-fetcher.js";

const DEFAULT_GEN = 3;

// damageTaken encoding used by @pkmn/dex (defender perspective, attacker key):
//   0 → 1x  (neutral)
//   1 → 2x  (super effective)
//   2 → 0.5x (not very effective)
//   3 → 0x  (immune)
const DT_TO_MULT: Record<number, number> = { 0: 1, 1: 2, 2: 0.5, 3: 0 };

function getDex(gen: number = DEFAULT_GEN) {
  return Dex.forGen(gen);
}

function calcBst(baseStats: Record<string, number>): number {
  return Object.values(baseStats).reduce((a, b) => a + b, 0);
}

// ─── Server setup ────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "pokedex",
  version: "2.0.0",
});

// ─── Tool: pokemon_stats ─────────────────────────────────────────────────────

server.registerTool(
  "pokemon_stats",
  {
    title: "Get Pokémon Stats",
    description: "Get base stats, types, abilities, BST, and competitive tier for a Pokémon species.",
    inputSchema: z.object({
      name: z.string().describe("Pokémon name, e.g. 'blaziken' or 'rayquaza'"),
      gen: z
        .number()
        .int()
        .min(1)
        .max(9)
        .optional()
        .describe("Generation (default: 3)"),
    }),
  },
  async ({ name, gen }) => {
    const dex = getDex(gen);
    const species = dex.species.get(name);

    if (!species.exists) {
      return {
        content: [{ type: "text", text: `Unknown Pokémon: "${name}"` }],
      };
    }

    const bst = calcBst(species.baseStats);

    const result = {
      name: species.name,
      num: species.num,
      types: species.types,
      baseStats: species.baseStats,
      bst,
      abilities: species.abilities,
      tier: species.tier ?? "Unknown",
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

// ─── Tool: search_pokemon ─────────────────────────────────────────────────────

server.registerTool(
  "search_pokemon",
  {
    title: "Search Pokémon",
    description: "Search Pokémon by type and/or BST range. Defaults to Gen 3 national dex (#1–386).",
    inputSchema: z.object({
      type: z
        .string()
        .optional()
        .describe("Filter by type, e.g. 'fire'. Matches either of a dual type."),
      minBst: z.number().optional().describe("Minimum base stat total (inclusive)"),
      maxBst: z.number().optional().describe("Maximum base stat total (inclusive)"),
      gen: z
        .number()
        .int()
        .min(1)
        .max(9)
        .optional()
        .describe("Generation (default: 3)"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Maximum results (default: 30)"),
    }),
  },
  async ({ type, minBst, maxBst, gen = DEFAULT_GEN, limit = 30 }) => {
    const dex = getDex(gen);
    const maxDexNum = gen === 3 ? 386 : 9999;
    const results: Array<{
      name: string;
      num: number;
      types: string[];
      bst: number;
      baseStats: Record<string, number>;
    }> = [];

    for (const species of dex.species.all()) {
      if (!species.exists || species.isNonstandard) continue;
      if (species.num <= 0 || species.num > maxDexNum) continue;
      // Skip non-base formes to avoid duplicates (keep base form only)
      if (species.forme) continue;

      if (type) {
        const typeLower = type.toLowerCase();
        if (!species.types.map((t) => t.toLowerCase()).includes(typeLower)) {
          continue;
        }
      }

      const bst = calcBst(species.baseStats);
      if (minBst !== undefined && bst < minBst) continue;
      if (maxBst !== undefined && bst > maxBst) continue;

      results.push({
        name: species.name,
        num: species.num,
        types: species.types,
        bst,
        baseStats: species.baseStats,
      });

      if (results.length >= limit) break;
    }

    // Sort by BST descending for easier scanning
    results.sort((a, b) => b.bst - a.bst);

    return {
      content: [
        {
          type: "text",
          text:
            results.length === 0
              ? "No Pokémon found matching criteria."
              : `Found ${results.length} Pokémon (sorted by BST):\n${JSON.stringify(results, null, 2)}`,
        },
      ],
    };
  },
);

// ─── Tool: move_data ─────────────────────────────────────────────────────────

server.registerTool(
  "move_data",
  {
    title: "Get Move Data",
    description: "Get data for a move: power, accuracy, type, category (Physical/Special/Status), PP, and description.",
    inputSchema: z.object({
      name: z.string().describe("Move name, e.g. 'earthquake' or 'flamethrower'"),
      gen: z
        .number()
        .int()
        .min(1)
        .max(9)
        .optional()
        .describe("Generation (default: 3)"),
    }),
  },
  async ({ name, gen }) => {
    const dex = getDex(gen);
    const move = dex.moves.get(name);

    if (!move.exists) {
      return { content: [{ type: "text", text: `Unknown move: "${name}"` }] };
    }

    const result = {
      name: move.name,
      type: move.type,
      category: move.category,
      basePower: move.basePower,
      accuracy: move.accuracy === true ? "always hits" : move.accuracy,
      pp: move.pp,
      target: move.target,
      shortDesc: move.shortDesc,
      desc: move.desc,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

// ─── Tool: type_matchup ───────────────────────────────────────────────────────

server.registerTool(
  "type_matchup",
  {
    title: "Calculate Type Matchup",
    description: "Calculate type effectiveness when a move of `attacking` type hits a Pokémon with `defending` types.",
    inputSchema: z.object({
      attacking: z
        .string()
        .describe("Attacking move type, e.g. 'fire'"),
      defending: z
        .array(z.string())
        .min(1)
        .max(2)
        .describe("Defending Pokémon's types, e.g. ['grass', 'poison']"),
      gen: z
        .number()
        .int()
        .min(1)
        .max(9)
        .optional()
        .describe("Generation (default: 3)"),
    }),
  },
  async ({ attacking, defending, gen }) => {
    const dex = getDex(gen);

    // Validate attacking type
    const atkType = dex.types.get(attacking);
    if (!atkType.exists) {
      return {
        content: [{ type: "text", text: `Unknown type: "${attacking}"` }],
      };
    }

    let multiplier = 1;
    const breakdown: string[] = [];

    for (const defTypeName of defending) {
      const defType = dex.types.get(defTypeName);
      if (!defType.exists) {
        return {
          content: [
            { type: "text", text: `Unknown defending type: "${defTypeName}"` },
          ],
        };
      }

      // damageTaken[attackingType] → effectiveness of that attacking type vs this defender
      const dt = defType.damageTaken[atkType.name] ?? 0;
      const mult = DT_TO_MULT[dt] ?? 1;
      multiplier *= mult;
      breakdown.push(`  ${atkType.name} → ${defType.name}: ${mult}x`);
    }

    const label =
      multiplier === 0
        ? "no effect (immune)"
        : multiplier >= 4
          ? "quadruple super effective!"
          : multiplier >= 2
            ? "super effective"
            : multiplier <= 0.25
              ? "quadruple resist"
              : multiplier < 1
                ? "not very effective"
                : "neutral";

    const summary = `${atkType.name} vs [${defending.map((d) => dex.types.get(d).name).join(", ")}] = ${multiplier}x (${label})`;

    return {
      content: [
        {
          type: "text",
          text: `${summary}\nBreakdown:\n${breakdown.join("\n")}`,
        },
      ],
    };
  },
);

// ─── Tool: pokemon_learnset ───────────────────────────────────────────────────

server.registerTool(
  "pokemon_learnset",
  {
    title: "Get Pokémon Learnset",
    description: "Get all moves a Pokémon can learn in a given generation, with the method (level-up, TM, egg, tutor).",
    inputSchema: z.object({
      name: z.string().describe("Pokémon name, e.g. 'blaziken'"),
      gen: z
        .number()
        .int()
        .min(1)
        .max(9)
        .optional()
        .describe("Generation (default: 3)"),
    }),
  },
  async ({ name, gen = DEFAULT_GEN }) => {
    const dex = getDex(gen);

    // Verify species exists
    const species = dex.species.get(name);
    if (!species.exists) {
      return {
        content: [{ type: "text", text: `Unknown Pokémon: "${name}"` }],
      };
    }

    const learnset = await dex.learnsets.get(name);
    if (!learnset?.learnset) {
      return {
        content: [
          { type: "text", text: `No learnset data found for: "${name}"` },
        ],
      };
    }

    // Source code format: "<gen><method>[level]"
    //   L = level-up (e.g. "3L1" = gen 3, level 1)
    //   M = TM/HM
    //   E = egg move
    //   T = move tutor
    //   S = event/special
    const genPrefix = String(gen);
    const methodLabels: Record<string, string> = {
      L: "level-up",
      M: "TM/HM",
      E: "egg",
      T: "tutor",
      S: "event",
    };

    const byMethod: Record<string, string[]> = {};

    for (const [moveName, sources] of Object.entries(learnset.learnset)) {
      for (const source of sources) {
        if (!source.startsWith(genPrefix)) continue;
        const methodChar = source[genPrefix.length];
        const label = methodLabels[methodChar] ?? methodChar;
        if (!byMethod[label]) byMethod[label] = [];
        const entry =
          methodChar === "L"
            ? `${moveName} (lv ${source.slice(genPrefix.length + 1)})`
            : moveName;
        if (!byMethod[label].includes(entry)) {
          byMethod[label].push(entry);
        }
      }
    }

    if (Object.keys(byMethod).length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `${species.name} has no learnset entries for Gen ${gen}.`,
          },
        ],
      };
    }

    // Sort level-up moves by level number
    if (byMethod["level-up"]) {
      byMethod["level-up"].sort((a, b) => {
        const lvA = parseInt(a.match(/lv (\d+)/)?.[1] ?? "0", 10);
        const lvB = parseInt(b.match(/lv (\d+)/)?.[1] ?? "0", 10);
        return lvA - lvB;
      });
    }

    const lines: string[] = [`Learnset for ${species.name} (Gen ${gen}):`];
    for (const [method, moves] of Object.entries(byMethod)) {
      lines.push(`\n${method.toUpperCase()} (${moves.length}):`);
      lines.push(moves.join(", "));
    }

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  },
);

// ─── Tool: smogon_sets ──────────────────────────────────────────────────────

server.registerTool(
  "smogon_sets",
  {
    title: "Get Smogon Competitive Sets",
    description:
      "Get recommended competitive sets for a Pokémon from Smogon analyses. " +
      "Returns named sets with moves, item, nature, EVs, ability, and strategy notes. " +
      "Defaults to Gen 3. Optionally filter by format (ou, uu, ubers, etc.).",
    inputSchema: z.object({
      name: z
        .string()
        .describe("Pokémon name, e.g. 'salamence' or 'metagross'"),
      format: z
        .string()
        .optional()
        .describe(
          "Competitive format to filter by, e.g. 'ou', 'uu', 'ubers'. Omit for all formats.",
        ),
    }),
  },
  async ({ name, format }) => {
    const results = getSmogonSets(name, format);

    if (results.length === 0) {
      const formats = listAvailableFormats();
      const fmtList = formats.map((f) => `${f.format} (${f.count} Pokémon)`).join(", ");
      return {
        content: [
          {
            type: "text",
            text: `No Smogon sets found for "${name}"${format ? ` in format "${format}"` : ""}.\nAvailable Gen 3 formats: ${fmtList}`,
          },
        ],
      };
    }

    const lines: string[] = [];

    for (const { format: fmt, sets } of results) {
      lines.push(`\n═══ Format: ${fmt} ═══`);

      for (const [setName, set] of Object.entries(sets)) {
        lines.push(`\n── ${setName} ──`);

        if (set.moves) {
          lines.push(`Moves: ${set.moves.join(", ")}`);
        }
        if (set.item) {
          lines.push(`Item: ${set.item}`);
        }
        if (set.ability) {
          lines.push(`Ability: ${set.ability}`);
        }
        if (set.nature) {
          lines.push(`Nature: ${set.nature}`);
        }
        if (set.evs) {
          const evsStr = Object.entries(set.evs)
            .filter(([, v]) => v && v > 0)
            .map(([k, v]) => `${v} ${k}`)
            .join(" / ");
          if (evsStr) lines.push(`EVs: ${evsStr}`);
        }
        if (set.ivs) {
          const ivsStr = Object.entries(set.ivs)
            .filter(([, v]) => v !== undefined && v !== 31)
            .map(([k, v]) => `${v} ${k}`)
            .join(" / ");
          if (ivsStr) lines.push(`IVs: ${ivsStr}`);
        }
        if (set.hpType) {
          lines.push(`Hidden Power: ${set.hpType}`);
        }
      }
    }

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  },
);

// ─── Tool: smogon_format_pokemon ────────────────────────────────────────────

server.registerTool(
  "smogon_format_pokemon",
  {
    title: "List Pokémon in a Smogon Format",
    description:
      "List all Pokémon that have competitive sets in a given Smogon format/tier (e.g. 'ou', 'uu', 'ubers'). " +
      "Returns each Pokémon with their available set names. Useful for team building and understanding tier viability.",
    inputSchema: z.object({
      format: z
        .string()
        .describe(
          "Smogon format/tier, e.g. 'ou', 'uu', 'ru', 'nu', 'ubers', 'lc'",
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(200)
        .optional()
        .describe("Maximum results (default: 50)"),
    }),
  },
  async ({ format, limit = 50 }) => {
    const pokemon = listFormatPokemon(format);

    if (pokemon.length === 0) {
      const formats = listAvailableFormats();
      const fmtList = formats.map((f) => `${f.format} (${f.count} Pokémon)`).join(", ");
      return {
        content: [
          {
            type: "text",
            text: `No Pokémon found with sets in format "${format}". Available Gen 3 formats: ${fmtList}`,
          },
        ],
      };
    }

    const limited = pokemon.slice(0, limit);

    const lines = [
      `Pokémon with competitive sets in "${format}" (${pokemon.length} total, showing ${limited.length}):`,
      "",
    ];

    for (const p of limited) {
      lines.push(`  ${p.name}: ${p.sets.join(", ")}`);
    }

    if (pokemon.length > limit) {
      lines.push(
        `\n  ... and ${pokemon.length - limit} more. Increase limit to see all.`,
      );
    }

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  },
);

// ─── Tool: team_type_coverage ───────────────────────────────────────────────

server.registerTool(
  "team_type_coverage",
  {
    title: "Analyse Team Type Coverage",
    description:
      "Analyse a team's type coverage: defensive weaknesses, resistances, immunities, and offensive coverage. " +
      "Helps identify gaps in team composition. Defaults to Gen 3.",
    inputSchema: z.object({
      team: z
        .array(z.string())
        .min(1)
        .max(6)
        .describe(
          "Array of Pokémon names on the team, e.g. ['swampert', 'salamence', 'metagross']",
        ),
      gen: z
        .number()
        .int()
        .min(1)
        .max(9)
        .optional()
        .describe("Generation (default: 3)"),
    }),
  },
  async ({ team, gen = DEFAULT_GEN }) => {
    const dex = getDex(gen);
    const allTypes = dex.types.all().filter((t) => t.exists);

    // Resolve team members
    const members: Array<{
      name: string;
      types: string[];
    }> = [];
    const errors: string[] = [];

    for (const name of team) {
      const species = dex.species.get(name);
      if (!species.exists) {
        errors.push(`Unknown Pokémon: "${name}"`);
        continue;
      }
      members.push({ name: species.name, types: species.types });
    }

    if (errors.length > 0 && members.length === 0) {
      return {
        content: [{ type: "text", text: errors.join("\n") }],
      };
    }

    // Defensive analysis: for each attacking type, how many team members are weak/resist/immune
    const defensive: Array<{
      type: string;
      weakMembers: string[];
      resistMembers: string[];
      immuneMembers: string[];
    }> = [];

    for (const atkType of allTypes) {
      const weakMembers: string[] = [];
      const resistMembers: string[] = [];
      const immuneMembers: string[] = [];

      for (const member of members) {
        let mult = 1;
        for (const defTypeName of member.types) {
          const defType = dex.types.get(defTypeName);
          if (!defType.exists) continue;
          const dt = defType.damageTaken[atkType.name] ?? 0;
          mult *= DT_TO_MULT[dt] ?? 1;
        }

        if (mult === 0) immuneMembers.push(member.name);
        else if (mult >= 2) weakMembers.push(member.name);
        else if (mult < 1) resistMembers.push(member.name);
      }

      defensive.push({
        type: atkType.name,
        weakMembers,
        resistMembers,
        immuneMembers,
      });
    }

    // Offensive analysis: what types can the team's STAB moves cover
    const stabTypes = new Set<string>();
    for (const member of members) {
      for (const t of member.types) {
        stabTypes.add(t);
      }
    }

    // Find types the team cannot hit super-effectively with STAB
    const uncoveredDefensive: string[] = [];
    for (const defType of allTypes) {
      let covered = false;
      for (const stab of stabTypes) {
        const atkType = dex.types.get(stab);
        if (!atkType.exists) continue;
        const dt = defType.damageTaken[atkType.name] ?? 0;
        if (DT_TO_MULT[dt] === 2) {
          covered = true;
          break;
        }
      }
      if (!covered) uncoveredDefensive.push(defType.name);
    }

    // Format output
    const lines: string[] = [];
    if (errors.length > 0) {
      lines.push(`Warnings: ${errors.join(", ")}\n`);
    }

    lines.push(
      `Team: ${members.map((m) => `${m.name} (${m.types.join("/")})`).join(", ")}`,
    );

    // Defensive weaknesses (types that hit 2+ members super-effectively)
    const teamWeaknesses = defensive
      .filter((d) => d.weakMembers.length >= 2)
      .sort((a, b) => b.weakMembers.length - a.weakMembers.length);

    const teamVulnerabilities = defensive
      .filter(
        (d) =>
          d.weakMembers.length >= 1 &&
          d.resistMembers.length === 0 &&
          d.immuneMembers.length === 0,
      )
      .sort((a, b) => b.weakMembers.length - a.weakMembers.length);

    lines.push("\n── Defensive Weaknesses ──");
    if (teamWeaknesses.length === 0) {
      lines.push("No types hit 2+ team members super-effectively. Solid!");
    } else {
      for (const w of teamWeaknesses) {
        lines.push(
          `  ${w.type}: ${w.weakMembers.length} weak (${w.weakMembers.join(", ")})` +
            (w.resistMembers.length > 0
              ? `, ${w.resistMembers.length} resist`
              : "") +
            (w.immuneMembers.length > 0
              ? `, ${w.immuneMembers.length} immune`
              : ""),
        );
      }
    }

    lines.push("\n── Unresisted Types ──");
    lines.push(
      "Types where no team member resists or is immune (dangerous!):",
    );
    if (teamVulnerabilities.length === 0) {
      lines.push("  None — every attacking type has at least one resist/immunity.");
    } else {
      for (const v of teamVulnerabilities) {
        lines.push(`  ${v.type}: weak — ${v.weakMembers.join(", ")}`);
      }
    }

    // Immunities
    const teamImmunities = defensive.filter((d) => d.immuneMembers.length > 0);
    if (teamImmunities.length > 0) {
      lines.push("\n── Team Immunities ──");
      for (const im of teamImmunities) {
        lines.push(`  ${im.type}: ${im.immuneMembers.join(", ")}`);
      }
    }

    // Offensive STAB coverage
    lines.push("\n── Offensive STAB Coverage ──");
    lines.push(`STAB types: ${[...stabTypes].join(", ")}`);
    if (uncoveredDefensive.length > 0) {
      lines.push(
        `Types not hit super-effectively by STAB: ${uncoveredDefensive.join(", ")}`,
      );
    } else {
      lines.push(
        "All types can be hit super-effectively by at least one STAB type!",
      );
    }

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  },
);

// ─── Tool: fetch_pokemon_sprites ─────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POKEEMERALD_ROOT = path.resolve(__dirname, "../../pokeemerald");

server.registerTool(
  "fetch_pokemon_sprites",
  {
    title: "Fetch Pokémon Sprites from Expansion",
    description:
      "Download sprite files (front, back, icon, footprint, palettes) for a Pokémon from the " +
      "pokeemerald-expansion GitHub repository and save them to pokeemerald/graphics/pokemon/<name>/. " +
      "Also generates front.png by cropping the top half of anim_front.png. " +
      "Use this when adding a new Pokémon species to get real sprites instead of placeholders.",
    inputSchema: z.object({
      name: z
        .string()
        .describe(
          "Pokémon name matching the expansion repo directory name, e.g. 'lucario', 'mr_mime', 'nidoran_f'. " +
            "Use lowercase with underscores.",
        ),
      overwrite: z
        .boolean()
        .optional()
        .describe(
          "If true, overwrite existing sprite files. If false (default), skip files that already exist.",
        ),
    }),
  },
  async ({ name, overwrite }) => {
    const result = await fetchPokemonSprites(
      name,
      POKEEMERALD_ROOT,
      overwrite ?? false,
    );
    return {
      content: [{ type: "text", text: formatSpriteResult(result) }],
    };
  },
);

// ─── Start server ─────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
