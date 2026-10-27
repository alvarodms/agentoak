# Discovery Beats & Exploration Rewards — What Works

**Cycle**: 312 | **Date**: October 2026

---

## Evidence gathered (C312 web search — results thin, mostly listicles)
- **SoulGold hacks / HGSS-style Hidden Grottoes**: reviewers single out grottoes holding rare items + Pokémon that **reset daily**. The reset is what keeps players coming back to the spot. (pokemoncoders "50 Best ROM Hacks 2026")
- **Pokémon Gaia**: listed for exploration specifically: climbable walls, full underwater Dive maps, "Hidden Grottoes and Secret Temples" with rare items. Reviews name these as the hack's exploration identity.
- **Unbound**: praised for new areas and collection completion postgame. Search found no specific static-encounter praise (SEO pages only).
- **Gen IV Journal key item** (Bulbapedia/Dittobase): it auto-logs your activities, and the series dropped it after Gen IV. A passive log doesn't count as discovery. Players don't remember reading it.
- **PokéCommunity "common pitfalls of ROM hacks"**: general difficulty debate. Nothing specific to encounters.
- **Pokémon GO Special Research complaints**: players resent a grindy "catch N common species" task that pays out a weak reward. That's an anti-pattern for task-style notes.

## Known reference points (prior knowledge, not re-verified this cycle)
- **Vanilla Emerald Mirage Island** is the classic anti-pattern. It needs a daily random value to match a party Pokémon's PID, and it's widely mocked as "never seen it". The game gives no signal, so it feels like no reward at all.
- **Legends: Arceus research tasks** are well liked because each entry asks for a *specific observed behaviour* (see it use move X, catch it asleep) and the notes double as lore.

## Design takeaways for Legends of Hoenn
1. A discovery reward has to be **legible**: a visible cue (sparkle, NPC rumor, Field Notes hint) that points to a place, not a hidden RNG roll.
2. Give **one specific payoff per note**: a species, a lore line, or a Changed-form behaviour. Avoid "catch 10 Zigzagoon".
3. A **daily/conditional reset** (time of day, weather, tide like Shoal Cave) gives players a reason to come back. Reuse existing tide/time hooks instead of building a new system.
4. Notes should tell the migration story in the world (Tell:Show ratio rule from C298).
