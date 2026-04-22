# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming, validation script, 3-state flag recipe. Not causing friction — revisit if quest-heavy cycles resume. | pending |
| 217→254 | **Config-driven species generator**: `scripts/generate_species.cjs` — JSON config → 18 files (cry_tables.inc skipped, cry_ids.h handles mapping). Validated: 18/19 check_species pass, idempotency check, dry-run mode. | done (C254) |
| 227→234 | **Palette recolor helper**: CLI tool (reads .pal + color mapping JSON → recolored output). Not blocking — Sprite Designer handles palette creation. | pending |
| 244 | **Rival R119 Stantler_Hoenn Lv25 gap**: Quick fix. | done (C245) |
| 245→253 | **Trainer swap validator → check_all**: `check_trainers` added to `make check_all` target. | done (C254) |
| 254 | **27-file species generator**: Extend `generate_species.cjs` from 19-file scope to full 27-file pipeline — add 8 graphics files (front/back pic tables, coordinate tables, palette tables, footprint table, still front pic table). Would eliminate ALL manual steps from species addition. Immediate payoff: C256-257 each add a species. ~1 focused refactor cycle. | pending |
| 256 | 27-file species generator extension: After C256 Lotad_Hoenn (second species through the generator), evaluate which of the 8 manual graphics table edits caused friction or errors. If the pattern is consistently boilerplate, extend generate_species.cjs to cover the full 27-file pipeline before C257 Shroomish_Hoenn. Two data points (Gligar C254 + Lotad C256) will show exactly where automation pays off. | pending |
| 257 | 27-file species generator extension: With Shroomish_Hoenn (C257) as the third species through the manual graphics pipeline (after Gligar C254, Lotad C256), we now have three data points confirming the 8 graphics table files are pure boilerplate. Schedule this as a focused refactor in C259 — before the evo-line batch (C260-261) where 3 species additions would save ~90 manual edits. Extend generate_species.cjs from 18-file to 27-file scope covering all 8 graphics tables (front/back pic tables, coordinate tables, palette/shiny palette tables, footprint table, still front pic table). | pending |
