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
| Wild Encounters | 3, 4, 9, 14, 21, 47, 49, 52, 63, 68, 86, 91, 92, 98, 99, 100, 121, 136, 165, 166, 167, **207**, **208**, **219**, **230**, **237**, **250**, **256**, **257**, **261**, **264**, **265**, **267**, **279**, **294**, **298**, **310** (regenerated .h synced to JSON) | 3 (JSON + C + flags) | [wild-encounters.md](completed-work/wild-encounters.md) |
| Trainer Parties | 6–12, 16, 17, 19, 49–58, 71–74, 89, 90, 94, 101, 102, 122–124, 126, 127, 130–133, 136, 146, 147, 148, 150, 172, 173, 175, 176, 177, 182, 203, 204, **206**, **212**, **213**, **214**, **218**, **244**, **247**, **248**, **249**, **251**, **262**, **264**, **265**, **267**, **268**, **270**, **271**, **272**, **273**, **280**, **293**, **294**, **298**, **304**, **307**, **308**, **309** | 6 (parties, trainers, opponents, battle_setup, flags, learnsets) | [trainer-parties.md](completed-work/trainer-parties.md) |
| NPC Dialogue (all regions + narrative) | 15, 24–29, 32, 33, 36, 38, 42, 50, 63, 65, 94, 95, 103, 104, 113, 116, 120, 125, 126, 135, 136, 137, 139, 140, 141, 142, 144, 145, 146, 149, 152, 153, 154, 159, 160, 161(reverted), 162, 180, 181, 183, 186, 187, 188, 189, 190, 192, 193, 194, 195, 200, 203, 204, 205, **207**, **208**, **209**, **210**, **213**, **214**, **224**, **225**, **232**, **233**, **235**, **236**, **237**, **242**, **243**, **244**, **248**, **249**, **250**, **257**, **258**, **262**, **267**, **269**, **270**, **271**, **272**, **273**, **279**, **280**, **284**, **285**, **286**, **298**, **299**, **303**, **307**, **308**, **309** | ~90 | [npc-dialogue.md](completed-work/npc-dialogue.md) |
| Battle Engine (P/S Split + Fairy + Gen4/5 Moves + Difficulty + Custom Abilities + Signature Moves + Animations) | 43–46, 52, 129, 181, 182, **207**, **210**, **241**, **288**, **289**, **290**, **293**, **294**, **297**, **300**, **310** | 19 (+19 modified; C310 Fey Flame: abilities.h, text/abilities.h, pokemon.c, battle_string_ids.h, battle_message.c, battle_scripts_1.s, battle_scripts.h, battle_util.c, species_info.h, trainer_parties.h, scripts/check_species_registration.sh) | [battle-engine.md](completed-work/battle-engine.md) |
| QoL Changes & Release | 22, 23, 37, 38, 75, 105, 107, **158**, **214**, **229**, **297** | 31 | [qol-and-release.md](completed-work/qol-and-release.md) |
| New Species | **60**, **61**, **68**, **70**, **195**, **198**, **208**, **212**, **213**, **214**, **216**, **217**, **218**, **219**, **222**, **223**, **230**, **231**, **240**, **250**, **251**, **252**, **256**, **257**, **259**, **261**, **263**, **264**, **265**, **276**, **277**, **278**, **280**, **288**, **292**, **293**, **294**, **302**, **304**, **307**, **308** | 29 source + 30+ assets | [new-species.md](completed-work/new-species.md) |
| Protagonist Palette Recolor | **228** | 16 .pal + 6 PNG = 22 files | [protagonist-palette.md](completed-work/protagonist-palette.md) |
| Engineering Validation | 112, 118, 127, 141, 145, 170, 179, 185, 190, 192, 195, 202, **206**, **220**, **222**, **225**, **247**, **254**, **260**, **266**, **275**, **281**, **287**, **290**, **293**, **308**, **310** | Makefile + 10 scripts + event_macros.inc + legend_macros.inc + trainer audit + species pipeline + gap-filler + **species generator (27-file + --fill-missing C293)** + **trainer generator** + **NPC dialogue generator** (+ --update C287) + **verify_species.sh** (C287) | [engineering-validation.md](completed-work/engineering-validation.md) |
| Battle Frontier Fixes | **78**, 80, **85** | 3 | [battle-frontier.md](completed-work/battle-frontier.md) |
| Birch Postgame Quest + Migration Tracker | **84**, **96** | 12 (flags + 6 scripts + 2 map.json + birch_pc.c + specials.inc) | [birch-quest.md](completed-work/birch-quest.md) |
| Wild Held Items | **93** | 1 (species_info.h — 19 species) | [wild-held-items.md](completed-work/wild-held-items.md) |
| Roamer System (Beast Core) | 109, 111, 112, **142** | 10 (roamer.c, roamer.h, flags.h, battle_main.c, battle_ai_scripts.s, specials.inc, BirchLab/scripts.inc, tv.inc, Route118/scripts.inc, FortreeCity/scripts.inc) + 6 sighting NPC fixes | [roamer-system.md](completed-work/roamer-system.md) |
| Migration Climax + Primal Stirring | 115, 116, 118, 120, 121, 122, 123, 124, 125, **126** | BirchLab, CaveOfOrigin, 3 city scripts, flags.h, 6 NPC scripts+maps, TerraCave+SeafloorCavern scripts+maps, remnant trainers+parties, Groudon+Kyogre encounters, world reaction | [migration-climax.md](completed-work/migration-climax.md) |
| Regional Variant Pipeline | PoC validated + first species (C195) | 30+ files | [regional-variant-pipeline.md](../regional-variant-pipeline.md) |

---

## Files Modified 3+ Times (v2.0-Relevant — Watch for Overwrites)

- **BirchLab/scripts.inc**: 15 cycles (last: C286) — difficulty selection, migration dialogue, legendary saga, Changed Three postgame gift, Reckoning collection payoff
- **MossdeepCity/scripts.inc**: 8 cycles (last: **C309** Sootopolis-gym rumor line) — beast sightings, post-climax reactions, badge-conditional atmosphere
- **SootopolisCity/scripts.inc**: 6 cycles (last: **C309**) — Rayquaza reactions, badge-conditional atmosphere; C309 gym sign LEADER: WALLACE, Wallace fades out after HM Waterfall (FLAG_HIDE_SOOTOPOLIS_CITY_WALLACE)
- **PacifidlogTown/scripts.inc**: 10 cycles (last: C195) — Draconid legend, breadcrumbs, badge-conditional atmosphere, Quest 1 encounter
- **trainer_parties.h / trainers.h**: ~35 cycles each — all trainer data. C294: Swampert_Hoenn replaces vanilla Swampert as postgame rival ace (Torchic variant). C310: rival Blaziken_Hoenn (Treecko variant) Shadow Ball → Will-O-Wisp (battle-engine.md).
- **wild_encounters.json**: 32 cycles (last: C294) — all encounter tables. C294: restored SPECIES_MUDKIP_HOENN in Shoal Cave Inner Room (slot 8, 4%)
- **include/constants/flags.h**: Many cycles — custom flags through 0x2B4 (FLAG_RECKONING_COMPLETE C286), next: 0x2B5
- **include/constants/species.h**: Many cycles — **40 custom species** through 450 (Toxapex), EGG=451, NUM_SPECIES=451. C308: Toxapex re-registered + 16 partial species repaired to 27/27. MOVES_COUNT=381 (Iron Leaf=380).
- **LittlerootTown/scripts.inc**: C280 — postgame rival battle script + dialogue (OnTransition show/hide + gender/starter branching + cleartrainerflag rematches)
- **EverGrandeCity_ChampionsRoom/scripts.inc**: C303 (Wallace witness dialogue), **C308** (Steven champion swap — all labels/texts Steven, VAR_STARTER_MON beat). HallOfFame + DrakesRoom also C308.
- **Sootopolis Wallace cascade (C309)**: SootopolisCity_Gym_1F (scripts.inc + map.json: Wallace object + Juan cameo at 9,2), Gym_B1F, PokemonCenter_1F, House3, CaveOfOrigin_B1F, MossdeepCity, data/text/match_call.inc, src/data/text/match_call_messages.h, src/strings.c, trainer_parties.h/trainers.h (sParty_WallaceGym1-5) + scripts/trainer_configs/wallace_gym_1-5.json. Details: trainer-parties.md + npc-dialogue.md.

Full history for other files: see detail files or `git log`.
