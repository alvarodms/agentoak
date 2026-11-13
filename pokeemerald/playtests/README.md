# Playtests

Scripted checks replayed against the built ROM in a headless emulator (mGBA).
Each `.json` file boots a **scenario** (map, tile, flags, vars, party, bag,
Pokédex caught) straight into the overworld, runs **steps**, and checks what
happened. Run them with `npm run playtest` from the repo root
(`-- --filter skeptic` for some); the report and screenshots go to
`artifacts/playtests/`.

After every cycle's build the runner replays the whole suite; each failing
playtest gets one `playtest-failure` issue, closed automatically once it passes
again. The cycle run's `playtests` artifact (kept 14 days) has the report and
screenshots.

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
`defeatedTrainers` (`["TRAINER_X"]`, sets their trainer flag), `registeredItem`
(`"ITEM_X"` already on SELECT), `name`, `gender` and `money`. A party mon takes `species`, `level`, optional
`item`, `moves` (up to 4 `MOVE_X`) and `ability` (`1` = the species' first ability, `2` = its second; omit it
and the game picks at random, so pin it when a test depends on the ability). Every name is a real constant from `include/`; raw
numbers are rejected.

The full schema, with every option, is `StepSchema` in `src/emulator/playtest.ts`.

| Step | Does |
|---|---|
| `face`, `walk` (+`tiles`) | Turn in place, or walk tile by tile; fails if blocked. A step across a map connection or onto a warp counts (check the new map with `expectPlayer`) |
| `walkTo` (`{"x": 19, "y": 34}`, +`yFirst`) | Walk to a tile on this map, along the row first (or the column first with `"yFirst": true`); fails if blocked. For a start tile that varies, e.g. wherever `findWildBattle` stopped |
| `warp` (`{"map": "MAP_ROUTE104", "x": 33, "y": 50}`) | Jump to a tile on another map, as if the player had walked in: the map loads fresh, so its ON_TRANSITION/ON_LOAD scripts run and objects respawn. Use it to skip a long walk between two scenes of one playtest (needs no field script running). Fails if the player does not land on that tile |
| `press` (+`hold`, `release`, `times`), `wait` | Raw buttons and frames |
| `talk` (+`maxPresses`, default 200; `start`; `answers`) | Press A, then keep pressing until the script ends or the field screen is left (a battle), recording every message box. A battle shows as a last entry like `[screen: CB2_OverworldBasic]` (the transition); follow with `waitFor: "battle"`. `{"start": false}` picks up a script that resumes after a battle. `{"answers": ["no"]}` answers the script's YES/NO boxes in order (`"no"` presses B; boxes after the last answer get YES; an unused answer fails the step); each shows in the text as `[answered NO]` |
| `useKeyItem` (+`read`, default true; `maxPresses`; `register`) | Register an item (`"ITEM_FIELD_NOTES"`, must be in the scenario `bag`) and press SELECT, then record its message boxes like `talk`. `"read": false` only starts it, for `press`/`wait`/`screenshot` mid-read. `"register": false` doesn't register it and fails unless the game already put that item on SELECT |
| `expectText`, `expectNoText` | Substrings of the last `talk` (line breaks and curly quotes don't matter). Battle messages are never in it |
| `expectPlayer`, `expectObject` | Tile and facing; objects by `LOCALID_*` or index (+1), with `x`, `y`, `facing`, `visible`, or `"absent": true` (not loaded, i.e. hidden by its flag) |
| `expectFlag`, `expectVar`, `expectScreen` | Saved flags and vars; `gMain.callback2` by name |
| `setVar` (`{"VAR_REPEL_STEP_COUNT": 250}`) | Set saved vars mid-test. A repel count after a catch keeps the walk back through grass free of wild battles (lead level above the wild ones) |
| `findWildBattle` (+`maxSteps`, `species`), `waitFor` (+`maxFrames`) | Walk until a wild battle starts (land only); wait for `battle`, `overworld` or a screen name. With `"species": "SPECIES_X"` it runs from every other wild Pokémon and keeps walking (give the party a fast, high-level lead so running always works) |
| `catchWild` (`{"ball": "ITEM_MASTER_BALL"}`) | In a wild battle: BAG, Poké Balls pocket, throw that ball, answer NO to the nickname, close the Pokédex page, and stop once the field is back (free, or a field script such as an ON_FRAME cue has started; follow with `talk: {"start": false}`). Fails if the ball isn't in the bag or the catch fails. Its battle messages ("Gotcha!") are the step's text for `expectText` |
| `waitForBattleText` (+`maxFrames`, `fresh`) | Tap B through battle messages until one contains a string. `"fresh": true` ignores the message already showing, for the *next* `"What will"` |
| `expectBattle`, `expectBattleText` | Opponent species and level; the current battle message only (no history) |
| `expectBattleWeather` | `"none"`, `"rain"`, `"sun"`, `"sandstorm"` or `"hail"` (gBattleWeather), e.g. after `waitForBattleText: "hail"` |
| `screenshot`, `comment` | Saved under `artifacts/playtests/<name>/`; notes |

**Fighting a battle.** From the action menu (`waitForBattleText: "What will"`):
`press A` picks FIGHT, then `press A` uses move slot 1 (give the party mon the
move you want first with `moves`). Then wait with `{"waitForBattleText": "What
will", "fresh": true}` for the next turn, or for a message like `"fainted"`.
When the foe's mon faints, the game asks whether to switch: `press B` answers
no. RUN is `RIGHT`, `DOWN`, `A` on the action menu. The opponent's AI and moves
(Protect, priority) change how many turns a fight takes, so use a party that
wins in one hit when the fight isn't the point.

Tips from writing the first suite:
- Approach trainers from outside their line of sight, or they spot you on load.
- Postgame scenarios need the story's hide flags too (e.g. `FLAG_HIDE_MT_CHIMNEY_TEAM_MAGMA`).
- A believer's position and facing come from `ON_TRANSITION`, which runs at boot, so a "caught, then re-entered" state is just a scenario with `caught`. The same goes for "after the battle, leave and come back": use `defeatedTrainers`.
- Put the player on a walkable tile next to the target; a scenario can drop them on water.
- Text prints at the default (mid) speed; `talk` handles it, but raw `press`/`wait` scripts need a few hundred frames per box.
- Leaving through an indoor exit mat: walk onto the mat, then `press DOWN` (the warp fires on the press, not the step). `wait` a few hundred frames and check the new map with `expectPlayer`. Coming back in is an ordinary `walk` onto the door.
- Not possible yet: checking the bag, surfing or fishing, a battle message history. **Add the step yourself** in `src/emulator/playtest.ts` (schema + `runStep()` + a unit test + a row here) when a playtest needs it.
