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

## Deoxys_Hoenn — "The Cosmic Form"

**Species**: #431 (EGG→432, NUM_SPECIES→432)
**Type**: Poison / Fairy
**BST**: 600 (matching standard Deoxys — powerful but not unprecedented)

**Stat Spread**:
| HP | Atk | Def | SpA | SpDef | Spe |
|----|-----|-----|-----|-------|-----|
| 60 | 80  | 70  | 150 | 80    | 160 |

**Design Intent**: A fast special attacker. 160 Speed outpaces everything in the hack except Deoxys-Speed (180). 150 SpA with dual STAB delivers devastating hits. Defenses (60/70/80) are marginally less suicidal than Normal Deoxys (50/50/50) but still fragile — priority moves and Scarfers threaten it. The stat spread rewards players who earned the postgame encounter with something genuinely powerful without trivializing content.

**Abilities**: Toxic Touch (slot 1) / Pressure (slot 2)
**Catch Rate**: 3
**Growth Rate**: Slow (GROWTH_SLOW)
**EV Yield**: 3 SpA
**Egg Groups**: Undiscovered / Undiscovered
**Gender**: Genderless
**Base Friendship**: 0
**Held Items**: None (encountered via quest, not wild)
**Dex Number**: Shares National #386 with standard Deoxys

**Key Moves** (full learnset to be designed during C240 implementation):
- Poison STAB: Sludge Bomb (TM36)
- Fairy STAB: verify available Fairy moves in hack — Moonblast if present, else Dazzling Gleam
- Coverage: Psychic, Shadow Ball, Ice Beam, Thunderbolt
- Utility: Cosmic Power, Recover, Calm Mind, Taunt
- Level-up flavor: starts with Cosmic Power at L1, learns Sludge Bomb by L50

## Toxic Touch — Custom Ability

**Effect**: When the holder uses any damaging move, 30% chance to poison the target (regular poison, not badly-poisoned).

**Variant**: Offensive trigger (modified Poison Touch). Activates on ANY damaging move, not just contact — differentiates from canon Poison Touch and synergizes with the 150 SpA glass cannon identity. Mechanically distinct from Poison Point (defensive trigger on Tentacool/Roselia lines already in the hack).

**Design Rationale**: Rewards aggressive play, matching the glass cannon stat spread. Thematically, the Cosmic Form corrupts what it reaches toward — the answer to the handshake, alien and transformative.

**Implementation Approach (~7 files)**:
1. `include/constants/abilities.h` — add ABILITY_TOXIC_TOUCH constant
2. `src/data/text/abilities.h` — name "Toxic Touch" + description "Poisons foes on contact."
3. `src/battle_util.c` — post-damage check: after move deals damage, if holder has Toxic Touch AND target has no primary status, 30% roll → apply STATUS1_POISON. No contact flag check required. Different hook point than Poison Point (which uses ABILITYEFFECT_CONTACT defender trigger).
4. `src/pokemon.c` or species_info — assign ability to Deoxys_Hoenn
5. `src/data/battle_ai_scripts.s` — AI awareness (treat similarly to Poison Point for scoring)
6. `src/battle_message.c` — ability popup text if needed
7. Build + test

**Edge Cases to Test**: Trace copying Toxic Touch, Gastro Acid suppressing it, double battles (only target hit), Substitute blocking, Steel/Poison type immunity to poison status.

## Quest III: "The Answer"

**Trigger**: Quest II complete (FLAG_QUEST6_COMPLETE set) → visit Mossdeep Space Center 2F.

**Scene 1 — "The Signal Converges"**:
- New NPC (or existing scientist) on Space Center 2F
- Dialogue: "The three Resonance sites are pulsing in sync now. Whatever answered your signal — it's locked onto Hoenn. The convergence point is... the summit of Sky Pillar."
- Sets FLAG_QUEST7_STARTED (0x2A3)

**Scene 2 — "The Arrival"** (Sky Pillar Summit):
- Reuse existing Sky Pillar summit map with new event layer
- On entry: screen dims (fadescreen), cosmic palette flash (reuse C236 Resonance Residue technique), brief pause
- Text: "The air shimmers with an impossible color — pink and violet, sweet and wrong."
- Cosmic Form overworld sprite materializes (object event appears)

**Scene 3 — "The Encounter"**:
- Player interacts with sprite → Level 70 Deoxys_Hoenn battle
- No fleeing (legendary battle flags)
- If KO'd: respawns after defeating E4 again (standard legendary respawn pattern)

**Scene 4 — "The Aftermath"**:
- Residue NPCs at Meteor Falls, Route 131, and Mossdeep terminal update: "The hum stopped... like it found what it was looking for."
- Space Center scientist: "The signal went quiet. Whatever crossed over... it's here now."
- Sets FLAG_QUEST7_COMPLETE (0x2A4)

**Flags**: FLAG_QUEST7_STARTED (0x2A3), FLAG_QUEST7_COMPLETE (0x2A4). Next available: 0x2A5.

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
| C239 | planning | v2.2 design document + RGBA auto-conversion script |
| C240 | feature | **DONE** — Deoxys_Hoenn species registration (23-file pipeline) with Pressure placeholder |
| C241 | feature | **DONE** — Toxic Touch ability (ABILITY_TOXIC_TOUCH #78) + assigned to Deoxys_Hoenn |
| C242 | feature | Quest III "The Answer" — script events, Sky Pillar encounter, dialogue |
| C243 | patch | Quest III polish + Residue aftermath callbacks + sprite work (#131) |
| C244-245 | feature | Trainer teams narrative pass — early & mid game (#143) |
| C246-247 | feature | Trainer teams narrative pass — late & postgame (#143) |
| C248-249 | feature | Team Magma/Aqua rework (#144) |
| C250-251 | feature | Cross-gen regional forms x2 (#142) |
| C252 | patch | v2.2 consistency pass |
| C253 | planning | v2.2 ship evaluation |

## Engineering Prerequisites
- ✅ RGBA auto-conversion script (shipped C239)
- ✅ Toxic Touch custom ability (C241) — 4 files, ABILITYEFFECT_ON_DAMAGE hook
- Species pipeline validation for custom (non-variant) species — C240, verify during registration
- Sprite creation for Deoxys_Hoenn — Sprite Designer agent, hot pink/cyan palette, unsettling beauty aesthetic

## Key Design Decisions
- BST 600 (not 680): matches standard Deoxys, avoids unprecedented power creep
- Offensive Toxic Touch (not defensive Poison Point clone): differentiates, rewards aggression, fits glass cannon
- Separate species entry (not dynamic form-change): validated as fewer bugs on vanilla pokeemerald
- Sky Pillar summit for Quest III: thematic resonance with Rayquaza's domain and cosmic connection
- 30% poison rate on Toxic Touch: matches Gen 5 Poison Touch, strong but not overwhelming

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2A5. Quest 6 Resonance uses 0x29C-0x29F. C235 Nurse witness: 0x2A0. C236 Resonance Residue: 0x2A1-0x2A2. Quest 7 reserved: 0x2A3-0x2A4.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (20 total)**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420), Dusknoir(421), Honchkrow(422), Froslass(423), Mamoswine(424), Bagon_Hoenn(425), Vulpix_Hoenn(426), Ninetales_Hoenn(427), Farigiraf(428), Pinsir_Hoenn(429), Stantler_Hoenn(430), Deoxys_Hoenn(431). EGG=432, NUM_SPECIES=432.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). Quest 6 uses 4-state (STARTED -> METEOR + OCEAN -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, found in Shoal Cave low-tide room.
