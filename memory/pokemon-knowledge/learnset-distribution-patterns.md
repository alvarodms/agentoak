# Learnset Distribution for New Moves in ROM Hacks

**Cycle**: 132 | **Date**: April 2026

---

## Key Findings

### How Top Hacks Handle New Moves
- **Radical Red, Inclement Emerald**: Update learnsets comprehensively when adding later-gen moves. Every new move is distributed to all species that should learn it.
- **Community expectation**: If trainers use moves players can't learn, it feels unfair/broken. This is a common complaint in half-finished hacks.
- **PoryMoves tool** (AsparagusEduardo): Auto-generates learnset data from cross-gen JSON files. Useful for bulk updates.

### Distribution Methods (pokeemerald vanilla)
1. **Level-up learnsets** (`level_up_learnsets.h`): Add moves to species' natural levelup tables
2. **TM/HM compatibility** (`tmhm_learnsets.h`): Bitmask arrays, one per species
3. **Tutor moves** (`tutor_learnsets.h`): Similar bitmask system
4. **DizzyEggg's ItemTmTutorExpansion**: Full TM/tutor system expansion for decomp

### Practical Approach for Legends of Hoenn
With 20 new moves (IDs 358-377), the simplest distribution paths:
- **Level-up**: Add to species' `sLevelUpLearnsets` arrays (most impactful, no TM infrastructure needed)
- **Tutor**: Add a move tutor NPC (requires tutor system expansion)
- **TM**: Replace low-value TMs or add new TM items (requires item expansion)

Level-up is the lowest-friction option. Each species' learnset is a simple array in `level_up_learnsets.h`.

### Priority Species for Each Move
Key moves and their natural learners (Gen 3 dex):
- Brave Bird: Swellow, Dodrio, Skarmory, Crobat
- Flare Blitz: Arcanine, Blaziken, Camerupt
- Close Combat: Blaziken, Machamp, Heracross, Breloom
- Dragon Pulse: Salamence, Flygon, Altaria, Kingdra
- Stone Edge: Tyranitar, Aggron, Golem, Rhydon
- Night Slash: Absol, Zangoose, Seviper
- Shadow Claw: Banette, Dusclops, Zangoose
- Energy Ball: Vileplume, Roselia, Ludicolo, Sceptile
- Ice Shard: Piloswine, Sneasel, Glalie
- Flash Cannon: Magneton, Aggron, Metagross
