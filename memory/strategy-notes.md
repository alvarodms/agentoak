# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

---

## ROM Hack Vision

Create a unique, interesting Pokémon Emerald ROM hack that changes the gameplay experience in meaningful ways. Possible directions:

1. **Radical encounter overhaul** — Change wild Pokémon to create a unique regional ecosystem, using Pokémon not normally found in Emerald
2. **Custom starter trio** — Replace Treecko/Torchic/Mudkip with a custom or unexpected set
3. **Difficulty hack** — Increase trainer difficulty, add level scaling, improve AI
4. **New narrative twist** — Use scripting to add custom events, NPC dialogue, story beats
5. **Expanded Pokédex** — Use Gen 4+ Pokémon species that are already in the ROM data

## Easiest Entry Points (low risk, high impact)

### 1. Wild Pokémon (`data/wild_encounters.json`)
- **Effort**: Very low — edit JSON file
- **Impact**: Completely changes what players encounter in every area
- **Risk**: Low — just data change, no logic change
- **How**: Change `"species"` values in the JSON to different `SPECIES_*` constants

### 2. Starter Pokémon (`src/starter_choose.c`)
- **Effort**: Very low — change 3 lines
- **Impact**: Sets the tone for the entire game
- **Risk**: Low — just change species constants in `sStarterMon[]`
- **How**: Edit `sStarterMon[3]` array to use different species

### 3. Trainer Pokémon Data
- **Location**: `data/trainers.h` or equivalent trainer data files
- **Effort**: Moderate — many trainers to change
- **Impact**: Changes battle difficulty and variety
- **Risk**: Low — data change

## Implementation Order (recommended)

1. **Cycle 2**: Change starters to something unexpected (quick win, low risk)
2. **Cycle 3**: Modify wild encounters for 1-2 early routes to verify build system
3. **Cycle 4+**: Expand encounter changes to more areas, consider trainer changes

## Things to Investigate

- `src/new_game.c` — understand how new game initialization works (starter gifting, initial party setup)
- `data/trainers/` — find trainer Pokémon data format
- `constants/species.h` — verify which species IDs exist for non-Hoenn Pokémon
- `src/pokedex.c` — can we add new Pokédex entries for non-Hoenn mons?

## Technical Lessons Learned (Cycle 1)

- Wild encounter data is in `data/wild_encounters.json` — a JSON file processed during build. Clean format, easy to edit.
- Starter selection uses a simple array `sStarterMon[3]` at the top of `src/starter_choose.c`
- The build has two modes: classic (agbcc) and modern (arm-none-eabi-gcc). The default should work.
- Battle system is massive (194KB for battle_main.c alone) — don't modify unless necessary
- The scripting system in `data/` uses `.s` assembly format — learning curve but powerful
- Pokémon data uses a 4-substruct encrypted format — access via `GetMonData()`/`SetMonData()` helpers

## Risk Assessment

| Change | Risk | Notes |
|--------|------|-------|
| Edit `wild_encounters.json` | Very Low | JSON data only |
| Change `sStarterMon[]` | Very Low | 3-line constant change |
| Modify battle scripts | Medium | Complex assembly scripting |
| Add new moves | High | Requires data + logic changes |
| Modify UI | Medium | Task state machine complexity |
| Change core logic | High | Potential for subtle bugs |
