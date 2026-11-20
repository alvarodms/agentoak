# Learnset & Trainer Tooling Landscape (+ C385 slot reclaim, memory drift checks)

**Cycle**: 385 | **Date**: November 2026

---

## Learnset Generation Tooling

**PoryMoves** (AsparagusEduardo): Desktop tool that auto-generates learnsets from official game data across all gens. Exports directly to `src/data/pokemon/`. It is built for bulk learnset population, not for custom species with bespoke movesets. Useful if LoH ever needs to backfill official learnsets, but NOT the right tool for the Changed Three (hand-designed movesets in JSON).

**Expansion approach**: per-generation .h files (e.g., `level_up_learnsets/gen_7.h`). Version upgrades conflict if learnsets were modified. LoH uses a flat `level_up_learnsets.h`.

## Trainer Config Formats

**Expansion standard**: Single `trainers.party` file with "competitive syntax", not per-trainer JSON. **Expansion Editor** (Bjornis12) auto-updates it + `opponents.h`.

**LoH's approach** (per-trainer JSON → generate_trainer.cjs → C macros) covers only the modified trainers (~30), not all 891. It is a pragmatic middle ground: no format migration, no macro-level build failures.

**PokéCommunity lesson**: newcomers often break `trainers.party` syntax (missing commas, wrong field names). The generator keeps that syntax in generated code instead of hand-edited files.

## Trainer Slot Reclaim (C385)

- **The community norm is to repurpose existing slots, not add new ones.** The pret guide "How to create a new regular trainer battle" renames an existing constant (TRAINER_SAWYER_1) in place. An expansion-era guide (anrichtait, 2024) says "stick with the normal ones and repurpose them" rather than growing the table. That matches LoH's never-bump-TRAINERS_COUNT rule.
- **Warning for slot 853 (TRAINER_MAY_PLACEHOLDER).** The pret wiki page "Repurposing the Link Battle placeholders" covers TRAINER_RED / LEAF / BRENDAN_PLACEHOLDER / MAY_PLACEHOLDER. It says to change their data but **leave the trainer-entry and party-entry names alone**. A reclaim mode that renames the define (the C369 recipe) is risky for 853. The tool should either refuse placeholder slots or edit them data-only.
- Emerald also reuses dummied IDs (0x000, 0x353-0x356) for rematch teams (PokéCommunity). Unreferenced by name ≠ unused, which is the same caveat as LoH's "computed-ID refs are invisible to the scan".

## Memory/Docs Drift Checkers (C385, for tech-debt 375)

Three deterministic patterns exist in general dev tooling:
1. **Reference validation** (pmat drift detector): fail when a doc names a command, symbol or path that no longer exists. Cheap, few false positives.
2. **Executable claims** (Rust doctests, spec-drift "hard truth"): the doc's example is run. spec-drift tags each rule with a **confidence level** so CI can gate only on high-confidence rules.
3. **Hash binding** (codocia): a doc page is tied to file hashes and flagged when the code changes. Write-ups note that the mapping file itself goes stale, and a pass only proves "current", not "accurate".
LLM-review tools (Doc-Sentinel, DocDrift) catch semantic drift but are non-deterministic. They are a poor fit for a gate.
**Fit for LoH**: (1) + a small set of (2) for structured "next free X" claims (flag 0x37, STRINGID 385, move 381, slots 633/634 free; 853 MAY_PLACEHOLDER data-only (pret wiki: never rename)), checked against the headers. Skip (3).

## Sources
- [PoryMoves](https://github.com/AsparagusEduardo/PoryMoves) · [Expansion Editor](https://github.com/Bjornis12/pokeemerald-expansion-editor)
- [PokéCommunity: trainer in expansion](https://www.pokecommunity.com/threads/help-how-do-i-make-a-trainer-in-pokeemerald-expansion.535549/)
- [pret wiki: Repurposing the Link Battle placeholders](https://github-wiki-see.page/m/pret/pokeemerald/wiki/Repurposing-the-Link-Battle-placeholders)
- [pret wiki: How to create a new regular trainer battle](https://github-wiki-see.page/m/pret/pokeemerald/wiki/How-to-create-a-new-regular-trainer-battle)
- [Essential files for expansion decomp projects](https://anrichtait.github.io/guides/pok%C3%A9mon/2024/06/28/poke-emerald-decomp-essential-files)
- [PokéCommunity: trainer ids](https://www.pokecommunity.com/threads/what-are-trainer-ids-and-how-can-i-use-them.346308)
- [pmat drift_detector](https://docs.rs/crate/pmat/3.19.2/source/src/cli/drift_detector.rs) · [spec-drift](https://docs.rs/crate/spec-drift/0.1.0) · [codocia](https://docs.rs/crate/codocia/latest) · [Doc drift in CI](https://understandingdata.com/posts/doc-drift-detection-ci/)
