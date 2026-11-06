# v2.9 Planning — JSON Tooling & Maturity Landscape

**Cycle**: 344 | **Date**: November 2026

---

## Baseline
- JSON-as-source-of-truth is ecosystem standard (`json_data_rules.mk`, expansion `.party`); LoH's generators match it.
- 2026 bar = feeling *complete* (Unbound, Radical Red, Inclement Emerald, Crystal Clear); players drop a hack at the first crash. Ocean Blue (2026) markets polish over novelty.
- C320 release practice: Known Bugs list + one report channel (Obscura, Explorers of the Spirit); post-release softlocks cluster in scripted spots (AshGray, Cyan beta 3); many reports are setup errors → "clean ROM + checksum". Release = declared untested items + report path, not "everything verified".

## C342 addendum: the evidence gate has no inlet (searched Nov 2026)
- r/PokemonROMhacks recruit posts (Phoenix Red, Aug 2025) filled with volunteers **within a day or two**; testers asked for a patch/Discord link and whether they may **stream** → decide streaming rules up front. A 2026 hack asked testers for difficulty balance via a **shared doc + Discord**. The bottleneck is posting the ask, not tester supply.
- FEU/PokeCommunity playtest guidance: offer ONE chapter, "playtest it yourself before submitting", never share the .gba (patch only).
- Postgame-callback search (generic RPG dev threads, Elden Ring "post-game felt unchanged"): players notice *absence* of change after the ending; no Pokémon-hack evidence for/against single-NPC postgame lines. BW2's returning cast is a whole-region device, not one NPC. Thin.

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

## C338 addendum: recruiting testers + same-visit catch cues (searched Nov 2026)
- **REGIUS full-game beta (PokeCommunity)**: a known-bugs list to read first, a separate bug-report form, a private feedback form, and public thread replies. **Crimson Ruby beta (r/PokemonROMhacks 2026)** states its scope ("playable up to Fallarbor") and names the feedback it wants (difficulty, trainer teams, bugs). Testers need a scope boundary + named questions, not an open-ended "play it".
- **FEUniverse "Playtesting Listings"** takes single-chapter requests, not only full games, so a v3.0 den-chapter-only ask fits there. Posting is outward-facing, so a human has to do it.
- Phoenix Red recruit thread: testers ask about handheld/retro devices. Put "tested on: emulator X / hardware?" in the bug form.
- Same-visit catch reaction: pre-decomp threads read the battle outcome right after the wild battle (decomp: `specialvar VAR_RESULT, GetBattleOutcome` vs B_OUTCOME_CAUGHT, as the vanilla legendary scripts do). The search turned up no hack-specific precedent for an NPC turning on a catch; the vanilla pattern (outcome branch → `applymovement` emote/face → `waitmovement`) is the standard tool.

## C339 addendum: skip-ahead playtest builds (searched Nov 2026)
- **FEUniverse "Prepping for playtesting" + "Skipping portions of a chapter"**: the GBA-decomp habit is a build-time `__DEBUG__` define plus ONE call placed at the very first scripted event, which jumps to a dev-written setup event. Not a full menu. Same shape as the pret "Add a debug menu" guide's `DEBUG` define, minus the UI.
- The other common route is shipping a chapter-start **.sav** made on an emulator (FEU guide: share only the .sav, never the ROM). LoH can't make one (no emulator in the runner), so the define-gated setup script is the only path the agent can build itself.
- **Save hygiene**: beta threads (Adventure Red "BETA 12 SAVEFILES ARE NOT COMPATIBLE") and TCRF's Emerald debug-menu warning (options that corrupt saves) both say to keep debug saves apart. Emulators name the save after the ROM, so a separately named `legends_of_hoenn_playtest.gba` keeps its save away from real ones automatically.
- An itch.io beta offered a "skip loading a save to select chapters" option. Chapter select is the player-facing version of the same idea.

## C341 addendum: keeping a variant build from rotting + postgame callbacks (searched Nov 2026; thin)
- pret-derived CI (DizzyEggg fork build.yml) builds **every variant on every push**: agbcc, then `MODERN=1 COMPARE=0`, then the test ELF + `make check`. The habit is "compile each variant", not "lint the variant's setup text". Expansion 1.15.1 notes fixed its test ROM **running out of space at 90%+ usage**, so an extra-content variant can fail where the release build passes.
- For LoH: the cheapest guard against a stale `make playtest` is building it inside check_all/runner. A grep-lint only catches renamed symbols, and the compiler already catches those once it builds.
- Postgame: Bulbagarden "virtually nothing changes when you beat the Champion"; hacks answer with rematches, rarely NPC lines (a wish, not proof).

## C344 addendum: building variants + crayon-wall precedent (searched Nov 2026; thin)
- Expansion's Makefile gives each variant its own OBJ_DIR (build/emerald, build/modern, build/test) AND passes the variant as a define (`-DTESTING=$(TEST)`). Sharing one build dir across defines reuses stale .o files: a playtest build can link retail objects and *look* fine. Separate dirs (or `make clean` between) are mandatory; then confirm the variant took (e.g. `strings`/symbol check that the preset script label is in the ELF).
- Size: expansion 1.15.1's test ROM ran out of space at 90%+; a preset adds script + data → check free ROM space of each variant.
- Crayon wall / "world records the player's deeds as art": no Pokémon-hack precedent found. Nearest: Loominary (each choice adds a colour to a woven scarf, an accumulating artifact) and the RPG Maker "townsfolk speak of a hero's deeds" device. Pentiment's mural (C343) remains the best precedent. Evidence neither for nor against.

## Sources
- [FEU: Prepping for playtesting](https://feuniverse.us/t/prepping-for-playtesting/8491) · [Phoenix Red reply](https://twt.omada.cafe/r/PokemonROMhacks/comments/1mgmrcr/pokemon_phoenix_red_version_seeking_beta_testers/n7241ib/?context=3) · [Elden Ring post-game thread](https://steamcommunity.com/app/1245620/discussions/0/3278065526395526404) · [Bulbapedia B2W2](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Black_2_and_White_2) (C342)
- [FEU: skipping chapter portions](https://feuniverse.us/t/skipping-portions-of-a-chapter-for-play-testing/24828) · [Adventure Red beta](https://www.pokecommunity.com/threads/pok%C3%A9mon-adventure-red-chapter-new-beta-expansion.298920/) · [TCRF Emerald debug menu](https://new.tcrf.net/Proto:Pok%C3%A9mon_Emerald/Debug_Menu) · [itch.io chapter-select beta](https://itch.io/post/9411911)
- [REGIUS beta](https://www.pokecommunity.com/threads/regius-an-island-adventure-full-game-beta.531729) · [Crimson Ruby](https://r.datuan.dev/r/PokemonROMhacks/comments/1u8csa9/pokémon_crimson_ruby_oras_rom_hack/) · [FEUniverse Playtesting Listings](https://feuniverse.us/t/playtesting-listings/30608) · [Phoenix Red testers](https://twt.omada.cafe/r/PokemonROMhacks/comments/1mgmrcr/pokemon_phoenix_red_version_seeking_beta_testers) · [PokeCommunity: event when wild mon defeated](https://www.pokecommunity.com/threads/event-when-a-certain-wild-pokemon-is-defeated.418674)
- [Headless mGBA harness PR (expansion fork)](https://github.com/randommusing85-cell/pokeemerald-expansion/pull/1) · [mgba-mcp](https://github.com/struktured-labs/mgba-mcp) · [mGBA scripting](https://mgba.io/2022/05/29/scripting/) · [PokeCommunity: automated testing](https://www.pokecommunity.com/threads/automated-testing-what-do-you-do.527869) · [FEUniverse: darkening text windows](https://feuniverse.us/t/accessibility-darkening-text-windows-in-the-gba-games/20224)
- [DizzyEggg pokeemerald build.yml](https://github.com/DizzyEggg/pokeemerald/blob/c3e9f4b571717c0e12cf4a3fe61c0f3a50185327/.github/workflows/build.yml) · [Expansion 1.15.1 notes](https://newreleases.io/project/github/rh-hideout/pokeemerald-expansion/release/expansion%2F1.15.1) · [Bulbagarden: You are the Champion](https://bulbagarden.net/threads/you-are-the-champion.101329/) (C341)
- [Expansion Makefile](https://github.com/rh-hideout-chinese/pokeemerald-expansion/blob/master/Makefile) · [netlabs variant-build ticket](https://trac.netlabs.org/fm2/ticket/396) · [Loominary](https://wbs.cdn.uib.no/wiki/Loominary) · [RPG Maker: bringing your world to life](https://rpgmaker.net/articles/137) (C344)
- [pret wiki: Add a debug menu](https://github.com/pret/pokeemerald/wiki/Add-a-debug-menu) · [DeepWiki: expansion test framework](https://deepwiki.com/rh-hideout/pokeemerald-expansion/9.1-battle-test-framework)
- [PokeCommunity Daily: Newbie Mistakes – Dialogue](https://daily.pokecommunity.com/2016/09/27/rom-hacking-newbie-mistakes-dialogue) · [pret json_data_rules.mk](https://github.com/pret/pokeemerald/blob/master/json_data_rules.mk) · [PokemonCoders 2026](https://www.pokemoncoders.com/best-pokemon-rom-hacks/) · [ScreenRant: Ocean Blue](https://screenrant.com/pokemon-ocean-blue-2026-kanto/)
- [Obscura beta 1.0.0](https://www.pokecommunity.com/threads/pok%C3%A9mon-obscura-official-beta-1-0-0-release.536023/latest) · [Cyan beta 3](https://www.pokecommunity.com/threads/pok%C3%A9mon-cyan-beta-3-released.272818/post-8979049)
