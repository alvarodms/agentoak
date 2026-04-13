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

**Custom species in codebase**: Riolu (412), Lucario (413), Weavile (414), Gible (415), Gabite (416), Garchomp (417), Corsola_Hoenn (418), Growlithe_Hoenn (419), Arcanine_Hoenn (420), Vulpix_Hoenn (421), Ninetales_Hoenn (422), Froslass (423), Mamoswine (424). NUM_SPECIES = 426 (EGG=425).

---

## Roaming Pokemon System (Cycle 108-109)

Single roamer slot (`struct Roamer`, 28 bytes). Beast system: `roamer.c` `InitNextBeast()` sequentially releases Raikou→Entei→Suicune using 6 flags. Full ref: `memory/pokemon-knowledge/roamer-implementation-patterns.md`.

---

## Flag System Layout (Cycle 117-118)

**Layout**: Story (0x00-0x2FF) → Trainer (0x500-0x873) → System (0x874+) → Daily (0x972+)

**Custom flags**: 0x264-0x29A used (v6.0 through v1.9). 0x286 = `FLAG_DIFFICULTY_CHALLENGE` (C181). 0x287-0x289 = migration events (C188-189). 0x28A-0x297 = v1.8 quest flags (C192): Elder 28A-28C, Hartley 28D-291, Mossdeep 292-294, Fog 295-297. 0x298-0x29A = Deoxys quest (C210): STARTED/INVESTIGATED/COMPLETE. Next available: 0x29B.

**Beast flags**: System flags 0x881-0x886.

---

## Multichoice System (Cycle 181)

**Constants**: `include/constants/script_menu.h` — `MULTI_*` IDs (0-114). `MULTI_B_PRESSED` = 127.
**Data**: `src/data/script_menu.h` — `sMultichoiceLists[]` array indexed by MULTI_* constants.
**Last used ID**: 114 (`MULTI_DIFFICULTY_SELECT`). Next available: 115.

---

## Legendary Battle Pattern

`setwildbattle` → `setflag` → `special BattleSetup_StartLegendaryBattle` → `waitstate` → check `B_OUTCOME_CAUGHT`. Used by all 5 shipped legendaries (including Deoxys C210).

## Challenge Mode Level Scaling (C210)

**Header**: `include/challenge_mode_scaling.h`. Data table mapping `TRAINER_CLASS_*` constants to `s8 levelBoost` values. Hooked into `CreateNPCTrainerParty()` in `src/battle_main.c` — computed once before the party loop, applied to each CreateMon call. Classes: Leader +3, E4 +3, Champion +5, Rival +2, Aqua/Magma Leaders +2, Aqua/Magma Admins +1. Extend by adding rows to `sChallengeModeScaling[]`.

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

## Build Validation Targets (C141, C170, C206)

`make check_scripts` — Lints .inc files for non-charmap characters.
`make check_encounters` — Node.js validator for `wild_encounters.json`.
`make check_e4_rematches` — Bash validator for E4 rematch parties (duplicates, level progression, regional form presence).
**CI note**: `python3` unavailable. Use Node.js for validation scripts.

---

## Regional Variant Species Pipeline (C195-202)

**Generic pipeline script**: `scripts/add_regional_form.cjs` — config-driven, inserts into 27 files from a single JSON spec. Usage:
```
node scripts/add_regional_form.cjs configs/<species>.json          # live
node scripts/add_regional_form.cjs configs/<species>.json --dry-run # preview
```

**Config template**: `configs/vulpix_hoenn.json` — copy and modify for new species. Directory: `pokeemerald/configs/`.

**What the script handles**: species.h, pokedex.h (both enums + count), species_info.h, level_up_learnsets.h, learnset_pointers.h, egg_moves.h, tmhm_learnsets.h, evolution.h, pokedex_text.h, pokedex_entries.h, pokedex_orders.h (3 arrays), pokemon.c (4 tables), graphics/pokemon.h (6 INCBINs), anim_mon_front_pics.c, graphics.h (7 externs), 8 graphics table files, front_pic_anims.h (3 insertions), pokemon_icon.c (2 tables), cry_tables.inc (2 sections), enemy_mon_elevation.h (if needed).

**What it does NOT handle**: Sprite files (use `fetch_pokemon_sprites` MCP tool). Encounter tables. Trainer parties.

**Key anchors**: Most tables use `[SPECIES_EGG]` or `};`. Graphics tables use macros like `SPECIES_SPRITE(EGG`, `SPECIES_PAL(EGG`. Cry table forward uses `.align 2`, reverse appends to EOF.

**front_pic_anims.h structure**: AnimCmd arrays → SINGLE_ANIMATION macro → `gMonFrontAnimsPtrTable[]`. Script handles all three.

**Cry reuse**: Regional forms reuse base species cry via `Cry_*` label in `cry_tables.inc`.

---

## Cross-Gen Evolution Pipeline (C212-213)

**Ad-hoc scripts per batch**: `scripts/add_froslass_mamoswine.cjs` (C213), similar in C212. Covers ~22 files (species_info, learnsets, TM/HM, egg moves, pokedex text/entries/orders, graphics tables, icons, cries). 

**Files NOT covered by scripts** (need manual edits): `pokemon.c` (3 mapping arrays: species→hoenn, species→national, hoenn→national), `anim_mon_front_pics.c`, `enemy_mon_elevation.h` (floating species only), `evolution.h` (pre-evo must gain new evo path).

**egg_moves.h pitfall**: `EGG_MOVES_TERMINATOR` MUST separate species blocks. Missing it causes silent data corruption or build errors.

---

## EXP Award System & Challenge Mode Level Caps (C182)

**EXP function**: `Cmd_getexp()` in `src/battle_script_commands.c`. State machine with 6 cases.
**Level cap**: `GetChallengeLevelCap()` returns cap per badge count (18/20/24/30/34/38/42/48/55). Soft cap in case 2: if mon level >= cap, EXP /= 10. C207: when cap triggers, uses `STRINGID_PKMNGAINEDEXPCAPPED` (381) for a two-page message including "EXP reduced by the level cap."
**`IsChallengeModeActive()`**: Defined as a `#define` macro in `include/constants/flags.h`.
**BATTLESTRINGS_COUNT**: 382 (last ID: STRINGID_PKMNGAINEDEXPCAPPED = 381).
