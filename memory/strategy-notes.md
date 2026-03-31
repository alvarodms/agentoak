# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (Cycles 2-23): Starters, migration species on routes, trainers refreshed. Complete.
**v2.0** (Cycles 24-86): P/S split, Fairy type, 6 new species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (Cycles 89-96): Trainer held items, mid-game encounters/narrative, wild held items, Migration Tracker Quest. Complete.
**v4.0** (Cycles 98-105): Dungeon encounters, gym rematch redesign+dialogue, rival arc, Battle Speed QoL. Complete.
**v5.0** (Cycles 107-116): "The Legends Awaken" — Roaming Raikou/Entei/Suicune, 6 NPC sighting network, Ho-Oh climax in Cave of Origin, post-catch world reaction. Complete.

---

# v6.0 — "The Primal Stirring" (Cycles 118-125+)

## Arc Structure

### Act 1 — Signs (C118-120) ✓ COMPLETE
- C118: 12 progression flags + Birch trigger scene
- C120: 6 environmental sighting NPCs + Birch report-back

### Act 2 — Investigation (C121-123) ✓ COMPLETE
- C121: Terra Cave + Seafloor Cavern encounter overhaul
- C123: 6 Magma/Aqua remnant trainers + Rayquaza seed dialogue

### Act 3 — Climax (C124) ✓ COMPLETE
- Static Groudon Lv70 + Kyogre Lv70 encounters with cinematic presentation

### Act 4 — Resolution (C125) ✗ BUILD FAILED
- Content WRITTEN but not shipped: Birch debrief + 6 NPC post-crisis dialogue + Rayquaza v7.0 hook + README update
- **Failure cause**: em dash (U+2014) in BirchLab scripts.inc line 1940
- **Next cycle**: Fix the em dash, validate with `grep -P`, rebuild. Should be a quick fix.

---

# v7.0 — "The Sky Guardian" (Planned)

## Concept
Birch's atmospheric anomaly readings point to Rayquaza — the ancient mediator. Sky Pillar arc: investigate ozone disturbances, climb Sky Pillar, confront Rayquaza Lv70.

## Key Setup Already Planted
- Birch debrief mentions "a third anomaly... above us" + "guardian of the ozone" (in C125 content, pending rebuild)
- Magma/Aqua admin post-battle dialogue mentions "the sky dragon"
- Pacifidlog elder already references Sky Pillar

---

## Technical Reference

### Trainer Modification Checklist
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2-5, for Match Call)
3. Ensure levels scale for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (0-11); probabilities 20/20/10/10/10/10/5/5/4/4/1/1
- Water: 5 slots; Fishing: 10 slots
- File: `pokeemerald/src/data/wild_encounters.json`

### Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ -> use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ -> use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ -> use **Shell Bell** or type-boost items
- ~~Black Sludge~~ -> use **Leftovers**

### Flag Plan
Use unused block starting at `0x264` (88 consecutive flags available). ~14 flags used for v6.0 progression. Beast flags (SYSTEM_FLAGS + 0x21-0x27) remain untouched.
