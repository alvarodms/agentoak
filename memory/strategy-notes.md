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

---

# LEGENDS OF HOENN v2.0 — Game Design Document

## Creative Manifesto

v2.0 is not a port. It is a redesign built on a new foundation.

The physical/special split changes how every battle feels. Fairy type introduces genuine counterplay to the Dragon-heavy ecosystem. The expanded species pool gives the migration narrative the depth it deserves.

**Three "wow moments":**
1. Tyranitar's Crunch now hits like a freight train — physical, visceral, alarming
2. A Togekiss on a late-game route threatens the Dragon they've been relying on
3. The mid-game migration intensification event on Route 118 — the world shifting again

---

## Fairy Type — Encounter Philosophy ("Fairy Corridors")

**Proposed encounters:**

| Route / Location | Species | Rate | Narrative Role |
|-----------------|---------|------|----------------|
| Granite Cave B2F | Ralts | 10% | Early rare — patience rewarded |
| Route 118 | Snubbull | 15% | Second wave guardian energy |
| Route 120 | Togetic | 10% | First Dragon-counterplay route |
| Route 121 | Clefairy | 20% | Fairy sanctuary near Safari Zone |
| Route 122 (Mt. Pyre) | Snubbull | 20% | Guardian of the spirit mountain |

**Gardevoir retype**: Psychic/Fairy in v2.0 (species type change only).

**Implementation Status (Cycle 47)**:
- ✅ Granite Cave B2F: Ralts level 16-19 (10% rate) — replaced ABRA slot
- ✅ Route 118: Snubbull level 24-26 (15% rate) — replaced ELECTRIKE slot
- ✅ Route 121: Clefairy level 26-28 (20% rate) — replaced SHUPPET slot
- ⏳ Route 120: Togetic (planned)
- ⏳ Route 122 (Mt. Pyre): Snubbull (planned)

---

## New Species — Gen 4/5 Migration

| Species | Location | Rate | Narrative Role |
|---------|----------|------|----------------|
| Gible | Meteor Falls B1F-2R | 8% | Garchomp's vanguard |
| Garchomp | Victory Road B2F | 5% | Dragon apex predator |
| Riolu | Route 116 | 8% | Scout sensing disruption |
| Weavile | Shoal Cave | 8% | Cold-zone apex hunter |

---

## Narrative Twist — The Second Wave

After Mt. Chimney showdown, a second migration wave hits. Three touch points (dialogue-only):
- **Rival on Route 118**: Questions whether those who left chose to
- **NPC near Mauville City Pokemon Center**: Instruments went haywire — density doubled in six hours
- **Elite Four Phoebe**: First migration woke old spirits; second wave surprised even them

*Implementation*: Route 118 scripts.inc, Mauville Center NPC, Phoebe dialogue edit.

---

## Postgame — Elite Four Rematches

| Leader | Key Upgrade |
|--------|-------------|
| Sidney | Absol gets Night Slash + Swords Dance |
| Phoebe | Dusknoir joins (replaces Dusclops) |
| Glacia | Glaceon joins; Ice Shard |
| Drake | Garchomp added as 6th at level 60 |
| Wallace | Milotic gets Moonblast; Kingdra → Water/Dragon |

---

## v2.0 Migration Strategy — PATH A CHOSEN (Cycle 42)

**Decision**: Stay on vanilla pokeemerald. The expansion migration failed (Cycle 41) and is not worth the 5-8 cycle overhead. All v2.0 features will be implemented manually on vanilla.

**Physical/Special split**: Can be done on vanilla using the pret wiki guide (see `memory/pokemon-knowledge/vanilla-physical-special-split.md`). No expansion needed.

**Fairy type**: Manual implementation — add TYPE_FAIRY constant, update type effectiveness table, retype species (Ralts line, Clefairy line, etc.).

### v2.0 Roadmap (Cycles 43+)

| Priority | Feature | Status |
|----------|---------|--------|
| 1 | Second Wave dialogue (3 NPCs) | **DONE** (Cycle 42) |
| 2 | Physical/Special split | **DONE** (Cycle 43) — all 355 moves categorized |
| 3 | Fairy type engine + retypes | **DONE** (Cycle 44) — TYPE_FAIRY constant, type chart, UI, 14 species retypes |
| 3b | Fairy signature moves | **DONE** (Cycle 46) — 3 moves (Moonblast, Play Rough, Dazzling Gleam), learnsets for all 14 Fairy species |
| 3c | Fairy encounter corridors | **IN PROGRESS** — 3 of 5 corridors complete (Granite Cave B2F, Route 118, Route 121) |
| 4 | Elite Four rematches | After corridors — Sidney/Phoebe/Glacia/Drake/Wallace upgrades |
| 5 | Narrative polish pass | Ongoing |
