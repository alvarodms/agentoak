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

## Feature A: Roaming Migration Legendaries — COMPLETE

**C infrastructure (DONE — C109+C111)**: `InitNextBeast` special, 6 beast flags, KO/caught distinction, 3-turn flee delay, battle AI.

**Script work (DONE — C112+C113)**:
- ✅ Birch Lab: Postgame dialogue calling `special InitNextBeast` after Migration Tracker completion (C112)
- ✅ Vanilla Lati trigger gated behind beast flags (C112)
- ✅ 6 NPC sighting scripts: Petalburg, Slateport (C112), Mauville, Lilycove, Route 121, Mossdeep (C113)

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
| **111** | NPC sightings + C plumbing | PARTIAL — 8 lines of C plumbing shipped. |
| **112** | Birch trigger + Lati gating + 2 NPC sightings | ✅ Done. All 4 deliverables shipped. |
| **113** | Beast sighting NPC expansion (4 new NPCs) + README | ✅ Done. 6 total sighting NPCs. README updated for v5.0. |
| **114** | TV broadcasts for beast sightings OR v5.0 polish | TV system or begin v6.0 scoping |
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