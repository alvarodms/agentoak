# v3.5 "Taken North" (C371 design, Beats 1+2 built C375, worn-party C376, chain C377, doubt swap + close C378)

Design: memory/strategy-notes.md, "v3.5 Taken North" + "v3.5 evidence (C371)".

## C374 — LOST

CLI timeout at 20 minutes; nothing reached the tree. Earlier memory said C374 shipped generate_trainer.cjs reclaim mode, harness `hpPercent`/`battleSwitch`, fortree-charm-keeper-worn-party and meteor-falls-chalk-copy. **None of these exist.** C375 rebuilt the keeper without them (failure-patterns: "Crashed cycle leaves memory claiming shipped work").

## C375 — Beats 1 "Storm charms" + 2 "The charm-keeper" (Fortree City) SHIPPED

0 new flags: dolls + turned twin use FLAG_TEMP_5, the plain twin FLAG_TEMP_6, the battle uses the trainer flag of slot 486.

Files (C375, detail in git history at 6d670d3): opponents.h + trainers.h + trainer_parties.h slot 486 hand rename → WREN (CHIMECHO 27 + LOMBRE_HOENN 28, iv 0); scripts/trainer_configs/fortree_charm_keeper.json; check_trainer_slots RECLAIMED; FortreeCity map.json objects 11-15 (dolls 1,7/2,7/4,7, keeper twins 3,7 sight 4); FortreeCity scripts.inc OnTransition + CharmKeeper/CharmKeeperTurned/LotadDoll + 6 texts; beats.json v35-storm-charms + v35-charm-keeper; playtests fortree-storm-charms-turned/-not-turned, fortree-charm-keeper-spots-player/-ungated, fortree-kecleon-unblocked.

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

## C379 v3.6 "The ink has a price" Beat 1 "The empty peg" (gap only; v3.6 closed at this beat)

FortreeCity temp flags now: **FLAG_TEMP_5** = DOLL_1 (1,7) + DOLL_3 (4,7) + the _TURNED twin; **FLAG_TEMP_6** = the ungated twin; **FLAG_TEMP_7** = DOLL_2 (2,7), set when not turned OR (turned + Badge 6 + TRAINER_FORTREE_CHARM_KEEPER beaten). Temp flags reset on every warp-in, so the gap is re-derived by OnTransition each load (no flag spent).

| File | Change |
|---|---|
| data/maps/FortreeCity/map.json | LOCALID_FORTREE_LOTAD_DOLL_2 flag FLAG_TEMP_5 → FLAG_TEMP_7 (nothing else) |
| data/maps/FortreeCity/scripts.inc | OnTransition: not-turned path also sets FLAG_TEMP_7; StormCharmsOut: after FLAG_TEMP_6, `goto_if_unset FLAG_BADGE06_GET` / `goto_if_not_defeated` → StormCharmsEnd, else setflag FLAG_TEMP_7. CharmKeeperTurned (still starts with trainerbattle_single): `goto_if_set FLAG_BADGE06_GET` → CharmKeeperEmptyPeg ("One of them went into the storm.\nI'll set it out again tomorrow.$", 168px, lint OK). Ungated twin unchanged |
| scripts/beats.json | row v36-empty-peg (place, gate {flag FLAG_BADGE06_GET, trainer TRAINER_FORTREE_CHARM_KEEPER}; gate has one flag only, so 0x35 is named in `arc`), hideFlag FLAG_TEMP_7, tile [2,7,left] |
| scripts/lib/beats.cjs | MIN_ROWS 19 → 20 |
| playtests/fortree-empty-peg-badge.json (new) | 0x35 + Badge 6: 3 dolls pre-battle → spotted at 3,9 → 2-turn win → warp 5,7 → A facing down = 0 boxes, DOLL_2 absent, DOLL_1/3 + _TURNED facing left → walk 3,8 → re-talk 1 box empty-peg line → warp again, still absent |
| playtests/fortree-empty-peg-no-badge.json (new) | 0x35, no Badge 6: same battle → warp 5,7 → all 3 dolls → re-talk "That counts for something." (expectNoText the peg line) |
| playtests/fortree-empty-peg-not-turned.json (new) | Badge 6, no 0x35: warp 5,7 → no dolls, no _TURNED, plain WREN 3,7 facing down; no battle |

**Measured C379** (built ROM, suite 105/105): from the heal point 5,7 the camera shows columns -2..12, so the gap at 2,7 is on screen three tiles left of the player (upscaled screenshot: grass where DOLL_2 stands in the no-badge shot). Lv70 SALAMENCE DRAGON CLAW beats WREN in **2 turns** (one per mon; maxTurns 1 fails after CHIMECHO faints).
