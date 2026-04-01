# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Elite Four Rematch System (Cycles 49-50)

**Rematch table**: `src/battle_setup.c` lines 260+ — `gRematchTable[]` uses `REMATCH(t1, t2, t3, t4, t5, map)` macro. Each entry holds 5 trainer IDs (base + 4 rematch tiers).

**Current state**: All 5 rematch slots filled — base, tier 1, tier 2, tier 3, tier 4. No more tiers available.

**Rematch enum**: `include/constants/rematches.h` — `REMATCH_SIDNEY`, `REMATCH_PHOEBE`, etc.

**Trainer ID ceiling**: `TRAINERS_COUNT`/`MAX_TRAINERS_COUNT` = 874 in `opponents.h`. Flag space 0x500-0x869. System flags shift automatically via `TRAINER_FLAGS_END` macro.

**Three-file trainer system**: Each trainer requires coordinated removal/addition across `opponents.h` (ID constants), `trainers.h` (metadata), and `trainer_parties.h` (party composition). All three must be updated together.

---

## Trainer Party Struct Types (Cycle 55)

Four party struct types in `include/data.h`, controlled by macros used in `trainers.h`:

| Struct | Macro in trainers.h | Fields |
|---|---|---|
| `TrainerMonNoItemDefaultMoves` | `NO_ITEM_DEFAULT_MOVES(party)` | iv, lvl, species |
| `TrainerMonNoItemCustomMoves` | `NO_ITEM_CUSTOM_MOVES(party)` | iv, lvl, species, moves[4] |
| `TrainerMonItemDefaultMoves` | `ITEM_DEFAULT_MOVES(party)` | iv, lvl, species, heldItem |
| `TrainerMonItemCustomMoves` | `ITEM_CUSTOM_MOVES(party)` | iv, lvl, species, heldItem, moves[4] |

**CRITICAL**: When changing a trainer's party struct type (e.g. adding held items), you must ALSO update the macro in `trainers.h` to match. Mismatch = crash or wrong data.

**Large files**: `trainers.h` is ~354KB (needs offset/limit reading). `trainer_parties.h` is ~116K tokens.

**Validation script**: `scripts/check_trainers.sh` (C118) — cross-references all three trainer files, reports mismatches. Run after any trainer changes.

**trainers.h parsing**: Entries are multi-line — `[TRAINER_NAME]` on one line, party macro on a subsequent line. Requires multi-line awk (not single-line grep) to extract trainer→party mappings.

---

## Options Menu System (Cycle 105)

**File**: `src/option_menu.c`. Each menu item needs: enum entry, YPOS macro, task data define (`tXxx`), text string, ProcessInput function, DrawChoices function, entries in sOptionMenuItemsNames, init load, save, and process input switch case.

**SaveBlock2 bitfield** (`include/global.h` line 519): 16-bit field stores optionsTextSpeed:3, optionsWindowFrameType:5, optionsSound:1, optionsBattleStyle:1, optionsBattleSceneOff:1, regionMapZoom:1, optionsBattleSpeed:1. 3 padding bits remain.

**Battle animation skip**: `src/battle_main.c` ~line 3101 checks optionsBattleSceneOff OR optionsBattleSpeed and sets `HITMARKER_NO_ANIMATIONS`.

---

## Wild Pokémon Held Item System (Cycle 31)

**Core**: `SetWildMonHeldItem()` in `src/pokemon.c`. Each species has `.itemCommon`/`.itemRare` in `gSpeciesInfo[]` (`src/data/pokemon/species_info.h`).

**Probabilities**: Normal: 50% common / 5% rare. With Compound Eyes: 60% common / 20% rare. If itemCommon == itemRare: 100%.

---

## Dialogue Editing System (Cycles 24-26)

**Files**: Map `scripts.inc` files. Text format: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars per display line. Smart quotes are valid (charmap B1/B2). ASCII double quote (0x22) is NOT in charmap and causes build errors.

**Safety**: `MSGBOX_NPC` labels are safe to rewrite. `MSGBOX_DEFAULT` labels may have story logic — check first.

**Postgame gating**: Use `checkflag FLAG_SYS_GAME_CLEAR` + `goto_if_set` to branch dialogue after Champion defeat.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist. VAR_0x800C+ are NOT defined.

**specialvar vs special**: `special` discards return value. `specialvar VAR_RESULT, FuncName` captures it.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5 slots. Fishing: 10 slots.

**Conditional encounter tables**: `GetCurrentMapWildMonHeaderId()` in `src/wild_encounter.c` (line 305). Altering Cave pattern: flag set + map match → `i++` to next JSON entry. **Ordering in JSON is critical** — alternate entry MUST follow base entry for that map.

---

## Trainer Battle System

**Party data**: `src/data/trainer_parties.h`. Struct: `TrainerMonItemCustomMoves` with `.species`, `.heldItem`, `.moves[]`.

**AI flags**: Elite trainers use `AI_FLAG_CHECK_BAD_MOVE | AI_FLAG_TRY_TO_FAINT | AI_FLAG_CHECK_VIABILITY`. Champion adds `AI_FLAG_SMART_SWITCHING`.

---

## Physical/Special Split & Move System (Cycle 43-44, 75, 128)

Moves use `.category = MOVE_CATEGORY_PHYSICAL` / `MOVE_CATEGORY_SPECIAL` / `MOVE_CATEGORY_STATUS` in `battle_moves.h`. Fairy type added as TYPE_FAIRY with full type chart.

**Current state (C129)**: MOVES_COUNT = 378 (IDs 0-377). Last vanilla move = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5 moves: MOVE_NIGHT_SLASH (358) through MOVE_ZEN_HEADBUTT (377).

**Recoil effects**: EFFECT_RECOIL = 1/4 (Take Down). EFFECT_DOUBLE_EDGE = 1/3 (Double-Edge).

**Species NOT in codebase**: Mismagius, Mamoswine, Weavile. Garchomp, Lucario, Riolu ARE present (added C60-70).

---

## Battle Frontier Architecture (Cycle 76)

**Frontier mon pool**: `gBattleFrontierMons[NUM_FRONTIER_MONS=882]` in `src/data/battle_frontier/battle_frontier_mons.h`. Our 6 new species added (indices 882-893, Cycle 77).

---

## Roaming Pokemon System (Cycle 108-109)

**Full technical reference**: `memory/pokemon-knowledge/roamer-implementation-patterns.md`

**Summary**: Single roamer slot (`struct Roamer`, 28 bytes at SaveBlock1 offset 0x31DC). Beast system: `roamer.c` has `InitNextBeast()` special that sequentially releases Raikou→Entei→Suicune using 6 flags.

---

## Flag System Layout (Cycle 117-118)

**File**: `include/constants/flags.h`

**Layout**: Story flags (0x00-0x2FF) → Trainer flags (0x500-0x869) → System flags (TRAINER_FLAGS_END+1 = 0x860+) → Daily flags (0x972+)

**v6.0 flags (C118)**: 12 flags at 0x264-0x26F — FLAG_PRIMAL_STIRRING_STARTED through FLAG_VISITED_PACIFIDLOG_CURRENTS.

**Existing legendary flags**: `FLAG_HIDE_SKY_PILLAR_TOP_RAYQUAZA_STILL` (0x50), `FLAG_KYOGRE_ESCAPED_SEAFLOOR_CAVERN`. Beast flags at system flags 0x881-0x886.

**Cave of Origin maps**: CaveOfOrigin_UnusedRubySapphireMap1/2/3 — unused RS maps available for repurposing.

---

## Sky Pillar System (Cycle 134)

**Maps**: 7 directories — SkyPillar_Outside, SkyPillar_Entrance, SkyPillar_1F through SkyPillar_5F, SkyPillar_Top.

**State var**: `VAR_SKY_PILLAR_STATE` controls progression gating across floors.

**Cracked floors**: 2F and 4F use `CaveHole_CheckFallDownHole` (MAP_SCRIPT_ON_FRAME_TABLE).

**SkyPillar_Top**: Rayquaza encounter uses `FLAG_HIDE_SKY_PILLAR_TOP_RAYQUAZA_STILL` (0x50).

**SkyPillar_Outside**: Checks `FLAG_SYS_WEATHER_CTRL` for weather gating.

**Legendary battle pattern** (TerraCave/SeafloorCavern reference): `setwildbattle` → `setflag FLAG_HIDE_*` → `special BattleSetup_StartLegendaryBattle` → `waitstate` → `specialvar VAR_RESULT, GetBattleOutcome` → branch on `B_OUTCOME_CAUGHT`.

**Pacifidlog NPCs**: House2 (FanClubYoungster), House4 (LittleGirl) — simple vanilla scripts, good candidates for elder/lore NPCs.

---

## Species-Addition Pipeline (Cycle 59)

**Full checklist**: `memory/pokemon-knowledge/species-addition-pipeline.md` (25 steps, ~27 source files + ~14 assets per 2-species family).

---

## ShakeCamera Special (C112)

`special ShakeCamera` requires 4 vars: `VAR_0x8004` (vertical), `VAR_0x8005` (horizontal), `VAR_0x8006` (num shakes), `VAR_0x8007` (delay). Must `waitstate` after.