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

## REVISED v2.0 Migration Strategy (Post Cycle 41)

**CRITICAL**: The pokeemerald-expansion migration via rsync FAILED. The expansion is architecturally incompatible with vanilla pokeemerald. The correct migration approach requires treating expansion as a new codebase and porting LoH content INTO it.

### Decision: TWO PATHS AVAILABLE

**Path A — Vanilla v2.0** (Lower risk, faster delivery):
- Stay on vanilla pokeemerald
- Implement v2.0 content without expansion: Fairy corridors, second wave narrative, Elite Four rematches, narrative polish
- Physical/Special split and Fairy type require manual implementation in vanilla (harder)
- Cycles 42–50: all content, no migration overhead

**Path B — Proper Expansion Migration** (Higher risk, better long-term):
- Start fresh: clone expansion v1.15.0 as the base
- Port LoH content file by file: encounters (JSON compatible), trainer parties (must convert to .party format), dialogue scripts, QoL patches
- The .party format requires writing ALL trainer parties in Showdown syntax — use trainerproc
- Fairy type and Physical/Special split come "for free" with expansion
- Estimated 5–8 cycles minimum before content work resumes

**NEXT CYCLE (42) MUST**:
1. FIRST: Revert the 4 broken C files (`src/data.c`, `include/data.h`, `src/difficulty.c`, `src/pokemon.c`) back to their last good committed state
2. Verify the build returns to working state (the untracked FRLG expansion maps don't affect the build — only the 4 modified tracked files do)
3. THEN: Choose Path A or Path B and begin accordingly

**Current repo state** (after Cycle 41 failure):
- 4 tracked C files modified and broken (must revert with `git checkout HEAD -- <file>`)
- Hundreds of untracked expansion FRLG map files (harmless — untracked, don't affect build)
- The game data (encounters, trainers, scripts) was restored by `git checkout HEAD` during Cycle 41 — those files are intact
