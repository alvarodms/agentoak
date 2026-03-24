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
| `src/data/wild_encounters.json` | Routes 110-113 mid-game encounter audit | **91** | 12 migration species across 4 routes (Mareep, Machop, Electabuzz, Larvitar, Phanpy, Nidoran♂, Poliwag, Nidoran♀, Magmar, Houndour, Murkrow, Sneasel). Levels 16-22. Each route 7-9 unique species. |
| `src/data/wild_encounters.json` | Routes 119-120 encounter audit | **92** | 6 migration species: Chinchou (14%, R119), Corsola (11%, R119), Poliwhirl (R119), Sneasel (11%, R120), Flaaffy (10%, R120), Nidorina (5%, R120). Togetic preserved at 1% R120. Winona counter-picks: Electric (Chinchou/Flaaffy) + Ice (Sneasel/Chinchou Ice Beam). |
| `src/data/wild_encounters.json` | Route 104 + Route 123 + Mt. Pyre 2F-6F + Summit (8 tables) | **98** | Pillar 1a: Route 104 slots 6-11 → Meowth, Mareep, Vulpix, Aron (20%). Route 123 slots 6-9,11 → Vulpix, Meowth, Houndour, Murkrow (19%, Kecleon preserved). Mt. Pyre floor progression: 2F-3F Misdreavus+Houndour (10%), 4F-5F +Murkrow (15%), 6F +Sneasel (19%), Summit evolved forms Houndoom+Weavile (19%, Chimecho preserved). |
| `src/data/wild_encounters.json` | Seafloor Cavern (8 rooms) + New Mauville (2 tables) = 10 tables | **99** | Pillar 1b: Seafloor Cavern room-by-room power curve: R1-2 Aron+Larvitar (2%), R3-4 (5%), R5-6 Sneasel+Lairon+Pupitar (10%), R7 4 species (11%), R8 peak (15% w/ dual Pupitar). New Mauville: Flaaffy (5%), Electabuzz (4%), Riolu (1%). Both Inside and Entrance tables updated. |
