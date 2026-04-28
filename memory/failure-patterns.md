# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (C110-288, 27 occurrences) — RECURRING

**Symptom**: 64-132 actions before first edit. C278: RECOVERED at 23%. C287: first edit at action 17/120 (14%). **C288: first edit at action 8/80 (10%) — RESOLVED for this cycle.**
**Resolution**: (1) ALL paths MUST start with `/__w/agentoak/agentoak/pokeemerald/` — NEVER use relative paths or `cd`. (2) **NEVER use Agent subagent**. (3) Start edits by action 15 for single-objective, action 25 for multi-objective. (4) **NEVER `cd` into pokeemerald/ — always use absolute paths.** (5) For species work: run generator with absolute path FIRST. **(6) When hitting a known problem (generator idempotency, build error), CONSULT failure-patterns.md FIRST — do NOT re-investigate from scratch.**

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## "File Has Not Been Read Yet" on Edit Calls (C256, C272, C286, C290) — 16 wasted actions total

**Symptom**: Edit tool rejected calls with "File has not been read yet." C256: 8 wasted actions. C272: 5 more. C286: 1 more (flags.h at action 33). C290: 2 more (move_descriptions.h + contest_moves.h).
**Cause**: Attempted to Edit files after grepping or cat-ing them. grep/cat/Bash reads do NOT count. The Edit tool requires an explicit Read tool call for each file before editing.
**Resolution**: Before editing ANY file, call Read on it first. Batch: read all target files in parallel, then edit all.

## Incomplete Species Registration — Changed Three (C261-C289) — RESOLVED C292

**Symptom**: Partial registration across multiple cycles due to generator idempotency and manual errors.
**Resolution**: C292 cleaned up all partial constants/names, re-ran generator for all 9 species from updated configs, verified 27/27 each, build-clean. **Key lesson**: (1) Delete partial species.h constants BEFORE re-running generator. (2) Update config JSONs with correct data BEFORE generator runs — avoids needing Phase 3 stat edits. (3) verify_species.sh after each run + final `make` is the gold standard.

## Script Path Confusion (C288) — 6 wasted actions

**Symptom**: Actions 57-62 searched for verify_species.sh in wrong locations (project root `scripts/`, then Glob returned ambiguous result).
**Cause**: All pokeemerald helper scripts are at `pokeemerald/scripts/`, NOT the project root `scripts/` dir.
**Resolution**: Always use `/__w/agentoak/agentoak/pokeemerald/scripts/` for verify_species.sh, generate_species.cjs, generate_trainer.cjs, and generate_npc_dialogue.cjs. The project root `scripts/` is for agent runner scripts only.

## Invalid Escape Sequences in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125, 197) — CRITICAL

**Symptom**: `error: unknown escape '\e'` (or `\t`, `\r`, etc.) OR `error: unknown character U+XXXX`.
**Cause**: pokeemerald `.string` only supports `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Any other `\X` is fatal. Non-charmap Unicode is also fatal.
**Resolution**: Before `make`, run: `grep -nP '\\\\[^nlp$"\\]' <modified .inc files>` to catch invalid escapes. Em-dashes (-, -) NOT in charmap — use `--`.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Resolution**: C266 generate_trainer.cjs now auto-detects the correct macro/struct pairing from party member fields.

## Premature Entries for Unregistered Species (C259->C260 fix)

**Symptom**: Build fails with `undeclared` errors for SPECIES_X constants.
**Resolution**: NEVER add entries for a species until `generate_species.cjs` has created its SPECIES_ constant.

## Pokedex categoryName Max Length (C261)

**Symptom**: `warning: excess elements in array initializer` — treated as error.
**Resolution**: Keep all Pokedex category names to **11 characters max**.

## Species Generator Idempotency Skips species_info (C265->C270->C277) — RECURRING

**Symptom**: Species have constants but ZERO species_info.h entries. Generator says "already exists — nothing to do."
**Cause**: Generator exits if constant exists in species.h, even if other files are incomplete.
**Resolution**: (1) After running the generator, ALWAYS verify `species_info.h` with `grep -c "SPECIES_XXX" species_info.h`. (2) If hit: delete the species.h constant, re-run generator. (3) **C277 lesson**: Do NOT spend 46 actions investigating — just apply this fix immediately.

## Wrong Path Prefix (C286) — 7 wasted actions

**Symptom**: Actions 1-7 all used `/w/agentoak/agentoak/` (missing leading underscore) instead of `/__w/agentoak/agentoak/`. All file reads returned "File does not exist."
**Resolution**: Always use `/__w/agentoak/agentoak/pokeemerald/` — double-underscore prefix.

## check_all_quick Requires pkg-config (C290) — CI limitation

**Symptom**: `make check_all_quick` fails with `pkg-config: No such file or directory` because `check_scripts` dependency invokes shell tools requiring pkg-config.
**Resolution**: This is a CI environment issue, not a code issue. The Makefile target is correct. For CI-only validation, use `make check_species check_trainers` directly (skip check_scripts).

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 891, AT CAPACITY. Must reuse unused IDs for new trainers.
- **egg_moves.h**: Regional forms still need an entry (even if empty).
- **cry_tables.inc**: Forward and reverse tables MUST have identical entry counts. New species using base-species cries need ONLY a cry_ids.h entry.
- **TM/HM learnset fields**: Not all move constants are TM fields.
- **check_species_registration.sh**: cry_tables.inc check is a known false positive for species reusing base cries.
- **species_names.h**: Covered by `generate_species.cjs` since C281 (27/27 files). No manual steps needed.
