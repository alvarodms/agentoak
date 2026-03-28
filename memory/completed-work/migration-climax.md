# Migration Climax (Ho-Oh Encounter) — Completed Work Detail

| File | Cycle | Changes |
|------|-------|---------|
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **115** | Replaced `BirchLab_EventScript_AllBeastsDone` simple congratulations with multi-part revelation scene: camera shake, Ho-Oh cry, Birch explains beasts-as-scouts lore, sets `FLAG_LEGENDS_AWAKENED`, directs player to Cave of Origin. Added `BirchLab_EventScript_ClimaxReminder` for repeat visits. Gate check: if FLAG_LEGENDS_AWAKENED already set, shows reminder instead of replay. |
| `data/maps/CaveOfOrigin_UnusedRubySapphireMap3/scripts.inc` | **115** | Full Ho-Oh legendary encounter script modeled on NavelRock_Top. White fadescreen reveal, ShakeCamera, seteventmon SPECIES_HO_OH lv70, StartLegendaryBattle. Handles caught/defeated/ran outcomes. Access gate: setwarp back to Map2 if FLAG_LEGENDS_AWAKENED not set. OnResume removes Ho-Oh sprite after catch. |
| `data/maps/CaveOfOrigin_UnusedRubySapphireMap3/map.json` | **115** | Added Ho-Oh object event (OBJ_EVENT_GFX_HOOH at 9,3, FLAG_HIDE_HO_OH), coord_event trigger (9,7 VAR_TEMP_1), disabled flash requirement, disabled cycling. |

## Status: COMPLETE (C115)

All three phases of Feature B delivered:
- Birch revelation scene with cinematic effects
- Ho-Oh encounter in Cave of Origin depths (vanilla unused RS map repurposed)
- Access gate via FLAG_LEGENDS_AWAKENED + setwarp fallback
