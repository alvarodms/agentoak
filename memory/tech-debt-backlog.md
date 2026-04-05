# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104–112 | Dialogue integrity checker script (scripts/check_dialogue.sh) | done (C112) |
| 106–118 | Trainer data validation script (scripts/check_trainers.sh) | done (C118) |
| 118–127 | Trainer validation Make target (`make check_trainers`) | done (C127) |
| 126–127 | ASCII validation guard in Makefile | done (C127) |
| 129–133 | Move constant validator script — window passed, inline grep sufficed | dropped (C133) |
| 139–141 | Script dialogue linting Make target (`make check_scripts`) | done (C141) |
| 142–145 | Automated flag-chain validator (`make check_flags`) | done (C145) |
| 115–156 | **Legendary Encounter Template** (`data/scripts/legend_macros.inc`): Extract parameterized macros from 4 shipped encounters. Reduces future legendaries from ~80 to ~20 lines. | deferred — not blocking v1.3 |
| 147–157 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885, only 2 known reclaimable IDs (#568, #853). | deferred — not blocking v1.3 |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit until patterns exceed 3 flags. | deferred |
| 152–160 | **Scripted Event Macro Library** (`data/scripts/event_macros.inc`): 4 weather omen routes (C159-C160) + 4 migration events (C149/C152/C153/C154) share near-identical patterns. Weather omen macro `WeatherOmen_Gate(badge_flag, weather_const, npc_flag)` would reduce 8-10 lines to 2. All 4 weather routes now live — ideal extraction point. Schedule for first post-v1.3 engineering cycle. | pending (10 cycles deferred) |
