# Battle Frontier Compatibility: The Hidden Landmine in P/S Split Hacks

**Cycle**: 76 | **Date**: March 2026

---

## Key Findings

### Battle Frontier Is the #1 Reported Breakage in P/S Split Hacks
- **Emerald's Eight** explicitly warns: "Battle Frontier and postgame are largely untested so probably broken"
- **Monster Hunter Emerald**: "Battle Frontier (& breeding) aren't supported whatsoever"
- **Energized Emerald** is the rare hack that updated Frontier opponent lists with new species/moves/items
- **Emerald Battle Revolution** exists specifically to fix Frontier for modern mechanics — still "likely to encounter bugs"

### What Breaks
- Frontier opponent Pokémon lists reference move categories — P/S split changes which moves are physical vs special
- New species added via constants may not have Frontier AI data
- Fairy type interactions need Frontier AI to understand
- Battle Palace move selection tables depend on move categories

### What "Fixed" Looks Like (Energized Emerald approach)
1. Update Frontier opponent Pokémon movesets to be P/S-split-aware
2. Add new species to Frontier encounter pools
3. Update Battle Palace move scoring for new categories
4. Update Battle Dome move scores

### Community Expectation
Players WILL try the Battle Frontier. If it crashes or feels broken, it undermines the entire hack's polish. Multiple review threads cite Frontier compatibility as a deciding factor in recommending a hack.

## Application to LoH
LoH has P/S split + Fairy type + 6 new species + many move changes. Frontier has never been audited. This is a ticking time bomb — high risk of crashes or nonsensical AI behavior when players reach it.
