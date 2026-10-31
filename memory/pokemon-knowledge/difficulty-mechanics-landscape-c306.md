# Difficulty Mechanics Landscape — Item Bans, Stat Multipliers, Type Chart Changes

**Cycle**: 325 | **Date**: October 2026 (orig. C306)

---

## C325 — Bag Lock Implementation Precedent (#190)

- **pokeemerald-expansion 1.14.0** removed the on/off `B_FLAG_NO_BAG_USE` and replaced it with **`B_VAR_NO_BAG_USE`**, a 3-state var: bag available / **bag available in wild battles only** / bag unavailable. The community settled on "wild-only" as a distinct, needed mode: a binary lock also kills Poké Ball throws.
- Our hack is vanilla pokeemerald (no expansion), so we hand-roll it in `HandleInputChooseAction`, but copy the shape: gate on `BATTLE_TYPE_TRAINER` (not "any battle"), so wild catching is untouched.
- **Radical Red 2.3**: the PokéCommunity post says **Easy Mode** *allows* bag items in battle (plus Switch style), so the default and Hardcore modes don't. That's the ban-by-default, opt-in-easy pattern. The C306 table row ("restricted in trainer battles") is roughly right, but the exact wording is unverified.
- Vanilla precedent: Battle Frontier facilities already forbid bag use (Pyramid uses its own Battle Bag). Players know "the bag is closed here" from official games.
- Self-imposed "no items in battle" is a common Nuzlocke/pro-strat rule (itch.io comment threads), so Challenge players expect it. Building it in honors a rule they already follow.
- Unverified: Inclement Emerald / Emerald Imperium specifics (search turned up nothing).

## Trainer Battle Item Bans

Standard practice in **difficulty hacks**, NOT standard in narrative/story hacks:

| Hack | Type | Item Policy |
|------|------|-------------|
| Radical Red | Difficulty | Items restricted in trainer battles |
| Inclement Emerald | Difficulty | Challenge mode blocks item spam |
| Emerald Kaizo | Kaizo difficulty | All battle items banned |
| Unbound | Story + difficulty | Items available (normal mode) |
| Blazing Emerald | Enhancement | Items available |

**Key distinction**: Hacks praised for *story* (Unbound, Glazed, Gaia) keep items available. Hacks praised for *challenge* (Radical Red, Kaizo) ban them. Legends of Hoenn positions as a narrative hack with difficulty options — item bans would shift identity toward difficulty-first.

## Boss Stat Multipliers

Radical Red and Inclement Emerald use hidden stat boosts on boss trainers. This is a difficulty hack convention. No narrative-focused hack has adopted this pattern — it's associated with the "competitive simulation" subgenre.

## Type Chart Modifications

PokéCommunity consensus: acceptable if limited (<10 changes) and communicated in-game. Bug/Poison mutual weakness specifically: no known hack has done this. Community concern is that type chart changes create "invisible rules" — players assume vanilla effectiveness unless told otherwise.

## Sources
- [Radical Red — PokéHarbor](https://www.pokeharbor.com/2021/06/pokemon-radical-red/)
- [Inclement Emerald — PokéCommunity](https://www.pokecommunity.com/threads/pok%C3%A9mon-inclement-emerald-a-decomp-difficulty-hack-version-1-13.457039/)
- [Type Chart Changes — PokéCommunity](https://www.pokecommunity.com/threads/different-type-effectiveness-in-hacks.426477/)
- [Expansion 1.14.0 release notes (B_VAR_NO_BAG_USE)](https://github.com/rh-hideout/pokeemerald-expansion/releases/tag/expansion/1.14.0)
- [Radical Red 2.3 thread — PokéCommunity](https://www.pokecommunity.com/threads/437688/page-82)
- [Emerald Imperium — PokéHarbor](https://www.pokeharbor.com/2025/01/pokemon-emerald-imperium/)
