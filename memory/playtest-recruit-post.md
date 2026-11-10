# Playtest recruitment post (rewritten C355; for the human maintainer to publish; the agent never posts externally)

**Venue note (not part of the post):** Do NOT post this on PokeCommunity. Its ROM Hacks Showcase / Progressing ROM Hacks guidelines (updated Oct 2026, per C355 research) ban hacks made with generative AI and delete such threads. Suggested venues: the project's own GitHub (a pinned issue or Discussions), or r/PokemonROMhacks after checking its current sidebar rules on AI. There are no screenshots; never fabricate any. Keep the disclosure sentence first wherever this is posted.

**Title:** [Beta][AI-built] Legends of Hoenn (Emerald decomp) is looking for 20-minute playtesters

**Body:**
Disclosure first: Legends of Hoenn is built by an autonomous AI agent, including the code, dialogue and story text. A human maintainer publishes the repository and this post. If that isn't for you, no hard feelings.

Legends of Hoenn is an Emerald hack where Prof. Birch's old field notes are wrong, and you correct them in red ink as you catch Hoenn's regional forms. Two story arcs, "Red Ink" and "Taken at Their Word", are now complete. None of it has been played on an emulator or real hardware yet. One honest report from you is worth more to this project than any feature we could add.

You don't need to play the whole game. Pick what fits your time:
- **About 20 minutes: the Red Ink coda** (`make playtest_coda`, gives `pokeemerald_playtest_coda.gba`). You start on a cleared save. After the credits, Hoenn believes everything you wrote. Walk around. Notice where.
- **About 30 minutes: the den tour** (`make playtest`, gives `pokeemerald_playtest.gba`). You start in Lilycove with 8 badges and three hidden dens to find.
- **Optional: a full run** from a new game (`make`). Stopping partway is completely fine. Just tell us where you stopped and why. That alone is useful.

Please play first, then answer in this order without reading ahead:
1. What do you remember most from what you played?
2. Did anyone or anything catch your eye that nobody had told you about? Where?
3. Was there a page in your notebook you weren't sure of?
4. After the credits, was there anywhere you expected someone and found no one?
5. Did any text box cut off, garble, or freeze?

**Report template** (paste into a GitHub issue on the repo):
- Build (commit hash):
- Emulator + version:
- Which ROM (coda / den tour / full run):
- Where did you stop, and why?
- Answers to questions 1-5:
- Bugs (what you saw + severity: A crash/freeze/garbled, B wrong behaviour, C looks/reads off):

**SPOILERS: open only after playing.** The step-by-step checklist is memory/playtest-checklist.md in the repo.

---

## README block (paste-ready, for the owner to use or ignore; the agent does not edit README.md)

## Playtesting: v3.0 "Red Ink" + v3.1 "Taken at Their Word"
This hack is built by an autonomous AI agent; a human maintainer publishes it.
Red Ink and Taken at Their Word are complete. Nothing in them has been played on an emulator or real hardware yet. One report from a real player is worth more than any feature.
Two shortcut ROMs take 15-30 minutes each. `make playtest_coda` starts on a cleared save: after the credits, Hoenn believes everything you wrote, so walk around and notice where. `make playtest` starts in Lilycove with 8 badges and three hidden dens. A full run is welcome but optional; if you stop, tell us where and why.
Play before opening memory/playtest-checklist.md, which contains spoilers. Report in a GitHub issue using the template in memory/playtest-recruit-post.md.
