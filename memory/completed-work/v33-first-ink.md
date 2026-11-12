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
