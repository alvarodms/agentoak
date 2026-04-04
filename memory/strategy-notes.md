# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0** (C2-23): Starters, migration species, trainers.
**v2.0** (C24-86): P/S split, Fairy, 6 species, Second Wave, Battle Frontier, QoL.
**v3.0** (C89-96): Trainer items, mid-game encounters/narrative, wild held items, Migration Tracker.
**v4.0** (C98-105): Dungeons, gym rematches, rival arc, Battle Speed QoL.
**v5.0** (C107-116): "The Legends Awaken" — Roaming beasts, sighting network, Ho-Oh climax.
**v6.0** (C118-126): "The Primal Stirring" — Groudon/Kyogre environmental arc, world reaction.
**v7.0-7.1** (C128-137): Battle Quality Overhaul + Sky Guardian Rayquaza trilogy.
**v8.0** (C138-143): "The Complete Experience" — Player journey polish, v1.0 ship.
**v1.1** (C144-150): Trainer quality pass (all routes), early-game glimpse events, Route 119 thunderstorm.
**v1.2** (C151+): "The Player's Journey" — interactive events, QoL, engineering cleanup.

---

# C138 Player Experience Audit — Active Findings

## Strongest Moments
1. **Postgame legendary arc** — 5-act Migration → Beasts → Ho-Oh → Primals → Rayquaza saga
2. **Trainer redesigns** — All gym leaders, E4, and route trainers have custom competitive teams
3. **World reaction network** — 30+ NPCs react dynamically to postgame flag state

## Remaining Weaknesses (post-v1.1)
1. **Early-game interactivity** — C140 added NPC dialogue, C144-145 added glimpse events, but the first 2-3 hours still lack a *memorable interactive moment*. Petalburg Woods is the prime candidate — every player passes through it pre-Badge 1.
2. **Mid-game event density** — Route 119 thunderstorm (C149) proved interactive events work brilliantly, but it's the ONLY mid-game event. Meteor Falls and Mt. Pyre are untapped.
3. **QoL modernization** — Zero QoL features beyond Battle Speed (C105). Competitive ROM hacks are expected to have reusable TMs and indoor running at minimum.

---

# v1.2: "The Player's Journey" — Roadmap

## Vision

Transform the hack from "great content, stock mechanics" to "a polished, modern Emerald with memorable moments at every stage of the journey." Three pillars:

1. **Interactive Events** — Scripted environmental encounters that make the migration feel alive, not just talked-about. One per act of the journey (early, mid-early, mid-late).
2. **QoL Modernization** — Remove legacy friction (consumable TMs, no indoor running) that signals "unmodified ROM" to experienced players.
3. **Engineering Cleanup** — Clear the tech debt backlog so future content work isn't blocked.

## Pillar 1: Interactive Migration Events (C152-C154)

### C152 — Petalburg Woods: "The First Sighting"
**Trigger**: Post-Pokédex (FLAG_ADVENTURE_STARTED), first visit to Petalburg Woods
**Location**: Deep interior, near the Devon Researcher encounter
**What happens**:
- Player reaches a coord_event trigger in the woods
- Screen dims slightly, ambient sound effect (cry)
- A migration species sprite (Vulpix or Absol) dashes across the path — OW sprite moves left-to-right and vanishes
- Devon Researcher NPC reacts: "Did you see that?! That species isn't native to Hoenn!"
- Brief 2-line exchange establishing the migration mystery
- One-shot flag prevents replay
**Why this location**: EVERY player passes through Petalburg Woods before Badge 1. This is the hack's first impression — the moment players realize this isn't vanilla Emerald. The Devon Researcher is already there (plot-critical Aqua encounter), providing a natural witness NPC.
**Design note**: Keep it SHORT. 15-20 seconds max. Mystery, not exposition. The player should think "what was that?" not "let me read this essay."

### C153 — Meteor Falls: "The Colony"
**Trigger**: Post-Badge 4 (FLAG_RECEIVED_BADGE4 or story flag), entering Meteor Falls main chamber
**Location**: Meteor Falls 1F, near the waterfall
**What happens**:
- Player enters and sees 2-3 Bagon OW sprites clustered near the waterfall
- A researcher NPC (new or repurposed) is observing them with dialogue
- Researcher explains: Bagon colony arrived recently — they're drawn to high places (lore-accurate: Bagon jumps off cliffs dreaming of flight)
- The Bagon scatter when approached — one remains and can be battled (special wild encounter, level 25-28, knows Headbutt/Dragon Breath)
- Researcher gives a hint about the migration's scope: "It's not just here... I've heard reports from every corner of Hoenn"
**Why this location**: Meteor Falls is visually striking but underused in vanilla. Post-Badge 4 is the mid-early game — players have been hearing migration hints for hours and this is the first time they SEE a colony. Bagon → Salamence is aspirational for players.
**Dependency**: None (Meteor Falls scripts are untouched by our work)

### C154 — Mt. Pyre: "The Restless Dead"
**Trigger**: Post-Badge 6, entering Mt. Pyre summit exterior
**Location**: Mt. Pyre Summit (exterior area before the orb chambers)
**What happens**:
- Fog/mist weather effect intensifies on entry
- An elderly NPC (Pyre Keeper) blocks the path briefly
- Keeper dialogue: the spirits on Mt. Pyre have been restless — Ghost-types migrating through are disturbing the sacred ground
- Screen shakes, wild Misdreavus cry
- Keeper steps aside: "The mountain welcomes the living... but be wary. The boundary between worlds grows thin."
- Optional: a special wild Misdreavus encounter (level 33-36) with a rare held item (Spell Tag)
**Why this location**: Mt. Pyre is Hoenn's most atmospheric location — spiritual, somber, unique. A ghost migration disturbance adds emotional weight. Post-Badge 6 is late-mid-game, right before the Magma/Aqua climax, making this a "calm before the storm" moment.
**Design note**: Tone shift from scientific (Meteor Falls researcher) to spiritual (Pyre Keeper). The migration isn't just a biological phenomenon — it touches the spirit world too.

## Pillar 2: QoL Modernization (C155)

### C155 — QoL Bundle: "Modern Emerald"
All items in one cycle — both are small, well-understood changes:

**Reusable TMs** (high impact, easy):
- File: `pokeemerald/src/party_menu.c`
- Change: Guard `RemoveBagItem` calls at lines ~5205 and ~5243 with `if (!ItemId_GetPocket(gSpecialVar_ItemId) == POCKET_TM_HM)` or similar TM check
- HMs are already non-consumable; TMs become the same
- Player impact: Removes the #1 QoL complaint in vanilla Gen 3

**Indoor Running** (moderate impact, trivial):
- File: `pokeemerald/src/bike.c`
- Change: Remove or bypass `!gMapHeader.allowRunning` check in `IsRunningDisallowed` (~line 1058)
- Player impact: Running in Pokémon Centers, Marts, homes — removes a persistent minor annoyance

**Faster Text** (evaluate during cycle):
- Check if text speed is already at max or if there's a "instant text" option to enable
- Lower priority — implement only if time permits

## Pillar 3: Engineering Cleanup (C156-C157)

### C156 — Legendary Encounter Template
- **What**: Extract parameterized macros from 4 shipped legendary encounters (beasts, Groudon, Kyogre, Rayquaza) into `data/scripts/legend_macros.inc`
- **Why**: 28+ cycles deferred. Reduces future legendary scripts from ~80 to ~20 lines. Unblocks any future legendary content.
- **Output**: Reusable macros for screen effects, weather transitions, legendary cries, battle setup, and post-capture flag setting

### C157 — Trainer ID Audit & Cleanup
- **What**: Build `scripts/find_unused_trainers.sh` — cross-references opponents.h, trainers.h, rematch tables, and map scripts to identify reclaimable IDs
- **Current state**: TRAINERS_COUNT = 885/885. Only 2 known reclaimable: GRUNT_UNUSED (#568), MAY_PLACEHOLDER (#853). BRENDAN_PLACEHOLDER appears repurposed.
- **Why**: Hard blocker for any future trainer additions (new double battles, event trainers, etc.)
- **Goal**: Identify 5-10 reclaimable IDs OR document that expansion is needed

## Cycle Summary

| Cycle | Name | Pillar | Deliverable |
|-------|------|--------|-------------|
| C151 | Planning | — | This document (v1.2 roadmap) |
| C152 | Petalburg Woods Event | Events | **DONE** — Pikachu sighting event |
| C153 | Meteor Falls Event | Events | Mid-game Bagon colony encounter |
| C154 | Mt. Pyre Event | Events | Late-mid spiritual disturbance |
| C155 | QoL Bundle | QoL | Reusable TMs + indoor running |
| C156 | Legend Template | Engineering | Parameterized encounter macros |
| C157 | Trainer ID Audit | Engineering | Reclaimable ID report + script |

**Dependencies**: C152-C154 are independent of each other (can reorder). C155 is independent. C156-C157 are independent. No blocking dependencies in the roadmap.

**After v1.2**: Evaluate map editing (issue #77), new species additions, or Battle Frontier expansion based on community feedback and what feels most impactful for the player journey.

---

## Quick Reference

- **Trainer checklist**: See codebase-facts.md (party struct types, three-file system)
- **Encounter slots**: Land 12 (20/20/10/10/10/10/5/5/4/4/1/1), Water 5, Fish 10
- **Gen 3 items**: No Focus Sash/Choice Scarf/Specs/Life Orb/Black Sludge — use Choice Band/Focus Band/Scope Lens/Shell Bell/Leftovers
- **Flags**: 0x264+ block (~14 used for v6, 0x272-0x277 for Sky Guardian, 0x278-0x27D for migration events, 0x27E-0x27F for Petalburg Woods sighting). Beast flags at SYSTEM_FLAGS+0x21-0x26.
- **QoL targets**: party_menu.c:5205,5243 (TM consumption), bike.c:1058 (indoor running)
- **Trainer capacity**: 885/885, reclaimable IDs: #568 (GRUNT_UNUSED), #853 (MAY_PLACEHOLDER)
