# v3.4 "Word Travels" (C366 design, build C367-C371)

Design: memory/strategy-notes.md, v3.4 section.

## C367 — groundwork (refactor): src/emulator/checkpoints.ts(+test), scenario.ts `checkpoint`, playtest.ts `expectBoxCount`, 2 checkpoint boot playtests, scripts/beats.json (15 rows) + check_beats.cjs + Makefile target. Suite 86/86. See git history C367.

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

## C369 — Beat 2 "Half a fact" (Mauville City) SHIPPED

Ungated (gate d). 0 new flags (DAX = trainer flag of slot 485). No map script added (Mauville keeps ON_TRANSITION only).

| File | Change |
|---|---|
| data/maps/MauvilleCity/map.json | new last object LOCALID_MAUVILLE_GYM_HOPEFUL (OBJ_EVENT_GFX_YOUNGSTER, 10,7 elev 3, FACE_LEFT, TRAINER_TYPE_NONE, sight 0, flag 0, MauvilleCity_EventScript_GymHopeful); 10,7 and talk tile 11,7 = General_Grass c0 e3 (map_scan) |
| data/maps/MauvilleCity/scripts.inc | after WallyRequestBattleAgain: GymHopeful (lock, faceplayer, goto_if_defeated → Done, trainerbattle_no_intro, goto Done), GymHopefulDone (faceplayer, post msgbox, closemessage, LOCALID FaceOriginalDirection); texts GymHopefulDefeat / GymHopefulPost after ScottYouDidntHoldBack, verbatim from strategy-notes (defeat text ends in full stops) |
| include/constants/opponents.h | 485 TRAINER_AMY_AND_LIV_3 → TRAINER_MAUVILLE_GYM_HOPEFUL (TRAINERS_COUNT unchanged 891). 485 was not in REMATCH_AMY_AND_LIV (battle_setup.c uses _1/_2/_4/_5/_6) |
| src/data/trainers.h | [TRAINER_MAUVILLE_GYM_HOPEFUL]: YOUNGSTER class/pic, TRAINER_ENCOUNTER_MUSIC_MALE, AI_SCRIPT_CHECK_BAD_MOVE (as all 18 vanilla Youngsters), "DAX", **doubleBattle FALSE** (was TRUE for the Twins slot), NO_ITEM_CUSTOM_MOVES |
| src/data/trainer_parties.h | sParty_AmyAndLiv3 → sParty_MauvilleGymHopeful: SANDSHREW 19 (SCRATCH, DEFENSE_CURL), TRAPINCH 20 (BITE, FAINT_ATTACK), iv 0 |
| scripts/trainer_configs/mauville_gym_hopeful.json (new) | modify-mode config; _note: reclaim rationale, move legality, why no POISON_STING/SAND_ATTACK/DIG |
| scripts/check_trainer_slots.cjs | RECLAIMED + TRAINER_MAUVILLE_GYM_HOPEFUL (8 reclaimed) |
| scripts/beats.json | row `v34-half-a-fact` (register fight, gate none, stranger, tiles [10,7,left], no hideFlag) |
| scripts/check_beats.cjs | MIN_ROWS 16 → 17 |
| playtests/mauville-half-a-fact-lotad.json (new) | warp 12,9; DAX 10,7 left before any text; talk from 11,7 = 0 boxes → SANDSHREW 19; THUNDERSHOCK "doesn't affect"; GIGA DRAIN (slot 2) "super effective"; TRAPINCH 20, GIGA DRAIN "super effective"; "whole plan"; post; DAX back to left; re-talk 1 box (one msgbox, 2 pages), no battle |
| playtests/mauville-half-a-fact-no-lotad.json (new) | 0x35 cleared, no caught; DAX present; 0 boxes → Linoone 45 HEADBUTT one-shots both; post; DAX faces left |
| playtests/mauville-half-a-fact-wally-unblocked.json (new) | warp 9,9; DAX visible; Wally from 8,7 facing up (DIR_NORTH), YES, GIGA DRAIN beats RALTS 16; whole exit + Scott scene; FLAG_DEFEATED_WALLY_MAUVILLE, Wally absent, DAX 10,7 left, player 8,7 |
| playtests/README.md | "Fighting a battle": move slot 2 = A, RIGHT, A; the cursor stays on the last move used next turn |

Verify (C369): all 3 new playtests passed on the first run (lotad 6152 frames, no-lotad 4185, wally-unblocked 8481); suite 92/92; `make check_all` exit 0 (check_beats 17 rows / 8 strangers text-walked; check_trainer_slots 8 reclaimed; check_object_tiles 177 destinations, 209 start tiles, 0 errors, 13 warnings; check_text_width widest new line 151px; check_flag_pairs 95 flags, unchanged); audit_boss_species --strict 0 collisions; npm build:check + npm test (480) pass. Plan deviation: the re-talk asserts `expectBoxCount: 1`, not 2 (one msgbox with a \p is one box).

## C370 — story-level proof (harness + 2 playtests, no ROM gameplay change)

| File | Change |
|---|---|
| src/emulator/playtest.ts | `battleTurns` step ({move 1-4, until, maxTurns=10, forbid}; FIGHT/slot reset UP+LEFT each turn, waits for the turn's first message before tapping B, returns mid-turn once all `until` strings showed; fails on forbid, battle end (callback2 ≠ BattleMainCB2) or maxTurns); `forbid` on `waitForBattleText`; `expectBattle` polls until the expected foe/level (stale gBattleMons from an earlier battle in the same test) |
| src/emulator/playtest.test.ts | battleTurns parse/reject, waitForBattleText forbid |
| pokeemerald/playtests/README.md | battleTurns row, waitForBattleText +forbid, "Fighting a battle" pointer |
| pokeemerald/playtests/mauville-half-a-fact-follows-advice.json (new) | Lv50 SANDSHREW vs Wattson: EQ OHKOs MAGNETON, LOTAD_HOENN 21 switched in, CHARGE x3 then MEGA DRAIN turn 4 super effective (43 dmg), EQ neutral OHKO, JOLTEON next |
| pokeemerald/playtests/word-travels-in-order.json (new) | one Lv18 Lotad_H save: Route 104 turn → Route 109 doll/kids/TOBY (13 ABSORB turns) → Mauville PC heal → DAX doesn't affect / super effective; screenshots wt-1..wt-3c |
| pokeemerald/src/data/trainer_parties.h | comment above sParty_Wattson1 (C370 invariant: no Water/Grass/Ice move on MAGNETON/JOLTEON) — generate_trainer.cjs MODIFY replaces from the `static` line, so the comment survives |
| pokeemerald/scripts/beats.json | v34-half-a-fact +2 playtests, v34-storm-watch +word-travels-in-order |

Suite 94/94.


## Design (C366, archived from strategy-notes C371)
- Hypothesis: the ink travels farther than the player; a Route 102/104 correction has reached Slateport/Mauville first, read as recognition not congratulation. Measure: visible change before the first field box (target 0). Result C371: 0 boxes in both beats; the TOBY fight (13 turns at Lv18) is the one feel defect, fix C373 (retrospective: player-journey-map.md "v3.4 Word Travels — retrospective (C371)").
- Rules as shipped: 2 beats (one PLACE→FIGHT gated on 0x35, one ungated FIGHT); allowed maps Routes 105/107-110/117, Slateport, Mauville, Route 111 south (excluded Dewford, Route 106, Granite Cave, Lilycove, Routes 102-104, Petalburg Woods); gates only 0x35 / 0x36 / party species / none; ≤2 boxes per NPC per state; exactly one source line ("Heard it from a kid on 104."); no Water/Rock type on a "half-known" trainer, no HIKER sprite for a stranger; 0 new flags (FLAG_TEMP_3 + trainer flags), slots 462/485; no ON_RESUME/ON_FRAME.
- Believability chains: Beat 1 = Briney's boat sails from the Route 104 beach where the schoolkid turned to the Route 109 dock; Beat 2 = Wattson battles with a LOTAD and a challenger at his door kept only "ELECTRIC".
- Texts verbatim in Route109/scripts.inc (StormWatcher*, LotadDoll) and MauvilleCity/scripts.inc (GymHopeful*); team reasons in scripts/trainer_configs/route109_storm_watcher.json and mauville_gym_hopeful.json.
