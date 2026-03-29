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
- **Post-climax reactions** (C116): Birch (post-Ho-Oh-catch reflection + v6.0 hook), Mauville engineer (stable grid + "deep hum" v6.0 seed), Lilycove sailor (golden sky, calm seas), Mossdeep researcher (satellite data, lifetime of research). All gated on `FLAG_CAUGHT_HO_OH`.
