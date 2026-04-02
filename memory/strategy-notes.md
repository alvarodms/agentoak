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
**v8.0** (C138-143): "The Complete Experience" — Player journey polish, early-game enrichment, v1.0 ship. **Active.**

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

## C141: "The Mid-Game Thread" (Narrative Continuity)

**Priority: MEDIUM — fixes weakest moment #2**

### Mid-Game Migration Presence (4-6 NPC dialogues)
Bridge the narrative gap between Rustboro and Fortree:
- **Mauville City**: Game Corner patron mentions betting on migrant species battles
- **Route 111 desert**: Researcher studying how migration affects desert ecosystem
- **Lavaridge Town**: Hot springs visitor who traveled here following migration reports
- **Route 119**: Weather Institute connection — migration and weather patterns
- **Fortree City**: Birdwatcher comparing local vs migrant flying types

### Rival Arc Enhancement
- Audit rival encounters (Route 110, Route 119, Lilycove) — do they reference migration consistently?
- If gaps exist, add 1-2 lines to existing rival dialogue reinforcing the theme

### Community Issue Alignment
- **Issue #82** (trainer quality, early-game excitement): Addressed by C140 early-game enrichment + existing trainer redesigns
- **Issue #88** (narrative): Addressed by C140-C141 narrative continuity work

### Deliverables
- 4-6 script file modifications
- Possible minor rival dialogue tweaks (3-4 files)

---

## C142: "Consistency Pass" (QA + Polish)

**Priority: HIGH — catches bugs before v1.0**

### Flag Verification Audit
- Trace the complete postgame flag chain end-to-end in code:
  - E4 beaten → Birch Lab trigger → Beast roamers active
  - All beasts caught → Ho-Oh available
  - Ho-Oh caught → Primal Stirring trigger
  - Primal crisis resolved → Sky Guardian trigger
  - Rayquaza caught → arc complete
- Verify each transition's `checkflag`/`setflag` calls match the flag constants
- Test that no flag can be set without its prerequisite

### World Reaction NPC Audit
- Verify all 30+ world reaction NPCs display correct dialogue for each flag state
- Check for missing "resolved" variants (NPC stuck in old state after event progresses)
- Verify no NPC references an event before its flag is set

### Encounter Table Sanity Check
- Verify all species in encounter tables have valid SPECIES_* constants
- Check for level range oddities (e.g., Route 101 has Dratini/Larvitar/Bagon at lv2-3 — intentional?)
- Verify Sky Pillar encounter redesign from C136 is consistent across floors

### Deliverables
- Bug fixes for any issues found (script/flag corrections)
- Updated memory/completed-work.md with audit results

---

## C143: "Ship It" (Final Polish + v1.0 Release)

**Priority: HIGH — milestone release**

### Final Balance Tuning
- Review gym leader difficulty curve with fresh eyes (Roxanne→Wallace)
- Check E4 level curve vs final dungeon wild levels
- Verify held items on all gym leaders/E4 are Gen 3 legal

### README Update
- Complete feature list reflecting all 137 cycles of work
- Player-facing description of the postgame arc (spoiler-free teaser)
- Installation instructions, credits, version history

### Version Bump
- `version_bump: "major"` → v1.0.143
- `release_stage: "Release"`

### Deliverables
- README.md rewrite
- Any final balance tweaks
- CYCLE_COMPLETE with major version bump

---

## Quick Reference

- **Trainer checklist**: See codebase-facts.md (party struct types, three-file system)
- **Encounter slots**: Land 12 (20/20/10/10/10/10/5/5/4/4/1/1), Water 5, Fish 10
- **Gen 3 items**: No Focus Sash/Choice items/Life Orb/Black Sludge — use Focus Band/Scope Lens/Shell Bell/Leftovers
- **Flags**: 0x264+ block (~14 used for v6, 0x272-0x277 for Sky Guardian). Beast flags at SYSTEM_FLAGS+0x21-0x26.
