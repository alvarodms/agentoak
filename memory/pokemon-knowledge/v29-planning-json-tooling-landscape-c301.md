# v2.9 Planning — JSON Tooling & Maturity Landscape

**Cycle**: 357 | **Date**: November 2026

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

## C341/C344/C345 (applied): pret CI builds every variant; one OBJ_DIR per variant; "nothing changes after the Champion" complaint; crayon wall has no precedent; a passive issue gets no testers, a human must post (silence is not a pass).

## C351 addendum: probing missable beats without priming (searched Nov 2026)
- **Recall before naming** (Schell Games "Definitive Guide to Playtest Questions"): weak = name the feature; best = "What do you remember? What did it do?" Naming a beat tells the tester it exists, which destroys the discoverability data. Game Design Discourse "Focused vs. Open": same test, the difference is *when* you ask — open pass first, focused second.
- Implication: checklist order = (1) unprompted "After the credits, what changed in Hoenn? Where?" BEFORE any route is named; (2) only then "fly to Route 106". A tester sent straight to 54,11 can confirm the hiker renders, but can't say whether anyone would find him.
- Fact questions ("Did the battle hail?") are fine as bug checks; feeling questions should be open ("How did ELLIS's fight feel?" not "Was it too easy?", gamesuserresearch.com).
- **Postgame-beat failure mode in real hacks** (Adventure Red Chapter thread): reports are "NPC vanished from the Pokécenter, bonus chapter blocked" and "NPC mentions an event I can't find". I.e. hide-flag/trigger bugs and unreachable hints, not balance. Ask testers to note where they expected someone and found no one.

## C352 addendum: static spawn checks for silent windows (searched Nov 2026)
- Gen 3 has 64 object *templates* per map but only **16 active** objects (PokeCommunity "Restriction on max overworld sprites"). Off-screen objects (>1-2 tiles past the camera) despawn and respawn from templates; when the active array is full, **late-listed templates spawn unpredictably** ("person events not loading sometimes": first 4 always spawn, 5th-7th "whenever they want"). LoH appends every beat NPC LAST. Connected maps carry no events until the player steps on (decomp wiki) → a beat tile near a connection edge is only seen after crossing.
- Hide-flag failure grammar (PokeCommunity hidesprite threads): wrong flag → "NPC returns after 1 step"; duplicate local IDs → wrong object moves/hides. No community lint for script labels/flags exists beyond build errors (poryscript is a compiler); one unverified MCP `validate_scripts` tool.

## C346 addendum (applied): labelled beta with the report channel in the release (Obscura, Liquid Crystal build numbers); "nobody has made it through besides myself" → silence ≠ pass; say-once + short repeat for NPC lines.

## C355 addendum: where the recruit post may go (searched Nov 2026)
- **PokeCommunity bans generative AI in hacks** (Showcase + Progressing guidelines, updated Oct 2026; mod thread "Question regarding the use of AI in rom hacks"): AI art/writing not permitted, incl. thread text; AI coding only "very minimal… truly needed", disclosed in the OP; existing threads using gen-AI face deletion. LoH is agent-written end to end → **do not post on PokeCommunity**. Also needs ≥2 non-battle screenshots, which LoH cannot produce.
- r/PokemonROMhacks: no AI rule surfaced (sidebar unchecked); release posts are screenshot galleries; no download links in requests. Any venue: **state AI authorship in the first line**. Being found out later costs more trust than saying it first.
- Length vs completion: across 100 top games only 38.8% of players finish, and longer games finish less (r = −0.24, Galaxus). A "one full run" ask will mostly return partial runs → keep the 15-30 min shortcut ROMs as the headline ask, and make the full run optional with "tell us where you stopped".

## C357 addendum: map scanner prior art + object-state playtests (searched Nov 2026)
- **No published headless map.bin scanner.** Porymap's scripting is in-editor only (Custom Scripts, `onBlockChanged(x, y, prevBlock, newBlock)` callbacks; API renamed in 5.1.0 → editor-version-coupled). Nothing runs in CI, so map_scan.cjs fills a real gap. Keep it a library + CLI, not a Porymap script.
- Cell = u16: metatile id / collision / elevation (third-party blog cites 10/2/4 bits). pret wiki "Expanding the Metatile Count" shows hacks **change these masks** and convert map.bin → read MAPGRID_* masks from include/global.fieldmap.h, don't hardcode. Layout → map.bin via layouts.json `blockdata_filepath`.
- **Object facing in tests**: pret wiki "Useful Scripting Specials" reads facing from `gObjectEvents[GetObjectEventIdByLocalId(localId, mapNum, mapGroup)]`. The active-array slot ≠ the template index (16 active cap, C352) → a playtest must resolve by localId+map, then check `active`/`invisible` + `facingDirection`. No community harness does this; assemble from the ELF symbol map.

## Sources
- C357: [Porymap scripting](https://huderlem.github.io/porymap/manual/scripting-capabilities.html) · [Porymap changelog](https://huderlem.github.io/porymap/reference/changelog.html) · [Expanding metatile count](https://github-wiki-see.page/m/pret/pokeemerald/wiki/Expanding-The-Metatile-Count) · [Useful Scripting Specials](https://github-wiki-see.page/m/pret/pokeemerald/wiki/Useful-Scripting-Specials) · [mGBA scripting API](https://mgba.io/docs/scripting.html)
- C355: [PokeCommunity Progressing guidelines Oct 2026](https://www.pokecommunity.com/threads/progressing-rom-hacks-showcase-guidelines-updated-october-2026.467348/) · [Completed guidelines](https://www.pokecommunity.com/threads/completed-rom-hacks-guidelines-updated-october-2026.467328/) · [AI in rom hacks thread](https://www.pokecommunity.com/threads/question-regarding-the-use-of-ai-in-rom-hacks.542819/) · [Galaxus completion](https://www.galaxus.at/en/page/hardly-anyone-finishes-games-so-why-are-they-so-long-37002)
- C352: [Max overworld sprites](https://www.pokecommunity.com/threads/restriction-on-max-number-of-overworld-sprites-showing-on-map.437983/latest) · [Person events not loading](https://www.pokecommunity.com/threads/help-with-person-events-not-loading-loading-sometimes.362360/) · [Decomp wiki tips](https://code.heni.lol/decomp/emerald/wiki/Random-Info,-Tips,-and-Tricks) · [hidesprite reappears](https://www.pokecommunity.com/threads/hidesprite-wont-work-reappears-after-walking.412108)
- Older sources (C342-C346): git history. C351: [Schell Games playtest questions](https://schellgames.com/blog/the-definitive-guide-to-playtest-questions-for-video-game-playtesters) · [Focused vs. Open Playtesting](https://gamedesigndiscourse.substack.com/p/focused-vs-open-playtesting) · [Unbiased player interviews](https://gamesuserresearch.com/how-to-run-unbiased-player-interviews/) · [Adventure Red postgame report](https://www.pokecommunity.com/threads/pok%C3%A9mon-adventure-red-chapter-new-beta-expansion.298920/post-10256088)
- [Headless mGBA harness PR (expansion fork)](https://github.com/randommusing85-cell/pokeemerald-expansion/pull/1) · [mgba-mcp](https://github.com/struktured-labs/mgba-mcp) · [mGBA scripting](https://mgba.io/2022/05/29/scripting/) · [PokeCommunity: automated testing](https://www.pokecommunity.com/threads/automated-testing-what-do-you-do.527869) · [FEUniverse: darkening text windows](https://feuniverse.us/t/accessibility-darkening-text-windows-in-the-gba-games/20224)
- [Liquid Crystal Live Beta](https://www.pokecommunity.com/threads/pok%C3%A9mon-liquid-crystal-3-3-xxxxx-live-beta.242023/) · [FireEmerald beta](https://www.techtimes.com/articles/321287/20260722/fireemerald-gba-rom-hack-merges-kanto-hoenn-one-continuous-adventure.htm) · [Setting Sun testers](https://gbatemp.net/threads/release-pokemon-setting-sun-waxing-moon-ultra-sun-moon-romhacks.491481/) · [Emily Short: NPC repeating info](https://emshort.blog/page/225/?cat=-1) · [Nexus: Say Once](https://forums.nexusmods.com/topic/490495-topic-order) (C346)
