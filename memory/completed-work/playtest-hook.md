# Playtest Hook (runner infrastructure)

Added by the runner developers, not by a cycle. It lets the runner's headless
emulator harness (`src/emulator/` in the agent-oak repo, mGBA via
`mgba-driver`) boot the ROM straight into a test scenario. The harness is
not yet wired into cycle phases.

## What it does

- `gPlaytestScenario` (const, in ROM) is **inert** in every normal build:
  magic `PLAYTEST_MAGIC_INACTIVE`, so the game boots exactly as before.
- The harness copies the ROM, overwrites that struct with a scenario (map,
  tile, flags, vars, party, bag, dex caught, name, gender, money) and the
  active magic, then boots the copy.
- On boot, the copyright screen hands off to `Playtest_Boot`, which starts
  `CB2_NewGame`. That runs the real `NewGameInitData`, then
  `Playtest_ApplyScenario`, and warps to the scenario tile. The truck intro is
  skipped.
- `gPlaytestLayout` is a table of compiler-computed struct offsets
  (SaveBlock1 flags/vars/location, ObjectEvent, Pokemon, BattlePokemon) that
  the harness uses to read game state. It follows any struct change
  automatically.

## Files

| File | Change |
|---|---|
| `include/playtest.h` | Scenario struct (byte layout is a contract with `src/emulator/scenario.ts`), layout enum |
| `src/playtest.c` | Struct, layout table, `Playtest_IsActive` / `Playtest_Boot` / `Playtest_ApplyScenario` |
| `src/intro.c` | `CB2_InitCopyrightScreenAfterBootup`: `if (Playtest_IsActive()) Playtest_Boot();` |
| `src/overworld.c` | `CB2_NewGame`: apply scenario after `NewGameInitData`; no truck sequence when active |
| `ld_script.ld` | `src/playtest.o(.text)` / `(.rodata)` after `new_game.o` |

## Rules for cycles

- Keep the two hook lines when editing `CB2_InitCopyrightScreenAfterBootup` or
  `CB2_NewGame`, and keep the `playtest.o` lines in `ld_script.ld`.
- Do not change `struct PlaytestScenario` or `enum PlaytestLayoutField`. The
  harness writes and reads them byte for byte, and `STATIC_ASSERT`s in
  `playtest.c` pin the sizes.
- Code that runs after `NewGameInitData` in `CB2_NewGame` also runs for
  playtests, before the warp to the scenario tile.
