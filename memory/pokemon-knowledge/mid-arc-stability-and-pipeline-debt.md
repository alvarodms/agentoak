# Mid-Arc Stability & Pipeline Debt — Community Patterns

**Cycle**: 217 | **Date**: April 2026

---

## Key Finding: pokeemerald-expansion Reduced Species Addition to ~5 Files

The pokeemerald-expansion project has restructured species data so adding a new Pokémon requires editing only ~5 files, down from vanilla pokeemerald's 20+. This is achieved through JSON-based data, auto-generated teachable learnsets, and consolidated species info structures.

Our pipeline script (`add_regional_form.cjs`) failed catastrophically at 7/23+ files for Bagon_Hoenn. Three species are now broken/missing (Farigiraf, Vulpix_Hoenn, Ninetales_Hoenn) due to pipeline failures. The expansion's approach proves this problem is solvable — the question is whether to fix our script or restructure our data layout.

**Caveat**: We're on vanilla pokeemerald, not the expansion. Adopting expansion's data structure would be a massive refactor. But the principle — consolidate species data to fewer files — could inform a targeted pipeline fix.

## Community Sentiment: Incomplete Features Are Worse Than Missing Ones

PokéCommunity and GBAtemp discussions consistently show that players forgive a hack for *not having* a feature, but judge harshly when a feature is *present but broken*. Common complaints:
- Species that appear in encounter tables but crash/glitch
- Dialogue referencing mechanics that don't work
- Promised features in changelogs that are half-implemented

Three broken species (Farigiraf, Vulpix_Hoenn, Ninetales_Hoenn) with leftover dialogue references and trainer team slots = exactly this antipattern.

## Sources
- [pokeemerald-expansion FEATURES.md](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/FEATURES.md)
- [pokeemerald-expansion DeepWiki](https://deepwiki.com/rh-hideout/pokeemerald-expansion)
- [GBAtemp — State of ROM Hacks](https://gbatemp.net/threads/opinion-on-the-state-of-pokemon-rom-hacks.667404/)
- [PokéCommunity — What Bugs You in a ROM Hack](https://www.pokecommunity.com/threads/what-bugs-you-in-a-rom-hack.348052/)
