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

**Encounter**: Meteor Falls, postgame, requires Champion + researcher callback seen. 4% encounter rate, Lv28-30. The researcher's presence contextualizes the find.

## Postgame Density Audit (C211)

12 distinct postgame content threads exist. One genuine gap (Bagon Colony) addressed by v2.0 C215.

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Status |
|-------|------|-----------|--------|
| C211 | planning | v2.0 vision, Bagon decision, postgame audit, roadmap | DONE |
| C212 | feature | Cross-gen batch 1: **Dusknoir** + **Honchkrow**. Phoebe + Sidney teams. | DONE |
| C213 | feature | Cross-gen batch 2: **Froslass** + **Mamoswine**. Glacia teams + dialogue. | DONE |
| C214 | feature | Cross-gen batch 3: **Farigiraf**. Tate & Liza team updated. **Petalburg downgrade NPC**. | NEXT |
| C215 | feature | **Bagon_Hoenn** (Dragon/Rock) — species pipeline + Meteor Falls encounter + researcher update. | — |
| C216 | planning | Mid-arc checkpoint. Community reception of cross-gen evos + Bagon. Decide #128 (character) and #130 (Deoxys) scope. | — |
| C217 | feature | Graphical tweaks (#108) — evaluate and implement feasible items. | — |
| C218 | feature | Documentation pass (#115) — README expansion, player guide, feature list. | — |
| C219-C220 | feature | Community-driven or polish — determined by C216 review. | — |
| C221 | refactor | Quality pass — validation scripts, sprite iterations from community feedback. | — |
| C222-C223 | feature | Open — new character (#128), additional forms (#118), or Deoxys expansion (#130). | — |
| C224 | planning | v2.0 wrap-up review. Assess completeness, plan v2.1 or v3.0. | — |
| C225 | feature | Final v2.0 polish and ship. | — |

### Cross-Gen Implementation Notes

Ad-hoc scripts per batch (C212: Dusknoir+Honchkrow, C213: Froslass+Mamoswine). Each script handles ~22 files. Manual patches still needed for: pokemon.c (3 mapping arrays), anim_mon_front_pics.c, enemy_mon_elevation.h (if floating), evolution.h (pre-evo gains new path). Consider building a reusable cross-gen evo script for C214 (Farigiraf) if the pattern holds.

## Issue Triage

| Issue | Deferrals | v2.0 Plan |
|-------|-----------|-----------|
| #127 Cross-gen species | 1 | **HIGH**. C212-C214 ships all 5 species. v2.0 flagship. |
| #108 Graphical tweaks | 2 | MEDIUM. C217. Evaluate per-item; implement what's feasible. |
| #115 Improved docs | 2 | MEDIUM. C218. README expansion + feature list. |
| #118 More regional forms | 1 | LOW. Bagon_Hoenn (C215) partially addresses. More only if demand at C216. |
| #126 Bagon/Vulpix redundancy | — | **RESOLVED**. Bagon_Hoenn proceeds as Dragon/Rock. Vulpix_Hoenn stays. |
| #128 New character | 1 | LOW. Evaluate at C216. |
| #130 Deoxys quest expansion | 1 | LOW. Evaluate at C216. |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x29B.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 114. Next: 115.
- **Custom species**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420), Vulpix_Hoenn(421), Ninetales_Hoenn(422), Froslass(423), Mamoswine(424). NUM_SPECIES=426.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
