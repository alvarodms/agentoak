# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure. Only run `make` in cycles where code changes are made.

## Incomplete Multi-Part Objectives (Cycles 14 and 16)

**Symptom**: Agent completes only part of a multi-component objective, declares success, but reflection reveals missing work.
**Example (Cycle 14)**: Objective was "Overhaul Safari Zone encounters AND update Birch dialogue" but only encounters were modified.
**Example (Cycle 16)**: Objective was "Add held items to ALL gym leaders AND Elite Four" but only gym leaders 1–5 (Roxanne through Norman) were completed. Winona partially done; Tate & Liza, Juan, all Elite Four, and Champion Wallace left incomplete. **Completed in Cycle 17.**
**Cause**: Agent gets focused on first component/first items in a list and fails to track that multiple deliverables were required. When editing one-by-one (individual Edit calls), progress stalls without reaching full scope.
**Resolution**: Break complex objectives into explicit sub-tasks, check "Files Modified" list against all required components.
**Pattern**: When objective covers a large set (all gym leaders + Elite Four = 8 leaders + 4 E4 + 1 Champion = 13 trainers × 3–6 mons each), plan all edits upfront and pace through the full list systematically.

## Held Item Edit Scope Issue (Cycle 16 — RESOLVED Cycle 17)

**Symptom**: Bulk replace attempt blocked (154 matches, replace_all=false), then agent manually edits one-by-one but only completes first 5 gym leaders out of 13 trainers.
**Cause**: The agent tried to bulk-replace all ITEM_NONE at once, was blocked, then manually iterated but ran out of cycle time/actions before reaching the end.
**Resolution**: Cycle 17 completed the remaining 26 held item slots via targeted Edit calls with specific context. For future large-scale edits, use a scripted approach (Python/sed) rather than individual Edit calls.
**Lesson**: When a species appears in multiple trainer parties (e.g. SPECIES_CLAYDOL at line 460 and 1247 and 3569), use Read first to confirm exact line context before Edit — prevents "2 matches found" errors.

## Duplicate Entry in "2 matches found" Edit error

**Symptom**: Edit tool returns "Found 2 matches of the string to replace, but replace_all is false."
**Cause**: The search string matches multiple locations in the file (e.g., same species name appears in multiple trainer party blocks).
**Resolution**: Read the file around the target line number first to get unique surrounding context, then include more lines of context in the old_str to make the match unique.

## Validator False-Positive "INCOMPLETE" on Python-Script Edits (Cycle 21)

**Symptom**: Cycle validation reports "INCOMPLETE — no pokeemerald/ files modified" even though the data file was actually changed.
**Cause**: The agent used a Python script written to `/tmp/` and executed via Bash. The validator tracks Write/Edit tool calls to detect file modifications, but Python-via-Bash bypasses this tracking. The git diff correctly shows the file was changed (12254 insertions, 12213 deletions in `wild_encounters.json`).
**Resolution**: This is a validator blind spot, not a real failure. The git diff is the ground truth. Python scripts are a valid and efficient approach for bulk JSON edits — but ALWAYS follow large JSON edits with `make` to catch syntax errors immediately.
**Critical lesson**: When using Python scripts to modify JSON data, run `python3 -c "import json; json.load(open('file.json'))"` immediately after to validate JSON syntax before declaring the cycle done.

## Anticipated Pitfalls (from code analysis)

### Using wrong SPECIES_ constants
- Species IDs are in `constants/species.h`
- Only valid species IDs should be used in data files
- Invalid species will likely cause crashes or display issues at runtime (may not be a compile error)

### JSON format errors in `wild_encounters.json`
- The file is processed by `mapjson` tool during build
- Malformed JSON will cause a build error at the data generation step
- Always validate JSON syntax before building

### Classic vs Modern compiler differences
- Default build uses `agbcc` (classic mode)
- Some modern C features won't compile in classic mode (C89 only)
- Use C89-compatible syntax: no `//` comments (use `/* */`), no declarations after statements

### Assembly script syntax errors
- `.s` files in `data/` use custom preprocessor directives
- Errors here produce cryptic assembler messages
- Look at nearby valid examples before editing

### Graphics format issues
- Graphics must be PNG with correct dimensions (multiples of 8)
- Tile-based: 8x8 tiles, sprite sheets must follow GBA size constraints
- `gbagfx` will error on invalid dimensions or color counts

## Actual Build Failures (Cycle 6)

### Move constant naming errors

**Symptom**: `MOVE_THUNDERPUNCH' undeclared here (not in a function)` compile error
**Cause**: Used `MOVE_THUNDERPUNCH` instead of `MOVE_THUNDER_PUNCH` (missing underscore)
**Resolution**: All move constants follow exact format in `include/constants/moves.h` — must check exact spelling
**Error location**: `src/data/trainer_parties.h` line 3428 (Wattson's Electabuzz moveset)
**Lesson**: Move constants are case-sensitive and format-sensitive. Always verify against header file.
