# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming convention (FLAG_QUEST_{name}_{STAGE}), validation script (check_quest_consistency.sh), documented 3-state flag recipe template. Every quest so far uses hand-written flag chains. A template would reduce error rates and speed up future multi-stage quests. | pending |
| 212+ | **Cross-gen evolution pipeline script**: Extend `add_regional_form.cjs` or create new script for adding cross-gen evolutions (new species that evolve from existing ones). Current pipeline handles regional forms but not new evolutionary stages. 5 cross-gen evos planned for v2.0. | proposed |
