# Sprite Quality & Placeholder Graphics: Community Standards

**Cycle**: 73 | **Date**: March 2026

---

## Key Findings

### Placeholder Sprites Are a Known Pain Point
- Radical Red ships some species as data-only placeholders (MissingNo sprite, Struggle-only moveset). Community accepts this for unreleased species but finds it jarring for species that appear in encounters.
- ROM hacking community has built shared sprite packs (e.g., LibertyTwins GBA Sprites Pack, updated 2026) specifically to help hackers avoid placeholder issues.
- PokéCommunity bans AI-generated sprites/placeholders — human-made or source-ripped only.

### Player Impact
- Placeholder sprites (e.g., Sneasel sprite used for Weavile) break immersion immediately. Players encountering a "new" species that looks like an existing one report it as a bug, not a design choice.
- In LoH's case: Weavile uses Sneasel's sprites (copied as placeholder in Cycle 61). All other new species (Riolu, Lucario, Gible, Gabite, Garchomp) have real sprites fetched via MCP tool.
- Community issue #62 likely refers to this gap.

### Fix Path
The `fetch_pokemon_sprites` MCP tool can download Weavile's real sprites from the expansion repo. This is a ~5 minute fix that resolves the most visible remaining placeholder issue.

**Sources**: [PokéCommunity ROM Hacking Sprites Pack](https://www.pokecommunity.com/threads/rom-hacking-sprites-pack-battle-backgrounds-overworlds-trainer-sprites-and-more-updated-2026.527581/)
