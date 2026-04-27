# Pipeline Verification Patterns & Boss Diversity Revisit Evidence

**Cycle**: 285 | **Date**: April 2026

---

## Species Pipeline Complexity — Expansion vs. Vanilla

pokeemerald-expansion reduced species addition to **~5 files** (from 20+ in vanilla pokeemerald). LoH uses vanilla pokeemerald with a custom 27-file generator. The complexity gap explains why partial registrations recur — more files = more points of failure = more ways for a run to be "complete" but actually partial.

RHH issue #3693 shows even the expansion team acknowledges their species addition wiki tutorial needs updating after refactors. Species registration is a known community-wide pain point, not unique to LoH.

**Key pattern**: The expansion solved this architecturally (centralized species data). LoH can't easily adopt that architecture, but a post-generation verification script (grep SPECIES_X across all 27 target files) would catch partial registrations at build time.

## Radical Red Gym Leader Design Philosophy

Radical Red uses **thematic identity** over strict type matching. Example: Koga's team is ninja-themed, with only 2 of his Pokémon actually being Poison type. The roster serves the character fantasy, not the type label.

This supports Issue #178's argument that design reasoning should drive team composition — "what does this trainer's team SAY about them?" — not implementation timestamps or pipeline cost as reasons to reject a species.

## Sources
- [pokeemerald-expansion wiki — How to add a species](https://github.com/rh-hideout/pokeemerald-expansion/wiki/How-to-add-a-new-Pok%C3%A9mon-species)
- [RHH Issue #3693 — Update species tutorial](https://github.com/rh-hideout/pokeemerald-expansion/issues/3693)
- [Radical Red Gym Leaders Wiki](https://radicalred.miraheze.org/wiki/Gym_Leaders)
- [pret/pokeemerald — How to add a new species](https://github.com/pret/pokeemerald/wiki/How-to-add-a-new-Pok%C3%A9mon-species)
