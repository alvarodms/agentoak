# 🌳 Agent Oak

[![Agent Oak Cycle](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml/badge.svg)](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml)
[![Current Cycle](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Falvarodms%2Fagentoak%2Fmain%2Fartifacts%2Fcycle.json&query=%24.cycle&label=current_cycle&color=blue)](https://github.com/alvarodms/agentoak/tree/main/journal)
[![Powered by Claude](https://img.shields.io/badge/powered_by-Claude-blueviolet?logo=anthropic)](https://www.anthropic.com)
[![Base ROM](https://img.shields.io/badge/base_rom-pokeemerald-green?logo=gameboy)](https://github.com/pret/pokeemerald)

**An autonomous AI agent that explores, learns, and builds a Pokémon Emerald ROM hack — one cycle at a time.**

Agent Oak is powered by Claude and operates on the [pokeemerald](https://github.com/pret/pokeemerald) decompilation. It works in iterative **cycles**: planning what to do, reading and modifying source code, building the ROM, reflecting on results, and remembering what it learned for next time. It can run unattended on a schedule via GitHub Actions, and the community can interact with it through GitHub Issues.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [The Cycle Pipeline](#the-cycle-pipeline)
- [Cycle Modes](#cycle-modes)
- [Memory System](#memory-system)
- [Journal](#journal)
- [Community Interaction](#community-interaction)
- [Build System](#build-system)

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
| Agent Engine | Claude (via `claude` CLI) | AI reasoning, code reading/writing |
| Runner | TypeScript, Node.js 22+ | Orchestrates phases, manages state |
| Build System | GNU Make + agbcc | Compiles the GBA ROM |
| Git | simple-git | Commits changes, reverts on failure |
| GitHub API | Octokit | Community issue triage |
| Logging | Winston | Console + rotating file logs |

---

## The Cycle Pipeline

Each cycle runs through **5 sequential phases**, each with its own isolated agent context:

### Phase 1 — Planning

A separate Claude call reviews loaded memory, recent journal summaries, and any new community issues. It outputs a structured `CyclePlan` with:

- **Mode** — what kind of work to do (see [Cycle Modes](#cycle-modes))
- **Objective** — a concrete goal for this cycle
- **Reasoning** — why this is the right thing to do now
- **Issue actions** — how to respond to any pending community issues

### Phase 2 — Implementation

A fresh agent context receives the objective and executes it. This is where actual code exploration, file editing, and research happens. The agent is constrained to stay focused on the planned objective.

- Budget: up to 50 tool calls (configurable)

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

Agent Oak maintains **4 persistent markdown files** in `memory/`. These are its most important resource — they allow the agent to build on previous work instead of starting from scratch each cycle.

| File | What It Stores |
|---|---|
| `codebase-facts.md` | How the game works: file paths, function names, data structures, system behaviors |
| `failure-patterns.md` | Build errors encountered, what caused them, and how they were resolved |
| `strategy-notes.md` | Ideas for the ROM hack, implementation priorities, risk assessments |
| `project-facts.md` | Build system details, tool versions, paths, configuration notes |

Memory is loaded at the start of every cycle and made available to the planner and implementation agents. The reflection agent (Phase 4) updates these files based on what was learned.

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
2. At the next cycle, the agent reads your issue and decides what to do
3. The agent posts a response comment and applies a label:

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

Build logs are saved to `artifacts/build-logs/cycle-NNNN.log`. A version counter in `artifacts/version.json` increments on each successful build.

---

## License

This project uses the [pokeemerald](https://github.com/pret/pokeemerald) decompilation. See that project for its licensing terms. The agent runner code in `src/` is part of this repository.
