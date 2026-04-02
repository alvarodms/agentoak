# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136) — RECURRING

**Symptom**: 90+ actions spent on file reads/searches before first edit (C136). Objective still completed but action budget nearly exhausted.
**Cause**: Wrong working directory path (`/home/agentoak/` instead of `/__w/agentoak/agentoak/`) caused cascading failures in C136. Also: deep research on well-understood systems.
**Resolution**: 
- **ALWAYS use `/__w/agentoak/agentoak/pokeemerald/`** as the base path. NEVER use `/home/agentoak/`.
- When C infrastructure is DONE, start writing scripts immediately. Budget: ≤10 actions for reads, ≥30 for writes+build.

## Claiming Completion Without Git Changes (Cycle 107)

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes. Validator flags as UNSUBSTANTIATED.
**Cause**: Working-directory changes succeed but files are never staged/committed.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111)

**Symptom**: Agent completes only part of a multi-component objective.
**Cause**: Gets focused on early phases (research, C plumbing) and runs out of actions before script content.
**Resolution**: Budget actions — reserve at least 30 actions for script writing and build. Start edits by action 15.

## Non-ASCII Characters in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125) — CRITICAL

**Symptom**: `error: unknown character U+XXXX` or `no mapping exists for...`
**Cause 1 (Edit tool)**: Edit tool silently corrupts existing Unicode smart quotes when in `old_string`.
**Cause 2 (Content)**: Em dashes (U+2014), smart quotes, and other non-ASCII characters in NEW content written via Edit or `cat >>`. C125 failed on an em dash in Birch dialogue.
**Resolution**:
- Use `cat >> file << 'HEREDOC'` for files with existing smart quotes (avoids Edit tool corruption).
- **VALIDATE all new .string content**: Run `grep -P '[\x80-\xFF]' <file>` on every modified .inc file BEFORE `make`. Replace em dashes with `--`, curly quotes with `'`, etc.
- Smart quotes U+201C/U+201D in existing vanilla text are VALID charmap entries (B1/B2) — do NOT replace those.

## Pre-existing Build Blockers Cause Cascade Reverts (C122, C124)

**Symptom**: Cycle makes valid changes but build fails due to pre-existing issue in unrelated file.
**Resolution**: At cycle start, run a smoke `make` build BEFORE making any changes. If it fails, fix the blocker first.

## Dangling map.json Script References (Cycle 130)

**Symptom**: Linker error `undefined reference to 'EventScript_Xxx'` in `map_events.o`.
**Cause**: `map.json` object event references a script label never defined in `scripts.inc`.
**Resolution**: Add the missing script to `scripts.inc` or fix the reference in `map.json`.

## Bash-Modified Files Not Tracked by Validator (Cycle 133)

**Symptom**: Validator says "no pokeemerald/ files modified" even though git diff shows changes.
**Cause**: Used Bash script to modify files instead of Edit tool. Validator tracks Edit/Write tool calls.
**Resolution**: After Bash-based file modification, always run `git status` to verify. ALWAYS run `make`.

## "File has not been read yet" After Context Compression (Cycles 57, 67, 88)

**Symptom**: Edit tool returns `File has not been read yet.`
**Cause**: Context compression evicts the file read after many tool calls.
**Resolution**: Re-read immediately before editing.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
