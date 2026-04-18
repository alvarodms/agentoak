---
topic: Toxic Touch Custom Ability — Implementation Scope
source: pokeemerald battle_util.c analysis + PokéCommunity threads
date: 2026-04-18
---

## Key Finding

Toxic Touch is functionally a reskinned Poison Point. The vanilla pokeemerald battle engine already handles contact-triggered status abilities via the `ABILITYEFFECT_CONTACT` case in `AbilityBattleEffects()` in `battle_util.c`. Poison Point, Static, Flame Body, and Cute Charm all use this path.

## Implementation Scope (~5 files)

1. `include/constants/abilities.h` — new ABILITY_TOXIC_TOUCH constant
2. `src/data/text/abilities.h` — ability name + description strings
3. `src/battle_util.c` — add case to ABILITYEFFECT_CONTACT (defender-trigger variant)
4. `src/pokemon.c` or species_info — assign ability to Deoxys_Hoenn
5. `src/data/battle_ai_scripts.s` — AI awareness (optional but recommended)

## Design Variants

1. **Defensive Poison Point clone** (higher proc rate or badly-poison) — simplest, ~1 cycle
2. **Offensive contact poisoner** (Gen 5 Poison Touch style — poisons when user attacks) — needs post-move hooks, moderately harder
3. **Badly-poison variant** — most impactful, needs balancing at 680 BST

## Deoxys Form Note

PokéCommunity confirms: treating custom Deoxys form as a separate species entry (same dex number, different internal ID) has fewer bugs than dynamic form-change. Validates the existing regional form pipeline approach — slot 431+, not form-change.
