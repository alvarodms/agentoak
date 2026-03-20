# Battle Frontier Compatibility & Early Route Trainer Design

**Cycle**: 56 | **Date**: March 2026

---

## Battle Frontier + P/S Split + Fairy Type Risks

PokéCommunity threads document known issues when combining Fairy type and P/S split in vanilla pokeemerald:
- Graphical errors after adding P/S split move icons alongside Fairy type
- Pokémon Modern Emerald explicitly notes Fairy + P/S split implemented but acknowledges type coverage gaps (Dark special, Fairy moves limited)
- Emulator compatibility issues with decomp hacks (mGBA recommended, others may crash)

**Key risk for LoH**: Battle Frontier generates random teams. If Frontier code doesn't account for Fairy type or P/S split move categories, it could produce broken or nonsensical teams. Pokémon Unbound ships a separate Battle Frontier variant — suggesting the Frontier needs dedicated attention.

## Early Route Trainer Design Patterns (2025-2026)

- **Emerald Azure**: All trainers EV-trained with smart AI, but early zones intentionally below level cap to ease players in
- **Emerald Imperium**: 100+ custom boss fights including route mini-bosses — early routes designed as tutorials for the enhanced difficulty
- **Emerald++**: Dynamic trainer levels using weighted party average — biases toward higher-level mons
- **Community consensus**: Early routes should teach mechanics, not overwhelm. Best hacks use early trainers to introduce new type matchups and mechanics gradually

## Implications for LoH

Routes 101-109 are the player's first impression. If they still run vanilla teams while Routes 110-120 showcase migration species and P/S split, the difficulty jump will feel jarring. Smoothing the early game is high-value for first-time players.
