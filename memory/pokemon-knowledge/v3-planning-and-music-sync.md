# v3.0 Planning Direction & Music Speed Sync Feasibility

**Cycle**: 87 | **Date**: March 2026

---

## Music Speed Sync (Issue #73)

- The concept: slow down in-game music playback to compensate for emulator fast-forward, so music sounds normal at 2x-4x speed.
- **This is fundamentally an emulator-level problem, not a ROM-level one.** When emulators fast-forward, they speed up the entire system clock including the sound chip. The ROM has no way to detect emulator speed.
- GBAtemp thread confirms this is a long-standing emulator request, not something ROMs typically solve.
- The submitter links to their own implementation — but this would require deep engine work in the sound driver (m4a library), which is complex and fragile.
- **Emerald Rush Edition** solved the "game feels slow" problem differently: removing/shortening animations and delays in-ROM, so you don't need to fast-forward as much.
- **Community consensus**: most ROM hacks rely on emulator fast-forward and don't try to control music speed. Only battle speed options (animations off, text speed) are common in-ROM solutions.
- **Recommendation**: Defer. This is a niche feature with high implementation risk. The submitter's PR could be evaluated later, but it's not a v3.0 priority.

## v3.0 Feature Priorities (2025-2026 Landscape)

Top hacks in 2026 (Unbound v2, Lazarus 2.0, Emerald Imperium) share these traits:
1. **Smart AI / difficulty modes** — Radical Red and Imperium set the bar for tactical battles
2. **Side quests & postgame depth** — Unbound's 80+ missions remain the gold standard
3. **Modern mechanics** — Mega Evolution, Z-Moves, Dynamax in hacks that use expansion
4. **Character customization** — increasingly expected
5. **New regions/stories** — the biggest draw for "must-play" status

For LoH specifically (vanilla pokeemerald base, not expansion), realistic v3.0 directions:
- Difficulty modes (level scaling or hard mode toggle)
- More postgame quests building on Birch quest framework
- Trainer AI improvements
- Held items audit (trainers + wild)
- Additional species waves if the pipeline is proven
