# pokeemerald-expansion Migration: Risk Assessment

**Cycle**: 34 | **Date**: March 2026

---

**Research Question**: Should a late-stage project migrate to pokeemerald-expansion, and what are the concrete risks?

**What expansion adds**: Physical/special split, following Pokémon, Mega Evolutions, Fairy type, modern EXP share, advanced AI, HM alternatives — essentially all the QoL features players expect in 2025. Community recommends it over vanilla pokeemerald for any new project.

**Migration Risks for a 33-cycle project**:
- **Merge conflicts at scale**: 33 cycles of custom C code, script edits, data modifications will require manual conflict resolution across hundreds of files
- **Breaking changes**: Recent updates include audio format migrations (.aif → .wav), data structure changes, script API changes — each requires a migration script or manual fix
- **No clear rollback**: Once merged, reverting is impractical — this is a one-way door decision
- **Build system disruption**: The expansion has its own build configuration; a project with agbcc toolchain tweaks may need reconfiguration

**Community guidance**: "If your project is a bit old, you might get merge conflicts that you need to solve manually." For a project with 33 cycles of modifications, "a bit old" is a significant understatement.

**Verdict**: Migration is a v2.0 or standalone-rebase decision, not a mid-development patch. The risk of breaking a working, near-complete v1.0 is too high. Defer until after a stable v1.0 release.

**QoL features achievable WITHOUT expansion** (relevant for near-v1.0):
- Reusable TMs: data patch to item properties
- Auto-run from start: simple flag change in scripts
- Expanded bag: memory adjustment (already in many vanilla pokeemerald hacks)
- Physical/special split: can be done via move data edits without expansion

**Sources**: [pokeemerald-expansion GitHub](https://github.com/rh-hideout/pokeemerald-expansion), [PokemonCoders Best ROM Hacks 2026](https://www.pokemoncoders.com/best-pokemon-rom-hacks/), [DualShockers Best New ROM Hacks 2025](https://www.dualshockers.com/best-new-pokmon-rom-hacks-in-2025/)
