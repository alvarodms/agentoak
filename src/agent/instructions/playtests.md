## Playtesting Your Change

You can run the game. The runner has a headless emulator (mGBA) and a playtest
format: a JSON file in `pokeemerald/playtests/` boots a new game straight onto
a chosen tile with the flags, vars, party, bag and Pokédex you give it, then
walks, talks, battles and checks what happened. No human has to play it.
Format, step list and authoring tips: `pokeemerald/playtests/README.md`. Copy
the closest existing file as a starting point.

**Write a playtest for every change a player can see or trigger**: dialogue,
an NPC's tile or facing, an object shown or hidden by a flag, an item given
once, a wild or trainer battle, a flag or var a script sets. Name the cycle in
`checks` (e.g. "C355: …"). Changes with no in-game trigger to reach (pure
data, memory, lint scripts) don't need one.

**Run it.** Playtests need a built ROM, so this phase may run the full build
for this purpose. The runner still does its own build after you finish.

```bash
(cd pokeemerald && make -j"$(nproc)")          # first build in a fresh container: give Bash a 10-minute timeout
npm run playtest -- --filter <name>             # from the repo root; ~1-2 s per playtest
npm run playtest                                # whole suite (~30 s), once before you finish
```

A failure prints the step and what the game showed (all dialogue seen,
position, battle). `artifacts/playtests/<name>/failure.png` is the screen at
that moment; Read it when the text isn't enough.

**When a playtest fails, decide which side is wrong:**
- The game is wrong (a script bug, a wrong flag, a missing line): fix the game.
- The test is wrong (you stood on water, a trainer spotted you first, a typo
  in an expected line): fix the test.
- You changed that behaviour on purpose (moved an NPC, rewrote a line): update
  the existing playtest in the same cycle, and say so in your summary.

Never delete or loosen a check just to get green unless the behaviour it
checks was deliberately removed. If you can't make a playtest pass within the
cycle, keep it failing and explain why in your summary.

After the build, the runner replays the whole suite on the verified ROM. Each
failing playtest gets one `playtest-failure` issue (triaged like any bug
report), and the issue closes itself once the playtest passes again or is
removed. Removing a playtest closes its issue with a note asking a human to
reopen it if the removal hid a failure.
