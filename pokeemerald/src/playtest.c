#include "global.h"
#include "playtest.h"
#include "event_data.h"
#include "item.h"
#include "main.h"
#include "money.h"
#include "overworld.h"
#include "palette.h"
#include "pokedex.h"
#include "pokemon.h"
#include "scanline_effect.h"
#include "sprite.h"
#include "task.h"
#include "constants/items.h"
#include "constants/maps.h"
#include "constants/moves.h"

// See include/playtest.h. Nothing here runs unless the harness has patched
// gPlaytestScenario.magic in a copy of the ROM.

STATIC_ASSERT(sizeof(struct PlaytestMon) == 0x10, PlaytestMonSize);
STATIC_ASSERT(sizeof(struct PlaytestPair) == 0x4, PlaytestPairSize);
STATIC_ASSERT(sizeof(struct PlaytestScenario) == 0x1FC, PlaytestScenarioSize);

const struct PlaytestScenario gPlaytestScenario = {
    .magic = PLAYTEST_MAGIC_INACTIVE,
    .layoutVersion = PLAYTEST_LAYOUT_VERSION,
};

const u16 gPlaytestLayout[PLAYTEST_LAYOUT_COUNT] = {
    [PLAYTEST_LAYOUT_VERSION_FIELD]                 = PLAYTEST_LAYOUT_VERSION,
    [PLAYTEST_LAYOUT_SAVEBLOCK1_LOCATION]           = offsetof(struct SaveBlock1, location),
    [PLAYTEST_LAYOUT_SAVEBLOCK1_FLAGS]              = offsetof(struct SaveBlock1, flags),
    [PLAYTEST_LAYOUT_SAVEBLOCK1_VARS]               = offsetof(struct SaveBlock1, vars),
    [PLAYTEST_LAYOUT_OBJECT_EVENT_SIZE]             = sizeof(struct ObjectEvent),
    [PLAYTEST_LAYOUT_OBJECT_EVENT_COORDS]           = offsetof(struct ObjectEvent, currentCoords),
    [PLAYTEST_LAYOUT_PLAYER_AVATAR_OBJECT_EVENT_ID] = offsetof(struct PlayerAvatar, objectEventId),
    [PLAYTEST_LAYOUT_POKEMON_SIZE]                  = sizeof(struct Pokemon),
    [PLAYTEST_LAYOUT_POKEMON_LEVEL]                 = offsetof(struct Pokemon, level),
    [PLAYTEST_LAYOUT_POKEMON_HP]                    = offsetof(struct Pokemon, hp),
    [PLAYTEST_LAYOUT_POKEMON_MAX_HP]                = offsetof(struct Pokemon, maxHP),
    [PLAYTEST_LAYOUT_BOX_POKEMON_SECURE]            = offsetof(struct BoxPokemon, secure),
    [PLAYTEST_LAYOUT_BATTLE_POKEMON_SIZE]           = sizeof(struct BattlePokemon),
    [PLAYTEST_LAYOUT_BATTLE_POKEMON_SPECIES]        = offsetof(struct BattlePokemon, species),
    [PLAYTEST_LAYOUT_BATTLE_POKEMON_HP]             = offsetof(struct BattlePokemon, hp),
    [PLAYTEST_LAYOUT_BATTLE_POKEMON_MAX_HP]         = offsetof(struct BattlePokemon, maxHP),
    [PLAYTEST_LAYOUT_BATTLE_POKEMON_LEVEL]          = offsetof(struct BattlePokemon, level),
    [PLAYTEST_LAYOUT_FLAGS_COUNT]                   = FLAGS_COUNT,
    [PLAYTEST_LAYOUT_VARS_START]                    = VARS_START,
    [PLAYTEST_LAYOUT_VARS_COUNT]                    = VARS_COUNT,
    [PLAYTEST_LAYOUT_OBJECT_EVENT_LOCAL_ID]         = offsetof(struct ObjectEvent, localId),
    [PLAYTEST_LAYOUT_OBJECT_EVENT_MAP_NUM]          = offsetof(struct ObjectEvent, mapNum),
    [PLAYTEST_LAYOUT_OBJECT_EVENT_MAP_GROUP]        = offsetof(struct ObjectEvent, mapGroup),
    [PLAYTEST_LAYOUT_OBJECT_EVENT_GRAPHICS_ID]      = offsetof(struct ObjectEvent, graphicsId),
    [PLAYTEST_LAYOUT_OBJECT_EVENTS_COUNT]           = OBJECT_EVENTS_COUNT,
};

bool8 Playtest_IsActive(void)
{
    // Read through volatile so the compiler cannot fold the inactive
    // initializer into the check: the harness changes it after linking.
    return *(const vu32 *)&gPlaytestScenario.magic == PLAYTEST_MAGIC_ACTIVE;
}

// Called once from the boot copyright screen, after the save has loaded.
// Tears down the intro's graphics state and starts a new game; CB2_NewGame
// calls Playtest_ApplyScenario once NewGameInitData has run.
void Playtest_Boot(void)
{
    SetVBlankCallback(NULL);
    ResetTasks();
    ResetSpriteData();
    FreeAllSpritePalettes();
    ResetPaletteFade();
    ScanlineEffect_Stop();
    SetMainCallback2(CB2_NewGame);
}

static void GivePlaytestMon(u8 slot, const struct PlaytestMon *src)
{
    struct Pokemon *mon = &gPlayerParty[slot];
    u8 i;

    CreateMon(mon, src->species, src->level, USE_RANDOM_IVS, FALSE, 0, OT_ID_PLAYER_ID, 0);
    if (src->heldItem != ITEM_NONE)
        SetMonData(mon, MON_DATA_HELD_ITEM, &src->heldItem);
    if (src->abilityNum != 0)
    {
        u8 abilityNum = src->abilityNum - 1;
        SetMonData(mon, MON_DATA_ABILITY_NUM, &abilityNum);
    }

    for (i = 0; i < MAX_MON_MOVES; i++)
    {
        if (src->moves[i] != MOVE_NONE)
            break;
    }
    if (i == MAX_MON_MOVES)
        return; // keep CreateMon's level-up moveset

    for (i = 0; i < MAX_MON_MOVES; i++)
    {
        u16 move = src->moves[i];
        u8 pp = move != MOVE_NONE ? gBattleMoves[move].pp : 0;
        SetMonData(mon, MON_DATA_MOVE1 + i, &move);
        SetMonData(mon, MON_DATA_PP1 + i, &pp);
    }
}

// Runs inside CB2_NewGame, right after NewGameInitData, so the scenario's
// flags and vars win over the new-game defaults.
void Playtest_ApplyScenario(void)
{
    const struct PlaytestScenario *s = &gPlaytestScenario;
    u8 i;

    // Name and gender first: CreateMon copies them into each mon's OT data.
    for (i = 0; i < PLAYER_NAME_LENGTH + 1; i++)
        gSaveBlock2Ptr->playerName[i] = s->playerName[i];
    gSaveBlock2Ptr->playerGender = s->gender;
    SetMoney(&gSaveBlock1Ptr->money, s->money);

    for (i = 0; i < s->flagCount && i < PLAYTEST_MAX_FLAGS; i++)
    {
        u16 flag = s->flags[i];
        if (flag & PLAYTEST_FLAG_CLEAR)
            FlagClear(flag & ~PLAYTEST_FLAG_CLEAR);
        else
            FlagSet(flag);
    }
    for (i = 0; i < s->varCount && i < PLAYTEST_MAX_VARS; i++)
        VarSet(s->vars[i].id, s->vars[i].value);

    for (i = 0; i < s->partyCount && i < PARTY_SIZE; i++)
        GivePlaytestMon(i, &s->party[i]);
    CalculatePlayerPartyCount();

    for (i = 0; i < s->itemCount && i < PLAYTEST_MAX_ITEMS; i++)
        AddBagItem(s->items[i].id, s->items[i].value);

    for (i = 0; i < s->dexCount && i < PLAYTEST_MAX_DEX; i++)
    {
        u16 dexNum = SpeciesToNationalPokedexNum(s->dexCaught[i]);
        if (dexNum == 0) // SPECIES_NONE etc.: GetSetPokedexFlag would index dex number -1
            continue;
        GetSetPokedexFlag(dexNum, FLAG_SET_SEEN);
        GetSetPokedexFlag(dexNum, FLAG_SET_CAUGHT);
    }

    // Replaces the truck warp NewGameInitData set up.
    SetWarpDestination(s->mapGroup, s->mapNum, WARP_ID_NONE, s->x, s->y);
    WarpIntoMap();
}
