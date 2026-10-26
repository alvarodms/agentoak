import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { designatedBlock, normalizeSpeciesName, speciesReport } from "./species.js";

const FIXTURE: Record<string, string> = {
  "include/constants/species.h": `
#define SPECIES_NONE 0
#define SPECIES_LOTAD 295
#define SPECIES_LOMBRE 296
#define SPECIES_LUDICOLO_HOENN 438
`,
  "src/data/text/species_names.h": `
    [SPECIES_LOTAD] = _("LOTAD"),
    [SPECIES_LUDICOLO_HOENN] = _("LUDICOLO"),
`,
  "src/data/pokemon/species_info.h": `
    [SPECIES_LOTAD] =
    {
        .baseHP        = 40,
        .baseAttack    = 30,
        .baseDefense   = 30,
        .baseSpeed     = 30,
        .baseSpAttack  = 40,
        .baseSpDefense = 50,
        .types = { TYPE_WATER, TYPE_GRASS },
        .catchRate = 255,
        .expYield = 74,
        .evYield_HP        = 0,
        .evYield_SpDefense = 1,
        .itemCommon = ITEM_NONE,
        .itemRare   = ITEM_NONE,
        .genderRatio = PERCENT_FEMALE(50),
        .eggCycles = 15,
        .friendship = 70,
        .growthRate = GROWTH_MEDIUM_SLOW,
        .eggGroups = { EGG_GROUP_WATER_1, EGG_GROUP_GRASS },
        .abilities = {ABILITY_SWIFT_SWIM, ABILITY_RAIN_DISH},
        .bodyColor = BODY_COLOR_GREEN,
    },
`,
  "src/data/pokemon/pokedex_entries.h": `
    [NATIONAL_DEX_LOTAD] =
    {
        .categoryName = _("WATER WEED"),
        .height = 5,
        .weight = 26,
        .description = gLotadPokedexText,
        .pokemonScale = 406,
        .pokemonOffset = 19,
        .trainerScale = 256,
        .trainerOffset = 0,
    },
`,
  "src/data/pokemon/pokedex_text.h": `
const u8 gLotadPokedexText[] = _(
    "It lives in ponds\\n"
    "with clean water.");
`,
  "src/data/pokemon/level_up_learnset_pointers.h": `
    [SPECIES_LOTAD] = sLotadLevelUpLearnset,
`,
  "src/data/pokemon/level_up_learnsets.h": `
static const u16 sLotadLevelUpLearnset[] = {
    LEVEL_UP_MOVE( 1, MOVE_ASTONISH),
    LEVEL_UP_MOVE(13, MOVE_NATURE_POWER),
    LEVEL_UP_END
};
`,
  "src/data/pokemon/tmhm_learnsets.h": `
    [SPECIES_LOTAD] = { .learnset = {
        .TOXIC = TRUE,
        .SURF = TRUE,
    } },
`,
  "src/data/pokemon/tutor_learnsets.h": `
    [SPECIES_LOTAD] = (TUTOR(MOVE_MIMIC)
                     | TUTOR(MOVE_ICY_WIND)),
`,
  "src/data/pokemon/egg_moves.h": `
#define egg_moves(species, moves...) (SPECIES_##species + EGG_MOVES_SPECIES_OFFSET), moves

const u16 gEggMoves[] = {
    egg_moves(LOTAD,
              MOVE_SYNTHESIS,
              MOVE_FLAIL),
    egg_moves(LOMBRE,
              MOVE_SURF),
    EGG_MOVES_SPECIES_OFFSET + SPECIES_LUDICOLO_HOENN,
EGG_MOVES_TERMINATOR
};
`,
  "src/data/pokemon/evolution.h": `
const struct Evolution gEvolutionTable[NUM_SPECIES][EVOS_PER_MON] =
{
    [SPECIES_LOTAD]  = {{EVO_LEVEL, 14, SPECIES_LOMBRE}},
    [SPECIES_LOMBRE] = {{EVO_ITEM, ITEM_LEAF_STONE, SPECIES_LUDICOLO_HOENN}},
};
`,
  "src/data/wild_encounters.json": JSON.stringify({
    wild_encounter_groups: [{
      label: "gWildMonHeaders",
      fields: [
        { type: "land_mons", encounter_rates: [60, 30, 10] },
        { type: "fishing_mons", encounter_rates: [70, 30, 100], groups: { old_rod: [0, 1], good_rod: [2] } },
      ],
      encounters: [
        {
          map: "MAP_ROUTE101",
          base_label: "gRoute101",
          land_mons: { mons: [
            { min_level: 2, max_level: 3, species: "SPECIES_LOTAD" },
            { min_level: 2, max_level: 2, species: "SPECIES_NONE" },
            { min_level: 4, max_level: 4, species: "SPECIES_LOTAD" },
          ] },
          fishing_mons: { mons: [
            { min_level: 5, max_level: 10, species: "SPECIES_LOTAD" },
            { min_level: 5, max_level: 10, species: "SPECIES_NONE" },
            { min_level: 10, max_level: 20, species: "SPECIES_NONE" },
          ] },
        },
        {
          map: "MAP_ROUTE102",
          base_label: "gRoute102",
          fishing_mons: { mons: [
            { min_level: 5, max_level: 10, species: "SPECIES_LOTAD" },
            { min_level: 5, max_level: 10, species: "SPECIES_NONE" },
            { min_level: 10, max_level: 20, species: "SPECIES_NONE" },
          ] },
        },
      ],
    }],
  }),
  "src/data/trainer_parties.h": `
static const struct TrainerMonNoItemDefaultMoves sParty_Gina[] = {
    {
    .iv = 0,
    .lvl = 10,
    .species = SPECIES_LOTAD,
    },
    {
    .iv = 0,
    .lvl = 12,
    .species = SPECIES_LOMBRE,
    }
};
`,
  "src/data/trainers.h": `
    [TRAINER_GINA_1] =
    {
        .trainerName = _("GINA"),
        .party = NO_ITEM_DEFAULT_MOVES(sParty_Gina),
    },
`,
};

let root: string;

beforeAll(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "rom-species-"));
  for (const [file, content] of Object.entries(FIXTURE)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  }
});

afterAll(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("speciesReport", () => {
  it("collects one species from every data file", () => {
    expect(speciesReport(root, "lotad")).toBe([
      'SPECIES_LOTAD (#295) — "LOTAD"',
      "Stats: HP 40 / Atk 30 / Def 30 / SpA 40 / SpD 50 / Spe 30 (BST 220)",
      "Types: WATER / GRASS | Abilities: SWIFT_SWIM / RAIN_DISH",
      "Catch rate 255, EXP 74, EVs SpDefense 1, growth MEDIUM_SLOW, gender PERCENT_FEMALE(50), " +
        "egg groups WATER_1 / GRASS, items ITEM_NONE/ITEM_NONE, egg cycles 15, friendship 70, color GREEN",
      'Pokédex: category "WATER WEED", height 5, weight 26, scale 406/19, trainer scale 256/0 (gLotadPokedexText)',
      '  "It lives in ponds with clean water."',
      "Level-up (sLotadLevelUpLearnset): 1 ASTONISH, 13 NATURE_POWER",
      "TM/HM (2): TOXIC, SURF",
      "Tutor: MIMIC, ICY_WIND",
      "Egg moves: SYNTHESIS, FLAIL",
      "Evolution: → LOMBRE (LEVEL 14)",
      "Wild:",
      "  land 70% Lv2-4: ROUTE101",
      "  old_rod 70% Lv5-10: ROUTE101, ROUTE102",
      "Trainers (1): GINA_1 Lv10",
    ].join("\n"));
  });

  it("limits the report to the requested sections", () => {
    expect(speciesReport(root, "SPECIES_LUDICOLO_HOENN", ["egg_moves", "evolution", "wild"])).toBe([
      'SPECIES_LUDICOLO_HOENN (#438) — "LUDICOLO"',
      "Egg moves: none",
      "Evolution: ← LOMBRE (ITEM ITEM_LEAF_STONE)",
      "Wild: none",
    ].join("\n"));
  });

  it("reports missing entries instead of failing", () => {
    const report = speciesReport(root, "ludicolo hoenn", ["stats", "pokedex", "learnset", "tmhm", "tutor"]);
    expect(report).toContain("Stats: (no species_info entry)");
    expect(report).toContain("Pokédex: (no pokedex_entries entry)");
    expect(report).toContain("Level-up: (no learnset)");
    expect(report).toContain("TM/HM: (no entry)");
    expect(report).toContain("Tutor: none");
  });

  it("suggests close matches for an unknown species", () => {
    expect(speciesReport(root, "ludicolo")).toBe(
      "Unknown species: SPECIES_LUDICOLO. Did you mean: SPECIES_LUDICOLO_HOENN?",
    );
  });
});

describe("normalizeSpeciesName", () => {
  it.each([
    ["SPECIES_LUDICOLO_HOENN", "LUDICOLO_HOENN"],
    ["ludicolo hoenn", "LUDICOLO_HOENN"],
    ["Ludicolo-Hoenn", "LUDICOLO_HOENN"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeSpeciesName(input)).toBe(expected);
  });
});

describe("designatedBlock", () => {
  it("does not match a key that only shares a prefix", () => {
    const source = "[SPECIES_LOTAD_HOENN] = { .a = 1 },\n[SPECIES_LOTAD] = { .a = 2 },";
    expect(designatedBlock(source, "SPECIES_LOTAD")).toBe("[SPECIES_LOTAD] = { .a = 2 }");
  });

  it("returns a plain value up to its comma", () => {
    expect(designatedBlock("[SPECIES_LOTAD] = sLotadLearnset,", "SPECIES_LOTAD")).toBe(
      "[SPECIES_LOTAD] = sLotadLearnset",
    );
  });
});
