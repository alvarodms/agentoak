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
| 139 | Script dialogue linting Make target (`make check_scripts`): Run `grep -P '[\x80-\xFF]'` across all `.inc` files automatically. With C140-C141 adding 10-14 new NPC dialogues, this prevents the #1 recurring build failure pattern (non-ASCII characters). ~15-minute addition to Makefile. Consider bundling into C140 since that cycle will touch many script files. | pending |
| 140 | Script dialogue linting Make target (`make check_scripts`): Run `grep -P '[\x80-\xFF]'` across all `.inc` files automatically before build. With C140-C141 adding 10-14 new NPC dialogues, this prevents the #1 recurring build failure pattern (non-ASCII characters). ~15-minute Makefile addition. Deferred from C139 — bundle into C141 which is another dialogue-heavy cycle. Now deferred 2 cycles. | pending |
