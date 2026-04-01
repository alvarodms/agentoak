# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104–112 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. | done (C112) |
| 106–118 | Trainer data validation script (scripts/check_trainers.sh): cross-reference trainer IDs across opponents.h, trainers.h, and trainer_parties.h. | done (C118) |
| 118–127 | Integrate trainer validation as a Make target (`make check_trainers`) — auto-runs before build. Deferred 9 cycles, finally shipped C127. | done (C127) |
| 115 | Legendary Encounter Template: Extract parameterized script template from encounter patterns (Lati roamer, beast sequence, static legendary). | deferred |
| 121 | CheckMultipleFlags script macro (data/scripts/legend_macros.inc): reusable macro for N-flag checks. Marginal benefit until patterns exceed 3 flags. | deferred |
| 126–127 | ASCII validation guard in Makefile: pre-build scan of .inc files for non-ASCII characters. Eliminates most persistent failure class. | done (C127) |
| 128 | Legendary Encounter Template: Extract parameterized script template from encounter patterns (beast sequence, Groudon/Kyogre statics) into data/scripts/legend_macros.inc. Would reduce Rayquaza encounter to ~20 lines instead of 80+. Deferred since C115 — should be built before v7.0 Rayquaza. | pending |
| 129 | Two items: (1) Move constant validator script (scripts/check_moves.sh): scan trainer_parties.h for MOVE_* references and verify each exists in moves.h. Will catch typos during C130-132 trainer overhaul. Low effort, high value. (2) Legendary Encounter Template (deferred since C115, now 14 cycles): extract parameterized script template from beast sequence / Groudon/Kyogre patterns. Should ship before v7.0 Rayquaza arc — target C133-134 at latest. | pending |
| 130 | Move constant validator script (scripts/check_moves.sh): scan trainer_parties.h for MOVE_* references and verify each exists in moves.h. Low effort, catches typos during C130-132 trainer overhaul. Tech Lead has recommended this for 2 cycles. Target C131 alongside Gym Leaders 5-8. | pending |
