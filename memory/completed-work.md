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
| Starters & Core Mechanics | 2, 12, 31, 32, 35 | 3 | [starters-core-mechanics.md](completed-work/starters-core-mechanics.md) |
| Wild Encounters | 3, 4, 9, 14, 21, 47, 49 | 1 (multi-table) | [wild-encounters.md](completed-work/wild-encounters.md) |
| Trainer Parties | 6–12, 16, 17, 19, 49, 50, 51 | 4 (parties, trainers, opponents, battle_setup) | [trainer-parties.md](completed-work/trainer-parties.md) |
| NPC Dialogue (all regions + narrative) | 15, 24–29, 32, 33, 36, 38, 42, 50 | ~40 | [npc-dialogue.md](completed-work/npc-dialogue.md) |
| Battle Engine (P/S Split + Fairy Type) | 43–46 | 16 | [battle-engine.md](completed-work/battle-engine.md) |
| QoL Changes & Release | 22, 23, 37, 38 | 5 | [qol-and-release.md](completed-work/qol-and-release.md) |

---

## Files Modified 3+ Times (Watch for Overwrites)

These files have been touched in multiple cycles and are at highest risk of accidental regression:

- **Route103/scripts.inc**: Cycles 25, 36, 38
- **Route110/scripts.inc**: Cycles 25, 28, 36, 38
- **LilycoveCity/scripts.inc**: Cycles 25, 29, 36
- **MtChimney/scripts.inc**: Cycles 27, 36, 38
- **LittlerootTown/scripts.inc**: Cycles 15, 28
- **SlateportCity/scripts.inc**: Cycles 27, 28
- **src/data/trainer_parties.h**: Cycles 6–12, 16, 17, 19, 49, 50, 51
- **src/data/trainers.h**: Cycles 6–12, 16, 17, 49, 50, 51
- **include/constants/opponents.h**: Cycles 6–11, 49, 50, 51
- **src/battle_setup.c**: Cycles 6, 49, 50
- **PetalburgCity_Gym/scripts.inc**: Cycles 32, 36, 50
- **MossdeepCity/scripts.inc**: Cycles 33, 50