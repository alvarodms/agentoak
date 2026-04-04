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
| 115–149 | **Legendary Encounter Template** (`data/scripts/legend_macros.inc`): Extract parameterized macros from 4 shipped encounters (beasts, Groudon, Kyogre, Rayquaza). Reduces future legendary scripts from ~80 to ~20 lines. 28+ cycles deferred. Schedule when new legendary content is planned or during a lighter cycle. | pending |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit until patterns exceed 3 flags. | deferred |
| 139–141 | Script dialogue linting Make target (`make check_scripts`): Checks for non-charmap characters (em/en dashes) in map script files. Curly quotes and ellipsis are valid charmap entries and NOT flagged. | done (C141) |
| 142–145 | **Automated flag-chain validator** (`make check_flags`): Shell script + Makefile target. Detects flags checked but never set in scripts. Allowlist covers engine/C-set flags (FLAG_SYS_*, FLAG_BADGE*, FLAG_BEAST_*, etc.). | done (C145) |
| 147–149 | Audit `opponents.h` for reclaimable trainer IDs — TRAINERS_COUNT approaching capacity, need headroom for future double battles. | pending |
