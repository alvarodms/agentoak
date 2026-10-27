# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Species Registration System

27 files per species — all handled by `generate_species.cjs`. Check: `scripts/check_species_registration.sh`. 3 naming conventions: `SPECIES_X`, `NATIONAL_DEX_X`, PascalCase `gMon*_X`.

**Per-species file count**: 27 generator files + 6 manual entries (`pokemon.c`: Hoenn dex, National dex, Hoenn→National order, front anim ID; `pokemon_icon.c`: 2). ~33 total.

**Cry system**: Custom species MUST add cry_ids.h entry `[SPECIES_X - 277] = <base_cry_id>`. Without it, defaults to cry ID 0 (Growlithe).

---

## Trainer System

**Three-file system**: `opponents.h` (IDs), `trainers.h` (metadata + macro), `trainer_parties.h` (party struct). All three must match. Macro/struct mismatch = crash. Validation: `scripts/check_trainers.sh`.

**Capacity**: TRAINERS_COUNT = 891, 2 reclaimable IDs remaining (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853). Rematch table: 5 tiers, all filled. **Repurposed slots**: TRAINER_WALLACE(+REMATCH_1-4) = Steven (C308); TRAINER_JUAN_1-5 = Wallace (C309). Constant names were kept.

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

Story (0x00-0x2FF) → Trainer (0x500-0x873) → System (0x874+) → Daily (0x972+). Custom flags: 0x264-0x2B5. Next available: **0x2B6**. Mt. Pyre starlight Torchic hide flag: 0x2B5 (C312). Beast: 0x881-0x886. Difficulty: 0x286. Reckoning: 0x2AB-0x2B4.

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

## Small Systems

- **Multichoice**: `include/constants/script_menu.h` MULTI_* IDs. Last used 115, next 116.
- **Legendary battle**: `setwildbattle` -> `setflag` -> `special BattleSetup_StartLegendaryBattle` -> `waitstate` -> check `B_OUTCOME_CAUGHT`. Macros: `asm/macros/legend_macros.inc` (7 composable).
- **Challenge Mode scaling** (C210): `include/challenge_mode_scaling.h` — Leader +3, E4 +3, Champion +5, Rival +2, Aqua/Magma Leaders +2, Admins +1 (`sChallengeModeScaling[]`).
- **Event macros** (C179): `asm/macros/event_macros.inc` — `GlimpseEvent`, `BadgeGateShow`, `ConditionalDialogue`.
- **Static Encounter Recipe** (vanilla AquaHideout_B1F Electrode; used C312 MtPyre_Exterior): object_event with `flag: FLAG_HIDE_X` + script `lock` → `playmoncry`/`waitmoncry` → `setwildbattle SPECIES, LV, ITEM` → `setflag FLAG_SYS_CTRL_OBJ_DELETE` → `dowildbattle` → `clearflag FLAG_SYS_CTRL_OBJ_DELETE` → `specialvar VAR_RESULT, GetBattleOutcome`; WON/RAN/PLAYER_TELEPORTED → `goto Common_EventScript_RemoveStaticPokemon` (fades + removeobject; hides only until next map load unless you also set the flag), CAUGHT → `setflag FLAG_HIDE_X`. Map needs `MAP_SCRIPT_ON_RESUME` → `call_if_set FLAG_SYS_CTRL_OBJ_DELETE, TryRemove` (GetBattleOutcome == CAUGHT → `removeobject VAR_LAST_TALKED`) so the sprite is gone when the catch returns to the field. `setwildbattle` third arg = held item (default ITEM_NONE).
- **Overworld Pokémon stand-ins**: `OBJ_EVENT_GFX_*_DOLL` (e.g. OBJ_EVENT_GFX_TORCHIC_DOLL=155, event_objects.h) work as visible wild Pokémon. Single frame, so skip `faceplayer` and use MOVEMENT_TYPE_FACE_DOWN.
- **Weather Omens** (C149): badge-gated permanent weather on R111/119/120/125 (flags 0x282-0x285).

---

## Build Validation & Generators

`make check_all` = check_species + check_encounters + check_e4_rematches + check_evolution + check_trainers. `make check_all_quick` = check_scripts + check_species + check_trainers. **check_species**: the old cry_tables.inc false positive was removed C310 — `make check_all_quick` now passes cleanly (18/18). Running check targets regenerates `src/data/wild_encounters.h` from `wild_encounters.json`; the committed .h had drifted (R118 Growlithe_H, Shoal Cave Mudkip_H) — JSON is the source of truth, always commit the regenerated .h.

- **generate_species.cjs** `<config.json> [--dry-run] [--fill-missing]` (configs in `species_configs/`): 27 files. Standard mode aborts if species exists and auto-increments SPECIES_EGG (run order matters); `--fill-missing` (C293) only fills absent files. Does NOT write the 6 pokemon.c/pokemon_icon.c entries. species_names.h strips `_HOENN` unless `cfg.displayName`.
- **verify_species.sh** `<NAME>` — pass the name WITHOUT the `SPECIES_` prefix (`ARCANINE_HOENN`; passing `SPECIES_X` reports a bogus 14/27). Exit 0 iff 27/27.
- **generate_trainer.cjs** `<config.json> [--dry-run]` (configs in `trainer_configs/`): `create` (new ID in opponents.h) or `modify` (finds `partyName[]` by name, replaces the WHOLE array, so party size can change; rewrites the trainer's `.party = MACRO(name)` line). To repurpose a slot: rename the array in both trainer_parties.h and trainers.h first, then run modify. Name/pic/class are NOT touched; edit trainers.h by hand. Trainer-ID lookup is bracket-exact (`[TRAINER_SIDNEY]` does not match `_REMATCH_1`). Running modify on an unchanged macro leaves trainers.h byte-identical. `scripts/verify_species.sh` takes the bare name (`HONCHKROW`), NOT `SPECIES_HONCHKROW` (that reports 13/27 false missing).
- **generate_npc_dialogue.cjs**: create mode (JSON -> scripts.inc + map.json) or `--update --file <path> --label <LABEL> --text "text$"`. Charmap validation built in.

**Species count (C308)**: 40 custom species, all 27/27: 12 cross-gen evos + 25 _HOENN forms (9 Changed Three) + Carbink/Toxapex/Lucario line imports. AMBIPOM=448, CARBINK=449, TOXAPEX=450, EGG=451=NUM_SPECIES. **The Changed Three (439-447), Shroomish/Breloom_Hoenn and Carbink all HAVE tmhm_learnsets.h rows** (grep-verified C309; the old "no TM rows" note was wrong).

**Pokénav leader entries**: `MatchCallStructTrainer.name = NULL` means name and pic come from `gTrainers[gRematchTable[rematchTableIdx].trainerIds[0]]` (pokenav_match_call_list.c / pokenav_match_call_data.c). Renaming a trainer in trainers.h renames its Pokénav entry; only `.desc` (strings.c) and the flavor texts (match_call_messages.h) are separate.

---

## Custom Ability Implementation (C241, expanded C289, C300, C310, C311)

4+1 files: abilities.h (constant + ABILITIES_COUNT), global.h (ABILITY_NAME_LENGTH=14), text/abilities.h (string+name+pointer), battle_util.c OR battle_script_commands.c (effect), species_info.h (assign). 6 custom: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81), FEY_FLAME(82), UNDERTOW(83). ABILITIES_COUNT=84. Next: 84.

**Three implementation patterns**: Status-inflicting abilities (Toxic Touch, Frozen Spore, Scalding Touch) go in `battle_util.c` ABILITYEFFECT_ON_DAMAGE case. Crit-boosting abilities (Tempered Blade) go in `battle_script_commands.c` Cmd_critcalc. Damage multipliers (Fey Flame, Undertow) go in `pokemon.c` CalculateBaseDamage "apply abilities" block (scale gBattleMovePower; `attacker`/`defender` are struct BattlePokemon*, so `defender->status1` is readable). `battlerIdAtk`/`battlerIdDef` are also parameters, so per-battler arrays like gProtectStructs are indexable there.

**Switch-in ability announcement pattern (C310)**: add a case in `AbilityBattleEffects` → `ABILITYEFFECT_ON_SWITCHIN` → `switch (gLastUsedAbility)`: `BattleScriptPushCursorAndCallback(script); gBattleScripting.battler = battler; effect++; break;`. Script in battle_scripts_1.s = `pause B_WAIT_TIME_SHORT / printstring STRINGID_X / waitmessage B_WAIT_TIME_LONG / end3` (+ extern in battle_scripts.h). String uses `{B_SCR_ACTIVE_NAME_WITH_PREFIX}` (resolves from gBattleScripting.battler). New string IDs: append after the last ID in battle_string_ids.h, bump BATTLESTRINGS_COUNT, add to gBattleStringsTable (indexed `ID - BATTLESTRINGS_TABLE_START`). ON_SWITCHIN fires at battle start (battle_main.c counter loop) and on every Cmd_switchineffects, so no guard is needed unless you want once-per-battle. Next free STRINGID: 384 (C311 Undertow took 383).

**"Was hit this turn" flag (C311, used by Undertow)**: `gProtectStructs[battler].physicalDmg || gProtectStructs[battler].specialDmg` (include/battle.h, u32 HP amounts). Set in Cmd_datahpupdate (battle_script_commands.c ~1939) when a damaging move lands, skipped for `HITMARKER_PASSIVE_HP_UPDATE` and Pain Split; substitute hits return before this, so they do not count. TurnValuesCleanUp (battle_main.c ~4919) zeroes the whole ProtectStruct every turn, so it is reliable within one turn. Vanilla Revenge-style code reads the same flag (battle_script_commands.c ~9193). `gSpecialStatuses[].physicalDmg` is a per-move copy (TARGET_TURN_DAMAGED macro), not per-turn.

**Unproven**: custom stat-drop abilities via SetMoveEffect + HITMARKER_STATUS_ABILITY_EFFECT — the stat-change paths do not clear that flag, so they may leak; test before relying on it.

---

## EXP Award System & Challenge Mode Level Caps (C182)

`Cmd_getexp()` in battle_script_commands.c. `GetChallengeLevelCap()` returns per-badge cap (18/20/24/30/34/38/42/48/55); EXP /= 10 when over.

## Postgame NPC Show/Hide Pattern (C248-286)

**Pattern**: OnTransition checks `FLAG_SYS_GAME_CLEAR`, then `clearflag FLAG_HIDE_<NPC>`. Collection tracking via `FLAG_RECKONING_TALKED_*`. **Birch Lab payoff (C286)**: 6 flags -> ReckoningAcknowledge -> PP_MAX reward -> FLAG_RECKONING_COMPLETE.
**Trainer mon internals (C308)**: ability = slot 0 always (personality bit0 = 0); nature from trainer-name + species-name hash; Challenge mode adds per-class levels (include/challenge_mode_scaling.h, CHAMPION +5). Crit stages: battle_script_commands.c Cmd_critcalc (high-crit move, Scope Lens, Tempered Blade on Steel contact each +1). **VAR_STARTER_MON**: 0 Larvitar, 1 Bagon, 2 Dratini (src/starter_choose.c) — Changed Three are NOT starters (wild + Birch postgame gift).
