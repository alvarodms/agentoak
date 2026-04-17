# NPC Dialogue

All modified NPC dialogue files — Professor Birch, Rival, Villains, Gym Leaders, Elite Four, and flavor text NPCs.

---

## Professor Birch

| File | Cycle | Notes |
|------|-------|-------|
| `data/text/birch_speech.inc` | 24 | Opening sequence → migration mystery |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | 15, 180, **181** | Lab aide + Birch rescue; C180: migration hint; C181: difficulty selection multichoice |
| `data/maps/OldaleTown_PokemonCenter_1F/scripts.inc` | 181, **183** | Difficulty-aware reminder NPC |
| `data/maps/RustboroCity_PokemonCenter_1F/scripts.inc` | **183** | Hiker NPC: difficulty-aware level cap explainer |
| `data/maps/DewfordTown_PokemonCenter_1F/scripts.inc` | **183** | Boy NPC: difficulty-aware |
| `data/maps/MauvilleCity_PokemonCenter_1F/scripts.inc` | **183** | Researcher NPC: difficulty-aware |

## Rival, Villains, Gym Leaders

- **Rival** (C25, 29, 36, 38, 94, 104): Routes 103/110/119, LilycoveCity — 4 encounters rewritten with migration theme
- **Villains** (C27, 36, 38): Maxie (MtChimney), Archie (SeafloorCavern, OceanicMuseum, Harbor)
- **Gym Leaders** (C32, 36, 103, **173**): All 8 pre-battle + migration-themed rematch dialogue. C173: Norman/Winona expanded

## Elite Four & Champion — Cycles 33, 42, **203**, **204**

C203: Rewrote Sidney (Murkrow/Houndoom callbacks), Phoebe (Mt. Pyre grandmother + Corsola_Hoenn intro), Glacia (Route 125 cold + migration pilgrim). Each ends with a question. Phoebe team: Banette → Corsola_Hoenn.
C204: Rewrote Drake (Bagon Colony + Draconid legend) and Wallace (The Gathering + Arcanine_Hoenn). Wallace team: Tentacruel → Arcanine_Hoenn. Drake→Wallace bridge + Hall of Fame setup.

## Flavor NPCs (Collapsed by Era)

**Early-game foreshadowing** (C15, 28, 36, 140, 144, 145, 152, **180**, **224**): LittlerootTown→Route 116 migration sightings. 4 glimpse coord_events (R101/102/104/116, flags 0x278-0x27B). Petalburg Woods Pikachu OW sprint (flag 0x27E-0x27F). C180: Birch kids. C224: Mom migration send-off — Running Shoes → 5 Poké Balls + migration dialogue (#135).
**Mid-game escalation** (C29, 94, 95, 141, 149, 153, 154, 159, 160, 162): Weather Institute Dr. Hartley, Meteor Falls Bagon Colony (flag 0x280), Mt. Pyre Restless Dead (flag 0x281), weather omen NPCs (flags 0x282-0x285), route identity NPCs (R110/113/119/123). R119 thunderstorm event (flags 0x27C-0x27D).
**Late-game + The Gathering Storm** (C33, 112, 113, 186, 187, 188, 189, 190, **205**): City atmosphere (Mossdeep/Sootopolis/Pacifidlog badge-gated), ocean route witnesses (R124/126/127/128/131), Deep Migration R128 (flag 0x287), The Gathering R126 (flags 0x288-0x289). C205 "The Exhale": 6 ocean NPCs gain post-Rayquaza resolved dialogue, R126 fog thins.
**Postgame quests** (C116, 118, 120, 135-137, 139, 192, 193, 194, 200, **207**, **209**, **210**): Beast sightings, Primal network, Sky Guardian arc, 4 side quests (Elder's Current/Hartley's Report/Mossdeep Signal/Fog Beneath). C207: Mt. Pyre Coral Mourner NPC. C209: Bagon Colony researcher postgame callback. C210: Deoxys "Second Signal" quest.

## Cross-Gen Evolution Dialogue — Cycles 212-214

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/EverGrandeCity_SidneysRoom/scripts.inc` | **212** | Sidney intro+defeat+rematch rewritten for Honchkrow theme |
| `data/maps/EverGrandeCity_PhoebesRoom/scripts.inc` | **212** | Phoebe intro+rematch rewritten for Dusknoir theme |
| `data/maps/EverGrandeCity_GlaciasRoom/scripts.inc` | **213** | Glacia intro+defeat+rematch rewritten for Froslass/Mamoswine |
| `data/maps/MossdeepCity_Gym/scripts.inc` | **214** | Tate & Liza intro+defeat+post-battle+pre-rematch+rematch-defeat+post-rematch rewritten for Farigiraf/duality theme. TATE:/LIZA: speaker tags throughout. |

## Bagon Colony Researcher Update — Cycles 215, 225

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/MeteorFalls_1F_1R/scripts.inc` | **215**, **225** | PostChampion script: FLAG_BAGON_COLONY_CALLBACK (0x29B) gates first-visit vs. revisit. C215: revisit text hinting at B1F_2R encounter. C225: added 4th state — witness dialogue triggers when player has seen SPECIES_BAGON_HOENN in Pokédex. Uses `ScriptCheckPokedexSeen` special. "They dream of enduring." |
| `include/constants/flags.h` | **215** | FLAG_BAGON_COLONY_CALLBACK at 0x29B |
| `src/script_pokemon_util.c` | **225** | Added `ScriptCheckPokedexSeen()` special — checks if species in VAR_0x8004 has been seen in Pokédex |
| `data/specials.inc` | **225** | Registered `ScriptCheckPokedexSeen` (line 541) |

## Petalburg Difficulty Downgrade NPC — Cycle 214

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/PetalburgCity_PokemonCenter_1F/scripts.inc` | **214** | New NPC: one-way Challenge→Normal downgrade. Multichoice (MULTI_DIFFICULTY_DOWNGRADE=115). Checks FLAG_DIFFICULTY_CHALLENGE. 4 text blocks. |
| `data/maps/PetalburgCity_PokemonCenter_1F/map.json` | **214** | OBJ_EVENT_GFX_MAN_1 at (3,6), MOVEMENT_TYPE_FACE_DOWN |
| `include/constants/script_menu.h` | **214** | Added MULTI_DIFFICULTY_DOWNGRADE (115) |
| `src/data/script_menu.h` | **214** | MultichoiceList_DifficultyDowngrade (2 options), added to sMultichoiceLists[115] |

## Echo Dialogue Layer — Cycle 232

Cross-referencing NPC dialogue connecting all 4 regional forms (Vulpix_Hoenn, Pinsir_Hoenn, Stantler_Hoenn, Corsola_Hoenn) + "Changed Trainer" diegetic motif debut.

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/Route112/scripts.inc` | **232** | NEW: MigrationHiker — references Pinsir_Hoenn (local) + Stantler_Hoenn (R119 ranger report) |
| `data/maps/Route112/map.json` | **232** | Added OBJ_EVENT_GFX_HIKER at (9,34), MOVEMENT_TYPE_FACE_RIGHT |
| `data/maps/Route113/scripts.inc` | **232** | MODIFIED: FrostTracker text extended — cross-references R112 fire-type Pinsir, fire-and-ice parallel |
| `data/maps/Route119/scripts.inc` | **232** | NEW: Ecologist — references ALL 4 regional forms, sends findings to Dr. Hartley |
| `data/maps/Route119/map.json` | **232** | Added OBJ_EVENT_GFX_SCIENTIST_1 at (7,100), MOVEMENT_TYPE_FACE_RIGHT |
| `data/maps/Route119_WeatherInstitute_1F/scripts.inc` | **232** | MODIFIED: Dr. Hartley gains badge-gated (FLAG_BADGE05_GET) post-migration dialogue referencing 3 regional forms + "transformation" thesis |
| `data/maps/FortreeCity/scripts.inc` | **232** | NEW: ChangedTrainer — notices player's cyan palette, "HOENN changes everyone who walks through it. Not just POKéMON." |
| `data/maps/FortreeCity/map.json` | **232** | Added OBJ_EVENT_GFX_WOMAN_2 at (34,5) elev 4, MOVEMENT_TYPE_FACE_LEFT |
