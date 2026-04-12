# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v8.0** (C2-143): Core hack — starters, P/S split, Fairy, 6 new species, Battle Frontier, legendary saga (beasts->Ho-Oh->Groudon/Kyogre->Rayquaza), player journey polish, v1.0 ship.
**v1.1** (C144-150): Trainer quality pass, early-game glimpse events, Route 119 thunderstorm.
**v1.2** (C151-156): 3 interactive migration events, indoor running QoL.
**v1.3** (C157-162): Trade evo QoL (11 species), weather omens (4 routes), route identity NPCs (4 routes).
**v1.4** (C165-170): 60+ encounter tables rewritten.
**v1.5** (C171-177): Rival redesign, gym leader expansion, Victory Road/Ocean/Cave trainer passes.
**v1.6** (C178-183): First impressions & Challenge Mode — Birch dialogue, difficulty selection, Set battles, badge-based level caps.
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. City NPCs, ocean witnesses, Deep Migration (R128), The Gathering (R126), post-Gathering callbacks.
**v1.8** (C192-200): "The Living Region" — 4 postgame quests, 2 regional forms (Corsola_Hoenn, Growlithe_Hoenn/Arcanine_Hoenn), species pipeline. **COMPLETE.**

---

# v1.9: "The New Normal" (C201-C215)

## Creative Vision

v1.8 made Hoenn a living region with quests and regional forms. v1.9 asks: **what does Hoenn look like after everything settles?** The migration happened, the legendaries were tamed, The Gathering shook the ocean — now the world should reflect that. "The New Normal" is where the hack's narrative lands.

The **Elite Four & Champion overhaul** is the flagship. All 5 E4 members reference migration in dialogue (C33), but generically — written before weather omens, The Gathering, regional forms, and the legendary saga existed. v1.9 deepens this: Phoebe acknowledges the Restless Dead, Drake references the Bagon Colony, Wallace's team features a regional form. The E4 becomes the narrative culmination.

The secondary theme is **resolution**. Several v1.7 atmosphere NPCs are stuck in permanent "dread" — the Route 126 Swimmer and Mossdeep StormResearcher never learn Rayquaza resolved the crisis. Fixing these seams turns the world from a feature collection into a coherent story.

## Seams Audit Findings (C201)

1. **Mid-game density (Hours 3-6)**: LOW. Not a priority.
2. **Regional form discoverability**: MEDIUM. Fix: E4 showcases them (C203 ✓ Phoebe, C204 Wallace) + add one mid-game wild form (C208).
3. **Post-Rayquaza emotional landing**: ✅ C205 "The Exhale" — 6 NPCs resolved, R126 fog thinned, weather-omen gap bridged.
4. **E4 dialogue gap**: C203 addressed Sidney/Phoebe/Glacia. C204 addresses Drake/Wallace.
5. **Narrative thread continuity**: LOW-MEDIUM. Drake (C204) callbacks Bagon Colony. C205 StormResearcher bridges weather omens → resolution. Remaining threads deferred.

## Flagship: Elite Four & Champion Overhaul (#112)

### Dialogue Direction

- **Sidney (Dark)** ✅ C203: Murkrow flocks, Houndoom, dark predators thriving in upheaval. Ends with a question.
- **Phoebe (Ghost)** ✅ C203: Mt. Pyre Restless Dead, grandmother, Corsola_Hoenn introduction. "Can you face what endures?"
- **Glacia (Ice)** ✅ C203: Route 125 hail, came TO Hoenn because of migration. "Will you show me what HOENN's warmth is made of?"
- **Drake (Dragon)** ✅ C204: Bagon Colony + Draconid legend. "When the world shifts beneath you—do you change, or hold the line?"
- **Wallace (Champion)** ✅ C204: The Gathering + Route 128 + Arcanine_Hoenn ("a fire that burns underwater"). "Whether you're ready for what HOENN is becoming."

### Team Changes

- **Phoebe** ✅ C203: Duplicate Banette -> **Corsola_Hoenn** (Ghost/Rock, Lv47, Spell Tag, Shadow Claw/Rock Slide/Double Edge/Curse)
- **Wallace** ✅ C204: Swap Tentacruel -> **Arcanine_Hoenn** (Water/Fire, Lv55, Lum Berry, Surf/Flamethrower/ExtremeSpeed/Crunch)
- Sidney, Glacia, Drake: No species changes

### Rematches ✅ C206

- All 20 rematch parties (5 members × 4 tiers) rewritten with migration-themed rosters
- Regional forms: Corsola_Hoenn (Phoebe T2+), Arcanine_Hoenn (Wallace T2+), Garchomp (Drake T3+), Weavile (Glacia T2+)
- Duplicate species eliminated, level progression validated, competitive items on every mon
- Challenge Mode E4 variants deferred to C207

## "The Exhale" — Post-Rayquaza World State ✅ C205

6 NPCs gain post-Rayquaza resolved dialogue. R126 fog thins to WEATHER_FOG_DIAGONAL. Mossdeep StormResearcher connects weather omens to resolution via WEATHER INSTITUTE callback.

## Regional Form Strategy

### Pipeline (C202 ✓)

`scripts/add_regional_form.cjs` — config-driven, 27-file insertion from JSON spec. Future species ~10 actions.

### New Forms (C208-C209)

- **Mid-game accessible (#109)**: Hoennian Vulpix (Ice/Fairy, R113), Hoennian Poliwag (Water/Fighting, R119), or wild Corsola_Hoenn
- **Narrative form**: Bagon Colony variant. TBD via MCP research.

## Community Issue Roadmap

| Issue | Cycles | Approach |
|-------|--------|----------|
| #112 E4/Champion | C203 ✓ + C204-C205 | Flagship: dialogue + teams + rematches |
| #109 Accessible forms | C208-C209 | Mid-game wild regional form + E4 showcase |
| #97 More regional forms | C202 ✓ + C208-C209 | Pipeline enables, then 2-3 species |
| #114 Migration lore | C205 ✓ | Folded into "The Exhale" — StormResearcher bridges weather omens to resolution |
| #110 Deoxys quest | C210 | v1.8 quest pattern, needs form-change research |
| #104 Level cap display | C211 | UI: pokemon_summary_screen.c |
| #80 Playtesting bugs | Ongoing | Check remaining items |
| #108 Graphical tweaks | C212+ | Evaluate per-item |
| #115 Improved docs | Defer | Multi-cycle outside ROM scope |

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Status |
|-------|------|-----------|--------|
| C201 | planning | v1.9 vision, roadmap, seams audit | **DONE** |
| C202 | refactor | Ship `add_regional_form.cjs` pipeline | **DONE** |
| C203 | feature | E4 dialogue: Sidney + Phoebe + Glacia + Phoebe team swap | **DONE** |
| C204 | feature | E4 dialogue: Drake + Wallace + Wallace team swap (Arcanine_Hoenn) | **DONE** |
| C205 | feature | "The Exhale": post-Rayquaza NPC updates, fog thinning | **DONE** |
| C206 | feature | E4 rematches: 20 parties rewritten, validation script shipped | **DONE** |
| C207 | feature | In-battle level cap feedback + E4 difficulty tuning | C206 |
| C208 | feature | New regional form #1 (mid-game accessible, #109) | C202 ✓ |
| C209 | feature | New regional form #2 + Bagon Colony researcher callback | C202 ✓ |
| C210 | feature | Deoxys quest (#110) | -- |
| C211+ | polish | Level cap display (#104), Petalburg downgrade, remaining | -- |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. v1.8: 0x28A-0x297. Next available: 0x298.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 114. Next: 115.
- **Custom species**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420). NUM_SPECIES=421.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
