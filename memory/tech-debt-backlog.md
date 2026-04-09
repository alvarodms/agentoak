# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 115–185 | **Legendary Encounter Template** (`asm/macros/legend_macros.inc`): 7 parameterized macros for legendary encounters. Reduces future legendaries from ~80 to ~20 lines. | done |
| 147–184 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885, reclaimable IDs: #568, #853, #854. Schedule when v1.7 adds trainers. | pending |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit — revisit if patterns exceed 3 flags. | pending |
| 184–190 | **`difficulty_utils.inc`** macro file — `EventMacro_DifficultyDialogue text_normal, text_challenge` cuts difficulty-branching NPCs from ~15 to ~3 lines. Shipped C190. | done |
| 187 | **trainers.h macro orphan**: 17 unstaged fixes from v1.5 — `ITEM_CUSTOM_MOVES` → `NO_ITEM_DEFAULT_MOVES` for trainers without held items. Build passes either way but should be committed for cleanliness. | pending |
| 189 | `difficulty_utils.inc` — duplicate of row above, shipped C190. | done |
| 190 | Trainer ID Audit Script (pending since C147): Cross-reference opponents.h, trainers.h, rematch tables, and map scripts to find dead/reclaimable trainer IDs. With TRAINERS_COUNT at 885/885 and only 3 known reclaimable IDs, any v1.8 work involving new trainers will hit this wall. A Node.js or shell script could unlock 10-20 slots. Recommend scheduling for C191 buffer or early v1.8. | pending |
