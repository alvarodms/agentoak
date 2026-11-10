Route113_MapScripts::
	map_script MAP_SCRIPT_ON_LOAD, Route113_OnLoad
	map_script MAP_SCRIPT_ON_RESUME, Route113_OnResume
	map_script MAP_SCRIPT_ON_TRANSITION, Route113_OnTransition
	.byte 0

@ C356 v3.2 T1 "The ring in the ash": after the credits, once ELLIS is beaten, the six tiles around the
@ pair load as trodden grass and never grow back into ash. Nothing marks it. 38,5 / 38,6 (where they
@ stand) stay ash so neither gets the tall-grass overlay. Map load only: no waits, no redraw.
Route113_OnLoad:
	goto_if_unset FLAG_SYS_GAME_CLEAR, Route113_EventScript_OnLoadEnd
	goto_if_not_defeated TRAINER_ROUTE113_ASH_CAMPER, Route113_EventScript_OnLoadEnd
	setmetatile 38, 4, METATILE_Fallarbor_NormalGrass, FALSE
	setmetatile 37, 5, METATILE_Fallarbor_NormalGrass, FALSE
	setmetatile 39, 5, METATILE_Fallarbor_NormalGrass, FALSE
	setmetatile 37, 6, METATILE_Fallarbor_NormalGrass, FALSE
	setmetatile 39, 6, METATILE_Fallarbor_NormalGrass, FALSE
	setmetatile 38, 7, METATILE_Fallarbor_NormalGrass, FALSE
Route113_EventScript_OnLoadEnd:
	end

Route113_OnResume:
	setstepcallback STEP_CB_ASH
	end

@ C330 Red Ink page 4: the picnicker waits by the warm rocks while she trusts BIRCH's page;
@ once VULPIX_HOENN is caught she stands out in the open ash, face to the sky.
Route113_OnTransition:
	clearflag FLAG_FORCE_MIRAGE_TOWER_VISIBLE
	call Route113_EventScript_CheckSetAshWeather
	EventMacro_DexBelieverPlace SPECIES_VULPIX_HOENN, LOCALID_ROUTE113_ASH_PICNICKER, 38, 6, MOVEMENT_TYPE_FACE_UP
	call Route113_EventScript_SetupAshCamper
	end

Route113_EventScript_CheckSetAshWeather::
	getplayerxy VAR_TEMP_0, VAR_TEMP_1
	goto_if_lt VAR_TEMP_0, 19, Route113_EventScript_DontSetAshWeather
	goto_if_gt VAR_TEMP_0, 84, Route113_EventScript_DontSetAshWeather
	setweather WEATHER_VOLCANIC_ASH
	return

Route113_EventScript_DontSetAshWeather::
	return

@ C350 v3.1 Beat C: after the credits, once VULPIX_HOENN is caught, ELLIS (Camper) trains his foxes in the
@ ash facing the picnicker; once beaten, both face east side by side. No setweather: the ash stays grey.
@ Global (::) so check_playtest R5 can find the label.
Route113_EventScript_SetupAshCamper::
	setflag FLAG_HIDE_ROUTE113_ASH_CAMPER
	goto_if_unset FLAG_SYS_GAME_CLEAR, Route113_EventScript_SetupAshCamperEnd
	setvar VAR_0x8004, SPECIES_VULPIX_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_ne VAR_RESULT, TRUE, Route113_EventScript_SetupAshCamperEnd
	clearflag FLAG_HIDE_ROUTE113_ASH_CAMPER
	call_if_defeated TRAINER_ROUTE113_ASH_CAMPER, Route113_EventScript_AshPairWatches
Route113_EventScript_SetupAshCamperEnd:
	return

Route113_EventScript_AshPairWatches:
	setobjectmovementtype LOCALID_ROUTE113_ASH_CAMPER, MOVEMENT_TYPE_FACE_RIGHT
	setobjectmovementtype LOCALID_ROUTE113_ASH_PICNICKER, MOVEMENT_TYPE_FACE_RIGHT
	return

Route113_EventScript_AshCamper::
	lock
	goto_if_defeated TRAINER_ROUTE113_ASH_CAMPER, Route113_EventScript_AshCamperDone
	faceplayer
	msgbox Route113_Text_AshCamperInk, MSGBOX_DEFAULT
	msgbox Route113_Text_AshCamperRule, MSGBOX_DEFAULT
	trainerbattle_no_intro TRAINER_ROUTE113_ASH_CAMPER, Route113_Text_AshCamperDefeat
	goto Route113_EventScript_AshCamperDone
	end

Route113_EventScript_AshCamperDone::
	faceplayer
	msgbox Route113_Text_AshCamperNext, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE113_ASH_CAMPER, Common_Movement_FaceRight
	applymovement LOCALID_ROUTE113_ASH_PICNICKER, Common_Movement_FaceRight
	waitmovement 0
	release
	end

Route113_EventScript_Gentleman::
	msgbox Route113_Text_AshCanBeFashionedIntoGlass, MSGBOX_NPC
	end

Route113_EventScript_NinjaBoy::
	msgbox Route113_Text_FunWalkingThroughAsh, MSGBOX_NPC
	end

Route113_EventScript_RouteSign111::
	msgbox Route113_Text_RouteSign111, MSGBOX_SIGN
	end

Route113_EventScript_RouteSignFallarbor::
	msgbox Route113_Text_RouteSignFallarbor, MSGBOX_SIGN
	end

Route113_EventScript_GlassWorkshopSign::
	msgbox Route113_Text_GlassWorkshopSign, MSGBOX_SIGN
	end

Route113_EventScript_TrainerTipsRegisterKeyItems::
	msgbox Route113_Text_TrainerTipsRegisterKeyItems, MSGBOX_SIGN
	end

Route113_EventScript_Jaylen::
	trainerbattle_single TRAINER_JAYLEN, Route113_Text_JaylenIntro, Route113_Text_JaylenDefeat
	msgbox Route113_Text_JaylenPostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Dillon::
	trainerbattle_single TRAINER_DILLON, Route113_Text_DillonIntro, Route113_Text_DillonDefeat
	msgbox Route113_Text_DillonPostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Madeline::
	trainerbattle_single TRAINER_MADELINE_1, Route113_Text_MadelineIntro, Route113_Text_MadelineDefeat, Route113_EventScript_RegisterMadeline
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route113_EventScript_RematchMadeline
	msgbox Route113_Text_MadelinePostBattle, MSGBOX_DEFAULT
	release
	end

Route113_EventScript_RegisterMadeline::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route113_Text_MadelineRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_MADELINE_1
	release
	end

Route113_EventScript_RematchMadeline::
	trainerbattle_rematch TRAINER_MADELINE_1, Route113_Text_MadelineRematchIntro, Route113_Text_MadelineRematchDefeat
	msgbox Route113_Text_MadelinePostRematch, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Lao::
	trainerbattle_single TRAINER_LAO_1, Route113_Text_LaoIntro, Route113_Text_LaoDefeat, Route113_EventScript_RegisterLao
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route113_EventScript_RematchLao
	msgbox Route113_Text_LaoPostBattle, MSGBOX_DEFAULT
	release
	end

Route113_EventScript_RegisterLao::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route113_Text_LaoRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_LAO_1
	release
	end

Route113_EventScript_RematchLao::
	trainerbattle_rematch TRAINER_LAO_1, Route113_Text_LaoRematchIntro, Route113_Text_LaoRematchDefeat
	msgbox Route113_Text_LaoPostRematch, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Lung::
	trainerbattle_single TRAINER_LUNG, Route113_Text_LungIntro, Route113_Text_LungDefeat
	msgbox Route113_Text_LungPostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Tori::
	trainerbattle_double TRAINER_TORI_AND_TIA, Route113_Text_ToriIntro, Route113_Text_ToriDefeat, Route113_Text_ToriNotEnoughMons
	msgbox Route113_Text_ToriPostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Tia::
	trainerbattle_double TRAINER_TORI_AND_TIA, Route113_Text_TiaIntro, Route113_Text_TiaDefeat, Route113_Text_TiaNotEnoughMons
	msgbox Route113_Text_TiaPostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Sophie::
	trainerbattle_single TRAINER_SOPHIE, Route113_Text_SophieIntro, Route113_Text_SophieDefeat
	msgbox Route113_Text_SophiePostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Coby::
	trainerbattle_single TRAINER_COBY, Route113_Text_CobyIntro, Route113_Text_CobyDefeat
	msgbox Route113_Text_CobyPostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Lawrence::
	trainerbattle_single TRAINER_LAWRENCE, Route113_Text_LawrenceIntro, Route113_Text_LawrenceDefeat
	msgbox Route113_Text_LawrencePostBattle, MSGBOX_AUTOCLOSE
	end

Route113_EventScript_Wyatt::
	trainerbattle_single TRAINER_WYATT, Route113_Text_WyattIntro, Route113_Text_WyattDefeat
	msgbox Route113_Text_WyattPostBattle, MSGBOX_AUTOCLOSE
	end

Route113_Text_AshCanBeFashionedIntoGlass:
	.string "I collect volcanic ash up here.\n"
	.string "It is good for making Pokeblocks.\p"
	.string "But these days I share the path with\n"
	.string "Magmar who act like they own it.\p"
	.string "One melted my Pokeblock mold right\n"
	.string "off my belt. Did not even look\l"
	.string "apologetic.$"

Route113_Text_FunWalkingThroughAsh:
	.string "It's fun walking through the volcano's\n"
	.string "ashes on the ground and grass.\p"
	.string "You can see where you walked--it's\n"
	.string "really neat!$"

Route113_Text_RouteSign111:
	.string "ROUTE 113\n"
	.string "{RIGHT_ARROW} ROUTE 111$"

Route113_Text_RouteSignFallarbor:
	.string "ROUTE 113\n"
	.string "{LEFT_ARROW} FALLARBOR TOWN$"

Route113_Text_TrainerTipsRegisterKeyItems:
	.string "TRAINER TIPS\p"
	.string "You may register one of the KEY ITEMS\n"
	.string "in your BAG as SELECT.\p"
	.string "Simply press SELECT to use\n"
	.string "the registered item conveniently.$"

Route113_Text_GlassWorkshopSign:
	.string "GLASS WORKSHOP\n"
	.string "“Turning Volcanic Ash into Glass Items”$"


Route113_EventScript_Volcanologist::
	msgbox Route113_Text_Volcanologist, MSGBOX_NPC
	end

Route113_Text_Volcanologist:
	.string "My seismograph readings have tripled\n"
	.string "since last month. MT. CHIMNEY is\l"
	.string "venting far more ash than normal.\p"
	.string "It started around the same time those\n"
	.string "unfamiliar species began arriving.\l"
	.string "Coincidence? I'm not so sure.$"

Route113_EventScript_FrostTracker::
	msgbox Route113_Text_FrostTracker, MSGBOX_NPC
	end

Route113_Text_FrostTracker:
	.string "I've been tracking frost crystals\n"
	.string "in the falling ash for weeks.\p"
	.string "Something lives up here that\n"
	.string "shouldn't -- a pale VULPIX.\p"
	.string "An ICE-type, on a volcano route!\p"
	.string "The ash seems to nourish them\n"
	.string "somehow. Their fur glistens\l"
	.string "like fresh snow.$"

Route113_EventScript_AshPicnicker::
	lock
	faceplayer
	setvar VAR_0x8004, SPECIES_VULPIX_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_eq VAR_RESULT, TRUE, Route113_EventScript_AshPicnickerShown
	msgbox Route113_Text_AshPicnickerWaiting, MSGBOX_DEFAULT
	specialvar VAR_RESULT, CountInkedFieldNotePages
	call_if_ge VAR_RESULT, 2, Route113_EventScript_AshPicnickerRumour
	closemessage
	applymovement LOCALID_ROUTE113_ASH_PICNICKER, Common_Movement_FaceOriginalDirection
	waitmovement 0
	release
	end

Route113_EventScript_AshPicnickerRumour::
	msgbox Route113_Text_AshPicnickerRumour, MSGBOX_DEFAULT
	return

Route113_EventScript_AshPicnickerShown::
	goto_if_unset FLAG_HIDE_ROUTE113_ASH_CAMPER, Route113_EventScript_AshPicnickerWithCamper
	playse SE_PIN
	applymovement LOCALID_ROUTE113_ASH_PICNICKER, Common_Movement_ExclamationMark
	waitmovement 0
	msgbox Route113_Text_AshPicnickerShowAgain, MSGBOX_DEFAULT
	msgbox Route113_Text_AshPicnickerThreeDays, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE113_ASH_PICNICKER, Common_Movement_FaceUp
	waitmovement 0
	msgbox Route113_Text_AshPicnickerLaugh, MSGBOX_DEFAULT
	release
	end

Route113_EventScript_AshPicnickerWithCamper:
	goto_if_defeated TRAINER_ROUTE113_ASH_CAMPER, Route113_EventScript_AshPicnickerWatching
	msgbox Route113_Text_AshPicnickerCamper, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE113_ASH_PICNICKER, Common_Movement_FaceUp
	waitmovement 0
	release
	end

Route113_EventScript_AshPicnickerWatching:
	msgbox Route113_Text_AshPicnickerWatching, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE113_ASH_PICNICKER, Common_Movement_FaceRight
	waitmovement 0
	release
	end

Route113_Text_AshPicnickerWaiting:
	.string "PROF. BIRCH wrote it down!\n"
	.string "VULPIX love heat.\p"
	.string "So I'm sitting by the warmest\n"
	.string "rocks on the whole route.\p"
	.string "Three days now!\n"
	.string "Any minute. Any minute!$"

Route113_Text_AshPicnickerRumour:
	.string "Oh! Have you heard? Some kid\n"
	.string "with a red pen is going around\l"
	.string "arguing with the PROFESSOR.\p"
	.string "Can you imagine?$"

Route113_Text_AshPicnickerShowAgain:
	.string "…Wait. Is that a VULPIX?\n"
	.string "Show me again! Again!$"

Route113_Text_AshPicnickerThreeDays:
	.string "Cold fur! In the ash!\p"
	.string "I sat by those rocks\n"
	.string "for THREE DAYS!$"

Route113_Text_AshPicnickerLaugh:
	.string "Ahaha! Ahahahaha!$"

Route113_Text_AshCamperInk:
	.string "Cold fur in the falling ash.\n"
	.string "It's in red. We train here!$"

Route113_Text_AshCamperRule:
	.string "If it hails, my foxes\n"
	.string "won't even feel it!$"

Route113_Text_AshCamperDefeat:
	.string "Brr! You run colder\n"
	.string "than we do!$"

Route113_Text_AshCamperNext:
	.string "Same time tomorrow,\n"
	.string "right here in the ash!$"

Route113_Text_AshPicnickerCamper:
	.string "He brought his VULPIX up\n"
	.string "here to train in the ash!\p"
	.string "Go on! Battle him!$"

Route113_Text_AshPicnickerWatching:
	.string "Cold fur in the ash, every\n"
	.string "day. And I get to watch!$"
