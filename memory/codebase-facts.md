# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Species Registration System (C222, updated C262)

**19 files** per species. Check script: `scripts/check_species_registration.sh`. Gap-filler: `scripts/complete_species_registration.cjs`. Files use 3 naming conventions:
- `SPECIES_X` (species.h, species_info.h, pokemon_icon.c, pokemon.c, cry_ids.h, evolution.h, front_pic_anims.h, level_up_learnset_pointers.h, tmhm_learnsets.h)
- `NATIONAL_DEX_X` (pokedex.h, pokedex_entries.h, pokedex_orders.h)
- PascalCase `gMon*_X` (pokemon.h, graphics.h, anim_mon_front_pics.c, level_up_learnsets.h, pokedex_text.h, cry_tables.inc)

**Cry system**: `SpeciesToCryId()` in pokemon.c. Gen 1-2: cry ID = species - 1. Gen 3+: `gSpeciesIdToCryId[species - 276]`. Custom species MUST add cry_ids.h entries mapping `[SPECIES_X - 277] = <base_cry_id>`. Without entries, all custom species default to cry ID 0 (Growlithe). cry_tables.inc entries are for unique cries only; reuse species just need cry_ids.h.

---

## Trainer System

**Three-file system**: `opponents.h` (IDs), `trainers.h` (metadata + macro), `trainer_parties.h` (party struct). All three must match. Macro/struct mismatch = crash. Validation: `scripts/check_trainers.sh`.

**Validator checks (C247)**: 6 checks total. Check 1-4: ID/entry/party cross-references, party count consistency. **Check 5**: Field-level validation per struct type (TrainerMonNoItemDefaultMoves needs .iv/.lvl/.species; ItemCustomMoves adds .heldItem/.moves). **Check 6**: Species/move/item constant existence validation against include/constants/. Pre-existing bugs found: sParty_Sawyer1 and sParty_GruntAquaHideout1 are empty arrays (0 members).

**Capacity**: TRAINERS_COUNT = 885 (at cap). 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853. Note: #854 is NOT reclaimable (in rematch table). Rematch table: 5 tiers, all filled.

**Rival parties (C273)**: Brendan and May have MIRRORED party arrays — identical species, moves, items, levels per encounter. Only the starter-dependent slot differs (3 variants each: Mudkip/Treecko/Torchic). 4 encounters: Route 103, Route 110, Route 119, Lilycove = 24 total party arrays. Editing shared species slots matches 2 locations (Brendan+May); use `replace_all: true`.

---

## Dialogue Editing System (Cycles 24-26)

**Text format**: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars/line. Smart quotes valid (charmap B1/B2). ASCII `"` (0x22) NOT in charmap. Em-dashes NOT in charmap — use `--`. Ellipsis = B0 in charmap. **Only valid escapes**: `\n`, `\l`, `\p`, `$`. Any other `\X` (e.g. `\e`, `\t`) causes build error.

**Safety**: `MSGBOX_NPC` labels safe to rewrite. `MSGBOX_DEFAULT` may have story logic.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist. VAR_TEMP_* reset on map transition — coord_events using them as guards fire once per visit.

**Quest 7 flag space**: FLAG_QUEST_COSMIC_STARTED (0x2A3), FLAG_QUEST_COSMIC_COMPLETE (0x2A4), FLAG_QUEST_COSMIC_APPEARED (0x2A5). Next available: 0x2A6.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5. Fishing: 10.

**Conditional tables**: `GetCurrentMapWildMonHeaderId()` in `src/wild_encounter.c` (line 305). Alternate entry MUST follow base entry in JSON.

---

## Physical/Special Split & Move System (Cycle 43-44, 75, 128)

**MOVES_COUNT** = 378 (IDs 0-377). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5: 358-377.

**TM/HM fields vs move constants**: The `tmhm_learnsets.h` struct fields correspond to TM/HM assignments, NOT to all moves. Custom Gen4/5 moves (ENERGY_BALL, NASTY_PLOT, etc.) are valid move constants but may NOT be TM fields unless assigned to a TM slot. Verify before using in TM learnsets.

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

## Flag System Layout (Cycle 117-118, updated C248)

**Layout**: Story (0x00-0x2FF) -> Trainer (0x500-0x873) -> System (0x874+) -> Daily (0x972+)

**Custom flags**: 0x264-0x2A5 used (v6.0 through v2.2). 0x286 = `FLAG_DIFFICULTY_CHALLENGE` (C181). 0x298-0x29A = Deoxys quest. 0x29B = Bagon Colony. 0x29C-0x29F = Resonance quest. 0x2A0 = Changed Trainer Nurse. 0x2A1-0x2A2 = Resonance Residue. 0x2A3-0x2A5 = Quest III Cosmic. 0x2A6 = Lilycove postgame grunt (C249). Next available: 0x2A7.

**Repurposed vanilla flags**: 0x2C = `FLAG_HIDE_MT_CHIMNEY_POSTGAME_MAGMA_GRUNT` (C248, was FLAG_UNUSED_0x02C).

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

## Build Validation Targets (C141, C170, C206, C220, C222, C225, C247)

`make check_scripts` — Lints .inc files for non-charmap characters.
`make check_encounters` — Node.js validator for `wild_encounters.json`.
`make check_e4_rematches` — Bash validator for E4 rematch parties (duplicates, level progression, regional form presence).
`make check_species` — Runs `scripts/check_species_registration.sh` on all custom species. Checks 19 required files per species. Exit 0 only if ALL pass.
`make check_evolution` — Bash validator for evolution.h: source/target species, method validity, duplicates, gender-gated evos, branching uniqueness.
`make check_trainers` — Bash validator (6 checks): cross-references IDs/entries/parties, party count, field-level struct validation, constant existence.
`make check_all` — Runs check_species + check_encounters + check_e4_rematches + check_evolution + check_trainers.

**ScriptCheckPokedexSeen** (C225): `setvar VAR_0x8004, SPECIES_X` → `specialvar VAR_RESULT, ScriptCheckPokedexSeen` → returns 1/0.

---

## Species Generator (C254, updated C260, C262)

**Tool**: `scripts/generate_species.cjs` — JSON config → 26-file code generation. Usage: `node scripts/generate_species.cjs <config.json> [--dry-run]`. Config files in `species_configs/`. Handles all 19 check_species files + 8 graphics table files. Cry_tables.inc excluded (cry_ids.h handles base cry mapping). Idempotency: exits cleanly if species already exists in species.h — **WARNING (C270)**: this is an all-or-nothing check. If the constant exists but species_info.h entry is missing (e.g., generator failed partway), re-running won't fix it. Always verify `grep -c "SPECIES_X" species_info.h` after running. Auto-increments SPECIES_EGG and NATIONAL_DEX_COUNT. **Does NOT update** `src/data/text/species_names.h` — requires manual edits after running the generator.

**Graphics table files (added C260)**: front_pic_table.h, back_pic_table.h, front_pic_coordinates.h, back_pic_coordinates.h, palette_table.h, shiny_palette_table.h, footprint_table.h, still_front_pic_table.h. All use EGG entries as anchor (insertBefore). Coordinate entries require `graphics.frontPicSize`, `graphics.frontPicYOffset`, `graphics.backPicSize`, `graphics.backPicYOffset` in species config JSON.

**Legacy pipeline**: `scripts/add_regional_form.cjs` — 27-file scope but **WARNING (C215-216)**: catastrophically broken. Superseded by generate_species.cjs for the 19-file scope.

## Trainer Generator (C266)

**Tool**: `scripts/generate_trainer.cjs` — JSON config → synchronized trainer_parties.h/trainers.h/opponents.h. Usage: `node scripts/generate_trainer.cjs <config.json> [--dry-run]`. Config files in `trainer_configs/`.

**Two modes**: `create` (new trainer: inserts define before TRAINERS_COUNT, appends party, inserts gTrainers[] entry) and `modify` (existing trainer: replaces party block, updates .party macro if type changed).

**Party type auto-detection**: Scans party members for `heldItem`/`moves` fields → selects correct struct/macro from 4 types (NoItemDefaultMoves, NoItemCustomMoves, ItemDefaultMoves, ItemCustomMoves). Missing fields auto-filled with ITEM_NONE/MOVE_NONE to prevent check_trainers.sh Check 5 failures.

**Idempotency**: In create mode, exits cleanly if trainerId already exists in opponents.h. **Atomic writes**: all file manipulations computed first; only written if all succeed.

## NPC Dialogue Generator (C275)

**Tool**: `scripts/generate_npc_dialogue.cjs` — JSON config → scripts.inc + map.json atomic writes. Usage: `node scripts/generate_npc_dialogue.cjs <config.json> [--dry-run] [--validate]`. Config files in `scripts/configs/`.

**Config format**: `{"npcs": [{map, label, graphicsId, x, y, scriptType, dialogue, ...}]}`. Single-NPC shorthand: top-level object with `map` + `label` auto-wraps. `scriptType`: `MSGBOX_NPC` (simple) or `MSGBOX_DEFAULT` (lock/faceplayer/release). Optional: `elevation` (default 3), `movementType` (default FACE_DOWN), `movementRangeX/Y` (default 0), `flag` (default "0").

**Charmap validation**: Rejects invalid escapes (only `\n`, `\l`, `\p` allowed), em-dash, en-dash, smart quotes, ASCII `"`. Warns on lines >35 chars. Checks `$` terminator.

**Idempotency**: Skips NPC if `{MapName}_EventScript_{Label}::` already exists in scripts.inc or object_events.

**Output**: Appends EventScript block + Text label to scripts.inc. Appends object_event to map.json.

---

**Species registration checklist (27 files)**: species.h, pokedex.h (national+hoenn+counts), species_info.h, graphics/pokemon.h (6 INCBINs), graphics.h (7 externs — MUST include gMonFrontPic_*), front/back_pic_coordinates.h, front/back_pic_table.h, palette/shiny_palette_table.h, still_front_pic_table.h, footprint_table.h, pokemon_icon.c (icon+palette), front_pic_anims.h (3 locations), pokedex_text.h, pokedex_entries.h, level_up_learnsets.h, level_up_learnset_pointers.h, pokemon.c (3 arrays), anim_mon_front_pics.c, tmhm_learnsets.h, egg_moves.h (insert BEFORE EGG_MOVES_TERMINATOR inside array, NOT the #define), pokedex_orders.h (3 arrays), cry_ids.h (map species to base cry ID), evolution.h, enemy_mon_elevation.h (if floating). **+1 manual file**: species_names.h (not covered by generator). **Pitfall**: When anchor text (e.g., "Cry_Arcanine") appears in both vanilla and custom sections, `string.replace()` matches the FIRST occurrence. Use targeted replacement or search from end.

---

## Cross-Gen Evolution Pipeline (C212-218)

Ad-hoc scripts per batch (C213, C218) cover ~22-27 files. Manual edits still needed: `pokemon.c` (3 mapping arrays), `anim_mon_front_pics.c`, `enemy_mon_elevation.h` (floating only), `evolution.h`. **Pitfall**: `egg_moves.h` MUST have `EGG_MOVES_TERMINATOR` between species blocks.

---

## Custom Ability Implementation Pattern (C241)

**4 files minimum**: (1) `include/constants/abilities.h` — constant + bump ABILITIES_COUNT. (2) `src/data/text/abilities.h` — 3 additions: description string, gAbilityNames entry, gAbilityDescriptionPointers entry. (3) `src/battle_util.c` — battle effect logic. (4) `src/data/pokemon/species_info.h` — assign to species.

**Battle hook for attacker-triggered abilities**: Add logic AFTER the inner `switch (gLastUsedAbility)` in the `ABILITYEFFECT_ON_DAMAGE` case. Check `gBattleMons[gBattlerAttacker].ability` directly (not gLastUsedAbility, which is the target's ability). Set `gLastUsedAbility` to the custom ability for battle script display. Call `RecordAbilityBattle(gBattlerAttacker, ...)` explicitly since the default recording uses `battler` (= target). Use `BattleScript_ApplySecondaryEffect` with `MOVE_EFFECT_POISON` (no `MOVE_EFFECT_AFFECTS_USER` — that flag applies to the ATTACKER, not the target).

---

## EXP Award System & Challenge Mode Level Caps (C182)

`Cmd_getexp()` in battle_script_commands.c. `GetChallengeLevelCap()` returns per-badge cap (18/20/24/30/34/38/42/48/55); EXP /= 10 when over. `IsChallengeModeActive()` macro in flags.h. BATTLESTRINGS_COUNT = 382.
