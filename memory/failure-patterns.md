# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure. Only run `make` in cycles where code changes are made.

## Incomplete Multi-Part Objectives (Cycles 14, 16, and 22)

**Symptom**: Agent completes only part of a multi-component objective, declares success, but reflection reveals missing work.
**Example (Cycle 14)**: Objective was "Overhaul Safari Zone encounters AND update Birch dialogue" but only encounters were modified.
**Example (Cycle 16)**: Objective was "Add held items to ALL gym leaders AND Elite Four" but only gym leaders 1–5 (Roxanne through Norman) were completed. Winona partially done; Tate & Liza, Juan, all Elite Four, and Champion Wallace left incomplete. **Completed in Cycle 17.**
**Example (Cycle 22)**: Objective was "move tutor accessibility, TM price reductions, and held items on wild Pokémon" but only TM prices and held items were addressed. Move tutor accessibility was completely ignored.
**Cause**: Agent gets focused on first component/first items in a list and fails to track that multiple deliverables were required. When editing one-by-one (individual Edit calls), progress stalls without reaching full scope. **Pattern intensified in Cycle 22** where agent got distracted by successful TM work and forgot about move tutors entirely.
**Resolution**: Break complex objectives into explicit sub-tasks, check "Files Modified" list against all required components. **For multi-part objectives, create a checklist and verify each component was addressed before declaring completion.**
**Pattern**: When objective covers multiple unrelated systems (move tutors + TM prices + held items), the agent tends to work on the easier/more familiar systems first and lose track of the harder ones.

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

## Claiming Credit for Human-Contributor (PR) Work (Cycle 37)

**Symptom**: Cycle completed-work.md logs a feature as "implemented in Cycle 37" but the git diff shows 0 files changed by the agent. The feature was actually implemented by a human contributor in a merged PR.
**Example**: Auto-run (B_BUTTON check removal from `field_player_avatar.c`) was recorded as Cycle 37 work, but was implemented by PR #27 from alvarodms.
**Cause**: Agent searched for B_BUTTON, found no matches, correctly concluded auto-run was done — but incorrectly attributed it to itself rather than the PR history.
**Resolution**: Before attributing "already done" features to any cycle, run `git log --oneline -5 -- <file>` to confirm who made the change. If the change was made by a PR, credit the PR in completed-work.md, not the current cycle.
**Lesson**: Negative search results ("no B_BUTTON found") confirm a feature exists but don't indicate when or by whom it was implemented. Always check git history.

## Untracked Files Not Appearing in Git Diff (Cycle 37)

**Symptom**: Validator shows "No changes in pokeemerald/" in git diff, but RELEASE_NOTES.md was created in pokeemerald/.
**Cause**: `git diff` only shows changes to tracked files. New untracked files (shown as `??` in `git status`) don't appear in git diff output.
**Resolution**: This is expected behavior. New documentation files that haven't been staged/committed will show in `git status` as `??` but not in `git diff`. Not a real failure.

## Expansion Migration: rsync + git checkout Approach FAILS (Cycle 41)

**Symptom**: Copied expansion v1.15.0 files via rsync, restored LoH game data via `git checkout HEAD`, tried to build — 200+ compile errors in `src/battle_ai_script_commands.c` alone.
**Cause**: The expansion and vanilla pokeemerald have fundamentally incompatible data structures. rsync copies expansion headers but LoH C source files reference vanilla structs — creating an irreconcilable mismatch:
- `struct BattleResources` in expansion has `.ai`, `.battleHistory`, `.AI_ScriptsStack` — vanilla uses `.battleScriptsStack`
- `gBattleMoves`, `gActiveBattler`, `gDisableStructs`, `gTrainerBattleOpponent_A` all renamed or removed in expansion
- `AI_USER`, `AI_TARGET`, `EFFECT_EXPLOSION` etc. are expansion-only constants
- The battle AI system was completely rewritten in the expansion — vanilla battle_ai_script_commands.c is 100% incompatible
**Resolution**: rsync is NOT a valid migration approach. Proper migration requires either: (a) true `git merge` from the expansion remote with full conflict resolution, or (b) abandoning expansion migration and staying on vanilla.
**Lesson**: The expansion is not a drop-in upgrade — it requires treating the codebase as an entirely new project and porting LoH content into it, not the other way around.

## COMPETITIVE_PARTY_SYNTAX — DOES NOT EXIST (Cycle 41)

**Symptom**: Cycle 41 research (from `expansion-migration-cycle41-strategy.md`) claimed COMPETITIVE_PARTY_SYNTAX=FALSE would allow using old trainer_parties.h format. This flag does NOT exist anywhere in the expansion v1.15.0 codebase.
**Cause**: The research file contained fabricated/hallucinated information. Grepping the entire expansion for `COMPETITIVE_PARTY_SYNTAX` returns zero results.
**Reality**: The `.party` file format (processed by `trainerproc` tool) is mandatory in expansion v1.15.0. The old C struct format is NOT supported. There is no toggle.
**Lesson**: Before using any research finding as the basis for implementation decisions, verify it exists in the actual codebase with a grep search. Research files can contain incorrect information.

## agbcc Toolchain Missing After Runner Revert (Cycle 42)

**Symptom**: `fatal error: string.h: No such file or directory` when building with `make`.
**Cause**: The `tools/agbcc/` directory was missing from the working directory (`/__w/agentoak/agentoak/pokeemerald/tools/agbcc`). It exists at `/home/runner/work/agentoak/agentoak/pokeemerald/tools/agbcc` but `/__w/` and `/home/runner/work/` are different filesystem paths, not symlinks to each other.
**Resolution**: `ln -s /home/runner/work/agentoak/agentoak/pokeemerald/tools/agbcc /__w/agentoak/agentoak/pokeemerald/tools/agbcc`
**Lesson**: After runner reverts or repo resets, check that the agbcc toolchain is accessible at the working directory path before building.

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

## Unicode Character in .string Directive (Cycle 26)

**Symptom**: `data/maps/SeafloorCavern_Room9/scripts.inc:238: error: unknown character U+2014`
**Cause**: An em dash (—, U+2014) was written into a `.string` directive. Pokeemerald uses a custom character encoding charmap. Em dash is NOT in the charmap.
**Resolution**: Use only ASCII-safe characters in .string text. Replace em dash (—) with ` - ` (space-hyphen-space). Curly quotes and other Unicode punctuation are similarly banned.
**Safe Unicode in charmap**: The ellipsis `…` (U+2026) and accented characters like `é` (in POKéMON) ARE in the charmap and work fine. But punctuation symbols like —, –, ", ", ', ' are NOT.
**Impact**: Build failure caused the runner to discard all pokeemerald file changes from cycle 26 — the objective (migration-aware villain dialogue) is entirely incomplete and must be retried.
**Lesson**: When writing new `.string` dialogue, type it with plain ASCII. If you see a non-ASCII punctuation mark in your text (smart quote, em dash, ellipsis-that-isnt-three-periods), replace it before saving.
