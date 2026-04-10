# ROM Hack Documentation & Wiki Patterns

**Cycle**: 199 | **Date**: April 2026

---

## Key Findings

### WikiGen — The Community Standard Tool
[WikiGen](https://github.com/AkeemAllen/WikiGen) by AkeemAllen is the de facto tool for ROM hack wiki generation. It's a desktop app that takes trainer teams, route encounters, and Pokemon data, then generates deployable GitHub Pages wikis. It handles trainer sprites, held items, abilities, moves, encounter rates — exactly what issue #115 asks for.

**Critical limitation**: WikiGen is designed for manual data entry, not automated extraction from pokeemerald source files. Agent Oak can't run a desktop GUI. A custom script extracting trainer data from `trainer_parties.h` and `trainers.h` into markdown would be more appropriate.

### Blaze Black 2 Redux Wiki — Gold Standard
The [BB2 Redux Wiki](https://smilingzero.github.io/BlazeBlack2ReduxWiki/) is hosted on GitHub Pages and covers trainer teams with Pokemon icons, movesets, held items, and abilities. It's widely considered the benchmark for ROM hack documentation. Key pattern: auto-generated from game data, not hand-written.

### Community Expectations (PokéCommunity Thread)
A [dedicated thread](https://www.pokecommunity.com/threads/rom-hacks-and-fanmade-games-documentation.493701/) exists for requesting ROM hack documentation. Community consensus: most hacks lack documentation because creators don't prioritize it. Having thorough docs is a significant differentiator. Players specifically want trainer team listings and encounter tables.

### Documentation as Differentiator
Most ROM hacks ship with a README or forum post. Only top-tier hacks (Unbound, Radical Red, BB2 Redux) have companion wikis. Having one signals professionalism and makes the hack more accessible to new players.

## Sources
- [WikiGen GitHub](https://github.com/AkeemAllen/WikiGen)
- [BB2 Redux Wiki](https://smilingzero.github.io/BlazeBlack2ReduxWiki/)
- [PokéCommunity Documentation Thread](https://www.pokecommunity.com/threads/rom-hacks-and-fanmade-games-documentation.493701/)
