# Migration Climax (Ho-Oh Encounter) — Completed Work Detail

| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **115** | Replaced `BirchLab_EventScript_AllBeastsDone` simple congratulations with multi-part revelation scene: camera shake, Ho-Oh cry, Birch explains beasts-as-scouts lore, sets `FLAG_LEGENDS_AWAKENED`, directs player to Cave of Origin. Added `BirchLab_EventScript_ClimaxReminder` for repeat visits. Gate check: if FLAG_LEGENDS_AWAKENED already set, shows reminder instead of replay. |
| `data/maps/CaveOfOrigin_UnusedRubySapphireMap3/scripts.inc` | **115** | Full Ho-Oh legendary encounter script modeled on NavelRock_Top. White fadescreen reveal, ShakeCamera, seteventmon SPECIES_HO_OH lv70, StartLegendaryBattle. Handles caught/defeated/ran outcomes. Access gate: setwarp back to Map2 if FLAG_LEGENDS_AWAKENED not set. OnResume removes Ho-Oh sprite after catch. |
| `data/maps/CaveOfOrigin_UnusedRubySapphireMap3/map.json` | **115** | Added Ho-Oh object event (OBJ_EVENT_GFX_HOOH at 9,3, FLAG_HIDE_HO_OH), coord_event trigger (9,7 VAR_TEMP_1), disabled flash requirement, disabled cycling. |

| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **116** | Added `FLAG_CAUGHT_HO_OH` check before `FLAG_LEGENDS_AWAKENED` in `BirchLab_EventScript_MigrationComplete`. New `BirchLab_EventScript_HoOhCaught` script + `BirchLab_Text_HoOhCaught` — Birch reflects on the journey, seeds v6.0 hook ("the instruments have not fully quieted... new readings... deeper"). |
| `data/maps/MauvilleCity/scripts.inc` | **116** | Added `FLAG_CAUGHT_HO_OH` check at top of `MauvilleCity_EventScript_BeastSighting`. New post-climax script+text — engineer notes stable grid, hints at "deep hum" (v6.0 seed). |
| `data/maps/LilycoveCity/scripts.inc` | **116** | Added `FLAG_CAUGHT_HO_OH` check at top of `LilycoveCity_EventScript_BeastSighting`. New post-climax script+text — sailor describes golden sky, calm seas. |
| `data/maps/MossdeepCity/scripts.inc` | **116** | Added `FLAG_CAUGHT_HO_OH` check at top of `MossdeepCity_EventScript_BeastSighting`. New post-climax script+text — researcher describes satellite capture of entire event. |

| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **118** | Extended `BirchLab_EventScript_HoOhCaught` with Primal Stirring trigger: camera shake + explosion SFX, 3-part dialogue (instruments spike, sacred fire resonated down, 3 anomaly sites to investigate), sets `FLAG_PRIMAL_STIRRING_STARTED`. Added `BirchLab_EventScript_PrimalProgress` (reminder dialogue) and `BirchLab_EventScript_PrimalNextPhase` (placeholder for C120+). 6 new text blocks. |
| `include/constants/flags.h` | **118** | Replaced unused flags 0x264-0x26F with 12 named v6.0 progression flags: `FLAG_PRIMAL_STIRRING_STARTED` through `FLAG_PRIMAL_CRISIS_RESOLVED`. |

## C120 — Primal Sighting Network DEPLOYED

| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/LavaridgeTown/scripts.inc` | **120** | Added `TremorWatcher` NPC — dual dialogue (normal/stirring), sets `FLAG_TREMORS_INVESTIGATED` |
| `data/maps/LavaridgeTown/map.json` | **120** | Added object event: OBJ_EVENT_GFX_WOMAN_2 at (7,5) |
| `data/maps/DewfordTown/scripts.inc` | **120** | Added `TideWatcher` NPC — dual dialogue, sets `FLAG_TIDES_INVESTIGATED` |
| `data/maps/DewfordTown/map.json` | **120** | Added object event: OBJ_EVENT_GFX_FISHERMAN at (14,11) |
| `data/maps/FieryPath/scripts.inc` | **120** | Added `TremorHiker` NPC — dual dialogue (flavor, no flag) |
| `data/maps/FieryPath/map.json` | **120** | Added object event: OBJ_EVENT_GFX_HIKER at (12,15) |
| `data/maps/SlateportCity/scripts.inc` | **120** | Added `HarborWatcher` NPC — dual dialogue (flavor, no flag) |
| `data/maps/SlateportCity/map.json` | **120** | Added object event: OBJ_EVENT_GFX_FAT_MAN at (27,25) |
| `data/maps/Route111/scripts.inc` | **120** | Added `DesertResearcher` NPC — dual dialogue (flavor, no flag) |
| `data/maps/Route111/map.json` | **120** | Added object event: OBJ_EVENT_GFX_SCIENTIST_1 at (18,62) |
| `data/maps/PacifidlogTown/scripts.inc` | **120** | Added `TideElder` NPC — dual dialogue (flavor, no flag) |
| `data/maps/PacifidlogTown/map.json` | **120** | Added object event: OBJ_EVENT_GFX_OLD_MAN at (13,19) |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **120** | Expanded `PrimalProgress` — checks FLAG_TREMORS/TIDES_INVESTIGATED, revelation scene with AllSignsIntro/Reveal/Directive, sets FLAG_ALL_SIGNS_REPORTED. Updated PrimalNextPhase text (Regi directive). |

## C121 — Terra Cave & Seafloor Cavern Investigation NPCs

| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/TerraCave_End/scripts.inc` | **121** | Added `DevonResearcher` NPC — dual dialogue (full/short), sets `FLAG_TERRA_CAVE_INVESTIGATED` (0x270) |
| `data/maps/TerraCave_End/map.json` | **121** | Added object event: OBJ_EVENT_GFX_SCIENTIST_1 at (7,6) |
| `data/maps/SeafloorCavern_Room9/scripts.inc` | **121** | Added `DeepSeaResearcher` NPC — dual dialogue, sets `FLAG_SEAFLOOR_CAVERN_INVESTIGATED` (0x271) |
| `data/maps/SeafloorCavern_Room9/map.json` | **121** | Added object event: OBJ_EVENT_GFX_SCIENTIST_2 at (8,6) |
| `include/constants/flags.h` | **121** | Replaced 0x270-0x271 unused flags with investigation flags |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **121** | PrimalNextPhase now gates on both investigation flags; new `PrimalInvestigateCaves` dialogue directs player to Terra Cave + Seafloor Cavern |

## C122 — Magma/Aqua Remnant Trainers

| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/TerraCave_Entrance/map.json` | **122** | Added Magma Grunt 1 object event (10,10) — TRAINER_TYPE_NORMAL, sight 4 |
| `data/maps/TerraCave_Entrance/scripts.inc` | **122** | Magma Grunt 1 trainer battle + 3 text blocks (intro/defeat/post) |
| `data/maps/TerraCave_End/map.json` | **122** | Added Magma Grunt 2 (10,12) + Magma Admin (8,8) object events |
| `data/maps/TerraCave_End/scripts.inc` | **122** | Magma Grunt 2 + Admin Courtney trainer battles + 6 text blocks. Admin dialogue references player's role, foreshadows Rayquaza |
| `data/maps/SeafloorCavern_Room1/map.json` | **122** | Added Aqua Grunt 1 object event (10,13) |
| `data/maps/SeafloorCavern_Room1/scripts.inc` | **122** | Aqua Grunt 1 trainer battle + 3 text blocks |
| `data/maps/SeafloorCavern_Room5/map.json` | **122** | Added Aqua Grunt 2 object event (8,10) |
| `data/maps/SeafloorCavern_Room5/scripts.inc` | **122** | Aqua Grunt 2 trainer battle + 3 text blocks |
| `data/maps/SeafloorCavern_Room9/map.json` | **122** | Added Aqua Admin object event (11,8) |
| `data/maps/SeafloorCavern_Room9/scripts.inc` | **122** | Admin Amber trainer battle + 3 text blocks. References Ho-Oh awakening, Kyogre's song, foreshadows Rayquaza |
| `include/constants/opponents.h` | **122** | 6 new IDs (876-881), TRAINERS_COUNT→882 |
| `src/data/trainer_parties.h` | **122** | 6 party arrays: grunt teams 3 mons each w/ held items, admin teams 4 mons each w/ custom movesets |
| `src/data/trainers.h` | **122** | 6 trainer entries: grunts (standard AI), admins (SETUP_FIRST_TURN + FULL_RESTORE) |

## Status: v6.0 Act 2 COMPLETE — dungeon encounters, investigation NPCs, and remnant trainers deployed
