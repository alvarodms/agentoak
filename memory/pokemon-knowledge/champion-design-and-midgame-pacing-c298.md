# Champion Design & Mid-Game Encounter Pacing — ROM Hack Patterns

**Cycle**: 384 | **Date**: November 2026 (first written C298)

---

## C384: Winona in sun (v3.8 "Above the storm")
- **Vanilla already contains the sun plan.** Gym Tropius Lv29 has Chlorophyll + SUNNY_DAY / AERIAL_ACE / SOLAR_BEAM / SYNTHESIS (Serebii, RankedBoost). The rematch swaps Synthesis for EARTHQUAKE. In Gen 3, Chlorophyll is Tropius's only ability, so slot 0 = Chlorophyll.
- **Chlorophyll is to sun what Swift Swim is to rain.** If the sun comes from the map rather than SUNNY_DAY, it lasts the whole fight (Gen 3 overworld weather has no turn limit). Then Tropius moves at double speed, Synthesis heals 2/3, and SOLAR_BEAM has no charge turn. That's the same permanent-speed wall the C381 Huntail created. The "no Swift Swim" constraint doesn't catch it.
- **Inclement Emerald nerfed endless weather.** It restored endless Drought/Drizzle weather but cut the sun/rain damage bonus to 20%, because permanent weather was too strong. That's indirect evidence that permanent weather from the map is the riskiest version.
- **There's still no precedent for a sun-themed Winona** in Kaizo, Imperium or Inclement (C382 and C384 searches).
- Sources: serebii.net/emerald/entrycall/winona.shtml; rankedboost.com/pokemon/tropius/emerald; pokecommunity.com thread 457039.

## C382: Badge 6 vs Badge 7 for the second loud beat
- **Vanilla Emerald's Tate & Liza fight is already a Double Battle** (RankedBoost "Gym 7 · Mossdeep City · Double Battle"; Dittobase: Claydol 41 / Xatu 41 / Lunatone 42 / Solrock 42, cap 42). A "first real doubles at Badge 7" pitch is only new if it means a team *built* for doubles (ally combos, spread moves), not the format. Check `doubleBattle` in the LoH Tate & Liza config before you pitch it.
- **Winona is a remembered difficulty spike in difficulty hacks.** One Inclement Emerald (v1.13 thread) player named Winona and a Team Flare doubles fight as the hardest of the run, at 15+ attempts each. Emerald Kaizo swaps Salamence for Flygon to cover her Rock weakness. So players do hit her as a wall, not a pushover. Vanilla: Swablu 29 → Altaria 33 ace.
- **No hack we found ties Winona's team to weather**, as with Shelly in C381. The niche is open, but there's no precedent to copy.
- Sources: rankedboost.com/pokemon/gym-leader/tate-and-liza/emerald; dittobase.com Emerald gym pages; pokecommunity.com thread 457039 page 23; pokecommunity.com thread 395830 (Emerald Kaizo).

## C381: Weather Institute Shelly in other hacks (v3.7 "Rain indoors")
- **Emerald Kaizo keeps Shelly off-theme and puts the rain on a grunt.** Her Kaizo team is 6 mons, Lv47-49 (Milotic, Hypno, Shuckle, Medicham, Dragonite, Lapras; cap 49). The Institute's Huntail (Lv47, King's Rock, Rain Dance) belongs to Grunt #5. So "the grunts teach the rain, then the boss" is a pattern seen elsewhere, and it matches spec (e). Our idea of a rain-themed *admin* in rain the machines set has no precedent we could find: no hack we found ties a boss's weather to the map's story.
- **Swift Swim in permanent rain is the known wall.** Inclement Emerald's weather rework says it aims to "reign in Swift Swim and its clones a bit". Weather Mayhem left Swift Swim working in rain. In Gen 3, rain carried into battle from the overworld has no turn limit, so a 50%-HP team can't stall it out. A doubled-speed Huntail ace is the most likely FAIL-hard source.
- **Search gap**: there were no community threads about worn-party or "spend a resource" tuning for this fight specifically. The Reborn "can't beat Shelly" threads are about a different Shelly.
- Sources: nuzlockeredux.com/guides/emerald-kaizo; emulatorhacks.com Emerald Kaizo walkthrough (DecaPod); pokecommunity.com threads 457039 (Inclement Emerald) and 535675 (Weather Mayhem); Bulbapedia "Weather Institute".

## C380: Loud Hours 6-15 beat — optional vs critical-path boss
- **Overleveling kills optional fights.** Radical Red ties a soft level cap to the next boss and scales some optional side bosses to the party. The Emerald Horizons dev says bosses and mid/late trainers scale to the player "so grinding/overleveling isn't a factor". The community's position: a fixed-level optional fight is trivial for anyone who goes back to it later.
- **Optional bosses must pay.** Horizons (optional Kanto/Johto leaders that drop valuable items) and Imperium (optional Boss Trainers "worth taking on") both attach a reward. One Horizons player called the boss gauntlet "the most fun feature from any rom hack". The anecdotes are thin, but they agree.
- **The spikes players remember sit on the critical path.** An Imperium Reddit user named Mt. Chimney's doubles as a long-standing sticking point. Azure warns that its optional bosses can wipe a team. pokeemerald-expansion gives the Magma/Aqua admins fully evolved mons and leans Magma toward Ground so it doesn't overlap with Flannery.
- **Applied here:** this project has no level scaling, so an optional loud fight needs a gate that pins the player's level band (badge N, not N+1) or a seat on the critical path. Our own v3.5 finding (WREN at the band floor = a gesture, not a wall) shows the inverse failure.
- Sources: pokecommunity.com threads 498874 (Horizons) and 534582 (Imperium); r/PokemonROMhacks weekly thread 1ib3327; github.com/pkmnsnfrn/pokeemerald-expansion.

## Champion as Narrative Thesis

Issue #182 claims top hacks create original champions that embody their hack's identity. Evidence is mixed:

- **Unbound**: Champion is **Jax, the rival** — NOT an original thematic character. The narrative payoff comes from the personal rivalry arc, not from a bespoke "thesis statement" champion. Jax uses a diverse team (double battle format) rather than a themed one. The emotional weight comes from the relationship, not the roster.
- **Reborn** (19 gyms, 200+ hours): Final fights involve the player character's arc and the game's environmental collapse theme. The champion equivalent IS narrative — but Reborn is a full fangame with 5+ years of writing, not a ROM hack.
- **Radical Red**: Champion is Lance with competitive-tier teams (Garchomp, Dragonite, Primal Dialga on Insane). No narrative payoff — it's a difficulty hack. The "thesis" is "can you beat this?"
- **Ephemerald**: Uses vanilla structure with all-regional-form teams. No new champion character.

**Takeaway**: Creating a fully original champion character is rare even among top-tier hacks. Unbound — widely considered the best Emerald hack — uses the rival. The more proven pattern is giving an existing character a team and dialogue that reflects the hack's theme.

## Mid-Game Regional Form Pacing

- **Ephemerald** (382 Sapphosian Forms): Every catchable Pokémon is a regional form, every route has them. The "gap" problem literally cannot exist.
- **PokéCommunity advice** (regional form hack thread): Developers are warned that regional forms need consistent distribution or players lose the "discovery loop." Forms appearing, vanishing for several routes, then reappearing feels like an unfinished hack.
- **3-Point Acknowledgment rule** (from C267 research, validated here): Forms without route NPC + trainer + distant echo feel like "encounter table bloat." A mid-game gap is the inverse problem: no forms at all = players forget the mechanic exists.

## Sources
- [Unbound Elite Four & Champion Wiki](https://unboundwiki.com/elite-four/)
- [Unbound Pokémon League Walkthrough](https://unboundwiki.com/walkthrough/part-39/)
- [Ephemerald PokéCommunity Thread](https://www.pokecommunity.com/threads/pokémon-ephemerald-a-full-regional-forme-romhack-v1-0-release.472780/)
- [PokéCommunity — Regional Form Hack Advice](https://www.pokecommunity.com/threads/rom-hack-ideas-feedback-and-advice-regional-forms.455914/)
