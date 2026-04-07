# Engineering Validation — File Modifications

| File | Cycles | Notes |
|------|--------|-------|
| `pokeemerald/scripts/check_dialogue.sh` | C112 | Dialogue integrity checker |
| `pokeemerald/scripts/check_trainers.sh` | C118 | Trainer data validation |
| `pokeemerald/scripts/check_flags.sh` | C145 | Flag-chain validator |
| `pokeemerald/scripts/check_encounters.sh` | **C170** | Encounter table validator (species exist, slot counts, level sanity, duplicate maps) |
| `pokeemerald/Makefile` | C127, C141, C145, **C170** | check_trainers/check_ascii/check_scripts/check_flags targets (C127-C145); check_encounters target + check_scripts as rom prerequisite (C170) |
