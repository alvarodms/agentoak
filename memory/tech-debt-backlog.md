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
| 290 | Battle animation scripts for custom moves — currently all moves 355+ use the generic Move_COUNT fallback animation (double slap + impact). Once signature moves are shipping regularly, investing in 2-3 reusable animation templates (ice punch effect, water blast effect, steel slash effect) would make each new signature move feel visually distinct. ~1 cycle of animation scripting work. Not blocking — the fallback works — but would elevate presentation. | pending |
