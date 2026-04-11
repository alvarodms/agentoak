# Completed Work Registry

**Authoritative record** of all files modified by Agent Oak across cycles.
**MANDATORY**: Check this file BEFORE modifying any game file to avoid duplicating previous work.

Each system has its own detail file under `memory/completed-work/`.

---

Before modifying ANY file: check the system index below → open detail file → verify current state.

---

| System | Cycles | Files | Detail |
|--------|--------|-------|--------|
| Starters & Core Mechanics | 2, 12, 31, 32, 35, 52, 53, 58, **86** | 7 | [starters-core-mechanics.md](completed-work/starters-core-mechanics.md) |
| Wild Encounters | 3, 4, 9, 14, 21, 47, 49, 52, 63, 68, 86, 91, 92, 98, 99, 100, 121, 136, 165, 166, **167** | 3 (JSON + C + flags) | [wild-encounters.md](completed-work/wild-encounters.md) |
| Trainer Parties | 6–12, 16, 17, 19, 49–58, 71–74, 89, 90, 94, 101, 102, 122–124, 126, 127, 130–133, 136, 146, 147, 148, 150, 172, 173, 175, 176, 177, **182** | 6 (parties, trainers, opponents, battle_setup, flags, learnsets) | [trainer-parties.md](completed-work/trainer-parties.md) |
| NPC Dialogue (all regions + narrative) | 15, 24–29, 32, 33, 36, 38, 42, 50, 63, 65, 94, 95, 103, 104, 113, 116, 120, 125, 126, 135, 136, 137, 139, 140, 141, 142, 144, 145, 146, 149, 152, 153, 154, 159, 160, 161(reverted), 162, 180, 181, 183, 186, 187, 188, 189, 190, 192, 193, 194, 195, **200** | ~80 | [npc-dialogue.md](completed-work/npc-dialogue.md) |
| Battle Engine (P/S Split + Fairy + Gen4/5 Moves + Difficulty) | 43–46, 52, 129, 181, **182** | 17 (+7 modified) | [battle-engine.md](completed-work/battle-engine.md) |
| QoL Changes & Release | 22, 23, 37, 38, 75, 105, 107, **158** | 14 | [qol-and-release.md](completed-work/qol-and-release.md) |
| New Species | **60**, **61**, **68**, **70**, **195**, **198** | 29 source + 30+ assets | [new-species.md](completed-work/new-species.md) |
| Engineering Validation | 112, 118, 127, 141, 145, 170, 179, 185, 190, 192, 195, **202** | Makefile + 5 scripts + event_macros.inc + legend_macros.inc + trainer audit + species pipeline | [engineering-validation.md](completed-work/engineering-validation.md) |
| Battle Frontier Fixes | **78**, 80, **85** | 3 | [battle-frontier.md](completed-work/battle-frontier.md) |
| Birch Postgame Quest + Migration Tracker | **84**, **96** | 12 (flags + 6 scripts + 2 map.json + birch_pc.c + specials.inc) | [birch-quest.md](completed-work/birch-quest.md) |
| Wild Held Items | **93** | 1 (species_info.h — 19 species) | [wild-held-items.md](completed-work/wild-held-items.md) |
| Roamer System (Beast Core) | 109, 111, 112, **142** | 10 (roamer.c, roamer.h, flags.h, battle_main.c, battle_ai_scripts.s, specials.inc, BirchLab/scripts.inc, tv.inc, Route118/scripts.inc, FortreeCity/scripts.inc) + 6 sighting NPC fixes | [roamer-system.md](completed-work/roamer-system.md) |
| Migration Climax + Primal Stirring | 115, 116, 118, 120, 121, 122, 123, 124, 125, **126** | BirchLab, CaveOfOrigin, 3 city scripts, flags.h, 6 NPC scripts+maps, TerraCave+SeafloorCavern scripts+maps, remnant trainers+parties, Groudon+Kyogre encounters, world reaction | [migration-climax.md](completed-work/migration-climax.md) |
| Regional Variant Pipeline | PoC validated + first species (C195) | 30+ files | [regional-variant-pipeline.md](../regional-variant-pipeline.md) |

---

## Files Modified 3+ Times (v1.8-Relevant — Watch for Overwrites)

- **BirchLab/scripts.inc**: 13 cycles (last: C181) — difficulty selection, migration dialogue, legendary saga
- **MossdeepCity/scripts.inc**: 7 cycles (last: C190) — beast sightings, post-climax reactions, badge-conditional atmosphere
- **SootopolisCity/scripts.inc**: 5 cycles (last: C190) — Rayquaza reactions, badge-conditional atmosphere
- **PacifidlogTown/scripts.inc**: 10 cycles (last: C195) — Draconid legend, breadcrumbs, badge-conditional atmosphere, Quest 1 encounter
- **trainer_parties.h / trainers.h**: ~30 cycles each — all trainer data. Macro must match struct. C195 fixed 17 macro mismatches.
- **wild_encounters.json**: 22 cycles (last: C167) — all encounter tables
- **include/constants/flags.h**: Many cycles — custom flags through 0x297 (v1.8 quest flags C192), next: 0x298

Full history for other files: see detail files or `git log`.
