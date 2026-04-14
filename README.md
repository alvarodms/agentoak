🌳 Agent Oak

[![Agent Oak Cycle](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml/badge.svg)](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml)
[![Powered by Claude](https://img.shields.io/badge/powered_by-Claude-blueviolet?logo=anthropic)](https://www.anthropic.com)
[![Base ROM](https://img.shields.io/badge/base_rom-pokeemerald-green?logo=gameboy)](https://github.com/pret/pokeemerald)

**An autonomous AI agent that explores, learns, and builds a Pokemon Emerald ROM hack — one cycle at a time.**

Agent Oak is powered by Claude and operates on the [pokeemerald](https://github.com/pret/pokeemerald) decompilation. It works in iterative **cycles**: planning what to do, reading and modifying source code, building the ROM, reflecting on results, and remembering what it learned for next time. It runs unattended on a schedule via GitHub Actions, and the community can interact with it through GitHub Issues.

> *This README is maintained by Agent Oak itself. It reviews and updates this page at the end of each cycle when player-facing changes are made.*

---

## The Game: Legends of Hoenn

Hoenn's ecosystem is changing. A migration event has drawn rare Pokemon from distant regions — Larvitar scaling Mt. Chimney, Sneasel hunting on the Jagged Pass, Electabuzz surging through New Mauville. Gym leaders have adapted their teams. The player arrives at the perfect moment.

**Legends of Hoenn** is a complete reimagining of Pokemon Emerald, built one cycle at a time by an autonomous AI. Every route, every gym, every rival battle has been redesigned around a single premise: what happens when the whole world's Pokemon come to Hoenn?

### The Migration

- **Pseudo-legendary starters** — Larvitar, Bagon, and Dratini replace the originals
- **73 routes + 34 dungeons** redesigned with thematic encounter tables reflecting the migration ecology — every route has a unique identity, from ghostly Mt. Pyre waters to Horsea colonies and toxic shipwreck seas
- **Ocean route differentiation** — all 17 sea routes feature unique species, themed ecosystems, and tiered fishing rewards; Tentacool/Wingull monoculture replaced with Kingdra, Lanturn, Mantine, Relicanth, and other rare 1% catches
- **6 new species** — Riolu, Lucario, Gible, Gabite, Garchomp, and Weavile added as migration arrivals
- **5 cross-generation evolutions** — the migration unlocked latent potential in species already living in Hoenn. Dusclops evolves into Dusknoir, Murkrow into Honchkrow, Snorunt into Froslass, Piloswine into Mamoswine, and Girafarig into Farigiraf. Elite Four members and gym leaders field these evolved forms — Tate & Liza share a Farigiraf, Glacia commands Froslass and Mamoswine — making their teams feel modern and complete
- **19 migration species** carry thematic wild held items
- **Hoennian regional forms** — the migration did not just bring new species; it changed species already here. Hoennian Corsola (Ghost/Rock), Hoennian Growlithe (Water), Hoennian Arcanine (Water/Fire), Hoennian Bagon (Dragon/Rock) — a fossil variant discovered in the depths of Meteor Falls — and Hoennian Vulpix (Ice/Fairy) and Hoennian Ninetales (Ice/Fairy), ice foxes adapted to the volcanic ash of Route 113, evolving via Moon Stone. Some forms are discovered through postgame quests; others wait in the wild for trainers sharp-eyed enough to find them
- **Scripted migration events** — witness the migration firsthand: a Pikachu dashes across your path in Petalburg Woods before Badge 1, a Bagon colony echoes through Meteor Falls after Badge 4, restless Misdreavus haunt Mt. Pyre's summit after Badge 6, a thunderstorm rages on Route 119 with weather-displaced Pokemon, a Wailord pod shakes the ocean on Route 128 — culminating in a special encounter with a curious young Wailmer — and on Route 126, fog rolls in as layered Pokemon cries converge toward Sootopolis in a moment the player can only witness, not fight
- **Weather omens** — Hoenn's climate destabilizes as you earn badges: sandstorms engulf Route 111 after Badge 5, thunderstorms rage on Route 119 and downpours drown Route 120 after Badge 6, and hail blankets Route 125 near Shoal Cave after Badge 7 — four routes transformed, foreshadowing the Primal Stirring
- **Migration narrative arc** — NPCs across Hoenn react to the migration, from Birch's earliest research notes through Weather Institute scientists tracking atmospheric anomalies, ocean divers reporting vast shapes below the surface, and late-game cities buzzing with unease to postgame revelations

### Battle System Upgrades

- **Gen IV physical/special split** — each move has its own Physical, Special, or Status category
- **20 new Gen IV/V moves** — Night Slash, Stone Edge, Dragon Pulse, Close Combat, Brave Bird, Flare Blitz, Shadow Claw, Nasty Plot, Ice Shard, Energy Ball, and more fill the physical/special gaps the split created
- **Full learnset parity** — every new move is learnable by player Pokemon through level-up across 58 species
- **Move category icons** in the battle UI so you always know what you're picking
- **Fairy type** fully implemented with type matchups, STAB, and AI awareness

### Trainer Overhaul

- **All 8 gym leaders** redesigned with unique strategic identities, held items, and competitive movesets — Slaking anchors Norman, Brave Bird Swellow leads Winona, Dragon Pulse Kingdra commands Juan's rain
- **Elite Four and Champion** rebuilt with competitive teams and narrative depth — each E4 member's dialogue reflects their personal connection to the migration: Sidney names the dark predators that crept in behind the noble arrivals, Phoebe's grandmother on Mt. Pyre confirms the spirits settled, Glacia followed the cold south from a distant land, Drake confesses what the Bagon Colony in Meteor Falls taught him about perseverance, and Champion Wallace leads with Hoennian Arcanine — a fire that burns underwater, the migration's thesis statement made flesh. Phoebe fields Hoennian Corsola, Wallace fields Hoennian Arcanine — regional forms bookend the gauntlet. Zero duplicate species across the entire run
- **Tuned level curve** from Roxanne (Lv15) through Wallace (Lv58) with smooth progression
- **4-tier rematch progression** for all gym leaders and Elite Four with escalating teams — E4 rematches feature migration-themed rosters, regional forms from Tier 2 onward, and strategic evolution arcs (Drake's Gabite grows into Garchomp, Phoebe's Corsola_Hoenn strengthens, Wallace's Arcanine_Hoenn anchors his team)
- **Rival arc** — all 30 rival parties (5 battles x 3 starter variants x 2 genders) completely rebuilt with custom movesets, held items, migration companions, and escalating team sizes (1->2->3->4->5 Pokemon); the rival grows from a stumbling novice with a single starter to a five-strong powerhouse wielding Spore, Will-O-Wisp, and Belly Drum
- **Villain bosses** (Maxie, Archie, admins) carry held items and coverage moves
- **200+ route trainers** across every land route, ocean route, cave, and dungeon redesigned with migration species, held items, themed movesets, and new double battles — ocean swimmers carry route-coherent species matching their waters, Route 119 exploits rain, Victory Road veterans field evolved teams with competitive AI, Mt. Pyre ghosts haunt with Misdreavus and Houndour, and Meteor Falls dragon tamers raise Bagon and Shelgon from the caves they call home

### The Postgame Saga

Beat the Elite Four and a whole new story begins — five interconnected arcs that transform Hoenn's legendary landscape:

- **Roaming Legendary Beasts** — Raikou, Entei, and Suicune, displaced from Johto by the migration, roam Hoenn's routes. Complete the Migration Tracker, talk to Birch, and they appear one at a time. Six NPCs across the region report sightings that change depending on which beast is active.
- **The Migration Climax** — Defeat all three beasts and return to Birch for a revelation: the beasts were harbingers. Their ancient master, Ho-Oh, has followed the migration corridors into Hoenn and now roosts in the Cave of Origin. A level 70 encounter with Sacred Fire, Recover, Earthquake, and Calm Mind awaits.
- **The Primal Stirring** — Capturing Ho-Oh disturbs ancient forces. Seismic tremors and tidal surges appear across the region. Investigate anomalies, battle Team Magma and Aqua remnants guarding revitalized Terra Cave and Seafloor Cavern, and confront the awakened Groudon (Lv70) and Kyogre (Lv70) in cinematic encounters with dynamic weather.
- **The Sky Guardian** — After the Primal crisis, a third anomaly emerges. The Pacifidlog elder reveals the Draconid legend, Wallace unseals Sky Pillar, and you ascend five floors of escalating encounters past ancient murals and a Draconid warrior to reach Rayquaza (Lv70) at the storm-wracked summit. Air Lock stills the tempest for the final battle.
- **Migration Tracker Quest** — A 3-stage field guide for Professor Birch tracking pioneer species, apex predators, and habitat specialists across Hoenn
- **Postgame Side Quests** — Four investigations across Hoenn, each revisiting familiar NPCs with new context:
  - *The Elder's Current* — The Pacifidlog Elder sends you beneath the currents to discover Hoennian Corsola, a Ghost/Rock species transformed by the migration
  - *Hartley's Field Report* — Dr. Hartley at the Weather Institute needs field data from three weather anomaly sites — and a strange bark echoes outside when his hypothesis proves true, revealing Hoennian Growlithe
  - *The Mossdeep Signal* — A Space Center researcher tracked an energy pulse that bounced off the upper atmosphere during the Primal Stirring. Something shimmers on Route 131 where the sky grew thin
  - *The Fog Beneath* — A swimmer on Route 126 found an opening in the seabed that wasn't there before the Gathering. Something massive and gentle waits below the fog

### Quality of Life

- **Reusable TMs** with halved prices
- **Trade evolution QoL** — all trade-gated evolutions now use level-up (Lv37) or evolution items instead, so every species is obtainable in single-player
- **Indoor running** — run anywhere, not just outdoors
- **Auto-run** from step one
- **Battle speed toggle** — instant, fast, or normal
- **Move category icons** in the battle UI

### Difficulty Modes

Choose your challenge in Professor Birch's lab:

- **Normal Mode** — The full Legends of Hoenn experience with all migration content, rebalanced trainers, and quality-of-life upgrades
- **Challenge Mode** — For trainers who want to earn every victory:
  - **Set battle style** enforced — no free switches after KOs
  - **Badge-based level caps** — soft EXP reduction when your Pokemon reach the cap for your current badge count, scaling from Lv18 (pre-Roxanne) to Lv55 (8 badges)
  - **Same encounters, same trainers** — the world doesn't change, but you must play smarter
- Friendly NPCs in Pokemon Centers along the early routes explain your current mode and level cap
- **Changed your mind?** A friendly NPC in the Petalburg Pokemon Center can switch you back to Normal Mode if Challenge Mode gets too tough

### How to Play

**Requirements:** A GBA emulator ([mGBA](https://mgba.io/) recommended) or a GBA flash cart.

**Download:** Grab the latest `.ips` patch file from the [Releases page](../../releases). Every successful cycle produces a new patch.

**From source:** Clone this repo, install the [agbcc toolchain](https://github.com/pret/agbcc), and run `make` in the `pokeemerald/` directory.

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

Good suggestions that don't fit the current cycle are **deferred** to the backlog for future consideration. Suggestions that conflict with the project direction are **rejected** with an explanation.

### How to Make a Great Suggestion

- **Be specific** — "Route 119 should have rain-themed encounters" is better than "make encounters better"
- **Explain why** — what player experience problem does your idea solve?
- **Think thematically** — suggestions that fit the migration narrative tend to resonate
- **Check the releases** — look at recent changes to avoid suggesting something already done
