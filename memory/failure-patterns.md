# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (C110-267, 22 occurrences) — REGRESSED C267

**Symptom**: 64-132 actions before first edit. C265-266 improved to 15-19 actions. **C267 REGRESSION: first edit at action 154/241 (64% mark)**. Root cause: (a) `/w/agentoak/` path prefix used 30+ times instead of `/__w/agentoak/`; (b) Agent subagent used 6 times; (c) Same files read 3+ times unnecessarily.
**Resolution**: (1) ALL paths MUST start with `/__w/agentoak/agentoak/pokeemerald/` — NEVER `/w/agentoak/`. (2) NEVER use Agent subagent — it was removed for a reason. (3) Start edits by action 15 max. (4) For audit passes: grep-first to identify ONLY files with issues, then read+edit those files. (5) For species work: run generator FIRST, then read only files needed for manual edits (species_names.h). (6) **Before any Read/Grep call, visually verify the path starts with `/__w/`**.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## "File Has Not Been Read Yet" on Edit Calls (Cycle 256) — 8 wasted actions

**Symptom**: Edit tool rejected 8 consecutive calls with "File has not been read yet. Read it first before writing to it."
**Cause**: Attempted to Edit graphics table files after grepping them (grep doesn't count as "read"). The Edit tool requires an explicit Read call for each file before editing.
**Resolution**: Before editing ANY file, call Read on it first. Batch: read all 8 graphics table files in parallel, then edit all 8. For species work, the 8 graphics tables always need Read→Edit after running generate_species.cjs.

## Incomplete Species Registration Across Cycles (C261→C262→C264→C265 RESOLVED)

**Symptom**: C261 claimed "all 5 species registered" but constants were never added to species.h. C262 claimed to fix it. C264 audit found the build was STILL broken. C264 cleaned dangling references.
**Resolution**: C265 re-ran generate_species.cjs for all 5 species, verified SPECIES_ constants in species.h via grep, ran `make` successfully. **Rule**: After ANY species registration, (1) grep species.h for the constant, (2) run `make`, (3) only THEN update memory. Memory claims ≠ source truth.

## Edit Tool "Multiple Matches" in species_info.h (C147, C263)

**Symptom**: Edit calls fail with "Found N matches of the string to replace, but replace_all is false."
**Cause**: species_info.h has repeated patterns like `.abilities = {ABILITY_X, ABILITY_Y}` across multiple species entries. Short snippets match multiple locations.
**Resolution**: Include MORE context lines (species name or unique surrounding fields) in the old_string to ensure exactly one match.

## Invalid Escape Sequences in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125, 197) — CRITICAL

**Symptom**: `error: unknown escape '\e'` (or `\t`, `\r`, etc.) OR `error: unknown character U+XXXX`.
**Cause**: pokeemerald `.string` only supports `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Any other `\X` is fatal. Non-charmap Unicode is also fatal.
**Resolution**: Before `make`, run: `grep -nP '\\\\[^nlp$"\\]' <modified .inc files>` to catch invalid escapes. Em-dashes (—, –) NOT in charmap — use `--`.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Cause**: Party macro doesn't match the struct type in trainer_parties.h. Four macros map 1:1 to four struct types.
**Resolution**: Change macro in trainers.h to match struct type. C195 created `scripts/fix_trainer_macros.cjs`. **C266**: generate_trainer.cjs now auto-detects the correct macro/struct pairing from party member fields, preventing this class of error entirely.

## Premature Entries for Unregistered Species (C259→C260 fix)

**Symptom**: Build fails with `undeclared` errors for SPECIES_X constants in graphics tables, tmhm_learnsets.h, evolution.h, and wild_encounters.json.
**Cause**: C259 added entries for 4 future species across 11 files BEFORE defining their SPECIES_ constants in species.h.
**Resolution**: C260 removed all premature entries. **Rule**: NEVER add entries for a species until `generate_species.cjs` has created its SPECIES_ constant.

## Pokédex categoryName Max Length (C261)

**Symptom**: `warning: excess elements in array initializer` — treated as error.
**Cause**: `PokedexEntry.categoryName` is `u8[12]`. Any categoryName over 11 characters overflows.
**Resolution**: Keep all Pokédex category names to **11 characters max**.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
- **egg_moves.h**: Regional forms still need an entry (even if empty) — C250 Gligar_Hoenn missed this.
- **cry_tables.inc**: Forward and reverse tables MUST have identical entry counts. New species using base-species cries need ONLY a cry_ids.h entry, NOT new cry_tables.inc entries.
- **TM/HM learnset fields**: Not all move constants are TM fields. Gen4/5 moves like ENERGY_BALL exist as MOVE_ constants but are NOT assigned to TM slots.
- **check_species_registration.sh**: cry_tables.inc check is a known false positive for 16/22 species. 18/19 is expected ceiling for species that reuse base cries.
- **species_names.h**: NOT covered by `generate_species.cjs` — always add manually after running the generator.
