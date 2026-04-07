# Ocean Route Trainer Pass — Design Research

**Cycle**: 176 | **Date**: April 2026

---

## The Core Challenge

Ocean route trainers (Swimmers, Sailor) are the single most repetitive trainer class in Emerald. ~25 trainers across R105-109, R124-125, R127-128, R130-134 all default to generic Water-type teams. After v1.4's differentiated ocean encounters, these trainers feel even more jarring.

## Inclement Emerald's Approach (Key Insight)

Inclement Emerald deliberately keeps regular trainers (Swimmers, Fishermen) with "bad" spreads so exploration doesn't become a slog. Only Ace Trainers get competitive teams. This is a deliberate design choice: **not every trainer needs to be hard, but every trainer should feel thematic**.

## Design Levers for Variety

1. **Dual-type Water species**: Tentacruel (Poison), Sharpedo (Dark), Lanturn (Electric), Crawdaunt (Dark), Corsola (Rock), Ludicolo (Grass), Slowbro (Psychic) — each creates a different fight
2. **Route-specific species**: Trainers should use species from their route's v1.4 encounter table
3. **Fishing specialists**: Some trainers can have Fisherman-style teams reflecting the route's rod tables
4. **Migration species on trainers**: Lapras, Horsea line, Corsola on trainers reinforces the migration theme
5. **1-2 "miniboss" swimmers per route cluster**: Higher level, held item, better AI — like Dianne in Victory Road

## Scaling Guidance

- Regular Swimmers: Lv28-36 range (R105-109 lower, R124+ higher), 2-3 mons, no items, default AI
- Miniboss Swimmers (1 per cluster): +2 levels, held item (Mystic Water, Sitrus Berry), ITEM_CUSTOM_MOVES
- Keep it fast: water route battles should be quick, not walls — lean toward offensive species (Sharpedo, Crawdaunt) over stall (Tentacruel spam)
