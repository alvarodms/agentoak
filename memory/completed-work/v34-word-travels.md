# v3.4 "Word Travels" (C366 design, build C367-C371)

Design: memory/strategy-notes.md, v3.4 section.

## C367 — groundwork (refactor, no player-visible ROM change)

No data/maps, src/ or include/ file touched.

| File | Change |
|---|---|
| src/emulator/checkpoints.ts (new) | `CHECKPOINTS` (slateport_arrival: Route 109 21,23, Briney + boat shown, Devon Goods undelivered; mauville_pre_wattson: Mauville 18,17, post-Slateport/Route 110, Wally pending) with a file:line comment per value; `applyCheckpoint()` (test wins; temp-key guard) |
| src/emulator/checkpoints.test.ts (new) | merge order, partial tile, FLAG_TEMP_/VAR_TEMP_ guard, limits with 20 flags spare, every name defined in flags.h/vars.h |
| src/emulator/scenario.ts | `checkpoint?` field; map/x/y optional (encodeScenario requires them); `resolveScenario` applies the checkpoint first; `LIMITS` exported |
| src/emulator/playtest.ts | ScenarioSchema `checkpoint` + refines (map/x/y all-or-none, required without checkpoint); `expectBoxCount` step + exported `messageBoxes()` |
| src/emulator/playtest.test.ts | expectBoxCount parse + counting/exclusions; checkpoint schema |
| pokeemerald/playtests/checkpoint-slateport-arrival-boot.json (new) | boot, idle, 21,23 on Route 109, Briney 21,24 + boat 21,26 visible, warp Slateport 20,24 |
| pokeemerald/playtests/checkpoint-mauville-pre-wattson-boot.json (new) | boot, idle, 18,17; warp 12,10, Wally 8,6 + uncle 9,6 present |
| pokeemerald/playtests/route104-ivan-defeated-talk.json | + `expectBoxCount: 1` |
| pokeemerald/playtests/README.md | `checkpoint` scenario field, `expectBoxCount` row |
| pokeemerald/scripts/beats.json (new) | 15 shipped beat rows (v3.0-v3.3), 7 allow entries |
| pokeemerald/scripts/check_beats.cjs (new) | B0-B4 + `--selftest` (planted failure per rule), `walkLabels()` |
| pokeemerald/Makefile | `check_beats` target, .PHONY, check_all after check_beat_visibility |

Suite 86/86. Lint migration of check_playtest / check_beat_visibility / check_object_tiles onto beats.json moved to C370 (parity baseline in strategy-notes C367 spec).

## C368 — Beat 1 "Storm watch" (Route 109) SHIPPED

Gate FLAG_ROUTE104_SKEPTIC_TURNED (0x35). 0 new flags (doll = FLAG_TEMP_3, boy = trainer flag 462).

| File | Change |
|---|---|
| data/maps/Route109/map.json | `local_id` LOCALID_ROUTE109_SANDCASTLE_BOY (24,18) + LOCALID_ROUTE109_SOFT_SAND_GIRL (25,18), other fields unchanged; new last object LOCALID_ROUTE109_LOTAD_DOLL (OBJ_EVENT_GFX_LOTAD_DOLL, 24,19 elev 3, FACE_DOWN, flag FLAG_TEMP_3, Route109_EventScript_LotadDoll) |
| data/maps/Route109/scripts.inc | first map script: ON_TRANSITION `Route109_OnTransition` (0x35 → both kids MOVEMENT_TYPE_FACE_DOWN; else setflag FLAG_TEMP_3); SandCastleBoy first line `goto_if_set 0x35 → StormWatcher` (vanilla body kept); new StormWatcher (lock, faceplayer, goto_if_defeated, intro msgbox, trainerbattle_no_intro, goto Done), StormWatcherDone (faceplayer, post, FaceOriginalDirection), LotadDoll (MSGBOX_SIGN); 4 texts verbatim from strategy-notes |
| include/constants/opponents.h | 462 TRAINER_KAYLEE → TRAINER_ROUTE109_STORM_WATCHER (TRAINERS_COUNT unchanged 891) |
| src/data/trainers.h | [TRAINER_ROUTE109_STORM_WATCHER]: TUBER_M class/pic, TRAINER_ENCOUNTER_MUSIC_GIRL + AI_SCRIPT_CHECK_BAD_MOVE (copied from vanilla CHANDLER), "TOBY", NO_ITEM_CUSTOM_MOVES |
| src/data/trainer_parties.h | sParty_Kaylee → sParty_Route109StormWatcher: PLUSLE 14 (SHOCK_WAVE only), MINUN 13 (SHOCK_WAVE, GROWL), iv 0 |
| scripts/trainer_configs/route109_storm_watcher.json (new) | modify-mode config with _note (move legality, no THUNDER_WAVE reason) |
| scripts/check_trainer_slots.cjs | RECLAIMED + TRAINER_ROUTE109_STORM_WATCHER (7 reclaimed) |
| scripts/beats.json | row `v34-storm-watch` (register place, stranger, tiles [24,19,down],[24,18,down],[25,18,down]) |
| scripts/check_beats.cjs | MIN_ROWS 15 → 16 |
| playtests/route109-storm-watch-turned.json (new) | doll at 24,19 facing down visible from landing 21,23 before any text; one step north (21,22) → kids 24,18/25,18 facing down; doll talk from 24,20 = 1 box "facing the sea." |
| playtests/route109-storm-watch-not-turned.json (new) | doll absent, boy right / girl left, vanilla sandcastle line, 1 box, no battle, boy back to right |
| playtests/route109-storm-watch-defeated.json (new) | walkTo 24,17 yFirst; intro 1 box; PLUSLE 14 SHOCK WAVE "not very effective" on turn 1; RAIN DISH Lotad_H Lv25 MEGA DRAIN wins in 6 turns (3 per mon on this seed); "Heard it from a kid on 104." in battle; post line; re-talk 1 box, boy faces down |

Planted break (step 12): renaming a playtest in the row → `check_beats: B1 v34-storm-watch: playtest route109-storm-watch-defeatedX has no playtests/…json`, exit 1; reverted → OK (16 rows). Verify: check_all exit 0, check_text_width widest 145px, audit_boss_species --strict 0 collisions, suite 89/89 (both checkpoint boots still pass: they don't set 0x35, so the kids look vanilla there).
