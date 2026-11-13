# v3.3 "First Ink" (C361-C365)

Design and rules: strategy-notes.md "v3.3 First Ink". Mechanism reference: strategy-notes FIELD NOTES section ("First Ink pen moment") and codebase-facts ("ON_RESUME arms, ON_FRAME fires").

## C361 — the pen moment

The first time the player is back in the field on Route 102 with LOTAD_HOENN caught (page 1), or in Petalburg Woods with SHROOMISH_HOENN caught (page 2), with FIELD NOTES received: "!" over the player, "{PLAYER} opened FIELD NOTES / and took out a pen.", SE_DEX_PAGE, only that page's red ink (2 boxes), then "kept FIELD NOTES ready on SELECT." (slot was empty, now registered) or "put FIELD NOTES back in the KEY ITEMS pocket." (slot held something). Once per save (one flag for both maps).

Files:
- pokeemerald/include/constants/flags.h: 0x34 FLAG_UNUSED_0x034 → FLAG_FIELD_NOTES_FIRST_INK.
- pokeemerald/src/match_call.c: specials BufferFieldNotesInk (VAR_0x8004 page 1-7 → inkText only) and TryRegisterFieldNotesToSelect, after BufferFieldNotesPage; includes item.h + constants/items.h.
- pokeemerald/include/match_call.h: two prototypes.
- pokeemerald/data/specials.inc: two def_special after CountInkedFieldNotePages.
- pokeemerald/data/scripts/prof_birch.inc: FieldNotes_EventScript_ArmFirstInk, _FirstInk, _FirstInkSelect, _FirstInkPocket; FieldNotes_Text_FirstInkOpen/Select/Pocket. Page texts in pokedex_rating.inc untouched (rule 2).
- pokeemerald/data/maps/Route102/scripts.inc: header ON_RESUME + ON_FRAME_TABLE (was `.byte 0` only), Route102_OnResume / _OnFrame / _EventScript_FirstInk.
- pokeemerald/data/maps/PetalburgWoods/scripts.inc: header + PetalburgWoods_OnResume / _OnFrame / _EventScript_FirstInk; ON_TRANSITION body unchanged.
- pokeemerald/scripts/check_gifts.cjs: DEX_CHECK_CALLEES.
- src/emulator/: scenario.ts (registeredItem, SAVEBLOCK1_REGISTERED_ITEM), session.ts (bootScenario writes it), playtest.ts (findWildBattle species, catchWild, useKeyItem register:false, waitForBattleText/leaveBattle/settleField helpers, BAG_POSITION, SAVEBLOCK1_POKEBALLS, ballListIndex), playtest.test.ts, scenario.test.ts.
- pokeemerald/playtests/README.md (scenario field + 3 step rows).
- Playtests (new): first-ink-cue-route102 (cue text, flag, SELECT opens FIELD NOTES unaided via register:false, Oldale 0,11 and back = no repeat), first-ink-cue-screens (emote/open/red-ink/red-ink-signed/select screenshots; red confirmed by eye), first-ink-cue-already-seen, first-ink-cue-vanilla-lotad, first-ink-cue-no-notebook, first-ink-cue-woods-registered (Petalburg Woods 16,36, MACH BIKE on SELECT → pocket line), route102-first-catch-ink (Route 102 22,8 grass, findWildBattle species LOTAD_HOENN, catchWild MASTER BALL, cue on return). Suite 66/66.
- No existing playtest needed FLAG_FIELD_NOTES_FIRST_INK: none of the Route 102 / Petalburg Woods tests has FLAG_RECEIVED_FIELD_NOTES.

## C362 — the Route 104 schoolkid turns in front of you

Before: he silently faced east on any load once LOTAD_HOENN was caught (EventMacro_DexBelieverPlace), so most players never saw him believe. Now he faces the sea until the player talks to him with LOTAD_HOENN caught. That first talk: `Route104_Text_LotadSkepticRecites` (BIRCH recital broken off at "Hides from st..."), "!" over him, setflag FLAG_ROUTE104_SKEPTIC_TURNED, `Route104_Text_LotadSkepticCorrected` (unchanged), FaceRight. Later visits: faces east on load, Corrected line only. Fresh/belief path and the postgame Lesson branch unchanged (Lesson never sets the flag; SetupLotadLesson still overrides to FACE_DOWN).

Files:
- pokeemerald/include/constants/flags.h: 0x35 FLAG_UNUSED_0x035 → FLAG_ROUTE104_SKEPTIC_TURNED (no other user of the old name).
- pokeemerald/data/maps/Route104/scripts.inc: OnTransition `call_if_set FLAG_ROUTE104_SKEPTIC_TURNED, Route104_EventScript_SkepticFacesEast` replaces the DexBelieverPlace line; new Route104_EventScript_SkepticFacesEast; LotadSkepticPenLine split into first-time (Recites, ExclamationMark, setflag) + Route104_EventScript_LotadSkepticPenLineAgain; new text Route104_Text_LotadSkepticRecites.
- Lints: none expected the skeptic to use the macro (check_object_tiles / check_beat_visibility / check_gifts / map_scan are generic); no lint edits. check_object_tiles now 175 destinations.
- src/emulator/playtest.ts: `warp` step + warp(), encodeWarpData, SAVEBLOCK1_POS/LOCATION, MAIN_STATE; playtest.test.ts (parse, encoding, offsets vs global.h/main.h); playtests/README.md row.
- Playtests: believer-skeptic-inked (rewritten: faces left on load, recital + "!" + Corrected, turns right, flag set, no girl, screenshot skeptic-turned); new believer-skeptic-turned-return, believer-skeptic-flag-alone-faces-sea (flag drives facing, dex drives dialogue), route102-catch-then-route104-skeptic (real Route 102 catch + pen moment, warp to Route 104 33,50, turn), woods-first-catch-ink (audit: real Shroomish_H catch at 22,33, page 2 pen moment, forager still at 18,34 = the C363 same-visit gap). Suite 70/70; screenshots checked by eye (skeptic faces east, no lingering text box; forager 4 tiles west of the player at her old tile).
- Field Notes hint before Rustboro: no, by design (GetActiveFieldNote needs Badge 5/6/8).

## C363 — the Petalburg Woods forager walks off in front of you

Before: she jumped to the cold patch (11,24) on any map load once SHROOMISH_HOENN was caught (EventMacro_DexBelieverPlace), and after a real catch she stayed at 18,34 for the rest of the visit; the hiker and FIELD NOTES margins already reported "the lady moved" off the dex alone. Now she waits at 18,34 facing the light until the player talks to her with SHROOMISH_HOENN caught. That first talk: Corrected text (+ WhatElse if FLAG_ROUTE104_SKEPTIC_TURNED), closemessage, delay 48, she faces down (the light), pauses, then walks slowly out of view, setflag FLAG_PETALBURG_WOODS_FORAGER_MOVED, setobjectxy + setobjectxyperm 11,24, FACE_UP. No emote. Later talks: ForagerColdPatch ("Cold out here. / They came. / Just not where I stood.").

Route (map_scan C363): row 30, columns 16-21, is a south ledge (MB_JUMP_SOUTH, collision 1), so no column near 18 goes north; the clearing's north exit is the tall grass at columns 5-9. Main path `PetalburgWoods_Movement_ForagerLeaves`: up 1 to 18,33, west 9 to 9,33. Player on 18,33 (`getplayerxy` VAR_TEMP_0/1): `_ForagerLeavesAroundPlayer` west 9 along row 34 to 9,34. Rows 33/34 columns 9-17 walkable, no events. End tiles are 8+ columns from every talk tile (17,34 18,33 18,35 19,34; screen = player ±7 columns), so she is off-screen when placed at 11,24.

Files:
- pokeemerald/include/constants/flags.h: 0x36 FLAG_UNUSED_0x036 → FLAG_PETALBURG_WOODS_FORAGER_MOVED.
- pokeemerald/data/maps/PetalburgWoods/scripts.inc: OnTransition `call_if_set FLAG_PETALBURG_WOODS_FORAGER_MOVED, PetalburgWoods_EventScript_ForagerInColdPatch` (replaces DexBelieverPlace); ShroomishForager belief path BoyStopped on 0x35 (was LOTAD dex); ForagerCorrected rewritten (ForagerLeaves / ForagerGone labels); new ForagerColdPatch script + text; 2 movements at file end. ON_RESUME / ON_FRAME (First Ink) untouched.
- pokeemerald/data/maps/GraniteCave_B1F/scripts.inc: HikerMock → call_if_set 0x35 / 0x36; HikerTryThreePages → goto_if_unset 0x35 / 0x36.
- pokeemerald/src/match_call.c: IsFieldNotesMarginEarned LOTAD → FlagGet(0x35), SHROOMISH → FlagGet(0x36); GLIGAR/VULPIX stay TRUE.
- src/emulator/: playtest.ts `walkTo` {x, y, yFirst?} (row first; walkOneTile helper shared with `walk`; exported walkToDirections) and `setVar` {VAR_*: n} steps; session.ts setVar; playtest.test.ts; playtests/README.md 2 rows.
- Playtests new: woods-catch-then-forager-walks (real Master Ball catch at 22,33, pen moment, setVar VAR_REPEL_STEP_COUNT 250, walkTo 19,34, face left, scene, she is at 11,24 up, flag, screenshot forager-left-warm-spot (clearing empty, checked by eye), warp 11,25, cold-patch line), believer-forager-shown-scene, believer-forager-north-approach, believer-forager-lotad-not-shown, believer-hiker-mock-needs-turns, field-notes-margin-waits. Updated: woods-first-catch-ink (+flag false), believer-forager-inked (cold-patch line), believer-forager-lotad-only (+0x35), believer-hiker-fresh/-inked (+0x35/0x36), field-notes-cover-yours (+0x35/0x36), field-notes-first-ink (+0x35). Suite 76/76.
- Lints: check_object_tiles 177 destinations 0 errors; check_flag_values free pool 139; check_flags, check_gifts, check_playtest, check_beat_visibility, check_text_width, check_scripts clean.

## C364 — Fisherman IVAN brings the rain

Vanilla IVAN (Route 104 29,8, FACE_DOWN, sight 0, object unchanged) used `trainerbattle_single` with the "WATER POKéMON expert" intro. Now `Route104_EventScript_Ivan`: lock, `goto_if_defeated` → IvanDone; faceplayer, IvanStorms ("I fish for WATER POKéMON. / LOTAD keep stealing my bait. / But PROF. BIRCH wrote it: / LOTAD hide from storms."), closemessage, `setweather WEATHER_RAIN` + `doweather` + delay 90, faceplayer, IvanRule ("There. No LOTAD in this rain. / Rain powers up WATER moves!"), `trainerbattle_no_intro TRAINER_IVAN, Route104_Text_IvanDefeat`, goto IvanDone (faceplayer, IvanPostBattle, release). No weather restore (battle copies GetCurrentWeather(); rain lasts until the next map load, like TESSA). Ungated: no dex/flag check; he believes the printed page and never changes his mind. Party unchanged (Magikarp 10, Tentacool 10, Wingull 12 + Oran Berry).

Files:
- pokeemerald/data/maps/Route104/scripts.inc: Ivan script replaced, IvanDone added, IvanStorms + IvanRule texts at file end.
- pokeemerald/data/text/trainers.inc: Route104_Text_IvanDefeat ("Bleah… / The rain should've helped!"), Route104_Text_IvanPostBattle ("Rain's good fishing weather. / Everyone says so."); Route104_Text_IvanIntro deleted (no other reference).
- Harness `ability`: pokeemerald/include/playtest.h (`padding` → `abilityNum`, PLAYTEST_LAYOUT_VERSION 3), pokeemerald/src/playtest.c GivePlaytestMon (SetMonData MON_DATA_ABILITY_NUM = abilityNum - 1, before the moves early-return), src/emulator/scenario.ts (ScenarioMon.ability, byte base+3, 1/2 validation, LAYOUT_VERSION 3), src/emulator/playtest.ts (ScenarioSchema party `ability`), src/emulator/scenario.test.ts, playtests/README.md.
- Playtests (new): route104-ivan-rain-lotad-wins (Lv15 Lotad_H ability 2 RAIN DISH, real fight: Magikarp Splash → 1 Thundershock; Tentacool Supersonic misses, then Poison Sting poisons Lotad, 2 Thundershocks; end of that turn "Rain continues to fall" + "LOTAD's RAIN DISH restored its HP a little!" + poison; Wingull 1 Thundershock; screenshot ivan-rain-after shows overworld rain), route104-ivan-rain-no-lotad (Lv100 Mudkip, no caught list: rain anyway), route104-ivan-defeated-talk (defeatedTrainers: post line only). Talk tile 28,8 facing right (29,9 is MB_POND_WATER). Suite 79/79.
- Harness gotcha found: one `waitForBattleText` has an 1800-frame budget (60 B taps); a faint + EXP + switch-in + end-of-turn weather/ability/poison chain can exceed it. Split the wait on an intermediate message.
