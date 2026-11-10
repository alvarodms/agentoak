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


## C351-C352 — consolidation (collapsed C356)
C351: playtest_coda.inc VISITED flags, check_playtest R3/R4 + selftest f/g/h, checklist steps 44-46. C352: memory-only static visibility audit. Detail: git history.

## C354 — Beat A tile move + check_beat_visibility

No script, text, flag, trainer or facing changed.

| File | Change |
|---|---|
| pokeemerald/data/maps/Route106/map.json | LOCALID_ROUTE106_TIDE_HIKER y 11 → 15 (now 54,15; elevation 3, FACE_UP, flag 0x30 unchanged). Tile re-read before the edit with `tileAt`: collision 0, elevation 3, metatile 0x124 (292), behaviour 33 MB_SAND. No other object/warp/bg event on 54,15. |
| pokeemerald/data/maps/Route106/scripts.inc | Beat A comment above `Route106_OnTransition::` rewritten (4 lines: 54,15, out of ELLIOT's/NED's sight). Script unchanged. |
| pokeemerald/scripts/check_beat_visibility.cjs | NEW. Postgame beat visibility guard, BEATS = A tide hiker, A empty B1F spot (shows: false), B TESSA, C ELLIS (Route 104 coda left to check_playtest R5). V1 object+flag in map.json, object script label, setup reached from ON_TRANSITION (is / call / goto), setup body default flag command before first goto_if/call_if + opposite command after `goto_if_unset FLAG_SYS_GAME_CLEAR` + `setvar VAR_0x8004, <species>`; V2 species in the map's own wild tables (land/water/rock smash/fishing, gWildMonHeaders) needs an ON_RESUME path to the setup or an ALLOWLIST reason (1 entry: Route113 ELLIS, D3; stale fails); V3 start tile via check_object_tiles `tileAt`/`tileProblems` + always-present object / warp overlap. Pure `check(beats, maps, wild, allowlist, tileLookup)`; 9-case in-memory `--selftest`; parser guard ≥100 wild maps (119). Exports `check, BEATS, ALLOWLIST`. |
| pokeemerald/Makefile | `check_beat_visibility` target (`--selftest && real run`) after check_playtest, in .PHONY, appended to check_all. |

Validators C354: `check_beat_visibility: selftest OK (9 cases)`; `check_beat_visibility: OK (4 beats, 1 allowlisted)` — A tide hiker Route106 54,15 metatile 0x124 clean / A empty B1F spot GraniteCave_B1F 26,20 metatile 0x201 clean / B TESSA Route119 20,110 metatile 0x2 clean / C ELLIS Route113 38,5 metatile 0x20A clean. In-memory planted breaks (hiker on warp 48,16, B1F setup call removed, TESSA clearflag removed, ELLIS with empty allowlist) each produced the expected V3/V1/V1/V2 error. check_object_tiles `0 errors, 13 warnings` (pre-existing); check_playtest `OK (2 presets, 11 beats)`; `make check_all` passed.

## C355 — v3.1 playable milestone (recruit post + playtest)
- `pokeemerald/playtests/coda-difficulty-man-normal.json` (new): PETALBURG Pokémon Center 1F, player at 3,7 facing up, cleared save with FLAG_DIFFICULTY_CHALLENGE clear. The difficulty man (object #6, 3,6, facing down) says the steady-pace line, with no offer and no flag change. This backs the "Known first impression, coda ROM" note in playtest-checklist.md.
- memory: playtest-recruit-post.md rewritten (AI disclosure first, 20/30-minute tiers, five spoiler-free questions, stop-point field, paste-ready README block for the owner; README.md itself untouched). playtest-checklist.md: spoiler banner, coda first-impression note, visibility-audit row A relabelled 54,15 (C352 figures were taken at 54,11). player-journey-map.md: Beat A tile 54,11 → 54,15.
- `make check_playtest_build`: the first C355 pass reported OK. pokeemerald_playtest.gba and pokeemerald_playtest_coda.gba (built 02:38 on 2026-11-10) are on disk. The validation-fix pass did not re-run it (that prompt forbids make).

## C356 — v3.2 T1 "The ring in the ash" (content freeze declared)

| File | Change |
|---|---|
| pokeemerald/data/maps/Route113/scripts.inc | Header gains `map_script MAP_SCRIPT_ON_LOAD, Route113_OnLoad` (first ON_LOAD on the map). `Route113_OnLoad:` → `goto_if_unset FLAG_SYS_GAME_CLEAR` / `goto_if_not_defeated TRAINER_ROUTE113_ASH_CAMPER` → `Route113_EventScript_OnLoadEnd`, else 6× `setmetatile x, y, METATILE_Fallarbor_NormalGrass, FALSE` at 38,4 / 37,5 / 39,5 / 37,6 / 39,6 / 38,7. No flags, text, waits or DrawWholeMapView. OnResume/OnTransition unchanged. |
| pokeemerald/scripts/check_beat_visibility.cjs | `TRACES` config (1 row) + pure `checkTraces(traces, maps, tileOf)` called from main(): W1 label is the ON_LOAD target; W2 GAME_CLEAR guard before first setmetatile, no wait*/delay*/msgbox/message/applymovement/`special DrawWholeMapView`; W3 literal destination set == tiles, metatile name, FALSE; W4 not an object start tile (any flag), not a DexBeliever/InkBeliever/setobjectxy(perm) spot, collision 0, layout metatile == `from` (0x20A), not a warp. Errors are tagged `W1 `..`W4 `. Selftest 9 → 20 cases (10 good trace; 11-20 must fail: object tile, collision, delay, ON_TRANSITION wiring, runtime believer spot, trimmed tile, TRUE, non-ash tile, no GAME_CLEAR guard, warp). Exports add `checkTraces, TRACES`. |
| pokeemerald/playtests/ring-in-the-ash-after-win.json, ring-in-the-ash-before-win.json | NEW. Soot Sack + repel; start on 37,4 (ash field). Beaten: steps onto 37,5/37,6 gather 0 ash, 36,6 gathers 1. Unbeaten: 37,5 gathers 1. |

Validators C356: selftest OK (20 cases) exit 0; real run `OK (4 beats, 1 allowlisted, 1 traces)` exit 0. Planted `setmetatile 38, 7` → `38, 6` on the real tree: exit 1 (W3 38,6 not in tiles, W3 38,7 missing, W4 38,6 = picnicker's EventMacro_DexBelieverPlace spot); reverted, exit 0; `make check_beat_visibility` exit 0. Full ROM build OK; playtest suite 34/34; `make check_all_quick` exit 0. Memory: playtest-checklist.md step 46b; strategy-notes.md T1 SHIPPED, freeze, rows 356/357; player-journey-map.md postgame Route 113 line.
### C357 playtests (content freeze)

| File | Change |
|---|---|
| pokeemerald/playtests/ash-camper-hidden-before-credits.json, ash-camper-hidden-without-vulpix.json, ash-pair-face-each-other.json, ash-pair-look-out-together-after-win.json, ash-pair-still-watching-on-return.json | NEW C357. Beat C: all start 37,4 + VAR_REPEL_STEP_COUNT 200. Hidden pre-credits (picnicker 38,6 up) / hidden without VULPIX_H (picnicker 38,8 right) / pair faces each other + picnicker CAMPER line / Metagross Lv100 METEOR MASH win (one miss on NINETALES on this seed, 3 turns), both face right, second talk no battle / defeated: both right, Watching line. Hail probe (Harden lead, turns 1 and 2): no hail, probe deleted. |
| pokeemerald/playtests/birch-bookshelf-reads-your-ink.json, birch-two-pages-no-report.json, birch-bookshelf-postgame-greeting.json | NEW C357. Birch lab from 6,5, VAR_BIRCH_LAB_STATE 5, VAR_PETALBURG_GYM_STATE 7. Pre-credits pages 1-4: 6,4 facing up, copying line + rating + full report (4 believers, Believed, Close). 2 pages: facing down, rating, no copying/report. Postgame (GAME_CLEAR, Johto state 3): bookshelf + copying line, then BirchQuestCheck hook, no rating/report. |
