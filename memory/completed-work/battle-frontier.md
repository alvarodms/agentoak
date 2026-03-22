# Battle Frontier Modifications

| File | Cycle | Changes |
|------|-------|---------|
| `src/battle_arena.c` | 78 | Added Fairy move Mind ratings (Moonblast, Play Rough, Dazzling Gleam = +1) |
| `include/constants/battle_frontier_mons.h` | 78 | Added 12 constants (FRONTIER_MON_LUCARIO_1-4, WEAVILE_1-4, GARCHOMP_1-4), NUM_FRONTIER_MONS 882→894 |
| `src/data/battle_frontier/battle_frontier_mons.h` | 78 | Added 12 Frontier mon entries (4 sets each for Lucario, Weavile, Garchomp) — indices 882-893, open-level only |

**Note (Cycle 78):** Factory style arrays (`battle_factory.c`) intentionally NOT modified — Fairy moves are standard attacking moves and don't belong in any style category (confirmed by Gameplay Designer analysis). Cycle 77 incorrectly added them to HighRiskHighReturn.
