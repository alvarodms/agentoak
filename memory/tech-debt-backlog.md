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
| 152–170 | **`make check_scripts` as build prerequisite** — catches non-ASCII encoding errors at build time | done (C170) |
| 164–170 | **Encounter table validation script** (`scripts/check_encounters.sh` + `make check_encounters`) — validates species constants, slot counts, level ranges, duplicate maps | done (C170) |
| 115–156 | **Legendary Encounter Template** (`data/scripts/legend_macros.inc`): Extract parameterized macros from 4 shipped encounters. Reduces future legendaries from ~80 to ~20 lines. | deferred — not blocking v1.5 |
| 147–157 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885, only 2 known reclaimable IDs (#568, #853). | deferred — not blocking v1.5 |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit until patterns exceed 3 flags. | deferred |
| 152–170 | **Scripted Event Macro Library** (`data/scripts/event_macros.inc`): 12+ patterned scripts across weather omens, migration events, and route identity NPCs share near-identical patterns. Each future event script would drop from ~10 lines to ~2-3. Deferred 18 cycles. Consider scheduling after v1.5 content work begins. | pending |
| 171 | Scripted Event Macro Library (data/scripts/event_macros.inc): 12+ near-identical script patterns across weather omens, migration events, and route identity NPCs. Each new event script is ~10 lines when it could be 2-3 with macros. Deferred 18 cycles. If v1.5 involves any narrative/event work alongside trainer changes, this should be the first implementation cycle. Even without events, consider scheduling as a standalone cycle to reduce friction for future content. | pending |
| 172 | Trainer Party Template Script: A reusable script that converts NoItemDefaultMoves → ItemCustomMoves for a given trainer ID range, generating the correct struct type and trainers.h macro simultaneously. Would save time across P2-P4 (Victory Road ~15 trainers, Ocean Routes ~25 trainers, Cave ~10 trainers). Build during a future P2 cycle, reuse for P3-P4. One-cycle investment, 3-cycle payoff. | pending |
