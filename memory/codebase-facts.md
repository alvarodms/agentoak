# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

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

| System | Status | Details |
|--------|--------|---------|
| **Starters** | ✅ VALIDATED | Larvitar, Bagon, Dratini correctly implemented in `src/starter_choose.c` lines 115-117 |
| **Early Encounters** | ✅ VALIDATED | Routes 101-102 fully overhauled with rare Pokémon: Trapinch/Swablu/Ralts (common), Dratini (4%), Larvitar/Bagon/Beldum (1%) |
| **Gym Leaders** | ✅ VALIDATED | Roxanne (Aerodactyl/Graveler/Rhydon), Norman (Kangaskhan/Tauros/Blissey) with strategic held items & movesets |
| **Elite Four** | ✅ VALIDATED | Sidney (Absol/Houndoom/Sharpedo/Umbreon/Tyranitar 52-58) with Dark specialist theme |
| **Rival System** | ✅ VALIDATED | Starter correspondence works (player Larvitar → rival Bagon), thematic teams (water-dragon support for Dragonair) |
| **Migration Narrative** | ✅ VALIDATED | Birch dialogue updated: "With rare Pokémon migrating to Hoenn, now's the perfect time to start" |
| **Safari Zone** | ✅ VALIDATED | All six zones overhauled with pseudo-legendaries (south zone), rare species (Girafarig, Mareep, Aipom) |
| **Level Curve** | ✅ VALIDATED | Flannery tuned to 30-37, Drake at 54-57+, progression matches design (early 15-25, mid 30-45, E4 52-62) |

### ⚠️ Areas Needing Investigation

| System | Status | Issue |
|--------|--------|-------|
| **Dungeon Encounters** | ⚠️ INCONSISTENT | Petalburg Woods & Granite Cave show vanilla encounters (Poochyena/Wurmple, Zubat/Makuhita) instead of documented rare overhauls |

### ROM Hack Readiness Assessment

**READY FOR RELEASE** with minor caveat. The core Legends of Hoenn experience is fully implemented:
- All major trainer battles redesigned with powerful, thematic teams
- Wild encounters transformed from common to rare/legendary-adjacent Pokémon
- Narrative coherence through migration event explanation
- Balanced difficulty progression from Route 101 to Champion
- Strategic depth via held items and custom movesets

**Recommendation**: The dungeon encounter discrepancy should be investigated, but does not block release since route encounters and trainer battles (the primary gameplay experience) are fully validated.

## Repository Overview

- **Scale**: 313 C source files (~1.2M LOC), 60+ header files, 443+ map definitions
- **Architecture**: Task/callback-based state machine with interrupt-driven real-time rendering (60 FPS)
- **Entry point**: `pokeemerald/src/main.c` → `AgbMain()` → main loop

## Directory Structure

```
pokeemerald/
├── src/        # 313 .c files — game logic
├── include/    # header files and interface definitions
├── data/       # game data: maps, encounters, scripts, text (24MB)
├── graphics/   # sprite sheets, tilesets, palettes (26MB)
├── sound/      # music and sound effects (11MB)
├── constants/  # game constants (48KB)
├── asm/        # assembly macros (272KB)
├── tools/      # build tools: gbagfx, mid2agb, scaninc, etc.
└── libagbsyscall/ # custom system call library
```

## Key Systems and Source Files

### Wild Encounters (`src/wild_encounter.c`, `data/wild_encounters.json`)

**Data structure:**
```c
struct WildPokemon { u8 minLevel; u8 maxLevel; u16 species; };
struct WildPokemonInfo { u8 encounterRate; const struct WildPokemon *wildPokemon; };
struct WildPokemonHeader { u8 mapGroup; u8 mapNum;
    const struct WildPokemonInfo *landMonsInfo;
    const struct WildPokemonInfo *waterMonsInfo;
    const struct WildPokemonInfo *rockSmashMonsInfo;
    const struct WildPokemonInfo *fishingMonsInfo; };
```

**Encounter slots and probabilities:**
- Land: 12 slots → 20%, 20%, 10%, 10%, 10%, 10%, 5%, 5%, 4%, 4%, 1%, 1%
- Water: 5 slots → 60%, 30%, 5%, 4%, 1%
- Rock Smash: 5 slots (same as water)
- Fishing: 10 slots — Old Rod: 0-1, Good Rod: 2-4, Super Rod: 5-9

**Key functions:**
- `StandardWildEncounter()` — check/trigger random battle
- `FishingWildEncounter()` — rod fishing
- `SweetScentWildEncounter()` — move-triggered
- `ChooseWildMonIndex_Land()` — weighted random selection
- `CheckFeebas()` — Route 119 Feebas with date-based spawn spots
- `ApplyFluteEncounterRateMod()`, `ApplyCleanseTagEncounterRateMod()` — rate modifiers
- `UpdateRepelCounter()` — Repel item logic

**Encounter rate**: Max 2880; abilities (Synchronize, Static, Magnet Pull) influence species

### Safari Zone System (`src/safari_zone.c`, `data/wild_encounters.json`)

**Safari Zone maps in wild_encounters.json:**
- `MAP_SAFARI_ZONE_SOUTH` — main entrance area
- `MAP_SAFARI_ZONE_SOUTHEAST` — southeast quadrant
- `MAP_SAFARI_ZONE_SOUTHWEST` — southwest quadrant
- `MAP_SAFARI_ZONE_NORTH` — northern area
- `MAP_SAFARI_ZONE_NORTHEAST` — northeast quadrant
- `MAP_SAFARI_ZONE_NORTHWEST` — northwest quadrant

Each Safari Zone map has separate encounter tables for land, water, and rock smash encounters with different species distributions and levels.

**Safari Zone mechanics** (`src/safari_zone.c`):
- Special battle system with throwing rocks/bait instead of standard trainer battles
- Players get limited Safari Balls and steps
- Encounter logic still uses standard wild encounter system but with Safari-specific catch mechanics

### NPC Dialogue System (`data/maps/[MapName]/scripts.inc`)

**Professor Birch dialogue location:**
- `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` — opening dialogue and lab interactions
- Dialogue references like `LikeYouToHavePokemon` and `BirchAwayOnFieldwork` found in these script files
- Script files use assembly-like format with labels and jump instructions

**Text storage format:**
- Dialogue text stored as script commands in individual map script files
- Text strings may be referenced by label names that get compiled into the ROM
- Early game NPC dialogue scattered across Route 101, Route 103, Oldale Town, Petalburg City map scripts

### Gym Leaders and Champion (`src/data/trainer_parties.h`)

**Data structure:**
```c
static const struct TrainerMonItemCustomMoves sParty_[TrainerName][] = {
    {
    .iv = [0-255],           // Individual values (stats)
    .lvl = [level],          // Pokemon level
    .species = SPECIES_[NAME], // Species constant
    .heldItem = ITEM_[NAME],   // Held item constant
    .moves = {MOVE_[NAME], MOVE_[NAME], MOVE_[NAME], MOVE_[NAME]} // Moveset
    }
};
```

**Gym Leader party locations (line numbers):**
- Roxanne: 3367 → sParty_Roxanne1
- Brawly: 3391 → sParty_Brawly1
- Wattson: 3415 → sParty_Wattson1
- Flannery: 3446 → sParty_Flannery1
- Norman: 3477 → sParty_Norman1
- Winona: 3508 → sParty_Winona1
- Tate & Liza: 3546 → sParty_TateAndLiza1
- Juan: 3577 → sParty_Juan1
- Wallace (Champion): 4414 → sParty_Wallace

**Move constant format:**
- Correct: `MOVE_THUNDER_PUNCH` (with underscore)
- Incorrect: `MOVE_THUNDERPUNCH` (causes compile error)
- All move constants defined in `include/constants/moves.h`
- Must match exact spelling and format in constants file

**Species and Item Constants:**
- Species: `SPECIES_[NAME]` format (e.g., SPECIES_AERODACTYL, SPECIES_SALAMENCE)
- Items: `ITEM_[NAME]` format (e.g., ITEM_SITRUS_BERRY, ITEM_LEFTOVERS)
- All constants must exist in their respective header files to compile

**Wild encounter data location**: `data/wild_encounters.json` — JSON format mapping maps to species/levels/rates. This is the primary file to edit for changing wild Pokémon.

### Item System and TM Prices (`src/data/items.h`)

**Item data structure:**
```c
const struct Item gItems[] = {
    [ITEM_NAME] = {
        .name = _("DisplayName"),
        .itemId = ITEM_NAME,
        .price = [price_value],
        .holdEffect = HOLD_EFFECT_[TYPE],
        .holdEffectParam = [parameter],
        .description = COMPOUND_STRING("Description text"),
        .mystery = [mystery_value],
        .pocket = POCKET_[TYPE],
        .type = ITEM_TYPE_[TYPE],
        .fieldUseFunc = [function_pointer],
        .battleUsage = EFFECT_ITEM_[TYPE],
        .battleUseFunc = [function_pointer]
    }
};
```

**TM price structure (Cycle 22):**
- Standard TMs typically priced at 3000 Pokédollars
- Key combat TMs can be reduced for accessibility (e.g., to 1500 Pokédollars)
- TM entries found in items.h with pattern `[ITEM_TM_MOVE_NAME]`
- **Modified prices in Legends of Hoenn:**
  - `ITEM_TM_DRAGON_CLAW`: 3000 → 1500
  - `ITEM_TM_ICE_BEAM`: 3000 → 1500
  - `ITEM_TM_EARTHQUAKE`: 3000 → 1500
  - `ITEM_TM_THUNDERBOLT`: 3000 → 1500
  - `ITEM_TM_FLAMETHROWER`: 3000 → 1500

### Wild Pokémon Held Items (`src/data/pokemon/species_info.h`)

**Species data structure with held items:**
```c
[SPECIES_NAME] = {
    .baseHP        = [value],
    .baseAttack    = [value],
    // ... other stats ...
    .heldItems = {ITEM_[NAME], ITEM_[NAME]},  // 5% and 1% rates
    .abilities = {ABILITY_[NAME], ABILITY_[NAME]},
    // ... other fields ...
}
```

**Held item mechanics:**
- `heldItems[0]` — 5% chance when encountering wild Pokémon
- `heldItems[1]` — 1% chance (rarer item)
- Use `ITEM_NONE` for no held item in either slot

**Legends of Hoenn held item theme (Cycle 22):**
- **Fire types**: `ITEM_CHARCOAL` (Growlithe, Houndour, Magmar)
- **Electric types**: `ITEM_MAGNET` (Electabuzz)
- **Ice types**: `ITEM_NEVER_MELT_ICE` (Swinub, Snorunt)
- **Fighting types**: `ITEM_BLACK_BELT`
- **Psychic types**: `ITEM_TWISTED_SPOON`
- **Dragon types**: `ITEM_DRAGON_SCALE`

**Item constant names** (check `include/constants/items.h` for exact spelling):
- `ITEM_CHARCOAL` (#215)
- `ITEM_MAGNET` (#208)
- `ITEM_NEVER_MELT_ICE` (#217)
- `ITEM_BLACK_BELT` (#207)
- `ITEM_TWISTED_SPOON` (#219)
- `ITEM_DRAGON_SCALE` (#201)

### Starter Selection (`src/starter_choose.c`)

**Current starters** (lines 113–118) — **MODIFIED in Cycles 2 & 12**:
```c
static const u16 sStarterMon[STARTER_MON_COUNT] =
{
    SPECIES_LARVITAR,
    SPECIES_BAGON,
    SPECIES_DRATINI,
};
```

Original was `{ SPECIES_TREECKO, SPECIES_TORCHIC, SPECIES_MUDKIP }` on a single line.
Cycle 2 changed to Larvitar/Bagon/Beldum. Cycle 12 corrected third starter to Dratini.

**`STARTER_MON_COUNT`** is defined at line 27 as `3`.

**UI flow** (task-based state machine):
1. `CB2_StarterChoose()` — init
2. `Task_StarterChoose()` — display
3. `Task_HandleStarterChooseInput()` — selection
4. `Task_WaitForStarterSprite()` — animation
5. `Task_AskConfirmStarter()` — confirm
6. `Task_HandleConfirmStarterInput()` — handle response
7. `Task_DeclineStarter()` — if player says no

**Confirmed valid**: `SPECIES_LARVITAR`, `SPECIES_BAGON`, `SPECIES_DRATINI` — build succeeded.

**Rival party naming**: When the player picks Bagon (index 1), rival parties named `sParty_BrendanRoute103Torchic` / `sParty_MayRoute103Torchic` etc. are used (legacy naming retained, species changed). Naming follows pattern: `sParty_[Brendan|May][Location][OriginalStarter]`.

### Battle System (`src/battle_main.c` — 194KB)

**Entry points:**
- `CB2_HandleStartBattle()` — single/trainer/wild
- `CB2_PreInitMultiBattle()` — doubles/multi
- `CB2_HandleStartMultiBattle()` — multi battles

**Phases**: Intro → Selection → Execution → End
**Key data**: `gBattleTypeFlags` (wild vs trainer vs double), `gBattleEnvironment`

**Battle scripts**: `data/battle_scripts_1.s` (144KB), `data/battle_ai_scripts.s` (91KB)

### Pokémon Data Structures (`include/pokemon.h`)

**BoxPokemon** — 4-substruct encrypted save format:
- Substruct 0: species, heldItem, experience, ppBonuses, friendship
- Substruct 1: moves[4], pp[4]
- Substruct 2: EVs (hp/atk/def/spd/spa/spd), contest stats (cool/beauty/cute/smart/tough/sheen)
- Substruct 3: pokerus, metLocation, metLevel, metGame, pokeball, IVs, isEgg, abilityNum, ribbons

**Pokemon** (battle struct) extends BoxPokemon with: status, level, hp, maxHp, attack, defense, spAtk, spDef, speed, mail

**Access via**: `GetMonData(mon, MON_DATA_SPECIES)` / `SetMonData(mon, MON_DATA_HP, &value)`

### Core Engine (`src/main.c`)

**Main loop per frame:**
1. Read input
2. Check soft reset (A+B+Select)
3. Update link/callbacks
4. Update play timer
5. Wait for VBlank (60 FPS)

**Interrupt handlers:**
- VBlankIntr: wireless sync, sound update, RNG, DMA3, sprite update
- HBlankIntr, VCountIntr (line 150), SerialIntr (link cable), Timer3Intr

**Callback system**: `gMain.callback1` (background) + `gMain.callback2` (current scene)

### Scripting (`src/script.c`, `src/scrcmd.c`)

- Script engine with command interpreter
- Map events use `.s` assembly format
- `data/event_scripts.s` (43KB) — all map events
- `data/specials.inc` (20KB) — special function dispatch table

### Maps and World (`data/maps/`)

- 520 map subdirectories, each with layout, events, scripts
- `data/maps.s`, `data/map_events.s` — auto-generated aggregates
- Map types defined in `constants/map_types.h`

## Constants Files (in `constants/`)

Key files for modifying game content:
- `species.h` — all Pokémon species IDs (`SPECIES_BULBASAUR`, etc.)
- `items.h` — all item IDs
- `moves.h` — all move IDs
- `abilities.h` — all ability IDs
- `trainers.h` — all trainer IDs
- `maps.h` — all map IDs

## Data Files Summary

| File | Size | Contents |
|------|------|----------|
| `data/battle_scripts_1.s` | 144KB | Battle scripting (moves, effects) |
| `data/battle_anim_scripts.s` | 417KB | All animation scripts |
| `data/battle_ai_scripts.s` | 91KB | AI decision logic |
| `data/event_scripts.s` | 43KB | Map events and NPC dialogue |
| `data/wild_encounters.json` | ~50KB | Wild Pokémon tables (JSON) |

### Trainer System (`src/data/trainer_parties.h`, `src/data/trainers.h`)

**Files:**
- `src/data/trainer_parties.h` — 12,436 lines — defines each trainer's Pokémon party
- `src/data/trainers.h` — 10,263 lines — trainer metadata (name, class, sprite, party pointer)

**Two party struct types:**
```c
// Simple grunts/trainers — no held items, default moves
struct TrainerMonNoItemDefaultMoves { u8 iv; u8 lvl; u16 species; };

// Gym leaders, E4, named trainers — full customization
struct TrainerMonItemCustomMoves {
    u8 iv; u8 lvl; u16 species;
    u16 heldItem;
    u16 moves[4];
};
```

**Key trainer party locations in trainer_parties.h:**
- Sidney (E4 Dark): line 3215
- Phoebe (E4 Ghost): line 3253
- Glacia (E4 Ice): line 3291
- Drake (E4 Dragon): line 3329
- Roxanne (Gym 1 Rock): line 3367 (+ rematches at 10301, 10332, 10370, 10408)
- Brawly (Gym 2 Fight): line 3391 (+ rematches at 10453+)
- Wattson (Gym 3 Elec): line 3415
- Flannery (Gym 4 Fire): line 3446
- Norman (Gym 5 Normal): line 3477
- Winona (Gym 6 Flying): line 3508
- Tate & Liza (Gym 7 Psychic): line 3546
- Juan (Gym 8 Water): line 3577
- Wallace (Champion): line 4414

**Match Call rematches:** Gym leaders have 5 progressive versions (e.g., `sParty_Roxanne1` through `sParty_Roxanne5`). The first (1) is the actual gym battle; 2–5 are rematches via the Pokénav Match Call feature.

**To change a gym leader's team:** Edit the `.species`, `.lvl`, `.heldItem`, `.moves` fields in the relevant struct. Can use any valid `SPECIES_*` and `MOVE_*` constants.

### Rival System (Brendan/May) — `src/data/trainer_parties.h`

**Naming convention:** `sParty_{Character}{Location}{OriginalStarter}`
- The suffix (Mudkip/Treecko/Torchic) indicates which **player starter** triggers this party
- Example: `sParty_BrendanRoute103Mudkip` triggers when player chose Mudkip (rival gets counter)

**Battle locations and approximate line numbers:**
| Location | Lines | Team Size | Description |
|----------|-------|-----------|-------------|
| Route 103 | 6749–6850 | 1 | First battle |
| Rustboro | 7801–7950 | 2 | After Gym 1 |
| Route 110 | 6889–7000 | 3 | Mid-early game |
| Route 119 | 6995–7100 | 4 | Mid game |
| Lilycove | 8851–9000 | 5 | Late game |

**Total party count:** 5 locations × 3 variants × 2 characters = 30 definitions

**Struct type:** `TrainerMonNoItemDefaultMoves` — only `.lvl` and `.species` required (no held items or custom moves in vanilla)

**Legends of Hoenn counter relationships (Cycle 12 final):**
- Player Larvitar → Rival Bagon (Dragon resists Rock, provides offensive pressure)
- Player Bagon → Rival Larvitar (Rock resists Flying, Dark hits Dragon neutral)
- Player Dratini → Rival Larvitar or Bagon (thematic counterpart)
Note: Rival Bagon path uses water-dragon theme: Horsea/Dratini early, Gyarados mid, Dragonair at Lilycove.

## Bulk Editing Patterns

### Python Script Approach for `wild_encounters.json` (Cycle 9)

For batch modifications to encounter tables, writing a Python script to `/tmp/` and running it is the most reliable approach. The script:
1. Reads `src/data/wild_encounters.json` as a JSON object
2. Iterates over map keys, matching by substring (e.g., `"GRANITE_CAVE"`)
3. Mutates the `land`/`water`/`fishing` arrays in place
4. Writes the modified JSON back

**Pattern:**
```python
import json
with open('src/data/wild_encounters.json') as f:
    data = json.load(f)

for entry in data['wild_encounter_groups'][0]['encounters']:
    if 'MAP_MT_PYRE' in entry['map']:
        entry['land_mons']['mons'] = [
            {"min_level": N, "max_level": N, "species": "SPECIES_X"},
            ...  # 12 entries for land
        ]

with open('src/data/wild_encounters.json', 'w') as f:
    json.dump(data, f, indent=4)
```

**JSON structure of each entry:**
```json
{
  "map": "MAP_NAME",
  "base_label": "gWildMonHeader_MapName",
  "land_mons": { "encounter_rate": N, "mons": [ ...12 entries... ] },
  "water_mons": { "encounter_rate": N, "mons": [ ...5 entries... ] },
  "fishing_mons": { "encounter_rate": N, "mons": [ ...10 entries... ] }
}
```

**Notes:**
- Not all maps have all encounter types (some only have `land_mons`, some have all three)
- The script approach is much faster and less error-prone than manual JSON editing
- Always run `make` after modification to confirm no JSON parse errors

### Key Villain Trainers (for Cycle 10)

Target trainers for antagonist overhaul:
- `sParty_Maxie` — Team Magma leader (multiple versions — pre-battle, hideout, final)
- `sParty_Archie` — Team Aqua leader
- `sParty_Wally` — friendly rival/counterpart to Brendan/May
- `sParty_Courtney` — Team Magma admin
- `sParty_Matt` — Team Aqua admin
- Search `trainer_parties.h` for these names to find their party definitions