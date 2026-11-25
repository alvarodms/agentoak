# v3.12 "The one who helps": Route 110 Pokéfan ISABEL, PLUSLE + MINUN double (C397)

## Premise
Route 110 Pokéfan ISABEL's PLUSLE and MINUN fight together. MINUN's HELPING_HAND is the visible tell; KO the helper and the pair falls apart. Hour 4-5, first of three partnership lessons (break a pair → read a partnership at Mossdeep → be a partner at the Space Center).

## Hypothesis (written C397 before any measurement)
"If the player sees that the two foes are stronger together, they KO the supporter first and the second foe collapses. If they win by brute force without noticing the pair, the beat failed."

## Close criteria (pre-registered C397, before measuring)
- **P1**: "is ready to help" shows by turn 2 in S and A.
- **P2**: S is a WIN with ≤1 player faint.
- **P3**: A has ≥2 more turns OR ≥1 more player faint than S.
- **P4**: in S, the battle ends ≤3 turns after MINUN faints.
- **P5**: G (Marshtomp) and M (own Minun/Plusle) are report-only.
- **P6**: no new or changed dialogue names Plus, Minus, helping or boosting.
- **P7**: a 1-mon player gets the not-enough-mons text, and no battle starts.

Runs: S = supporter-first (target opponentRight = MINUN), A = ace-first (target opponentLeft = PLUSLE), G = MARSHTOMP lead, M = own MINUN lead, single = COMBUSKEN alone.

## Pre-registered C398 dial priority (Gameplay Designer, C397) — use the first failing criterion
- (a) P2 fails (S loses or ≥2 faints): PLUSLE SHOCK_WAVE → SPARK (SPARK is PHYSICAL here, so Plus can't boost it; SWIFT stays the special Plus carrier).
- (b) P3 fails, P2 holds: MINUN QUICK_ATTACK → SHOCK_WAVE (Minus-boosted; MINUN's harm scales with how long it lives, longer in A). Expected effect small (~15 HP in A). If P3 still fails, close as data (structural, below).
- (c) P1 fails only: no dial, record. No single swap moves P(HH) more than ~2 points (see AI fact).
- (d) all pass: no dial; C398 adds guards only.

## Source facts (cited C397)
- Vanilla: `src/data/trainer_parties.h:4696` sParty_Isabel1 = PLUSLE 19 alone (ORAN); KALEB = MINUN 19 alone; ISABEL_2-5 = both (26/29/32/35). All were singles (trainers.h:3628-3690 `.doubleBattle = FALSE`). Memory's old "ISABEL_1 Plusle 19 + Minun 19" was false.
- AI: `battle_ai_script_commands.c:379` ORs AI_SCRIPT_DOUBLE_BATTLE into every double, so ISABEL's AI_SCRIPT_CHECK_BAD_MOVE is enough. `battle_ai_scripts.s:2917` AI_TryHelpingHandOnAlly: 75% +2 / 25% −1 on the ally target. `AI_CBM_HelpingHand` (:541) only penalises HH in singles. Designer estimate P(MINUN uses HH per turn) ≈ 81% with 4 moves.
- Plus/Minus: `src/pokemon.c:3356-3359` Sp. Atk ×1.5 when ABILITY_ON_FIELD2(partner ability). ABILITY_ON_FIELD2 → `battle_util.c:3217-3225` ABILITYEFFECT_FIELD_SPORT loops gBattleMons with **no HP check**: a fainted, unreplaced MINUN probably still turns PLUSLE's Plus on (designer hypothesis; S-run check below). It also counts the player's side (own Minun = M run).
- `src/data/battle_moves.h`: SPARK MOVE_CATEGORY_PHYSICAL (per-move split; no rematch PLUSLE has a special move). SHOCK_WAVE SPECIAL/SELECTED; SWIFT SPECIAL/MOVE_TARGET_BOTH (0.5x on two targets); HELPING_HAND priority 5, MOVE_TARGET_USER.
- Lone MINUN's HH prints "But it failed!" (trysethelpinghand needs a live partner). A failed HH still logs "used HELPING HAND" — P1 guards on the text "is ready to help".

## Party (scripts/trainer_configs/route110_isabel.json, mode modify)
PLUSLE 20 iv75 ORAN: SHOCK_WAVE, SWIFT, QUICK_ATTACK, GROWL · MINUN 18 iv75 no item: HELPING_HAND, THUNDER_WAVE, GROWL, QUICK_ATTACK. aiFlags unchanged (CHECK_BAD_MOVE). `.doubleBattle = TRUE` on ISABEL_1-5; rematch parties 2-5 vanilla.

## check_partner_typing (C397, as run)
`check_partner_typing: could not analyse (--party scripts/trainer_configs/route110_isabel.json: TRAINER_ISABEL_1 is not a foe in any partner battle); report-only, exit 0` (as the designer predicted: ISABEL has no in-game partner). Optional foe-side Plus/Minus ABILITY line skipped → tech-debt 397.

## Results (C397 baseline, suite seed; harness deterministic)
| run | outcome | turns | player faints | foeKOOrder (turn) | first working HH | notes |
|---|---|---|---|---|---|---|
| S (→MINUN) | WIN | 3 | 1 (MAKUHITA: PLUSLE crit SHOCK WAVE t1) | MINUN t1, PLUSLE t3 | never | MINUN rolled THUNDER WAVE t1 (the ~19% non-HH roll) and fell to DOUBLE KICK crit that turn |
| A (→PLUSLE) | WIN | 4 | 2 (MAKUHITA t1 crit SW; ZIGZAGOON t2 helped SW) | PLUSLE t2, MINUN t4 | t2 | lone MINUN HH "But it failed!" t3+t4 (free tell) |
| G (MARSHTOMP) | WIN | 3 | 0 | MINUN t2, PLUSLE t3 | t1 (+t2) | PLUSLE answered HH with GROWL, SWIFT; end HP 59/4/100/100 |
| M (own MINUN) | WIN | 5 | 1 (COMBUSKEN: helped crit QUICK ATTACK t2) | MINUN t2, PLUSLE t5 | t1 (+t2) | PLUSLE alive 3 turns after MINUN (S: 2) |
| single (COMBUSKEN) | no battle | — | — | — | — | "Just one POKéMON?" text, CB2_Overworld, player unmoved |

| criterion | verdict |
|---|---|
| P1 "is ready to help" by t2 in S and A | **FAIL** (A PASS t2; S never: MINUN chose THUNDER WAVE t1 and was KO'd t1) |
| P2 S WIN ≤1 faint | PASS (1) |
| P3 A ≥2 more turns OR ≥1 more faint | PASS (+1 turn, +1 faint: 4t/2 vs 3t/1). The designer predicted a structural fail; on this seed the A-side extra faint is the helped SHOCK WAVE t2 |
| P4 S ends ≤3 turns after MINUN | PASS (2: t1 → t3) |
| P5 G/M report-only | recorded (both WIN) |
| P6 no Plus/Minus/help/boost in new text | PASS (defeat "Oh, dear. Look at them, / still side by side."; not-enough "Oh, dear! Just one POKéMON? / Mine never go out alone. / Do come back with a friend!") |
| P7 1-mon: text, no battle | PASS |

- Plus-after-faint check (designer §6): **not measurable on this seed**. After MINUN fainted in S, PLUSLE used SWIFT (spread, ×0.5) and QUICK ATTACK (physical), never SHOCK WAVE, and non-partner battles log no [battlers] HP lines. Still open.
- Both S and A share turn 1 up to MINUN's choice: PLUSLE is faster than everyone and its first SHOCK WAVE crit-KOs MAKUHITA in both. The seed's crits drive the faint counts.
- **Dial decision (pre-registered list)**: (a) P2 holds, (b) P3 holds, so **(c) P1 fails only → no dial; record.** C398 adds guards only (the planned "one dial" does not fire). Read-through of the tell: in S on this seed the player never sees "is ready to help"; a real player picks a target on turn 1 before any tell can show, so S models "already knew"; A is the run where the tell teaches.

## Guards shipped (planted-failure proofs C397)
- route110-isabel-supporter-first: win, maxPlayerFaints 1, firstFoeKO MINUN. Planted firstFoeKO "PLUSLE" → `first foe KO MINUN, expected PLUSLE`.
- route110-isabel-ace-first: win, foeMoveByTurn {HELPING HAND, 2}. Planted byTurn 0 → `no foe HELPING HAND by turn 0 (first: turn 2)`; byTurn 1 → `... by turn 1 (first: turn 2)`.
- route110-isabel-marshtomp / -own-minun: outcome win. route110-isabel-one-mon: texts + CB2_Overworld + player tile.

Full suite C397: 147/147; `make -k check_all` green; `npx tsc --noEmit` + vitest green.

## Rematch notes (designer §8, not changed)
ISABEL_2/3 default sets give both mons HELPING_HAND (both pick it ~56% of turns, second fails); MINUN loses HH at ISABEL_4/5; no rematch PLUSLE has a special move (SPARK physical, THUNDER at 37) so Plus does nothing → creative-backlog 397.
Other untested trivializer: a LIGHTNING_ROD Lotad_H pulls every Electric move (AI_DoubleBattleElectricMove only checks the AI's own partner).

## Files (C397)
pokeemerald: scripts/trainer_configs/route110_isabel.json (new), src/data/trainer_parties.h (sParty_Isabel1 custom moves, + MINUN), src/data/trainers.h (ISABEL_1 ITEM_CUSTOM_MOVES; ISABEL_1-5 doubleBattle TRUE), data/maps/Route110/scripts.inc (trainerbattle_double / _rematch_double), data/text/trainers.inc (IsabelDefeated, new IsabelNotEnoughMons), playtests/route110-isabel-{supporter-first,ace-first,marshtomp,own-minun,one-mon}.json, playtests/README.md. Harness: src/emulator/playtest.ts (summarizeFoeTurns: foeKOOrder / foeKOTurns / foeMoveFirstTurn; bounds firstFoeKO, foeMoveByTurn), playtest.test.ts (+2 cases, C390 byte-identity test re-pinned to the C397 shape).
