# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v1.6** (C2-183): Core hack foundation — starters (Larvitar/Bagon/Dratini), P/S split, Fairy, species pipeline, encounters, trainers, QoL, Battle Frontier, legendary saga, difficulty modes, first impressions.
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. City NPCs, ocean witnesses, Deep Migration, The Gathering, post-Gathering callbacks.
**v1.8** (C192-200): "The Living Region" — 4 postgame quests, 2 regional forms (Corsola_Hoenn, Growlithe_Hoenn/Arcanine_Hoenn), species pipeline.
**v1.9** (C201-210): "The New Normal" — E4 & Champion overhaul, "The Exhale", 2 mid-game forms, Deoxys quest, challenge_mode_scaling.h.
**v2.0** (C212-225): "Deeper Roots" — 5 cross-gen evos, Bagon_Hoenn (Dragon/Rock), species validation suite, Mom's send-off.
**v2.1** (C226-238): "A Changed Hoenn" — Cyan protagonist palette, 2 mid-game forms, Echo dialogue layer, Deoxys Quest II, Changed Trainer reactions.
**v2.2** (C239-253): "The Cosmic Form" — Deoxys_Hoenn (Poison/Fairy) + Toxic Touch, Quest III, trainer narrative pass, Magma/Aqua reckoning, Gligar_Hoenn + Gliscor_Hoenn.
**v2.3** (C254-267): "Roots" — Species generator (26-file), trainer generator, 5 early-game regional forms (Lotad/Shroomish/Lombre/Breloom/Ludicolo_Hoenn), ability identity pass, Glacia redesign.
**v2.4** (C268-273): "The Proving Ground" — Gym leader migration pass complete (Brawly/Norman/Drake/Wattson/Juan/Wallace), Wally VR redesign, rival arc (Brendan/May Route 110 + Lilycove teams + dialogue).
**v2.5** (C274-281): "The Changed Three" — Treecko/Torchic/Mudkip Hoenn lines (9 species, Steel/Fairy/Fighting triangle), wild encounters, postgame Birch gift, rival integration.
**v2.6** (C282-286): "The Reckoning" — Boss diversity pass, 6-NPC villain postgame arc, Birch collection quest (PP_MAX), dialogue polish.
**v2.7** (C288-294): "The Living Difference" — Mechanical identity for all 25 regional forms. 3 custom abilities (Frozen Spore, Scalding Touch, Toxic Touch), 10/10 Tier 2 ability reassignments, 3 signature moves (Spore Fist, Tidal Flare, Iron Leaf). Changed Three fully registered (9 species, 27 files each). Species count: 36 custom (11 cross-gen + 25 _HOENN), all registered.
**v2.8** (C296-300): "The Player's Hoenn" — Polish pass. BW-style repel prompt, 3 custom battle animations, dialogue subtraction (Tell:Show 7:2->4:5 in Hours 3-6), Brawly/Wattson gym leader dialogue rewrite, Growlithe_Hoenn on R118, Tempered Blade (4th custom ability, Sceptile_Hoenn), Iron Leaf redesigned to high-crit synergy. **COMPLETE.**
**v2.9** (C301-): "The Last Witness" — Champion narrative capstone. C302: Changed Three learnset fix. C303: Wallace dialogue (superseded by Steven champion swap). C304: Ambipom + Norman. C305: Carbink + Roxanne. C306: Champion redesign planning — Steven returns.

---

# v2.9: "The Last Witness"

**Theme**: Steven Stone — original RSE champion, geologist, collector — returns to the summit with all three Changed starters. The player, who mastered ONE, faces someone who mastered ALL THREE. The migration narrative's missing climax.

## Champion Redesign — Steven Returns

**Decision**: Steven replaces Wallace as Champion. 5 community requests (#120, #182, #183, #186, #192). Corrected evidence: Altair (Wally), Extended Cut, Energized Emerald (Steven), Kaizo (Drake) all changed Hoenn champions. Steven's collector identity maps to migration mastery.

### Steven's Team (IVs 255, AI: CHECK_BAD_MOVE | TRY_TO_FAINT | CHECK_VIABILITY)

| # | Species | Lv | Type | Nature | Ability | Item | Moves |
|---|---------|----|----- |--------|---------|------|-------|
| 1 | Cradily | 53 | Rock/Grass | Careful | Suction Cups | Leftovers | Rock Slide / Giga Drain / Toxic / Amnesia |
| 2 | Flygon | 54 | Ground/Dragon | Jolly | Levitate | Choice Band | Earthquake / Dragon Claw / Rock Slide / Crunch |
| 3 | Sceptile_Hoenn | 55 | Grass/Steel | Jolly | Tempered Blade | Scope Lens | Iron Leaf / Leaf Blade / Swords Dance / Earthquake |
| 4 | Swampert_Hoenn | 55 | Water/Fighting | Brave | Guts | Sitrus Berry | Waterfall / Cross Chop / Bulk Up / Tidal Flare |
| 5 | Blaziken_Hoenn | 56 | Fire/Fairy | Modest | Blaze | Petaya Berry | Flamethrower / Moonblast / Calm Mind / Spore Fist |
| 6 | Metagross | 57 | Steel/Psychic | Adamant | Clear Body | Lum Berry | Meteor Mash / Earthquake / Ice Punch / Thunder Punch |

**EVs**: Cradily 252HP/4Def/252SpD · Flygon 4HP/252Atk/252Spe · Sceptile 252Atk/4Def/252Spe · Swampert 252HP/252Atk/4Def · Blaziken 4HP/252SpA/252Spe · Metagross 252HP/252Atk/4SpD.

**Tactical flow**: (1) Cradily stalls with Toxic+Amnesia+Leftovers, forcing early resource commitment. (2) Flygon CB wallbreaks with raw Earthquake. (3) Changed Three gauntlet — Sceptile guaranteed-crit sweep (Tempered Blade + Scope Lens + Iron Leaf = +3 crit stages), Swampert Guts punishes status, Blaziken Petaya+Blaze comeback nuke. (4) Metagross ace — BoltBeam punches + Meteor Mash + EQ, Lum Berry + Clear Body = undebuffable. No duplicate items.

**Mirror matchup**: Player's Sceptile_Hoenn → Steven's Blaziken (4x Fire). Player's Blaziken_Hoenn → Steven's Swampert (Water STAB). Player's Swampert_Hoenn → Steven's Sceptile (+65 Speed, Leaf Blade). Steven mastered all three; the player mastered one.

### Dialogue

**Intro**: "I came to HOENN seeking rare stones. What I found was a region in transformation. The migration brought species that shouldn't exist here -- and yet they thrive. I studied them. Trained alongside them. Now let me show you what I've learned."

**Defeat**: "…Magnificent. You didn't just collect them -- you understood what they mean for HOENN. Its future is in good hands."

**Post-battle**: "I came seeking rare stones and found a region rewriting itself. You didn't come seeking anything. You just walked forward. CHAMPION… that word belongs to you now."

**Rematch intro**: "You know, I thought being CHAMPION meant having the best collection. Turns out it means understanding why things changed. Ready for another lesson?"

**Rematch defeat**: "Every time we battle, the Changed Three teach me something new. Or maybe you do. Go on, CHAMPION. HOENN's still changing out there."

### Wallace Cascade — Recommended: Option A

| Option | Description | Complexity | Verdict |
|--------|-------------|------------|---------|
| A | Wallace → Gym 8, Juan → postgame | High | **Recommended** — canonical RSE, narrative escalation |
| B | Wallace → postgame superboss | Medium | Viable fallback — preserves all existing work |
| C | Wallace → storyline only | Low | Rejected — wastes team/dialogue investment |

**Why A**: Gym 8 shows migration diversity (Wallace's Ludicolo_Hoenn, Arcanine_Hoenn, Ninetales_Hoenn). Champion shows migration mastery (Steven's Changed Three). Player climbs from "Hoenn changed" to "someone mastered the change." Canonical RSE arrangement. Juan relocates to postgame mentor role (Pacifidlog/Cave of Origin), keeps Corsola_Hoenn identity.

### Species Reuse (#193)

| Species | Boss Trainers | On Steven's New Team? |
|---------|--------------|----------------------|
| Tyranitar | Sidney, Drake, Rival, Steven (Meteor Falls) — 4 bosses | No |
| Houndoom | Sidney, Maxie, Tabitha — 3+ bosses | No |
| Honchkrow | Sidney (all tiers), Wally — 2 bosses | No |
| Corsola_Hoenn | Phoebe, Juan, Aqua grunts — 3+ bosses | No |

Steven's new team: **ZERO overlap** with overused species. Primary #193 target: Sidney's Tyranitar/Houndoom/Honchkrow saturation (C312).

### C308 Implementation Scope

**Files** (5 + rematch arrays):
1. `EverGrandeCity_ChampionsRoom/map.json` — OBJ_EVENT_GFX_WALLACE → OBJ_EVENT_GFX_STEVEN
2. `EverGrandeCity_ChampionsRoom/scripts.inc` — All dialogue, post-battle Steven text (WallaceComeWithMe → StevenComeWithMe etc.)
3. `src/data/trainers.h` — TRAINER_WALLACE: name→"STEVEN", pic→TRAINER_PIC_STEVEN, party→sParty_StevenChampion
4. `src/data/trainer_parties.h` — sParty_Wallace[] → sParty_StevenChampion[]. All 4 WallaceRematch → StevenRematch.
5. `src/battle_setup.c` — No functional changes needed (REMATCH_WALLACE slot reused, same trainer IDs)

**Trainer ID strategy**: Reuse TRAINER_WALLACE slots for Steven champion. TRAINER_STEVEN stays for Meteor Falls. C309 claims TRAINER_GRUNT_UNUSED (568) for Wallace Gym 8.

**Rematch teams**: 4 tiers of escalating Steven teams. All must feature the Changed Three with increasing levels. C308 designs these.

**Meteor Falls**: Steven's postgame encounter stays (TRAINER_STEVEN, Lv77-82 collector team). Dialogue update optional — could acknowledge his champion role.

## Roster Fixes (#180) — Status

**Ambipom on Norman T3+**: DONE (C304). **Carbink on Roxanne T3+**: DONE (C305). **Toxapex on Juan T2+**: C307.

## Changed Three Ability Parity

Sceptile_Hoenn has Tempered Blade. Blaziken_Hoenn (Cute Charm) and Swampert_Hoenn (Guts) need custom abilities:
- **Blaziken_Hoenn**: Design in C310. Fairy/Fire warrior identity.
- **Swampert_Hoenn**: Design in C311. Water/Fighting brawler identity.

## Roadmap

| Cycle | Objective | Issues |
|-------|-----------|--------|
| 302-305 | Learnsets, dialogue, Ambipom+Norman, Carbink+Roxanne — **ALL DONE** | #180, #182 |
| 306 | Champion redesign planning — **THIS CYCLE** | #192 |
| 307 | Toxapex + Juan roster fix | #180 |
| 308 | Steven champion implementation | #192 |
| 309 | Wallace cascade (Wallace → Gym 8, Juan → postgame) | — |
| 310 | Blaziken_Hoenn custom ability (ABILITY_82) | — |
| 311 | Swampert_Hoenn custom ability (ABILITY_83) | — |
| 312 | Species reuse fixes (#193 — Sidney saturation) | #193 |
| 313+ | Field Notes key item, v2.9 polish | — |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2B5.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (39)**: Last = Carbink(449). EGG=450, NUM_SPECIES=450. 12 cross-gen evos + 25 _HOENN forms + 2 standalone imports (Carbink, etc.), all fully registered + verified.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81). ABILITIES_COUNT=82. Next: 82.
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file + ~6 manual in pokemon.c/pokemon_icon.c), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
