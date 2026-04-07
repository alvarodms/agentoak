# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Elite Four Rematch System (Cycles 49-50)

**Rematch table**: `src/battle_setup.c` lines 260+ — `gRematchTable[]` uses `REMATCH(t1, t2, t3, t4, t5, map)` macro. Each entry holds 5 trainer IDs (base + 4 rematch tiers).

**Current state**: All 5 rematch slots filled — base, tier 1, tier 2, tier 3, tier 4. No more tiers available.

**Trainer ID ceiling**: `TRAINERS_COUNT` = 885 in `opponents.h` (IDs 0-884). Flag space 0x500-0x873.

**Three-file trainer system**: Each trainer requires coordinated changes across `opponents.h` (IDs), `trainers.h` (metadata), and `trainer_parties.h` (party). All three must be updated together.

---

## Trainer Party Struct Types (Cycle 55, updated C171)

Four party struct types in `include/data.h`, controlled by macros in `trainers.h`:

| Struct | Macro | Fields |
|---|---|---|
| `TrainerMonNoItemDefaultMoves` | `NO_ITEM_DEFAULT_MOVES(party)` | iv, lvl, species |
| `TrainerMonNoItemCustomMoves` | `NO_ITEM_CUSTOM_MOVES(party)` | iv, lvl, species, moves[4] |
| `TrainerMonItemDefaultMoves` | `ITEM_DEFAULT_MOVES(party)` | iv, lvl, species, heldItem |
| `TrainerMonItemCustomMoves` | `ITEM_CUSTOM_MOVES(party)` | iv, lvl, species, heldItem, moves[4] |

**CRITICAL**: Macro in `trainers.h` must match the party struct type. Mismatch = crash.

**Rival status (C172)**: All 30 rival parties upgraded to `ItemCustomMoves` (Route103 uses `NoItemCustomMoves`). Both `trainer_parties.h` structs AND `trainers.h` macros updated simultaneously. Route103 = 1 mon, Rustboro = 2, Route110 = 3, Route119 = 4, Lilycove = 5.

**Validation script**: `scripts/check_trainers.sh` (C118) — cross-references all three trainer files.

---

## Evolution Engine (C157)

**File**: `src/data/pokemon/evolution.h`. Format: `{EVO_TYPE, param, SPECIES_TARGET}`.

**Trade evolutions**: `EVO_TRADE` (type 5) and `EVO_TRADE_ITEM` (type 6). Trade-item evos can use `EVO_ITEM` (type 7) with the same held item — zero engine changes needed.

---

## TM Consumption & Indoor Running (C156)

**TMs are already non-consumable** in pokeemerald decomp. No `RemoveBagItem` call in `ItemUseCB_TMHM` path.

**Indoor running** (C156): Removed `!gMapHeader.allowRunning` and `MAP_TYPE_INDOOR` checks from `bike.c`.

---

## Options Menu System (Cycle 105)

**File**: `src/option_menu.c`. **SaveBlock2 bitfield** (`include/global.h` line 519): 16-bit field with 3 padding bits remaining.

---

## Wild Pokémon Held Item System (Cycle 31)

**Core**: `SetWildMonHeldItem()` in `src/pokemon.c`. Probabilities: 50% common / 5% rare. Compound Eyes: 60% common / 20% rare.

---

## Dialogue Editing System (Cycles 24-26)

**Text format**: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars/line. Smart quotes valid (charmap B1/B2). ASCII `"` (0x22) NOT in charmap.

**Safety**: `MSGBOX_NPC` labels safe to rewrite. `MSGBOX_DEFAULT` may have story logic.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5. Fishing: 10.

**Conditional tables**: `GetCurrentMapWildMonHeaderId()` in `src/wild_encounter.c` (line 305). Alternate entry MUST follow base entry in JSON.

---

## Physical/Special Split & Move System (Cycle 43-44, 75, 128)

**MOVES_COUNT** = 378 (IDs 0-377). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5: 358-377.

**Species NOT in codebase**: Mismagius, Mamoswine, Weavile. Garchomp, Lucario, Riolu ARE present.

---

## Roaming Pokemon System (Cycle 108-109)

Single roamer slot (`struct Roamer`, 28 bytes). Beast system: `roamer.c` `InitNextBeast()` sequentially releases Raikou→Entei→Suicune using 6 flags. Full ref: `memory/pokemon-knowledge/roamer-implementation-patterns.md`.

---

## Flag System Layout (Cycle 117-118)

**Layout**: Story (0x00-0x2FF) → Trainer (0x500-0x873) → System (0x874+) → Daily (0x972+)

**Custom flags**: 0x264-0x285 used (v6.0 through v1.3). Next available: 0x286.

**Beast flags**: System flags 0x881-0x886.

---

## Sky Pillar System (Cycle 134-136)

7 maps. `VAR_SKY_PILLAR_STATE` controls progression. Cracked floors on 2F/4F. Rayquaza uses `FLAG_HIDE_SKY_PILLAR_TOP_RAYQUAZA_STILL` (0x50). **Legendary battle pattern**: `setwildbattle` → `setflag` → `special BattleSetup_StartLegendaryBattle` → `waitstate` → check `B_OUTCOME_CAUGHT`.

---

## Coord Events / Walk-Over Triggers (C144)

**map.json**: `coord_events` with `x`, `y`, `elevation`, `type: "1"`, `script`. One-shot: `setflag` + `goto_if_set`.

---

## Route 119 Weather & Weather Omens (C149, C159-160)

**Weather cycling**: `WEATHER_ROUTE119_CYCLE` (constant 20). `setweather` + `doweather` for manual control.

**Weather Omens (C159-160)**: Badge-gated permanent weather on 4 routes (R111/119/120/125). Flags 0x282-0x285. Each has reaction NPC gated by HIDE flag in map.json.

---

## Build Validation Targets (C141, C170)

`make check_scripts` — Lints .inc files for non-charmap characters. **Build prerequisite** since C170.

`make check_encounters` — Node.js validator for `wild_encounters.json`. Checks species existence (vs `constants/species.h`), slot counts (12/5/10), level ranges. Script: `scripts/check_encounters.sh`.

**CI note**: `python3` unavailable in build env. Use Node.js for validation scripts.

---

## Overworld Pokemon Sprites (C152-C153)

**OBJ_EVENT_GFX_PIKACHU** = 209. Only ~40 Pokémon have OW sprites in vanilla. Use `playmoncry` + narration for species without sprites.
