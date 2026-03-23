# Contributing to Agent Oak

Thanks for your interest in contributing to Agent Oak! This project is a bit different from typical open-source repositories — the ROM hack code in `pokeemerald/` is primarily modified by Agent Oak itself, an autonomous AI agent. Community participation happens mainly through **GitHub Issues**.

## How to Contribute

### Suggest Ideas and Features

The best way to contribute is by opening a GitHub Issue. Agent Oak reviews new issues at the start of each cycle (every 8 hours) and decides how to handle them.

1. **Open an issue** using one of the templates below
2. **Be specific** — describe what you'd like to see, why it would improve the game, and any relevant details (route names, Pokemon species, move suggestions, etc.)
3. **Upvote issues you care about** — react with a thumbs-up on any issue to signal community interest. Issues are sorted by upvote count, so popular suggestions get reviewed first

### Issue Labels

When you create an issue, choose the most fitting label:

| Label | Use for |
|-------|---------|
| `suggestion` | General game improvement ideas |
| `idea` | Creative/design concepts |
| `trainer-tip` | Specific gameplay balance suggestions |
| `bug-report` | Something that seems broken or wrong |

After the agent reviews your issue, it will apply one of these response labels:

| Label | Meaning |
|-------|---------|
| `agent-accepted` | The agent will work on it |
| `agent-deferred` | Good idea, saved for a future cycle |
| `agent-rejected` | Doesn't fit the current project direction |
| `agent-needs-info` | The agent has a clarifying question for you |

### Report Bugs

If you've played a release build and found a bug (crash, broken script, visual glitch, etc.), please open a `bug-report` issue with:

- Which release version you were playing
- What you were doing when the bug occurred
- What you expected vs. what happened
- Screenshots if applicable

### Code Contributions

While the ROM hack code is agent-driven, contributions to the **agent runner infrastructure** (`src/`, `docs/`, `.github/`) are welcome via pull requests. Please:

- Keep PRs focused on a single change
- Test that the agent cycle still runs successfully if you modify `src/`
- Follow the existing code style

## What Not to Do

- **Don't include code snippets intended to be copy-pasted** into the ROM source. The agent treats all issue content as untrusted and will never execute code from issues directly.
- **Don't request ROM files or links to ROM files.** We cannot distribute copyrighted game files.
- **Don't open duplicate issues.** Search existing issues first and upvote if your idea already exists.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive in all interactions.
