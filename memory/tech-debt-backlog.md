# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104–112 | Dialogue integrity checker script (scripts/check_dialogue.sh) | done (C112) |
| 106–118 | Trainer data validation script (scripts/check_trainers.sh) | done (C118) |
| 118–127 | Trainer validation Make target (`make check_trainers`) | done (C127) |
| 126–127 | ASCII validation guard in Makefile | done (C127) |
| 129–133 | Move constant validator script — window passed, inline grep sufficed | dropped (C133) |
| 139–141 | Script dialogue linting Make target (`make check_scripts`) | done (C141) |
| 142–145 | Automated flag-chain validator (`make check_flags`) | done (C145) |
| 115–156 | **Legendary Encounter Template** (`data/scripts/legend_macros.inc`): Extract parameterized macros from 4 shipped encounters. Reduces future legendaries from ~80 to ~20 lines. | deferred — not blocking v1.3 |
| 147–157 | **Trainer ID Audit** (`scripts/find_unused_trainers.sh`): Cross-reference opponents.h, trainers.h, rematch tables, map scripts. TRAINERS_COUNT=885/885, only 2 known reclaimable IDs (#568, #853). | deferred — not blocking v1.3 |
| 121 | CheckMultipleFlags script macro: reusable macro for N-flag checks. Marginal benefit until patterns exceed 3 flags. | deferred |
| 152–157 | **Scripted Event Macro Library** (`data/scripts/migration_event_macros.inc`): Extract reusable macros from 4 migration events (C149/C152/C153/C154). Common pattern: coord_event + flag gate + cry + atmospheric effects + NPC dialogue + setwildbattle + one-shot flag. Would reduce future events from ~60 to ~15 lines. | deferred — not blocking v1.3 |
| 158 | Scripted Event Macro Library (deferred since C152): Four migration events share identical coord_event → flag gate → cry → atmosphere → dialogue → setwildbattle → one-shot flag pattern. Extracting into a parameterized macro reduces each future event from ~60 lines to ~15. Weather Omens in C159-C160 will add more scripted encounters — natural time to build this. | pending |
| 159 | Scripted Event Macro Library (deferred since C152, now C159): 8+ map script files now use identical flag-gated OnTransition weather/event hooks. A reusable macro library (`data/scripts/event_macros.inc`) with templates like `EventGate_Badge(flag, script)` would reduce each weather omen from ~6 lines to ~2 and eliminate copy-paste errors. Weather Omens I (C159) and II (C160) add 4 more instances of this pattern. Consider building after v1.3 content ships. | pending |
