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

*Draft — Cycle 39*

---

## Creative Manifesto

v2.0 is not a port. It is a redesign built on a new foundation.

The physical/special split changes how every battle feels. Fairy type introduces genuine counterplay to the Dragon-heavy ecosystem. The expanded species pool gives the migration narrative the depth it deserves.

**Three "wow moments":**
1. Tyranitar's Crunch now hits like a freight train — physical, visceral, alarming
2. A Togekiss on a late-game route threatens the Dragon they've been relying on
3. The mid-game migration intensification event on Route 118 — the world shifting again

---

## Physical/Special Split — Combat Feel

| Species | Key Move | Old | New | Impact |
|---------|----------|-----|-----|--------|
| Tyranitar | Crunch | Special 95bp | Physical 130bp | Devastating wallbreaker |
| Salamence | Dragon Claw | Special 80bp | Physical 80bp | Strong physical attacker |
| Dragonite | ExtremeSpeed | Special 80bp | Physical 80bp | Priority sweeper — rival alarming |

**Wholesale shifts** (affects trainer team review, Cycles 42–44):
- Dark → Physical: Crunch, Bite, Night Slash, Pursuit
- Ghost → Physical: Shadow Sneak (new); Shadow Ball stays Special
- Fighting → mostly Physical; Focus Blast new Special
- Rock, Steel → mostly Physical

**Balance concern**: Tyranitar's Crunch shift may widen Larvitar advantage. If too dominant after Cycle 41 migration, reduce base Attack 134→120.

---

## Fairy Type — Encounter Philosophy ("Fairy Corridors")

Design principle: Fairy creates counter-pressure to Dragons, not replacement. Routes near ancient/spiritual locations become "Fairy corridors."

**Proposed encounters (Cycles 45–46):**

| Route / Location | Species | Rate | Levels | Narrative Role |
|-----------------|---------|------|--------|----------------|
| Granite Cave B2F | Ralts | 10% | 15–18 | Early rare — patience rewarded |
| Route 118 | Snubbull | 15% | 26–30 | Second wave guardian energy |
| Route 120 | Togetic | 10% | 28–32 | First Dragon-counterplay route |
| Route 121 | Clefairy | 20% | 26–30 | Fairy sanctuary near Safari Zone |
| Safari Zone Area 4 | Togekiss | 5% | 40 | Apex Fairy — reward-tier |
| Route 122 (Mt. Pyre) | Snubbull | 20% | 28–32 | Guardian of the spirit mountain |

**Gardevoir retype**: Psychic/Fairy in v2.0 (species type change only — no new encounter needed).

---

## New Species — Gen 4/5 Migration

**To be added in Cycles 45–46:**

| Species | Location | Rate | Levels | Narrative Role |
|---------|----------|------|--------|----------------|
| Gible | Meteor Falls B1F-2R | 8% | 22–26 | Garchomp's vanguard |
| Garchomp | Victory Road B2F | 5% | 44–48 | Dragon apex predator |
| Riolu | Route 116 | 8% | 12–15 | Scout sensing disruption |
| Lucario | Granite Cave B2F | 5% | 20–24 | Aura senses disrupted |
| Sneasel | Route 120 | 12% | 26–30 | Ice/Dark following prey |
| Weavile | Shoal Cave | 8% | 30–34 | Cold-zone apex hunter |

**Not adding in v2.0**: Additional legendaries or pseudo-legendaries beyond Gible/Garchomp.

---

## Narrative Twist — Issue #23: The Second Wave

After Mt. Chimney showdown, a second migration wave hits overnight. Three touch points (dialogue-only, no new event triggers):

**Touch point 1 — Rival on Route 118:**
> "Three of my team went back with the new wave last night. Just... left. These four stayed. I keep asking myself whether I should feel abandoned — or whether the ones who stayed made a choice."
> "Professor Birch called. Says the second wave is bigger than the first. Different species. Things from further away."

**Touch point 2 — NPC near Mauville City Pokémon Center:**
> "My brother works with Professor Birch. He says the instruments went haywire two nights ago — migration density doubled in six hours. Whatever was holding them back before isn't holding anymore."

**Touch point 3 — Elite Four Phoebe (update existing file):**
> "The first migration woke the old spirits. The second wave... even they weren't ready. You've been walking through both. I can feel it on you."

*Implementation*: Route 118 scripts.inc one-time NPC after Mt. Chimney event flag; Mauville Center NPC; Phoebe dialogue edit (file already modified Cycle 33).

---

## Postgame — Elite Four Rematches

| Leader | Key Upgrade |
|--------|-------------|
| Sidney | Absol gets Night Slash + Swords Dance |
| Phoebe | Dusknoir joins (replaces Dusclops) + Shadow Sneak |
| Glacia | Glaceon joins; Ice Shard |
| Drake | Garchomp added as 6th at level 60 |
| Wallace | Milotic gets Moonblast; Kingdra redesigned as Water/Dragon |

---

## Technical Migration Roadmap — REVISED (Cycle 40 Research)

**MIGRATION DECISION: PROCEED** — Physical/Special split + Fairy type justify the development cost.

### Phase 1: Foundation Migration (Cycles 41-44)
| Cycle | Objective |
|-------|-----------|
| **41** | Initial migration — add RHH remote, pull expansion/1.15.0, document conflicts |
| **42** | Trainer format conversion — migrate all 365+ trainer parties to .party format |
| **43** | Conflict resolution — wild encounters, QoL features, species data integration |
| **44** | Build validation + damage calc verification — ensure P/S split works correctly |

### Phase 2: Content Restoration (Cycles 45-47)
| Cycle | Objective |
|-------|-----------|
| **45** | Legends of Hoenn identity restoration — custom encounters, held items, dialogue |
| **46** | Physical/Special rebalancing — review all trainer teams for new damage calculations |
| **47** | v2.0 content integration — Fairy corridors, Gen 4/5 species, narrative twist |

### Phase 3: Polish & Release (Cycles 48-50)
| Cycle | Objective |
|-------|-----------|
| **48** | Elite Four postgame expansion — leverage new battle engine features |
| **49** | Balance pass + playtesting — damage verification, difficulty curve |
| **50** | v2.0 release — major version bump with "Beta" release stage |

**CRITICAL BREAKING CHANGE**: `trainer_parties.h` → `trainers.party` format requires complete trainer recreation.

**Migration Scripts**: `trainer_party_balls_type_change.py`, `givemon_balls_typechange.py` handle most automation.

**Complexity Assessment**: HIGH — but justified by Physical/Special split impact on combat feel.

**Version bumps**: `"minor"` after Cycle 44 (migration complete); `"major"` + `"release_stage": "Beta"` after Cycle 50.
