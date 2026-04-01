TerraCave_Entrance_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, TerraCave_Entrance_OnTransition
	.byte 0

TerraCave_Entrance_OnTransition:
	setflag FLAG_ARRIVED_AT_TERRA_CAVE_ENTRANCE
	end

TerraCave_Entrance_EventScript_MagmaGrunt1::
	trainerbattle_single TRAINER_MAGMA_GRUNT_TERRA_CAVE_1, TerraCave_Entrance_Text_MagmaGrunt1Intro, TerraCave_Entrance_Text_MagmaGrunt1Defeat
	msgbox TerraCave_Entrance_Text_MagmaGrunt1PostBattle, MSGBOX_AUTOCLOSE
	end

TerraCave_Entrance_Text_MagmaGrunt1Intro:
	.string "You! How did you find this place?\n"
	.string "Team Magma won't be stopped!$"

TerraCave_Entrance_Text_MagmaGrunt1Defeat:
	.string "Grr... You're tougher than I thought...$"

TerraCave_Entrance_Text_MagmaGrunt1PostBattle:
	.string "Even after our leaders fell, we\n"
	.string "believed in their vision...$"

