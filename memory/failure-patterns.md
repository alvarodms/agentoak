# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (C110-294, 29 occurrences) — RECURRING

**Symptom**: 64-132 actions before first edit. C288: first edit at action 8/80 (10%). C293: 58%. **C294: first edit at action 76/120 (63%)** — 16 wrong-path Greps (actions 29-44) + 1 Agent subagent call.
**Resolution**: (1) ALL paths MUST start with `/__w/agentoak/agentoak/pokeemerald/` — NEVER use relative paths or `cd`. (2) **NEVER use Agent subagent**. (3) Start edits by action 15 for single-objective, action 25 for multi-objective. (4) **NEVER `cd` into pokeemerald/ — always use absolute paths.** (5) For species work: run generator with absolute path FIRST. **(6) When hitting a known problem, CONSULT failure-patterns.md FIRST.** (7) **Grep tool paths**: always `/__w/agentoak/agentoak/pokeemerald/<path>` — never `/pokeemerald/path` or `/tmp/path`.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## "File Has Not Been Read Yet" on Edit Calls (C256-C293) — 20+ wasted actions total

**Symptom**: Edit tool rejected calls with "File has not been read yet." C256: 8 wasted. C272: 5. C286: 1. C290: 2. C293: 4.
**Cause**: Attempted to Edit files after grepping or cat-ing them. grep/cat/Bash reads do NOT count. The Edit tool requires an explicit Read tool call for each file before editing.
**Resolution**: Before editing ANY file, call Read on it first. Batch: read all target files in parallel, then edit all.

## Incomplete Species Registration — Changed Three (C261-C294) — RESOLVED C294

**Symptom**: Partial registration across multiple cycles. C292 had constants+names+sprites only. **C293 claimed 27/27 via --fill-missing but data files were actually empty.** Build succeeded because C arrays zero-initialize — species appeared blank in-game but compiled.
**Resolution**: C294 re-ran `generate_species.cjs --fill-missing` for all 9 Changed Three. All 25/27 files per species now populated. **Key lesson**: Always GREP the target data file after running --fill-missing to confirm entries were actually written. Build success does NOT mean data is present.

## Wrong Path Prefix (C286, C294) — 23 wasted actions total

**Symptom**: Actions used `/w/agentoak/agentoak/` (missing leading underscore) instead of `/__w/agentoak/agentoak/`. All file reads returned "File/path does not exist."
**Resolution**: Always use `/__w/agentoak/agentoak/pokeemerald/` — double-underscore prefix. **This has recurred 3 cycles in a row (C286, C293, C294).** Treat as a hardcoded prefix — never type the path from memory.

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

## Species Generator Idempotency Skips species_info (C265-C277) — RESOLVED C293

**Symptom**: Species have constants but ZERO species_info.h entries. Generator says "already exists — nothing to do."
**Resolution**: C293 added `--fill-missing` mode. No longer need to delete species.h constants before re-running.

## check_all_quick Requires pkg-config (C290) — CI limitation

**Symptom**: `make check_all_quick` fails with `pkg-config: No such file or directory`.
**Resolution**: For CI-only validation, use `make check_species check_trainers` directly (skip check_scripts).

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 891, AT CAPACITY. Must reuse unused IDs for new trainers.
- **egg_moves.h**: Regional forms still need an entry (even if empty).
- **cry_tables.inc**: Forward and reverse tables MUST have identical entry counts.
- **TM/HM learnset fields**: Not all move constants are TM fields.
- **species_names.h**: Covered by `generate_species.cjs` since C281 (27/27 files). No manual steps needed.
