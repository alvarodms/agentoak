# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67)

**Symptom**: Agent completes only part of a multi-component objective.
**Cause**: Gets focused on first component (data entry) and runs out of actions before building. In Cycle 67, 249 actions were spent on data entry and pokedex_orders.h sorting — zero left for `make`.
**Resolution**: Create a checklist. Budget actions — reserve at least 20 actions for build+fix at the end. For pokedex_orders.h weight/height sorting, use a script instead of manual binary search (~70 actions wasted in Cycle 67).

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

## Unicode Character in .string Directive (Cycles 26, 64, 65)

**Symptom**: `error: unknown character U+2014` or `expected UTF-8 string literal` in scripts.inc
**Resolution**: Use only ASCII in .string text. Em dash (—), smart quotes, etc. are NOT in the charmap.
**WARNING (Cycle 65)**: The Edit tool can silently corrupt ASCII `"` into Unicode smart quotes when editing text near existing smart quotes. Verify with `grep -P '\.string \xe2\x80[\x9c\x9d]' <file>` after editing.

## Move Constant Naming

**Symptom**: `MOVE_THUNDERPUNCH' undeclared` — missing underscore.
**Resolution**: Check exact spelling in `include/constants/moves.h`. Known tricky: `MOVE_SELF_DESTRUCT`, `MOVE_FAINT_ATTACK`, `MOVE_THUNDER_PUNCH`.

## "File has not been read yet" After Context Compression (Cycle 57, 67)

**Symptom**: Edit tool returns `File has not been read yet. Read it first before writing to it.`
**Cause**: After many tool calls (200+), context compression evicts the file read. Edit requires a recent Read.
**Resolution**: Re-read the file immediately before editing. For bulk updates, use bash scripts instead of many individual Edit calls.

## Missing New Species Graphics/Cries (Cycles 60-61+)

**Symptom**: `Failed to open "graphics/pokemon/lucario/anim_front.png"` etc.
**Cause**: Placeholder graphics for new species lost on reverts or fresh checkouts.
**Resolution**: Recreate placeholders before building. For Gible line (Cycle 67), sprites were fetched via fetch_pokemon_sprites — may have >16 color palette issues.

## Expansion Repo Sprites — Palette Issues (Anticipated, Cycle 67)

**Symptom**: Build error about too many colors in PNG sprite
**Cause**: fetch_pokemon_sprites downloads from pokeemerald-expansion which uses extended palettes (>16 colors)
**Resolution**: Reduce palette to 16 colors (14 + transparency + black) or fall back to placeholder copy approach.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`. Invalid → crash.
- **JSON errors**: `wild_encounters.json` processed by `mapjson`. Validate JSON syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
