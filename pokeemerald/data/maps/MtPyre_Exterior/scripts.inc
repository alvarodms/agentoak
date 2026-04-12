MtPyre_Exterior_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, MtPyre_Exterior_OnTransition
	.byte 0

MtPyre_Exterior_OnTransition:
	call MtPyre_Exterior_EventScript_CheckEnterFromSummit
	end

MtPyre_Exterior_EventScript_CheckEnterFromSummit::
	getplayerxy VAR_TEMP_0, VAR_TEMP_1
	goto_if_lt VAR_TEMP_1, 12, MtPyre_Exterior_EventScript_EnterFromSummit
	return

MtPyre_Exterior_EventScript_EnterFromSummit::
	setweather WEATHER_FOG_HORIZONTAL
	return

MtPyre_Exterior_EventScript_FogTrigger::
	setweather WEATHER_FOG_HORIZONTAL
	doweather
	end

MtPyre_Exterior_EventScript_SunTrigger::
	setweather WEATHER_SUNNY
	doweather
	end

MtPyre_Exterior_EventScript_CoralMourner::
	msgbox MtPyre_Exterior_Text_CoralMourner, MSGBOX_NPC
	end

MtPyre_Exterior_Text_CoralMourner:
	.string "Have you seen the pale coral near\n"
	.string "the graves? It wasn't here before\l"
	.string "the migration.\p"
	.string "PHOEBE says they're spirits of\n"
	.string "coral that didn't survive the\l"
	.string "crossing.\p"
	.string "I find them beautiful, in a\n"
	.string "mournful sort of way.$"

