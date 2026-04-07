# Ocean Route Differentiation — Water Encounter Design

**Cycle**: 168 | **Date**: April 2026

---

## The "Too Much Water" Problem

Hoenn's water routes (R105-109, R122, R124-134) are the #1 player complaint in vanilla Emerald. IGN's "7.8/10 too much water" became a meme, but the real issue is **encounter monotony** — every water route has identical Tentacool/Wingull/Pelipper tables.

## What Good Hacks Do

### Inclement Emerald
- 476 species across 78 locations — spreads Water types across many routes with distinct distributions
- Uses dual-type Water species (Lanturn, Sharpedo, Corsola) to create varied combat encounters
- Each route cluster has different available species, so Nuzlocke players get variety

### General Best Practices from ROM Hack Community
- **Themed clusters**: Group adjacent water routes by biome (coastal shallows, deep ocean, volcanic waters, arctic approach)
- **Fishing as reward layer**: Old Rod = common (Magikarp/Tentacool), Good Rod = uncommon (Horsea, Corphish), Super Rod = rare finds (Staryu, Relicanth, Dratini)
- **1-2 unique species per route**: Even if most slots overlap, having 1 exclusive species makes each route worth visiting
- **Dual-type distribution**: Water/Electric (Chinchou→Lanturn), Water/Rock (Corsola), Water/Poison (Qwilfish), Water/Flying (Mantine) create different battle experiences despite all being "water routes"

## Gen 3 Water Type Pool (Available for Distribution)

Key dual-type species to distribute across ocean routes:
- Chinchou/Lanturn (Water/Electric, 330/460 BST)
- Corsola (Water/Rock, 380 BST)
- Mantine (Water/Flying, 465 BST)
- Qwilfish (Water/Poison, 430 BST)
- Horsea/Seadra (pure Water, evolves to Kingdra)
- Staryu/Starmie (Water → Water/Psychic)
- Shellder/Cloyster (Water → Water/Ice)
- Seel/Dewgong (Water → Water/Ice)
- Slowpoke/Slowbro (Water/Psychic)
- Psyduck/Golduck (pure Water)
- Carvanha/Sharpedo (Water/Dark)
- Wailmer/Wailord (pure Water)
- Relicanth (Water/Rock)
- Luvdisc (pure Water)

## Key Insight

The v1.4 design doc already has good outline specs (R105-R131). The implementation challenge is the **sheer volume** — 20+ tables including surf, Old Rod, Good Rod, and Super Rod for each route. The fishing tables are where most of the differentiation opportunity lies, since surf tables have fewer slots.
