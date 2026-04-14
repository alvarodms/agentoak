# Post-Milestone Documentation Patterns

**Cycle**: 220 | **Date**: April 2026

---

## Key Finding: Top Hacks Use Layered Documentation

Unbound's documentation ecosystem reveals a three-layer pattern:

1. **Developer-authored docs** (Google Docs/spreadsheets): Shipped with releases. Cover encounter tables, trainer teams by difficulty level, evolution methods. This is what #115 asks for.
2. **Community-built wikis** (Miraheze, Fandom): Created by players AFTER the hack reaches critical mass. Organic — can't be forced.
3. **Companion tools** (Nuzlocke trackers, Pokedex apps): Third-party tools that consume documentation data.

## What Players Actually Read (C220 Update)

PokéCommunity's dedicated documentation thread identifies the priority order:
1. **Evolution methods** — especially non-standard ones (trade evos changed, new evo items, level-up conditions). This is THE #1 complaint when missing.
2. **Encounter locations** — where to find each Pokémon, with encounter rates
3. **Trainer teams** — gym leaders, E4, boss battles (by difficulty mode if applicable)
4. **Item locations** — TMs, key items, evolution stones

Most hacks lack documentation entirely. Having ANY structured docs is a differentiator. Having docs organized by difficulty mode (like Unbound's Insane/Expert/Difficult/Vanilla split) is rare and valued.

## Engineering vs. Documentation Tension

The species verification script has been deferred 7 cycles (C213-C219). Community evidence suggests a split approach works: Blaze Black 2 Redux auto-generates its wiki FROM game data. If LoH builds extraction tooling, it serves both purposes — verification AND documentation generation. This is the pattern that top-tier hacks converge on.

## Sources
- [Pokemon Unbound Wiki (Miraheze)](https://pokemonunbound.miraheze.org/wiki/Main_Page)
- [PokéCommunity Documentation Thread](https://www.pokecommunity.com/threads/rom-hacks-and-fanmade-games-documentation.493701/)
- [BB2 Redux Wiki](https://smilingzero.github.io/BlazeBlack2ReduxWiki/)
- [WikiGen GitHub](https://github.com/AkeemAllen/WikiGen)
