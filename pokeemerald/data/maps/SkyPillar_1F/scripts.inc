SkyPillar_1F_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, SkyPillar_1F_OnTransition
	.byte 0

SkyPillar_1F_OnTransition:
	call_if_lt VAR_SKY_PILLAR_STATE, 2, SkyPillar_1F_EventScript_CleanFloor
	end

SkyPillar_1F_EventScript_CleanFloor::
	setmaplayoutindex LAYOUT_SKY_PILLAR_1F_CLEAN
	return

SkyPillar_1F_EventScript_AncientMural::
	lockall
	msgbox SkyPillar_1F_Text_AncientMural, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_1F_Text_AncientMural:
	.string "Ancient text is carved into the wall...\p"
	.string "We, the Draconid people, raised this\n"
	.string "tower to reach the sky.\p"
	.string "When the land cracked and the seas\n"
	.string "swallowed the shore, we looked upward.\p"
	.string "Stone by stone, we built a stairway\n"
	.string "to the one who watches above.$"

