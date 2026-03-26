# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. Catches #1 recurring build failure class. ~15 min to implement. | pending |
| 106 | Trainer data consolidation: 3-file system (opponents.h + trainers.h + trainer_parties.h) → unified format. Highest-friction edit pattern across 20+ cycles. Would pay off if v5.0 adds trainers. | pending |
