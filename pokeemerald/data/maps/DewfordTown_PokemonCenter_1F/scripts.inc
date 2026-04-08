DewfordTown_PokemonCenter_1F_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, DewfordTown_PokemonCenter_1F_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, CableClub_OnResume
	.byte 0

DewfordTown_PokemonCenter_1F_OnTransition:
	setrespawn HEAL_LOCATION_DEWFORD_TOWN
	call Common_EventScript_UpdateBrineyLocation
	end

DewfordTown_PokemonCenter_1F_EventScript_Nurse::
	setvar VAR_0x800B, LOCALID_DEWFORD_NURSE
	call Common_EventScript_PkmnCenterNurse
	waitmessage
	waitbuttonpress
	release
	end

DewfordTown_PokemonCenter_1F_EventScript_PokefanF::
	msgbox DewfordTown_PokemonCenter_1F_Text_StoneCavern, MSGBOX_NPC
	end

DewfordTown_PokemonCenter_1F_EventScript_Man::
	msgbox DewfordTown_PokemonCenter_1F_Text_FaintedMonCanUseHM, MSGBOX_NPC
	end

DewfordTown_PokemonCenter_1F_Text_StoneCavern:
	.string "There's a stone cavern at the edge\n"
	.string "of town.\p"
	.string "I've heard you can find rare stones\n"
	.string "there.$"

DewfordTown_PokemonCenter_1F_Text_FaintedMonCanUseHM:
	.string "Even if a POKéMON faints and can't\n"
	.string "battle, it can still use a move learned\l"
	.string "from a HIDDEN MACHINE (HM).$"

DewfordTown_PokemonCenter_1F_EventScript_DifficultyBoy::
	lock
	faceplayer
	goto_if_set FLAG_DIFFICULTY_CHALLENGE, DewfordPkmnCenter_ChallengeBoy
	msgbox DewfordTown_PokemonCenter_1F_Text_BoyNormal, MSGBOX_DEFAULT
	release
	end

DewfordPkmnCenter_ChallengeBoy:
	msgbox DewfordTown_PokemonCenter_1F_Text_BoyChallenge, MSGBOX_DEFAULT
	release
	end

DewfordTown_PokemonCenter_1F_Text_BoyChallenge:
	.string "Wait, you're doing Challenge\n"
	.string "Mode? That's really brave!\p"
	.string "I heard your POKéMON can't\n"
	.string "grow past a certain level\n"
	.string "until you earn more BADGES.\p"
	.string "And you can't even switch\n"
	.string "POKéMON freely in battle!\p"
	.string "I could never do that…$"

DewfordTown_PokemonCenter_1F_Text_BoyNormal:
	.string "Did you ride MR. BRINEY's boat\n"
	.string "to get here? So cool!\p"
	.string "BRAWLY's GYM is right next\n"
	.string "door if you want a battle!$"

