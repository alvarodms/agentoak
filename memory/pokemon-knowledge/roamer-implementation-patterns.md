---
name: Roamer System Technical Reference
description: Complete function map, data structures, and modification plan for pokeemerald's roaming Pokémon system — the foundation for Legendary Beasts implementation
type: reference
---

# Roamer System — Complete Technical Reference

**Cycle**: 108 | **Date**: 2026-03-26

---

## 1. Save Data Structure

**File**: `include/global.h:608-623`

```c
struct Roamer {          // 0x1C bytes (28 total, 8 are filler)
    /*0x00*/ u32 ivs;
    /*0x04*/ u32 personality;
    /*0x08*/ u16 species;
    /*0x0A*/ u16 hp;
    /*0x0C*/ u8 level;
    /*0x0D*/ u8 status;
    /*0x0E*/ u8 cool;     // contest stats preserved across encounters
    /*0x0F*/ u8 beauty;
    /*0x10*/ u8 cute;
    /*0x11*/ u8 smart;
    /*0x12*/ u8 tough;
    /*0x13*/ bool8 active;
    /*0x14*/ u8 filler[0x8];
};
```

**Location in save**: `SaveBlock1.roamer` at offset `0x31DC` (line 1065).

**Key insight**: Single roamer slot. Only ONE roamer can exist at a time. The `active` field is the only thing controlling whether encounters trigger. The `filler[8]` bytes could theoretically store beast-tracking flags, but using the existing flag system is safer and avoids save struct changes.

**Known bug** (line 200-207): `UpdateRoamerHPStatus` writes status as u8 but `SetMonData` expects u32, causing it to read into cool/beauty/cute bytes. `#ifdef BUGFIX` exists but is inactive by default.

---

## 2. EWRAM Location State

**File**: `src/roamer.c:18-19`

```c
EWRAM_DATA static u8 sLocationHistory[3][2] = {0};  // [mapGroup, mapNum] × 3 moves
EWRAM_DATA static u8 sRoamerLocation[2] = {0};       // current [mapGroup, mapNum]
```

These are **not saved** — they reset on load. `sLocationHistory` tracks last 3 player locations to avoid ping-ponging. `sRoamerLocation` is the roamer's current map.

**ROAMER_MAP_GROUP** is hardcoded to 0 (line 9).

---

## 3. Location Table

**File**: `src/roamer.c:35-58`

`sRoamerLocations[][6]` — 21 rows (20 location sets + 1 terminator). Each row: first entry = "home" map, entries 2-6 = adjacent maps roamer can move to. `___` = MAP_UNDEFINED = empty slot.

Routes included: 110, 111, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134.

**Softlock risks** (documented in comments lines 23-34):
- Must have ≥2 location sets with different starting maps
- Each set must have ≥3 unique maps
- If a map lacks a set starting with it, roamer "sticks" there

---

## 4. Function Map

### Initialization

| Function | File:Line | Purpose |
|---|---|---|
| `ClearRoamerData()` | roamer.c:64 | Zeroes struct, sets species=LATIAS |
| `ClearRoamerLocationData()` | roamer.c:70 | Zeroes sLocationHistory + sRoamerLocation |
| `CreateInitialRoamerMon(bool16 createLatios)` | roamer.c:84 | Creates mon at level 40, copies IVs/personality/HP/contest stats to Roamer struct |
| `InitRoamer()` | roamer.c:108 | Entry point (called via `special`). Uses `gSpecialVar_0x8004` for Latias(0)/Latios(1) |

**Hardcoded values to change**: `SPECIES_LATIAS`/`SPECIES_LATIOS` (lines 67, 87-89), level `40` (line 91).

### Movement (called from overworld.c)

| Function | File:Line | Purpose | Called from |
|---|---|---|---|
| `UpdateLocationHistoryForRoamer()` | roamer.c:115 | Shifts player location into 3-entry history | overworld.c:421, 816, 861 |
| `RoamerMove()` | roamer.c:149 | Moves roamer to adjacent map (1/16 chance of random jump) | overworld.c:817 |
| `RoamerMoveToOtherLocationSet()` | roamer.c:127 | Jumps roamer to a random non-current starting map | overworld.c:422, 862 |

**overworld.c integration points**:
- `UpdateMiscOverworldStates()` (line 416): calls UpdateLocationHistory + MoveToOtherLocationSet
- Map transition (line 816-817): calls UpdateLocationHistory + RoamerMove (normal movement)
- Fly/teleport (line 861-862): calls UpdateLocationHistory + MoveToOtherLocationSet (big jump)

### Encounter

| Function | File:Line | Purpose |
|---|---|---|
| `IsRoamerAt(mapGroup, mapNum)` | roamer.c:186 | Returns TRUE if roamer is active and at given map |
| `TryStartRoamerEncounter()` | roamer.c:216 | 25% chance (Random()%4==0) if roamer is at player's map |
| `CreateRoamerMonInstance()` | roamer.c:194 | Builds enemy party[0] from saved Roamer struct |
| `GetRoamerLocation(mapGroup*, mapNum*)` | roamer.c:242 | Used by Pokédex area screen |

**wild_encounter.c integration** (4 call sites):
- `StandardWildEncounter()` line 620: Land encounter — after WildEncounterCheck passes, tries roamer FIRST, then mass outbreak, then normal
- `StandardWildEncounter()` line 659: Water encounter — same priority
- Sweet Scent land (line 750): tries roamer first
- Sweet Scent water (line 771): tries roamer first

**Priority**: Roamer check happens AFTER the encounter rate check passes but BEFORE normal species selection. If roamer triggers, it replaces the normal encounter entirely.

**Repel interaction** (lines 622-624): Roamer encounters still respect Repel — checked via `IsWildLevelAllowedByRepel(roamer->level)`.

### Battle

| Function | File:Line | Purpose |
|---|---|---|
| `BattleSetup_StartRoamerBattle()` | battle_setup.c:421 | Sets `gBattleTypeFlags = BATTLE_TYPE_ROAMER`, creates battle task |
| `CB2_EndWildBattle` (roamer branch) | battle_main.c:5250 | On battle end: calls `UpdateRoamerHPStatus`, then `SetRoamerInactive` if won/caught |

**BATTLE_TYPE_ROAMER** = `(1 << 10)` (constants/battle.h:69)

### Battle AI — Flee Logic

**File**: `data/battle_ai_scripts.s:3211-3224`

```asm
AI_Roaming:
    if_status2 AI_USER, STATUS2_WRAPPED, AI_Roaming_End     @ Don't flee if Wrapped
    if_status2 AI_USER, STATUS2_ESCAPE_PREVENTION, AI_Roaming_End  @ Don't flee if Mean Look'd
    get_ability AI_TARGET
    if_equal ABILITY_SHADOW_TAG, AI_Roaming_End              @ Don't flee vs Shadow Tag
    get_ability AI_USER
    if_equal ABILITY_LEVITATE, AI_Roaming_Flee               @ Skip Arena Trap check if Levitate
    get_ability AI_TARGET
    if_equal ABILITY_ARENA_TRAP, AI_Roaming_End              @ Don't flee vs Arena Trap
AI_Roaming_Flee:
    flee
AI_Roaming_End:
    end                                                       @ Stay and fight this turn
```

**Key insight**: The roamer AI runs EVERY turn. It tries to flee immediately unless trapped. There is NO turn counter — vanilla roamers flee on turn 1 if not trapped. To implement "3 turns before fleeing", we'd need to add a turn counter check before the `flee` command.

**AI selection**: `battle_ai_script_commands.c:365` — when `BATTLE_TYPE_ROAMER` is set, AI flags = `AI_SCRIPT_ROAMING`.

### Post-Battle

**battle_main.c:5250-5260**: After battle ends:
1. Always calls `UpdateRoamerHPStatus(&gEnemyParty[0])` — persists HP/status
2. `UpdateRoamerHPStatus` also calls `RoamerMoveToOtherLocationSet()` — roamer relocates after fleeing
3. If outcome is WON or CAUGHT: calls `SetRoamerInactive()` which just sets `active = FALSE`

**Bug** (line 5255-5258): Vanilla uses `gBattleOutcome & B_OUTCOME_WON` (bitwise AND) instead of `== B_OUTCOME_WON`. This means Roar (outcome 5, B_OUTCOME_PLAYER_TELEPORTED) also deactivates the roamer because `5 & 1 = 1`. The BUGFIX branch fixes this.

### Deactivation

| Function | File:Line | Purpose |
|---|---|---|
| `SetRoamerInactive()` | roamer.c:237 | Sets `ROAMER->active = FALSE` — that's all |

**Observation**: No separate "caught" vs "KO'd" distinction. Both just deactivate. For respawn mechanics, we need to distinguish these — either by checking `ROAMER->hp == 0` before deactivating, or by setting a separate flag.

---

## 5. Trigger Script Flow

**Files**: `data/scripts/players_house.inc:455-481`, `data/scripts/tv.inc:37-47`

**Vanilla trigger sequence** (after beating E4, returning home):
1. Dad gives SS Ticket
2. `setflag FLAG_SYS_TV_LATIAS_LATIOS` — turns on TV
3. Mom notices breaking news → player approaches TV
4. TV shows "emergency news flash" about Latias/Latios
5. `clearflag FLAG_SYS_TV_LATIAS_LATIOS` — turns off TV
6. `setflag FLAG_LATIOS_OR_LATIAS_ROAMING` — permanent flag marking roamer as released
7. Mom asks "what color did they say?" → multichoice (Red=Latias, Blue=Latios)
8. `copyvar VAR_0x8004, VAR_RESULT` → `special InitRoamer` → roamer created
9. `copyvar VAR_ROAMER_POKEMON, VAR_RESULT` — stores which Lati was chosen

**Relevant flags/vars**:
- `FLAG_SYS_TV_LATIAS_LATIOS` (SYSTEM_FLAGS+0x5D) — temporary, controls TV screen during event
- `FLAG_LATIOS_OR_LATIAS_ROAMING` (0xFF) — permanent, marks roamer active
- `VAR_ROAMER_POKEMON` (0x40D5) — stores 0=Latias, 1=Latios

**For Legends of Hoenn**: Our trigger will be in Birch's Lab, not the player's house. After Migration Tracker completion, Birch reports sightings → calls `special InitRoamer` with species override. The `FLAG_LATIOS_OR_LATIAS_ROAMING` flag can be repurposed or we can use unused flags.

---

## 6. Pokédex Area Screen Integration

**File**: `src/pokedex_area_screen.c:240-316`

`FindMapsWithMon()` checks if the searched species matches `roamer->species`. If yes and `roamer->active`, it shows the roamer's current location as a blinking dot on the area map via `GetRoamerLocation()`. If inactive, shows nothing.

**For sequential beasts**: The Pokédex will automatically show the active beast's location since we change `roamer->species` for each beast. Previous beasts (caught/inactive) won't show — which is correct.

---

## 7. New Game Reset

**File**: `src/new_game.c:184-185`
Both `ClearRoamerData()` and `ClearRoamerLocationData()` called on new game. No issues.

---

## 8. Flag Capacity

**File**: `include/constants/flags.h`

Unused system flags available (generous supply):
- `FLAG_UNUSED_0x863` (1 flag)
- `FLAG_UNUSED_0x881` through `FLAG_UNUSED_0x887` (7 flags)
- `FLAG_UNUSED_0x88E`, `FLAG_UNUSED_0x88F` (2 flags)
- `FLAG_UNUSED_0x8E3`, `FLAG_UNUSED_0x8E5` through `FLAG_UNUSED_0x91F` (many more)

We need ~6 flags for the beast system:
- `FLAG_BEAST_RAIKOU_DONE` — Raikou caught/completed
- `FLAG_BEAST_ENTEI_DONE` — Entei caught/completed
- `FLAG_BEAST_SUICUNE_DONE` — Suicune caught/completed
- `FLAG_BEAST_RAIKOU_KO` — Raikou was KO'd (respawn trigger)
- `FLAG_BEAST_ENTEI_KO` — Entei was KO'd (respawn trigger)
- `FLAG_BEAST_SUICUNE_KO` — Suicune was KO'd (respawn trigger)

Plenty of space. Use `FLAG_UNUSED_0x881` through `FLAG_UNUSED_0x886`.

---

## 9. Species Status

`SPECIES_RAIKOU` (243), `SPECIES_ENTEI` (244), `SPECIES_SUICUNE` (245) already exist in `include/constants/species.h`. No species addition needed — these are vanilla Gen 2 species fully present in the Emerald codebase with stats, sprites, cries, etc.

---

## 10. Implementation Plan for Cycles 109-112

### Files to Modify

| Cycle | File | Change |
|---|---|---|
| 109-110 | (none — species already exist) | Verify species data is complete |
| 111 | `src/roamer.c` | Replace Latias/Latios with beast-aware init; add `InitNextBeast()` function |
| 111 | `include/roamer.h` | Add `InitNextBeast()` declaration |
| 111 | `data/battle_ai_scripts.s` | Add turn counter to AI_Roaming for 3-turn flee |
| 111 | `include/constants/flags.h` | Define 6 beast flags |
| 111 | `src/battle_main.c` | In CB2_EndWildBattle roamer branch: set KO flag if HP=0, set DONE flag if caught |
| 111 | `data/scripts/players_house.inc` | Remove or gate vanilla Lati trigger |
| 112 | Birch Lab scripts | Add beast release trigger after Migration Tracker |
| 112 | NPC dialogue scripts | Add sighting dialogue on routes |

### Design Decisions (Locked)

1. **Sequential slot reuse**: Confirmed correct. Single `struct Roamer`, 3 DONE flags, 3 KO flags. When current beast is caught, Birch dialogue triggers next.

2. **Respawn on KO**: When a beast is KO'd, `SetRoamerInactive()` is called AND the beast's KO flag is set. After beating E4 again, Birch checks KO flags and re-releases the KO'd beast (clears KO flag, calls InitRoamer with same species). This uses the existing flag system — no save struct changes.

3. **3-turn flee**: Modify `AI_Roaming` in `battle_ai_scripts.s` to check a turn counter. The battle system tracks turns via `gBattleResults.battleTurnCounter`. Add `if_less_than` check — flee only after turn 3. This gives players time to inflict status or throw balls.

4. **Level**: Keep at 40 (vanilla roamer level). Postgame teams are ~50-60, making beasts catchable but not trivial.

5. **Release order**: Raikou → Entei → Suicune (matching Johto tower order). Each released via Birch conversation after previous is caught.

### RoamersPlus Reference

Sneed69's RoamersPlus branch supports concurrent multi-roamers with save struct changes. Our sequential design is simpler — we don't need concurrent roamers and avoid save compatibility risks. However, RoamersPlus's "battling roamer" and "respawn" patterns informed our design decisions.
