# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150, 195) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit.
**Resolution**: Use `grep -n` to find all target offsets in ONE pass. Never re-read data you already have. Use node.js scripts for bulk edits. For species pipeline: use existing scripts as template.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## Claiming Completion Without Git Changes (Cycles 107, 143) — RECURRING

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111)

**Symptom**: Agent completes only part of a multi-component objective.
**Resolution**: Budget actions — reserve 30 for script writing and build. Start edits by action 15.

## Non-ASCII Characters in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125) — CRITICAL

**Symptom**: `error: unknown character U+XXXX`
**Resolution**: Use `cat >> file << 'HEREDOC'` for files with smart quotes. Run `grep -P '[\x80-\xFF]' <file>` before `make`.

## Python3 Unavailable in Build Environment (Cycle 170)

**Symptom**: `python3: command not found` when running validation scripts.
**Resolution**: Use Node.js (always available) for validation scripts. Do NOT assume Python is installed.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Cause**: Party macro (e.g., `ITEM_DEFAULT_MOVES`) doesn't match the struct type of the party array in trainer_parties.h (e.g., `TrainerMonNoItemDefaultMoves`). The four macros map 1:1 to four struct types: `NO_ITEM_DEFAULT_MOVES`↔`TrainerMonNoItemDefaultMoves`, `NO_ITEM_CUSTOM_MOVES`↔`TrainerMonNoItemCustomMoves`, `ITEM_DEFAULT_MOVES`↔`TrainerMonItemDefaultMoves`, `ITEM_CUSTOM_MOVES`↔`TrainerMonItemCustomMoves`.
**Resolution**: Change the macro in trainers.h to match the struct type declared in trainer_parties.h. C195 created `scripts/fix_trainer_macros.cjs` that auto-detects and fixes all mismatches.

## Missing HOENN_DEX Entry When Adding Species (Cycle 195)

**Symptom**: `initializer element for 'sSpeciesToHoennPokedexNum[N]' is not constant` in pokemon.c.
**Cause**: Added NATIONAL_DEX entry and SPECIES_TO_HOENN/NATIONAL macros but forgot HOENN_DEX_* enum entry and HOENN_DEX_COUNT update in pokedex.h.
**Resolution**: When adding any species, ALWAYS update both national AND Hoenn dex sections of pokedex.h. The HOENN_DEX enum entry must exist for the SPECIES_TO_HOENN macro to resolve.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
