# Completed Work Registry

**Index only** (compacted C380): one line per system; the full cycle and file lists live in each detail file ("Index row" section at its end). **MANDATORY before modifying any game file**: `grep -rn <filename> memory/completed-work.md memory/completed-work/` (the detail files name every touched file), then `git log --oneline -5 -- <path>`, then read the file.

| System | Cycles | Key files | Detail |
|--------|--------|-------|--------|
| Starters & Core Mechanics | 2-86 | 7 files (starters, core mechanics) | [starters-core-mechanics.md](completed-work/starters-core-mechanics.md) |
| Wild Encounters | 3-310 | wild_encounters.json + C + flags | [wild-encounters.md](completed-work/wild-encounters.md) |
| Trainer Parties | 6-334 | trainer_parties.h, trainers.h, opponents.h, battle_setup, trainer_configs/*.json | [trainer-parties.md](completed-work/trainer-parties.md) |
| NPC Dialogue (all regions + narrative) | 15-326 | ~90 map scripts.inc | [npc-dialogue.md](completed-work/npc-dialogue.md) |
| Battle Engine (P/S, Fairy, Gen4/5 moves, difficulty, abilities, signature moves, animations, Bag lock) | 43-325 | battle_*.c/.s, abilities, moves, anims | [battle-engine.md](completed-work/battle-engine.md) |
| Discovery Beats (statics, cue signs, Field Notes, FIELD NOTES item, believers, dens) | 312-345 | flags.h, event_macros.inc, match_call.c, prof_birch.inc, den + believer maps | [discovery-beats.md](completed-work/discovery-beats.md) |
| QoL Changes & Release | 22-297 | 31 files | [qol-and-release.md](completed-work/qol-and-release.md) |
| New Species | 60-318 | 29 source + 30+ assets | [new-species.md](completed-work/new-species.md) |
| Protagonist Palette Recolor | 228 | 16 .pal + 6 PNG | [protagonist-palette.md](completed-work/protagonist-palette.md) |
| Engineering Validation (lints, generators, PLAYTEST presets) | 112-361 | Makefile + scripts/*.cjs/*.sh | [engineering-validation.md](completed-work/engineering-validation.md) |
| Battle Frontier Fixes | 78-85 | 3 files | [battle-frontier.md](completed-work/battle-frontier.md) |
| Birch Postgame Quest + Migration Tracker | 84, 96 | 12 files (birch_pc.c, specials.inc, scripts) | [birch-quest.md](completed-work/birch-quest.md) |
| Wild Held Items | 93 | species_info.h | [wild-held-items.md](completed-work/wild-held-items.md) |
| Roamer System (Beast Core) | 109-142 | roamer.c/.h + 8 files | [roamer-system.md](completed-work/roamer-system.md) |
| Migration Climax + Primal Stirring | 115-126 | BirchLab, CaveOfOrigin, city scripts, flags.h | [migration-climax.md](completed-work/migration-climax.md) |
| v3.1 Taken at Their Word + v3.2 Worn In | 348-358 | Route106/113/119, GraniteCave_B1F, new_game.inc, trainer configs | [v31-taken-at-their-word.md](completed-work/v31-taken-at-their-word.md) |
| Regional Variant Pipeline | 195 | 30+ files | [regional-variant-pipeline.md](regional-variant-pipeline.md) |
| v3.3 First Ink (Hours 0-6) | 361-365 | Route102/104, PetalburgWoods, match_call.c, harness + playtests | [v33-first-ink.md](completed-work/v33-first-ink.md) |
| v3.4 Word Travels (Slateport/Mauville) | 367-372 | Route109, MauvilleCity, checkpoints.ts, trainer configs, playtests | [v34-word-travels.md](completed-work/v34-word-travels.md) |
| v3.5 Taken North + v3.6 empty peg (Fortree) | 374 LOST, 375-379 | FortreeCity, slot 486 trainer data, fortree_charm_keeper.json, playtests | [v35-taken-north.md](completed-work/v35-taken-north.md) |
| v3.7 Rain indoors (Weather Institute 2F) | 381-382 | Route119_WeatherInstitute_2F/scripts.inc, villain_shelly_weather_institute.json, trainer_parties.h, beats.json, checkpoints.ts + playtest.ts + playtest.test.ts (C382 expectBattleSummary), playtests/README.md, 6 playtests | [v37-rain-indoors.md](completed-work/v37-rain-indoors.md) |
| beats.json tooling | 373, 381 | scripts/lib/beats.cjs, beats.json, check_beats.cjs | [beats-tooling.md](completed-work/beats-tooling.md) |
| Playtest Hook (runner infrastructure) | 364-365 | playtest.h/.c, intro.c, overworld.c hooks | [playtest-hook.md](completed-work/playtest-hook.md) |
| Memory-only cycles | 380 | memory/ only (codebase-facts split into codebase-facts/*.md) | — |

## Files modified 3+ times (watch for overwrites)

Full notes per file: [hot-files.md](completed-work/hot-files.md). BirchLab/scripts.inc (C325) · MossdeepCity/scripts.inc (C309) · SootopolisCity/scripts.inc (C320) · FortreeCity/scripts.inc + map.json (C379) · trainer_parties.h / trainers.h (~36 cycles) · wild_encounters.json (C346) · Route104/scripts.inc (C364) · include/constants/flags.h · include/constants/species.h · MtPyre_Exterior · MeteorFalls_B1F_2R/_1R · ShoalCave_LowTide rooms · src/data/trade.h · asm/macros/event_macros.inc · MeteorFalls_StevensCave + 1F_1R · EverGrandeCity_ChampionsRoom · Reckoning rematches (C326) · Sootopolis Wallace cascade (C309).

Full history for other files: detail files or `git log`. v2.9 design archive: [v29-last-witness.md](completed-work/v29-last-witness.md).
