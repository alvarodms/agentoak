# Route 119 rival tuning, C385-C389 (CLOSED)

Moved verbatim from strategy-notes.md (v3.8 section) in C390. Rival parties: trainer_parties.h sParty_May/BrendanRoute119*; playtests route119-rival-rain-*. Winona's own verdict stays in [v38-above-the-storm.md](v38-above-the-storm.md).

## v3.8 retrospective (C386; closed; full table in git history at 08078eb)
Winona PASS, KEPT (full HP WIN 5t / 0 faints, PUPITAR 2%; guard winona-sun-full-party maxPlayerFaints 1). Route 119 rival FAIL at full HP in all three variants on the slot-1 yardstick: Torchic LOSS 12t/3 after F1+F2 (MANECTRIC ORAN_BERRY + SHOCK_WAVE, kept in both _TORCHIC parties), Treecko LOSS 13t/3/0 foe faints (DRAGONAIR THUNDER WAVE, BRELOOM SPORE), Mudkip LOSS 10t/3 (HARIYAMA ROCK SLIDE). Yardstick caveat: PELIPPER 4x weak to Electric, slot-1 SHELGON HEADBUTT can't touch a Ghost, so C387 changed the yardstick too.

## v3.8 retrospective addendum (C387): Route 119 rival, coverage yardstick
Yardstick changed, not just levels: MIGHTYENA 28 BITE/STRENGTH/FACADE/SWAGGER, PELIPPER 28 SURF/WING_ATTACK/WATER_GUN/PROTECT, SHELGON 30 BITE/STRENGTH/HEADBUTT/PROTECT (slots aligned by role: 1 = hits Ghosts, 2 = anti-Grass/Fighting, 3 = anti-Fire), full HP, no bag, storm-tail rain, `battleTurns moveFor` picks the slot per foe (playtests route119-rival-rain-coverage-torchic/-treecko/-mudkip).
| Variant | Lv28 (coverage) | Level action | Lv26 (coverage) | Final guard |
|---|---|---|---|---|
| Torchic (SWAMPERT 31) | LOSS 13t / 3 faints / 2 foe faints (3 "is paralyzed") | 28→26 (May+Brendan) | LOSS 15t / 3 / 2 (5 "fast asleep", 2 seeded): STANTLER_HOENN sweeps PELIPPER + SHELGON with HYPNOSIS/LEECH_SEED/SHADOW_BALL | **none: open FAIL**, report-only |
| Treecko (BLAZIKEN 31) | LOSS 11t / 3 / 1 (1 asleep, 1 seeded, 2 paralyzed) | 28→26 | LOSS 9t / 3 / **3** (BLAZIKEN down to 2 WATER_GUNs; STANTLER last, MEGA_DRAIN/SHADOW_BALL) | **none: open FAIL**, report-only |
| Mudkip (SCEPTILE 31) | LOSS 9t / 3 / 2 (no disruption) | 28→26 | LOSS 13t / 3 / **3** (STANTLER down after sleeping PELIPPER; SCEPTILE crit DRAGON_CLAW ends it) | **none: open FAIL**, report-only |
Old C386 playtests at Lv26 (slot-1, report-only, lead level now 26): Torchic full LOSS 16t/3/2, Treecko full LOSS 11t/3/2, Mudkip full LOSS 9t/3/2, worn LOSS 10t/3/1.
**Reading for C388/C389**: one step only was allowed and it is spent (26 stays). The common decider in every variant is now **STANTLER_HOENN** (Ghost/Grass, SPELL_TAG, Intimidate, HYPNOSIS + LEECH_SEED + SHADOW_BALL): HYPNOSIS + LEECH_SEED turn PELIPPER (SURF only 0.5x into it) into free turns, and SHADOW_BALL finishes the party. Candidate fix for the retrospective (not done): drop HYPNOSIS from the three Route 119 STANTLER_HOENN movesets (one dial, all variants), then re-run the coverage tests. "Too easy" is not a risk at 26: every run still ends 0/0/0 HP.
**Reflection C387 (decision rule for C389, binding)**: three cycles (C385-C387) have gone into one quiet-beat rival. C389 gets exactly ONE more dial: remove HYPNOSIS from all six Route 119 STANTLER_HOENN movesets (May+Brendan), re-run the three coverage playtests. Any variant that then WINS gets a guard (win + maxPlayerFaints 2); any that still loses is ACCEPTED as a hard rival (report-only, recorded as such) and the thread closes. No further level, roster or yardstick changes. Also weigh: the yardstick is 3 mons, no bag, vs a 4-mon rival; a real Badge-6 player has more of both, so a narrow yardstick loss is not a player wall.
**C389 close-out (CLOSED)**: the one dial: all six Lv26 sParty_May/BrendanRoute119* STANTLER_HOENN SHADOW_BALL/**ASTONISH** (was HYPNOSIS)/LEECH_SEED/MEGA_DRAIN (Lv34/Lv70 sets untouched). faintCauses from the C389 harness tally.
| Variant | C387 Lv26 (HYPNOSIS) | C389 (ASTONISH) | Result |
|---|---|---|---|
| Torchic | LOSS 15t/3/2, STANTLER SHADOW_BALL 2 + MEGA_DRAIN 1 | **WIN 15t/2/4**, SHELGON 100%; STANTLER/MEGA DRAIN 1, SWAMPERT/ROCK SLIDE 1 | guard win + maxPlayerFaints 2 |
| Treecko | LOSS 9t/3/3, BRELOOM 1 + STANTLER 2 | **WIN 8t/2/4**, SHELGON 100%; BRELOOM/SKY UPPERCUT 1, STANTLER/MEGA DRAIN 1 | guard win + maxPlayerFaints 2 |
| Mudkip | LOSS 13t/3/3, HARIYAMA 1 + STANTLER 1 + SCEPTILE 1 | LOSS 12t/3/3; HARIYAMA/BRICK BREAK 1, SCEPTILE/LEAF BLADE 1 + DRAGON CLAW 1 | **ACCEPTED** hard rival, report-only |
Older slot-1 tests (report-only): Torchic full LOSS 11t/3/2 (was 16t; STANTLER MEGA_DRAIN/ASTONISH/SHADOW_BALL one each), Treecko full 11t/3/2, Mudkip full 9t/3/2, worn 10t/3/1 (unchanged). Reading: HYPNOSIS was the wall in two of three variants; in Mudkip the wall is the ace SCEPTILE (Grass vs a Water-heavy yardstick), which is the rival's intended identity. Thread closed; no more tuning.
