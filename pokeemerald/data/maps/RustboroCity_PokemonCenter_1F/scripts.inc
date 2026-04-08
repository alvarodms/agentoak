RustboroCity_PokemonCenter_1F_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, RustboroCity_PokemonCenter_1F_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, CableClub_OnResume
	.byte 0

RustboroCity_PokemonCenter_1F_OnTransition:
	setrespawn HEAL_LOCATION_RUSTBORO_CITY
	call Common_EventScript_UpdateBrineyLocation
	end

RustboroCity_PokemonCenter_1F_EventScript_Nurse::
	setvar VAR_0x800B, LOCALID_RUSTBORO_NURSE
	call Common_EventScript_PkmnCenterNurse
	waitmessage
	waitbuttonpress
	release
	end

RustboroCity_PokemonCenter_1F_EventScript_Man::
	msgbox RustboroCity_PokemonCenter_1F_Text_PokemonHavePersonalities, MSGBOX_NPC
	end

RustboroCity_PokemonCenter_1F_EventScript_Boy::
	msgbox RustboroCity_PokemonCenter_1F_Text_MaleAndFemalePokemon, MSGBOX_NPC
	end

RustboroCity_PokemonCenter_1F_EventScript_Girl::
	msgbox RustboroCity_PokemonCenter_1F_Text_HMCutNextDoor, MSGBOX_NPC
	end

RustboroCity_PokemonCenter_1F_Text_PokemonHavePersonalities:
	.string "My POKéMON has a NAIVE nature, and my\n"
	.string "friend's has a JOLLY nature.\p"
	.string "It's fascinating how POKéMON have\n"
	.string "personalities!$"

RustboroCity_PokemonCenter_1F_Text_MaleAndFemalePokemon:
	.string "Just like people, there are male and\n"
	.string "female POKéMON.\p"
	.string "But no one seems to have any idea how\n"
	.string "they're different.$"

RustboroCity_PokemonCenter_1F_Text_HMCutNextDoor:
	.string "The man next door gave me an HM!\p"
	.string "I used it to teach my POKéMON how to\n"
	.string "CUT down skinny trees.$"

RustboroCity_PokemonCenter_1F_EventScript_DifficultyHiker::
	lock
	faceplayer
	goto_if_set FLAG_DIFFICULTY_CHALLENGE, RustboroPkmnCenter_ChallengeHiker
	msgbox RustboroCity_PokemonCenter_1F_Text_HikerNormal, MSGBOX_DEFAULT
	release
	end

RustboroPkmnCenter_ChallengeHiker:
	msgbox RustboroCity_PokemonCenter_1F_Text_HikerChallenge, MSGBOX_DEFAULT
	release
	end

RustboroCity_PokemonCenter_1F_Text_HikerChallenge:
	.string "Ha! A fellow Challenge Mode\n"
	.string "trainer! I can always tell.\p"
	.string "Don't be alarmed if your\n"
	.string "POKéMON earn less EXP.\p"
	.string "That's the level cap - keeps\n"
	.string "you from getting too far ahead.\p"
	.string "Win more GYM BADGES and the\n"
	.string "ceiling goes up. Trust the\n"
	.string "system!$"

RustboroCity_PokemonCenter_1F_Text_HikerNormal:
	.string "I've been hiking all over HOENN.\n"
	.string "The trails near RUSTBORO are\n"
	.string "some of the best.\p"
	.string "ROXANNE's GYM is just north\n"
	.string "of here if you're looking for\n"
	.string "a battle!$"

