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
