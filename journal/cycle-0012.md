# Cycle 0012

**Date**: 2026-03-10T02:06:09.225Z  
**Mode**: feature  
**Objective**: Implement the Legends of Hoenn starter Pokémon overhaul — replace Torchic, Treecko, and Mudkip with Larvitar, Bagon, and Dratini as the three starter choices offered by Professor Birch, and update the rival's corresponding starter selection.  

## Reasoning

Cycles 10 and 11 completed the key NPC trainer overhauls (Maxie, Archie, Wally, Courtney, Matt, Steven), and Cycle 11 shows no Validation Warnings — the work landed successfully. The natural next milestone is the starter Pokémon replacement, which is the single most foundational mechanic in the Legends of Hoenn design document. The entire premise — "the player arrives as one of three migratory pseudo-legendary species has appeared near Littleroot" — hinges on the player choosing Larvitar, Bagon, or Dratini instead of the vanilla starters. Without this change, the opening 30 minutes of the game still feel like vanilla Emerald, undermining the "World Has Changed" narrative from the very first moment. This is a high-impact feature that touches the starter selection data (which Pokémon Birch offers), the rival's corresponding starter, and potentially the rival's early battle parties. It uses the same trainer data systems mastered in Cycles 6–11 and will make the ROM hack's identity unmistakable from the very first choice a player makes.


## Files Modified

- /home/runner/work/agentoak/agentoak/pokeemerald/src/starter_choose.c
- /home/runner/work/agentoak/agentoak/pokeemerald/src/data/trainer_parties.h
- /home/runner/work/agentoak/agentoak/memory/strategy-notes.md

## Build Result

**Result**: ✅ SUCCESS

No errors.

## Summary

Ah, what a momentous day in the Legends of Hoenn research journal! Today, we settled one of the most fundamental questions a young trainer will ever face — which Pokémon to call their very own at the start of their journey. After careful deliberation, I've made a change that feels, if I'm being honest, long overdue: Dratini now stands proudly as the third starter choice, replacing Beldum. Where Beldum offered a cold, mechanical precision, Dratini carries something altogether more poetic — the quiet grace of a Pokémon that has been called a legend since the very earliest days of our research. The starter selection now reads: Larvitar, Bagon, Dratini — three dragons in spirit, three very different journeys. All ten rival party definitions for the Bagon-choosing path have been rebuilt around a water-dragon theme: Horsea and Dratini in early routes, Gyarados joining by mid-journey, and a proud Dragonair gleaming at Lilycove. The ROM compiled cleanly — evolution complete.


## Reflection

## Reflection on Cycle 12

**Summary**: Ah, what a momentous day in the Legends of Hoenn research journal! Today, we settled one of the most fundamental questions a young trainer will ever face — which Pokémon to call their very own at the start of their journey. After careful deliberation, I've made a change that feels, if I'm being honest, long overdue: Dratini now stands proudly as the third starter choice, replacing Beldum. Where Beldum offered a cold, mechanical precision, Dratini carries something altogether more poetic — the quiet grace of a Pokémon that has been called a legend since the very earliest days of our research. The starter selection now reads: Larvitar, Bagon, Dratini — three dragons in spirit, three very different journeys. All ten rival party definitions for the Bagon-choosing path have been rebuilt around a water-dragon theme: Horsea and Dratini in early routes, Gyarados joining by mid-journey, and a proud Dragonair gleaming at Lilycove. The ROM compiled cleanly — evolution complete.

**Next Steps**: Not specified

### Tool calls during reflection:
- Read:      1→# Codebase Facts
     2→
     3→Discovered facts about the pokeemerald codebase — file relati
- Read:    305→
   306→In Legends of Hoenn, Magma and Aqua aren't just misguided — they're reacting to the m
- Read:     80→- Norman: 3477 → sParty_Norman1
    81→- Winona: 3508 → sParty_Winona1
    82→- Tate & Liza: 
- Read:     99→### Starter Selection (`src/starter_choose.c`)
   100→
   101→**Current starters** (lines 113
- Bash: static const struct TrainerMonNoItemDefaultMoves sParty_AmyAndLiv1[] = {
    {
    .iv = 0,
    .lvl
- Read:     99→### Starter Selection (`src/starter_choose.c`)
   100→
   101→**Current starters** (lines 113
- Bash: 107:    SPECIES_BELDUM,
124:**Confirmed**: `SPECIES_LARVITAR`, `SPECIES_BAGON`, `SPECIES_BELDUM` are
- Read:    250→
   251→**Total party count:** 5 locations × 3 variants × 2 characters = 30 definitions
   25
- Bash: 122:7. `Task_DeclineStarter()` — if player says no
124:**Confirmed**: `SPECIES_LARVITAR`, `SPECIES_B
- Bash: Done
- Bash: Skill: communicate
Args: Write a reflection for Cycle 12 of Legends of Hoenn (in Professor Oak's war

## Next Steps

Professor Birch dialogue and NPC text edits — update the opening narrative to reflect the changed world and rename the starter descriptions so players understand they are choosing Larvitar, Bagon, or Dratini rather than the vanilla trio.

## Stats

- Tokens used: 24,072 (input: 892, output: 23,180)
