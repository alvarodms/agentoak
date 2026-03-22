MeteorFalls_B1F_1R_MapScripts::
	.byte 0

MeteorFalls_B1F_1R_EventScript_QuestResearcher::
	lock
	faceplayer
	goto_if_set FLAG_BIRCH_QUEST_METEOR, MeteorFalls_B1F_1R_EventScript_ResearcherPostQuest
	goto_if_unset FLAG_BIRCH_QUEST_WEATHER, MeteorFalls_B1F_1R_EventScript_ResearcherDefault
	goto_if_unset FLAG_BIRCH_QUEST_SLAB, MeteorFalls_B1F_1R_EventScript_ResearcherDefault
	goto_if_unset FLAG_BIRCH_QUEST_COZMO, MeteorFalls_B1F_1R_EventScript_ResearcherDefault
	msgbox MeteorFalls_B1F_1R_Text_ResearcherQuestActive, MSGBOX_DEFAULT
	giveitem ITEM_RARE_CANDY, 3
	setflag FLAG_BIRCH_QUEST_METEOR
	release
	end

MeteorFalls_B1F_1R_EventScript_ResearcherDefault::
	msgbox MeteorFalls_B1F_1R_Text_ResearcherDefault, MSGBOX_DEFAULT
	release
	end

MeteorFalls_B1F_1R_EventScript_ResearcherPostQuest::
	msgbox MeteorFalls_B1F_1R_Text_ResearcherPostQuest, MSGBOX_DEFAULT
	release
	end

MeteorFalls_B1F_1R_Text_ResearcherDefault:
	.string "I am studying the meteorite\n"
	.string "formations in this cave.\p"
	.string "The readings are unusual.\n"
	.string "Something deep underground\l"
	.string "is emitting energy.$"

MeteorFalls_B1F_1R_Text_ResearcherQuestActive:
	.string "{PLAYER}! Down here!\p"
	.string "I am PROF. BIRCH's research\n"
	.string "assistant. He sent me ahead\l"
	.string "when the data converged.\p"
	.string "Look at the cave wall.\n"
	.string "See that faint glow?\p"
	.string "That is the meteorite's\n"
	.string "core. Still embedded in\l"
	.string "the rock.\p"
	.string "And the GIBLE... they came\n"
	.string "all the way from SINNOH.\l"
	.string "Thousands of miles, across\l"
	.string "an ocean.\p"
	.string "They are gathered around\n"
	.string "the meteorite like it is\l"
	.string "a campfire. Drawn to it.\p"
	.string "This is the epicenter,\n"
	.string "{PLAYER}.\p"
	.string "The meteorite is not\n"
	.string "dangerous. It is more\l"
	.string "like... a heartbeat.\p"
	.string "The earth pulsing. And the\n"
	.string "POKeMON answered.\p"
	.string "Go tell PROF. BIRCH what\n"
	.string "we found. I will stay and\l"
	.string "document everything.\p"
	.string "Take these. You have\n"
	.string "earned them.$"

MeteorFalls_B1F_1R_Text_ResearcherPostQuest:
	.string "The GIBLE are still here.\n"
	.string "Three of them now, sleeping\l"
	.string "against the cave wall.\p"
	.string "I think this is their home\n"
	.string "now. HOENN is their home.$"
