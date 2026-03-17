#!/usr/bin/env node
/**
 * Pokédex MCP Server
 *
 * Provides structured Pokémon game data to the agent using @pkmn/dex
 * (Pokémon Showdown's data layer). Optimised for Gen 3 (Pokémon Emerald)
 *
 * Tools exposed:
 *   pokemon_stats      — base stats, types, BST, tier for a single species
 *   search_pokemon     — filter species by type and/or BST range
 *   move_data          — power, accuracy, type, category for a move
 *   type_matchup       — effectiveness multiplier for an attack
 *   pokemon_learnset   — all moves a species can learn in a given gen
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Dex } from "@pkmn/dex";
import { z } from "zod";

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
  version: "1.0.0",
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

// ─── Start server ─────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
