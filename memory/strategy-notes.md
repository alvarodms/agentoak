# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0**: Starters (Larvitar/Bagon/Dratini), migration species on every route, all trainers refreshed. **Released.**

**v2.0**: P/S split, Fairy type, 6 new species, Second Wave event, Battle Frontier audit, move category icons, Birch Quest, reusable TMs, auto-run. **All 17 items complete.** See `completed-work.md`.

---

# v3.0 — "The Migration Deepens" (Cycles 89-97)

The migration isn't over — it's intensifying. Trainers adapt. New artifacts arrive. Researchers race to understand.

## Four Pillars

1. **Trainer Strategic Depth** — Systematic held items audit (Gym→E4→Champion)
2. **Mid-Game Journey Polish** — Routes 110-120 encounters, difficulty curve, narrative beats
3. **Exploration Rewards** — Wild held items on migration species
4. **Expanded Postgame** — Migration Tracker quest chain

---

## Pillar 1 — Trainer Held Items Audit ✅ COMPLETE (Cycles 89-90)

### Philosophy (Progression Tiers)

| Tier | Who | Items | Intent |
|------|-----|-------|--------|
| 1: Survival | Route trainers, Badges 1-2 | Oran/Sitrus Berry | Teaches items matter |
| 2: Type Boost | Badges 3-5 aces | Charcoal, Magnet, Soft Sand | Aces hit harder |
| 3: Strategic | Badges 6-8, villain bosses | Lum Berry, White Herb, Leftovers, Choice Band | Puzzle moments |
| 4: Competitive | E4, Champion, rematches | Choice Band, Leftovers, Shell Bell, Scope Lens | Full competitive |

**Rule: Hard = Smart, Not Cheap.** No Bright Powder evasion. Items reward reading the situation.

### Gym/E4/Rival item specs — see `completed-work/trainer-parties.md` for details.

---

## Pillar 2 — Mid-Game Journey Polish (IN PROGRESS)

### Target Level Curve

Badges 1-3: Lv12→19. Badge 4 (Flannery 29): 26-29. Badge 5 (Norman 31): 28-31. Badge 6 (Winona 33): 30-33. Badges 7-8: 37-46. E4: 48-55 vs leaders at 56-58.

### Encounter Audit ✅ DONE (Cycles 91-92)
Routes 110-113, 119-120 audited. 8+ species per route, 2+ migrants, good level spread.

### Narrative Beats (3 NPCs)

**Beat 1 — Lavaridge Town** ✅ DONE (Cycle 94): Researcher cataloguing first-wave species near hot springs.

**Beat 2 — Fortree City** ✅ DONE (Cycle 94): Bird keeper notes Murkrow/Skarmory displacing native Swellow.

**Beat 3 — Weather Institute**: Scientist detects energy signature from Cave of Origin. Foreshadows postgame quest. **TODO — Cycle 95.**

### Double Battles ✅ DONE (Cycle 94)

- **Route 110**: Twins Mia & Lily — Growlithe Lv16 + Poliwag Lv16
- **Route 119**: Sr. and Jr. Lila & Roy — Houndour Lv27 + Snubbull Lv27

---

## Pillar 3 — Wild Held Items ✅ COMPLETE (Cycle 93)

19 migration species with thematic held items. See `completed-work/wild-held-items.md`.

---

## Pillar 4 — Migration Tracker Quest

### Concept
After completing Birch Research Quest, Birch asks the Champion to catalogue migration species for a field guide.

### Structure (3 stages, flag-gated)

**Stage 1 — First Wave Pioneers**: Catch any 5 of: Growlithe/Vulpix, Meowth, Poliwag, Nidoran♂, Teddiursa, Phanpy, Mareep, Machop, Houndour, Ralts
→ Reward: Rare Candy ×3

**Stage 2 — Second Wave Apex**: Catch any 3 of: Tyranitar, Dragonite, Salamence, Garchomp, Lucario, Weavile
→ Reward: PP Max ×2

**Stage 3 — Regional Specialists**: Catch 1 water migrant (Corsola/Lanturn), 1 cave migrant (Riolu/Gible), 1 forest migrant (Scyther/Heracross)
→ Reward: Shell Bell (if not obtained) or Master Ball

### Implementation
- Flags: `FLAG_MIGRATION_TRACKER_*` (0x028-0x02B)
- Script: Birch Lab, branching on caught Pokédex entries
- Uses existing Birch Quest infrastructure — no new maps needed

---

## Ten-Cycle Roadmap

| Cycle | Objective | Pillar | Status |
|-------|-----------|--------|--------|
| **89** | Gym 1-5 + Rival 1-3 held items | P1 | ✅ DONE |
| **90** | Gym 6-8 + E4 + Champion + Rival 4 held items | P1 | ✅ DONE |
| **91** | Mid-game encounter audit (Routes 110-113) | P2 | ✅ DONE |
| **92** | Mid-game encounter audit (Routes 119-120) | P2 | ✅ DONE |
| **93** | Wild held items — ALL 19 migration species | P3 | ✅ DONE |
| **94** | Mid-game narrative NPCs + 2 double battles | P2 | ✅ DONE |
| **95** | Weather Institute narrative + mid-game polish | P2 | TODO |
| **96** | Migration Tracker Quest (all 3 stages) | P4 | TODO |
| **97** | Polish pass + community triage | All | TODO |
| **98** | Buffer / stretch goals | All | TODO |

---

## Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ → use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ → use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ → use **Shell Bell** or type-boost items
- ~~Black Sludge~~ → use **Leftovers**
- ~~Light Clay~~ → no equivalent; use Lum Berry

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
