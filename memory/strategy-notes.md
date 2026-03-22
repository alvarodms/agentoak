# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

> **Maintenance**: Keep this file under ~200 lines. Delete completed roadmap items older than 10 cycles. Remove research/analysis for decisions already made. This file is for *current* vision, *active* plans, and *live* technical reference — not a historical archive.

---

# LEGENDS OF HOENN — v1.0 (Complete)

**Vision**: Pokémon Emerald reimagined with powerful migrant species on every route. Starters: Larvitar/Bagon/Dratini (pseudo-legendary lines). Every encounter worth catching. Every trainer a real fight.

**Thematic conceit**: A migration event has disrupted Hoenn's ecosystem. Rare Pokémon from across the world have arrived. Gym leaders adapted. Birch is studying it. The player arrived at the perfect moment.

**Starter → Rival correspondence** (Cycle 12): Larvitar→rival gets Bagon; Bagon→rival gets Dratini; Dratini→rival gets Larvitar.

**Encounter philosophy**: Routes as ecosystems. 101–103 introductory, 104–116 escalating, 117–123 peak diversity. Dungeons are specialist habitats.

**Cycles 2–38 scope** (see `completed-work.md` for files): All encounters (73 routes + 34 dungeons), gym/Elite Four/rival/villain teams, trainer + wild held items (164 species), NPC migration dialogue arc (Birch→Wallace), reusable TMs, TM prices halved, Earthquake pre-Gym 4, auto-run from first step. **v1.0 released.**

---

## Technical Reference

### Trainer Modification Checklist
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2–5, for Match Call)
3. Ensure levels scale for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (0–11); probabilities 20/20/10/10/10/10/5/5/4/4/1/1
- Water: 5 slots; Fishing: 10 slots
- File: `pokeemerald/src/data/wild_encounters.json`

### QoL Reference
- **Reusable TMs**: Deleted 2 lines in `src/party_menu.c`
- **Auto-Run**: `(heldKeys & B_BUTTON)` removed; `FlagSet(FLAG_SYS_B_DASH)` in `new_game.c`

### Trainer ID Constraints (Updated Cycle 71)
- **Current state**: 874 trainer IDs (0x500-0x869) — extended in Cycle 71 for E4 rematch tiers 3-4
- **Removed**: TRAINER_GRUNT_UNUSED (568), TRAINER_BRENDAN_PLACEHOLDER (853), TRAINER_MAY_PLACEHOLDER (854), + 1 more in Cycle 52

---

# LEGENDS OF HOENN v2.0 — Game Design Document

## Creative Manifesto

v2.0 is not a port. It is a redesign built on a new foundation.

The physical/special split changes how every battle feels. Fairy type introduces genuine counterplay to the Dragon-heavy ecosystem. The expanded species pool gives the migration narrative the depth it deserves.

---

## Postgame — Elite Four Rematches

**Tier 1 (Cycle 49)**: All 5 members have 6-mon rematch teams (lv60-71). Gen 3 only.

**Tier 2 (Cycle 50)**: All 5 members have escalated teams (lv72-82). Key changes:

| Leader | Tier 2 Highlights |
|--------|-------------------|
| Sidney | Crawdaunt(SD)/Sharpedo/Absol(CB)/Houndoom/Umbreon(trap)/Tyranitar(DD+Iron Tail ace) |
| Phoebe | Banette(WoW)/Sableye(CM)/Misdreavus(CM)/Dusclops(Curse)/Gengar(Destiny Bond)/Gengar(Hypnosis ace) |
| Glacia | Glalie(Explode)/Jynx(Lovely Kiss+CM)/Cloyster(Spikes+Explode)/Piloswine/Walrein(Sheer Cold)/Lapras(Sheer Cold ace) |
| Drake | Flygon(CB)/Altaria(DD)/Kingdra(Rain)/Salamence×2(mixed+DD)/Dragonite(DD+Outrage+Liechi ace) |
| Wallace | Starmie/Tentacruel/Ludicolo(Rain+Swift Swim)/Gyarados(DD+Waterfall)/Kingdra(Rain)/Milotic(Moonblast ace) |

**Rematch table**: All 5 slots used — base, tier 1, tier 2, tier 3, tier 4. Trainer ceiling at 874.

---

## v2.0 Roadmap — Status

| Priority | Feature | Status |
|----------|---------|--------|
| 1 | Physical/Special split | **DONE** (Cycle 43) |
| 2 | Fairy type engine + retypes + moves | **DONE** (Cycles 44, 46) |
| 3 | Fairy encounter corridors | **DONE** (Cycle 49) |
| 4 | Elite Four rematches tier 1 | **DONE** (Cycle 49) |
| 5 | Elite Four rematches tier 2 | **DONE** (Cycle 50) |
| 6 | Second Wave dialogue (3 NPCs) | **DONE** (Cycle 42) |
| 7 | Postgame narrative polish (5 NPCs) | **DONE** (Cycle 50) |
| 8 | Trainer ID ceiling fix | **DONE** (Cycle 52 — 864 IDs = 864 flag slots) |
| 9 | New species (Gible, Riolu, etc.) | **Riolu/Lucario DONE** (Cycle 60). **Weavile DONE** (Cycle 61). **Gible/Gabite DONE** (Cycle 68). **Garchomp DONE** (Cycle 70). |
| 10 | Elite Four rematches tiers 3-4 | **DONE** (Cycle 71 — Weavile/Garchomp/Lucario showcase, lv78-95) |
| 11 | Gym leader rematches tier 1 | **DONE** (Cycle 54 — all 8 leaders, lv57-71, 4 tiers) |
| 12 | Mid-game route trainer refresh (110-112, 119-120) | **DONE** (Cycle 55 — 28 trainers, migration species, P/S split showcase) |
| 13 | Water route trainer refresh (105-109) | **DONE** (Cycle 56 — 35 trainers + 24 rematches, ocean migration corridor, 4 route aces) |
| 14 | Early-game route trainer refresh (102-104) | Needs verification — partially covered in Cycle 56 |
| 15 | Late-game route trainer refresh (113-118, 121-123) | **DONE** (Cycle 57 — 83 trainers across 9 routes, migration species, held items, custom movesets) |
| 16 | Victory Road + dungeon trainer refresh | **DONE** — Victory Road (Cycle 58), villain dungeons (Cycle 72, 36 trainers), Mt. Pyre interior (Cycle 73, 8 trainers). Note: Granite Cave & Shoal Cave have zero trainers in vanilla — no refresh needed. |

---

## Future Directions

### New Species Pipeline (Proven in Cycle 60)
**Checklist**: `memory/pokemon-knowledge/species-addition-pipeline.md` — 25 steps, ~29 source files per 2-species family.
**Status**: Pipeline proven with Riolu/Lucario. Build-clean on first attempt. Ready to scale.
**Placeholder strategy**: Copy existing graphics + cries. Replace with real art later.

| Species | Location | Rate | Narrative Role |
|---------|----------|------|----------------|
| ~~Riolu~~ | Route 116 | 8% | **DONE** (Cycle 60) |
| ~~Lucario~~ | (evolves via friendship) | — | **DONE** (Cycle 60) |
| Gible | Meteor Falls B1F-2R | 8% | Garchomp's vanguard (future) |
| Garchomp | Victory Road B2F | 5% | Dragon apex predator (future) |
| ~~Gible~~ | Meteor Falls B1F_1R | 2% | **DONE** (Cycle 68) — Dragon/Ground, lv25-30, slots 10-11 |
| ~~Gabite~~ | (evolves at lv24) | — | **DONE** (Cycle 68) |
| ~~Garchomp~~ | Victory Road B2F | 2% | **DONE** (Cycle 70) — Dragon/Ground, lv40-44, slots 10-11, SPECIES_GARCHOMP 417 |
| ~~Weavile~~ | Shoal Cave Ice Room | 8% | **DONE** (Cycle 61) — Sneasel→Weavile evo at lv40 |

### Second Wave Event (Designed Cycle 62)

**Full spec:** `memory/second-wave-design.md`
**Summary:** Mid-game migration intensification triggered by Route 118 Steven encounter (post-Norman). FLAG_SECOND_WAVE swaps encounter tables on 6 eastern routes, adds 14 new species to wild encounters (Gligar, Kangaskhan, Heracross, Scyther, Murkrow, Misdreavus, Tauros, Miltank, Ursaring, Donphan, Pinsir, Stantler, Nidoking, Nidoqueen), plus evolved first-wave species (Houndoom, Arcanine, Dragonair, Pupitar, Shelgon, Clefable). 8 NPCs with before/after dialogue.

**Implementation roadmap:**
| Cycle | Scope | Status |
|-------|-------|--------|
| 63 | Trigger + C code + Route 118 dialogue + ALL 6 encounter tables | **DONE** — flags.h, wild_encounter.c, Route118/scripts.inc, wild_encounters.json |
| 64 | NPC dialogue (Routes 119-121, Fortree, Mauville) — 5 scripts.inc + 2 map.json | **REVERTED** (build failed — missing assets + smart-quote encoding) |
| 65 | Re-land NPC dialogue + fix asset persistence + fix encoding | **DONE** — all 5 scripts + 2 map.json + placeholder assets committed |

### Future Narrative
- Postgame research quest for Birch

### Gym Leader Rematches (Cycle 54 — DONE)

All 8 gym leaders redesigned with competitive migration-themed teams:

| Leader | Ace (Migration) | Levels | Strategy |
|--------|----------------|--------|----------|
| Roxanne | Tyranitar (DD) | 57-62 | Fossil team + Steelix/Tyranitar migration |
| Brawly | Hariyama (Bulk Up) | 57-62 | Choice Band fighters + Heracross migration |
| Wattson | Electabuzz (coverage) | 57-62 | Rain + Baton Pass Jolteon + Electabuzz migration |
| Flannery | Houndoom (Sun) | 57-62 | Sun team + Arcanine/Houndoom migration |
| Norman | Slaking (ace) | 57-62 | CB Slaking + Snorlax/Blissey migration |
| Winona | Dragonite (DD) | 57-62 | Spikes+Whirlwind + Crobat/Dragonite migration |
| Tate&Liza | Slowking (CM) | 57-62 | CM sweepers + Alakazam/Slowking migration |
| Juan | Starmie (BoltBeam) | 57-62 | Rain + CB Crawdaunt + Lapras/Starmie migration |

4 rematch tiers: _2 (lv57-62), _3 (+3), _4 (+6), _5 (+9). All have 6 mons, held items, 4x Full Restore, smart AI.