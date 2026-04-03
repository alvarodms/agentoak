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
| 115–138 | **Legendary Encounter Template** (`data/scripts/legend_macros.inc`): Extract parameterized macros from 4 shipped encounters (beasts, Groudon, Kyogre, Rayquaza). Reduces future legendary from ~80 to ~20 lines. 23 cycles deferred. | **scheduled C139** |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit until patterns exceed 3 flags. | deferred |
| 139–141 | Script dialogue linting Make target (`make check_scripts`): Checks for non-charmap characters (em/en dashes) in map script files. Curly quotes and ellipsis are valid charmap entries and NOT flagged. | done (C141) |
| 141 | Legendary Encounter Template (`data/scripts/legend_macros.inc`): Extract parameterized macros from 4 shipped encounters (beasts, Groudon, Kyogre, Rayquaza). Reduces future legendary from ~80 to ~20 lines. | deferred (v1.1) |
| 142 | Automated flag-chain validator (`make check_flags`): Parse all checkflag/setflag/goto_if_set calls from scripts.inc files, build a dependency graph, report unreachable or circular flag states. Would permanently catch flag regressions. Estimated effort: ~30 min. Defer to v1.1 — the manual audit in C142 covers the immediate v1.0 need. | pending |
