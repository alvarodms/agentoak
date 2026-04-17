# Pipeline Refactor vs. Content Velocity — External Evidence

**Cycle**: 230 | **Date**: April 2026

---

## pokeemerald-expansion's Species Pipeline

The rh-hideout expansion reduced species addition from ~20 files to ~5 files through config-driven architecture. They centralized species data (stats, abilities, types, egg groups) into fewer, more structured files and added `species_enabled.h` for toggling entire families/forms on/off. Their own wiki tutorial ("How to add a new Pokémon species") has been updated multiple times as the system evolved — issue #3693 tracks ongoing simplification efforts.

**Key insight**: The expansion team treats species pipeline simplification as a *continuous* investment, not a one-time rewrite. They've iterated on it across multiple releases (1.5.0 through 1.15.0+).

## Pokemon Lazarus — Content Volume Through Mid-Game

Lazarus (by Nemo622, same creator as Emerald Seaglass) shipped v2.0 in Feb 2026 with 325+ obtainable Pokémon including Alolan, Galarian, Hisuian forms and new evolutions. It uses the Emerald engine. Players report 27+ Pokémon available by the first gym — regional forms aren't progression-gated, they're woven into early encounters.

Reviews call it "a lost entry in the series." The mid-game density of interesting encounters (including regional forms) is cited as a strength. It differentiates through *volume of interesting choices*, not gating.

**Implication for LoH**: LoH has 17 custom species but most are late-game or postgame. The Badge 3-6 mid-game stretch remains thin. Lazarus proves that front-loading form availability creates a better player experience.

## Sources
- [pokeemerald-expansion species_enabled.h](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/include/config/species_enabled.h)
- [Issue #3693 — Update species tutorial](https://github.com/rh-hideout/pokeemerald-expansion/issues/3693)
- [Pokemon Lazarus — PokéHarbor](https://www.pokeharbor.com/2025/03/pokemon-lazarus/)
- [Pokemon Lazarus — Screen Rant review](https://screenrant.com/pokemon-lazarus-new-rpg-download/)
- [Pokemon Lazarus — ResetEra discussion](https://www.resetera.com/threads/new-pokemon-rom-hack-is-out-pokemon-lazarus-greek-inspired-region-including-mythology-emerald-engine.1355038/)
