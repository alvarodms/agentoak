# Move Category Icons: Implementation Approaches for pokeemerald

**Cycle**: 75 | **Date**: March 2026

---

## Key Findings

### Implementation Approaches (Ranked by Feasibility)

1. **Port from pokeemerald-expansion (RHH)** — Most complete. The expansion has configurable P/S/Status icons in both battle UI and summary screen. Porting the relevant rendering code is the community-recommended approach for base pokeemerald projects.
2. **pret wiki tutorial** — Covers the split itself but NOT the icons. Summary screen icons require additional work.
3. **pokeemerald-physpe (Kateulator)** — Minimal split-only repo, no icon rendering.

### What Needs to Change (Estimated)
- **Graphics**: 3 small icon sprites (physical fist, special rings, status star) — ~16x16 or 12x12 px each
- **Summary screen**: `pokemon_summary_screen.c` — render icon next to each move's type
- **Battle UI** (optional): Show category on move selection screen during battle
- **Data**: Each move already has `split` field from Cycle 43's P/S split — icons just need to READ this

### Community Expectation
Every competitive-oriented Emerald hack (Radical Red, Inclement Emerald, Emerald Imperium) shows these icons. For a hack with P/S split, lacking icons is considered a UX oversight, not a missing feature.

### PokéCommunity Thread (Jan 2025)
A user confirmed that adding icons to the summary screen specifically requires porting rendering code from the expansion — there's no standalone tutorial for base pokeemerald.

## Sources
- [pret wiki - Add Physical Special Split](https://github.com/pret/pokeemerald/wiki/add-physical-special-split)
- [PokéCommunity - Summary screen icons thread](https://www.pokecommunity.com/threads/pokeemerald-how-to-put-physical-special-status-move-icons-in-the-summary.534209/)
- [pokeemerald-expansion (RHH)](https://github.com/rh-hideout/pokeemerald-expansion)
