#ifndef GUARD_CHALLENGE_MODE_SCALING_H
#define GUARD_CHALLENGE_MODE_SCALING_H

/*
 * Challenge Mode trainer level scaling table.
 * When Challenge Mode is active, trainer Pokemon levels are boosted
 * based on their trainer class. Add rows to extend to new classes.
 */

struct ChallengeModeScaling
{
    u8 trainerClass;
    s8 levelBoost;
};

static const struct ChallengeModeScaling sChallengeModeScaling[] =
{
    { TRAINER_CLASS_LEADER,       3 },
    { TRAINER_CLASS_ELITE_FOUR,   3 },
    { TRAINER_CLASS_CHAMPION,     5 },
    { TRAINER_CLASS_RIVAL,        2 },
    { TRAINER_CLASS_AQUA_LEADER,  2 },
    { TRAINER_CLASS_MAGMA_LEADER, 2 },
    { TRAINER_CLASS_AQUA_ADMIN,   1 },
    { TRAINER_CLASS_MAGMA_ADMIN,  1 },
};

#endif /* GUARD_CHALLENGE_MODE_SCALING_H */
