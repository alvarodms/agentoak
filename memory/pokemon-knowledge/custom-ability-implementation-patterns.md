# Custom Ability Implementation Patterns in ROM Hacks

**Cycle**: 241 | **Date**: April 2026

---

## Elite Redux — The Multi-Ability Pioneer

Pokémon Elite Redux (pokeemerald-based via Inclement Emerald) is the most ambitious custom ability hack in the scene. It features:
- **100+ new abilities** added to the game
- A **multi-ability system**: every Pokémon can have up to 4 active abilities simultaneously (3 switchable + 3 innate)
- Community reception is enthusiastic — praised for strategic depth

This validates that the ROM hacking community is receptive to custom abilities, even unprecedented ones. A single custom ability (Toxic Touch) is conservative by comparison.

## Key Implementation Lesson — AI Awareness

Elite Redux specifically pairs custom ability additions with AI improvements. Hacks that add abilities without teaching the AI about them create situations where the AI plays suboptimally (e.g., not accounting for poison risk when switching in). The AI scripting step in the Toxic Touch plan (~7 files) is not optional — it's what separates polished from janky.

## "Any Damaging Move" Trigger — No Official Precedent, But ROM Hacks Innovate Freely

No official Pokémon game has an ability that triggers status on any damaging move (not just contact). However:
- Elite Redux's 100+ custom abilities include many that break official rules
- The pokeemerald-expansion already has Gen 5+ Poison Touch (contact-based), meaning the hook points for post-damage ability effects exist in the engine architecture
- Vanilla pokeemerald lacks this — implementation must add the hook from scratch in battle_util.c

## Sources
- [Elite Redux PokéCommunity Thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-elite-redux-v2-65-beta-complete-%E2%80%94-unique-multi-ability-difficulty-hack.499227/)
- [Elite Redux GitHub](https://github.com/Elite-Redux/eliteredux)
- [pokeemerald-expansion battle.h config](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/include/config/battle.h)
