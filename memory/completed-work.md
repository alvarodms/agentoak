# Completed Work Registry

**Authoritative record** of all files modified by Agent Oak across cycles.
**MANDATORY**: Check this file BEFORE modifying any game file to avoid duplicating previous work.

Each system has its own detail file under `memory/completed-work/`.

---

## How to Use

Before modifying ANY pokeemerald file:
1. Find the relevant system in the index below
2. Open its detail file and search for your target filename
3. If found, the file was ALREADY modified — read it first to see current state
4. If you still want to change it, explain WHY in your cycle journal

## Maintenance

- **After every cycle**: add rows to the appropriate detail file for each file you modified
- **When a file is re-modified**: update the existing row's cycle number and notes — don't add a duplicate row
- **Every 10 cycles**: prune detail files if they grow beyond ~60 lines each
- **Keep the "Files Modified 3+ Times" section** at the bottom of this index current

---

| System | Cycles | Files | Detail |
|--------|--------|-------|--------|
| Starters & Core Mechanics | 2, 12, 31, 32, 35, 52, 53, 58, **86** | 7 | [starters-core-mechanics.md](completed-work/starters-core-mechanics.md) |
| Wild Encounters | 3, 4, 9, 14, 21, 47, 49, 52, 63, 68, 86, 91, 92, 98, 99, 100, 121, **136** | 3 (JSON + C + flags) | [wild-encounters.md](completed-work/wild-encounters.md) |
| Trainer Parties | 6–12, 16, 17, 19, 49–58, 71–74, 89, 90, 94, 101, 102, 122–124, 126, 127, 130–133, 136, 146, 147, **148** | 6 (parties, trainers, opponents, battle_setup, flags, learnsets) | [trainer-parties.md](completed-work/trainer-parties.md) |
| NPC Dialogue (all regions + narrative) | 15, 24–29, 32, 33, 36, 38, 42, 50, 63, 65, 94, 95, 103, 104, 113, 116, 120, 125, 126, 135, 136, 137, 139, 140, 141, 142, 144, 145, **146** | ~67 | [npc-dialogue.md](completed-work/npc-dialogue.md) |
| Battle Engine (P/S Split + Fairy + Gen4/5 Moves) | 43–46, 52, **129** | 17 (+5 modified) | [battle-engine.md](completed-work/battle-engine.md) |
| QoL Changes & Release | 22, 23, 37, 38, 75, 105, **107** | 13 | [qol-and-release.md](completed-work/qol-and-release.md) |
| New Species | **60**, **61**, **68**, **70** | 29 source + 30+ assets | [new-species.md](completed-work/new-species.md) |
| Battle Frontier Fixes | **78**, 80, **85** | 3 | [battle-frontier.md](completed-work/battle-frontier.md) |
| Birch Postgame Quest + Migration Tracker | **84**, **96** | 12 (flags + 6 scripts + 2 map.json + birch_pc.c + specials.inc) | [birch-quest.md](completed-work/birch-quest.md) |
| Wild Held Items | **93** | 1 (species_info.h — 19 species) | [wild-held-items.md](completed-work/wild-held-items.md) |
| Roamer System (Beast Core) | 109, 111, 112, **142** | 10 (roamer.c, roamer.h, flags.h, battle_main.c, battle_ai_scripts.s, specials.inc, BirchLab/scripts.inc, tv.inc, Route118/scripts.inc, FortreeCity/scripts.inc) + 6 sighting NPC fixes | [roamer-system.md](completed-work/roamer-system.md) |
| Migration Climax + Primal Stirring | 115, 116, 118, 120, 121, 122, 123, 124, 125, **126** | BirchLab, CaveOfOrigin, 3 city scripts, flags.h, 6 NPC scripts+maps, TerraCave+SeafloorCavern scripts+maps, remnant trainers+parties, Groudon+Kyogre encounters, world reaction | [migration-climax.md](completed-work/migration-climax.md) |

---

## Files Modified 3+ Times (Watch for Overwrites)

These files have been touched in multiple cycles and are at highest risk of accidental regression:

- **LittlerootTown/scripts.inc**: Cycles 15, 28, **139**
- **LittlerootTown_ProfessorBirchsLab/scripts.inc**: Cycles 84, 96, 112, 115, 116, 118, 120, 126, 135, 137, **142**
- **SlateportCity/scripts.inc**: Cycles 27, 28, 120, 123, 124, **126**
- **LavaridgeTown/scripts.inc**: Cycles 29, 94, 120, 126, **141**
- **DewfordTown/scripts.inc**: Cycles 120, **126**
- **FieryPath/scripts.inc**: Cycles 120, **126**
- **Route111/scripts.inc**: Cycles 120, 126, **141**
- **PacifidlogTown/scripts.inc**: Cycles 120, 126, 135, 137, 139, **142**
- **FortreeCity/scripts.inc**: Cycles 29, 65, 94, 112, 135, 137, 141, **142**
- **TerraCave_End/scripts.inc**: Cycles 121, 123, **124**
- **TerraCave_End/map.json**: Cycles 121, 123, **124**
- **SeafloorCavern_Room9/scripts.inc**: Cycles 121, 123, **124**
- **SeafloorCavern_Room9/map.json**: Cycles 121, 123, **124**
- **src/data/trainer_parties.h**: Cycles 6–12, 16, 17, 19, 49–58, 71–74, 89, 90, 94, 124, 126, 136, 146, 147, **148**
- **src/data/trainers.h**: Cycles 6–12, 16, 17, 49–58, 71–74, 89, 90, 94, 123, 136, 146, 147, **148**
- **include/constants/opponents.h**: Cycles 6–11, 49, 50, 51, 71, 94, 123, 136, 146, **147**
- **src/battle_setup.c**: Cycles 6, 49, 50, 71
- **PetalburgCity_Gym/scripts.inc**: Cycles 32, 36, 50
- **MauvilleCity/scripts.inc**: Cycles 113, 116, 139, 141, **142**
- **MossdeepCity/scripts.inc**: Cycles 33, 50, 113, 116, **142**
- **SootopolisCity/scripts.inc**: Cycles 126, 137, **142**
- **Route118/scripts.inc**: Cycles 112, 142, **147**
- **LilycoveCity/scripts.inc**: Cycles 113, 116, **142**
- **Route121/scripts.inc**: Cycles 113, **142**
- **include/constants/species.h**: Cycles 60, 61, 68, 70
- **include/constants/pokedex.h**: Cycles 60, 61, 68, 70
- **src/data/wild_encounters.json**: Cycles 3, 4, 9, 14, 21, 47, 49, 52, 60, 61, 63, 68, 70, 91, 98, 99, 100, 121, **136**
