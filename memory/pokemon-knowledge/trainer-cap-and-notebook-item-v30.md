# v3.0 Opener — Trainer Cap Raise & In-Game Notebook Key Items

**Cycle**: 329 | **Date**: November 2026

---

## C329 — "Show me" NPCs: the two official grammars
- **Dex-entry check (Sun/Moon Pokédex quests)**: the NPC wants to *see the entry*; no party needed, no time limit, mostly money rewards (supercheats, serebii). Passive, never strands the player.
- **Party check (Legends Z-A side missions, e.g. "I'd like to see an Ekans", Skiddo)**: the mon must be on the team when you talk. Reads as literally "showing" it, but costs a box trip.
- Applied: the hiker's state must stay dex-caught (= page ink, so notebook and NPC never disagree). Word him as reacting to the *record* ("Your POKéDEX says…"), not to a mon at your side. Otherwise players will try to show their party and wonder why the dex is what counts.
- Granite Cave already has a vanilla hiker near the entrance who hands out HM05 Flash. Put the believer clearly apart from him, or players will mix up the two hikers.

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

## Trainer cap (TRAINERS_COUNT bump)
- Community (PokéCommunity t=425848, t=383237): raising MAX_TRAINERS_COUNT "collides with system flags"; prefer a second flag block or reclaiming IDs.
- Local: `SYSTEM_FLAGS = TRAINER_FLAGS_END + 1`, so any MAX bump shifts every FLAG_SYS_* flag and breaks v2.9 saves. Route chosen: reclaim zero-ref IDs (Trick House 848-850 ARE used); fallback is to pin SYSTEM_FLAGS before bumping.

## Notebook / log key items

- **Unbound's Mission Log** is among its most praised QoL features (retrohandhelds, animecollective reviews): it tracks quest progress AND "which items have been found in collectathons". Praise is for *organization*, not prose.
- Criticism of Unbound side content: fetch/"do X times" tasks; the log can't save weak content.
- Takeaway for Field Notes item: lead with a found/not-found checklist of the three dens (state at a glance); the "corrections page" voice is flavor on top, not the core function.

## Sources
- https://www.supercheats.com/pokemon-sun/walkthrough/pokedex-quests (C329)
- https://www.gamerguides.com/pokemon-legends-z-a/database/missions/side-missions/i-d-like-to-see-an-ekans (C329)
- https://bulbapedia.bulbagarden.net/wiki/Granite_Cave (C329)
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
