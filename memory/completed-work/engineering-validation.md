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
