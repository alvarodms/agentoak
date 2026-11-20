# Codebase Facts

> **Index** (split C380, tech-debt 352). Short always-true facts here; everything else lives in one topic file per system under `memory/codebase-facts/`. Read only the topic you need. Add a new fact to its topic file (or a new topic file + one index line), never back here unless it is a one-line always-true rule.

## Always true

- **Species**: 27 files per species via `generate_species.cjs` + 6 manual entries (pokemon.c ×4, pokemon_icon.c ×2); a custom species also needs a cry_ids.h entry or it cries as Growlithe. Check: `scripts/verify_species.sh <NAME>` (no `SPECIES_` prefix).
- **Trainers**: three files must match (`opponents.h` IDs, `trainers.h` metadata, `trainer_parties.h` party); never bump TRAINERS_COUNT (891): SYSTEM_FLAGS follow TRAINER_FLAGS_END, a bump breaks saves. Free slots: `node scripts/check_trainer_slots.cjs` (633/634/853 at C380). Trainer mons always get ability slot 0.
- **Text**: `\n` line 2, `\l` line 3+, `\p` new page, `$` end; no other `\X` escape; no ASCII `"`, no em-dash (use `--`); field lines ≤ 30 chars by `make check_text_width`.
- **Temp state**: FLAG_TEMP_* (0x00-0x1F) and VAR_TEMP_* reset on every map load; script scratch vars are only VAR_0x8000-0x800B.
- **Wild slots**: Land 12, Water 5, Fishing 10 (`src/data/wild_encounters.json`).
- **Sighted trainers**: an object script with sight > 0 must START with `trainerbattle` (state branches go after it; FortreeCity uses twin objects).
- **Weather**: battles copy the overworld weather (GetCurrentWeather(), or a per-trainer override from sTrainerBattleWeather via GetBattleStartWeather, C384); OnTransition `setweather` overwrites the map header's weather because LoadMapFromWarp sets saved weather before RunOnTransitionMapScript (src/overworld.c, verified C380).
- **Playtest boot** runs the start map's ON_TRANSITION; harness edits in src/emulator/ can be rolled back by the runner gate.
- **Before modifying a pokeemerald file**: check completed-work.md and `git log`, then read it.

## Topic files

- [Species and moves](codebase-facts/species-and-moves.md) — species registration, cry IDs, P/S split, MOVES_COUNT, TM/HM fields, evolution methods, battle animation scripts, species count
- [Trainers and slots](codebase-facts/trainers-and-slots.md) — three-file system, capacity + reclaim-by-hand recipe, doubles personalities, tag battles ≤3 mons, villain configs, rivals, sighted twin objects, Pokénav leader entries, trainer mon internals, Reckoning rematches, trainer cap decision
- [Battle engine](codebase-facts/battle-engine.md) — custom abilities (patterns, switch-in message, "was hit" flag), EXP caps, Challenge scaling + Bag lock, trainer AI vs status moves, overworld → battle weather, per-trainer battle weather table (C384), Gen 3 AI move scoring
- [Maps and objects](codebase-facts/maps-and-objects.md) — FortreeCity temp flags, Route 119 weather cycle + coord weather/trigger order, wild encounter rules + conditional tables, Shoal Cave tides, repel system, legendary/static encounter recipe, in-game trades, field-move targets, FACE_* after faceplayer, ON_LOAD metatile traces, DOLL stand-ins, postgame show/hide pattern
- [Scripting](codebase-facts/scripting.md) — dialogue format, flag system layout, event macros, coloured text, specials table, ON_RESUME arms / ON_FRAME fires, msgbox overwrites gStringVar4
- [Field Notes](codebase-facts/field-notes.md) — FIELD NOTES key item, pages, Red Ink payoff, First Ink pen moment, margins, p.3 doubt, match call/Birch rating text, gStringVar4 budget, dex-state believers + DexBelieverPlace
- [Harness](codebase-facts/harness.md) — playtest steps and gotchas (talk, useKeyItem, findWildBattle/catchWild, warp, pokenavCall, checkpoints + expectBoxCount, connection crossings, battle menus, battleTurns, hpPercent + battleSwitch, party ability, expectFieldWeather, expectBattleSummary + battleSummaries), PLAYTEST presets, boot/round-trip/sighting recipes
- [Lints](codebase-facts/lints.md) — check_all order, check_encounter_odds, check_object_tiles, check_playtest, map_scan, beats.json + check_beats (loader API, shape ids, rules, b5Exempt), generators (species/trainer/NPC dialogue), check_dialogue quirks
