# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming, validation script, 3-state flag recipe. Not causing friction — revisit if quest-heavy cycles resume. | pending |
| 217→254 | **Config-driven species generator** (flagged 12 times, C217-C252): Replace the 19-file manual species pipeline with JSON config → 19 files out. 22 manual additions provide regression data. COMMITTED: C254 (first cycle of v2.3). Block all v2.3 content species work until shipped. | pending |
| 227→234 | **Palette recolor helper**: CLI tool (reads .pal + color mapping JSON → recolored output). Not blocking — Sprite Designer handles palette creation. | pending |
| 244 | **Rival R119 Stantler_Hoenn Lv25 gap**: Quick fix. | done (C245) |
| 245→253 | **Trainer swap validator → check_all**: Promote Check 5+6 (macro/struct alignment, built C247) to standard `make check_all` target. Catches drift automatically. Low effort, high compound value. | pending |
