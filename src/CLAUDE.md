# Developing the runner

If you are working on the runner code in `src/` rather than running a cycle, the root `CLAUDE.md` is not addressed to you. It is the shared core of the autonomous agent's prompt, and its identity and "do not modify `src/`" rules apply only to the agent.

- Every agent call goes through `runClaudeCode()` (`agent/claude-cli.ts`) with a `phase`. `agent/phases.ts` maps each phase to its reasoning effort, MCP servers, and the instruction fragments in `agent/instructions/` it receives.
- Root `CLAUDE.md` is loaded into every call, so keep it to what every phase needs. Phase-specific rules belong in a fragment or in the phase's prompt builder.
- Checks: `npm test` and `npm run build:check`.
- `src/emulator/` (the playtest harness) is the one runner directory the agent may change. Its edits are tracked as a second game tree (`HARNESS_DIR` in `repo/harness-check.ts`): verified with `tsc --noEmit` + `vitest run`, rolled back on failure, committed with the cycle. Keep anything the agent must not be able to weaken (checks, the gate) outside it, and don't import `src/emulator` from the runner at runtime: the playtest gate runs the suite in a child process so it uses the harness as the agent left it.
