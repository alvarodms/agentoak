# Engineering Validation — File Modifications

| File | Cycles | Notes |
|------|--------|-------|
| `pokeemerald/scripts/check_dialogue.sh` | C112 | Dialogue integrity checker |
| `pokeemerald/scripts/check_trainers.sh` | C118 | Trainer data validation |
| `pokeemerald/scripts/check_flags.sh` | C145 | Flag-chain validator |
| `pokeemerald/scripts/check_encounters.sh` | **C170** | Encounter table validator (species exist, slot counts, level sanity, duplicate maps) |
| `pokeemerald/Makefile` | C127, C141, C145, **C170** | check_trainers/check_ascii/check_scripts/check_flags targets (C127-C145); check_encounters target + check_scripts as rom prerequisite (C170) |
| `pokeemerald/asm/macros/event_macros.inc` | **C179** | New file: 3 parameterized macros (GlimpseEvent, BadgeGateShow, ConditionalDialogue) for reusable script patterns |
| `pokeemerald/asm/macros/legend_macros.inc` | **C185** | New file: 7 parameterized macros (ScreenShake, PlayCry, SetWeather, ClearWeather, FadeOut, FadeIn, StartBattle) for legendary encounters |
| `pokeemerald/asm/macros/difficulty_utils.inc` | **C190** | New file: `EventMacro_DifficultyDialogue` — convenience wrapper for Challenge Mode NPC branching. Hardcodes FLAG_DIFFICULTY_CHALLENGE, handles lock/faceplayer/branch/release/end. |
| `pokeemerald/asm/macros.inc` | C179, C185, **C190** | Added `.include "asm/macros/difficulty_utils.inc"` after legend_macros.inc |
| (Trainer ID Audit) | **C192** | 12 reclaimable IDs confirmed: #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853. See tech-debt-backlog.md. |
| `pokeemerald/scripts/add_regional_form.cjs` | **C202** | Generic config-driven species pipeline. Reads JSON, inserts into 27 files. `--dry-run` supported. Idempotent (skips existing species). Replaces bespoke per-species scripts. |
| `pokeemerald/scripts/configs/corsola_hoenn.json` | **C202** | Validation config for Corsola_Hoenn. All values match codebase. Used for dry-run testing. |
| `pokeemerald/scripts/check_quest_flags.sh` | **C202** | Quest flag orphan detector. Checks all FLAG_QUEST_* are both set and checked in scripts. |
| `pokeemerald/scripts/check_e4_rematches.sh` | **C206** | E4 rematch validator: species uniqueness per party, level progression across tiers, regional form placement (Corsola_Hoenn/Arcanine_Hoenn/Garchomp). 33 checks, all PASS. |
| `pokeemerald/Makefile` | C206, **C220** | Added `check_e4_rematches` (C206), `check_species` (C220) phony targets. |
| `pokeemerald/scripts/check_species_registration.sh` | C220, **C222** | Species registration completeness checker. C220: initial version (single-pattern). C222: fixed to use multi-pattern search (SPECIES_X + NATIONAL_DEX_X + PascalCase) — eliminated false negatives. |
| `pokeemerald/scripts/complete_species_registration.cjs` | **C222** | Gap-filler tool. Reads check script output, identifies missing entries, inserts them. Handles 7 file types: egg_moves.h, pokedex_orders.h, pokemon_icon.c, pokemon.c (4 arrays), cry_tables.inc (forward+reverse), cry_ids.h, evolution.h. Tested: Bagon_Hoenn, Farigiraf, Ninetales_Hoenn → all 19/19. |
| `pokeemerald/scripts/species_configs/*.json` | **C222** | Config files for 3 species (bagon_hoenn, farigiraf, ninetales_hoenn). Schema: speciesName, eggMoves, cryBase, cryId, frontAnim, evolution fields. |
| `pokeemerald/scripts/check_evolution_consistency.sh` | **C225** | Evolution consistency validator: source/target species exist in species.h, evolution methods valid, no duplicate entries, gender-gated evos valid, branching evo targets unique. 6 checks. |
| `pokeemerald/Makefile` | **C225** | Added `check_evolution` and `check_all` (runs check_species + check_encounters + check_e4_rematches + check_evolution) phony targets. |
| `pokeemerald/scripts/convert_sprites_indexed.cjs` | **C239** | RGBA-to-indexed PNG converter. 16-color palette quantization (14 opaque + transparent + padding). Merges similar colors when >14 unique. Manual PNG writer (pngjs doesn't support indexed output). `--dry-run` supported. Skips already-indexed files. |
| `pokeemerald/scripts/check_trainers.sh` | C118, **C247** | Extended with Check 5 (field-level party validation: .heldItem/.moves presence vs struct type) and Check 6 (party size 1-6 bounds). Validates all 4 struct types: ItemCustomMoves, NoItemDefaultMoves, NoItemCustomMoves, ItemDefaultMoves. |
| `pokeemerald/scripts/generate_species.cjs` | C254, **C260** | Config-driven species generator. C254: JSON config → 18 files (all 19 check_species files except cry_tables.inc). C260: extended to 26 files — added 8 graphics table handlers (front/back pic tables, coordinate tables, palette/shiny palette tables, footprint table, still front pic table). All use EGG entries as insertBefore anchors. Idempotency check, --dry-run mode. |
| `pokeemerald/species_configs/gligar_hoenn.json` | **C254** | Validation config for round-trip testing. All values match codebase entries for SPECIES_GLIGAR_HOENN (#432). |
| `pokeemerald/Makefile` | **C254** | Added `check_trainers` to `check_all` target (now: check_species + check_encounters + check_e4_rematches + check_evolution + check_trainers). |
