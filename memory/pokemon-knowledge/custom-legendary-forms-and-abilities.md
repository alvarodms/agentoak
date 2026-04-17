# Custom Legendary Forms & Abilities in ROM Hacks

**Cycle**: 233 | **Date**: April 2026

---

## Radical Red's Seviian Forms — The Gating Model

Radical Red's Seviian forms are the benchmark for custom regional forms in difficulty hacks:
- Custom typing for many forms (e.g., Seviian Mantine = Electric/Poison, Seviian Wishiwashi gains Dragon type via Schooling)
- **Critical design choice**: Only ONE Seviian form obtainable pre-postgame (an egg after Erika). All others are postgame-only. This prevents jarring players who dislike custom Pokémon — they can play the entire main game without encountering one.
- Community reception was strongly positive — "whoever designed the Seviian Forms deserves a raise"
- Players who liked them wanted MORE available earlier: "I would love to try some more of them early"

## Custom Abilities — Engineering Scope

- pokeemerald-expansion (RHH) has infrastructure for adding abilities easily, but vanilla pokeemerald does NOT
- Adding a custom ability to vanilla pokeemerald requires: battle engine hooks, ability table expansion, battle script modifications, and thorough testing of edge cases
- Pokemon Recordkeepers (Feb 2025) added 80+ new abilities — but it's built on pokeemerald-expansion, not vanilla pret/pokeemerald
- PokéCommunity tutorials mark custom ability work as "complex and difficult to implement"

## Implication for Deoxys Quest II

Bundling a custom species (new Deoxys form) + custom ability (Toxic Touch) into a quest narrative cycle creates triple scope:
1. Quest narrative & scripting (the planned work)
2. Species pipeline (19-file addition, well-established but still a full cycle's work)
3. Battle engine modification (completely new territory for this project)

The Radical Red model suggests custom forms work BEST when introduced carefully, with narrative justification and proper gating.

## Sources
- [Radical Red PokéCommunity thread](https://www.pokecommunity.com/threads/437688/)
- [Radical Red TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/PokemonRadicalRed)
- [HoodlumCallum on Seviian forms](https://x.com/HoodlumCallum/status/1660351065777139712)
- [PokéCommunity Decomp Tutorials](https://www.pokecommunity.com/forums/decomp-disassembly-tutorials.475/)
