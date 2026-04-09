# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v8.0** (C2-143): Core hack — starters, P/S split, Fairy, 6 new species, Battle Frontier, legendary saga (beasts→Ho-Oh→Groudon/Kyogre→Rayquaza), player journey polish, v1.0 ship.
**v1.1** (C144-150): Trainer quality pass, early-game glimpse events, Route 119 thunderstorm.
**v1.2** (C151-156): 3 interactive migration events, indoor running QoL.
**v1.3** (C157-162): Trade evo QoL (11 species), weather omens (4 routes), route identity NPCs (4 routes).
**v1.4** (C165-170): 60+ encounter tables rewritten. [Detail: `memory/v14-encounter-design.md`]
**v1.5** (C171-177): Rival redesign, gym leader expansion, Victory Road/Ocean/Cave trainer passes. [Detail: `memory/v15-trainer-design.md`]
**v1.6** (C178-183): First impressions & Challenge Mode — Birch migration dialogue, difficulty selection (Normal/Challenge), Set battle style, badge-based level caps (18→55), 4 difficulty-reminder NPCs, scripted event macro library. [Detail: `memory/v16-challenge-mode.md`]

---

# v1.7: "The Gathering Storm" (C184-C191)

## Vision

The player's emotional arc should build from "growing power" through "rising dread" to "epic confrontation" with no dead zone. Right now, Hours 10-15 (Badge 7 through E4) are the hack's weakest stretch — no narrative events, no atmospheric content on ocean routes, the migration storyline goes quiet right when it should crescendo.

v1.4 fixed what the player *finds*. v1.5 fixed what *finds the player*. v1.6 gave the player *agency over difficulty*. v1.7 fills the **narrative silence** — the late game should feel like sailing through a world holding its breath before the storm breaks.

## Design Principles

1. **Badge-conditional dialogue**: NPCs in late-game cities shift tone after Badge 7. Ambient dread — fishing reports, strange currents, Space Center anomalies. The world notices what's happening before the player enters the crisis.
2. **Ocean route texture**: Swimmers, divers, sailors with one-line observations about changed seas. These routes shouldn't feel like empty corridors between cities.
3. **Late-game migration events**: Discovery moments comparable to the Bagon Colony (C153) and Misdreavus (C154). The ocean and late-game areas need their own signature encounters.
4. **Engineering first**: The Legendary Encounter Template (deferred 69 cycles) ships before content work. It's a force multiplier for any future legendary/event scripting.
5. **Difficulty-aware where appropriate**: Challenge Mode players may see additional NPC commentary. Use `IsChallengeModeActive()` sparingly — the late-game content should serve both modes.

## Late-Game Narrative Design

### Badge 7-8 City Atmosphere (C186)

**Mossdeep City** (Badge 7 home): Space Center scientists detect anomalous readings. A researcher NPC shifts from routine to concern after Badge 7. A second NPC (tourist/swimmer) mentions the sea feels different.

**Sootopolis City** (Badge 8): The sealed city by the crater lake. A fisherman reports the lake is warmer. An old woman references ancient legends stirring. Wallace's city should feel like it's sitting on a powder keg.

**Pacifidlog Town**: The floating town on ocean currents. A sailor says currents have reversed. An elder notices the Corsola are restless. This town is the closest to the deep ocean — it should feel the migration most acutely.

Design: 2-3 NPCs per city. Each NPC has two dialogue states: pre-Badge 7 (normal life) and post-Badge 7 (uneasy observations). Use existing `goto_if_set FLAG_BADGE07_GET` pattern. Script-only, no C code changes.

### Ocean Route Atmospheric NPCs (C187)

Routes 124-134 are the ocean corridor. Currently they have redesigned trainers (v1.5) and differentiated encounters (v1.4) but zero narrative content. Add 4-6 NPCs (swimmers, divers, sailors) with one-line migration observations:

- **Route 124** (near Mossdeep): Diver reports unusual species at depth
- **Route 126** (Sootopolis approach): Swimmer feels warm currents from below
- **Route 127/128** (Seafloor Cavern area): Sailor warns about turbulence near the trench
- **Route 130-134** (remote ocean): Swimmer spotted something massive moving underwater

These are simple object_events with `msgbox_npc` — low risk, high atmosphere. No badge gating needed (the player only reaches these routes after Badge 7 naturally).

### Late-Game Scripted Events (C188-189)

Two signature discovery moments for the ocean/late-game stretch:

**Event 1 — "The Deep Migration" (C188)**: A migration sighting event on an ocean route. The player surfaces from a dive spot (or approaches a specific tile) and witnesses something — a pod of rare species, a deep-sea disturbance, or an encounter with a migration species that's been hinted at by NPCs throughout the game. Should feel like the Pikachu sighting (C152) but on the ocean — movement, sound, atmosphere. Ends with a special encounter.

**Event 2 — "The Gathering" (C189)**: Near Sootopolis or on the route approaching it, a narrative beat that ties the late-game migration observations together. An NPC or environmental event that makes the player realize the migration is reaching its climax — setting up the Primal Stirring postgame arc. This is the "tension bridge" the Game Designer called for.

Design specifics for both events will be refined in their respective cycle planning phases.

---

## Phase Plan

| Cycle | Phase | Scope | Risk |
|-------|-------|-------|------|
| **C184** | Planning | This document + README + memory maintenance | None |
| **C185** | Engineering | Legendary Encounter Template (`legend_macros.inc`) — extract from 4 shipped encounters | LOW |
| **C186** | Atmosphere | Badge-conditional dialogue in Mossdeep, Sootopolis, Pacifidlog (2 NPCs × 3 cities) | DONE |
| **C187** | Atmosphere | Ocean route atmospheric NPCs — 5 across Routes 124/126/127/128/131 | DONE |
| **C188** | Feature | Late-game scripted event #1 — ocean migration sighting | DONE |
| **C189** | Feature | Late-game scripted event #2 — pre-Sootopolis narrative beat | MEDIUM |
| **C190** | Polish | Integration, difficulty_utils.inc extraction, player journey map update | LOW |
| **C191** | Buffer | Overflow / community issues / v1.8 planning | — |

### Dependencies

- C185 (legend_macros.inc) unblocks faster event scripting in C188-189
- C186-187 are independent and can run in either order
- C188-189 depend on the narrative framework from C186 (city NPCs foreshadow the events)

### C185 Engineering Detail

Read the 4 shipped legendary encounter scripts:
- Beast encounters: `Route118/scripts.inc` (roamer init pattern)
- Ho-Oh: `CaveOfOrigin/scripts.inc` (static legendary + cinematic)
- Groudon: `TerraCave_End/scripts.inc` (weather + setwildbattle pattern)
- Kyogre: `SeafloorCavern_Room9/scripts.inc` (same pattern, water variant)
- Rayquaza: `SkyPillar_Top/scripts.inc` (cinematic + Air Lock)

Extract common patterns into `data/scripts/legend_macros.inc`. Follow `event_macros.inc` include pattern (add to `asm/macros.inc`).

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()` macro in `constants/flags.h`.
- **Flag space**: 0x264+ custom. Next available: 0x288.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, reclaimable IDs: #568, #853, #854.
- **Scripted Event Macros**: `asm/macros/event_macros.inc` — GlimpseEvent, BadgeGateShow, ConditionalDialogue.
- **Multichoice IDs**: Last used 114 (`MULTI_DIFFICULTY_SELECT`). Next: 115.
- **QoL shipped**: TMs non-consumable, indoor running, trade evo QoL (11 species).
