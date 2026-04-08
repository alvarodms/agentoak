# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v8.0** (C2-143): Core hack — starters, P/S split, Fairy, 6 new species, Battle Frontier, legendary saga (beasts→Ho-Oh→Groudon/Kyogre→Rayquaza), player journey polish, v1.0 ship.
**v1.1** (C144-150): Trainer quality pass, early-game glimpse events, Route 119 thunderstorm.
**v1.2** (C151-156): 3 interactive migration events, indoor running QoL.
**v1.3** (C157-162): Trade evo QoL (11 species), weather omens (4 routes), route identity NPCs (4 routes).
**v1.4** (C165-170): 60+ encounter tables rewritten. [Detail: `memory/v14-encounter-design.md`]
**v1.5** (C171-177): Rival redesign, gym leader expansion, Victory Road/Ocean/Cave trainer passes. [Detail: `memory/v15-trainer-design.md`]

---

# v1.6: "First Impressions & Challenge Mode" (C179-C185)

## Vision

The player knows this isn't vanilla Emerald within 5 minutes. By Rustboro, they've chosen their difficulty and seen a curated world. Challenge Mode rewards mastery with Set battles and level discipline.

v1.4 fixed what the player *finds*. v1.5 fixed what *finds the player*. v1.6 fixes the **first impression** — the moment a player decides to keep playing — and gives them **agency over difficulty**.

## Reality Check: What's Already Done

The early game is in far better shape than initially assumed. Previous cycles shipped:
- **C140**: 6 migration NPCs across Oldale→Rustboro corridor (Johto researcher, Bug Catcher/Beldum, Norman/migration reports, Vulpix/flowers, Devon/Riolu, Electabuzz on Cycling Road)
- **C144-145**: 4 glimpse coord_events on Routes 101, 102, 104, 116 (mystery creature text, flagged one-shot)
- **C152**: Petalburg Woods Pikachu sighting event (OW sprite dash, cry, atmospheric text)
- **C165-167**: Encounter tables already showcase migration species (Dratini R102 water, Vulpix/Meowth R103, Pikachu R104)

**What's still missing**: ~~Birch never mentions migration~~ (fixed C180). ~~Littleroot NPCs are vanilla~~ (fixed C180). No difficulty selection exists anywhere.

## Design Principles

1. **Show, don't tell**: Migration discovered through encounters and overheard NPC conversations, not exposition dumps
2. **Subtlety > spectacle**: Littleroot should feel like a quiet town where something is stirring, not a tutorial
3. **Challenge mode is additive**: Same trainers, same encounters — harder rules. No separate content tracks.
4. **Two tiers only**: Normal (current experience) and Challenge (Set + level caps). Don't try to be Unbound with 4 tiers.
5. **Gen 3 item rules**: Choice Band OK. No Focus Sash/Life Orb/Choice Specs/Scarf.

---

## Phase 1: Scripted Event Macro Library (C179) — DONE

Created `asm/macros/event_macros.inc` with 3 macros: GlimpseEvent, BadgeGateShow, ConditionalDialogue. Included in build via `asm/macros.inc`. Compiles cleanly. No existing scripts converted yet — macros are available for C180+ use.

---

## Phase 2: Birch Lab & Littleroot Polish (C180) — DONE

Birch migration hint (2 msgbox after Pokédex gift: Riolu/Rustboro hook + "keep your eyes open"). Boy NPC: strange cry from Route 101. Girl/Twin NPC: Birch lab light + migration muttering. All C139 conditional branches preserved.

---

## Phase 3: Difficulty Selection + Set Mode (C181) — Engine Sprint

**Goal**: Player chooses Normal or Challenge mode. Challenge forces Set battle style.

### Difficulty Selection Script
**Location**: `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` — after Birch's migration dialogue (C180), before player leaves the lab for the first time.

**Flag**: `FLAG_DIFFICULTY_CHALLENGE` at `0x286` in `include/constants/flags.h`

**Draft dialogue** (Birch):
> "Oh, and {PLAYER} — one last thing. HOENN can be a challenging place, especially with these new arrivals. How would you like to approach your journey?"

Then a `multichoice` with two options:
- **"Normal Mode"** → no flag set, Birch says: "A classic journey! Take your time and enjoy HOENN at your own pace."
- **"Challenge Mode"** → set `FLAG_DIFFICULTY_CHALLENGE`, Birch says: "Ah, a bold spirit! In Challenge Mode, you won't get a chance to switch POKéMON when your opponent sends out a new one, and your team will need to stay sharp — overleveling won't carry you. Good luck!"

**Locked after selection**: No NPC to change it mid-game. Choice is permanent.

### Set Mode Implementation
**File**: `src/battle_main.c` at line ~3111
**Change**: After `gBattleScripting.battleStyle = gSaveBlock2Ptr->optionsBattleStyle;`, add:
```c
if (FlagGet(FLAG_DIFFICULTY_CHALLENGE))
    gBattleScripting.battleStyle = OPTIONS_BATTLE_STYLE_SET;
```
**Include needed**: `#include "event_data.h"` for `FlagGet()` (verify it's not already included).
**Effect**: Challenge players always battle in Set mode regardless of options menu setting.

### Difficulty Reminder NPC
**Location**: Oldale Town Pokémon Center (first center the player visits)
**Dialogue**: "You're playing in {Challenge/Normal} Mode, right? I can always tell — Challenge Mode trainers have a certain look in their eye!"
**Implementation**: Simple `goto_if_set FLAG_DIFFICULTY_CHALLENGE` branch.

---

## Phase 4: Badge-Based Level Caps (C182) — Engine Sprint

**Goal**: In Challenge Mode, Pokémon above the badge-appropriate level cap earn drastically reduced EXP.

### Level Cap Table

| Badges | Cap | Rationale |
|--------|-----|-----------|
| 0 | 16 | Pre-Roxanne: starters reach ~14-15 naturally |
| 1 (Roxanne) | 20 | Brawly's ace is Lv18 |
| 2 (Brawly) | 24 | Wattson's ace is Lv24 |
| 3 (Wattson) | 30 | Flannery's ace is Lv29 |
| 4 (Flannery) | 34 | Norman's ace is Lv31 |
| 5 (Norman) | 38 | Winona's ace is Lv33 |
| 6 (Winona) | 42 | Tate&Liza aces are Lv42 |
| 7 (Tate&Liza) | 48 | Juan's ace is Lv46 |
| 8 (Juan) | 55 | E4 Sidney starts at Lv46, Champion at Lv58 |
| E4 clear | 100 | No cap — postgame is unrestricted |

### Implementation
**File**: `src/battle_script_commands.c`, in `Cmd_getexp()` around line 3369-3380
**Injection point**: After all EXP multipliers are applied to `gBattleMoveDamage`, before the value is used:

```c
// Challenge Mode soft level cap
if (FlagGet(FLAG_DIFFICULTY_CHALLENGE))
{
    u8 monLevel = GetMonData(&gPlayerParty[gBattleStruct->expGetterMonId], MON_DATA_LEVEL);
    u8 levelCap = GetChallengeLevelCap(); // helper function
    if (monLevel >= levelCap)
        gBattleMoveDamage = gBattleMoveDamage / 10; // 10% EXP above cap
}
```

**Helper function** `GetChallengeLevelCap()`: checks badge flags (FLAG_BADGE01_GET through FLAG_BADGE08_GET) and returns the appropriate cap from the table above. ~20 lines, place in same file or in `src/battle_util.c`.

**Soft cap, not hard**: Pokémon still gain *some* EXP (prevents softlocks). Rare Candy bypasses cap (intentional). Daycare/link/Frontier unaffected.

---

## Phase 5: Polish & Wrap-up (C183-C185)

**C183**: Integration testing — verify Set mode in all battle types, level cap with Lucky Egg/Exp Share/traded boost, new game flow. Add difficulty-reminder NPCs in Pokémon Centers.
**C184**: README update, v1.7 direction brainstorm, memory maintenance pass (10-cycle boundary).
**C185**: Buffer — overflow, edge cases, regressions.

---

## Cycle Roadmap Summary

| Cycle | Phase | Scope | Depends On |
|-------|-------|-------|------------|
| **C178** | Planning | This document | — |
| **C179** | Macro Library | `event_macros.inc` — extract 12+ shared patterns | — |
| **C180** | Birch & Littleroot | Migration dialogue + NPC updates (~2 files) | C179 (macros available) |
| **C181** | Difficulty Selection | Flag + multichoice script + Set mode override | C180 (lab script exists) |
| **C182** | Level Caps | `Cmd_getexp()` soft cap + helper function | C181 (flag exists) |
| **C183** | Polish & Testing | Edge cases, reminder NPCs, integration | C182 |
| **C184** | Wrap-up | README, v1.7 planning, memory maintenance | C183 |
| **C185** | Buffer | Overflow / regressions | — |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Set mode override: `src/battle_main.c:3111`. Level cap: `src/battle_script_commands.c:~3377`.
- **Flag space**: 0x264+ (v6), 0x272-0x277 (Sky Guardian), 0x278-0x285 (migration/weather). Next available: 0x286.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, reclaimable IDs: #568, #853, #854. Struct types: NoItemDefaultMoves, NoItemCustomMoves, ItemDefaultMoves, ItemCustomMoves.
- **QoL shipped**: TMs non-consumable, indoor running, trade evo QoL (11 species).
