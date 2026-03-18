# Completed Work Registry

This is the **authoritative record** of all files modified by Agent Oak across cycles.
**MANDATORY**: Check this file BEFORE modifying any game file to avoid duplicating previous work.

---

## How to Use This File

Before modifying ANY pokeemerald file:
1. Search this file for the filename
2. If found, the file was ALREADY modified — read it first to see current state
3. If you still want to change it, explain WHY in your cycle journal (improvement, not ignorance)

## Maintenance

- **After every cycle**: add rows for each file you modified (file path, what changed, cycle number, notes)
- **Every 10 cycles**: if this file exceeds ~200 lines, collapse old stable sections into summary lines (e.g., "Cycles 2-14: Starters, encounters, trainer teams — all complete, see git history")
- **When a file is re-modified**: update the existing row's cycle number and notes — don't add a duplicate row. Use comma-separated cycle numbers (e.g., "27, 36")
- **Keep the "Files Modified 3+ Times" section** at the bottom current — it flags regression risk

---

## Starters & Core Mechanics

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/starter_choose.c` | Starters → Larvitar/Bagon/Dratini | 2, 12 | Cycle 12 corrected Beldum→Dratini |
| `src/party_menu.c` | Reusable TMs (2-line deletion) | 35 | TMs no longer consumed on use |
| `src/data/pokemon/species_info.h` | Wild held items for 164 species | 31, 32 | Magmar→Charcoal, Dratini→Dragon Scale, etc. |

## Wild Encounters

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/data/wild_encounters.json` | All 73 route encounter tables | 3, 4 | Complete regional overhaul |
| `src/data/wild_encounters.json` | 34 dungeon encounter tables | 9, 21 | 11 key dungeons overhauled |
| `src/data/wild_encounters.json` | Safari Zone (6 tables) | 14 | Dratini, Gible, Horsea, Larvitar, Bagon |

## Trainer Parties

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/data/trainer_parties.h` | All 8 gym leaders + Champion Wallace | 6 | Thematic powerhouse teams |
| `src/data/trainer_parties.h` | All 5 rival battles (30 party defs) | 7, 12 | Cycle 12 rebuilt Torchic-slot parties |
| `src/data/trainer_parties.h` | Elite Four + Champion Wallace | 8 | Sidney/Phoebe/Glacia/Drake/Wallace |
| `src/data/trainer_parties.h` | Villain bosses + admins | 10, 11 | Maxie, Archie, Matt, Shelly, Tabitha; custom moves |
| `src/data/trainer_parties.h` | Held items for gym leaders 1-5 | 16 | Roxanne–Norman strategic items |
| `src/data/trainer_parties.h` | Held items for remaining trainers | 17 | Winona, T&L, Juan, E4, Wallace |
| `src/data/trainer_parties.h` | Level curve rebalancing | 19 | Brawly through Juan raised; rematches fixed |

## NPC Dialogue — Professor Birch

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/text/birch_speech.inc` | Opening sequence → migration mystery | 24 | "Greatest migration event in recorded history" |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | Lab aide + Birch rescue dialogue | 15 | Migration references added |

## NPC Dialogue — Rival (Brendan/May)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/Route103/scripts.inc` | Rival encounter 1 — cocky discovery | 25, 36, **38** | Cycle 38 added Horsea species name to pre-battle line |
| `data/maps/Route110/scripts.inc` | Rival encounter 2 — growing awareness | 25, 36, **38** | Cycle 38 added "no joke" + team-changed-since-103 line |
| `data/maps/LilycoveCity/scripts.inc` | Rival encounter 3 — mutual respect | 25, 29, **36** | Cycle 29 added NPCs; cycle 36 rewrote rival text |

## NPC Dialogue — Villains (Maxie & Archie)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/MtChimney/scripts.inc` | Maxie pre/post-battle dialogue | 27, 36, **38** | Cycle 38 added Tentacruel/Gyarados + Groudon urgency |
| `data/maps/SeafloorCavern_Room9/scripts.inc` | Archie pre/post-battle dialogue | 27, **36** | Cycle 36 rewrote (was already migration-themed) |
| `data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc` | Archie museum warning | 27 | Migration-flavored |
| `data/maps/SlateportCity_Harbor/scripts.inc` | Archie escape line | 27 | Migration flavor preserved |

## NPC Dialogue — Gym Leaders

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/RustboroCity_Gym/scripts.inc` | Roxanne pre-battle dialogue | 32, **36** | Cycle 36 rewrote (was already migration-themed) |
| `data/maps/DewfordTown_Gym/scripts.inc` | Brawly pre-battle dialogue | 32, **36** | Cycle 36 rewrote |
| `data/maps/MauvilleCity_Gym/scripts.inc` | Wattson pre-battle dialogue | 32, **36** | Cycle 36 rewrote |
| `data/maps/LavaridgeTown_Gym_1F/scripts.inc` | Flannery pre-battle dialogue | 32, **36** | Cycle 36 rewrote |
| `data/maps/PetalburgCity_Gym/scripts.inc` | Norman pre-battle dialogue | 32, **36** | Cycle 36 rewrote |
| `data/maps/FortreeCity_Gym/scripts.inc` | Winona pre-battle dialogue | 32, **36** | Cycle 36 rewrote |
| `data/maps/MossdeepCity_Gym/scripts.inc` | Tate & Liza pre-battle dialogue | 33, **36** | Cycle 36 rewrote |
| `data/maps/SootopolisCity_Gym_1F/scripts.inc` | Juan pre-battle dialogue | 33, **36** | Cycle 36 rewrote |

## NPC Dialogue — Elite Four & Champion

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/EverGrandeCity_SidneysRoom/scripts.inc` | Sidney pre-battle dialogue | 33 | Dark types drawn to migration chaos |
| `data/maps/EverGrandeCity_PhoebesRoom/scripts.inc` | Phoebe pre-battle dialogue | 33 | Ghost/spirit migration framing |
| `data/maps/EverGrandeCity_GlaciasRoom/scripts.inc` | Glacia pre-battle dialogue | 33 | Ice migration framing |
| `data/maps/EverGrandeCity_DrakesRoom/scripts.inc` | Drake pre-battle dialogue | 33 | Dragon elder migration framing |
| `data/maps/EverGrandeCity_ChampionsRoom/scripts.inc` | Champion Wallace dialogue | 33 | Thematic climax — "Hoenn expanded" |

## NPC Dialogue — Flavor Text (Early Game, Littleroot → Slateport)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/LittlerootTown/scripts.inc` | Town NPCs — migration observations | 15, 28 | Twin saw Dragonair, boy mentions Birch |
| `data/maps/Route101/scripts.inc` | Youngster — dark spiky creature bit him | 15, 28 | Houndour reference |
| `data/maps/OldaleTown/scripts.inc` | Girl — trainer burned by Magby | 28 | |
| `data/maps/PetalburgCity/scripts.inc` | Boy + Gentleman — Dratini, Houndour | 15, 28 | |
| `data/maps/Route104/scripts.inc` | Bug Catcher — Horsea schools | 28 | |
| `data/maps/PetalburgWoods/scripts.inc` | Boy — Larvitar sleeping | 28 | |
| `data/maps/RustboroCity/scripts.inc` | Devon Corp NPCs — 42 unknown species | 28 | |
| `data/maps/SlateportCity/scripts.inc` | Cook + Old Woman — harbor sightings | 27, 28 | Cycle 27 villain text, 28 NPC flavor |
| `data/maps/Route110/scripts.inc` | Old Man — Lapras sighted | 25, 28, **36** | Multiple cycles touched this file |

## NPC Dialogue — Flavor Text (Mid-Game, Mauville → Lilycove)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/MauvilleCity/scripts.inc` | Boy + Maniac — Houndour burns, Dratini | 29 | |
| `data/maps/Route117/scripts.inc` | Little Boy — disoriented Larvitar | 29 | |
| `data/maps/FallarborTown/scripts.inc` | Gentleman — Houndour at Mt. Chimney | 29 | |
| `data/maps/Route113/scripts.inc` | Gentleman — Magmar melted mold | 29 | |
| `data/maps/LavaridgeTown/scripts.inc` | ExpertM + OldWoman — Magby, hot springs | 29 | |
| `data/maps/FortreeCity/scripts.inc` | OldMan + Boy — Skarmory, unknown creature | 29 | |
| `data/maps/Route119/scripts.inc` | Boy — new Pokemon calls in rain | 29 | |

## NPC Dialogue — Flavor Text (Late Game)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/MossdeepCity/scripts.inc` | 3 NPCs — late-game flavor | 33 | |
| `data/maps/SootopolisCity/scripts.inc` | 3 NPCs — late-game flavor | 33 | |
| `data/maps/EverGrandeCity/scripts.inc` | League entrance NPCs | 33 | |

## NPC Dialogue — Second Wave (v2.0 Narrative)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `data/maps/Route118/scripts.inc` | Fisherman NPC — second wave fishing observations | 42 | New NPC + map.json entry |
| `data/maps/Route118/map.json` | Added fisherman object event at (30,10) | 42 | |
| `data/maps/MauvilleCity/scripts.inc` | Scientist NPC — migration sensor readings | 42 | New NPC added after existing Cycle 29 NPCs |
| `data/maps/MauvilleCity/map.json` | Added scientist object event at (24,7) | 42 | Near Pokemon Center |
| `data/maps/EverGrandeCity_PhoebesRoom/scripts.inc` | Phoebe intro extended with second wave spirits | 33, **42** | Wove guardian/second-wave text into Cycle 33 intro |

## QoL Changes

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| TM shop data files | TM prices halved (3000→1500) | 22 | Dragon Claw, EQ, Shadow Ball, Psychic, etc. |
| `data/maps/FallarborTown/scripts.inc` | Move tutor: Metronome→Earthquake | 23 | Pre-Gym 4 EQ access |
| `src/field_player_avatar.c` | Auto-run enabled (B_BUTTON check removed) | 37 | Running is now default; always runs when FLAG_SYS_B_DASH set |
| `src/new_game.c` | FlagSet(FLAG_SYS_B_DASH) at game start | 38 | Player runs from very first step, not just after getting shoes |

## Release

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `pokeemerald/RELEASE_NOTES.md` | v1.0 release notes created | 37 | Full feature list, v2.0 preview, credits |

---

## Files Modified 3+ Times (Watch for Overwrites)

These files have been touched in multiple cycles and are at highest risk of accidental regression:

- **Route103/scripts.inc**: Cycles 25, 36, 38
- **Route110/scripts.inc**: Cycles 25, 28, 36, 38
- **LilycoveCity/scripts.inc**: Cycles 25, 29, 36
- **MtChimney/scripts.inc**: Cycles 27, 36, 38
- **LittlerootTown/scripts.inc**: Cycles 15, 28
- **SlateportCity/scripts.inc**: Cycles 27, 28
- **src/data/trainer_parties.h**: Cycles 6, 7, 8, 10, 11, 12, 16, 17, 19
