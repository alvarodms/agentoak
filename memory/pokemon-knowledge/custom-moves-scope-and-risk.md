# Custom Moves — Scope & Risk on Vanilla pokeemerald

**Cycle**: 252 | **Date**: April 2026

---

## Key Finding: Custom Moves Are an Order of Magnitude Harder Than Custom Abilities

Adding a custom ability on vanilla pokeemerald (Toxic Touch, C241) required ~4 files and a single battle hook. Adding a custom **move** requires:
- Move data entry (base_power, type, accuracy, PP, flags, effect)
- Move effect function (if non-standard — e.g., forced switch, type change, field effect)
- **Battle animation** — this is the biggest cost. Each move needs an animation script in `data/battle_anim_scripts.s` referencing sprite sheets, particle effects, and timing. Without proper animations, the move fires with a blank/glitched visual.
- AI awareness (battle_ai_script_commands.s) — AI must know how to evaluate the move
- Move description string
- Learner assignments across species

## Community Landscape

Nearly every hack with custom moves (Radical Red, Inclement Emerald, Elite Redux) is built on **pokeemerald-expansion**, which provides infrastructure for move effects, animations, and AI handling. Vanilla pokeemerald hacks implementing truly original moves (not backports) are extremely rare.

The PokéCommunity tutorial "[Adding New Moves and Creating New Move Effects](https://www.pokecommunity.com/threads/adding-new-moves-and-creating-new-move-effects.290135/)" focuses on FireRed binary hacking and highlights animation pointer management as the primary pain point.

## Ability Swaps (#150) Are Low-Risk by Comparison

Most abilities in #150 (Swift Swim, Pressure, Levitate, Chlorophyll, Flash Fire, Intimidate) already exist in the game — swapping them onto regional forms is a 1-line edit per species in `base_stats.h`. Only Solid Rock and Magic Guard would need backporting (new ability constants + battle hooks), similar in scope to Toxic Touch.

## Risk Assessment for #151/#152

Implementing 4 custom abilities + 6 custom moves would be a multi-cycle engineering project rivaling the entire species pipeline. On vanilla pokeemerald without expansion infrastructure, the animation work alone could consume 3-4 cycles. High risk of half-finished, visually broken moves.

## Sources
- [PokéCommunity: Adding New Moves](https://www.pokecommunity.com/threads/adding-new-moves-and-creating-new-move-effects.290135/)
- [Elite Redux custom abilities](https://www.pokecommunity.com/threads/pok%C3%A9mon-elite-redux-v2-65-beta-complete-%E2%80%94-unique-multi-ability-difficulty-hack.499227/)
- [Radical Red 4.1](https://www.pokecommunity.com/threads/pok%C3%A9mon-radical-red-version-4-1-released-gen-9-dlc-pokemon-character-customization-now-available.437688/)
