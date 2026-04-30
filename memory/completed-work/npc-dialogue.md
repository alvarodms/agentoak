# NPC Dialogue

All modified NPC dialogue files — Professor Birch, Rival, Villains, Gym Leaders, Elite Four, and flavor text NPCs.

---

## Collapsed History (C15-267) — See git history for full details

- **Birch/Lab** (C15,24,180,181,279,286): Opening speech, difficulty selection, postgame Changed Three gift, Reckoning collection quest (PP_MAX)
- **Rival** (C25-29,273): 4 encounters rewritten. C273: Route 119 + Lilycove → specific regional form references
- **Villains** (C248,249,284,285,286): Magma (Mt.Chimney/Lavaridge/Meteor Falls) + Aqua (Slateport/R128/Shoal Cave) postgame arc. 6 ex-Team NPCs. Reckoning collection quest.
- **Gym Leaders** (C25-29,244,245,269,271,283): All 8 rewritten. C269: Brawly/Norman/Drake regional form refs. C271: Wattson Lotad_Hoenn. C283: Roxanne fossil scholar + T&L Espeon empathy.
- **E4 + Champion** (C33,42,203,204,212,213,214,283): Sidney/Phoebe/Glacia/Drake/Wallace rewritten for cross-gen evo + regional form themes
- **Flavor NPCs** (~30 cycles): Early foreshadowing (sighting events), mid-game escalation (Bagon Colony, weather omens), The Gathering Storm (ocean witnesses), Echo Dialogue Layer (C232), Changed Trainer Witnesses (C235,238), Migration Acknowledgment NPCs (C267)
- **Quests** (C116-243): Beast sightings, Primal network, Sky Guardian, 4 side quests, Resonance (C233), Cosmic (C242,243)
- **Difficulty NPC** (C214): PetalburgCity PokemonCenter downgrade

## Wally VR Migration Dialogue — C270

VictoryRoad_1F: Petalburg Woods frost narrative, Shroomish_Hoenn finding. Rewrites C246 generic text.

## Rival Migration Arc — C273

Route 119 + Lilycove: May/Brendan intro/defeat/post-battle referencing specific regional forms + routes.

## Reckoning Arc (C284-286)

- **Magma** (C284): Mt.Chimney upgrade + Lavaridge + Meteor Falls ex-grunt NPCs. FLAGS 0x2A9-0x2AD.
- **Aqua** (C285): Slateport + R128 + Shoal Cave ex-grunt NPCs. FLAGS 0x2AE-0x2B3.
- **Collection** (C286): Birch Lab payoff, R128 horror polish, FLAG_RECKONING_COMPLETE 0x2B4. Build fixes (MUDKIP_HOENN→MUDKIP).

---

## v2.8 Dialogue Subtraction — C298

3 Echo NPCs converted from Tell to Show (Hours 3-6 fatigue fix):
- **R112 Hiker** (Route112/scripts.inc): 5-paragraph migration lecture → "…" + 2-line personal anecdote ("That PINSIR burned my hand")
- **R113 FrostTracker** (Route113/scripts.inc): Cut last 2 paragraphs (R112 cross-reference + meta-commentary). Kept personal Vulpix observation.
- **R119 Ecologist** (Route119/scripts.inc): 7 paragraphs → 2. Cut greeting, 4-form catalogue, "regional shift" explanation. Kept Stantler observation + Hartley redirect.

Tell:Show ratio Hours 3-6: 7:2 → 4:5.

## v2.8 Gym Leader Showcase Dialogue — C299

Brawly + Wattson defeat and re-talk text rewritten from Tell (migration exposition) to Show (battle-experience reference):
- **DewfordTown_Gym/scripts.inc**: `BrawlyDefeat` — "GLIGAR hit you like a riptide" (visceral battle moment). `BrawlyPostBattle` — "I feel the ocean in it" (sensation through battle, no origin story).
- **MauvilleCity_Gym/scripts.inc**: `WattsonDefeat` — "LOTAD's leaves were crackling like a live wire" (specific battle moment). `WattsonPostBattle` — "I keep notes, but honestly -- I just love the surprise!" (engineering curiosity, no Route 102 exposition).

Flannery descoped — Hour 6-10 already healthy at 3:4:3.

---

## Champion Witness Dialogue — C303

EverGrandeCity_ChampionsRoom/scripts.inc: Wallace IntroSpeech, Defeat, PostBattleSpeech rewritten (migration witness framing — Wallace references his own Ludicolo/Arcanine encounters, player recognizes parallel). Added RematchIntroSpeech + RematchPostBattleSpeech with FLAG_SYS_GAME_CLEAR conditional branching. 5 text blocks total (3 replaced, 2 new). Script logic: WallaceRematch + DefeatedRematch + PostBattleContinue labels added.

---

Key flags: Custom flags through 0x2B4. Next: 0x2B5. Difficulty multichoice IDs: 114 (select), 115 (downgrade).
