# Migration Tracker Quest Design: Collection Quest Best Practices

**Cycle**: 96 | **Date**: March 2026

---

## Key Design Principles for Pokédex-Check Quests

### What Works
1. **Non-linear stage progression** — Unbound's mission system lets players tackle objectives in any order. LoH's "catch any 5 of 10" structure already does this well.
2. **Quest-gated meaningful rewards** — Unbound locks Mega Evolution behind a quest. Rewards should feel proportional to effort. Rare Candy ×3 for Stage 1 feels appropriate; Master Ball for Stage 3 is a strong capstone.
3. **Narrative framing transforms collection into story** — Gaia's Professor Redwood ties research to seismic activity (exactly like our Cave of Origin energy readings). The quest should feel like contributing to Birch's research, not a shopping list.
4. **Reuse existing infrastructure** — Axiom and Gaia embed professor quests in existing labs/locations. LoH's plan to use Birch Lab with existing flag infrastructure is ideal.

### Pitfalls to Avoid
- **Don't require species the player may have missed permanently** — All 10 Stage 1 species and all Stage 2/3 species must remain catchable postgame. Verify encounter tables.
- **Unclear progress tracking** — Without a quest log UI, Birch's dialogue must clearly state what's needed and what's already done. Have him say "You've catalogued 3 of the 5 pioneers I need" rather than just repeating the full list.
- **Anticlimactic final dialogue** — The Stage 3 completion should have a lore payoff about the migration's cause, not just "here's your item."

### Reward Calibration
- Stage 1 (5 common migrants): Rare Candy ×3 — good, accessible reward
- Stage 2 (3 apex predators): PP Max ×2 — functional but underwhelming; consider adding a unique held item or lore text
- Stage 3 (3 habitat specialists): Master Ball — strong capstone, standard for endgame quests
