FieryPath_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, FieryPath_OnTransition
	.byte 0

FieryPath_OnTransition:
	call_if_unset FLAG_LANDMARK_FIERY_PATH, FieryPath_EventScript_MoveScottToFallarbor
	setflag FLAG_LANDMARK_FIERY_PATH
	end

FieryPath_EventScript_MoveScottToFallarbor::
	setflag FLAG_HIDE_VERDANTURF_TOWN_SCOTT
	clearflag FLAG_HIDE_FALLARBOR_TOWN_BATTLE_TENT_SCOTT
	return

@ =============================================
@ Primal Sighting Network - Hiker
@ =============================================

FieryPath_EventScript_TremorHiker::
	lock
	faceplayer
	goto_if_set FLAG_PRIMAL_STIRRING_STARTED, FieryPath_EventScript_TremorHikerReport
	msgbox FieryPath_Text_HikerNormal, MSGBOX_DEFAULT
	release
	end

FieryPath_EventScript_TremorHikerReport::
	msgbox FieryPath_Text_HikerReport, MSGBOX_DEFAULT
	release
	end

FieryPath_Text_HikerNormal:
	.string "This path runs right through\n"
	.string "the volcanic rock. You can\l"
	.string "feel the warmth in the walls.\p"
	.string "Makes for a toasty hike!$"

FieryPath_Text_HikerReport:
	.string "Do not touch the walls.\n"
	.string "Seriously.\p"
	.string "They have been getting\n"
	.string "hotter every day. Used to\l"
	.string "be warm. Now they will\l"
	.string "burn you.\p"
	.string "And the cracks... new ones\n"
	.string "keep appearing. I have been\l"
	.string "mapping this path for years.\l"
	.string "These fissures were not\l"
	.string "here last month.\p"
	.string "Something deep underground\n"
	.string "is generating heat. A lot\l"
	.string "of heat.\p"
	.string "The SLUGMA are agitated too.\n"
	.string "They keep pressing against\l"
	.string "the south wall, like they\l"
	.string "are drawn to something.$"

