# v2.9 Planning — JSON Tooling, Maturity, Release-Stage Practice

**Cycle**: 400 | **Date**: November 2026

---

## Baseline
- JSON-as-source-of-truth is ecosystem standard (`json_data_rules.mk`, expansion `.party`); LoH's generators match it.
- 2026 bar = feeling *complete* (Unbound, Radical Red, Inclement Emerald, Crystal Clear); players drop a hack at the first crash. Story hacks are praised for pacing + clear direction (2025 award Best Story: *Odyssey*), not volume.
- Release practice: Known Bugs list + one report channel + stated scope ("playable up to X"); softlocks cluster in scripted spots; many reports are setup errors (ask emulator/hardware, clean ROM).

## Testing / harness (still live)
- **A passing playtest proves a beat *fires*, not that it is *noticed*** (telemetry shows what, never why; Game Developer "Telemetry-Supported Design"). Retrospectives list, per beat, the condition under which a player misses it.
- **Chain vs checkpoint** (C377, bugnet/ixie): few long chains for *transitions*, many checkpoint tests for branches; assert at each seam; pin seed, wait on state/text not time. A trainer whose flag is already set silently won't approach: assert it UNSET before the walk.
- **Synthetic checkpoints** (C367): expansion's test runner can't reach the overworld, so LoH's object/facing playtests have no upstream equivalent. Briney is the known fragile state machine (Archipelago forces him always present). Never carry VAR_TEMP_*/temp flags in a checkpoint.
- **Golden-master rules** (C372): record the golden on the untouched commit; prove it can fail (mutation); investigate every diff; pin quirks, fix them later. Two-phase validation (structural, then cross-reference). One loader module for a manifest.
- **Selftest plants must name the rule** (C373, typescript-eslint RuleTester): assert which rule fired and that no other did.
- **No published**: headless map.bin scanner (Porymap scripting is in-editor only; read MAPGRID_* masks from global.fieldmap.h), Match Call screen test, round-trip warp test, beat/quest manifest lint. LoH's tooling is unprecedented here.
- **Seed sweeps (C400)**: pokeemerald-expansion's battle tests *rig* the RNG by default (always hit, no crits, secondary effects always fire, fixed damage roll) and assert only player-visible output. Chance is tested separately with `PASSES_RANDOMLY` (a pass-rate assertion over many RNG trials; the release notes say at most one per test, and a 3-arg form is used for speed). Upstream does not answer "outcome depends on seed" by sweeping whole fights. It splits the checks into a rigged *mechanic* test and a separate *probability* test. A LoH seedSweep step should report a rate (e.g. "HH by t2 in ≥2/3 seeds") and should not turn one-seed wins into guards.
- Object facing: resolve by localId + map (`GetObjectEventIdByLocalId`), active slot ≠ template index; 16 active objects per map.

## Players and testers
- **Quit moments cluster EARLY** (PokeCommunity thread 524956): early gyms with full competitive teams, empty early routes, "could not FIND" the next goal. Early crowding hurts more than sparseness (Unbound, Clover).
- 38.8% of players finish games, longer finish less (Galaxus): most never see postgame.
- **PokeCommunity bans generative AI in hacks** (Oct 2026 guidelines): do not post there. Any venue: state AI authorship in the first line.
- A passive issue gets no testers; silence is not a pass.

## Applied one-liners
- C323/C332/C337: expansion `mgba-rom-test`; debug skip behind a compile define; checklist grouped by save state; LIGHT_GRAY on white fails contrast.
- C338/C346: labelled beta + report form + named questions; say-once + short repeat for NPC lines. C339/C341/C344: separately named playtest ROMs, one OBJ_DIR per variant.
- C351/C352: recall before naming; real postgame reports are hide-flag bugs ("NPC vanished"); connected maps carry no events until stepped on.
- C359/C362: bounded open beta as freeze exit; FTUE QA = fresh save, one continuous journey, out-of-order + quit/resume.

## Sources
- C400: [Expansion 1.5.1 release (PASSES_RANDOMLY)](https://newreleases.io/project/github/rh-hideout/pokeemerald-expansion/release/expansion%2F1.5.1) · [Expansion testing system (rigged RNG)](https://expansion-docsite-kildemal.pages.dev/tutorials/how_to_testing_system)
- C377: [bugnet regression](https://bugnet.io/blog/automated-regression-testing-game-builds) · [bugnet checkpoints](https://bugnet.io/blog/how-to-test-your-checkpoint-system-before-you-ship) · [PokeCommunity 445089](https://www.pokecommunity.com/threads/emerald-some-trainer-battles-wont-start-acting-like-i-already-beat-a-trainer-that-i-never-fought-before-in-a-save-file.445089)
- C373/C372: [RuleTester test cases](https://tessl.io/registry/tessl/npm-typescript-eslint--rule-tester/files/docs/test-cases.md) · [SO blog regression tests](https://stackoverflow.blog/2026/10/22/the-regression-tests-nobody-writes-capturing-how-software-actually-behaves/) · [Pedre validators](https://msaizar.github.io/pedre/api/validators)
- C367: [Expansion testing system](https://expansion-docsite-kildemal.pages.dev/tutorials/how_to_testing_system) · [Archipelago Emerald ROM changes](https://archipelago.gg/tutorial/Pokemon%20Emerald/rom_changes_en)
- C365/C360: [Telemetry-Supported Design](https://www.gamedeveloper.com/design/telemetry-supported-game-design) · [Quit-moment thread](https://www.pokecommunity.com/threads/what-quit-moment-made-you-drop-a-large-pokemon-fangame-hack.524956)
- C357: [Porymap scripting](https://huderlem.github.io/porymap/manual/scripting-capabilities.html) · [Useful Scripting Specials](https://github-wiki-see.page/m/pret/pokeemerald/wiki/Useful-Scripting-Specials)
- C355: [PokeCommunity Oct 2026 guidelines](https://www.pokecommunity.com/threads/progressing-rom-hacks-showcase-guidelines-updated-october-2026.467348/) · [Galaxus completion](https://www.galaxus.at/en/page/hardly-anyone-finishes-games-so-why-are-they-so-long-37002)
- C352: [Max overworld sprites](https://www.pokecommunity.com/threads/restriction-on-max-number-of-overworld-sprites-showing-on-map.437983/latest)
- Older sources (C323-C351, C359, C362): git history.
