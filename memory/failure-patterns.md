# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (C110-305, 33 occurrences) — RECURRING

**Symptom**: 64-132 actions before first edit. C304: first edit at action 37/93 (40%). **C305: first edit at action 43/123 (35%)** — Agent subagent used 3 times (actions 4, 7, 14), wrong path prefix 3 times (actions 15, 16, 18). Despite 33 prior occurrences of this failure pattern, still not fixed.
**Resolution**: (1) ALL paths MUST start with `/__w/agentoak/agentoak/pokeemerald/` — NEVER use relative paths or `cd`. (2) **NEVER use Agent subagent**. (3) Start edits by action 15 for single-objective, action 25 for multi-objective. (4) **NEVER `cd` into pokeemerald/ — always use absolute paths.** (5) For species work: run generator with absolute path FIRST. **(6) When hitting a known problem, CONSULT failure-patterns.md FIRST.** (7) **Grep tool paths**: always `/__w/agentoak/agentoak/pokeemerald/<path>` — never `/pokeemerald/path` or `/tmp/path`. (8) For planning cycles: cap research at 60 actions, then synthesize.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## "File Has Not Been Read Yet" on Edit Calls (C256-C305) — 35+ wasted actions total

**Symptom**: Edit tool rejected calls with "File has not been read yet." C304: 1 wasted. **C305: 1 wasted** (action 68 — species_names.h after grep).
**Cause**: Attempted to Edit files after grepping or cat-ing them. grep/cat/Bash reads do NOT count. The Edit tool requires an explicit Read tool call for each file before editing.
**Resolution**: Before editing ANY file, call Read on it first. Batch: read all target files in parallel, then edit all.

## Incomplete Species Registration — Ambipom (C304→C305) — RESOLVED C305

**Symptom**: C304 generator reported 27/27 but Ambipom was missing from species.h, pokedex.h, species_names.h. Verify script showed 24/27. C305 re-ran generator with --fill-missing and added 3 manual entries.
**Root cause**: Generator may have hit a file-write conflict or the entries were overwritten by Carbink's subsequent addition in the same uncommitted working tree.
**Resolution**: Always run `verify_species.sh` AFTER generator AND after any subsequent species additions in the same cycle. C305 fixed all gaps.

## Wrong Path Prefix (C286-C305) — 40+ wasted actions total

**Symptom**: Actions used `/w/agentoak/agentoak/` (missing leading underscore) instead of `/__w/agentoak/agentoak/`. **C305: 3 instances** (actions 15, 16, 18).
**Resolution**: Always use `/__w/agentoak/agentoak/pokeemerald/` — double-underscore prefix. Recurred in C286, C293, C294, C298, C304, C305.

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
