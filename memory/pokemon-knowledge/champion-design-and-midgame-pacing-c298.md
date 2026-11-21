# Champion Design & Mid-Game Encounter Pacing — ROM Hack Patterns

**Cycle**: 386 | **Date**: November 2026 (first written C298)

---

## C386: Route 119 rival + the Hours 10-15 lever
- **Vanilla Route 119 rival is the level-cap marker (31)** and guides call it "challenging". The vanilla team (Mudkip-player case: Slugma 29 / Lombre 29 / Pelipper 29 / Grovyle 31) has no Electric attacker; it *carries* a Pelipper (4x Electric weak). LoH's MANECTRIC (MAGNET) inverts that: the rival now punishes the commonest mid-game Water/Flying pick. A design choice, not vanilla.
- **Rival fights are a known complaint point**: Emerald Kaizo's changelog had to fix "weird movesets in Rival Battles near Trick House and Mauville". Players read rival fights as fair/unfair by moveset, not level.
- **Tag/multi battles are engine-fragile in Gen 3.** The Mossdeep Space Center Steven tag battle is the only one and is hard-coded; Kaizo "fixed that Tag Team battle with a compromise". Decomp threads report freezes when swapping a partner's mons and partners that do nothing. No hack found with a partner who betrays the player mid-battle.
- Applied: the double-battle lever is safest as a vanilla two-trainer doubles (C322 rules); "betrayal" belongs in the script, not a custom multi-battle.
- Sources: rankedboost.com/pokemon/location/emerald/route-119; pokecommunity.com threads 395830 (Kaizo), 438120 + 438354 (tag battles), 425516.

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

## Older (C298, applied)
- Champion: original thesis champions are rare; Unbound uses the rival (Jax), Radical Red uses Lance. Proven pattern = existing character + themed team/dialogue (unboundwiki.com/elite-four).
- Regional-form pacing: forms must appear steadily (PokeCommunity thread 455914); route NPC + trainer + distant echo or they read as table bloat.
