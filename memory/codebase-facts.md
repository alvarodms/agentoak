# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Repository Structure

### Directory Layout
- **src/** - C source code (~316 files, ~421k total lines)
  - Main game logic: battle system, overworld, wild encounters, pokemon data
  - Files organized by system (e.g., battle_*, field_*, pokemon_*)

- **include/** - Header files (~242 files)
  - Core headers: global.h, pokemon.h
  - Constants headers in include/constants/ (species.h, moves.h, items.h, etc.)

- **data/** - Game data (mostly headers with data arrays)
  - pokemon/ - Species info, learnsets, evolution, egg moves
  - maps/ - Map definitions (JSON format)
  - scripts/ - Event scripts, battle scripts
  - wild_encounters.json - Wild Pokemon encounter tables

- **graphics/** - Sprite and tileset data (PNG format)
  - Organized by type (pokemon/, trainer/, interface/, etc.)

- **constants/** - Constant definitions
  - species.h - All Pokemon species IDs (SPECIES_BULBASAUR = 1, etc.)

- **tools/** - Build tools (bin2c, gbagfx, mapjson, scaninc, etc.)

### Build System
- **Makefile** - GNU Make build system
- Requires ARM cross-compiler toolchain (arm-none-eabi-*)
- Builds to pokeemerald.gba
- Modern and non-modern build modes available
- Tools must be compiled before ROM can be built

## Core Data Structures

### Pokemon Data (include/pokemon.h, src/data/pokemon/)
- **SpeciesInfo struct** (src/data/pokemon/species_info.h) - Base stats, types, abilities, egg groups, growth rate, catch rate, EV yields
- **Level-up learnsets** (src/data/pokemon/level_up_learnsets.h) - Uses LEVEL_UP_MOVE(lvl, move) macro
- **Evolution data** (src/data/pokemon/evolution.h)
- **TM/HM learnsets** (src/data/pokemon/tmhm_learnsets.h)
- **Pokedex entries** (src/data/pokemon/pokedex_entries.h, pokedex_text.h)

### Wild Encounters (src/wild_encounter.c, src/data/wild_encounters.json)
- JSON format with land_mons, water_mons, rock_smash_mons, fishing_mons
- Each map has encounter tables with species, min/max levels
- Encounter rates defined per area type
- Special handling for Feebas spots on Route 119

### Maps (data/maps/)
- Each map has its own directory
- **map.json** - Map configuration (connections, weather, music, allow_cycling, object_events)
- **scripts.inc** - Event scripts for the map
- Maps reference LAYOUT constants for tileset/layout data
- Object events have graphics_id, position, movement_type, trainer_type, scripts, flags

### Battle System (src/battle_*.c files)
- Highly modular: separate files for animations, controllers, AI, effects
- battle_script_commands.c - Battle script interpreter
- battle_controllers.c - Player, opponent, partner, link controllers
- Type-specific animation files (battle_anim_fire.c, battle_anim_water.c, etc.)

## Key Constants

### Species Constants (include/constants/species.h)
- SPECIES_NONE = 0
- SPECIES_BULBASAUR = 1 through SPECIES_DEOXYS = 386
- Used throughout codebase to reference Pokemon

### File Paths
- Wild encounter data: src/data/wild_encounters.json (341KB JSON file)
- Species info: src/data/pokemon/species_info.h
- Learnsets: src/data/pokemon/level_up_learnsets.h
- Route 101 map: data/maps/Route101/map.json

## Important Systems

### Overworld (src/overworld.c)
- Main overworld loop and state management
- Integrates: field effects, events, camera, weather, player avatar, wild encounters
- Heavy include dependencies (~60+ headers)

### Wild Encounters (src/wild_encounter.c)
- 967 lines
- Handles encounter rate calculation
- Repel mechanics
- Ability-based encounter modification (Keen Eye, etc.)
- Fishing rod tiers (old rod, good rod, super rod)
