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

---

# v7.0 — "The Sky Guardian" (Active — C134+)

## Premise

After the Primal crisis is resolved, Birch's atmospheric instruments detect a third anomaly — not underground or undersea, but in the sky itself. The ancient guardian Rayquaza stirs atop Sky Pillar, drawn by the same energies that awakened Groudon and Kyogre. This is the trilogy's capstone: earth, sea, sky.

## Narrative Structure

### Act 1 — "The Warning" (1 cycle)
**Trigger**: FLAG_CAUGHT_PRIMAL_GROUDON OR FLAG_CAUGHT_PRIMAL_KYOGRE set (player resolved Primal crisis).
**Birch Lab**: Extended debrief. Birch's existing "atmospheric anomalies" dialogue updated — a new reading points skyward. He references ancient texts describing a guardian that descends when earth and sea clash. Sends player to Pacifidlog Town.
**Pacifidlog**: New elder NPC in House2 (or repurpose existing). Tells the Draconid legend — Sky Pillar was built by an ancient civilization to summon the Sky Guardian. "When the land burned and the seas raged, the people looked up." Gives player the key/knowledge to enter Sky Pillar.
**Wallace at Sky Pillar Outside**: Enhanced version of existing Wallace scene. Wallace senses the disturbance too. Opens the sealed door. Warns the player the pillar is crumbling. Departs for Sootopolis while player ascends alone.

### Act 2 — "The Ascent" (1-2 cycles)
**Sky Pillar as gauntlet**: 5 floors of escalating encounters. Floors 2F/4F keep cracked-floor puzzles (vanilla). Encounter tables redesigned for post-E4 difficulty (Lv 45-55).
**Environmental storytelling**: Ancient murals on odd floors hint at Rayquaza's history. Script objects (sign-type) the player can examine: 1F describes the builders, 3F depicts the weather trio, 5F shows Rayquaza descending to quell a storm.
**Optional mid-climb NPC**: A Draconid descendant on 3F who tests the player with a battle (Dragon trainer, Lv 50 team). Rewards lore and perhaps a Dragon Scale or rare item.

### Act 3 — "The Guardian" (1 cycle)
**SkyPillar_Top**: Enhanced cinematic. Weather clears dramatically (Air Lock). Camera shake. Rayquaza's cry echoes. A mural behind Rayquaza glows. Then the battle.
**Rayquaza**: Level 70. Outrage / Dragon Pulse / ExtremeSpeed / Fly. Mixed attacker showcasing both 150 Atk and 150 SpA. No held item (legendary tradition).
**Post-catch world reaction**: 4-6 NPCs across Hoenn acknowledge the Sky Guardian's capture. Birch's final research note. Pacifidlog elder's awe. Weather normalizes across all routes (remove WEATHER_ABNORMAL if set). This is the trilogy epilogue.

## Sky Pillar Encounter Design

See `memory/pokemon-knowledge/sky-pillar-arc-and-rematch-design.md` for full 12-slot tables.

**Philosophy**: High-altitude Dragon/Ghost/Psychic/Flying theme. Ancient, powerful species. Escalating rarity — common Golbat/Claydol on lower floors, rare Salamence/Flygon at the top. No weak filler species. Every encounter should feel like a challenge.

| Floor | Key Species | Levels | Theme |
|-------|------------|--------|-------|
| 1F | Golbat, Claydol, Banette, Sableye | 45-48 | Haunted ruins |
| 2F | No encounters (puzzle floor) | — | — |
| 3F | Altaria, Dusclops, Xatu, Claydol | 48-51 | Ancient sentinels |
| 4F | No encounters (puzzle floor) | — | — |
| 5F | Flygon, Altaria, Shelgon, Aerodactyl | 51-55 | Dragon's domain |

## Rayquaza Battle Design

- **Level 70** (vanilla parity, well above E4 cap of 58)
- **Moves**: Outrage (Phys Dragon 90), Dragon Pulse (Spec Dragon 90), ExtremeSpeed (Phys Normal 80, +1 priority), Fly (Phys Flying 70, semi-invulnerable)
- **Ability**: Air Lock (negates weather — thematic and mechanically interesting)
- **Why this set**: Mixed attacker (150/150 offenses). Outrage punishes switching, Dragon Pulse for safe STAB, ExtremeSpeed for priority, Fly for evasion during catch attempts. Uses two of our 20 new moves (Dragon Pulse, and Outrage benefits from P/S split making it Physical).
- **Difficulty**: 680 BST at Lv 70 with priority and dual STAB. Player should need Ultra Balls and status moves. Rest was removed (vanilla has it) to prevent infinite stalling — makes catching harder but fairer.

## Scripting Patterns (from v5/v6)

Use the established legendary encounter template:
1. `lockall` → weather/SFX/camera cinematics
2. `setwildbattle SPECIES_RAYQUAZA, 70` + `setflag FLAG_SYS_CTRL_OBJ_DELETE`
3. `special BattleSetup_StartLegendaryBattle` → `specialvar VAR_RESULT, GetBattleOutcome`
4. Branch: CAUGHT → set FLAG_CAUGHT_RAYQUAZA, clear weather, world reaction. DEFEATED/RAN → set FLAG_DEFEATED_RAYQUAZA, `Common_EventScript_LegendaryFlewAway`.

**New flags needed**: FLAG_CAUGHT_RAYQUAZA, FLAG_DEFEATED_RAYQUAZA, FLAG_SKY_GUARDIAN_QUEST_ACTIVE, FLAG_HIDE_SKY_PILLAR_DRACONID (~4 flags from the 0x264 block).

## Rematch Tier Design (Paper Only)

See `memory/pokemon-knowledge/sky-pillar-arc-and-rematch-design.md` for per-leader specs.

**Principles**: Retain leader ace + identity. Each tier adds 5-8 levels, introduces 1-2 new moves from the v7.1 pool, and upgrades one team member. Tier 4 (final) should feel like a mini-boss with held items and full 6-mon teams.

## Implementation Roadmap

| Cycle | Deliverable | Dependencies |
|-------|-------------|-------------|
| **C135** | **DONE.** Act 1 scripts: Birch debrief, Pacifidlog elder Draconid legend, Wallace Sky Pillar scene, 2 atmospheric NPCs. 5 flags (0x272-0x276). | C134 design |
| **C136** | Act 2: Sky Pillar encounter tables (wild_encounters.json), mural sign scripts (1F/3F/5F), optional Draconid trainer | C135 flags |
| **C137** | Act 3: Rayquaza enhanced encounter script, post-catch world reaction (4-6 NPC dialogues) | C136 encounters |
| **C138** | Rematch tier implementation: all 8 gym leaders tiers 1-4 in trainer_parties.h | v7.1 base teams (C130-131) |
| **C139** | Polish + README: Legendary Encounter Template extraction (tech debt), final testing, version bump | C137 complete |

**Engineering investment**: The Legendary Encounter Template (tech-debt-backlog, pending 19 cycles) should ship in C137 alongside the Rayquaza script — extracting common patterns while implementing a new one is the ideal time.

---

## Technical Reference

### Trainer Modification Checklist
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2-5, for Match Call)
3. Ensure levels scale for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (0-11); probabilities 20/20/10/10/10/10/5/5/4/4/1/1
- Water: 5 slots; Fishing: 10 slots
- File: `pokeemerald/src/data/wild_encounters.json`

### Gen 3 Item Availability (CRITICAL)
- ~~Focus Sash~~ -> Focus Band (12% survive)
- ~~Choice Scarf/Specs~~ -> Scope Lens or Shell Bell
- ~~Life Orb~~ -> Shell Bell or type-boost items
- ~~Black Sludge~~ -> Leftovers

### Flag Plan
Use unused block starting at `0x264` (88 consecutive flags available). ~14 flags used for v6.0 progression. Beast flags (SYSTEM_FLAGS + 0x21-0x27) remain untouched. Sky Guardian needs ~4 new flags.
