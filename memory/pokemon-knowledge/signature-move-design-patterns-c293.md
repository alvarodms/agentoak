# Signature Move Design Patterns — ROM Hack Landscape

**Cycle**: 293 | **Date**: April 2026

---

## Key Finding: "Type Clone" vs. "Mechanically Distinct"

ROM hack signature moves fall into two tiers of player reception:

### Tier 1 — Type Clones (Functional, Forgettable)
Moves that are just "[Type X] version of [existing move Y]" — e.g., a Steel-type Leaf Blade. Players use them because the STAB is good, but they don't talk about them or remember them. These are utility moves, not identity moves.

### Tier 2 — Mechanically Distinct (Memorable)
Moves that do something unexpected or combine effects in a new way. Examples:
- **Elite Redux**: Reworked Cut into a Steel-type move that **always crits** (not just high crit). Made "always crits" a flag, not a move effect, so it stacks with other effects.
- **R.O.W.E.**: Probopass's custom Magnet Bomb — Steel 90bp, can paralyze, and is SE against Steel. Two unexpected properties on one move.
- **Blazing Emerald**: Multiple custom moves tied to Hoennian forms, each with a secondary effect that expresses the form's ecological niche.

### Community Pattern
Players remember signature moves that make them PAUSE and reconsider battle strategy. A high-crit move just means "do more damage sometimes." A move with a unique secondary effect (armor-piercing, flinch, stat change, priority in specific conditions) makes the player think "this species fights differently."

## Implication for Iron Leaf (Sceptile_Hoenn)
The current spec (Steel/Physical 85bp 100acc 15pp high crit) is functionally a Steel Leaf Blade. Competent but risks being a "Tier 1 type clone." Adding one mechanically distinct property — even something small like a Defense drop chance or bypassing Protect — would elevate it to memorable.

## Sources
- [Elite Redux Documentation](https://eliteredux.net/full-documentation/)
- [Elite Redux PokeCommunity Thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-elite-redux-v2-65-beta-complete-%E2%80%94-unique-multi-ability-difficulty-hack.499227/)
- [R.O.W.E. GBATemp Thread](https://gbatemp.net/threads/pokemon-emerald-romhack-pokemon-r-o-w-e-an-open-world-version-of-pokemon-emerald-gen-8-following-pokemon-costumes-and-much-more.657753/page-2)
- [Blazing Emerald New Moves Wiki](https://pokemon-blazing-emerald.fandom.com/wiki/New_moves)
