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

**Species needed**: SPECIES_RAIKOU(243), SPECIES_ENTEI(244), SPECIES_SUICUNE(245) — **already exist in vanilla** with full stats, learnsets, sprites, cries, dex entries. NO species addition pipeline needed. Cycles 109-110 are freed up.

**Roamer system changes** (`src/roamer.c`):
- Modify `ClearRoamerData()` line 67: remove hardcoded `SPECIES_LATIAS`
- Modify `CreateInitialRoamerMon()` lines 84-105: accept species param instead of bool16
- Add `InitNextBeast()` special: checks DONE flags → inits next beast or signals all caught
- 6 new flags (use FLAG_UNUSED_0x881-0x886): 3 DONE + 3 KO flags
- Modify `battle_main.c:5250-5260`: distinguish KO vs caught when deactivating

**Battle AI change** (`data/battle_ai_scripts.s:3211`):
- Add turn counter check before `flee` — use `gBattleResults.battleTurnCounter`, flee only if ≥3

**Script changes**:
- `data/scripts/players_house.inc:455-481`: Gate vanilla Lati trigger or repurpose for Legends narrative
- Birch Lab: New postgame dialogue branch after Migration Tracker completion
- NPC sighting scripts (2-3 locations): Conditional text based on which beast is active

**No save struct expansion**: The existing `struct Roamer` (28 bytes) is sufficient. We reuse the single slot sequentially. Flags track completion state.

## Feature B: Migration Event Climax (Stretch Goal)

A scripted scene where migration species gather en masse at a specific location — perhaps Meteor Falls or Route 119 — triggered after catching all three beasts. A visual payoff showing the migration at its peak. This is a cinematic reward, not gameplay-critical.

**Deferred until after Feature A is complete.** If cycles run short, this becomes v6.0.

## v5.0 Cycle Roadmap

| Cycle | Target | Deliverable |
|-------|--------|-------------|
| **107** | v1.0 release prep | **PARTIAL** — README rewrite done, smoke build passed, but type icon PNGs NOT committed (still untracked). Version bump deferred. |
| **108** | Research: roamer hooks | ✅ Done. Full system mapped. Species already exist — no addition needed. |
| **109** | Roamer system core | ✅ Done. Beast-aware roamer.c, 6 flags, KO/caught distinction, 3-turn flee delay, InitNextBeast special. |
| **110** | Birch trigger + wiring | Birch Lab script for sequential beast release. Gate/repurpose vanilla Lati trigger. End-to-end test. |
| **111** | NPC sightings + polish | 2-3 NPCs with conditional beast-sighting dialogue. Route encounter testing. |
| **112** | Balance + regression | Smoke test all roamer states. Check encounter rates. Verify flag persistence across save/load. |
| **113** | Migration Event Climax OR community requests | If Feature B designed, implement. Otherwise, address Issue backlog. |
| **114** | v5.0 release prep | README, version bump, final polish |
| **115** | Buffer | Community feedback, hotfixes, deferred issues |

## Dependencies

- Cycle 108 research (✅ complete) informs 109 implementation
- Species already exist — no blocking dependency on species pipeline
- Feature B design can happen during 110-111 without blocking Feature A

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
