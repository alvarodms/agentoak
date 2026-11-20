#ifndef GUARD_TRAINER_BATTLE_WEATHER_H
#define GUARD_TRAINER_BATTLE_WEATHER_H

#include "constants/opponents.h"
#include "constants/weather.h"

// Trainers who always fight in a set weather, as if the overworld held it
// (v3.8 C384). weather is an overworld WEATHER_* value; the battle start
// converts it exactly like real field weather (permanent, with the usual
// "The sunlight is strong." message). Read by GetBattleStartWeather in
// battle_util.c, only for in-game trainer battles.
struct TrainerBattleWeather
{
    u16 trainerId;
    u8 weather;
};

// WINONA_2-5 (the rematch doubles) are deliberately not listed (C384).
static const struct TrainerBattleWeather sTrainerBattleWeather[] =
{
    { TRAINER_WINONA_1, WEATHER_DROUGHT },
};

#endif // GUARD_TRAINER_BATTLE_WEATHER_H
