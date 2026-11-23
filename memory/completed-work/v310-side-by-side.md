# v3.10 "Side by side": Steven + player vs Maxie + Tabitha (Mossdeep Space Center 2F)
The first beat where the player IS the partnership (Hours 10-15, right after Badge 7).
C391 = spec + harness + report-only baselines (no ROM change). C392 = one pre-registered dial + Steven's line. C393 = measured retrospective.

## Spec (written C391 BEFORE any measurement)
### Source facts (verified C391)
- Battle setup: `src/battle_tower.c:2122-2129` SPECIAL_BATTLE_STEVEN sets BATTLE_TYPE_TRAINER | DOUBLE | TWO_OPPONENTS | MULTI | INGAME_PARTNER (bit 22, include/constants/battle.h:81), `FillPartnerParty(TRAINER_STEVEN_PARTNER)` (constants/trainers.h:17, 3075), Maxie = trainer A via MossdeepCity_SpaceCenter_2F_EventScript_MaxieTrainer, Tabitha = trainer B via ..._TabithaTrainer.
- Steven's team: `sStevenMons` (src/battle_tower.c:772-798), max IVs: METANG 42 Brave (LIGHT_SCREEN, PSYCHIC, REFLECT, METAL_CLAW), SKARMORY 43 Impish (TOXIC, AERIAL_ACE, PROTECT, STEEL_WING), AGGRON 44 Adamant (THUNDER, PROTECT, SOLAR_BEAM, DRAGON_CLAW). Partner mons live in gPlayerParty[3..5] (MULTI_PARTY_SIZE + i); the player's 3 chosen mons in [0..2].
- Partner AI: `src/battle_controller_player_partner.c:1513-1531` PlayerPartnerHandleChooseMove calls BattleAI_ChooseMoveOrAction. The AI flags are NOT Steven's own: `src/battle_ai_script_commands.c:373-374` gives every battler in a TWO_OPPONENTS battle `gTrainers[A].aiFlags | gTrainers[B].aiFlags` (Maxie CHECK_BAD_MOVE | TRY_TO_FAINT | CHECK_VIABILITY, Tabitha CHECK_BAD_MOVE) plus AI_SCRIPT_DOUBLE_BATTLE. So Steven thinks with Maxie's brain.
- Foes (3-mon cap, failure-patterns C316): Maxie WEEZING 44 / NIDOKING 45 / CAMERUPT 46 (iv 150/150/200, items); Tabitha MUK 38 / MAGMAR 39 / HOUNDOOM 40.
- Script: MossdeepCity_SpaceCenter_2F_EventScript_Steven (first talk: intro + Steven's lunge; FLAG_INTERACTED_WITH_STEVEN_SPACE_CENTER, which ON_TRANSITION MoveCivilians clears whenever VAR_MOSSDEEP_CITY_STATE is 2) → ReadyForBattlePrompt YES → special ChooseHalfPartyForBattle (VAR_FRONTIER_FACILITY = FACILITY_MULTI_OR_EREADER: 1-3 mons, HP > 0) → DoSpecialTrainerBattle → DefeatedMaxieTabitha → MossdeepCity_SpaceCenter_2F_Text_StevenThankYouComeSeeMeAtHome. Battle text: player-side battlers print with no prefix ("METANG used REFLECT!", "AERIAL ACE"); foes "Foe X". Steven's mons and the player's are told apart only by name.

### Hypothesis
"If Steven's first action visibly guards the player's side, the player feels trusted rather than outnumbered. If the player could win as easily without anything Steven did, the beat failed."

### Close criteria for C392 (each measured from the battleLog / battleSummaries, never by hand)
- **S1**: worn yardstick WIN.
- **S2**: full-HP yardstick WIN with ≤1 player faint. Steven's faints do NOT count.
- **S3**: a Steven METANG REFLECT or LIGHT SCREEN message appears in turn 1 or 2 of the worn AND full runs.
- **S4**: the player's own Pokémon land ≥1 foe KO in each winning run ("trusted, not escorted").
- **S5**: no Steven move targets a player-side Pokémon harmfully (e.g. SKARMORY TOXIC poisoning the player's Pokémon) in any run, including the Guts miss-path.
- **S6**: Tabitha's Mossdeep defeat text still displays after the win (C248 crack beat).
- **F1 (feel, pre-registered C392 before re-measuring)**: in each WINNING run, foeKOsBy.player ≥ foeKOsBy.partner (the player's own Pokémon land at least half the KOs). Trusted = the player finishes at least as many foes as Steven. A WIN where Steven lands more KOs than the player is an *escorted* win: S1/S2 may pass, but F1 fails, and C393 must say "Steven's line 'I didn't need to look back' is not yet true" rather than call v3.10 a success. F1 is judged in C393; it does not trigger a second dial in C392.

### Pre-registered C392 dial (ONE only, by priority)
- (a) S1 fails → lower the faintCauses decider on Maxie/Tabitha by 2 levels.
- (b) else S5 fails → sStevenMons SKARMORY MOVE_TOXIC → MOVE_SPIKES (matches Champion Skarmory, sParty_Steven).
- (c) else S3 fails → swap METANG's MOVE_PSYCHIC → MOVE_CONFUSION so the screens outscore it. Note: verify the scoring claim in C392 before using it. (d) else no stat dial.
- Research note (C392): vanilla Maxie (Mossdeep) is MIGHTYENA 42 / CROBAT 43 / CAMERUPT 44. WEEZING is an LoH addition. Steven's team is all Steel and immune to Poison, so every SLUDGE BOMB can only land on the player's side (type-forced targeting). If worn still loses after dial (a), record that cause. WEEZING → CROBAT is a candidate C393+ spec question, not a C392 change.
- Every branch: C392 adds Steven's post-battle line as a new msgbox before MossdeepCity_SpaceCenter_2F_Text_StevenThankYouComeSeeMeAtHome: "STEVEN: I didn't need\nto look back.$". Steven's Champion team (SKARMORY, METAGROSS) is the Ever Grande callback, and the Changed Three stay off his Space Center team.

### Yardstick
Tate & Liza Y7 GROUND party, first three: SHELGON 41 (BITE, DRAGON_BREATH, HEADBUTT, PROTECT), LINOONE 40 (FACADE, SHADOW_BALL, HEADBUTT, FURY_SWIPES), WHISCASH 40 (SURF, ROCK_TOMB, AMNESIA, REST). Worn = hpPercent 50 (route119/wi-shelly/winona worn convention). Guts miss-path: slot 3 HARIYAMA 40 ability 2 (Guts), BRICK_BREAK / KNOCK_OFF / ARM_THRUST / ROCK_TOMB (a Guts mon is the one a Toxic would "help", the case S5 exists for). Policy: slot 1 every turn, target opponent-left, replace.

## Baseline (C391, unedited vanilla fight, report-only)
Playtests space-center-steven-worn / -full / -guts (chooseHalfParty 1,2,3; slot 1, opponent-left, replace; guard only `expectBattleSummary {"partner": true}`). Numbers from report.json battleSummaries; the harness is deterministic, two runs gave identical summaries.

| run | result | turns | playerFaints | partnerFaints | foeKOsBy (player/partner) | partnerGuards (turn) | partnerHitsAlly | faintCauses |
|---|---|---|---|---|---|---|---|---|
| worn (50% HP) | LOSS | 7 | 3 | 0 | 1 / 3 (4 foes down) | METANG REFLECT (t1) | 0 | WEEZING/SLUDGE BOMB 2, MAGMAR/PSYCHIC 1 |
| full | **WIN** | 12 | 2 | 3 | 4 / 2 | SKARMORY PROTECT (t5, t6, t7) | 0 | WEEZING/SLUDGE BOMB 1, MAGMAR/BRICK BREAK 1 |
| guts (HARIYAMA slot 3) | LOSS | 10 | 3 | 2 | 1 / 2 | SKARMORY PROTECT (t5, t6, t7) | 0 | WEEZING/SLUDGE BOMB 1, MAGMAR/BRICK BREAK 1, HOUNDOOM/SHADOW BALL 1 |

- Baseline notes (C391): a LOSS ends when the player's three are down even with Steven untouched (worn hp% 0,0,0,3,100,100), so Steven can protect, never carry; full METANG PSYCHIC t1+t2; SKARMORY TOXIC hit Foe MAGMAR t4; WHISCASH SURF made 4 KOs; replacement path proven (`[sent out party menu slot 3]` → "Go! LINOONE!"); older 129 playtests identical under the C391 harness.

Baseline criteria: S1 FAIL (worn LOSS 7t), S2 FAIL (2 faints), S3 FAIL (full PSYCHIC t1+t2), S4 PASS (player 4 KOs), S5 PASS (TOXIC hit Foe MAGMAR), S6 PASS.

**C392 dial = (a)**: S1 fails, so the decider takes 2 levels. Decider by faintCauses = Maxie's **WEEZING / SLUDGE BOMB** (2 of 3 worn faints, 4 of 8 across the runs, always the first faint). C392: `scripts/trainer_configs/villain_maxie_mossdeep.json` WEEZING lvl 44 → 42 (regenerate sParty_MaxieMossdeep, don't hand-edit trainer_parties.h), plus Steven's "I didn't need\nto look back.$" msgbox. S2/S3 stay open data for the C393 retrospective (no second dial: C389 rule). The S3 METANG PSYCHIC → CONFUSION branch is NOT taken.

## C392 (dial (a): WEEZING 42)
Changes: `scripts/trainer_configs/villain_maxie_mossdeep.json` WEEZING lvl 44 → 42, regenerated into sParty_MaxieMossdeep (NIDOKING 45 / CAMERUPT 46 unchanged; audit_boss_species 0 collisions). DefeatedMaxieTabitha: after the fade Steven is turned DIR_SOUTH (toward Maxie's empty tile 1,9) and says "STEVEN: I didn't need\nto look back." (new MossdeepCity_SpaceCenter_2F_Text_StevenDidntNeedToLookBack), then StevenFacePlayer and the unchanged thank-you box. F1 was pre-registered above before this measurement. Same yardstick/policy as the baseline; numbers from report.json battleSummaries; suite 132/132.

| run | result | turns | playerFaints | partnerFaints | foeKOsBy (player/partner) | partnerGuards (turn) | partnerHitsAlly | faintCauses |
|---|---|---|---|---|---|---|---|---|
| worn (50% HP) | LOSS | 3 | 3 | 0 | 0 / 1 (1 foe down) | METANG REFLECT (t1) | 0 | WEEZING/SLUDGE BOMB 2, WEEZING/FIRE BLAST 1 |
| full | **WIN** | 13 | 2 | 2 | 3 / 3 | SKARMORY PROTECT (t4, t6, t7), AGGRON PROTECT (t9) | 0 | WEEZING/SLUDGE BOMB 1, MAGMAR/FLAMETHROWER 1 |
| guts (HARIYAMA slot 3) | LOSS | 12 | 3 | 2 | 1 / 2 | SKARMORY PROTECT (t4, t6, t7), AGGRON PROTECT (t9) | 0 | WEEZING/SLUDGE BOMB 1, MAGMAR/FLAMETHROWER 1, MAGMAR/PSYCHIC 1 |

- **Worn got worse, not better** (7 → 3 turns, 1 → 0 player KOs). WEEZING 42 still moves before SHELGON and LINOONE: t1 SLUDGE BOMB KOs SHELGON (through METANG's REFLECT, which is physical-only and does nothing against SLUDGE BOMB / FIRE BLAST), t2 SLUDGE BOMB KOs LINOONE, Foe MUK's ICE PUNCH crit freezes WHISCASH, t3 FIRE BLAST finishes it. All three player faints are WEEZING's: the level dial changed the RNG/turn order but not the cause. Every SLUDGE BOMB lands on the player's side because Steven's team is all Steel (immune). The worn loss is WEEZING's special Poison/Fire coverage vs a 50% HP party, which 2 levels cannot fix.
- Full: METANG used PSYCHIC on t1 and t2 again (no screen); METANG fainted t3 to MAGMAR FLAMETHROWER. SKARMORY's one TOXIC (t5, full and guts) missed, so the log doesn't say whom it targeted; partnerHitsAlly 0 everywhere. LINOONE's t9 poison is Foe NIDOKING's POISON POINT, not Steven.
- Steven's line (full only, `talk` `until`): box order Maxie "We will give up" → "STEVEN: I didn't need / to look back." → "Whew, that was too tense." Steven reads 1,8 facing down at the line (screenshot `space-center-steven-look-back`: he faces the empty tile, player beside him).

| criterion | result | evidence |
|---|---|---|
| S1 worn WIN | **FAIL** | worn LOSS 3t, 3/0, all faints WEEZING |
| S2 full WIN ≤1 player faint | **FAIL** | WIN with 2 player faints |
| S3 METANG screen in t1-2, worn AND full | **FAIL** | worn REFLECT t1; full PSYCHIC t1 + t2 |
| S4 player ≥1 foe KO per win | PASS | full: player 3, partner 3 |
| S5 no Steven move harms yours | PASS (weak) | partnerHitsAlly 0 in all 3; the only TOXIC (t5) missed, target unknown |
| S6 Tabitha defeat text | PASS | full: "I'm with our leader... Always have been. ...Right?" right after "were defeated!" |
| F1 player KOs ≥ partner KOs per WIN | PASS (barely) | full (the only win): 3 / 3, a tie. Not an escorted win, but the worn and guts runs lose, so "trusted" holds only for a full-HP party |


## Index row
v3.10 Side by side | 391, 392 | C391 (no ROM change): this spec; src/emulator/playtest.ts + playtest.test.ts (chooseHalfParty, isPartnerBattle / openFightMenu / readPartnerSides / PARTNER_PARTY_MARK, pickSendOutIndex `end`, summarizePartner, expectBattleSummary `partner`), src/emulator/session.ts (getLayout public), playtests/README.md, playtests space-center-steven-worn / -full / -guts (new); memory claims steven-skarmory-toxic, partner-battle-harness, space-center-guts-playtest; C392: villain_maxie_mossdeep.json + trainer_parties.h (WEEZING 42), MossdeepCity_SpaceCenter_2F/scripts.inc (Steven's line), src/emulator/playtest.ts + playtest.test.ts (talk until, partner summary bounds), playtests/README.md, space-center-steven-worn / -full / -guts

## Reflection C392 (for the C393 retrospective)
- **S3 was mis-specified**: the decider is special (SLUDGE BOMB / FIRE BLAST), and REFLECT is physical-only, so even a "passed" S3 would not have guarded the player. The guard that matters vs WEEZING is LIGHT SCREEN (METANG has it) or Steven KOing WEEZING first.
- **Worn yardstick realism**: Steven's ReadyForBattlePrompt is a YES/NO before the fight, with Mossdeep's Pokémon Center nearby; a 50% HP party here is a choice the game warns against. C389 rule → ACCEPT the worn loss, guard the full WIN (outcome win + maxPlayerFaints 2).
- **WEEZING → CROBAT** (creative 392) is a new spec step for a later arc, not a second dial.
