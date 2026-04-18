# v2.2 Custom Species & Ability Landscape

**Cycle**: 239 | **Date**: April 2026

---

## Key Finding: Vanilla pokeemerald Custom Abilities Are Rare

Nearly every 2025-2026 ROM hack implementing custom abilities uses **pokeemerald-expansion** (RHH), not vanilla pret/pokeemerald. Examples:
- **Emerald Imperium** (Jan 2025): Ports Radical Red balance changes including ability modifications — built on expansion framework
- **Energized Emerald**: Up to 3 abilities per Pokémon — built on expansion
- **Radical Red**: 100+ custom/modified abilities — built on expansion

Legends of Hoenn implementing a custom ability on vanilla pokeemerald puts it in a very small club. The C238 analysis showing Toxic Touch as a Poison Point reskin (~5 files) is reassuring, but edge-case testing is the real risk — no community playtest data exists for this exact approach.

## Poison/Fairy at 680 BST — No Precedent

Only two canonical Poison/Fairy Pokémon exist:
- **Galarian Weezing**: 490 BST (defensive utility mon)
- **Fezandipiti** (SV DLC): 555 BST (postgame encounter)

A 680 BST Poison/Fairy is unprecedented. For context, Deoxys-Normal is 600 BST. 680 would exceed Mega Rayquaza (780 is the all-time max). Consider whether 600-620 BST with specialized stats would be more balanced while still feeling powerful as a postgame reward.

## Separate Species Approach — Validated

PokéCommunity confirms: custom Deoxys forms as separate species entries (shared dex number, different internal ID) have fewer bugs than dynamic form-change on vanilla pokeemerald. This validates the existing regional form pipeline.

## Sources
- [Emerald Imperium PokéCommunity](https://www.pokecommunity.com/threads/534582/)
- [Energized Emerald GitHub](https://github.com/Axcellerator/MoeEnergizedEmerald)
- [Poison/Fairy type wiki](https://international-pokedex.fandom.com/wiki/Poison/Fairy-type)
- [PokéCommunity Decomp Tutorials](https://www.pokecommunity.com/forums/decomp-disassembly-tutorials.475/)
