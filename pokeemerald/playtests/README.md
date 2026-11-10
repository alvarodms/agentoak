# Playtests

Scripted checks replayed against the built ROM in a headless emulator (mGBA).
Each `.json` file boots a **scenario** (map, tile, flags, vars, party, bag,
Pokédex caught) straight into the overworld, runs **steps**, and checks what
happened. Run them with `npm run playtest` from the repo root
(`-- --filter skeptic` for some); the report and screenshots go to
`artifacts/playtests/`.

The schema lives in `src/emulator/playtest.ts`. `npm test` rejects files that
don't match it, and a file must be named after its `name`.

```json
{
  "name": "believer-skeptic-inked",
  "checks": "C327 skeptic, LOTAD_HOENN caught: faces right on load; reads the corrected line",
  "scenario": { "map": "MAP_ROUTE104", "x": 33, "y": 50,
                "flags": ["FLAG_SYS_POKEMON_GET"], "party": [{ "species": "SPECIES_SALAMENCE", "level": 50 }],
                "caught": ["SPECIES_LOTAD_HOENN"] },
  "steps": [
    { "expectObject": { "id": "LOCALID_ROUTE104_LOTAD_SKEPTIC", "x": 33, "y": 49, "facing": "right" } },
    { "face": "up" },
    { "talk": true },
    { "expectText": "PROF. BIRCH never wrote that." }
  ]
}
```

Scenario fields also include `clearFlags`, `vars`, `bag` (`{"ITEM_X": qty}`),
`name`, `gender` and `money`. Every name is a real constant from `include/`.

| Step | Does |
|---|---|
| `face`, `walk` (+`tiles`) | Turn in place, or walk tile by tile; fails if blocked |
| `press` (+`hold`, `release`, `times`), `wait` | Raw buttons and frames |
| `talk` | Press A, then keep pressing until the script ends or a battle starts, recording every message box. Use `{"start": false}` to pick up a script that resumes after a battle |
| `expectText`, `expectNoText` | Substrings of the last `talk` (line breaks and curly quotes don't matter) |
| `expectPlayer`, `expectObject` | Tile and facing; objects by `LOCALID_*` or index (+1); `"absent": true` means hidden by its flag |
| `expectFlag`, `expectVar`, `expectScreen` | Saved flags and vars; `gMain.callback2` by name |
| `findWildBattle`, `waitFor`, `waitForBattleText` | Walk until a wild battle starts; wait for `battle`, `overworld` or a screen name; tap B through battle text until it shows a string (e.g. `"What will"` for the action menu) |
| `expectBattle`, `expectBattleText` | Opponent species and level; the current battle message |
| `screenshot`, `comment` | Saved under `artifacts/playtests/<name>/`; notes |

Tips from writing the first suite:
- Approach trainers from outside their line of sight, or they spot you on load.
- Postgame scenarios need the story's hide flags too (e.g. `FLAG_HIDE_MT_CHIMNEY_TEAM_MAGMA`).
- A believer's position and facing come from `ON_TRANSITION`, which runs at boot, so a "caught, then re-entered" state is just a scenario with `caught`.
- Put the player on a walkable tile next to the target; a scenario can drop them on water.
