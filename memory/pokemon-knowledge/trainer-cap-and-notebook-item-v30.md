# v3.0 Opener — Trainer Cap Raise & In-Game Notebook Key Items

**Cycle**: 324 | **Date**: October 2026

---

## Trainer cap (TRAINERS_COUNT bump) — community evidence + local code check

- Vanilla Emerald: 855 trainers used of MAX_TRAINERS_COUNT 864; trainer flags at fixed base 0x500 (PokéCommunity t=425848).
- Community reports: raising MAX_TRAINERS_COUNT "collides with system flags"; one user hit a hard ceiling of 992 after save-block edits. Recommended routes: **free unused flags / add a second trainer-flag block** rather than grow the first; FireRed guide notes the trainer-flag handler hardcodes the 0x500 base.
- **Local fact (C324 read of include/constants/flags.h)**: `SYSTEM_FLAGS = TRAINER_FLAGS_END + 1`, and `TRAINER_FLAGS_END = 0x500 + MAX_TRAINERS_COUNT - 1`. This hack already has MAX = 891, so system flags start at 0x87B (vanilla 0x860; the comments in flags.h still say 0x860/0x85F/874 — stale).
  - => Every MAX bump **shifts every FLAG_SYS_* flag** (badges, FLAG_SYS_GAME_CLEAR, POKEDEX_GET, B_DASH, Frontier symbols). Existing v2.9 saves would load with wrong badges/game-clear. Save-breaking.
- Save-safe alternatives, best first:
  1. **Reclaim dead vanilla IDs**: TRAINER_MARIELA/ALVARO/EVERETT (848-850) and RED/LEAF (851-852) are unused in vanilla Emerald battles (verify with grep before reuse) → +5 slots with zero flag movement.
  2. Pin SYSTEM_FLAGS to an absolute constant (0x87B) before bumping, then put new trainer flags in a second block (e.g., the unused 0x4D?-0x4EF range) with a range check in the trainer-flag helpers.
  3. Plain bump only if v3.0 is declared save-incompatible (state it in README).

## Notebook / log key items

- **Unbound's Mission Log** is among its most praised QoL features (retrohandhelds, animecollective reviews): it tracks quest progress AND "which items have been found in collectathons". Praise is for *organization*, not prose.
- Criticism of Unbound side content: fetch/"do X times" tasks; the log can't save weak content.
- Takeaway for Field Notes item: lead with a found/not-found checklist of the three dens (state at a glance); the "corrections page" voice is flavor on top, not the core function.

## Sources
- https://www.pokecommunity.com/threads/maximum-number-of-trainers-in-pokeemerald.425848/
- https://www.pokecommunity.com/threads/firered-expand-max-of-trainers.383237/
- https://pokeromcodex.notion.site/Unbound-081f9972dc5b4ee8b77ae7d2c343ca54
- https://retrohandhelds.gg/pokemon-unbound-the-very-best-rom-hack
- https://animecollective.com/pokemon-unbound-review/
- https://git.32bit.cafe/cassie/cassiedotink/raw/branch/master/public/early-thoughts-on-pokemon-unbound/index.html
