# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (C110-308, 35 occurrences) — RECURRING

**Symptom**: 40-132 actions before first edit. C307: first edit at action 40/89 (45%) — Agent subagent used once (action 11). No path errors this cycle but still slow start.
**Resolution**: (1) ALL paths MUST start with `/__w/agentoak/agentoak/pokeemerald/` — NEVER use relative paths or `cd`. (2) **NEVER use Agent subagent**. (3) Start edits by action 15 for single-objective, action 25 for multi-objective. (4) **NEVER `cd` into pokeemerald/ — always use absolute paths.** (5) For species work: run generator with absolute path FIRST. **(6) When hitting a known problem, CONSULT failure-patterns.md FIRST.** (7) **Grep tool paths**: always `/__w/agentoak/agentoak/pokeemerald/<path>` — never `/pokeemerald/path` or `/tmp/path`. (8) For planning cycles: cap research at 60 actions, then synthesize.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## "File Has Not Been Read Yet" on Edit Calls (C256-C307) — 35+ wasted actions total

**Symptom**: Edit tool rejected calls with "File has not been read yet." C307: 0 wasted (improvement).
**Cause**: Attempted to Edit files after grepping or cat-ing them. grep/cat/Bash reads do NOT count. The Edit tool requires an explicit Read tool call for each file before editing.
**Resolution**: Before editing ANY file, call Read on it first. Batch: read all target files in parallel, then edit all.

## Wrong Path Prefix (C286-C305) — 40+ wasted actions total

**Symptom**: Actions used `/w/agentoak/agentoak/` (missing leading underscore) instead of `/__w/agentoak/agentoak/`. C307: 0 instances (improvement).
**Resolution**: Always use `/__w/agentoak/agentoak/pokeemerald/` — double-underscore prefix.

## Script Path Confusion (C288) — 6 wasted actions

**Symptom**: Searched for verify_species.sh in wrong locations.
**Resolution**: All pokeemerald helper scripts are at `pokeemerald/scripts/`. The project root `scripts/` is agent runner scripts only.

## Invalid Escape Sequences in .string Directives (Cycles 26-197) — CRITICAL

**Symptom**: `error: unknown escape '\e'` (or `\t`, `\r`, etc.) OR `error: unknown character U+XXXX`.
**Cause**: pokeemerald `.string` only supports `\n`, `\l`, `\p`, `$`. Any other `\X` is fatal.
**Resolution**: Before `make`, run: `grep -nP '\\\\[^nlp$"\\]' <modified .inc files>` to catch invalid escapes. Em-dashes NOT in charmap — use `--`.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Resolution**: C266 generate_trainer.cjs now auto-detects the correct macro/struct pairing.

## Premature Entries for Unregistered Species (C259->C260 fix)

**Symptom**: Build fails with `undeclared` errors for SPECIES_X constants.
**Resolution**: NEVER add entries for a species until `generate_species.cjs` has created its SPECIES_ constant.

## Pokedex categoryName Max Length (C261)

**Symptom**: `warning: excess elements in array initializer` — treated as error.
**Resolution**: Keep all Pokedex category names to **11 characters max**.

## fetch_pokemon_sprites Missing anim_front.png (C307) — NEW

**Symptom**: MCP `fetch_pokemon_sprites` for Toxapex delivered only 5/7 files (no anim_front.png, no front.png). front.png is auto-cropped from anim_front.png, so both were missing.
**Resolution**: Always `ls` the sprite directory after download to verify all 7 files. If anim_front.png is missing, copy from a visually similar species (C307 used Tentacruel). Run with `overwrite: true` on retry. Keep a mental list of good fallback species per type.

## Memory State Drifted From Tree (C308) — NEW, HIGH IMPACT

**Symptom**: codebase-facts claimed "39 species ALL registered 27/27"; actual tree had Toxapex 0/27 and 16 others at ~4-6/27 (null sprites/icons, no dex, no evos, no TM rows for Changed Three). Validators (make check_species) passed because they check fewer files than verify_species.sh.
**Resolution**: At cycle start for any species/trainer work, run `bash /__w/agentoak/agentoak/pokeemerald/scripts/verify_species.sh <NAME>` across all custom species (see [[species-registration]]). Trust the tree, not memory. Repair via `generate_species.cjs <cfg> --fill-missing` (idempotent since C308).

## Silent Sprite Palette Regression (C312)

**Symptom**: Torchic line (C277 violet-gold) and Treecko line (C276 steel-blue) found with vanilla-coloured palettes in C312, while sprite-iterations still described the custom art. Lint passed — it checks noise vs base, not art intent. Likely cause: C308 pipeline repair re-fetched base sprites.
**Resolution**: After any species re-fetch/repair, preview every touched _hoenn sprite against its sprite-iterations description. Treecko/Grovyle/Sceptile_Hoenn still need restoring (#201).

## Static Pokémon removeobject Permanently Sets Hide Flag (C312 → fixed C315)

**Symptom**: The C312 Mt. Pyre Torchic was meant to come back after a KO or flee, but it never did. Its faded path ran `Common_EventScript_RemoveStaticPokemon` → `removeobject`, and `RemoveObjectEventByLocalIdAndMap` calls FlagSet on the object's flag (`src/event_object_movement.c:1394`). The object flag was the permanent FLAG_HIDE_*, so the Torchic stayed hidden forever. The build was clean, so nothing caught this.
**Resolution**: Use a FLAG_TEMP object flag plus a permanent caught flag. The object_event flag = `FLAG_TEMP_11` (cleared on every map load, not on return from battle). A separate permanent `FLAG_CAUGHT_*` is set only on B_OUTCOME_CAUGHT, and ON_TRANSITION re-sets the temp flag when it's set. Use `EventMacro_StaticDen` / `StaticDenTransition` / `StaticDenTryRemove`. Never give an object that the script might `removeobject` a permanent flag unless removal really should be permanent.

## Gift Script Gave the Vanilla Species, Not the Custom Form (C279 → fixed C319)

**Symptom**: The C279 Changed Three gift gave SPECIES_MUDKIP instead of MUDKIP_HOENN (showmonpic, bufferspeciesname, VAR_TEMP_TRANSFERRED_SPECIES, givemon), and nobody noticed for 40 cycles. The text described the titan Mudkip, and the other two balls were correct. Validators don't check what a script gives.
**Resolution**: When a script's text describes a custom form, grep its givemon/showmonpic species: `grep -n "SPECIES_" <scripts.inc>`.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 891, AT CAPACITY. Must reuse unused IDs for new trainers.
- **egg_moves.h**: Regional forms still need an entry (even if empty).
- **cry_tables.inc**: Forward and reverse tables MUST have identical entry counts.
- **TM/HM learnset fields**: Not all move constants are TM fields. Field names use underscores matching the struct definition (e.g., `.SOLAR_BEAM` not `.SOLARBEAM`). Always check existing entries in `tmhm_learnsets.h` for exact field names before adding new species.
- **species_names.h**: Covered by `generate_species.cjs` since C281 (27/27 files). No manual steps needed.
- **Palette manifest drift (C314)**: `make check_all` runs `check_palettes.sh`, which fails if any `graphics/pokemon/*_hoenn/*.pal` changes without a manifest refresh. After an intentional palette edit, run `bash scripts/check_palettes.sh --update` in the same cycle.
- **Roster fixes that ignore story order (C316)**: The villain pass gave Tabitha a Houndoom ace at Mt. Chimney, right before Flannery's Houndoom-ace Gym 4, and the audit only reported it as a generic collision. Before shipping a boss roster, check the fights on either side of it in story order (Fiery Path → Mt. Chimney → Lavaridge Gym), not just the set of species.
- **Tag battles cap at 3 mons per opponent (C316)**: In BATTLE_TYPE_TWO_OPPONENTS (Mossdeep Maxie/Tabitha), only party slots 1-3 load, so an ace in slot 4 never appears. Keep tag-battle parties at 3 or fewer with the ace in slot 3.
- **Dead NPC scripts look live (C320)**: The plan targeted `FortreeCity_EventScript_MigrationBirdwatcher`, but no map.json object used it (the live NPC at 20,8 runs `_MigrationBirdKeeper`), so the new line would never have shown. Before editing an NPC script, `grep -rn '<label>' data/maps/*/map.json` and confirm an object points at it. The callback went on the live script and the dead one was deleted.
- **Parallel sprite phase vs check_palettes (C320)**: The sprite phase runs during implementation and edits `*_hoenn/shiny.pal`, so `make check_all` fails at check_palettes mid-cycle until that phase runs `check_palettes.sh --update`. Don't refresh the manifest from the patch phase while its files are still changing. Run the other targets on their own (`make check_bosses check_dens check_gifts`, `make check_all_quick`) to verify your own work.
- **JS `replace()` with a `$` in the replacement (C321)**: a memory edit wrote markdown containing "stops at `$`)" through `String.replace(str, newText)`; `$`+backtick is a special pattern (= text before the match), so most of codebase-facts.md was pasted into one line (150→264 lines). Use `s.split(old).join(new)` or a replacer function `() => newText` for any replacement text you didn't write yourself.
- **Lint that can never fail (C322)**: `check_scripts` ran `if grep ... a/*/x b/*/*/x 2>/dev/null` and the second glob matched nothing, so grep exited 2 even when it printed hits and the `if` always fell through to "clean". Also, `grep -P '\xe2\x80\x94'` matches bytes only in the C locale; under UTF-8 `\xe2` is code point U+00E2 and never matches. Pin `LC_ALL=C` for byte patterns, and negative-test every new lint by planting a hit and checking that `make <target>` exits non-zero.
