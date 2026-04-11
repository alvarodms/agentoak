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

1. **Mid-game density (Hours 3-6)**: LOW. Dewford/Routes 106-108 are thin, but C140-141 NPCs fill the Mauville corridor. Not a priority.
2. **Regional form discoverability**: MEDIUM. Both Corsola_Hoenn and Growlithe_Hoenn are postgame-only quest rewards. Players who skip quests never see them. Fix: E4 showcases them + add one mid-game wild form.
3. **Post-Rayquaza emotional landing**: MEDIUM. Only 5 NPCs react to FLAG_CAUGHT_RAYQUAZA_GUARDIAN. R126 Swimmer, Mossdeep StormResearcher, and all 5 ocean witnesses (C187) lack post-resolution updates. The world doesn't exhale.
4. **E4 dialogue gap**: LOW-MEDIUM. All 5 E4 members DO reference migration (C33) — better than expected. But no callbacks to The Gathering, weather omens, regional forms, or legendary saga.
5. **Narrative thread continuity**: LOW-MEDIUM. Glimpse events (C144-145) pay off implicitly only. Weather omens never connect to The Gathering. Bagon Colony researcher (C153) is a dangling thread. Dr. Hartley -> Quest 2 is the only strong explicit payoff.

## Flagship: Elite Four & Champion Overhaul (#112)

### Dialogue Direction

- **Sidney (Dark)**: Dark predators thrived during upheaval. Callbacks: Murkrow/Houndoom on Routes 120-121. "The darkness recedes when you know what lurks in it."
- **Phoebe (Ghost)**: Mt. Pyre Restless Dead (C154). Grandmother confirms spirits settled post-Rayquaza. Uses **Corsola_Hoenn** (Ghost/Rock) — "a CORSOLA that learned to survive by becoming stone."
- **Glacia (Ice)**: Weather anomalies brought the cold south. R125 hail. "The cold followed the migration, and so did I."
- **Drake (Dragon)**: Bagon Colony (C153) + Draconid legend (C135-136). "The colony in METEOR FALLS... I watched over them."
- **Wallace (Champion)**: The Gathering, R126 fog, ocean witnesses. Uses **Arcanine_Hoenn** (Water/Fire) — "a POKeMON reborn by HOENN's waters." Acknowledges player as Champion AND researcher if postgame quests done.

### Team Changes (Minimal — C132 Teams Are Competitive)

- **Phoebe**: Swap duplicate Banette -> **Corsola_Hoenn** (Ghost/Rock, Lv47)
- **Wallace**: Swap Tentacruel -> **Arcanine_Hoenn** (Water/Fire, Lv55)
- Sidney, Glacia, Drake: No species changes

### Rematches & Challenge Mode

- Update rematch tiers (C49-50, C71) with regional forms at T3-T4
- Challenge Mode E4: held items on every mon, SETUP_FIRST_TURN AI, IV 200, tighter level spread

## "The Exhale" — Post-Rayquaza World State

Add FLAG_CAUGHT_RAYQUAZA_GUARDIAN check to 7 NPCs stuck in permanent dread:
- R126 WarmSwimmer: "The fog... lighter now. Whatever gathered here found its peace."
- Mossdeep StormResearcher: "Readings normalized overnight."
- R124 Curious Diver: "The formations broke up."
- R127 Trench Fisherman: "Fish are back."
- R128 Scared Diver: "No more convoys."
- R131 Lone Swimmer: "TENTACOOL came back. The silence is over."
- R126 fog: Thin to WEATHER_FOG_DIAGONAL after Rayquaza caught (creative backlog C191)

Scope: 7 script files, ~50 lines of dialogue. 1 cycle.

## Regional Form Strategy

### Pipeline (C202)

Ship `add_regional_form.js` — config-driven script using 3 bespoke templates (Corsola C195, Growlithe/Arcanine C198). Drops future species from ~90 actions to ~10. Deferred 8 cycles. Highest-ROI investment.

### New Forms (C208-C209)

2-3 new forms. Design candidates:
- **E4 showcase**: Corsola_Hoenn (Phoebe) + Arcanine_Hoenn (Wallace) already exist
- **Mid-game accessible (#109)**: One form available pre-E4 as a wild encounter. Candidates: Hoennian Vulpix (Ice/Fairy, R113 ash route), Hoennian Poliwag line (Water/Fighting, R119 rain), or make Corsola_Hoenn a rare underwater wild encounter
- **Narrative form**: Bagon Colony researcher discovers a variant. Exact species TBD via MCP research tools

## Community Issue Roadmap

| Issue | Cycles | Approach |
|-------|--------|----------|
| #112 E4/Champion | C203-C205 | Flagship: dialogue + teams + rematches |
| #109 Accessible forms | C208-C209 | Mid-game wild regional form + E4 showcase |
| #97 More regional forms | C202 + C208-C209 | Pipeline enables, then 2-3 species |
| #114 Migration lore | C206 | Fold into "The Exhale" NPC pass |
| #110 Deoxys quest | C210 | v1.8 quest pattern, needs form-change research |
| #104 Level cap display | C211 | UI: pokemon_summary_screen.c |
| #80 Playtesting bugs | Ongoing | Check remaining items |
| #108 Graphical tweaks | C212+ | Evaluate per-item |
| #115 Improved docs | Defer | Multi-cycle outside ROM scope |

## Creative Backlog Resolution

- **In-battle level cap feedback** (C183): Schedule C207 with E4 difficulty tuning
- **Post-Rayquaza fog thinning** (C191): Schedule C206 as part of "The Exhale"
- **Petalburg downgrade NPC** (C184): Low priority, C211+

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Depends On |
|-------|------|-----------|-----------|
| C201 | planning | v1.9 vision, roadmap, seams audit | -- |
| C202 | refactor | Ship `add_regional_form.js` pipeline | -- |
| C203 | feature | E4 dialogue: Sidney + Phoebe + Glacia | -- |
| C204 | feature | E4 dialogue: Drake + Wallace, team swaps (Corsola_Hoenn, Arcanine_Hoenn) | C203 |
| C205 | feature | E4 rematches + Challenge Mode variants | C203-C204 |
| C206 | feature | "The Exhale": post-Rayquaza NPC updates, fog thinning, #114 lore | -- |
| C207 | feature | In-battle level cap feedback + E4 difficulty tuning | C205 |
| C208 | feature | New regional form #1 (mid-game accessible, #109) | C202 |
| C209 | feature | New regional form #2 + Bagon Colony researcher callback | C202 |
| C210 | feature | Deoxys quest (#110) | -- |
| C211+ | polish | Level cap display (#104), Petalburg downgrade, remaining | -- |

**Key**: C202 (pipeline) unblocks C208-C209. E4 work (C203-C205) is independent and starts immediately.

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
