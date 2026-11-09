# v3.1 "Taken at Their Word" — Completed Work

Postgame beats where an NPC takes a Red Ink page at its word. Design + roadmap: memory/strategy-notes.md (v3.1 section).

## C348 — Beat A, the Route 106 tide hiker + check_encounter_odds

| File | Change |
|---|---|
| pokeemerald/include/constants/flags.h | 0x30 `FLAG_HIDE_ROUTE106_TIDE_HIKER`, 0x31 `FLAG_HIDE_GRANITE_CAVE_B1F_HIKER` (were FLAG_UNUSED_0x030/0x031). 0x32-0x34 still FLAG_UNUSED, reserved for beats B/C. |
| pokeemerald/data/scripts/new_game.inc | ResetAllMapFlags: `setflag FLAG_HIDE_ROUTE106_TIDE_HIKER` after the Route 104 student line. |
| pokeemerald/data/maps/GraniteCave_B1F/map.json | hiker object flag "0" → FLAG_HIDE_GRANITE_CAVE_B1F_HIKER. |
| pokeemerald/data/maps/GraniteCave_B1F/scripts.inc | OnTransition calls `GraniteCave_B1F_EventScript_SetupHikerLeft::` (hide after GAME_CLEAR + GLIGAR_HOENN caught) before the DexBelieverPlace line. |
| pokeemerald/data/maps/Route106/map.json | new last object LOCALID_ROUTE106_TIDE_HIKER, HIKER gfx, 54,11 FACE_UP (moved to **54,15 in C354**), flag 0x30. No roost object (Cut would chop a CUTTABLE_TREE). |
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


## C351 — playtest consolidation

No beat script, trainer or text changed.

| File | Change |
|---|---|
| pokeemerald/data/scripts/playtest_coda.inc | header line for v3.1 A/B/C; `setflag FLAG_VISITED_DEWFORD_TOWN / _MAUVILLE_CITY / _FALLARBOR_TOWN / _FORTREE_CITY` after Petalburg's, so FLY reaches Routes 106, 118→119 and 113. FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE deliberately unset. |
| pokeemerald/scripts/check_playtest.cjs | coda prereqFlags += the 4 VISITED flags; prereqSpecies += SPECIES_VULPIX_HOENN (LOTAD/GLIGAR reasons name Beats B/A); coda neverSet += FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE; BEATS comments updated; selftest cases (f) missing VISITED_DEWFORD → R3, (g) missing VULPIX_HOENN → R3, (h) pre-set HARD_STONE flag → R4. |
| memory/playtest-checklist.md | coda quick start mentions the extra Fly points; new "Quick start, part 2" (open pass, directed pass, steps 44-46 with Verify blocks quoting the exact texts, 4 v3.1 feel questions); "v3.1 beats state walk (static, C351)" table; rates in steps 3/5/7/10 fixed to 1 in 5 / 1 in 10. |
| memory/playtest-recruit-post.md | coda bullet mentions the v3.1 beats; 15-30 minutes; question 4 (expected someone, found no one). |

Validators C351: check_playtest --selftest `OK`; check_playtest `OK (2 presets, 11 beats)`, coda `29 flags`; planted break (VISITED_FALLARBOR line deleted) → exit 1 with `[coda] R3 missing setflag FLAG_VISITED_FALLARBOR_TOWN`, restored → exit 0; check_encounter_odds `OK` with Lotad_H 20% / Shroomish_H 10% / Gligar_H 10% / Vulpix_H 10%.
| README.md (C351 Reflection) | "Help Playtest v3.0 and v3.1"; coda shortcut names the extra Fly towns; new "Coda part 2" (open pass + steps 44-46 condensed, Route 106 called out as easy to miss); rates in steps 3/5/7/10 fixed; one merged v3.1 feel question. |

## C352 — silent window 1/2: static visibility audit (memory only)

No beat script, map, trainer, flag or text changed. memory/playtest-checklist.md "### v3.1 visibility audit (static, C352)": spawn window derived from TrySpawnObjectEvents/RemoveObjectEventIfOutsideView (x −9..+10, y −7..+9 around the player; OBJECT_EVENTS_COUNT 16); object density A 3/16, B 4-7/16, C 8/16 (all PASS); connection edges (only A is near one: Dewford, he loads at y ≤ 18 / x ≤ 63); flag↔object binding PASS for 0x30-0x33 and every LOCALID on the four maps; re-entry sentences added to Verify 44 (A) and 46 (C, VULPIX caught on Route 113 itself); box count ≤ 2 for all three, no trim candidate. player-journey-map.md: loud/quiet list, see-first lines, ELLIS hail condition, Beat A sightline "Finding for C353 planning" (the Granite Cave walk keeps him 5-6 rows above the player, at the screen edge).

## C354 — Beat A tile move + check_beat_visibility

No script, text, flag, trainer or facing changed.

| File | Change |
|---|---|
| pokeemerald/data/maps/Route106/map.json | LOCALID_ROUTE106_TIDE_HIKER y 11 → 15 (now 54,15; elevation 3, FACE_UP, flag 0x30 unchanged). Tile re-read before the edit with `tileAt`: collision 0, elevation 3, metatile 0x124 (292), behaviour 33 MB_SAND. No other object/warp/bg event on 54,15. |
| pokeemerald/data/maps/Route106/scripts.inc | Beat A comment above `Route106_OnTransition::` rewritten (4 lines: 54,15, out of ELLIOT's/NED's sight). Script unchanged. |
| pokeemerald/scripts/check_beat_visibility.cjs | NEW. Postgame beat visibility guard, BEATS = A tide hiker, A empty B1F spot (shows: false), B TESSA, C ELLIS (Route 104 coda left to check_playtest R5). V1 object+flag in map.json, object script label, setup reached from ON_TRANSITION (is / call / goto), setup body default flag command before first goto_if/call_if + opposite command after `goto_if_unset FLAG_SYS_GAME_CLEAR` + `setvar VAR_0x8004, <species>`; V2 species in the map's own wild tables (land/water/rock smash/fishing, gWildMonHeaders) needs an ON_RESUME path to the setup or an ALLOWLIST reason (1 entry: Route113 ELLIS, D3; stale fails); V3 start tile via check_object_tiles `tileAt`/`tileProblems` + always-present object / warp overlap. Pure `check(beats, maps, wild, allowlist, tileLookup)`; 9-case in-memory `--selftest`; parser guard ≥100 wild maps (119). Exports `check, BEATS, ALLOWLIST`. |
| pokeemerald/Makefile | `check_beat_visibility` target (`--selftest && real run`) after check_playtest, in .PHONY, appended to check_all. |

Validators C354: `check_beat_visibility: selftest OK (9 cases)`; `check_beat_visibility: OK (4 beats, 1 allowlisted)` — A tide hiker Route106 54,15 metatile 0x124 clean / A empty B1F spot GraniteCave_B1F 26,20 metatile 0x201 clean / B TESSA Route119 20,110 metatile 0x2 clean / C ELLIS Route113 38,5 metatile 0x20A clean. In-memory planted breaks (hiker on warp 48,16, B1F setup call removed, TESSA clearflag removed, ELLIS with empty allowlist) each produced the expected V3/V1/V1/V2 error. check_object_tiles `0 errors, 13 warnings` (pre-existing); check_playtest `OK (2 presets, 11 beats)`; `make check_all` passed.
