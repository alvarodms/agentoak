# Discovery Beats & Exploration Rewards — What Works

**Cycle**: 401 (compacted C400; full C312-C399 text in git history) | **Date**: November 2026

---

## Exploration rewards (C312; web thin, mostly listicles)
- HGSS-style Hidden Grottoes (SoulGold hacks) and Pokémon Gaia's grottoes/temples/Dive maps get praise because they **reset daily** and hold rare items. Unbound gets praise for postgame collection.
- Anti-patterns: the Gen IV passive Journal (nobody reads it), GO-style "catch N commons" tasks, and Mirage Island (an RNG roll with no signal). Legends: Arceus tasks work because each asks for a *specific observed behaviour*.
- Takeaways: rewards must be **legible** (cue → place); one specific payoff per note; reuse the tide/time hooks for returns; Tell:Show rule (C298).

## Missable statics + titan framing (C315, C318)
- Bulbapedia's "permanently missable Pokémon" list exists because statics don't respawn; the official fix is a respawn after the Champion (FRLG/Emerald, Platinum+); SV v2.0.1 let players catch accidentally KO'd Titans. → A den hide flag is set **only on catch**.
- Inclement Emerald gives every static/gift 3+ perfect IVs: a placed mon should be *better* than a wild one. "Titan" implies a boss-feeling fight (higher level, held item, gated appearance).
- Headless mGBA Lua (`xvfb-run mgba-qt --script`) and expansion's mgba-rom-test exist; human-tester requests got no response (C317). Never gate content on testers.

## Quiet beats (C393, C399)
- **Lavender Town**: the dread comes from the place, not the text. **XY/ORAS ghost girl**: one line, never explained, and fans theorise *because* nothing answers (but Kotaku: "you probably missed" her). **Mt. Pyre reads as grief, not dread.**
- Rules: a dread beat needs a *normally safe* place turned wrong; show one thing and answer nothing (D1); put it on the critical path.
- **ORAS Memory Girl** (Lilycove PC): "the world remembers you", built from save data with no new flags. Lilycove is D1, so use R124/Mossdeep. Vanilla already rewrites Lilycove/Mossdeep NPC lines after Kyogre wakes (Hours 13-15 "world reacts" is taken), so quiet beats go *before* Seafloor.
- No hack is known for a quiet overworld beat that players noticed: an open niche.

## Steven's house rock display (C400, for v3.13; web thin)
- Guides (GamerGuides ORAS, Bulbapedia Mossdeep) describe the rock collection only as an *examine-able display*. In ORAS it shows "a variety of stones from across the regions", and guides say "nothing of import there at the moment". Players treat it as **set dressing**. No guide, wiki or thread quotes the Emerald text, and no hack or fan discussion of a changed shelf line turned up. The beat has no precedent and no expectation to break.
- Implication: read rate will be low (same risk as the ghost girl). The house is visited for DIVE (Emerald: after the Space Center) and later for Beldum, so the player has two chances to read the shelf, and the second one is postgame, while Steven is hidden after Seafloor.
- **C401 (Bulbapedia/StrategyWiki)**: the house is open on first arrival in Mossdeep, before the Space Center (Emerald moved the DIVE handoff behind the fight; in RS it was at the house with no gate). So a curious player may read the vanilla line *first*, learn "set dressing" and skip it on the DIVE visit (habituation). An object whose text changes is only re-checked when something signals it changed (TV Tropes "Developers' Foresight": reactive examine text is a reward for players who already re-check; few do). Also, gating on Steven's hide flag means the shelf goes back to vanilla after Seafloor, so the postgame Beldum visit (the second chance) shows the old line.

## Fog readability (C394; code-verified)
- In WEATHER_FOG_HORIZONTAL every sprite palette is pulled ~75% toward RGB(28,31,28) (field_weather.c ApplyFogBlend :674, spawn-time BlendPalette :842); contrast drops to ~¼ and hue is lost. On fog maps (Mt. Pyre, Route 120) design for **value + silhouette**: dark outline index, one solid bright core.

## Sound cues (C396)
- **Return of the Obra Dinn** chimes only per *batch of three* correct fates. A cue that fires on every entry loses its weight, and repeated uninformative SEs annoy players (uxdesign "Disruptive Audio").
- pokeemerald: SE_DEX_PAGE (109) = page turn + first-ink; the drawing sound is **SE_M_SKETCH (205)**; fallbacks SE_M_SCRATCH 155 / SE_CLICK 36. No hack has a pen SE.

## Sources
- C401: [Bulbapedia Emerald walkthrough Part 14](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pokémon_Emerald/Part_14) · [StrategyWiki RS Mossdeep](https://strategywiki.org/wiki/Pok%C3%A9mon_Ruby_and_Sapphire/Mossdeep_City) · [Bulbapedia Steven Stone](https://m.bulbapedia.bulbagarden.net/wiki/Steven_Stone) · [TV Tropes Developers' Foresight RPGs](https://tvtropes.org/pmwiki/pmwiki.php/DevelopersForesight/RolePlayingGames)
- C400: [GamerGuides ORAS Mossdeep](https://www.gamerguides.com/pokemon-oras/guide/walkthrough/mind-badge/mossdeep-city) · [Bulbapedia Mossdeep City](https://bulbapedia.bulbagarden.net/wiki/Mossdeep%20City)
- C399: Bulbapedia "Memory (game mechanic)", Route 124 · C396: DualShockers/TV Tropes Obra Dinn, uxdesign.cc · C394: Bulbapedia Fog · C393: Kotaku ghost girl · C315/C318: Bulbapedia missable list, Infinite Fusion wiki, Inclement PokeCommunity thread, mgba-mcp · C312: pokemoncoders 2026 list. Full URLs: git history.
