---
name: Roamer System Technical Reference
description: Key data structures, flags, and modification points for pokeemerald's roaming Pokémon system — foundation for Legendary Beasts
type: reference
---

# Roamer System — Compact Reference

## Save Data

`struct Roamer` in `include/global.h:608` — 0x1C bytes. Fields: ivs, personality, species, hp, level, status, contest stats, active (bool8), filler[8]. Single slot — only ONE roamer at a time. `active` controls encounters.

**Known bug**: `UpdateRoamerHPStatus` writes u8 status but `SetMonData` expects u32 (reads into contest bytes). `#ifdef BUGFIX` exists but inactive.

## Key Functions

| Function | File | Purpose |
|---|---|---|
| `InitRoamer()` | roamer.c:108 | Entry point via `special`. Uses `gSpecialVar_0x8004` |
| `RoamerMove()` | roamer.c:149 | Moves to adjacent map (1/16 chance random jump) |
| `TryStartRoamerEncounter()` | roamer.c:216 | 25% chance if roamer at player's map |
| `SetRoamerInactive()` | roamer.c:237 | Sets `active = FALSE` |

**Encounter priority**: After encounter rate check passes, roamer checked BEFORE normal species. Respects Repel.

**AI**: `AI_Roaming` in `battle_ai_scripts.s:3211` — tries to flee every turn unless trapped (Wrap, Mean Look, Shadow Tag, Arena Trap). No turn counter in vanilla.

**overworld.c hooks**: UpdateMiscOverworldStates (line 416), map transition (816-817), fly/teleport (861-862).

## Legends of Hoenn Beast System (Shipped C109-C142)

- Sequential slot reuse: Raikou → Entei → Suicune, same struct
- 6 flags in `FLAG_UNUSED_0x881-0x886`: 3 DONE + 3 KO per beast
- Respawn on KO via Birch after re-beating E4
- 3-turn flee (modified AI_Roaming with turn counter)
- Trigger: Birch Lab after Migration Tracker, not player's house

## Flag/Var Reference

- `FLAG_LATIOS_OR_LATIAS_ROAMING` (0xFF) — repurposed for beast release
- `VAR_ROAMER_POKEMON` (0x40D5) — stores beast index
- Beast flags: `0x881-0x886`
