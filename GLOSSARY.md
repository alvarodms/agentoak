# Agent Oak Runner

The runner drives Agent Oak through cycles of planning, implementing, verifying and committing changes to a Pokémon Emerald ROM hack.

## Language

**Cycle**:
One full pass of the runner: plan, implement, verify, reflect, commit. A cycle produces at most one commit.
_Avoid_: run, iteration, session

**Game tree**:
The `pokeemerald/` source the ROM is built from, as it stands while a cycle works on it.
_Avoid_: ROM source, pokeemerald dir, working tree

**Baseline**:
The committed state of the game tree that a cycle starts from. Anything left over in the game tree when a cycle starts is not part of the baseline, and is set aside before the cycle begins.
_Avoid_: start SHA, session start

**Change set**:
Everything in the game tree that differs from the baseline, as the repository itself sees it. What agents report touching does not count.
_Avoid_: files modified, filesModified, cycle changes

**Verified change set**:
A change set whose game tree has built successfully. A cycle commits only its verified change set, never later edits.
_Avoid_: passing build, green tree

**Rollback**:
Restoring the game tree to the cycle's last verified change set, or to the baseline if nothing has built yet.
_Avoid_: revert (when the cycle keeps verified work)

**Reverted cycle**:
A cycle that commits nothing to the game tree, because nothing built or because it crashed. Its game tree is rolled back to the baseline.
_Avoid_: failed cycle
