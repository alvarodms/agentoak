# v3.4 "Word Travels" (C366 design, build C367-C371)

Design: memory/strategy-notes.md, v3.4 section.

## C367 — groundwork (refactor, no player-visible ROM change)

No data/maps, src/ or include/ file touched.

| File | Change |
|---|---|
| src/emulator/checkpoints.ts (new) | `CHECKPOINTS` (slateport_arrival: Route 109 21,23, Briney + boat shown, Devon Goods undelivered; mauville_pre_wattson: Mauville 18,17, post-Slateport/Route 110, Wally pending) with a file:line comment per value; `applyCheckpoint()` (test wins; temp-key guard) |
| src/emulator/checkpoints.test.ts (new) | merge order, partial tile, FLAG_TEMP_/VAR_TEMP_ guard, limits with 20 flags spare, every name defined in flags.h/vars.h |
| src/emulator/scenario.ts | `checkpoint?` field; map/x/y optional (encodeScenario requires them); `resolveScenario` applies the checkpoint first; `LIMITS` exported |
| src/emulator/playtest.ts | ScenarioSchema `checkpoint` + refines (map/x/y all-or-none, required without checkpoint); `expectBoxCount` step + exported `messageBoxes()` |
| src/emulator/playtest.test.ts | expectBoxCount parse + counting/exclusions; checkpoint schema |
| pokeemerald/playtests/checkpoint-slateport-arrival-boot.json (new) | boot, idle, 21,23 on Route 109, Briney 21,24 + boat 21,26 visible, warp Slateport 20,24 |
| pokeemerald/playtests/checkpoint-mauville-pre-wattson-boot.json (new) | boot, idle, 18,17; warp 12,10, Wally 8,6 + uncle 9,6 present |
| pokeemerald/playtests/route104-ivan-defeated-talk.json | + `expectBoxCount: 1` |
| pokeemerald/playtests/README.md | `checkpoint` scenario field, `expectBoxCount` row |
| pokeemerald/scripts/beats.json (new) | 15 shipped beat rows (v3.0-v3.3), 7 allow entries |
| pokeemerald/scripts/check_beats.cjs (new) | B0-B4 + `--selftest` (planted failure per rule), `walkLabels()` |
| pokeemerald/Makefile | `check_beats` target, .PHONY, check_all after check_beat_visibility |

Suite 86/86. Lint migration of check_playtest / check_beat_visibility / check_object_tiles onto beats.json moved to C370 (parity baseline in strategy-notes C367 spec).
