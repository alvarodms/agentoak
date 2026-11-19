# v3.7 coda "Storm tail" (built C383, creative backlog 373)

From Shelly's defeat until the first Fortree visit, Route 119 holds light rain whatever the RTC weather cycle says. The vanilla COORD_EVENT_WEATHER_SUNNY tiles at the Fortree edge (35,8 35,9 36,6 36,7) clear it, so the player walks out of the rain into Fortree's LOTAD DOLLs. No new text, flag, var, C or harness change. WEATHER_RAIN only (no drought, rainbow, sunny-clouds or thunderstorm for this beat).

**Gate**: VAR_WEATHER_INSTITUTE_STATE >= 1 (Shelly beaten; 2F sets 1, Route119_OnTransition moves 1 -> 2) AND FLAG_VISITED_FORTREE_CITY clear (set by FortreeCity_OnTransition). Badge 6 needs Fortree, so the omen branch (FLAG_BADGE06_GET, TESSA) never overlaps.

## Game changes
- `data/maps/Route119/scripts.inc`
  - Route119_OnTransition: `call Route119_EventScript_TrySetStormTail` after `special SetRoute119Weather`, before `end` (the badge-6 omen goto stays first). No doweather: map init applies the saved weather (also on a connection walk-in, overworld.c LoadMapFromCameraTransition runs OnTransition before DoCurrentWeather).
  - New globals after MoveInstituteWorkersDownstairs: `Route119_EventScript_TrySetStormTail` (gate, `setweather WEATHER_RAIN`, return) and `Route119_EventScript_StormTailStep` (gate, `setweather WEATHER_RAIN` + `doweather`, end; RunScriptImmediately, no waits).
  - Route119_EventScript_MigrationSighting end: `setweather WEATHER_ROUTE119_CYCLE` / `call Route119_EventScript_TrySetStormTail` / `doweather`, so Hartley's thunderstorm eases to light rain instead of possibly snapping to sun.
- `data/maps/Route119/map.json`: 12 immediate triggers (`"var": "0"`, elevation 3, script StormTailStep) appended at the END of coord_events, one per ROUTE119_CYCLE tile: 29,13 30,13 31,13 32,13 34,13 15,133 16,132 17,131 18,130 19,131 20,132 21,133. Each comes after its tile's weather event in the array, so the weather event runs first and the trigger re-applies rain (field_control_avatar.c GetCoordEventScriptAtPosition). SUNNY tiles untouched.
- `scripts/beats.json` row `v37-storm-tail` (place, speaker none, gate {var >= 1, unsetFlag FLAG_VISITED_FORTREE_CITY}, tiles = the 4 SUNNY edge tiles, seeFirst); `scripts/lib/beats.cjs` MIN_ROWS 22. v3.7 RM now 1 fight + 1 place.

## Findings (C383)
- **Rival order**: the Institute door 6,32 is reached over the bridge at 16-20,33-34 from the east bank (24-31,32-42); the rival triggers 25-26,31 (elevation 0 = any) are the only way north out of that pocket and the Institute path never touches them. So Shelly normally comes BEFORE the rival (the vanilla order), and the Route 119 rival fight now happens in storm-tail rain (battle copies overworld rain), the same as on a vanilla rain day. Accepted; no rival-specific code.
- **Wild battles** on Route 119 after Shelly are in rain until Fortree, the same as a vanilla rain day.
- **Harness cycle stage**: a fresh harness save is on weatherCycleStage 0 (Route 119 cycle = WEATHER_SUNNY), confirmed by route119-storm-tail-before-shelly (SUNNY after the Institute warp and on 31,13; stages 1-3 are all rain).
- Booting the fortree_arrival checkpoint on Fortree 0,8 sets FLAG_VISITED_FORTREE_CITY at boot (FortreeCity_OnTransition), so storm-tail tests boot on Route 119 (scenario map/x/y) instead. The dolls also need FLAG_ROUTE104_SKEPTIC_TURNED.
- Path used: 31,14 -> 31,13 -> column 31 to 31,8 -> row 8 to 35,8. Out of the sight of FABIAN (32,15, left along row 15), YASU (28,14, tree disguise, sight 1), HIDEO (29,6, down column 29).

## Playtests (pokeemerald/playtests/)
- `route119-storm-tail-in-order`: boots Route 119 31,14 (fortree_arrival, flag cleared, SKEPTIC_TURNED set): RAIN on boot, RAIN on 31,13, RAIN at 34,8, SUNNY at 35,8, RAIN again back on 31,13, SUNNY at 35,8, walk into Fortree 0,8 (0 boxes, 3 dolls, flag set), back to Route 119 and 31,13 gives SUNNY (vanilla stage 0). Screenshots st-1..st-4.
- `route119-storm-tail-before-shelly` (control): weather_institute_2f checkpoint, warp to 31,14: SUNNY, then SUNNY on 31,13.
- `route119-storm-tail-hartley`: boots 27,27 with FLAG_VISITED_FORTREE_CITY and FLAG_ROUTE119_MIGRATION_EVENT clear, walks onto 27,26: Hartley's 4 existing boxes ("This is no ordinary storm!"), flag set, then RAIN.
- Suite 114/114 at C383 (npm test 499/499, build:check clean).

## Index row
| v3.7 coda Storm tail (Route 119 rain until Fortree) | 383 | Route119/scripts.inc, Route119/map.json, beats.json, lib/beats.cjs, 3 playtests | this file |
