# v3.0 Opener — Trainer Cap Raise & In-Game Notebook Key Items

**Cycle**: 330 | **Date**: November 2026

---

## C330 — Multi-page payoff: count thresholds, not one completion prize
- **Oak's aides (FRLG/Gen III)**: aides stand at fixed spots on roads the player already walks and check a *count* (Itemfinder at 30, Exp. Share at 50 on the Route 15 gate 2F). Several small rewards at thresholds, not one at 100%. Guides disagree on which item goes with which count, so players can't hold the exact numbers in their heads. Only the "talk to the aide, get a thing" loop sticks.
- **Bombers' Notebook**: guides say there is NO single reward for completing it. The payoff is in each entry, and finishing it all counts toward 100% and (some claim) a better ending. One source contradicts the other here, so it's weak evidence. Lesson: the per-NPC beats ARE the reward. The multi-page beat should be a small narrative acknowledgement, not a loot prize.
- Applied: `CountInkedFieldNotePages` should drive tiers (e.g. 3+ = believers "talk to each other", 7 = last page). Pages 5-7 are badge-gated, so an all-pages gate can't be reached until late. Pages 1-4 can all be inked by Route 113, so a ≥3 beat lands mid-game.
- Route 113 locale (Bulbapedia): Glass Workshop (NW) turns ash into glass furniture; its owner gives the Soot Sack, and ash grass collects soot per step. Two Ninja Boys hide under fake ash piles. Existing route verbs for a believer to use: sweeping/collecting ash, glass-making, hiding.

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
- https://bulbapedia.bulbagarden.net/wiki/Professor%27s_aides , https://allthings.how/pokemon-firered-and-leafgreen-oaks-aides-and-tm-locations/ (C330)
- https://www.thonky.com/zelda-majoras-mask/bombers-notebook , https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_113 (C330)
- https://www.supercheats.com/pokemon-sun/walkthrough/pokedex-quests (C329)
- https://www.gamerguides.com/pokemon-legends-z-a/database/missions/side-missions/i-d-like-to-see-an-ekans (C329)
- https://bulbapedia.bulbagarden.net/wiki/Granite_Cave (C329)
- https://strategywiki.org/wiki/The_Legend_of_Zelda:_Majora's_Mask/The_Bomber's_Notebook (C328)
- https://zeldauniverse.net/2015/01/25/hands-on-with-majoras-mask-3d-exploring-the-new-and-improved-bombers-notebook/ (C328)
- https://www.wayline.io/blog/ai-npcs-reactive-game-worlds (C328)
- C326-C327 (applied): bulbapedia Unused_Trainer_data, pret wiki "Repurposing-the-Link-Battle-placeholders", tcrf RS, PokéCommunity t=425848/383237, upcomer/Bulbagarden/Tom's Guide on Legends: Arceus requests, Unbound reviews (retrohandhelds, animecollective)
