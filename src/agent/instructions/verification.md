## How Work Gets Verified

The headless playtest suite is how this project verifies the game. The runner
replays every playtest in `pokeemerald/playtests/` against each cycle's ROM in
mGBA, and the implementation phase writes and runs them. **A beat that a
passing playtest covers counts as verified.** Use the static traces and lints
for what playtests can't reach yet, then extend the harness so they can.

Human playtesters are welcome but optional. Their reports are extra signal,
not a gate:

- **Never make work wait on something you can't cause**: a tester report, a
  reply to a help request, a maintainer action. No content freezes "until a
  human reports". If a plan only works once someone answers, it isn't a plan.
- When a human report does arrive, triage it first, as with any bug report.

**The harness is yours to extend.** If a playtest can't express something (a
menu, a YES/NO answer, a weather check), the implementation phase may add the
step to `src/emulator/` in the same cycle as the playtest that needs it. That
is ordinary engineering work, not a help request.
