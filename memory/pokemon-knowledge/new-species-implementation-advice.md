# New Species Implementation: Riolu/Lucario — Practical Advice

**Cycle**: 60 | **Date**: March 2026

---

## Riolu/Lucario Stats (Gen 4 Canonical)

| Species | HP | Atk | Def | SpA | SpD | Spe | BST | Types |
|---------|-----|-----|-----|-----|-----|-----|-----|-------|
| Riolu | 40 | 70 | 40 | 35 | 40 | 60 | 285 | Fighting |
| Lucario | 70 | 110 | 70 | 115 | 70 | 90 | 525 | Fighting/Steel |

## Evolution Method

Riolu → Lucario via **Friendship** (EVO_FRIENDSHIP). Gen 4 canonical is friendship + daytime, but Gen 3 lacks time-of-day. Use `EVO_FRIENDSHIP` (no time restriction) for simplicity.

## Learnset Design for Gen 3 Move Pool

Key moves Lucario should learn (all exist in Gen 3):
- **Level-up**: Quick Attack, Metal Claw, Counter, Force Palm (doesn't exist in Gen 3 → substitute Brick Break or Cross Chop), Swords Dance, Close Combat (doesn't exist → Sky Uppercut as placeholder), Extreme Speed
- **TMs**: Earthquake, Brick Break, Bulk Up, Calm Mind, Iron Tail, Psychic, Shadow Ball, Rock Tomb, Return, Toxic, Protect, Rest
- **Tutor**: Ice Punch, Thunder Punch (if move tutors available)

**Missing Gen 4 moves**: Aura Sphere, Close Combat, Force Palm, Dragon Pulse (as move). Consider adding Aura Sphere as a custom move in a future cycle — it's Lucario's signature.

## Common Build Pitfalls (from community reports)

1. **Cry file format**: Must be proper 8-bit PCM mono. Safest to copy existing cry as placeholder.
2. **Cry table position**: MUST match species ID order exactly — insert after Chimecho, before EGG shift.
3. **Sprite palette**: 14 colors max, indexed mode, transparency as first palette entry.
4. **NUM_SPECIES**: Auto-updates via SPECIES_EGG, but verify.
5. **Pokédex sort orders**: Hardcoded alphabetical/height/weight — must manually insert.
6. **Build cache**: Delete .4bpp/.gbapal intermediates if sprites look wrong.

## Abilities

Gen 3 doesn't have Steadfast or Inner Focus as meaningful. Inner Focus (prevents flinch) exists in Gen 3. Steadfast (Speed boost on flinch) does NOT exist — use Inner Focus for both slots, or pair with a vanilla ability like Guts for gameplay interest.

Sources:
- pret wiki tutorial: https://github.com/pret/pokeemerald/wiki/How-to-add-a-new-Pok%C3%A9mon-species
- PokéCommunity cry issues thread: https://www.pokecommunity.com/threads/pokeemerald-issues-adding-custom-cries.500049/
