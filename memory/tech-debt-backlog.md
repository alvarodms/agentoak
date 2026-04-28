# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| C211-275 | **Completed tooling**: Quest scaffolding (C211, not needed), config-driven species generator 27-file (C217→C281), palette recolor helper (C227, not blocking), trainer config generator (C258→C266), NPC dialogue template generator (C267→C275), species_names.h integration (C278→C281). | done |
| 275 | Palette recolor helper CLI (cycle 227, still pending): reads .pal + color mapping JSON, outputs recolored palette. Not blocking since Sprite Designer handles palette creation, but would speed up manual palette iteration if community feedback requires rapid sprite adjustments. | pending |
| 282 | **Trainer capacity audit (COMPLETE)**: TRAINERS_COUNT = 891, MAX = 891. Only **2 confirmed reclaimable IDs**: TRAINER_GRUNT_UNUSED (568), TRAINER_MAY_PLACEHOLDER (853). Previous "12 reclaimable" estimate was inaccurate. **Not blocking for v2.6** — Reckoning NPCs are dialogue-only (no trainer IDs needed). If a future arc needs trainers, must either reuse these 2 IDs or bump TRAINERS_COUNT (requires expanding flag range past 0x874). | done |
| 283-287 | **NPC dialogue --update mode**: In-place dialogue replacement for existing scripts. Deferred C283-C286, **SHIPPED C287**. | done |
| 285-287 | **Species verification script** (`verify_species.sh`): Post-generation check across all 27 target files. Deferred C285-C286, **SHIPPED C287**. Immediately revealed Changed Three registration gaps. | done |
| 287 | Add a `make check_all_quick` Makefile target that runs only the cheap validators (check_scripts, check_species, check_trainers) in parallel, skipping slower encounter/evolution checks. Current `make check_all` is slow enough that developers skip it; a fast-path would encourage running validation after every edit. ~15 minutes to implement. | pending |
| 288 | `make check_all_quick` — a parallel Makefile target running only cheap validators (check_scripts, check_species, check_trainers), skipping slower checks. Current `make check_all` is slow enough that it gets skipped; a fast-path would encourage running validation after every edit. ~15 minutes to implement. Pending since C287 — registration-heavy cycles like C288-289 would benefit most. | pending |
| 289 | Ship `make check_all_quick` — a parallel Makefile target running only cheap validators (check_scripts, check_species, check_trainers), skipping slower encounter/evolution checks. Pending since C287 (3 cycles). Registration-heavy cycles like the upcoming C290 (Treecko/Torchic) would benefit most. ~15 minutes to implement. | pending |
