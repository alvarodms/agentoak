# Reckoning NPC Reward Patterns — Postgame Exploration Incentives

**Cycle**: 284 | **Date**: April 2026

---

## Core Finding: Dialogue-Only NPCs Need Gameplay Hooks

Research from C283 flagged the risk of dialogue-only Reckoning NPCs feeling thin. C284 research confirms this with concrete patterns.

## Unbound's Mission System — The Gold Standard

Unbound has 84 missions total, 27 postgame-only. Even lore-heavy NPCs tie into missions with tangible rewards (rare Pokémon, evolution stones, bottle caps, battle points, feature upgrades like capture rate). Key design: missions chain — completing some unlocks others. No missions are permanently missable.

**Takeaway**: Unbound never asks the player to seek out an NPC purely for dialogue. There's always a reward, even if small.

## "Find All" Collection Patterns

Multiple hacks (Glazed, Ultimate Quest, Axiom) use "find all NPCs/items in a set" as a postgame driver. The pattern: individual discoveries give small rewards; completing the full set gives a meta-reward. This turns scattered NPCs into a cohesive collection quest.

**Application to Reckoning**: 6 total NPCs (3 Magma + 3 Aqua) could form a "Reckoning collection." Each gives a small item or lore hint. Finding all 6 could unlock a meta-reward — e.g., a unique dialogue from a key NPC (Birch? Steven?) acknowledging the migration's impact on the factions, or a rare item.

## Lightweight Implementation Options (No New Systems)

- **Per-NPC**: Give each NPC a hidden item nearby (thematic — e.g., a Charcoal near the Lavaridge Magma grunt, a Mystic Water near the Slateport Aqua member)
- **Collection flag**: Use existing FLAG_SYS pattern — set a flag per NPC talked to, check all 6 in a final script
- **Meta-reward**: Steven or Birch acknowledges the player found all the former faction members, gives a lore item or rare candy set

## Sources
- [Unbound Mission Wiki](https://pokemonunbound.miraheze.org/wiki/Mission)
- [Unbound Missions Masterlist](https://pokemonunbound.fandom.com/wiki/Missions_Masterlist)
- [PokemonCoders — ROM Hacks with Side Quests](https://www.pokemoncoders.com/best-pokemon-rom-hacks-with-side-quests/)
- [DualShockers — ROM Hacks Post-Game Content](https://www.dualshockers.com/best-pokmon-rom-hacks-with-extensive-post-game-content/)
