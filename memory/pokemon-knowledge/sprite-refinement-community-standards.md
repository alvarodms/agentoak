# Sprite Refinement — Community Standards & Patterns

**Cycle**: 258 | **Date**: April 2026

---

## Key Findings

### Emerald ReSprited (2024)
- 130 artists collaborated to redraw all 386 GBA sprites for Emerald's 20th anniversary
- Community reaction was mixed: inconsistency between artists' styles was both praised ("that's the point") and criticized ("initially bothersome")
- Takeaway: **consistency across sprites matters more than individual quality** for hack cohesion. A single art pipeline (like our Sprite Designer) avoids this pitfall entirely.

### GBA Sprite Quality Bar (2025-2026)
- Top hacks (Unbound, Radical Red, Inclement Emerald) now feature sprites that rival official quality
- Community expects sprites to use official Ken Sugimori color palettes as reference
- Game Freak's GBA artists prioritized: clear silhouettes, distinguishable features, colored shading over dithering, moderate white highlights, rare black dithering
- **Proportioning is key**: small Pokémon drawn too large lose detail; large/bulky Pokémon drawn too small look thin

### 15-Color Hard Constraint
- 16 palette entries, first must be transparent = 15 usable colors
- Top spriters emphasize color accuracy first, then expressiveness within that budget
- Regional forms that just recolor without adjusting shading/silhouette read as "recolors" not "forms"

### Community Feedback Patterns
- Players who provide reference Pokémon (e.g., "Vaporeon tail") give the most actionable feedback
- "Bulkier" typically means: fill more of the 64x64 canvas, thicker limbs/body proportions, stronger outline weight
- Dual-type balance reads from accent colors more than body color (confirmed by our own #149 experience)

### Evolution Line Consistency (C258 update)
- **Dustborn Variants** (Pokemon Colosseum hack) implements 73 regional variants across 57 evolutionary lines — community expects evo lines to carry the form identity through, not stop at base stage
- **AlteRed** has 411 all-original Alter Forms — at this scale, broken evo lines are immediately noticed and criticized
- **Emerald Imperium** (new 2026 Hoenn hack) is adding custom regional forms — LoH's 25-species head start and community feedback loop are differentiators, but only if evo lines are complete
- **Risk pattern**: hacks that ship base forms without evolutions create a "demo feel" — players assume content is unfinished. Shipping Lotad_Hoenn and Shroomish_Hoenn without their evo lines is acceptable short-term but should not persist beyond 3-4 cycles.
