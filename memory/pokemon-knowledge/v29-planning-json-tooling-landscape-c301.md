# v2.9 Planning — JSON Tooling & Maturity Landscape

**Cycle**: 323 | **Date**: October 2026

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

## C320 addendum: release-stage practice (searched Oct 2026; PokeCommunity threads, anecdotal)
- **Known Bugs list + one bug-report channel ship with the release.** Pokémon Obscura beta 1.0.0 bundles a "Known Bugs" section and a bug-report form. Explorers of the Spirit 1.0 shipped a changelog and a known-bugs list. Maxschersey projects add bugs reported in the thread to a known-bugs txt in the next patch.
- **Softlocks show up after release, in specific places:** AshGray room freezes and a post-event freeze, a crash in a Cyan beta 3 rival battle, Adventure Red tiles you can't step on and wild-encounter crashes. These are the same risk class as untested scripted statics and map objects (our dens).
- **Many reports are setup errors:** wrong base ROM, a dirty or out-of-order patch. Developers answer these with "clean v1.0 ROM + checksum".
- Takeaway: a release stage should be "declared untested items + report path + base-ROM checksum", not "everything verified". Pair it with the mGBA Lua route in discovery-beats file (C318).

## C323 addendum: closing the "untested" gap + read-through practice (searched Oct 2026)
- **Headless emulator testing exists in the ecosystem.** pokeemerald-expansion's test framework (`test_runner.c`, `test_runner_battle.c`) builds a test ROM and runs it with `make check` under `mgba-rom-test` (headless mGBA). Its "Hydra" wrapper runs tests in parallel across mGBA instances and reads pass/fail markers from GBA debug output. `make check TESTS="..."` runs one test. This is a proven way to get emulator verification in CI without a human. It fits LoH's RC list (Fey Flame/Undertow multipliers, switch-in messages). Porting it to vanilla pokeemerald is a large job. Do it as a tech-debt item, not a polish-cycle task. I did not confirm the exact Makefile wiring.
- **Read-through practice:** the PokeCommunity Daily "Newbie Mistakes – Dialogue" article names *consistency* (voice, formatting) as the top dialogue priority. Reviewers point out voice breaks, e.g. Crooked Crystal's Seamar Pokémart clerk has no accent while other locals do. Pokémon Wish feedback says "check your text in cutscenes", because some problems only show up in play. A polish pass should check voice consistency across a character's appearances, not only repeated words.

## Sources
- [DeepWiki: expansion battle test framework](https://deepwiki.com/rh-hideout/pokeemerald-expansion/9.1-battle-test-framework)
- [DeepWiki: expansion testing & debugging](https://deepwiki.com/rh-hideout/pokeemerald-expansion/9-testing-and-debugging)
- [PokeCommunity Daily: Newbie Mistakes – Dialogue](https://daily.pokecommunity.com/2016/09/27/rom-hacking-newbie-mistakes-dialogue)
- [Pokémon Crooked Crystal thread](https://www.pokecommunity.com/threads/pokemon-crooked-crystal.532778/)
- [pret/pokeemerald json_data_rules.mk](https://github.com/pret/pokeemerald/blob/master/json_data_rules.mk)
- [rh-hideout/pokeemerald-expansion](https://github.com/rh-hideout/pokeemerald-expansion)
- [DeepWiki: pokeemerald-expansion](https://deepwiki.com/rh-hideout/pokeemerald-expansion)
- [PokemonCoders: 50 Best ROM Hacks 2026](https://www.pokemoncoders.com/best-pokemon-rom-hacks/)
- [ScreenRant: Pokemon Ocean Blue](https://screenrant.com/pokemon-ocean-blue-2026-kanto/)
- [GameWhims: Best ROM Hacks 2026](https://gamewhims.com/roundup/best-pokemon-rom-hacks/)
- [Pokémon Obscura beta 1.0.0 thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-obscura-official-beta-1-0-0-release.536023/latest)
- [Pokémon Cyan beta 3 thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-cyan-beta-3-released.272818/post-8979049)
- [Adventure Red Chapter thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-adventure-red-chapter-new-beta-expansion.298920/post-9879871)
