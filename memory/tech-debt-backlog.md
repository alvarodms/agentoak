# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 147–192 | **Trainer ID Audit**: Done. 12 reclaimable IDs: #117 CINDY_2, #173 DUDLEY, #462 KAYLEE, #485 AMY_AND_LIV_3, #486 GINA_AND_MIA_2, #568 GRUNT_UNUSED, #581 TERRY, #633 LUCAS_2, #634 MIKE_1, #851 RED, #852 LEAF, #853 MAY_PLACEHOLDER. Note: #854 (SIDNEY_REMATCH_1) is NOT reclaimable — it's in the rematch table. | done |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit — revisit if patterns exceed 3 flags. | pending |
| 187 | **trainers.h macro orphan**: 17 unstaged fixes from v1.5 — `ITEM_CUSTOM_MOVES` → `NO_ITEM_DEFAULT_MOVES`. Build passes either way. | pending |
| 192 | Quest flag validation script (`scripts/check_quest_flags.sh`): Verify (a) all allocated quest flags 0x28A-0x297 are defined in flags.h, (b) every flag that's `setflag`'d somewhere is also `goto_if_set` somewhere, (c) no flag collisions with existing allocations. Prevents "quest doesn't trigger" bugs across C193-197. Estimated cost: ~15 minutes. Proposed by Tech Lead C192. | pending |
