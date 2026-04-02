# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (C2-23): Starters, migration species, trainers. Complete.
**v2.0** (C24-86): P/S split, Fairy, 6 species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (C89-96): Trainer items, mid-game encounters/narrative, wild held items, Migration Tracker. Complete.
**v4.0** (C98-105): Dungeons, gym rematches, rival arc, Battle Speed QoL. Complete.
**v5.0** (C107-116): "The Legends Awaken" — Roaming beasts, sighting network, Ho-Oh climax. Complete.
**v6.0** (C118-126): "The Primal Stirring" — Groudon/Kyogre environmental arc, remnants, world reaction. Complete.
**v7.1** (C128-133): "Battle Quality Overhaul" — 20 Gen 4/5 moves, 13 trainer redesigns, learnset distribution. Complete.
**v7.0** (C134-137): "The Sky Guardian" — Rayquaza trilogy (warning, ascent, guardian), Sky Pillar encounters, world reaction. **Complete.**

---

# Post-Sky Guardian — What's Next? (C138+)

The legendary trilogy (earth, sea, sky) is now complete. The ROM hack has a full postgame arc from migration → beasts → Ho-Oh → primals → Rayquaza.

## Candidate Directions

### Option A: "The Complete Experience" (Polish + Ship)
- Gym leader rematch tiers 1-4 (already designed in pokemon-knowledge/)
- Legendary Encounter Template extraction (tech debt, pending 20+ cycles)
- Final balance pass, version bump to v1.0
- README update, release as "complete"

### Option B: "The Frontier Challenge" (New Content)
- Battle Frontier enhancements — facility-specific teams, rental Pokemon updates
- Post-E4 trainer rematches with full competitive teams
- Endgame challenge mode or hard mode toggle

### Option C: "The Living World" (Depth)
- More world-reaction NPCs for existing events
- Dynamic weather tied to legendary captures
- Seasonal/time-based encounter variations
- Expanded Birch quest with additional tracker stages

**Decision needed C138**: Pick a direction based on what delivers the most player value.

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
- ~~Focus Sash~~ -> Focus Band (12% survive)
- ~~Choice Scarf/Specs~~ -> Scope Lens or Shell Bell
- ~~Life Orb~~ -> Shell Bell or type-boost items
- ~~Black Sludge~~ -> Leftovers

### Flag Plan
Use unused block starting at `0x264` (88 consecutive flags available). ~14 flags used for v6.0 progression. Beast flags (SYSTEM_FLAGS + 0x21-0x27) remain untouched. Sky Guardian used flags 0x272-0x277.
