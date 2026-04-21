# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming, validation script, 3-state flag recipe. Not causing friction — revisit if quest-heavy cycles resume. | pending |
| 217→244 | **Config-driven species generator** (flagged 8 times since C217): Replace the 19-file manual pipeline with JSON config → 19 files out. 20 manual species additions validate the pipeline for all species types. Target: dedicated refactor cycle at C249, before C250-251 regional forms. Biggest velocity bottleneck — every future species cycle drops from 100+ edits to 1 config. | pending |
| 227→234 | **Palette recolor helper**: CLI tool (reads .pal + color mapping JSON → recolored output). Not blocking — Sprite Designer handles palette creation. | pending |
| 244 | **Rival R119 Stantler_Hoenn Lv25 gap**: All 6 Brendan/May R119 variants have Stantler_Hoenn at Lv25 while other party members are Lv28-31. Replaced mons were Lv28. Should be Lv28 for consistency. Quick fix. | done (C245) |
| 245 | Trainer Swap Validator: Extend scripts/check_trainers.sh to validate macro/struct alignment across ALL trainers (ITEM_CUSTOM_MOVES parties must have both held items and 4 moves per mon, NO_ITEM_DEFAULT_MOVES must not have custom moves, etc.). Three consecutive trainer-modification cycles (C244-247) make this a high-value investment. Build it before C246. | pending |
| 246 | Trainer Swap Validator: Extend scripts/check_trainers.sh to validate macro/struct alignment across ALL trainers (ITEM_CUSTOM_MOVES parties must have held items and 4 moves, NO_ITEM_DEFAULT_MOVES must not have custom moves, etc.). Four consecutive trainer-modification cycles (C244-247) plus upcoming Magma/Aqua work (C248-249) make this high-value. Build before C248. | pending |
| 247 | Config-driven species generator (flagged since C217, 8 times total): Replace the 19-file manual pipeline with JSON config → 19 files out. Target: dedicated refactor cycle at C249, before C250-251 regional forms. Every future species cycle drops from 100+ edits to 1 config file. | pending |
| 248 | Config-driven species generator (flagged 8 times since C217): Replace the 19-file manual pipeline with JSON config input. Target C250 — right before the two regional form cycles (C250-251 on roadmap, would shift to C251-252). Build the generator and validate it against an existing species as a round-trip check, then use it for the first new form immediately. Every future species cycle drops from 100+ edits to 1 config file. | pending |
