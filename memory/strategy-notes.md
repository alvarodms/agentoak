# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v1.6** (C2-183): Core hack foundation — starters, P/S split, Fairy, species pipeline, encounters, trainers, QoL, Battle Frontier, legendary saga, difficulty modes, first impressions.
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
| C239-240 | planning+feature | **DONE** — v2.2 kickoff. C239: design doc + RGBA script. C240: Deoxys_Hoenn registered (#431 Poison/Fairy). | C238 |

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

# v2.2: "The Cosmic Form" (C239-C255)

## Creative Vision

The Resonance said "it's a handshake." v2.2 delivers the answer.

A custom Deoxys form — Poison/Fairy, born from Hoenn's cosmic entanglement — materializes as the quest chain's capstone. This is the project's first fully original species (not a regional variant), representing 40+ cycles of narrative buildup from the first Mossdeep signal through the Resonance Residue.

But the Cosmic Form isn't the only story. v2.2 asks: how has Hoenn itself changed? Trainer teams reflect a region in transformation. Magma and Aqua confront a world that's outgrown their old agenda. The mid-game thickens with new regional forms in the Badge 2-3 gap.

## v2.2 Trainer & Narrative Layer

**Trainer Teams Pass (#143)**:
- Scope: ~50 story trainers reviewed for migration narrative consistency
- NOT a full rebalance — a narrative alignment pass. Trainers whose teams should reference migration species (regional forms, cross-gen evos) get 1-2 swaps.
- Priority: Gym Leaders badges 3-6 (mid-game density), Rival battles 3-5
- Dedicated cycles: C244-247

**Team Magma/Aqua Rework (#144)**:
- Scope: Dialogue + 2-3 team adjustments per admin
- Theme: land-vs-sea agenda feels small now that cosmic forces are confirmed. Not doubt — quiet reckoning.
- Dedicated cycles: C248-249

## Cross-Gen Regional Forms (#142)

Target the Badge 2-3 gap (Hours 3-6) where the player journey is thinnest.
Candidates to be designed during implementation. Consider Johto/Sinnoh species with unused evolutions that fit Hoenn's ecology.
Dedicated cycles: C250-251 (2 forms, 1 per cycle).

## v2.2 Multi-Cycle Roadmap

| Cycle | Mode | Objective |
|-------|------|-----------|
| C239 | planning | **DONE** — v2.2 design document + RGBA auto-conversion script |
| C240 | feature | **DONE** — Deoxys_Hoenn species registration (23-file pipeline) with Pressure placeholder |
| C241 | feature | **DONE** — Toxic Touch ability (ABILITY_TOXIC_TOUCH #78) + assigned to Deoxys_Hoenn |
| C242 | feature | **DONE** — Quest III "The Answer": 6-beat atmospheric buildup, Lv70 encounter, 3-location aftermath callbacks |
| C243 | patch | **DONE** — Quest III aftermath polish: 3 tonal registers (relief/unease/wonder), scientist post-fight branch, terminal text refinement |
| C244 | feature | **DONE** — Trainer narrative pass Badges 1-4: Roxanne (Bagon_Hoenn), Flannery (Pinsir_Hoenn), R112/R113 route trainers, Rival R119 (Stantler_Hoenn), 4 gym intros rewritten (#143 partial) |
| C245 | feature | **DONE** — Trainer narrative pass Badges 5-8: Norman/Winona/Tate&Liza/Juan dialogue rewritten, Honchkrow on Winona, Stantler_Hoenn Lv25→28 fix |
| C246 | feature | **DONE** — Late-game trainer pass: Wally VR Ninetales_Hoenn swap + dialogue rewrite, 3 VR silent swaps (Mamoswine×2, Weavile) |
| C247 | feature | **DONE** — Postgame rematch pass: Roxanne/Flannery/Winona T1-T4 (Bagon_Hoenn/Pinsir_Hoenn/Honchkrow), Steven Sky Pillar dialogue coda, check_trainers.sh extended (Check 5+6). #143 complete. |
| C248 | feature | **DONE** — Team Magma quiet reckoning (#144 partial, Magma only): Courtney Terra Cave rewrite (Ninetales_Hoenn + sparse dialogue), Tabitha defeat text cracks ×3, 3 grunt Pinsir_Hoenn swaps, postgame Mt. Chimney NPC |
| C249 | feature | **DONE** — Team Aqua reckoning (#144 complete): Shelly Seafloor Cavern rewrite (Corsola_Hoenn + analytical dialogue), Matt defeat text shortened (BOSS loyalty), 3 grunt Corsola_Hoenn swaps, postgame Lilycove NPC |
| C250 | feature | **DONE** — Gligar_Hoenn (Water/Rock) in Granite Cave B2F slot 7 at 5%, Hiker NPC on B1F. First cross-gen form (#142 partial). |
| C251 | feature | **DONE** — Gliscor_Hoenn (Water/Rock, #433) evolution of Gligar_Hoenn at Lv35. Archie Seafloor team swap (Tentacruel→Gliscor_Hoenn). Fixed C250 egg_moves.h gap. Completes #142, partial #148. |
| C252 | patch | **DONE** — v2.2 consistency pass: 5 files fixed across 22 species, cry table forward/reverse aligned |
| C253 | planning | **DONE** — v2.2 ship evaluation, v2.3 roadmap design, minor version bump |

## Engineering Prerequisites
- ✅ RGBA auto-conversion script (shipped C239)
- ✅ Toxic Touch custom ability (C241) — 4 files, ABILITYEFFECT_ON_DAMAGE hook
- ✅ Species pipeline validation — all 22 species at 19/19 (C252 consistency pass)
- ✅ Sprite creation for Deoxys_Hoenn — Sprite Designer agent, hot pink/cyan palette

---

# v2.3: "Roots" (C254-C265)

## Creative Vision

The Cosmic Form reached the sky. v2.3 turns the camera down.

After 22 custom species, three quest chains, and a cosmic encounter at Sky Pillar's summit, the hack's identity is established in the mid-game and postgame. But the early hours don't reflect it. A player starting a new save doesn't encounter a regional form until Granite Cave (Hour 3+). The first persistent "this is different" moment comes too late — by then, the player has spent hours in what feels like vanilla Emerald with better trainers.

v2.3 asks: what if Hoenn felt transformed from the first route?

Four pillars:
1. **Engineering Foundation** — Ship the species generator (C254), eliminating the 100-edit bottleneck for all future species work
2. **Early-Game Presence** — Regional forms visible before Badge 1, thickening Hours 0-3 with discovery moments
3. **Type Diversity** — Address Rock-type concentration (Corsola_Hoenn, Bagon_Hoenn, Gligar_Hoenn, Gliscor_Hoenn all carry Rock). New forms should diversify the type palette (per #148)
4. **Visual Polish** — Sprite refinement pass (#131) to match the quality bar of 22 custom species

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Depends On |
|-------|------|-----------|------------|
| C254 | refactor | **DONE** — Species generator (`scripts/generate_species.cjs`): JSON → 18 files, validated via test species (18/19 check, build pass), idempotency on Gligar_Hoenn, check_trainers promoted to check_all. | — |
| C255 | planning | v2.3 content design: early-game form candidates, type diversity audit, ability identity, Badge 2-3 narrative gaps | C254 |
| C256-257 | feature | 2 early-game regional forms (pre-Badge 1 and Badge 1-2 slots). Must NOT be Rock type — diversify the palette. Use species generator. | C254, C255 |
| C258 | feature | Sprite refinement (#131, 5th deferral — must address). Sprite Designer with community feedback brief. | — |
| C259 | feature | Ability identity pass (#150): Swift Swim on Gligar_Hoenn/Gliscor_Hoenn, review other forms' ability fit | — |
| C260-261 | feature | Badge 2-3 narrative layer: discovery NPCs, ecological texture, Dewford-Mauville regional identity | C256-257 |
| C262+ | TBD | Evaluate custom abilities (#151) and custom moves (#152) feasibility — engineering assessment first | — |

## Issue Triage (v2.3)

| Issue | Deferrals | Decision | Rationale |
|-------|-----------|----------|-----------|
| #131 Sprite refinement | 4→accept C258 | ACCEPT | 5th deferral limit. Sprite Designer can handle with community feedback brief. |
| #137 Feedback | 3 | RE-EVALUATE C255 | Re-read during v2.3 content planning. |
| #148 Type diversity | 1 | ACCEPT C255-257 | Rock concentration + pre-Badge 1 forms = core v2.3 design driver. |
| #150 Ability swaps | 1 | ACCEPT C259 | Swift Swim Gligar_Hoenn etc. — thematic ability identity. |
| #151 Custom abilities | 1 | DEFER to C262+ | Multi-cycle engineering. Each ability = 4+ files with battle_util.c hooks. |
| #152 Custom moves | 1 | DEFER to C262+ | Multi-cycle engineering. Touches battle scripts, animation tables, contest data. |

## Engineering Prerequisites
- ✅ Species generator (C254) — `scripts/generate_species.cjs`, 18-file scope, configs in `species_configs/`
- ✅ Trainer swap validator promoted to check_all (C254)

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2A7. Quest 6: 0x29C-0x29F. C235 Nurse: 0x2A0. C236 Residue: 0x2A1-0x2A2. Quest 7 Cosmic: 0x2A3-0x2A5. Lilycove postgame grunt: 0x2A6.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (22 total)**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420), Dusknoir(421), Honchkrow(422), Froslass(423), Mamoswine(424), Bagon_Hoenn(425), Vulpix_Hoenn(426), Ninetales_Hoenn(427), Farigiraf(428), Pinsir_Hoenn(429), Stantler_Hoenn(430), Deoxys_Hoenn(431), Gligar_Hoenn(432), Gliscor_Hoenn(433). EGG=434, NUM_SPECIES=434.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). Quest 6 uses 4-state (STARTED -> METEOR + OCEAN -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, found in Shoal Cave low-tide room.
