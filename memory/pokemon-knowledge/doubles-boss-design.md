# Double Battle Boss Design (Juan doubles, slot 568; + Tate & Liza Levitate EQ, C387)

**Cycle**: 390 | **Date**: November 2026

---

## C390: Plusle & Minun twin doubles (backlog 388), prior art + engine check
- **Code-verified quirk**: `CalculateBaseDamage` (src/pokemon.c:3356-3358) boosts Plus/Minus Sp. Atk 1.5x if `ABILITY_ON_FIELD2(ABILITY_MINUS/PLUS)`, which is `ABILITYEFFECT_FIELD_SPORT` default branch (battle_util.c:3217-3226): ANY battler on the field, **either side, no HP check, no doubles check**. So the player's own Minun powers the foe's Plusle (and vice versa), and it fires in singles too. Bulbapedia only states the "ally" rule; nobody documents this. Mainline Gen 3 matches pret, so it is vanilla behaviour.
- **Vanilla already has the pair**: Route 110 Pokéfans ISABEL (Plusle+Minun, Lv14) and Emerald-only KALEB (Minun+Plusle, Lv14), close enough together to start a sight double (StrategyWiki/Serebii). A Hours 10-15 Plusle/Minun double would repeat a Hour-4 fight unless it does something different.
- No hack found builds a boss around Plus/Minus or Helping Hand; doubles-everywhere hacks (Emerald Double Edition, Double Up Delevelled) just convert vanilla trainers. Fan threads call Plusle/Minun the obvious doubles theme, but nobody has built it.
- Helping Hand multiplier not confirmed by search (verify in battle_script_commands/AI scripts before relying on the AI choosing it).

## C389: is a hard T&L a bug or the expectation?
- **Vanilla T&L is the community's "hardest Emerald gym"** (Sportskeeda's toughest-gym-per-game list picks T&L for Emerald; PokeCommunity "3rd Gen Gym Leaders" thread puts it tied with Norman). A Nuzlocke post: "there's a reason so many Kaizo hacks make gyms doubles." A Badge-7 loss on a narrow yardstick matches what players expect here; it isn't a defect.
- **Vanilla Xatu already carries PSYCHIC** (Lv41: Psychic / Sunny Day / Confuse Ray / Calm Mind, rankedboost/Bulbapedia). So XATU's PSYCHIC is the threat players already know, and guides counter it by leading a **Dark type** (Psychic can't touch it) + Water. Cutting PSYCHIC makes LoH's Xatu *weaker than vanilla*. Prefer fixing the yardstick: a Dark mon (MIGHTYENA/SHARPEDO/SABLEYE) is the community-standard answer, and our Y7 parties lack one.
- NIGHT_SHADE (Natu line level-up move) is fixed damage = level (39), so it's predictable but erases the Psychic identity. If a swap is needed, AERIAL_ACE/SHADOW_BALL already cover Xatu; dropping PSYCHIC leaves no Psychic STAB on the Psychic-gym ace pair.

## C388: harness naming + "is the beat already vanilla?"
- **Players already know this fight.** Strategy guides (rankedboost Emerald T&L page) describe vanilla Emerald's T&L as using Earthquake with Claydol while their Flying/Levitate partners stay unharmed; vanilla R/S advice is "Ground moves fail, bring Water/Grass/Bug/Ghost", which is v3.9's answers (b). The LoH spec keeps Claydol's EQ moveset "unchanged", so the turn-1 EQ may already fire in the current ROM. Measure the Y7 yardsticks on the pre-edit roster first (baseline), then after the Lunatone swap, so the diff shows what v3.9 actually adds.
- **Harness API precedent**: the pokeemerald-expansion test system (DOUBLE_BATTLE_TEST) names the battlers `playerLeft / playerRight / opponentLeft / opponentRight`, gives targets explicitly only when needed (`target:`), and specifies the AI's actions with EXPECT_MOVE / EXPECT_SEND_OUT / EXPECT_SWITCH. Copy those names for `battleTurns target`, and treat a send-out after a faint as its own step. Inclement's doubles softlocks (below) were on the faint/replace path.

## C387: Tate & Liza "ground that doesn't touch them"
- **Vanilla Emerald team is already 4/4 EQ-immune** (Bulbapedia): Claydol 41 (Levitate), Xatu 41 (Flying), Lunatone 42 + Solrock 42 (Levitate); Tate always leads Solrock, Liza Lunatone. So v3.9's premise is mostly *move choice + timing*, not a new roster. Check trainer_parties.h to see whether vanilla Claydol already carries EARTHQUAKE.
- **Gen 3 AI ability-confirmation bug (PokéCommunity thread 528581, FRLG; Bulbapedia notes similar in Gen 5)**: once the player shows a Levitate mon, the AI treats every player mon as Levitate and stops choosing Earthquake (a Groudon picked Body Slam every turn). Emerald's AI code is close to FRLG's. Risk for LoH: a player leading or switching in a Levitate mon (Gengar, Flygon, Claydol, Vibrava, Chimecho...) may never see the EQ beat. Gen 3 AI move choice is also score+RNG, so "turn 1 EQ" is not guaranteed even without the bug.
- No hack we found builds T&L around their own Levitate + EQ. Hacks such as Run & Bun had to add an explicit doubles EQ rule (partner grounded?) to their AI, which suggests vanilla Gen 3 AI doesn't reason about this well.
- Design consequence: make the turn-1 EQ deterministic (only damaging move on the lead, or scripted) and playtest a Levitate player lead as the miss path.

## Facts found
- **Vanilla Emerald already ran every Juan rematch as a Double Battle** (Bulbapedia / Sootopolis Gym pages). LoH's TRAINER_JUAN_1-5 slots became Wallace in C309 with "doubles unchanged", so **Wallace's Gym rematches are probably doubles already**. Check `doubleBattle` in `wallace_gym_2-5.json` before building Juan's doubles, so the two fights aren't the same format.
- No hack we found turns Juan into a standalone doubles boss. The niche is open, but there's no proven pattern to copy.
- **Inclement Emerald (PokeCommunity v1.13 thread)**: player reports of softlocks in doubles. Fainting while a specific mon (M-Metagross) was on the field, and reviving an ally, left the player stuck on the SUMMARY screen. Takeaway: in this hack's community, doubles bugs show up on the **faint/replace/revive** paths, not the opening turn.
- Gen 3 rain: Swift Swim doubles Speed (Kingdra is the classic case). Rain + Swift Swim + spread moves is the strongest doubles idea a Water leader has in Gen 3.

## Design rules for LoH
1. Give the doubles fight its own identity: two mons that combo (rain setter + Swift Swim, or Surf with a Water Absorb/Lightning Rod-style partner) rather than a singles team split in two.
2. Gen 3 AI barely considers its ally. Earthquake, Surf, Explosion and Self-Destruct hit its own partner, so leave them off the AI side unless the partner is immune (Flying/Levitate for EQ, Water Absorb for Surf).
3. Use the vanilla double-trainer script path, which includes the "you need two Pokémon" text. Have the boss's opening line warn the player before the fight.
4. Static checks should cover: party ≥2, doubleBattle TRUE, no self-hitting spread moves without an immune partner.

## Sources
- https://bulbapedia.bulbagarden.net/wiki/Juan
- https://pokemon.fandom.com/wiki/Sootopolis_Gym
- https://www.pokecommunity.com/threads/pok%C3%A9mon-inclement-emerald-a-decomp-difficulty-hack-version-1-13.457039/page-12
- https://www.smogon.com/forums/threads/kingdra-uber-analysis.80474
- https://www.pokecommunity.com/threads/frlg-ability-confirmation-bug-and-double-battle-ai.528581
- https://bulbapedia.bulbagarden.net/wiki/Tate_and_Liza
- https://expansion-docsite-kildemal.pages.dev/tutorials/how_to_testing_system
- https://rankedboost.com/pokemon/gym-leader/tate-and-liza/emerald/
- https://www.sportskeeda.com/pokemon/toughest-gym-battles-pokemon-mainline-game
- https://www.pokecommunity.com/threads/gym-leaders.319564
- https://docs.google.com/document/u/0/d/13E61Jj4KwhIy3ZKgLjPY-_uWKWklfBR_zUlhZHUZqik/mobilebasic (Gen 3 partner AI notes)
