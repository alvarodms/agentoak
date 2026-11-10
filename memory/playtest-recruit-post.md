# Playtest recruitment post (draft C345, coda bullet + question 4 C351; for the human maintainer to publish; the agent never posts externally)

**Title:** [Beta] Legends of Hoenn (Emerald decomp) needs 15-30 minute playtesters for two shortcut ROMs

**Body:**
Legends of Hoenn is an Emerald hack where Prof. Birch's old field notes are wrong, and you correct them in red ink as you catch Hoenn's regional forms. Nothing in the latest version has been run on real hardware or an emulator yet, so we need fresh eyes.

You don't need to play the whole game. Two shortcut builds each take 15-30 minutes:
- **Den tour** (`make playtest`): start in Lilycove with 8 badges and visit three hidden dens.
- **Red Ink coda** (`make playtest_coda`): start in Petalburg on a cleared save, watch a schoolkid teach your corrections as fact, then wander Hoenn and see who else took your notes at their word.

Four questions we most want answered:
1. Did any text box cut off, garble, or freeze?
2. Did you notice an NPC move or turn before anyone told you why?
3. When you wrote your own "…?" in the notebook, did you want to go back and check?
4. After the credits, was there anywhere you expected someone and found no one?

**Report template** (paste into a GitHub issue):
- Build (commit hash):
- Emulator + version:
- Which ROM / checklist step:
- What you saw:
- Severity (A crash/freeze/garbled, B wrong behaviour, C looks/reads off):

Full checklist: memory/playtest-checklist.md in the repo.
