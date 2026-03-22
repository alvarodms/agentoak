ScorchedSlab_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, ScorchedSlab_OnTransition
	.byte 0

ScorchedSlab_OnTransition:
	setflag FLAG_LANDMARK_SCORCHED_SLAB
	end

ScorchedSlab_EventScript_QuestHiker::
	lock
	faceplayer
	goto_if_set FLAG_BIRCH_QUEST_SLAB, ScorchedSlab_EventScript_HikerPostQuest
	goto_if_set FLAG_BIRCH_QUEST_STARTED, ScorchedSlab_EventScript_HikerQuestActive
	msgbox ScorchedSlab_Text_HikerDefault, MSGBOX_DEFAULT
	release
	end

ScorchedSlab_EventScript_HikerQuestActive::
	msgbox ScorchedSlab_Text_HikerQuestActive, MSGBOX_DEFAULT
	giveitem ITEM_TM02
	setflag FLAG_BIRCH_QUEST_SLAB
	release
	end

ScorchedSlab_EventScript_HikerPostQuest::
	msgbox ScorchedSlab_Text_HikerPostQuest, MSGBOX_DEFAULT
	release
	end

ScorchedSlab_Text_HikerDefault:
	.string "These cave paintings are\n"
	.string "fascinating!\p"
	.string "POKeMON crossing the sea...\n"
	.string "I wonder what it means.$"

ScorchedSlab_Text_HikerQuestActive:
	.string "Whoa! Another person down\n"
	.string "here?\p"
	.string "I am studying these cave\n"
	.string "paintings.\p"
	.string "See the shapes? Those are\n"
	.string "POKeMON. Dozens of them,\l"
	.string "crossing the sea toward\l"
	.string "HOENN.\p"
	.string "And here... a star, falling\n"
	.string "into a mountain. The same\l"
	.string "mountain drawn again and\l"
	.string "again across centuries.\p"
	.string "This is not the first\n"
	.string "migration. It has happened\l"
	.string "before. Many times.\p"
	.string "Every few hundred years,\n"
	.string "something draws POKeMON\l"
	.string "to HOENN from across the\l"
	.string "world.\p"
	.string "Tell PROF. BIRCH about\n"
	.string "these paintings.\p"
	.string "I found this wedged behind\n"
	.string "the cave paintings. Some\l"
	.string "ancient trainer must have\l"
	.string "left it. Take it.$"

ScorchedSlab_Text_HikerPostQuest:
	.string "I have been sketching every\n"
	.string "painting in this cave.\p"
	.string "The pattern is clear. Every\n"
	.string "depiction shows the star\l"
	.string "falling into the same\l"
	.string "mountain. Always the same.$"

