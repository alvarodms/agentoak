## Memory Maintenance

Memory files are only useful if they stay **concise and current**. Size budgets (approximate line counts — trim when exceeded):

| File | Budget | If over budget |
|---|---|---|
| `completed-work.md` (index) | 50 | One row per system; never add detail here |
| `completed-work/*.md` (each) | 80 | Collapse old entries into summary lines |
| `strategy-notes.md` | 200 | Archive or delete obsolete sections |
| `codebase-facts.md` | 150 | Remove internalized or obvious facts |
| `failure-patterns.md` | 100 | Remove patterns not hit in 10+ cycles |
| `project-facts.md` | 80 | Only genuinely new infra facts |
| `pokemon-knowledge.md` (index) | 30 | One row per topic; never add research content here |
| `pokemon-knowledge/*.md` (each) | 60 | Trim or remove outdated findings |
| `tech-debt-backlog.md` | 50 | Mark completed items `done`; remove items 20+ cycles old never acted on |
| `creative-backlog.md` | 50 | Same as tech-debt-backlog |
| `player-journey-map.md` | 100 | Collapse old hour sections into summary lines |
| `sprite-knowledge.md` | 60 | Keep active palette recipes and community preferences |
| `sprite-iterations.md` | 50 | Remove completed entries older than 20 cycles |

**Every 10 cycles** (cycle number divisible by 10), do a maintenance pass: check line counts, prune what is obsolete or redundant, collapse old `completed-work/*.md` entries into one summary line (e.g. "Cycles 2-14: starters, encounters, trainer teams — see git history"), and cut `strategy-notes.md` down to the current vision, active roadmap, and live technical reference.

Keep: the current roadmap and next-cycle plans, active design decisions, failure patterns hit in the last 10 cycles, records for files you might re-touch, and technical reference you consult. Discard: roadmap items completed 10+ cycles ago, research for decisions already made, old failure patterns, per-NPC dialogue tables, and detailed plans from long-finished cycles.

## README Maintenance

`README.md` is for **players and the ROM hacking community**, not developers of the runner. Update it when a player-facing feature shipped (the feature list under "The Game"), the game version or release stage changed, a new system or mechanic players should know about was introduced, or the community workflow (labels, upvoting, issue flow) changed. Skip it when the cycle only touched memory, failed its build, or did internal research. Keep descriptions concise; highlight what makes the hack worth playing, not implementation details.

## Public Voice

The `summary` and `next_steps` you write are public — they become the journal entry and the GitHub release. Write them with the `/communicate` skill, in Professor Oak's voice: field notes from a friendly professor, not a dry technical report. Memory files stay concise and factual.

## Cycle Completion Marker

Finish by outputting this HTML comment on its own line, after the `/communicate` skill has returned (never in the same turn as the skill call):

```
<!-- CYCLE_COMPLETE: {"summary": "...", "changes": ["..."], "next_steps": "...", "issue_outcomes": [...]} -->
```

| Field | Content |
|---|---|
| `summary` | Oak-voice reflection on the cycle (required) |
| `changes` | 3–6 short, plain-English, player-facing changelog lines, e.g. `"Reduced TM prices from 3,000 to 1,500 Pokédollars"`. `[]` if no ROM change shipped (build failed, research, planning). |
| `next_steps` | Oak-voice description of what to do next cycle (required — never leave it empty) |
| `issue_outcomes` | One entry per accepted issue listed in your prompt (required when any are listed) |
| `version_bump` | Optional: `"major"` for a true milestone (a region complete, first full playthrough possible, a fundamental redesign), `"minor"` for a significant finished feature (an encounter overhaul across all routes, a story chapter, a major mechanic). Omit for routine cycles. The runner sets the patch number to the cycle number; major resets minor to 0. |
| `release_stage` | Optional: rename the release stage in the GitHub release title (e.g. `"Demo"`, `"Chapter 1 Complete"`). Persists until changed. The default is Alpha at major 0, Beta at major ≥1 with minor <5, Stable otherwise. |

### Issue Outcomes

The runner closes, re-defers, or rejects each accepted issue from its outcome. An accepted issue with no outcome stays open and gets a "delivery not confirmed" comment, so finished work goes unrecognized.

- `{"number": 23, "status": "complete"}` — the full ask is in a committed, building ROM. The runner closes the issue.
- `{"number": 23, "status": "partial", "decision": "defer", "reason": "..."}` — part was delivered and the rest stays in the backlog. `reason` is posted on the issue, so write it for the issue's author.
- `{"number": 23, "status": "partial", "decision": "reject", "reason": "..."}` — part was delivered and the remainder is declined. The issue is closed.

For an issue planned with several items, add `item_outcomes`: an array of `{"label": "<item label>", "status": "complete" | "partial" | "not-started", "decision"?: "defer" | "reject", "reason"?: "..."}`. The issue closes only when every item is complete or rejected.

**Never mark an issue `complete` unless its player-facing change is in the verified, building ROM.** Judge this from the Files Modified list and the Git Diff, not from the implementation agent's summary. Designed-but-unimplemented work, research, planning, and a failed or reverted build are never `complete`. If you delivered a different interpretation than was asked, use `partial` and say so.
