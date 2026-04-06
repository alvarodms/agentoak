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
**v1.2** (C151-156): "The Player's Journey" — 3 interactive migration events (Petalburg Woods, Meteor Falls, Mt. Pyre), indoor running QoL. All pillars shipped.
**v1.3** (C157-162): "Living Hoenn" — Trade evo QoL (11 species), weather omens (4 routes), route identity NPCs (4 routes). All pillars shipped.

---

# v1.3: "Living Hoenn" — COMPLETE

## Vision

Make Hoenn feel like a living, reactive world. The player's badge progression creates visible environmental changes — weather shifts, accessible species, route personality. The migration isn't just talked about; it reshapes the landscape.

**What makes this arc unique**: Previous versions added content (trainers, events, legendaries). v1.3 adds *atmosphere*. Weather omens foreshadow the Primal Stirring, trade evo QoL unlocks team diversity, and route identity NPCs make traversal feel authored rather than procedural.

## Pillar 1: Trade Evolution QoL (1 cycle)

Remove all trade-gated evolutions. Every Emerald hack community expects this. Players who can't trade shouldn't lose access to Alakazam/Gengar/etc.

**Implementation** (file: `src/data/pokemon/evolution.h`):

| Species | Current | New | Rationale |
|---------|---------|-----|-----------|
| Kadabra → Alakazam | `EVO_TRADE, 0` | `EVO_LEVEL, 37` | Standard level, matches Kadabra's late-learn moves |
| Machoke → Machamp | `EVO_TRADE, 0` | `EVO_LEVEL, 37` | Parallel with Kadabra tier |
| Graveler → Golem | `EVO_TRADE, 0` | `EVO_LEVEL, 37` | Parallel with Kadabra tier |
| Haunter → Gengar | `EVO_TRADE, 0` | `EVO_LEVEL, 37` | Parallel with Kadabra tier |
| Seadra → Kingdra | `EVO_TRADE_ITEM, DRAGON_SCALE` | `EVO_ITEM, ITEM_DRAGON_SCALE` | Stone-style usage; preserves item relevance |
| Clamperl → Huntail | `EVO_TRADE_ITEM, DEEP_SEA_TOOTH` | `EVO_ITEM, ITEM_DEEP_SEA_TOOTH` | Stone-style; no EVO_LEVEL_ITEM in Gen 3 |
| Clamperl → Gorebyss | `EVO_TRADE_ITEM, DEEP_SEA_SCALE` | `EVO_ITEM, ITEM_DEEP_SEA_SCALE` | Stone-style; parallel with Huntail |

**Design note**: EVO_ITEM (constant 7) is already in the engine — used by stone evolutions. This requires ZERO C code changes, only data edits. The items become evolution stones essentially. Dragon Scale/DeepSea items remain relevant rather than being useless without link cables.

**Risk**: None. Single-file edit, 6 lines changed.

## Pillar 2: Weather Omens (2 cycles)

Environmental foreshadowing of the Primal Stirring. As players collect badges, Hoenn's climate destabilizes — subtle at first, then unmistakable. This connects the badge journey to the Groudon/Kyogre narrative before it's explicitly revealed.

**Technical approach**: Each route's `scripts.inc` already has `OnTransition` hooks. Add flag-checked `setweather`/`doweather` calls gated by badge flags. Pattern:
```
Route_OnTransition:
    goto_if_set FLAG_RECEIVED_BADGE5, Route_SetStormWeather
    end
Route_SetStormWeather:
    setweather WEATHER_SANDSTORM
    doweather
    end
```

### Weather Shift Schedule

| Route | Badge Gate | Weather Change | Narrative Purpose |
|-------|-----------|----------------|-------------------|
| Route 111 | Badge 5 | Sunny → permanent Sandstorm | Desert intensifying — land energy stirring |
| Route 119 | Badge 6 | Cycling rain → constant Thunderstorm | Water energy surging — builds on C149 event |
| Route 120 | Badge 6 | Normal → Heavy Rain | Spillover from Route 119 — climate spreading |
| Route 125 (Shoal Cave approach) | Badge 7 | Normal → Hail (WEATHER_SNOW) | Ocean temperatures dropping — primal cold |

### Weather Reaction NPCs (1 per route, 2-3 lines each)

- **Route 111 Hiker**: "This sandstorm... it wasn't this bad last week. Something's stirring beneath the desert."
- **Route 119 Ranger**: "The Weather Institute says these storms are unprecedented. Nature itself feels... restless."
- **Route 120 Bird Keeper**: "Even the Flying-types won't come out in this rain. It's like the sky is angry."
- **Route 125 Swimmer**: "The water's ice cold today! The currents have changed. Shoal Cave must be freezing."

**Design note**: Route 111 already has sandstorm logic (coordinate-based, lines 30+ of scripts.inc). The weather omen makes it *permanent* post-Badge 5 rather than zone-restricted. This is a meaningful gameplay change — not just flavor. Route 119 already has our C149 thunderstorm event; post-Badge 6 makes the storm persist after the event, feeling like a consequence.

## Pillar 3: Route Identity (2 cycles)

Give 2-4 routes distinct environmental personalities through thematic NPCs that tie into the migration narrative. These aren't random hikers — they're observers who make the world feel studied and alive.

### Route 110 — Cycling Road: "The Migration Watch"
- **Birdwatcher NPC** (near Cycling Road entrance): Tracks unusual Pokémon flying over the road. Dialogue references species the player has encountered in migration events. 2-3 lines, ties sightings to the broader pattern.

### Route 113 — Ash Route: "The Restless Mountain"
- **Volcanologist NPC** (near glass workshop): Notes increased ash fall correlating with migration activity. "Mt. Chimney's been venting more since those foreign species arrived." 2-3 lines connecting volcanic activity to ecological disruption.

### Route 119 — Weather Institute Approach (post-C149 enhancement)
- Already has thunderstorm event. Post-Badge 6 weather persistence (Pillar 2) builds on this. Add **Weather Institute Intern** outside: comments on instruments going haywire. 2 lines.

### Route 123 — Berry Route: "The Bloom"
- **Berry Researcher NPC**: Studies how migration species affect berry growth patterns. "Pokémon we've never seen are pollinating berries in ways our native species never did." 2-3 lines. A positive consequence — migration isn't all ominous.

**Design principle**: Each route NPC reflects a DIFFERENT perspective on the migration — wonder (110), concern (113), scientific alarm (119), optimism (123). This gives the world tonal variety instead of uniform dread.

## Pillar 4: Engineering Maintenance (opportunistic)

Deferred from v1.2 — not blocking v1.3 content:
- Legendary encounter template macros (pending since C115)
- Trainer ID audit (pending since C147)
- Scripted event macro library (pending since C152)

Schedule one engineering cycle after v1.3 content ships if friction recurs.

---

# v1.3 Cycle Roadmap

| Cycle | Name | Pillar | Deliverable | Depends On |
|-------|------|--------|-------------|------------|
| C157 | Planning | — | This document | — |
| C158 | Trade Evo QoL | 1 | **DONE** — All 11 trade evos converted (level/item-based) | — |
| C159 | Weather Omens I | 2 | **DONE** — Route 111 permanent sandstorm post-Badge 5 + Route 119 permanent thunderstorm post-Badge 6 + 2 reaction NPCs | — |
| C160 | Weather Omens II | 2 | **DONE** — Route 120 permanent downpour post-Badge 6 + Route 125 permanent hail post-Badge 7 + 2 reaction NPCs + fixed C159 missing map.json object_events | C159 (pattern) |
| C161 | Route Identity I | 3 | **REVERTED** — smart quote build failure; NPC content not shipped | — |
| C162 | Route Identity (all 4) | 3 | **DONE** — All 4 route identity NPCs: Route 110 Birdwatcher, Route 113 Volcanologist, Route 119 Weather Intern, Route 123 Berry Researcher. Pillar 3 complete. v1.3 complete. | — |

**Total**: 5 implementation cycles. Tight, focused, no bloat.

**After v1.3**: Evaluate community feedback. Candidates: Battle Frontier expansion, new species, map editing (issue #77), engineering cleanup cycle.

---

## Quick Reference

- **Trainer checklist**: See codebase-facts.md (party struct types, three-file system)
- **Encounter slots**: Land 12 (20/20/10/10/10/10/5/5/4/4/1/1), Water 5, Fish 10
- **Gen 3 items**: No Focus Sash/Choice Scarf/Specs/Life Orb/Black Sludge — use Choice Band/Focus Band/Scope Lens/Shell Bell/Leftovers
- **Flags**: 0x264+ block (~14 used for v6, 0x272-0x277 for Sky Guardian, 0x278-0x27D for migration events, 0x27E-0x27F for Petalburg Woods, 0x280 for Meteor Falls colony, 0x281 for Mt. Pyre ghost event, 0x282-0x285 for weather omen NPCs). Beast flags at SYSTEM_FLAGS+0x21-0x26.
- **QoL note**: TMs already non-consumable in decomp. Indoor running enabled C156.
- **Trainer capacity**: 885/885, reclaimable IDs: #568 (GRUNT_UNUSED), #853 (MAY_PLACEHOLDER)
- **Evolution file**: `src/data/pokemon/evolution.h` — format: `{EVO_TYPE, param, SPECIES_TARGET}`
- **Weather scripting**: `setweather CONSTANT` + `doweather` in OnTransition hooks, gate with `goto_if_set FLAG_*`
