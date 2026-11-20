# v3.8 "Above the storm" (built C384)

Winona's gym battle (TRAINER_WINONA_1 only) always opens in permanent harsh sunlight, as if the overworld held drought. Her team is retuned for the sun and she says one new line. Loud beat #2 of Hours 6-15: the far side of Shelly's rain (v3.7) and the Route 119 storm tail (C383). Design: strategy-notes.md §"v3.8 Above the storm".

## Game changes
- **New `include/trainer_battle_weather.h`**: `struct TrainerBattleWeather {u16 trainerId; u8 weather;}` + `static const sTrainerBattleWeather[] = {{TRAINER_WINONA_1, WEATHER_DROUGHT}}` (overworld WEATHER_* values). WINONA_2-5 (rematch doubles) deliberately not listed.
- **`src/battle_util.c`**: includes `battle_setup.h` (for gTrainerBattleOpponent_A) and `trainer_battle_weather.h`; new `static u8 GetBattleStartWeather(void)` above AbilityBattleEffects. In-game trainer battles (BATTLE_TYPE_TRAINER, none of LINK / FRONTIER / SECRET_BASE / EREADER_TRAINER / TRAINER_HILL / RECORDED) look the opponent up in the table; everything else returns `GetCurrentWeather()`. ABILITYEFFECT_SWITCH_IN_WEATHER's `switch` and its MULTISTRING_CHOOSER line both call it; nothing else changed. TRAINER_HILL was added to the plan's guard list (its opponent ids also share the TRAINER_* number space).
- **Why a table, not setweather** (overrode the premise's "config only" constraint): the setweather + doweather + delay 90 path (C349 TESSA) changes the gym's overworld sky, needs timing and an undo, and would also hit rematches and the gym trainers. The table touches nothing but the battle start and reuses the vanilla drought → B_WEATHER_SUN conversion (permanent, "The sunlight is strong." each turn, Chlorophyll, no-charge SOLARBEAM).
- **`scripts/trainer_configs/winona_gym_1.json` → trainer_parties.h sParty_Winona1** (generate_trainer.cjs; trainers.h block unchanged: AI CHECK_BAD_MOVE|TRY_TO_FAINT|CHECK_VIABILITY|RISKY, 2 HYPER POTIONs). As built:
  | # | Species | Lv | IV | Item | Moves |
  |---|---|---|---|---|---|
  | 1 | TROPIUS | 31 | 220 | SITRUS_BERRY | SOLAR_BEAM, AERIAL_ACE, GROWTH, BODY_SLAM |
  | 2 | SKARMORY | 29 | 210 | LEFTOVERS | STEEL_WING, AERIAL_ACE, TOXIC, ROAR |
  | 3 | SWELLOW | 30 | 220 | SHARP_BEAK | AERIAL_ACE, FACADE, QUICK_ATTACK, WING_ATTACK |
  | 4 | ALTARIA | 33 | 255 | CHARCOAL | DRAGON_CLAW, FLAMETHROWER, AERIAL_ACE, SAFEGUARD |
  PELIPPER dropped (SURF halved in sun), SUNNY_DAY / both EARTHQUAKEs gone, illegal SPIKES (Skarmory learns at 42) and DRAGON_DANCE (Altaria at 40) removed. Top level 33 (Challenge cap 38). audit_boss_species COLLISIONS 0, check_trainers 0/0. Fallback (Altaria Lv31) not needed.
- **`data/maps/FortreeCity_Gym/scripts.inc`** FortreeCity_Gym_Text_WinonaIntro, last page: `Storms never climb this high.\n` before `Let me show you how they've grown!$` (only text change).

## Playtests (pokeemerald/playtests/), suite 119/119 at C384
Common setup: checkpoint fortree_arrival, MAP_FORTREE_CITY_GYM 15,3 (below Winona 15,2), gym trainers JARED/FLINT/ASHLEY/EDWARDO/HUMBERTO/DARIUS in defeatedTrainers; intro asserts the new line; `expectBattleWeather "sun"` at the first prompt and again after the battle ends.
- `winona-sun-worn-party`: yardstick HOUNDOOM 31 [OVERHEAT, BITE, EMBER, ROAR] ab1 / PUPITAR 33 [ROCK_SLIDE, THRASH, BITE, SCREECH] ab1 / MANECTRIC 31 [SHOCK_WAVE, SPARK, QUICK_ATTACK, ROAR] ab2, hpPercent 50, no bag. `expectBattleSummary {minPlayerFaints: 1}`.
- `winona-sun-full-party`: same party, full HP. `{outcome: win, maxPlayerFaints: 2}` (FAIL-hard guard).
- `winona-sun-rock-lead`: PUPITAR, HOUNDOOM, MANECTRIC full HP. `battleTurns until ["SOLARBEAM", "PUPITAR fainted", "Go! HOUNDOOM"], replace, maxTurns 2`, then played out (outcome recorded, not asserted).
- `fortree-gym-trainer-no-sun` (control): JARED spots the player on 4,15; SALAMENCE 70 fights in `"none"`.
- `winona-win-to-empty-peg`: FLAG_ROUTE104_SKEPTIC_TURNED + WREN (TRAINER_FORTREE_CHARM_KEEPER) beaten, no badge; SALAMENCE 70 beats Winona in sun, the script's badge/TM40/PokéNav boxes, FLAG_BADGE06_GET true, warp Fortree 5,7, DOLL_2 absent, DOLL_1 1,7 / DOLL_3 4,7 visible, screenshot `empty-peg-after-winona`.
- **Yardstick line (deviation from the Designer's "spam slot 1")**: OVERHEAT has 5 PP; pure spam stalled the first full-HP run ("There's no PP left" ×40 at -6 SP. ATK vs SWELLOW). a and b now play `battleTurns move 1 until "Foe SKARMORY fainted"`, `battleSwitch slot 2` (PUPITAR), then slot-1 spam to the end. Same line for both, so the comparison holds.

## Measured (report.json battleSummaries, C384; identical across two runs)
| Run | Outcome | Turns | Player faints | Foe faints | End HP % |
|---|---|---|---|---|---|
| a worn | LOSS | 6 | 3 | 3 | 0,0,0 |
| b full | WIN | 5 (+1 battleSwitch turn, unlogged) | 0 | 4 | 100,2,100 |
| c rock lead | LOSS | 8 | 3 | 3 | 0,0,0 |
| control JARED | WIN | 3 | 0 | 3 | — |
- a: Overheat KOs TROPIUS (it used AERIAL ACE) and SKARMORY; PUPITAR KOs SWELLOW; ALTARIA's DRAGON CLAW KOs PUPITAR, a resisted Overheat and sun FLAMETHROWER take HOUNDOOM and MANECTRIC. **PASS** (≥1 faint).
- b: TROPIUS used GROWTH turn 1 and fell to Overheat; PUPITAR survives two DRAGON CLAWs at 2% and wins with two ROCK SLIDEs (the second a crit). **PASS**, but the margin is a 2% HP sliver: any change that adds damage to Altaria's line flips it (the guard catches that).
- c: **"Foe TROPIUS used SOLARBEAM!" turn 1, OHKO on PUPITAR** (as designed). HOUNDOOM's second Overheat missed and SKARMORY TOXICed it; MANECTRIC KOs SWELLOW, then a crit sun FLAMETHROWER from ALTARIA ends it.
- Verdict for the C385+ retrospective: PASS on both hypothesis legs; the Designer predicted 1 faint at full HP, measured 0.
- Unchanged by the C change (same suite run): wi-shelly-full-party WIN 11 turns / 2 faints; wi-shelly-worn-party LOSS 8 turns / 3 faints (= C382).

## Index row
| v3.8 Above the storm (Winona's sun) | 384 | include/trainer_battle_weather.h (new), src/battle_util.c, winona_gym_1.json, trainer_parties.h, FortreeCity_Gym/scripts.inc, 5 playtests | this file |
