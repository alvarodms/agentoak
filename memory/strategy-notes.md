# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (Cycles 2-23): Starters, migration species on routes, trainers refreshed. Complete.
**v2.0** (Cycles 24-86): P/S split, Fairy type, 6 new species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (Cycles 89-96): Trainer held items, mid-game encounters/narrative, wild held items, Migration Tracker Quest. Complete.
**v4.0** (Cycles 98-105): Dungeon encounters, gym rematch redesign+dialogue, rival arc, Battle Speed QoL. Complete. Build green as of C106.

---

# v5.0 — "The Legends Awaken" (Cycles 107-116)

## Creative Thesis

The migration drew rare species to Hoenn — Larvitar in caves, Sneasel on mountains, Electabuzz in power plants. Now it draws something greater. Three legendary Pokémon, displaced from distant Johto by the same ecological upheaval, follow the migration corridors into Hoenn. The player doesn't just observe the migration anymore — they become part of its most dramatic chapter.

The word "Legends" in the title finally earns its meaning.

## Feature A: Roaming Migration Legendaries (Primary)

### Design Decisions

**Which legendaries**: Raikou, Entei, Suicune — the Legendary Beasts of Johto. They are:
- Iconic roamers (HGSS/FRLG/GSC precedent — players expect this gameplay)
- Thematically tied to natural forces (lightning, fire, water/wind) that mirror Hoenn's ecological disruption
- Story-compatible: displaced from Johto's Burned Tower region by the migration upheaval
- Technically feasible: pokeemerald has roaming infrastructure for 1 species at a time

**Trigger condition**: After Champion + Migration Tracker completion (talk to Birch after logging all migration species). Birch reports "extraordinary Pokémon" drawn to Hoenn. This gates the feature behind deep engagement — only players who explored the migration fully unlock the legendary chapter.

**Release sequence**: One beast at a time, reusing the single roamer slot:
1. After Tracker completion → Raikou released (electric storms reported)
2. After Raikou caught/defeated → visit Birch → Entei released (volcanic heat surges)
3. After Entei caught/defeated → visit Birch → Suicune released (purified waters sighted)

This avoids save struct expansion (the main technical risk). Each Birch visit is a narrative beat.

**Levels**: All Lv.40, matching vanilla Latias/Latios precedent.

**Roaming behavior**: Use vanilla `sRoamerLocations` table (Routes 110-134). These routes already overlap heavily with our migration corridors. No custom weighting needed — the existing table is thematically appropriate.

**NPC sightings** (2-3 NPCs): Location hints that update based on current beast:
- Route 118 fisherman: "Lightning/fire/aurora on the water last night!"
- Fortree City bird keeper: References the current roaming beast
- Weather Institute scientist (already exists from C95): Could tie sightings to "energy readings"

### Technical Plan

**Species needed**: SPECIES_RAIKOU, SPECIES_ENTEI, SPECIES_SUICUNE (full species pipeline — stats, learnsets, sprites, cries, Pokédex entries). These are Gen 2 legendaries, so base stats and learnsets are well-documented.

**Roamer system changes** (`src/roamer.c`):
- Modify `ClearRoamerData()` / `CreateInitialRoamerMon()` to accept any species (not just Latias/Latios)
- Add 3 new flags: `FLAG_ROAMER_RAIKOU_DONE`, `FLAG_ROAMER_ENTEI_DONE`, `FLAG_ROAMER_SUICUNE_DONE`
- Add a new special or modify `InitRoamer` to init specific beast based on flag state
- `SetRoamerInactive()` already exists — call it when beast is caught/defeated

**Script changes**:
- `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc`: New postgame dialogue branch after Migration Tracker completion. Birch tells player about legendary sightings, triggers first roamer.
- NPC sighting scripts (2-3 locations): Conditional text based on which beast is active.

**No save struct expansion**: The existing `struct Roamer` (28 bytes) is sufficient. We reuse the single slot sequentially. Flags track completion state.

## Feature B: Migration Event Climax (Stretch Goal)

A scripted scene where migration species gather en masse at a specific location — perhaps Meteor Falls or Route 119 — triggered after catching all three beasts. A visual payoff showing the migration at its peak. This is a cinematic reward, not gameplay-critical.

**Deferred until after Feature A is complete.** If cycles run short, this becomes v6.0.

## v5.0 Cycle Roadmap

| Cycle | Target | Deliverable |
|-------|--------|-------------|
| **107** | v4.0 release prep | README update, version bump to v1.0, regression spot-checks |
| **108** | Research: roamer hooks | Deep dive into wild_encounter.c roamer calls, players_house.inc trigger script, save/load for roamer state. Map all touchpoints. |
| **109** | Species: Raikou + Entei | Full pipeline — constants, stats, learnsets, sprites, cries, dex entries (2 of 3 beasts) |
| **110** | Species: Suicune + flags | Complete third beast. Add FLAG_ROAMER_*_DONE flags. Verify all 3 species build. |
| **111** | Roamer system | Modify roamer.c for sequential beast release. Add Birch trigger script. Wire InitRoamer to accept beast species. |
| **112** | NPC sightings + polish | 2-3 NPCs with conditional beast-sighting dialogue. Test roamer encounters. |
| **113** | Balance + regression | Smoke test all roamer states. Check encounter rates. Verify flag persistence across save/load. |
| **114** | Migration Event Climax OR community requests | If Feature B designed, implement. Otherwise, address Issue backlog. |
| **115** | v5.0 release prep | README, version bump, final polish |
| **116** | Buffer | Community feedback, hotfixes, deferred issues |

## Dependencies

- Cycles 109-110 must complete before 111 (species must exist before roamer can reference them)
- Cycle 108 research informs 111 implementation (understand all touchpoints before modifying)
- Feature B design can happen during 109-112 without blocking Feature A

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

### Trainer ID Constraints
- **Current state**: 876 trainer IDs (0-875), TRAINERS_COUNT=876
- Rematch table: all 5 E4 slots used. Gym leaders: 4 tiers each.

### Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ → use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ → use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ → use **Shell Bell** or type-boost items
- ~~Black Sludge~~ → use **Leftovers**
- ~~Light Clay~~ → no equivalent; use Lum Berry
