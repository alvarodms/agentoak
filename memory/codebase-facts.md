# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Species Registration System

27 files per species — all handled by `generate_species.cjs`. Check: `scripts/check_species_registration.sh`. 3 naming conventions: `SPECIES_X`, `NATIONAL_DEX_X`, PascalCase `gMon*_X`.

**Cry system**: Custom species MUST add cry_ids.h entry `[SPECIES_X - 277] = <base_cry_id>`. Without it, defaults to cry ID 0 (Growlithe).

---

## Trainer System

**Three-file system**: `opponents.h` (IDs), `trainers.h` (metadata + macro), `trainer_parties.h` (party struct). All three must match. Macro/struct mismatch = crash. Validation: `scripts/check_trainers.sh`.

**Capacity**: TRAINERS_COUNT = 891, 2 reclaimable IDs remaining (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853). C192 audit found 12; most consumed since. Validation: `scripts/check_trainers.sh` (6 checks). Rematch table: 5 tiers, all filled.

**Rival parties**: 30 arrays (5 encounters × 3 starter variants × 2 genders, mirrored). Postgame (C280): Lv70-73, 6 mons, IV 200, ace = Changed Three form.

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

**MOVES_COUNT** = 380 (IDs 0-379). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy: 355-357. Gen 4/5: 358-377. Custom signatures: SPORE_FIST(378), TIDAL_FLARE(379).

**TM/HM fields vs move constants**: The `tmhm_learnsets.h` struct fields correspond to TM/HM assignments, NOT to all moves. Custom Gen4/5 moves (ENERGY_BALL, NASTY_PLOT, etc.) are valid move constants but may NOT be TM fields unless assigned to a TM slot. Verify before using in TM learnsets.

**Evolution methods**: Constants 1-17 in `include/constants/pokemon.h`. Custom additions: `EVO_LEVEL_FEMALE` (16) — level-up gated by female gender; `EVO_ITEM_FEMALE` (17) — item-use gated by female gender (C229). Both use `GetGenderFromSpeciesAndPersonality()` in `GetEvolutionTargetSpecies()`. Snorunt→Froslass uses `EVO_ITEM_FEMALE` with `ITEM_DAWN_STONE`.

**Dawn Stone item**: `ITEM_DAWN_STONE` = 99 (slot 0x063). Uses Moon Stone icon. Item effect: `gItemEffect_DawnStone` with `ITEM4_EVO_STONE`. Placed in Shoal Cave Ice Room (flag 0x468).

---

## Player Sprite Palette System (C228)

22 files (16 `.pal` + 6 PNG). Sea-glass teal recolor. Manifest: `memory/pokemon-knowledge/player-sprite-manifest.md`. Key: intro uses `player.pal` for both genders; underwater has separate palette tag.

---

## Roaming Pokemon System (Cycle 108-109)

Single roamer slot (`struct Roamer`, 28 bytes). Beast system: `roamer.c` `InitNextBeast()` sequentially releases Raikou->Entei->Suicune using 6 flags. Full ref: `memory/pokemon-knowledge/roamer-implementation-patterns.md`.

---

## Flag System Layout

Story (0x00-0x2FF) → Trainer (0x500-0x873) → System (0x874+) → Daily (0x972+). Custom flags: 0x264-0x2B4. Next available: **0x2B5**. Beast: 0x881-0x886. Difficulty: 0x286. Reckoning tracking: 0x2AB-0x2AD (MT_CHIMNEY/LAVARIDGE/METEOR_FALLS), 0x2B1-0x2B3 (SLATEPORT/ROUTE128/SHOAL_CAVE). Reckoning completion: 0x2B4 (FLAG_RECKONING_COMPLETE).

**Shoal Cave tide architecture**: `ShoalCave_LowTideEntranceRoom` handles BOTH tides — `OnTransition` calls `UpdateShoalTideFlag` then swaps layout via `setmaplayoutindex`. `ShoalCave_HighTideEntranceRoom` is vestigial (no events/warps/scripts). Object events placed on `LowTideEntranceRoom` appear in both tides. Use `call` subroutine pattern (not `goto`) when adding OnTransition logic to preserve the tide layout swap chain.

---

## Multichoice System (Cycle 181)

`include/constants/script_menu.h` — `MULTI_*` IDs. Last used: 115. Next: 116.

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

## Weather System (C149)

Weather Omens: badge-gated permanent weather on R111/119/120/125 (flags 0x282-0x285). Pattern: flag-gated `setweather` in `OnTransition` without `doweather`.

---

## Build Validation Targets

`make check_all` — Full: check_species + check_encounters + check_e4_rematches + check_evolution + check_trainers.
`make check_all_quick` — Fast: check_scripts + check_species + check_trainers (C290).
Individual: check_scripts, check_encounters, check_e4_rematches, check_species, check_evolution, check_trainers.

**ScriptCheckPokedexSeen** (C225): `setvar VAR_0x8004, SPECIES_X` → `specialvar VAR_RESULT, ScriptCheckPokedexSeen` → returns 1/0.

---

## Species Generator (C254→C281)

**Tool**: `scripts/generate_species.cjs` — JSON config → **27-file** code generation. Usage: `node scripts/generate_species.cjs <config.json> [--dry-run]`. Config files in `species_configs/`. Handles all 19 check_species files + 8 graphics tables + species_names.h. Cry_tables.inc excluded (cry_ids.h handles mapping). Idempotency: exits if species exists in species.h — **WARNING (C270)**: all-or-nothing check. If constant exists but species_info.h is missing, re-running won't fix; delete species.h constant first. Auto-increments SPECIES_EGG. Sequential runs increment EGG, so order matters. species_names.h: auto-derives display name by stripping `_HOENN` suffix, or uses `cfg.displayName` override.

## Trainer Generator (C266)

`scripts/generate_trainer.cjs` — JSON config → trainer_parties.h/trainers.h/opponents.h. Two modes: `create` / `modify`. Auto-detects party struct type from fields. Idempotent (exits if trainer exists). Configs in `trainer_configs/`.

## NPC Dialogue Generator (C275, C287)

`scripts/generate_npc_dialogue.cjs` — Two modes: (1) **Create**: JSON config → scripts.inc + map.json atomic writes. Idempotent. (2) **Update** (C287): `--update --file <path> --label <LABEL> --text "text$"` — in-place dialogue replacement. Finds Text_ label in scripts.inc, replaces .string content. `--dry-run` supported. Charmap validation built-in for both modes.

## Species Verification (C287)

`scripts/verify_species.sh <SPECIES_NAME>` — checks all 27 generate_species.cjs target files for both UPPER_CASE and PascalCase references. Reports FOUND/MISSING per file. Exit 0 if 27/27, exit 1 otherwise. Use after every generator run. **Path**: `pokeemerald/scripts/verify_species.sh` (NOT project root).

---

**Species registration**: All 27 files handled by `generate_species.cjs` since C281 — no manual steps. Only `enemy_mon_elevation.h` (floating species) needs manual addition. **Pitfall**: anchor text appearing in both vanilla and custom sections — `string.replace()` matches FIRST occurrence.

**Changed Three status (C289)**: All 9 starters need full registration. Treecko/Torchic lines: 2/27 (species.h + species_names.h only). Mudkip line: 1/27 (species_info removed C289). Total: **36 custom** (16 fully registered). EGG=448, NUM_SPECIES=448.

---

## Custom Ability Implementation (C241, expanded C289)

4+1 files: abilities.h (constant + ABILITIES_COUNT), global.h (ABILITY_NAME_LENGTH — expanded to 14 in C289), abilities data (src/data/text/abilities.h: string + name + pointer), battle_util.c (battle logic), species_info.h (assign). Attacker-triggered: check `gBattleMons[gBattlerAttacker].ability` in `ABILITYEFFECT_ON_DAMAGE` case, set `gLastUsedAbility` for display, `RecordAbilityBattle(gBattlerAttacker, ...)`. Contact-only abilities add `(gBattleMoves[move].flags & FLAG_MAKES_CONTACT)` guard. 3 custom abilities: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80). ABILITIES_COUNT=81.

---

## EXP Award System & Challenge Mode Level Caps (C182)

`Cmd_getexp()` in battle_script_commands.c. `GetChallengeLevelCap()` returns per-badge cap (18/20/24/30/34/38/42/48/55); EXP /= 10 when over. `IsChallengeModeActive()` macro in flags.h. BATTLESTRINGS_COUNT = 382.

## Postgame NPC Show/Hide Pattern (C248-286)

**Pattern**: OnTransition script checks `FLAG_SYS_GAME_CLEAR`, then `clearflag FLAG_HIDE_<LOCATION>_POSTGAME_<NPC>` to make NPC visible. Object event references the HIDE flag. Collection tracking via separate `FLAG_RECKONING_TALKED_*` flags set in the NPC script. First-visit/revisit branching via `goto_if_set FLAG_RECKONING_TALKED_*`. **Birch Lab payoff (C286)**: BirchQuestCheck checks all 6 flags → ReckoningAcknowledge script → PP_MAX reward → sets FLAG_RECKONING_COMPLETE.
