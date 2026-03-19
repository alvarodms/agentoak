# QoL Changes & Release

Quality-of-life improvements and release artifacts.

---

## QoL Changes

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| TM shop data files | TM prices halved (3000→1500) | 22 | Dragon Claw, EQ, Shadow Ball, Psychic, etc. |
| `data/maps/FallarborTown/scripts.inc` | Move tutor: Metronome→Earthquake | 23 | Pre-Gym 4 EQ access |
| `src/field_player_avatar.c` | Auto-run enabled (B_BUTTON check removed) | 37 | Running is now default; always runs when FLAG_SYS_B_DASH set |
| `src/new_game.c` | FlagSet(FLAG_SYS_B_DASH) at game start | 38 | Player runs from very first step, not just after getting shoes |

## Release

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `pokeemerald/RELEASE_NOTES.md` | v1.0 release notes created | 37 | Full feature list, v2.0 preview, credits |
