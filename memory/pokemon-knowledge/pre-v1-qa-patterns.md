# Pre-v1.0 QA Patterns — Common ROM Hack Release Bugs

**Cycle**: 142 | **Date**: April 2026

---

## Most Common Game-Breaking Bugs in Emerald Hacks

From PokéCommunity bug reports and patch notes across multiple hacks (Emerald Z, Azure, Imperium, Re:Emerald):

### Flag/Progression Bugs (highest severity)
- **Gym trainer flags not clearing**: Emerald Z had Rustboro Gym trainers not marking as defeated after beating Roxanne — progression flags must match defeat conditions
- **Softlocks from flag ordering**: Brawly's gym softlocked if trainers were beaten before leader; event ordering matters
- **Missing prerequisite checks**: Players skipping triggers via DexNav or other tools
- **NPC stuck in wrong state**: World-reaction NPCs showing dialogue for a flag state that's already passed

### Encounter/Data Bugs
- **Invalid species constants**: Modified encounter tables referencing species IDs that don't exist
- **Level range inconsistencies**: Early routes with late-game species at level 2-3 (intentional in some hacks, but confusing if undocumented)

### Minigame/System Bugs
- Game Corner roulette softlock (ball rising infinitely)
- Fishing treasure softlock
- Mauville Gym puzzle softlock

## What Successful v1.0 Releases Get Right
- Every flag chain tested end-to-end, not just individual transitions
- "Resolved" NPC dialogue states exist for every world-reaction NPC
- Encounter tables sanity-checked for valid species + reasonable levels
- No softlock paths through gym puzzles or minigames
