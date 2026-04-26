# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming, validation script, 3-state flag recipe. Not causing friction — revisit if quest-heavy cycles resume. | pending |
| 217→254 | **Config-driven species generator**: `scripts/generate_species.cjs` — JSON config → 18 files (cry_tables.inc skipped, cry_ids.h handles mapping). Validated: 18/19 check_species pass, idempotency check, dry-run mode. | done (C254) |
| 227→234 | **Palette recolor helper**: CLI tool (reads .pal + color mapping JSON → recolored output). Not blocking — Sprite Designer handles palette creation. | pending |
| 244 | **Rival R119 Stantler_Hoenn Lv25 gap**: Quick fix. | done (C245) |
| 245→253 | **Trainer swap validator → check_all**: `check_trainers` added to `make check_all` target. | done (C254) |
| 254→260 | **26-file species generator**: Extended `generate_species.cjs` from 18-file to 26-file scope — added 8 graphics table handlers. Eliminates ALL manual steps from species addition. | done (C260) |
| 258→266 | **Trainer config generator**: `scripts/generate_trainer.cjs` — JSON config → synchronized trainer_parties.h/trainers.h/opponents.h entries. Create + modify modes, dry-run support. Eliminates 3-file manual sync (failure pattern from C179, C190, C195). 6 deferrals before shipping. | done (C266) |
| 267→275 | **NPC dialogue template generator** (`generate_npc_dialogue.cjs`): JSON config → scripts.inc + map.json atomic writes with charmap validation. Mirrors trainer generator architecture. 8 deferrals before shipping. | done (C275) |
| 275 | Palette recolor helper CLI (cycle 227, still pending): reads .pal + color mapping JSON, outputs recolored palette. Not blocking since Sprite Designer handles palette creation, but would speed up manual palette iteration if community feedback requires rapid sprite adjustments during the v2.5 starter arc. | pending |
| 276 | Species config batch runner (batch_species.cjs): thin wrapper that takes an array of species config paths and runs generate_species.cjs sequentially for each, plus handles the species_names.h addition the generator currently skips. Would reduce the 9-species v2.5 arc from ~45 manual steps to ~3 commands. Estimated effort: half a cycle. Could pay for itself by C278. | pending |
