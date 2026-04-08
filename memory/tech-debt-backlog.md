# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 115–183 | **Legendary Encounter Template** (`data/scripts/legend_macros.inc`): Extract parameterized macros from 4 shipped encounters. Reduces future legendaries from ~80 to ~20 lines. Deferred 69 cycles. event_macros.inc (C179) proved the include pattern works. **Scheduled C185.** | pending |
| 147–184 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885, reclaimable IDs: #568, #853, #854. Schedule when v1.7 adds trainers. | pending |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit — revisit if patterns exceed 3 flags. | pending |
| 184 | **`difficulty_utils.inc`** macro file — `DifficultyAwareDialogue flag, text_normal, text_challenge` cuts future difficulty NPCs from ~15 to ~3 lines. Schedule when v1.7 adds more difficulty-reactive content. | pending |
