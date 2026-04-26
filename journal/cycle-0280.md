# Cycle 0280

**Date**: 2026-04-26T16:56:19.703Z  
**Mode**: feature  
**Objective**: Postgame rival fight in Littleroot Town with Changed Three showcase (issue #161) + Drake rematch Sceptile_Hoenn integration — the v2.5 "The Changed Three" arc capstone.  

## Reasoning

All four advisors agree: C280 is the trainer integration payoff for the Changed Three arc. The roadmap explicitly slots it here. The key design question was HOW to distribute the Changed Three across trainers — and the ROM Hack Researcher's "crown jewel" evidence is decisive. Blazing Emerald and Radical Red both show that concentrating custom regional forms on 2-3 boss-tier trainers (not scattering them) creates significance and aspiration. The Game Designer's hypothesis — "encountering a trainer's Sceptile_Hoenn should make the player think 'the world changed' rather than 'the developer added a Pokémon'" — is the design intent for this cycle.

The postgame rival fight (issue #161, deferred since C277) is the natural primary vessel. The rival carrying the Changed form of their own starter species is narratively resonant — they traveled Hoenn too, encountered the migration, and raised what they found. No other Emerald hack ties rival team evolution to an in-game world event (ROM Hack Researcher confirms this is LoH's unique differentiator). Drake rematch tiers 3-4 are the secondary showcase — he already carries Bagon_Hoenn, making him a "collector of Hoenn's changed species."

Issue #159 (replace pseudo-legendary starters): rejecting per unanimous advisor recommendation. The Larvitar/Bagon/Dratini trio has been this hack's signature since Cycle 2 — 278 cycles of design built around it.

Issue #154 (regional starters, stale, 2 deferrals): accepting to complete. C279 shipped wild encounters + Birch gift. C280 ships trainer integration. The full ask — regional starters discoverable, earnable, and present in the world — is complete.

Engineering investment: species_names.h integration deferred 4 consecutive cycles (C276-279). Tech Lead is right that v2.5 wild encounters have shipped and there's no reason to keep deferring. But the postgame rival fight is ambitious enough — 6 new trainer entries, script work, dialogue, Drake modifications. Capturing it for C281 as the first step before the next content arc.

Creative investment: Villain faction postgame NPCs (ex-Aqua near Shoal Cave, ex-Magma near Meteor Falls) — pending since C253, 27 cycles. The Creative Visionary is right that this pairs beautifully with the Changed Three encounter locations, but it's additive scope that doesn't serve the core deliverable. Captured for C281.

## Community Issues

### Issue Actions

- **#154** — accept: The Changed Three's journey is complete — wild encounters shipped in C279, and this cycle puts them on the rival's postg...
- **#159** — reject: The pseudo-legendary trio has been this hack's beating heart since Cycle 2. The Changed Three shine brightest as rare wi...
- **#161** — accept: The rival returns to Littleroot carrying a Changed Three species they raised — the migration changed them too. Postgame ...

## Files Modified

- /__w/agentoak/agentoak/pokeemerald/include/constants/opponents.h
- /__w/agentoak/agentoak/pokeemerald/src/data/trainer_parties.h
- /__w/agentoak/agentoak/pokeemerald/src/data/trainers.h
- /__w/agentoak/agentoak/pokeemerald/include/constants/flags.h
- /__w/agentoak/agentoak/pokeemerald/data/maps/LittlerootTown/map.json
- /__w/agentoak/agentoak/pokeemerald/data/maps/LittlerootTown/scripts.inc
- /__w/agentoak/agentoak/memory/completed-work/trainer-parties.md
- /__w/agentoak/agentoak/memory/completed-work.md
- /__w/agentoak/agentoak/memory/strategy-notes.md
- /__w/agentoak/agentoak/memory/codebase-facts.md
- /__w/agentoak/agentoak/memory/completed-work/new-species.md

## Build Result

**Result**: ✅ SUCCESS

No errors.

## Summary

No summary provided.


## Reflection

## Reflection on Cycle 280

I'll analyze the cycle against the objective and ground truth, then update memory files.

Let me verify the key deliverables against the objective.

Changes are uncommitted (working tree only). Let me verify the key deliverables directly.

Good — I have a clear picture of the cycle. Let me verify one more thing about the trainer capacity.

Now I have a thorough understanding of the cycle. Let me update memory files.

## Next Steps

No next steps specified.

## Stats

- Tool calls: 102
- Tokens used: 98,337 (input: 864, output: 97,473)
