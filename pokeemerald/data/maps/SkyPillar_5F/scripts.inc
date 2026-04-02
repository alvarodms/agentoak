SkyPillar_5F_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, SkyPillar_5F_OnTransition
	.byte 0

SkyPillar_5F_OnTransition:
	call_if_lt VAR_SKY_PILLAR_STATE, 2, SkyPillar_5F_EventScript_CleanFloor
	return

SkyPillar_5F_EventScript_CleanFloor::
	setmaplayoutindex LAYOUT_SKY_PILLAR_5F_CLEAN
	return

SkyPillar_5F_EventScript_AncientMural::
	lockall
	msgbox SkyPillar_5F_Text_AncientMural, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_5F_Text_AncientMural:
	.string "The final mural glows faintly, as if\n"
	.string "the stone itself remembers...\p"
	.string "The sky split open. A piercing cry\n"
	.string "echoed across the world.\p"
	.string "The Guardian descended on winds that\n"
	.string "silenced the earth and calmed the sea.\p"
	.string "It sleeps now at the summit, waiting\n"
	.string "for the next time it is needed.\p"
	.string "...The air above you feels heavy\n"
	.string "with ancient power.$"

