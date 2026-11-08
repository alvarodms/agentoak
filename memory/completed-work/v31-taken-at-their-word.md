# v3.1 "Taken at Their Word" — Completed Work

Postgame beats where an NPC takes a Red Ink page at its word. Design + roadmap: memory/strategy-notes.md (v3.1 section).

## C348 — Beat A, the Route 106 tide hiker + check_encounter_odds

| File | Change |
|---|---|
| pokeemerald/include/constants/flags.h | 0x30 `FLAG_HIDE_ROUTE106_TIDE_HIKER`, 0x31 `FLAG_HIDE_GRANITE_CAVE_B1F_HIKER` (were FLAG_UNUSED_0x030/0x031). 0x32-0x34 still FLAG_UNUSED, reserved for beats B/C. |
| pokeemerald/data/scripts/new_game.inc | ResetAllMapFlags: `setflag FLAG_HIDE_ROUTE106_TIDE_HIKER` after the Route 104 student line. |
| pokeemerald/data/maps/GraniteCave_B1F/map.json | hiker object flag "0" → FLAG_HIDE_GRANITE_CAVE_B1F_HIKER. |
| pokeemerald/data/maps/GraniteCave_B1F/scripts.inc | OnTransition calls `GraniteCave_B1F_EventScript_SetupHikerLeft::` (hide after GAME_CLEAR + GLIGAR_HOENN caught) before the DexBelieverPlace line. |
| pokeemerald/data/maps/Route106/map.json | new last object LOCALID_ROUTE106_TIDE_HIKER, HIKER gfx, 54,11 FACE_UP, flag 0x30. No roost object (Cut would chop a CUTTABLE_TREE). |
| pokeemerald/data/maps/Route106/scripts.inc | first map script: `Route106_OnTransition::`; `Route106_EventScript_TideHiker` (no faceplayer, "They'll come", HARD_STONE fallback); `Route106_Text_TideHiker`. |
| pokeemerald/scripts/check_playtest.cjs | both flags in both presets' neverSet; 3 coda BEATS rows (Route106 x2, GraniteCave_B1F). |
| pokeemerald/scripts/check_encounter_odds.cjs | NEW. Red Ink reachability floors: LOTAD_HOENN Route102 ≥20%, SHROOMISH_HOENN Petalburg Woods ≥10%, GLIGAR_HOENN Granite B2F ≥10%, VULPIX_HOENN Route113 ≥10% of land slots (duplicate slots summed). Asserts land rates [20,20,10,10,10,10,5,5,4,4,1,1] and ≥50 land tables. `--selftest`: unmodified pass, planted 4% Gligar fail, Lotad removed fail, Shroomish split over two 5% slots pass. |
| pokeemerald/Makefile | `check_encounter_odds` target + .PHONY + check_all (before check_playtest). |

## C349 — Beat B, the Route 119 storm-chaser TESSA

| File | Change |
|---|---|
| pokeemerald/include/constants/flags.h | 0x32 `FLAG_HIDE_ROUTE119_STORM_CHASER` (was FLAG_UNUSED_0x032). 0x33 taken by beat C (C350); 0x34 still FLAG_UNUSED. |
| pokeemerald/include/constants/opponents.h | 117 TRAINER_CINDY_2 → `TRAINER_ROUTE119_STORM_CHASER` (CINDY_2 had 0 refs; REMATCH_CINDY skips it, battle_setup.c:272). |
| pokeemerald/src/data/trainers.h | `[TRAINER_ROUTE119_STORM_CHASER]`: PARASOL_LADY class/pic, "TESSA", no items, AI BAD_MOVE\|TRY_TO_FAINT\|VIABILITY, `NO_ITEM_CUSTOM_MOVES(sParty_StormChaser)`. |
| pokeemerald/src/data/trainer_parties.h | sParty_Cindy2 → `sParty_StormChaser` (generated): Lotad_H 55, Lombre_H 57, Ludicolo_H 59 IV150. |
| pokeemerald/scripts/trainer_configs/route119_storm_chaser.json | NEW, modify mode; move legality hand-checked with rom_species (sources in _note). |
| pokeemerald/scripts/check_trainer_slots.cjs | RECLAIMED += TRAINER_ROUTE119_STORM_CHASER (5 slots). |
| pokeemerald/data/scripts/new_game.inc | ResetAllMapFlags: `setflag FLAG_HIDE_ROUTE119_STORM_CHASER` after the tide hiker line. |
| pokeemerald/data/maps/Route119/map.json | new last object LOCALID_ROUTE119_STORM_CHASER, WOMAN_5 (Parasol Lady), 20,110 FACE_LEFT, TRAINER_TYPE_NONE, flag 0x32 (50 objects). |
| pokeemerald/data/maps/Route119/scripts.inc | OnTransition calls `Route119_EventScript_SetupStormChaser::` (before the BADGE06 goto); `_StormChaserWatchesSky` (FACE_UP once defeated); `_StormChaser::` (ink box → FaceUp → setweather THUNDERSTORM/doweather/delay 90 → rule box → trainerbattle_no_intro → Done); `_StormChaserDone::`; 4 `Route119_Text_StormChaser*` texts. No resetweather. |
| pokeemerald/scripts/check_playtest.cjs | flag in both presets' neverSet; 2 coda BEATS rows (SetupStormChaser label, StormChaser object script). |

Validators C349: check_flag_values `free pool 143`; check_flags `91 custom flags, all read+set`; check_trainer_slots `OK (5 reclaimed slots battled in map scripts)`; check_playtest `OK (2 presets, 9 beats)`; check_object_tiles `0 errors, 13 warnings` (all pre-existing); check_text_width widest 135px (Route119 "Its leaf drinks the storm."); check_encounter_odds `OK (104 land tables, 4 floors)`; check_gifts `dex-check species: 19 calls OK`; check_bosses `COLLISIONS: 0`; check_trainers.sh `0 errors, 0 warnings`; check_all_quick passed.

## C350 — Beat C, the Route 113 ash camper ELLIS

| File | Change |
|---|---|
| pokeemerald/include/constants/flags.h | 0x33 `FLAG_HIDE_ROUTE113_ASH_CAMPER` (was FLAG_UNUSED_0x033). 0x34 still FLAG_UNUSED. |
| pokeemerald/include/constants/opponents.h | 173 TRAINER_DUDLEY → `TRAINER_ROUTE113_ASH_CAMPER` (DUDLEY had 0 refs outside opponents/trainers/trainer_parties). TRAINERS_COUNT untouched. |
| pokeemerald/src/data/trainers.h | `[TRAINER_ROUTE113_ASH_CAMPER]`: CAMPER class/pic, MUSIC_MALE, "ELLIS", no items, AI BAD_MOVE\|TRY_TO_FAINT\|VIABILITY, `NO_ITEM_CUSTOM_MOVES(sParty_AshCamper)`. |
| pokeemerald/src/data/trainer_parties.h | sParty_Dudley → `sParty_AshCamper` (generated, TrainerMonNoItemCustomMoves): Vulpix_H 54 IV100 (Hail/Icy Wind/Dazzling Gleam/Confuse Ray), Ninetales_H 56 IV120 (Ice Beam/Shadow Ball/Calm Mind/Moonlight). |
| pokeemerald/scripts/trainer_configs/route113_ash_camper.json | NEW, modify mode; Hail-as-flourish, no-Blizzard reasoning and move legality in _note. |
| pokeemerald/scripts/check_trainer_slots.cjs | RECLAIMED += TRAINER_ROUTE113_ASH_CAMPER (6 slots). |
| pokeemerald/data/scripts/new_game.inc | ResetAllMapFlags: `setflag FLAG_HIDE_ROUTE113_ASH_CAMPER` after the storm-chaser line. |
| pokeemerald/data/maps/Route113/map.json | new last object LOCALID_ROUTE113_ASH_CAMPER, OBJ_EVENT_GFX_CAMPER, 38,5 elev 3 FACE_DOWN, TRAINER_TYPE_NONE, flag 0x33. Picnicker entry untouched. |
| pokeemerald/data/maps/Route113/scripts.inc | OnTransition calls `Route113_EventScript_SetupAshCamper::` AFTER the DexBelieverPlace macro (so FACE_RIGHT overrides her FACE_UP); `_AshPairWatches` (both FACE_RIGHT once defeated); `_AshCamper::` (faceplayer → ink box → rule box → trainerbattle_no_intro → Done); `_AshCamperDone::` (Next box, both turn right, `waitmovement 0`); picnicker `_AshPicnickerShown` first line branches to `_AshPicnickerWithCamper` (pre-win "Go on! Battle him!", FaceUp) / `_AshPicnickerWatching` (post-win, FaceRight) when the hide flag is clear; 6 new texts. No setweather. |
| pokeemerald/scripts/check_playtest.cjs | flag in both presets' neverSet; 2 coda BEATS rows (SetupAshCamper label, AshCamper object script). Walkable on `make playtest_coda` (it gives VULPIX_HOENN, playtest_coda.inc:53); VISITED Fallarbor for Fly is C351. |

Validators C350: check_trainer_slots `OK (6 reclaimed slots battled in map scripts)`; check_playtest `OK (2 presets, 11 beats)`; check_flag_values `1554 parsed, 0 duplicates, free pool 142`; check_flags `92 custom flags, all read+set`; check_flag_pairs is not a make target (check_flags runs it); check_object_tiles `0 errors, 13 warnings` (all pre-existing); check_text_width widest 139px (Route113 "Cold fur in the falling ash."); check_gifts `dex-check species: 20 calls OK`; check_bosses `COLLISIONS: 0`; check_encounter_odds `OK (104 land tables, 4 floors)`; check_trainers.sh `0 errors, 0 warnings`; check_all_quick exit 0. No en/em dashes added to Route113 scripts.inc (the only non-ASCII bytes there are the vanilla “ ” and C330 …).
