# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 115–185 | **Legendary Encounter Template** (`asm/macros/legend_macros.inc`): 7 parameterized macros for legendary encounters. Reduces future legendaries from ~80 to ~20 lines. | done |
| 147–184 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885, reclaimable IDs: #568, #853, #854. Schedule when v1.7 adds trainers. | pending |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit — revisit if patterns exceed 3 flags. | pending |
| 184–185 | **`difficulty_utils.inc`** macro file -- `DifficultyAwareDialogue flag, text_normal, text_challenge` cuts future difficulty NPCs from ~15 to ~3 lines. Natural fit for C186's badge-conditional city dialogue or C190's polish phase. | pending |
