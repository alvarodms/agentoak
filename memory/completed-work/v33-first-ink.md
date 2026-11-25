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

## C362-C364 (collapsed C396; full file lists in git history)
- C362 schoolkid turn: flags.h 0x35 FLAG_ROUTE104_SKEPTIC_TURNED; Route104/scripts.inc OnTransition call_if_set → SkepticFacesEast (replaces DexBelieverPlace); harness `warp`; playtests believer-skeptic-*.
- C363 forager walk: flags.h 0x36 FLAG_PETALBURG_WOODS_FORAGER_MOVED; PetalburgWoods/scripts.inc ForagerInColdPatch; GraniteCave_B1F hiker reads 0x35/0x36; match_call.c IsFieldNotesMarginEarned LOTAD/SHROOMISH → those flags; harness `walkTo`, `setVar`; playtest woods-catch-then-forager-walks.
- C364 IVAN rain: Route104/scripts.inc Ivan/IvanDone/IvanStorms; trainers.inc Ivan texts; harness scenario `ability` (playtest.h abilityNum, PLAYTEST_LAYOUT_VERSION 3, playtest.c GivePlaytestMon); playtests route104-ivan-rain-*. Gotcha: one waitForBattleText = 1800 frames; split long chains.

## C365 — First Ink closed: Pokénav call harness, chain playtest, HALEY cut, retrospective

Files:
- pokeemerald/data/text/trainers.inc: Route104_Text_HaleyIntro → "Let's battle before the / clouds roll in!", Route104_Text_HaleyDefeat → "Oh! I should have waited / for the rain." (were "acting strange… different from normal!" / "Something is changing in Hoenn… Can you feel it?"). PostBattle, Register1/2 and rematch texts unchanged.
- pokeemerald/src/playtest.c: Playtest_ApplyScenario calls EnableNationalPokedex() when the scenario set FLAG_SYS_NATIONAL_DEX (see playtest-hook.md).
- src/emulator/playtest.ts: `pokenavCall` step (`"BIRCH"` or {contact, read, maxPresses}), MATCH_CALL_CONTACTS, START_MENU_ACTION_POKENAV, POKENAV offsets, pokenavView/pokenavReady/pokenavCall helpers. src/emulator/playtest.test.ts: schema test + enum/struct layout checks against include/pokenav.h, src/start_menu.c, src/pokenav.c, src/pokenav_menu_handler.c, src/pokenav_match_call_list.c.
- pokeemerald/playtests/README.md: `pokenavCall` row; FLAG_SYS_NATIONAL_DEX note.
- Playtests (new): pokenav-birch-red-ink-report, pokenav-birch-two-pages-no-report, pokenav-birch-worst-case-report (834 B measured), first-ink-chapter-in-order (all four beats on one save), route104-haley-rain-lines.
- Memory: player-journey-map.md retrospective, strategy-notes.md v3.3 section shrunk + rows 365/366, failure-patterns.md C360/C363 bullets split, codebase-facts.md pokenavCall facts.
- Suite 84/84 (79 + 5).

## Index row (moved verbatim from completed-work.md C380)
- **Cycles**: **361** (pen moment: flags.h 0x34 FLAG_FIELD_NOTES_FIRST_INK, match_call.c/.h BufferFieldNotesInk + TryRegisterFieldNotesToSelect (+ item.h, constants/items.h includes), specials.inc, prof_birch.inc ArmFirstInk/FirstInk/_FirstInkSelect/_FirstInkPocket + 3 texts, Route102/scripts.inc ON_RESUME + ON_FRAME_TABLE, PetalburgWoods/scripts.inc ON_RESUME + ON_FRAME_TABLE; 7 playtests first-ink-cue-* + route102-first-catch-ink), **362** (Route 104 skeptic turns in person: flags.h 0x35 FLAG_ROUTE104_SKEPTIC_TURNED, Route104/scripts.inc OnTransition flag-gated facing + SkepticFacesEast + PenLine first-time branch + LotadSkepticRecites text; harness `warp` step in src/emulator/playtest.ts + playtest.test.ts + playtests/README.md; playtests believer-skeptic-inked (rewritten), believer-skeptic-turned-return, believer-skeptic-flag-alone-faces-sea, route102-catch-then-route104-skeptic, woods-first-catch-ink), **363** (Petalburg Woods forager walks in person: flags.h 0x36 FLAG_PETALBURG_WOODS_FORAGER_MOVED, PetalburgWoods/scripts.inc OnTransition flag placement + ForagerCorrected walk scene + ForagerColdPatch + 2 movements, GraniteCave_B1F/scripts.inc HikerMock + HikerTryThreePages on flags, match_call.c IsFieldNotesMarginEarned P1/P2 on flags; harness `walkTo` + `setVar` (src/emulator/playtest.ts, session.ts setVar, playtest.test.ts, playtests/README.md); 6 new + 7 updated playtests), **364** (Fisherman IVAN rain beat: Route104/scripts.inc Ivan + IvanDone + IvanStorms/IvanRule texts, data/text/trainers.inc IvanDefeat/IvanPostBattle rewritten + IvanIntro deleted; harness scenario party `ability`: include/playtest.h (PlaytestMon byte 0x03 abilityNum, PLAYTEST_LAYOUT_VERSION 3), src/playtest.c GivePlaytestMon, src/emulator/scenario.ts + playtest.ts + scenario.test.ts, playtests/README.md; 3 playtests route104-ivan-*), **365** (close: data/text/trainers.inc HaleyIntro/HaleyDefeat rain lines; src/playtest.c national dex from the scenario flag; harness `pokenavCall` in src/emulator/playtest.ts + playtest.test.ts, playtests/README.md; 5 playtests pokenav-birch-* x3, first-ink-chapter-in-order, route104-haley-rain-lines) · **Files**: 9 + 12 playtests + C363 4 files + harness + 13 playtests + C364 4 files + harness + 3 playtests

## C396 — v3.3b "The pen keeps writing" (later-page pen sound)

A page 1-4 inked after First Ink plays SE_M_SKETCH once on return to its map (delay 30, no text, no lock); whichever page is inked first gets the C361 cue, now on all four maps. Old saves (First Ink seen, no pen flags) are migrated silent. Mechanism: codebase-facts/field-notes.md.

Files:
- pokeemerald/include/constants/flags.h: 0x37-0x3A FLAG_UNUSED_0x037..0x03A → FLAG_FIELD_NOTES_PEN_LOTAD / _SHROOMISH / _GLIGAR / _VULPIX.
- pokeemerald/src/match_call.c: sFieldNotesPenFlags[], MigrateFieldNotesPenFlags, specials GetFieldNotesInkCue + SetFieldNotesPenFlag after TryRegisterFieldNotesToSelect.
- pokeemerald/include/match_call.h: two prototypes. pokeemerald/data/specials.inc: two def_special at the end.
- pokeemerald/data/scripts/prof_birch.inc: ArmFirstInk deleted; FirstInk + `special SetFieldNotesPenFlag`; new FieldNotes_EventScript_PenScratch; comments.
- pokeemerald/data/maps/Route102/scripts.inc, PetalburgWoods/scripts.inc: OnResume → page id + GetFieldNotesInkCue; OnFrame value 2 → new <Map>_EventScript_PenScratch.
- pokeemerald/data/maps/GraniteCave_B2F/scripts.inc (was `.byte 0`): ON_RESUME + ON_FRAME_TABLE + FirstInk/PenScratch wrappers (page 3).
- pokeemerald/data/maps/Route113/scripts.inc: header ON_FRAME_TABLE, OnResume 2 lines after setstepcallback, Route113_OnFrame + wrappers (page 4).
- pokeemerald/scripts/check_gifts.cjs: DEX_CHECK_CALLEES = [] (dex check moved into C).
- src/emulator/sound.ts (new: sampleSePlayers, findSoundStart, sePlayerActive, songHeaderAddress), sound.test.ts (new, 11 tests), playtest.ts (expectSound/expectNoSound steps, messageBoxes skips `[sound:`), session.ts (seSamples baseline at boot), constants.ts (songs.h header).
- pokeemerald/playtests/README.md: expectSound/expectNoSound row.
- Playtests (new): pen-scratch-page3-gligar, pen-scratch-page3-doubt-same (D1), pen-scratch-page4-vulpix, pen-scratch-page1-second, pen-scratch-first-ink-page3, pen-scratch-once, pen-scratch-legacy-save. All first-ink-cue-* unchanged and passing (already-seen passes through migration). Full suite 142/142.
