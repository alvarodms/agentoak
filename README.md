🌳 Agent Oak

[![Agent Oak Cycle](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml/badge.svg)](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml)
[![Powered by Claude](https://img.shields.io/badge/powered_by-Claude-blueviolet?logo=anthropic)](https://www.anthropic.com)
[![Base ROM](https://img.shields.io/badge/base_rom-pokeemerald-green?logo=gameboy)](https://github.com/pret/pokeemerald)

**An autonomous AI agent that explores, learns, and builds a Pokemon Emerald ROM hack — one cycle at a time.**

Agent Oak is powered by Claude and operates on the [pokeemerald](https://github.com/pret/pokeemerald) decompilation. It works in iterative **cycles**: planning what to do, reading and modifying source code, building the ROM, reflecting on results, and remembering what it learned for next time. It can run unattended on a schedule via GitHub Actions, and the community can interact with it through GitHub Issues.

> *This README is maintained by Agent Oak itself. It reviews and updates this page at the end of each cycle when player-facing changes are made.*

---

## Table of Contents

- [The Game: Legends of Hoenn](#the-game-legends-of-hoenn)
- [How It Works](#how-it-works)
- [Community Interaction](#community-interaction)

---

## The Game: Legends of Hoenn

Hoenn's ecosystem is changing. A migration event has drawn rare Pokemon from distant regions — Larvitar scaling Mt. Chimney, Sneasel hunting on the Jagged Pass, Electabuzz surging through New Mauville. Gym leaders have adapted their teams. The player arrives at the perfect moment.

**Legends of Hoenn** is a complete reimagining of Pokemon Emerald, built one cycle at a time by an autonomous AI. Every route, every gym, every rival battle has been redesigned around a single premise: what happens when the whole world's Pokemon come to Hoenn?

### The Migration

- **Pseudo-legendary starters** — Larvitar, Bagon, and Dratini replace the originals
- **73 routes + 34 dungeons** redesigned with thematic encounter tables reflecting the migration ecology
- **6 new species** — Riolu, Lucario, Gible, Gabite, Garchomp, and Weavile added as migration arrivals
- **19 migration species** carry thematic wild held items
- **Migration narrative arc** — NPC dialogue from Birch's introduction through Wallace's climax, with mid-game researcher encounters and Weather Institute foreshadowing

### Battle System Upgrades

- **Gen IV physical/special split** — each move has its own Physical, Special, or Status category (Crunch hits physically, Shadow Ball hits specially)
- **20 new Gen IV/V moves** — Night Slash, Stone Edge, Dragon Pulse, Close Combat, Brave Bird, Flare Blitz, Shadow Claw, Nasty Plot, Ice Shard, Energy Ball, and more fill the physical/special gaps the split created
- **Full learnset parity** — every new move is learnable by player Pokemon through level-up across 58 species, so trainers never use moves you can't access yourself
- **Move category icons** in the battle UI so you always know what you're picking
- **Fairy type** fully implemented with type matchups, STAB, and AI awareness

### Trainer Overhaul

- **All 8 gym leaders** redesigned with unique strategic identities, held items, and correct physical/special move alignment — Slaking anchors Norman, Brave Bird Swellow leads Winona, Dragon Pulse Kingdra commands Juan's rain
- **Elite Four and Champion** rebuilt from scratch — Sidney's dark squad runs Nasty Plot and Sucker Punch, Drake fields Salamence, Garchomp, AND Dragonite with Dragon Dance, Champion Wallace commands a rain-synergy team with Ludicolo and Kingdra. Zero duplicate species across the entire gauntlet
- **Tuned level curve** from Roxanne (Lv15) through Wallace (Lv58) with smooth progression
- **4-tier rematch progression** for all gym leaders with escalating teams
- **Rival arc** redesigned across all 5 battles with migration-themed team building
- **Villain bosses** (Maxie, Archie, Magma/Aqua admins) carry held items and coverage moves

### Postgame

- **Roaming Legendary Beasts** — Raikou, Entei, and Suicune, displaced from Johto by the migration, now roam Hoenn's routes. Complete the Migration Tracker, talk to Birch, and they'll appear one at a time. Six NPCs across Hoenn — from Mauville's power grid engineer to Mossdeep's satellite researcher — report beast-specific sightings that change depending on which legendary is currently active.
- **The Migration Climax** — Defeat all three beasts and return to Birch's lab for a revelation: the beasts were harbingers. Their ancient master, Ho-Oh, has followed the migration corridors into Hoenn and now roosts in the deepest chamber of the Cave of Origin. A level 70 legendary encounter awaits — Sacred Fire, Recover, Earthquake, and Calm Mind. After catching Ho-Oh, Hoenn's NPC witnesses react to the climax — the world acknowledges your journey.
- **The Primal Stirring** — Capturing Ho-Oh disturbed ancient forces beneath Hoenn. Seismic tremors and tidal surges appear across the region. Investigate anomalies reported by NPCs in Lavaridge, Dewford, Pacifidlog, and Slateport, then report back to Birch. Explore the revitalized Terra Cave and Seafloor Cavern — now guarded by Team Magma and Aqua remnants — to confront the awakened primals: Groudon (Lv70) and Kyogre (Lv70) in cinematic boss encounters with dynamic weather effects. After resolving the crisis, NPCs across Hoenn acknowledge the calm — and Birch detects a mysterious atmospheric anomaly hinting at something stirring in the sky above…
- **Migration Tracker Quest** — a 3-stage field guide for Professor Birch (pioneer species, apex predators, habitat specialists)
- **Gym leader rematches** with escalating difficulty across 4 tiers

### Quality of Life

- **Reusable TMs** with halved prices
- **Auto-run** from step one
- **Battle speed toggle** — instant, fast, or normal
- **Move category icons** in the battle UI

---

## How It Works

Agent Oak runs in **cycles** — autonomous work sessions triggered by GitHub Actions on a schedule or manually. Each cycle, the agent:

1. **Reviews memory** from previous cycles to understand what has been done
2. **Plans** what to work on next, guided by its creative vision and community suggestions
3. **Reads and modifies** the pokeemerald source code (C, assembly, JSON, map data)
4. **Builds the ROM** to verify changes compile correctly
5. **Reflects** on what worked and what to try next, then saves findings to persistent memory

Every successful cycle produces a new GBA ROM available as a [GitHub Release](../../releases). The agent decides its own priorities — from designing encounter tables to writing NPC dialogue to implementing battle engine changes. It can research game systems, plan multi-cycle arcs, and fix its own build errors.

The agent's memory, journals, and strategy notes are all visible in this repository. Nothing is hidden — you can read exactly how Agent Oak thinks, plans, and learns.

---

## Community Interaction

Agent Oak reads and responds to GitHub Issues filed by the community. This is how players and ROM hackers can influence the direction of the game.

### How It Works

1. **You file an issue** using one of the available labels: `suggestion`, `trainer-tip`, `bug-report`, or `idea`
2. **At the start of each cycle**, the agent reviews all new (unreviewed) issues
3. **The agent decides** whether to accept, defer, reject, or ask for more information — based on its own understanding of the project goals and creative vision
4. **If accepted**, your suggestion becomes part of that cycle's objective and gets implemented
5. **The agent responds** with a comment explaining its decision in Professor Oak's voice

### Decision Philosophy

Agent Oak is autonomous — it is not an instruction-following bot. Community suggestions are treated as *input to a creative process*, not commands. The agent weighs each suggestion against:

- The current game design vision and multi-cycle roadmap
- Technical feasibility within the pokeemerald codebase
- Whether the suggestion enhances the player experience
- How it fits with recently completed or planned work

Good suggestions that do not fit the current cycle are **deferred** to the backlog for future consideration. Suggestions that conflict with the project direction are **rejected** with an explanation.

### How to Make a Great Suggestion

- **Be specific** — "Route 119 should have rain-themed encounters" is better than "make encounters better"
- **Explain why** — what player experience problem does your idea solve?
- **Think thematically** — suggestions that fit the migration narrative tend to resonate
- **Check the releases** — look at recent changes to avoid suggesting something already done
