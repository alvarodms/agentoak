---
name: Regional Starter Designs
description: Complete species specs for 9 regional Hoenn starter forms (Treecko/Torchic/Mudkip lines) — types, stats, abilities, movesets, TMs, encounter placement
type: reference
---

# Regional Form Starters — Implementation Spec

Species IDs: 439-447. After registration: EGG=448, NUM_SPECIES=448.

## Treecko_Hoenn Line — "Crystal Gecko" (Pure Steel)

**Narrative**: Cosmic energy crystallized plant tissue into living metal. Fast physical sweeper + 11 resistances.
**Abilities (all 3)**: Clear Body / Shed Skin

| Species | ID | Type | HP | Atk | Def | SpA | SpD | Spe | BST | Evo |
|---------|-----|------|-----|-----|-----|-----|-----|-----|-----|-----|
| Treecko_Hoenn | 439 | Steel | 40 | 60 | 45 | 35 | 50 | 80 | 310 | → Lv16 |
| Grovyle_Hoenn | 440 | Steel | 50 | 85 | 60 | 45 | 65 | 100 | 405 | → Lv36 |
| Sceptile_Hoenn | 441 | Steel | 70 | 110 | 85 | 60 | 85 | 120 | 530 | — |

**Treecko_Hoenn moves**: 1 Scratch, 1 Harden, 6 Metal Claw, 11 Quick Attack, 16 Screech, 21 Steel Wing, 26 Agility, 31 Slash, 36 Iron Head, 41 Iron Defense, 46 Meteor Mash
**Grovyle_Hoenn moves**: 1 Scratch, 1 Harden, 1 Metal Claw, 1 Quick Attack, 16 Fury Cutter, 17 Screech, 23 Steel Wing, 29 Iron Head, 35 Agility, 43 Slash, 51 Iron Defense
**Sceptile_Hoenn moves**: 1 Scratch, 1 Metal Claw, 1 Quick Attack, 1 Harden, 16 Fury Cutter, 17 Screech, 23 Steel Wing, 29 Iron Head, 35 Agility, 43 Swords Dance, 51 Iron Defense, 59 Meteor Mash
**Sceptile_Hoenn TMs**: Earthquake, Brick Break, Aerial Ace, Return, Iron Tail, Toxic, Protect, Rock Slide (tutor)

---

## Torchic_Hoenn Line — "Starlight Bird" (Fairy → Fairy/Flying)

**Narrative**: Celestial light replaced inner fire. Graceful special sweeper, Dragon immune.
**Abilities (all 3)**: Cute Charm / Natural Cure
**Note**: Disarming Voice and Draining Kiss NOT in hack. Learnsets adjusted — first Fairy STAB is Dazzling Gleam at Lv16.

| Species | ID | Type | HP | Atk | Def | SpA | SpD | Spe | BST | Evo |
|---------|-----|------|-----|-----|-----|-----|-----|-----|-----|-----|
| Torchic_Hoenn | 442 | Fairy | 45 | 45 | 40 | 75 | 55 | 50 | 310 | → Lv16 |
| Combusken_Hoenn | 443 | Fairy/Flying | 60 | 65 | 55 | 90 | 65 | 70 | 405 | → Lv36 |
| Blaziken_Hoenn | 444 | Fairy/Flying | 80 | 80 | 70 | 120 | 85 | 95 | 530 | — |

**Torchic_Hoenn moves**: 1 Pound, 1 Growl, 7 Sweet Kiss, 10 Charm, 16 Dazzling Gleam, 19 Quick Attack, 25 Moonblast, 34 Play Rough
**Combusken_Hoenn moves**: 1 Pound, 1 Growl, 1 Sweet Kiss, 1 Charm, 16 Wing Attack, 17 Dazzling Gleam, 21 Quick Attack, 28 Aerial Ace, 32 Moonblast, 36 Calm Mind
**Blaziken_Hoenn moves**: 1 Pound, 1 Growl, 1 Sweet Kiss, 1 Charm, 16 Wing Attack, 17 Dazzling Gleam, 21 Quick Attack, 28 Aerial Ace, 32 Moonblast, 36 Calm Mind, 42 Play Rough, 49 Fly
**Blaziken_Hoenn TMs**: Fly (HM02), Thunderbolt, Flamethrower, Shadow Ball, Psychic, Calm Mind, Toxic, Protect

---

## Mudkip_Hoenn Line — "Titan Tadpole" (Fighting → Fighting/Psychic)

**Narrative**: Cosmic energy awakened primal fighting power + psychic discipline. Mixed tank, dual setup.
**Abilities (all 3)**: Guts / Synchronize

| Species | ID | Type | HP | Atk | Def | SpA | SpD | Spe | BST | Evo |
|---------|-----|------|-----|-----|-----|-----|-----|-----|-----|-----|
| Mudkip_Hoenn | 445 | Fighting | 50 | 65 | 45 | 55 | 55 | 40 | 310 | → Lv16 |
| Marshtomp_Hoenn | 446 | Fight/Psychic | 70 | 80 | 65 | 70 | 70 | 50 | 405 | → Lv36 |
| Swampert_Hoenn | 447 | Fight/Psychic | 100 | 100 | 85 | 95 | 95 | 60 | 535 | — |

**Mudkip_Hoenn moves**: 1 Tackle, 1 Leer, 6 Low Kick, 10 Focus Energy, 15 Mach Punch, 19 Brick Break, 24 Bulk Up, 28 Counter, 33 Take Down, 37 Sky Uppercut
**Marshtomp_Hoenn moves**: 1 Tackle, 1 Leer, 1 Low Kick, 1 Focus Energy, 15 Mach Punch, 16 Confusion, 20 Brick Break, 25 Psybeam, 31 Bulk Up, 39 Extrasensory, 46 Counter, 52 Cross Chop
**Swampert_Hoenn moves**: 1 Tackle, 1 Leer, 1 Low Kick, 1 Focus Energy, 15 Mach Punch, 16 Confusion, 20 Brick Break, 25 Psybeam, 31 Bulk Up, 39 Extrasensory, 46 Calm Mind, 52 Cross Chop, 61 Superpower
**Swampert_Hoenn TMs**: Earthquake, Psychic, Shadow Ball, Brick Break, Return, Rock Slide (tutor), Toxic, Protect

---

## Implementation Notes

1. **Inherit from vanilla**: growth rate, egg groups, gender ratio, catch rate, base exp, friendship, body color from vanilla Treecko/Torchic/Mudkip respectively.
2. **All moves confirmed available** in hack's move table except Disarming Voice and Draining Kiss (adjusted above).
3. **Wild encounter placement**: 4% rate, base forms only. Meteor Falls B1F 2R (Treecko), Mt. Pyre Exterior (Torchic), Shoal Cave low-tide (Mudkip).
4. **Postgame gift**: Replace SPECIES_CYNDAQUIL/TOTODILE/CHIKORITA in BirchLab Johto starter scripts with SPECIES_TREECKO_HOENN/TORCHIC_HOENN/MUDKIP_HOENN.
5. **Type triangle**: Steel→Fairy 2x, Fairy→Fighting 2x, Fighting→Steel 2x. All verified via type_matchup tool.
