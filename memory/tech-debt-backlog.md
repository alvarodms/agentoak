# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 115–185 | **Legendary Encounter Template** (`asm/macros/legend_macros.inc`): 7 parameterized macros for legendary encounters. Reduces future legendaries from ~80 to ~20 lines. | done |
| 147–184 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885, reclaimable IDs: #568, #853, #854. Schedule when v1.7 adds trainers. | pending |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit — revisit if patterns exceed 3 flags. | pending |
| 184–187 | **`difficulty_utils.inc`** macro file — `DifficultyAwareDialogue flag, text_normal, text_challenge` cuts difficulty-branching NPCs from ~15 to ~3 lines. Deferred 4 cycles. Not needed for current atmospheric NPCs (single-mode). Natural fit for C190 polish phase or any future difficulty-specific variants. | pending |
| 187 | **trainers.h macro orphan**: 17 unstaged fixes from PR #106 — `ITEM_CUSTOM_MOVES` → `NO_ITEM_DEFAULT_MOVES` for trainers without held items. Build passes either way but should be committed for cleanliness. | pending |
