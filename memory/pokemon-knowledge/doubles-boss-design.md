# Double Battle Boss Design (Juan doubles, slot 568)

**Cycle**: 322 | **Date**: October 2026

---

## Facts found
- **Vanilla Emerald already ran every Juan rematch as a Double Battle** (Bulbapedia / Sootopolis Gym pages). LoH's TRAINER_JUAN_1-5 slots became Wallace in C309 with "doubles unchanged", so **Wallace's Gym rematches are probably doubles already**. Check `doubleBattle` in `wallace_gym_2-5.json` before building Juan's doubles, so the two fights aren't the same format.
- No hack we found turns Juan into a standalone doubles boss. The niche is open, but there's no proven pattern to copy.
- **Inclement Emerald (PokeCommunity v1.13 thread)**: player reports of softlocks in doubles. Fainting while a specific mon (M-Metagross) was on the field, and reviving an ally, left the player stuck on the SUMMARY screen. Takeaway: in this hack's community, doubles bugs show up on the **faint/replace/revive** paths, not the opening turn.
- Gen 3 rain: Swift Swim doubles Speed (Kingdra is the classic case). Rain + Swift Swim + spread moves is the strongest doubles idea a Water leader has in Gen 3.

## Design rules for LoH
1. Give the doubles fight its own identity: two mons that combo (rain setter + Swift Swim, or Surf with a Water Absorb/Lightning Rod-style partner) rather than a singles team split in two.
2. Gen 3 AI barely considers its ally. Earthquake, Surf, Explosion and Self-Destruct hit its own partner, so leave them off the AI side unless the partner is immune (Flying/Levitate for EQ, Water Absorb for Surf).
3. Use the vanilla double-trainer script path, which includes the "you need two Pokémon" text. Have the boss's opening line warn the player before the fight.
4. Static checks should cover: party ≥2, doubleBattle TRUE, no self-hitting spread moves without an immune partner.

## Sources
- https://bulbapedia.bulbagarden.net/wiki/Juan
- https://pokemon.fandom.com/wiki/Sootopolis_Gym
- https://www.pokecommunity.com/threads/pok%C3%A9mon-inclement-emerald-a-decomp-difficulty-hack-version-1-13.457039/page-12
- https://www.smogon.com/forums/threads/kingdra-uber-analysis.80474
