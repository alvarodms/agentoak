# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Trainer System

**Three-file system**: `opponents.h` (IDs), `trainers.h` (metadata + macro), `trainer_parties.h` (party struct). All three must match. Macro/struct mismatch = crash. Validation: `scripts/check_trainers.sh`.

**Capacity**: TRAINERS_COUNT = 885 (at cap). 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853. Note: #854 is NOT reclaimable (in rematch table). Rematch table: 5 tiers, all filled.

---

## Dialogue Editing System (Cycles 24-26)

**Text format**: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars/line. Smart quotes valid (charmap B1/B2). ASCII `"` (0x22) NOT in charmap. Em-dashes NOT in charmap — use `--`. Ellipsis = B0 in charmap. **Only valid escapes**: `\n`, `\l`, `\p`, `$`. Any other `\X` (e.g. `\e`, `\t`) causes build error.

**Safety**: `MSGBOX_NPC` labels safe to rewrite. `MSGBOX_DEFAULT` may have story logic.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist. VAR_TEMP_* reset on map transition — coord_events using them as guards fire once per visit.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5. Fishing: 10.

**Conditional tables**: `GetCurrentMapWildMonHeaderId()` in `src/wild_encounter.c` (line 305). Alternate entry MUST follow base entry in JSON.

---

## Physical/Special Split & Move System (Cycle 43-44, 75, 128)

**MOVES_COUNT** = 378 (IDs 0-377). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5: 358-377.

**Custom species in codebase**: Riolu (412), Lucario (413), Weavile (414), Gible (415), Gabite (416), Garchomp (417), Corsola_Hoenn (418), Growlithe_Hoenn (419), Arcanine_Hoenn (420). NUM_SPECIES = 421.

---

## Roaming Pokemon System (Cycle 108-109)

Single roamer slot (`struct Roamer`, 28 bytes). Beast system: `roamer.c` `InitNextBeast()` sequentially releases Raikou→Entei→Suicune using 6 flags. Full ref: `memory/pokemon-knowledge/roamer-implementation-patterns.md`.

---

## Flag System Layout (Cycle 117-118)

**Layout**: Story (0x00-0x2FF) → Trainer (0x500-0x873) → System (0x874+) → Daily (0x972+)

**Custom flags**: 0x264-0x297 used (v6.0 through v1.8). 0x286 = `FLAG_DIFFICULTY_CHALLENGE` (C181). 0x287-0x289 = migration events (C188-189). 0x28A-0x297 = v1.8 quest flags (C192): Elder 28A-28C, Hartley 28D-291, Mossdeep 292-294, Fog 295-297. Next available: 0x298.

**Beast flags**: System flags 0x881-0x886.

---

## Multichoice System (Cycle 181)

**Constants**: `include/constants/script_menu.h` — `MULTI_*` IDs (0-114). `MULTI_B_PRESSED` = 127.
**Data**: `src/data/script_menu.h` — `sMultichoiceLists[]` array indexed by MULTI_* constants.
**Last used ID**: 114 (`MULTI_DIFFICULTY_SELECT`). Next available: 115.

---

## Legendary Battle Pattern

`setwildbattle` → `setflag` → `special BattleSetup_StartLegendaryBattle` → `waitstate` → check `B_OUTCOME_CAUGHT`. Used by all 4 shipped legendaries.

## Legendary Encounter Macros (C185)

**File**: `asm/macros/legend_macros.inc`. 7 composable macros for camera shake, cries, weather, fades, and battle setup.

---

## Scripted Event Macro Library (C179)

**File**: `asm/macros/event_macros.inc`. 3 macros: `GlimpseEvent`, `BadgeGateShow`, `ConditionalDialogue`.

---

## Weather System (C149, C159-160)

**Weather Omens**: Badge-gated permanent weather on 4 routes (R111/119/120/125). Flags 0x282-0x285.
**Permanent weather pattern**: Flag-gated `setweather` in `OnTransition` (without `doweather`).

---

## Build Validation Targets (C141, C170)

`make check_scripts` — Lints .inc files for non-charmap characters.
`make check_encounters` — Node.js validator for `wild_encounters.json`.
**CI note**: `python3` unavailable. Use Node.js for validation scripts.

---

## Regional Variant Species Pipeline (C195-197)

**Existing scripts**:
- `scripts/add_corsola_hoenn.js` + `scripts/add_corsola_hoenn_part2.cjs` — Corsola Hoenn pipeline (C195, worked)
- `scripts/add_growlithe_arcanine.cjs — Growlithe/Arcanine pipeline (C198, worked). Handles 26 files in one pass. Manual patches still needed for 8 graphics table files + graphics.h externs.

**Pre-compiled sprites on disk**: `graphics/pokemon/growlithe_hoenn/` and `graphics/pokemon/arcanine_hoenn/` — both have .4bpp.lz and .gbapal.lz files ready. These survive reverts since they're untracked.

**HOENN_DEX required**: Must add entry to BOTH national and Hoenn dex sections of `pokedex.h`.

**front_pic_anims.h structure**: AnimCmd arrays → `sAnims_*` table → `sMonFrontAnimsPtrTable[]`. New species needs all three.

**Cry reuse**: Regional forms can reuse base species cry by referencing the same `Cry_*` label in `cry_tables.inc`.

---

## EXP Award System & Challenge Mode Level Caps (C182)

**EXP function**: `Cmd_getexp()` in `src/battle_script_commands.c`. State machine with 6 cases.
**Level cap**: `GetChallengeLevelCap()` returns cap per badge count (18/20/24/30/34/38/42/48/55). Soft cap in case 2: if mon level >= cap, EXP /= 10.
**`IsChallengeModeActive()`**: Defined as a `#define` macro in `include/constants/flags.h`.
