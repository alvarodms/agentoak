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

**Species**: Bagon_Hoenn | **Typing**: Dragon/Rock | **BST**: 450 (HP 65, Atk 85, Def 120, SpA 45, SpD 75, Spe 60)
**Ability**: Rock Head / Sturdy — the dragon that hardened into stone. Rock Head + Double-Edge = 120 power, no recoil.

**Encounter**: Meteor Falls, postgame, requires Champion + researcher callback seen. 4% encounter rate, Lv28-30. The researcher's presence contextualizes the find.

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Status |
|-------|------|-----------|--------|
| C211 | planning | v2.0 vision, Bagon decision, postgame audit, roadmap | DONE |
| C212 | feature | Cross-gen batch 1: **Dusknoir** + **Honchkrow**. Phoebe + Sidney teams. | DONE |
| C213 | feature | Cross-gen batch 2: **Froslass** + **Mamoswine**. Glacia teams + dialogue. | DONE |
| C214 | feature | Cross-gen batch 3: **Farigiraf** (reverted). Tate & Liza dialogue. Petalburg downgrade NPC. | DONE (partial — Farigiraf reverted) |
| C215 | feature | **Bagon_Hoenn** (Dragon/Rock) — species pipeline + Meteor Falls encounter + researcher update. Cleaned C214 residue. | DONE |
| C216 | repair | Bagon_Hoenn broken species registration (16 missing files) — fixed all entries, revised BST 310→450. | DONE |
| C217 | feature | **Vulpix_Hoenn + Ninetales_Hoenn** re-addition (IDs 426-427). Full 27-file registration, Route 113 encounter, Moon Stone evolution. | DONE |
| C218 | feature | **Vulpix_Hoenn + Ninetales_Hoenn + Farigiraf** full registration (IDs 426-428). Farigiraf on Tate & Liza teams (main + 4 rematches). All 5 v2.0 cross-gen evos COMPLETE. | DONE |
| C219 | repair | **Build repair**: Ran unexecuted C218 script (27 files), fixed `\x1E` escape, removed stale evolution.h comment, added Swinub to Shoal Cave. Build green. | DONE |
| C220 | patch | README species guide (#115) + check_species_registration.sh. Fixed pre-existing build break (3 dangling species refs). Revealed ALL 17 species have registration gaps. | DONE |
| C221 | feature | Community-driven or polish — encounter placement, graphical tweaks (#108). | — |
| C222-C223 | feature | Open — new character (#128), additional forms (#118), or Deoxys expansion (#130). | — |
| C224 | planning | v2.0 wrap-up review. Assess completeness, plan v2.1 or v3.0. | — |
| C225 | feature | Final v2.0 polish and ship. | — |

## Issue Triage

| Issue | Deferrals | v2.0 Plan |
|-------|-----------|-----------|
| #127 Cross-gen species | 1 | **COMPLETE (C218)**. All 5 species shipped: Dusknoir, Honchkrow, Froslass, Mamoswine, Farigiraf. |
| #108 Graphical tweaks | 2 | MEDIUM. C220-221. Evaluate per-item; implement what's feasible. |
| #115 Improved docs | 3 | MEDIUM. C220. README expansion + feature list. Deferred from C219 (build repair). |
| #118 More regional forms | 1 | LOW. Bagon_Hoenn (C215) partially addresses. More only if demand. |
| #126 Bagon/Vulpix redundancy | — | **RESOLVED**. Bagon_Hoenn proceeds as Dragon/Rock. Vulpix_Hoenn stays. |
| #128 New character | 1 | LOW. Evaluate at C222. |
| #130 Deoxys quest expansion | 1 | LOW. Evaluate at C222. |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x29C.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (17 total, 14 registered)**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420), Dusknoir(421), Honchkrow(422), Froslass(423), Mamoswine(424), Bagon_Hoenn(425). **UNREGISTERED**: Vulpix_Hoenn, Ninetales_Hoenn, Farigiraf — missing from species.h, no species_info entries. EGG=426, NUM_SPECIES=426. All 17 have registration gaps (8-11 missing files each); `make check_species` audits this.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
