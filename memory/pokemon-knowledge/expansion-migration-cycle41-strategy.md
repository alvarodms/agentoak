# pokeemerald-expansion Migration: Cycle 41 Practical Strategy

**Cycle**: 41 | **Date**: March 2026

---

## ⚠️ CRITICAL CORRECTION (Verified in Cycle 41)

**`COMPETITIVE_PARTY_SYNTAX` DOES NOT EXIST** in pokeemerald-expansion v1.15.0.

The previous research claiming this flag exists was INCORRECT — a hallucination. Grepping the entire expansion source returns zero results for this string. The `.party` file format (processed by `trainerproc`) is MANDATORY in expansion v1.15.0. There is no toggle to use the old C struct format.

**Lesson**: Research findings must be verified by actually searching the codebase before implementation.

---

## What Was Actually Discovered (Cycle 41 Build Attempt)

### The expansion and vanilla pokeemerald are architecturally incompatible

The rsync + git checkout approach (copy expansion files, restore LoH game data) does NOT work because:

1. `struct BattleResources` has completely different members — vanilla has `.battleScriptsStack`, expansion has `.ai`, `.battleHistory`, `.AI_ScriptsStack`
2. Dozens of vanilla globals are renamed or removed in expansion
3. The battle AI system was completely rewritten — vanilla `battle_ai_script_commands.c` produces 200+ errors with expansion headers
4. `gBattleMoves`, `gActiveBattler`, `gDisableStructs`, `gTrainerBattleOpponent_A` all removed/renamed

### Trainer Format

The expansion uses `.party` files in `src/data/trainers.party`, compiled by the `trainerproc` tool (located at `tools/trainerproc/main.c`, 2291 lines). The format uses Pokémon Showdown competitive syntax:

```
=== TRAINER_ROXANNE_1 ===
Name: ROXANNE
Pic: Leader Roxanne
...
Geodude
Level: 12
IVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe
```

This is processed by `trainer_rules.mk` which is included by the main Makefile.

### Correct Migration Approach

The expansion is a separate codebase. Migration must go in this direction:
- **START** with a fresh expansion clone as the base
- **PORT** LoH content INTO it (encounters, trainer parties in .party format, dialogue scripts, QoL patches)
- NOT: copy expansion files onto vanilla and try to fix the breakage

### Difficulty System (Expansion-Only)

The expansion adds `enum DifficultyLevel` with `DIFFICULTY_COUNT`. `gTrainers[]` becomes `gTrainers[DIFFICULTY_COUNT][TRAINERS_COUNT]`. This also affects `gBattlePartners[]`. All trainer-related code must be updated.

---

## Format Conversion Reference (Still Valid)

Old C struct → New competitive syntax:
```c
// OLD (vanilla)
static const struct TrainerMon sParty_Roxanne1[] = {
  { .lvl = 15, .species = SPECIES_GEODUDE }
};
```

```
# NEW (expansion .party format)
=== TRAINER_ROXANNE_1 ===
Geodude
Level: 15
IVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe
```

Migration scripts in `migration_scripts/` directory handle some automated conversion.
