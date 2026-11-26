# v3.12 "The one who helps": Route 110 Pokéfan ISABEL, PLUSLE + MINUN double (C397-C398)

## Premise + hypothesis (C397, before measuring)
ISABEL's PLUSLE and MINUN fight together; MINUN's HELPING_HAND ("is ready to help") is the tell; KO the helper and the pair falls apart. Hour 4-5, first of three partnership lessons (break a pair → read one at Mossdeep → be one at the Space Center). "If the player sees the two foes are stronger together, they KO the supporter first and the second collapses. If they win by brute force without noticing the pair, the beat failed."

## As built (C397)
- Party (scripts/trainer_configs/route110_isabel.json, mode modify): PLUSLE 20 iv75 ORAN SHOCK_WAVE/SWIFT/QUICK_ATTACK/GROWL · MINUN 18 iv75 HELPING_HAND/THUNDER_WAVE/GROWL/QUICK_ATTACK. aiFlags CHECK_BAD_MOVE (AI_SCRIPT_DOUBLE_BATTLE is ORed in, battle_ai_script_commands.c:379; AI_TryHelpingHandOnAlly battle_ai_scripts.s:2917, P(HH/turn) ≈ 81%). `.doubleBattle = TRUE` on ISABEL_1-5; rematch parties 2-5 vanilla.
- Vanilla was ISABEL_1 = PLUSLE 19 alone (trainer_parties.h:4696), KALEB = MINUN 19 alone; only ISABEL_2-5 carried both.
- Text: defeat "Oh, dear. Look at them, / still side by side."; new IsabelNotEnoughMons "Oh, dear! Just one POKéMON? / Mine never go out alone. / Do come back with a friend!" (no line names Plus/Minus/help, P6).
- Engine notes: SPARK is PHYSICAL here (Plus never boosts it); SWIFT is spread ×0.5; HH priority 5; a lone MINUN's HH prints "But it failed!" but still logs "used HELPING HAND" (guard on "is ready to help"). Plus-after-MINUN-faints (ABILITY_ON_FIELD2 has no HP check) is still unmeasured (tech-debt 397b).

## C397 baseline (suite seed) and verdict
S (→MINUN) WIN 3t/1 faint (MINUN t1, PLUSLE t3, HH never: MINUN rolled THUNDER WAVE t1); A (→PLUSLE) WIN 4t/2 (PLUSLE t2, MINUN t4, HH t2, lone HH fails t3-t4); G MARSHTOMP WIN 3t/0; M own MINUN WIN 5t/1; 1-mon: text, no battle. P1 (tell by t2 in S and A) FAIL; P2 S ≤1 faint, P3 A worse than S, P4, P6, P7 PASS. Dial list (c) P1-only → no dial.
Guards: supporter-first (win, maxPlayerFaints 1, firstFoeKO MINUN), ace-first (win, foeMoveByTurn HELPING HAND by 2), marshtomp/own-minun (win), one-mon (texts + overworld); each planted-fail proven.
Rematches (not changed): ISABEL_2/3 both hold HH, MINUN loses HH at 4/5, no rematch PLUSLE has a special move → creative-backlog 397. Untested trivializer: a LIGHTNING_ROD Lotad_H pulls every Electric move.

## Files
C397: scripts/trainer_configs/route110_isabel.json (new), src/data/trainer_parties.h, src/data/trainers.h, data/maps/Route110/scripts.inc, data/text/trainers.inc, playtests/route110-isabel-{supporter-first,ace-first,marshtomp,own-minun,one-mon}.json, playtests/README.md; harness playtest.ts/.test.ts (foeKOOrder / foeKOTurns / foeMoveFirstTurn, bounds firstFoeKO / foeMoveByTurn). C398 (no ROM change): harness retargetAfter + retargetFor, playtests route110-isabel-retarget{,-w7,-w23}, -ace-first-{w7,w23}, -supporter-first-{w7,w23}, playtests/README.md.

## C398 seed sweep (criteria written before measuring)
- Seeds: s0 = no wait (the suite seed), s7 = `{"wait": 7}` before `talk`, s23 = `{"wait": 23}` before `talk`. Emerald advances the RNG every VBlank (src/main.c:365-366), so a frame wait before talking shifts the battle seed.
- Runs per seed: S (target opponentRight throughout), A (target opponentLeft throughout), R (target opponentLeft, then retargetAfter "ready to help" → opponentRight from the next turn's prompt).
- R1 (the hypothesis): on every seed, R's player faints ≤ A's. On at least 2 of 3 seeds, R beats A strictly: fewer faints, or the same faints in fewer turns. If R equals A on 2+ seeds, the tell is decoration on these seeds.
- R2 (tell reliability): "ready to help" appears by turn 2 in at least 2 of 3 A runs.
- R3 (tell in time): in at least 2 of 3 R runs, the turn HELPING HAND first shows is strictly earlier than the turn PLUSLE faints. Only then can a player act on it.
- R4 (readability, s0 only): the screenshot taken while "ready to help" is on screen shows the whole line legibly. You view the PNG and describe it in the notes.
- Prediction (written before measuring): on s0, R equals A (4 turns, 2 faints). HELPING HAND first shows on turn 2, the same turn PLUSLE falls, so the retarget only takes effect on turn 3, when the default fallback already targets MINUN.
- Same-turn redirect rule: a MINUN KO on a turn where the player's chosen target was still PLUSLE is an engine redirect (battle_util.c:247-262), not a retarget. Note it in the table.
- Verdict: no dial this cycle (rule C389). C399 rules on R1-R3.

### C398 results (measured after the criteria above)
Harness: battleTurns `retargetAfter` (src/emulator/playtest.ts `retargetFor`). Both waits moved the seed (every s7/s23 log differs from s0 from turn 1), so no fallback waits (13/41) were needed. "Redirect" = the engine retargeting a move whose chosen foe fainted earlier that turn (battle_util.c:247-262); "fallback" = the harness picking the other foe at the prompt because its target was already gone.

| seed | run | outcome | turns | player faints | foeKOOrder (turn) | HH first | retarget | notes |
|---|---|---|---|---|---|---|---|---|
| s0 | S | WIN | 3 | 1 (MAKUHITA, crit SW t1) | MINUN t1, PLUSLE t3 | never | — | MINUN THUNDER WAVE t1, KO'd by its chosen DOUBLE KICK crit (C397 baseline, unchanged) |
| s0 | A | WIN | 4 | 2 (MAKUHITA crit SW t1, ZIGZAGOON helped SW t2) | PLUSLE t2, MINUN t4 | t2 | — | MINUN KO t4 via fallback; lone HH "But it failed!" t3+t4 |
| s0 | R | WIN | 4 | 2 (same) | PLUSLE t2, MINUN t4 | t2 | from t3 (split step) | with no wait the log is byte-for-byte A's. The shipped file waits 120 frames for the screenshot: same headline, but MINUN GROWL t3 / QUICK ATTACK t4 (no "But it failed!"), TAILLOW 77% |
| s7 | S | WIN | 4 | 0 (party 100%) | MINUN t2, PLUSLE t4 | t1 (+t2) | — | t2 MAKUHITA redirected onto PLUSLE (no KO) |
| s7 | A | WIN | 6 | 0 | PLUSLE t3, MINUN t6 | t1 (+t3) | — | t3 MAKUHITA redirected onto MINUN (no KO); lone MINUN GROWL t4-5, HH "But it failed!" t6 |
| s7 | R | WIN | 3 | 0 | MINUN t3, PLUSLE t3 | t1 | after t1 (from t2) | t3: COMBUSKEN crit KOs MINUN, then MAKUHITA's VITAL THROW **redirects** onto PLUSLE and crit-KOs it (a MINUN→PLUSLE redirect, not a retarget) |
| s23 | S | WIN | 3 | 0 | MINUN t2, PLUSLE t3 | t1 (+t2) | — | t2 MAKUHITA redirected onto PLUSLE (no KO) |
| s23 | A | WIN | 3 | 0 | PLUSLE t2 (DOUBLE KICK crit), MINUN t3 | t1 (+t2) | — | t2 MAKUHITA crit redirected onto MINUN (no KO); lone MINUN QUICK ATTACK, no "But it failed!" |
| s23 | R | WIN | 4 | 1 (MAKUHITA, helped SW t3) | MINUN t3, PLUSLE t4 | t1 (+t2, t3) | after t1 (from t2) | the t1 damage on PLUSLE is abandoned; PLUSLE lives to t4 and lands a helped SHOCK WAVE |

No MINUN KO on any run came from a same-turn redirect (the rule above). The one redirect KO is the reverse: s7 R's PLUSLE.

| criterion | verdict |
|---|---|
| R1: R faints ≤ A on every seed; R strictly beats A on ≥2/3 | **FAIL**. s0 R = A (4t/2); s7 R beats A (3t/0 vs 6t/0); s23 R loses to A (4t/1 vs 3t/0). ≤ holds on 2/3 seeds, strict beat on 1/3 |
| R2: "ready to help" by t2 in ≥2/3 A runs | **PASS** 3/3 (t2, t1, t1) |
| R3: HH first strictly before PLUSLE faints in ≥2/3 R runs | **PASS** 2/3 (s7 t1 < t3, s23 t1 < t4; s0 t2 = t2) |
| R4: s0 tell screenshot legible | **PASS** (after a 120-frame wait; at 0 frames the harness had caught "Foe MINUN is" mid-print). route110-isabel-tell.png: the box reads "Foe MINUN is ready to / help Foe PLUSLE!" on two lines in full, white on the dark-red box. PLUSLE Lv20 and MINUN Lv18 HP bars top left, the two foe sprites side by side top right, COMBUSKEN (PAR from MINUN's t1 THUNDER WAVE) and ZIGZAGOON bottom right. Nothing is cut off and the names match the HP boxes |
| s0 prediction "R = A, 4t/2, HH t2 = PLUSLE's KO turn, retarget only from t3 under the fallback" | **held exactly** |

Report-only reads (not criteria): S ≥ A on all three seeds (s0 3t/1 vs 4t/2, s7 4t/0 vs 6t/0, s23 tie 3t/0). C397's P1 (HH by t2 in S) holds on s7 and s23 (t1); s0 was the ~19% THUNDER WAVE roll. The s23 R loss is structural, not luck: retargeting after turn 1 abandons the damage already on PLUSLE, so the attacker lives longer and its helped SHOCK WAVE lands. A mid-fight switch is the worst of both unless the redirect or a crit rescues it (s7). The tell pays off when it shapes the turn-1 choice (S), which a first-time player can't make, so it teaches for the rematch or the next pair.

Guards shipped C398: route110-isabel-retarget (s0) win + maxPlayerFaints 2 (= A's s0 count, Game Designer's relative guard; planted 0 → `2 player faints > max 0`). The six -w7/-w23 files guard `outcome: win` only; every other number is report-only in "checks". The C397 ace-first / supporter-first guards are untouched. Suite 154/154.

**For C399** (verdict on R1-R3; no dial this cycle, rule C389):
- (i) The Creative Visionary's asymmetry: the correct play (supporter first) leaves nothing on screen to mark the loss, while the wrong play (ace first) produces the poignant lone "But it failed!". This is intended Red Ink register; do not tune it out. (Note: "But it failed!" showed on s0 and s7 A but not s23 A, where the lone MINUN attacked instead.)
- (ii) The accidental rhyme: Route 109 TOBY's lone PLUSLE comes one route before ISABEL's pair.
- (iii) Reflection C398: R1 partly tests the yardstick, not the player. R switches blindly after the tell even with PLUSLE already hurt; a real player who sees "ready to help" with PLUSLE half-dead finishes PLUSLE. So "R1 FAIL" means "a mid-fight switch is not the lesson", not "the tell is useless". Recommended C399 verdict: CLOSED as shipped (S ≥ A on 3/3 seeds = the pair is real; tell shows by t2 on 3/3 A seeds = it is seen). Do NOT add a pre-battle hint line (P6 / show-before-tell). No more ISABEL measuring.
