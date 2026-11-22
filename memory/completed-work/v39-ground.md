# v3.9 "Ground that doesn't touch them" (Tate & Liza double battle), built C388

## As built
- **Roster** `sParty_TateAndLiza1` (src/data/trainer_parties.h ~4197, ITEM_CUSTOM_MOVES): CLAYDOL 38 LEFTOVERS EARTHQUAKE/PSYCHIC/LIGHT_SCREEN/ANCIENT_POWER · XATU 39 LUM_BERRY NIGHT_SHADE (PSYCHIC until C389)/SHADOW_BALL/CONFUSE_RAY/AERIAL_ACE · **LUNATONE 39** TWISTED_SPOON PSYCHIC/SHADOW_BALL/ROCK_TOMB/CALM_MIND (replaced ALAKAZAM 41 PSYCHIC/THUNDERBOLT/RECOVER/THUNDER_WAVE; first built at 41) · **ESPEON 40** (was 42) SITRUS_BERRY CALM_MIND/PSYCHIC/SHADOW_BALL/REFLECT. All iv 200. trainers.h untouched (aiFlags CHECK_BAD_MOVE | TRY_TO_FAINT | CHECK_VIABILITY, 4 HYPER_POTION, doubleBattle TRUE). The 41→39 / 42→40 change is the spec's ONE tuning step ("both lose"), applied C388.
- **Defeat text** `MossdeepCity_Gym_Text_TateAndLizaDefeat` (data/maps/MossdeepCity_Gym/scripts.inc:559; used by `trainerbattle_double TRAINER_TATE_AND_LIZA_1` at :52, map.json objects 1 and 9 run MossdeepCity_Gym_EventScript_TateAndLiza): "TATE: We don't feel\nthe ground…\pLIZA: …and you do." (replaced "TATE: You felt what we were / thinking -- / LIZA: -- before we thought it. / TATE: That's how ESPEON fights too."). Intro and rematch defeat text (:108) unchanged. check_text_width widest 97px.
- Validators C388: check_bosses 0 collisions (Lunatone already owned by Tate&Liza), check_doubles OK, `make -k check_all` FAILED: 0.

## Harness (src/emulator/playtest.ts, C388)
battleTurns plays double battles (auto-detected from gBattleTypeFlags & 1): `[partner NAME]` marker for the second battler's prompt (same FIGHT/slot), target prompt detected by `gBattlerControllerFuncs[0|2] == HandleInputChooseTarget` (battle_controller_player.o) and answered with `target` (`opponentLeft` default / `opponentRight`, LEFT + gMultiUsePlayerCursor == 3 check), moveFor keyed off `pickTargetBattler`, doubles send-out from menu slot 3 (`pickSendOutIndex`, cursor checked via gPartyMenu.slotId = offset 9, retries on "already been selected"). New `finishTurn` at battleTurns start: taps to the next "What will" (3600 frames), logging and forbid-checking the rest of a turn an earlier battleTurns stopped in, and doing send-outs there when `replace`. Unit tests in playtest.test.ts (target parse, pickSendOutIndex, pickTargetBattler, partner-marker turn count, PARTY_MENU_SLOT_ID vs include/party_menu.h). README battleTurns row documents it.
**Planted failures (C388, both deleted after)**: GROUND copy with final battleTurns forbid "Go! WHISCASH" → `battleTurns move 1: the turn it started in showed forbidden "Go! WHISCASH"; seen ["XATU♂","Go! WHISCASH!"]` right after `[sent out party menu slot 3]` (finishTurn path); FLOAT copy → `battleTurns move 1: turn 1 showed forbidden "Go! WHISCASH"; seen [..."SHELGON fainted! ","[sent out party menu slot 3]","XATU♂","Go! WHISCASH!"]` (in-turn path). Healthbox redraws leave "XATU♂"-style nickname strings in gDisplayedStringBattle; they land in battleLog harmlessly.

## Y7 yardstick results (playtests tate-liza-y7-ground / -float / -levitate; Mossdeep Gym 23,8 below TATE; all slot 1, target opponent-left, replace)
| Variant | ALAKAZAM 41 (baseline) | LUNATONE 41 / ESPEON 42 | LUNATONE 39 / ESPEON 40 (as built) |
|---|---|---|---|
| GROUND | LOSS 5t, 4 / 1 foe faint | LOSS 6t, 4 / 2 | LOSS 7t, 4 / 2 |
| FLOAT (SWELLOW) | LOSS 6t, 4 / 1 | LOSS 7t, 4 / 3 | LOSS 8t, 4 / 3 |
| LEVITATE (CHIMECHO) | LOSS 7t, 4 / 1 | LOSS 7t, 4 / 1 | LOSS 8t, 4 / 1 |
- Turn-1 EARTHQUAKE fired in every run (9/9) and "doesn't affect Foe XATU" every time; FLOAT also shows "doesn't affect SWELLOW", LEVITATE "CHIMECHO makes GROUND moves miss with LEVITATE!". EQ turns: GROUND 1,2; FLOAT 1,3; LEVITATE 1,2,4,5,6.
- **EQ share of damage**: EQ caused 1 of 12 player faints in the as-built runs (a turn-1 critical hit on SHELGON in GROUND), and 1 of 12 in baseline (the same crit). XATU's PSYCHIC caused 5 of 12 as built (SHELGON + SWELLOW in FLOAT, LINOONE in GROUND, three in LEVITATE), and the baseline killer was ALAKAZAM's PSYCHIC. The yardstick never targets XATU (opponent-left = CLAYDOL), so XATU lives to the end in every run.
- **Probe (temporary playtest, deleted)**: FLOAT with `target: "opponentRight"` on both battleTurns (hit XATU first): XATU falls on turn 4 but still LOSS 11t, 4 / 3 (EQ KO on WHISCASH turn 5; LUNATONE Levitate shown). Confirms the target path works live (`[target opponentRight]` logged per battler).
- **PASS (spec)**: criterion 1 met (turn-1 EQ, foe side untouched). GROUND LOSES (met), FLOAT WINS ≤2 faints (NOT met: LOSS 4/3 even after the step). Playtests stay report-only (`expectBattleSummary {}`), `checks` carry the numbers. Open FAIL for C389.

## C389 retrospective (CLOSED, branch B)
- trainer_parties.h sParty_TateAndLiza1 XATU: PSYCHIC → NIGHT_SHADE (the one move dial; nothing else touched). Y7 after: GROUND LOSS 7t 4/2 (XATU + CLAYDOL down), FLOAT LOSS 6t 4/2, LEVITATE LOSS 7t 4/2; turn-1 EQ 3/3; XATU's faintCauses share 7/12 → 4/12 (all SHADOW BALL), EQ 1/12 → 1/12.
- Playtests: tate-liza-y7-ground guarded `{"outcome": "loss"}`; -float / -levitate stay `{}` with "ACCEPTED (C389)" in checks. Full table: "Measurements (moved C390)" below.
- Harness (src/emulator/playtest.ts + playtest.test.ts): `BattleSummary.faintCauses` (summarizeBattle, unit test "tallies faint causes by the last foe move"); battleTurns turn timeout 3600 frames per turn → 3600 without a new message, `TURN_FRAME_CAP` 14400 per turn (the NIGHT_SHADE GROUND run's turn 4 outran the old budget while the game sat on an EXP bar). README expectBattleSummary row documents faintCauses.

## Measurements (moved C390)
Moved verbatim from strategy-notes.md v3.9 in C390.

### Results (C388, playtests tate-liza-y7-*, report-only)
Yardstick: full HP, no bag, slot 1 for both battlers, target opponent-left, replace. GROUND = SHELGON 41 / LINOONE / WHISCASH / GOLDUCK 40; FLOAT = slot 2 SWELLOW; LEVITATE = slot 2 CHIMECHO.
| | baseline ALAKAZAM | LUNATONE 41 | as built (39/40) |
|---|---|---|---|
| GROUND | LOSS 5t 4/1 | LOSS 6t 4/2 | LOSS 7t 4/2 |
| FLOAT | LOSS 6t 4/1 | LOSS 7t 4/3 | LOSS 8t 4/3 |
| LEVITATE | LOSS 7t 4/1 | LOSS 7t 4/1 | LOSS 8t 4/1 |
- PASS 1 (turn-1 EQ, foe side untouched): **met 9/9**. PASS 2 GROUND loses: met. PASS 3 FLOAT wins ≤2 faints: **FAIL** (open for C389).
- **The finding**: EQ is the theme but not the threat. It caused 1 of 12 player faints (a crit); XATU's PSYCHIC caused 5 of 12, and the yardstick never hits XATU (opponent-left = CLAYDOL). FLOAT's SWELLOW is KO'd by XATU, not by the ground. So "float" alone isn't an answer; "break the pair" (target XATU) is the untested one.
- **Reflection C388 (decision rule for C389, binding)**: two fights in a row (Route 119 rival C385-C387, now Tate & Liza) failed a narrow fixed yardstick, and both times the decider was a side threat, not the themed mechanic. The yardstick (4 mons, no bag, slot 1) is weaker than a real Badge-7 player (6 mons, Hyper Potions, player-chosen targets). C389 runs Y7-ADAPT ONCE; if it still loses, prefer a theme-preserving move swap on XATU (PSYCHIC → a weaker or non-Psychic move, e.g. NIGHT_SHADE) over another level change, measure once, then guard what wins and ACCEPT what loses. The thread closes in C389 either way; no C390 tuning (C390 is maintenance).

### Retrospective (C389): CLOSED
Dial taken: XATU PSYCHIC → **NIGHT_SHADE** (sParty_TateAndLiza1 only; level, item, iv, other mons, rematches, trainers.h untouched). Y7-ADAPT (switch-in) was NOT run: the Producer went straight to the move dial. Yardstick unchanged.
| | C388 (XATU PSYCHIC) | C389 (XATU NIGHT_SHADE) |
|---|---|---|
| GROUND | LOSS 7t 4/2 (CLAYDOL, LUNATONE down) | LOSS 7t 4/2 (**XATU**, CLAYDOL down) |
| FLOAT | LOSS 8t 4/3 | LOSS 6t 4/2 (CLAYDOL, LUNATONE) |
| LEVITATE | LOSS 8t 4/1 | LOSS 7t 4/2 (CLAYDOL, LUNATONE) |
- Turn-1 EQ + "doesn't affect Foe XATU": **3/3** (both runs). EQ turns C389: GROUND 1,2,4; FLOAT 1; LEVITATE 1,3. NIGHT_SHADE used: FLOAT t2, LEVITATE t3+t5.
- faintCauses (harness tally, last foe move before each faint; C388 hand count said XATU 5/12): C388 XATU 7/12 (PSYCHIC 6, SHADOW BALL 1), ESPEON 4, EQ 1. C389 XATU 4/12 (all SHADOW BALL), ESPEON 5, LUNATONE PSYCHIC 2, EQ 1.
- **Hypothesis "theme vs threat"**: half true. XATU's share fell 7→4 and its PSYCHIC is gone, but EQ's share did not rise (1/12 both times); the threat moved to ESPEON/LUNATONE Psychic + XATU SHADOW_BALL. EQ remains a tempo move (it chips the grounded side) rather than a killer.
- **Branch B** (GROUND loses, FLOAT loses): NIGHT_SHADE KEPT (XATU supports instead of sweeping). Guard: tate-liza-y7-ground `{"outcome": "loss"}`. FLOAT/LEVITATE report-only, ACCEPTED: Tate & Liza is Emerald's hardest gym by community consensus; the 4-mon no-bag slot-1 yardstick is weaker than a Badge-7 player. Dialogue unchanged.
- Harness: `faintCauses` in battleSummaries; battleTurns turn timeout is now 3600 frames without a new message (cap 14400 per turn), because the NIGHT_SHADE GROUND run's turn 4 (two foe faints, four EXP messages, two send-outs) outran the old 3600-per-turn budget.

## Index row
v3.9 Ground that doesn't touch them | 388 | trainer_parties.h sParty_TateAndLiza1 (LUNATONE 39 replaces ALAKAZAM, ESPEON 40), MossdeepCity_Gym/scripts.inc (TateAndLizaDefeat), src/emulator/playtest.ts + playtest.test.ts (doubles battleTurns, target, finishTurn, pickSendOutIndex/pickTargetBattler), playtests/README.md, playtests tate-liza-y7-ground / -float / -levitate (new); C389: sParty_TateAndLiza1 XATU NIGHT_SHADE, playtest.ts + playtest.test.ts (faintCauses, turn idle timeout), README, the three Y7 playtests (ground guarded loss)
