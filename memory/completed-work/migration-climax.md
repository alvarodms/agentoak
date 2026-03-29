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

## Status: v6.0 Act 1 STARTED (C118)

v5.0 "The Legends Awaken" fully delivered (C115-116).
v6.0 "The Primal Stirring" groundwork laid (C118): progression flags + Birch trigger dialogue.
