# v3.1 Physical Register — Weather, Overworld Events, Place-Driven Encounters

**Cycle**: 383 | **Date**: November 2026

---

## C383 — Route 119 "rain giving way at Fortree": vanilla already does it, but not every day (code-verified + searched Nov 2026)
- **Vanilla already hands rain off to sun before Fortree.** Route119/map.json: header weather WEATHER_SUNNY. `coord_events` "weather" tiles set COORD_EVENT_WEATHER_ROUTE119_CYCLE at 29-32,13 and 34,13, plus 15-21,130-133 (south end), and COORD_EVENT_WEATHER_SUNNY at 36,6 / 36,7 / 35,8 / 35,9 (just before the Fortree edge) and 16-20,137. So on a rain day, rain already stops a few steps from Fortree. A beat that only re-does this is invisible to anyone who has played Emerald.
- **The cycle (field_weather_effect.c:2581)**: `sWeatherCycleRoute119 = {SUNNY, RAIN, RAIN_THUNDERSTORM, RAIN}`, indexed by `gSaveBlock1Ptr->weatherCycleStage`, which only advances in `UpdateWeatherPerDay` (when the RTC day changes). Stage 0 = SUNNY. So on 1 day in 4, and on any save whose stage is 0 (e.g. a same-day run, or a harness with a fixed RTC), Route 119 has **no rain at all**, so there is nothing to give way. Bulbapedia and PokéBase confirm 1 clear / 2 rain / 1 thunder.
- **Design consequence**: to land the beat on every save, key it on VAR_WEATHER_INSTITUTE_STATE (Shelly beaten) and force rain on the stretch the player crosses (a weather coord or a `setweather` step), then let the existing SUNNY tiles do the stop. Otherwise the playtest needs a `weatherCycleStage` setter (it is a save field, not a var). An overworld weather assert (read `gSaveBlock1Ptr->weather`) would also need adding; the harness has expectBattleWeather only.
- **No external design source for "rain stops as you reach town"** (search thin). Nearest: Arena's storm ends when you rest at an inn; the FFIX Burmecia rain works because it matches the place's state (itch.io comment). Rain that a player can't tie to a cause reads as ambient (cf. C356 indices).
- Sources: https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_119 , https://pokemondb.net/pokebase/299707/what-is-the-weather-schedule-for-every-area-in-every-game , https://serebii.net/pokearth/hoenn/3rd/route119.shtml , https://en.uesp.net/wiki/Arena:Weather , https://itch.io/post/13204599/view-in-topic

## C379 — empty peg: noticing an absence (thin)
- Removal is the easiest change to detect (arXiv 2308.12476), **but only under focal attention**; off the eye's path it is missed. A trace reads only when tied to a remembered cause (Fernández-Vara indices; Giant Bomb "A Garden of Bodies"), so a scorched doll must sit on the path *out* of Fortree, after the gap. A bg_event is opt-in atmosphere, not a cost. Sources: arxiv.org/pdf/2308.12476.pdf , gdcvault.com/play/1016566

## C378 — "acting on the ink costs someone something" (opinion-grade)
- No game or hack found where the player's *true* record, over-extended by others, harms NPCs. Guilt needs self-attribution (Frontiers Psychol. 2021), but NPCs must react to outcomes, not to who caused them (Tim Cain). The cost must touch play or it is shrugged off. "Blamed for being railroaded" (TV Tropes): inking is automatic, so frame it as the believers' over-reach, and never moralise. Sources: turbo-wiki.pages.dev/tim-cain/narrative-design/believable-reactivity , frontiersin.org/articles/10.3389/fpsyg.2021.666518/full , tvtropes BlamedForBeingRailroaded

## C376 — worn-party fairness test (thin)
- The only precedent is pokeemerald-expansion's test DSL (`PLAYER(SPECIES_X) { HP(n); }`, `TURN { SWITCH(player,1); }`, syntax unconfirmed); its rule is to assert what the player sees. It tests mechanics, not fairness: no hack ships a "tired party beats this trainer" test, and difficulty hacks rely on human Nuzlocke reports. No pre-Fortree team usage data exists; Winona prep guides push Rock/Electric/Ice (Lileep). Sources: rh-hideout.github.io/pokeemerald-expansion/print.html , rankedboost.com/pokemon/gym-leader/winona/emerald/

## C375 — storm charms: teru teru bōzu (a fair-weather doll; hung upside down it asks for rain) means its facing, so all dolls share one facing and the charm is never named in game text. Dolls are Secret-Base-only in vanilla; on MB_NORMAL tiles the risk is contrast, not occlusion. Sources: wikipedia Teru_teru_bōzu, serebii lotaddoll.

## C374 — forced town sight-fight: no hack precedent; SV dropped sight battles; it must read as an event, not a toll; keep band-floor levels. Gen III Nature Power on plain = SWIFT; vanilla Lombre learns Fake Out at 19.

## C371 — loud moment: only the critical path is guaranteed to be seen (Avowed/BG3 devs, GamesRadar); "loud" must not mean a long forced cutscene (PokéCommunity quit-moment thread). Vanilla precedent: the Kecleon blocking the Fortree Gym.

## C370 — vanilla AI switch-in (`GetMostSuitableMonToSwitchInto`, battle_ai_switch_items.c:629-790) picks the mon that takes the most damage from the player's types, if it has an SE move. Assert the species, not the slot order.

## C368/C369 — Lv13-14 Plusle/Minun have no Electric damage move (hand-set SHOCK_WAVE); Plus/Minus + Helping Hand are doubles-only; Gen III Thunder Wave paralyses Electric types; Trapinch slot 0 = Hyper Cutter; Baltoy out (Levitate).

## C356 — silent traces mostly go unnoticed (Death Stranding trails, "a secret feature most players missed", Gfinity 2025). A trace reads only if it is on screen on arrival and tied to a remembered cause (Fernández-Vara, DiGRA). Measure with an open recall question. ON_LOAD only; `wait*` in level scripts hardlocks.

## C353 — open "…?": ambiguity works only when optional and the core still pays off (Dear Esther, The Witness); never let the doubt look like it asks for an action. Vanilla TV outbreak signposting is random and gets missed, so pointers must be deterministic. 2026 scene split: story hacks are praised for pacing (Odyssey), not volume.

## C350 — Gen III hail: chip only (1/16, 5 turns), no Blizzard sure-hit before Gen IV, no Ice Def boost; sayable rule: "Ice types take no hail damage".

## C349 — Gen III Lightning Rod = redirect only, doubles only (no immunity before Gen V). The Parasol Lady is the canonical rain-setter class.

## C347/C348 — Field weather carries into battle from turn 1; `setweather` makes a weather beat cheap. A scripted, once-told weather event is remembered, while random distortions read as grind. Land slot % 20/20/10/10/10/10/5/5/4/4/1/1. Place objects so they are seen BEFORE the one line of text.

## C364/C366 — Hours 3-6: no hack reacts to what the player *knows*. Dewford Gym darkness = a vanilla "fight changes the place". Routes 105-109 Water-trainer glut. NPCs react to results they could see (Tim Cain).

> Index row topics (merged C383): weather/overworld events, encounter odds, Lightning Rod/Parasol Lady, hail, open-doubt rules, silent traces, Hours 3-6 register, Plusle/Minun/DAX movesets, AI switch-in, loud moment, forced sight-fight, storm charms, worn-party test, cost-of-ink, empty peg, Route 119 weather cycle.
