---
name: Sky Pillar Arc & Rematch Design
description: Shipped C134-139 — Sky Pillar encounter tables, Draconid trainer, rematch tier curve. Reference for future encounter/rematch design.
type: reference
---

# Sky Pillar & Rematch Design (Shipped)

## Sky Pillar Encounters (Shipped C134-139)

Three floors with encounters (1F, 3F, 5F). No encounters on puzzle floors (2F, 4F) or Top (boss).
- 1F "Haunted Ruins": Golbat/Claydol/Banette/Sableye/Dusclops/Xatu (Lv45-48)
- 3F "Ancient Sentinels": Claydol/Altaria/Dusclops/Xatu/Banette/Flygon (Lv48-51)
- 5F "Dragon's Domain": Altaria/Flygon/Claydol/Aerodactyl/Shelgon/Salamence 1% (Lv51-55)

Draconid Trainer on 3F: Altaria/Flygon/Shelgon (Lv50-51), reward Dragon Scale.

## Rematch Tier Curve (Shipped C171-177)

| Tier | Context | Ace Level | Team Size |
|------|---------|-----------|-----------|
| Base | Story | Per gym (15-46) | 3-6 |
| T1 | Post-E4 first | Base +10 | +1 mon |
| T2 | After 2+ rematches | Base +18 | +1 mon |
| T3 | After 4+ rematches | Base +25 | 6 |
| T4 | Final form | Base +30 | 6 + held items |

Per-leader highlights: Roxanne→fossil specialist (Aerodactyl ace T4), Brawly→bug/fight, Wattson→speed, Flannery→sun, Norman→power, Winona→aggression, T&L→psychic coverage, Juan→rain synergy.

## Flag Allocation

- `FLAG_SKY_GUARDIAN_QUEST_ACTIVE` (0x272)
- `FLAG_PACIFIDLOG_ELDER_SPOKEN` (0x273)
- `FLAG_CAUGHT_RAYQUAZA` (0x274)
- `FLAG_DEFEATED_RAYQUAZA` (0x275)
- `FLAG_HIDE_SKY_PILLAR_DRACONID` (0x276)
