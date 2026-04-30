# Learnset & Trainer Tooling Landscape — C302 Refactor Context

**Cycle**: 302 | **Date**: April 2026

---

## Learnset Generation Tooling

**PoryMoves** (AsparagusEduardo): Desktop tool that auto-generates learnsets from official game data across all gens. Exports directly to `src/data/pokemon/` — designed for bulk learnset population, not custom species with bespoke movesets. Useful if LoH ever needs to backfill official learnsets, but NOT the right tool for Changed Three (which have hand-designed movesets in JSON).

**Expansion approach**: Moved to per-generation .h files (e.g., `level_up_learnsets/gen_7.h`). Conflicts arise during version upgrades if learnsets were modified. LoH uses a flat `level_up_learnsets.h` — the bug is simpler: the generator never appended to the compiled output files.

## Trainer Config Formats

**Expansion standard**: Single `trainers.party` file with "competitive syntax" — human-readable struct-like format. NOT per-trainer JSON. A dedicated GUI tool (**Expansion Editor** by Bjornis12) can auto-update this file + `opponents.h`.

**LoH's approach** (per-trainer JSON → generate_trainer.cjs → C macros) is scoped differently: only ~30 modified trainers extracted, not all 891. This is a pragmatic middle ground — avoids the migration cost of a full format change while eliminating macro-level build failures.

**Key lesson from PokéCommunity threads**: Newcomers frequently break `trainers.party` syntax (missing commas, wrong field names). Expansion Editor exists partly to prevent this. LoH's generator approach sidesteps this by keeping the ugly syntax in generated code, not human-edited files.

## Sources
- [PoryMoves](https://github.com/AsparagusEduardo/PoryMoves)
- [Expansion Editor](https://github.com/Bjornis12/pokeemerald-expansion-editor)
- [PokéCommunity: How to make a trainer in expansion](https://www.pokecommunity.com/threads/help-how-do-i-make-a-trainer-in-pokeemerald-expansion.535549/)
- [pret wiki: Useful Modding Tools](https://github.com/pret/pokeemerald/wiki/Useful-Modding-Tools)
