# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming convention (FLAG_QUEST_{name}_{STAGE}), validation script (check_quest_consistency.sh), documented 3-state flag recipe template. Every quest so far uses hand-written flag chains. A template would reduce error rates and speed up future multi-stage quests. | pending |
| 212+ | **Cross-gen evolution pipeline script**: Extend `add_regional_form.cjs` or create new script for adding cross-gen evolutions (new species that evolve from existing ones). Current pipeline handles regional forms but not new evolutionary stages. 5 cross-gen evos planned for v2.0. | proposed |
| 212 | Cross-gen evolution pipeline reusability assessment: After C212 attempts to use `add_regional_form.cjs` for cross-gen evos, evaluate whether a dedicated `add_cross_gen_evo.cjs` script (or script extension) would save meaningful time on C213-C214's remaining 3 species. If the existing script needed >10 manual fixup edits, building the dedicated script is justified. Track in tech-debt backlog. | pending |
| 213 | Evolution consistency validation script (check_evolution_consistency.sh): Verify every SPECIES_* in evolution.h exists in species.h, no orphaned entries, no circular references. Increasingly valuable now that branching evolutions (Snorunt → Glalie/Froslass) add complexity. Estimated 15 actions, pays off every species addition. Recommend building after C214 when all cross-gen evos are in. | pending |
