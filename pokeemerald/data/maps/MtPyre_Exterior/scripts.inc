MtPyre_Exterior_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, MtPyre_Exterior_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, MtPyre_Exterior_OnResume
	.byte 0

MtPyre_Exterior_OnTransition:
	call MtPyre_Exterior_EventScript_CheckEnterFromSummit
	end

MtPyre_Exterior_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, MtPyre_Exterior_EventScript_TryRemoveStarlightTorchic
	end

MtPyre_Exterior_EventScript_TryRemoveStarlightTorchic::
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_ne VAR_RESULT, B_OUTCOME_CAUGHT, Common_EventScript_NopReturn
	removeobject VAR_LAST_TALKED
	return

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

@ =============================================
@ C312: Discovery beat - the starlight Torchic
@ =============================================

MtPyre_Exterior_EventScript_StarlightTorchic::
	lock
	msgbox MtPyre_Exterior_Text_StarlightTorchicApproach, MSGBOX_DEFAULT
	playmoncry SPECIES_TORCHIC_HOENN, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	setwildbattle SPECIES_TORCHIC_HOENN, 30, ITEM_STAR_PIECE
	setflag FLAG_SYS_CTRL_OBJ_DELETE
	dowildbattle
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, MtPyre_Exterior_EventScript_StarlightTorchicFaded
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, MtPyre_Exterior_EventScript_StarlightTorchicFaded
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, MtPyre_Exterior_EventScript_StarlightTorchicFaded
	setflag FLAG_HIDE_MT_PYRE_STARLIGHT_TORCHIC
	msgbox MtPyre_Exterior_Text_StarlightTorchicCaught, MSGBOX_DEFAULT
	release
	end

MtPyre_Exterior_EventScript_StarlightTorchicFaded::
	msgbox MtPyre_Exterior_Text_StarlightTorchicFaded, MSGBOX_DEFAULT
	goto Common_EventScript_RemoveStaticPokemon
	end

MtPyre_Exterior_EventScript_ScorchMark::
	msgbox MtPyre_Exterior_Text_ScorchMark, MSGBOX_SIGN
	end

MtPyre_Exterior_EventScript_FrostPrints::
	msgbox MtPyre_Exterior_Text_FrostPrints, MSGBOX_SIGN
	end

MtPyre_Exterior_Text_StarlightTorchicApproach:
	.string "A TORCHIC...? Up here?\p"
	.string "No... its feathers aren't orange.\n"
	.string "They shine like cold starlight.$"

MtPyre_Exterior_Text_StarlightTorchicCaught:
	.string "The fog thins for a moment.\p"
	.string "Above the summit, a few stars\n"
	.string "are shining in broad daylight.$"

MtPyre_Exterior_Text_StarlightTorchicFaded:
	.string "The starlight scatters into\n"
	.string "the fog...\p"
	.string "Perhaps it will return once\n"
	.string "the mist settles again.$"

MtPyre_Exterior_Text_ScorchMark:
	.string "A pale scorch mark streaks\n"
	.string "across the rock.\p"
	.string "It's cold to the touch.\n"
	.string "The ash drifts uphill, not down.$"

MtPyre_Exterior_Text_FrostPrints:
	.string "Tiny three-toed prints are\n"
	.string "pressed into the frost.\p"
	.string "Each one glows faintly...\n"
	.string "then fades. They lead into\l"
	.string "the fog.$"

