# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

> **Maintenance**: Keep this file under ~200 lines. Delete completed roadmap items older than 10 cycles. Remove research/analysis for decisions already made. This file is for *current* vision, *active* plans, and *live* technical reference — not a historical archive.

---

# LEGENDS OF HOENN — Vision

**v1.0**: Pokémon Emerald reimagined with powerful migrant species on every route. Starters: Larvitar/Bagon/Dratini. Every encounter worth catching. Every trainer a real fight. **Released.**

**v2.0**: Physical/special split, Fairy type, 4 new species (Riolu/Lucario/Weavile/Gible/Gabite/Garchomp), all trainers refreshed, Second Wave event, Battle Frontier fixes, move category icons. **All 17 roadmap items complete.** See `completed-work.md` for file-level detail.

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
- **Current state**: 874 trainer IDs (0x500-0x869)
- Rematch table: all 5 E4 slots used. Gym leaders: 4 tiers each.

---

## Completed Features (Reference Only)

### Battle Frontier P/S Split Audit
Punch batch done (Cycle 80). Crunch/Shadow Ball/Hyper Beam batch done (Cycle 85, 65 sets). Complete audit finished.

### New Species Pipeline
**Checklist**: `memory/pokemon-knowledge/species-addition-pipeline.md` — 25 steps, ~29 source files per 2-species family. All planned species shipped.

### Second Wave Event
**Full spec:** `memory/second-wave-design.md`. All implementation complete (Cycles 63-65).

### Birch Postgame Research Quest — COMPLETE (Cycle 84)
5-stage postgame quest investigating the migration's cause. Flags: `FLAG_BIRCH_QUEST_*` (0x022-0x027). Stages 1-3 non-linear, Stage 4 requires all three, Stage 5 = final reward (Master Ball). Full design doc: `memory/birch-quest-dialogue.md`. File changes: `memory/completed-work/birch-quest.md`.

---

## Future Directions

- ~~Battle Frontier P/S split remaining entries (Crunch/Shadow Ball)~~ **COMPLETE (Cycle 85)**
- ~~Community feedback: Dratini starting move + Growlithe Roar-spam~~ **COMPLETE (Cycle 86, Issues #69/#70)**
- **v3.0 planning** — next cycle should develop the v3.0 vision and roadmap
- Additional postgame content building on the quest framework
- Polish pass: trainer held items audit, wild held items
