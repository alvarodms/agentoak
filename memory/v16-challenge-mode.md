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

## C325 Challenge Bag-lock audit (moved from strategy-notes C333) (read-only; no fights changed)
Cap = `GetChallengeLevelCap()` badges held at the fight (soft: EXP /10 at or over cap, so players can overshoot). Ace = trainer_parties.h level + `sChallengeModeScaling` boost (Leader +3, Rival +2, Champion +5). Items = `gTrainers[].items` the AI can no longer use in Challenge.

| Fight (trainer ID) | Cap | Ace (base → Challenge) | Items removed by lock | Gap |
|---|---|---|---|---|
| Flannery (TRAINER_FLANNERY_1, 3 badges) | 30 | Torkoal 29 → 32 | 2x Hyper Potion | 2 |
| Juan (TRAINER_JUAN_1, 7 badges) | 48 | Milotic 46 → 49 | 2x Hyper Potion | 1 |
| Wally VR (TRAINER_WALLY_VR_1, RIVAL) | 55 | Gardevoir 58 → 60 | 3x Full Restore | 5 (edge, not flagged) |
| Champion Steven (TRAINER_WALLACE, CHAMPION) | 55 | Metagross 57 → 62 | 4x Full Restore | **7 — watch for wall** |
| Meteor Falls Steven (TRAINER_STEVEN, RIVAL, postgame) | 55 | Metagross 86 → 88 | 4x Full Restore | **33 — watch for wall** (postgame superboss; cap never rises past 55) |

Every audited fight lost its trainer items, so the lock makes each one easier for the AI side, while the player loses potions too. Champion: whether losing 4 Full Restores (him) vs. the player's whole BAG nets out is the playtest question. If Champion Challenge reports come back as a wall, the levers are the CHAMPION +5 boost or the 55 cap, not his roster. Mossdeep Steven tag partner: his AI is already item-less (INGAME_PARTNER early-out in `ShouldUseItem`).
