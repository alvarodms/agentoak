# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Trainer System

**Three-file system**: `opponents.h` (IDs), `trainers.h` (metadata + macro), `trainer_parties.h` (party struct). All three must match. Macro/struct mismatch = crash. Validation: `scripts/check_trainers.sh`.

**Capacity**: TRAINERS_COUNT = 885 (at cap). 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853. Note: #854 is NOT reclaimable (in rematch table). Rematch table: 5 tiers, all filled.

---

## Dialogue Editing System (Cycles 24-26)

**Text format**: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars/line. Smart quotes valid (charmap B1/B2). ASCII `"` (0x22) NOT in charmap. Em-dashes (—, –) NOT in charmap — use `--` for dashes. Ellipsis `…` = B0 in charmap.

**Safety**: `MSGBOX_NPC` labels safe to rewrite. `MSGBOX_DEFAULT` may have story logic.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist. VAR_TEMP_* reset on map transition — coord_events using them as guards fire once per visit.

---

## Wild Encounter JSON Rules

**File**: `src/data/wild_encounters.json`. Land: 12 slots (20/20/10/10/10/10/5/5/4/4/1/1%). Water: 5. Fishing: 10.

**Conditional tables**: `GetCurrentMapWildMonHeaderId()` in `src/wild_encounter.c` (line 305). Alternate entry MUST follow base entry in JSON.

---

## Physical/Special Split & Move System (Cycle 43-44, 75, 128)

**MOVES_COUNT** = 378 (IDs 0-377). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy moves: 355-357. Gen 4/5: 358-377.

**Custom species in codebase**: Riolu (412), Lucario (413), Weavile (414), Gible (415), Gabite (416), Garchomp (417), Corsola_Hoenn (418). NUM_SPECIES = 419.

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
**Data**: `src/data/script_menu.h` — `sMultichoiceLists[]` array indexed by MULTI_* constants. Text strings + `MenuAction` arrays defined above it. `MULTICHOICE()` macro wraps list + count.
**Script usage**: `multichoice x, y, MULTI_ID, ignoreBPress` → check `VAR_RESULT` (0 = first option, 1 = second, ..., 127 = B pressed).
**Last used ID**: 114 (`MULTI_DIFFICULTY_SELECT`). Next available: 115.

---

## Legendary Battle Pattern

`setwildbattle` → `setflag` → `special BattleSetup_StartLegendaryBattle` → `waitstate` → check `B_OUTCOME_CAUGHT`. Used by all 4 shipped legendaries (beasts, Ho-Oh, Groudon/Kyogre, Rayquaza).

## Legendary Encounter Macros (C185)

**File**: `asm/macros/legend_macros.inc`. Included via `asm/macros.inc` (after `event_macros.inc`).

**7 macros** -- composable building blocks:
- `LegendMacro_ScreenShake v_pan, h_pan, shakes, shake_delay` -- camera shake (wraps 4 setvar + ShakeCamera)
- `LegendMacro_PlayCry species` -- cry with encounter timing (waitse + playmoncry + delay + waitmoncry)
- `LegendMacro_SetWeather weather` -- setweather + doweather
- `LegendMacro_ClearWeather` -- WEATHER_NONE + doweather
- `LegendMacro_FadeOut` -- fadescreenswapbuffers FADE_TO_BLACK
- `LegendMacro_FadeIn` -- fadescreenswapbuffers FADE_FROM_BLACK
- `LegendMacro_StartBattle species, level, item, won_label, caught_label` -- full battle setup + outcome branching

**Design**: Building blocks, not complete scripts. Compose in map script files. No .L local labels needed (all branching uses caller-provided labels).

---

## Scripted Event Macro Library (C179)

**File**: `asm/macros/event_macros.inc`. Included via `asm/macros.inc` (after `battle_tent.inc`).

**3 macros** — all emit complete script bytecodes:
- `EventMacro_GlimpseEvent prereq_flag, glimpse_flag, text1, text2` — One-shot walk-over event (exclamation + 2 messages). Ends with `release`+`end`.
- `EventMacro_BadgeGateShow hide_flag, weather_id` — Reveal NPC + set weather. Ends with `return` (called via `call_if_set`).
- `EventMacro_ConditionalDialogue flag, text_before, text_after` — Two-state NPC dialogue. Ends with `release`+`end`.

**Label uniqueness**: Uses `.L` local labels + `\@` expansion count for unique labels per invocation.

**Include order**: `macros.inc` (defines EventMacro_*) → `event.inc` (defines lock, msgbox, etc.) → script files (invoke macros). Works because GNU as macros are expanded at invocation, not definition.

---

## Weather System (C149, C159-160)

**Weather commands**: `setweather` + `doweather`. `WEATHER_ROUTE119_CYCLE` (constant 20).
**Weather Omens**: Badge-gated permanent weather on 4 routes (R111/119/120/125). Flags 0x282-0x285.
**Permanent weather pattern**: Flag-gated `setweather` in `OnTransition` (without `doweather`) sets initial weather before map renders. Used by Route 126 fog (C189): `FLAG_GATHERING_FOG_SET` → `WEATHER_FOG_HORIZONTAL`. Reusable for any route that should permanently change weather after an event.

---

## Build Validation Targets (C141, C170)

`make check_scripts` — Lints .inc files for non-charmap characters. **Build prerequisite** since C170.

`make check_encounters` — Node.js validator for `wild_encounters.json`. Checks species existence (vs `constants/species.h`), slot counts (12/5/10), level ranges. Script: `scripts/check_encounters.sh`.

**CI note**: `python3` unavailable in build env. Use Node.js for validation scripts.

---

## Overworld Pokemon Sprites (C152-C153)

**OBJ_EVENT_GFX_PIKACHU** = 209. Only ~40 Pokémon have OW sprites in vanilla. Use `playmoncry` + narration for species without sprites.

---

## Regional Variant Species Pipeline (C195)

**Node.js scripts**: `scripts/add_corsola_hoenn.js` (Phase 1: constants, species_info, pokedex, cry tables, graphics declarations, pokemon.c tables, icon, animation, evolution, egg_moves) + `scripts/add_corsola_hoenn_part2.cjs` (Phase 2: pokedex_text, pokedex_entries, pokedex_orders, learnsets, TM learnsets, species_names, remaining graphics tables).

**HOENN_DEX required**: When adding new species, must add entry to BOTH national dex AND Hoenn dex sections of `pokedex.h`, plus update `HOENN_DEX_COUNT`. Missing HOENN_DEX causes `sSpeciesToHoennPokedexNum` initializer error.

**front_pic_anims.h structure**: AnimCmd arrays → `sAnims_*` table → `sMonFrontAnimsPtrTable[]`. New species needs all three. Syntax error if AnimCmd placed after table but before ptr table.

**Cry reuse**: Regional forms can reuse base species cry by referencing the same `Cry_*` label in `cry_tables.inc`. No new `.bin` file needed.

---

## EXP Award System & Challenge Mode Level Caps (C182)

**EXP function**: `Cmd_getexp()` in `src/battle_script_commands.c`. State machine with 6 cases.
**Level cap**: `GetChallengeLevelCap()` returns cap per badge count (18/20/24/30/34/38/42/48/55). Soft cap in case 2: if mon level >= cap, EXP /= 10.
**`IsChallengeModeActive()`**: Defined as a `#define` macro in `include/constants/flags.h`. Wraps `FlagGet(FLAG_DIFFICULTY_CHALLENGE)`.
