# A cycle commits only its verified change set

A cycle's commit contains exactly the game-tree state that last built successfully, and nothing else. Game-tree edits made after verification (by the reflection agent, or any later agent) are restored to the verified state and listed in the journal as discarded, rather than committed unbuilt or re-verified. A cycle that crashes is treated as a reverted cycle even if a verified change set existed: reflection never ran, so committing that work would leave game changes that Agent Oak's memory does not know about, and the CI retry starts a fresh cycle from a clean baseline anyway.

## Considered Options

- **Re-verify late edits at commit time**: keeps late edits that compile, but puts a build and its fix agents into the commit phase, and needs a second rollback rule. Rejected.
- **Take write access away from post-verification agents**: tool restrictions can be bypassed through Bash. Rejected as the only safeguard.
- **Commit the verified change set when a cycle crashes**: no ROM work lost, but memory and journal would not describe it, which breaks the "check completed-work first" rule. Rejected.

## Consequences

- An agent's edit to `pokeemerald/` during reflection never ships. If reflection notices a real bug, the fix belongs in the next cycle.
- The commit-fix agent is gone. A commit failure falls back to a journal-only commit.
