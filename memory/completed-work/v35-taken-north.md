# v3.5 "Taken North" (C371 design, build C374-C376)

Design: memory/strategy-notes.md, "v3.5 Taken North" + "v3.5 evidence (C371)".

## C374 — Beat 2 "The charm-keeper" (Fortree City) SHIPPED

Ungated core, sighted (first Red Ink arc trainer with sight > 0). 0 new flags: twins use FLAG_TEMP_5 / FLAG_TEMP_6, the battle uses the trainer flag of slot 486.

| File | Change |
|---|---|
| scripts/generate_trainer.cjs | new `"mode": "reclaim"` (tech-debt 369): fromId → trainerId in opponents.h (same number, old column), whole [fromId] block of trainers.h rewritten (class, music\|gender, pic, name, items, doubleBattle, aiFlags, party macro), old party array (auto-detected) replaced under partyName, trainerId appended to check_trainer_slots RECLAIMED with a "486 ex-GINA_AND_MIA_2 (WREN)" note; refuses, writing nothing, if fromId appears in src/include/data/asm outside the 3 trainer files (tested on TRAINER_LUCAS_1 → names Route114/scripts.inc:88). `--dry-run` now prints -/+ diffs of each file's changed span for every mode |
| scripts/trainer_configs/fortree_charm_keeper.json (new) | reclaim config + `_note` (slot provenance, move legality, every left-out move and why) |
| include/constants/opponents.h | 486 TRAINER_GINA_AND_MIA_2 → TRAINER_FORTREE_CHARM_KEEPER (TRAINERS_COUNT unchanged 891) |
| src/data/trainers.h | [TRAINER_FORTREE_CHARM_KEEPER]: TRAINER_CLASS_PICNICKER, F_TRAINER_FEMALE \| TRAINER_ENCOUNTER_MUSIC_GIRL, TRAINER_PIC_PICNICKER, "WREN", items {}, doubleBattle FALSE (was a Twins TRUE slot), AI_SCRIPT_CHECK_BAD_MOVE, NO_ITEM_CUSTOM_MOVES(sParty_FortreeCharmKeeper) |
| src/data/trainer_parties.h | sParty_GinaAndMia2 → sParty_FortreeCharmKeeper: CHIMECHO 27 [CONFUSION, ASTONISH, TAKE_DOWN], LOMBRE_HOENN 28 [SHOCK_WAVE, THUNDER_SHOCK], iv 0 |
| scripts/check_trainer_slots.cjs | RECLAIMED + TRAINER_FORTREE_CHARM_KEEPER (9 reclaimed; written by the tool) |
| data/maps/FortreeCity/map.json | 2 new last objects (11, 12) on 3,7 elev 3, OBJ_EVENT_GFX_PICNICKER, FACE_DOWN, TRAINER_TYPE_NORMAL sight 4: LOCALID_FORTREE_CHARM_KEEPER (script CharmKeeper, flag FLAG_TEMP_6), LOCALID_FORTREE_CHARM_KEEPER_TURNED (script CharmKeeperTurned, flag FLAG_TEMP_5) |
| data/maps/FortreeCity/scripts.inc | FortreeCity_OnTransition: after setflag FLAG_VISITED_FORTREE_CITY, `call_if_set`/`call_if_unset FLAG_ROUTE104_SKEPTIC_TURNED` → ShowTurnedKeeper (setflag FLAG_TEMP_6) / ShowPlainKeeper (setflag FLAG_TEMP_5); `call_if_defeated TRAINER_FORTREE_CHARM_KEEPER` → KeeperFacesStorms (both twins MOVEMENT_TYPE_FACE_LEFT). OnResume untouched. New section at file end: CharmKeeper / CharmKeeperTurned (trainerbattle_single + post msgbox MSGBOX_AUTOCLOSE) and the 5 texts verbatim from the plan (check_text_width widest 160px, nothing shortened) |
| scripts/beats.json | row v35-charm-keeper (fight, believer, gate none, tile [3,7,down], 4 playtests, seeFirst "A woman standing at the meadow's edge sees you pass and walks over to you before a word is spoken."). Stretch: meteor-falls-steven-chalk playtests [meteor-falls-chalk-copy], b5Exempt removed |
| scripts/lib/beats.cjs | MIN_ROWS 17 → 18 |
| src/emulator/scenario.ts | ScenarioMon `hpPercent` + exported `partyHp(maxHp, pct)` (floor, min 1; rejects outside 1-100) |
| src/emulator/session.ts | bootScenario → `applyPartyHp` writes gPlayerParty[i].hp once CB2_Overworld appears |
| src/emulator/playtest.ts | schema party `hpPercent`; new step `battleSwitch: N` + `battleSwitch()` + exported PARTY_MENU_SLOT_ID 9 |
| src/emulator/scenario.test.ts, playtest.test.ts | hpPercent rounding/range/not-in-struct; battleSwitch schema + struct PartyMenu field order |
| playtests/README.md | party `hpPercent` sentence; `battleSwitch` row |
| playtests/fortree-charm-keeper-spots-player.json (new) | 0x35 set: turned twin present, plain absent; walkTo 3,9 yFirst (no talk); intro "You walked right past the charms!" = 1 box; SALAMENCE 50 wins; she stands on 3,8; re-talk = 1 box "So they keep it off. Right?"; warp back: on 3,7 facing left (screenshot keeper-faces-the-storms, keeper alone; C375 retakes it with dolls); the same walk is then free |
| playtests/fortree-charm-keeper-ungated.json (new) | 0x35 clear: plain twin; intro "Stop! Nobody climbs to Fortree" (no "charms"); post "The wind's calm today." (no LOTAD); faces left on re-entry |
| playtests/fortree-charm-keeper-worn-party.json (new, MUST PASS) | MIGHTYENA 28 (INTIMIDATE) + SHELGON 30, both hpPercent 50, empty bag: BITE until "Will OAK change", battleSwitch 2, HEADBUTT until "not very effective" + defeat line, forbid any faint. Measured: MIGHTYENA took 0 (38/77), SHELGON ends 22/82 from 41 |
| playtests/fortree-kecleon-unblocked.json (new) | keeper beaten (defeatedTrainers) faces left and spots no one; walk 0,8 → 10,8 (crosses 3,8) → ladder to 10,4; warp 25,4 (row 4 is blocked at 15,4 by the C267 elder, not by C374), down to 25,7, Devon Scope YES: Kecleon flees, FLAG_KECLEON_FLED_FORTREE set, object 7 gone, 25,9 reachable |
| playtests/meteor-falls-chalk-copy.json (new, tech-debt 374) | Treecko den caught + FIELD NOTES: 7,3 facing the chalk (8,3): answer + "You copy it down." (2 boxes), FLAG_DEN_METEOR_STEVEN_CHALK set; re-read = ChalkCopied, 1 box, no copy line |

Verify (C374): check_trainer_slots OK (9 reclaimed), check_doubles OK, check_flags 95 custom flags OK, check_object_tiles 0 errors (twins on one tile accepted, no allowlist), check_beats OK (18 rows; "RM pending: v3.5 has 1 row"; B5 0 whole-row exemptions) + selftest 26 plants, check_beat_visibility, check_playtest, check_text_width, check_bosses 0 collisions, check_flag_values, check_scripts, check_trainers; `npm run build:check`, `npm test` 491/491; full make OK; suite 100/100. W-ORPHAN now 14 (checkpoint-fortree-arrival-boot boots on a beat map; warning only).
