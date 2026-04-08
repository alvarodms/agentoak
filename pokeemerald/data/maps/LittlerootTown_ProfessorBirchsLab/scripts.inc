LittlerootTown_ProfessorBirchsLab_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, LittlerootTown_ProfessorBirchsLab_OnTransition
	map_script MAP_SCRIPT_ON_WARP_INTO_MAP_TABLE, LittlerootTown_ProfessorBirchsLab_OnWarp
	map_script MAP_SCRIPT_ON_FRAME_TABLE, LittlerootTown_ProfessorBirchsLab_OnFrame
	.byte 0

	@ State descriptions for VAR_DEX_UPGRADE_JOHTO_STARTER_STATE
	@ 1: Beat Elite Four, Dex upgrade ready
	@ 2: Received National Dex
	@ 3: Left lab after receiving National Dex
	@ 4: Entered lab after catching all Hoenn mons
	@ 5: Birch told player to choose Johto starter
	@ 6: Chose Johto starter

	@ State descriptions for VAR_BIRCH_LAB_STATE
	@ 1: Never occurs
	@ 2: Chose starter
	@ 3: Received starter in lab
	@ 4: Defeated rival on Route 103
	@ 5: Received pokedex

LittlerootTown_ProfessorBirchsLab_OnTransition:
	call Common_EventScript_SetupRivalGfxId
	call ProfBirch_EventScript_UpdateLocation
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6, LittlerootTown_ProfessorBirchsLab_EventScript_SetAfterJohtoStarterLayout
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 4, LittlerootTown_ProfessorBirchsLab_EventScript_SetJohtoStarterLayout
	goto_if_eq VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 3, LittlerootTown_ProfessorBirchsLab_EventScript_CheckReadyForJohtoStarter
	end

LittlerootTown_ProfessorBirchsLab_EventScript_CheckReadyForJohtoStarter::
	specialvar VAR_RESULT, HasAllHoennMons
	goto_if_eq VAR_RESULT, TRUE, LittlerootTown_ProfessorBirchsLab_EventScript_SetReadyForJohtoStarter
	setobjectmovementtype LOCALID_BIRCHS_LAB_RIVAL, MOVEMENT_TYPE_WANDER_UP_AND_DOWN
	setobjectxyperm LOCALID_BIRCHS_LAB_RIVAL, 5, 10
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SetReadyForJohtoStarter::
	setvar VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 4
	goto LittlerootTown_ProfessorBirchsLab_EventScript_SetJohtoStarterLayout

LittlerootTown_ProfessorBirchsLab_EventScript_SetJohtoStarterLayout::
	setmaplayoutindex LAYOUT_LITTLEROOT_TOWN_PROFESSOR_BIRCHS_LAB_WITH_TABLE
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SetAfterJohtoStarterLayout::
	setmaplayoutindex LAYOUT_LITTLEROOT_TOWN_PROFESSOR_BIRCHS_LAB_WITH_TABLE
	setobjectmovementtype LOCALID_BIRCHS_LAB_RIVAL, MOVEMENT_TYPE_WANDER_UP_AND_DOWN
	setobjectxyperm LOCALID_BIRCHS_LAB_RIVAL, 5, 10
	end

LittlerootTown_ProfessorBirchsLab_OnWarp:
	map_script_2 VAR_BIRCH_LAB_STATE, 2, LittlerootTown_ProfessorBirchsLab_EventScript_SetPlayerPosForReceiveStarter
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 1, LittlerootTown_ProfessorBirchsLab_EventScript_SetObjectPosForDexUpgrade
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 2, LittlerootTown_ProfessorBirchsLab_EventScript_SetObjectPosForDexUpgrade
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 3, LittlerootTown_ProfessorBirchsLab_EventScript_AddRivalObject
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6, LittlerootTown_ProfessorBirchsLab_EventScript_AddRivalObject
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 4, LittlerootTown_ProfessorBirchsLab_EventScript_SetObjectPosForJohtoStarters
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 5, LittlerootTown_ProfessorBirchsLab_EventScript_SetObjectPosForJohtoStarters
	.2byte 0

LittlerootTown_ProfessorBirchsLab_EventScript_SetPlayerPosForReceiveStarter::
	turnobject LOCALID_PLAYER, DIR_NORTH
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SetObjectPosForDexUpgrade::
	turnobject LOCALID_PLAYER, DIR_NORTH
	addobject LOCALID_BIRCHS_LAB_BIRCH
	addobject LOCALID_BIRCHS_LAB_RIVAL
	turnobject LOCALID_BIRCHS_LAB_RIVAL, DIR_NORTH
	setobjectxy LOCALID_BIRCHS_LAB_RIVAL, 5, 5
	turnobject LOCALID_BIRCHS_LAB_BIRCH, DIR_SOUTH
	setobjectxy LOCALID_BIRCHS_LAB_BIRCH, 6, 4
	turnobject LOCALID_BIRCHS_LAB_AIDE, DIR_EAST
	setobjectxy LOCALID_BIRCHS_LAB_AIDE, 10, 10
	end

LittlerootTown_ProfessorBirchsLab_EventScript_AddRivalObject::
	addobject LOCALID_BIRCHS_LAB_RIVAL
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SetObjectPosForJohtoStarters::
	addobject LOCALID_BIRCHS_LAB_CYNDAQUIL_BALL
	addobject LOCALID_BIRCHS_LAB_TOTODILE_BALL
	addobject LOCALID_BIRCHS_LAB_CHIKORITA_BALL
	addobject LOCALID_BIRCHS_LAB_RIVAL
	turnobject LOCALID_BIRCHS_LAB_CYNDAQUIL_BALL, DIR_SOUTH
	setobjectxy LOCALID_BIRCHS_LAB_CYNDAQUIL_BALL, 8, 4
	turnobject LOCALID_BIRCHS_LAB_TOTODILE_BALL, DIR_SOUTH
	setobjectxy LOCALID_BIRCHS_LAB_TOTODILE_BALL, 9, 4
	turnobject LOCALID_BIRCHS_LAB_CHIKORITA_BALL, DIR_SOUTH
	setobjectxy LOCALID_BIRCHS_LAB_CHIKORITA_BALL, 10, 4
	turnobject LOCALID_BIRCHS_LAB_BIRCH, DIR_SOUTH
	setobjectxy LOCALID_BIRCHS_LAB_BIRCH, 6, 4
	turnobject LOCALID_BIRCHS_LAB_RIVAL, DIR_EAST
	setobjectxy LOCALID_BIRCHS_LAB_RIVAL, 5, 5
	end

LittlerootTown_ProfessorBirchsLab_OnFrame:
	map_script_2 VAR_BIRCH_LAB_STATE, 2, LittlerootTown_ProfessorBirchsLab_EventScript_GiveStarterEvent
	map_script_2 VAR_BIRCH_LAB_STATE, 4, LittlerootTown_ProfessorBirchsLab_EventScript_GivePokedexEvent
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 1, LittlerootTown_ProfessorBirchsLab_EventScript_UpgradeToNationalDex
	map_script_2 VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 4, LittlerootTown_ProfessorBirchsLab_EventScript_ChooseJohtoStarter
	.2byte 0

@ The starter is technically given prior to this on Route 101 by special ChooseStarter
@ This is just where the game tells you its yours and lets you nickname it
LittlerootTown_ProfessorBirchsLab_EventScript_GiveStarterEvent::
	lockall
	bufferleadmonspeciesname STR_VAR_1
	message LittlerootTown_ProfessorBirchsLab_Text_LikeYouToHavePokemon
	waitmessage
	playfanfare MUS_OBTAIN_ITEM
	waitfanfare
	msgbox LittlerootTown_ProfessorBirchsLab_Text_WhyNotGiveNicknameToMon, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, YES, LittlerootTown_ProfessorBirchsLab_EventScript_NicknameStarter
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_GoSeeRival
	end

LittlerootTown_ProfessorBirchsLab_EventScript_NicknameStarter::
	setvar VAR_0x8004, 0
	call Common_EventScript_NameReceivedPartyMon
	goto LittlerootTown_ProfessorBirchsLab_EventScript_GoSeeRival
	end

LittlerootTown_ProfessorBirchsLab_EventScript_GoSeeRival::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MightBeGoodIdeaToGoSeeRival, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, YES, LittlerootTown_ProfessorBirchsLab_EventScript_AgreeToSeeRival
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_DeclineSeeingRival
	end

LittlerootTown_ProfessorBirchsLab_EventScript_AgreeToSeeRival::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_GetRivalToTeachYou, MSGBOX_DEFAULT
	clearflag FLAG_HIDE_ROUTE_101_BOY
	setvar VAR_BIRCH_LAB_STATE, 3
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_DeclineSeeingRival::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_DontBeThatWay, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, YES, LittlerootTown_ProfessorBirchsLab_EventScript_AgreeToSeeRival
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_DeclineSeeingRival
	end

LittlerootTown_ProfessorBirchsLab_EventScript_GivePokedexEvent::
	lockall
	applymovement LOCALID_PLAYER, LittlerootTown_ProfessorBirchsLab_Movement_PlayerEnterLabForPokedex
	waitmovement 0
	goto LittlerootTown_ProfessorBirchsLab_EventScript_GivePokedex
	end

LittlerootTown_ProfessorBirchsLab_Movement_PlayerEnterLabForPokedex:
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	step_end

LittlerootTown_ProfessorBirchsLab_EventScript_UpgradeToNationalDex::
	lockall
	delay 30
	msgbox LittlerootTown_ProfessorBirchsLab_Text_OtherRegionsUpgradeToNational, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_BIRCHS_LAB_BIRCH, LittlerootTown_ProfessorBirchsLab_Movement_BirchRetrievePokedexes
	waitmovement 0
	delay 20
	playse SE_CLICK
	delay 10
	playse SE_CLICK
	delay 10
	playse SE_CLICK
	delay 10
	playse SE_CLICK
	delay 20
	applymovement LOCALID_BIRCHS_LAB_RIVAL, Common_Movement_WalkInPlaceFasterRight
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	checkplayergender
	call_if_eq VAR_RESULT, MALE, LittlerootTown_ProfessorBirchsLab_EventScript_MayUpgradeComment
	call_if_eq VAR_RESULT, FEMALE, LittlerootTown_ProfessorBirchsLab_EventScript_BrendanUpgradeComment
	playse SE_PC_ON
	waitse
	delay 20
	applymovement LOCALID_BIRCHS_LAB_BIRCH, LittlerootTown_ProfessorBirchsLab_Movement_BirchReturnPokedex
	waitmovement 0
	applymovement LOCALID_BIRCHS_LAB_RIVAL, Common_Movement_WalkInPlaceFasterUp
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	msgbox LittlerootTown_ProfessorBirchsLab_Text_OkayAllDone, MSGBOX_DEFAULT
	playfanfare MUS_OBTAIN_ITEM
	message LittlerootTown_ProfessorBirchsLab_Text_PokedexUpgradedToNational
	waitmessage
	waitfanfare
	setflag FLAG_SYS_NATIONAL_DEX
	special EnableNationalPokedex
	msgbox LittlerootTown_ProfessorBirchsLab_Text_GrassyPatchWaiting2, MSGBOX_DEFAULT
	closemessage
	setflag FLAG_HIDE_LITTLEROOT_TOWN_BIRCH
	setflag FLAG_HIDE_LITTLEROOT_TOWN_RIVAL
	setvar VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 2
	setvar VAR_SCOTT_BF_CALL_STEP_COUNTER, 0
	setflag FLAG_SCOTT_CALL_BATTLE_FRONTIER
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_MayUpgradeComment::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MayUpgradeSoCool, MSGBOX_DEFAULT
	closemessage
	return

LittlerootTown_ProfessorBirchsLab_EventScript_BrendanUpgradeComment::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BrendanYouCanThankMe, MSGBOX_DEFAULT
	closemessage
	return

LittlerootTown_ProfessorBirchsLab_Movement_BirchRetrievePokedexes:
	walk_left
	walk_in_place_faster_down
	delay_16
	delay_16
	walk_right
	walk_in_place_faster_down
	delay_16
	delay_16
	walk_right
	walk_down
	walk_down
	walk_down
	walk_down
	walk_right
	walk_right
	walk_right
	walk_in_place_faster_up
	step_end

LittlerootTown_ProfessorBirchsLab_Movement_BirchReturnPokedex:
	walk_left
	walk_left
	walk_left
	walk_up
	walk_up
	walk_up
	walk_up
	walk_left
	walk_in_place_faster_down
	step_end

LittlerootTown_ProfessorBirchsLab_EventScript_ChooseJohtoStarter::
	lockall
	applymovement LOCALID_PLAYER, LittlerootTown_ProfessorBirchsLab_Movement_PlayerEnterLabForJohtoStarter
	waitmovement 0
	msgbox LittlerootTown_ProfessorBirchsLab_Text_CompletedDexChoosePokemon, MSGBOX_DEFAULT
	setvar VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 5
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_Movement_PlayerEnterLabForJohtoStarter:
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	step_end

LittlerootTown_ProfessorBirchsLab_EventScript_Aide::
	lock
	faceplayer
	goto_if_ge VAR_BIRCH_LAB_STATE, 3, LittlerootTown_ProfessorBirchsLab_EventScript_AideReceivedStarter
	goto_if_set FLAG_BIRCH_AIDE_MET, LittlerootTown_ProfessorBirchsLab_EventScript_AideAlreadyMet
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchAwayOnFieldwork, MSGBOX_DEFAULT
	setflag FLAG_BIRCH_AIDE_MET
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_AideAlreadyMet::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchIsntOneForDeskWork, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_AideReceivedStarter::
	goto_if_set FLAG_SYS_GAME_CLEAR, LittlerootTown_ProfessorBirchsLab_EventScript_AidePostgame
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchEnjoysRivalsHelpToo, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_AidePostgame::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_AidePostgame, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_Cyndaquil::
	release
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6, LittlerootTown_ProfessorBirchsLab_EventScript_AlreadyChoseJohtoStarter
	applymovement LOCALID_BIRCHS_LAB_BIRCH, Common_Movement_WalkInPlaceFasterRight
	waitmovement 0
	showmonpic SPECIES_CYNDAQUIL, 10, 3
	msgbox LittlerootTown_ProfessorBirchsLab_Text_YoullTakeCyndaquil, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_TakeYourTime
	goto LittlerootTown_ProfessorBirchsLab_EventScript_GiveCyndaquil
	end

LittlerootTown_ProfessorBirchsLab_EventScript_Totodile::
	release
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6, LittlerootTown_ProfessorBirchsLab_EventScript_AlreadyChoseJohtoStarter
	applymovement LOCALID_BIRCHS_LAB_BIRCH, Common_Movement_WalkInPlaceFasterRight
	waitmovement 0
	showmonpic SPECIES_TOTODILE, 10, 3
	msgbox LittlerootTown_ProfessorBirchsLab_Text_YoullTakeTotodile, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_TakeYourTime
	goto LittlerootTown_ProfessorBirchsLab_EventScript_GiveTotodile
	end

LittlerootTown_ProfessorBirchsLab_EventScript_Chikorita::
	release
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6, LittlerootTown_ProfessorBirchsLab_EventScript_AlreadyChoseJohtoStarter
	applymovement LOCALID_BIRCHS_LAB_BIRCH, Common_Movement_WalkInPlaceFasterRight
	waitmovement 0
	showmonpic SPECIES_CHIKORITA, 10, 3
	msgbox LittlerootTown_ProfessorBirchsLab_Text_YoullTakeChikorita, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_TakeYourTime
	goto LittlerootTown_ProfessorBirchsLab_EventScript_GiveChikorita
	end

LittlerootTown_ProfessorBirchsLab_EventScript_AlreadyChoseJohtoStarter::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BetterLeaveOthersAlone, MSGBOX_DEFAULT
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_TakeYourTime::
	hidemonpic
	msgbox LittlerootTown_ProfessorBirchsLab_Text_TakeYourTimeAllInvaluable, MSGBOX_DEFAULT
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_GiveCyndaquil::
	bufferspeciesname STR_VAR_1, SPECIES_CYNDAQUIL
	setvar VAR_TEMP_TRANSFERRED_SPECIES, SPECIES_CYNDAQUIL
	givemon SPECIES_CYNDAQUIL, 5
	goto_if_eq VAR_RESULT, MON_GIVEN_TO_PARTY, LittlerootTown_ProfessorBirchsLab_EventScript_SendCyndaquilToParty
	goto_if_eq VAR_RESULT, MON_GIVEN_TO_PC, LittlerootTown_ProfessorBirchsLab_EventScript_SendCyndaquilToPC
	hidemonpic
	goto Common_EventScript_NoMoreRoomForPokemon
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SendCyndaquilToParty::
	call LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedJohtoStarter
	removeobject LOCALID_BIRCHS_LAB_CYNDAQUIL_BALL
	msgbox gText_NicknameThisPokemon, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedCyndaquil
	call Common_EventScript_GetGiftMonPartySlot
	call Common_EventScript_NameReceivedPartyMon
	goto LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedCyndaquil
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SendCyndaquilToPC::
	call LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedJohtoStarter
	removeobject LOCALID_BIRCHS_LAB_CYNDAQUIL_BALL
	msgbox gText_NicknameThisPokemon, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_CyndaquilTransferredToPC
	call Common_EventScript_NameReceivedBoxMon
	goto LittlerootTown_ProfessorBirchsLab_EventScript_CyndaquilTransferredToPC
	end

LittlerootTown_ProfessorBirchsLab_EventScript_CyndaquilTransferredToPC::
	call Common_EventScript_TransferredToPC
	goto LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedCyndaquil
	end

LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedCyndaquil::
	hidemonpic
	msgbox LittlerootTown_ProfessorBirchsLab_Text_GrassyPatchWaiting, MSGBOX_DEFAULT
	setvar VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_GiveTotodile::
	bufferspeciesname STR_VAR_1, SPECIES_TOTODILE
	setvar VAR_TEMP_TRANSFERRED_SPECIES, SPECIES_TOTODILE
	givemon SPECIES_TOTODILE, 5
	goto_if_eq VAR_RESULT, MON_GIVEN_TO_PARTY, LittlerootTown_ProfessorBirchsLab_EventScript_SendTotodileToParty
	goto_if_eq VAR_RESULT, MON_GIVEN_TO_PC, LittlerootTown_ProfessorBirchsLab_EventScript_SendTotodileToPC
	hidemonpic
	goto Common_EventScript_NoMoreRoomForPokemon
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SendTotodileToParty::
	call LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedJohtoStarter
	removeobject LOCALID_BIRCHS_LAB_TOTODILE_BALL
	msgbox gText_NicknameThisPokemon, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedTotodile
	call Common_EventScript_GetGiftMonPartySlot
	call Common_EventScript_NameReceivedPartyMon
	goto LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedTotodile
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SendTotodileToPC::
	call LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedJohtoStarter
	removeobject LOCALID_BIRCHS_LAB_TOTODILE_BALL
	msgbox gText_NicknameThisPokemon, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_TotodileTransferredToPC
	call Common_EventScript_NameReceivedBoxMon
	goto LittlerootTown_ProfessorBirchsLab_EventScript_TotodileTransferredToPC
	end

LittlerootTown_ProfessorBirchsLab_EventScript_TotodileTransferredToPC::
	call Common_EventScript_TransferredToPC
	goto LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedTotodile
	end

LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedTotodile::
	hidemonpic
	msgbox LittlerootTown_ProfessorBirchsLab_Text_GrassyPatchWaiting, MSGBOX_DEFAULT
	setvar VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_GiveChikorita::
	bufferspeciesname STR_VAR_1, SPECIES_CHIKORITA
	setvar VAR_TEMP_TRANSFERRED_SPECIES, SPECIES_CHIKORITA
	givemon SPECIES_CHIKORITA, 5
	goto_if_eq VAR_RESULT, MON_GIVEN_TO_PARTY, LittlerootTown_ProfessorBirchsLab_EventScript_SendChikoritaToParty
	goto_if_eq VAR_RESULT, MON_GIVEN_TO_PC, LittlerootTown_ProfessorBirchsLab_EventScript_SendChikoritaToPC
	hidemonpic
	goto Common_EventScript_NoMoreRoomForPokemon
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SendChikoritaToParty::
	call LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedJohtoStarter
	removeobject LOCALID_BIRCHS_LAB_CHIKORITA_BALL
	msgbox gText_NicknameThisPokemon, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedChikorita
	call Common_EventScript_GetGiftMonPartySlot
	call Common_EventScript_NameReceivedPartyMon
	goto LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedChikorita
	end

LittlerootTown_ProfessorBirchsLab_EventScript_SendChikoritaToPC::
	call LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedJohtoStarter
	removeobject LOCALID_BIRCHS_LAB_CHIKORITA_BALL
	msgbox gText_NicknameThisPokemon, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, LittlerootTown_ProfessorBirchsLab_EventScript_ChikoritaTransferredToPC
	call Common_EventScript_NameReceivedBoxMon
	goto LittlerootTown_ProfessorBirchsLab_EventScript_ChikoritaTransferredToPC
	end

LittlerootTown_ProfessorBirchsLab_EventScript_ChikoritaTransferredToPC::
	call Common_EventScript_TransferredToPC
	goto LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedChikorita
	end

LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedChikorita::
	hidemonpic
	msgbox LittlerootTown_ProfessorBirchsLab_Text_GrassyPatchWaiting, MSGBOX_DEFAULT
	setvar VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_ReceivedJohtoStarter::
	playfanfare MUS_OBTAIN_ITEM
	message LittlerootTown_ProfessorBirchsLab_Text_ReceivedJohtoStarter
	waitmessage
	waitfanfare
	return

LittlerootTown_ProfessorBirchsLab_EventScript_Birch::
	lock
	faceplayer
	goto_if_set FLAG_SYS_GAME_CLEAR, LittlerootTown_ProfessorBirchsLab_EventScript_BirchQuestCheck
	goto_if_eq VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 5, LittlerootTown_ProfessorBirchsLab_EventScript_CanHaveAnyOneOfRarePokemon
	goto_if_eq VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 2, LittlerootTown_ProfessorBirchsLab_EventScript_GrassyPatchWaiting
	goto_if_unset FLAG_HAS_MATCH_CALL, LittlerootTown_ProfessorBirchsLab_EventScript_TryRatePokedexOrRegister
	goto_if_unset FLAG_ENABLE_PROF_BIRCH_MATCH_CALL, EventScript_RegisterProfBirch
	goto LittlerootTown_ProfessorBirchsLab_EventScript_TryRatePokedexOrRegister
	end

LittlerootTown_ProfessorBirchsLab_EventScript_CanHaveAnyOneOfRarePokemon::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_CanHaveAnyOneOfRarePokemon, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_GrassyPatchWaiting::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_GrassyPatchWaiting2, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_TryRatePokedexOrRegister::
	goto_if_unset FLAG_HIDE_LITTLEROOT_TOWN_BIRCHS_LAB_UNKNOWN_0x380, ProfBirch_EventScript_RatePokedexOrRegister
	goto_if_eq VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 3, ProfBirch_EventScript_RatePokedexOrRegister
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6, ProfBirch_EventScript_RatePokedexOrRegister
	goto_if_eq VAR_BIRCH_LAB_STATE, 5, LittlerootTown_ProfessorBirchsLab_EventScript_PokemonAwait
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchRivalGoneHome, MSGBOX_DEFAULT
	release
	end

EventScript_RegisterProfBirch::
	msgbox MatchCall_Text_BirchRegisterCall, MSGBOX_DEFAULT
	closemessage
	delay 30
	playfanfare MUS_REGISTER_MATCH_CALL
	msgbox MatchCall_Text_RegisteredBirch, MSGBOX_DEFAULT
	waitfanfare
	closemessage
	delay 30
	setflag FLAG_ENABLE_PROF_BIRCH_MATCH_CALL
	setvar VAR_REGISTER_BIRCH_STATE, 2
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_GivePokedex::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_HeardYouBeatRivalTakePokedex, MSGBOX_DEFAULT
	call LittlerootTown_ProfessorBirchsLab_EventScript_ReceivePokedex
	msgbox LittlerootTown_ProfessorBirchsLab_Text_ExplainPokedex, MSGBOX_DEFAULT
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MigrationHint1, MSGBOX_DEFAULT
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MigrationHint2, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_BIRCHS_LAB_RIVAL, LittlerootTown_ProfessorBirchsLab_Movement_RivalApproachPlayer
	waitmovement 0
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterRight
	waitmovement 0
	checkplayergender
	call_if_eq VAR_RESULT, MALE, LittlerootTown_ProfessorBirchsLab_EventScript_MayGivePokeBalls
	call_if_eq VAR_RESULT, FEMALE, LittlerootTown_ProfessorBirchsLab_EventScript_BrendanGivePokeBalls
	setvar VAR_BIRCH_LAB_STATE, 5
	setflag FLAG_ADVENTURE_STARTED
	setvar VAR_OLDALE_TOWN_STATE, 1
	setvar VAR_LITTLEROOT_RIVAL_STATE, 4
	setvar VAR_LITTLEROOT_TOWN_STATE, 3
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_EventScript_MayGivePokeBalls::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MayGotPokedexTooTakeThese, MSGBOX_DEFAULT
	giveitem ITEM_POKE_BALL, 5
	call_if_eq VAR_RESULT, FALSE, LittlerootTown_ProfessorBirchsLab_EventScript_MayNoRoomForPokeBalls
	msgbox LittlerootTown_ProfessorBirchsLab_Text_CatchCutePokemonWithPokeBalls, MSGBOX_DEFAULT
	setvar VAR_RESULT, 0
	return

LittlerootTown_ProfessorBirchsLab_EventScript_BrendanGivePokeBalls::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BrendanGotPokedexTooTakeThese, MSGBOX_DEFAULT
	giveitem ITEM_POKE_BALL, 5
	call_if_eq VAR_RESULT, FALSE, LittlerootTown_ProfessorBirchsLab_EventScript_BrendanNoRoomForPokeBalls
	msgbox LittlerootTown_ProfessorBirchsLab_Text_CatchCoolPokemonWithPokeBalls, MSGBOX_DEFAULT
	setvar VAR_RESULT, 1
	return

LittlerootTown_ProfessorBirchsLab_EventScript_ReceivePokedex::
	playfanfare MUS_OBTAIN_ITEM
	message LittlerootTown_ProfessorBirchsLab_Text_ReceivedPokedex
	waitfanfare
	setflag FLAG_SYS_POKEDEX_GET
	special SetUnlockedPokedexFlags
	setflag FLAG_RECEIVED_POKEDEX_FROM_BIRCH
	setvar VAR_CABLE_CLUB_TUTORIAL_STATE, 1
	return

LittlerootTown_ProfessorBirchsLab_EventScript_PokemonAwait::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_CountlessPokemonAwait, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_MayNoRoomForPokeBalls::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_OhYourBagsFull, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_BrendanNoRoomForPokeBalls::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_HeyYourBagsFull, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_Movement_RivalApproachPlayer:
	walk_down
	walk_in_place_faster_left
	step_end

LittlerootTown_ProfessorBirchsLab_EventScript_Machine::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_SeriousLookingMachine, MSGBOX_SIGN
	end

LittlerootTown_ProfessorBirchsLab_EventScript_Rival::
	lock
	faceplayer
	goto_if_eq VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 5, LittlerootTown_ProfessorBirchsLab_EventScript_RivalFuturePlans
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 6, LittlerootTown_ProfessorBirchsLab_EventScript_RivalHaveYouGoneToBattleFrontier
	goto_if_ge VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 2, LittlerootTown_ProfessorBirchsLab_EventScript_RivalTakeBreakFromFieldwork
	checkplayergender
	call_if_eq VAR_RESULT, MALE, LittlerootTown_ProfessorBirchsLab_EventScript_MayWhereShouldIGoNext
	call_if_eq VAR_RESULT, FEMALE, LittlerootTown_ProfessorBirchsLab_EventScript_BrendanWhereShouldIGoNext
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_MayWhereShouldIGoNext::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MayWhereShouldIGoNext, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_BrendanWhereShouldIGoNext::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BrendanWhereShouldIGoNext, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_RivalFuturePlans::
	checkplayergender
	call_if_eq VAR_RESULT, MALE, LittlerootTown_ProfessorBirchsLab_EventScript_MayWhatNextImStayingHere
	call_if_eq VAR_RESULT, FEMALE, LittlerootTown_ProfessorBirchsLab_EventScript_BrendanPreferCollectingSlowly
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_MayWhatNextImStayingHere::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MayWhatNextImStayingHere, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_BrendanPreferCollectingSlowly:
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BrendanPreferCollectingSlowly, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_RivalHaveYouGoneToBattleFrontier::
	checkplayergender
	call_if_eq VAR_RESULT, MALE, LittlerootTown_ProfessorBirchsLab_EventScript_MayHaveYouGoneToBattleFrontier
	call_if_eq VAR_RESULT, FEMALE, LittlerootTown_ProfessorBirchsLab_EventScript_BrendanHaveYouGoneToBattleFrontier
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_MayHaveYouGoneToBattleFrontier::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MayHaveYouGoneToBattleFrontier, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_BrendanHaveYouGoneToBattleFrontier::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BrendanHaveYouGoneToBattleFrontier, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_RivalTakeBreakFromFieldwork::
	checkplayergender
	call_if_eq VAR_RESULT, MALE, LittlerootTown_ProfessorBirchsLab_EventScript_MayTakeBreakFromFieldwork
	call_if_eq VAR_RESULT, FEMALE, LittlerootTown_ProfessorBirchsLab_EventScript_BrendanTakeBreakFromFieldwork
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_MayTakeBreakFromFieldwork::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_MayTakeBreakFromFieldwork, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_BrendanTakeBreakFromFieldwork::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BrendanTakeBreakFromFieldwork, MSGBOX_DEFAULT
	return

LittlerootTown_ProfessorBirchsLab_EventScript_PC::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_PCUsedForResearch, MSGBOX_SIGN
	end

LittlerootTown_ProfessorBirchsLab_EventScript_Bookshelf::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_CrammedWithBooksOnPokemon, MSGBOX_SIGN
	end

LittlerootTown_ProfessorBirchsLab_EventScript_Book::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BookTooHardToRead, MSGBOX_SIGN
	end

LittlerootTown_ProfessorBirchsLab_EventScript_ScottAboardSSTidalCall::
	lockall
	pokenavcall LittlerootTown_ProfessorBirchsLab_Text_ScottAboardSSTidalCall
	waitmessage
	clearflag FLAG_SCOTT_CALL_BATTLE_FRONTIER
	releaseall
	end

LittlerootTown_ProfessorBirchsLab_Text_BirchAwayOnFieldwork:
	.string "Hunh? PROF. BIRCH?\p"
	.string "The PROF's away on fieldwork.\n"
	.string "Ergo, he isn't here.\p"
	.string "Oh, let me explain what fieldwork is.\p"
	.string "He's studying the sudden appearance of\n"
	.string "rare Pokémon across Hoenn's habitats,\l"
	.string "instead of a laboratory.\p"
	.string "The PROF isn't one for doing desk work.\n"
	.string "He's the type of person who would\l"
	.string "rather go outside and experience\l"
	.string "things than read about them here.$"

LittlerootTown_ProfessorBirchsLab_Text_BirchIsntOneForDeskWork:
	.string "The PROF isn't one for doing desk work.\n"
	.string "He's the type of person who would\l"
	.string "rather go outside and experience\l"
	.string "things than read about them here.$"

LittlerootTown_ProfessorBirchsLab_Text_BirchEnjoysRivalsHelpToo:
	.string "PROF. BIRCH is studying the habitats\n"
	.string "and distribution of POKéMON.\p"
	.string "The PROF enjoys {RIVAL}'s help, too.\n"
	.string "There's a lot of love there.$"

LittlerootTown_ProfessorBirchsLab_Text_AidePostgame:
	.string "Ah, Champion!\p"
	.string "The PROF's research has taken an\n"
	.string "extraordinary turn.\p"
	.string "The migration species are not just\n"
	.string "passing through anymore.\p"
	.string "They are establishing territories,\n"
	.string "competing with native species...\p"
	.string "Even the POKéMON LEAGUE ecosystem\n"
	.string "has shifted.\p"
	.string "The ELITE FOUR tell me their\n"
	.string "challengers have never been this\l"
	.string "strong. Or this interesting.$"

LittlerootTown_ProfessorBirchsLab_Text_LikeYouToHavePokemon:
	.string "PROF. BIRCH: So, {PLAYER}{KUN}.\p"
	.string "I've heard so much about you from\n"
	.string "your father.\p"
	.string "With rare Pokémon migrating to Hoenn,\n"
	.string "now's the perfect time to start.\p"
	.string "But the way you battled earlier,\n"
	.string "you pulled it off with aplomb!\p"
	.string "I guess you have your father's blood\n"
	.string "in your veins after all!\p"
	.string "Oh, yes. As thanks for rescuing me,\n"
	.string "I'd like you to have the POKéMON you\l"
	.string "used earlier.\p"
	.string "{PLAYER} received the {STR_VAR_1}!$"

LittlerootTown_ProfessorBirchsLab_Text_WhyNotGiveNicknameToMon:
	.string "PROF. BIRCH: While you're at it, why not\n"
	.string "give a nickname to that {STR_VAR_1}?$"

LittlerootTown_ProfessorBirchsLab_Text_MightBeGoodIdeaToGoSeeRival:
	.string "PROF. BIRCH: If you work at POKéMON\n"
	.string "and gain experience, I think you'll make\l"
	.string "an extremely good TRAINER.\p"
	.string "My kid, {RIVAL}, is also studying\n"
	.string "POKéMON while helping me out.\p"
	.string "{PLAYER}{KUN}, don't you think it might be\n"
	.string "a good idea to go see {RIVAL}?$"

LittlerootTown_ProfessorBirchsLab_Text_GetRivalToTeachYou:
	.string "PROF. BIRCH: Great!\n"
	.string "{RIVAL} should be happy, too.\p"
	.string "Get {RIVAL} to teach you what it\n"
	.string "means to be a TRAINER.$"

LittlerootTown_ProfessorBirchsLab_Text_DontBeThatWay:
	.string "PROF. BIRCH: Oh, don't be that way.\n"
	.string "You should go meet my kid.$"

LittlerootTown_ProfessorBirchsLab_Text_BirchRivalGoneHome:
	.string "PROF. BIRCH: {RIVAL}?\n"
	.string "Gone home, I think.\p"
	.string "Or maybe that kid's scrabbling around\n"
	.string "in tall grass again somewhere…\p"
	.string "If you or your POKéMON get tired,\n"
	.string "you should get some rest at home.$"

LittlerootTown_ProfessorBirchsLab_Text_HeardYouBeatRivalTakePokedex:
	.string "PROF. BIRCH: Oh, hi, {PLAYER}{KUN}!\p"
	.string "I heard you beat {RIVAL} on\n"
	.string "your first try. That's excellent!\p"
	.string "{RIVAL}'s been helping with my research\n"
	.string "for a long time.\p"
	.string "{RIVAL} has an extensive history as\n"
	.string "a TRAINER already.\p"
	.string "Here, {PLAYER}{KUN}, I ordered this for my\n"
	.string "research, but I think you should have\l"
	.string "this POKéDEX.$"

LittlerootTown_ProfessorBirchsLab_Text_ReceivedPokedex:
	.string "{PLAYER} received the POKéDEX!$"

LittlerootTown_ProfessorBirchsLab_Text_ExplainPokedex:
	.string "PROF. BIRCH: The POKéDEX is a high-tech\n"
	.string "tool that automatically makes a record\l"
	.string "of any POKéMON you meet or catch.\p"
	.string "My kid, {RIVAL}, goes everywhere\n"
	.string "with it.\p"
	.string "Whenever my kid catches a rare POKéMON\n"
	.string "and records its data in the POKéDEX,\l"
	.string "why, {RIVAL} looks for me while I'm out\l"
	.string "doing fieldwork, and shows me.$"

LittlerootTown_ProfessorBirchsLab_Text_MigrationHint1:
	.string "PROF. BIRCH: Oh, one more thing,\n"
	.string "{PLAYER}{KUN}.\l"
	.string "I spotted a RIOLU near RUSTBORO\l"
	.string "last week...$"

LittlerootTown_ProfessorBirchsLab_Text_MigrationHint2:
	.string "PROF. BIRCH: A species that shouldn't\n"
	.string "be anywhere near HOENN.\p"
	.string "POKéMON from distant regions are\n"
	.string "turning up all across HOENN.\l"
	.string "I've been a field researcher for\l"
	.string "twenty years, and I've never seen\l"
	.string "anything like it.\p"
	.string "Keep your eyes open out there,\n"
	.string "would you?$"

LittlerootTown_ProfessorBirchsLab_Text_CountlessPokemonAwait:
	.string "PROF. BIRCH: Countless POKéMON\n"
	.string "await you!\p"
	.string "Argh, I'm getting the itch to get out\n"
	.string "and do fieldwork again!$"

LittlerootTown_ProfessorBirchsLab_Text_MayGotPokedexTooTakeThese:
	.string "MAY: Oh, wow, {PLAYER}{KUN}!\n"
	.string "You got a POKéDEX, too!\p"
	.string "That's great! Just like me!\n"
	.string "I've got something for you, too!$"

LittlerootTown_ProfessorBirchsLab_Text_CatchCutePokemonWithPokeBalls:
	.string "MAY: It's fun if you can get a lot of\n"
	.string "POKéMON!\p"
	.string "I'm going to look all over the place\n"
	.string "because I want different POKéMON.\p"
	.string "If I find any cute POKéMON, I'll catch\n"
	.string "them with POKé BALLS!$"

LittlerootTown_ProfessorBirchsLab_Text_OhYourBagsFull:
	.string "Oh? Your BAG's full.$"

LittlerootTown_ProfessorBirchsLab_Text_MayWhereShouldIGoNext:
	.string "MAY: I wonder where I should go look\n"
	.string "for POKéMON next?$"

LittlerootTown_ProfessorBirchsLab_Text_BrendanGotPokedexTooTakeThese:
	.string "BRENDAN: Huh…\n"
	.string "So you got a POKéDEX, too.\p"
	.string "Well then, here.\n"
	.string "I'll give you these.$"

LittlerootTown_ProfessorBirchsLab_Text_CatchCoolPokemonWithPokeBalls:
	.string "BRENDAN: You know it's more fun to\n"
	.string "have a whole bunch of POKéMON.\p"
	.string "I'm going to explore all over the place\n"
	.string "to find different POKéMON.\p"
	.string "If I find any cool POKéMON, you bet\n"
	.string "I'll try to get them with POKé BALLS.$"

LittlerootTown_ProfessorBirchsLab_Text_HeyYourBagsFull:
	.string "Hey, your BAG's full.$"

LittlerootTown_ProfessorBirchsLab_Text_BrendanWhereShouldIGoNext:
	.string "BRENDAN: Where should I look for\n"
	.string "POKéMON next…$"

LittlerootTown_ProfessorBirchsLab_Text_SeriousLookingMachine:
	.string "It's a serious-looking machine.\n"
	.string "The PROF must use this for research.$"

LittlerootTown_ProfessorBirchsLab_Text_PCUsedForResearch:
	.string "It's a PC used for research.\n"
	.string "Better not mess around with it.$"

LittlerootTown_ProfessorBirchsLab_Text_CrammedWithBooksOnPokemon:
	.string "It's crammed with books on POKéMON.$"

LittlerootTown_ProfessorBirchsLab_Text_BookTooHardToRead:
	.string "It's a book that's too hard to read.$"

LittlerootTown_ProfessorBirchsLab_Text_OtherRegionsUpgradeToNational:
	.string "PROF. BIRCH: Now…\p"
	.string "{PLAYER}{KUN} and {RIVAL}, I've had the two\n"
	.string "of you help me study POKéMON.\p"
	.string "Thanks to your help, new facts\n"
	.string "are coming to light.\p"
	.string "It appears that in the HOENN region,\n"
	.string "there are also POKéMON from other\l"
	.string "regions.\p"
	.string "It goes to show how rich and varied\n"
	.string "the natural environments of HOENN\l"
	.string "happen to be.\p"
	.string "That's why I think it's necessary for\n"
	.string "me to upgrade your POKéDEX to\l"
	.string "the NATIONAL Mode.\p"
	.string "Here, let me see your POKéDEX units.$"

LittlerootTown_ProfessorBirchsLab_Text_MayUpgradeSoCool:
	.string "MAY: Eheheh!\p"
	.string "It's so cool that even my POKéDEX\n"
	.string "is getting updated!\p"
	.string "It's because you went out and caught\n"
	.string "so many POKéMON, {PLAYER}{KUN}!$"

LittlerootTown_ProfessorBirchsLab_Text_BrendanYouCanThankMe:
	.string "BRENDAN: I went out all over HOENN\n"
	.string "and checked out POKéMON.\p"
	.string "You can thank me for getting\n"
	.string "the NATIONAL Mode POKéDEX.\p"
	.string "Yep, you're lucky, {PLAYER}!$"

LittlerootTown_ProfessorBirchsLab_Text_OkayAllDone:
	.string "PROF. BIRCH: Okay, all done!$"

LittlerootTown_ProfessorBirchsLab_Text_PokedexUpgradedToNational:
	.string "{PLAYER}'s POKéDEX was upgraded\n"
	.string "to the NATIONAL Mode!$"

LittlerootTown_ProfessorBirchsLab_Text_GrassyPatchWaiting2:
	.string "PROF. BIRCH: But listen.\n"
	.string "You've become the CHAMPION,\l"
	.string "but your POKéMON journey isn't over.\p"
	.string "There is no end to the road\n"
	.string "that is POKéMON.\p"
	.string "Somewhere, there is a grassy patch\n"
	.string "that's waiting for you!$"

LittlerootTown_ProfessorBirchsLab_Text_MayTakeBreakFromFieldwork:
	.string "MAY: I think I'll take a short break\n"
	.string "from fieldwork.\p"
	.string "I think I'll help the PROF here for\n"
	.string "a while.$"

LittlerootTown_ProfessorBirchsLab_Text_BrendanTakeBreakFromFieldwork:
	.string "BRENDAN: For the time being,\n"
	.string "I'm taking a break from fieldwork.\p"
	.string "I'll be helping out the PROF here\n"
	.string "for a while.$"

LittlerootTown_ProfessorBirchsLab_Text_CompletedDexChoosePokemon:
	.string "PROF. BIRCH: Oh, {PLAYER}{KUN}!\n"
	.string "Let's have a look at your POKéDEX.\p"
	.string "… … … … … …\n"
	.string "… … … … … …\p"
	.string "Yes, there's no doubt about it.\p"
	.string "You really have completed the HOENN\n"
	.string "region's POKéDEX.\p"
	.string "That's more than just impressive.\p"
	.string "I have a gift for you.\p"
	.string "Consider it my show of appreciation\n"
	.string "for the fantastic work you've done.\p"
	.string "My gift is a rare POKéMON only found\n"
	.string "in another region!\p"
	.string "You can have any one of these\n"
	.string "three POKéMON!$"

LittlerootTown_ProfessorBirchsLab_Text_CanHaveAnyOneOfRarePokemon:
	.string "PROF. BIRCH: These are rare POKéMON\n"
	.string "only found in another region!\p"
	.string "You can have any one of these\n"
	.string "three POKéMON!$"

LittlerootTown_ProfessorBirchsLab_Text_YoullTakeCyndaquil:
	.string "PROF. BIRCH: The FIRE POKéMON\n"
	.string "CYNDAQUIL caught your eye!\p"
	.string "You're as sharp as ever!\p"
	.string "So the CYNDAQUIL is your choice?$"

LittlerootTown_ProfessorBirchsLab_Text_YoullTakeTotodile:
	.string "PROF. BIRCH: The WATER POKéMON\n"
	.string "TOTODILE is your choice!\p"
	.string "You know how to pick a good one.\p"
	.string "So, you'll take the TOTODILE?$"

LittlerootTown_ProfessorBirchsLab_Text_YoullTakeChikorita:
	.string "PROF. BIRCH: The GRASS POKéMON\n"
	.string "CHIKORITA is your choice!\p"
	.string "You sure know what you're doing.\p"
	.string "So, you'll take the CHIKORITA?$"

LittlerootTown_ProfessorBirchsLab_Text_TakeYourTimeAllInvaluable:
	.string "PROF. BIRCH: Take your time before\n"
	.string "you decide.\p"
	.string "They're all invaluable POKéMON.$"

@ Unused
LittlerootTown_ProfessorBirchsLab_Text_PickedFinePokemon:
	.string "PROF. BIRCH: I see!\n"
	.string "You picked a fine POKéMON!$"

LittlerootTown_ProfessorBirchsLab_Text_ReceivedJohtoStarter:
	.string "{PLAYER} received the {STR_VAR_1}\n"
	.string "from PROF. BIRCH!$"

@ Unused
LittlerootTown_ProfessorBirchsLab_Text_NicknameJohtoStarter:
	.string "Want to give a nickname to\n"
	.string "the {STR_VAR_1} you received?$"

LittlerootTown_ProfessorBirchsLab_Text_GrassyPatchWaiting:
	.string "PROF. BIRCH: Listen, {PLAYER}{KUN}.\n"
	.string "You've completed the HOENN POKéDEX,\l"
	.string "but your POKéMON journey isn't over.\p"
	.string "There is no end to the road\n"
	.string "that is POKéMON.\p"
	.string "Somewhere, there is a grassy patch\n"
	.string "that's waiting for you!$"

LittlerootTown_ProfessorBirchsLab_Text_BetterLeaveOthersAlone:
	.string "You received the promised POKéMON.\n"
	.string "Better leave the others alone.$"

@ Unused
LittlerootTown_ProfessorBirchsLab_Text_DontHaveAnyRoomForPokemon:
	.string "Oh, you don't have any room for\n"
	.string "this POKéMON.$"

LittlerootTown_ProfessorBirchsLab_Text_MayWhatNextImStayingHere:
	.string "MAY: {PLAYER}{KUN}, after this…\n"
	.string "What are you going to do?\p"
	.string "Are you going to keep battling\n"
	.string "and sharpening your skills?\p"
	.string "Or are you going to try filling\n"
	.string "the NATIONAL POKéDEX?\p"
	.string "I'm staying here to help the PROF.$"

LittlerootTown_ProfessorBirchsLab_Text_BrendanPreferCollectingSlowly:
	.string "BRENDAN: Rather than collecting\n"
	.string "POKéMON, I prefer slowly and \l"
	.string "steadily raising the one I chose.$"

LittlerootTown_ProfessorBirchsLab_Text_MayHaveYouGoneToBattleFrontier:
	.string "MAY: Oh, hi, {PLAYER}{KUN}!\n"
	.string "Have you gone to that place,\l"
	.string "the BATTLE FRONTIER?$"

LittlerootTown_ProfessorBirchsLab_Text_BrendanHaveYouGoneToBattleFrontier:
	.string "BRENDAN: Hey, {PLAYER}!\n"
	.string "Have you gone out to that place,\l"
	.string "the BATTLE FRONTIER?$"

LittlerootTown_ProfessorBirchsLab_Text_ScottAboardSSTidalCall:
	.string "… … … … … …\n"
	.string "… … … … … Beep!\p"
	.string "SCOTT: Hi, hi, {PLAYER}!\n"
	.string "It's me, SCOTT.\p"
	.string "I'm aboard the S.S. TIDAL now.\n"
	.string "It feels great to be on the sea!\p"
	.string "By the way…\p"
	.string "There's this place that I'd like to\n"
	.string "invite you to for a visit.\p"
	.string "If you're interested, board a ferry\n"
	.string "at either SLATEPORT or LILYCOVE.\p"
	.string "I'll fill you in on the details when\n"
	.string "we meet. I'll be waiting!\p"
	.string "… … … … … …\n"
	.string "… … … … … Click!$"

@ Pokemon Migration Research Quest - Postgame
LittlerootTown_ProfessorBirchsLab_EventScript_BirchQuestCheck::
	goto_if_eq VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 5, LittlerootTown_ProfessorBirchsLab_EventScript_CanHaveAnyOneOfRarePokemon
	goto_if_eq VAR_DEX_UPGRADE_JOHTO_STARTER_STATE, 2, LittlerootTown_ProfessorBirchsLab_EventScript_GrassyPatchWaiting
	goto_if_set FLAG_BIRCH_QUEST_COMPLETE, LittlerootTown_ProfessorBirchsLab_EventScript_BirchPostQuest
	goto_if_set FLAG_BIRCH_QUEST_METEOR, LittlerootTown_ProfessorBirchsLab_EventScript_BirchRewardMasterBall
	goto_if_set FLAG_BIRCH_QUEST_STARTED, LittlerootTown_ProfessorBirchsLab_EventScript_BirchCheckProgress
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchQuestHook, MSGBOX_DEFAULT
	setflag FLAG_BIRCH_QUEST_STARTED
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_BirchCheckProgress::
	goto_if_unset FLAG_BIRCH_QUEST_WEATHER, LittlerootTown_ProfessorBirchsLab_EventScript_BirchRemind
	goto_if_unset FLAG_BIRCH_QUEST_SLAB, LittlerootTown_ProfessorBirchsLab_EventScript_BirchRemind
	goto_if_unset FLAG_BIRCH_QUEST_COZMO, LittlerootTown_ProfessorBirchsLab_EventScript_BirchRemind
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchAllThreeDone, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_BirchRemind::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchRemind, MSGBOX_DEFAULT
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_BirchRewardMasterBall::
	msgbox LittlerootTown_ProfessorBirchsLab_Text_BirchQuestComplete, MSGBOX_DEFAULT
	giveitem ITEM_MASTER_BALL
	setflag FLAG_BIRCH_QUEST_COMPLETE
	release
	end

LittlerootTown_ProfessorBirchsLab_EventScript_BirchPostQuest::
	goto_if_set FLAG_MIGRATION_TRACKER_STAGE3, BirchLab_EventScript_MigrationComplete
	goto_if_set FLAG_MIGRATION_TRACKER_STARTED, BirchLab_EventScript_MigrationCheckProgress
	msgbox BirchLab_Text_MigrationTrackerHook, MSGBOX_DEFAULT
	setflag FLAG_MIGRATION_TRACKER_STARTED
	release
	end

LittlerootTown_ProfessorBirchsLab_Text_BirchQuestHook:
	.string "PROF. BIRCH: {PLAYER}! Champion!\n"
	.string "I have been waiting for you.\p"
	.string "While you were conquering the\n"
	.string "POKeMON LEAGUE, I was buried\l"
	.string "in migration data.\p"
	.string "The patterns are extraordinary.\n"
	.string "Species arriving in waves.\l"
	.string "Evolved forms where there were\l"
	.string "only juveniles months ago.\p"
	.string "But I cannot explain the cause.\n"
	.string "Why HERE? Why NOW?\p"
	.string "I need field data from three\n"
	.string "sources to triangulate the\l"
	.string "origin.\p"
	.string "First, the WEATHER INSTITUTE\n"
	.string "on ROUTE 119.\p"
	.string "Second, the SCORCHED SLAB\n"
	.string "on ROUTE 120.\p"
	.string "Third, PROF. COZMO in FALLARBOR.\p"
	.string "Report back after each site.\n"
	.string "Or visit all three and bring\l"
	.string "everything at once.\p"
	.string "This could be the discovery\n"
	.string "of our careers, {PLAYER}.$"

LittlerootTown_ProfessorBirchsLab_Text_BirchRemind:
	.string "The WEATHER INSTITUTE,\n"
	.string "SCORCHED SLAB, and PROF.\l"
	.string "COZMO in FALLARBOR.\p"
	.string "Any order you like. Just\n"
	.string "bring me that data!$"

LittlerootTown_ProfessorBirchsLab_Text_BirchAllThreeDone:
	.string "You have data from all\n"
	.string "three sites?\p"
	.string "Let me see... atmospheric\n"
	.string "anomalies... ancient records...\l"
	.string "meteorite resonance...\p"
	.string "... ... ...\p"
	.string "{PLAYER}. They all point\n"
	.string "to the same place.\p"
	.string "METEOR FALLS. The deepest\n"
	.string "chamber.\p"
	.string "I need you to go there and\n"
	.string "investigate. Look for\l"
	.string "anything unusual.\p"
	.string "Be careful. Whatever is\n"
	.string "down there has been drawing\l"
	.string "powerful species across\l"
	.string "continents.$"

LittlerootTown_ProfessorBirchsLab_Text_BirchQuestComplete:
	.string "PROF. BIRCH: {PLAYER}!\n"
	.string "You found the epicenter?\p"
	.string "The meteorite's core in\n"
	.string "METEOR FALLS... a cyclical\l"
	.string "resonance drawing POKeMON\l"
	.string "across continents...\p"
	.string "The atmospheric data, the\n"
	.string "cave paintings, COZMO's\l"
	.string "analysis... it all fits.\p"
	.string "This is not a crisis. This\n"
	.string "is a natural cycle.\p"
	.string "The meteorite has been\n"
	.string "doing this for millennia.\p"
	.string "Every few centuries, it\n"
	.string "pulses. POKeMON hear the\l"
	.string "call. They come to HOENN.\p"
	.string "The ABSOL were not sensing\n"
	.string "disaster. They were sensing\l"
	.string "CHANGE.\p"
	.string "And the GIBLE from SINNOH...\n"
	.string "Dragon types, drawn across\l"
	.string "an ocean by a song in the\l"
	.string "stone.\p"
	.string "{PLAYER}, we did not just\n"
	.string "solve a mystery.\p"
	.string "We discovered that HOENN\n"
	.string "has been a sanctuary for\l"
	.string "migrating POKeMON since\l"
	.string "before recorded history.\p"
	.string "The POKeMON LEAGUE sent\n"
	.string "this for whoever solved\l"
	.string "the migration mystery.\p"
	.string "I can think of no one\n"
	.string "more deserving.$"

@ =============================================================
@ Migration Tracker Quest — 3-stage postgame collection quest
@ =============================================================

@ --- Progress Router ---
BirchLab_EventScript_MigrationCheckProgress::
	goto_if_set FLAG_MIGRATION_TRACKER_STAGE2, BirchLab_EventScript_MigrationCheckS3
	goto_if_set FLAG_MIGRATION_TRACKER_STAGE1, BirchLab_EventScript_MigrationCheckS2
	goto BirchLab_EventScript_MigrationCheckS1

@ --- Stage 1: First Wave Pioneers (catch 5 of 10) ---
BirchLab_EventScript_MigrationCheckS1::
	setvar VAR_0x800B, 0
	setvar VAR_0x8004, SPECIES_GROWLITHE
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip1
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip1::
	setvar VAR_0x8004, SPECIES_VULPIX
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip2
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip2::
	setvar VAR_0x8004, SPECIES_MEOWTH
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip3
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip3::
	setvar VAR_0x8004, SPECIES_POLIWAG
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip4
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip4::
	setvar VAR_0x8004, SPECIES_NIDORAN_M
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip5
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip5::
	setvar VAR_0x8004, SPECIES_TEDDIURSA
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip6
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip6::
	setvar VAR_0x8004, SPECIES_PHANPY
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip7
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip7::
	setvar VAR_0x8004, SPECIES_MAREEP
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip8
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip8::
	setvar VAR_0x8004, SPECIES_MACHOP
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip9
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip9::
	setvar VAR_0x8004, SPECIES_HOUNDOUR
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS1_Skip10
	addvar VAR_0x800B, 1
BirchLab_MigS1_Skip10::
	compare VAR_0x800B, 5
	goto_if_ge BirchLab_EventScript_MigrationS1Complete
	buffernumberstring STR_VAR_1, VAR_0x800B
	msgbox BirchLab_Text_MigrationS1Progress, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_MigrationS1Complete::
	setflag FLAG_MIGRATION_TRACKER_STAGE1
	msgbox BirchLab_Text_MigrationS1Complete, MSGBOX_DEFAULT
	giveitem ITEM_RARE_CANDY, 3
	release
	end

@ --- Stage 2: Apex Predators (catch 3 of 6) ---
BirchLab_EventScript_MigrationCheckS2::
	setvar VAR_0x800B, 0
	setvar VAR_0x8004, SPECIES_TYRANITAR
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS2_Skip1
	addvar VAR_0x800B, 1
BirchLab_MigS2_Skip1::
	setvar VAR_0x8004, SPECIES_DRAGONITE
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS2_Skip2
	addvar VAR_0x800B, 1
BirchLab_MigS2_Skip2::
	setvar VAR_0x8004, SPECIES_SALAMENCE
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS2_Skip3
	addvar VAR_0x800B, 1
BirchLab_MigS2_Skip3::
	setvar VAR_0x8004, SPECIES_GARCHOMP
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS2_Skip4
	addvar VAR_0x800B, 1
BirchLab_MigS2_Skip4::
	setvar VAR_0x8004, SPECIES_LUCARIO
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS2_Skip5
	addvar VAR_0x800B, 1
BirchLab_MigS2_Skip5::
	setvar VAR_0x8004, SPECIES_WEAVILE
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS2_Skip6
	addvar VAR_0x800B, 1
BirchLab_MigS2_Skip6::
	compare VAR_0x800B, 3
	goto_if_ge BirchLab_EventScript_MigrationS2Complete
	buffernumberstring STR_VAR_1, VAR_0x800B
	msgbox BirchLab_Text_MigrationS2Progress, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_MigrationS2Complete::
	setflag FLAG_MIGRATION_TRACKER_STAGE2
	msgbox BirchLab_Text_MigrationS2Complete, MSGBOX_DEFAULT
	giveitem ITEM_PP_MAX, 2
	release
	end

@ --- Stage 3: Regional Specialists (1 water + 1 cave + 1 forest) ---
BirchLab_EventScript_MigrationCheckS3::
	setvar VAR_0x8005, 0
	setvar VAR_0x8006, 0
	setvar VAR_0x8007, 0
	@ Water: Corsola or Lanturn
	setvar VAR_0x8004, SPECIES_CORSOLA
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS3_SkipW1
	setvar VAR_0x8005, 1
BirchLab_MigS3_SkipW1::
	setvar VAR_0x8004, SPECIES_LANTURN
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS3_SkipW2
	setvar VAR_0x8005, 1
BirchLab_MigS3_SkipW2::
	@ Cave: Riolu or Gible
	setvar VAR_0x8004, SPECIES_RIOLU
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS3_SkipC1
	setvar VAR_0x8006, 1
BirchLab_MigS3_SkipC1::
	setvar VAR_0x8004, SPECIES_GIBLE
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS3_SkipC2
	setvar VAR_0x8006, 1
BirchLab_MigS3_SkipC2::
	@ Forest: Scyther or Heracross
	setvar VAR_0x8004, SPECIES_SCYTHER
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS3_SkipF1
	setvar VAR_0x8007, 1
BirchLab_MigS3_SkipF1::
	setvar VAR_0x8004, SPECIES_HERACROSS
	specialvar VAR_RESULT, ScriptCheckSpeciesCaught
	compare VAR_RESULT, 1
	goto_if_ne BirchLab_MigS3_SkipF2
	setvar VAR_0x8007, 1
BirchLab_MigS3_SkipF2::
	@ Check all three habitats
	compare VAR_0x8005, 1
	goto_if_ne BirchLab_EventScript_MigrationS3NotYet
	compare VAR_0x8006, 1
	goto_if_ne BirchLab_EventScript_MigrationS3NotYet
	compare VAR_0x8007, 1
	goto_if_ne BirchLab_EventScript_MigrationS3NotYet
	goto BirchLab_EventScript_MigrationS3Complete

BirchLab_EventScript_MigrationS3NotYet::
	msgbox BirchLab_Text_MigrationS3Progress, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_MigrationS3Complete::
	setflag FLAG_MIGRATION_TRACKER_STAGE3
	msgbox BirchLab_Text_MigrationS3Complete, MSGBOX_DEFAULT
	giveitem ITEM_SHELL_BELL
	release
	end

@ --- Post-Completion: Beast Trigger System ---
BirchLab_EventScript_MigrationComplete::
	lock
	faceplayer
	goto_if_set FLAG_CAUGHT_HO_OH, BirchLab_EventScript_HoOhCaught
	goto_if_set FLAG_LEGENDS_AWAKENED, BirchLab_EventScript_ClimaxReminder
	goto_if_set FLAG_BEAST_SUICUNE_DONE, BirchLab_EventScript_AllBeastsDone
	special IsRoamerActive
	goto_if_eq VAR_RESULT, TRUE, BirchLab_EventScript_BeastActive
	goto_if_set FLAG_BEAST_RAIKOU_DONE, BirchLab_EventScript_NextBeastArrived
	@ First trigger - cinematic scene
	msgbox BirchLab_Text_BeastTrigger1, MSGBOX_DEFAULT
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 2
	setvar VAR_0x8006, 6
	setvar VAR_0x8007, 4
	special ShakeCamera
	waitstate
	msgbox BirchLab_Text_BeastTrigger2, MSGBOX_DEFAULT
	msgbox BirchLab_Text_BeastTrigger3, MSGBOX_DEFAULT
	special InitNextBeast
	playmoncry SPECIES_RAIKOU, CRY_MODE_ENCOUNTER
	waitmoncry
	msgbox BirchLab_Text_BeastTrigger4, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_NextBeastArrived::
	msgbox BirchLab_Text_NextBeast, MSGBOX_DEFAULT
	special InitNextBeast
	msgbox BirchLab_Text_NextBeastGo, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_BeastActive::
	msgbox BirchLab_Text_BeastStillOut, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_AllBeastsDone::
	msgbox BirchLab_Text_AllBeastsDoneIntro, MSGBOX_DEFAULT
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 2
	setvar VAR_0x8006, 6
	setvar VAR_0x8007, 4
	special ShakeCamera
	waitstate
	playse SE_M_EXPLOSION
	waitse
	delay 40
	msgbox BirchLab_Text_BirchRevelation1, MSGBOX_DEFAULT
	playmoncry SPECIES_HO_OH, CRY_MODE_ENCOUNTER
	waitmoncry
	delay 20
	msgbox BirchLab_Text_BirchRevelation2, MSGBOX_DEFAULT
	setflag FLAG_LEGENDS_AWAKENED
	msgbox BirchLab_Text_BirchRevelation3, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_ClimaxReminder::
	msgbox BirchLab_Text_ClimaxReminder, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_HoOhCaught::
	goto_if_set FLAG_PRIMAL_STIRRING_STARTED, BirchLab_EventScript_PrimalProgress
	@ First visit after Ho-Oh caught — full reaction + primal trigger
	msgbox BirchLab_Text_HoOhCaught, MSGBOX_DEFAULT
	@ Dramatic pause, then instruments spike
	delay 30
	setvar VAR_0x8004, 2
	setvar VAR_0x8005, 3
	setvar VAR_0x8006, 8
	setvar VAR_0x8007, 5
	special ShakeCamera
	waitstate
	playse SE_M_EXPLOSION
	waitse
	delay 20
	msgbox BirchLab_Text_PrimalStirring1, MSGBOX_DEFAULT
	msgbox BirchLab_Text_PrimalStirring2, MSGBOX_DEFAULT
	msgbox BirchLab_Text_PrimalStirring3, MSGBOX_DEFAULT
	setflag FLAG_PRIMAL_STIRRING_STARTED
	release
	end

BirchLab_EventScript_PrimalProgress::
	goto_if_set FLAG_ALL_SIGNS_REPORTED, BirchLab_EventScript_PrimalNextPhase
	goto_if_unset FLAG_TREMORS_INVESTIGATED, BirchLab_EventScript_PrimalRemindTremors
	goto_if_unset FLAG_TIDES_INVESTIGATED, BirchLab_EventScript_PrimalRemindTides
	@ Both flags set - player has investigated both sites
	msgbox BirchLab_Text_AllSignsIntro, MSGBOX_DEFAULT
	playse SE_PIN
	waitse
	delay 20
	msgbox BirchLab_Text_AllSignsReveal, MSGBOX_DEFAULT
	msgbox BirchLab_Text_AllSignsDirective, MSGBOX_DEFAULT
	setflag FLAG_ALL_SIGNS_REPORTED
	release
	end

BirchLab_EventScript_PrimalRemindTremors::
	msgbox BirchLab_Text_PrimalReminder, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_PrimalRemindTides::
	msgbox BirchLab_Text_RemindTidesOnly, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_PrimalNextPhase::
	goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED, BirchLab_EventScript_PrimalResolved
	goto_if_unset FLAG_TERRA_CAVE_INVESTIGATED, BirchLab_EventScript_PrimalInvestigateCaves
	goto_if_unset FLAG_SEAFLOOR_CAVERN_INVESTIGATED, BirchLab_EventScript_PrimalInvestigateCaves
	@ Check Groudon dealt with (caught OR defeated)
	goto_if_set FLAG_CAUGHT_PRIMAL_GROUDON, BirchLab_EventScript_CheckKyogre
	goto_if_set FLAG_DEFEATED_PRIMAL_GROUDON, BirchLab_EventScript_CheckKyogre
	@ Groudon not dealt with yet -- show Regi directive
	msgbox BirchLab_Text_PrimalNextPhase, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_CheckKyogre::
	@ Check Kyogre dealt with (caught OR defeated)
	goto_if_set FLAG_CAUGHT_PRIMAL_KYOGRE, BirchLab_EventScript_PrimalDebrief
	goto_if_set FLAG_DEFEATED_PRIMAL_KYOGRE, BirchLab_EventScript_PrimalDebrief
	@ Kyogre not dealt with yet -- show Regi directive
	msgbox BirchLab_Text_PrimalNextPhase, MSGBOX_DEFAULT
	release
	end

BirchLab_EventScript_PrimalInvestigateCaves::
	msgbox BirchLab_Text_PrimalInvestigateCaves, MSGBOX_DEFAULT
	release
	end

@ =============================================================
@ Migration Tracker Quest — Dialogue Text
@ =============================================================

BirchLab_Text_MigrationTrackerHook:
	.string "PROF. BIRCH: {PLAYER}! Our\n"
	.string "research paper made waves\l"
	.string "in the scientific community.\p"
	.string "Other professors want to\n"
	.string "replicate our findings.\l"
	.string "But they need more data.\p"
	.string "I want to publish a complete\n"
	.string "field guide to every\l"
	.string "migrant species in HOENN.\p"
	.string "The first wave... the apex\n"
	.string "predators... the habitat\l"
	.string "specialists...\p"
	.string "Would you help me catalogue\n"
	.string "them? Catch the migrants\l"
	.string "and bring me your data.\p"
	.string "Start with the FIRST WAVE\n"
	.string "pioneers. Catch any 5 of\l"
	.string "the common migrants.\p"
	.string "GROWLITHE, VULPIX, MEOWTH,\n"
	.string "POLIWAG, NIDORAN, TEDDIURSA,\l"
	.string "PHANPY, MAREEP, MACHOP,\l"
	.string "or HOUNDOUR.\p"
	.string "Every species you catalogue\n"
	.string "brings us closer to\l"
	.string "understanding the full\l"
	.string "scope of this migration.$"

BirchLab_Text_MigrationS1Progress:
	.string "PROF. BIRCH: You have caught\n"
	.string "{STR_VAR_1} of the 5 first-wave\l"
	.string "pioneers I need.\p"
	.string "Keep looking! GROWLITHE,\n"
	.string "VULPIX, MEOWTH, POLIWAG,\l"
	.string "NIDORAN, TEDDIURSA, PHANPY,\l"
	.string "MAREEP, MACHOP, HOUNDOUR.\p"
	.string "Any 5 will do.$"

BirchLab_Text_MigrationS1Complete:
	.string "PROF. BIRCH: Five pioneer\n"
	.string "species catalogued!\p"
	.string "Look at the data, {PLAYER}.\n"
	.string "All five arrived from the\l"
	.string "east, from JOHTO and beyond.\p"
	.string "As if something was pulling\n"
	.string "them toward HOENN.\p"
	.string "Phase one of the field guide\n"
	.string "is complete. Take these as\l"
	.string "thanks for your work.\p"
	.string "Now, the APEX PREDATORS.\n"
	.string "The evolved powerhouses\l"
	.string "that followed the pioneers.\p"
	.string "TYRANITAR, DRAGONITE,\n"
	.string "SALAMENCE, GARCHOMP,\l"
	.string "LUCARIO, or WEAVILE.\p"
	.string "Catch any 3. These will\n"
	.string "not be easy to find.$"

BirchLab_Text_MigrationS2Progress:
	.string "PROF. BIRCH: You have caught\n"
	.string "{STR_VAR_1} of the 3 apex\l"
	.string "predators I need.\p"
	.string "TYRANITAR, DRAGONITE,\n"
	.string "SALAMENCE, GARCHOMP,\l"
	.string "LUCARIO, or WEAVILE.\p"
	.string "Any 3 will complete this\n"
	.string "phase of the field guide.$"

BirchLab_Text_MigrationS2Complete:
	.string "PROF. BIRCH: Three apex\n"
	.string "predators documented!\p"
	.string "This confirms what I\n"
	.string "suspected, {PLAYER}.\p"
	.string "The predators did not wander\n"
	.string "here randomly. They followed\l"
	.string "their prey chains.\p"
	.string "TYRANITAR followed the\n"
	.string "LARVITAR colonies.\l"
	.string "DRAGONITE followed the\l"
	.string "DRATINI in the rivers.\p"
	.string "This is not random dispersal.\n"
	.string "It is an ecological cascade.\p"
	.string "The CAVE OF ORIGIN energy\n"
	.string "drew the pioneers. The\l"
	.string "pioneers drew the predators.\p"
	.string "One final stage remains.\n"
	.string "The REGIONAL SPECIALISTS.\p"
	.string "Catch one WATER migrant,\n"
	.string "one CAVE migrant, and\l"
	.string "one FOREST migrant.\p"
	.string "Water: CORSOLA or LANTURN.\n"
	.string "Cave: RIOLU or GIBLE.\l"
	.string "Forest: SCYTHER or HERACROSS.\p"
	.string "This will prove the migration\n"
	.string "has reshaped every habitat\l"
	.string "in HOENN.$"

BirchLab_Text_MigrationS3Progress:
	.string "PROF. BIRCH: For the final\n"
	.string "stage I need proof from\l"
	.string "three habitats.\p"
	.string "Water: CORSOLA or LANTURN.\n"
	.string "Cave: RIOLU or GIBLE.\l"
	.string "Forest: SCYTHER or HERACROSS.\p"
	.string "One from each habitat will\n"
	.string "complete the field guide.$"

BirchLab_Text_MigrationS3Complete:
	.string "PROF. BIRCH: Water... cave...\n"
	.string "forest... All three habitats\l"
	.string "documented.\p"
	.string "{PLAYER}. Do you understand\n"
	.string "what we have proven?\p"
	.string "The migration has not just\n"
	.string "brought new species to\l"
	.string "HOENN. It has woven them\l"
	.string "into every ecosystem.\p"
	.string "The rivers, the caves, the\n"
	.string "forests... they are all\l"
	.string "richer now.\p"
	.string "I am going to publish this\n"
	.string "as the HOENN MIGRATION\l"
	.string "FIELD GUIDE.\p"
	.string "Co-authored by {PLAYER},\n"
	.string "POKeMON CHAMPION and\l"
	.string "field researcher.\p"
	.string "Every trainer in HOENN will\n"
	.string "know what you discovered.\p"
	.string "Take this SHELL BELL. It\n"
	.string "resonates with the same\l"
	.string "energy as the CAVE OF\l"
	.string "ORIGIN. A fitting memento.$"

BirchLab_Text_MigrationPostComplete:
	.string "PROF. BIRCH: The HOENN\n"
	.string "MIGRATION FIELD GUIDE is\l"
	.string "selling out in LILYCOVE.\p"
	.string "Trainers from KANTO and\n"
	.string "JOHTO are visiting to see\l"
	.string "the migrants for themselves.\p"
	.string "You made this possible,\n"
	.string "{PLAYER}. Our research\l"
	.string "changed how the world sees\l"
	.string "HOENN.$"

@ =============================================================
@ Beast Trigger - Dialogue Text
@ =============================================================

BirchLab_Text_BeastTrigger1:
	.string "Ah, {PLAYER}! Perfect timing.\p"
	.string "Your Migration Tracker data has been\n"
	.string "remarkable. The patterns suggest\l"
	.string "something unprecedented...$"

BirchLab_Text_BeastTrigger2:
	.string "Wh-what was that?!\p"
	.string "The instruments - look at these\n"
	.string "readings! I have never seen energy\l"
	.string "signatures like this in thirty\l"
	.string "years of research!$"

BirchLab_Text_BeastTrigger3:
	.string "Wait... these match the old Johto\n"
	.string "field reports. The legendary beasts -\l"
	.string "Raikou, Entei, Suicune.\p"
	.string "The migration did not just draw\n"
	.string "ordinary POKeMON to Hoenn.\l"
	.string "It drew THEM.$"

BirchLab_Text_BeastTrigger4:
	.string "Did you hear that?! That cry came\n"
	.string "from somewhere to the east!\p"
	.string "One of them is already out there,\n"
	.string "roaming the routes of Hoenn.\p"
	.string "{PLAYER}, this is a once-in-a-lifetime\n"
	.string "discovery. No - once in HISTORY.\p"
	.string "Get out there and find it.\n"
	.string "Be careful - these POKeMON will not\l"
	.string "stay in one place for long.$"

BirchLab_Text_NextBeast:
	.string "Extraordinary! Your encounter data\n"
	.string "is invaluable, {PLAYER}!\p"
	.string "But look - the instruments are\n"
	.string "picking up a NEW signature.\l"
	.string "Another beast has entered Hoenn!$"

BirchLab_Text_NextBeastGo:
	.string "The migration corridors are still\n"
	.string "active. Get back out there!$"

BirchLab_Text_BeastStillOut:
	.string "The instruments are still tracking\n"
	.string "abnormal energy across Hoenn.\p"
	.string "That legendary beast is out there\n"
	.string "somewhere. Keep searching!$"

BirchLab_Text_AllBeastsDoneIntro:
	.string "Raikou, Entei, and Suicune...\n"
	.string "You have done it, {PLAYER}.\l"
	.string "All three legendary beasts.\p"
	.string "This will rewrite every textbook\n"
	.string "on POKeMON ecology.$"

BirchLab_Text_BirchRevelation1:
	.string "Wait... What was that?\p"
	.string "These readings... they are\n"
	.string "completely different. Stronger.\p"
	.string "The beasts were not just\n"
	.string "migrating, {PLAYER}.\l"
	.string "They were scouts.$"

BirchLab_Text_BirchRevelation2:
	.string "In Johto legend, the three beasts\n"
	.string "were created by a great and\l"
	.string "ancient POKeMON called HO-OH.\p"
	.string "They share a sacred bond.\n"
	.string "Where the beasts go...\l"
	.string "their master follows.$"

BirchLab_Text_BirchRevelation3:
	.string "The energy is concentrated\n"
	.string "beneath Sootopolis City.\l"
	.string "The Cave of Origin.\p"
	.string "I have contacted WALLACE.\n"
	.string "He will grant you access to\l"
	.string "the deepest chambers.\p"
	.string "Be careful, {PLAYER}.\n"
	.string "What awaits you down there\l"
	.string "is beyond anything we have\l"
	.string "encountered before.$"

BirchLab_Text_ClimaxReminder:
	.string "The Cave of Origin, {PLAYER}.\n"
	.string "HO-OH awaits in the deepest\l"
	.string "chamber beneath Sootopolis.\p"
	.string "WALLACE has cleared the way.\n"
	.string "You need only descend.$"

BirchLab_Text_HoOhCaught:
	.string "PROF. BIRCH: {PLAYER}...\n"
	.string "You actually did it.\p"
	.string "HO-OH. The sacred guardian\n"
	.string "that created the three beasts.\l"
	.string "Captured by a trainer from\l"
	.string "little LITTLEROOT TOWN.\p"
	.string "When I started studying this\n"
	.string "migration, I thought we were\l"
	.string "tracking a few displaced\l"
	.string "species.\p"
	.string "Instead, we uncovered\n"
	.string "something that rewrites\l"
	.string "everything we know about\l"
	.string "POKeMON ecology.\p"
	.string "The beasts came as harbingers.\n"
	.string "Their master followed.\l"
	.string "And you met them all.\p"
	.string "...\p"
	.string "Though I must confess,\n"
	.string "the instruments have not\l"
	.string "fully quieted.\p"
	.string "There are new readings.\n"
	.string "Faint. Different from the\l"
	.string "beasts. Deeper.\p"
	.string "The migration is not over,\n"
	.string "{PLAYER}. I suspect it is\l"
	.string "only deepening.$"

@ =============================================================
@ v6.0: The Primal Stirring - Birch Dialogue
@ =============================================================

BirchLab_Text_PrimalStirring1:
	.string "PROF. BIRCH: Wait -\n"
	.string "{PLAYER}, the instruments!\p"
	.string "These readings are not\n"
	.string "from the migration.\l"
	.string "This is seismic. Deep.\p"
	.string "The tremor signatures are\n"
	.string "coming from beneath HOENN\l"
	.string "itself.$"

BirchLab_Text_PrimalStirring2:
	.string "Sacred fire energy...\n"
	.string "When you captured HO-OH,\l"
	.string "the energy it released\l"
	.string "resonated downward.\p"
	.string "Into chambers sealed since\n"
	.string "the ancient war between\l"
	.string "GROUDON and KYOGRE.\p"
	.string "Those creatures have slept\n"
	.string "for millennia. RAYQUAZA\l"
	.string "silenced them long ago.\p"
	.string "But if these readings are\n"
	.string "right... they are stirring\l"
	.string "again. Because of us.$"

BirchLab_Text_PrimalStirring3:
	.string "I am reading anomalies at\n"
	.string "three sites across HOENN.\p"
	.string "Seismic tremors near\n"
	.string "LAVARIDGE TOWN.\l"
	.string "Tidal disruptions around\l"
	.string "DEWFORD.\l"
	.string "And a strange resonance\l"
	.string "from the ancient REGI\l"
	.string "ruins.\p"
	.string "{PLAYER}, I need you to\n"
	.string "investigate all three.\l"
	.string "Talk to the locals.\l"
	.string "Report what you find.\p"
	.string "If what I fear is true...\n"
	.string "we may have woken something\l"
	.string "that should have stayed\l"
	.string "asleep.$"

BirchLab_Text_PrimalReminder:
	.string "PROF. BIRCH: The readings\n"
	.string "grow stronger by the hour.\p"
	.string "Have you checked all three\n"
	.string "anomaly sites yet?\l"
	.string "LAVARIDGE for the tremors.\l"
	.string "DEWFORD for the tides.\l"
	.string "The REGI ruins for that\l"
	.string "strange resonance.\p"
	.string "Report back once you have\n"
	.string "seen them all, {PLAYER}.$"

BirchLab_Text_PrimalInvestigateCaves:
	.string "PROF. BIRCH: The primal energy\n"
	.string "readings are strongest at\l"
	.string "TERRA CAVE and the\l"
	.string "SEAFLOOR CAVERN.\p"
	.string "I need someone to investigate\n"
	.string "those sites firsthand.\p"
	.string "Would you be willing to check\n"
	.string "them out for me, {PLAYER}?$"

BirchLab_Text_PrimalNextPhase:
	.string "PROF. BIRCH: The data from\n"
	.string "the field confirms it.\p"
	.string "GROUDON and KYOGRE stir\n"
	.string "beneath us. But there may\l"
	.string "yet be time.\p"
	.string "The ancient REGI ruins hold\n"
	.string "the key. Investigate them\l"
	.string "when you are ready,\l"
	.string "{PLAYER}.$"

BirchLab_Text_RemindTidesOnly:
	.string "PROF. BIRCH: You have\n"
	.string "confirmed the tremors.\l"
	.string "Good work.\p"
	.string "But the tidal anomalies\n"
	.string "around DEWFORD still need\l"
	.string "investigation.\p"
	.string "Talk to the locals there\n"
	.string "and at SLATEPORT. Report\l"
	.string "back with what you find.$"

BirchLab_Text_AllSignsIntro:
	.string "PROF. BIRCH: {PLAYER}!\n"
	.string "You have seen them all.\p"
	.string "Tremors at LAVARIDGE.\n"
	.string "Tidal surges at DEWFORD.\l"
	.string "Exactly as I feared.\p"
	.string "But your field reports\n"
	.string "reveal something I did\l"
	.string "not expect.$"

BirchLab_Text_AllSignsReveal:
	.string "PROF. BIRCH: The migration\n"
	.string "species... RAIKOU, ENTEI,\l"
	.string "SUICUNE, HO-OH...\p"
	.string "I assumed they came to\n"
	.string "HOENN by chance. That the\l"
	.string "beasts were scouts and\l"
	.string "HO-OH followed.\p"
	.string "But what if it was the\n"
	.string "other way around?\p"
	.string "What if they sensed the\n"
	.string "primals stirring FIRST?\l"
	.string "The migration was not a\l"
	.string "random event.\p"
	.string "It was a response.\n"
	.string "Nature sending its\l"
	.string "guardians to HOENN because\l"
	.string "something ancient was\l"
	.string "waking up.$"

BirchLab_Text_AllSignsDirective:
	.string "PROF. BIRCH: This changes\n"
	.string "everything, {PLAYER}.\p"
	.string "Capturing HO-OH did not\n"
	.string "cause the stirring. The\l"
	.string "stirring was already\l"
	.string "happening.\p"
	.string "HO-OH came to help.\n"
	.string "And now it is with you.\p"
	.string "There is one more anomaly\n"
	.string "to investigate. The ancient\l"
	.string "REGI ruins.\p"
	.string "The golems were placed as\n"
	.string "seals. If they are\l"
	.string "weakening... we will know\l"
	.string "how much time we have.\p"
	.string "Be careful out there.$"

@ =============================================================
@ v6.0 Resolution -- Primal Crisis Debrief
@ =============================================================

BirchLab_EventScript_PrimalDebrief::
	lock
	faceplayer
	playse SE_PIN
	waitse
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	msgbox BirchLab_Text_PrimalDebrief1, MSGBOX_DEFAULT
	delay 30
	playse SE_M_EARTHQUAKE
	waitse
	special ShakeCamera
	msgbox BirchLab_Text_PrimalDebrief2, MSGBOX_DEFAULT
	msgbox BirchLab_Text_PrimalDebrief3, MSGBOX_DEFAULT
	setflag FLAG_PRIMAL_CRISIS_RESOLVED
	release
	end

BirchLab_EventScript_PrimalResolved::
	lock
	faceplayer
	goto_if_set FLAG_CAUGHT_RAYQUAZA_GUARDIAN, BirchLab_EventScript_SkyGuardianComplete
	goto_if_set FLAG_DEFEATED_RAYQUAZA_GUARDIAN, BirchLab_EventScript_SkyGuardianComplete
	goto_if_unset FLAG_SKY_GUARDIAN_QUEST_ACTIVE, BirchLab_EventScript_SkyGuardianTrigger
	msgbox BirchLab_Text_PrimalResolved, MSGBOX_DEFAULT
	release
	end

BirchLab_Text_PrimalDebrief1:
	.string "PROF. BIRCH: {PLAYER}! The readings\n"
	.string "have stabilized completely!\p"
	.string "Both GROUDON and KYOGRE have\n"
	.string "returned to dormancy. The primal\l"
	.string "energies are fading back to\l"
	.string "baseline.$"

BirchLab_Text_PrimalDebrief2:
	.string "PROF. BIRCH: I have to be honest\n"
	.string "with you.\p"
	.string "When those readings spiked, I\n"
	.string "feared the worst. HO-OH's capture\l"
	.string "awakened something ancient.\p"
	.string "Something that was never meant\n"
	.string "to stir again.\p"
	.string "But you confronted it head-on.\n"
	.string "You restored the balance.$"

BirchLab_Text_PrimalDebrief3:
	.string "PROF. BIRCH: Though... there is\n"
	.string "one thing that puzzles me.\p"
	.string "The seismic and tidal readings\n"
	.string "have normalized, yes. But my\l"
	.string "atmospheric sensors are picking\l"
	.string "up something new.\p"
	.string "A disturbance high above us.\n"
	.string "In the ozone layer itself.\p"
	.string "The legends speak of a guardian\n"
	.string "of the sky -- one that mediates\l"
	.string "between land and sea.\p"
	.string "If GROUDON and KYOGRE have\n"
	.string "stirred... perhaps their ancient\l"
	.string "arbiter has taken notice as well.\p"
	.string "Keep your eyes skyward, {PLAYER}.\n"
	.string "I have a feeling this story\l"
	.string "is not over yet.$"

BirchLab_Text_PrimalResolved:
	.string "PROF. BIRCH: The primal readings\n"
	.string "remain stable. GROUDON and KYOGRE\l"
	.string "are at rest.\p"
	.string "But those atmospheric anomalies\n"
	.string "continue to intrigue me.\p"
	.string "Something is stirring in the sky\n"
	.string "above HOENN. I can feel it.$"

@ =============================================================
@ v7.0 Sky Guardian Arc -- Act 1: Birch triggers the quest
@ =============================================================

BirchLab_EventScript_SkyGuardianTrigger::
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	msgbox BirchLab_Text_SkyGuardianAlert, MSGBOX_DEFAULT
	setflag FLAG_SKY_GUARDIAN_QUEST_ACTIVE
	release
	end

BirchLab_Text_SkyGuardianAlert:
	.string "PROF. BIRCH: {PLAYER}! Come quickly!\p"
	.string "My atmospheric instruments are\n"
	.string "going haywire again.\p"
	.string "But this time, it is not the earth\n"
	.string "or the sea.\l"
	.string "The readings are coming from above.\p"
	.string "The upper atmosphere itself is\n"
	.string "destabilizing.\p"
	.string "I have cross-referenced my data\n"
	.string "with ancient DRACONID texts.\p"
	.string "There are legends of a guardian\n"
	.string "that dwells above the clouds...\p"
	.string "A creature that descends only when\n"
	.string "earth and sea clash beyond control.\p"
	.string "The elders in PACIFIDLOG TOWN may\n"
	.string "know more.\p"
	.string "Their families have guarded these\n"
	.string "stories for generations.\p"
	.string "Please, {PLAYER}.\p"
	.string "If the sky itself is stirring...\n"
	.string "we may face something even greater\l"
	.string "than GROUDON and KYOGRE.$"

@ =============================================================
@ v7.0 Sky Guardian Arc -- Act 3: Post-catch world reaction
@ =============================================================

BirchLab_EventScript_SkyGuardianComplete::
	lock
	faceplayer
	msgbox BirchLab_Text_SkyGuardianComplete, MSGBOX_DEFAULT
	release
	end

BirchLab_Text_SkyGuardianComplete:
	.string "PROF. BIRCH: {PLAYER}! Look at\n"
	.string "my instruments!\p"
	.string "Every single reading has\n"
	.string "normalized. The atmospheric\l"
	.string "anomaly, the seismic activity,\l"
	.string "the tidal fluctuations...\p"
	.string "All stable. Every one of them.\p"
	.string "You restored the balance between\n"
	.string "earth, sea, and sky.\p"
	.string "As a scientist, I should remain\n"
	.string "objective. But as your mentor...\l"
	.string "I could not be more proud.\p"
	.string "The migration that started all\n"
	.string "of this was not a crisis.\p"
	.string "It was nature finding a new\n"
	.string "equilibrium. And you helped\l"
	.string "HOENN achieve it.$"
