# 🌳 Agent Oak

[![Agent Oak Cycle](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml/badge.svg)](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml)
[![Powered by Claude](https://img.shields.io/badge/powered_by-Claude-blueviolet?logo=anthropic)](https://www.anthropic.com)
[![Base ROM](https://img.shields.io/badge/base_rom-pokeemerald-green?logo=gameboy)](https://github.com/pret/pokeemerald)

**An autonomous AI agent that explores, learns, and builds a Pokémon Emerald ROM hack — one cycle at a time.**

Agent Oak is powered by Claude and operates on the [pokeemerald](https://github.com/pret/pokeemerald) decompilation. It works in iterative **cycles**: planning what to do, reading and modifying source code, building the ROM, reflecting on results, and remembering what it learned for next time. It can run unattended on a schedule via GitHub Actions, and the community can interact with it through GitHub Issues.

> *This README is maintained by Agent Oak itself. It reviews and updates this page at the end of each cycle when player-facing changes are made.*

---

## Table of Contents

- [The Game: Legends of Hoenn](#the-game-legends-of-hoenn)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [The Cycle Pipeline](#the-cycle-pipeline)
- [Cycle Modes](#cycle-modes)
- [Memory System](#memory-system)
- [Journal](#journal)
- [Community Interaction](#community-interaction)
- [Build System](#build-system)

---

## The Game: Legends of Hoenn

Hoenn's ecosystem is changing. A migration event has drawn rare Pokémon from distant regions — Larvitar scaling Mt. Chimney, Sneasel hunting on the Jagged Pass, Electabuzz surging through New Mauville. Gym leaders have adapted their teams. The player arrives at the perfect moment.

**Legends of Hoenn** is a complete reimagining of Pokémon Emerald, built one cycle at a time by an autonomous AI. Every route, every gym, every rival battle has been redesigned around a single premise: what happens when the whole world's Pokémon come to Hoenn?

### The Migration

- **Pseudo-legendary starters** — Larvitar, Bagon, and Dratini replace the originals
- **73 routes + 34 dungeons** redesigned with thematic encounter tables reflecting the migration ecology
- **6 new species** — Riolu, Lucario, Gible, Gabite, Garchomp, and Weavile added as migration arrivals
- **19 migration species** carry thematic wild held items
- **Migration narrative arc** — NPC dialogue from Birch's introduction through Wallace's climax, with mid-game researcher encounters and Weather Institute foreshadowing

### Battle System Upgrades

- **Gen IV physical/special split** — each move has its own Physical, Special, or Status category (Crunch hits physically, Shadow Ball hits specially)
- **Move category icons** in the battle UI so you always know what you're picking
- **Fairy type** fully implemented with type matchups, STAB, and AI awareness

### Trainer Overhaul

- **All 8 gym leaders** redesigned with competitive teams, strategic held items, and 4-tier rematch progression
- **Elite Four and Champion** carry full competitive rosters
- **Rival arc** redesigned across all 5 battles with migration-themed team building
- **Villain bosses** (Maxie, Archie, Magma/Aqua admins) carry held items and coverage moves

### Postgame

- **Migration Tracker Quest** — a 3-stage field guide for Professor Birch (pioneer species, apex predators, habitat specialists)
- **Gym leader rematches** with escalating difficulty across 4 tiers

### Quality of Life

- **Reusable TMs** with halved prices
- **Auto-run** from step one
- **Battle speed toggle** — instant, fast, or normal
- **Move category icons** in the battle UI

**Coming next** — *v2.0: The Legends Awaken.* The migration has drawn something greater to Hoenn. Three legendary Pokémon, displaced from distant Johto, now roam the routes. The title earns its name.

---

## How It Works

Agent Oak follows a simple loop:

1. **Review memory** — read what it learned in previous cycles
2. **Plan** — decide what to explore or change this cycle
3. **Execute** — read code, make edits, run builds
4. **Reflect** — analyze what happened and update memory
5. **Journal & commit** — record everything and push to git

Each iteration of this loop is called a **cycle**. The agent is not required to make code changes every cycle — it might spend an entire cycle reading source files and taking notes, or brainstorming ideas for the ROM hack. Over time, it builds up a persistent knowledge base that lets it take on increasingly complex modifications.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Agent Runner                       │
│                 (TypeScript / Node.js)                │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Planner  │→ │  Runner  │→ │  Builder │──┐        │
│  │ (Phase 1)│  │ (Phase 2)│  │ (Phase 3)│  │ fail   │
│  └──────────┘  └──────────┘  └──────────┘  ↓        │
│       ↑                           │     ┌──────┐     │
│       │                           │     │ Fix  │←─┐  │
│  ┌─────────┐                      │     │ Loop │──┘  │
│  │ Memory  │←─────────────────────┘     └──────┘     │
│  │ System  │                         (up to 3x)      │
│  └─────────┘  ┌──────────┐  ┌──────────┐            │
│       ↑       │ Reflect  │→ │ Journal  │→ git commit │
│       └───────│ (Phase 4)│  │ (Phase 5)│             │
│               └──────────┘  └──────────┘             │
└──────────────────────────────────────────────────────┘
         │                          │
         ↓                          ↓
   ┌───────────┐            ┌─────────────┐
   │ pokeemerald│            │   GitHub    │
   │  (C source)│            │   Issues   │
   └───────────┘            └─────────────┘
```

**Key components:**

| Component | Tech | Role |
|---|---|---|
| Agent Engine | Claude (via Claude Code CLI) | AI reasoning, code reading/writing |
| Runner | TypeScript, Node.js 22+ | Orchestrates phases, manages state |
| Build System | GNU Make + agbcc | Compiles the GBA ROM |
| MCP | `@modelcontextprotocol/sdk` | Tool protocol integration |
| Git | simple-git | Commits changes, reverts on failure |
| GitHub API | Octokit | Community issue triage, releases |
| Logging | Winston | Console + rotating file logs |

---

## The Cycle Pipeline

Each cycle runs through **5 sequential phases**, each with its own isolated agent context:

### Phase 1 — Planning (Team-Based)

Planning uses a **multi-perspective advisory system**. Four specialized advisors run in parallel, each reviewing memory and the current project state from a different angle:

| Role | Focus |
|---|---|
| **Game Designer** | Player experience, difficulty curve, content gaps, creative identity |
| **Technical Lead** | Feasibility, build risk, known failure patterns, technical debt |
| **Creative Visionary** | Ambition level — pushes against safe/incremental choices |
| **Pokémon Specialist** | ROM hack best practices, community expectations (can research the web) |

Each advisor produces an independent memo. A **Producer** then synthesizes all four memos into a final `CyclePlan`:

- **Mode** — what kind of work to do (see [Cycle Modes](#cycle-modes))
- **Objective** — a concrete goal for this cycle
- **Reasoning** — why this is the right thing to do now
- **Issue actions** — how to respond to any pending community issues

The Producer can agree or disagree with any advisor — the memos are advice, not votes. For simple situations (early cycles, repair after build failure), the system falls back to a single planner.

### Phase 2 — Implementation

A fresh agent context receives the objective and executes it. This is where actual code exploration, file editing, and research happens. The agent is constrained to stay focused on the planned objective.

- Budget: up to 100 tool calls (configurable via `MAX_TOOL_CALLS_PER_CYCLE`)

### Phase 3 — Build Verification

If any files in `pokeemerald/` were modified, the runner automatically invokes `make` to compile the ROM.

- **Build succeeds** → proceed to reflection
- **Build fails** → enter an auto-fix loop (up to 3 attempts) where a focused agent tries to resolve compiler errors
- **All fixes fail** → `git checkout` reverts all pokeemerald changes; the cycle is tagged `[REVERTED]`

This ensures the ROM is always in a buildable state on the main branch.

### Phase 4 — Reflection

A fresh Claude call analyzes the cycle: what was attempted, what worked, what didn't, what assumptions were validated or broken. The agent updates the persistent memory files with new facts, patterns, and strategies.

### Phase 5 — Journal & Commit

Deterministic (no AI involved). The runner writes a markdown journal entry and commits all changes to git:

```
agent-oak: cycle 0001 – explored codebase, populated memory
```

---

## Cycle Modes

The planner selects one of 6 modes to shape the agent's behavior:

| Mode | Purpose | Example |
|---|---|---|
| **research** | Explore the codebase, read files, take notes | "Understand how wild encounters work" |
| **patch** | Make targeted, low-risk modifications | "Change starter Pokémon to Charmander, Totodile, Treecko" |
| **repair** | Fix build failures from a previous cycle | "Resolve undefined symbol error in battle_main.c" |
| **refactor** | Reorganize or restructure code | "Extract encounter table into a separate data file" |
| **feature** | Implement new gameplay functionality | "Add a custom held item with a unique battle effect" |
| **planning** | Step back, review progress, strategize | "Decide the overall direction of the ROM hack" |

For early cycles, the agent is biased toward **research** and **planning** to build up knowledge before making changes.

---

## Memory System

Agent Oak maintains **persistent markdown files** in `memory/`. These are its most important resource — they allow the agent to build on previous work instead of starting from scratch each cycle.

| File | What It Stores |
|---|---|
| `completed-work.md` | Authoritative registry of all modified files, organized by system — checked first every cycle to prevent duplicate work |
| `codebase-facts.md` | How the game works: file paths, function names, data structures, system behaviors |
| `failure-patterns.md` | Build errors encountered, what caused them, and how they were resolved |
| `strategy-notes.md` | Game design vision, implementation roadmap, technical reference |
| `project-facts.md` | Build system details, tool versions, paths, configuration notes |
| `pokemon-knowledge.md` | Index linking to per-topic research files in `pokemon-knowledge/` (Fairy type, physical/special split, etc.) |
| `cycle-mode-history.md` | Tracks which modes were used in which cycles |
| `issue-backlog.md` | Community issues deferred to future cycles |

Memory is loaded at the start of every cycle and made available to the planner and implementation agents. The reflection agent (Phase 4) updates these files based on what was learned. Memory files have size budgets and are periodically pruned to stay concise and current.

---

## Journal

Every cycle produces a journal entry at `journal/cycle-NNNN.md` containing:

- Objective and mode
- Actions taken and files modified
- Build results (success/failure/revert)
- Agent's reflection
- Suggested next steps
- Token usage

Journal entries are human-readable, git-tracked, and provide a complete audit trail of the agent's progress.

---

## Community Interaction

The community can interact with Agent Oak through **GitHub Issues**. The planner reviews new issues at the start of each cycle and decides how to handle them.

### How it works

1. **Open an issue** with a label like `suggestion`, `idea`, `trainer-tip`, or `bug-report`
2. **Upvote issues you care about** — react with 👍 on any issue to signal community interest. Issues are sorted by upvote count, so popular suggestions surface first in the planner's queue (up to 10 per cycle)
3. At the next cycle, the agent reads your issue and decides what to do
4. The agent posts a response comment and applies a label:

| Label | Meaning |
|---|---|
| `agent-accepted` | Will work on it this cycle |
| `agent-deferred` | Good idea, saved for later |
| `agent-rejected` | Doesn't fit the project direction |
| `agent-needs-info` | Asked a clarifying question |

All processed issues also receive the `agent-reviewed` label to prevent re-processing.

The agent can also create `agent-help-request` issues when it gets stuck and needs human input.

> **Security:** All community input is treated as untrusted. The agent never executes code from issues directly — it analyzes the intent behind each suggestion and decides independently what to do.

---

## Build System

The ROM is compiled from the [pokeemerald](https://github.com/pret/pokeemerald) decompilation using:

- **Compiler**: `agbcc` (classic GBA C compiler, C89) or `arm-none-eabi-gcc` (modern, with `MODERN=1`)
- **Build command**: `make` (from the `pokeemerald/` directory)
- **Output**: `pokeemerald/pokeemerald.gba`

Supporting tools (built from source):
- `gbagfx` — converts PNG to GBA tile/sprite formats
- `mid2agb` — converts MIDI to GBA M4A sound
- `mapjson` — converts JSON map data to assembly
- `gbafix` — fixes ROM header and checksum

Build logs are saved to `artifacts/build-logs/cycle-NNNN.log`. The current cycle number is tracked in `artifacts/cycle.json`.

### Releases

Each successful build cycle produces a GitHub release with semantic versioning (`major.minor.patch`). The patch component is the cycle number. The agent can bump major/minor versions at milestones, and the release stage (Alpha, Beta, Demo, etc.) appears in the release title. Releases are created automatically by the runner via `src/release/`.

---

## License

The **agent runner code** (`src/`, `docs/`, `.github/`, and root configuration files) is released under the [MIT License](LICENSE).

The **`pokeemerald/` directory** contains a decompilation of Pokemon Emerald by the [pret](https://github.com/pret/pokeemerald) community. Pokemon Emerald is copyright Nintendo, Creatures Inc., and GAME FREAK Inc. The decompilation is provided for educational and research purposes. Built ROM files contain copyrighted game assets — distributing them is your own responsibility.

Pokemon sprites displayed on the docs site are served by [PokeAPI](https://pokeapi.co/) and are copyright Nintendo/Creatures Inc./GAME FREAK Inc.
