# v3.1 "Taken at Their Word" — Completed Work

Postgame beats where an NPC takes a Red Ink page at its word. Design + roadmap: memory/strategy-notes.md (v3.1 section).

## C348-C350 — Beats A/B/C (collapsed C360; per-file detail in git history)
- Shared files: include/constants/flags.h (0x30-0x33 hide flags), data/scripts/new_game.inc (ResetAllMapFlags setflags), scripts/check_playtest.cjs (neverSet + coda BEATS rows).
- C348 Beat A: GraniteCave_B1F + Route106 map.json/scripts.inc (tide hiker, SetupHikerLeft, Route106_OnTransition); NEW scripts/check_encounter_odds.cjs + Makefile target.
- C349 Beat B: opponents.h 117 → TRAINER_ROUTE119_STORM_CHASER, trainers.h, trainer_parties.h sParty_StormChaser, NEW trainer_configs/route119_storm_chaser.json, check_trainer_slots RECLAIMED, Route119 map.json/scripts.inc.
- C350 Beat C: opponents.h 173 → TRAINER_ROUTE113_ASH_CAMPER, trainers.h, trainer_parties.h sParty_AshCamper, NEW trainer_configs/route113_ash_camper.json, check_trainer_slots RECLAIMED, Route113 map.json/scripts.inc.

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

### C358 postgame red ink offer (defect fix, content freeze)

| File | Change |
|---|---|
| pokeemerald/data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc | NEW `LittlerootTown_ProfessorBirchsLab_EventScript_PostgameRedInkOffer` (after BookshelfGreeting): skips if FLAG_TEMP_1 set, Johto state 1/2/4/5, or < 3 inked pages; else setflag FLAG_TEMP_1, `gBirchDexRatingText_AreYouCurious` YES/NO, YES → RatePokedex + FieldNotes + RedInkReport, then `return` (NO returns silently). Called as the first line of `BirchLab_ReckoningCheckDone`, so a pending Reckoning payoff (which ends the talk) still comes first and the migration quest follows. No new text, no save flag. FLAG_TEMP_1 was unused by the lab and prof_birch.inc (grep C358). prof_birch.inc untouched (Champion's Room also calls RatePokedex). |
| pokeemerald/playtests/birch-bookshelf-postgame-greeting.json | FLIPPED C358 (same scenario): talk 1 (maxPresses 600, the chain is ~40 boxes) = copying → offer → rating → den hint → report (4 believers) → quest hook, FLAG_BIRCH_QUEST_STARTED; talk 2 = copying → BirchRemind ("Any order you like."), no offer. Fail-first: on the tree without the call it failed at step 3 "text missing 'Are you curious about how your'". |
| pokeemerald/playtests/birch-postgame-reckoning-first.json, birch-postgame-two-pages-no-offer.json | NEW C358. All 6 FLAG_RECKONING_TALKED_*: talk 1 = copying + Reckoning payoff (PP MAX), no offer; talk 2 = offer + report + quest hook. 2 pages postgame: Birch faces down, quest hook only. |
| pokeemerald/playtests/lilycove-doubt-sets-flag.json | NEW C358. Player 34,36 facing down at ExpertF (object index 8, 34,37, no LOCALID): Glide + WroteDoubt, FLAG_LILYCOVE_GLIGAR_DOUBT false → true, she stays facing down; talk 2 = StillGliding only. |
| pokeemerald/playtests/marlow-keeps-the-pool.json, marlow-warns-before-catch.json | NEW C358. Trade done: ON_TRANSITION SailorAtPool moves MARLOW to 18,6 facing DOWN (not 17,6 right, as the plan assumed); player at 19,6 facing left, SailorDone text, he stays facing down (no faceplayer). Before catch: 17,6 facing right, player 16,6; SailorWarn, he turns left to the player, trade flag stays false. The trade itself (party menu) is not scripted. |

Verification C358: full ROM build OK; playtest suite 47/47 (42 prior + 5 new); `make check_all_quick` and `make check_playtest` OK; escape grep clean; npm test 444/444.
