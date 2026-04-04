# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Elite Four Rematch System (Cycles 49-50)

**Rematch table**: `src/battle_setup.c` lines 260+ — `gRematchTable[]` uses `REMATCH(t1, t2, t3, t4, t5, map)` macro. Each entry holds 5 trainer IDs (base + 4 rematch tiers).

**Current state**: All 5 rematch slots filled — base, tier 1, tier 2, tier 3, tier 4. No more tiers available.

**Rematch enum**: `include/constants/rematches.h` — `REMATCH_SIDNEY`, `REMATCH_PHOEBE`, etc.

**Trainer ID ceiling**: `TRAINERS_COUNT` = 885 in `opponents.h` (IDs 0-884, verified C148). Flag space 0x500-0x873. System flags shift automatically via `TRAINER_FLAGS_END` macro.

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

**Trainer class/pic defines**: Both `TRAINER_CLASS_*` and `TRAINER_PIC_*` are in `include/constants/trainers.h` (NOT a separate file). Dragon Tamer = class 48, pic 62.

**Validation script**: `scripts/check_trainers.sh` (C118) — cross-references all three trainer files, reports mismatches. Run after any trainer changes.

---

## TM Consumption & Indoor Running (Cycle 151 research)

**TM consumption path**: `ItemUseCB_TMHM` (party_menu.c:4733) → `GiveMoveToMon` → `Task_LearnedMove` (4769) → `Task_LearnNextMoveOrClosePartyMenu` (4796) which calls `RemoveBagItem(gSpecialVar_ItemId, 1)` at ~4980. This single `RemoveBagItem` call is what makes TMs consumable. HMs skip this path.

**Indoor running**: `IsRunningDisallowed` in `bike.c:1056` checks `gMapHeader.allowRunning`. Each map's JSON has `allow_running` boolean. Setting it to `true` on indoor maps enables running. Alternatively, modify `IsRunningDisallowed` to always return `FALSE` for a global fix.

---

## Options Menu System (Cycle 105)

**File**: `src/option_menu.c`. Each menu item needs: enum entry, YPOS macro, task data define (`tXxx`), text string, ProcessInput function, DrawChoices function, entries in sOptionMenuItemsNames, init load, save, and process input switch case.

**SaveBlock2 bitfield** (`include/global.h` line 519): 16-bit field stores optionsTextSpeed:3, optionsWindowFrameType:5, optionsSound:1, optionsBattleStyle:1, optionsBattleSceneOff:1, regionMapZoom:1, optionsBattleSpeed:1. 3 padding bits remain.

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

## Physical/Special Split & Move System (Cycle 43-44, 75, 128)

Moves use `.category = MOVE_CATEGORY_PHYSICAL` / `MOVE_CATEGORY_SPECIAL` / `MOVE_CATEGORY_STATUS` in `battle_moves.h`. Fairy type added as TYPE_FAIRY with full type chart.

**Current state (C129)**: MOVES_COUNT = 378 (IDs 0-377). Last vanilla move = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5 moves: MOVE_NIGHT_SLASH (358) through MOVE_ZEN_HEADBUTT (377).

**Species NOT in codebase**: Mismagius, Mamoswine, Weavile. Garchomp, Lucario, Riolu ARE present (added C60-70).

---

## Roaming Pokemon System (Cycle 108-109)

**Full technical reference**: `memory/pokemon-knowledge/roamer-implementation-patterns.md`

**Summary**: Single roamer slot (`struct Roamer`, 28 bytes at SaveBlock1 offset 0x31DC). Beast system: `roamer.c` has `InitNextBeast()` special that sequentially releases Raikou→Entei→Suicune using 6 flags.

---

## Flag System Layout (Cycle 117-118)

**File**: `include/constants/flags.h`

**Layout**: Story flags (0x00-0x2FF) → Trainer flags (0x500-0x873) → System flags (TRAINER_FLAGS_END+1 = 0x874+) → Daily flags (0x972+)

**v6.0 flags (C118)**: 14 flags at 0x264-0x271 — FLAG_PRIMAL_STIRRING_STARTED through FLAG_SEAFLOOR_CAVERN_INVESTIGATED.

**v7.0 flags (C135-136)**: 5 quest flags at 0x272-0x277 — FLAG_SKY_GUARDIAN_QUEST_ACTIVE through FLAG_HIDE_SKY_PILLAR_DRACONID.

**v8.0 flags (C144-145)**: FLAG_MIGRATION_GLIMPSE_ROUTE101 (0x278) through FLAG_MIGRATION_GLIMPSE_ROUTE116 (0x27B) — one-shot coord_event triggers.

**v1.1 flags (C149)**: FLAG_HIDE_ROUTE119_HARTLEY (0x27C), FLAG_ROUTE119_MIGRATION_SIGHTING (0x27D) — Dr. Hartley thunderstorm event.

**v1.2 flags (C152)**: FLAG_PETALBURG_WOODS_SIGHTING (0x27E), FLAG_HIDE_PETALBURG_WOODS_PIKACHU (0x27F) — Pikachu sighting event.

**v1.2 flags (C153)**: FLAG_METEOR_FALLS_COLONY_EVENT (0x280) — Bagon colony one-shot. Next available: 0x281.

**Existing legendary flags**: `FLAG_HIDE_SKY_PILLAR_TOP_RAYQUAZA_STILL` (0x50), `FLAG_KYOGRE_ESCAPED_SEAFLOOR_CAVERN`. Beast flags at system flags 0x881-0x886.

---

## Sky Pillar System (Cycle 134-136)

**Maps**: 7 directories — SkyPillar_Outside, SkyPillar_Entrance, SkyPillar_1F through SkyPillar_5F, SkyPillar_Top.

**State var**: `VAR_SKY_PILLAR_STATE` controls progression gating across floors.

**Cracked floors**: 2F and 4F use `CaveHole_CheckFallDownHole` (MAP_SCRIPT_ON_FRAME_TABLE).

**SkyPillar_Top**: Rayquaza encounter uses `FLAG_HIDE_SKY_PILLAR_TOP_RAYQUAZA_STILL` (0x50).

**SkyPillar_Outside**: Checks `FLAG_SYS_WEATHER_CTRL` for weather gating. v7.0: Wallace reappears for guardian quest via `FLAG_HIDE_SKY_PILLAR_WALLACE` clear/set. Door opened via `OnLoad` check on `FLAG_SKY_GUARDIAN_ACT1_COMPLETE`.

**C136 additions**: Encounter tables redesigned for 1F/3F/5F. Ancient mural bg_events on each floor. Draconid trainer Kaelen on 3F.

**Legendary battle pattern**: `setwildbattle` → `setflag FLAG_HIDE_*` → `special BattleSetup_StartLegendaryBattle` → `waitstate` → `specialvar VAR_RESULT, GetBattleOutcome` → branch on `B_OUTCOME_CAUGHT`.

---

## Species-Addition Pipeline (Cycle 59)

**Full checklist**: `memory/pokemon-knowledge/species-addition-pipeline.md` (25 steps, ~27 source files + ~14 assets per 2-species family).

---

## Coord Events / Walk-Over Triggers (C144)

**map.json**: Add `coord_events` entries with `x`, `y`, `elevation`, `type: "1"`, `script` label. These fire when the player walks onto the tile.

**Pattern**: Use a one-shot flag (`setflag` at end of script) + `goto_if_set` at start to make them fire once. Gate with `checkflag FLAG_ADVENTURE_STARTED` (or similar) to avoid firing before the player is ready.

**Movement scripts**: `data/scripts/movement.inc` has `Common_Movement_ExclamationMark` and `Common_Movement_QuestionMark`.

---

## Route 119 Weather System (C149)

**Weather cycling**: `WEATHER_ROUTE119_CYCLE` (constant 20) managed by `SetRoute119Weather()` in `src/field_specials.c`. Alternates between rain types based on map transition.

**Script weather control**: `setweather WEATHER_RAIN_THUNDERSTORM` + `doweather` to trigger thunderstorm in scripts. `resetweather` + `doweather` to restore cycling weather.

**LOCALIDs**: Route 119 NPC local_ids are string literals in map.json (e.g. `"LOCALID_ROUTE119_RIVAL"`), not header defines.

---

## Overworld Pokemon Sprites (C152-C153)

**OBJ_EVENT_GFX_PIKACHU** = 209 (include/constants/event_objects.h). Available for use in map object events. PIKACHU_DOLL (470) is a separate decoration sprite — do not confuse.

**Limited sprite set**: Only ~40 Pokémon have OW sprites in vanilla pokeemerald. Most migration species (Bagon, Dratini, Larvitar, Vulpix, etc.) do NOT have OW sprites. For events featuring species without sprites, use sound design (playmoncry) + NPC narration instead of placing OW sprite objects.

---

## Script Lint Target (C141)

`make check_scripts` — Makefile target that greps all script .inc files for non-charmap characters. Returns exit 0 if clean, exit 1 with file:line listing if violations found.