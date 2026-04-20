MossdeepCity_SpaceCenter_2F_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, MossdeepCity_SpaceCenter_2F_OnTransition
	map_script MAP_SCRIPT_ON_FRAME_TABLE, MossdeepCity_SpaceCenter_2F_OnFrame
	.byte 0

MossdeepCity_SpaceCenter_2F_OnTransition:
	call_if_eq VAR_MOSSDEEP_CITY_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_MoveCivilians
	call_if_eq VAR_MOSSDEEP_SPACE_CENTER_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_MoveDefeatedGrunts
	end

MossdeepCity_SpaceCenter_2F_EventScript_MoveCivilians::
	clearflag FLAG_INTERACTED_WITH_STEVEN_SPACE_CENTER
	setobjectxyperm LOCALID_SPACE_CENTER_2F_SCIENTIST, 5, 3
	setobjectmovementtype LOCALID_SPACE_CENTER_2F_SCIENTIST, MOVEMENT_TYPE_FACE_RIGHT
	setobjectxyperm LOCALID_SPACE_CENTER_2F_RICH_BOY, 3, 2
	setobjectmovementtype LOCALID_SPACE_CENTER_2F_RICH_BOY, MOVEMENT_TYPE_FACE_RIGHT
	setobjectxyperm LOCALID_SPACE_CENTER_2F_GENTLEMAN, 1, 3
	setobjectmovementtype LOCALID_SPACE_CENTER_2F_GENTLEMAN, MOVEMENT_TYPE_FACE_RIGHT
	return

MossdeepCity_SpaceCenter_2F_EventScript_MoveDefeatedGrunts::
	setobjectxyperm LOCALID_SPACE_CENTER_GRUNT_6, 11, 2
	setobjectxyperm LOCALID_SPACE_CENTER_GRUNT_7, 15, 2
	setobjectxyperm LOCALID_SPACE_CENTER_GRUNT_5, 13, 4
	return

MossdeepCity_SpaceCenter_2F_OnFrame:
	map_script_2 VAR_MOSSDEEP_SPACE_CENTER_STATE, 1, MossdeepCity_SpaceCenter_2F_EventScript_ThreeMagmaGrunts
	.2byte 0

MossdeepCity_SpaceCenter_2F_EventScript_ThreeMagmaGrunts::
	playse SE_PIN
	applymovement LOCALID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	applymovement LOCALID_PLAYER, Common_Movement_Delay48
	waitmovement 0
	msgbox MossdeepCity_SpaceCenter_2F_Text_YoureOutnumberedTakeUsOn, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, YES, MossdeepCity_SpaceCenter_2F_EventScript_BattleThreeMagmaGrunts
	msgbox MossdeepCity_SpaceCenter_2F_Text_GoodAnswer, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_PLAYER, MossdeepCity_SpaceCenter_2F_Movement_PlayerExit
	waitmovement 0
	warp MAP_MOSSDEEP_CITY_SPACE_CENTER_1F, 13, 1
	waitstate
	releaseall
	end

MossdeepCity_SpaceCenter_2F_Movement_PlayerExit:
	walk_up
	step_end

MossdeepCity_SpaceCenter_2F_EventScript_BattleThreeMagmaGrunts::
	msgbox MossdeepCity_SpaceCenter_2F_Text_Grunt5Intro, MSGBOX_DEFAULT
	trainerbattle_no_intro TRAINER_GRUNT_SPACE_CENTER_5, MossdeepCity_SpaceCenter_2F_Text_Grunt5Defeat
	applymovement LOCALID_SPACE_CENTER_GRUNT_5, MossdeepCity_SpaceCenter_2F_Movement_Grunt5Defeated
	waitmovement 0
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	msgbox MossdeepCity_SpaceCenter_2F_Text_Grunt6Intro, MSGBOX_DEFAULT
	trainerbattle_no_intro TRAINER_GRUNT_SPACE_CENTER_6, MossdeepCity_SpaceCenter_2F_Text_Grunt6Defeat
	applymovement LOCALID_SPACE_CENTER_GRUNT_6, MossdeepCity_SpaceCenter_2F_Movement_Grunt6Defeated
	waitmovement 0
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterRight
	waitmovement 0
	msgbox MossdeepCity_SpaceCenter_2F_Text_Grunt7Intro, MSGBOX_DEFAULT
	trainerbattle_no_intro TRAINER_GRUNT_SPACE_CENTER_7, MossdeepCity_SpaceCenter_2F_Text_Grunt7Defeat
	applymovement LOCALID_SPACE_CENTER_GRUNT_7, MossdeepCity_SpaceCenter_2F_Movement_Grunt7Defeated
	waitmovement 0
	setvar VAR_MOSSDEEP_SPACE_CENTER_STATE, 2
	copyobjectxytoperm LOCALID_SPACE_CENTER_GRUNT_6
	copyobjectxytoperm LOCALID_SPACE_CENTER_GRUNT_7
	copyobjectxytoperm LOCALID_SPACE_CENTER_GRUNT_5
	releaseall
	end

MossdeepCity_SpaceCenter_2F_Movement_Grunt6Defeated:
	lock_facing_direction
	walk_left
	unlock_facing_direction
	step_end

MossdeepCity_SpaceCenter_2F_Movement_Grunt5Defeated:
	lock_facing_direction
	walk_down
	unlock_facing_direction
	step_end

MossdeepCity_SpaceCenter_2F_Movement_Grunt7Defeated:
	lock_facing_direction
	walk_right
	unlock_facing_direction
	step_end

MossdeepCity_SpaceCenter_2F_EventScript_Scientist::
	lock
	faceplayer
	@ Quest 7: The Answer states (highest priority)
	goto_if_set FLAG_QUEST_COSMIC_COMPLETE, MossdeepCity_SpaceCenter_2F_EventScript_CosmicDone
	goto_if_set FLAG_QUEST_COSMIC_STARTED, MossdeepCity_SpaceCenter_2F_EventScript_CosmicReminder
	goto_if_set FLAG_RESONANCE_RESIDUE_MOSSDEEP, MossdeepCity_SpaceCenter_2F_EventScript_CosmicOffer
	@ Quest 6: The Resonance states
	goto_if_set FLAG_QUEST_RESONANCE_COMPLETE, MossdeepCity_SpaceCenter_2F_EventScript_ResonancePostCheck
	goto_if_set FLAG_QUEST_RESONANCE_STARTED, MossdeepCity_SpaceCenter_2F_EventScript_ResonanceCheck
	@ Quest 5 / Quest 6 offer
	goto_if_set FLAG_QUEST_DEOXYS_COMPLETE, MossdeepCity_SpaceCenter_2F_EventScript_ResonanceOffer
	goto_if_set FLAG_QUEST_DEOXYS_INVESTIGATED, MossdeepCity_SpaceCenter_2F_EventScript_DeoxysRetry
	goto_if_set FLAG_QUEST_DEOXYS_STARTED, MossdeepCity_SpaceCenter_2F_EventScript_DeoxysGoCheck
	@ v1.8 Quest states
	goto_if_set FLAG_QUEST_MOSSDEEP_COMPLETE, MossdeepCity_SpaceCenter_2F_EventScript_CheckDeoxysOffer
	goto_if_set FLAG_QUEST_MOSSDEEP_INVESTIGATED, MossdeepCity_SpaceCenter_2F_EventScript_ResearcherQuestReturn
	goto_if_set FLAG_QUEST_MOSSDEEP_STARTED, MossdeepCity_SpaceCenter_2F_EventScript_ResearcherQuestReminder
	@ v1.8 Quest offer (post-Primal)
	goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED, MossdeepCity_SpaceCenter_2F_EventScript_ResearcherQuestOffer
	@ Existing state checks
	goto_if_set FLAG_SYS_GAME_CLEAR, MossdeepCity_SpaceCenter_2F_EventScript_ScientistNormal
	goto_if_eq VAR_MOSSDEEP_CITY_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_ScientistMagma
	goto_if_lt VAR_MOSSDEEP_CITY_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_ScientistNormal
	goto MossdeepCity_SpaceCenter_2F_EventScript_ScientistMagma
	end

MossdeepCity_SpaceCenter_2F_EventScript_ScientistNormal::
	msgbox MossdeepCity_SpaceCenter_2F_Text_MossdeepIdealForRockets, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ScientistMagma::
	msgbox MossdeepCity_SpaceCenter_2F_Text_WhyWouldMagmaStealRocketFuel, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_Gentleman::
	lock
	faceplayer
	goto_if_set FLAG_SYS_GAME_CLEAR, MossdeepCity_SpaceCenter_2F_EventScript_GentlemanNormal
	goto_if_eq VAR_MOSSDEEP_CITY_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_GentlemanMagma
	goto_if_lt VAR_MOSSDEEP_CITY_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_GentlemanNormal
	goto MossdeepCity_SpaceCenter_2F_EventScript_GentlemanMagma
	end

MossdeepCity_SpaceCenter_2F_EventScript_GentlemanNormal::
	msgbox MossdeepCity_SpaceCenter_2F_Text_WouldveLikedToBeAstronaut, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_GentlemanMagma::
	msgbox MossdeepCity_SpaceCenter_2F_Text_MagmaCantGetAwayWithThis, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_RichBoy::
	lock
	faceplayer
	goto_if_set FLAG_SYS_GAME_CLEAR, MossdeepCity_SpaceCenter_2F_EventScript_RichBoyNormal
	goto_if_eq VAR_MOSSDEEP_CITY_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_RichBoyMagma
	goto_if_lt VAR_MOSSDEEP_CITY_STATE, 2, MossdeepCity_SpaceCenter_2F_EventScript_RichBoyNormal
	goto MossdeepCity_SpaceCenter_2F_EventScript_RichBoyMagma
	end

MossdeepCity_SpaceCenter_2F_EventScript_RichBoyNormal::
	msgbox MossdeepCity_SpaceCenter_2F_Text_WishOrdinaryPeopleCouldGoIntoSpace, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_RichBoyMagma::
	msgbox MossdeepCity_SpaceCenter_2F_Text_DoesMagmaWantToGoToSpace, MSGBOX_DEFAULT
	release
	end

@ Battle for the below 3 grunts is handled in MossdeepCity_SpaceCenter_2F_EventScript_BattleThreeMagmaGrunts
MossdeepCity_SpaceCenter_2F_EventScript_Grunt6::
	msgbox MossdeepCity_SpaceCenter_2F_Text_Grunt6PostBattle, MSGBOX_NPC
	end

MossdeepCity_SpaceCenter_2F_EventScript_Grunt7::
	msgbox MossdeepCity_SpaceCenter_2F_Text_Grunt7PostBattle, MSGBOX_NPC
	end

MossdeepCity_SpaceCenter_2F_EventScript_Grunt5::
	msgbox MossdeepCity_SpaceCenter_2F_Text_Grunt5PostBattle, MSGBOX_NPC
	end

MossdeepCity_SpaceCenter_2F_EventScript_Tabitha::
	lock
	faceplayer
	msgbox MossdeepCity_SpaceCenter_2F_Text_WellTakeCareOfYou, MSGBOX_DEFAULT
	applymovement VAR_LAST_TALKED, Common_Movement_FaceOriginalDirection
	waitmovement 0
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_Maxie::
	lockall
	msgbox MossdeepCity_SpaceCenter_2F_Text_MaxieDontInterfere, MSGBOX_DEFAULT
	releaseall
	end

MossdeepCity_SpaceCenter_2F_EventScript_Steven::
	lockall
	goto_if_set FLAG_INTERACTED_WITH_STEVEN_SPACE_CENTER, MossdeepCity_SpaceCenter_2F_EventScript_ReadyForBattlePrompt
	setflag FLAG_INTERACTED_WITH_STEVEN_SPACE_CENTER
	msgbox MossdeepCity_SpaceCenter_2F_Text_StevenWhyStealRocketFuel, MSGBOX_DEFAULT
	msgbox MossdeepCity_SpaceCenter_2F_Text_MaxieUseFuelToEruptVolcano, MSGBOX_DEFAULT
	closemessage
	delay 30
	playse SE_NOT_EFFECTIVE
	switch VAR_FACING
	case DIR_SOUTH, MossdeepCity_SpaceCenter_2F_EventScript_StevenFightMovementSouth
	applymovement LOCALID_SPACE_CENTER_2F_STEVEN, MossdeepCity_SpaceCenter_2F_Movement_StevenFight
	waitmovement 0
	releaseall
	end

MossdeepCity_SpaceCenter_2F_EventScript_StevenFightMovementSouth::
	applymovement LOCALID_SPACE_CENTER_2F_STEVEN, MossdeepCity_SpaceCenter_2F_Movement_StevenFightSouth
	waitmovement 0
	releaseall
	end

MossdeepCity_SpaceCenter_2F_Movement_StevenFight:
	lock_facing_direction
	walk_fast_up
	walk_fast_up
	unlock_facing_direction
	delay_16
	delay_16
	walk_slow_down
	walk_slow_down
	step_end

MossdeepCity_SpaceCenter_2F_Movement_StevenFightSouth:
	face_left
	lock_facing_direction
	walk_fast_right
	walk_fast_right
	unlock_facing_direction
	delay_16
	delay_16
	walk_slow_left
	walk_slow_left
	face_down
	step_end

MossdeepCity_SpaceCenter_2F_EventScript_ReadyForBattlePrompt::
	applymovement VAR_LAST_TALKED, Common_Movement_FacePlayer
	waitmovement 0
	msgbox MossdeepCity_SpaceCenter_2F_Text_StevenAreYouReadyToBattle, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, YES, MossdeepCity_SpaceCenter_2F_EventScript_ChoosePartyForMultiBattle
	msgbox MossdeepCity_SpaceCenter_2F_Text_StevenHurryGetReadyQuickly, MSGBOX_DEFAULT
	closemessage
	applymovement VAR_LAST_TALKED, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	releaseall
	end

MossdeepCity_SpaceCenter_2F_EventScript_ChoosePartyForMultiBattle::
	applymovement VAR_LAST_TALKED, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	special SavePlayerParty
	fadescreen FADE_TO_BLACK
	special ChooseHalfPartyForBattle
	waitstate
	goto_if_ne VAR_RESULT, 0, MossdeepCity_SpaceCenter_2F_EventScript_DoStevenMultiBattle
	special LoadPlayerParty
	goto MossdeepCity_SpaceCenter_2F_EventScript_ReadyForBattlePrompt

MossdeepCity_SpaceCenter_2F_EventScript_DoStevenMultiBattle::
	special ReducePlayerPartyToSelectedMons
	frontier_set FRONTIER_DATA_SELECTED_MON_ORDER
	setvar VAR_0x8004, SPECIAL_BATTLE_STEVEN
	setvar VAR_0x8005, 0
	special DoSpecialTrainerBattle
	waitstate
	frontier_saveparty
	special LoadPlayerParty
	switch VAR_RESULT
	case 1, MossdeepCity_SpaceCenter_2F_EventScript_DefeatedMaxieTabitha
	fadescreen FADE_TO_BLACK
	special SetCB2WhiteOut
	waitstate

MossdeepCity_SpaceCenter_2F_EventScript_DefeatedMaxieTabitha::
	msgbox MossdeepCity_SpaceCenter_2F_Text_MaxieWeFailedIsAquaAlsoMisguided, MSGBOX_DEFAULT
	closemessage
	delay 20
	applymovement LOCALID_SPACE_CENTER_MAXIE, Common_Movement_WalkInPlaceFasterLeft
	applymovement LOCALID_SPACE_CENTER_TABITHA, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	delay 60
	applymovement LOCALID_SPACE_CENTER_MAXIE, Common_Movement_WalkInPlaceFasterUp
	applymovement LOCALID_SPACE_CENTER_TABITHA, Common_Movement_WalkInPlaceFasterRight
	waitmovement 0
	delay 20
	msgbox MossdeepCity_SpaceCenter_2F_Text_MaxieWeWillGiveUp, MSGBOX_DEFAULT
	closemessage
	setvar VAR_MOSSDEEP_CITY_STATE, 3
	fadedefaultbgm
	fadescreen FADE_TO_BLACK
	setvar VAR_MOSSDEEP_SPACE_CENTER_STATE, 3
	setflag FLAG_HIDE_MOSSDEEP_CITY_SPACE_CENTER_1F_TEAM_MAGMA
	setflag FLAG_HIDE_MOSSDEEP_CITY_SPACE_CENTER_2F_TEAM_MAGMA
	setflag FLAG_HIDE_MOSSDEEP_CITY_TEAM_MAGMA
	removeobject LOCALID_SPACE_CENTER_GRUNT_6
	removeobject LOCALID_SPACE_CENTER_GRUNT_7
	removeobject LOCALID_SPACE_CENTER_GRUNT_5
	removeobject LOCALID_SPACE_CENTER_TABITHA
	removeobject LOCALID_SPACE_CENTER_MAXIE
	setobjectxy LOCALID_SPACE_CENTER_2F_SCIENTIST, 5, 6
	turnobject LOCALID_SPACE_CENTER_2F_SCIENTIST, DIR_SOUTH
	setobjectxy LOCALID_SPACE_CENTER_2F_GENTLEMAN, 11, 8
	turnobject LOCALID_SPACE_CENTER_2F_GENTLEMAN, DIR_NORTH
	setobjectxy LOCALID_SPACE_CENTER_2F_RICH_BOY, 6, 2
	turnobject LOCALID_SPACE_CENTER_2F_RICH_BOY, DIR_NORTH
	call MossdeepCity_SpaceCenter_2F_EventScript_StevenFacePlayer
	fadescreen FADE_FROM_BLACK
	msgbox MossdeepCity_SpaceCenter_2F_Text_StevenThankYouComeSeeMeAtHome, MSGBOX_DEFAULT
	closemessage
	fadescreen FADE_TO_BLACK
	setflag FLAG_DEFEATED_MAGMA_SPACE_CENTER
	setflag FLAG_HIDE_MOSSDEEP_CITY_STEVENS_HOUSE_STEVEN
	removeobject LOCALID_SPACE_CENTER_2F_STEVEN
	setflag FLAG_HIDE_MOSSDEEP_CITY_SPACE_CENTER_MAGMA_NOTE
	clearflag FLAG_HIDE_MOSSDEEP_CITY_STEVENS_HOUSE_STEVEN
	setvar VAR_STEVENS_HOUSE_STATE, 1
	setflag FLAG_HIDE_MOSSDEEP_CITY_SCOTT
	removeobject LOCALID_SPACE_CENTER_2F_SCIENTIST
	setobjectxyperm LOCALID_SPACE_CENTER_2F_SCIENTIST, 5, 6
	setobjectmovementtype LOCALID_SPACE_CENTER_2F_SCIENTIST, MOVEMENT_TYPE_WANDER_AROUND
	addobject LOCALID_SPACE_CENTER_2F_SCIENTIST
	fadescreen FADE_FROM_BLACK
#ifdef BUGFIX
	releaseall
#endif
	end

MossdeepCity_SpaceCenter_2F_EventScript_StevenFacePlayer::
	switch VAR_FACING
	case DIR_SOUTH, MossdeepCity_SpaceCenter_2F_EventScript_StevenFacePlayerSouth
	case DIR_WEST, MossdeepCity_SpaceCenter_2F_EventScript_StevenFacePlayerWest
	return

MossdeepCity_SpaceCenter_2F_EventScript_StevenFacePlayerSouth::
	turnobject LOCALID_SPACE_CENTER_2F_STEVEN, DIR_NORTH
	return

MossdeepCity_SpaceCenter_2F_EventScript_StevenFacePlayerWest::
	turnobject LOCALID_SPACE_CENTER_2F_STEVEN, DIR_EAST
	return

MossdeepCity_SpaceCenter_2F_EventScript_MaxieTrainer::
	trainerbattle TRAINER_BATTLE_SET_TRAINER_A, TRAINER_MAXIE_MOSSDEEP, LOCALID_NONE, MossdeepCity_SpaceCenter_2F_Text_JustWantToExpandLand, MossdeepCity_SpaceCenter_2F_Text_JustWantToExpandLand
	end

MossdeepCity_SpaceCenter_2F_EventScript_TabithaTrainer::
	trainerbattle TRAINER_BATTLE_SET_TRAINER_B, TRAINER_TABITHA_MOSSDEEP, LOCALID_NONE, MossdeepCity_SpaceCenter_Text_TabithaDefeat, MossdeepCity_SpaceCenter_Text_TabithaDefeat
	end

MossdeepCity_SpaceCenter_2F_EventScript_RivalRayquazaCall::
	lockall
	checkplayergender
	call_if_eq VAR_RESULT, MALE, MossdeepCity_SpaceCenter_2F_EventScript_MayRayquazaCall
	call_if_eq VAR_RESULT, FEMALE, MossdeepCity_SpaceCenter_2F_EventScript_BrendanRayquazaCall
	closemessage
	clearflag FLAG_DEFEATED_MAGMA_SPACE_CENTER
	releaseall
	end

MossdeepCity_SpaceCenter_2F_EventScript_MayRayquazaCall::
	pokenavcall MatchCall_Text_MayRayquazaCall
	waitmessage
	return

MossdeepCity_SpaceCenter_2F_EventScript_BrendanRayquazaCall::
	pokenavcall MatchCall_Text_BrendanRayquazaCall
	waitmessage
	return

MossdeepCity_SpaceCenter_2F_Text_MossdeepIdealForRockets:
	.string "MOSSDEEP has mainly sunny weather,\n"
	.string "and its winds are stable.\p"
	.string "It's an ideal location for launching\n"
	.string "rockets.$"

MossdeepCity_SpaceCenter_2F_Text_WhyWouldMagmaStealRocketFuel:
	.string "Why would TEAM MAGMA want to steal\n"
	.string "our rocket fuel in the first place?$"

MossdeepCity_SpaceCenter_2F_Text_WouldveLikedToBeAstronaut:
	.string "If only I was a little younger, I would\n"
	.string "have liked being an astronaut…\p"
	.string "No… It's not too late!\n"
	.string "I can and will try!$"

MossdeepCity_SpaceCenter_2F_Text_MagmaCantGetAwayWithThis:
	.string "If TEAM MAGMA takes the rocket fuel,\n"
	.string "I won't be able to go to space!\p"
	.string "They can't be allowed to get away\n"
	.string "with such an outrage!$"

MossdeepCity_SpaceCenter_2F_Text_WishOrdinaryPeopleCouldGoIntoSpace:
	.string "I wish ordinary people could go into\n"
	.string "space one day…$"

MossdeepCity_SpaceCenter_2F_Text_DoesMagmaWantToGoToSpace:
	.string "TEAM MAGMA…\n"
	.string "Do they want to go to space, too?$"

MossdeepCity_SpaceCenter_2F_Text_YoureOutnumberedTakeUsOn:
	.string "What's wrong with you?\p"
	.string "You're outnumbered three to one,\n"
	.string "but you still want to take us on?$"

MossdeepCity_SpaceCenter_2F_Text_GoodAnswer:
	.string "Good answer!\n"
	.string "That's what a smart person'll do!$"

MossdeepCity_SpaceCenter_2F_Text_Grunt5Intro:
	.string "A reckless go-getter, are you?\n"
	.string "Okay, I'll go first!$"

MossdeepCity_SpaceCenter_2F_Text_Grunt5Defeat:
	.string "I lost!\n"
	.string "But!$"

MossdeepCity_SpaceCenter_2F_Text_Grunt6Intro:
	.string "It's too soon to be relieved!\n"
	.string "I'm up next!$"

MossdeepCity_SpaceCenter_2F_Text_Grunt6Defeat:
	.string "I lost, too!\n"
	.string "But!$"

MossdeepCity_SpaceCenter_2F_Text_Grunt7Intro:
	.string "I bet you want to take a break.\n"
	.string "But I'm not about to let you do that!$"

MossdeepCity_SpaceCenter_2F_Text_Grunt7Defeat:
	.string "We should've taken a break…\n"
	.string "That's what we should've done…$"

MossdeepCity_SpaceCenter_2F_Text_Grunt6PostBattle:
	.string "Three of us here, and look at the sorry\n"
	.string "mess we got ourselves into.$"

MossdeepCity_SpaceCenter_2F_Text_Grunt7PostBattle:
	.string "We three losing like this…\n"
	.string "We look worse than usual by triple!$"

MossdeepCity_SpaceCenter_2F_Text_Grunt5PostBattle:
	.string "Are we being useful to our leader\n"
	.string "at all?$"

MossdeepCity_SpaceCenter_2F_Text_WellTakeCareOfYou:
	.string "Hehehe!\p"
	.string "We come all the way here to get some\n"
	.string "fuel, and we're interfered with again!\p"
	.string "If you're going to mess with us too,\n"
	.string "we'll take care of you at the same time!$"

MossdeepCity_SpaceCenter_2F_Text_MaxieDontInterfere:
	.string "MAXIE: Clear out of the way!\n"
	.string "Don't you dare interfere!$"

MossdeepCity_SpaceCenter_2F_Text_StevenWhyStealRocketFuel:
	.string "STEVEN: TEAM MAGMA…\p"
	.string "What's the point of stealing rocket\n"
	.string "fuel?$"

MossdeepCity_SpaceCenter_2F_Text_MaxieUseFuelToEruptVolcano:
	.string "MAXIE: Fufufu… Since you're so\n"
	.string "curious, you deserve an explanation.\p"
	.string "We're going to jettison the entire\n"
	.string "load into MT. CHIMNEY!\p"
	.string "With GROUDON gone, we have no need\n"
	.string "for that slag heap of a mountain!\p"
	.string "So we'll use the fuel's power to make\n"
	.string "the volcano erupt!\p"
	.string "It will be savage!$"

MossdeepCity_SpaceCenter_2F_Text_StevenAreYouReadyToBattle:
	.string "STEVEN: {PLAYER}{KUN}!\n"
	.string "You're going to help me?\p"
	.string "Let's go into battle together!\n"
	.string "Are you ready?$"

MossdeepCity_SpaceCenter_2F_Text_StevenHurryGetReadyQuickly:
	.string "STEVEN: Then, hurry!\n"
	.string "Get ready quickly!$"

MossdeepCity_SpaceCenter_2F_Text_JustWantToExpandLand:
	.string "All I want…\n"
	.string "I just want to expand the land mass…$"

MossdeepCity_SpaceCenter_Text_TabithaDefeat:
	.string "I'm with our leader…$"

MossdeepCity_SpaceCenter_2F_Text_MaxieWeFailedIsAquaAlsoMisguided:
	.string "MAXIE: We failed to make the volcano\n"
	.string "erupt…\p"
	.string "We failed to control GROUDON after\n"
	.string "we had awoken it…\p"
	.string "Is our goal to expand the land\n"
	.string "misguided?\p"
	.string "… … … … … …\n"
	.string "… … … … … …\p"
	.string "If…\n"
	.string "If we, TEAM MAGMA, are wrong…\l"
	.string "… … … … … …\p"
	.string "Then might TEAM AQUA's goal to expand\n"
	.string "the sea also be equally misguided?$"

MossdeepCity_SpaceCenter_2F_Text_MaxieWeWillGiveUp:
	.string "MAXIE: All right…\n"
	.string "We will give up on the fuel…\p"
	.string "There appear to be more important\n"
	.string "matters that I must examine…$"

MossdeepCity_SpaceCenter_2F_Text_StevenThankYouComeSeeMeAtHome:
	.string "STEVEN: Whew, that was too tense.\n"
	.string "{PLAYER}{KUN}, thank you.\p"
	.string "I have something to give you as\n"
	.string "thanks for your support.\p"
	.string "Please come see me at home\n"
	.string "after this.\p"
	.string "Oh, yes, I don't live in RUSTBORO CITY.\n"
	.string "I live right here on this island.$"

@ =============================================
@ v1.8 Quest 3: The Mossdeep Signal (C192)
@ =============================================

MossdeepCity_SpaceCenter_2F_EventScript_ResearcherQuestOffer::
	lock
	faceplayer
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestOffer, MSGBOX_DEFAULT
	setflag FLAG_QUEST_MOSSDEEP_STARTED
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResearcherQuestReminder::
	lock
	faceplayer
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestReminder, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResearcherQuestReturn::
	lock
	faceplayer
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestReturn, MSGBOX_DEFAULT
	giveitem ITEM_STAR_PIECE, 3
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	giveitem ITEM_RARE_CANDY
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestReturnPost, MSGBOX_DEFAULT
	setflag FLAG_QUEST_MOSSDEEP_COMPLETE
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResearcherQuestDone::
	lock
	faceplayer
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestDone, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestOffer:
	.string "Champion! Perfect timing.\n"
	.string "I've been trying to get\l"
	.string "someone to look at this.\p"
	.string "During the PRIMAL STIRRING,\n"
	.string "our satellite detected an\l"
	.string "energy pulse. Normal so far.\p"
	.string "But the pulse bounced back.\n"
	.string "From the upper atmosphere.\l"
	.string "Something reflected it.\p"
	.string "We tracked the return signal\n"
	.string "to ROUTE 131. There's a\l"
	.string "specific coordinate where\l"
	.string "the atmosphere is… thinner.\p"
	.string "The swimmer near ROUTE 126\n"
	.string "says the ocean changed too.\l"
	.string "Up here, down there… the\l"
	.string "whole region felt it.\p"
	.string "Could you visit that spot\n"
	.string "on ROUTE 131? I'd go myself\l"
	.string "but… I get seasick.$"

MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestReminder:
	.string "ROUTE 131. Look for a spot\n"
	.string "where the air shimmers.\p"
	.string "Our instruments say it's\n"
	.string "near the center of the\l"
	.string "route.$"

MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestDone:
	.string "Still monitoring ROUTE 131.\n"
	.string "The thin spot hasn't closed.\p"
	.string "Whatever the PRIMAL STIRRING\n"
	.string "opened... it's permanent.\p"
	.string "That's the most exciting data\n"
	.string "I've collected in twenty years.$"

MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestReturn:
	.string "You saw it? The shimmer?\p"
	.string "Our satellites recorded the\n"
	.string "same anomaly. An atmospheric\l"
	.string "thin spot -- exactly where\l"
	.string "the signal bounced back.\p"
	.string "Here's what I think happened:\n"
	.string "the PRIMAL STIRRING released\l"
	.string "enough energy to briefly thin\l"
	.string "the barrier between our sky\l"
	.string "and... whatever is above it.\p"
	.string "I don't know what reflected\n"
	.string "that signal. Not yet.\p"
	.string "But these fell through.\n"
	.string "Cosmic fragments that\l"
	.string "shouldn't exist in our\l"
	.string "atmosphere.$"

MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestReturnPost:
	.string "Keep them. Evidence belongs\n"
	.string "with explorers, not labs.\p"
	.string "I'll be monitoring that spot\n"
	.string "on ROUTE 131 for a long,\l"
	.string "long time.$"

@ =============================================
@ Quest 5: The Second Signal (C210)
@ Postgame Deoxys quest -- requires Champion
@ + Mossdeep Signal quest complete
@ =============================================

@ --- Scientist NPC branches ---

MossdeepCity_SpaceCenter_2F_EventScript_CheckDeoxysOffer::
	goto_if_set FLAG_SYS_GAME_CLEAR, MossdeepCity_SpaceCenter_2F_EventScript_DeoxysQuestStart
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResearcherQuestDone, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_DeoxysQuestStart::
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysQuestStart, MSGBOX_DEFAULT
	setflag FLAG_QUEST_DEOXYS_STARTED
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_DeoxysQuestDone::
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysQuestDone, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_DeoxysRetry::
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysRetry, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_DeoxysGoCheck::
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysGoCheck, MSGBOX_DEFAULT
	release
	end

@ --- Terminal bg_event script ---

MossdeepCity_SpaceCenter_2F_Script_DeoxysTerminal::
	goto_if_set FLAG_QUEST_COSMIC_COMPLETE, MossdeepCity_SpaceCenter_2F_Script_TerminalCosmicDone
	goto_if_set FLAG_QUEST_COSMIC_STARTED, MossdeepCity_SpaceCenter_2F_Script_TerminalCosmicActive
	goto_if_set FLAG_RESONANCE_RESIDUE_MOSSDEEP, MossdeepCity_SpaceCenter_2F_Script_TerminalCosmicPending
	goto_if_set FLAG_QUEST_RESONANCE_COMPLETE, MossdeepCity_SpaceCenter_2F_Script_TerminalResonanceDone
	goto_if_set FLAG_QUEST_RESONANCE_STARTED, MossdeepCity_SpaceCenter_2F_Script_TerminalResonanceActive
	goto_if_set FLAG_QUEST_DEOXYS_COMPLETE, MossdeepCity_SpaceCenter_2F_Script_TerminalQuiet
	goto_if_set FLAG_QUEST_DEOXYS_INVESTIGATED, MossdeepCity_SpaceCenter_2F_Script_DeoxysRetryEncounter
	goto_if_set FLAG_QUEST_DEOXYS_STARTED, MossdeepCity_SpaceCenter_2F_Script_DeoxysInvestigate
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalNormal, MSGBOX_SIGN
	end

MossdeepCity_SpaceCenter_2F_Script_TerminalQuiet::
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalQuiet, MSGBOX_SIGN
	end

@ --- Investigation sequence (first encounter) ---

MossdeepCity_SpaceCenter_2F_Script_DeoxysInvestigate::
	lockall
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalReading1, MSGBOX_DEFAULT
	@ Camera shake -- signal approaching
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 1
	setvar VAR_0x8006, 4
	setvar VAR_0x8007, 3
	special ShakeCamera
	waitstate
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalReading2, MSGBOX_DEFAULT
	@ Stronger shake -- much closer
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 2
	setvar VAR_0x8006, 6
	setvar VAR_0x8007, 3
	special ShakeCamera
	waitstate
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalReading3, MSGBOX_DEFAULT
	@ Violent shake -- arrival
	setvar VAR_0x8004, 2
	setvar VAR_0x8005, 3
	setvar VAR_0x8006, 8
	setvar VAR_0x8007, 2
	special ShakeCamera
	waitstate
	setflag FLAG_QUEST_DEOXYS_INVESTIGATED
	@ Music fades to silence
	fadeoutbgm 1
	delay 60
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysAppears, MSGBOX_DEFAULT
	@ Legendary battle
	setwildbattle SPECIES_DEOXYS, 70
	special BattleSetup_StartLegendaryBattle
	waitstate
	specialvar VAR_RESULT, GetBattleOutcome
	compare VAR_RESULT, B_OUTCOME_CAUGHT
	goto_if_eq MossdeepCity_SpaceCenter_2F_Script_DeoxysCaught
	@ Player defeated or fled -- can retry
	fadeinbgm 1
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysVanished, MSGBOX_DEFAULT
	releaseall
	end

MossdeepCity_SpaceCenter_2F_Script_DeoxysCaught::
	fadeinbgm 1
	setflag FLAG_QUEST_DEOXYS_COMPLETE
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysCaughtReaction, MSGBOX_DEFAULT
	releaseall
	end

@ --- Retry encounter ---

MossdeepCity_SpaceCenter_2F_Script_DeoxysRetryEncounter::
	lockall
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalFlicker, MSGBOX_DEFAULT
	fadeoutbgm 1
	delay 40
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysReappears, MSGBOX_DEFAULT
	setwildbattle SPECIES_DEOXYS, 70
	special BattleSetup_StartLegendaryBattle
	waitstate
	specialvar VAR_RESULT, GetBattleOutcome
	compare VAR_RESULT, B_OUTCOME_CAUGHT
	goto_if_eq MossdeepCity_SpaceCenter_2F_Script_DeoxysCaught
	fadeinbgm 1
	msgbox MossdeepCity_SpaceCenter_2F_Text_DeoxysVanished, MSGBOX_DEFAULT
	releaseall
	end

@ --- Quest 5 text strings ---

MossdeepCity_SpaceCenter_2F_Text_DeoxysQuestStart:
	.string "...You. You investigated the\n"
	.string "signal before.\p"
	.string "It's back.\p"
	.string "No... not back. Something else.\p"
	.string "The first signal was random.\n"
	.string "Bursts of noise from deep space.\p"
	.string "This one has a rhythm.\n"
	.string "Almost like breathing.\p"
	.string "Our instruments can't explain\n"
	.string "it. The telescope shows empty\l"
	.string "sky.\p"
	.string "But the array keeps receiving.\n"
	.string "Closer. Every hour, closer.\p"
	.string "That terminal is tracking it.\n"
	.string "Would you check the readings?\p"
	.string "I... I'd rather not look alone.$"

MossdeepCity_SpaceCenter_2F_Text_DeoxysQuestDone:
	.string "The array has been quiet ever\n"
	.string "since that... encounter.\p"
	.string "Whatever it was, it came from\n"
	.string "beyond HOENN. Beyond anything\l"
	.string "we've mapped.\p"
	.string "I sleep better now. But I still\n"
	.string "check the readings every\l"
	.string "morning.$"

MossdeepCity_SpaceCenter_2F_Text_DeoxysRetry:
	.string "The terminal is still\n"
	.string "flickering.\p"
	.string "I think it's waiting for you.$"

MossdeepCity_SpaceCenter_2F_Text_DeoxysGoCheck:
	.string "Please... check the terminal.\n"
	.string "I need to know what it says.$"

MossdeepCity_SpaceCenter_2F_Text_TerminalNormal:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "All readings nominal.$"

MossdeepCity_SpaceCenter_2F_Text_TerminalQuiet:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "No signal detected.\l"
	.string "Array status: QUIET$"

MossdeepCity_SpaceCenter_2F_Text_TerminalReading1:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "SIGNAL MONITOR v3.1\p"
	.string "SOURCE: UNIDENTIFIED\n"
	.string "BEARING: 041.7 ZENITH\l"
	.string "DISTANCE: 8,400 km$"

MossdeepCity_SpaceCenter_2F_Text_TerminalReading2:
	.string "SOURCE: UNIDENTIFIED\n"
	.string "BEARING: VARIABLE\l"
	.string "DISTANCE: 430 km\p"
	.string "SIGNAL STRENGTH: RISING$"

MossdeepCity_SpaceCenter_2F_Text_TerminalReading3:
	.string "SOURCE: UN---FI--\n"
	.string "BEAR--G: ---\l"
	.string "DIST---E: 0\p"
	.string "...\p"
	.string "The screen goes dark.$"

MossdeepCity_SpaceCenter_2F_Text_DeoxysAppears:
	.string "The air turns cold.\p"
	.string "Something is here.\p"
	.string "A presence unlike anything\n"
	.string "in HOENN...$"

MossdeepCity_SpaceCenter_2F_Text_DeoxysCaughtReaction:
	.string "The readings... stopped.\p"
	.string "Whatever that was, it came\n"
	.string "FROM the signal.\l"
	.string "Or it WAS the signal.\p"
	.string "I don't think HOENN has seen\n"
	.string "anything like this before.\p"
	.string "Thank you. I can think\n"
	.string "clearly again.$"

MossdeepCity_SpaceCenter_2F_Text_DeoxysVanished:
	.string "It vanished when you drove\n"
	.string "it back...\p"
	.string "But the terminal is still\n"
	.string "flickering.\p"
	.string "I think it might return.$"

MossdeepCity_SpaceCenter_2F_Text_TerminalFlicker:
	.string "The terminal screen flickers\n"
	.string "with static.\p"
	.string "The readings are spiking\n"
	.string "again...$"

MossdeepCity_SpaceCenter_2F_Text_DeoxysReappears:
	.string "The cold returns.\p"
	.string "It's here again...$"

@ =============================================
@ Quest 6: The Resonance (C233)
@ Post-Deoxys investigation -- requires Quest 5 complete
@ =============================================

@ --- Scientist NPC branches ---

MossdeepCity_SpaceCenter_2F_EventScript_ResonanceOffer::
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResonanceOffer, MSGBOX_DEFAULT
	setflag FLAG_QUEST_RESONANCE_STARTED
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResonanceCheck::
	goto_if_unset FLAG_QUEST_RESONANCE_METEOR, MossdeepCity_SpaceCenter_2F_EventScript_ResonanceProgress
	goto_if_unset FLAG_QUEST_RESONANCE_OCEAN, MossdeepCity_SpaceCenter_2F_EventScript_ResonanceProgress
	goto MossdeepCity_SpaceCenter_2F_EventScript_ResonanceComplete
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResonanceProgress::
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResonanceProgress, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResonanceComplete::
	playse SE_PIN
	waitse
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResonanceComplete1, MSGBOX_DEFAULT
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 1
	setvar VAR_0x8006, 4
	setvar VAR_0x8007, 3
	special ShakeCamera
	waitstate
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResonanceComplete2, MSGBOX_DEFAULT
	giveitem ITEM_STAR_PIECE, 2
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	setflag FLAG_QUEST_RESONANCE_COMPLETE
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResonanceComplete3, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResonancePostCheck::
	goto_if_set FLAG_RESONANCE_RESIDUE_MOSSDEEP, MossdeepCity_SpaceCenter_2F_EventScript_ResonancePostComplete
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResidueDiscovery1, MSGBOX_DEFAULT
	fadescreen FADE_TO_WHITE
	delay 4
	fadescreen FADE_FROM_WHITE
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResidueDiscovery2, MSGBOX_DEFAULT
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResidueGift, MSGBOX_DEFAULT
	giveitem ITEM_RARE_CANDY
	compare VAR_RESULT, FALSE
	goto_if_eq Common_EventScript_ShowBagIsFull
	setflag FLAG_RESONANCE_RESIDUE_MOSSDEEP
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_ResonancePostComplete::
	msgbox MossdeepCity_SpaceCenter_2F_Text_ResonancePostComplete, MSGBOX_DEFAULT
	release
	end

@ --- Terminal bg_event branches ---

MossdeepCity_SpaceCenter_2F_Script_TerminalResonanceActive::
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalResonanceActive, MSGBOX_SIGN
	end

MossdeepCity_SpaceCenter_2F_Script_TerminalResonanceDone::
	goto_if_set FLAG_RESONANCE_RESIDUE_MOSSDEEP, MossdeepCity_SpaceCenter_2F_Script_TerminalResidueStable
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalResonanceDone, MSGBOX_SIGN
	end

MossdeepCity_SpaceCenter_2F_Script_TerminalResidueStable::
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalResidueStable, MSGBOX_SIGN
	end

@ --- Quest 6 text strings ---

MossdeepCity_SpaceCenter_2F_Text_ResonanceOffer:
	.string "CHAMPION! Thank goodness\n"
	.string "you're here.\p"
	.string "After your encounter, the\n"
	.string "terminal stopped. We thought\l"
	.string "it was over.\p"
	.string "But now it's doing something\n"
	.string "new. It isn't receiving a\l"
	.string "signal -- it's SENDING one.\p"
	.string "We can't shut it off. The\n"
	.string "broadcast points at two sites\l"
	.string "inside HOENN.\p"
	.string "METEOR FALLS, deep underground.\n"
	.string "And ROUTE 131 -- where you\l"
	.string "found the shimmer.\p"
	.string "Please investigate both sites.\n"
	.string "I fear this isn't over.$"

MossdeepCity_SpaceCenter_2F_Text_ResonanceProgress:
	.string "Have you checked both sites?\p"
	.string "METEOR FALLS and ROUTE 131.\n"
	.string "The signal won't stop until\l"
	.string "we understand what it wants.$"

MossdeepCity_SpaceCenter_2F_Text_ResonanceComplete1:
	.string "You investigated both sites?\n"
	.string "Tell me everything.\p"
	.string "Glowing meteorites in\n"
	.string "METEOR FALLS. Luminescence\l"
	.string "beneath ROUTE 131.\p"
	.string "...It's as I feared.\p"
	.string "The two sites are resonating\n"
	.string "with each other. Your encounter\l"
	.string "didn't just bring a visitor.$"

MossdeepCity_SpaceCenter_2F_Text_ResonanceComplete2:
	.string "It opened a connection.\n"
	.string "A bridge between HOENN and\l"
	.string "whatever is out there.\p"
	.string "I shut the terminal down.\n"
	.string "But the resonance continues\l"
	.string "without it.\p"
	.string "CHAMPION, I've studied signals\n"
	.string "my whole career.\p"
	.string "This isn't a message.\n"
	.string "It's a handshake.\p"
	.string "Something out there knows\n"
	.string "we answered.$"

MossdeepCity_SpaceCenter_2F_Text_ResonanceComplete3:
	.string "Take these. We found them\n"
	.string "embedded in the terminal casing\l"
	.string "after it went silent.\p"
	.string "Whatever comes next...\n"
	.string "HOENN will need its CHAMPION.$"

MossdeepCity_SpaceCenter_2F_Text_ResonancePostComplete:
	.string "The terminal is quiet now.\n"
	.string "But METEOR FALLS and ROUTE 131\l"
	.string "still resonate.\p"
	.string "Whatever connection opened,\n"
	.string "it hasn't closed.\l"
	.string "It's just... waiting.$"

MossdeepCity_SpaceCenter_2F_Text_TerminalResonanceActive:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "SIGNAL MONITOR v3.1\p"
	.string "MODE: BROADCAST\n"
	.string "TARGET 1: METEOR FALLS\l"
	.string "TARGET 2: ROUTE 131\p"
	.string "STATUS: TRANSMITTING\n"
	.string "CANNOT OVERRIDE.$"

MossdeepCity_SpaceCenter_2F_Text_TerminalResonanceDone:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "SIGNAL MONITOR v3.1\p"
	.string "MODE: IDLE\n"
	.string "BROADCAST TERMINATED\p"
	.string "RESIDUAL RESONANCE:\n"
	.string "DETECTED AT 2 SITES\l"
	.string "STATUS: PERSISTENT$"

@ =============================================
@ Resonance Residue — Post-Quest II Environmental Follow-through (C236)
@ =============================================

MossdeepCity_SpaceCenter_2F_Text_ResidueDiscovery1:
	.string "...persistent readings at both\n"
	.string "sites. The resonance--\p"
	.string "Oh. You again. Good.\p"
	.string "The array is offline.\n"
	.string "The resonance isn't.\p"
	.string "Both sites still active.\n"
	.string "I stopped trying to explain it.$"

MossdeepCity_SpaceCenter_2F_Text_ResidueDiscovery2:
	.string "...That. Did you feel that?\p"
	.string "It happens every few hours.\n"
	.string "No instrument picks it up.\l"
	.string "But I feel it.\p"
	.string "Go see for yourself.\n"
	.string "METEOR FALLS. ROUTE 131.\l"
	.string "Something changed.$"

MossdeepCity_SpaceCenter_2F_Text_ResidueGift:
	.string "The residual wavelengths concentrated\n"
	.string "near our equipment overnight.\p"
	.string "This crystallized from the readings.\n"
	.string "I can't explain it. Please, take it.$"

MossdeepCity_SpaceCenter_2F_Text_TerminalResidueStable:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "SIGNAL MONITOR v3.1\p"
	.string "ARRAY STATUS: OFFLINE\n"
	.string "MANUAL SHUTDOWN LOGGED\p"
	.string "RESIDUAL RESONANCE:\n"
	.string "STABLE AT 2 SITES\p"
	.string "NOTE: Signal persists without\n"
	.string "instrumentation.$"

@ =============================================
@ Quest 7: The Answer (C242)
@ Post-Resonance convergence -- requires Residue seen
@ =============================================

@ --- Scientist NPC branches ---

MossdeepCity_SpaceCenter_2F_EventScript_CosmicOffer::
	msgbox MossdeepCity_SpaceCenter_2F_Text_CosmicOffer, MSGBOX_DEFAULT
	setflag FLAG_QUEST_COSMIC_STARTED
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_CosmicReminder::
	msgbox MossdeepCity_SpaceCenter_2F_Text_CosmicReminder, MSGBOX_DEFAULT
	release
	end

MossdeepCity_SpaceCenter_2F_EventScript_CosmicDone::
	msgbox MossdeepCity_SpaceCenter_2F_Text_CosmicDone, MSGBOX_DEFAULT
	release
	end

@ --- Terminal bg_event branches ---

MossdeepCity_SpaceCenter_2F_Script_TerminalCosmicPending::
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalCosmicPending, MSGBOX_SIGN
	end

MossdeepCity_SpaceCenter_2F_Script_TerminalCosmicActive::
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalCosmicActive, MSGBOX_SIGN
	end

MossdeepCity_SpaceCenter_2F_Script_TerminalCosmicDone::
	msgbox MossdeepCity_SpaceCenter_2F_Text_TerminalCosmicDone, MSGBOX_SIGN
	end

@ --- Quest 7 text strings ---

MossdeepCity_SpaceCenter_2F_Text_CosmicOffer:
	.string "...You need to hear this.\p"
	.string "The three sites stopped\n"
	.string "resonating independently.\p"
	.string "They've synchronized.\n"
	.string "Same frequency. Same rhythm.\l"
	.string "All at once.\p"
	.string "But that isn't why I need\n"
	.string "you.\p"
	.string "The signal isn't broadcasting\n"
	.string "anymore. It's narrowing.\l"
	.string "Focusing on a single point.\p"
	.string "I need you to understand--\n"
	.string "the signal isn't calling to\l"
	.string "us anymore.\p"
	.string "It's calling to you.\p"
	.string "The convergence point is\n"
	.string "the summit of SKY PILLAR.\p"
	.string "Whatever answered your\n"
	.string "handshake... it's waiting\l"
	.string "there.\p"
	.string "For you.$"

MossdeepCity_SpaceCenter_2F_Text_CosmicReminder:
	.string "SKY PILLAR. The summit.\p"
	.string "The signal is still focused\n"
	.string "there. Still waiting.\p"
	.string "Please. Go.$"

MossdeepCity_SpaceCenter_2F_Text_CosmicDone:
	.string "The array has been quiet since\n"
	.string "you returned from the summit.\p"
	.string "No more resonance. No more\n"
	.string "signals. Just quiet.\p"
	.string "Whatever crossed over...\n"
	.string "it chose HOENN. It chose you.\p"
	.string "I think the story is over.\n"
	.string "Ours and theirs.$"

MossdeepCity_SpaceCenter_2F_Text_TerminalCosmicPending:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "SIGNAL MONITOR v3.1\p"
	.string "MODE: CONVERGENCE\n"
	.string "TARGET: SKY PILLAR SUMMIT\p"
	.string "SIGNAL NARROWING\n"
	.string "FOCUS: SINGLE POINT\l"
	.string "STATUS: LOCKED$"

MossdeepCity_SpaceCenter_2F_Text_TerminalCosmicActive:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "SIGNAL MONITOR v3.1\p"
	.string "MODE: CONVERGENCE\n"
	.string "TARGET: SKY PILLAR SUMMIT\p"
	.string "AWAITING FIELD REPORT\n"
	.string "STATUS: TRANSMITTING$"

MossdeepCity_SpaceCenter_2F_Text_TerminalCosmicDone:
	.string "MOSSDEEP DEEP-SPACE ARRAY\n"
	.string "SIGNAL MONITOR v3.1\p"
	.string "ALL SIGNALS: TERMINATED\n"
	.string "ARRAY STATUS: NOMINAL\p"
	.string "FINAL LOG: Contact confirmed.\n"
	.string "File closed.$"
