SkyPillar_3F_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, SkyPillar_3F_OnTransition
	.byte 0

SkyPillar_3F_OnTransition:
	call_if_lt VAR_SKY_PILLAR_STATE, 2, SkyPillar_3F_EventScript_CleanFloor
	end

SkyPillar_3F_EventScript_CleanFloor::
	setmaplayoutindex LAYOUT_SKY_PILLAR_3F_CLEAN
	return

SkyPillar_3F_EventScript_AncientMural::
	lockall
	msgbox SkyPillar_3F_Text_AncientMural, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_3F_Text_AncientMural:
	.string "A faded mural depicts three great\n"
	.string "creatures...\p"
	.string "One of land, wreathed in molten fire.\n"
	.string "One of sea, crowned by endless storms.\p"
	.string "And above them both, a serpent of\n"
	.string "emerald light, coiled in the sky.\p"
	.string "Where the two clashed, the third\n"
	.string "descended... and there was silence.$"

SkyPillar_3F_EventScript_DraconidKaelen::
	trainerbattle_single TRAINER_DRACONID_KAELEN, SkyPillar_3F_Text_DraconidKaelenIntro, SkyPillar_3F_Text_DraconidKaelenDefeat, SkyPillar_3F_EventScript_DraconidKaelenPostBattle
	msgbox SkyPillar_3F_Text_DraconidKaelenPostBattle2, MSGBOX_DEFAULT
	end

SkyPillar_3F_EventScript_DraconidKaelenPostBattle:
	msgbox SkyPillar_3F_Text_DraconidKaelenPostBattle1, MSGBOX_DEFAULT
	giveitem ITEM_DRAGON_SCALE
	setflag FLAG_HIDE_SKY_PILLAR_DRACONID
	end

SkyPillar_3F_Text_DraconidKaelenIntro:
	.string "Hold, traveler.\p"
	.string "I am Kaelen, last of the Draconid\n"
	.string "guardians who watch over this tower.\p"
	.string "The stones beneath your feet were\n"
	.string "laid by my ancestors, long ago.\p"
	.string "If you seek the Guardian above,\n"
	.string "you must first prove your worth.$"

SkyPillar_3F_Text_DraconidKaelenDefeat:
	.string "...The dragons have spoken.\n"
	.string "You carry a worthy spirit.$"

SkyPillar_3F_Text_DraconidKaelenPostBattle1:
	.string "The Guardian sleeps at the summit.\p"
	.string "It wields winds that silence all\n"
	.string "weather. No rain, no sun, no sand\l"
	.string "can stand against it.\p"
	.string "And beware its speed... it strikes\n"
	.string "before you can think to react.\p"
	.string "Take this. You have earned it.$"

SkyPillar_3F_Text_DraconidKaelenPostBattle2:
	.string "Go. The summit awaits.\p"
	.string "I have waited many years for someone\n"
	.string "worthy to make the climb.\p"
	.string "Do not make me regret my judgment.$"

