# Birch Postgame Research Quest — Modified Files

## Cycle 84: Full quest implementation (all 5 stages)

| File | What Changed |
|------|-------------|
| `include/constants/flags.h` | Renamed 6 unused flags (0x22-0x27) to FLAG_BIRCH_QUEST_* |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | Added postgame quest check in Birch script + 5 quest handler scripts + 6 dialogue texts |
| `data/maps/Route119_WeatherInstitute_2F/scripts.inc` | Added quest branch to scientist + 2 scripts + 2 dialogue texts |
| `data/maps/ScorchedSlab/map.json` | Added Hiker NPC (object_event index 1, flag "0") |
| `data/maps/ScorchedSlab/scripts.inc` | Added Hiker quest scripts (3 branches) + 3 dialogue texts |
| `data/maps/FallarborTown_CozmosHouse/scripts.inc` | Added quest branch to Cozmo + 2 scripts + 2 dialogue texts |
| `data/maps/MeteorFalls_B1F_1R/map.json` | Added Researcher NPC (object_event index 0, flag "0") |
| `data/maps/MeteorFalls_B1F_1R/scripts.inc` | Full rewrite: quest researcher scripts (3 branches) + 3 dialogue texts |

## Quest Flow
- Stage 0: Birch gives quest (FLAG_BIRCH_QUEST_STARTED)
- Stage 1: Weather Institute scientist (FLAG_BIRCH_QUEST_WEATHER, reward: Leftovers)
- Stage 2: Scorched Slab hiker (FLAG_BIRCH_QUEST_SLAB, reward: TM02 Dragon Claw)
- Stage 3: Prof. Cozmo (FLAG_BIRCH_QUEST_COZMO, reward: PP Max)
- Stage 4: Meteor Falls researcher (FLAG_BIRCH_QUEST_METEOR, reward: Rare Candy x3)
- Stage 5: Birch gives Master Ball (FLAG_BIRCH_QUEST_COMPLETE)

## Cycle 96: Migration Tracker Quest (3-stage postgame collection quest)

| File | What Changed |
|------|-------------|
| `include/constants/flags.h` | Renamed 4 unused flags (0x28-0x2B) to FLAG_MIGRATION_TRACKER_* |
| `src/birch_pc.c` | Added `ScriptCheckSpeciesCaught` special + `#include "pokemon.h"` |
| `data/specials.inc` | Registered ScriptCheckSpeciesCaught |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | Replaced BirchPostQuest with 3-stage migration tracker quest (scripts + dialogue) |

### Quest Flow
- Trigger: After FLAG_BIRCH_QUEST_COMPLETE (existing research quest done)
- Stage 1 — First Wave Pioneers: catch 5/10 common migrants → Rare Candy x3
- Stage 2 — Apex Predators: catch 3/6 evolved powerhouses → PP Max x2
- Stage 3 — Regional Specialists: 1 water + 1 cave + 1 forest migrant → Shell Bell
- Post-complete: Birch reflects on the published field guide

### Technical Notes
- Uses `specialvar VAR_RESULT, ScriptCheckSpeciesCaught` (not `special` — must capture return value)
- Stage 3 uses VAR_0x8005/8006/8007 for habitat counters (VAR_0x800C/800D don't exist in pokeemerald)
- ScriptCheckSpeciesCaught checks Pokedex caught flag via SpeciesToNationalPokedexNum + GetSetPokedexFlag

## Cycle 286: Reckoning Collection Quest Payoff

| File | What Changed |
|------|-------------|
| `include/constants/flags.h` | FLAG_RECKONING_COMPLETE at 0x2B4 |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | Reckoning check inserted at top of BirchQuestCheck — checks all 6 RECKONING_TALKED flags, fires BirchLab_EventScript_ReckoningAcknowledge (PP_MAX reward) |

### Quest Flow
- Trigger: Talk to all 6 ex-Team Magma/Aqua NPCs (FLAGS 0x2AB-0x2AD + 0x2B1-0x2B3)
- Payoff: Birch acknowledges, gives PP_MAX, sets FLAG_RECKONING_COMPLETE (0x2B4)
- Does NOT block other quest chains — falls through to normal BirchQuestCheck flow after completion

## Design Notes
- Johto starter flow takes priority over quest in Birch's script
- New NPCs (Hiker, Researcher) use flag "0" — always visible, dialogue gated in script
- Stages 1-3 are non-linear; Stage 4 requires all three; Stage 5 requires Stage 4
- Reckoning check is at the VERY TOP of BirchQuestCheck, before Johto starter and all other checks
