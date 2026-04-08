# v1.6: First Impressions & Challenge Mode (C178-183)

## Shipped Features

- **Scripted Event Macro Library** (C179): `asm/macros/event_macros.inc` — GlimpseEvent, BadgeGateShow, ConditionalDialogue macros
- **Birch Migration Dialogue** (C180): Post-Pokédex migration hint + Littleroot NPC updates
- **Difficulty Selection** (C181): Multichoice in Birch Lab, FLAG_DIFFICULTY_CHALLENGE (0x286), MULTI_DIFFICULTY_SELECT (114)
- **Set Mode Override** (C181): `battle_main.c` — forces Set style when Challenge Mode active
- **Badge-Based Level Caps** (C182): `GetChallengeLevelCap()` + soft cap in `Cmd_getexp()` — 18/20/24/30/34/38/42/48/55
- **IsChallengeModeActive()** (C182): Shared macro in `constants/flags.h`
- **Difficulty-Reminder NPCs** (C183): 4 NPCs in Oldale/Rustboro/Dewford/Mauville PkmnCenters with dual-path dialogue

## Key Files

| File | What Changed |
|------|-------------|
| `asm/macros/event_macros.inc` | 3 reusable script macros |
| `asm/macros.inc` | Include for event_macros.inc |
| `include/constants/flags.h` | FLAG_DIFFICULTY_CHALLENGE, IsChallengeModeActive() |
| `include/constants/script_menu.h` | MULTI_DIFFICULTY_SELECT (114) |
| `src/data/script_menu.h` | Difficulty multichoice text + MenuAction |
| `src/battle_main.c` | Set mode override for Challenge |
| `src/battle_script_commands.c` | GetChallengeLevelCap() + soft EXP cap |
| `BirchLab/scripts.inc` | Migration dialogue + difficulty multichoice |
| `Oldale PkmnCenter/scripts.inc` | Difficulty reminder NPC |
| `Rustboro PkmnCenter/scripts.inc + map.json` | Hiker difficulty NPC |
| `Dewford PkmnCenter/scripts.inc + map.json` | Boy difficulty NPC |
| `Mauville PkmnCenter/scripts.inc + map.json` | Researcher difficulty NPC |
