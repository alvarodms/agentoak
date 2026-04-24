# Trainer Tooling Landscape & v2.4 Direction Research

**Cycle**: 266 | **Date**: April 2026

---

## Trainer Editing Tools in the Decomp Community

Two main tools exist for pokeemerald trainer editing:

1. **Decomp Trainer Editor** (NotToDisturb) — **Discontinued**. GUI tool for vanilla pokeemerald. Not recommended for current projects.
2. **geefuoco/trainer_editor** — Active Go-based GUI for pokeemerald-expansion. Designed for expansion's data format.

**Key insight**: Neither tool is a CLI/script-based generator that produces source code from JSON config. LoH's planned generate_trainer.cjs (JSON config → synchronized .h file entries) is a novel approach — no existing tool fills this niche for vanilla pokeemerald's macro-based trainer format. A PokeCommunity thread ("Need help with a Trainer Team Generator System") confirms this is a real community pain point beyond LoH.

## How the Expansion Solved the 3-File Problem

pokeemerald-expansion eliminated the multi-file sync problem by redesigning the data format itself. Trainer parties use a single `.party` file with readable struct fields (`.species`, `.heldItem`, `.moves`, `.iv`, `.lvl`, `.nature`, `.ability`). No macro synchronization needed — one file, one format.

LoH can't adopt this (vanilla pokeemerald base), but the lesson is clear: the JSON configs in generate_trainer.cjs should serve as the readable "source of truth" (similar to expansion's format), generating the ugly macro code automatically. The generator IS LoH's equivalent of the expansion's format redesign.

## Competitive Landscape — Emerald Imperium (Jan 2025)

Pokemon Emerald Imperium: regional forms + custom Megas + 27 starters + 100+ bosses + difficulty modes. Breadth-first approach (all gens, hundreds of Pokemon). Opposite of LoH's depth-first narrative approach (27 forms, ecological integration). Genuinely different market positions.

## What Communities Value Post-Regional-Forms

From PokeCommunity discussions:
- **Trainer integration** — forms showing up on boss teams (not just wild encounters)
- **Type balance** — enough of each type for full-team building
- **Difficulty tuning** — player-selectable challenge levels

## Sources
- [Decomp Trainer Editor (Discontinued)](https://www.pokecommunity.com/threads/discontinued-decomp-trainer-editor.434277/)
- [geefuoco/trainer_editor](https://github.com/geefuoco/trainer_editor)
- [PokeCommunity: Need help with Trainer Team Generator System](https://www.pokecommunity.com/threads/need-help-with-a-trainer-team-generator-system.462209/)
- [pokeemerald-expansion trainer data](https://www.pokecommunity.com/threads/help-how-do-i-make-a-trainer-in-pokeemerald-expansion.535549/)
- [Pokemon Emerald Imperium Features](https://pokemonemeraldimperium.com/features/)
