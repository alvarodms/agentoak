# v3.10 "Side by side": Steven + player vs Maxie + Tabitha (Mossdeep Space Center 2F)
The first beat where the player IS the partnership (Hours 10-15, right after Badge 7). C391 spec + harness + baselines; C392 one dial + Steven's line; C393 verdict CLOSED; C395 v3.10b RHYDON tried and REVERTED. Compacted C395 (full tables, CROBAT/RHYDON analyzer output: git history at e537987 and the C395 commit).

## Source facts (verified C391)
- Battle setup: `src/battle_tower.c:2122-2129` SPECIAL_BATTLE_STEVEN = TRAINER | DOUBLE | TWO_OPPONENTS | MULTI | INGAME_PARTNER; `FillPartnerParty(TRAINER_STEVEN_PARTNER)`; Maxie = trainer A, Tabitha = trainer B.
- Steven: `sStevenMons` (src/battle_tower.c:772-798), max IVs: METANG 42 (LIGHT_SCREEN, PSYCHIC, REFLECT, METAL_CLAW), SKARMORY 43 (TOXIC, AERIAL_ACE, PROTECT, STEEL_WING), AGGRON 44 (THUNDER, PROTECT, SOLAR_BEAM, DRAGON_CLAW). Partner mons in gPlayerParty[3..5]; the player's 3 in [0..2]. All Steel: immune to Poison.
- Partner AI: battle_controller_player_partner.c:1513-1531 → BattleAI_ChooseMoveOrAction with `gTrainers[A].aiFlags | gTrainers[B].aiFlags` (battle_ai_script_commands.c:373-374): Steven thinks with Maxie's brain.
- Foes (3-mon cap, failure-patterns C316): Maxie WEEZING 42 / NIDOKING 45 / CAMERUPT 46 (villain_maxie_mossdeep.json); Tabitha MUK 38 / MAGMAR 39 / HOUNDOOM 40. Vanilla Maxie was MIGHTYENA 42 / CROBAT 43 / CAMERUPT 44; WEEZING is an LoH addition.
- Script: MossdeepCity_SpaceCenter_2F_EventScript_Steven → ReadyForBattlePrompt YES → ChooseHalfPartyForBattle → DoSpecialTrainerBattle → DefeatedMaxieTabitha (Steven faces DIR_SOUTH, Maxie's empty tile 1,9: "STEVEN: I didn't need\nto look back." then turns to the player).
- A LOSS ends when the player's three are down, whatever Steven has left: Steven can protect, never carry.

## Hypothesis + criteria (C391, written before measuring)
"If Steven's first action visibly guards the player's side, the player feels trusted rather than outnumbered. If the player could win as easily without anything Steven did, the beat failed."
S1 worn WIN · S2 full WIN ≤1 player faint · S3 METANG screen t1-2 (mis-specified, see C393) · S4 player ≥1 KO per win · S5 no Steven move harms the player's side · S6 Tabitha's defeat text · F1 player KOs ≥ Steven's per win.
Yardstick: Tate & Liza Y7 GROUND party, first three (SHELGON 41, LINOONE 40, WHISCASH 40); worn = hpPercent 50; guts = HARIYAMA 40 (Guts) in slot 3. chooseHalfParty 1,2,3.

## Measurements (report.json battleSummaries; harness deterministic)
| config | worn | full | guts | notes |
|---|---|---|---|---|
| C391 WEEZING 44 | LOSS 7t, 3 faints, KOs 1/3 | WIN 12t, 2 faints, KOs 4/2 | LOSS 10t | worn REFLECT t1; full METANG PSYCHIC t1-2; decider WEEZING SLUDGE BOMB (4 of 8 faints) |
| C392 WEEZING 42 (dial a) | LOSS 3t, all 3 faints WEEZING SLUDGE BOMB/FIRE BLAST | WIN 13t, 2 faints, KOs 3/3 | LOSS 12t | S1/S2/S3 FAIL, S4-S6 + F1 (tie) PASS. **Shipped** |
| C395 RHYDON 42 | LOSS 7t, RHYDON hits 1 player / 0 Steven | **LOSS 8t, 3 faints** (C4 FAIL) | LOSS 11t | REVERTED |
foeHitsBySide on the shipped WEEZING config (C395): worn WEEZING 3/0 (MUK 2/0); full WEEZING 1/2, MUK 1/0, MAGMAR 3/4; guts WEEZING 1/2, MAGMAR 3/4, CAMERUPT 1/0. In a full run WEEZING already splits its pressure (FIRE BLAST / THUNDERBOLT reach Steven); the worn loss is 3 turns of the player's side only.

## Verdict C393 (CLOSED)
- Worn/guts LOSS ACCEPTED FOR NOW, NOT INTENDED (Poison-immune partner: every SLUDGE BOMB lands on the player). Mitigation: Steven's YES/NO prompt, Mossdeep PC nearby.
- S3 mis-specified: REFLECT is physical-only, the decider is special. Rule: a guard criterion must match the foe's physical/special split (`make report_partner_typing`).
- Full WIN guarded: space-center-steven-full `{partner, outcome win, maxPlayerFaints 2, minPlayerKOs 2}` (2, not 3: the 3-3 tie is RNG-fragile).
- "I didn't need to look back" is true for a full-HP player only (creative 395 proposes an honest worn-win variant).

## v3.10b "Covered" (C395, REVERTED)
- Dial: Maxie slot 1 WEEZING 42 → RHYDON 42 (HARD_STONE; ROCK_SLIDE / DIG / FIRE_PUNCH / THUNDER_PUNCH; Maxie's own since Magma Hideout, villain_maxie_magma_hideout.json RHYDON 39). Hypothesis: a decider that must split pressure between the player and Steven makes a worn player feel covered.
- Criteria (pre-registered): C1 worn RHYDON hits on Steven ≥1/3 · C2 worn WIN · C3 a RHYDON physical hit absorbed under REFLECT · C4 full guard unchanged · C5 S4-S6 · C6 no PRESSURE line for RHYDON. Rule: C4 fail → revert, keep tooling, no second dial.
- Result: C1, C2, C3, C4 FAIL; C5, C6 PASS. METANG PSYCHIC (special, into RHYDON's low Sp. Def) + one player hit KO RHYDON by t3 every run; it used DIG t1-t2 and never chose ROCK SLIDE. NIDOKING ICE BEAM/SLUDGE BOMB and MUK SLUDGE BOMB/ICE PUNCH (special, REFLECT-proof) then carry the loss.
- Revert check: the three runs reproduce C392/C393 exactly, so the new BATTLER_HP_MARK reads are RNG-neutral.
- Static candidates (`check_partner_typing.cjs --party <scratch>`): shipped WEEZING 5 findings (SLUDGE_BOMB ×3 + MAGMAR PSYCHIC + SCREEN); RHYDON 3 (NIDOKING + MUK SLUDGE_BOMB, MAGMAR PSYCHIC; ROCK_SLIDE is ×0.5/×1/×0.5 on Steven, INFO as a spread move); CROBAT 6 (WING_ATTACK + AERIAL_ACE PRESSURE: all three Steels resist Flying; also Archie's at Seafloor, sParty_Archie). CROBAT rejected on paper.
- **Lesson**: swapping one foe slot is the wrong lever. The partner's own AI removes a "hits both sides" mon before its spread move scores, and NIDOKING + MUK keep two Poison-only-the-player SLUDGE BOMBs whatever slot 1 is. A future retry must read the whole foe side's PRESSURE list first, and probably needs a change to more than one foe (= a new spec, not a dial).
- Story-order neighbours: before = Tate & Liza sParty_TateAndLiza1 (38-40) and Magma Hideout Maxie (39-41); after = Seafloor Archie sParty_Archie WAILORD 42 / CROBAT 43 / GLISCOR_HOENN 44 / SHARPEDO 46.

## Files
C391-C393: playtest.ts/.test.ts (chooseHalfParty, partner battleTurns, partnerFaints / foeKOsBy / partnerGuards / partnerHitsAlly, expectBattleSummary partner + bounds), session.ts (getLayout public), villain_maxie_mossdeep.json + sParty_MaxieMossdeep (WEEZING 42), SpaceCenter_2F scripts.inc (StevenDidntNeedToLookBack), playtests space-center-steven-worn/-full/-guts, check_partner_typing.cjs + Makefile report_partner_typing. C395: playtest.ts/.test.ts (BATTLER_HP_MARK, logBattleMessage, foeHitsBySide), check_partner_typing.cjs (`--party`, MOVE_TARGET_BOTH / FOES_AND_ALLY INFO, selftest 4/4), playtests/README.md.
