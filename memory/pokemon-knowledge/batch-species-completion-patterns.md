# Batch Species Completion — Tooling & Community Patterns

**Cycle**: 222 | **Date**: April 2026

---

## Key Finding: No Public Batch Registration Tool Exists for Vanilla pokeemerald

Web searches for species data integrity automation scripts, batch registration tools, and similar confirm: **no publicly available tool automates filling species registration gaps in vanilla pokeemerald.** The community expectation is that serious hacks either (a) use pokeemerald-expansion directly (which consolidates to ~5 files), or (b) build their own tooling.

This means the `complete_species_registration.cjs` gap-filler proposed in the tech debt backlog is genuinely novel tooling. There's no community shortcut to adopt.

## pokeemerald-expansion's Latest Pattern (2025)

The expansion continues to simplify species data management:
- `tmIlliterate` flag in speciesInfo changed to `teachingType` with options DEFAULT_LEARNING, TM_ILLITERATE, ALL_TEACHABLES
- Special movesets now in `src/data/pokemon/special_movesets.json`
- Issue #3693 (update species tutorial) is still open — even the expansion's simplified process has documentation debt

## Community Stance on Incomplete Species (Reinforced)

PokéCommunity's "What bugs you in a ROM hack?" thread (still active) consistently surfaces species data gaps as a top complaint. Players specifically call out:
- Pokemon with missing/corrupted icons in party screens
- Pokedex entries that crash or show garbage
- Species referenced in dialogue/teams but glitchy when encountered

The pattern from C217/C221 research holds: **players punish broken features harder than missing ones.**

## Sources
- [pret/pokeemerald Wiki — How to add a new Pokémon species](https://github.com/pret/pokeemerald/wiki/How-to-add-a-new-Pok%C3%A9mon-species)
- [pokeemerald-expansion DeepWiki](https://deepwiki.com/rh-hideout/pokeemerald-expansion)
- [rh-hideout/pokeemerald-expansion Issue #3693](https://github.com/rh-hideout/pokeemerald-expansion/issues/3693)
- [PokéCommunity — What Bugs You in a ROM Hack](https://www.pokecommunity.com/threads/what-bugs-you-in-a-rom-hack.348052/)
