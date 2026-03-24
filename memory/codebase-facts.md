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

---

## Build System Requirements (Cycle 52)

**agbcc compiler**: Required for building. Install from pret/agbcc repo and symlink to `tools/agbcc/`.
**Graphics dependencies**: All type graphics must exist in `graphics/types/` (including `fairy.png` for Fairy type).
**Build command**: `make` from pokeemerald directory produces `pokeemerald.gba`.

---

## Opening Experience (Cycles 52-53, 58)

**Birch rescue**: `SetUpBattleVarsAndBirchZigzagoon()` in `src/battle_controllers.c` — now Poochyena level 3 (reverted from Growlithe in Cycle 58 to match overworld sprite). Route101 map.json has `OBJ_EVENT_GFX_POOCHYENA` — **species and overworld sprite must always match**.
**Intro speech Pokemon**: `src/main_menu.c` line ~1377 — now SPECIES_BAGON (was SPECIES_LOTAD). Variable still named `tLotadSpriteId` internally.

---

## Fairy Encounter Corridors — Complete (Cycles 47, 49)

All 5 corridors implemented:
- Granite Cave B2F: Ralts 16-19 (10%) — slot 8
- Route 118: Snubbull 24-26 (15%)
- Route 120: Togetic 28-30 (1%) — slot 11
- Route 121: Clefairy 26-28 (20%)
- Mt. Pyre 1F: Snubbull 27-29 (10%) — slot 5

---

## Wild Pokémon Held Item System (Cycle 31)

**Core**: `SetWildMonHeldItem()` in `src/pokemon.c`. Each species has `.itemCommon`/`.itemRare` in `gSpeciesInfo[]` (`src/data/pokemon/species_info.h`).

**Probabilities**: Normal: 50% common / 5% rare. With Compound Eyes: 60% common / 20% rare. If itemCommon == itemRare: 100%.

---

## pokeemerald-expansion — Incompatible. Decision: stay vanilla.

---

## Dialogue Editing System (Cycles 24–26)

**Files**: Map `scripts.inc` files. Text format: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars per display line. ASCII only — no em dash, smart quotes.

**Safety**: `MSGBOX_NPC` labels are safe to rewrite. `MSGBOX_DEFAULT` labels may have story logic — check first.

**Postgame gating**: Use `checkflag FLAG_SYS_GAME_CLEAR` + `goto_if_set` to branch dialogue after Champion defeat.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist. VAR_0x800C+ are NOT defined. For multi-counter scripts, reuse VAR_0x8005/8006/8007 (safe as long as ScriptCheckSpeciesCaught only reads VAR_0x8004).

**specialvar vs special**: `special` discards return value. `specialvar VAR_RESULT, FuncName` captures it. Must use `specialvar` for bool16-returning specials like ScriptCheckSpeciesCaught.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5 slots. Fishing: 10 slots.

**Conditional encounter tables (Cycle 63)**: `GetCurrentMapWildMonHeaderId()` in `src/wild_encounter.c` (line 305). Altering Cave pattern: if a flag is set and map matches, `i++` to select the next JSON entry for that map. Second Wave uses same pattern for 6 routes. **Ordering in JSON is critical** — the alternate entry MUST be immediately after the base entry for that map. Map constants: `MAP_ROUTE118` etc. from auto-generated `include/constants/map_groups.h`. `constants/flags.h` must be explicitly included (not transitively available).

---

## Trainer Battle System

**Party data**: `src/data/trainer_parties.h`. Struct: `TrainerMonItemCustomMoves` with `.species`, `.heldItem`, `.moves[]`.

**AI flags**: Elite trainers use `AI_FLAG_CHECK_BAD_MOVE | AI_FLAG_TRY_TO_FAINT | AI_FLAG_CHECK_VIABILITY`. Champion adds `AI_FLAG_SMART_SWITCHING`.

---

## Physical/Special Split (Cycle 43-44, 75)

Moves use `.category = MOVE_CATEGORY_PHYSICAL` / `MOVE_CATEGORY_SPECIAL` / `MOVE_CATEGORY_STATUS` in `battle_moves.h`. Constants defined in `include/pokemon.h` (0/1/2). Battle calc in `battle_script_commands.c` checks category instead of type. All 355 moves categorized. Fairy type added as TYPE_FAIRY with full type chart.

**Summary screen category icons (Cycle 75)**: Physical/Special/Status icons displayed on battle moves page. Uses the same sprite system as type icons (shared `sSpriteTemplate_MoveTypes`). Category icon frames are appended after contest types in `move_types.4bpp`. `SPRITE_ARR_ID_CATEGORY` sprite slot. `SetMoveCategoryIcon()` called from `PrintMoveDetails()`.

---

## Battle Frontier Architecture (Cycle 76)

**Type effectiveness**: All facilities use centralized `gTypeEffectiveness[]` in `src/battle_main.c:335-463` — sentinel-terminated, already has Fairy. No facility has private type tables.

**Palace move selection**: `GetBattlePalaceMoveGroup()` in `src/battle_gfx_sfx_util.c:296-318` — categorizes by power/target, NOT type or category. P/S split invisible to Palace.

**Arena scoring**: `sMindRatings[MOVES_COUNT]` in `src/battle_arena.c:58` — indexed by move ID. New moves default to 0 if not explicitly rated.

**Factory styles**: 7 `sMoves_*` arrays in `src/battle_factory.c:55-122` — hardcoded move lists for AI strategy classification.

**Dome AI**: `GetTypeEffectivenessPoints()` in `src/battle_dome.c:2801-2935` — loops gTypeEffectiveness with sentinel. No move category refs.

**Frontier mon pool**: `gBattleFrontierMons[NUM_FRONTIER_MONS=882]` in `src/data/battle_frontier/battle_frontier_mons.h`. Struct: `{u16 species, u16 moves[4], u8 itemTableId, u8 evSpread, u8 nature}`. Our 6 new species NOT in pool.

**Completed fixes (Cycle 77)**: (1) sMindRatings +1 for Moonblast/Play Rough/Dazzling Gleam, (2) Factory style arrays now include 3 Fairy moves, (3) Lucario/Weavile/Garchomp added to pool (indices 882-893, 4 sets each). **Pending**: 882 original Frontier mons have P/S split stat mismatches (low priority). **UNVERIFIED** — no build was run in Cycle 77.

---

## Species-Addition Pipeline (Cycle 59)

**Full checklist**: `memory/pokemon-knowledge/species-addition-pipeline.md` (25 steps, ~27 source files + ~14 assets per 2-species family).

**Key structural facts**:
- `SPECIES_EGG` (now 414, was 412) must always be last species. `NUM_SPECIES = SPECIES_EGG`. Unown variants defined relative to NUM_SPECIES.
- `NATIONAL_DEX_COUNT` = `NATIONAL_DEX_DEOXYS` (line 426 of pokedex.h) — must update when adding species.
- Hoenn dex has "excluded" section after `HOENN_DEX_DEOXYS` (line 633+) for non-Hoenn species. New migrants go here.
- `src/pokemon.c` has 4 tables needing entries: `sSpeciesToHoennPokedexNum`, `sSpeciesToNationalPokedexNum`, `sHoennToNationalOrder`, `sMonFrontAnimIdsTable` (+ optional `sMonAnimationDelayTable`).
- Cry pipeline: `.wav` → `wav2agb` → `.bin` (build artifact) → `.incbin` in `sound/direct_sound_data.inc` → referenced by `sound/cry_tables.inc`. Source files are `.wav` in `sound/direct_sound_samples/cries/`.
- Cry table (`cry_tables.inc`) is **position-indexed** by species ID - 1, NOT keyed. Must match species.h order.
- Graphics: 7 asset files per species in `graphics/pokemon/<name>/`. Build auto-converts PNG→4bpp.lz via gbagfx.
- Front pic anims: `SINGLE_ANIMATION(Name)` macro in `front_pic_anims.h` creates `sAnims_<Name>` from `sAnim_<Name>_1`.