# Battle Frontier Modifications

| File | Cycle | Changes |
|------|-------|---------|
| `src/battle_arena.c` | 78 | Added Fairy move Mind ratings (Moonblast, Play Rough, Dazzling Gleam = +1) |
| `include/constants/battle_frontier_mons.h` | 78 | Added 12 constants (FRONTIER_MON_LUCARIO_1-4, WEAVILE_1-4, GARCHOMP_1-4), NUM_FRONTIER_MONS 882→894 |
| `src/data/battle_frontier/battle_frontier_mons.h` | 78, 80, 85 | Added 12 Frontier mon entries. P/S split audit: 90 sets fixed across Cycles 80+85 (punch moves, Crunch, Shadow Ball, Hyper Beam redistributed to match physical/special categories; EVs/natures corrected). See git history for per-set details. |

**Note (Cycle 78):** Factory style arrays (`battle_factory.c`) intentionally NOT modified — Fairy moves are standard attacking moves and don't belong in any style category.

**Also fixed (Cycle 85 build prerequisite):**
- Created `graphics/types/fairy.png`, `physical.png`, `special.png`, `status.png` (placeholder type icons)
- Created 6 cry WAV placeholders for new species (Lucario, Weavile, Riolu, Gible, Gabite, Garchomp)
