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
**v1.4** (C165-170): "The Wild Redesign" — 60+ encounter tables rewritten. Every route has curated identity. Migration species rare and location-specific. Ocean routes differentiated. Engineering validation scripts shipped (C170). [Detail: `memory/v14-encounter-design.md`]

---

# v1.5: "The Trainer Gauntlet" — IN PROGRESS (C171+)

## Vision

Encounters are now v1.4 quality — every wild battle feels authored. But trainers lag behind. Gym leaders have good teams (C130-131) but too-small rosters. Rivals still use default movesets from C7/C12 — 160 cycles outdated. Ocean route swimmers don't reflect their route's new encounter identity. Victory Road trainers haven't been touched since C55-58.

v1.5 closes the trainer quality gap so every battle — wild or trainer — feels intentional.

**Elevator pitch**: The rival becomes your personal measuring stick. Gym leaders become genuine boss fights. Every trainer you face uses species that belong on their route.

**Difficulty tier**: "Difficult But Fair" (Inclement Emerald model). Challenging for prepared players, never unfair.

## What Makes This Arc Unique

v1.4 fixed what the player *finds*. v1.5 fixes what *finds the player*. Together they make every interaction in Hoenn feel designed. The migration becomes systemic — trainers use migration species from their routes, making the world feel alive beyond just wild encounters.

## Design Principles

1. **Route coherence**: Route trainers use species available on their route
2. **Migration integration**: Trainers with migration species = migration feels real
3. **Boss fight escalation**: Gym team size grows with progression (3 → 4 mons)
4. **Rival as measuring stick**: Each rival battle escalates meaningfully with custom movesets
5. **Gen 3 item rules**: Choice Band OK. No Focus Sash, Life Orb, Choice Specs/Scarf.

## Priority Stack

| Priority | What | Why | Scope |
|----------|------|-----|-------|
| **P0** | ~~Rival battles redesign~~ **DONE C172** | 30 parties rewritten with custom movesets, items, migration companions | All 30 → CUSTOM_MOVES |
| **P1** | ~~Gym leader team expansion~~ **DONE C173** | +1 mon to Flannery (Torkoal), Norman (Zangoose), Winona (Tropius), Juan (Whiscash) | 4 leaders → 4 mons each |
| **P2** | ~~Victory Road trainer pass~~ **DONE C175** | 16 trainers redesigned: Lv40-48, VR-encounter-coherent species, IV 180, SETUP_FIRST_TURN AI | ~15 trainers |
| **P3** | Ocean route trainer pass | Swimmers don't match v1.4 route themes | ~25 trainers |
| **P4** | Cave trainer cleanup | Variable quality from early cycles | ~10 trainers |

**Full specifications**: [`memory/v15-trainer-design.md`](v15-trainer-design.md)

## Cycle Roadmap

| Cycle | Name | Scope | Depends On |
|-------|------|-------|------------|
| **C171** | Planning | This document + full trainer specs | — |
| **C172** | ~~Rival Redesign~~ **DONE** | All 30 rival parties rewritten. Custom movesets, held items, migration companions, escalating team sizes (1→2→3→4→5). | C171 design doc |
| **C173** | ~~Gym Leader Tuning~~ **DONE** | Added 4th mon to Flannery/Norman/Winona/Juan per v1.5 spec. | — |
| **C174** | ~~Victory Road Gauntlet~~ failed (0 tool calls) | — | — |
| **C175** | ~~Victory Road Gauntlet~~ **DONE** | 16 trainers redesigned Lv40-48, VR-coherent species, AI upgraded | — |
| **C176** | Ocean Route Trainers | ~25 swimmers across R105-134 updated to match v1.4 encounter themes. Route-coherent species. | v1.4 encounter tables |
| **C177** | Cave & Final Audit | Mt. Pyre, Meteor Falls, Granite Cave trainer cleanup. Full difficulty curve verification. | C172-176 complete |

**After v1.5**: Consider v1.6 direction — underwater encounters, dynamic weather encounters, migration waves as game state, or narrative expansion.

---

## Quick Reference

- **Encounter slots**: Land 12 (20/20/10/10/10/10/5/5/4/4/1/1), Water 5, Fish 10
- **Encounter file**: `src/data/wild_encounters.json` — modified 18 times across 15+ cycles
- **Gen 3 items**: Choice Band OK. No Focus Sash/Life Orb/Choice Specs/Scarf.
- **Flags**: 0x264+ block (~14 v6, 0x272-0x277 Sky Guardian, 0x278-0x281 migration events, 0x282-0x285 weather omen NPCs). Beast flags at SYSTEM_FLAGS+0x21-0x26.
- **QoL shipped**: TMs non-consumable, indoor running, trade evo QoL (11 species)
- **Trainer capacity**: 885/885, reclaimable IDs: #568, #853, #854
- **Weather scripting**: `setweather CONSTANT` + `doweather` in OnTransition, gate with `goto_if_set FLAG_*`
- **SecondWave system**: FLAG_SECOND_WAVE triggers alternate encounter tables on R118-121, R123, Mt. Pyre 1F (C63)
- **Trainer struct types**: NoItemDefaultMoves, NoItemCustomMoves, ItemDefaultMoves, ItemCustomMoves — macro in trainers.h MUST match party struct type
