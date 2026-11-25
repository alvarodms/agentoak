# Double Battle Boss Design (Juan doubles, slot 568; + Tate & Liza Levitate EQ, C387)

**Cycle**: 397 | **Date**: November 2026

## C395: CROBAT spec check (WEEZING→CROBAT)
- **CROBAT at this slot is a restoration, not a new idea**: vanilla Maxie's Space Center ace-before-CAMERUPT is CROBAT 43. The poketools Mossdeep page lists **WING ATTACK / CONFUSE RAY / AIR CUTTER / MEAN LOOK**, but its layout is ambiguous; confirm in vanilla trainer_parties.h (git history).
- **"CROBAT's moves are physical" is only half true.** Under the per-move P/S split, WING ATTACK is physical but AIR CUTTER is special. AIR CUTTER is also a spread move, hitting player + Steven at once, so REFLECT doesn't cover it. CONFUSE RAY and MEAN LOOK are status moves. Mean Look stops switching, so a worn party can't escape the trap. A REFLECT-matched guard criterion only works with a physical-only set (e.g. WING ATTACK / BITE / CONFUSE RAY / FLY or AERIAL ACE).
- **Flying is resisted by Steel, but Steel is not immune to it** (unlike Poison). Gen 3 AI only "routes" hard on no-effect (immune) moves; a resisted hit still scores, so Steven soaks some of the damage. Keep SLUDGE BOMB/POISON FANG off CROBAT, or the C392 trap returns.
- Crobat's base Speed 130 outruns Steven's whole team, so CROBAT always moves before METANG's turn-1 REFLECT.

## C392: Space Center foes, vanilla vs LoH
- **Vanilla Maxie (Mossdeep)** = MIGHTYENA 42 / CROBAT 43 / CAMERUPT 44; **Tabitha** = CAMERUPT 36 / MIGHTYENA 38 / GOLBAT 40 (Bulbapedia Part 14, StrategyWiki; Ludo's "Crobat 34" is a typo). **No Weezing in vanilla**: LoH's WEEZING 44 is our own addition, and it sits at vanilla's top-level slot.
- **Structural point**: Steven's whole team is Steel, and Poison can't touch Steel, so every Sludge Bomb, and Crobat/Golbat's Poison STAB too, can only land on the player's three. Gen 3 AI scores a no-effect move at its minimum, so it **routes** Poison damage to the player's side. Lowering levels makes the hits weaker but doesn't change where they go.

## C391: Space Center multi battle (v3.10 "Side by side")
- **Vanilla Emerald partner Steven** (Azurilland/Bulbapedia): METANG 42 / SKARMORY 43 / AGGRON 44, all Steel; the player picks 3 mons; foes Maxie + Tabitha. Bulbapedia's Lv57 Skarmory belongs to the ORAS section, so ignore it.
- **Bulbapedia quirk**: Steven's Skarmory may use **TOXIC on the player's own mon if it has Guts** (Gen 3 AI scores an ally with Guts as a status target). So vanilla's partner can hurt the player. It cuts against the C390 hypothesis ("partner visibly saves"), so measure a Guts mon in the party (MACHOKE/HERACROSS/TAILLOW line/URSARING) as a miss path.
- Walkthroughs call the fight a mild spike after the sea routes. Nobody calls it memorable, and no hack we found redesigns it. Community partner-battle complaints are about partners doing **nothing** (PokéCommunity 425516) or being a re-skin (Run & Bun critique), not partners being too strong.
- Design consequence: a partner "save" has to be *legible*. Vanilla Steven is a 3-Steel wall whose turns blend into the noise. One visible act (Protect-style guard, heal or priority KO) beats raw levels.

## C390 + C397: Plusle & Minun "pair the player breaks" (backlog 388)
- **Code-verified quirk**: `CalculateBaseDamage` (src/pokemon.c:3356-3359) boosts Sp. Atk 1.5x for PLUS only if a **MINUS** is on the field, and for MINUS only if a **PLUS** is (opposite ability required: two Plusles do nothing, re-read C397). The check counts any battler, **either side, no HP/doubles check**, so the player's Minun powers a foe Plusle and it fires in singles. Bulbapedia's Gen 3-4 text says "ally with the opposite ability"; LoH's engine is looser.
- **Break-the-pair consequence (C397)**: KO the foe Minun and Plusle loses 1.5x, *unless the player has a Plus/Minus mon out*, which re-arms the foe. That's a legible miss path to playtest. Physical moves never get the boost (Sp. Atk only), so the dial should touch special moves (THUNDERBOLT/SHOCK_WAVE), not levels.
- **Helping Hand**: +50% base power, fails in singles and fails if the partner already used it that turn (Bulbapedia talk, Emerald). pokeemerald-expansion had to add an AI_FLAG_DOUBLE_BATTLE rule for it, which suggests vanilla Gen 3 AI has no specific Helping Hand logic. Verify the HELPING_HAND score in data/battle_ai_scripts.s before the spec relies on the AI choosing it. If it is unscored, HH is RNG noise, not a readable "support" tell.
- **Vanilla pair (corrected C397)**: Route 110 ISABEL_1 = PLUSLE 19 alone, KALEB = MINUN 19 alone (singles); only rematches ISABEL_2-5 carry both. C397 made ISABEL_1-5 doubles (v3.12, Hour 4-5). A Hours 10-15 pair must differ.
- No hack found builds a boss around Plus/Minus or Helping Hand (searched C390, C397). Doubles-everywhere hacks (Emerald Double Edition, Double Up Delevelled) convert vanilla trainers.

## C389: is a hard T&L a bug or the expectation?
- **Vanilla T&L is the community's "hardest Emerald gym"** (Sportskeeda's toughest-gym-per-game list picks T&L for Emerald; PokeCommunity "3rd Gen Gym Leaders" thread puts it tied with Norman). A Nuzlocke post: "there's a reason so many Kaizo hacks make gyms doubles." A Badge-7 loss on a narrow yardstick matches what players expect here; it isn't a defect.
- **Vanilla Xatu already carries PSYCHIC** (Lv41: Psychic / Sunny Day / Confuse Ray / Calm Mind, rankedboost/Bulbapedia). So XATU's PSYCHIC is the threat players already know, and guides counter it by leading a **Dark type** (Psychic can't touch it) + Water. Cutting PSYCHIC makes LoH's Xatu *weaker than vanilla*. Prefer fixing the yardstick: a Dark mon (MIGHTYENA/SHARPEDO/SABLEYE) is the community-standard answer, and our Y7 parties lack one.
- NIGHT_SHADE (Natu line level-up move) is fixed damage = level (39), so it's predictable but erases the Psychic identity. If a swap is needed, AERIAL_ACE/SHADOW_BALL already cover Xatu; dropping PSYCHIC leaves no Psychic STAB on the Psychic-gym ace pair.

## C387: Tate & Liza "ground that doesn't touch them"
- **Vanilla Emerald team is already 4/4 EQ-immune** (Bulbapedia): Claydol 41 (Levitate), Xatu 41 (Flying), Lunatone 42 + Solrock 42 (Levitate); Tate always leads Solrock, Liza Lunatone. So v3.9's premise is mostly *move choice + timing*, not a new roster. Check trainer_parties.h to see whether vanilla Claydol already carries EARTHQUAKE.
- **Gen 3 AI ability-confirmation bug (PokéCommunity thread 528581, FRLG; Bulbapedia notes similar in Gen 5)**: once the player shows a Levitate mon, the AI treats every player mon as Levitate and stops choosing Earthquake (a Groudon picked Body Slam every turn). Emerald's AI code is close to FRLG's. Risk for LoH: a player leading or switching in a Levitate mon (Gengar, Flygon, Claydol, Vibrava, Chimecho...) may never see the EQ beat. Gen 3 AI move choice is also score+RNG, so "turn 1 EQ" is not guaranteed even without the bug.
- No hack we found builds T&L around their own Levitate + EQ. Hacks such as Run & Bun had to add an explicit doubles EQ rule (partner grounded?) to their AI, which suggests vanilla Gen 3 AI doesn't reason about this well.
- Design consequence: make the turn-1 EQ deterministic (only damaging move on the lead, or scripted) and playtest a Levitate player lead as the miss path.

## Facts found
- Vanilla Juan rematches are all doubles, so LoH's Wallace (TRAINER_JUAN_1-5) rematches probably are too; no hack makes Juan a standalone doubles boss.
- **Inclement Emerald (PokeCommunity v1.13 thread)**: player reports of softlocks in doubles. Fainting while a specific mon (M-Metagross) was on the field, and reviving an ally, left the player stuck on the SUMMARY screen. Takeaway: in this hack's community, doubles bugs show up on the **faint/replace/revive** paths, not the opening turn.

## Design rules for LoH
1. Give the doubles fight its own identity: two mons that combo (rain setter + Swift Swim, or Surf with a Water Absorb/Lightning Rod-style partner) rather than a singles team split in two.
2. Gen 3 AI barely considers its ally. Earthquake, Surf, Explosion and Self-Destruct hit its own partner, so leave them off the AI side unless the partner is immune (Flying/Levitate for EQ, Water Absorb for Surf).
3. Use the vanilla double-trainer script path, which includes the "you need two Pokémon" text. Have the boss's opening line warn the player before the fight.
4. Static checks should cover: party ≥2, doubleBattle TRUE, no self-hitting spread moves without an immune partner.

## Sources
- https://www.poketools.com/emerald/mossdeep-city (C395 Maxie CROBAT set) · https://bulbapedia.bulbagarden.net/wiki/Plus_(Ability) · https://bulbapedia.bulbagarden.net/wiki/Talk:Helping_Hand_(move) · https://rh-hideout.github.io/pokeemerald-expansion/tutorials/ai_flags.html (C397)
- https://www.pokecommunity.com/threads/pok%C3%A9mon-inclement-emerald-a-decomp-difficulty-hack-version-1-13.457039/page-12
- https://www.smogon.com/forums/threads/kingdra-uber-analysis.80474
- https://www.pokecommunity.com/threads/frlg-ability-confirmation-bug-and-double-battle-ai.528581
- https://bulbapedia.bulbagarden.net/wiki/Tate_and_Liza
- https://rankedboost.com/pokemon/gym-leader/tate-and-liza/emerald/
- https://www.sportskeeda.com/pokemon/toughest-gym-battles-pokemon-mainline-game
- https://www.pokecommunity.com/threads/gym-leaders.319564
- https://docs.google.com/document/u/0/d/13E61Jj4KwhIy3ZKgLjPY-_uWKWklfBR_zUlhZHUZqik/mobilebasic (Gen 3 partner AI notes)
- https://bulbapedia.bulbagarden.net/wiki/Mossdeep_Space_Center · https://pokemon-archive.fandom.com/wiki/Mossdeep_Space_Center · https://www.pokecommunity.com/threads/partner-trainer-exe-has-stopped-working-apparently.425516/
