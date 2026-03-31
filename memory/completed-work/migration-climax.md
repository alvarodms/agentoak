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

## C122 — Magma/Aqua Remnant Trainers (REVERTED — build failed)

C122 attempted 6 trainers but was reverted. C123 re-implemented successfully.

## C123 — Magma/Aqua Remnant Trainers (partial — trainer entries + map.json only)

| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/TerraCave_Entrance/map.json` | **123** | Added Magma Grunt 1 object event (10,10) — TRAINER_TYPE_NORMAL, sight 4 |
| `data/maps/TerraCave_End/map.json` | **123** | Added Magma Grunt 2 (12,12) + Magma Admin (15,18) object events |
| `data/maps/SeafloorCavern_Room9/map.json` | **123** | Added 3 Aqua object events: Grunt 1 (10,8), Grunt 2 (14,15), Admin (11,25) |
| `include/constants/opponents.h` | **123** | 6 new IDs (876-881), TRAINERS_COUNT→882, MAX_TRAINERS_COUNT→882 |
| `src/data/trainers.h` | **123** | 6 trainer entries (struct only — party arrays were NOT added) |

**NOTE**: C123 claimed "clean build" but was actually broken — trainer party arrays (trainer_parties.h) and battle scripts (scripts.inc) were NOT committed. Fixed in C124.

## C124 — Primal Awakening: Groudon & Kyogre Static Encounters + C123 Build Fixes

### C123 Build Fixes (prerequisite)
| File | Cycle | Changes |
|------|-------|---------|
| `src/data/trainer_parties.h` | **124** | Added all 6 missing C123 party arrays: MagmaGruntTerraCave1/2, MagmaAdminTerraCave, AquaGruntSeafloor1/2, AquaAdminSeafloor. Grunts: 2 mons Lv44-46, Admins: 3 mons Lv47-48 with custom movesets |
| `data/maps/TerraCave_Entrance/scripts.inc` | **124** | Added missing MagmaGrunt1 trainer battle script + 3 text blocks |
| `data/maps/TerraCave_End/scripts.inc` | **124** | Added missing MagmaGrunt2 + MagmaAdmin (Courtney) trainer battle scripts + 7 text blocks |
| `data/maps/SeafloorCavern_Room9/scripts.inc` | **124** | Added missing AquaGrunt1/2 + AquaAdmin (Amber) trainer battle scripts + 9 text blocks |
| `data/maps/SlateportCity/scripts.inc` | **124** | Added missing HarborWatcher NPC script + text (primal stirring flavor) |

### Primal Groudon Encounter (Terra Cave End)
| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/TerraCave_End/scripts.inc` | **124** | Modified OnTransition: added `TryShowPrimalGroudon` — gates on FLAG_ALL_SIGNS_REPORTED + FLAG_TERRA_CAVE_INVESTIGATED, sets VAR_TEMP_1=2. New `PrimalGroudon` encounter script: weather→SUNNY, SE_M_EARTHQUAKE, ShakeCamera, cinematic text, setwildbattle Lv70. Caught/defeated/fled branches set primal flags + normalize weather. 3 text blocks (awaken/caught/fled) |
| `data/maps/TerraCave_End/map.json` | **124** | Added second coord_event at (17,26) VAR_TEMP_1=2 → PrimalGroudon script |

### Primal Kyogre Encounter (Seafloor Cavern Room 9)
| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/SeafloorCavern_Room9/scripts.inc` | **124** | Replaced empty MapScripts with ON_TRANSITION + ON_RESUME. TryShowPrimalKyogre: gates on primal flags + investigation flags, controls Kyogre visibility + VAR_TEMP_1. TryRemoveKyogre: post-catch sprite removal. New PrimalKyogre encounter: weather→RAIN, SE_M_HYDRO_PUMP, ShakeCamera, cinematic text, setwildbattle Lv70. Caught/defeated/fled branches. 3 text blocks |
| `data/maps/SeafloorCavern_Room9/map.json` | **124** | Added coord_event at (17,42) VAR_TEMP_1=0 → PrimalKyogre script |

## C125 — World Reaction + v6.0 Ship

| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **125** | Added `BirchLab_EventScript_PrimalDebrief` (cinematic debrief scene: stabilized readings, responsibility reflection, Rayquaza atmospheric anomaly tease), `BirchLab_EventScript_PrimalResolved` (repeat visit), `BirchLab_EventScript_CheckKyogre` (both-primals-done gate). Sets `FLAG_PRIMAL_CRISIS_RESOLVED`. 6 new text blocks. |
| `data/maps/LavaridgeTown/scripts.inc` | **125** | Added `goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED` to TremorWatcher + `TremorWatcherResolved` script+text (hot springs calm) |
| `data/maps/DewfordTown/scripts.inc` | **125** | Added `goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED` to TideWatcher + `TideWatcherResolved` script+text (seas settled) |
| `data/maps/FieryPath/scripts.inc` | **125** | Added `goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED` to TremorHiker + `TremorHikerResolved` script+text (ground stopped shaking) |
| `data/maps/SlateportCity/scripts.inc` | **125** | Added complete `HarborWatcher` NPC script (base script was missing from C120/C124) with normal/stirring/resolved variants |
| `data/maps/Route111/scripts.inc` | **125** | Added `goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED` to DesertResearcher + `DesertResearcherResolved` script+text (seismic baseline) |
| `data/maps/PacifidlogTown/scripts.inc` | **125** | Added `goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED` to TideElder + `TideElderResolved` script+text (old tales were true) |

## Status: v6.0 COMPLETE — "The Primal Stirring" arc shipped with world reaction and Rayquaza v7.0 hook
