# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104–112 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. Catches #1 recurring build failure class. | done (C112) |
| 113 | Trainer data consolidation: the 3-file edit pattern (opponents.h + trainers.h + trainer_parties.h) remains the highest-friction edit in the codebase. Worth a dedicated refactor cycle before any v6.0 trainer content work. Deferred since C106. | pending |
| 114 | Trainer data validation script (scripts/check_trainers.sh): cross-reference trainer IDs across opponents.h, trainers.h, and trainer_parties.h to flag missing entries or macro/struct mismatches. This is the #1 silent-failure pattern when editing trainers and has been deferred since C106 (8 cycles). Should be addressed before any v6.0 trainer content work. | pending |
