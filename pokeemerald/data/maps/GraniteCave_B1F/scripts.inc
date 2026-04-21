GraniteCave_B1F_MapScripts::
	map_script MAP_SCRIPT_ON_FRAME_TABLE, CaveHole_CheckFallDownHole
	map_script MAP_SCRIPT_ON_TRANSITION, CaveHole_FixCrackedGround
	map_script MAP_SCRIPT_ON_RESUME, GraniteCave_B1F_SetHoleWarp
	.byte 0

GraniteCave_B1F_SetHoleWarp:
	setstepcallback STEP_CB_CRACKED_FLOOR
	setholewarp MAP_GRANITE_CAVE_B2F
	end

GraniteCave_B1F_EventScript_CaveHiker::
	lock
	faceplayer
	msgbox GraniteCave_B1F_Text_CaveHiker, MSGBOX_DEFAULT
	release
	end

GraniteCave_B1F_Text_CaveHiker:
	.string "Watch your step below.\p"
	.string "The deeper chambers are wetter\n"
	.string "than any cave I've been in.\p"
	.string "I keep hearing something\n"
	.string "clicking against the stone.$"
