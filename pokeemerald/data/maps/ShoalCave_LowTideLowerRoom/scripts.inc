ShoalCave_LowTideLowerRoom_MapScripts::
	map_script MAP_SCRIPT_ON_LOAD, ShoalCave_LowTideLowerRoom_OnLoad
	map_script MAP_SCRIPT_ON_TRANSITION, ShoalCave_LowTideLowerRoom_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, ShoalCave_LowTideLowerRoom_OnResume
	.byte 0

ShoalCave_LowTideLowerRoom_OnTransition:
	call_if_set FLAG_DEN_SHOAL_TRADE_DONE, ShoalCave_LowTideLowerRoom_EventScript_SailorAtPool
	EventMacro_StaticDenTransition FLAG_CAUGHT_SHOAL_CAVE_TITAN_MUDKIP, FLAG_TEMP_12
	end

@ C335: after the trade the sailor stands on the titan's own tile, watching the pool
ShoalCave_LowTideLowerRoom_EventScript_SailorAtPool::
	setobjectxyperm LOCALID_SHOAL_CAVE_LOWER_SAILOR, 18, 6
	setobjectmovementtype LOCALID_SHOAL_CAVE_LOWER_SAILOR, MOVEMENT_TYPE_FACE_DOWN
	return

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
	goto_if_set FLAG_DEN_SHOAL_TRADE_DONE, ShoalCave_LowTideLowerRoom_EventScript_TidePoolFish
	goto_if_set FLAG_CAUGHT_SHOAL_CAVE_TITAN_MUDKIP, ShoalCave_LowTideLowerRoom_EventScript_TidePoolStill
	msgbox ShoalCave_LowTideLowerRoom_Text_TidePool, MSGBOX_SIGN
	end

ShoalCave_LowTideLowerRoom_EventScript_TidePoolStill::
	msgbox ShoalCave_LowTideLowerRoom_Text_TidePoolStill, MSGBOX_SIGN
	end

ShoalCave_LowTideLowerRoom_EventScript_TidePoolFish::
	msgbox ShoalCave_LowTideLowerRoom_Text_TidePoolFish, MSGBOX_SIGN
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

ShoalCave_LowTideLowerRoom_Text_TidePoolStill:
	.string "A tide pool, no bigger\n"
	.string "than a washtub.\p"
	.string "Its water lies flat and\n"
	.string "still now.$"

ShoalCave_LowTideLowerRoom_Text_TidePoolFish:
	.string "A tide pool, no bigger\n"
	.string "than a washtub.\p"
	.string "A whiskered fish circles the\n"
	.string "salt water. It seems at home.$"

@ =============================================
@ C335: Red Ink page 6 - the trade believer (sailor MARLOW)
@ Trade chain copied from RustboroCity_House1_EventScript_Trader.
@ =============================================

ShoalCave_LowTideLowerRoom_EventScript_Sailor::
	lock
	goto_if_set FLAG_DEN_SHOAL_TRADE_DONE, ShoalCave_LowTideLowerRoom_EventScript_SailorDone  @ before faceplayer: he keeps watching the pool
	faceplayer
	goto_if_unset FLAG_CAUGHT_SHOAL_CAVE_TITAN_MUDKIP, ShoalCave_LowTideLowerRoom_EventScript_SailorWarn
	setvar VAR_0x8008, INGAME_TRADE_CORSOLA_HOENN
	copyvar VAR_0x8004, VAR_0x8008
	specialvar VAR_RESULT, GetInGameTradeSpeciesInfo
	copyvar VAR_0x8009, VAR_RESULT
	msgbox ShoalCave_LowTideLowerRoom_Text_SailorOffer, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, ShoalCave_LowTideLowerRoom_EventScript_SailorDecline
	special ChoosePartyMon
	waitstate
	copyvar VAR_0x800A, VAR_0x8004
	goto_if_eq VAR_0x8004, PARTY_NOTHING_CHOSEN, ShoalCave_LowTideLowerRoom_EventScript_SailorDecline
	copyvar VAR_0x8005, VAR_0x800A
	specialvar VAR_RESULT, GetTradeSpecies
	copyvar VAR_0x800B, VAR_RESULT
	goto_if_ne VAR_RESULT, VAR_0x8009, ShoalCave_LowTideLowerRoom_EventScript_SailorWrongMon
	copyvar VAR_0x8004, VAR_0x8008
	copyvar VAR_0x8005, VAR_0x800A
	special CreateInGameTradePokemon
	special DoInGameTradeScene
	waitstate
	setflag FLAG_DEN_SHOAL_TRADE_DONE
	applymovement LOCALID_SHOAL_CAVE_LOWER_SAILOR, Common_Movement_FaceRight
	waitmovement 0
	delay 30
	playse SE_PUDDLE
	waitse
	msgbox ShoalCave_LowTideLowerRoom_Text_SailorTraded, MSGBOX_DEFAULT
	release
	end

ShoalCave_LowTideLowerRoom_EventScript_SailorWarn::
	msgbox ShoalCave_LowTideLowerRoom_Text_SailorWarn, MSGBOX_DEFAULT
	release
	end

ShoalCave_LowTideLowerRoom_EventScript_SailorDecline::
	msgbox ShoalCave_LowTideLowerRoom_Text_SailorDecline, MSGBOX_DEFAULT
	release
	end

@ Ends on the Decline text so the Barboach directions reach players who offer the wrong mon too
ShoalCave_LowTideLowerRoom_EventScript_SailorWrongMon::
	bufferspeciesname STR_VAR_1, VAR_0x8009
	msgbox ShoalCave_LowTideLowerRoom_Text_SailorWrongMon, MSGBOX_DEFAULT
	goto ShoalCave_LowTideLowerRoom_EventScript_SailorDecline

ShoalCave_LowTideLowerRoom_EventScript_SailorDone::
	msgbox ShoalCave_LowTideLowerRoom_Text_SailorDone, MSGBOX_DEFAULT
	release
	end

ShoalCave_LowTideLowerRoom_Text_SailorWarn:
	.string "Forty years at sea, and the\n"
	.string "tide still brings me here.\p"
	.string "There's a child of the sea in\n"
	.string "that pool. Big as a SWAMPERT.\p"
	.string "It belongs to the sea. Not to\n"
	.string "some PROFESSOR's notebook.$"

ShoalCave_LowTideLowerRoom_Text_SailorOffer:
	.string "The pool's gone still. You\n"
	.string "took the sea's child, eh?\p"
	.string "I won't ask for it back.\n"
	.string "The sea keeps a fair ledger.\p"
	.string "A child of the streams for\n"
	.string "a child of the sea.\p"
	.string "Bring me a {STR_VAR_1}\n"
	.string "and take my {STR_VAR_2}.\p"
	.string "The sea weighs what you\n"
	.string "bring. Deal?$"

ShoalCave_LowTideLowerRoom_Text_SailorDecline:
	.string "Then the ledger stays open.\n"
	.string "The sea is patient. So am I.\p"
	.string "Whiskers swim the fresh water\n"
	.string "past FORTREE. You'll find it.$"

ShoalCave_LowTideLowerRoom_Text_SailorWrongMon:
	.string "That's no {STR_VAR_1}.\n"
	.string "The sea can tell. So can I.$"

ShoalCave_LowTideLowerRoom_Text_SailorTraded:
	.string "There. A river fish for the\n"
	.string "sea, and old coral for you.\p"
	.string "Funny. Your MUDKIP was a\n"
	.string "river child once, too.\l"
	.string "Then the tide raised it.\p"
	.string "Maybe nothing belongs to\n"
	.string "one water. I'll keep the pool.$"

ShoalCave_LowTideLowerRoom_Text_SailorDone:
	.string "Fresh or salt, the tide\n"
	.string "doesn't care. Took me forty\l"
	.string "years to see it.\p"
	.string "That shell she came with?\n"
	.string "The old salt by the mouth of\l"
	.string "the cave makes bells of them.$"
