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
