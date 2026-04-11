# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 147-192 | **Trainer ID Audit**: 12 reclaimable IDs: #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853. | done |
| 121 | **CheckMultipleFlags macro**: Reusable macro for N-flag checks. Marginal benefit. | pending |
| 187 | **trainers.h macro orphan**: 17 unstaged fixes — `ITEM_CUSTOM_MOVES` -> `NO_ITEM_DEFAULT_MOVES`. Build passes either way. | pending |
| 192-194 | **Quest flag validation script** (`scripts/check_quest_flags.sh`): Grep FLAG_QUEST_* in flags.h, verify each is setflag'd and goto_if_set'd. 15-minute investment. | pending |
| 195-201 | **Generic `add_regional_form.js`**: Config-driven Node.js script — JSON spec in, 27+ file insertions out. Three bespoke scripts exist as templates (Corsola C195, Growlithe/Arcanine C198). Deferred 8 cycles. **Scheduled C202** — highest-ROI investment for v1.9. | pending |
