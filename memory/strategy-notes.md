# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (Cycles 2-23): Starters, migration species on routes, trainers refreshed. Complete.
**v2.0** (Cycles 24-86): P/S split, Fairy type, 6 new species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (Cycles 89-96): Trainer held items, mid-game encounters/narrative, wild held items, Migration Tracker Quest. Complete.
**v4.0** (Cycles 98-105): Dungeon encounters, gym rematch redesign+dialogue, rival arc, Battle Speed QoL. Complete.
**v5.0** (Cycles 107-116): "The Legends Awaken" — Roaming Raikou/Entei/Suicune, 6 NPC sighting network, Ho-Oh climax in Cave of Origin, post-catch world reaction. Complete. See git history for design docs.

---

# v6.0 — "The Primal Stirring" (Cycles 118-125)

## Creative Thesis

Catching Ho-Oh — the apex of the migration — released enough sacred fire energy to disturb ancient forces sleeping beneath Hoenn. Groudon and Kyogre, dormant for millennia since Rayquaza silenced their war, begin to stir. The "deeper readings" Birch detected in C116 are seismic and tidal anomalies caused by this awakening. The Regi golems, ancient resonance anchors placed to keep the primals dormant, are weakening under the strain.

**Player fantasy**: "I caused this. Now I have to fix it." The player transitions from migration observer to the person who must prevent a primal catastrophe — a consequence of their own success.

**Thematic pillars**:
- **Consequence**: The migration has side effects. Capturing legendaries wasn't free.
- **Hoenn's mythology made real**: Groudon/Kyogre aren't just story devices — they're ecological forces the player must confront as a direct result of their actions.
- **Escalation**: From tracking beasts to preventing regional disaster.
- **Resolution through understanding**: Birch's research is the thread. Science, not just battling, drives the narrative forward.

## Arc Structure — 8 Cycles

### Act 1 — Signs (C118-119)

**Cycle 118: Engineering + Groundwork** ✓ COMPLETE
- ✓ Trainer validation script (`scripts/check_trainers.sh`) — batch awk approach, 0 errors/0 warnings on current codebase
- ✓ 12 v6.0 progression flags added to `flags.h` (0x264-0x26F)
- ✓ Birch "Primal Stirring" trigger dialogue: camera shake + SFX, 3-part revelation, sets FLAG_PRIMAL_STIRRING_STARTED, reminder + next-phase placeholders

**Cycle 119: NPC Sighting Network** ✗ BUILD FAILED — REVERTED

**Cycle 120: NPC Sighting Network (retry)** ✓ COMPLETE
- 6 environmental NPCs: Lavaridge attendant, Dewford fisherman, Fiery Path hiker, Slateport harbor master, Route 111 researcher, Pacifidlog elder
- Birch report-back: checks FLAG_TREMORS/TIDES_INVESTIGATED → revelation scene (migration-as-response lore) → sets FLAG_ALL_SIGNS_REPORTED
- Updated PrimalNextPhase to direct player to Regi ruins
- Key lesson: use `cat >>` instead of Edit tool for files with smart quotes

### Act 2 — Investigation (C121-122)

**Cycle 121: Terra Cave & Seafloor Cavern Revival** ✓ COMPLETE
- Terra Cave: brand-new encounter tables (Entrance + End) — Camerupt/Donphan/Claydol theme, Lv38-45
- Seafloor Cavern: full encounter overhaul (Rooms 1-9 + Entrance) — Tentacruel/Sharpedo/Relicanth/Huntail/Gorebyss theme, Lv38-45
- Devon researcher NPC (TerraCave_End) + deep-sea researcher NPC (SeafloorCavern_Room9) — set investigation flags
- Birch PrimalNextPhase gates on FLAG_TERRA_CAVE_INVESTIGATED + FLAG_SEAFLOOR_CAVERN_INVESTIGATED
- 2 new flags: 0x270 (Terra Cave) + 0x271 (Seafloor Cavern)
- **NOTE**: Introduced smart quote corruption in Route111/scripts.inc line 650 — blocks builds!

**Cycle 122: Magma/Aqua Remnant Encounters** ✗ BUILD FAILED — REVERTED
- All pokeemerald changes reverted by runner. Root cause: smart quote corruption in Route111/scripts.inc line 650 (introduced C121).
- Work attempted: 6 trainers (3 Magma + 3 Aqua), map.json edits, script dialogue — all lost.
- **Must fix Route111 smart quotes FIRST, then re-implement trainers + scripts.**

### Act 3 — Climax (C123-124)

**Cycle 123: Fix Route111 + Magma/Aqua Remnant Encounters (retry)**
- FIX FIRST: Replace smart quotes in Route111/scripts.inc line 650 with ASCII
- Then re-implement: 6 trainers, map.json NPCs, battle scripts with narrative dialogue
- CheckMultipleFlags macro deferred — inline checks sufficient

**Cycle 124: The Primal Awakening — Groudon & Kyogre**
- Static Groudon Lv70 encounter in Terra Cave End
- Static Kyogre Lv70 encounter in Seafloor Cavern Room 9
- Post-catch: global weather normalizes

### Act 4 — Resolution (C125)

**Cycle 125: World Reaction + v6.0 Ship**
- Post-crisis NPC dialogue updates
- v7.0 Rayquaza narrative hook
- README update, version bump

## Scope Boundaries

### In Scope
- ~20-25 new NPC dialogue branches (reusing existing maps)
- 2 revitalized encounter tables (Terra Cave, Seafloor Cavern)
- 2 static legendary encounters (Groudon Lv70, Kyogre Lv70)
- 4-6 trainer battles (Magma/Aqua remnants)
- ~10 new flags for progression

### Out of Scope (v7.0+)
- Rayquaza encounter (v7.0 — Sky Pillar arc)
- Difficulty modes, new maps/regions, new species
- Primal Reversion mechanic (Gen 6, not implementable in Gen 3 engine)

## Technical Notes

### Flag Plan
Use unused block starting at `0x264` (88 consecutive flags available). Need ~10 flags for full v6.0 progression. Beast flags (SYSTEM_FLAGS + 0x21-0x27) remain untouched.

### Maps to Modify
- `LittlerootTown_ProfessorBirchsLab/scripts.inc` — Birch dialogue (ALREADY modified 5x — read first!)
- `LavaridgeTown/scripts.inc` — tremor NPC (modified C29, C94)
- `DewfordTown/scripts.inc` — tidal NPC
- `SlateportCity/scripts.inc` — harbor NPC (modified C27, C28)
- `PacifidlogTown/scripts.inc` — elder NPC
- `IslandCave/scripts.inc`, `DesertRuins/scripts.inc`, `AncientTomb/scripts.inc` — Regi tombs
- `TerraCave_End/scripts.inc` — Groudon encounter
- `SeafloorCavern_Room9/scripts.inc` — Kyogre encounter

### Encounter Template Reuse
v5.0's Ho-Oh encounter (CaveOfOrigin_UnusedRubySapphireMap3) is the template.

### Trainer System
C123 retry adds 4-6 new trainers. Use available trainer slots: TRAINER_GRUNT_UNUSED (568), TRAINER_BRENDAN_PLACEHOLDER (853), TRAINER_MAY_PLACEHOLDER (854) + allocate new IDs.

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
