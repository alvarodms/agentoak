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

**Cycle 119: Environmental Storytelling — NPC Sighting Network**
- 6-8 NPCs across Hoenn report strange phenomena (dialogue-only, no C code):
  - **Lavaridge Town**: Hot springs boiling hotter; ground trembling at night
  - **Fiery Path**: Hiker reports cave walls cracking, new heat vents
  - **Dewford Town**: Fisherman says tides are wrong — too high, too fast
  - **Slateport City**: Harbor master reports unusual currents pulling ships south
  - **Route 111 Desert**: Sandstorm intensity increasing (desert researcher)
  - **Pacifidlog Town**: Elder says the currents that keep town afloat are shifting
- Each NPC's dialogue gates behind `FLAG_PRIMAL_STIRRING_STARTED`
- Reporting back to Birch after visiting Lavaridge+Dewford sets `FLAG_ALL_SIGNS_REPORTED`

### Act 2 — Investigation (C120-122)

**Cycle 120: Regi Resonance**
- The three Regi tombs (Island Cave, Desert Ruins, Ancient Tomb) get new script layers:
  - After `FLAG_ALL_SIGNS_REPORTED`, entering a Regi tomb triggers a "resonance event" — the sealed chamber hums, the Regi statue glows
  - NPC researcher at each tomb explains: the Regis were placed as anchors to keep primal energy dormant. The migration's energy has weakened them.
  - Optional: enhanced Regi re-battles (Lv60, held items, custom moves) for players who already caught them — the Regis are "testing" the trainer's worthiness
- Sets `FLAG_REGI_RESONANCE_CHECKED` after visiting any tomb

**Cycle 121: Terra Cave & Seafloor Cavern Revival**
- Revitalize encounter tables for Terra Cave and Seafloor Cavern:
  - **Terra Cave**: Ground/Fire migration species — Numel, Slugma, Geodude lines + rare Larvitar (ties to migration theme). Levels 38-45.
  - **Seafloor Cavern**: Water/Ice types — Spheal, Clamperl, Relicanth + rare Sneasel encounter (migration). Levels 38-45.
- New investigation NPCs inside each dungeon (scientists studying the disturbance)
- These areas now feel alive and worth revisiting, not just one-and-done story maps

**Cycle 122: Magma/Aqua Remnant Encounters**
- 2-3 trainer battles with Magma/Aqua remnants who've noticed the disturbance:
  - **Terra Cave Entrance**: Magma Grunt + Admin with Ground/Fire teams trying to harness Groudon's stirring energy
  - **Seafloor Cavern Room 5-6**: Aqua Grunt + Admin with Water teams near Kyogre's chamber
- Trainers have dialogue explaining their faction noticed the anomalies and came to exploit them — mirrors the original game's conflict
- Requires trainer validation script from C118 for safe trainer ID allocation

### Act 3 — Climax (C123-124)

**Cycle 123: The Primal Awakening — Groudon**
- After all investigation flags are set + Regi resonance checked, Birch reveals: "The anchors can't hold. Groudon is waking in Terra Cave."
- Terra Cave End gets a static Groudon encounter:
  - Level 70, custom moveset: Earthquake, Fire Blast, Solar Beam, Bulk Up
  - Held item: None (vanilla-authentic)
  - Weather effect: permanent sun in the encounter room
  - Uses v5.0's Ho-Oh encounter template pattern (white flash, cry, static battle)
- Post-catch: Birch says "one stabilized — but the ocean readings are worse now"

**Cycle 124: The Primal Awakening — Kyogre**
- Kyogre encounter unlocks after Groudon is caught/defeated
- Seafloor Cavern Room 9 gets a static Kyogre encounter:
  - Level 70, custom moveset: Hydro Pump, Ice Beam, Thunder, Calm Mind
  - Weather effect: permanent rain in the encounter room
  - Same encounter template as Groudon
- Post-catch: global weather normalizes, Birch's instruments finally quiet

### Act 4 — Resolution (C125)

**Cycle 125: World Reaction + v6.0 Ship**
- Post-crisis NPC dialogue updates (6-8 NPCs acknowledge the crisis is over):
  - Lavaridge: springs return to normal, town grateful
  - Dewford: tides stable, fisherman relieved
  - Regi tomb researchers: anchors re-stabilized
  - Birch: comprehensive analysis — the migration, the beasts, Ho-Oh, and now the primals were all connected. "Hoenn's ecosystem has been tested, and it survived — because of you."
- v7.0 narrative hook: Birch mentions Rayquaza — "the mediator hasn't shown itself yet. If both primals stirred, the sky pillar should have responded. But it's silent. That concerns me."
- README update, version bump (`minor` → v0.6.x)
- Final polish pass on any dialogue issues

## Scope Boundaries

### In Scope
- ~20-25 new NPC dialogue branches (reusing existing maps)
- 2 revitalized encounter tables (Terra Cave, Seafloor Cavern)
- 2 static legendary encounters (Groudon Lv70, Kyogre Lv70)
- 4-6 trainer battles (Magma/Aqua remnants)
- ~10 new flags for progression
- 1 engineering script (trainer validation)
- Flag-based linear progression (similar to beast flags from v5.0)

### Out of Scope (v7.0+)
- Rayquaza encounter (v7.0 — Sky Pillar arc)
- Difficulty modes (requires significant C engine work)
- New maps or regions
- New species additions
- Battle Frontier legendary policy changes
- Reusable TMs or major QoL overhauls
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
- `TerraCave_Entrance/scripts.inc`, `SeafloorCavern_Room5/scripts.inc` — Magma/Aqua trainers

### Encounter Template Reuse
v5.0's Ho-Oh encounter (CaveOfOrigin_UnusedRubySapphireMap3) is the template. If adding both Groudon + Kyogre, consider extracting a parameterized script template (tech-debt item from C115) in C123 to avoid duplicating ~60 lines.

### Trainer System
C122 adds 4-6 new trainers. Trainer validation script (C118) must be built first. Use available trainer slots: TRAINER_GRUNT_UNUSED (568), TRAINER_BRENDAN_PLACEHOLDER (853), TRAINER_MAY_PLACEHOLDER (854) + allocate new IDs.

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
