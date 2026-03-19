# Codebase Facts

Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.

---

## Wild Pokémon Held Item System (Cycle 31)

**Core System**: Wild Pokémon held items are automatically assigned via the `SetWildMonHeldItem()` function in `src/pokemon.c` (lines 6664-6717).

**Species-based Assignment**: Each species has `.itemCommon` and `.itemRare` fields in `gSpeciesInfo[]` array defined in `src/data/pokemon/species_info.h`.

**Probability System**:
- Normal: 45% no item, 50% common item (itemCommon), 5% rare item (itemRare)
- With Compound Eyes ability: 20% no item, 60% common item, 20% rare item
- Special case: If itemCommon == itemRare and != ITEM_NONE, then 100% chance to hold that item

**Implementation Pattern** (Cycle 31): All 164 wild encounter species updated with thematic held items:
- **Type-based items**: Fire types get ITEM_CHARCOAL, Electric get ITEM_MAGNET, Water get ITEM_MYSTIC_WATER, etc.
- **Pseudo-legendary special cases**: Dratini/Dragonair/Bagon/Shelgon/Larvitar/Pupitar get type boosters (common) + ITEM_LEFTOVERS (rare)
- **Evolution items**: Magmar gets ITEM_CHARCOAL/ITEM_FIRE_STONE, Electabuzz gets ITEM_MAGNET/ITEM_THUNDER_STONE, Scyther gets ITEM_METAL_COAT
- **Normal type fallback**: ITEM_ORAN_BERRY for Normal-type species

**Key insight**: The system was already fully implemented — just needed species data updates, not code changes. No modifications to wild encounter JSON or core encounter logic required.

**Automation**: Python script `update_held_items.py` successfully updated all species definitions with regex pattern matching for species types and item assignments.

---

## pokeemerald-expansion v1.15.0 — Architecture Incompatibility (Cycles 40–41)

**Critical discovery from Cycle 41**: The expansion and vanilla pokeemerald are architecturally incompatible at the C struct level. You cannot mix vanilla source files with expansion headers.

### Struct Incompatibilities (Confirmed by Build Errors)

**`struct BattleResources`** (fundamental battle system structure):
- **Vanilla**: `.battleScriptsStack` field
- **Expansion**: `.ai`, `.battleHistory`, `.AI_ScriptsStack` fields
- **Impact**: All battle AI code is incompatible

**Global Variables Renamed**:
- `gBattleMoves`, `gActiveBattler`, `gDisableStructs`, `gTrainerBattleOpponent_A` — renamed or removed
- Constants like `AI_USER`, `AI_TARGET`, `EFFECT_EXPLOSION` — expansion-only

**Battle AI System**: Completely rewritten in expansion. The vanilla `src/battle_ai_script_commands.c` is 100% incompatible — 200+ compile errors.

### Migration Conclusion

**Not possible** via file copying (rsync). The expansion requires treating it as an entirely new codebase and **porting LoH content into it** — not overlaying expansion files on top of LoH.

**Options**: (a) True `git merge` from expansion remote with full conflict resolution, or (b) Abandon expansion migration and stay on vanilla.

---

## Move Implementation System (Cycles 45-46)

**Adding a new move requires updating 6 files** (all arrays are sized by MOVES_COUNT):

1. `include/constants/moves.h` — sequential constant + update MOVES_COUNT
2. `src/data/battle_moves.h` — `gBattleMoves[]` entry with .effect, .power, .type, .accuracy, .pp, .secondaryEffectChance, .target, .priority, .flags, .category
3. `src/data/contest_moves.h` — `gContestMoves[]` entry with .effect, .contestCategory, .comboStarterId, .comboMoves
4. `src/data/text/move_descriptions.h` — string definition + `gMoveDescriptionPointers[]` entry (uses `[MOVE_XXX - 1]` indexing)
5. `src/data/text/move_names.h` — `gMoveNames[]` entry (max MOVE_NAME_LENGTH = 12 chars)
6. `src/data/pokemon/level_up_learnsets.h` — `LEVEL_UP_MOVE(level, move)` entries in species arrays (ascending level order)

**Effect constants**: Must exist in `include/constants/battle_move_effects.h`. Verified working: EFFECT_HIT, EFFECT_ATTACK_DOWN_HIT (68), EFFECT_SPECIAL_ATTACK_DOWN_HIT (71).

**Flags**: FLAG_KINGS_ROCK_AFFECTED (not KINGSROCK), FLAG_MAKES_CONTACT (physical contact only).

**Move name max**: 12 characters. Examples of truncation: THUNDERPUNCH, SMELLINGSALT, FEATHERDANCE.

---

## Dialogue Editing System (Cycles 24–26)

**System overview**: NPCs use `.string` labels that reference static text. Event scripts call `MSGBOX_NPC` or `MSGBOX_DEFAULT` commands pointing to these labels.

**File locations**:
- **Static NPC text**: Usually in the map's `scripts.inc` file
- **Story/event text**: Can be in map scripts or dedicated `.inc` files
- **Opening sequence**: `data/text/birch_speech.inc`

**Target**: Any `.string` label in a map's `scripts.inc` used by a MSGBOX_NPC or MSGBOX_DEFAULT event script.

**Safe targets**: Labels used only in `MSGBOX_NPC` (static) are purely cosmetic — safe to rewrite. Labels used in `MSGBOX_DEFAULT` inside branching event scripts may have story importance (check surrounding logic first).

**Unsafe targets**: Labels shared between static NPC text AND dynamic event scripts (e.g. `PetalburgCity_Text_AreYouRookieTrainer` — used in both the GymBoy static NPC and the `ShowGymToPlayer` story trigger).

**Text format rules**:
- `\n` = line break within the same text box (2nd line)
- `\l` = 3rd line in the same text box (soft scroll/line)
- `\p` = press A, new text page (clear box)
- `$` = string terminator
- Keep display lines under ~35 chars for safety
- ASCII only: use `--` not em-dash, use `...` not `…`, use straight quotes

---

## Villain Dialogue System (Cycle 26)

**Villain script locations**:
- `pokeemerald/data/maps/MtChimney/scripts.inc` — Maxie confrontation
- `pokeemerald/data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc` — Archie at Museum 2F
- `pokeemerald/data/maps/SeafloorCavern_Room9/scripts.inc` — Archie final confrontation

**Script flow at Seafloor Cavern**: `ArchieHoldItRightThere` → `ArchieSoItWasYou` → `ArchieBeholdKyogre` → `ArchieYouMustDisappear` → `trainerbattle_no_intro` → `ArchieWithThisRedOrb` → orb sparkle effect → Kyogre awakening

---

## Rival Dialogue System (Cycle 25)

**File paths**:
- Route 103: `pokeemerald/data/maps/Route103/scripts.inc`
- Route 110: `pokeemerald/data/maps/Route110/scripts.inc`
- Lilycove: `pokeemerald/data/maps/LilycoveCity/scripts.inc`

---

## Professor Birch Opening Sequence (Cycle 24)

**File**: `pokeemerald/data/text/birch_speech.inc`

**Script breakdown**: Five major text blocks — intro, Pokémon introduction, your story beginning, new trainer setup, and world entry. Uses `\p` for page breaks and `\n` for line breaks.

**Design insight**: The opening speech sets the tone for the entire game. Migration-aware text here establishes the thematic foundation for encounter changes throughout the ROM hack.

---

## Wild Encounter Overhaul System (Cycles 2–8, 14–15)

**Data format**: `pokeemerald/src/data/wild_encounters.json` — parsed by build system into C data structures.

### JSON Structure

**Each route/map**: Contains `land_mons`, `water_mons`, `fishing_mons` arrays.

**Land encounters**: 12 slots (indices 0–11) with probability distribution:
- Slots 0-1: 20% each (most common)
- Slots 2-5: 10% each
- Slots 6-7: 5% each
- Slots 8-9: 4% each
- Slots 10-11: 1% each (rarest)

**Key insight from Cycle 8**: Route-by-route manual editing scales poorly. Using probability-aware design (common/uncommon/rare species placement) creates more satisfying encounter curves.

**Species validation**: All species references must use valid `SPECIES_` constants from `include/constants/species.h`.

### Design Philosophy (Established Cycle 2)

**Route progression**: 101–103 (introductory), 104–116 (escalating), 117+ (peak diversity).

**Thematic zoning**: Each route represents an ecosystem. Ocean routes favor Water-types, mountain routes favor Rock/Ground, forests favor Grass/Bug.

**Example ecosystem (Route 117)**: Volbeat/Illumise (common), Shedinja (rare), Masquerain (water) — unified by insect ecology.

---

## Trainer Battle System (Cycles 5–7, 9–10, 16–17)

**Data file**: `pokeemerald/src/data/trainer_parties.h`

### Trainer Structure

**Basic format**: Species, level, held item, moves array.

```c
{
    .species = SPECIES_ALAKAZAM,
    .heldItem = ITEM_BRIGHTPOWDER,
    .moves = {MOVE_PSYCHIC, MOVE_FUTURE_SIGHT, MOVE_RECOVER, MOVE_REFLECT}
}
```

**Key insight from Cycle 16**: Held items dramatically increase trainer difficulty. Elite trainers should have purpose-built item strategies (Leftovers for walls, Choice Band for sweepers, Brightpowder for evasion).

### AI Levels (Cycles 5–6)

**Elite trainers** (gym leaders, Elite Four): Use `.aiFlags = AI_FLAG_CHECK_BAD_MOVE | AI_FLAG_TRY_TO_FAINT | AI_FLAG_CHECK_VIABILITY`

**Regular trainers**: Use `.aiFlags = AI_FLAG_CHECK_BAD_MOVE` (basic AI only)

**Battle facility/Champion**: May add `AI_FLAG_SMART_SWITCHING` for advanced tactics.

---

## TM System (Cycles 18–22)

**TM data**: `pokeemerald/src/data/items.h` — contains price and description for each TM item.

### TM Pricing Structure (Updated Cycle 22)

**Reusable TMs**: Change in `src/party_menu.c` — deleted DestroyUsedItem() calls on TM Use and TM Teach.

**Price reduction**: All TMs reduced from 3000 to 1500 Pokédollars for easier access.

**Design insight**: Reusable + cheaper TMs encourage experimentation with movesets throughout the game, supporting the difficulty-focused trainer battles.

---

## Gym Leader Progression (Cycles 5–6)

**Design philosophy**: Each gym leader represents a milestone in the player's journey. Teams should scale in both level and sophistication.

### Gym 1–4 (Early Game)
**Roxanne**: Nosepass focus with Rock-type coverage
**Brawly**: Fighting-types with diverse coverage moves
**Wattson**: Magnezone + Electrode (double battles preparation)
**Flannery**: Arcanine ace with Fire-type support

### Gym 5–8 (Late Game)
**Norman**: Slaking + Spinda/Vigoroth (theme-breaking team)
**Winona**: Flying aces with Hurricane/Sky Attack
**Tate & Liza**: Synchronized Psychic powerhouse (double battle)
**Juan**: Water specialists with diverse subtypes

**Key insight from Cycle 6**: Late-game gym leaders should have teams comparable to Elite Four in strength — they're the final test before Victory Road.

---

## Physical/Special Split Implementation (Cycle 44)

**Core System**: Moves now use individual physical/special categorization instead of being determined purely by type.

**Technical Changes**:
- **Move data**: Added `.split = SPLIT_PHYSICAL` or `.split = SPLIT_SPECIAL` to all moves in `src/data/battle_moves.h`
- **Battle calculation**: Modified `src/battle_script_commands.c` to check move's split category instead of type
- **Hustle ability**: Updated to only affect physical moves (checks `gCurrentMove.split == SPLIT_PHYSICAL`)

**Strategic Impact**:
- **Special Fire moves**: Overheat, Eruption now use Special Attack (previously physical due to Fire type)
- **Physical Normal moves**: Return, Explosion now use Attack (giving Normal types proper physical options)
- **Mixed coverage**: Pokémon can now have true mixed movesets (e.g., Salamence with physical Dragon Claw + special Fire Blast)

**Compatibility**: All existing trainers and wild Pokémon automatically benefit — no need to update individual movesets.

**Build verification**: Successfully compiled and tested — confirms the implementation is complete and functional.