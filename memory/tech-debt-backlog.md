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
| 287-290 | `make check_all_quick` — a parallel Makefile target running only cheap validators (check_scripts, check_species, check_trainers). **SHIPPED C290.** | done |
| 290-297 | **Battle animation templates**: Moves 378-380 (Iron Leaf, Spore Fist, Tidal Flare). Custom animations recomposing existing sprite/task references. **SHIPPED C297.** | done |
| 292 | Generator --force flag: Patch generate_species.cjs to accept --force that deletes partial entries before regenerating. ~20-line change. Only needed if registration work recurs. | pending |
| 295-300 | **JSON trainer config extraction**: Move trainer_parties.h data into JSON consumed by generate_trainer.cjs. Eliminates recurring macro/struct mismatch failures (C179, C190, C195). Deferred 6 consecutive cycles. **SCHEDULED C302 — v2.9 opener.** Scope: modified trainers only (~30), not all 891. | scheduled C302 |
| 301 | **Changed Three learnset compilation gap (CRITICAL)**: ALL 9 Changed Three species missing from both level_up_learnsets.h AND level_up_learnset_pointers.h despite having full movesets in JSON configs. Player-raised starters learn ZERO moves by level up. Fix in C302 as P0 before trainer refactor. | pending — P0 |
