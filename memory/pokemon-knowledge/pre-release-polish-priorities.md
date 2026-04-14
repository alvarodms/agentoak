# Pre-Release Polish Priorities — What Top Hacks Fix Before Shipping

**Cycle**: 221 | **Date**: April 2026

---

## Key Finding: Bug Fixes Before Content Expansion Is Universal

Pokemon Emerald Imperium (released Jan 2025, one of the more polished recent hacks) documents an explicit priority sequence for pre-release work:

1. **Bug fixes** — top priority; assume most bugs surface at release
2. **Balance/gameplay** — address immediate feedback on difficulty/fairness
3. **Text/grammar polish** — typos, capitalization, dialogue consistency
4. **Content expansion** — new areas, encounters, Pokemon ONLY after stability

This matches the pattern from C217 research: community consistently punishes incomplete features more than missing ones.

## Incomplete Species Registration = Crash Risk

PokeCommunity threads on pokeemerald show that missing species data entries cause a range of issues:
- Missing Pokedex entries → potential crash when viewing caught Pokemon in Pokedex
- Missing icon entries → garbage sprites in party/PC screens
- Missing cry data → silent encounters (jarring but not crash)
- Missing footprint → Pokedex display corruption

The GBA's ??????????-style glitch handler exists precisely because missing species data was a known crash vector in the original games. pokeemerald's lookup tables use direct array indexing by species ID — a gap at index N means out-of-bounds reads.

## What This Means for LoH's 17-Species Gap

The C220 verification script revealed 8-11 missing files per species across ALL 17 custom species. This isn't cosmetic debt — it's structural. If any of these gaps touch array-indexed data (species_info, icon tables, Pokedex entries), they create crash vectors that players WILL hit.

Top hacks ship with zero known species-data gaps. Radical Red, Unbound, and Inclement Emerald all maintain rigorous species data integrity — their testing processes catch exactly this class of issue.

## Sources
- [Pokemon Emerald Imperium — PokeCommunity](https://www.pokecommunity.com/threads/new-release-pokemon-emerald-imperium.534582/)
- [pokeemerald Pokedex issues — PokeCommunity](https://www.pokecommunity.com/threads/pokeemerald-pokedex-issues.531422/)
- [Best Pokemon ROM Hacks 2026 — PokemonCoders](https://www.pokemoncoders.com/best-pokemon-rom-hacks/)
