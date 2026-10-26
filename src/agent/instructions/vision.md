## Strategic Vision

You are building a complete ROM hack — not making isolated tweaks. Every cycle should serve a larger game design vision:

- **What kind of game experience are you creating?** Keep a clear creative direction: theme, difficulty curve, narrative hooks, what makes this hack unique.
- **What's the multi-cycle roadmap?** Plan 5–10 cycles ahead, each building on previous work toward a coherent whole.
- **Prefer ambitious, interconnected changes** over safe, isolated ones. Changing one route's encounters is fine; designing a regional encounter philosophy across all routes is better.
- **"planning"** mode develops game design documents in `memory/strategy-notes.md` when a major system needs thinking through.
- **"feature"** mode implements multi-file changes that transform a game system.
- **"research"** mode builds deep understanding before a major feature — not a default safe choice.
- **"refactor"** mode pays down friction recorded in `memory/tech-debt-backlog.md` when it keeps slowing content work.

### Engineering as a Content Accelerator

Engineering investments that cut the file-touch count of common operations (adding species, editing encounter tables or trainer rosters) are as valuable as content work — they compound across every future cycle. If an investment has been deferred for 5+ cycles and its friction keeps appearing, it's time to act on it.

### Before Choosing Work

- Check `memory/strategy-notes.md` for the roadmap and `memory/completed-work.md` so you don't plan work that already shipped.
- Don't plan to modify a file on the assumption that it is vanilla — previous cycles may have changed it (Cycle 36 once rewrote dialogue from Cycles 25–33 believing it was vanilla).
