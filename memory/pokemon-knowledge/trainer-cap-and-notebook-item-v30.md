# v3.0 Opener — Trainer Cap Raise & In-Game Notebook Key Items

**Cycle**: 363 | **Date**: November 2026

---

## C363 — Watched NPC walk (forager 18,34 → 11,24; searched Nov 2026; thin, mostly forum craft)
- Cutscene craft (Fable / Half-Life 2 cited; "design sins" critiques): a lock is accepted when brief and purposeful; complaints come from locks held past the story moment. Keep the locked walk short and give the player control back fast.
- Gen III forum craft (PokeCommunity threads): object movement off-screen is unreliable (movesprite fails on unloaded NPCs; advice is to keep walkers within ~1 tile of the view edge). Vanilla-style fix for a long walk = `special SpawnCameraObject` + applymovement OBJ_EVENT_ID_CAMERA + `RemoveCameraObject` (pret wiki "Keep the Camera from Making Waves" notes camera ground-effect quirks).
- GBA view = 15×10 tiles (player ~7 tiles each side, ~4-5 up/down). A 17-step walk (7 W + 10 N) leaves the screen after ~5 N steps: the player "watches" an empty frame. Options: walk only the on-screen leg + `setobjectxyperm` for the rest; camera pan; or she walks out of view on purpose (exit = grief beat) and is found at 11,24 later.

## C361 — First-ink cue: how games signal "your journal changed" (searched Nov 2026; mixed strength)
- **Legends: Arceus**: a catch does NOT finish an entry on its own. Progress shows up later as a Progress Report page (tasks done, dex data updated, points) at a fixed check-in, not mid-field. The update is shown *to* the player at a known moment (Upcomer, Looper, Bulbapedia).
- **Majora's Mask**: the 3DS remake swapped the notebook's get-jingle from the generic item tune to the Mask tune (TCRF). Nintendo spent a distinct *sound* to mark the notebook as special. Weak, but on point.
- Journal-popup anecdotes (itch.io dev threads, Half-Life "featureful" journal docs): a popup that doesn't say *where* the journal is reads as noise ("journal updated… where?"); the better pattern puts the open key in the notice. Repeated notices annoy, so make it a one-time cue.
- Vanilla Emerald hook: a first catch already auto-opens the Pokédex entry ("registered data"). The player is already looking at a "record" screen. A cue placed right after it rides an existing beat instead of adding a new one.
- Applied: a one-time line after the first page-1 ink that names FIELD NOTES *and* how to open it (SELECT/Bag), fired once (flag or VAR), plus an existing SE; then playtest that the next useKeyItem shows red.

## C358 — Postgame mentor: payoff line vs. quest hook (talk order; searched Nov 2026)
- **Hades (filmstories / Kasavin interviews)**: dialogue is a queue of nuggets with priority + unlock conditions; a fresh story beat (e.g. first Meg win) pre-empts small talk on the NEXT talk, then is spent. Kasavin: hitting repeated dialogue is "disappointing". Payoff first, once; routine lines after.
- Modding/tooling practice (Unity forum, Strayspark, Nexus/Skyrim): gate lines by game state, not tree position; never hide essential info behind an earlier branch that can swallow it (exactly the BirchQuestCheck bug). Explicit priority systems surprise authors, so prove order with a test.
- Vanilla Emerald postgame Birch is already crowded: National Dex upgrade + Johto starter offer after HoF + Hoenn dex (Bulbapedia). Any reorder must keep those reachable.
- Applied: report before quest, but spend it per lab visit (FLAG_TEMP_*, cleared on map load like B1F_2R's FLAG_TEMP_13), not per talk; zero save flags.

## C343 — Retelling the player's record (Fortree crayon wall precedent; searched Nov 2026)
- **Pentiment Act III mural**: the player's Act II choices become the town's painted history, and the player chooses which events it emphasizes. Critics (GameSpot) praise it as "the subjectivity of historical record"; sources frame it as *selective/shaped by the teller*, NOT factually wrong. The player stays an author of the retelling.
- **Tim Cain "believable reactivity"**: NPCs react to *what changed* (outcomes they could plausibly know), not to the action itself. Kids copying ink must plausibly have seen the notebook (via the schoolkid lesson chain, not magic).
- No praised "distorted rumor of player deeds" mechanic found; Shadow of Mordor Nemesis is the nearest praised cousin (enemies remember outcomes). Weak evidence.
- Implication: a crayon wall where the words are subtly wrong risks testers reporting them as typos. Pentiment's grammar is "same facts, different emphasis/voice", so the copy should be visibly a child's paraphrase (simplified, exaggerated), not a misspelling.

## C340 — "The player's own ink is wrong": precedent (searched Nov 2026; thin)
- No game found that *retracts* a player-written record as a designed beat; searches return unreliable narrators (Giant Bomb) and journal bugs (Caves of Qud tracker), not designed corrections. Weak evidence either way.
- **Obra Dinn**: the logbook confirms fates only in threes and never says which guess is wrong. Critics praise that it "doesn't overly punish mistakes". Wrongness is told through *withheld confirmation*, not an NPC scolding.
- **Outer Wilds ship log**: shows "rumor" vs confirmed entries and greys out leads; it never marks an entry false. Reviewers (Edge) say progress lives "in your own head", and the log only tracks it.
- C345 (thin): Golden Idol (IGF design award) also confirms deductions only in structured blanks, and reviewers note it never settles every motive. The praised deduction games confirm the *facts* and leave interpretation open; none found that pays a doubt off with a cost.
- Implication: the precedent is "your note was a rumor / incomplete", not "your note was false". Page 7 (Steven: right but incomplete) already holds that register, so a new wrong-ink beat must differ (e.g. ink the *world* outgrows later, or the player's ink is wrong because the land changed again), or it repeats the humility reaction.

## C336 — Humility believer (Meteor Falls Steven chalk): precedent + reach risk
- Vanilla precedent: Steven already talks to the player through a note left behind. After the Hall of Fame, his Mossdeep house has a note on the desk next to a Poké Ball holding Beldum, "my favorite Pokémon" (Bulbapedia Steven/Quotes; guides). A short signed note from an offscreen Steven is canon voice, not a new invention.
- Reach risk: vanilla B1F_2R is the **dead-end back room behind Surf + Waterfall** (TM02 Dragon Claw, Bagon). Once the TM and the den are taken, nothing brings the player back. Fixes: re-fire on any warp out/in; page-7 ink hints at the wall; Birch's Field Notes names it.

## C333-C335 (applied): trades give a usable mon; burn + confusion stack; if the flag pool runs out, pret wiki "Reuse filler save space" (`gAdditionalSaveData`, IDs from 0xF000).

## C331 — Mentor payoff: phone call vs. in-person
- HGSS/GSC phone (Bulbagarden fan threads): players call the phone "annoying over time"; Bill's automated calls were "useless". Elm's *story* calls (e.g. after a badge) are remembered, not hated. Fans resent calls that interrupt without new content, not calls in general.
- Emerald Match Call: Birch is one of the few non-trainer entries. Rematch calls roll on step/minute counters + chance (`TryStartMatchCall`: step counter → minutes → chance → map allows → trainer select), so they can't be predicted. Vanilla one-shot story calls (Wally/Scott/Steven style) are a separate step-triggered path; verify in field code before reuse.
- Applied: the ≥3-pages beat should be ONE player-initiated or guaranteed-once beat. Best fit: in-person `ProfBirch_EventScript_FieldNotes` + the existing dex-rating Match Call (both already read `GetActiveFieldNote`). No random unprompted call. A forced call needs a flag (0x2BB is the last one free).

## C330 (applied): count thresholds, not one completion prize (Oak's aides check counts at fixed road spots; Bombers' Notebook's payoff is per entry). Route 113 verbs: ash collecting (Soot Sack), glass-making, Ninja Boys hiding.

## C328-C329 (applied): believers read dex-caught (passive; party checks cost a box trip); Bombers' Notebook stamps *who* was helped → margins; one line per deed. Unbound's Mission Log is praised for organization, not prose.

## C327 — Reactive "skeptic" NPCs (applied; RS unused-party list overstates Emerald's free pool, scan refs per ID)
- Legends: Arceus requests are the cautionary case: players complain about manual turn-in ("interactive log that auto-completes"), poor signposting (looking requests up online), and tedium (Upcomer, Bulbagarden, Twinfinite). Tom's Guide liked the *pleas themselves*. Lesson: a correction NPC should react **passively** (read the flag on talk, no hand-over step) and sit on a road the player already walks.
- Writing guidance (game-writing guides): a few specific reactive lines beat many generic ones; the NPC must name the player's actual deed.
- A dialogue-only skeptic does NOT need a trainer slot. C326 (applied): reclaim zero-ref IDs only, keeping constant/party names (pret wiki link placeholders); a MAX_TRAINERS_COUNT bump shifts system flags.
## Sources
- https://www.nomadsreviews.co.uk/post/design-sins-taking-control-away-from-the-player , https://tropedia.fandom.com/wiki/Cutscene , https://www.pokecommunity.com/threads/movesprite-command.371236 , https://www.pokecommunity.com/threads/camera-movement.441483 , https://github.com/pret/pokeemerald/wiki/Keep-the-Camera-from-Making-Waves (C363)
- https://www.gamespot.com/reviews/pentiment-review/1900-6417998/ , https://primagames.com/gaming/pentiment-final-mural-endings-guide , https://bobsthoughtcloud.substack.com/p/pentiments-third-act-emphasizes-the , https://turbo-wiki.pages.dev/tim-cain/narrative-design/believable-reactivity (C343)
- https://filmstories.co.uk/?p=83249 , https://unapologeticnerd.com/tag/mystery-genre/ , https://www.giantbomb.com/wd/3015-191/ , https://www.pressreader.com/australia/edge/20190620/282278141843961 , https://www.tomsguide.com/reviews/outer-wilds , https://steamcommunity.com/sharedfiles/filedetails/?id=3500382207 (C340)
- https://upcomer.com/how-pokedex-research-tasks-work-in-pokemon-legends-arceus , https://www.looper.com/756095/research-tasks-in-pokemon-legend-arceus-explained , https://tcrf.net/Majora%27s_Mask_3D , https://freeslave.github.io/halflife-featureful/docs/configuration/journal , https://itch.io/post/8931839 (C361)
- https://filmstories.co.uk/?p=83138 , https://www.strayspark.studio/blog/designing-dialogue-trees-branching-narrative , https://bulbapedia.bulbagarden.net/wiki/Professor_Birch (C358)
- Older sources (C326-C336, all applied): see git history.
