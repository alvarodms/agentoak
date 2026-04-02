# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104–112 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. | done (C112) |
| 106–118 | Trainer data validation script (scripts/check_trainers.sh): cross-reference trainer IDs across opponents.h, trainers.h, and trainer_parties.h. | done (C118) |
| 118–127 | Integrate trainer validation as a Make target (`make check_trainers`) — auto-runs before build. Deferred 9 cycles, finally shipped C127. | done (C127) |
| 115–128 | Legendary Encounter Template: Extract parameterized script template from encounter patterns (beast sequence, Groudon/Kyogre statics) into data/scripts/legend_macros.inc. Would reduce Rayquaza encounter to ~20 lines instead of 80+. Deferred since C115 — evaluate when v7.0 Sky Guardian planning begins. | pending |
| 121 | CheckMultipleFlags script macro (data/scripts/legend_macros.inc): reusable macro for N-flag checks. Marginal benefit until patterns exceed 3 flags. | deferred |
| 126–127 | ASCII validation guard in Makefile: pre-build scan of .inc files for non-ASCII characters. Eliminates most persistent failure class. | done (C127) |
| 129–133 | Move constant validator script (check_moves.sh): proposed C129, deferred through C132, dropped C133. Window passed — trainer overhaul complete, inline grep validation sufficed for learnset work. | dropped (C133) |
| 115–134 | Legendary Encounter Template: Extract parameterized macros from v5/v6 encounters into data/scripts/legend_macros.inc. Reduces Rayquaza script from ~80 to ~20 lines. **Ship in C137** alongside Rayquaza encounter implementation — the ideal time to extract while building a new consumer. | pending |
| 135 | Legendary Encounter Template (legend_macros.inc): Extract parameterized macros from v5/v6 legendary encounter scripts. Reduces each new encounter from ~80 lines to ~20. Ship in C137 alongside Rayquaza battle implementation — extracting while building a new consumer is the ideal moment. Pending since C115 (20 cycles). | pending |
| 136 | Legendary Encounter Template (legend_macros.inc): Extract parameterized macros from v5/v6 legendary encounter scripts. Reduces each new encounter from ~80 lines to ~20. Ship in C137 alongside Rayquaza battle implementation — extracting while building a new consumer is the ideal moment. Pending since C115 (21 cycles). C137 is non-negotiable. | pending |
