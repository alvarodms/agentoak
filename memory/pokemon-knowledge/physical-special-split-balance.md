# Physical/Special Split: Balance Implications for Legends of Hoenn

**Cycle**: 43 | **Date**: March 2026

---

## Implementation Notes

The pret wiki guide is the authoritative source. Key pitfall: after adding the split system, every move defaults to Physical (byte = 0) unless explicitly categorized. Must set the 11th byte of each move: 0=Physical, 1=Special, 2+=Status. The pokeemerald-physpe fork by Kateulator is a clean minimal reference.

## Winners in LoH's Roster

- **Tyranitar** (134 Atk): Crunch becomes physical — transforms from good to terrifying. This is LoH's signature starter line.
- **Gyarados** (125 Atk / 60 SpA): Waterfall physical = massive upgrade. Was crippled by special Water in Gen 3.
- **Blaziken** (120 Atk): Fire Punch/Blaze Kick now physical, matching its higher Atk stat.
- **Sharpedo** (120 Atk / 95 SpA): Physical Crunch + Waterfall = glass cannon unleashed.
- **Salamence**: Dragon Claw/Outrage physical, matching 135 Atk.
- **Absol** (130 Atk): Shadow Ball + Crunch both physical — huge.

## Losers / Rebalance Needed

- **Electrike/Manectric**: Spark becomes physical (bad for 105 SpA / 65 Atk). Needs Thunderbolt/Shock Wave.
- **Mudkip line**: Mud Shot becomes special, slightly weaker for physical Marshtomp.
- **Grimer/Muk**: Sludge Bomb becomes special (bad for physical Poison types).

## Trainer Rebalance Required

After implementing the split, gym leaders and trainers whose Pokemon benefit or suffer need movepool/item review. Wattson's team (Electrike-heavy) may need adjustment.

## Key Limitation

Many signature physical/special moves (Air Slash, Power Gem, Aura Sphere) don't exist in Gen 3. The split helps Dark, Ghost, and Fire physical attackers most. Flying and Rock special attackers gain less.
