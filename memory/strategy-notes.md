# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (Cycles 2-23): Starters, migration species on routes, trainers refreshed. Complete.
**v2.0** (Cycles 24-86): P/S split, Fairy type, 6 new species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (Cycles 89-96): Trainer held items, mid-game encounters/narrative, wild held items, Migration Tracker Quest. Complete.

---

# v4.0 — "The Migration Reaches Everywhere" (Cycles 98-107)

## Creative Thesis

The migration transformed Hoenn's routes but left caves, mountains, and deep waters frozen in time. v4.0 fills every remaining vanilla pocket — dungeons, gap routes, gym rematches, rival dialogue. A player should never enter a space and forget the migration happened.

## v3.0 Audit Summary (Cycle 97)

**Strong**: Routes 101-103, 110-121 fully migrated. All gym/E4/Champion teams overhauled with held items. Postgame quests complete. Battle Frontier functional.

**Gaps found**:
- Route 104: Zero migration species (jarring between migrated 101-103 and Petalburg Woods)
- Route 123 base: 100% vanilla (only Second Wave table has migration)
- Mt. Pyre 2F-6F + Summit: 100% Shuppet/Duskull. Zero migration.
- Seafloor Cavern (8 rooms): 100% Zubat/Golbat. The climax dungeon has zero migration.
- Meteor Falls 1F: 100% Zubat/Solrock.
- Victory Road B1F: 100% vanilla (B2F has Garchomp at 2%)
- New Mauville: 100% Voltorb/Magnemite.

## Pillars

### Pillar 1: Dungeon Encounter Overhaul (Cycles 98-100)

Replace 2-4 slots per floor with thematically appropriate migration species at low rates (5%, 4%, 1%). Keep dungeon identity.

| Dungeon | Theme | Migration Species | Cycle |
|---------|-------|-------------------|-------|
| Mt. Pyre 2F-6F, Summit | Wandering spirits | Misdreavus, Murkrow, Sneasel, Houndour | 98 |
| Route 104 | First signs | Meowth, Vulpix, Mareep, Aron | 98 |
| Route 123 base | Dark ripples | Houndour, Murkrow, Sneasel, Misdreavus | 98 |
| Seafloor Cavern (8 rooms) | Deep earth | Aron, Lairon, Pupitar, Sneasel, Larvitar | 99 |
| New Mauville | Power plant | Electabuzz, Mareep, Flaaffy | 99 |
| Meteor Falls 1F | Mountain caves | Aron, Larvitar, Sneasel, Pupitar | 100 |
| Victory Road B1F | The gauntlet | Pupitar, Sneasel, Shelgon, Weavile | 100 |

**Design rules**: 80%+ native species preserved. Migration at 5% slots (6-7) and 1% slots (10-11). Levels match existing tables. Deeper floors = evolved forms.

### Pillar 2: Gym Leader Rematches (Cycles 101-103)

Redesign all 8 gym leaders' rematch teams (4 tiers each). Each tier 4 team includes 1-2 migration species. All use `ITEM_CUSTOM_MOVES` with competitive items.

| Leader | Type | Migration Species for Tier 4 |
|--------|------|------------------------------|
| Roxanne | Rock | Tyranitar (Dragon Dance + Sand Stream) |
| Brawly | Fighting | Machamp, Lucario |
| Wattson | Electric | Electabuzz, Ampharos |
| Flannery | Fire | Houndoom, Ninetales |
| Norman | Normal | Tauros, Ursaring |
| Winona | Flying | Murkrow/Honchkrow, Togetic |
| Tate & Liza | Psychic | Misdreavus (Ghost coverage) |
| Juan | Water | Poliwrath, Corsola |

**Technical note**: 3 unused trainer IDs available (568, 853, 854). Gym rematches use existing rematch table slots — no new IDs needed (they reuse REMATCH macro tiers).

### Pillar 3: Rival Arc Enhancement (Cycle 104)

Add 2-3 migration-specific dialogue lines to existing Brendan/May encounters:
- Route 119 (post-Weather Institute): mention Chinchou sighting
- Lilycove: reference catching a migration species (Sneasel)
- Postgame: reference Migration Tracker if player started it

### Pillar 4: Battle Speed QoL — Issue #71 (Cycle 105)

Add "Fast Battles" option to Options menu — skip anims + speed text. Reuses existing BATTLE_ANIM infrastructure. C modification to `src/battle_main.c` or options menu. Deferred to after Pillars 1-3 for risk management.

## Cycle-by-Cycle Roadmap

| Cycle | Target | Key Deliverable |
|-------|--------|-----------------|
| **98** | Pillar 1a: Route 104 + Route 123 + Mt. Pyre 2F-Summit | 9 encounter tables + gap routes |
| **99** | Pillar 1b: Seafloor Cavern (8 rooms) + New Mauville | 9 encounter tables |
| **100** | Pillar 1c: Meteor Falls + Victory Road B1F + polish | 3+ encounter tables. Pillar 1 complete. |
| **101** | Pillar 2a: Roxanne, Brawly, Wattson, Flannery rematches | 4 leaders × 4 tiers |
| **102** | Pillar 2b: Norman, Winona, Tate&Liza, Juan rematches | 4 leaders × 4 tiers |
| **103** | Pillar 2c: Rematch polish + narrative gym dialogue | Pillar 2 complete. |
| **104** | Pillar 3: Rival arc enhancement | 3 dialogue touchpoints |
| **105** | Pillar 4: Battle Speed QoL (Issue #71) | Options menu C mod |
| **106** | Full regression + balance pass | Polish |
| **107** | v4.0 release prep, README, version bump | Ship v1.0 or Demo |

## Version Strategy

- Cycle 97: Bump `minor` → v0.4.97 to mark v3.0 completion
- Cycle 107: Evaluate `major` bump → v1.0 if game feels complete start-to-finish

---

## Technical Reference

### Trainer Modification Checklist
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2–5, for Match Call)
3. Ensure levels scale for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (0–11); probabilities 20/20/10/10/10/10/5/5/4/4/1/1
- Water: 5 slots; Fishing: 10 slots
- File: `pokeemerald/src/data/wild_encounters.json`

### QoL Reference
- **Reusable TMs**: Deleted 2 lines in `src/party_menu.c`
- **Auto-Run**: `(heldKeys & B_BUTTON)` removed; `FlagSet(FLAG_SYS_B_DASH)` in `new_game.c`

### Trainer ID Constraints
- **Current state**: 876 trainer IDs (0-875), TRAINERS_COUNT=876
- Rematch table: all 5 E4 slots used. Gym leaders: 4 tiers each.

### Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ → use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ → use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ → use **Shell Bell** or type-boost items
- ~~Black Sludge~~ → use **Leftovers**
- ~~Light Clay~~ → no equivalent; use Lum Berry
