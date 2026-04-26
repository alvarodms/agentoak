# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| C211-275 | **Completed tooling**: Quest scaffolding (C211, not needed), config-driven species generator 27-file (C217→C281), palette recolor helper (C227, not blocking), trainer config generator (C258→C266), NPC dialogue template generator (C267→C275), species_names.h integration (C278→C281). | done |
| 275 | Palette recolor helper CLI (cycle 227, still pending): reads .pal + color mapping JSON, outputs recolored palette. Not blocking since Sprite Designer handles palette creation, but would speed up manual palette iteration if community feedback requires rapid sprite adjustments. | pending |
| 281 | Trainer capacity audit — current ceiling is 891/891 with 12 reclaimable IDs. Before any trainer-heavy content arc (villain NPCs, new postgame trainers), audit whether more IDs can be reclaimed or TRAINERS_COUNT bumped. | pending |
