# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Species Registration System (C222)

**19 files** per species. Check script: `scripts/check_species_registration.sh`. Gap-filler: `scripts/complete_species_registration.cjs`. Files use 3 naming conventions:
- `SPECIES_X` (species.h, species_info.h, pokemon_icon.c, pokemon.c, cry_ids.h, evolution.h, front_pic_anims.h, level_up_learnset_pointers.h, tmhm_learnsets.h)
- `NATIONAL_DEX_X` (pokedex.h, pokedex_entries.h, pokedex_orders.h)
- PascalCase `gMon*_X` (pokemon.h, graphics.h, anim_mon_front_pics.c, level_up_learnsets.h, pokedex_text.h, cry_tables.inc)

**Cry system**: `SpeciesToCryId()` in pokemon.c. Gen 1-2: cry ID = species - 1. Gen 3+: `gSpeciesIdToCryId[species - 276]`. Custom species MUST add cry_ids.h entries mapping `[SPECIES_X - 277] = <base_cry_id>`. Without entries, all custom species default to cry ID 0 (Growlithe). cry_tables.inc entries are for unique cries only; reuse species just need cry_ids.h.

---

## Trainer System

**Three-file system**: `opponents.h` (IDs), `trainers.h` (metadata + macro), `trainer_parties.h` (party struct). All three must match. Macro/struct mismatch = crash. Validation: `scripts/check_trainers.sh`.

**Capacity**: TRAINERS_COUNT = 885 (at cap). 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853. Note: #854 is NOT reclaimable (in rematch table). Rematch table: 5 tiers, all filled.

---

## Dialogue Editing System (Cycles 24-26)

**Text format**: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars/line. Smart quotes valid (charmap B1/B2). ASCII `"` (0x22) NOT in charmap. Em-dashes NOT in charmap — use `--`. Ellipsis = B0 in charmap. **Only valid escapes**: `\n`, `\l`, `\p`, `$`. Any other `\X` (e.g. `\e`, `\t`) causes build error.

**Safety**: `MSGBOX_NPC` labels safe to rewrite. `MSGBOX_DEFAULT` may have story logic.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist. VAR_TEMP_* reset on map transition — coord_events using them as guards fire once per visit.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5. Fishing: 10.

**Conditional tables**: `GetCurrentMapWildMonHeaderId()` in `src/wild_encounter.c` (line 305). Alternate entry MUST follow base entry in JSON.

---

## Physical/Special Split & Move System (Cycle 43-44, 75, 128)

**MOVES_COUNT** = 378 (IDs 0-377). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5: 358-377.

**Custom species in species.h (17 defined)**: Riolu (412), Lucario (413), Weavile (414), Gible (415), Gabite (416), Garchomp (417), Corsola_Hoenn (418), Growlithe_Hoenn (419), Arcanine_Hoenn (420), Dusknoir (421), Honchkrow (422), Froslass (423), Mamoswine (424), Bagon_Hoenn (425), Vulpix_Hoenn (426), Ninetales_Hoenn (427), Farigiraf (428). SPECIES_EGG=429, NUM_SPECIES=429.
**Registration status (C223)**: All 17 species at 19/19. Species foundation complete.

**Evolution methods**: Constants 1-17 in `include/constants/pokemon.h`. Custom additions: `EVO_LEVEL_FEMALE` (16) — level-up gated by female gender; `EVO_ITEM_FEMALE` (17) — item-use gated by female gender (C229). Both use `GetGenderFromSpeciesAndPersonality()` in `GetEvolutionTargetSpecies()`. Snorunt→Froslass uses `EVO_ITEM_FEMALE` with `ITEM_DAWN_STONE`.

**Dawn Stone item**: `ITEM_DAWN_STONE` = 99 (slot 0x063). Uses Moon Stone icon. Item effect: `gItemEffect_DawnStone` with `ITEM4_EVO_STONE`. Placed in Shoal Cave Ice Room (flag 0x468).

---

## Player Sprite Palette System (C227, updated C228)

**Palette architecture**: All Brendan overworld sprites share `OBJ_EVENT_PAL_TAG_BRENDAN` (loaded from `graphics/object_events/palettes/brendan.pal`). Same for May. Palette slot: `PALSLOT_PLAYER` (enum in `include/event_object_movement.h`). Reflections loaded via `LoadPlayerObjectReflectionPalette()` from separate `_reflection.pal` files.

**Full manifest**: 16 `.pal` files + 6 PNGs with embedded palettes = 22 files total. Complete list in `memory/pokemon-knowledge/player-sprite-manifest.md`. All recolored to sea-glass teal in C228.

**Runtime palette sources**: Intro bicycle scene uses `player.pal` for BOTH genders (`gIntroPlayer_Pal`). Credits scene uses PNG-generated `.gbapal` per gender. Pokenav icons use PNG-embedded palette.

**Battle transition mugshots**: `brendan_bg.pal`/`may_bg.pal` — gradient palettes (originally blue/pink, now teal). Not overworld palettes.

**Underwater palette**: Separate tag `OBJ_EVENT_PAL_TAG_PLAYER_UNDERWATER` from `player_underwater.pal`.

---

## Roaming Pokemon System (Cycle 108-109)

Single roamer slot (`struct Roamer`, 28 bytes). Beast system: `roamer.c` `InitNextBeast()` sequentially releases Raikou->Entei->Suicune using 6 flags. Full ref: `memory/pokemon-knowledge/roamer-implementation-patterns.md`.

---

## Flag System Layout (Cycle 117-118)

**Layout**: Story (0x00-0x2FF) -> Trainer (0x500-0x873) -> System (0x874+) -> Daily (0x972+)

**Custom flags**: 0x264-0x29B used (v6.0 through v2.0). 0x286 = `FLAG_DIFFICULTY_CHALLENGE` (C181). 0x287-0x289 = migration events (C188-189). 0x28A-0x297 = v1.8 quest flags (C192): Elder 28A-28C, Hartley 28D-291, Mossdeep 292-294, Fog 295-297. 0x298-0x29A = Deoxys quest (C210): STARTED/INVESTIGATED/COMPLETE. 0x29B = `FLAG_BAGON_COLONY_CALLBACK` (C215). Next available: 0x29C.

**Beast flags**: System flags 0x881-0x886.

---

## Multichoice System (Cycle 181)

**Constants**: `include/constants/script_menu.h` — `MULTI_*` IDs (0-114). `MULTI_B_PRESSED` = 127.
**Data**: `src/data/script_menu.h` — `sMultichoiceLists[]` array indexed by MULTI_* constants.
**Last used ID**: 115 (`MULTI_DIFFICULTY_DOWNGRADE`). Next available: 116.

---

## Legendary Battle Pattern

`setwildbattle` -> `setflag` -> `special BattleSetup_StartLegendaryBattle` -> `waitstate` -> check `B_OUTCOME_CAUGHT`. Used by all 5 shipped legendaries (including Deoxys C210).

## Challenge Mode Level Scaling (C210)

**Header**: `include/challenge_mode_scaling.h`. Data table mapping `TRAINER_CLASS_*` constants to `s8 levelBoost` values. Hooked into `CreateNPCTrainerParty()` in `src/battle_main.c` — computed once before the party loop, applied to each CreateMon call. Classes: Leader +3, E4 +3, Champion +5, Rival +2, Aqua/Magma Leaders +2, Aqua/Magma Admins +1. Extend by adding rows to `sChallengeModeScaling[]`.

## Legendary Encounter Macros (C185)

**File**: `asm/macros/legend_macros.inc`. 7 composable macros for camera shake, cries, weather, fades, and battle setup.

---

## Scripted Event Macro Library (C179)

**File**: `asm/macros/event_macros.inc`. 3 macros: `GlimpseEvent`, `BadgeGateShow`, `ConditionalDialogue`.

---

## Weather System (C149, C159-160)

**Weather Omens**: Badge-gated permanent weather on 4 routes (R111/119/120/125). Flags 0x282-0x285.
**Permanent weather pattern**: Flag-gated `setweather` in `OnTransition` (without `doweather`).

---

## Build Validation Targets (C141, C170, C206, C220, C222, C225)

`make check_scripts` — Lints .inc files for non-charmap characters.
`make check_encounters` — Node.js validator for `wild_encounters.json`.
`make check_e4_rematches` — Bash validator for E4 rematch parties (duplicates, level progression, regional form presence).
`make check_species` — Runs `scripts/check_species_registration.sh` on all custom species. Checks 19 required files per species. Exit 0 only if ALL pass.
`make check_evolution` — Bash validator for evolution.h: source/target species, method validity, duplicates, gender-gated evos, branching uniqueness.
`make check_all` — Runs check_species + check_encounters + check_e4_rematches + check_evolution.

## Script Pokédex Check (C225)

`ScriptCheckPokedexSeen` — special function for checking if a species has been seen in the Pokédex from event scripts. Usage: `setvar VAR_0x8004, SPECIES_X` then `specialvar VAR_RESULT, ScriptCheckPokedexSeen`. Returns 1 if seen, 0 if not.

---

## Regional Variant Species Pipeline (C195-202)

**Generic pipeline script**: `scripts/add_regional_form.cjs` — config-driven, inserts into 27 files from a single JSON spec. **WARNING (C215-216)**: Pipeline catastrophically broken — only populates ~7/23 required files. DO NOT use without audit. See failure-patterns.md.

**Species registration checklist (27 files)**: species.h, pokedex.h (national+hoenn+counts), species_info.h, graphics/pokemon.h (6 INCBINs), graphics.h (7 externs — MUST include gMonFrontPic_*), front/back_pic_coordinates.h, front/back_pic_table.h, palette/shiny_palette_table.h, still_front_pic_table.h, footprint_table.h, pokemon_icon.c (icon+palette), front_pic_anims.h (3 locations), pokedex_text.h, pokedex_entries.h, level_up_learnsets.h, level_up_learnset_pointers.h, pokemon.c (3 arrays), anim_mon_front_pics.c, tmhm_learnsets.h, egg_moves.h (insert BEFORE EGG_MOVES_TERMINATOR inside array, NOT the #define), pokedex_orders.h (3 arrays), cry_ids.h (map species to base cry ID), evolution.h, enemy_mon_elevation.h (if floating). **Pitfall**: When anchor text (e.g., "Cry_Arcanine") appears in both vanilla and custom sections, `string.replace()` matches the FIRST occurrence. Use targeted replacement or search from end.

---

## Cross-Gen Evolution Pipeline (C212-218)

**Ad-hoc scripts per batch**: `scripts/add_froslass_mamoswine.cjs` (C213), `scripts/add_three_species_c218.cjs` (C218 — Vulpix_Hoenn/Ninetales_Hoenn/Farigiraf). Covers ~22-27 files per run.

**Files NOT covered by scripts** (need manual edits): `pokemon.c` (3 mapping arrays: species->hoenn, species->national, hoenn->national), `anim_mon_front_pics.c`, `enemy_mon_elevation.h` (floating species only), `evolution.h` (pre-evo must gain new evo path).

**egg_moves.h pitfall**: `EGG_MOVES_TERMINATOR` MUST separate species blocks. Missing it causes silent data corruption or build errors.

---

## EXP Award System & Challenge Mode Level Caps (C182)

**EXP function**: `Cmd_getexp()` in `src/battle_script_commands.c`. State machine with 6 cases.
**Level cap**: `GetChallengeLevelCap()` returns cap per badge count (18/20/24/30/34/38/42/48/55). Soft cap in case 2: if mon level >= cap, EXP /= 10. C207: when cap triggers, uses `STRINGID_PKMNGAINEDEXPCAPPED` (381) for a two-page message including "EXP reduced by the level cap."
**`IsChallengeModeActive()`**: Defined as a `#define` macro in `include/constants/flags.h`.
**BATTLESTRINGS_COUNT**: 382 (last ID: STRINGID_PKMNGAINEDEXPCAPPED = 381).
