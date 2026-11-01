# v3.0 Opener — Trainer Cap Raise & In-Game Notebook Key Items

**Cycle**: 328 | **Date**: November 2026

---

## C328 — Notebook ↔ NPC feedback loop (Bombers' Notebook precedent)
- Majora's Mask Bombers' Notebook: one row per character, and solving their problem stamps a **Happy Sticker** on that row. The notebook records *who* the player helped, not just what was found. MM3D rebuilt it as a fuller quest log so every rewarding NPC has an entry. Kafei's schedule changes based on other events' outcomes, so the interlocking chains only work once the individual characters are established.
- Applied: once a believer reacts, the Field Notes page should show it (e.g. a margin line "copied out by a kid on ROUTE 104"). Without that, the NPC beats and the item stay two separate systems.
- Order: build individual believers first (pages 2-4), then the multi-page beat. A beat that reacts to several pages works best when the player has already met several believers.
- Searches for Pokémon hacks whose NPCs react to catches found nothing (C328). Pokémon fans have no clear reference point for this, so it is a differentiator, but there's no community benchmark either.
- Generic reactive-NPC writing (Wayline, DEV) warns against over-reactivity. Keep each reaction to one specific line about the player's actual deed.

## C327 — Reactive "skeptic" NPCs & the second slot pool
- Bulbapedia "Unused Trainer data": RS unused Aqua/Magma parties are at levels never fought and often nameless, BUT "some were reworked and integrated into the final release". So the RS list overstates Emerald's free pool. The C328 scanner must check script refs per ID, not trust the wiki list.
- Legends: Arceus requests are the cautionary case: players complain about manual turn-in ("interactive log that auto-completes"), poor signposting (looking requests up online), and tedium (Upcomer, Bulbagarden, Twinfinite). Tom's Guide liked the *pleas themselves*. Lesson: a correction NPC should react **passively** (read the flag on talk, no hand-over step) and sit on a road the player already walks.
- Writing guidance (game-writing guides): a few specific reactive lines beat many generic ones; the NPC must name the player's actual deed.
- A dialogue-only skeptic does NOT need a trainer slot (flag-gated text on a plain object). Spend slot 853 only if a battle is part of the beat.

## C326 — Reclaiming IDs: the pret "Link Battle placeholders" guide
- pret/pokeemerald wiki "Repurposing the Link Battle placeholders" is the community-standard route for exactly this: TRAINER_RED, TRAINER_LEAF, TRAINER_BRENDAN_PLACEHOLDER, TRAINER_MAY_PLACEHOLDER (bottom of trainers.h / trainer_parties.h) = up to 4 new trainers with no table growth.
- **Caveat the guide states**: if the player can reach the Cable Club (Pokémon Center 2F link rooms), that trainer data "may end up overwritten" in link play. The guide's fix is to block the Cable Club first. So "zero grep references by name" is not the whole check: link code can index these slots by arithmetic/version, not by constant name.
- Rules from the guide: keep the constant and party names (TRAINER_RED, sParty_Red); change only the name string, class, pic, AI, party. Copy music/pic/AI from a same-class trainer.
- Save safety: a reclaimed slot's trainer flag (0x500 + id) is clear in every v2.9 save because it was never battled, so the new trainer starts unbeaten. No flag shift.
- Beyond the 4 placeholders: Bulbapedia "Unused Trainer data" and TCRF RS page list unused RS-era Aqua/Magma parties (levels never fought, some unnamed) — carried into Emerald's table, a likely second pool. Verify each by script grep (Trick House 848-850 proved some "FRLG-looking" IDs ARE used).

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
- https://strategywiki.org/wiki/The_Legend_of_Zelda:_Majora's_Mask/The_Bomber's_Notebook (C328)
- https://zeldauniverse.net/2015/01/25/hands-on-with-majoras-mask-3d-exploring-the-new-and-improved-bombers-notebook/ (C328)
- https://www.wayline.io/blog/ai-npcs-reactive-game-worlds (C328)
- https://bulbapedia.bulbagarden.net/wiki/Unused_Trainer_data (C327)
- https://upcomer.com/i-cant-be-bothered-to-finish-the-boring-side-quests-in-arceus/
- https://bulbagarden.net/threads/what-are-somethings-you-dont-like-about-pokemon-legends-arceus.291749/post-7475289
- https://www.tomsguide.com/reviews/pokemon-legends-arceus
- https://abratabia.com/game-narrative/writing-game-characters.php
- https://github-wiki-see.page/m/pret/pokeemerald/wiki/Repurposing-the-Link-Battle-placeholders
- https://tcrf.net/Pokemon_Ruby_and_Sapphire
- https://www.pokecommunity.com/threads/maximum-number-of-trainers-in-pokeemerald.425848/
- https://www.pokecommunity.com/threads/firered-expand-max-of-trainers.383237/
- https://pokeromcodex.notion.site/Unbound-081f9972dc5b4ee8b77ae7d2c343ca54
- https://retrohandhelds.gg/pokemon-unbound-the-very-best-rom-hack
- https://animecollective.com/pokemon-unbound-review/
- https://git.32bit.cafe/cassie/cassiedotink/raw/branch/master/public/early-thoughts-on-pokemon-unbound/index.html
