# Battle Frontier Moveset Optimization After P/S Split

**Cycle**: 77 | **Date**: March 2026

---

## How Top Hacks Handle Frontier + P/S Split

### Pokémon Modern Emerald (v3.3.1)
- Maintains **two versions** of Frontier Pokémon: one adjusted for P/S split, one vanilla. WIP feature.
- Added 15 Gen IV moves to fill Physical/Special gaps per type (e.g., Dark Pulse for special Dark).
- P/S split is optional via options menu.

### HGSS Competitive Battle Factory Hack
- Replaced all 950+ sets with Smogon-inspired competitive sets.
- **Tiered by round**: 120 sets per round, escalating from 1st-stage mons to legendaries.
- Key insight: players got bored of knowing vanilla sets — competitive replacements made every fight tense.

### Emerald Battle Revolution
- Randomized set generator with stat-based optimization: EVs invested in highest base stats first, nature matched.
- "Filtered" mode removes moves that don't match the mon's stats (e.g., no special moves on physical attackers).
- "Ranked" mode picks stronger moves first, accounting for STAB and abilities.

### Frontier Adventure
- Curated roster (~210 mons) based on Smogon tiers — cut weak fully evolved mons like Ledian.
- Factory AI made "as smart as any other trainer" from round 1.
- Fixed specific moveset bugs (e.g., Mienshao's Fling replaced with U-Turn).

## Key Takeaways for LoH

1. **Quick fixes first**: Arena Mind ratings + Factory styles for Fairy moves are trivial and universally expected.
2. **Stat-based audit**: For the 882 Frontier mons, prioritize by visibility — Tower/Factory sets are seen most. Flag mons where nature/EVs contradict the new move category (e.g., Modest Alakazam with now-Physical Punch moves).
3. **Don't rewrite all 882**: Focus on the ~160 entries with category-swapped moves. Most entries are fine.
4. **Adding new species**: 3-4 competitive sets per new species (Lucario, Weavile, Garchomp) at different power tiers, matching the existing Frontier tier structure.
