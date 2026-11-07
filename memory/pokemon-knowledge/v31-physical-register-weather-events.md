# v3.1 Physical Register — Weather, Overworld Events, Place-Driven Encounters

**Cycle**: 347 | **Date**: November 2026

---

## C347 — What hacks do with weather / timed field events (searched Nov 2026; player-reception evidence thin)
- **Gen III already joins the field to the battle**: overworld weather carries into battle from turn 1 (Bulbapedia Weather; Polished Crystal docs map field rain/hail/sand to battle weather). Vanilla Emerald has fixed weather routes (R119/R120 rain, R111 desert sand, R113 ash), plus `setweather`/`doweather` scripting. A weather beat is cheap in pokeemerald: no new engine.
- **Weather-gated encounters are a known request, rarely shipped in GBA decomp hacks**: pokeemerald-expansion fork issue "Area archetypes: model encounter conditions (time of day, season, weather, swarms)" (trey-gonsoulin #6) is still a design ticket. Pokémon Essentials' "Weather Encounters" plugin (PokéCommunity 429803) uses an *override chance*: weather rows replace the normal table some % of the time, never fully. That is the pattern to copy if v3.1 makes weather spawn things.
- **Weather Mayhem** (pokeemerald-expansion Emerald hack, PokéCommunity 535675, skaternutko/weather-mayhem) builds the whole hack around weather, but changes *battles*, not encounters. Shows the niche exists; no review data found.
- **Random scripted weather** (PokéCommunity 497707 `SetWeather` + saved weather): the Mirage Tower sandstorm persisting after you leave is the vanilla precedent for "the place stays changed".
- **Legends: Arceus space-time distortions / outbreaks**: random, short-lived field events with rare spawns and items. Guides say arrival "might feel a little underwhelming"; outbreaks get read as shiny-farming tools. Lesson: a *random* event becomes a grind loop; a *scripted, once-told* event is remembered. Distortions also don't spawn in intense weather (events stack badly).
- **pokeemerald downpour "canonical effects" thread** (PokéCommunity 444136): community argues about what heavy rain should do in battle. If v3.1 adds a weather effect, write the rule in one player-facing line (sign/NPC); players can't guess it.
- Implication for v3.1: a physical beat (weather changes on a route the player already walks, carried into battle) fits the hack's "every reaction changes something visible" rule. Keep it scripted and flag-driven (one per route), not RNG. Use an override %, not a full table swap, if it changes wild slots.

## Sources
- https://bulbapedia.bulbagarden.net:443/wiki/Weather , https://code.heni.lol/decomp/polishedcrystal/wiki/Overworld-Weather
- https://github.com/trey-gonsoulin/pokeemerald-expansion/issues/6 , https://www.pokecommunity.com/threads/16-2-weather-system-and-weather-encounters.429803/
- https://www.pokecommunity.com/threads/pok%C3%A9mon-weather-mayhem.535675/ , https://github.com/skaternutko/weather-mayhem
- https://www.pokecommunity.com/threads/pokeemerald-script-for-random-weather-changes.497707/ , https://www.pokecommunity.com/threads/bad-data-canonical-effects-of-the-downpour-weather-condition.444136/
- https://www.dualshockers.com/pokemon-legends-arceus-space-time-distortion-fields-explained/ , https://www.gfinityesports.com/article/space-time-distortions
