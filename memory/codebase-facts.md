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

**Custom flags**: 0x264-0x286 used (v6.0 through v1.6). 0x286 = `FLAG_DIFFICULTY_CHALLENGE` (C181). Next available: 0x287.

**Beast flags**: System flags 0x881-0x886.

---

## Multichoice System (Cycle 181)

**Constants**: `include/constants/script_menu.h` — `MULTI_*` IDs (0-114). `MULTI_B_PRESSED` = 127.
**Data**: `src/data/script_menu.h` — `sMultichoiceLists[]` array indexed by MULTI_* constants. Text strings + `MenuAction` arrays defined above it. `MULTICHOICE()` macro wraps list + count.
**Script usage**: `multichoice x, y, MULTI_ID, ignoreBPress` → check `VAR_RESULT` (0 = first option, 1 = second, ..., 127 = B pressed).
**Last used ID**: 114 (`MULTI_DIFFICULTY_SELECT`). Next available: 115.

---

## Sky Pillar System (Cycle 134-136)

7 maps. `VAR_SKY_PILLAR_STATE` controls progression. Cracked floors on 2F/4F. Rayquaza uses `FLAG_HIDE_SKY_PILLAR_TOP_RAYQUAZA_STILL` (0x50). **Legendary battle pattern**: `setwildbattle` → `setflag` → `special BattleSetup_StartLegendaryBattle` → `waitstate` → check `B_OUTCOME_CAUGHT`.

---

## Scripted Event Macro Library (C179)

**File**: `asm/macros/event_macros.inc`. Included via `asm/macros.inc` (after `battle_tent.inc`).

**3 macros** — all emit complete script bytecodes:
- `EventMacro_GlimpseEvent prereq_flag, glimpse_flag, text1, text2` — One-shot walk-over event (exclamation + 2 messages). Ends with `release`+`end`.
- `EventMacro_BadgeGateShow hide_flag, weather_id` — Reveal NPC + set weather. Ends with `return` (called via `call_if_set`).
- `EventMacro_ConditionalDialogue flag, text_before, text_after` — Two-state NPC dialogue. Ends with `release`+`end`.

**Label uniqueness**: Uses `.L` local labels + `\@` expansion count for unique labels per invocation.

**Include order**: `macros.inc` (defines EventMacro_*) → `event.inc` (defines lock, msgbox, etc.) → script files (invoke macros). Works because GNU as macros are expanded at invocation, not definition.

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

---

## Regional Variant Sprite Pipeline (PoC validated)

**Palette recoloring**: GBA sprites use 4-bit indexed color (16 palette entries per species). Each pixel stores a palette index, not a direct color. Changing `normal.pal` (JASC-PAL text format: 16 lines of `R G B` values, 0-255) recolors the entire sprite. The shiny system uses this same mechanism.

**Pixel-level edits**: Pillow (Python) can draw markings, accents, and effects by manipulating palette indices programmatically. Proven techniques: glyph stamping (lightning bolts, etc.), low-usage index repurposing (e.g., gray→blue for electric blue eyes), edge emanations (sparks beyond silhouette).

**Critical**: Must update BOTH the `.pal` file (used at GBA compile-time by `gbagfx`) AND the PNG's embedded palette via Pillow (for GitHub/file browser rendering). Palette-only `.pal` edits are invisible when viewing the PNG directly.

**Species registration**: 13 files to touch — species.h constant, 6 graphics INCBINs + externs, 7 table entries (front/back/still pics, palettes, coordinates, icons), species_info. All entries go after UNOWN_QMARK, before closing `};`. Follow the Unown alternate-form pattern.

**Full pipeline with code examples and palette design reference**: `memory/regional-variant-pipeline.md`
