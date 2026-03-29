# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104–112 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. Catches #1 recurring build failure class. | done (C112) |
| 106–117 | Trainer data validation script (scripts/check_trainers.sh): cross-reference trainer IDs across opponents.h, trainers.h, and trainer_parties.h to flag missing entries or macro/struct mismatches. #1 silent-failure pattern when editing trainers. 11 cycles pending. | **planned for C118** |
| 115 | Legendary Encounter Template: Extract parameterized script template from Ho-Oh encounter (species/level/flag/cry as variables). Three encounter patterns exist (Lati roamer, beast sequence, static Ho-Oh). v6.0 adds Groudon + Kyogre using same pattern. | **planned for C123** |
