# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit.
**Resolution**: Use `grep -n` to find all target offsets in ONE pass. Never re-read data you already have. Use node.js scripts for bulk edits.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## Claiming Completion Without Git Changes (Cycles 107, 143) — RECURRING

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Bash-Script File Modifications Not Tracked by Validation (Cycles 168-169)

**Symptom**: Validation reports "no pokeemerald/ files were modified" even though git diff shows changes.
**Resolution**: After Bash scripts that write to pokeemerald/, run `git diff --stat pokeemerald/` to confirm. Git diff is ground truth.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111)

**Symptom**: Agent completes only part of a multi-component objective.
**Resolution**: Budget actions — reserve 30 for script writing and build. Start edits by action 15.

## Non-ASCII Characters in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125) — CRITICAL

**Symptom**: `error: unknown character U+XXXX`
**Resolution**: Use `cat >> file << 'HEREDOC'` for files with smart quotes. Run `grep -P '[\x80-\xFF]' <file>` before `make`.

## Python3 Unavailable in Build Environment (Cycle 170)

**Symptom**: `python3: command not found` when running validation scripts.
**Resolution**: Use Node.js (always available) for validation scripts. Do NOT assume Python is installed.

## Trainer Party Macro/Struct Type Mismatch (Cycle 179)

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Cause**: Party macro (e.g., `ITEM_CUSTOM_MOVES`) doesn't match the struct type of the party array in trainer_parties.h (e.g., `TrainerMonNoItemDefaultMoves`). The four macros map 1:1 to four struct types: `NO_ITEM_DEFAULT_MOVES`↔`TrainerMonNoItemDefaultMoves`, `NO_ITEM_CUSTOM_MOVES`↔`TrainerMonNoItemCustomMoves`, `ITEM_DEFAULT_MOVES`↔`TrainerMonItemDefaultMoves`, `ITEM_CUSTOM_MOVES`↔`TrainerMonItemCustomMoves`.
**Resolution**: Change the macro in trainers.h to match the struct type declared in trainer_parties.h.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.

## Trainer Macro/Struct Mismatches from Bulk Passes (C177→C182)

**Symptom**: Wrong macro in `trainers.h` vs party struct type — runtime crash (not caught at compile time).
**Resolution**: Always verify macro matches struct. Run `scripts/check_trainers.sh` after bulk trainer edits.

## Uncommitted Changes from Prior Cycles in Working Tree (C186)

**Symptom**: trainers.h had 17 uncommitted macro fixes from a prior cycle. These were in the working tree at C186 start and got included in the diff alongside unrelated NPC work.
**Resolution**: At cycle start, check `git status pokeemerald/` for unexpected modified files. If pre-existing changes exist, acknowledge them explicitly. Don't let unrelated changes ride along silently.
