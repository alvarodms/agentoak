# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Wild Pokémon Held Item System (Cycle 31)

**Core System**: Wild Pokémon held items are automatically assigned via the `SetWildMonHeldItem()` function in `src/pokemon.c` (lines 6664-6717).

**Species-based Assignment**: Each species has `.itemCommon` and `.itemRare` fields in `gSpeciesInfo[]` array defined in `src/data/pokemon/species_info.h`.

**Probability System**:
- Normal: 45% no item, 50% common item (itemCommon), 5% rare item (itemRare)
- With Compound Eyes ability: 20% no item, 60% common item, 20% rare item
- Special case: If itemCommon == itemRare and != ITEM_NONE, then 100% chance to hold that item

**Implementation Pattern** (Cycle 31): All 164 wild encounter species updated with thematic held items:
- **Type-based items**: Fire types get ITEM_CHARCOAL, Electric get ITEM_MAGNET, Water get ITEM_MYSTIC_WATER, etc.
- **Pseudo-legendary special cases**: Dratini/Dragonair/Bagon/Shelgon/Larvitar/Pupitar get type boosters (common) + ITEM_LEFTOVERS (rare)
- **Evolution items**: Magmar gets ITEM_CHARCOAL/ITEM_FIRE_STONE, Electabuzz gets ITEM_MAGNET/ITEM_THUNDER_STONE, Scyther gets ITEM_METAL_COAT
- **Normal type fallback**: ITEM_ORAN_BERRY for Normal-type species

**Key insight**: The system was already fully implemented — just needed species data updates, not code changes. No modifications to wild encounter JSON or core encounter logic required.

**Automation**: Python script `update_held_items.py` successfully updated all species definitions with regex pattern matching for species types and item assignments.

---

## pokeemerald-expansion v1.15.0 — Architecture Incompatibility (Cycles 40–41)

**Critical discovery from Cycle 41**: The expansion and vanilla pokeemerald are architecturally incompatible at the C struct level. You cannot mix vanilla source files with expansion headers.

### Struct Incompatibilities (Confirmed by Build Errors)

**`struct BattleResources`**:
- Vanilla has: `.battleScriptsStack`, `.flags`
- Expansion has: `.ai`, `.battleHistory`, `.AI_ScriptsStack` (and no `.battleScriptsStack`)

**Removed/renamed globals in expansion**:
- `gBattleMoves` — renamed (now accessed via a different API)
- `gActiveBattler` — removed or renamed (was widely used in vanilla AI)
- `gDisableStructs` — removed
- `gTrainerBattleOpponent_A` / `_B` — removed
- `gDynamicBasePower`, `gMoveResultFlags`, `gCritMultiplier`, `gBattleMoveDamage` — all removed

**New expansion-only constants** (undefined in vanilla):
- `AI_USER`, `AI_TARGET`, `AI_USER_PARTNER`, `AI_TARGET_PARTNER`
- `AI_TYPE1_USER`, `AI_TYPE1_TARGET`, `AI_TYPE2_USER`, `AI_TYPE2_TARGET`, `AI_TYPE_MOVE`
- `AI_SCRIPT_*` family (SAFARI, ROAMING, FIRST_BATTLE, etc.)
- `AI_EFFECTIVENESS_x2/x4/x0_5/x0_25/x0/x1`
- `AI_WEATHER_NONE/RAIN/SANDSTORM/SUN/HAIL`
- `MOVE_MOST_POWERFUL`, `MOVE_NOT_MOST_POWERFUL`, `MOVE_POWER_OTHER`

### Trainer Data Format

**Old format (vanilla)**: C struct in `src/data/trainer_parties.h`
**New format (expansion)**: `.party` files in `src/data/trainers.party`, compiled by `trainerproc` tool
**No toggle available**: `COMPETITIVE_PARTY_SYNTAX` does NOT exist — `.party` format is mandatory in v1.15.0

### Battle AI

The battle AI was completely rewritten in the expansion. `src/battle_ai_script_commands.c` in vanilla is 100% incompatible with expansion headers — 200+ errors in that file alone.

### Difficulty System (Expansion Only)

The expansion adds a difficulty system: `enum DifficultyLevel` in `include/constants/difficulty.h` with `DIFFICULTY_COUNT`. `gTrainers[]` becomes `gTrainers[DIFFICULTY_COUNT][TRAINERS_COUNT]`. This is a fundamental change to how trainers are referenced.

### Migration Conclusion

**The expansion is not a drop-in upgrade**. It is a separate codebase that happens to share some file paths. Migrating to it means: (1) start with a fresh expansion clone, (2) port LoH content into it (encounters, trainer parties in .party format, dialogue scripts). The reverse (grafting expansion headers onto vanilla source) does not work.

---

## Gym Leader Pre-Battle Dialogue — Confirmed File Paths (Cycle 36)

**Label pattern**: `[MapName]_Text_[GymLeaderName]Intro` — used in `trainerbattle_single` or via `msgbox` + `trainerbattle_no_intro`

| Gym Leader | File Path | Label |
|---|---|---|
| Roxanne | `data/maps/RustboroCity_Gym/scripts.inc` | `RustboroCity_Gym_Text_RoxanneIntro` |
| Brawly | `data/maps/DewfordTown_Gym/scripts.inc` | `DewfordTown_Gym_Text_BrawlyIntro` |
| Wattson | `data/maps/MauvilleCity_Gym/scripts.inc` | `MauvilleCity_Gym_Text_WattsonIntro` |
| Flannery | `data/maps/LavaridgeTown_Gym_1F/scripts.inc` | `LavaridgeTown_Gym_1F_Text_FlanneryIntro` |
| Norman | `data/maps/PetalburgCity_Gym/scripts.inc` | `PetalburgCity_Gym_Text_NormanIntro` |
| Winona | `data/maps/FortreeCity_Gym/scripts.inc` | `FortreeCity_Gym_Text_WinonaIntro` |
| Tate & Liza | `data/maps/MossdeepCity_Gym/scripts.inc` | `MossdeepCity_Gym_Text_TateAndLizaIntro` |
| Juan | `data/maps/SootopolisCity_Gym_1F/scripts.inc` | `SootopolisCity_Gym_1F_Text_JuanIntro` |

**Gym file naming quirks**:
- Flannery's gym is `LavaridgeTown_Gym_1F` — there is NO `LavaridgeTown_Gym` (only `_1F` and `_B1F`)
- Juan's gym requires `_1F` suffix: `SootopolisCity_Gym_1F`
- Norman's pre-battle uses `MSGBOX_DEFAULT` + `trainerbattle_no_intro` (two-step pattern, differs from single `trainerbattle_single`)

**Rival label confirmed** (Cycle 36): Route 103 pre-battle label is `Route103_Text_BrendanRoute103Pokemon` (Brendan) / `Route103_Text_MayRoute103Pokemon` (May). These are shown BEFORE the rival approaches; the challenge text is `BrendanLetsBattle`/`MayLetsBattle`.

---

## NPC Dialogue Editing Pattern (Cycle 28)

**Target**: Any `.string` label in a map's `scripts.inc` used by a MSGBOX_NPC or MSGBOX_DEFAULT event script.

**Safe targets**: Labels used only in `MSGBOX_NPC` (static) are purely cosmetic — safe to rewrite. Labels used in `MSGBOX_DEFAULT` inside branching event scripts may have story importance (check surrounding logic first).

**Unsafe targets**: Labels shared between static NPC text AND dynamic event scripts (e.g. `PetalburgCity_Text_AreYouRookieTrainer` — used in both the GymBoy static NPC and the `ShowGymToPlayer` story trigger).

**Text format rules**:
- `\n` = line break within the same text box (2nd line)
- `\l` = 3rd line in the same text box (soft scroll/line)
- `\p` = press A, new text page (clear box)
- `$` = string terminator
- Keep display lines under ~35 chars for safety
- ASCII only: use `--` not em-dash, use `...` not `…`, use straight quotes

---

## Villain Dialogue System (Cycle 26)

**Villain script locations**:
- `pokeemerald/data/maps/MtChimney/scripts.inc` — Maxie confrontation
- `pokeemerald/data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc` — Archie at Museum 2F
- `pokeemerald/data/maps/SeafloorCavern_Room9/scripts.inc` — Archie final confrontation

**Script flow at Seafloor Cavern**: `ArchieHoldItRightThere` → `ArchieSoItWasYou` → `ArchieBeholdKyogre` → `ArchieYouMustDisappear` → `trainerbattle_no_intro` → `ArchieWithThisRedOrb` → orb sparkle effect → Kyogre awakening

---

## Rival Dialogue System (Cycle 25)

**File paths**:
- Route 103: `pokeemerald/data/maps/Route103/scripts.inc`
- Route 110: `pokeemerald/data/maps/Route110/scripts.inc`
- Lilycove: `pokeemerald/data/maps/LilycoveCity/scripts.inc`

---

## Professor Birch Opening Sequence (Cycle 24)

**File**: `pokeemerald/data/text/birch_speech.inc`

**Key insight**: Text modifications can be substantial (67 lines changed) without affecting build stability. This system is robust for narrative overhauls.

---

## Move Tutor System (Cycle 23)

**Files**:
- `pokeemerald/src/data/pokemon/tutor_learnsets.h` — `gTutorMoves[]` array and `sTutorLearnsets[]` bitfield
- `pokeemerald/data/scripts/move_tutors.inc` — NPC event scripts
- `pokeemerald/include/constants/party_menu.h` — `TUTOR_MOVE_*` constants

**Slot 8** (`TUTOR_MOVE_METRONOME`) repurposed to Earthquake in Cycle 23 at Fallarbor Town Mart.

---

## TM Consumption Mechanic — IMPLEMENTED (Cycle 35)

**File**: `pokeemerald/src/party_menu.c`
**Change**: Deleted the 2-line block `if (item < ITEM_HM01) RemoveBagItem(item, 1);` — TMs are now permanent, HMs unchanged.

---

## Auto-Run (Always Running) — IMPLEMENTED (Cycle 35)

**File**: `pokeemerald/src/field_player_avatar.c`, Line 658
**Change**: Removed `(heldKeys & B_BUTTON) &&` from the running condition. Player always runs once FLAG_SYS_B_DASH is set.

---

## Wild Encounter System Architecture

**File**: `pokeemerald/src/data/wild_encounters.json`
**Land**: 12 slots, probabilities 20/20/10/10/10/10/5/5/4/4/1/1
**Water**: 5 slots. **Fishing**: 10 slots.

---

## Trainer Battle System Architecture

**File**: `pokeemerald/src/data/trainer_parties.h` (198KB, 10,000+ lines)

**Party types**: `TrainerMonNoItemDefaultMoves`, `TrainerMonItemDefaultMoves`, `TrainerMonNoItemCustomMoves`, `TrainerMonItemCustomMoves`

**Key trainer line numbers in trainer_parties.h**:
- Gym leaders: Roxanne (~3367), Brawly (~3391), Wattson (~3415), Flannery (~3446), Norman (~3477), Winona (~3508), Tate & Liza (~3546), Juan (~3577)
- Elite Four: Sidney (~4344), Phoebe (~4370), Glacia (~4396), Drake (~4422), Wallace (~4414)

---

## Elite Four, Champion, and Late-Game Gym File Naming (Cycle 33)

**Elite Four rooms**: `data/maps/EverGrandeCity_[Name]sRoom/scripts.inc`
**Champion's room**: `EverGrandeCity_ChampionsRoom/scripts.inc` — NOT `WallacesRoom`
**Defeat text**: max ~35 chars per line, max 2 lines (shown inside battle UI)

---

## ROM Build System

**Command**: `make` from `pokeemerald/` directory
**Output**: `pokeemerald.gba` (16MB exactly = successful build)
**Toolchain**: agbcc (C89) + ARM cross-tools
**Success indicator**: File size exactly 16,777,216 bytes
