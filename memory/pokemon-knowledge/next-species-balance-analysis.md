# Next Species Balance Analysis: Gible Line vs Weavile

**Cycle**: 61 | **Date**: March 2026

---

## Gible/Gabite/Garchomp — 3-Stage Family

| Species | HP | Atk | Def | SpA | SpD | Spe | BST | Types |
|---------|-----|-----|-----|-----|-----|-----|-----|-------|
| Gible | 58 | 70 | 45 | 40 | 45 | 42 | 300 | Dragon/Ground |
| Gabite | 68 | 90 | 65 | 50 | 55 | 82 | 410 | Dragon/Ground |
| Garchomp | 108 | 130 | 95 | 80 | 85 | 102 | 600 | Dragon/Ground |

**Balance concern**: Garchomp is 600 BST (pseudo-legendary, Uber tier in Gen 4). The hack already has 3 pseudo-legendary starters (Larvitar/Bagon/Dratini). Adding Garchomp as a wild encounter gives the player a 4th pseudo-legendary — potentially overpowered.

**Mitigations**: Low encounter rate (5% in Victory Road B2F per strategy notes), late-game availability, and Gen 3 movepool limitations (no Dragon Rush, no Outrage by level-up in Gen 3 context). Earthquake + STAB Dragon is still devastating.

**Implementation scope**: 3 species = ~42 source files + ~21 asset files. Significantly more work than Riolu/Lucario (2 species).

## Weavile — Single Species (Sneasel Already Exists)

| Species | HP | Atk | Def | SpA | SpD | Spe | BST |
|---------|-----|-----|-----|-----|-----|-----|-----|
| Sneasel (Gen 3) | 55 | 95 | 55 | 35 | 75 | 115 | 430 |
| Weavile (Gen 4) | 70 | 120 | 65 | 45 | 85 | 125 | 510 |

**Advantage**: Only 1 new species needed (Sneasel already in Gen 3). ~14 source files + ~7 asset files.

**Challenge**: Needs Razor Claw item (doesn't exist in Gen 3). Options:
1. **Item-use evolution** (like a stone) — simplest, precedent from Legends: Arceus and several ROM hacks
2. **Level-up while holding item** — needs new EVO_ITEM_HOLD method or repurpose existing
3. **Simple level evolution** — least canonical but zero new items needed

**Community precedent**: Emerald++ and Inclement Emerald both add Razor Claw. Emerald Johto Edition uses item-use approach (bag > use Razor Claw on Sneasel).

## Recommendation

Weavile is lower-risk, lower-effort, and better-balanced (510 BST vs 600). Gible line is higher-impact but needs careful balance consideration and 3x the species work.
