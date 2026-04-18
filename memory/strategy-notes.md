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
| C230 | feature | **DONE** — Pinsir_Hoenn (Bug/Fire) on Route 112. 18/19 registered. | — |
| C231 | feature | **DONE** — Stantler_Hoenn (Ghost/Grass) on Route 119. Badge 5-6 gap filled. | C230 |
| C232 | feature | **DONE** — Echo dialogue layer: 5 NPCs connecting 4 regional forms + Changed Trainer debut. | C231 |
| C233 | feature | **DONE** — #130 Deoxys Quest II: "The Resonance" — 3-location postgame investigation. 4 flags, 3 maps, ~250 lines of script. | — |
| C234 | planning | **DONE** — v2.1 holistic eval, C235-240 plan, v2.2 vision, memory maintenance. | C233 |
| C235 | feature | **DONE** — "Changed Trainer Witnesses" — Mom, Rival, Norman, Nurse Joy post-Champion dialogue. | C234 |
| C236 | feature | **DONE** — "Resonance Residue" + #108 accepted — Post-Quest II environmental details at 3 locations + screen flash. | C235 |
| C237 | patch | **DONE** — v2.1 consistency pass — Echo NPC flag checks, Quest II rewards, encounter rates, pacing. | C236 |
| C238 | patch | **DONE** — v2.1 ship — Fixed Mom witness blocking heal + Nurse witness lock gap. README + memory updates. version_bump: "minor". | C237 |
| C239-240 | planning+feature | v2.2 kickoff — "The Cosmic Form": custom Deoxys, Toxic Touch, cross-gen regional forms. | C238 |

## Issue Triage (v2.1)

| Issue | Deferrals | Decision | Rationale |
|-------|-----------|----------|-----------|
| #108 Graphical tweaks | 5 | DEFER (C236, 5th final) | Planned for C229 but scope deferred. Must address C236. |
| #118 More regional forms | 5 | PARTIAL / DEFER (5th final) | C215 Bagon_Hoenn, C230 Pinsir_Hoenn, C231 Stantler_Hoenn shipped. Remaining → v2.2. |
| #128 New character | 4 | REJECT | Pacing risk — narrative additions at this maturity could disrupt existing arcs. |
| #130 Deoxys Quest II | 4 | **DONE (C233)** | Three-location investigation chain with 4 flags, atmospheric setpieces, open-ended "handshake" conclusion. |
| #131 Sprite refinement | 2 | ACCEPT (C229) | Fits visual polish pillar. |
| #133 Froslass Dawn Stone | 2 | **DONE (C229)** | Dawn Stone + EVO_ITEM_FEMALE + Shoal Cave placement. |
| #136 Player palette | 1 | **DONE (C228)** | Sea-glass teal across 22 files. |
| #145 Special Deoxys form | 1 | DEFER (v2.2) | Same ask as #140. Custom species + ability = v2.2 package. |
| #146 Combine Deoxys quests | 0 | REJECT | Two-quest structure is intentional design. The gap is where narrative dread lives. |

---

# v2.2: "The Cosmic Form" (C239-C260, tentative)

## Creative Vision

The Resonance's handshake demands an answer. v2.2 delivers it: a custom Deoxys form born from Hoenn's cosmic connection — Poison/Fairy, visually distinct (hot pink/cyan palette), with a new ability (Toxic Touch). This is the project's first fully custom species, not a regional variant.

The form caps the Deoxys quest chain (Quest III: "The Answer") and represents the culmination of the postgame mystery arc that began in v1.9.

Alongside the Deoxys centerpiece:
- Cross-generation evolutions reimagined as regional forms (#142)
- Comprehensive trainer team audit for consistency (#143)
- Team Magma/Aqua narrative rework (#144)
- Additional regional forms (#118 remaining asks)

## Engineering Prerequisites
- RGBA auto-conversion script (7x deferred) — MUST ship before custom species work (target C239)
- Custom ability implementation (Toxic Touch) — uncharted territory, needs research cycle
- Species pipeline for fully custom (non-variant) species — may need pipeline extension

## Key Risks
- Custom ability requires battle engine modifications — high regression risk
- Custom species (not a regional form) may need pipeline changes
- 680 BST Poison/Fairy is extremely powerful — needs careful balancing against postgame context

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2A3. Quest 6 Resonance uses 0x29C-0x29F. C235 Nurse witness: 0x2A0. C236 Resonance Residue: 0x2A1-0x2A2.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (19 total)**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420), Dusknoir(421), Honchkrow(422), Froslass(423), Mamoswine(424), Bagon_Hoenn(425), Vulpix_Hoenn(426), Ninetales_Hoenn(427), Farigiraf(428), Pinsir_Hoenn(429), Stantler_Hoenn(430). EGG=431, NUM_SPECIES=431.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). Quest 6 uses 4-state (STARTED -> METEOR + OCEAN -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, found in Shoal Cave low-tide room.
