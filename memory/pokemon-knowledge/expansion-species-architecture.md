# pokeemerald-expansion Species Architecture — Lessons for LoH Generator

**Cycle**: 260 | **Date**: April 2026

---

## Key Finding: Expansion Reduced Species Addition from 20+ to ~5 Files

pokeemerald-expansion (rh-hideout) took the structural approach: instead of automating scattered tables, they **consolidated** species data into unified per-species structures. Result: adding a new Pokémon edits ~5 files, not vanilla's 20+.

This is architecturally cleaner — fewer files = fewer missed edits. But it required deep restructuring of the base decomp, incompatible with vanilla pokeemerald's layout.

## Auto-Generated Learnsets from JSON

Expansion auto-generates `teachable_learnsets.h` by scanning TM/tutor JSON data. This is the same "single source of truth" pattern LoH's generator uses — JSON config drives generated output. Validates the approach.

## Species Toggles via `species_enabled.h`

Expansion uses `#define` toggles to enable/disable species families. Elegant for a base with 1000+ species, overkill for LoH's 27 custom species. But the principle — centralized species configuration — aligns with LoH's `species_configs/` JSON pattern.

## Implications for C260 Generator Extension

1. LoH can't adopt expansion's structural consolidation (would break 259 cycles of vanilla-based work)
2. The generator is the pragmatic equivalent — same "edit once, propagate everywhere" benefit
3. The JSON config should be the ONLY manual touchpoint. If any graphics table still needs a manual edit after C260, the generator is incomplete.
4. Still no public species generator for vanilla pokeemerald — LoH's remains unique

## Sources
- [pokeemerald-expansion species_info.h](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/src/data/pokemon/species_info.h)
- [species_enabled.h](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/include/config/species_enabled.h)
- [DeepWiki — rh-hideout/pokeemerald-expansion](https://deepwiki.com/rh-hideout/pokeemerald-expansion)
