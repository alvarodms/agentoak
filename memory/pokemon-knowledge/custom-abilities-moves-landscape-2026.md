# Custom Abilities & Moves Landscape — ROM Hack Scene 2026

**Cycle**: 286 | **Date**: April 2026

---

## The Expansion Divide

The ROM hack scene has split into two tiers based on infrastructure:

1. **Expansion-based hacks** (Radical Red, Inclement Emerald, Elite Redux, Unbound v2): Built on pokeemerald-expansion or equivalent. Custom abilities/moves are relatively cheap — the engine already supports Gen 8-9 mechanics, ability slots are extensible, move tables are data-driven.

2. **Vanilla decomp hacks** (LoH, older hacks): Every new ability or move requires manual engine work — battle scripts, effect handlers, UI, AI awareness. The cost per-ability is 10-50x higher than on expansion.

## Elite Redux — The Extreme Case

Elite Redux (v2.65, Feb 2026) pushes abilities furthest:
- **Multi-ability system**: Up to 4 abilities active simultaneously (3 switchable + "innate" passive abilities)
- **370+ total abilities** (200+ custom + reworked official)
- **Unlock-able innates**: Abilities that activate when conditions are met (level, friendship, etc.)
- Built on expansion infrastructure — this level of ability work would be impractical on vanilla pokeemerald

## What Players Value

The difficulty hack community (Radical Red, Elite Redux, Inclement Emerald) expects custom abilities as table stakes for competitive-style play. But LoH isn't competing in that space — it's a narrative hack with mechanical depth.

Community feedback on Radical Red and Inclement Emerald consistently praises **ability reassignments** (giving existing abilities to new species) more than custom ability creation. Players enjoy discovering familiar abilities on unexpected species.

## Implications for Issues #151 and #152

- **Custom abilities (#151)**: On vanilla pokeemerald, each custom ability needs: battle_script_commands, ability effect handlers, AI integration, Pokédex/summary display. Estimated 3-5 cycles per ability for full integration. LoH already has Toxic Touch — adding more follows the same pattern but compounds testing burden.
- **Custom moves (#152)**: Slightly cheaper than abilities (move effect handler + animation + AI), but still significant on vanilla decomp. LoH already has the P/S split infrastructure which helps.
- **Recommended approach**: Rather than creating many new abilities/moves, consider strategic reassignment of existing Gen 4-9 abilities to regional forms. This gives the "custom feel" at 1/10th the cost.

## Sources
- [Elite Redux PokeCommunity Thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-elite-redux-v2-65-beta-complete-%E2%80%94-unique-multi-ability-difficulty-hack.499227/)
- [Elite Redux Nuzlocke Forums](https://nuzlockeforums.com/forum/threads/four-abilities-what-is-this-madness-lets-play-pokemon-elite-redux.21702/)
- [Radical Red PokeCommunity](https://www.pokecommunity.com/threads/pok%C3%A9mon-radical-red-version-4-1-released-gen-9-dlc-pokemon-character-customization-now-available.437688/)
