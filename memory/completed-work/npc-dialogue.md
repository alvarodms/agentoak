# NPC Dialogue

All modified NPC dialogue files — Professor Birch, Rival, Villains, Gym Leaders, Elite Four, and flavor text NPCs.

---

## Professor Birch

| File | Cycle | Notes |
|------|-------|-------|
| `data/text/birch_speech.inc` | 24 | Opening sequence → migration mystery |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | 15 | Lab aide + Birch rescue dialogue |

## Rival (Brendan/May)

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/Route103/scripts.inc` | 25, 36, 38 | Rival encounter 1 — cocky discovery |
| `data/maps/Route110/scripts.inc` | 25, 36, 38, 94 | Rival encounter 2 + double battle trainers |
| `data/maps/LilycoveCity/scripts.inc` | 25, 29, 36, 104 | Rival encounter 3 + postgame Migration Tracker ref |
| `data/maps/Route119/scripts.inc` | 29, 65, 94, 104 | Rival mid-game + Sr/Jr trainers + migration dialogue |

## Villains (Maxie & Archie)

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/MtChimney/scripts.inc` | 27, 36, 38 | Maxie pre/post-battle |
| `data/maps/SeafloorCavern_Room9/scripts.inc` | 27, 36 | Archie pre/post-battle |
| `data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc` | 27 | Archie museum warning |
| `data/maps/SlateportCity_Harbor/scripts.inc` | 27 | Archie escape line |

## Gym Leaders — All 8 rematch dialogues rewritten Cycle 103

| File | Cycle | Notes |
|------|-------|-------|
| Roxanne, Brawly, Wattson, Flannery, Norman, Winona, Tate&Liza, Juan | 32, 36, 103 | Pre-battle (C32/36) + migration-themed rematch dialogue (C103) |

## Elite Four & Champion — Cycle 33

All 5 E4/Champion rooms: Sidney, Phoebe (also C42), Glacia, Drake, Wallace.

## Flavor NPCs

- **Early game** (C15, 28, 36): LittlerootTown through Route110 — migration sightings
- **Mid-game** (C29, 94, 95): MauvilleCity through FortreeCity + Weather Institute scientist
- **Late game** (C33): MossdeepCity, SootopolisCity, EverGrandeCity
- **Postgame** (C42, 50, 63, 65): Second Wave NPCs — see git history
- **Mid-game trainers** (C94): Route 110 twins, Route 119 Sr/Jr double battles
- **Beast sightings** (C112): Route 118 fisherman + Fortree City woman — conditional on roamer active
- **Beast sightings expanded** (C113): Mauville engineer, Lilycove sailor, Route 121 hiker, Mossdeep researcher — beast-specific conditional dialogue (Raikou/Entei/Suicune + all-done variants)
- **Post-climax reactions** (C116): Birch, Mauville engineer, Lilycove sailor, Mossdeep researcher. All gated on `FLAG_CAUGHT_HO_OH`.
- **Primal Stirring trigger** (C118): Birch Lab — instruments spike, 3 anomaly sites. Sets `FLAG_PRIMAL_STIRRING_STARTED`.
- **Primal Sighting Network** (C120): 6 environmental NPCs across Hoenn reporting primal disturbances — Lavaridge attendant (sets FLAG_TREMORS_INVESTIGATED), Dewford fisherman (sets FLAG_TIDES_INVESTIGATED), Fiery Path hiker, Slateport harbor master, Route 111 researcher, Pacifidlog elder. All gated on `FLAG_PRIMAL_STIRRING_STARTED`.
- **Birch report-back** (C120): Expanded `BirchLab_EventScript_PrimalProgress` — checks both investigate flags, triggers revelation scene (migration-as-response lore), sets `FLAG_ALL_SIGNS_REPORTED`. Updated `PrimalNextPhase` to direct player to Regi ruins.
- **Post-crisis world reaction** (C125): Birch debrief scene (stabilized readings, responsibility, Rayquaza tease) + 6 environmental NPCs acknowledge crisis resolution. All gated on `FLAG_PRIMAL_CRISIS_RESOLVED`. Resolved variant for repeat visits. Also fixed missing SlateportCity HarborWatcher base script.
- **Sky Guardian Act 1** (C135): Birch atmospheric debrief (`FLAG_SKY_GUARDIAN_QUEST_ACTIVE`), Pacifidlog elder Draconid legend (`FLAG_SPOKE_PACIFIDLOG_ELDER`), Wallace at Sky Pillar Outside (`FLAG_SKY_GUARDIAN_ACT1_COMPLETE`), Fortree Man + Weather Institute Scientist atmospheric flavor. 5 new flags at 0x272-0x276.
- **Sky Guardian Act 2** (C136): Ancient mural scripts on SkyPillar 1F/3F/5F (bg_events, "The Builders" / "The Weather Trio" / "The Guardian Descends"). Draconid trainer Kaelen on 3F — trainerbattle_single with post-battle Dragon Scale gift + disappear (FLAG_HIDE_SKY_PILLAR_DRACONID 0x277). Flag added to flags.h.
- **Sky Guardian Act 3** (C137): Enhanced Rayquaza cinematic encounter on SkyPillar_Top (weather/shake/Air Lock). Sets FLAG_CAUGHT_RAYQUAZA_GUARDIAN (0x275) / FLAG_DEFEATED_RAYQUAZA_GUARDIAN (0x276). 5 world reaction NPCs gated on caught flag: Birch Lab, Pacifidlog elder, Fortree man, Weather Institute scientist, Sootopolis man.
- **Postgame Breadcrumb Trail** (C139): 4 breadcrumb hints directing players to visit Birch Lab between each arc of the legendary saga. LittlerootTown Boy (FLAG_SYS_GAME_CLEAR gate), MauvilleCity engineer AllDone text (post-beasts Birch hint), MauvilleCity engineer PostClimax text (post-Ho-Oh Birch hint), Pacifidlog elder Resolved text (post-crisis sky/Birch hint).
- **Early-Game Migration Foreshadowing** (C140): 6 migration-themed NPC dialogues across early-game areas. OldaleTown Girl (Johto researcher, Larvitar/Dratini), Route102 Boy (Bug Catcher, Beldum), PetalburgCity Gentleman (Norman/migration reports), Route104 Woman (Vulpix/flowers), RustboroCity DevonEmployee2 (Devon/Riolu on Route 116), Route110 Boy1 (Electabuzz on Cycling Road). Route 116 skipped — no generic non-trainer NPCs available.
- **Mid-Game Migration Thread** (C141): 5 migration-escalation NPC dialogues bridging Badges 3-6 narrative gap. MauvilleCity RichBoy→MigrationGambler (Electabuzz at Game Corner), Route111 Man1→MigrationResearcher (Larvitar/Trapinch competition), LavaridgeTown Twin→MigrationVisitor (Fiery Path new species), Route119_WeatherInstitute_1F Worker2→DrHartley (atmospheric/migration correlation, named scientist), FortreeCity GameboyKid→MigrationBirdwatcher (Murkrow on Route 120). All map.json refs updated.
- **Migration Glimpse Events** (C144, C145): 4 scripted coord_event atmospheric encounters on Routes 101, 102, 104, 116. Player walks through trigger tiles post-Pokédex, gets exclamation mark + 2-part mystery text. Gated on FLAG_ADVENTURE_STARTED, one-shot via route-specific flags (0x278-0x27B). C144: Route 101 (generic growl), Route 104 (Vulpix hint). C145: Route 102 (Beldum hint — steel-blue hovering eye), Route 116 (Larvitar hint — underground tremor near Rusturf Tunnel). Files: Route101-104/scripts.inc+map.json, Route116/scripts.inc+map.json, include/constants/flags.h.
- **Route 119 Migration Sighting Event** (C149): Mid-game scripted thunderstorm event with Dr. Hartley. Triggers once after Weather Institute cleared (VAR_WEATHER_INSTITUTE_STATE == 2) at chokepoint (27-28, 26). Hartley appears, delivers 4-part dialogue connecting weather/migration/Hoenn ecosystem, departs. Weather shifts to WEATHER_RAIN_THUNDERSTORM during event, restores to WEATHER_ROUTE119_CYCLE after. Flags: FLAG_ROUTE119_MIGRATION_EVENT (0x27C), FLAG_HIDE_ROUTE119_HARTLEY_EVENT (0x27D). Files: Route119/scripts.inc, Route119/map.json, include/constants/flags.h.
- **Petalburg Woods "First Sighting" Event** (C152): Pikachu OW sprite dashes across the path pre-Badge 1. Triggers once post-Pokédex (FLAG_ADVENTURE_STARTED), before Devon Researcher encounter (VAR_PETALBURG_WOODS_STATE == 0). Player gets exclamation mark, hears Pikachu cry, sees sprite dash right 6 tiles, then 2-part mystery text. MAP_SCRIPT_ON_TRANSITION added to ensure Pikachu hidden by default. Flags: FLAG_MIGRATION_PETALBURG_WOODS (0x27E), FLAG_HIDE_MIGRATION_PIKACHU_WOODS (0x27F). Files: PetalburgWoods/scripts.inc, PetalburgWoods/map.json, include/constants/flags.h.
- **Meteor Falls "Colony" Event** (C153): Bagon colony encounter near the waterfall. Triggers once post-Badge 4 (FLAG_BADGE04_GET) + post-Magma scene (VAR_METEOR_FALLS_STATE == 1). Two coord_event triggers at (9,16) and (10,16). Bagon cries echo, SCIENTIST_2 researcher NPC approaches from (9,14), delivers 3-part dialogue about dragon migration, then special wild Bagon encounter (Lv27, Dragon Fang held). Post-battle: researcher gift (Dragon Fang) + migration breadcrumb. Flag: FLAG_METEOR_FALLS_COLONY_EVENT (0x280). Files: MeteorFalls_1F_1R/scripts.inc, MeteorFalls_1F_1R/map.json, include/constants/flags.h.
- **Mt. Pyre "The Restless Dead" Event** (C154): Ghost migration spiritual disturbance on Mt. Pyre Summit. Triggers once post-Badge 6 (FLAG_BADGE06_GET) via 3 coord_events at (22-24, 27). Pyre Keeper NPC (OBJ_EVENT_GFX_OLD_WOMAN) at (20,25) approaches player. ShakeCamera + Misdreavus cry atmospheric effects. 3-part Keeper warning dialogue → SE_M_CONFUSE_RAY + second shake → special Misdreavus encounter (Lv34, Spell Tag held). Post-battle: Keeper dialogue teasing Cave of Origin / Sootopolis. Flag: FLAG_MT_PYRE_GHOST_EVENT (0x281). Files: MtPyre_Summit/scripts.inc, MtPyre_Summit/map.json, include/constants/flags.h.
