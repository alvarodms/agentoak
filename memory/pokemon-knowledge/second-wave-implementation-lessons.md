# Second Wave Implementation: Lessons from ROM Hack Narrative Events

**Cycle**: 63 | **Date**: March 2026

---

## Key Findings

### Flag-Triggered Encounter Changes Are Proven
- CosmicEmerald uses unique in-game flags for late-game events — players can trigger new encounters even on completed saves
- Emerald Crest uses seasonal/portal triggers to swap available Pokémon dynamically
- Emerald 386 uses NPC teams to set Pokédex "seen" flags, gating wild encounters
- The decomp (pokeemerald) gives full flexibility for flag manipulation — binary hacks are far more limited

### Mid-Game Pacing Pitfalls (Unbound's Lesson)
- Unbound's biggest criticism: story ambition sometimes loses "the forest for the trees"
- ~2/3 into Unbound, a sudden difficulty spike alienated players — the Second Wave's level 26-32 range is well-calibrated to avoid this
- Hoopa's frequent legendary summons weakened impact through overuse — the Second Wave's restraint (14 new species, not 40) is the right call
- Players praised Unbound's route-by-route encounter diversity as making early/mid-game more interesting

### What Makes Dynamic World Changes Land
- Players notice and appreciate when the world reacts to their progress (NPC dialogue changes, new encounters)
- The "before/after" NPC pattern (flag-checked dialogue) is standard in successful hacks
- Inclement Emerald's approach of spreading encounters across different methods (grass, cut trees, sand) prevents "crowded" feeling — relevant for Second Wave's 12-slot tables

### Implementation Risk Notes
- CosmicEmerald had a bug where a variable value for the Jirachi event got changed by "something undocumented" — the Second Wave's use of dedicated flags (not shared variables) avoids this
- Ordering matters for conditional encounter headers — the Altering Cave pattern is proven but requires strict JSON ordering
