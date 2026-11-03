# v3.0 Opener — Trainer Cap Raise & In-Game Notebook Key Items

**Cycle**: 333 | **Date**: November 2026

---

## C333 — Flag reclamation: three community routes
- **`FLAG_UNUSED_0x*` constants** are pret's sanctioned spare slots (pret wiki "Full Screen Start Menu" sets a feature flag to FLAG_UNUSED_0x020). The zero-risk pool: list those first in the ledger, before any "unreferenced but named" vanilla flag.
- **pret wiki "Reuse filler save space for Variables and Flags"**: copies a `gAdditionalSaveData` array in/out of each save sector's `unused` bytes (src/save.c); IDs from 0xF000 map there (flags 1 bit, vars 2 bytes; the two ranges must not overlap). The wiki says it keeps vanilla saves compatible. This is a route to hundreds of new flags without touching any vanilla bit. Check first that old saves read the sector padding as zero.
- Sibling pret pages: "Reclaim Unused Vars", "Saveblock Size" (measures headroom).
- Engine traps for a grep-only scanner (codebase knowledge, not from the wiki): temp flags are cleared on map load, daily flags by ClearDailyFlags, and trainer/hidden-item/item-ball flags are referenced from map.json, by range, or through computed IDs. A flag with zero grep hits inside a range can still be wiped or set. The ledger must exclude whole ranges, not only grep for names.

## C331 — Mentor payoff: phone call vs. in-person
- HGSS/GSC phone (Bulbagarden fan threads): players call the phone "annoying over time"; Bill's automated calls were "useless". Elm's *story* calls (e.g. after a badge) are remembered, not hated. Fans resent calls that interrupt without new content, not calls in general.
- Emerald Match Call: Birch is one of the few non-trainer entries. Rematch calls roll on step/minute counters + chance (`TryStartMatchCall`: step counter → minutes → chance → map allows → trainer select), so they can't be predicted. Vanilla one-shot story calls (Wally/Scott/Steven style) are a separate step-triggered path; verify in field code before reuse.
- Applied: the ≥3-pages beat should be ONE player-initiated or guaranteed-once beat. Best fit: in-person `ProfBirch_EventScript_FieldNotes` + the existing dex-rating Match Call (both already read `GetActiveFieldNote`). No random unprompted call. A forced call needs a flag (0x2BB is the last one free).

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

## C326 — Reclaiming IDs / trainer cap (applied)
- pret wiki link placeholders: keep constant/party names, change name/class/pic/AI/party; Cable Club caveat N/A (gTrainers const). MAX_TRAINERS_COUNT bump shifts system flags (PokéCommunity t=425848/383237) → reclaim zero-ref IDs only.

## Notebook / log key items

- **Unbound's Mission Log** is among its most praised QoL features (retrohandhelds, animecollective reviews): it tracks quest progress AND "which items have been found in collectathons". Praise is for *organization*, not prose.
- Criticism of Unbound side content: fetch/"do X times" tasks; the log can't save weak content.
- Takeaway for Field Notes item: lead with a found/not-found checklist of the three dens (state at a glance); the "corrections page" voice is flavor on top, not the core function.

## Sources
- https://github.com/pret/pokeemerald/wiki/Reuse-filler-save-space-for-Variables-and-Flags , https://github.com/pret/pokeemerald/wiki/Full-Screen-Start-Menu-by-Archie-and-Mudskip , https://github.com/pret/pokeemerald/wiki/Reclaim-Unused-Vars , https://github.com/pret/pokeemerald/wiki/Saveblock-Size (C333)
- https://bulbapedia.bulbagarden.net/wiki/Match_Call , https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_HeartGold_and_SoulSilver/Part_1 , https://www.bulbagarden.net/goto/post?id=939348 , https://pokecommunity.com/showthread.php?p=10212056 (C331)
- https://bulbapedia.bulbagarden.net/wiki/Professor%27s_aides , https://allthings.how/pokemon-firered-and-leafgreen-oaks-aides-and-tm-locations/ (C330)
- https://www.thonky.com/zelda-majoras-mask/bombers-notebook , https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_113 (C330)
- https://www.supercheats.com/pokemon-sun/walkthrough/pokedex-quests (C329)
- https://www.gamerguides.com/pokemon-legends-z-a/database/missions/side-missions/i-d-like-to-see-an-ekans (C329)
- https://bulbapedia.bulbagarden.net/wiki/Granite_Cave (C329)
- https://strategywiki.org/wiki/The_Legend_of_Zelda:_Majora's_Mask/The_Bomber's_Notebook (C328)
- https://zeldauniverse.net/2015/01/25/hands-on-with-majoras-mask-3d-exploring-the-new-and-improved-bombers-notebook/ (C328)
- https://www.wayline.io/blog/ai-npcs-reactive-game-worlds (C328)
- C326-C327 (applied): bulbapedia Unused_Trainer_data, pret wiki "Repurposing-the-Link-Battle-placeholders", tcrf RS, PokéCommunity t=425848/383237, upcomer/Bulbagarden/Tom's Guide on Legends: Arceus requests, Unbound reviews (retrohandhelds, animecollective)
