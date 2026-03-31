# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104–112 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. Catches #1 recurring build failure class. | done (C112) |
| 106–118 | Trainer data validation script (scripts/check_trainers.sh): cross-reference trainer IDs across opponents.h, trainers.h, and trainer_parties.h to flag missing entries or macro/struct mismatches. | done (C118) |
| 115 | Legendary Encounter Template: Extract parameterized script template from Ho-Oh encounter (species/level/flag/cry as variables). Three encounter patterns exist (Lati roamer, beast sequence, static Ho-Oh). v6.0 adds Groudon + Kyogre using same pattern. | **planned for C123** |
| 118 | Integrate trainer validation as a Make target (`make check_trainers`) or pre-build hook, so every future trainer edit is validated automatically instead of requiring manual script runs. Cost: ~15 minutes of Makefile work on top of the C118 script. Proposed by Tech Lead C118. | pending |
| 119-120 | CheckMultipleFlags — superseded by entry 121 below | superseded |
| 121 | CheckMultipleFlags script macro (data/scripts/legend_macros.inc): Extract a reusable macro that checks N flags and branches to a label if all are set. Deferred from C119-C122 — inline flag checks sufficient for current 2-3 flag patterns. Technically feasible (GAS .macro in event_scripts.s), but benefit is marginal until patterns exceed 3 flags. Revisit if C123-125 needs 4+ flag checks. | deferred |
| 122 | Integrate trainer validation as a Make target (`make check_trainers`) or pre-build hook so every future trainer edit is validated automatically instead of requiring manual script runs. Cost: ~15 minutes of Makefile work on top of the C118 script. Deferred since C118. | pending |
| 123 | Integrate trainer validation as a Make target (`check_trainers` phony target in pokeemerald/Makefile) that runs scripts/check_trainers.sh before the main build. This has been deferred since C118 (5 cycles). With 6 new trainers this cycle and more coming in v7.0, auto-validation on every build would catch ID mismatches and missing party data before they reach the linker. Estimated effort: ~15 minutes. | pending |
| 124 | Integrate trainer validation as a Make target (`make check_trainers`) — phony target in pokeemerald/Makefile that runs scripts/check_trainers.sh before the main build. Deferred since C118 (6 cycles). With 6 trainers added in C123 and more coming in v7.0, auto-validation on every build would catch ID mismatches and missing party data before they reach the linker. Estimated effort: ~15 minutes of Makefile work. | pending |
| 125 | Integrate trainer validation as a Make target (`make check_trainers`) — phony target in pokeemerald/Makefile that runs scripts/check_trainers.sh before the main build. Deferred since C118 (7 cycles). Bundle into the first v7.0 cycle (C126) which will likely add Sky Pillar trainers. Estimated effort: ~15 minutes of Makefile work. | pending |
