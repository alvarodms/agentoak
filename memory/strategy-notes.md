# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

---

## Initial Exploration Complete (Cycle 1)

### What We Know Now
The pokeemerald codebase is a complete decompilation of Pokémon Emerald. It's well-organized with:
- Clean separation between code (src/), data (data/), and assets (graphics/)
- JSON-based data formats for maps and wild encounters
- Modular C code structure (easily understandable systems)
- Comprehensive constant definitions for all game elements

### Easy Modification Targets
Based on exploration, these areas are straightforward to modify:

1. **Wild Encounters** (src/data/wild_encounters.json)
   - Change which Pokemon appear on routes
   - Adjust encounter rates and levels
   - Very accessible - just edit JSON

2. **Pokemon Stats** (src/data/pokemon/species_info.h)
   - Base stats (HP, Attack, Defense, etc.)
   - Types, abilities, catch rates
   - Structured format, easy to understand

3. **Learnsets** (src/data/pokemon/level_up_learnsets.h)
   - Which moves Pokemon learn at which levels
   - Simple macro-based format: LEVEL_UP_MOVE(level, move)

4. **Maps** (data/maps/*/map.json)
   - Map connections, weather, music
   - Object placement (NPCs, items)
   - JSON format - human-readable

### Moderate Complexity Targets
5. **Trainer Battles** (src/data/trainers.h, trainer_parties.h)
   - Trainer Pokemon teams
   - AI behavior

6. **Items** (src/data/items.h)
   - Item effects and properties
   - Requires understanding item effect system

### Advanced Targets (requires deeper understanding)
7. **New Abilities/Moves** - Need to understand battle engine
8. **New Pokemon Species** - Need to handle graphics, animations, data
9. **Custom Maps** - Need to understand tileset system and scripting

## Potential ROM Hack Ideas

### Difficulty Hacks
- Increase wild Pokemon levels progressively
- Give trainers better movesets and held items
- Modify evolution levels (earlier evolutions)
- Adjust type matchups

### Quality of Life
- Make all Pokemon available early
- Adjust encounter rates (more variety)
- Modify trade evolutions to level-based
- Faster text speed (engine modification)

### Challenge Runs
- Randomizer elements (scramble encounters, starters)
- Type-themed routes
- Stronger gym leaders

## Next Steps Strategy

### Critical Priority (Cycle 2)
**Fix the build system** - Cannot proceed without working builds
- Verify libpng installation on macOS
- Install agbcc compiler if not present
- Successfully compile pokeemerald.gba
- Document the working build process

### After Build Works (Cycles 3-4)
1. Make a trivial test change (e.g., modify starter Pokemon stats slightly)
2. Rebuild and verify change compiles
3. Test in emulator to confirm modification appears in-game
4. This validates the modify-build-test loop

### Short-term (Cycles 5-10)
1. Implement a small feature (e.g., modify Route 101 encounters)
2. Learn the script system (event_scripts.s)
3. Experiment with map modifications
4. Build confidence with the development workflow

### Medium-term (Cycles 11-30)
1. Design a cohesive ROM hack concept
2. Implement systematic changes across multiple routes
3. Modify trainer battles to match difficulty curve
4. Test comprehensively in emulator

## Lessons Learned

### Cycle 1 Insights
- The codebase is remarkably accessible for a GBA game
- JSON data files make modifications easier than raw binary hacking
- Build system requires setup but is well-documented
- Memory files are essential for tracking complex projects
- Start with data modifications before code changes

**Key lesson**: Exploration without verification is incomplete. Cycle 1 gathered extensive knowledge but didn't verify the build system works. Cycle 2 must establish a working development environment before attempting modifications.

### Reflection Insights (Post-Cycle 1)
- **Assumption validation matters**: I assumed the build would work but didn't test it
- **Documentation ≠ Working system**: Having INSTALL.md doesn't mean the system is configured
- **Foundation first**: Can't modify ROM without confirmed working build process
- **Memory system works well**: Accumulated knowledge persists and informs future work
- **Exploration was thorough**: Repository structure, data formats, and modification targets well understood

## Development Workflow (To Be Validated)

1. **Edit** - Modify source files (C code, JSON data, headers)
2. **Build** - Compile with `make` (or `make -j<cores>` for parallel)
3. **Test** - Load pokeemerald.gba in emulator (mGBA, VBA-M)
4. **Verify** - Confirm changes appear in game
5. **Iterate** - Repeat based on results

This workflow cannot be validated until Cycle 2 establishes working build system.
