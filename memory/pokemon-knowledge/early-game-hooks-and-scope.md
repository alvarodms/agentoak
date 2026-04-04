# Early-Game Hooks & Feature Scope in ROM Hacks

**Cycle**: 152 | **Date**: April 2026

---

## How Top Hacks Signal "This Isn't Vanilla" Early

1. **Radical Red**: Brock carries Alolan Geodude + Vulpix — breaks monotype gym expectation within the first hour. The *gameplay itself* is the signal, not a cutscene.
2. **Unbound**: Difficulty selection screen at game start + early Mega Evolution encounters. Structural changes the player interacts with immediately.
3. **Inclement Emerald**: Expanded Petalburg Woods with two new subareas — changes geography itself, not just encounters.

**Pattern**: The most effective early hooks change something the player *does*, not just something they *see*. A brief scripted sighting is fine as a teaser, but the real hook is when gameplay diverges (new encounter, unexpected trainer team, new area).

## Scope Creep: Side Systems in ROM Hacks

- Hacks praised for side quests (Unbound, Emerald Horizons) implement them as **lightweight flag-gated NPC chains** — NOT as new game mechanics like crafting.
- No successful GBA ROM hack has implemented a crafting/cooking system — the engine has no framework for it. Fan games (RPG Maker, Essentials) can do this; decomp hacks cannot without major engine work.
- The community consistently values **encounter design + trainer quality + QoL** over novel side mechanics. Overambitious custom systems are the #1 cause of ROM hack abandonment.

## Implications for C152

The Petalburg Woods event should be *brief and mysterious* (as planned), but consider whether the player gets any gameplay payoff — even small. A fleeting sprite is cinematic but passive. Could the migration species leave behind a held item? Could it alter encounters in the area temporarily? Small interactive touches > long cutscenes.
