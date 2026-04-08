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
| 152–179 | **Scripted Event Macro Library** (`asm/macros/event_macros.inc`): 3 macros — GlimpseEvent, BadgeGateShow, ConditionalDialogue. Extracted from 12+ patterns. | **done (C179)** |
| 172–177 | Trainer Party Template Script | dropped — v1.5 complete, zero build failures from struct mismatches across 6 manual passes (C172-177, 100+ trainers). Manual Node.js scripts proved sufficient. |
| 173–177 | Trainer Party Validation Enhancement | dropped — v1.5 complete, no regressions detected. Future trainer passes can revisit if needed. |
| 177–178 | Duplicate entries for Scripted Event Macro Library — consolidated above as "scheduled C179" | consolidated |
| 179 | Tech Lead noted: legend_macros.inc (deferred since C115) would work with the same include pattern. Confirmed: event_macros.inc include succeeded, so legend_macros.inc will too. | **verified (C179)** |
