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

**MOVES_COUNT** = 378 (IDs 0-377). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5: 358-377.

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

Story (0x00-0x2FF) → Trainer (0x500-0x873) → System (0x874+) → Daily (0x972+). Custom flags: 0x264-0x2AD. Next available: **0x2AE**. Beast: 0x881-0x886. Difficulty: 0x286. Reckoning tracking: 0x2AB-0x2AD (MT_CHIMNEY/LAVARIDGE/METEOR_FALLS).

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

## Species Generator (C254→C281)

**Tool**: `scripts/generate_species.cjs` — JSON config → **27-file** code generation. Usage: `node scripts/generate_species.cjs <config.json> [--dry-run]`. Config files in `species_configs/`. Handles all 19 check_species files + 8 graphics tables + species_names.h. Cry_tables.inc excluded (cry_ids.h handles mapping). Idempotency: exits if species exists in species.h — **WARNING (C270)**: all-or-nothing check. If constant exists but species_info.h is missing, re-running won't fix; delete species.h constant first. Auto-increments SPECIES_EGG. Sequential runs increment EGG, so order matters. species_names.h: auto-derives display name by stripping `_HOENN` suffix, or uses `cfg.displayName` override.

## Trainer Generator (C266)

`scripts/generate_trainer.cjs` — JSON config → trainer_parties.h/trainers.h/opponents.h. Two modes: `create` / `modify`. Auto-detects party struct type from fields. Idempotent (exits if trainer exists). Configs in `trainer_configs/`.

## NPC Dialogue Generator (C275)

`scripts/generate_npc_dialogue.cjs` — JSON config → scripts.inc + map.json atomic writes. Charmap validation built-in. Idempotent (skips if label exists). Configs in `scripts/configs/`.

---

**Species registration**: All 27 files handled by `generate_species.cjs` since C281 — no manual steps. Only `enemy_mon_elevation.h` (floating species) needs manual addition. **Pitfall**: anchor text appearing in both vanilla and custom sections — `string.replace()` matches FIRST occurrence.

---

## Cross-Gen Evolution Pipeline (C212-218)

Superseded by `generate_species.cjs` for individual species. **Pitfall**: `egg_moves.h` MUST have `EGG_MOVES_TERMINATOR` between species blocks.

---

## Custom Ability Implementation (C241)

4 files: abilities.h (constant + ABILITIES_COUNT), abilities data (src/data/text/abilities.h: string + name + pointer), battle_util.c (battle logic), species_info.h (assign). Attacker-triggered: check `gBattleMons[gBattlerAttacker].ability` in `ABILITYEFFECT_ON_DAMAGE` case, set `gLastUsedAbility` for display, `RecordAbilityBattle(gBattlerAttacker, ...)`.

---

## EXP Award System & Challenge Mode Level Caps (C182)

`Cmd_getexp()` in battle_script_commands.c. `GetChallengeLevelCap()` returns per-badge cap (18/20/24/30/34/38/42/48/55); EXP /= 10 when over. `IsChallengeModeActive()` macro in flags.h. BATTLESTRINGS_COUNT = 382.

## Postgame NPC Show/Hide Pattern (C248-284)

**Pattern**: OnTransition script checks `FLAG_SYS_GAME_CLEAR`, then `clearflag FLAG_HIDE_<LOCATION>_POSTGAME_<NPC>` to make NPC visible. Object event references the HIDE flag. Collection tracking via separate `FLAG_RECKONING_TALKED_*` flags set in the NPC script. First-visit/revisit branching via `goto_if_set FLAG_RECKONING_TALKED_*`.
