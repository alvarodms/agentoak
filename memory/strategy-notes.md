# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

---

## ROM Hack Vision

Create a unique, interesting Pokémon Emerald ROM hack that changes the gameplay experience in meaningful ways. Possible directions:

1. **Radical encounter overhaul** — Change wild Pokémon to create a unique regional ecosystem, using Pokémon not normally found in Emerald
2. **Custom starter trio** — Replace Treecko/Torchic/Mudkip with a custom or unexpected set ✅ DONE (Larvitar/Bagon/Beldum)
3. **Difficulty hack** — Increase trainer difficulty, add level scaling, improve AI
4. **New narrative twist** — Use scripting to add custom events, NPC dialogue, story beats
5. **Expanded Pokédex** — Use Gen 4+ Pokémon species that are already in the ROM data

## Easiest Entry Points (low risk, high impact)

### 1. Wild Pokémon (`data/wild_encounters.json`)
- **Effort**: Very low — edit JSON file
- **Impact**: Completely changes what players encounter in every area
- **Risk**: Low — just data change, no logic change
- **How**: Change `"species"` values in the JSON to different `SPECIES_*` constants

### 2. Starter Pokémon (`src/starter_choose.c`) ✅ DONE
- **Result**: Changed to Larvitar / Bagon / Beldum — all compiled successfully
- `sStarterMon[]` is at lines 113–118, `SPECIES_*` constants work directly

### 3. Trainer Pokémon Data
- **Location**: `data/trainers.h` or equivalent trainer data files
- **Effort**: Moderate — many trainers to change
- **Impact**: Changes battle difficulty and variety
- **Risk**: Low — data change

## Implementation Order (updated after Cycle 4)

1. ~~**Cycle 2**: Change starters to something unexpected (quick win, low risk)~~ ✅ DONE
2. ~~**Cycle 3**: Modify wild encounters for Route 101/102~~ ✅ DONE
3. ~~**Cycle 4**: Full Hoenn-wide encounter overhaul (Routes 103–134 + all ocean)~~ ✅ DONE (73 tables)
4. **Cycle 5**: Trainer team overhaul — change gym leaders and key trainers to use rare/powerful Pokémon matching the Legends theme
5. **Later**: Professor Birch text edits, difficulty tuning, Victory Road encounters, dungeon encounters (caves, Mt. Chimney, etc.)

## Thematic Direction: "The Pseudo-Legendary Run"

With Larvitar/Bagon/Beldum as starters, the hack has a clear identity: pseudo-legendary and powerful Pokémon from various generations. This could extend to:
- Wild encounters featuring rarer/stronger Pokémon earlier
- A harder overall difficulty curve to match the powerful starters
- Trainer teams that also use rare/powerful Pokémon

## Things to Investigate

- `src/new_game.c` — understand how new game initialization works (starter gifting, initial party setup)
- `data/trainers/` — find trainer Pokémon data format
- `constants/species.h` — verify which species IDs exist for non-Hoenn Pokémon
- `src/pokedex.c` — can we add new Pokédex entries for non-Hoenn mons?
- NPC dialogue for Professor Birch — does he name the starters explicitly? Would need text edits.
- ~~Route 101/102 wild encounters — first place to change for thematic consistency~~ ✅ DONE

## Technical Lessons Learned

### Cycle 1
- Wild encounter data is in `data/wild_encounters.json` — a JSON file processed during build. Clean format, easy to edit.
- Starter selection uses a simple array `sStarterMon[3]` at the top of `src/starter_choose.c`
- The build has two modes: classic (agbcc) and modern (arm-none-eabi-gcc). The default should work.
- Battle system is massive (194KB for battle_main.c alone) — don't modify unless necessary
- The scripting system in `data/` uses `.s` assembly format — learning curve but powerful
- Pokémon data uses a 4-substruct encrypted format — access via `GetMonData()`/`SetMonData()` helpers

### Cycle 2
- `SPECIES_LARVITAR`, `SPECIES_BAGON`, `SPECIES_BELDUM` are all valid constants that compile without issue
- Gen 2/3 pseudo-legendary pre-evolutions are fully supported in the Emerald ROM data
- The starter change required only editing `sStarterMon[]` — no other files needed updating
- Build with `make -j$(nproc)` from `pokeemerald/` works; incremental builds are fast after first full build

### Cycle 3
- `src/data/wild_encounters.json` (not `data/`) is the actual path for wild encounter data
- Route 101/102 encounters changed: Trapinch, Swablu, Ralts, Aron, Houndour, Dratini as main pool; Larvitar/Bagon/Beldum as ultra-rare (1%) wilds matching the starter species
- `SPECIES_TRAPINCH`, `SPECIES_SWABLU`, `SPECIES_HOUNDOUR`, `SPECIES_SNEASEL`, `SPECIES_MISDREAVUS`, `SPECIES_HORSEA`, `SPECIES_DRATINI` all compile cleanly
- Route 102 water_mons changed to Horsea/Dratini for Dragon-themed surfing
- The file has 12 land slots and 5 water slots per route; encounter_rate and mons array structure is straightforward JSON

### Cycle 4 — Full Hoenn Encounter Overhaul
- Used Python script to transform 73 encounter tables across all major routes in one pass
- Script approach: `json.load()` → modify species in-place → `json.dump()` — clean and reliable
- All 34+ routes updated; 0 build warnings, ROM compiled to 16MB successfully
- **Geographic design implemented:**
  - Routes 103-110: Houndour, Gastly, Electabuzz, Growlithe, Bagon, Dratini (early Legends)
  - Route 111 (desert): Larvitar, Trapinch, Sandslash, Gligar, Kangaskhan (rare)
  - Route 112: Magmar, Houndour, Growlithe, Arcanine (volcanic)
  - Route 113: Skarmory, Magnemite, Porygon (ash route)
  - Route 114: Dratini in water (60%!), Swablu, Zangoose, Seviper, Lunatone (river)
  - Route 115: Swinub, Snorunt, Jynx, Lapras (coastal ice)
  - Route 116: Gastly, Abra, Haunter, Hypno (forest ghost/psychic)
  - Route 117: Chansey, Clefairy, Togetic, Blissey (day care theme)
  - Routes 118-120: Electabuzz, Bagon, Dragonair, Absol, Lapras (escalating Dragons)
  - Route 119: Heracross, Tropius, Dragonair (rainforest power)
  - Route 120: Absol, Misdreavus, Duskull, Lapras, Milotic in fishing (ultra rare)
  - Routes 121-123: Xatu, Scyther, Heracross, Pinsir (rare Bug/Dragon)
  - Routes 124-128: Corsola, Staryu, Chinchou, Relicanth, Lapras, Wailord (deep sea)
  - Routes 129-134: Dragonair dominates water, Kingdra super rod, Milotic at 1% in Routes 133/134
- **Valid species confirmed**: SPECIES_ELECTABUZZ, SPECIES_FLAAFFY, SPECIES_GROWLITHE, SPECIES_ARCANINE, SPECIES_MAGMAR, SPECIES_MAGBY, SPECIES_JYNX, SPECIES_SWINUB, SPECIES_SNORUNT, SPECIES_KANGASKHAN, SPECIES_GLIGAR, SPECIES_ABSOL, SPECIES_SABLEYE, SPECIES_CORSOLA, SPECIES_REMORAID, SPECIES_OCTILLERY, SPECIES_MANTINE, SPECIES_LANTURN, SPECIES_CHINCHOU, SPECIES_RELICANTH, SPECIES_MILOTIC, SPECIES_BLISSEY, SPECIES_TOGETIC, SPECIES_HERACROSS, SPECIES_SCYTHER, SPECIES_PINSIR, SPECIES_DRAGONAIR, SPECIES_KINGDRA, SPECIES_LAPRAS, SPECIES_CLOYSTER, SPECIES_SHELLDER — all compile without errors

## Risk Assessment

| Change | Risk | Notes |
|--------|------|-------|
| Edit `wild_encounters.json` | Very Low | JSON data only |
| Change `sStarterMon[]` | Very Low | 3-line constant change — confirmed working |
| Modify battle scripts | Medium | Complex assembly scripting |
| Add new moves | High | Requires data + logic changes |
| Modify UI | Medium | Task state machine complexity |
| Change core logic | High | Potential for subtle bugs |
