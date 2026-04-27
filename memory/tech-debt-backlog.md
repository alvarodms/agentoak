# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| C211-275 | **Completed tooling**: Quest scaffolding (C211, not needed), config-driven species generator 27-file (C217→C281), palette recolor helper (C227, not blocking), trainer config generator (C258→C266), NPC dialogue template generator (C267→C275), species_names.h integration (C278→C281). | done |
| 275 | Palette recolor helper CLI (cycle 227, still pending): reads .pal + color mapping JSON, outputs recolored palette. Not blocking since Sprite Designer handles palette creation, but would speed up manual palette iteration if community feedback requires rapid sprite adjustments. | pending |
| 282 | **Trainer capacity audit (COMPLETE)**: TRAINERS_COUNT = 891, MAX = 891. Only **2 confirmed reclaimable IDs**: TRAINER_GRUNT_UNUSED (568), TRAINER_MAY_PLACEHOLDER (853). Previous "12 reclaimable" estimate was inaccurate. **Not blocking for v2.6** — Reckoning NPCs are dialogue-only (no trainer IDs needed). If a future arc needs trainers, must either reuse these 2 IDs or bump TRAINERS_COUNT (requires expanding flag range past 0x874). | done |
| 283 | Add --update mode to generate_npc_dialogue.cjs for in-place dialogue rewrites: takes a script label + new text, validates charmap compliance, writes to file. Would cut dialogue-update operations from ~15 manual actions to 3. Every future trainer narrative pass touches dialogue — this compounds across all content cycles. | pending |
| 284 | Add --update mode to generate_npc_dialogue.cjs for in-place dialogue rewrites: takes a script label + new text, validates charmap compliance, writes to file. Would cut dialogue-update operations from ~15 manual actions to 3. This cycle's Mt. Chimney update and C285's Aqua NPCs (which also update existing scripts) would both benefit. Deferred since C283 — should not slip past C286. | pending |
