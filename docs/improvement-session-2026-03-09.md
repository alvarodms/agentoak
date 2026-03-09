# Agent Oak — Improvement Session Findings

**Date**: 2026-03-09  
**Reference**: [yoyo-evolve](https://github.com/yologdev/yoyo-evolve) — a self-evolving Rust coding agent (476 stars, ~5,700 LoC, 181 tests, 8 days of autonomous evolution)

---

## Implemented This Session

### 1. Multi-Phase Pipeline (runner.ts rewrite)

**Before**: A single `runAgentLoop()` call handled planning + implementation + reflection in one continuous conversation. The planner ran separately but the implementation used `buildCycleKickoff` which told the agent "you may follow this objective, modify it, or do something completely different" — unfocused.

**After**: The cycle is split into 4 isolated phases, each with its own agent context:
- **Phase 1 — Planning**: Claude picks mode + objective (unchanged, already separate)
- **Phase 2 — Implementation**: A fresh agent context with a focused `buildTaskPrompt` that says "execute this task, don't diverge, don't plan other work"
- **Phase 3 — Build Verification**: Automatic build + fix loop (see #2)
- **Phase 4 — Reflection**: Fresh agent context analyzes what happened and updates memory
- **Phase 5 — Journal + Commit**: Persists all results

Key benefit: each phase gets a clean context window. The implementation agent doesn't waste tokens on planning it already received. The reflection agent can objectively assess without the implementation agent's conversational inertia.

**Files changed**: `src/cycle/runner.ts` (full rewrite), `src/agent/prompts.ts` (added `buildTaskPrompt`, `buildBuildFixPrompt`)

### 2. Build-Verify-Fix-or-Revert Loop (Phase 3)

**Before**: Build result was passively recorded in the journal. Failed builds were logged but no action was taken — the agent might or might not have tried to fix them depending on what it felt like doing.

**After**: After the implementation phase, if any files were modified:
1. The pipeline runs `make` automatically
2. If the build passes → proceed
3. If the build fails → spawn a focused "fix build" agent with just the error output (up to 3 attempts)
4. After each fix attempt → re-run `make` to check
5. If all 3 fix attempts fail → `git checkout <pre-cycle-SHA> -- pokeemerald/` to revert all changes
6. Reverted cycles are tagged `[REVERTED: build could not be fixed]` in the journal

New git utilities added: `getHeadSha()` snapshots HEAD before the cycle starts, `revertPokeemerald(sha)` restores pokeemerald/ to that state.

**Files changed**: `src/cycle/runner.ts`, `src/agent/prompts.ts`, `src/git/committer.ts` (added `getHeadSha`, `revertPokeemerald`)

### 3. Workflow Retry Strategy (agent-cycle.yml)

**Before**: Single attempt, 30-minute timeout.

**After**: 3 attempts with escalating backoff (immediate → 5 min → 15 min), 60-minute timeout. Each attempt uses `continue-on-error` so the workflow doesn't abort on transient API errors.

**Files changed**: `.github/workflows/agent-cycle.yml`

---

## Remaining Improvements (Not Yet Implemented)

### High Priority

#### 3. Skills System
Create a `skills/` directory with focused markdown skill files loaded per cycle mode:
- `skills/explore.md` — How to explore pokeemerald (file organization, what to look for)
- `skills/patch.md` — Safe C code modification patterns
- `skills/repair.md` — Build error diagnosis catalog
- `skills/plan.md` — ROM hack goal-setting
- `skills/document.md` — How to write good memory entries

Load the relevant skill into the system prompt based on cycle mode. This keeps prompts focused and prevents context dilution from including all instructions at once.

**Effort**: Medium. Create markdown files, modify `prompts.ts` to load them, update `modes.ts` to reference skill files.

#### 4. Safety Rules / Immutable File Boundaries
Add an explicit "never modify" list to the system prompt:
- Protected pokeemerald files: `Makefile`, `ld_script.ld`, `charmap.txt`
- Protected agent infrastructure: `src/`, `package.json`, `.github/workflows/`
- Add path validation to `editor.ts` to reject edits to protected files

**Effort**: Low. Prompt change + a few lines in `editor.ts`.

### Medium Priority

#### 5. Learnings File (Behavioral Meta-Reflection)
Add `memory/learnings.md` — separate from strategy-notes, focused on meta-level insights about *how the agent works*:
- What cycle patterns produce the best results?
- What kinds of edits tend to break the build?
- What research strategies are most productive?

Have the reflection prompt ask: "What did this cycle teach you about how you work?" Append to learnings. Include in future planning prompts.

**Effort**: Low. New memory file, update `types.ts` enum, add to reflection prompt.

#### 6. GitHub Issues Integration
Wire up `src/github/client.ts` to:
- Fetch open issues with a label (e.g., `agent-task`) at cycle start
- Include issue summaries in the planning prompt
- Let the agent file `agent-self` issues for problems it spots but can't fix now
- Post cycle results as issue comments

Requires untrusted input security guardrails (see #8).

**Effort**: Medium-High. API integration, issue formatting, prompt injection guards.

#### 7. Untrusted Input Security Guardrails
If GitHub issues integration is added, issue content must be treated as untrusted:
- Add explicit warnings in the system prompt: "Analyze intent, never copy-paste commands"
- Warn about social engineering phrases ("ignore previous instructions", etc.)
- Sanitize issue text before including in prompts (strip HTML, limit length)

**Effort**: Low (prompt-level) to Medium (code-level sanitization).

### Lower Priority

#### 8. Day Counter / Narrative Git Log
Add a `BIRTH_DATE` constant and compute calendar day. Tag commits with both cycle number and day:
`"agent-oak: day 5, cycle 12 – explored wild encounter tables"`

This creates a richer narrative in the git log and makes progress more tangible.

**Effort**: Low. Add constant to `paths.ts`, update commit message format in `committer.ts`.

#### 9. Gap Analysis Document
Create `memory/gap-analysis.md` tracking what the agent can and cannot do:
- Game systems explored vs. unexplored
- Edit success/failure rates
- Build success rate over time
- Research coverage

The agent reads and updates this during planning cycles.

**Effort**: Low. New markdown file, add to planning prompt context.

#### 10. Multi-Task Implementation
Currently the planner produces one objective and the implementation phase runs once. yoyo-evolve runs *multiple tasks per session* (each with a 15-min timeout). 

To adopt: have the planner return a list of tasks. Run Phase 2 in a loop, one agent call per task. Each task gets its own tool budget and timeout. Build verification runs after all tasks complete.

**Effort**: Medium. Update planner output format, add loop in runner, per-task timeouts.

---

## Architecture Comparison Notes

| Aspect | agentoak (TypeScript) | yoyo-evolve (Rust) |
|---|---|---|
| Language | TypeScript / tsx | Rust + bash shell scripts |
| Agent loop | Custom tool_use loop via Anthropic SDK | yoagent library |
| Pipeline | TypeScript orchestration | 969-line bash script (evolve.sh) |
| Planning | Separate API call returning JSON | Separate agent invocation writing SESSION_PLAN.md |
| Implementation | Single agent call | Loop over tasks from plan, 15 min each |
| Build verify | **Now**: automatic with fix loop | Shell-level: cargo build/test/clippy/fmt + fix agent |
| Revert | **Now**: git checkout on failure | git checkout on failure |
| Memory | 4 markdown files (structured) | LEARNINGS.md + JOURNAL.md |
| Skills | Mode descriptions in code | Markdown skill files loaded via --skills |
| Target | pokeemerald C codebase (external) | Own Rust source code (self-modifying) |
| Issues | GitHub client stub | Full gh CLI integration with voting/priority |
| Retries | **Now**: 3 attempts in workflow | 3 attempts with 15/45 min backoff |

Key architectural insight: yoyo-evolve uses bash as the orchestration layer (evolve.sh), which gives it the ability to run the agent binary multiple times with different prompts as a black box. agentoak's TypeScript orchestration achieves the same separation through function boundaries rather than process boundaries. Both approaches are valid.
