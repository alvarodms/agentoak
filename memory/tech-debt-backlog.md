# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming convention (FLAG_QUEST_{name}_{STAGE}), validation script, documented 3-state flag recipe template. | pending |
| 213-224 | **Evolution consistency validator** (check_evolution_consistency.sh): Verify every SPECIES_* in evolution.h exists in species.h, catch orphaned entries, validate branching evo consistency (Snorunt→Glalie/Froslass gender gate, Girafarig→Farigiraf), flag circular references. Natural complement to check_species_registration.sh. **Deferred 11 cycles.** Target: C225. | pending — overdue |
| 217 | **Pipeline rewrite**: Replace add_regional_form.cjs with config-driven generator. Five cycles of pipeline breakage (C195-C216). Gap-filler (C222) partially addresses this. | pending |
| 218-219 | Species registration verification script (check_species_registration.sh) | **done (C220)** |
| 221-222 | complete_species_registration.cjs gap-filler tool | **done (C222)** |
