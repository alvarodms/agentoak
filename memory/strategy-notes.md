# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

> **Maintenance**: Keep this file under ~200 lines. Delete completed roadmap items older than 10 cycles. Remove research/analysis for decisions already made. This file is for *current* vision, *active* plans, and *live* technical reference — not a historical archive.

---

# LEGENDS OF HOENN — v1.0 (Complete)

**Vision**: Pokémon Emerald reimagined with powerful migrant species on every route. Starters: Larvitar/Bagon/Dratini (pseudo-legendary lines). Every encounter worth catching. Every trainer a real fight.

**Thematic conceit**: A migration event has disrupted Hoenn's ecosystem. Rare Pokémon from across the world have arrived. Gym leaders adapted. Birch is studying it. The player arrived at the perfect moment.

**Starter → Rival correspondence** (Cycle 12): Larvitar→rival gets Bagon; Bagon→rival gets Dratini; Dratini→rival gets Larvitar.

**Encounter philosophy**: Routes as ecosystems. 101–103 introductory, 104–116 escalating, 117–123 peak diversity. Dungeons are specialist habitats.

**Cycles 2–38 scope** (see `completed-work.md` for files): All encounters (73 routes + 34 dungeons), gym/Elite Four/rival/villain teams, trainer + wild held items (164 species), NPC migration dialogue arc (Birch→Wallace), reusable TMs, TM prices halved, Earthquake pre-Gym 4, auto-run from first step. **v1.0 released.**

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

---

# LEGENDS OF HOENN v2.0 — Game Design Document

## Creative Manifesto

v2.0 is not a port. It is a redesign built on a new foundation.

The physical/special split changes how every battle feels. Fairy type introduces genuine counterplay to the Dragon-heavy ecosystem. The expanded species pool gives the migration narrative the depth it deserves.

---

## Postgame — Elite Four Rematches

**Tier 1 (Cycle 49)**: All 5 members have 6-mon rematch teams (lv60-71). Gen 3 only.

**Tier 2 (Cycle 50)**: All 5 members have escalated teams (lv72-82). Key changes:

| Leader | Tier 2 Highlights |
|--------|-------------------|
| Sidney | Crawdaunt(SD)/Sharpedo/Absol(CB)/Houndoom/Umbreon(trap)/Tyranitar(DD+Iron Tail ace) |
| Phoebe | Banette(WoW)/Sableye(CM)/Misdreavus(CM)/Dusclops(Curse)/Gengar(Destiny Bond)/Gengar(Hypnosis ace) |
| Glacia | Glalie(Explode)/Jynx(Lovely Kiss+CM)/Cloyster(Spikes+Explode)/Piloswine/Walrein(Sheer Cold)/Lapras(Sheer Cold ace) |
| Drake | Flygon(CB)/Altaria(DD)/Kingdra(Rain)/Salamence×2(mixed+DD)/Dragonite(DD+Outrage+Liechi ace) |
| Wallace | Starmie/Tentacruel/Ludicolo(Rain+Swift Swim)/Gyarados(DD+Waterfall)/Kingdra(Rain)/Milotic(Moonblast ace) |

**Rematch table**: Tier 1 in slot 2, tier 2 in slots 3-5. Two future tiers could fill slots 4-5.

---

## v2.0 Roadmap — Status

| Priority | Feature | Status |
|----------|---------|--------|
| 1 | Physical/Special split | **DONE** (Cycle 43) |
| 2 | Fairy type engine + retypes + moves | **DONE** (Cycles 44, 46) |
| 3 | Fairy encounter corridors | **DONE** (Cycle 49) |
| 4 | Elite Four rematches tier 1 | **DONE** (Cycle 49) |
| 5 | Elite Four rematches tier 2 | **DONE** (Cycle 50) |
| 6 | Second Wave dialogue (3 NPCs) | **DONE** (Cycle 42) |
| 7 | Postgame narrative polish (5 NPCs) | **DONE** (Cycle 50) |
| 8 | New species (Gible, Riolu, etc.) | Not started |
| 9 | Elite Four rematches tiers 3-4 | Not started |
| 10 | Gym leader rematches | Not started |

---

## Future Directions

### New Species Migration (Gen 4/5)
| Species | Location | Rate | Narrative Role |
|---------|----------|------|----------------|
| Gible | Meteor Falls B1F-2R | 8% | Garchomp's vanguard |
| Garchomp | Victory Road B2F | 5% | Dragon apex predator |
| Riolu | Route 116 | 8% | Scout sensing disruption |
| Weavile | Shoal Cave | 8% | Cold-zone apex hunter |

### Narrative Enhancements
- The Second Wave mid-game intensification event (Route 118 trigger)
- Migration intensification on later routes
- Postgame research quest for Birch

### Gym Leader Rematches
- Match Call rematches for all 8 gym leaders with post-migration teams
- Scale from lv55-65 (tier 1) to lv75-85 (tier 4)
