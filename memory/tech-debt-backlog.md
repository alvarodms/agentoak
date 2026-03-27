# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. Catches #1 recurring build failure class. ~15 min to implement. | pending |
| 106 | Trainer data consolidation: 3-file system (opponents.h + trainers.h + trainer_parties.h) → unified format. Highest-friction edit pattern across 20+ cycles. Would pay off if v5.0 adds trainers. | pending |
| 107 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for smart quotes, missing $ terminators, lines >35 chars. Catches #1 recurring build failure class (4 incidents). ~15 min to implement. Pending since Cycle 104 — now 3 cycles deferred. Should be picked up in the next content cycle that touches dialogue (likely Cycle 112 NPC sightings). | pending |
| 108 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep .inc files for smart quotes, missing $ terminators, lines >35 chars. Catches #1 recurring build failure class (4 incidents). ~15 min to implement. Deferred since Cycle 104 — now 4 cycles. Natural home is Cycle 112 when NPC sighting dialogue is written. Do not defer past Cycle 112. | pending |
| 109 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep .inc files for smart quotes, missing $ terminators, lines >35 chars. Deferred since Cycle 104 — now 5 cycles. MUST ship with Cycle 111-112 when NPC sighting dialogue is written. Do not defer past Cycle 112. | pending |
