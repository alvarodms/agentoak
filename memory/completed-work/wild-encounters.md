# Wild Encounters

Modified files related to wild Pokémon encounter tables.

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/data/wild_encounters.json` | All 73 route encounter tables | 3, 4 | Complete regional overhaul |
| `src/data/wild_encounters.json` | 34 dungeon encounter tables | 9, 21 | 11 key dungeons overhauled |
| `src/data/wild_encounters.json` | Safari Zone (6 tables) | 14 | Dratini, Gible, Horsea, Larvitar, Bagon |
| `src/data/wild_encounters.json` | Fairy corridors (5 locations) | 47, 49 | Granite Cave B2F: Ralts (10%), Route 118: Snubbull (15%), Route 121: Clefairy (20%), Route 120: Togetic (1%), Mt. Pyre 1F: Snubbull (10%) |
| `src/data/wild_encounters.json` | Route 103 migration species fix | 52 | Replaced vanilla encounters (Poochyena/Zigzagoon/Wingull) with migration species: Growlithe (17%), Meowth (25%), Wingull (17%), Poliwag (17%), Abra (25%) |
| `src/data/wild_encounters.json` | Second Wave encounter tables (6 routes) | **63** | Routes 118-121, 123, Mt. Pyre 1F — alternate tables with 14 new species + evolved first-wave forms |
| `src/wild_encounter.c` | Second Wave C code (conditional table swap) | **63** | Altering Cave pattern: FLAG_SECOND_WAVE → i++ for 6 eastern routes |
| `include/constants/flags.h` | FLAG_SECOND_WAVE + FLAG_SECOND_WAVE_BIRCH_CALL | **63** | Repurposed FLAG_UNUSED_0x020/0x021 |
| `src/data/wild_encounters.json` | Route 103: Growlithe→Vulpix (slots 0-1) | **86** | Issue #69 fix — Growlithe at lv2-3 spammed Roar ending wild battles. Vulpix keeps Fire type, knows Ember at lv1 instead. |
