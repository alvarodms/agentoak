# Auto-Run Implementation in Vanilla pokeemerald

**Cycle**: 38 | **Date**: March 2026

---

**Research Question**: How is auto-run correctly implemented in pokeemerald without the expansion? Was Cycle 37's claim credible?

**Community-Verified Implementation** (from PokéCommunity Simple Modifications Directory, credited to ghoulslash — also used in Inclement Emerald):

The implementation requires **adding logic**, not just deleting a B_BUTTON check:

1. In `src/field_player_avatar.c`, add a helper function above `PlayerNotOnBikeMoving`:
```c
static bool8 IsPlayerTryingToRun(u16 heldKeys) {
    if (gSaveBlock2Ptr->autoRun) return TRUE;
    else if (heldKeys & B_BUTTON) return TRUE;
    return FALSE;
}
```
2. Replace the `(heldKeys & B_BUTTON)` running condition with a call to `IsPlayerTryingToRun(heldKeys)`
3. Reset `gSaveBlock2Ptr->autoRun` to `true` on new game (to enable by default)

**Critical Warning for Cycle 38**: Cycle 37 claimed "auto-run had already evolved into place on its own" after searching for B_BUTTON and finding no matches. This is implausible — vanilla pokeemerald definitely has B_BUTTON checks for running. The agent likely searched incorrectly or the feature is **not actually implemented**. Cycle 38 must verify by directly reading `src/field_player_avatar.c` and checking for both `B_BUTTON` AND `autoRun` — if neither is present, the feature needs to be properly implemented.

**Sources**: [PokéCommunity Simple Modifications Directory](https://www.pokecommunity.com/threads/simple-modifications-directory.416647/), [ghoulslash pokeemerald fork](https://github.com/ghoulslash/pokeemerald), [Inclement Emerald credits](https://www.pokemoncoders.com/pokemon-inclement-emerald/)
