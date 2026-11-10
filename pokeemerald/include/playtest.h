#ifndef GUARD_PLAYTEST_H
#define GUARD_PLAYTEST_H

// Headless playtest support (runner: src/emulator/ in the agent-oak repo).
//
// gPlaytestScenario is inert in every normal build: its magic is
// PLAYTEST_MAGIC_INACTIVE and the game boots exactly as before. The playtest
// harness copies the ROM, overwrites the struct with a scenario and the
// PLAYTEST_MAGIC_ACTIVE magic, and boots the copy. The game then skips the
// intro, runs the real new-game setup (NewGameInitData), applies the scenario
// and warps straight to its map and tile.
//
// The harness writes this struct byte for byte, so its layout is a contract:
// change it only together with src/emulator/scenario.ts, and bump
// PLAYTEST_LAYOUT_VERSION.

#define PLAYTEST_MAGIC_INACTIVE 0x584B414F // "OAKX"
#define PLAYTEST_MAGIC_ACTIVE   0x504B414F // "OAKP"
#define PLAYTEST_LAYOUT_VERSION 2

#define PLAYTEST_MAX_FLAGS 64
#define PLAYTEST_MAX_VARS  32
#define PLAYTEST_MAX_ITEMS 16
#define PLAYTEST_MAX_DEX   32

// A flag entry with this bit set clears the flag instead of setting it.
#define PLAYTEST_FLAG_CLEAR 0x8000

struct PlaytestMon
{
    /*0x00*/ u16 species;
    /*0x02*/ u8 level;
    /*0x03*/ u8 padding;
    /*0x04*/ u16 heldItem;
    /*0x06*/ u16 moves[MAX_MON_MOVES]; // all MOVE_NONE = level-up default moveset
    /*0x0E*/ u16 padding2; // agbcc pads structs to 4 bytes; make it explicit
}; // 0x10

struct PlaytestPair
{
    /*0x00*/ u16 id;
    /*0x02*/ u16 value;
}; // 0x04

struct PlaytestScenario
{
    /*0x000*/ u32 magic;
    /*0x004*/ u16 layoutVersion;
    /*0x006*/ s8 mapGroup;
    /*0x007*/ s8 mapNum;
    /*0x008*/ s8 x;
    /*0x009*/ s8 y;
    /*0x00A*/ u8 gender;
    /*0x00B*/ u8 partyCount;
    /*0x00C*/ u8 flagCount;
    /*0x00D*/ u8 varCount;
    /*0x00E*/ u8 itemCount;
    /*0x00F*/ u8 dexCount;
    /*0x010*/ u32 money;
    /*0x014*/ u8 playerName[PLAYER_NAME_LENGTH + 1];
    /*0x01C*/ u16 flags[PLAYTEST_MAX_FLAGS];
    /*0x09C*/ struct PlaytestPair vars[PLAYTEST_MAX_VARS];      // id, value
    /*0x11C*/ struct PlaytestMon party[PARTY_SIZE];
    /*0x17C*/ struct PlaytestPair items[PLAYTEST_MAX_ITEMS];    // item, quantity
    /*0x1BC*/ u16 dexCaught[PLAYTEST_MAX_DEX];                 // species, marked seen + caught
}; // 0x1FC

// Struct offsets the harness needs to read game state. Built by the
// compiler, so they stay right if the hack changes these structs.
enum PlaytestLayoutField
{
    PLAYTEST_LAYOUT_VERSION_FIELD,
    PLAYTEST_LAYOUT_SAVEBLOCK1_LOCATION,
    PLAYTEST_LAYOUT_SAVEBLOCK1_FLAGS,
    PLAYTEST_LAYOUT_SAVEBLOCK1_VARS,
    PLAYTEST_LAYOUT_OBJECT_EVENT_SIZE,
    PLAYTEST_LAYOUT_OBJECT_EVENT_COORDS,
    PLAYTEST_LAYOUT_PLAYER_AVATAR_OBJECT_EVENT_ID,
    PLAYTEST_LAYOUT_POKEMON_SIZE,
    PLAYTEST_LAYOUT_POKEMON_LEVEL,
    PLAYTEST_LAYOUT_POKEMON_HP,
    PLAYTEST_LAYOUT_POKEMON_MAX_HP,
    PLAYTEST_LAYOUT_BOX_POKEMON_SECURE,
    PLAYTEST_LAYOUT_BATTLE_POKEMON_SIZE,
    PLAYTEST_LAYOUT_BATTLE_POKEMON_SPECIES,
    PLAYTEST_LAYOUT_BATTLE_POKEMON_HP,
    PLAYTEST_LAYOUT_BATTLE_POKEMON_MAX_HP,
    PLAYTEST_LAYOUT_BATTLE_POKEMON_LEVEL,
    PLAYTEST_LAYOUT_FLAGS_COUNT,
    PLAYTEST_LAYOUT_VARS_START,
    PLAYTEST_LAYOUT_VARS_COUNT,
    PLAYTEST_LAYOUT_OBJECT_EVENT_LOCAL_ID,
    PLAYTEST_LAYOUT_OBJECT_EVENT_MAP_NUM,
    PLAYTEST_LAYOUT_OBJECT_EVENT_MAP_GROUP,
    PLAYTEST_LAYOUT_OBJECT_EVENT_GRAPHICS_ID,
    PLAYTEST_LAYOUT_OBJECT_EVENTS_COUNT,
    PLAYTEST_LAYOUT_COUNT,
};

extern const struct PlaytestScenario gPlaytestScenario;
extern const u16 gPlaytestLayout[PLAYTEST_LAYOUT_COUNT];

bool8 Playtest_IsActive(void);
void Playtest_Boot(void);
void Playtest_ApplyScenario(void);

#endif // GUARD_PLAYTEST_H
