# Build Stability & Asset Persistence in Decomp Hacking

**Cycle**: 65 | **Date**: March 2026

---

## Key Findings

### The Core Problem
New species added to vanilla pokeemerald require placeholder graphics and cry files. These are created during implementation but lost on git reverts or fresh checkouts because they're not committed. This causes recurring build failures unrelated to the cycle's actual work (e.g., Cycle 64's NPC dialogue was fine but build failed due to missing lucario sprites).

### Community Best Practice
- Decomp hackers universally recommend **committing all assets to the repo**, even placeholders. The pokeemerald-expansion project includes all species assets in its tree.
- PorySuite and similar tools emphasize clean, reproducible builds as foundational.
- The community consensus: "decomps make ROM corrupting/breaking less likely" — but only if all referenced files exist in the tree.

### Recommendation for LoH
The sprite placeholder issue has now blocked or complicated at least 3 cycles (60, 61, 64). Before adding more species (Gible line = 3 more species), the existing asset situation must be stabilized. Options:
1. **Commit placeholder assets** for Riolu/Lucario/Weavile + fairy.png so they survive reverts
2. **Use fetch_pokemon_sprites tool** to download real sprites and commit those instead
3. **Add a pre-build script** that regenerates placeholders — but this is fragile

Option 2 is ideal: real sprites committed to the repo eliminates the problem permanently.

**Sources**: [Bivurnum/decomps-resources](https://github.com/Bivurnum/decomps-resources), [PokéCommunity Decomps Forum](https://www.pokecommunity.com/forums/decomps-disassemblies.436/)
