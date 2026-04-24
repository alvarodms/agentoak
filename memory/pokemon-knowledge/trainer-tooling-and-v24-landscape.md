# Trainer Tooling Landscape & v2.4 Direction Research

**Cycle**: 265 | **Date**: April 2026

---

## Trainer Editing Tools in the Decomp Community

Two main tools exist for pokeemerald trainer editing:

1. **Decomp Trainer Editor** (NotToDisturb) — **Discontinued**. GUI tool for vanilla pokeemerald. Not recommended for current projects. Reads/writes trainer files directly.
2. **geefuoco/trainer_editor** — Active Go-based GUI for pokeemerald-expansion. Edits trainer name, class, pic, AI flags, items, and per-Pokemon: species, held item, moves, IVs/EVs, ability. Designed for expansion's data format.

**Key insight**: Neither tool is a CLI/script-based generator that produces source code from JSON config. Both are interactive GUI editors. LoH's planned generate_trainer.cjs (JSON config → synchronized .h file entries) is a novel approach — no existing tool fills this niche for vanilla pokeemerald's macro-based trainer format. The 3-file synchronization problem (trainer_parties.h / trainers.h / opponents.h) is LoH-specific.

## Competitive Landscape — Emerald Imperium (Jan 2025)

Pokemon Emerald Imperium is a new completed Emerald hack with:
- Regional forms + custom Megas + Gigantamax-as-Megas
- 27 different starter options (all gens)
- 100+ mini-bosses and boss battles
- Difficulty modes, randomizer, modern battle mechanics
- Gen 4 characters (Dawn as rival, Roark as gym leader)

**Approach**: Breadth-first (all gens, hundreds of Pokemon, dozens of starters). This is the opposite of LoH's depth-first approach (27 narrative-driven forms, ecological integration). Imperium has more content volume; LoH has more narrative cohesion. These are genuinely different market positions.

## What Communities Value Post-Regional-Forms

From PokeCommunity discussions on ROM hacks with established regional forms:
- **Type balance** — enough of each type for full-team building
- **Trainer integration** — forms showing up on boss teams (not just wild encounters)
- **Difficulty tuning** — player-selectable challenge levels
- Community feedback loops driving iteration

## Sources
- [Decomp Trainer Editor (Discontinued)](https://www.pokecommunity.com/threads/discontinued-decomp-trainer-editor.434277/)
- [geefuoco/trainer_editor](https://github.com/geefuoco/trainer_editor)
- [Pokemon Emerald Imperium Features](https://pokemonemeraldimperium.com/features/)
- [PokeCommunity Regional Forms Feedback](https://www.pokecommunity.com/threads/rom-hack-ideas-feedback-and-advice-regional-forms.455914/)
