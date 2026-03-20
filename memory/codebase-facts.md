# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Elite Four Rematch System (Cycles 49-50)

**Rematch table**: `src/battle_setup.c` lines 260+ — `gRematchTable[]` uses `REMATCH(t1, t2, t3, t4, t5, map)` macro. Each entry holds 5 trainer IDs (base + 4 rematch tiers).

**Current state**: Tier 1 rematch IDs in slot 2, tier 2 IDs in slots 3-5. Slots 4-5 are duplicates of tier 2 — two more tiers can be added.

**Rematch enum**: `include/constants/rematches.h` — `REMATCH_SIDNEY`, `REMATCH_PHOEBE`, etc.

**Trainer ID ceiling**: `TRAINERS_COUNT` in `opponents.h`. `MAX_TRAINERS_COUNT` hard cap is 864 based on trainer flag allocation (0x500-0x85F = 864 slots). **Current state: 864 trainer IDs — ceiling issue resolved in Cycle 52.**

**Three-file trainer system**: Each trainer requires coordinated removal/addition across `opponents.h` (ID constants), `trainers.h` (metadata), and `trainer_parties.h` (party composition). All three must be updated together.

**Removed in Cycle 51**: TRAINER_GRUNT_UNUSED (568), TRAINER_BRENDAN_PLACEHOLDER (853), TRAINER_MAY_PLACEHOLDER (854).
**Removed in Cycle 52**: TRAINER_BRENDAN_PLACEHOLDER fully cleaned from all files.

---

## Build System Requirements (Cycle 52)

**agbcc compiler**: Required for building. Install from pret/agbcc repo and symlink to `tools/agbcc/`.
**Graphics dependencies**: All type graphics must exist in `graphics/types/` (including `fairy.png` for Fairy type).
**Build command**: `make` from pokeemerald directory produces `pokeemerald.gba`.

---

## Birch Opening Encounter (Cycle 52)

**Function**: `SetUpBattleVarsAndBirchZigzagoon()` in `src/battle_controllers.c` controls the opening Birch encounter.
**Zigzagoon level**: Set to 5 (was 2) for better opening experience.

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

## pokeemerald-expansion — Incompatible (Cycles 40–41)

Expansion and vanilla are architecturally incompatible at struct level. **Decision: stay vanilla.**

---

## Move Implementation — 6 Files Required (Cycles 45-46)

1. `include/constants/moves.h` — constant + MOVES_COUNT
2. `src/data/battle_moves.h` — gBattleMoves[] entry
3. `src/data/contest_moves.h` — gContestMoves[] entry
4. `src/data/text/move_descriptions.h` — string + pointer table
5. `src/data/text/move_names.h` — name (max 12 chars)
6. `src/data/pokemon/level_up_learnsets.h` — species learnset entries

---

## Dialogue Editing System (Cycles 24–26)

**Files**: Map `scripts.inc` files. Text format: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars per display line. ASCII only — no em dash, smart quotes.

**Safety**: `MSGBOX_NPC` labels are safe to rewrite. `MSGBOX_DEFAULT` labels may have story logic — check first.

**Postgame gating**: Use `checkflag FLAG_SYS_GAME_CLEAR` + `goto_if_set` to branch dialogue after Champion defeat.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5 slots. Fishing: 10 slots.

---

## Trainer Battle System

**Party data**: `src/data/trainer_parties.h`. Struct: `TrainerMonItemCustomMoves` with `.species`, `.heldItem`, `.moves[]`.

**AI flags**: Elite trainers use `AI_FLAG_CHECK_BAD_MOVE | AI_FLAG_TRY_TO_FAINT | AI_FLAG_CHECK_VIABILITY`. Champion adds `AI_FLAG_SMART_SWITCHING`.

---

## Physical/Special Split (Cycle 43-44)

Moves use `.split = SPLIT_PHYSICAL` or `SPLIT_SPECIAL` in `battle_moves.h`. Battle calc in `battle_script_commands.c` checks split instead of type. All 355 moves categorized. Fairy type added as TYPE_FAIRY with full type chart.