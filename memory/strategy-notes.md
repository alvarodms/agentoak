# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

> **Maintenance**: Keep this file under ~200 lines. Delete completed roadmap items older than 10 cycles. Remove research/analysis for decisions already made. This file is for *current* vision, *active* plans, and *live* technical reference — not a historical archive.

---

# LEGENDS OF HOENN — Game Design Document

*Version 1.0 — Cycle 5*

---

## 1. Vision Statement

**Legends of Hoenn** is a Pokémon Emerald ROM hack that reimagines Hoenn as a region teeming with powerful, rare, and legendary-adjacent Pokémon. Where vanilla Emerald gave you Zigzagoon and Poochyena on every early route, Legends of Hoenn drops you into a world where every encounter matters. The player begins with one of three pseudo-legendary lines and must navigate an ecosystem of powerhouses — Houndour packs prowling early routes, Dratini lurking in the rivers, Lapras crossing the southern seas.

**The core promise**: Every Pokémon you encounter is worth catching. Every trainer is a real fight. The story of Legends of Hoenn is the story of a trainer who builds a team of legends and earns their place in a world that doesn't make it easy.

---

## 2. Thematic Identity

### "The World Has Changed"

The conceit of Legends of Hoenn is that Hoenn's ecosystem has undergone a transformation — rare Pokémon from across the world have migrated into the region, disrupting the old hierarchy. Trainers who relied on common local Pokémon now struggle. The gyms have adapted their teams. Professor Birch is studying the phenomenon. The player, arriving at the perfect moment, chooses one of three migratory pseudo-legendary species that have appeared near Littleroot — and sets out into this newly wild Hoenn.

This framing explains:
- Why rare Pokémon appear on early routes
- Why gym leaders have unusual teams
- Why the rival is more dangerous than expected
- Why Team Magma/Aqua are more aggressively pursuing the legendaries (who have been drawn out by the ecological shift)

### The Three Starter Lines as Identity Choices

| Starter | Line | Type | Identity |
|---------|------|------|----------|
| **Larvitar** | → Pupitar → Tyranitar | Rock/Ground → Rock/Dark | The Crusher — slow early, unstoppable late |
| **Bagon** | → Shelgon → Salamence | Dragon/Flying | The Dreamer — evolves into the classic powerhouse |
| **Dratini** | → Dragonair → Dragonite | Dragon | The Legend — graceful, builds to an iconic finish |

### Starter → Rival Correspondence (Implemented Cycle 12)

| Player Picks | VAR_STARTER_MON | Rival Gets | Rival Theme |
|---|---|---|---|
| Larvitar (slot 0) | 0 (Treecko slot) | Bagon | Dragon/Flying — Sneasel/Scyther support |
| Bagon (slot 1) | 1 (Torchic slot) | Dratini | Dragon/Water — Horsea/Gyarados support |
| Dratini (slot 2) | 2 (Mudkip slot) | Larvitar | Dark/Rock — Houndour/Murkrow support |

---

## 3. Encounter Philosophy

Routes should feel like ecosystems, not random loot tables. Each route has a theme:
- **Route 101–103**: Introduction — accessible pseudo-legendaries, first Houndour/Dratini sightings
- **Route 104–116**: Escalation — diverse migrant species, rising power curve
- **Route 117–123**: Peak diversity — full legendary-adjacent roster available
- **Dungeons**: Specialist habitats — Granite Cave (Rock/Ground), Meteor Falls (Dragon), etc.

---

## 4. Completion Summary

**See `memory/completed-work.md` for the authoritative file-by-file registry of all modifications.**

### Major Milestones

| Cycle | Achievement |
|-------|-------------|
| 2, 12 | Starters: Larvitar/Bagon/Dratini |
| 3, 4 | All 73 route encounter tables |
| 5 | Game Design Document |
| 6 | Gym leader teams (all 8 + Champion) |
| 7, 12 | Rival teams (30 party definitions) |
| 8 | Elite Four + Champion teams |
| 9, 21 | Dungeon encounters (34 tables) |
| 10, 11 | Villain boss + admin custom moves |
| 14 | Safari Zone encounters |
| 15 | First NPC migration dialogue (Birch lab, Route 101, Littleroot) |
| 16, 17 | Held items for all trainers |
| 19 | Level curve rebalancing |
| 22 | TM prices halved |
| 23 | Move tutor: Earthquake pre-Gym 4 |
| 24 | Birch opening sequence → migration mystery |
| 25 | Rival dialogue arc (Route 103/110/Lilycove) |
| 27 | Villain dialogue (Maxie + Archie, all scenes) |
| 28 | NPC flavor text: early game (12 NPCs, Littleroot→Slateport) |
| 29 | NPC flavor text: mid-game (11 NPCs, Mauville→Lilycove) |
| 31, 32 | Wild held items for 164 species |
| 32 | Gym leader dialogue: Roxanne through Winona |
| 33 | Elite Four + Champion + Tate & Liza + Juan dialogue; late-game NPCs |
| 35 | Reusable TMs |
| 36 | Rewrote gym leader/rival/villain dialogue — inadvertently replaced cycles 25/27/32/33 work |
| 38 | Cycle 36 dialogue audited (Roxanne/Archie good; Maxie/rivals improved with species specificity); auto-run fixed |

---

## 5. Technical Reference

### Trainer Modification Checklist
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2–5, for Match Call)
3. Ensure levels scale appropriately for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (indices 0–11), water: 5 slots (0–4), fishing: 10 slots (0–9)
- Slot probabilities: 20/20/10/10/10/10/5/5/4/4/1/1 for land
- File path: `pokeemerald/src/data/wild_encounters.json`

### Known Valid Species (confirmed compile)
LARVITAR, BAGON, BELDUM, ELECTABUZZ, FLAAFFY, GROWLITHE, ARCANINE, MAGMAR, MAGBY, JYNX, SWINUB, SNORUNT, KANGASKHAN, GLIGAR, ABSOL, SABLEYE, CORSOLA, REMORAID, OCTILLERY, MANTINE, LANTURN, CHINCHOU, RELICANTH, MILOTIC, BLISSEY, TOGETIC, HERACROSS, SCYTHER, PINSIR, DRAGONAIR, KINGDRA, LAPRAS, CLOYSTER, SHELLDER, HOUNDOUR, HOUNDOOM, TRAPINCH, SWABLU, DRATINI, GASTLY, HAUNTER, ABRA, MISDREAVUS, DUSKULL, SNEASEL, STARMIE, ALAKAZAM

---

## 6. v1.0 Status & Roadmap

### v1.0 Scope Definition

v1.0 is feature-complete when ALL of the following are true:
- [x] Narrative arc coherent end-to-end (Birch → Wallace) — VERIFIED (Cycle 34)
- [x] Wild held items implemented — COMPLETE (Cycles 31/32)
- [x] Reusable TMs — COMPLETE (Cycle 35)
- [x] Final build compiles cleanly — VERIFIED (Cycle 37)
- [x] Release notes written — COMPLETE (Cycle 37)

### Current Roadmap

| Cycle | Objective | Priority |
|-------|-----------|----------|
| ~~**37**~~ | ~~Final validation build + release candidate + release notes~~ | **DONE** |
| ~~**38**~~ | ~~Auto-run verified/fixed + Cycle 36 dialogue audit~~ | **DONE** |
| **39** | Draft v2.0 GDD for pokeemerald-expansion migration roadmap | **Next** |
| v2.0 | pokeemerald-expansion migration (phys/special split, Fairy, etc.) | Future |

### QoL Features Reference

**Reusable TMs** (DONE): Deleted 2 lines in `src/party_menu.c` → TMs no longer consumed.

**Auto-Run** (DONE, Cycle 38 verified): `(heldKeys & B_BUTTON)` removed in Cycle 37; player always runs when `FLAG_SYS_B_DASH` set. Cycle 38 added `FlagSet(FLAG_SYS_B_DASH)` to `new_game.c` so player runs from very first step.

---

## 7. pokeemerald-expansion (Deferred to v2.0)

Full analysis was done in Cycle 30. Key decision: **Do NOT attempt before v1.0 release.**

Benefits: Physical/special split, Fairy type, 480+ species, modern mechanics.
Approach: Clean rebase onto expansion, re-apply all custom data as targeted patches. Estimated 5-8 cycles.
Detailed analysis archived — refer to cycle 30 journal if needed.

---

## 8. v2.0 Vision — pokeemerald-expansion

**Core premise**: Physical/special split changes the entire combat feel. Fairy type reshapes the Dragon-heavy encounter tables fundamentally (Dragon routes become risky in new ways). 480+ species means encounter ecosystems can be far more differentiated.

**Design questions to answer in v2.0 Cycle 1**:
- Which new species best fit the migration narrative? (Garchomp in Victory Road, Lucario in Fighting-route dungeons, Togekiss as a reward-tier encounter, Sylveon in Fairy-themed routes)
- How do the starter lines change? Larvitar/Salamence/Dragonite all benefit from the phys/special split — does that change balance enough to require team retuning?
- Should Fairy replace some Dragon encounters on early routes, making Dragon more of a reward?

**Technical path** (from Cycle 30 research): Clean rebase onto pokeemerald-expansion, then re-apply all Legends of Hoenn customizations as targeted patches. Estimated 5-8 cycles after a stable v1.0 exists.
