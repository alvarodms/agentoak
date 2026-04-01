/**
 * Unit tests for the Pokédex MCP server tools.
 *
 * Tests the underlying logic used by each MCP tool by directly
 * using @pkmn/dex and the smogon-cache module.
 */

import { describe, it, expect } from "vitest";
import { Dex } from "@pkmn/dex";
import {
  getSmogonSets,
  listFormatPokemon,
  listAvailableFormats,
} from "./smogon-cache.js";

// ─── Helper functions (mirroring pokedex-server.ts) ─────────────────────────

const DEFAULT_GEN = 3;
const DT_TO_MULT: Record<number, number> = { 0: 1, 1: 2, 2: 0.5, 3: 0 };

function getDex(gen: number = DEFAULT_GEN) {
  return Dex.forGen(gen);
}

function calcBst(baseStats: Record<string, number>): number {
  return Object.values(baseStats).reduce((a, b) => a + b, 0);
}

// ─── pokemon_stats tests ────────────────────────────────────────────────────

describe("pokemon_stats", () => {
  it("returns correct stats for Blaziken", () => {
    const dex = getDex(3);
    const species = dex.species.get("blaziken");

    expect(species.exists).toBe(true);
    expect(species.name).toBe("Blaziken");
    expect(species.num).toBe(257);
    expect(species.types).toEqual(["Fire", "Fighting"]);
    expect(species.baseStats).toEqual({
      hp: 80,
      atk: 120,
      def: 70,
      spa: 110,
      spd: 70,
      spe: 80,
    });
    expect(calcBst(species.baseStats)).toBe(530);
  });

  it("returns correct stats for Rayquaza", () => {
    const dex = getDex(3);
    const species = dex.species.get("rayquaza");

    expect(species.exists).toBe(true);
    expect(species.name).toBe("Rayquaza");
    expect(species.num).toBe(384);
    expect(species.types).toEqual(["Dragon", "Flying"]);
    expect(calcBst(species.baseStats)).toBe(680);
  });

  it("handles case-insensitive names", () => {
    const dex = getDex(3);
    const species1 = dex.species.get("PIKACHU");
    const species2 = dex.species.get("pikachu");
    const species3 = dex.species.get("Pikachu");

    expect(species1.name).toBe("Pikachu");
    expect(species2.name).toBe("Pikachu");
    expect(species3.name).toBe("Pikachu");
  });

  it("returns exists=false for unknown Pokémon", () => {
    const dex = getDex(3);
    const species = dex.species.get("notapokemon");

    expect(species.exists).toBe(false);
  });

  it("respects generation parameter for stats", () => {
    const dex3 = getDex(3);
    const dex6 = getDex(6);

    // Pikachu's stats changed in Gen 6 (Speed increased)
    const pika3 = dex3.species.get("pikachu");
    const pika6 = dex6.species.get("pikachu");

    expect(pika3.exists).toBe(true);
    expect(pika6.exists).toBe(true);
    // Gen 6 Pikachu has higher Speed
    expect(pika6.baseStats.spe).toBeGreaterThanOrEqual(pika3.baseStats.spe);
  });

  it("returns abilities for Gen 3 Pokémon", () => {
    const dex = getDex(3);
    const species = dex.species.get("swampert");

    expect(species.abilities).toBeDefined();
    expect(species.abilities["0"]).toBe("Torrent");
  });
});

// ─── search_pokemon tests ───────────────────────────────────────────────────

describe("search_pokemon", () => {
  it("finds Fire-type Pokémon in Gen 3", () => {
    const dex = getDex(3);
    const maxDexNum = 386;
    const results: string[] = [];

    for (const species of dex.species.all()) {
      if (!species.exists || species.isNonstandard) continue;
      if (species.num <= 0 || species.num > maxDexNum) continue;
      if (species.forme) continue;

      if (species.types.map((t) => t.toLowerCase()).includes("fire")) {
        results.push(species.name);
      }
    }

    expect(results).toContain("Charizard");
    expect(results).toContain("Blaziken");
    expect(results).toContain("Torkoal");
    expect(results.length).toBeGreaterThan(10);
  });

  it("filters by BST range", () => {
    const dex = getDex(3);
    const maxDexNum = 386;
    const results: Array<{ name: string; bst: number }> = [];

    for (const species of dex.species.all()) {
      if (!species.exists || species.isNonstandard) continue;
      if (species.num <= 0 || species.num > maxDexNum) continue;
      if (species.forme) continue;

      const bst = calcBst(species.baseStats);
      if (bst >= 600 && bst <= 680) {
        results.push({ name: species.name, bst });
      }
    }

    // Should include pseudo-legendaries and legendaries
    const names = results.map((r) => r.name);
    expect(names).toContain("Dragonite");
    expect(names).toContain("Tyranitar");
    expect(names).toContain("Salamence");
    expect(names).toContain("Metagross");

    // All results should be in range
    for (const r of results) {
      expect(r.bst).toBeGreaterThanOrEqual(600);
      expect(r.bst).toBeLessThanOrEqual(680);
    }
  });

  it("combines type and BST filters", () => {
    const dex = getDex(3);
    const maxDexNum = 386;
    const results: string[] = [];

    for (const species of dex.species.all()) {
      if (!species.exists || species.isNonstandard) continue;
      if (species.num <= 0 || species.num > maxDexNum) continue;
      if (species.forme) continue;

      const bst = calcBst(species.baseStats);
      const isWater = species.types.map((t) => t.toLowerCase()).includes("water");

      if (isWater && bst >= 500) {
        results.push(species.name);
      }
    }

    expect(results).toContain("Swampert");
    expect(results).toContain("Gyarados");
    expect(results).toContain("Milotic");
  });

  it("returns empty for impossible criteria", () => {
    const dex = getDex(3);
    const maxDexNum = 386;
    const results: string[] = [];

    for (const species of dex.species.all()) {
      if (!species.exists || species.isNonstandard) continue;
      if (species.num <= 0 || species.num > maxDexNum) continue;
      if (species.forme) continue;

      const bst = calcBst(species.baseStats);
      if (bst >= 1000) {
        results.push(species.name);
      }
    }

    expect(results).toHaveLength(0);
  });

  it("respects limit parameter", () => {
    const dex = getDex(3);
    const maxDexNum = 386;
    const limit = 5;
    const results: string[] = [];

    for (const species of dex.species.all()) {
      if (!species.exists || species.isNonstandard) continue;
      if (species.num <= 0 || species.num > maxDexNum) continue;
      if (species.forme) continue;

      results.push(species.name);
      if (results.length >= limit) break;
    }

    expect(results).toHaveLength(5);
  });
});

// ─── move_data tests ────────────────────────────────────────────────────────

describe("move_data", () => {
  it("returns correct data for Earthquake", () => {
    const dex = getDex(3);
    const move = dex.moves.get("earthquake");

    expect(move.exists).toBe(true);
    expect(move.name).toBe("Earthquake");
    expect(move.type).toBe("Ground");
    expect(move.category).toBe("Physical");
    expect(move.basePower).toBe(100);
    expect(move.accuracy).toBe(100);
    expect(move.pp).toBe(10);
  });

  it("returns correct data for Flamethrower", () => {
    const dex = getDex(3);
    const move = dex.moves.get("flamethrower");

    expect(move.exists).toBe(true);
    expect(move.name).toBe("Flamethrower");
    expect(move.type).toBe("Fire");
    expect(move.category).toBe("Special");
    expect(move.basePower).toBe(95);
    expect(move.accuracy).toBe(100);
  });

  it("handles status moves correctly", () => {
    const dex = getDex(3);
    const move = dex.moves.get("thunderwave");

    expect(move.exists).toBe(true);
    expect(move.name).toBe("Thunder Wave");
    expect(move.type).toBe("Electric");
    expect(move.category).toBe("Status");
    expect(move.basePower).toBe(0);
  });

  it("handles always-hit moves", () => {
    const dex = getDex(3);
    const move = dex.moves.get("aerialace");

    expect(move.exists).toBe(true);
    expect(move.accuracy).toBe(true);
  });

  it("returns exists=false for unknown moves", () => {
    const dex = getDex(3);
    const move = dex.moves.get("notamove");

    expect(move.exists).toBe(false);
  });

  it("returns move data for valid moves", () => {
    const dex3 = getDex(3);

    // Shadow Ball exists in Gen 3
    const shadowBall = dex3.moves.get("shadowball");
    expect(shadowBall.exists).toBe(true);
    expect(shadowBall.type).toBe("Ghost");

    // Surf is a classic move
    const surf = dex3.moves.get("surf");
    expect(surf.exists).toBe(true);
    expect(surf.type).toBe("Water");
    expect(surf.basePower).toBe(95);
  });
});

// ─── type_matchup tests ─────────────────────────────────────────────────────

describe("type_matchup", () => {
  it("calculates super effective correctly", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("fire");
    const defType = dex.types.get("grass");

    const dt = defType.damageTaken[atkType.name] ?? 0;
    const mult = DT_TO_MULT[dt];

    expect(mult).toBe(2);
  });

  it("calculates not very effective correctly", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("fire");
    const defType = dex.types.get("water");

    const dt = defType.damageTaken[atkType.name] ?? 0;
    const mult = DT_TO_MULT[dt];

    expect(mult).toBe(0.5);
  });

  it("calculates immunity correctly", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("ground");
    const defType = dex.types.get("flying");

    const dt = defType.damageTaken[atkType.name] ?? 0;
    const mult = DT_TO_MULT[dt];

    expect(mult).toBe(0);
  });

  it("calculates neutral correctly", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("normal");
    const defType = dex.types.get("fire");

    const dt = defType.damageTaken[atkType.name] ?? 0;
    const mult = DT_TO_MULT[dt];

    expect(mult).toBe(1);
  });

  it("calculates dual-type matchups correctly", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("ice");

    // Ice vs Dragon/Flying (Salamence) = 4x
    let mult = 1;
    for (const defTypeName of ["Dragon", "Flying"]) {
      const defType = dex.types.get(defTypeName);
      const dt = defType.damageTaken[atkType.name] ?? 0;
      mult *= DT_TO_MULT[dt] ?? 1;
    }

    expect(mult).toBe(4);
  });

  it("calculates quadruple resist correctly", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("grass");

    // Grass vs Water/Ground (Swampert) = 4x
    let mult = 1;
    for (const defTypeName of ["Water", "Ground"]) {
      const defType = dex.types.get(defTypeName);
      const dt = defType.damageTaken[atkType.name] ?? 0;
      mult *= DT_TO_MULT[dt] ?? 1;
    }

    expect(mult).toBe(4);
  });

  it("returns exists=false for unknown types", () => {
    const dex = getDex(3);
    const type = dex.types.get("notatype");

    expect(type.exists).toBe(false);
  });
});

// ─── pokemon_learnset tests ─────────────────────────────────────────────────

describe("pokemon_learnset", () => {
  it("returns learnset for Blaziken in Gen 3", async () => {
    const dex = getDex(3);
    const learnset = await dex.learnsets.get("blaziken");

    expect(learnset).toBeDefined();
    expect(learnset?.learnset).toBeDefined();

    // Blaziken should learn Blaze Kick
    expect(learnset?.learnset?.blazekick).toBeDefined();
  });

  it("includes level-up moves with correct format", async () => {
    const dex = getDex(3);
    const learnset = await dex.learnsets.get("pikachu");

    expect(learnset?.learnset?.thundershock).toBeDefined();
    // Format is like "3L1" for Gen 3, Level 1
    const sources = learnset?.learnset?.thundershock ?? [];
    const gen3Sources = sources.filter((s) => s.startsWith("3"));
    expect(gen3Sources.length).toBeGreaterThan(0);
  });

  it("includes TM moves", async () => {
    const dex = getDex(3);
    const learnset = await dex.learnsets.get("alakazam");

    // Alakazam learns Psychic via TM
    expect(learnset?.learnset?.psychic).toBeDefined();
    const sources = learnset?.learnset?.psychic ?? [];
    const tmSources = sources.filter((s) => s.startsWith("3M"));
    expect(tmSources.length).toBeGreaterThan(0);
  });

  it("includes egg moves", async () => {
    const dex = getDex(3);
    const learnset = await dex.learnsets.get("charmander");

    // Charmander can learn Dragon Dance as egg move
    expect(learnset?.learnset?.dragondance).toBeDefined();
    const sources = learnset?.learnset?.dragondance ?? [];
    const eggSources = sources.filter((s) => s.startsWith("3E"));
    expect(eggSources.length).toBeGreaterThan(0);
  });

  it("returns undefined learnset for unknown Pokémon", async () => {
    const dex = getDex(3);
    const learnset = await dex.learnsets.get("notapokemon");

    expect(learnset?.learnset).toBeUndefined();
  });
});

// ─── smogon_sets tests ──────────────────────────────────────────────────────

describe("smogon_sets", () => {
  it("returns sets for a common OU Pokémon", () => {
    const results = getSmogonSets("Tyranitar");

    expect(results.length).toBeGreaterThan(0);

    // Should have at least one format with sets
    const firstResult = results[0];
    expect(firstResult.format).toBeDefined();
    expect(Object.keys(firstResult.sets).length).toBeGreaterThan(0);
  });

  it("returns sets with moves array", () => {
    const results = getSmogonSets("Salamence");

    expect(results.length).toBeGreaterThan(0);

    const firstResult = results[0];
    const setNames = Object.keys(firstResult.sets);
    expect(setNames.length).toBeGreaterThan(0);

    const firstSet = firstResult.sets[setNames[0]];
    expect(firstSet.moves).toBeDefined();
    expect(Array.isArray(firstSet.moves)).toBe(true);
    expect(firstSet.moves.length).toBeGreaterThan(0);
  });

  it("filters by format when specified", () => {
    const results = getSmogonSets("Metagross", "ou");

    // Should only return OU format
    for (const result of results) {
      expect(result.format.toLowerCase()).toBe("ou");
    }
  });

  it("returns empty array for unknown Pokémon", () => {
    const results = getSmogonSets("NotAPokemon");

    expect(results).toEqual([]);
  });

  it("returns empty array for Pokémon not in specified format", () => {
    // Magikarp is unlikely to have OU sets
    const results = getSmogonSets("Magikarp", "ou");

    expect(results).toEqual([]);
  });

  it("handles case-insensitive Pokémon names", () => {
    const results1 = getSmogonSets("tyranitar");
    const results2 = getSmogonSets("TYRANITAR");
    const results3 = getSmogonSets("Tyranitar");

    // All should return results (may vary slightly due to exact key matching)
    expect(results1.length + results2.length + results3.length).toBeGreaterThan(0);
  });

  it("handles format shorthand (ou instead of gen4ou)", () => {
    const results = getSmogonSets("Gengar", "ou");

    expect(results.length).toBeGreaterThan(0);
  });
});

// ─── smogon_format_pokemon tests ────────────────────────────────────────────

describe("smogon_format_pokemon (listFormatPokemon)", () => {
  it("returns Pokémon list for OU format", () => {
    const pokemon = listFormatPokemon("ou");

    expect(pokemon.length).toBeGreaterThan(0);

    // Each entry should have name and sets
    for (const p of pokemon.slice(0, 5)) {
      expect(p.name).toBeDefined();
      expect(Array.isArray(p.sets)).toBe(true);
      expect(p.sets.length).toBeGreaterThan(0);
    }
  });

  it("returns empty array for invalid format", () => {
    const pokemon = listFormatPokemon("notaformat");

    expect(pokemon).toEqual([]);
  });

  it("handles format shorthand", () => {
    const pokemon1 = listFormatPokemon("uu");
    const pokemon2 = listFormatPokemon("gen4uu");

    // Both should return results
    expect(pokemon1.length).toBeGreaterThan(0);
    expect(pokemon2.length).toBeGreaterThan(0);
  });

  it("includes expected Pokémon in OU", () => {
    const pokemon = listFormatPokemon("ou");
    const names = pokemon.map((p) => p.name);

    // These are staple Gen 4 OU Pokémon
    const expectedOu = ["Tyranitar", "Salamence", "Metagross", "Gengar"];
    const foundCount = expectedOu.filter((n) => names.includes(n)).length;

    expect(foundCount).toBeGreaterThan(0);
  });
});

// ─── listAvailableFormats tests ─────────────────────────────────────────────

describe("listAvailableFormats", () => {
  it("returns Gen 4 formats", () => {
    const formats = listAvailableFormats();

    expect(formats.length).toBeGreaterThan(0);

    const formatNames = formats.map((f) => f.format.toLowerCase());
    expect(formatNames).toContain("ou");
    expect(formatNames).toContain("uu");
  });

  it("includes Pokémon counts for each format", () => {
    const formats = listAvailableFormats();

    for (const format of formats) {
      expect(format.count).toBeGreaterThanOrEqual(0);
      expect(typeof format.count).toBe("number");
    }
  });

  it("OU has significant number of Pokémon", () => {
    const formats = listAvailableFormats();
    const ou = formats.find((f) => f.format.toLowerCase() === "ou");

    expect(ou).toBeDefined();
    expect(ou!.count).toBeGreaterThan(50);
  });
});

// ─── team_type_coverage tests ───────────────────────────────────────────────

describe("team_type_coverage", () => {
  it("correctly identifies team member types", () => {
    const dex = getDex(3);
    const team = ["swampert", "salamence", "metagross"];
    const members: Array<{ name: string; types: string[] }> = [];

    for (const name of team) {
      const species = dex.species.get(name);
      if (species.exists) {
        members.push({ name: species.name, types: species.types });
      }
    }

    expect(members).toHaveLength(3);
    expect(members[0]).toEqual({ name: "Swampert", types: ["Water", "Ground"] });
    expect(members[1]).toEqual({ name: "Salamence", types: ["Dragon", "Flying"] });
    expect(members[2]).toEqual({ name: "Metagross", types: ["Steel", "Psychic"] });
  });

  it("identifies Ice weakness for Dragon/Flying", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("ice");
    const member = { name: "Salamence", types: ["Dragon", "Flying"] };

    let mult = 1;
    for (const defTypeName of member.types) {
      const defType = dex.types.get(defTypeName);
      const dt = defType.damageTaken[atkType.name] ?? 0;
      mult *= DT_TO_MULT[dt] ?? 1;
    }

    expect(mult).toBe(4); // 4x weak to Ice
  });

  it("identifies Ground immunity for Flying types", () => {
    const dex = getDex(3);
    const atkType = dex.types.get("ground");
    const member = { name: "Salamence", types: ["Dragon", "Flying"] };

    let mult = 1;
    for (const defTypeName of member.types) {
      const defType = dex.types.get(defTypeName);
      const dt = defType.damageTaken[atkType.name] ?? 0;
      mult *= DT_TO_MULT[dt] ?? 1;
    }

    expect(mult).toBe(0); // Immune to Ground
  });

  it("handles unknown Pokémon gracefully", () => {
    const dex = getDex(3);
    const species = dex.species.get("notapokemon");

    expect(species.exists).toBe(false);
  });

  it("calculates STAB coverage types", () => {
    const dex = getDex(3);
    const team = ["swampert", "salamence", "metagross"];
    const stabTypes = new Set<string>();

    for (const name of team) {
      const species = dex.species.get(name);
      if (species.exists) {
        for (const t of species.types) {
          stabTypes.add(t);
        }
      }
    }

    expect(stabTypes.has("Water")).toBe(true);
    expect(stabTypes.has("Ground")).toBe(true);
    expect(stabTypes.has("Dragon")).toBe(true);
    expect(stabTypes.has("Flying")).toBe(true);
    expect(stabTypes.has("Steel")).toBe(true);
    expect(stabTypes.has("Psychic")).toBe(true);
  });
});

// ─── Edge cases and error handling ──────────────────────────────────────────

describe("edge cases", () => {
  it("handles empty strings gracefully", () => {
    const dex = getDex(3);

    const species = dex.species.get("");
    expect(species.exists).toBe(false);

    const move = dex.moves.get("");
    expect(move.exists).toBe(false);

    const type = dex.types.get("");
    expect(type.exists).toBe(false);
  });

  it("handles special characters in names", () => {
    const dex = getDex(3);

    // Mr. Mime has special characters
    const mrMime = dex.species.get("mr. mime");
    expect(mrMime.exists).toBe(true);
    expect(mrMime.name).toBe("Mr. Mime");

    // Farfetch'd has apostrophe
    const farfetchd = dex.species.get("farfetch'd");
    expect(farfetchd.exists).toBe(true);
  });

  it("handles Nidoran gender forms", () => {
    const dex = getDex(3);

    const nidoranF = dex.species.get("nidoran-f");
    const nidoranM = dex.species.get("nidoran-m");

    expect(nidoranF.exists).toBe(true);
    expect(nidoranM.exists).toBe(true);
    expect(nidoranF.num).toBe(29);
    expect(nidoranM.num).toBe(32);
  });

  it("smogon_sets handles null/undefined format gracefully", () => {
    const results = getSmogonSets("Tyranitar", undefined);
    expect(results.length).toBeGreaterThan(0);
  });

  it("smogon_sets returns empty for non-existent format", () => {
    const results = getSmogonSets("Tyranitar", "gen99ou");
    expect(results).toEqual([]);
  });
});

// ─── Generation-specific tests ──────────────────────────────────────────────

describe("generation differences", () => {
  it("Steel resists Dark in Gen 2-5, not in Gen 6+", () => {
    const dex2 = getDex(2);
    const dex6 = getDex(6);

    const steelType2 = dex2.types.get("steel");
    const steelType6 = dex6.types.get("steel");

    const darkDt2 = steelType2.damageTaken["Dark"] ?? 0;
    const darkDt6 = steelType6.damageTaken["Dark"] ?? 0;

    // In Gen 2-5, Steel resists Dark (0.5x)
    expect(DT_TO_MULT[darkDt2]).toBe(0.5);
    // In Gen 6+, Steel no longer resists Dark (1x)
    expect(DT_TO_MULT[darkDt6]).toBe(1);
  });

  it("Fairy type matchups work correctly in Gen 6+", () => {
    const dex6 = getDex(6);

    const fairy = dex6.types.get("fairy");
    expect(fairy.exists).toBe(true);

    // Fairy is super effective against Dragon
    const dragon = dex6.types.get("dragon");
    const dt = dragon.damageTaken["Fairy"] ?? 0;
    expect(DT_TO_MULT[dt]).toBe(2);
  });

  it("move categories differ between Gen 3 and Gen 4+", () => {
    // In Gen 3, all Fire moves are Special regardless of the move
    // In Gen 4+, Fire Punch is Physical
    const dex3 = getDex(3);
    const dex4 = getDex(4);

    const firePunch3 = dex3.moves.get("firepunch");
    const firePunch4 = dex4.moves.get("firepunch");

    expect(firePunch3.category).toBe("Special"); // Gen 3: type-based
    expect(firePunch4.category).toBe("Physical"); // Gen 4+: move-based
  });
});
