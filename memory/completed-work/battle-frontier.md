# Battle Frontier Modifications

| File | Cycle | Changes |
|------|-------|---------|
| `src/battle_arena.c` | 77 | Added Fairy move Mind ratings (Moonblast, Play Rough, Dazzling Gleam = +1) |
| `src/battle_factory.c` | 77 | Added 3 Fairy moves to sMoves_HighRiskHighReturn array |
| `include/constants/battle_frontier_mons.h` | 77 | Added 12 constants (FRONTIER_MON_LUCARIO_1-4, WEAVILE_1-4, GARCHOMP_1-4), NUM_FRONTIER_MONS 882→894 |
| `src/data/battle_frontier/battle_frontier_mons.h` | 77 | Added 12 Frontier mon entries (4 sets each for Lucario, Weavile, Garchomp) — indices 882-893, open-level only (above FRONTIER_MONS_HIGH_TIER 849) |
