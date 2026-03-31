SeafloorCavern_Room9_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, SeafloorCavern_Room9_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, SeafloorCavern_Room9_OnResume
	.byte 0

SeafloorCavern_Room9_OnTransition:
	call SeafloorCavern_Room9_EventScript_TryShowPrimalKyogre
	end

SeafloorCavern_Room9_EventScript_TryShowPrimalKyogre::
	goto_if_set FLAG_CAUGHT_PRIMAL_KYOGRE, SeafloorCavern_Room9_EventScript_HidePrimalKyogre
	goto_if_set FLAG_DEFEATED_PRIMAL_KYOGRE, SeafloorCavern_Room9_EventScript_HidePrimalKyogre
	goto_if_unset FLAG_ALL_SIGNS_REPORTED, SeafloorCavern_Room9_EventScript_HidePrimalKyogre
	goto_if_unset FLAG_SEAFLOOR_CAVERN_INVESTIGATED, SeafloorCavern_Room9_EventScript_HidePrimalKyogre
	clearflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_KYOGRE
	setvar VAR_TEMP_1, 0
	return

SeafloorCavern_Room9_EventScript_HidePrimalKyogre::
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_KYOGRE
	setvar VAR_TEMP_1, 1
	return

SeafloorCavern_Room9_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, SeafloorCavern_Room9_EventScript_TryRemoveKyogre
	end

SeafloorCavern_Room9_EventScript_TryRemoveKyogre::
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_ne VAR_RESULT, B_OUTCOME_CAUGHT, Common_EventScript_NopReturn
	removeobject LOCALID_SEAFLOOR_CAVERN_KYOGRE
	return

@ === Deep-Sea Researcher (Primal Stirring investigation) ===

SeafloorCavern_Room9_EventScript_DeepSeaResearcher::
	lock
	faceplayer
	goto_if_set FLAG_SEAFLOOR_CAVERN_INVESTIGATED, SeafloorCavern_Room9_EventScript_DeepSeaResearcherShort
	msgbox SeafloorCavern_Room9_Text_DeepSeaResearcherFull, MSGBOX_DEFAULT
	setflag FLAG_SEAFLOOR_CAVERN_INVESTIGATED
	release
	end

SeafloorCavern_Room9_EventScript_DeepSeaResearcherShort::
	msgbox SeafloorCavern_Room9_Text_DeepSeaResearcherShort, MSGBOX_DEFAULT
	release
	end

SeafloorCavern_Room9_Text_DeepSeaResearcherFull:
	.string "The ocean currents have reversed\n"
	.string "in the cavern depths!\p"
	.string "Species that haven't been seen\n"
	.string "at this depth in centuries are\l"
	.string "emerging from the abyss.\p"
	.string "This matches the ancient texts -\n"
	.string "KYOGRE's domain is awakening.\p"
	.string "PROF. BIRCH must hear of this!\n"
	.string "The primal tides are rising!$"

SeafloorCavern_Room9_Text_DeepSeaResearcherShort:
	.string "The water pressure keeps\n"
	.string "fluctuating. Something massive\l"
	.string "is moving in the deep.$"

SeafloorCavern_Room9_EventScript_ArchieAwakenKyogre::
	lockall
	setvar VAR_0x8004, LOCALID_SEAFLOOR_CAVERN_ARCHIE
	setvar VAR_0x8005, LOCALID_SEAFLOOR_CAVERN_MAXIE
	setvar VAR_0x8006, LOCALID_SEAFLOOR_CAVERN_GRUNT_1
	setvar VAR_0x8007, LOCALID_SEAFLOOR_CAVERN_GRUNT_2
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	applymovement LOCALID_PLAYER, SeafloorCavern_Room9_Movement_Delay32
	waitmovement 0
	playbgm MUS_ENCOUNTER_AQUA, FALSE
	msgbox SeafloorCavern_Room9_Text_ArchieHoldItRightThere, MSGBOX_DEFAULT
	closemessage
	addobject VAR_0x8004
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	applymovement VAR_0x8004, SeafloorCavern_Room9_Movement_ArchieApproachPlayer
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_ArchieSoItWasYou, MSGBOX_DEFAULT
	applymovement VAR_0x8004, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_ArchieBeholdKyogre, MSGBOX_DEFAULT
	applymovement VAR_0x8004, Common_Movement_FacePlayer
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_ArchieYouMustDisappear, MSGBOX_DEFAULT
	trainerbattle_no_intro TRAINER_ARCHIE, SeafloorCavern_Room9_Text_ArchieDefeat
	msgbox SeafloorCavern_Room9_Text_ArchieWithThisRedOrb, MSGBOX_DEFAULT
	setweather WEATHER_NONE
	doweather
	special Script_FadeOutMapMusic
	waitstate
	msgbox SeafloorCavern_Room9_Text_RedOrbShinesByItself, MSGBOX_DEFAULT
	special WaitWeather
	waitstate
	setvar VAR_RESULT, 1
	playse SE_M_DETECT
	dofieldeffectsparkle 16, 42, 0
	waitfieldeffect FLDEFF_SPARKLE
	closemessage
	setvar VAR_RESULT, 0
	playfanfare MUS_AWAKEN_LEGEND
	playse SE_ORB
	special DoOrbEffect
	applymovement VAR_0x8004, Common_Movement_WalkInPlaceFasterUp
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	delay 150
	removeobject LOCALID_SEAFLOOR_CAVERN_KYOGRE_SLEEPING
	addobject LOCALID_SEAFLOOR_CAVERN_KYOGRE
	waitstate
	delay 60
	applymovement LOCALID_SEAFLOOR_CAVERN_KYOGRE, SeafloorCavern_Room9_Movement_KyogreApproach
	waitmovement 0
	special FadeOutOrbEffect
	waitstate
	setvar VAR_0x8004, 1  @ vertical pan
	setvar VAR_0x8005, 1  @ horizontal pan
	setvar VAR_0x8006, 8  @ num shakes
	setvar VAR_0x8007, 5  @ shake delay
	special ShakeCamera
	waitstate
	applymovement LOCALID_SEAFLOOR_CAVERN_KYOGRE, SeafloorCavern_Room9_Movement_KyogreExit
	waitmovement 0
	removeobject LOCALID_SEAFLOOR_CAVERN_KYOGRE
	delay 4
	setvar VAR_0x8004, 2  @ vertical pan
	setvar VAR_0x8005, 2  @ horizontal pan
	setvar VAR_0x8006, 8  @ num shakes
	setvar VAR_0x8007, 5  @ shake delay
	special ShakeCamera
	waitstate
	delay 30
	setvar VAR_0x8004, LOCALID_SEAFLOOR_CAVERN_ARCHIE
	setvar VAR_0x8005, LOCALID_SEAFLOOR_CAVERN_MAXIE
	setvar VAR_0x8006, LOCALID_SEAFLOOR_CAVERN_GRUNT_1
	setvar VAR_0x8007, LOCALID_SEAFLOOR_CAVERN_GRUNT_2
	msgbox SeafloorCavern_Room9_Text_ArchieWhereDidKyogreGo, MSGBOX_DEFAULT
	playse SE_PC_LOGIN
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_ArchieAMessageFromOutside, MSGBOX_DEFAULT
	closemessage
	applymovement VAR_0x8004, SeafloorCavern_Room9_Movement_ArchieListenMessage
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_ArchieWhatRainingTooHard, MSGBOX_DEFAULT
	closemessage
	playse SE_PC_OFF
	delay 20
	applymovement VAR_0x8004, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_ArchieWhyDidKyogreDisappear, MSGBOX_DEFAULT
	closemessage
	addobject VAR_0x8005
	addobject VAR_0x8006
	addobject VAR_0x8007
	applymovement VAR_0x8007, SeafloorCavern_Room9_Movement_MagmaGruntArrive
	applymovement VAR_0x8006, SeafloorCavern_Room9_Movement_MagmaGruntArrive
	applymovement VAR_0x8005, SeafloorCavern_Room9_Movement_MaxieArrive
	waitmovement 0
	applymovement VAR_0x8004, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_MaxieWhatHaveYouWrought, MSGBOX_DEFAULT
	playse SE_PIN
	applymovement VAR_0x8004, Common_Movement_ExclamationMark
	waitmovement 0
	applymovement VAR_0x8004, Common_Movement_Delay48
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_ArchieDontGetAllHighAndMighty, MSGBOX_DEFAULT
	msgbox SeafloorCavern_Room9_Text_MaxieWeDontHaveTimeToArgue, MSGBOX_DEFAULT
	closemessage
	applymovement VAR_0x8005, SeafloorCavern_Room9_Movement_MaxieExit
	applymovement VAR_0x8004, SeafloorCavern_Room9_Movement_ArchieExit
	waitmovement 0
	msgbox SeafloorCavern_Room9_Text_MaxieComeOnPlayer, MSGBOX_DEFAULT
	setvar VAR_ROUTE128_STATE, 1
	setvar VAR_SOOTOPOLIS_CITY_STATE, 1
	clearflag FLAG_HIDE_SOOTOPOLIS_CITY_STEVEN
	clearflag FLAG_HIDE_SOOTOPOLIS_CITY_ARCHIE
	clearflag FLAG_HIDE_SOOTOPOLIS_CITY_MAXIE
	clearflag FLAG_HIDE_SOOTOPOLIS_CITY_RESIDENTS
	clearflag FLAG_HIDE_SOOTOPOLIS_CITY_GROUDON
	clearflag FLAG_HIDE_SOOTOPOLIS_CITY_KYOGRE
	setflag FLAG_HIDE_SOOTOPOLIS_CITY_MAN_1
	setflag FLAG_LEGENDARIES_IN_SOOTOPOLIS
	clearflag FLAG_HIDE_ROUTE_128_ARCHIE
	clearflag FLAG_HIDE_ROUTE_128_MAXIE
	setflag FLAG_SYS_WEATHER_CTRL
	setflag FLAG_KYOGRE_ESCAPED_SEAFLOOR_CAVERN
	setflag FLAG_HIDE_MOSSDEEP_CITY_STEVENS_HOUSE_STEVEN
	setvar VAR_STEVENS_HOUSE_STATE, 2
	setvar VAR_SEAFLOOR_CAVERN_STATE, 1
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_ARCHIE
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_MAXIE
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_MAGMA_GRUNTS
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_KYOGRE
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_AQUA_GRUNTS
	setflag FLAG_HIDE_MAP_NAME_POPUP
	warp MAP_ROUTE128, 38, 22
	waitstate
	releaseall
	end

SeafloorCavern_Room9_Movement_ArchieApproachPlayer:
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	step_end

SeafloorCavern_Room9_Movement_Unused1:
	walk_left
	walk_left
	step_end

SeafloorCavern_Room9_Movement_ArchieListenMessage:
	walk_left
	delay_16
	step_end

SeafloorCavern_Room9_Movement_Unused2:
	walk_right
	step_end

SeafloorCavern_Room9_Movement_ArchieExit:
	face_up
	lock_facing_direction
	walk_down
	unlock_facing_direction
	walk_in_place_faster_right
	step_end

SeafloorCavern_Room9_Movement_KyogreApproach:
	delay_16
	delay_16
	walk_slow_down
	delay_16
	delay_16
	delay_16
	walk_slow_down
	delay_16
	delay_16
	delay_16
	step_end

SeafloorCavern_Room9_Movement_KyogreExit:
	slide_up
	slide_up
	step_end

SeafloorCavern_Room9_Movement_MaxieArrive:
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	step_end

SeafloorCavern_Room9_Movement_MaxieExit:
	walk_right
	walk_right
	step_end

SeafloorCavern_Room9_Movement_MagmaGruntArrive:
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	step_end

SeafloorCavern_Room9_Movement_Delay32:
	delay_16
	delay_16
	step_end

SeafloorCavern_Room9_Text_ArchieHoldItRightThere:
	.string "ARCHIE: Hold it right there.$"

SeafloorCavern_Room9_Text_ArchieSoItWasYou:
	.string "ARCHIE: Fufufu…\n"
	.string "So it was you, after all.$"

SeafloorCavern_Room9_Text_ArchieBeholdKyogre:
	.string "ARCHIE: Behold!\p"
	.string "See how beautiful it is, the sleeping\n"
	.string "form of the ancient POKéMON KYOGRE!\p"
	.string "I have waited so long for this day to\n"
	.string "come…$"

SeafloorCavern_Room9_Text_ArchieYouMustDisappear:
	.string "Don't you see what the migration\n"
	.string "means? The sea is reclaiming\l"
	.string "Hoenn -- and it is BEAUTIFUL!\p"
	.string "The ocean migrants have nowhere\l"
	.string "to go because humans took the land!\n"
	.string "Kyogre will restore the balance!$"

SeafloorCavern_Room9_Text_ArchieDefeat:
	.string "What?!\n"
	.string "I lost to a mere child like you?!$"

SeafloorCavern_Room9_Text_ArchieWithThisRedOrb:
	.string "Even in defeat... I have\n"
	.string "already won.\p"
	.string "The migration will not stop\n"
	.string "until someone has the courage\l"
	.string "to act. I am that someone.\p"
	.string "With this RED ORB, I will\n"
	.string "call forth KYOGRE. The ocean\l"
	.string "will expand. The world will\l"
	.string "change. It has to.\p"
	.string "Nothing can stop me now.$"

SeafloorCavern_Room9_Text_RedOrbShinesByItself:
	.string "The RED ORB suddenly began shining\n"
	.string "by itself!$"

SeafloorCavern_Room9_Text_ArchieWhereDidKyogreGo:
	.string "ARCHIE: What?!\p"
	.string "I didn't do anything.\n"
	.string "Why did the RED ORB…\p"
	.string "Where did KYOGRE go?$"

SeafloorCavern_Room9_Text_ArchieAMessageFromOutside:
	.string "ARCHIE: Hm? It's a message from our\n"
	.string "members outside…$"

SeafloorCavern_Room9_Text_ArchieWhatRainingTooHard:
	.string "ARCHIE: Yes, what is it?\p"
	.string "Hm…\n"
	.string "It's raining heavily?\p"
	.string "Good… That should have happened.\n"
	.string "That is why we awakened KYOGRE,\l"
	.string "to realize TEAM AQUA's vision of\l"
	.string "expanding the sea.\p"
	.string "What?!\p"
	.string "It's raining far harder than we\n"
	.string "envisioned? You're in danger?\p"
	.string "That can't be…\n"
	.string "That's just not possible…\p"
	.string "Hold your position and monitor\n"
	.string "the situation!$"

SeafloorCavern_Room9_Text_ArchieWhyDidKyogreDisappear:
	.string "ARCHIE: There's something wrong…\p"
	.string "The RED ORB is supposed to awaken\n"
	.string "and control KYOGRE…\p"
	.string "But… Why?\n"
	.string "Why did KYOGRE disappear?\p"
	.string "Why?!$"

SeafloorCavern_Room9_Text_MaxieWhatHaveYouWrought:
	.string "MAXIE: What have you wrought?\p"
	.string "ARCHIE… You've finally awoken KYOGRE,\n"
	.string "haven't you?\p"
	.string "What will happen to the world if this\n"
	.string "downpour continues for all eternity?\p"
	.string "The world's landmass will drown in\n"
	.string "the deepening sea…$"

SeafloorCavern_Room9_Text_ArchieDontGetAllHighAndMighty:
	.string "ARCHIE: W-what?!\n"
	.string "Don't get all high and mighty with me!\p"
	.string "Wasn't it you, TEAM MAGMA, that\n"
	.string "infuriated GROUDON?\p"
	.string "So long as I have this RED ORB,\n"
	.string "I should be able to control KYOGRE…\p"
	.string "I should be able to control it…$"

SeafloorCavern_Room9_Text_MaxieWeDontHaveTimeToArgue:
	.string "MAXIE: We don't have the time to\n"
	.string "argue about it here!\p"
	.string "Get outside and see for yourself!\p"
	.string "See if what you've wrought is the\n"
	.string "world that we desired!$"

SeafloorCavern_Room9_Text_MaxieComeOnPlayer:
	.string "MAXIE: {PLAYER}, come on, you have\n"
	.string "to get out of here, too!$"

@ === Primal Kyogre Encounter (v6.0 Primal Awakening) ===

SeafloorCavern_Room9_EventScript_PrimalKyogre::
	lockall
	setvar VAR_TEMP_1, 1
	applymovement LOCALID_PLAYER, Common_Movement_FaceUp
	waitmovement 0
	setweather WEATHER_RAIN
	doweather
	playse SE_M_HYDRO_PUMP
	setvar VAR_0x8004, 2
	setvar VAR_0x8005, 1
	setvar VAR_0x8006, 6
	setvar VAR_0x8007, 2
	special ShakeCamera
	waitstate
	delay 20
	msgbox SeafloorCavern_Room9_Text_PrimalKyogreAwakens, MSGBOX_DEFAULT
	playmoncry SPECIES_KYOGRE, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	setvar VAR_LAST_TALKED, LOCALID_SEAFLOOR_CAVERN_KYOGRE
	setwildbattle SPECIES_KYOGRE, 70
	setflag FLAG_SYS_CTRL_OBJ_DELETE
	special BattleSetup_StartLegendaryBattle
	waitstate
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, SeafloorCavern_Room9_EventScript_PrimalKyogreDefeated
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, SeafloorCavern_Room9_EventScript_PrimalKyogreFled
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, SeafloorCavern_Room9_EventScript_PrimalKyogreFled
	@ Caught
	setflag FLAG_CAUGHT_PRIMAL_KYOGRE
	setweather WEATHER_NONE
	doweather
	msgbox SeafloorCavern_Room9_Text_KyogreCaught, MSGBOX_DEFAULT
	releaseall
	end

SeafloorCavern_Room9_EventScript_PrimalKyogreDefeated::
	setflag FLAG_DEFEATED_PRIMAL_KYOGRE
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_KYOGRE
	setweather WEATHER_NONE
	doweather
	msgbox SeafloorCavern_Room9_Text_KyogreFled, MSGBOX_DEFAULT
	releaseall
	end

SeafloorCavern_Room9_EventScript_PrimalKyogreFled::
	setflag FLAG_DEFEATED_PRIMAL_KYOGRE
	setflag FLAG_HIDE_SEAFLOOR_CAVERN_ROOM_9_KYOGRE
	setweather WEATHER_NONE
	doweather
	msgbox SeafloorCavern_Room9_Text_KyogreFled, MSGBOX_DEFAULT
	releaseall
	end

SeafloorCavern_Room9_Text_PrimalKyogreAwakens:
	.string "The cavern floods with surging water!\n"
	.string "A deafening roar echoes from the\l"
	.string "depths as ancient power awakens...$"

SeafloorCavern_Room9_Text_KyogreCaught:
	.string "The churning waters grow calm.\n"
	.string "The crushing pressure lifts.\p"
	.string "The sea basin POKéMON rests within\n"
	.string "your POKé BALL, its endless\l"
	.string "tempest finally stilled.$"

SeafloorCavern_Room9_Text_KyogreFled:
	.string "The waters recede slowly.\n"
	.string "The ancient presence fades...\p"
	.string "But the ocean still churns\n"
	.string "with restless energy.$"

@ === Team Aqua Remnant Trainers (C123) ===

SeafloorCavern_Room9_EventScript_AquaGrunt1::
	trainerbattle_single TRAINER_AQUA_GRUNT_SEAFLOOR_1, SeafloorCavern_Room9_Text_AquaGrunt1Intro, SeafloorCavern_Room9_Text_AquaGrunt1Defeat
	msgbox SeafloorCavern_Room9_Text_AquaGrunt1Post, MSGBOX_AUTOCLOSE
	end

SeafloorCavern_Room9_Text_AquaGrunt1Intro:
	.string "The ocean called us back here.\n"
	.string "KYOGRE's presence is undeniable!\p"
	.string "TEAM AQUA's dream lives on!$"

SeafloorCavern_Room9_Text_AquaGrunt1Defeat:
	.string "The current swept me away...$"

SeafloorCavern_Room9_Text_AquaGrunt1Post:
	.string "We came to witness KYOGRE's\n"
	.string "return. The tides are changing\l"
	.string "whether you like it or not.$"

SeafloorCavern_Room9_EventScript_AquaGrunt2::
	trainerbattle_single TRAINER_AQUA_GRUNT_SEAFLOOR_2, SeafloorCavern_Room9_Text_AquaGrunt2Intro, SeafloorCavern_Room9_Text_AquaGrunt2Defeat
	msgbox SeafloorCavern_Room9_Text_AquaGrunt2Post, MSGBOX_AUTOCLOSE
	end

SeafloorCavern_Room9_Text_AquaGrunt2Intro:
	.string "Can you feel it? The water pressure\n"
	.string "is rising. Something ancient is\l"
	.string "waking up down here!$"

SeafloorCavern_Room9_Text_AquaGrunt2Defeat:
	.string "You're strong... but the sea\n"
	.string "is stronger.$"

SeafloorCavern_Room9_Text_AquaGrunt2Post:
	.string "ARCHIE always said the ocean\n"
	.string "would reclaim what was taken.\l"
	.string "Maybe he was right all along.$"

SeafloorCavern_Room9_EventScript_AquaAdmin::
	trainerbattle_single TRAINER_AQUA_ADMIN_SEAFLOOR, SeafloorCavern_Room9_Text_AquaAdminIntro, SeafloorCavern_Room9_Text_AquaAdminDefeat
	msgbox SeafloorCavern_Room9_Text_AquaAdminPost, MSGBOX_AUTOCLOSE
	end

SeafloorCavern_Room9_Text_AquaAdminIntro:
	.string "I'm AMBER, Admin of TEAM AQUA.\p"
	.string "The migration proved ARCHIE right.\n"
	.string "The ocean is alive and angry.\p"
	.string "KYOGRE will rise again, and this\n"
	.string "time, nothing will stop it!$"

SeafloorCavern_Room9_Text_AquaAdminDefeat:
	.string "You fight like the sea itself...\n"
	.string "Relentless.$"

SeafloorCavern_Room9_Text_AquaAdminPost:
	.string "KYOGRE doesn't need our help\n"
	.string "to awaken. The primal stirring\l"
	.string "is bigger than any of us.\p"
	.string "Are you prepared for what waits\n"
	.string "in the deepest chamber?$"
