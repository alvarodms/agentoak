# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming convention (FLAG_QUEST_{name}_{STAGE}), validation script, documented 3-state flag recipe template. Not causing active friction — revisit if quest-heavy cycles resume. | pending |
| 213-225 | **Evolution consistency validator** (check_evolution_consistency.sh): Verify every SPECIES_* in evolution.h exists in species.h, catch orphaned entries, validate branching evo consistency. | **done (C225)** |
| 217 | **Pipeline rewrite**: Replace add_regional_form.cjs with config-driven generator. Gap-filler (C222) partially addresses this. | pending |
| 218-220 | Species registration verification script (check_species_registration.sh) | **done (C220)** |
| 221-222 | complete_species_registration.cjs gap-filler tool | **done (C222)** |
| 225 | **check_all Make target**: Unified `make check_all` runs all validators (check_species, check_encounters, check_e4_rematches, check_evolution). | **done (C225)** |
