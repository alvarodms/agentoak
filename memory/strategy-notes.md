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

---

# v2.0: "Deeper Roots" (C212-C225)

## Creative Vision

v1.9 completed the narrative arc — from Birch's lab to Deoxys, the story lands. v2.0 asks: **what grows in settled ground?**

"Deeper Roots" has a dual meaning. First, cross-generation evolutions — species that already live in Hoenn discovering new evolutionary paths (Dusknoir, Froslass, Mamoswine, Honchkrow, Farigiraf). The migration didn't just bring new species; it unlocked latent potential in existing ones. Second, the Bagon Colony's resolution: the dragon that dreamed of flight has put down roots in Meteor Falls, its children hardening into something new.

Where v1.9 was wide (E4 overhaul, quests, forms, resolution), v2.0 is deep. No new quest chains. No new narrative arcs. Instead: making every existing system richer. The E4 gains cross-gen evolutions that make their teams feel modern and complete. The Bagon Colony thread resolves with a tangible encounter. The Petalburg difficulty NPC ships. Graphical rough edges get smoothed. Documentation catches up to the feature set.

The player experience goal: a second playthrough reveals new details. Glacia fields a Froslass. Sidney's Honchkrow presides. Tate & Liza share a Farigiraf. And in Meteor Falls, where Drake once spoke of dragons who "choose to stay," the proof waits in the dark.

## Design Ruling: Bagon_Hoenn (Dragon/Rock)

**Decision**: Ship Bagon_Hoenn as Dragon/Rock. Standalone form — no Shelgon_Hoenn or Salamence_Hoenn in v2.0.

**Species**: Bagon_Hoenn | **Typing**: Dragon/Rock | **BST**: ~310 (base Bagon is 300: shift +Def, +SpDef, -Spd, -Atk)
**Ability**: Rock Head (retained) / Sturdy (hidden — thematic for a cave-hardened dragon)

**Narrative justification**: Every other regional form in Legends of Hoenn represents outsiders adapting TO Hoenn — Corsola bleaching near graves, Vulpix crystallizing in ash, Growlithe absorbing ocean currents. Bagon_Hoenn represents the inverse: Hoenn itself changing in response to the migration. The colony juveniles stopped dreaming of flight. They burrowed into Meteor Falls' walls, their scales hardening into mineral composites. This isn't redundancy — it's narrative completion. The migration didn't just bring newcomers; it changed the residents.

**Why not Ekans/Arbok (#126 alternative)**: The C209 researcher callback specifically describes juvenile Bagon physically changing (rocky scales, stopped leaping). Pivoting to a different species makes that dialogue a dead-end thread.

**Why standalone (no evo line)**: The researcher says juveniles are "changing" — present tense, in progress. Whether these Bagon eventually evolve into something beyond Salamence is an open question for the player and for future versions. Shipping Bagon_Hoenn alone keeps the narrative honest and avoids pseudo-legendary balance scrutiny that comes with a full 3-stage line.

**Encounter**: Meteor Falls, postgame, requires Champion + researcher callback seen. 4% encounter rate, Lv28-30. The researcher's presence contextualizes the find.

**Drake connection**: Drake's E4 speech references the colony ("When the world shifts beneath you — do you change, or hold the line?"). Encountering the answer — they changed — is the payoff.

## Postgame Density Audit (C211)

12 distinct postgame content threads exist. Assessment:

1. **"What next?" signal**: GOOD. Birch's postgame call (Research Quest) fires immediately. Beast release triggers automatically. Side quests discovered through organic travel.
2. **Gating logic**: GOOD. Quests require Champion status; some chain (Second Signal requires Mossdeep Signal). Legendary saga gates progression (beasts → Ho-Oh → Primal → Rayquaza).
3. **Location overload**: MINOR. Space Center hosts 2 quests, but they're sequential (Signal → Second Signal). Acceptable.
4. **Dead-end threads**: ONE. Bagon Colony researcher callback (C209) leads nowhere gameplay-wise. v2.0 resolves this (C215).
5. **Emotional pacing**: GOOD. Alternates legendary urgency and quiet discovery. Second Signal ends on mystery (Deoxys), giving a hook.

**Verdict**: Rich but not cluttered. One genuine gap (Bagon Colony) addressed by v2.0.

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Dependencies |
|-------|------|-----------|--------------|
| C211 | planning | v2.0 vision, Bagon decision, postgame audit, roadmap | — |
| C212 | feature | Cross-gen batch 1: **Dusknoir** + **Honchkrow**. Phoebe + Sidney teams updated. | — |
| C213 | feature | Cross-gen batch 2: **Froslass** + **Mamoswine**. Glacia team updated. | — |
| C214 | feature | Cross-gen batch 3: **Farigiraf**. Tate & Liza team updated. **Petalburg downgrade NPC**. | — |
| C215 | feature | **Bagon_Hoenn** (Dragon/Rock) — species pipeline + Meteor Falls encounter + researcher update. | C209 seed |
| C216 | planning | Mid-arc checkpoint. Community reception of cross-gen evos + Bagon. Decide #128 (character) and #130 (Deoxys) scope. | C212-C215 |
| C217 | feature | Graphical tweaks (#108) — evaluate and implement feasible items. | C216 review |
| C218 | feature | Documentation pass (#115) — README expansion, player guide, feature list. | — |
| C219 | feature | Community-driven or polish — slot determined by C216. | C216 |
| C220 | feature | Community-driven or polish — slot determined by C216. | C216 |
| C221 | refactor | Quality pass — validation scripts, sprite iterations from community feedback. | — |
| C222 | feature | Open — new character (#128) if approved at C216, or additional forms (#118). | C216 |
| C223 | feature | Open — Deoxys expansion (#130) if approved at C216, or polish. | C216 |
| C224 | planning | v2.0 wrap-up review. Assess completeness, plan v2.1 or v3.0. | All |
| C225 | feature | Final v2.0 polish and ship. | C224 |

### Cross-Gen Implementation Notes

The species pipeline (`add_regional_form.cjs`) handles regional forms but not new evolutionary stages. Cross-gen evos add entirely new species (not variants of existing ones) and must also update the pre-evolution's evolution table. Options: (a) extend the script, (b) create a new `add_cross_gen_evo.cjs`, or (c) manual pipeline (~40-60 actions per species). Recommend evaluating at C212 start — if 2 species per cycle is tight, build the script first.

## Issue Triage

| Issue | Deferrals | v2.0 Plan |
|-------|-----------|-----------|
| #127 Cross-gen species | 1 | **HIGH**. C212-C214 ships all 5 species. v2.0 flagship. |
| #108 Graphical tweaks | 2 | MEDIUM. C217. Evaluate per-item; implement what's feasible. |
| #115 Improved docs | 2 | MEDIUM. C218. README expansion + feature list. |
| #118 More regional forms | 1 | LOW. Bagon_Hoenn (C215) partially addresses. More only if demand at C216. |
| #126 Bagon/Vulpix redundancy | — | **RESOLVED**. Bagon_Hoenn proceeds as Dragon/Rock. Vulpix_Hoenn stays (embedded in E4+3 cycles). |
| #128 New character | 1 | LOW. Evaluate at C216. Custom characters need narrative justification + multi-cycle commitment. |
| #130 Deoxys quest expansion | 1 | LOW. Evaluate at C216 after player feedback. 10-cycle ask is overscoped; max 2-3 cycles if expanded. |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. v1.8: 0x28A-0x297. Deoxys quest: 0x298-0x29A. Next available: 0x29B.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 114. Next: 115.
- **Custom species**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420), Vulpix_Hoenn(421), Ninetales_Hoenn(422). NUM_SPECIES=423.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
