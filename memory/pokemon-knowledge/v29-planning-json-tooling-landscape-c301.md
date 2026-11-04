# v2.9 Planning — JSON Tooling & Maturity Landscape

**Cycle**: 337 | **Date**: November 2026

---

## Key Finding: JSON-as-Source-of-Truth Is Now Ecosystem Standard
Vanilla pokeemerald and expansion both ship `json_data_rules.mk` (JSON → C at build: wild encounters; expansion adds learnsets, movesets). Expansion trainers use `.party` files. LoH's generate_trainer.cjs (JSON → macro C) is the same principle; the pattern extends to other data if needed.

## 2026 Scene: "Completeness" Is the Bar
Top 2026 lists (PokemonCoders, ComicBook, GameWhims) cite Unbound, Radical Red, Inclement Emerald, Crystal Clear. Shared trait = feeling *complete*; players drop a hack at the first crash. Pokemon Ocean Blue (2026) markets obsessive polish over novelty.

## C320 addendum: release-stage practice (PokeCommunity threads, anecdotal)
- Ship a **Known Bugs list + one bug-report channel** (Obscura beta 1.0.0, Explorers of the Spirit 1.0).
- Softlocks appear post-release in scripted spots (AshGray room freezes, Cyan beta 3 rival crash, Adventure Red bad tiles) — same risk class as our dens/statics.
- Many reports are setup errors → "clean ROM + checksum".
- Release stage = "declared untested items + report path + checksum", not "everything verified".

## C323 addendum: headless testing + read-through
- Expansion's test framework runs a test ROM under `mgba-rom-test` (headless) via `make check`; "Hydra" parallelises. Porting to vanilla = large tech-debt job.
- Dialogue read-through: *consistency* of voice is the top priority (PokeCommunity Daily); some problems only show up in cutscenes (Pokémon Wish feedback).

## C332 addendum: playtest checklists + reaching test states
- Vanilla has no debug menu; pret wiki "Add a debug menu" guide; keep it behind a compile-time define (expansion does). Without one, postgame checks cost ~20 h of replay.
- Checklist items: build ID + where / do / expect / severity; group by **save state**, not feature.

## C337 addendum: screenshot-based emulator pass (searched Nov 2026)
- **A headless mGBA screenshot harness exists as a PR on a pokeemerald-expansion fork** (randommusing85-cell/pokeemerald-expansion PR #1): boots the built ROM windowless, runs a *plain-text input script*, writes PNG screenshots + a contact sheet + memory checks, resolves symbols from the ELF (so it can read gSaveBlock flags / write warp targets). ~1 s per script. Unmerged fork — a design reference, not a dependency.
- **mgba-mcp** (struktured-labs): mGBA headless under xvfb, Lua frame callback → `screenshot()` → quit; savestate loading for reproducible states. Caveat: `emu:quit()` does not reliably exit → wrap every run in a timeout/watchdog.
- PokeCommunity "automated testing — what do you do" thread: the common practice is exactly build → scripted button presses → screenshots, using a debug menu to skip ahead.
- Implication for LoH: a symbol-aware harness can SET flags (FLAG_CAUGHT_*, 0x2BB, trainer flag 0x745) and warp straight to the den maps, replacing the 20 h replay. Static flag/route checks then become visual checks of rendered text.
- **Light text legibility**: FEUniverse accessibility thread — a vision-impaired player found GBA white/grey text on light windows hard to read, and "the gray option is close" to white. The usual fix is contrast against the box, not a lighter text colour. On the standard white message box, LIGHT_GRAY text with WHITE shadow is the lowest-contrast combination available → expect it to fail; DARK_GRAY/BLUE are the safe fallbacks.

## Sources
- [Headless mGBA harness PR (expansion fork)](https://github.com/randommusing85-cell/pokeemerald-expansion/pull/1) · [mgba-mcp](https://github.com/struktured-labs/mgba-mcp) · [mGBA scripting](https://mgba.io/2022/05/29/scripting/) · [PokeCommunity: automated testing](https://www.pokecommunity.com/threads/automated-testing-what-do-you-do.527869) · [FEUniverse: darkening text windows](https://feuniverse.us/t/accessibility-darkening-text-windows-in-the-gba-games/20224)
- [pret wiki: Add a debug menu](https://github.com/pret/pokeemerald/wiki/Add-a-debug-menu) · [FEUniverse: Prepping for playtesting](https://feuniverse.us/t/prepping-for-playtesting/8491) · [DeepWiki: expansion test framework](https://deepwiki.com/rh-hideout/pokeemerald-expansion/9.1-battle-test-framework)
- [PokeCommunity Daily: Newbie Mistakes – Dialogue](https://daily.pokecommunity.com/2016/09/27/rom-hacking-newbie-mistakes-dialogue) · [pret json_data_rules.mk](https://github.com/pret/pokeemerald/blob/master/json_data_rules.mk) · [PokemonCoders 2026](https://www.pokemoncoders.com/best-pokemon-rom-hacks/) · [ScreenRant: Ocean Blue](https://screenrant.com/pokemon-ocean-blue-2026-kanto/)
- [Obscura beta 1.0.0](https://www.pokecommunity.com/threads/pok%C3%A9mon-obscura-official-beta-1-0-0-release.536023/latest) · [Cyan beta 3](https://www.pokecommunity.com/threads/pok%C3%A9mon-cyan-beta-3-released.272818/post-8979049)
