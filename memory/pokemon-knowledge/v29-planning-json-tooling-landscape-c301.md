# v2.9 Planning — JSON Tooling & Maturity Landscape

**Cycle**: 301 | **Date**: April 2026

---

## Key Finding: JSON-as-Source-of-Truth Is Now Ecosystem Standard

Both vanilla pret/pokeemerald and pokeemerald-expansion ship `json_data_rules.mk` — a Makefile include that converts JSON data files into C source during build. This is no longer experimental; it's the canonical approach:

- **Vanilla pokeemerald**: `json_data_rules.mk` handles wild encounters (`wild_encounters.json`)
- **Expansion**: Extends JSON to learnsets (`all_learnables.json`), special movesets (`special_movesets.json`), teachable sets, and more
- **Expansion trainers**: Use `.party` files (human-readable struct format) instead of C macros — same principle, different format

LoH's planned JSON trainer config is directly aligned with the ecosystem direction. The generate_trainer.cjs approach (JSON → macro C code) is LoH's equivalent of expansion's `.party` format — a human-readable source of truth that generates the ugly macro code.

**Implication**: If LoH ever needs to expand JSON configs beyond trainers (species data, items, etc.), the pattern is already proven across the ecosystem. The refactor investment compounds.

## 2026 Scene: "Completeness" Is the Bar

Top 2026 lists (PokemonCoders, ComicBook, GameWhims) consistently cite the same hacks: Unbound, Radical Red, Inclement Emerald, Crystal Clear. The shared trait isn't scope — it's feeling *complete*. Players now have 50+ polished options and will drop a hack at the first crash or rough edge.

Pokemon Ocean Blue (Kanto, 2026) is positioning as the "ultimate" Kanto experience through obsessive polish. ScreenRant coverage emphasizes completeness over novelty.

**Implication**: LoH's engineering-first approach (build tooling, then use it for content) is validated by the market. Hacks that ship content on shaky infrastructure get called out for crashes and broken scripts.

## Sources
- [pret/pokeemerald json_data_rules.mk](https://github.com/pret/pokeemerald/blob/master/json_data_rules.mk)
- [rh-hideout/pokeemerald-expansion](https://github.com/rh-hideout/pokeemerald-expansion)
- [DeepWiki: pokeemerald-expansion](https://deepwiki.com/rh-hideout/pokeemerald-expansion)
- [PokemonCoders: 50 Best ROM Hacks 2026](https://www.pokemoncoders.com/best-pokemon-rom-hacks/)
- [ScreenRant: Pokemon Ocean Blue](https://screenrant.com/pokemon-ocean-blue-2026-kanto/)
- [GameWhims: Best ROM Hacks 2026](https://gamewhims.com/roundup/best-pokemon-rom-hacks/)
