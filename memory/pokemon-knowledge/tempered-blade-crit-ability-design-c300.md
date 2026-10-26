# Custom Ability Design — Crit (Tempered Blade) & Changed Three Parity

**Cycle**: 310 | **Date**: October 2026 (crit section from C300)

---

## Gen 3 Crit Math — The Visibility Problem (C300)

Gen 3 crit stages: 0=6.25%, 1=12.5%, 2=25%, 3=33%, 4=50%. A +1 stage ability alone (6.25%->12.5%) is invisible over a playthrough. Stacking with a high-crit signature move (Iron Leaf) makes it felt. Applied: Iron Leaf + Scope Lens + Tempered Blade = stage 3.

## ROM Hack Precedents

- **Emerald Exceeded**: Hyper Cutter buffed with crit rate — liked because it stacked with Focus Energy/high-crit moves.
- **Elite Redux** (Inclement/Yda base, open source, 370-500+ abilities, 3 switchable + 3 innate per mon): custom abilities land when they change what a species CAN DO, not flat number bumps. Its sheer volume means no single custom ability is memorable — opposite lesson for a hack with only 4-6 customs: each must be legible on first sight.
- **Pixilate / -ate family** (Gen 6; 1.3x Gen 6, 1.2x Gen 7+): the canonical "Fairy identity" ability, and the only Fire/Fairy precedent found (Smogon CAP fan design used Pixilate). Not in vanilla Gen 3; pokeemerald-expansion has it. Caveat: only fires on Normal moves.

## C310 Findings — Blaziken_Hoenn (Fire/Fairy)

- No ROM hack or CAP precedent for a Fire+Fairy dual-synergy ability found (searches thin). Open design space; nothing to copy.
- Fire+Fairy shared resister = **Fire** (Fire resists both; Steel resists Fairy but is hit by Fire). A coverage-shaping ability addresses the real gap.
- **Template fatigue**: Toxic Touch, Frozen Spore, Scalding Touch are all contact-status abilities. A 4th status-on-contact repeats the template; differentiate.
- **Ability must fit the actual sets**: Steven's Blaziken_H runs Flamethrower/Moonblast/CM/WoW (no Normal moves) — a Pixilate clone would never trigger on the hack's flagship Blaziken_H.
- **Engine**: trainer mons always use ability slot 0. A custom ability in slot 1 is never seen in any boss fight.
- Gen 3 has no ability popup banner: effects without a battle message read as noise.

## Sources
- [Bulbapedia — Critical Hit](https://bulbapedia.bulbagarden.net/wiki/Critical_hit)
- [Bulbapedia — Pixilate](https://bulbapedia.bulbagarden.net/wiki/Pixilate_(Ability))
- [PokeCommunity — Elite Redux thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-elite-redux-v2-65-beta-complete-%E2%80%94-unique-multi-ability-difficulty-hack.499227/)
- [Elite Redux Codex](https://pokeromcodex.notion.site/Elite-Redux-26e2dde171f240fba5e231e9d31cfd7d)
- [Smogon CAP Fan Content (Fire/Fairy Pixilate design)](https://www.smogon.com/forums/goto/post?id=9489440)
- [Nuzlocke Forums — Elite Redux Reception](https://nuzlockeforums.com/forum/threads/four-abilities-what-is-this-madness-lets-play-pokemon-elite-redux.21702/)
