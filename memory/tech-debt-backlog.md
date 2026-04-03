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
| 142–143 | **Automated flag-chain validator** (`make check_flags`): Parse all checkflag/setflag/goto_if_set calls across script files, build a dependency graph, detect unreachable/circular/unset flags. C142 found two bugs that hid 20+ cycles. **Priority #1 for v1.1.** | pending (v1.1) |
| 144 | Automated flag-chain validator (`make check_flags`): Parse all checkflag/setflag/goto_if_set/goto_if_not_set calls across script files, build a dependency graph, detect flags that are checked but never set. C142 found two critical bugs that hid 20+ cycles — this would catch them at build time. Implementation: shell script + Makefile target, same pattern as existing `make check_scripts`. Priority #1 for v1.1 — schedule for C145. | pending |
