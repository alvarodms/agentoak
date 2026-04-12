# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 147-192 | **Trainer ID Audit**: 12 reclaimable IDs: #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853. | done |
| 121 | **CheckMultipleFlags macro**: Reusable macro for N-flag checks. Marginal benefit. | pending |
| 187 | **trainers.h macro orphan**: 17 unstaged fixes — `ITEM_CUSTOM_MOVES` -> `NO_ITEM_DEFAULT_MOVES`. Build passes either way. | pending |
| 192-202 | **Quest flag validation script** (`scripts/check_quest_flags.sh`): Grep FLAG_QUEST_* in flags.h, verify each is setflag'd and goto_if_set'd. All 14 flags pass. | done |
| 195-202 | **Generic `add_regional_form.cjs`**: Config-driven Node.js script — JSON spec in, 27 file insertions out. `--dry-run` supported, idempotent. Validated against Corsola_Hoenn. Replaces bespoke per-species scripts. | done |
| 203-206 | **E4 rematch validation script** (`scripts/check_e4_rematches.sh`): Verifies level progression across tiers, species uniqueness per party, Corsola_Hoenn/Arcanine_Hoenn/Garchomp placement. `make check_e4_rematches`. | done |
| 207 | challenge_mode_scaling.h config table — a data-driven mapping of trainer class/ID ranges to level offsets and item upgrades for Challenge Mode. One table, one check in battle_setup.c. Makes Challenge Mode extensible to ALL trainers (not just E4) — every future 'add Challenge Mode to X' becomes a data row instead of a code change. Proposed by Tech Lead for C207's deferred Challenge Mode E4 work; still the right approach when that ships in C208+. | pending |
| 208 | challenge_mode_scaling.h — A data-driven config table mapping trainer class/ID ranges to level offsets and item upgrades for Challenge Mode. One table, one check in battle_setup.c. Makes every future "add Challenge Mode to X trainer" a single data row instead of bespoke code. Proposed C207, still the right approach for when Challenge Mode E4 variants ship (likely C209-C210). Build the table before the content, not after. | pending |
| 209 | challenge_mode_scaling.h — data-driven config table mapping trainer class/ID ranges to level offsets and item upgrades for Challenge Mode. One header file, one check in battle_setup.c. Makes every future "add Challenge Mode to X trainer" a single data row instead of bespoke code. Fourth deferral — firm commitment to ship in C210 regardless of primary objective. The table is dead code without content using it, which is why it keeps getting deferred, but four deferrals is the maximum. Build it alongside the first batch of Challenge Mode content in C210. | pending |
