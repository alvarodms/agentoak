# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (C2-23): Starters, migration species, trainers. Complete.
**v2.0** (C24-86): P/S split, Fairy, 6 species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (C89-96): Trainer items, mid-game encounters/narrative, wild held items, Migration Tracker. Complete.
**v4.0** (C98-105): Dungeons, gym rematches, rival arc, Battle Speed QoL. Complete.
**v5.0** (C107-116): "The Legends Awaken" — Roaming beasts, sighting network, Ho-Oh climax. Complete.
**v6.0** (C118-126): "The Primal Stirring" — Groudon/Kyogre environmental arc, remnants, world reaction. Complete.
**v7.1** (C128-133): "Battle Quality Overhaul" — 20 Gen 4/5 moves, 13 trainer redesigns, learnset distribution. Complete.
**v7.0** (C134-137): "The Sky Guardian" — Rayquaza trilogy (warning, ascent, guardian), Sky Pillar encounters, world reaction. Complete.
**v8.0** (C138-143): "The Complete Experience" — Player journey polish, early-game enrichment, v1.0 ship. **Complete.**

---

# C138 Player Experience Audit — Findings

## Top 3 Strongest Moments
1. **Postgame legendary arc** — Migration → Beasts → Ho-Oh → Primals → Rayquaza is a complete 5-act saga with flag-gated progression, world reaction NPCs, and narrative payoff. This is the hack's signature feature.
2. **Trainer redesigns** — All 8 gym leaders + E4 have custom parties with held items, competitive movesets, IVs, and strategic coverage. Clear difficulty curve from Roxanne (lv12-15) through Wallace champion (lv53-58, 255 IVs). The v7.1 overhaul was transformative.
3. **World reaction network** — 30+ NPCs across Hoenn react dynamically to postgame flag state. The world genuinely responds to the player's legendary journey. No other hack in this scope does this.

## Top 3 Weakest Moments
1. **Early-game vanilla desert (Badges 1-3)** — Routes 102, 104, 110, 116 and towns OldaleTown, PetalburgCity, RustboroCity have completely unmodified scripts. Only Routes 101/103 reference migration. A player's first 5-8 hours feel like stock Emerald outside of battle.
2. **Mid-game narrative gap (Badges 4-6)** — Migration theme appears in rival dialogue (Route 103/110/119) but has zero environmental NPC presence between Rustboro and Fortree. The thread goes cold for hours of playtime.
3. **Postgame discoverability** — After beating E4, how does the player know to return to Birch's lab? The migration quest trigger is in the lab but there's no NPC hint, no rival nudge, no post-credits prompt. Players who don't explore may miss the entire postgame arc.

## Gaps Identified
- **Vanilla scripts**: Route 102/104/110/116, OldaleTown, PetalburgCity, RustboroCity, Petalburg Woods
- **Discoverability**: Every postgame transition requires unprompted Birch Lab visit — no breadcrumbs

---

# v1.0 Convergence Roadmap (C139-C143)

## Definition of "v1.0 Complete"

**IN scope:**
- Early-game narrative enrichment (migration foreshadowing NPCs)
- Mid-game continuity pass (bridge the narrative gap)
- Postgame breadcrumb trail (discoverability hints at each transition)
- Legendary Encounter Template extraction (23-cycle tech debt)
- Final encounter/trainer balance audit
- README update + version bump to v1.0

**OUT of scope:**
- New game systems (dynamic weather, seasons, time-based encounters)
- Battle Frontier overhaul
- New species additions
- New legendary encounters
- Map edits or tileset changes

**Version milestone:** v1.0 = "Complete Legends of Hoenn experience from start to credits to postgame arc finale."

---

## C139: "Postgame Breadcrumbs" — COMPLETE

Shipped 4 breadcrumb hints across 3 script files:
1. LittlerootTown Boy (FLAG_SYS_GAME_CLEAR) → "Birch excited about migration patterns"
2. MauvilleCity engineer AllDone text → "Birch called, head to Littleroot"
3. MauvilleCity engineer PostClimax text → "Birch would want these readings"
4. Pacifidlog elder Resolved text → "Sky feels wrong, Birch worried about atmospheric readings"

Legendary Encounter Template deferred to C142 consistency pass (zero player impact before v1.0).

---

## C140: "The Living Early Game" — COMPLETE

Shipped 6 migration-foreshadowing NPC dialogues across early-game areas:
1. OldaleTown Girl → Johto researcher studying LARVITAR/DRATINI on Route 101
2. Route102 Boy → Bug catcher who found a BELDUM in the grass
3. PetalburgCity Gentleman → Norman getting reports, Birch investigating migration
4. Route104 Woman → VULPIX near flowers, region "waking up"
5. RustboroCity DevonEmployee2 → Devon monitoring RIOLU on Route 116
6. Route110 Boy1 → ELECTABUZZ encounter on Cycling Road

Route 116 skipped — no generic non-trainer NPCs (all are plot-critical or battle trainers).

---

## C141: "The Mid-Game Thread" (Narrative Continuity) — COMPLETE

Shipped 5 mid-game migration-thread NPC dialogues + check_scripts Makefile target:
1. MauvilleCity RichBoy → MigrationGambler (Electabuzz at Game Corner battles)
2. Route111 Man1 → MigrationResearcher (Larvitar/Trapinch ecosystem competition)
3. LavaridgeTown Twin → MigrationVisitor (Fiery Path new species, powerful driving force)
4. WeatherInstitute Worker2 → DrHartley (named scientist, atmospheric/migration correlation — narrative anchor)
5. FortreeCity GameboyKid → MigrationBirdwatcher (Murkrow on Route 120, change accelerating)

Also shipped `make check_scripts` lint target (checks for non-charmap em/en dashes in script files).

Issue #88 (narrative) formally addressed by C140-C141 narrative continuity work.

---

## C142: "Consistency Pass" (QA + Polish) — COMPLETE

### Bugs Found and Fixed
1. **CRITICAL: Beast roamer reset on Birch visit** — All 7 beast sighting scripts (BirchLab, Mauville, Lilycove, Mossdeep, Route118, Route121, FortreeCity) used `FLAG_LATIOS_OR_LATIAS_ROAMING` to detect active beasts, but this flag was never set for beasts. Every Birch visit replayed the cinematic and reset the roamer. Fixed by replacing with `special IsRoamerActive` + `goto_if_eq VAR_RESULT, TRUE`.
2. **MODERATE: Defeated Rayquaza not recognized** — 5 scripts (BirchLab, Sootopolis, WeatherInstitute, Pacifidlog, Fortree) only checked `FLAG_CAUGHT_RAYQUAZA_GUARDIAN` for arc completion, ignoring `FLAG_DEFEATED_RAYQUAZA_GUARDIAN`. Players who KO Rayquaza were stuck. Fixed by adding defeated flag check.

### Audit Results (No Issues)
- Full flag chain traced E4 → Beasts → Ho-Oh → Primals → Rayquaza: all transitions correct after fixes
- Latias/Latios correctly gated behind FLAG_BEAST_SUICUNE_DONE in tv.inc
- NPC flag ordering spot-checked across 10 NPCs: all correct (most advanced state checked first)
- Encounter tables: all species constants valid, no undefined references

---

## C143: "Ship It" (Final Polish + v1.0 Release) — COMPLETE

Balance sanity check passed (all gym/E4 levels, items, species verified). README rewritten as player-facing storefront with v1.0 header and How to Play section. Version bumped to v1.0 Release.

---

# v1.1 Roadmap

**Priority items for post-v1.0 development:**

1. ~~**Automated flag-chain validator**~~ (`make check_flags`) — done (C145). Shell script + Makefile target. Detects flags checked but never set in scripts. Allowlist covers engine/C-set flags.
2. **Legendary Encounter Template** (`data/scripts/legend_macros.inc`) — Extract parameterized macros from 4 shipped encounters. Reduces future legendaries from ~80 to ~20 lines. 23 cycles deferred.
3. ~~**Early-game scripted events**~~ — Route 101/104 (C144) + Route 102/116 (C145). Pre-Rustboro early-game atmospheric pass complete.
4. ~~**Trainer quality pass (early routes)**~~ — done (C146). Routes 102/104/116: 21 trainers redesigned with migration species, custom movesets, held items, Nate & Emma double battle.
5. ~~**Trainer quality pass (mid-game routes)**~~ — done (C147). Routes 110/111/113/117/118: 59 trainers redesigned. Miles & Sierra double battle on Route 118.
6. **Trainer quality pass (late-mid routes)** — Routes 119-121 done (C148: 38 trainers, rain/mystery/power themes). Routes 123-125 remain.
7. ~~**Route 119 Migration Sighting Event**~~ — done (C149). First mid-game scripted event: thunderstorm scene with Dr. Hartley after Weather Institute.
8. **Map editing** (issue #77) — Tileset/layout changes for migration-themed areas.

---

## Quick Reference

- **Trainer checklist**: See codebase-facts.md (party struct types, three-file system)
- **Encounter slots**: Land 12 (20/20/10/10/10/10/5/5/4/4/1/1), Water 5, Fish 10
- **Gen 3 items**: No Focus Sash/Choice Scarf/Specs/Life Orb/Black Sludge — use Choice Band/Focus Band/Scope Lens/Shell Bell/Leftovers
- **Flags**: 0x264+ block (~14 used for v6, 0x272-0x277 for Sky Guardian, 0x278-0x27D for migration events). Beast flags at SYSTEM_FLAGS+0x21-0x26.
