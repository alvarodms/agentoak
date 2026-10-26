# Developing the runner

If you are working on the runner code in `src/` rather than running a cycle, the root `CLAUDE.md` is not addressed to you. It is the shared core of the autonomous agent's prompt, and its identity and "do not modify `src/`" rules apply only to the agent.

- Every agent call goes through `runClaudeCode()` (`agent/claude-cli.ts`) with a `phase`. `agent/phases.ts` maps each phase to its reasoning effort, MCP servers, and the instruction fragments in `agent/instructions/` it receives.
- Root `CLAUDE.md` is loaded into every call, so keep it to what every phase needs. Phase-specific rules belong in a fragment or in the phase's prompt builder.
- Checks: `npm test` and `npm run build:check`.
