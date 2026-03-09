# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

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

**Wild encounter data location**: `data/wild_encounters.json` — JSON format mapping maps to species/levels/rates. This is the primary file to edit for changing wild Pokémon.

### Starter Selection (`src/starter_choose.c`)

**Starters defined** (line ~15):
```c
static const u16 sStarterMon[3] = { SPECIES_TREECKO, SPECIES_TORCHIC, SPECIES_MUDKIP };
```

**UI flow** (task-based state machine):
1. `CB2_StarterChoose()` — init
2. `Task_StarterChoose()` — display
3. `Task_HandleStarterChooseInput()` — selection
4. `Task_WaitForStarterSprite()` — animation
5. `Task_AskConfirmStarter()` — confirm
6. `Task_HandleConfirmStarterInput()` — handle response
7. `Task_DeclineStarter()` — if player says no

To change starters: modify `sStarterMon[]` array with different `SPECIES_*` constants.

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
