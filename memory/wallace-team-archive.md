# Wallace Team Archive (pre-C308)

Archived from HEAD 6c5e4e9 (src/data/trainer_parties.h) before C308 converted TRAINER_WALLACE slots into Steven (Champion).
C309 reuses these for Wallace's Gym 8 / Sootopolis role. Verbatim copies below.

```c
static const struct TrainerMonItemCustomMoves sParty_Wallace[] = {
    {
    .iv = 255,
    .lvl = 53,
    .species = SPECIES_LUDICOLO_HOENN,
    .heldItem = ITEM_MAGNET,
    .moves = {MOVE_THUNDERBOLT, MOVE_GIGA_DRAIN, MOVE_THUNDER_WAVE, MOVE_RAIN_DANCE}
    },
    {
    .iv = 255,
    .lvl = 54,
    .species = SPECIES_ARCANINE_HOENN,
    .heldItem = ITEM_LUM_BERRY,
    .moves = {MOVE_SURF, MOVE_FLAMETHROWER, MOVE_EXTREME_SPEED, MOVE_CRUNCH}
    },
    {
    .iv = 255,
    .lvl = 55,
    .species = SPECIES_NINETALES_HOENN,
    .heldItem = ITEM_NEVER_MELT_ICE,
    .moves = {MOVE_ICE_BEAM, MOVE_MOONBLAST, MOVE_SHADOW_BALL, MOVE_CALM_MIND}
    },
    {
    .iv = 255,
    .lvl = 55,
    .species = SPECIES_WHISCASH,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_EARTHQUAKE, MOVE_SURF, MOVE_ICE_BEAM, MOVE_REST}
    },
    {
    .iv = 255,
    .lvl = 56,
    .species = SPECIES_GYARADOS,
    .heldItem = ITEM_LUM_BERRY,
    .moves = {MOVE_DRAGON_DANCE, MOVE_WATERFALL, MOVE_EARTHQUAKE, MOVE_STONE_EDGE}
    },
    {
    .iv = 255,
    .lvl = 58,
    .species = SPECIES_MILOTIC,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_RECOVER, MOVE_TOXIC}
    }
};

static const struct TrainerMonItemCustomMoves sParty_WallaceRematch1[] = {
    {
    .iv = 255,
    .lvl = 64,
    .species = SPECIES_LUDICOLO_HOENN,
    .heldItem = ITEM_MAGNET,
    .moves = {MOVE_THUNDERBOLT, MOVE_GIGA_DRAIN, MOVE_THUNDER_WAVE, MOVE_RAIN_DANCE}
    },
    {
    .iv = 255,
    .lvl = 65,
    .species = SPECIES_ARCANINE_HOENN,
    .heldItem = ITEM_LUM_BERRY,
    .moves = {MOVE_SURF, MOVE_FLAMETHROWER, MOVE_EXTREME_SPEED, MOVE_CRUNCH}
    },
    {
    .iv = 255,
    .lvl = 66,
    .species = SPECIES_NINETALES_HOENN,
    .heldItem = ITEM_NEVER_MELT_ICE,
    .moves = {MOVE_ICE_BEAM, MOVE_MOONBLAST, MOVE_SHADOW_BALL, MOVE_CALM_MIND}
    },
    {
    .iv = 255,
    .lvl = 67,
    .species = SPECIES_WHISCASH,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_EARTHQUAKE, MOVE_SURF, MOVE_ICE_BEAM, MOVE_REST}
    },
    {
    .iv = 255,
    .lvl = 68,
    .species = SPECIES_GYARADOS,
    .heldItem = ITEM_LUM_BERRY,
    .moves = {MOVE_DRAGON_DANCE, MOVE_WATERFALL, MOVE_EARTHQUAKE, MOVE_STONE_EDGE}
    },
    {
    .iv = 255,
    .lvl = 71,
    .species = SPECIES_MILOTIC,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_RECOVER, MOVE_MOONBLAST}
    }
};

static const struct TrainerMonItemCustomMoves sParty_WallaceRematch2[] = {
    {
    .iv = 255,
    .lvl = 73,
    .species = SPECIES_LUDICOLO_HOENN,
    .heldItem = ITEM_PETAYA_BERRY,
    .moves = {MOVE_THUNDER, MOVE_GIGA_DRAIN, MOVE_RAIN_DANCE, MOVE_THUNDER_WAVE}
    },
    {
    .iv = 255,
    .lvl = 75,
    .species = SPECIES_ARCANINE_HOENN,
    .heldItem = ITEM_LUM_BERRY,
    .moves = {MOVE_SURF, MOVE_FLAMETHROWER, MOVE_EXTREME_SPEED, MOVE_CRUNCH}
    },
    {
    .iv = 255,
    .lvl = 76,
    .species = SPECIES_NINETALES_HOENN,
    .heldItem = ITEM_NEVER_MELT_ICE,
    .moves = {MOVE_ICE_BEAM, MOVE_MOONBLAST, MOVE_SHADOW_BALL, MOVE_CALM_MIND}
    },
    {
    .iv = 255,
    .lvl = 78,
    .species = SPECIES_WHISCASH,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_EARTHQUAKE, MOVE_SURF, MOVE_ICE_BEAM, MOVE_REST}
    },
    {
    .iv = 255,
    .lvl = 80,
    .species = SPECIES_GYARADOS,
    .heldItem = ITEM_SITRUS_BERRY,
    .moves = {MOVE_DRAGON_DANCE, MOVE_WATERFALL, MOVE_EARTHQUAKE, MOVE_STONE_EDGE}
    },
    {
    .iv = 255,
    .lvl = 82,
    .species = SPECIES_MILOTIC,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_RECOVER, MOVE_MIRROR_COAT}
    }
};

static const struct TrainerMonItemCustomMoves sParty_WallaceRematch3[] = {
    {
    .iv = 255,
    .lvl = 82,
    .species = SPECIES_LUDICOLO_HOENN,
    .heldItem = ITEM_PETAYA_BERRY,
    .moves = {MOVE_THUNDER, MOVE_GIGA_DRAIN, MOVE_RAIN_DANCE, MOVE_THUNDER_WAVE}
    },
    {
    .iv = 255,
    .lvl = 84,
    .species = SPECIES_ARCANINE_HOENN,
    .heldItem = ITEM_LUM_BERRY,
    .moves = {MOVE_SURF, MOVE_FLAMETHROWER, MOVE_EXTREME_SPEED, MOVE_CRUNCH}
    },
    {
    .iv = 255,
    .lvl = 85,
    .species = SPECIES_NINETALES_HOENN,
    .heldItem = ITEM_NEVER_MELT_ICE,
    .moves = {MOVE_ICE_BEAM, MOVE_MOONBLAST, MOVE_SHADOW_BALL, MOVE_CALM_MIND}
    },
    {
    .iv = 255,
    .lvl = 86,
    .species = SPECIES_SWAMPERT,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_EARTHQUAKE, MOVE_SURF, MOVE_ICE_BEAM, MOVE_CURSE}
    },
    {
    .iv = 255,
    .lvl = 88,
    .species = SPECIES_GYARADOS,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_DRAGON_DANCE, MOVE_WATERFALL, MOVE_EARTHQUAKE, MOVE_TAUNT}
    },
    {
    .iv = 255,
    .lvl = 90,
    .species = SPECIES_MILOTIC,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_RECOVER, MOVE_MIRROR_COAT}
    }
};

static const struct TrainerMonItemCustomMoves sParty_WallaceRematch4[] = {
    {
    .iv = 255,
    .lvl = 90,
    .species = SPECIES_LUDICOLO_HOENN,
    .heldItem = ITEM_PETAYA_BERRY,
    .moves = {MOVE_THUNDER, MOVE_GIGA_DRAIN, MOVE_RAIN_DANCE, MOVE_CHARGE}
    },
    {
    .iv = 255,
    .lvl = 91,
    .species = SPECIES_ARCANINE_HOENN,
    .heldItem = ITEM_SITRUS_BERRY,
    .moves = {MOVE_SURF, MOVE_FLAMETHROWER, MOVE_EXTREME_SPEED, MOVE_CRUNCH}
    },
    {
    .iv = 255,
    .lvl = 92,
    .species = SPECIES_NINETALES_HOENN,
    .heldItem = ITEM_NEVER_MELT_ICE,
    .moves = {MOVE_ICE_BEAM, MOVE_MOONBLAST, MOVE_SHADOW_BALL, MOVE_CALM_MIND}
    },
    {
    .iv = 255,
    .lvl = 93,
    .species = SPECIES_SWAMPERT,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_EARTHQUAKE, MOVE_SURF, MOVE_ICE_BEAM, MOVE_CURSE}
    },
    {
    .iv = 255,
    .lvl = 94,
    .species = SPECIES_GYARADOS,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_DRAGON_DANCE, MOVE_WATERFALL, MOVE_EARTHQUAKE, MOVE_TAUNT}
    },
    {
    .iv = 255,
    .lvl = 95,
    .species = SPECIES_MILOTIC,
    .heldItem = ITEM_LEFTOVERS,
    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_RECOVER, MOVE_MIRROR_COAT}
    }
};
```
