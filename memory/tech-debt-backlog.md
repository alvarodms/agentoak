# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 147–191 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885. Expected yield: 10-20 reclaimable IDs. **Ship C192.** | pending |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit — revisit if patterns exceed 3 flags. | pending |
| 187 | **trainers.h macro orphan**: 17 unstaged fixes from v1.5 — `ITEM_CUSTOM_MOVES` → `NO_ITEM_DEFAULT_MOVES`. Build passes either way. | pending |
