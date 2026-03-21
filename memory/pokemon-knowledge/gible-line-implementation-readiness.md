# Gible Line Implementation Readiness

**Cycle**: 66 | **Date**: March 2026

---

## Movepool Feasibility (Gen 3 Context)

Garchomp's core competitive moves are all available through Gen 3-compatible methods:
- **Earthquake** (TM26), **Dragon Claw** (TM02), **Rock Slide** (tutor/TM), **Swords Dance** (TM), **Fire Blast** (TM)
- **Outrage** available via egg move or tutor — strong STAB option
- **Crunch** via level-up at 48 — useful Dark coverage

Gible level-up pool is solid: Dragon Rage (7), Sandstorm (13), Dragon Claw (27), Dig (31).

## Implementation Scope

3 species (Gible/Gabite/Garchomp) = ~42 source files + ~21 asset files based on Cycle 61 analysis. This is 3x the Weavile effort. The species pipeline is proven but this is the largest batch yet.

## Balance Reminder

Garchomp is 600 BST (pseudo-legendary tier). Mitigated by:
- Late placement: Gible in Meteor Falls B1F-2R (8%), Garchomp in Victory Road B2F (5%)
- Player already has pseudo-legendary starter
- No Sand Veil ability in Gen 3 engine (less oppressive than Gen 4+)

## Dungeon Theming Opportunity

ROM hack community values **themed dungeon encounters**. Placing Gible in Meteor Falls creates a "dragon nest" theme alongside existing Dragon types there. This is the kind of encounter design that top hacks (Inclement Emerald, Unbound) execute well — dungeons with identity, not random species dumps.
