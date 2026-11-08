# v2.9 Planning — JSON Tooling & Maturity Landscape

**Cycle**: 351 | **Date**: November 2026

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

## C341/C344 addenda (applied): pret CI builds every variant; one OBJ_DIR per variant; postgame "nothing changes after the Champion" complaint. Crayon wall: no Pokémon precedent.

## C351 addendum: probing missable beats without priming (searched Nov 2026)
- **Recall before naming** (Schell Games "Definitive Guide to Playtest Questions"): weak = name the feature; best = "What do you remember? What did it do?" Naming a beat tells the tester it exists, which destroys the discoverability data. Game Design Discourse "Focused vs. Open": same test, the difference is *when* you ask — open pass first, focused second.
- Implication: checklist order = (1) unprompted "After the credits, what changed in Hoenn? Where?" BEFORE any route is named; (2) only then "fly to Route 106". A tester sent straight to 54,11 can confirm the hiker renders, but can't say whether anyone would find him.
- Fact questions ("Did the battle hail?") are fine as bug checks; feeling questions should be open ("How did ELLIS's fight feel?" not "Was it too easy?", gamesuserresearch.com).
- **Postgame-beat failure mode in real hacks** (Adventure Red Chapter thread): reports are "NPC vanished from the Pokécenter, bonus chapter blocked" and "NPC mentions an event I can't find". I.e. hide-flag/trigger bugs and unreachable hints, not balance. Ask testers to note where they expected someone and found no one.

## C345 addendum (applied: memory/playtest-recruit-post.md): a passive issue gets no testers; the human must post where testers are (r/PokemonROMhacks, Discord). Silence is not a pass.

## C346 addendum: after the silent window (searched Nov 2026)
- Solo hacks don't wait for private testers to start the loop: they ship a **labelled beta with the report channel inside the release** (Obscura: bug-report form in the download folder; FireEmerald 2026 beta asks for bugs + difficulty; Liquid Crystal "Live Beta": every patch bumps a build number). Warning case: a dev whose testers never finished — "nobody has made it through besides myself." Silence ≠ pass.
- Repeating NPC lines: standard fix is "say once" first line + short repeat (Bethesda Say Once, RPG Maker sequential-then-last). Emily Short: never drop info the player might have missed → keep the '?' fact reachable in the repeat line.

## Sources
- Older sources (C342-C346): git history. C351: [Schell Games playtest questions](https://schellgames.com/blog/the-definitive-guide-to-playtest-questions-for-video-game-playtesters) · [Focused vs. Open Playtesting](https://gamedesigndiscourse.substack.com/p/focused-vs-open-playtesting) · [Unbiased player interviews](https://gamesuserresearch.com/how-to-run-unbiased-player-interviews/) · [Adventure Red postgame report](https://www.pokecommunity.com/threads/pok%C3%A9mon-adventure-red-chapter-new-beta-expansion.298920/post-10256088)
- [Headless mGBA harness PR (expansion fork)](https://github.com/randommusing85-cell/pokeemerald-expansion/pull/1) · [mgba-mcp](https://github.com/struktured-labs/mgba-mcp) · [mGBA scripting](https://mgba.io/2022/05/29/scripting/) · [PokeCommunity: automated testing](https://www.pokecommunity.com/threads/automated-testing-what-do-you-do.527869) · [FEUniverse: darkening text windows](https://feuniverse.us/t/accessibility-darkening-text-windows-in-the-gba-games/20224)
- [Liquid Crystal Live Beta](https://www.pokecommunity.com/threads/pok%C3%A9mon-liquid-crystal-3-3-xxxxx-live-beta.242023/) · [FireEmerald beta](https://www.techtimes.com/articles/321287/20260722/fireemerald-gba-rom-hack-merges-kanto-hoenn-one-continuous-adventure.htm) · [Setting Sun testers](https://gbatemp.net/threads/release-pokemon-setting-sun-waxing-moon-ultra-sun-moon-romhacks.491481/) · [Emily Short: NPC repeating info](https://emshort.blog/page/225/?cat=-1) · [Nexus: Say Once](https://forums.nexusmods.com/topic/490495-topic-order) (C346)
