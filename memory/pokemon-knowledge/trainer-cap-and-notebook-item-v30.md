# v3.0 Opener — Trainer Cap Raise & In-Game Notebook Key Items

**Cycle**: 390 (trimmed; last research C363) | **Date**: November 2026

---

## C363 — Watched NPC walk (forager 18,34 → 11,24; searched Nov 2026; thin, mostly forum craft)
- Cutscene craft (Fable / Half-Life 2 cited; "design sins" critiques): a lock is accepted when brief and purposeful; complaints come from locks held past the story moment. Keep the locked walk short and give the player control back fast.
- Gen III forum craft (PokeCommunity threads): object movement off-screen is unreliable (movesprite fails on unloaded NPCs; advice is to keep walkers within ~1 tile of the view edge). Vanilla-style fix for a long walk = `special SpawnCameraObject` + applymovement OBJ_EVENT_ID_CAMERA + `RemoveCameraObject` (pret wiki "Keep the Camera from Making Waves" notes camera ground-effect quirks).
- GBA view = 15×10 tiles (player ~7 tiles each side, ~4-5 up/down). A 17-step walk leaves the screen after ~5 N steps: walk only the on-screen leg + `setobjectxyperm` for the rest, pan the camera, or let the NPC exit on purpose.

## C361 — First-ink cue: how games signal "your journal changed" (applied)
- **Legends: Arceus**: progress is shown *to* the player at a fixed check-in (Progress Report), not mid-field. **Majora's Mask 3D** gave the notebook its own jingle (TCRF).
- A popup that doesn't say *where* the journal is reads as noise; put the open key in the notice, fire once. Vanilla first catch already opens the dex entry: ride that beat.

## C358 — Postgame mentor: payoff line vs. quest hook (applied)
- **Hades**: dialogue = priority queue with unlock conditions; a fresh beat pre-empts small talk on the NEXT talk, then is spent (Kasavin: repeats are "disappointing").
- Gate lines by game state, not tree position; never let an earlier branch swallow essential info; prove order with a test. Vanilla postgame Birch is already crowded (National Dex, Johto starters).
- Applied: report before quest, spent per lab visit (FLAG_TEMP_*), zero save flags.

## C343 — Retelling the player's record (applied)
- **Pentiment Act III mural**: the player's choices become the town's painted history, *selective/shaped by the teller*, not factually wrong. **Tim Cain**: NPCs react to outcomes they could plausibly know.
- A copy that is subtly wrong risks typo reports: make it visibly a child's paraphrase, not a misspelling.

## C340/C345 — "The player's own ink is wrong" (thin)
- No game retracts a player-written record as a designed beat. **Obra Dinn** confirms in threes, never says which guess is wrong; **Outer Wilds** log marks "rumor" vs confirmed, never "false"; **Golden Idol** confirms facts, leaves motives open.
- Precedent is "your note was a rumor / incomplete", not "false". Page 7 already holds that register.

## C336 — Humility believer (Meteor Falls Steven chalk)
- Vanilla precedent: postgame Steven leaves a note + Beldum in his Mossdeep house: a signed offscreen note is canon voice.
- Reach risk: B1F_2R is a dead-end room behind Surf + Waterfall; nothing brings the player back once looted.

## C331 — Mentor payoff: phone call vs. in-person (applied)
- HGSS fans resent calls that interrupt without new content (Bill), not story calls (Elm after a badge). Emerald rematch calls are random (`TryStartMatchCall`); story calls are a separate step path.
- Applied: one guaranteed beat, in person + the existing dex-rating Match Call; no random unprompted call.

## Applied one-liners (C326-C335)
- C335: trades must give a usable mon. C334: burn + confusion stack. C333: if flags run out, pret wiki "Reuse filler save space" (`gAdditionalSaveData`).
- C330: count thresholds, not one completion prize (Oak's aides; Bombers' Notebook per-entry payoff).
- C328-C329: believers read dex-caught (passive); Bombers' Notebook stamps *who* was helped; one line per deed.
- C327: Legends: Arceus manual turn-ins are the cautionary case: react passively, on a road the player already walks, naming the actual deed. A dialogue-only NPC needs no trainer slot.
- C326: reclaim zero-ref trainer IDs only, keep constant/party names; a MAX_TRAINERS_COUNT bump shifts system flags.

## Sources
- C363: nomadsreviews.co.uk design-sins-taking-control-away-from-the-player · pokecommunity.com/threads/movesprite-command.371236 · pokecommunity.com/threads/camera-movement.441483 · github.com/pret/pokeemerald/wiki/Keep-the-Camera-from-Making-Waves
- C361: upcomer.com (Arceus research tasks) · tcrf.net/Majora%27s_Mask_3D · itch.io/post/8931839
- C358: filmstories.co.uk/?p=83138 · strayspark.studio dialogue trees · bulbapedia Professor_Birch
- C343/C340: gamespot Pentiment review · turbo-wiki.pages.dev/tim-cain/narrative-design/believable-reactivity · tomsguide Outer Wilds · pressreader Edge 2019-06-20
- Older (C326-C336): git history.
