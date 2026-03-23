# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88)

**Symptom**: Agent completes only part of a multi-component objective.
**Cause**: Gets focused on data entry and memory updates, skipping the build. Cycle 67: 249 actions on data entry. Cycle 77: only 28 actions used but all spent on edits+memory — `make` never run despite having budget remaining. Cycle 88: 25 successful edits + 12 wasted on "file not read" errors + memory updates = no build. All pokeemerald edits reverted.
**Resolution**: Create a checklist. Budget actions — reserve at least 20 actions for build+fix at the end. For large file edits, re-read immediately before editing to avoid context eviction. For pokedex_orders.h weight/height sorting, use a script instead of manual binary search.

## Action Budget Waste on Research Cycles (Cycle 76)

**Symptom**: 298 actions consumed for reading ~10 files and writing 1 memory file.
**Causes**: (1) Path typos — `/w/` instead of `/__w/` — wasted ~15 actions. (2) Reading large files without offset/limit, hitting token cap — ~12 wasted. (3) Redundant grep patterns searching for the same constants across same files — 30+ wasted.
**Resolution**: (1) Always use `/__w/agentoak/agentoak/pokeemerald/` prefix — verify with pwd first. (2) For files >10K tokens, always use offset/limit. (3) Take notes on findings; don't re-search. Plan the audit path before starting — list target files, read each once systematically.

## New Move Implementation — 6 Files Required (Cycles 45-46)

All 6 files must be updated for every new move:
1. `include/constants/moves.h` — constant + MOVES_COUNT
2. `src/data/battle_moves.h` — move data entry
3. `src/data/contest_moves.h` — contest data entry
4. `src/data/text/move_descriptions.h` — description string + pointer table entry
5. `src/data/text/move_names.h` — name entry (max 12 chars)
6. `src/data/pokemon/level_up_learnsets.h` — species learnset entries
Also: fairy.png must exist if TYPE_FAIRY is used.

## Untracked Binary Assets (Cycle 68)

**Symptom**: Build fails with "Failed to open graphics/pokemon/lucario/anim_front.png" or similar for sprite/cry/fairy.png files.
**Cause**: Binary assets (sprites, cries, fairy.png) from previous cycles were never committed to git. Each fresh checkout is missing them.
**Resolution**: Re-fetch sprites via `fetch_pokemon_sprites` MCP tool, copy placeholder cries from similar species, copy fairy.png from normal.png. Also need physical.png, special.png, status.png (move category icons from P/S split). Must be done every fresh build if assets aren't committed.

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

## "File has not been read yet" After Context Compression (Cycle 57, 67, 88)

**Symptom**: Edit tool returns `File has not been read yet. Read it first before writing to it.`
**Cause**: After many tool calls (200+), context compression evicts the file read. Edit requires a recent Read.
**Resolution**: Re-read the file immediately before editing. For bulk updates, use bash scripts instead of many individual Edit calls. In Cycle 88, 12 consecutive edits failed this way — wasting 20% of the action budget.

## Missing New Species Graphics/Cries (Cycles 60-61+)

**Symptom**: `Failed to open "graphics/pokemon/lucario/anim_front.png"` etc.
**Cause**: Placeholder graphics for new species lost on reverts or fresh checkouts.
**Resolution**: Recreate placeholders before building.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`. Invalid → crash.
- **JSON errors**: `wild_encounters.json` processed by `mapjson`. Validate JSON syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
