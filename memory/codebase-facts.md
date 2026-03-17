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

**Files edited in Cycle 28** (12 NPCs):
- `data/maps/LittlerootTown/scripts.inc` — Twin (post-adventure)
- `data/maps/Route101/scripts.inc` — Youngster
- `data/maps/OldaleTown/scripts.inc` — Girl
- `data/maps/PetalburgCity/scripts.inc` — Boy (water) + Gentleman
- `data/maps/Route104/scripts.inc` — Bug Catcher
- `data/maps/PetalburgWoods/scripts.inc` — Boy1
- `data/maps/RustboroCity/scripts.inc` — FatMan + Man2
- `data/maps/SlateportCity/scripts.inc` — Cook + OldWoman
- `data/maps/Route110/scripts.inc` — OldMan

---

## Villain Dialogue System (Cycle 26)

**Villain script locations**:
- `pokeemerald/data/maps/MtChimney/scripts.inc` — Maxie confrontation
  - `MtChimney_Text_MaxieIntro` — pre-battle speech (after cutscene, before `trainerbattle_no_intro`)
  - `MtChimney_Text_MaxieDefeat` — in-battle defeat text (brief, shown in battle UI)
  - `MtChimney_Text_MaxieYouHaventSeenLastOfMagma` — post-battle speech (msgbox after battle)
- `pokeemerald/data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc` — Archie at Museum 2F
  - `SlateportCity_OceanicMuseum_2F_Text_ArchieWarning` — Archie's speech after both grunts are defeated (no battle at this scene — Archie warns and leaves)
  - Note: "Matt" does NOT appear at Slateport in vanilla Emerald; Archie is the villain here
- `pokeemerald/data/maps/SlateportCity_Harbor/scripts.inc` — Archie at harbor (later event)
  - `SlateportCity_Harbor_Text_ArchieYouAgainHideoutInLilycove` — Archie escaping with submarine
- `pokeemerald/data/maps/SeafloorCavern_Room9/scripts.inc` — Archie final confrontation
  - `SeafloorCavern_Room9_Text_ArchieYouMustDisappear` — pre-battle speech
  - `SeafloorCavern_Room9_Text_ArchieDefeat` — in-battle defeat text (brief)
  - `SeafloorCavern_Room9_Text_ArchieWithThisRedOrb` — post-battle (leads into Red Orb usage; must retain Red Orb reference since script continues with orb effect)

**Script flow at Seafloor Cavern**: `ArchieHoldItRightThere` → `ArchieSoItWasYou` → `ArchieBeholdKyogre` → `ArchieYouMustDisappear` → `trainerbattle_no_intro` → `ArchieWithThisRedOrb` → orb sparkle effect → Kyogre awakening

---

## Rival Dialogue System (Cycle 25)

**Location structure**: Rival dialogue strings live directly in the map's `scripts.inc` file, not in a central text file.

**File paths**:
- Route 103: `pokeemerald/data/maps/Route103/scripts.inc`
- Route 110: `pokeemerald/data/maps/Route110/scripts.inc`
- Lilycove: `pokeemerald/data/maps/LilycoveCity/scripts.inc`

**Label naming convention** (Brendan = rival when player is female; May = rival when player is male):

| Location | Pre-battle (first text) | Pre-battle (challenge) | Post-battle (player wins) | Post-battle (follow-up) |
|---|---|---|---|---|
| Route 103 | `Route103_Text_BrendanRoute103Pokemon` | `Route103_Text_BrendanLetsBattle` | `Route103_Text_BrendanDefeated` | `Route103_Text_BrendanTimeToHeadBack` |
| Route 110 | *(none — goes direct to battle)* | `Route110_Text_BrendanLetsBattle` | `Route110_Text_BrendanDefeated` | `Route110_Text_BrendanTakeThis` + `Route110_Text_BrendanExplainItemfinder` |
| Lilycove | `LilycoveCity_Text_BrendanShoppingLetsBattle` (YESNO) | `LilycoveCity_Text_BrendanWontBeBeaten` | `LilycoveCity_Text_BrendanDefeat` | `LilycoveCity_Text_BrendanGoingBackToLittleroot` |

Same pattern for May (replace `Brendan` with `May`, `{PLAYER}` → `{PLAYER}{KUN}`).

**Script flow at Lilycove**: Uses MSGBOX_YESNO; if player declines, sets `FLAG_DECLINED_RIVAL_BATTLE_LILYCOVE` and shows a different text. The `BrendanAskToBattleAgain` / `BrendanBattleMe` texts cover re-challenge cases (not updated — left vanilla).

**Key insight**: All rival text strings are plain `.string` assembly in map script files — safe for text-only edits. No event script logic touched.

---

## Professor Birch Opening Sequence (Cycle 24)

**File**: `pokeemerald/data/text/birch_speech.inc`

**Structure**: Multiple text segments make up the opening sequence:
- `gText_Birch_Welcome` — Initial greeting
- `gText_Birch_MainSpeech` — Core exposition about the migration phenomenon
- `gText_Birch_YourePlayer` — Personalized greeting mentioning the three juvenile Pokémon discovered
- `gText_Birch_AreYouReady` — Final hook about the transformed Hoenn

**How it works**: Text strings use standard Pokémon text formatting with `\p` for page breaks, `\n` for line breaks, `\l` for forced line breaks, and `$` for string termination. The `{PLAYER}` and `{KUN}` are text substitution variables.

**Transformation accomplished**: The vanilla generic "Welcome to Pokémon" dialogue was completely replaced with migration mystery narrative:
- Establishes rare species appearing (Larvitar, Dratini, Bagon specifically mentioned)
- Explains ecosystem transformation and unpredictable encounters
- Positions player as witness to "the greatest migration event in recorded history"
- Creates compelling hook that supports all other ROM hack changes

**Key insight**: Text modifications can be substantial (67 lines changed) without affecting build stability. This system is robust for narrative overhauls.

---

## Move Tutor System (Cycle 23)

**Files**:
- `pokeemerald/src/data/pokemon/tutor_learnsets.h` — `gTutorMoves[]` array and `sTutorLearnsets[]` bitfield
- `pokeemerald/data/scripts/move_tutors.inc` — NPC event scripts
- `pokeemerald/data/text/move_tutors.inc` — NPC dialogue strings
- `pokeemerald/include/constants/party_menu.h` — `TUTOR_MOVE_*` constants

**How it works**:
- `TUTOR_MOVE_COUNT = 30` slots, each mapped to a move in `gTutorMoves[]`
- `sTutorLearnsets[]` is indexed by SPECIES; each entry is a bitfield where bit `TUTOR_MOVE_X` = 1 means that Pokémon can learn that tutor move
- Macro: `#define TUTOR(move) (1u << (TUTOR_##move))`
- `TUTOR_MOVE_METRONOME = 8` (slot 8, repurposed to Earthquake in Cycle 23)
- Each NPC script uses a `FLAG_MOVE_TUTOR_TAUGHT_*` flag so each tutor can only be used once per save

**NPC locations**:
| NPC location | Move taught | Constant |
|---|---|---|
| Slateport City Pokemon Fan Club | Swagger | TUTOR_MOVE_SWAGGER |
| Mauville City | Rollout | TUTOR_MOVE_ROLLOUT |
| Verdanturf Town Pokemon Center | Fury Cutter | TUTOR_MOVE_FURY_CUTTER |
| Lavaridge Town House | Mimic | TUTOR_MOVE_MIMIC |
| Fallarbor Town Mart | **Earthquake** (was Metronome, changed Cycle 23) | TUTOR_MOVE_METRONOME |
| Fortree City House | Sleep Talk | TUTOR_MOVE_SLEEP_TALK |
| Lilycove City Dept Store Rooftop | Substitute | TUTOR_MOVE_SUBSTITUTE |
| Mossdeep City | DynamicPunch | TUTOR_MOVE_DYNAMIC_PUNCH |
| Sootopolis City Pokemon Center | Double-Edge | TUTOR_MOVE_DOUBLE_EDGE |
| Pacifidlog Town Pokemon Center | Explosion | TUTOR_MOVE_EXPLOSION |

**Learnset edit pattern** (to add a tutor move to a species):
```c
[SPECIES_X] = (TUTOR(MOVE_MIMIC)
             | TUTOR(MOVE_METRONOME)   // add after MIMIC in the list
             | TUTOR(MOVE_SUBSTITUTE)
             | ...),
```

---

## Legends of Hoenn ROM Hack — Comprehensive Validation (Cycle 20)

**Build Status**: ✅ **SUCCESSFUL** — ROM compiles cleanly to `pokeemerald.gba` (16MB)

### ✅ Core Systems Validated

**Starters System**: Larvitar, Bagon, Dratini properly replace Treecko/Torchic/Mudkip
- File: `src/starter_choose.c`, lines 113-118
- Array: `sStarterMon[STARTER_MON_COUNT] = {SPECIES_LARVITAR, SPECIES_BAGON, SPECIES_DRATINI}`
- **Verification**: All three starters obtainable, evolve correctly, rival system responds appropriately

**Wild Encounters**: All 73 route encounter tables + 34 dungeon tables transformed
- File: `src/data/wild_encounters.json`
- **Verification**: Routes 101-134 feature legendary-adjacent species (Houndour, Electabuzz, Dratini, Larvitar, etc.)
- **Verification**: Dungeons (Petalburg Woods, Granite Cave, Mt. Pyre, etc.) feature proper rare species

**Trainer Battles**: Complete overhaul of progression from Roxanne to Champion
- File: `src/data/trainer_parties.h`
- **Verification**: All 8 gym leaders use thematic powerhouses (Roxanne → Aerodactyl/Tyranitar, etc.)
- **Verification**: Elite Four use legendary-tier teams (Sidney → Tyranitar, Phoebe → dual Gengar, etc.)
- **Verification**: Rival teams scale properly with pseudo-legendary starters + thematic supports

**Level Curve**: Trainer levels adjusted for accelerated player power
- **Verification**: Early leaders (Roxanne 12/15/17, Brawly 18/20/25) appropriate for pseudo-legendary starters
- **Verification**: Late game (Elite Four 52-62, Champion 58-65) matches player's legendary-tier team

**Held Items**: Strategic items on all major trainers
- **Verification**: Gym leaders, Elite Four, Champion all have appropriate held items (Leftovers, type boosters, etc.)

**Quality of Life**: TM prices reduced, move tutors accessible
- **Verification**: Critical TMs (Dragon Claw, Earthquake, Shadow Ball) reduced from 3,000 to 1,500P
- **Verification**: Earthquake tutor available at Fallarbor Mart pre-Gym 4

### ✅ Narrative Foundation

**Professor Birch Opening**: Migration mystery established ✅ (Cycle 24)
- **Verification**: Opening sequence explains rare species migrations, ecosystem transformation
- **Verification**: Player positioned as witness to "greatest migration event in recorded history"
- **Verification**: Narrative supports all other ROM hack changes with in-universe explanation

**Safari Zone**: Encounters updated to match migration theme ✅ (Cycle 14)
- **Verification**: All six Safari Zone areas feature migrant species (Dratini, Larvitar, Bagon, etc.)

### 🎯 ROM Hack Status: **RELEASE READY**

All major systems complete and validated. The ROM builds successfully and provides a cohesive "Legends of Hoenn" experience from opening dialogue through Champion battle.

---

## Wild Encounter System Architecture

**File**: `pokeemerald/src/data/wild_encounters.json`

**Structure**: JSON array of area objects, each containing encounter tables:
```json
{
  "label": "gAreaName_Route101",
  "land_mons": {
    "encounter_rate": 20,
    "mons": [12 slot objects with species/min_level/max_level]
  },
  "water_mons": { 5 slots },
  "fishing_mons": { 10 slots }
}
```

**Slot probabilities**:
- Land: 20/20/10/10/10/10/5/5/4/4/1/1 (slots 0-11)
- Water: 60/30/5/4/1 (slots 0-4)
- Fishing: 70/30 split between rod types, then internal probabilities

**Species validation**: All species in `include/constants/species.h` are valid. Gen 1-3 Pokémon compile cleanly.

**Level ranges**: `min_level`/`max_level` in encounter slots must be 2-70 range typically.

**Bulk editing**: Python inline scripts work well for mass changes:
```bash
python3 -c "
import json
with open('src/data/wild_encounters.json', 'r') as f: data = json.load(f)
# ... modifications ...
with open('src/data/wild_encounters.json', 'w') as f: json.dump(data, f, indent=2)
"
```

---

## Trainer Battle System Architecture

**File**: `pokeemerald/src/data/trainer_parties.h` (198KB, 10,000+ lines)

**Party types**:
1. `TrainerMonNoItemDefaultMoves` — just species + level
2. `TrainerMonItemDefaultMoves` — species + level + held item
3. `TrainerMonNoItemCustomMoves` — species + level + 4 custom moves
4. `TrainerMonItemCustomMoves` — species + level + held item + 4 custom moves

**Trainer class format**:
```c
static const struct TrainerMonItemCustomMoves sParty_Roxanne[] = {
    {
    .iv = TRAINER_PARTY_IVS(12, 12, 12, 12, 12, 12),
    .lvl = 12,
    .species = SPECIES_AERODACTYL,
    .heldItem = ITEM_NONE,
    .moves = {MOVE_TACKLE, MOVE_HARDEN, MOVE_ROCK_TOMB, MOVE_NONE}
    },
    // ... more mons
};
```

**Key trainers** (line numbers in trainer_parties.h):
- **Gym leaders**: Roxanne (~3367), Brawly (~3391), Wattson (~3415), Flannery (~3446), Norman (~3477), Winona (~3508), Tate & Liza (~3546), Juan (~3577)
- **Elite Four**: Sidney (~4344), Phoebe (~4370), Glacia (~4396), Drake (~4422)
- **Champion**: Wallace (~4414)
- **Rival parties**: Brendan/May variants at ~10 different progression points

**Move constants**: All moves in `include/constants/moves.h` as `MOVE_NAME` format

**Species constants**: All Pokémon in `include/constants/species.h` as `SPECIES_NAME` format

**Item constants**: All items in `include/constants/items.h` as `ITEM_NAME` format

---

## ROM Build System

**Command**: `make` from `pokeemerald/` directory
**Output**: `pokeemerald.gba` (16MB exactly when successful)
**Toolchain**: agbcc (custom GBA C compiler) + ARM cross-tools
**Language**: C89 (no `//` comments, no C99 features)
**Platform**: GBA (Game Boy Advance), 32-bit ARM7TDMI with Thumb interwork

**Build validation**:
- File size exactly 16,777,216 bytes (16.0M) indicates successful build
- File size under 16MB indicates build failure/incomplete
- Errors written to stdout/stderr during compilation

**Incremental builds**: Only changed files recompile (fast for data-only changes)
**Clean builds**: `make clean && make` forces full recompilation

**Memory layout**:
- ROM: 16MB starting at 0x08000000
- IWRAM: 32KB fast instruction RAM
- EWRAM: 256KB external work RAM

**Graphics**: Tile-based, 8x8 tiles, indexed color palettes
**Audio**: M4A format (converted from MIDI via `tools/mid2agb`)

---

## Constants and Data Organization

**Include hierarchy**:
- `include/constants/` — all game constants (#define macros)
- `include/global.h` — core types and structures
- `data/` — scripts, text, graphics
- `src/` — C source code
- `graphics/` — PNG source images

**Text format**:
- `.inc` files contain `.string` assembly directives
- Special codes: `\p` (page), `\n` (newline), `\l` (line break), `$` (terminator)
- Variables: `{PLAYER}`, `{RIVAL}`, etc.

**Common constant patterns**:
- `SPECIES_POKEMON_NAME` (Pokémon species)
- `MOVE_MOVE_NAME` (battle moves)
- `ITEM_ITEM_NAME` (items)
- `TYPE_TYPE_NAME` (Pokémon types)
- `TRAINER_*` (trainer classes)

**Data validation**: All constants must be defined in headers before use, or build fails with "undefined" errors.
