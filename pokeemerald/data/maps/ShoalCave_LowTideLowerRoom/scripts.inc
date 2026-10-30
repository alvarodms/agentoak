ShoalCave_LowTideLowerRoom_MapScripts::
	map_script MAP_SCRIPT_ON_LOAD, ShoalCave_LowTideLowerRoom_OnLoad
	map_script MAP_SCRIPT_ON_TRANSITION, ShoalCave_LowTideLowerRoom_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, ShoalCave_LowTideLowerRoom_OnResume
	.byte 0

ShoalCave_LowTideLowerRoom_OnTransition:
	EventMacro_StaticDenTransition FLAG_CAUGHT_SHOAL_CAVE_TITAN_MUDKIP, FLAG_TEMP_12
	end

ShoalCave_LowTideLowerRoom_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, ShoalCave_LowTideLowerRoom_EventScript_TryRemoveTitanMudkip
	end

ShoalCave_LowTideLowerRoom_EventScript_TryRemoveTitanMudkip::
	EventMacro_StaticDenTryRemove

ShoalCave_LowTideLowerRoom_OnLoad:
	call ShoalCave_LowTideLowerRoom_EventScript_SetShoalItemMetatiles
	end

ShoalCave_LowTideLowerRoom_EventScript_SetShoalItemMetatiles::
	goto_if_set FLAG_RECEIVED_SHOAL_SALT_4, ShoalCave_LowTideLowerRoom_EventScript_SetShoalItemMetatilesEnd
	setmetatile 18, 2, METATILE_Cave_ShoalCave_DirtPile_Large, TRUE
	return

ShoalCave_LowTideLowerRoom_EventScript_SetShoalItemMetatilesEnd::
	return

ShoalCave_LowTideLowerRoom_EventScript_ShoalSalt4::
	lockall
	goto_if_set FLAG_RECEIVED_SHOAL_SALT_4, ShoalCave_LowTideLowerRoom_EventScript_ReceivedShoalSalt
	giveitem ITEM_SHOAL_SALT
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	setmetatile 18, 2, METATILE_Cave_ShoalCave_DirtPile_Small, FALSE
	special DrawWholeMapView
	setflag FLAG_RECEIVED_SHOAL_SALT_4
	releaseall
	end

ShoalCave_LowTideLowerRoom_EventScript_ReceivedShoalSalt::
	msgbox ShoalCave_Text_WasShoalSaltNowNothing, MSGBOX_DEFAULT
	releaseall
	end

ShoalCave_LowTideLowerRoom_EventScript_BlackBelt::
	lock
	faceplayer
	goto_if_set FLAG_RECEIVED_FOCUS_BAND, ShoalCave_LowTideLowerRoom_EventScript_ReceivedFocusBand
	msgbox ShoalCave_LowTideLowerRoom_Text_CanOvercomeColdWithFocus, MSGBOX_DEFAULT
	giveitem ITEM_FOCUS_BAND
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	setflag FLAG_RECEIVED_FOCUS_BAND
	release
	end

ShoalCave_LowTideLowerRoom_EventScript_ReceivedFocusBand::
	msgbox ShoalCave_LowTideLowerRoom_Text_EverythingStartsWithFocus, MSGBOX_DEFAULT
	release
	end

ShoalCave_LowTideLowerRoom_Text_CanOvercomeColdWithFocus:
	.string "The penetrating cold around these\n"
	.string "parts is an impediment to training.\p"
	.string "But with focus, one can overcome!\p"
	.string "With this FOCUS BAND, buckle down and\n"
	.string "withstand the cold!$"

ShoalCave_LowTideLowerRoom_Text_EverythingStartsWithFocus:
	.string "Everything starts with focus!$"

@ =============================================
@ C318: Discovery beat - the titan Mudkip
@ =============================================

ShoalCave_LowTideLowerRoom_EventScript_TitanMudkip::
	EventMacro_StaticDen SPECIES_MUDKIP_HOENN, 38, ITEM_SHELL_BELL, FLAG_CAUGHT_SHOAL_CAVE_TITAN_MUDKIP, ShoalCave_LowTideLowerRoom_Text_TitanMudkipApproach, ShoalCave_LowTideLowerRoom_Text_TitanMudkipCaught, ShoalCave_LowTideLowerRoom_Text_TitanMudkipFaded

ShoalCave_LowTideLowerRoom_EventScript_TidePool::
	msgbox ShoalCave_LowTideLowerRoom_Text_TidePool, MSGBOX_SIGN
	end

ShoalCave_LowTideLowerRoom_Text_TitanMudkipApproach:
	.string "The tide pool shivers.\n"
	.string "Then something rises from it.\p"
	.string "A MUDKIP...? No...\n"
	.string "It's as big as a SWAMPERT,\l"
	.string "and its fin is ringed like\l"
	.string "an old shell.\p"
	.string "It never needed to change.\n"
	.string "The tide raised it instead.$"

ShoalCave_LowTideLowerRoom_Text_TitanMudkipCaught:
	.string "The tide pool falls still.\p"
	.string "Far off, you hear the sea\n"
	.string "turn back toward the cave.$"

ShoalCave_LowTideLowerRoom_Text_TitanMudkipFaded:
	.string "The MUDKIP slips back into\n"
	.string "the pool without a ripple...\p"
	.string "The next low tide may\n"
	.string "bring it back.$"

ShoalCave_LowTideLowerRoom_Text_TidePool:
	.string "A tide pool, no bigger\n"
	.string "than a washtub.\p"
	.string "It stirs below the surface,\n"
	.string "though no wave reaches it.$"
