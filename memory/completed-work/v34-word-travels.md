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
| src/data/trainer_parties.h | sParty_Kaylee → sParty_Route109StormWatcher: PLUSLE 14 (SHOCK_WAVE only), MINUN 13 (SHOCK_WAVE, GROWL), iv 0. **C372: one Lv10 PLUSLE (SHOCK_WAVE only), iv 0** |
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

Files (collapsed C372): MauvilleCity map.json (last object LOCALID_MAUVILLE_GYM_HOPEFUL 10,7 FACE_LEFT) + scripts.inc (GymHopeful/GymHopefulDone after WallyRequestBattleAgain); opponents.h 485 AMY_AND_LIV_3 → TRAINER_MAUVILLE_GYM_HOPEFUL; trainers.h YOUNGSTER entry; trainer_parties.h sParty_MauvilleGymHopeful SANDSHREW 19 / TRAPINCH 20; trainer_configs/mauville_gym_hopeful.json; check_trainer_slots RECLAIMED (8); beats.json v34-half-a-fact + check_beats MIN_ROWS 17; playtests mauville-half-a-fact-lotad/-no-lotad/-wally-unblocked; playtests/README move-slot-2 tip.

Verify (C369): all 3 new playtests passed on the first run (lotad 6152 frames, no-lotad 4185, wally-unblocked 8481); suite 92/92; `make check_all` exit 0 (check_beats 17 rows / 8 strangers text-walked; check_trainer_slots 8 reclaimed; check_object_tiles 177 destinations, 209 start tiles, 0 errors, 13 warnings; check_text_width widest new line 151px; check_flag_pairs 95 flags, unchanged); audit_boss_species --strict 0 collisions; npm build:check + npm test (480) pass. Plan deviation: the re-talk asserts `expectBoxCount: 1`, not 2 (one msgbox with a \p is one box).

## C370 — story-level proof (harness + 2 playtests, no ROM gameplay change)

| File | Change |
|---|---|
| src/emulator/playtest.ts | `battleTurns` step ({move 1-4, until, maxTurns=10, forbid}; FIGHT/slot reset UP+LEFT each turn, waits for the turn's first message before tapping B, returns mid-turn once all `until` strings showed; fails on forbid, battle end (callback2 ≠ BattleMainCB2) or maxTurns); `forbid` on `waitForBattleText`; `expectBattle` polls until the expected foe/level (stale gBattleMons from an earlier battle in the same test) |
| src/emulator/playtest.test.ts | battleTurns parse/reject, waitForBattleText forbid |
| pokeemerald/playtests/README.md | battleTurns row, waitForBattleText +forbid, "Fighting a battle" pointer |
| pokeemerald/playtests/mauville-half-a-fact-follows-advice.json (new) | Lv50 SANDSHREW vs Wattson: EQ OHKOs MAGNETON, LOTAD_HOENN 21 switched in, CHARGE x3 then MEGA DRAIN turn 4 super effective (43 dmg), EQ neutral OHKO, JOLTEON next |
| pokeemerald/playtests/word-travels-in-order.json (new) | one Lv18 Lotad_H save: Route 104 turn → Route 109 doll/kids/TOBY (13 ABSORB turns C370; 4 after the C372 retune, capped 1+5) → Mauville PC heal → DAX doesn't affect / super effective; screenshots wt-1..wt-3c |
| pokeemerald/src/data/trainer_parties.h | comment above sParty_Wattson1 (C370 invariant: no Water/Grass/Ice move on MAGNETON/JOLTEON) — generate_trainer.cjs MODIFY replaces from the `static` line, so the comment survives |
| pokeemerald/scripts/beats.json | v34-half-a-fact +2 playtests, v34-storm-watch +word-travels-in-order |

Suite 94/94.


## Design (C366, archived from strategy-notes C371)
- Hypothesis: the ink travels farther than the player; a Route 102/104 correction has reached Slateport/Mauville first, read as recognition not congratulation. Measure: visible change before the first field box (target 0). Result C371: 0 boxes in both beats; the TOBY fight (13 turns at Lv18) was the one feel defect, fixed C372 (4 turns) (retrospective: player-journey-map.md "v3.4 Word Travels — retrospective (C371)").
- Rules as shipped: 2 beats (one PLACE→FIGHT gated on 0x35, one ungated FIGHT); allowed maps Routes 105/107-110/117, Slateport, Mauville, Route 111 south (excluded Dewford, Route 106, Granite Cave, Lilycove, Routes 102-104, Petalburg Woods); gates only 0x35 / 0x36 / party species / none; ≤2 boxes per NPC per state; exactly one source line ("Heard it from a kid on 104."); no Water/Rock type on a "half-known" trainer, no HIKER sprite for a stranger; 0 new flags (FLAG_TEMP_3 + trainer flags), slots 462/485; no ON_RESUME/ON_FRAME.
- Believability chains: Beat 1 = Briney's boat sails from the Route 104 beach where the schoolkid turned to the Route 109 dock; Beat 2 = Wattson battles with a LOTAD and a challenger at his door kept only "ELECTRIC".
- Texts verbatim in Route109/scripts.inc (StormWatcher*, LotadDoll) and MauvilleCity/scripts.inc (GymHopeful*); team reasons in scripts/trainer_configs/route109_storm_watcher.json and mauville_gym_hopeful.json.

## C372 — TOBY retune (v3.4 defect fix) + fortree_arrival checkpoint (v3.5 groundwork)

TOBY's roster is now **one Lv10 PLUSLE, SHOCK_WAVE only, iv 0** (was PLUSLE 14 + MINUN 13). Why: ABSORB/MEGA DRAIN are Special, so MINUN's GROWL never mattered; the 13 turns were 78 HP. Lv10 PLUSLE has SpD 20, the breakpoint where a Lv18 Lotad_H's ABSORB hits 7-9 (≥ SpA 23). Full math in the config `_note`. Measured C372: **4 ABSORB turns** in word-travels-in-order (turn 1 + 3; a scratch run with the second cap at 2 failed, at 3 passed). Lv25 MEGA DRAIN: 2 turns.

| File | Change |
|---|---|
| scripts/trainer_configs/route109_storm_watcher.json | party → [PLUSLE 10 SHOCK_WAVE]; _note rewritten with the turn math |
| src/data/trainer_parties.h | regenerated sParty_Route109StormWatcher (1 mon); trainers.h untouched (NO_ITEM_CUSTOM_MOVES uses ARRAY_COUNT) |
| playtests/word-travels-in-order.json | expectBattle PLUSLE 10; battleTurns "not very effective" maxTurns 1, then "Heard it…" maxTurns 5 (≤6 total); C372 comment + checks |
| playtests/route109-storm-watch-defeated.json | expectBattle PLUSLE 10; hand-counted turns + MINUN expectBattle replaced by battleTurns move 1 until "Heard it from a kid on 104." maxTurns 2 (Gameplay Designer: worst case 1 more turn + 1 slack; the plan's 8 would hide a regression) |
| src/emulator/checkpoints.ts | `fortree_arrival` (standalone FORTREE_ARRIVAL, 17 flags, 0 clearFlags, 2 vars, MAP_FORTREE_CITY 0,8) |
| playtests/checkpoint-fortree-arrival-boot.json (new) | boot 0,8, FLAG_VISITED_FORTREE_CITY set, FLAG_KECLEON_FLED_FORTREE clear, vars, walk right to 1,8; screenshot fortree-arrival-meadow (C375 reference frame) |
| playtests/README.md | checkpoint list names fortree_arrival |

Verify: suite 95/95, npm test 485/485, tsc clean; check_playtest / check_beats / check_trainer_slots output diff-identical to HEAD.

## Index row (moved verbatim from completed-work.md C380)
- **Cycles**: **367** (groundwork, no ROM change: src/emulator/checkpoints.ts + checkpoints.test.ts (new), scenario.ts `checkpoint` + optional map/x/y, playtest.ts schema + `expectBoxCount`, playtest.test.ts; playtests checkpoint-slateport-arrival-boot + checkpoint-mauville-pre-wattson-boot (new), route104-ivan-defeated-talk (+expectBoxCount), playtests/README.md; scripts/beats.json + scripts/check_beats.cjs (new); Makefile check_beats in check_all), **368** (Beat 1 Storm watch: Route109 map.json (local_ids boy/girl + LOTAD DOLL 24,19) + scripts.inc (ON_TRANSITION, TOBY, doll); opponents.h 462 → TRAINER_ROUTE109_STORM_WATCHER; trainers.h + trainer_parties.h sParty_Route109StormWatcher; new trainer_configs/route109_storm_watcher.json; check_trainer_slots.cjs RECLAIMED; beats.json row + check_beats.cjs MIN_ROWS 16; 3 new playtests route109-storm-watch-*), **369** (Beat 2 Half a fact: MauvilleCity map.json (new last object LOCALID_MAUVILLE_GYM_HOPEFUL 10,7) + scripts.inc (GymHopeful/GymHopefulDone + 2 texts); opponents.h 485 → TRAINER_MAUVILLE_GYM_HOPEFUL; trainers.h + trainer_parties.h sParty_MauvilleGymHopeful; new trainer_configs/mauville_gym_hopeful.json; check_trainer_slots.cjs RECLAIMED; beats.json row v34-half-a-fact + check_beats.cjs MIN_ROWS 17; 3 new playtests mauville-half-a-fact-*; playtests/README.md move-slot-2 tip), **371** (memory only: v3.4 retrospective + v3.5 design), **372** (v3.4 defect fix + v3.5 groundwork: trainer_configs/route109_storm_watcher.json + trainer_parties.h sParty_Route109StormWatcher → one Lv10 PLUSLE (trainers.h block unchanged, partySize via ARRAY_COUNT); playtests word-travels-in-order (TOBY caps 1+5, PLUSLE 10) + route109-storm-watch-defeated (battleTurns maxTurns 2, MINUN check gone); src/emulator/checkpoints.ts `fortree_arrival` (standalone, 17 flags, 2 vars, FortreeCity 0,8); new playtest checkpoint-fortree-arrival-boot; playtests/README.md checkpoint list), **370** (story-level proof, no ROM gameplay change: harness `battleTurns` + waitForBattleText `forbid` + expectBattle waits for the expected foe (src/emulator/playtest.ts + playtest.test.ts, playtests/README.md); 2 new playtests mauville-half-a-fact-follows-advice + word-travels-in-order; trainer_parties.h comment above sParty_Wattson1; beats.json playtest lists) · **Files**: 6 harness + 6 playtests + README + 2 scripts + Makefile; C368: 2 map + 3 trainer data + 1 config + 2 scripts + 3 playtests; C369: same shape
