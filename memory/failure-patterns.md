# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22)

**Symptom**: Agent completes only part of a multi-component objective.
**Cause**: Gets focused on first component and loses track of remaining deliverables.
**Resolution**: Create a checklist. Verify each component was addressed before declaring completion.

## New Move Implementation — 6 Files Required (Cycles 45-46)

All 6 files must be updated for every new move:
1. `include/constants/moves.h` — constant + MOVES_COUNT
2. `src/data/battle_moves.h` — move data entry
3. `src/data/contest_moves.h` — contest data entry
4. `src/data/text/move_descriptions.h` — description string + pointer table entry
5. `src/data/text/move_names.h` — name entry (max 12 chars)
6. `src/data/pokemon/level_up_learnsets.h` — species learnset entries
Also: fairy.png must exist if TYPE_FAIRY is used.

## Duplicate Entry "2 matches found" Edit Error

**Cause**: Search string matches multiple locations in file.
**Resolution**: Read file to get unique surrounding context. Include more lines in old_str.

## agbcc Toolchain Missing After Runner Revert (Cycle 42+)

**Symptom**: `fatal error: string.h: No such file or directory`
**Resolution**: `ln -s /home/runner/work/agentoak/agentoak/pokeemerald/tools/agbcc /__w/agentoak/agentoak/pokeemerald/tools/agbcc`

## Unicode Character in .string Directive (Cycle 26)

**Symptom**: `error: unknown character U+2014` in scripts.inc
**Resolution**: Use only ASCII in .string text. Em dash (—), smart quotes, etc. are NOT in the charmap. Ellipsis (…) and é ARE safe.

## Script Macro Missing Parameters (Cycle 50)

**Symptom**: `Missing value for required parameter 'dest' of macro 'goto'`
**Cause**: Used bare `goto` without a destination label in scripts.inc.
**Resolution**: All script macros require their parameters. Check nearby examples for correct syntax.

## Move Constant Naming

**Symptom**: `MOVE_THUNDERPUNCH' undeclared` — missing underscore.
**Resolution**: Check exact spelling in `include/constants/moves.h`. Constants are format-sensitive.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`. Invalid → crash.
- **JSON errors**: `wild_encounters.json` processed by `mapjson`. Validate JSON syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
