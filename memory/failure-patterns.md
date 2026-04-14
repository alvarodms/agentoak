# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150, 195, 196, 197, 209) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit. C209: 37 actions before first edit, partly due to `gh` CLI being unavailable (7 actions wasted discovering this).
**Resolution**: For species pipeline: write script early. C198 succeeded by starting script by action 10. Use `grep -n` to find offsets in ONE pass. **`gh` is NOT available** — don't attempt it; search journals/memory directly.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## Claiming Completion Without Git Changes (Cycles 107, 143) — RECURRING

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111, 196, 197)

**Symptom**: Agent completes only part of a multi-component objective. C197: script ran + manual patches applied but build failed on quest script text, all reverted.
**Resolution**: Budget actions — reserve 30 for build + debug. Start edits by action 15. Grep for invalid escapes before building.

## Invalid Escape Sequences in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125, 197) — CRITICAL

**Symptom**: `error: unknown escape '\e'` (or `\t`, `\r`, etc.) OR `error: unknown character U+XXXX`.
**Cause**: pokeemerald `.string` only supports `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Any other `\X` is fatal. Non-charmap Unicode is also fatal.
**Resolution**: Before `make`, run: `grep -nP '\\\\[^nlp$"\\]' <modified .inc files>` to catch invalid escapes. Use `cat >> file << 'HEREDOC'` for files with smart quotes. Em-dashes (—, –) NOT in charmap — use `--`.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Cause**: Party macro doesn't match the struct type in trainer_parties.h. Four macros map 1:1 to four struct types.
**Resolution**: Change macro in trainers.h to match struct type. C195 created `scripts/fix_trainer_macros.cjs`.

## Missing HOENN_DEX Entry When Adding Species (Cycle 195)

**Symptom**: `initializer element for 'sSpeciesToHoennPokedexNum[N]' is not constant` in pokemon.c.
**Cause**: Added NATIONAL_DEX entry but forgot HOENN_DEX_* enum entry and HOENN_DEX_COUNT update.
**Resolution**: When adding any species, ALWAYS update both national AND Hoenn dex sections of pokedex.h.

## Two-Species Pipeline Too Large for Manual Edits (Cycles 196, 197, fixed C198)

**Symptom**: C196: 171 actions manual editing, never built. C197: script + manual but `\e` killed build.
**Resolution (C198)**: Fresh script + 8 manual Edit patches for graphics tables that have EGG/UNOWN entries after CORSOLA_HOENN. Script anchors that assume `};` follows CORSOLA_HOENN are WRONG for graphics tables — always insert before `[SPECIES_EGG]`.

## replace_all Footgun (Cycle 198)

**Symptom**: Used `replace_all: true` to fix `MON_MALE` → `PERCENT_FEMALE(25)` in species_info.h; changed ALL species with MON_MALE, not just the two new ones.
**Resolution**: NEVER use `replace_all` on common strings in large files. Use targeted edits or `git checkout --` to restore + re-apply.

## add_regional_form.cjs Catastrophic Failure (Cycles 215-216) — CRITICAL

**Symptom**: Pipeline only populated 7 of 23+ required files for Bagon_Hoenn. Build failed with `SPECIES_BAGON_HOENN undeclared`. Missing from: species.h, pokedex.h, species_info.h, all graphics tables (12 files), pokedex_text.h, pokedex_entries.h, level_up_learnsets.h, level_up_learnset_pointers.h, front_pic_anims.h, graphics.h (externs), graphics/pokemon.h (declarations).
**Cause**: Pipeline has TWO categories of bugs: (1) placement bugs — tmhm_learnsets.h entry placed in struct def, pokemon.c macros all in first array; (2) COMPLETE OMISSIONS — 16+ files never touched at all. The pipeline's file list is fundamentally incomplete.
**Resolution**: DO NOT trust `add_regional_form.cjs` for any future species addition without a comprehensive audit. After running, verify EVERY file in the 23-file species registration checklist. C216 manually added all 16 missing entries. Pipeline needs a complete rewrite before next use — scheduled for C221 at latest.
**Species registration checklist**: species.h, pokedex.h (national+hoenn), species_info.h, graphics/pokemon.h, graphics.h, front/back_pic_coordinates.h, front/back/still_front_pic_table.h, palette/shiny_palette_table.h, footprint_table.h, pokemon_icon.c (icon+palette), front_pic_anims.h (3 locations), pokedex_text.h, pokedex_entries.h, level_up_learnsets.h, level_up_learnset_pointers.h, pokemon.c (3 arrays), anim_mon_front_pics.c, tmhm_learnsets.h, egg_moves.h, pokedex_orders.h (3 arrays).

## PNG Palette Modification Requires PLTE Chunk Surgery (Cycle 209)

**Symptom**: Writing .pal files doesn't update the embedded palette in PNG files. Build uses PNG PLTE, not .pal, for sprite graphics.
**Resolution**: When modifying sprite palettes, must also update the PLTE chunk in the PNG binary directly using Node.js. Find PLTE chunk offset, write raw RGB bytes. Keep .pal and PNG PLTE in sync.

## wild_encounters.h Is Gitignored — Do Not Stage (Cycle 212)

**Symptom**: `git add` fails with "The following paths are ignored by one of your .gitignore files: pokeemerald/src/data/wild_encounters.h".
**Cause**: `pokeemerald/src/data/.gitignore` ignores `wild_encounters.h` (generated from `wild_encounters.json`). Runner staging tried to add it.
**Resolution**: Only stage `wild_encounters.json`, never `wild_encounters.h`. When staging pokeemerald changes, skip gitignored generated files.

## MCP Sprite Fetch Incomplete for Newer Pokemon (Cycle 214)

**Symptom**: `fetch_pokemon_sprites("farigiraf")` returned only 5 of 7 files — missing `anim_front.png` and `front.png`.
**Cause**: The expansion repo may not have all sprite variants for Gen 9 species, or the MCP tool's file detection missed them.
**Resolution**: After calling `fetch_pokemon_sprites`, ALWAYS verify with `ls` that all 7 files exist. If any are missing, copy from the base species (e.g., Girafarig for Farigiraf) as fallback.

## Ad-Hoc Registration Scripts Still Need Manual Fixes (Cycle 217)

**Symptom**: Fresh one-off script (`add_vulpix_ninetales_hoenn.cjs`) handled 24 of 27 files correctly but missed: (1) egg_moves.h — inserted entries but left TERMINATOR in wrong position; (2) graphics.h — forgot extern declarations for gMonFrontPic_*, gMonBackPic_*, etc.; (3) cry_tables.inc — not handled at all (cries mapped via cry_ids.h instead).
**Resolution**: Even with a fresh per-species script, always verify: (a) egg_moves.h TERMINATOR placement, (b) graphics.h has all 7 extern declarations per species, (c) cry system is handled (either cry_tables.inc entries or cry_ids.h mapping). Build twice — first after script, then after manual patches.

## Script Written But Never Executed (Cycle 218, fixed C219) — CRITICAL

**Symptom**: C218 journal reported build green, but `SPECIES_VULPIX_HOENN undeclared` on next build. Script `add_three_species_c218.cjs` was written and validated structurally but never actually run with `node`.
**Cause**: Agent wrote the script and updated memory as if the work was done, without executing it or verifying the output files.
**Resolution**: After writing ANY registration script: (1) EXECUTE it with `node scripts/<name>.cjs`, (2) verify output with `grep` on key constants in target files, (3) run `make` to confirm build. Never trust a script's existence as proof of execution — check its OUTPUT files.

**Additional C219 fix**: The script used `\x1E` hex escape for é in `gFarigirafPokedexText`. agbcc doesn't support `\x` escapes — use literal `POKéMON` (UTF-8 é character) instead. Added to Invalid Escape Sequences pattern.

## Dangling Species References Breaking Build (Cycle 220) — CRITICAL

**Symptom**: `SPECIES_FARIGIRAF undeclared` in trainer_parties.h. Build broken at cycle start.
**Cause**: Three species (FARIGIRAF, VULPIX_HOENN, NINETALES_HOENN) had references in compiled source files (evolution.h, trainer_parties.h, wild_encounters.h, egg_moves.h) but were never added to species.h. C218/C219 scripts were executed but their registrations were incomplete or reverted.
**Resolution**: Commented out dangling evolution entries, replaced FARIGIRAF with GIRAFARIG in trainer parties, replaced VULPIX_HOENN with VULPIX in encounters. Fixed both wild_encounters.h (generated file) AND wild_encounters.json (source of truth).
**Prevention**: Run `make check_species` before and after every species-related cycle. The new script catches exactly this class of error.

## All 17 Custom Species Have Registration Gaps (Cycle 220 Discovery) — CRITICAL

**Symptom**: `make check_species` reveals every custom species is missing 8-16 of 19 required files.
**Common missing files across ALL species**: pokedex.h, pokedex_text.h, pokedex_entries.h, pokedex_orders.h, pokemon.h (graphics), graphics.h (externs), cry_tables.inc, cry_ids.h, anim_mon_front_pics.c, level_up_learnsets.h.
**Worst cases**: Froslass (3/19), Mamoswine (3/19), Vulpix_Hoenn (2/19), Ninetales_Hoenn (0/19), Farigiraf (1/19).
**Impact**: Species appear in-game using fallback data (wrong sprites, no Pokédex entries, no cries, default learnsets). The ROM compiles because these files use array indexing — missing indices silently use zero-initialized data.
**Resolution**: Requires a dedicated species registration cycle to complete all 17 species. Priority: Froslass/Mamoswine (3/19 each, used by Glacia).

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
