# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0** (C2-23): Starters, migration species, trainers.
**v2.0** (C24-86): P/S split, Fairy, 6 species, Second Wave, Battle Frontier, QoL.
**v3.0** (C89-96): Trainer items, mid-game encounters/narrative, wild held items, Migration Tracker.
**v4.0** (C98-105): Dungeons, gym rematches, rival arc, Battle Speed QoL.
**v5.0** (C107-116): "The Legends Awaken" — Roaming beasts, sighting network, Ho-Oh climax.
**v6.0** (C118-126): "The Primal Stirring" — Groudon/Kyogre environmental arc, world reaction.
**v7.0-7.1** (C128-137): Battle Quality Overhaul + Sky Guardian Rayquaza trilogy.
**v8.0** (C138-143): "The Complete Experience" — Player journey polish, v1.0 ship.
**v1.1** (C144-150): Trainer quality pass (all routes), early-game glimpse events, Route 119 thunderstorm.
**v1.2** (C151-156): "The Player's Journey" — 3 interactive migration events, indoor running QoL.
**v1.3** (C157-162): "Living Hoenn" — Trade evo QoL (11 species), weather omens (4 routes), route identity NPCs (4 routes).

---

# v1.4: "The Wild Redesign" — IN PROGRESS

## Vision

Every route gets a curated encounter identity. Migration species move from "everywhere at once" to rare, location-specific finds. Early routes establish Hoenn's identity before migration species appear. Late routes reward thorough exploration. The wild encounter experience becomes the hack's strongest differentiator.

**What makes this arc unique**: Previous versions added features (P/S split, legendaries, events, QoL). v1.4 fixes the *core gameplay loop* — the 80% of player interaction that is wild encounters. The current tables have pseudo-legendaries on Route 101 and identical ocean routes. This redesign makes every route feel authored and every encounter meaningful.

**Full encounter specifications**: [`memory/v14-encounter-design.md`](v14-encounter-design.md)

## Critical Problems Being Fixed

1. **Early route power creep**: Dratini (40%), Bagon, Larvitar on R101-102 at Lv 2-4
2. **Petalburg Woods overleveled**: Heracross, Scyther, Breloom, Alakazam at Lv 10-16
3. **Homogeneous migration**: Houndour/Sneasel on 8+ routes — no route feels special
4. **Route 103 zero Hoenn natives**: All imports, no local species
5. **Water route monotony**: All sea routes = identical Tentacool/Wingull/Pelipper

## Design Principles

### Migration Species Philosophy
- **No migration species on R101-103.** First routes = pure Hoenn.
- Migration species: mid-to-late game, 1-5% rates, 1-2 primary routes each.
- Hoenn natives dominate every route (60%+ of encounter slots).

### Migration Species Map
| Species | Primary (4-5%) | Secondary (1%) |
|---------|---------------|----------------|
| Larvitar | R111 desert | Granite Cave deep, Meteor Falls |
| Gible | R111 desert (1%) | — |
| Riolu | R116 | New Mauville |
| Dratini | Safari Zone | R119 Super Rod (4%) |
| Houndour | R112-113 | R123, Mt. Pyre |
| Sneasel | Shoal Cave | R120, R113 |

### Route Identity Rules
- Every route: 2-3 signature species (50% of encounters) + 1 rare reward (1%)
- No two adjacent routes share more than 1 top-3 species
- Each route reinforces its NPC narrative (Birdwatcher, Volcanologist, etc.)

### Team-Building Flow
Routes naturally provide counters for the next gym:
- Pre-Roxanne: Water (Lotad), Grass (Shroomish/Seedot)
- Pre-Brawly: Psychic (Ralts R102), Flying (Taillow)
- Pre-Wattson: Ground (Nincada R116, Sandshrew R111)
- Pre-Norman: Fighting (Machop R112, Makuhita Granite Cave)
- Pre-Winona: Electric (Electrike/Mareep R110), Ice (Sneasel R113 rare)

## Issue #82 Integration

Issue #82 ("early-game excitement") is addressed by replacing rarity overload with genuine rarity:
- 1% Eevee on R101 > 40% Dratini on R101
- Diverse type coverage (7+ species per route) > homogeneous imports
- Progression rewards (Heracross 1% in Petalburg Woods) > everything available immediately

---

# v1.4 Cycle Roadmap

| Cycle | Name | Scope | Key Changes | Depends On |
|-------|------|-------|-------------|------------|
| C163 | Planning | — | This document + full encounter specs | — |
| C164 | Early Game Reset | R101-104, Petalburg Woods (5 land + R103 water/fish) | Remove all pseudo-legendaries from pre-Badge 1. Restore Hoenn identity. Add Eevee/Staryu/Pikachu/Heracross as 1% rewards. | — |
| C165 | Mid-Game Identity | R110-113, R114-117, Fiery Path (8-10 tables) | Solidify migration placement. Houndour=volcanic, Mareep=R110, Larvitar=R111. Fix R117 Illumise domination. | — |
| C166 | Late-Game & Caves | R118-123, Granite Cave, Mt. Pyre 1F, Victory Road, Shoal Cave (12+ tables) | Granite Cave pseudo-legendary purge. Mt. Pyre 1F diversification. Victory Road upgrade. Shoal Cave = Sneasel home. | C165 (migration placement finalized) |
| C167 | Ocean Differentiation | R105-109, R122, R124-134 water/fishing (20+ tables) | Every sea route gets 1-2 unique species. End Tentacool/Wingull monoculture. | — |

**Total**: 4 implementation cycles. C164 is highest priority (Issue #82, first impression).

**After v1.4**: Evaluate — engineering cycle (check_scripts build prereq, event macro library from tech-debt-backlog.md), or v1.5 content depending on community feedback.

---

## Quick Reference

- **Encounter slots**: Land 12 (20/20/10/10/10/10/5/5/4/4/1/1), Water 5, Fish 10
- **Encounter file**: `src/data/wild_encounters.json` — modified 18 times across 15+ cycles
- **Gen 3 items**: No Focus Sash/Choice Scarf/Specs/Life Orb/Black Sludge
- **Flags**: 0x264+ block (~14 v6, 0x272-0x277 Sky Guardian, 0x278-0x281 migration events, 0x282-0x285 weather omen NPCs). Beast flags at SYSTEM_FLAGS+0x21-0x26.
- **QoL shipped**: TMs non-consumable, indoor running, trade evo QoL (11 species)
- **Trainer capacity**: 885/885, reclaimable IDs: #568, #853
- **Weather scripting**: `setweather CONSTANT` + `doweather` in OnTransition, gate with `goto_if_set FLAG_*`
- **SecondWave system**: FLAG_SECOND_WAVE triggers alternate encounter tables on R118-121, R123, Mt. Pyre 1F (C63)
