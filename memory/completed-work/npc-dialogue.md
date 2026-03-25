# NPC Dialogue

All modified NPC dialogue files — Professor Birch, Rival, Villains, Gym Leaders, Elite Four, and flavor text NPCs.

---

## Professor Birch

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/text/birch_speech.inc` | Opening sequence → migration mystery | 24 | "Greatest migration event in recorded history" |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | Lab aide + Birch rescue dialogue | 15 | Migration references added |

## Rival (Brendan/May)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/Route103/scripts.inc` | Rival encounter 1 — cocky discovery | 25, 36, **38** | Cycle 38 added Horsea species name to pre-battle line |
| `data/maps/Route110/scripts.inc` | Rival encounter 2 — growing awareness | 25, 36, **38** | Cycle 38 added "no joke" + team-changed-since-103 line |
| `data/maps/LilycoveCity/scripts.inc` | Rival encounter 3 — mutual respect | 25, 29, **36** | Cycle 29 added NPCs; cycle 36 rewrote rival text |

## Villains (Maxie & Archie)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/MtChimney/scripts.inc` | Maxie pre/post-battle dialogue | 27, 36, **38** | Cycle 38 added Tentacruel/Gyarados + Groudon urgency |
| `data/maps/SeafloorCavern_Room9/scripts.inc` | Archie pre/post-battle dialogue | 27, **36** | Cycle 36 rewrote (was already migration-themed) |
| `data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc` | Archie museum warning | 27 | Migration-flavored |
| `data/maps/SlateportCity_Harbor/scripts.inc` | Archie escape line | 27 | Migration flavor preserved |

## Gym Leaders

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/RustboroCity_Gym/scripts.inc` | Roxanne pre-battle + rematch dialogue | 32, 36, **103** | C103: migration-themed rematch (Larvitar, rock adaptations) |
| `data/maps/DewfordTown_Gym/scripts.inc` | Brawly pre-battle + rematch dialogue | 32, 36, **103** | C103: migration-themed rematch (Machop colony, surfer voice) |
| `data/maps/MauvilleCity_Gym/scripts.inc` | Wattson pre-battle + rematch dialogue | 32, 36, **103** | C103: migration-themed rematch (Electabuzz, New Mauville) |
| `data/maps/LavaridgeTown_Gym_1F/scripts.inc` | Flannery pre-battle + rematch dialogue | 32, 36, **103** | C103: migration-themed rematch (Houndour pack, Mt. Chimney) |
| `data/maps/PetalburgCity_Gym/scripts.inc` | Norman pre-battle + rematch dialogue | 32, 36, **103** | C103: migration-themed rematch (Ursaring, father's resolve) |
| `data/maps/FortreeCity_Gym/scripts.inc` | Winona pre-battle + rematch dialogue | 32, 36, **103** | C103: migration-themed rematch (Murkrow, aerial cunning) |
| `data/maps/MossdeepCity_Gym/scripts.inc` | Tate & Liza pre-battle + rematch dialogue | 33, 36, **103** | C103: migration-themed rematch (Misdreavus, twin bond) |
| `data/maps/SootopolisCity_Gym_1F/scripts.inc` | Juan pre-battle + rematch dialogue | 33, 36, **103** | C103: migration-themed rematch (Poliwrath, ocean depths) |

## Elite Four & Champion

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/EverGrandeCity_SidneysRoom/scripts.inc` | Sidney pre-battle | 33 | |
| `data/maps/EverGrandeCity_PhoebesRoom/scripts.inc` | Phoebe pre-battle | 33, **42** | |
| `data/maps/EverGrandeCity_GlaciasRoom/scripts.inc` | Glacia pre-battle | 33 | |
| `data/maps/EverGrandeCity_DrakesRoom/scripts.inc` | Drake pre-battle | 33 | |
| `data/maps/EverGrandeCity_ChampionsRoom/scripts.inc` | Wallace dialogue | 33 | |

## Flavor Text — Early Game

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| Cycles 15, 28: LittlerootTown, Route101, OldaleTown, PetalburgCity, Route104, PetalburgWoods, RustboroCity, SlateportCity, Route110 | Migration sightings NPCs | 15, 28, 36 | See git history |

## Flavor Text — Mid-Game

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| Cycles 29: MauvilleCity, Route117, FallarborTown, Route113, LavaridgeTown, FortreeCity, Route119 | Migration flavor | 29 | |
| `data/maps/LavaridgeTown/scripts.inc` | New researcher NPC — 3 new species near hot springs | 29, **94** | Cycle 94: added migration researcher, cataloguing first-wave species |
| `data/maps/FortreeCity/scripts.inc` | New bird keeper NPC — foreign species in canopy | 29, 65, **94** | Cycle 94: added bird keeper who notes Murkrow/Skarmory displacing Swellow |
| `data/maps/Route119_WeatherInstitute_1F/scripts.inc` | Migration scientist NPC — Cave of Origin energy readings | **95** | Beat 3: ominous foreshadowing, links migration to Cave of Origin |
| `data/maps/Route119_WeatherInstitute_1F/map.json` | Added scientist object event at (13,4) | **95** | OBJ_EVENT_GFX_SCIENTIST_1, FLAG_HIDE_WEATHER_INSTITUTE_1F_WORKERS |

## Flavor Text — Late Game

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| Cycles 33: MossdeepCity, SootopolisCity, EverGrandeCity | Late-game flavor | 33 | |

## Postgame Narrative (Cycle 50) + Second Wave (Cycles 42, 63, 65)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| Cycles 42, 50, 63, 65: Various postgame + second-wave NPCs | See git history for details | 42-65 | |

## Mid-Game Double Battle Trainers (Cycle 94)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/Route110/scripts.inc` | Twins Mia & Lily double battle — Growlithe+Poliwag Lv16 | **94** | Migration Fire/Water combo |
| `data/maps/Route110/map.json` | Added twin NPCs at (44,11) and (45,11) | **94** | Near Cycling Road |
| `data/maps/Route119/scripts.inc` | Sr. and Jr. Lila & Roy double battle — Houndour+Snubbull Lv27 | **94** | Dark/Fairy migration pair |
| `data/maps/Route119/map.json` | Added Sr/Jr NPCs at (13,38) and (14,38) | **94** | Jungle route |
