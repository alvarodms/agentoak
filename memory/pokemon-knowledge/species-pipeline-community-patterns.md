# Species Addition Pipeline — Community Patterns & Tooling

**Cycle**: 202 | **Date**: April 2026

---

## Key Findings

### The Expansion's Consolidation Pattern
pokeemerald-expansion (rh-hideout, the community standard hack base) solved the species addition pain point by consolidating data from **20+ files down to ~5 files**. All species data lives in a single `src/data/pokemon/species_info.h` file. This is the gold standard the community benchmarks against.

The expansion also offers `species_enabled.h` — a config header that lets you toggle entire species families, regional forms, cross-gen evolutions, and Mega Evolutions on/off. This is a config-driven pattern worth noting for pipeline design.

### Existing Tooling
- **Pokeemerald-Expansion Editor** (PyQt6, by Bjornis12): GUI tool for managing trainers, sprites, and event scripts. Designed for the expansion's data layout, not vanilla pokeemerald.
- **Poryscript** (by huderlem): Higher-level scripting language for gen 3 decomp projects. Compiles to the standard scripting language.
- No publicly available **species addition automation script** for vanilla pokeemerald was found. The community expectation is that serious hacks either use the expansion directly or build their own tooling.

### Issue #3693: Even the Expansion Struggles
rh-hideout's own Issue #3693 acknowledges that the "How to add a new Pokémon species" wiki tutorial needed updating after data structure changes. If even the expansion's streamlined process needs documentation updates, this confirms species addition is a universal pain point.

## Implication for Legends of Hoenn
The `add_regional_form.js` pipeline is essentially reimplementing the expansion's consolidation philosophy on top of vanilla pokeemerald: a single config input → automated multi-file output. This is the right pattern. The key design lesson from the expansion: consolidate the species definition into one place (config file), then generate the scattered file touches.

## Sources
- [pokeemerald-expansion (rh-hideout)](https://github.com/rh-hideout/pokeemerald-expansion)
- [pokeemerald-expansion species_info.h](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/src/data/pokemon/species_info.h)
- [Pokeemerald-Expansion Editor](https://github.com/Bjornis12/pokeemerald-expansion-editor)
- [Issue #3693: Update species tutorial](https://github.com/rh-hideout/pokeemerald-expansion/issues/3693)
- [species_enabled.h config](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/include/config/species_enabled.h)
