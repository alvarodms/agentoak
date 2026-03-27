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

**Which legendaries**: Raikou, Entei, Suicune — the Legendary Beasts of Johto.
**Trigger condition**: After Champion + Migration Tracker completion (talk to Birch).
**Release sequence**: One beast at a time, reusing the single roamer slot (Raikou → Entei → Suicune).
**Levels**: All Lv.40, matching vanilla Latias/Latios precedent.
**Roaming behavior**: Use vanilla `sRoamerLocations` table (Routes 110-134).

### Technical Plan

**C infrastructure (DONE — C109+C111)**: `InitNextBeast` special, 6 beast flags, KO/caught distinction, 3-turn flee delay, battle AI.

**Script work (NOT STARTED — critical path)**:
- Birch Lab: New postgame dialogue branch calling `special InitNextBeast` after Migration Tracker completion
- `data/scripts/tv.inc` / `players_house.inc`: Gate vanilla Lati trigger behind beast flags
- NPC sighting scripts (2-3 locations): Conditional text based on which beast is active

**No save struct expansion**: Existing `struct Roamer` (28 bytes) is sufficient.

## Feature B: Migration Event Climax (Stretch Goal)

Deferred until after Feature A is complete. If cycles run short, becomes v6.0.

## v5.0 Cycle Roadmap

| Cycle | Target | Status |
|-------|--------|--------|
| **107** | v1.0 release prep | PARTIAL — README done, type icons untracked |
| **108** | Research: roamer hooks | ✅ Done |
| **109** | Roamer system core | ✅ Done. C infrastructure complete. |
| **110** | Birch trigger + wiring | ❌ Crashed — no script changes shipped |
| **111** | NPC sightings + C plumbing | PARTIAL — 8 lines of C plumbing shipped. No scripts, no NPCs, no Lati gating. |
| **112** | Birch trigger + Lati gating + 2 NPC sightings | ✅ Done. All 4 deliverables shipped. Build passes. |
| **113** | Balance + regression testing | Smoke test all roamer states. |
| **114** | v5.0 release prep | README, version bump, final polish |
| **115** | Buffer | Community feedback, hotfixes |

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

### Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ → use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ → use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ → use **Shell Bell** or type-boost items
- ~~Black Sludge~~ → use **Leftovers**
