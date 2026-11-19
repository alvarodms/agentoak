# v3.7 "Rain indoors" (built C381)

Team Aqua's storm machines rain inside Weather Institute 2F while VAR_WEATHER_INSTITUTE_STATE == 0. Shelly fights in that rain with a contact-punishing, Swift Swim team and says one new line. When she falls the machines power down (SE_PC_OFF) and the rain stops before any text box. Design: strategy-notes.md §"v3.7 Rain indoors".

## Game changes
- `data/maps/Route119_WeatherInstitute_2F/scripts.inc`
  - OnTransition, first line: `call_if_eq VAR_WEATHER_INSTITUTE_STATE, 0, Route119_WeatherInstitute_2F_EventScript_StormMachinesOn` (new global label: `setweather WEATHER_RAIN` / `return`; no doweather needed, rain draws on this MAP_TYPE_INDOOR map).
  - ShellyDefeated, top: `playse SE_PC_OFF` / `waitse` / `setweather WEATHER_NONE` / `doweather` / `delay 90`, then the vanilla flow (post-battle text, Magma line, Castform gift). No new box.
  - Text_ShellyIntro: last line now ends `\p`, plus `Like the rain in here?\n` / `It's on our side, not yours.$` (the beat's only new text).
- `scripts/trainer_configs/villain_shelly_weather_institute.json` → `src/data/trainer_parties.h` sParty_ShellyWeatherInstitute (via generate_trainer.cjs): CARVANHA 27 [WATERFALL, CRUNCH, SCARY_FACE, TAUNT] / QWILFISH 28 [SPIKES, WATER_GUN, PIN_MISSILE, POISON_STING] / HUNTAIL 28 [WATERFALL, BITE, ROCK_TOMB, WHIRLPOOL], all iv150, ITEM_NONE. Octillery dropped from this party; trainers.h struct unchanged (.items = {}, AI flags, ITEM_CUSTOM_MOVES).
- `scripts/beats.json` row `v37-rain-indoors` (fight, stranger, gate var VAR_WEATHER_INSTITUTE_STATE equals 0, allow "{PLAYER}" for the vanilla Castform receive line); `scripts/lib/beats.cjs` MIN_ROWS 21.

## Harness (src/emulator/)
- `expectFieldWeather` step (SAVEBLOCK1_WEATHER 0x2E pinned to global.h; `constants/weather.h` added to constants.ts HEADERS; checkFieldWeather planted-failure unit test).
- `battleTurns` gains `replace` (forced send-out after a faint: sendOutNext picks the first healthy mon in the party menu's battle order) and `any` (stop at the first `until` string), and logs every message to `PlaytestResult.battleLog` (report.json).
- Checkpoint `weather_institute_2f` (checkpoints.ts): badges 1-5, FLAG_SECOND_WAVE, VAR_ROUTE119_STATE 1, VAR_WEATHER_INSTITUTE_STATE 0, start MAP_ROUTE119_WEATHER_INSTITUTE_2F 17,2.

## Playtests (pokeemerald/playtests/)
checkpoint-weather-institute-2f-boot, wi-rain-indoors, wi-shelly-full-party, wi-shelly-worn-party, wi-rain-stops, wi-no-rain-after. Suite 111/111 at C381.

## Measured (C381, yardstick move-spam; SHELGON's HEADBUTT moved to slot 1 in the test party)
- Full HP: WIN, 11 turns, 2 faints (MIGHTYENA to Qwilfish's Water Gun, PELIPPER to Huntail), SHELGON finishes Huntail with 2 Headbutts. Huntail moved first every turn (Swift Swim).
- Half HP: LOSS, 7 turns, all 3 faint. MIGHTYENA and CARVANHA fall on the same turn (Rough Skin recoil); Shelly's AI then sends HUNTAIL, not QWILFISH. Huntail outspeeds and KOs PELIPPER and SHELGON.
- Verdict: PASS (worn loses ≥1, full wins).

## Index row
| v3.7 Rain indoors | 381 | Route119_WeatherInstitute_2F/scripts.inc, villain_shelly_weather_institute.json, trainer_parties.h, beats.json, lib/beats.cjs, checkpoints.ts, playtest.ts, constants.ts, 6 playtests | this file |
