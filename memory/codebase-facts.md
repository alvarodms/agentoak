# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Species Registration System

27 files per species — all handled by `generate_species.cjs`. Check: `scripts/check_species_registration.sh`. 3 naming conventions: `SPECIES_X`, `NATIONAL_DEX_X`, PascalCase `gMon*_X`.

**Per-species file count**: Generator handles 27 files. Manual additions needed in `pokemon.c` (4 tables: Hoenn dex, National dex, Hoenn→National order, front anim ID) and `pokemon_icon.c` (2 entries). True total: ~33 files per species.

**Cry system**: Custom species MUST add cry_ids.h entry `[SPECIES_X - 277] = <base_cry_id>`. Without it, defaults to cry ID 0 (Growlithe).

---

## Trainer System

**Three-file system**: `opponents.h` (IDs), `trainers.h` (metadata + macro), `trainer_parties.h` (party struct). All three must match. Macro/struct mismatch = crash. Validation: `scripts/check_trainers.sh`.

**Capacity**: TRAINERS_COUNT = 891, 2 reclaimable IDs remaining (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853). Validation: `scripts/check_trainers.sh` (6 checks). Rematch table: 5 tiers, all filled.

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

## Physical/Special Split & Move System (Cycle 43-44, 75, 128, 293, 300)

**MOVES_COUNT** = 381 (IDs 0-380). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy: 355-357. Gen 4/5: 358-377. Custom signatures: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). Next move ID: 381.

**Iron Leaf** (C293, redesigned C300): Steel/Physical, 85bp, 100acc, 15pp, EFFECT_HIGH_CRITICAL. Sceptile_Hoenn signature. C300 changed from EFFECT_DEFENSE_DOWN_HIT to high-crit to synergize with Tempered Blade (stacks to crit stage 2 = 25%).

**TM/HM fields vs move constants**: The `tmhm_learnsets.h` struct fields correspond to TM/HM assignments, NOT to all moves. Custom Gen4/5 moves (ENERGY_BALL, NASTY_PLOT, etc.) are valid move constants but may NOT be TM fields unless assigned to a TM slot.

**Evolution methods**: Constants 1-17 in `include/constants/pokemon.h`. Custom: `EVO_LEVEL_FEMALE` (16), `EVO_ITEM_FEMALE` (17). Snorunt→Froslass uses `EVO_ITEM_FEMALE` with `ITEM_DAWN_STONE`.

**Dawn Stone item**: `ITEM_DAWN_STONE` = 99 (slot 0x063). Uses Moon Stone icon. Placed in Shoal Cave Ice Room (flag 0x468).

---

## Player Sprite Palette System (C228)

22 files (16 `.pal` + 6 PNG). Sea-glass teal recolor. Manifest: `memory/pokemon-knowledge/player-sprite-manifest.md`. Key: intro uses `player.pal` for both genders; underwater has separate palette tag.

---

## Roaming Pokemon System (Cycle 108-109)

Single roamer slot (`struct Roamer`, 28 bytes). Beast system: `roamer.c` `InitNextBeast()` sequentially releases Raikou->Entei->Suicune using 6 flags.

---

## Flag System Layout

Story (0x00-0x2FF) → Trainer (0x500-0x873) → System (0x874+) → Daily (0x972+). Custom flags: 0x264-0x2B4. Next available: **0x2B5**. Beast: 0x881-0x886. Difficulty: 0x286. Reckoning: 0x2AB-0x2B4.

**Shoal Cave tide architecture**: `ShoalCave_LowTideEntranceRoom` handles BOTH tides — `OnTransition` calls `UpdateShoalTideFlag` then swaps layout. Object events on `LowTideEntranceRoom` appear in both tides. Use `call` subroutine pattern for OnTransition logic.

---

## Repel System Architecture (C295, shipped C297)

**Script**: `data/scripts/repel.inc` — BW-style continuation prompt. Shows "REPEL's effect wore off", calls `Special_FindBestRepelInBag` to find best available (Max > Super > Repel), prompts "Would you like to use another {item}?", calls `Special_UseRepelFromBag` on yes.
**C helpers**: `src/field_specials.c` — `Special_FindBestRepelInBag()` sets `gSpecialVar_Result` to best item ID (or 0). `Special_UseRepelFromBag()` reads `gSpecialVar_0x8004`, calls `RemoveBagItem` + `VarSet(VAR_REPEL_STEP_COUNT, GetItemHoldEffectParam(...))`.
**Infrastructure**: `wild_encounter.c:883` calls `ScriptContext_SetupScript(EventScript_RepelWoreOff)`. `item_use.c:843` sets the var for manual use.

## Battle Animation System (C295, shipped C297)

**Main file**: `data/battle_anim_scripts.s` — `gBattleAnims_Moves` pointer table at top. 381 entries (0-380). `Move_COUNT` = generic fallback (basic hit + shake).
**Custom move animations (C297)**: Move_IRON_LEAF (Steel Wing metallic_shine + Leaf Blade slash), Move_SPORE_FIST (Ice Punch crystals + fist strike + IceCrystalEffectShort), Move_TIDAL_FLARE (Water Pulse bubbles + Ember fire particles). All use recomposed existing sprite templates — no new assets.
**Launcher**: `DoMoveAnim()` in `battle_anim.c:201` indexes into `gBattleAnims_Moves[move]`.
**Key macros**: `metallic_shine`, `create_leaf_blade_task`, `create_cross_impact_sprite`, `create_basic_hitsplat_sprite`, `simple_palette_blend`. All in `asm/macros/battle_anim_script.inc`.
**Shared subroutines**: `IceCrystalEffectShort` (ice hit particles), `FlamethrowerCreateFlames` (fire stream), `EmberFireHit` (fire flare).

---

## Multichoice System (Cycle 181)

`include/constants/script_menu.h` — `MULTI_*` IDs. Last used: 115. Next: 116.

---

## Legendary Battle Pattern

`setwildbattle` -> `setflag` -> `special BattleSetup_StartLegendaryBattle` -> `waitstate` -> check `B_OUTCOME_CAUGHT`. Used by all 5 shipped legendaries.

## Challenge Mode Level Scaling (C210)

**Header**: `include/challenge_mode_scaling.h`. Classes: Leader +3, E4 +3, Champion +5, Rival +2, Aqua/Magma Leaders +2, Admins +1. Extend by adding rows to `sChallengeModeScaling[]`.

## Legendary Encounter Macros (C185)

**File**: `asm/macros/legend_macros.inc`. 7 composable macros.

---

## Scripted Event Macro Library (C179)

**File**: `asm/macros/event_macros.inc`. 3 macros: `GlimpseEvent`, `BadgeGateShow`, `ConditionalDialogue`.

---

## Weather System (C149)

Weather Omens: badge-gated permanent weather on R111/119/120/125 (flags 0x282-0x285).

---

## Build Validation Targets

`make check_all` — Full: check_species + check_encounters + check_e4_rematches + check_evolution + check_trainers.
`make check_all_quick` — Fast: check_scripts + check_species + check_trainers (C290).
Individual: check_scripts, check_encounters, check_e4_rematches, check_species, check_evolution, check_trainers.

---

## Species Generator (C254->C293)

**Tool**: `scripts/generate_species.cjs` — JSON config -> **27-file** code generation. Usage: `node scripts/generate_species.cjs <config.json> [--dry-run] [--fill-missing]`. Config files in `species_configs/`.

**--fill-missing mode (C293)**: Populates only the files where the species is absent. Safe to re-run on partially-registered species without deleting constants first. Resolves the longstanding idempotency trap (C265-C292).

**KNOWN GAP**: Generator does NOT write `pokemon.c` (4 tables) or `pokemon_icon.c` (2 entries). These 6 entries must be added manually per species.

**Standard mode**: Exits if species exists in species.h (all-or-nothing). Auto-increments SPECIES_EGG. Sequential runs increment EGG, so order matters. species_names.h: auto-derives display name by stripping `_HOENN` suffix, or uses `cfg.displayName` override.

## Trainer Generator (C266)

`scripts/generate_trainer.cjs` — JSON config -> trainer_parties.h/trainers.h/opponents.h. Two modes: `create` / `modify`. Auto-detects party struct type. Configs in `trainer_configs/`.

## NPC Dialogue Generator (C275, C287)

`scripts/generate_npc_dialogue.cjs` — Create mode: JSON config -> scripts.inc + map.json. Update mode: `--update --file <path> --label <LABEL> --text "text$"`. Charmap validation built-in.

## Species Verification (C287)

`scripts/verify_species.sh <SPECIES_NAME>` — checks all 27 target files. Reports FOUND/MISSING. Exit 0 if 27/27, exit 1 otherwise. **Path**: `pokeemerald/scripts/verify_species.sh`.

---

**Species count (C305)**: **39 custom species — ALL 39 fully registered 27/27.** 12 cross-gen evos (Weavile, Honchkrow, Mismagius, Froslass, Togekiss, Mamoswine, Gliscor, Yanmega, Roserade, Tangrowth, Rhyperior, Ambipom) + 25 _HOENN forms (including 9 Changed Three starters) + 2 standalone imports (Riolu→Lucario line counted as 1 cross-gen conceptually, but Carbink has no pre-evo). EGG=450, NUM_SPECIES=450, SPECIES_AMBIPOM=448, SPECIES_CARBINK=449. No partial registrations remain.

---

## Custom Ability Implementation (C241, expanded C289, C300)

4+1 files: abilities.h (constant + ABILITIES_COUNT), global.h (ABILITY_NAME_LENGTH=14), text/abilities.h (string+name+pointer), battle_util.c OR battle_script_commands.c (effect), species_info.h (assign). 4 custom: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81). ABILITIES_COUNT=82. Next: 82.

**Two implementation patterns**: Status-inflicting abilities (Toxic Touch, Frozen Spore, Scalding Touch) go in `battle_util.c` ABILITYEFFECT_ON_DAMAGE case. Crit-boosting abilities (Tempered Blade) go in `battle_script_commands.c` Cmd_critcalc.

---

## EXP Award System & Challenge Mode Level Caps (C182)

`Cmd_getexp()` in battle_script_commands.c. `GetChallengeLevelCap()` returns per-badge cap (18/20/24/30/34/38/42/48/55); EXP /= 10 when over.

## Postgame NPC Show/Hide Pattern (C248-286)

**Pattern**: OnTransition checks `FLAG_SYS_GAME_CLEAR`, then `clearflag FLAG_HIDE_<NPC>`. Collection tracking via `FLAG_RECKONING_TALKED_*`. **Birch Lab payoff (C286)**: 6 flags -> ReckoningAcknowledge -> PP_MAX reward -> FLAG_RECKONING_COMPLETE.
