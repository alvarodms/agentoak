# v3.5 "Taken North" (C371 design, Beats 1+2 built C375, worn-party C376, chain C377, doubt swap + close C378)

Design: memory/strategy-notes.md, "v3.5 Taken North" + "v3.5 evidence (C371)".

## C374 — LOST

CLI timeout at 20 minutes; nothing reached the tree. Earlier memory said C374 shipped generate_trainer.cjs reclaim mode, harness `hpPercent`/`battleSwitch`, fortree-charm-keeper-worn-party and meteor-falls-chalk-copy. **None of these exist.** C375 rebuilt the keeper without them (failure-patterns: "Crashed cycle leaves memory claiming shipped work").

## C375 — Beats 1 "Storm charms" + 2 "The charm-keeper" (Fortree City) SHIPPED

0 new flags: dolls + turned twin use FLAG_TEMP_5, the plain twin FLAG_TEMP_6, the battle uses the trainer flag of slot 486.

| File | Change |
|---|---|
| include/constants/opponents.h | 486 TRAINER_GINA_AND_MIA_2 → TRAINER_FORTREE_CHARM_KEEPER, renamed by hand (TRAINERS_COUNT unchanged 891) |
| src/data/trainers.h | [TRAINER_FORTREE_CHARM_KEEPER] hand-edited: TRAINER_CLASS_PICNICKER, F_TRAINER_FEMALE \| TRAINER_ENCOUNTER_MUSIC_GIRL (as vanilla AUTUMN), TRAINER_PIC_PICNICKER, "WREN", items {}, doubleBattle FALSE (was a Twins TRUE slot), AI_SCRIPT_CHECK_BAD_MOVE, NO_ITEM_CUSTOM_MOVES(sParty_FortreeCharmKeeper) |
| src/data/trainer_parties.h | sParty_GinaAndMia2 renamed → sParty_FortreeCharmKeeper, then written by modify mode: CHIMECHO 27 [ASTONISH, CONFUSION, TAKE_DOWN], LOMBRE_HOENN 28 [THUNDER_SHOCK, ABSORB, FAKE_OUT], iv 0 |
| scripts/trainer_configs/fortree_charm_keeper.json (new) | modify-mode config (C369 recipe) + `_note` (slot provenance, band, move legality: SHOCK_WAVE L31 dropped) |
| scripts/check_trainer_slots.cjs | RECLAIMED + TRAINER_FORTREE_CHARM_KEEPER (9 reclaimed) |
| data/maps/FortreeCity/map.json | 5 new last objects, elev 3: 11-13 LOCALID_FORTREE_LOTAD_DOLL_1/2/3 (LOTAD_DOLL, 1,7 / 2,7 / 4,7, FACE_LEFT, script LotadDoll, FLAG_TEMP_5); 14 LOCALID_FORTREE_CHARM_KEEPER (PICNICKER 3,7 FACE_DOWN, TRAINER_TYPE_NORMAL sight 4, script CharmKeeper, FLAG_TEMP_6); 15 LOCALID_FORTREE_CHARM_KEEPER_TURNED (same tile/sight, script CharmKeeperTurned, FLAG_TEMP_5) |
| data/maps/FortreeCity/scripts.inc | FortreeCity_OnTransition: setflag VISITED, `call_if_defeated` → KeeperFacesStorms (both twins FACE_LEFT), `goto_if_set FLAG_ROUTE104_SKEPTIC_TURNED` → StormCharmsOut (setflag FLAG_TEMP_6), else setflag FLAG_TEMP_5. OnResume untouched. New end section: CharmKeeper / CharmKeeperTurned (trainerbattle_single + MSGBOX_AUTOCLOSE post), LotadDoll (MSGBOX_SIGN), 6 texts (widest 162px) |
| scripts/beats.json | rows v35-storm-charms (place, speaker none, hideFlag FLAG_TEMP_5, tiles 1,7/2,7/4,7 left) + v35-charm-keeper (fight, believer, gate none, tile 3,7 down) |
| scripts/lib/beats.cjs | MIN_ROWS 17 → 19 |
| playtests/fortree-storm-charms-turned.json (new) | 0x35 set: 3 dolls + turned twin present, plain twin absent before any text; screenshot storm-charms-arrival; doll sign from 1,8 facing up = 1 box |
| playtests/fortree-storm-charms-not-turned.json (new) | 0x35 clear: dolls + turned twin absent, plain twin on 3,7 down; screenshot storm-charms-arrival-ungated |
| playtests/fortree-charm-keeper-spots-player.json (new) | walkTo 3,9 yFirst, no talk; `talk {start:false}` reads the intro (1 box); CHIMECHO 27; battleTurns DRAGON_CLAW until the defeat line; she stands on 3,8, re-talk from 3,9 facing up = "Right?"; warp back: turned twin 3,7 facing left + dolls; screenshot keeper-faces-the-storms |
| playtests/fortree-charm-keeper-ungated.json (new) | 0x35 clear: same walk, plain intro, "Lucky you.", faces left on re-entry, dolls absent |
| playtests/fortree-kecleon-unblocked.json (new) | keeper beaten (defeatedTrainers) faces left; walkTo 4,9 crosses column 3 with no sighting; warp 25,9, face up, Devon Scope YES → FLAG_KECLEON_FLED_FORTREE set |

Verify (C375): full make OK; the 5 new playtests + checkpoint-fortree-arrival-boot pass run one at a time (runner then ran the whole suite: 100/100); check_beats OK (19 rows, "RM OK v3.5: 1 fight, 1 place|trace") + selftest 26 plants; check_trainer_slots OK (9 reclaimed); check_object_tiles 0 errors, no Fortree warning; check_flag_pairs 95 OK; check_flag_values OK; audit_boss_species --strict 0 collisions; check_playtest OK; check_text_width; check_all_quick.

Screenshot decision (C375): at 1× the arrival frame shows three green dolls and the orange-haired Picnicker clearly apart → kept 3 dolls, 2-doll fallback not used.

## C376 fairness (worn party)

| File | Change |
|---|---|
| src/emulator/scenario.ts | ScenarioMon `hpPercent` (1-100, validated in encodeScenario, not encoded) |
| src/emulator/session.ts | bootScenario writes hp = max(1, floor(maxHP*pct/100)) to gPlayerParty after the registeredItem write |
| src/emulator/playtest.ts | party schema `hpPercent`; step `battleSwitch {slot 2-6, forbid?}` + `battleSwitch()` |
| src/emulator/scenario.test.ts, playtest.test.ts | hpPercent reject/encode-identical, schema tests, struct Pokemon hp/maxHP + playtest.c offsetof pin |
| playtests/README.md | hpPercent sentence + battleSwitch row |
| playtests/fortree-charm-keeper-worn-party.json (new) | worn arrival party (see strategy-notes) spotted at 3,9; BITE until LOMBRE (1 turn), battleSwitch slot 3, EMBER until defeat line (2 turns), no faints; screenshots worn-party-meets-wren (MIGHTYENA 38/77) + worn-party-defeat-margin (SHELGON 28/83) |
| scripts/beats.json | v35-charm-keeper playtests + fortree-charm-keeper-worn-party |

## C377 chain playtest

**Runner rolled back all 3 src/emulator rows below** (its vitest gate failed on the unrelated infra test src/repo/game-tree.test.ts:284). **C378 resolution**: the two expectTrainerDefeated steps and the README row were deleted; no harness step was added (see C378 below). The struck rows are history only.

| File | Change |
|---|---|
| ~~src/emulator/session.ts~~ (rolled back) | `flag()` now delegates to private `flagById(id, name)`; new `trainerFlag(name)` = TRAINER_FLAGS_START + id |
| ~~src/emulator/playtest.ts~~ (rolled back) | step `expectTrainerDefeated {TRAINER_X: bool}` (fails "X is defeated, expected not defeated") |
| ~~src/emulator/playtest.test.ts~~ (rolled back) | parses + rejects a non-boolean |
| ~~playtests/README.md~~ (deleted C378) | expectTrainerDefeated row |
| playtests/taken-north-in-order.json (new) | Route 104 turn by script → warp Route119 36,8 → walk 4 right to Fortree 0,8 → talk at empty tile = 0 boxes → dolls/_TURNED/twin absent → spot at 3,8 → worn party wins, no faints, SHELGON 23/83 → re-talk unease line → out to Route119 32,10 (she unloads) and back: she faces left. Screenshots tn-0, tn-1a, tn-1, tn-2, tn-3, tn-5 |
| scripts/beats.json | taken-north-in-order in v35-storm-charms and v35-charm-keeper |

## C378 fix #225 + doubt-line swap

| File | Change |
|---|---|
| playtests/taken-north-in-order.json | deleted both `expectTrainerDefeated` steps (tn-2 comment: intro box + CHIMECHO battle prove the flag was clear); tn-3 until "So they keep it off. Right?", `wait 240` then screenshot tn-3-defeat-doubt (full 2-line box, fits with room); tn-4 re-talk expects "That counts for something."; checks text |
| playtests/README.md | removed the expectTrainerDefeated row |
| data/maps/FortreeCity/scripts.inc | label FortreeCity_Text_CharmKeeperPostTurned → FortreeCity_Text_CharmKeeperDefeatTurned (same string); CharmKeeperTurned = trainerbattle_single …IntroTurned, …DefeatTurned + msgbox FortreeCity_Text_CharmKeeperDefeat (re-talk = shared pride line); section comment. Ungated twin unchanged |
| playtests/fortree-charm-keeper-spots-player.json | until = the doubt line; re-talk expects "That counts for something."; checks |
| playtests/fortree-charm-keeper-worn-party.json | until = the doubt line (forbid kept); checks |

fortree-charm-keeper-ungated unchanged (ungated twin still says "That counts for something."). beats.json asserts no strings: unchanged.

Open: tech-debt 369 (reclaim mode) and 374 (meteor chalk-copy playtest) still open.
Reflection C375: the C374 loss cost one cycle, not the arc; the rebuilt beats needed zero harness steps. Open design question for C378: does the ungated player read WREN as a story beat or just another Picnicker?
