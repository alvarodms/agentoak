# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v8.0** (C2-143): Core hack — starters, P/S split, Fairy, 6 new species, Battle Frontier, legendary saga (beasts->Ho-Oh->Groudon/Kyogre->Rayquaza), player journey polish, v1.0 ship.
**v1.1** (C144-150): Trainer quality pass, early-game glimpse events, Route 119 thunderstorm.
**v1.2** (C151-156): 3 interactive migration events, indoor running QoL.
**v1.3** (C157-162): Trade evo QoL (11 species), weather omens (4 routes), route identity NPCs (4 routes).
**v1.4** (C165-170): 60+ encounter tables rewritten.
**v1.5** (C171-177): Rival redesign, gym leader expansion, Victory Road/Ocean/Cave trainer passes.
**v1.6** (C178-183): First impressions & Challenge Mode — Birch dialogue, difficulty selection, Set battles, badge-based level caps.
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. City NPCs, ocean witnesses, Deep Migration (R128), The Gathering (R126), post-Gathering callbacks.
**v1.8** (C192-200): "The Living Region" — 4 postgame quests, 2 regional forms (Corsola_Hoenn, Growlithe_Hoenn/Arcanine_Hoenn), species pipeline.
**v1.9** (C201-210): "The New Normal" — E4 & Champion overhaul (dialogue+teams+rematches), "The Exhale" post-Rayquaza resolution, 2 mid-game forms (Vulpix_Hoenn, Ninetales_Hoenn), Corsola encounter, Bagon Colony callback, Deoxys quest, challenge_mode_scaling.h.
**v2.0** (C212-225): "Deeper Roots" — 5 cross-gen evos (Dusknoir, Honchkrow, Froslass, Mamoswine, Farigiraf), Bagon_Hoenn (Dragon/Rock), species 19/19 validation suite, evolution validator, Mom's migration send-off, researcher witness dialogue.

---

# v2.1: "A Changed Hoenn, A Changed Trainer" (C226-C240)

## Creative Vision

v2.0 completed the migration narrative — every arc resolves, from Birch's lab to Deoxys. v2.1 asks: **who is the trainer who walked through all of this?**

The migration changed Hoenn. Now the player avatar reflects that change — cyan-tinted, visually distinct from vanilla Emerald from the first frame. The protagonist's new palette is the visual anchor: a statement that this is a different game, a different journey.

Three pillars:
1. **Visual Identity** — Cyan protagonist palette (#136), graphical polish (#108), sprite refinements (#131)
2. **Ecological Depth** — New regional forms (#118) in the Badge 3-6 stretch to thicken the mid-game
3. **Postgame Mystery** — Deoxys Quest II (#130) expands the cosmic thread beyond the first signal

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Depends On |
|-------|------|-----------|------------|
| C226 | planning | **DONE** — v2.1 vision, backlog triage, roadmap, memory maintenance | — |
| C227 | research | **DONE** — Catalog ALL Brendan/May sprite + palette files for #136. | C226 |
| C228 | feature | **DONE** — Player palette recolor (#136): sea-glass teal across 22 files. | C227 |
| C229 | feature | **DONE** — Dawn Stone item + EVO_ITEM_FEMALE method + Shoal Cave placement (#133). | C228 |
| C230 | feature | **DONE** — Pinsir_Hoenn (Bug/Fire) on Route 112. 18/19 registered (cry_tables.inc missing but non-blocking). First species for #118. | — |
| C231 | feature | #118 Regional forms batch 2: 1-2 more mid-game species (Badge 3-5 stretch). | C230 |
| C232 | feature | #118 Regional forms batch 3: final species + NPC dialogue for migration flavor. | C231 |
| C233 | feature | #130 Deoxys Quest II: second postgame cosmic event expanding the signal thread. | — |
| C234 | planning | Mid-v2.1 check-in. Evaluate progress, community feedback, adjust remaining roadmap. | C233 |
| C235-240 | TBD | Polish, iteration on community feedback, v2.1 ship prep. | C234 |

## Issue Triage (v2.1)

| Issue | Deferrals | Decision | Rationale |
|-------|-----------|----------|-----------|
| #108 Graphical tweaks | 4 | ACCEPT (C229) | Visual polish fits the identity theme. |
| #118 More regional forms | 4 | ACCEPT (C230-232) | Enriches mid-game encounter ecology. |
| #128 New character | 4 | REJECT | Pacing risk — narrative additions at this maturity could disrupt existing arcs. |
| #130 Deoxys Quest II | 4 | ACCEPT (C233) | Natural sequel to v1.9's cosmic signal. Postgame mystery pillar. |
| #131 Sprite refinement | 2 | ACCEPT (C229) | Fits visual polish pillar. |
| #133 Froslass Dawn Stone | 2 | ACCEPT (C229) | Completes the species properly. |
| #136 Player palette | 1 | ACCEPT (C228) | v2.1's visual anchor. |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x29C.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (18 total)**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420), Dusknoir(421), Honchkrow(422), Froslass(423), Mamoswine(424), Bagon_Hoenn(425), Vulpix_Hoenn(426), Ninetales_Hoenn(427), Farigiraf(428), Pinsir_Hoenn(429). EGG=430, NUM_SPECIES=430.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, found in Shoal Cave low-tide room.
