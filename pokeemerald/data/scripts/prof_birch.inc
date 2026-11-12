ProfBirch_EventScript_UpdateLocation::
	goto_if_eq VAR_PETALBURG_GYM_STATE, 0, Common_EventScript_NopReturn
	goto_if_set FLAG_SYS_GAME_CLEAR, ProfBirch_EventScript_MoveToLab
	call_if_eq VAR_BIRCH_STATE, 0, ProfBirch_EventScript_MoveToLab
	call_if_eq VAR_BIRCH_STATE, 1, ProfBirch_EventScript_MoveToLab
	call_if_eq VAR_BIRCH_STATE, 2, ProfBirch_EventScript_MoveToRoute101
	call_if_eq VAR_BIRCH_STATE, 3, ProfBirch_EventScript_MoveToRoute101
	call_if_eq VAR_BIRCH_STATE, 4, ProfBirch_EventScript_MoveToRoute103
	call_if_eq VAR_BIRCH_STATE, 5, ProfBirch_EventScript_MoveToRoute103
	call_if_eq VAR_BIRCH_STATE, 6, ProfBirch_EventScript_MoveToLab
	call_if_eq VAR_BIRCH_STATE, 7, ProfBirch_EventScript_MoveToLab
	return

ProfBirch_EventScript_MoveToLab::
	clearflag FLAG_HIDE_LITTLEROOT_TOWN_BIRCHS_LAB_BIRCH
	clearflag FLAG_HIDE_LITTLEROOT_TOWN_BIRCHS_LAB_UNKNOWN_0x380
	setflag FLAG_HIDE_ROUTE_101_BIRCH
	setflag FLAG_HIDE_ROUTE_103_BIRCH
	return

ProfBirch_EventScript_MoveToRoute101::
	clearflag FLAG_HIDE_ROUTE_101_BIRCH
	setflag FLAG_HIDE_LITTLEROOT_TOWN_BIRCHS_LAB_BIRCH
	setflag FLAG_HIDE_LITTLEROOT_TOWN_BIRCHS_LAB_UNKNOWN_0x380
	setflag FLAG_HIDE_ROUTE_103_BIRCH
	return

ProfBirch_EventScript_MoveToRoute103::
	clearflag FLAG_HIDE_ROUTE_103_BIRCH
	setflag FLAG_HIDE_ROUTE_101_BIRCH
	setflag FLAG_HIDE_LITTLEROOT_TOWN_BIRCHS_LAB_BIRCH
	setflag FLAG_HIDE_LITTLEROOT_TOWN_BIRCHS_LAB_UNKNOWN_0x380
	return

ProfBirch_EventScript_RatePokedexOrRegister::
	lock
	faceplayer
	call_if_unset FLAG_RECEIVED_FIELD_NOTES, ProfBirch_EventScript_GiveFieldNotesLate
	goto_if_unset FLAG_HAS_MATCH_CALL, ProfBirch_EventScript_AskRatePokedex
	goto_if_unset FLAG_ENABLE_PROF_BIRCH_MATCH_CALL, EventScript_RegisterProfBirch

ProfBirch_EventScript_AskRatePokedex::
	msgbox gBirchDexRatingText_AreYouCurious, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, ProfBirch_EventScript_DeclineRating
	call ProfBirch_EventScript_RatePokedex
	call ProfBirch_EventScript_FieldNotes
	call ProfBirch_EventScript_RedInkReport
	release
	end

@ C319 Birch Field Notes: ids match the enum in src/match_call.c (0 Torchic, 1 Mudkip, 2 Treecko, 3 all found, 4 any)
ProfBirch_EventScript_FieldNotes::
	setvar VAR_0x8004, 4
	specialvar VAR_RESULT, IsBirchFieldNoteActive
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_NopReturn
	msgbox gBirchFieldNoteText_Header, MSGBOX_DEFAULT
	setvar VAR_0x8004, 0
	specialvar VAR_RESULT, IsBirchFieldNoteActive
	call_if_eq VAR_RESULT, TRUE, ProfBirch_EventScript_FieldNoteTorchic
	setvar VAR_0x8004, 1
	specialvar VAR_RESULT, IsBirchFieldNoteActive
	call_if_eq VAR_RESULT, TRUE, ProfBirch_EventScript_FieldNoteMudkip
	setvar VAR_0x8004, 2
	specialvar VAR_RESULT, IsBirchFieldNoteActive
	call_if_eq VAR_RESULT, TRUE, ProfBirch_EventScript_FieldNoteTreecko
	setvar VAR_0x8004, 3
	specialvar VAR_RESULT, IsBirchFieldNoteActive
	call_if_eq VAR_RESULT, TRUE, ProfBirch_EventScript_FieldNoteAllFound
	return

ProfBirch_EventScript_FieldNoteTorchic::
	msgbox gBirchFieldNoteText_Torchic, MSGBOX_DEFAULT
	return

ProfBirch_EventScript_FieldNoteMudkip::
	msgbox gBirchFieldNoteText_Mudkip, MSGBOX_DEFAULT
	return

ProfBirch_EventScript_FieldNoteTreecko::
	msgbox gBirchFieldNoteText_Treecko, MSGBOX_DEFAULT
	return

ProfBirch_EventScript_FieldNoteAllFound::
	msgbox gBirchFieldNoteText_AllFound, MSGBOX_DEFAULT
	return

@ C331 Red Ink payoff: 3+ FIELD NOTES pages inked (no flag; text built by BufferBirchRedInkReport in src/match_call.c)
ProfBirch_EventScript_RedInkReport::
	specialvar VAR_RESULT, BufferBirchRedInkReport
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_NopReturn
	msgbox gStringVar4, MSGBOX_DEFAULT
	return

ProfBirch_EventScript_DeclineRating::
	msgbox gBirchDexRatingText_Cancel, MSGBOX_DEFAULT
	release
	end

ProfBirch_EventScript_ShowRatingMessage::
	copyvar VAR_0x8004, VAR_0x8009
	special ShowPokedexRatingMessage
	waitmessage
	waitbuttonpress
	return

ProfBirch_EventScript_RatePokedex::
	setvar VAR_0x8004, 0
	specialvar VAR_RESULT, ScriptGetPokedexInfo
	copyvar VAR_0x8008, VAR_0x8005
	copyvar VAR_0x8009, VAR_0x8006
	copyvar VAR_0x800A, VAR_RESULT
	buffernumberstring STR_VAR_1, VAR_0x8008  @ Num Hoenn seen
	buffernumberstring STR_VAR_2, VAR_0x8009  @ Num Hoenn caught
	msgbox gBirchDexRatingText_SoYouveSeenAndCaught, MSGBOX_DEFAULT
	call ProfBirch_EventScript_ShowRatingMessage
	goto_if_eq VAR_0x800A, 0, Common_EventScript_NopReturn  @ National dex not enabled
	setvar VAR_0x8004, 1
	specialvar VAR_RESULT, ScriptGetPokedexInfo
	copyvar VAR_0x8008, VAR_0x8005
	copyvar VAR_0x8009, VAR_0x8006
	buffernumberstring STR_VAR_1, VAR_0x8008  @ Num National seen
	buffernumberstring STR_VAR_2, VAR_0x8009  @ Num National caught
	msgbox gBirchDexRatingText_OnANationwideBasis, MSGBOX_DEFAULT
	return

@ C324 late FIELD NOTES for saves already past the Pokedex scene
ProfBirch_EventScript_GiveFieldNotesLate::
	goto_if_unset FLAG_RECEIVED_POKEDEX_FROM_BIRCH, Common_EventScript_NopReturn
	msgbox ProfBirch_Text_FieldNotesLate, MSGBOX_DEFAULT
	giveitem ITEM_FIELD_NOTES
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_NopReturn
	setflag FLAG_RECEIVED_FIELD_NOTES
	msgbox LittlerootTown_ProfessorBirchsLab_Text_FieldNotesExplain, MSGBOX_DEFAULT
	return

ProfBirch_Text_FieldNotesLate:
	.string "PROF. BIRCH: Oh! Before I forget,\n"
	.string "{PLAYER}{KUN}, take my old FIELD NOTES.$"

@ C324 FIELD NOTES key item: pages built by BufferFieldNotesPage (src/match_call.c); 0 cover, 1-7 pages, 8 last page
FieldNotes_EventScript_Read::
	lockall
	setvar VAR_0x8004, 0
	specialvar VAR_RESULT, BufferFieldNotesPage
	msgbox gStringVar4, MSGBOX_DEFAULT
	setvar VAR_0x8004, 1
	call FieldNotes_EventScript_ShowPage
	setvar VAR_0x8004, 2
	call FieldNotes_EventScript_ShowPage
	setvar VAR_0x8004, 3
	call FieldNotes_EventScript_ShowPage
	setvar VAR_0x8004, 4
	call FieldNotes_EventScript_ShowPage
	setvar VAR_0x8004, 5
	call FieldNotes_EventScript_ShowPage
	setvar VAR_0x8004, 6
	call FieldNotes_EventScript_ShowPage
	setvar VAR_0x8004, 7
	call FieldNotes_EventScript_ShowPage
	setvar VAR_0x8004, 8
	call FieldNotes_EventScript_ShowPage
	releaseall
	end

FieldNotes_EventScript_ShowPage::
	specialvar VAR_RESULT, BufferFieldNotesPage
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_NopReturn
	playse SE_DEX_PAGE
	msgbox gStringVar4, MSGBOX_DEFAULT
	return

@ C361 v3.3 First Ink: armed from ON_RESUME (VAR_0x8004 = page species), shown from ON_FRAME
@ (map_script_2 VAR_TEMP_7, 1). Route102 (page 1) and PetalburgWoods (page 2) scripts.inc hook it.
FieldNotes_EventScript_ArmFirstInk::
	goto_if_set FLAG_FIELD_NOTES_FIRST_INK, Common_EventScript_NopReturn
	goto_if_unset FLAG_RECEIVED_FIELD_NOTES, Common_EventScript_NopReturn
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_NopReturn
	setvar VAR_TEMP_7, 1
	return

@ VAR_0x8004 = page id (1 or 2). The flag is set first, so the cue can never repeat.
@ msgbox <label> expands into gStringVar4, so the ink is buffered after the open line.
FieldNotes_EventScript_FirstInk::
	lockall
	setflag FLAG_FIELD_NOTES_FIRST_INK
	setvar VAR_TEMP_7, 0
	copyvar VAR_0x8005, VAR_0x8004
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	msgbox FieldNotes_Text_FirstInkOpen, MSGBOX_DEFAULT
	copyvar VAR_0x8004, VAR_0x8005
	specialvar VAR_RESULT, BufferFieldNotesInk
	playse SE_DEX_PAGE
	msgbox gStringVar4, MSGBOX_DEFAULT
	specialvar VAR_RESULT, TryRegisterFieldNotesToSelect
	call_if_eq VAR_RESULT, TRUE, FieldNotes_EventScript_FirstInkSelect
	call_if_eq VAR_RESULT, FALSE, FieldNotes_EventScript_FirstInkPocket
	releaseall
	end

FieldNotes_EventScript_FirstInkSelect::
	msgbox FieldNotes_Text_FirstInkSelect, MSGBOX_DEFAULT
	return

FieldNotes_EventScript_FirstInkPocket::
	msgbox FieldNotes_Text_FirstInkPocket, MSGBOX_DEFAULT
	return

FieldNotes_Text_FirstInkOpen::
	.string "{PLAYER} opened FIELD NOTES\n"
	.string "and took out a pen.$"

FieldNotes_Text_FirstInkSelect::
	.string "{PLAYER} kept FIELD NOTES\n"
	.string "ready on SELECT.$"

FieldNotes_Text_FirstInkPocket::
	.string "{PLAYER} put FIELD NOTES back\n"
	.string "in the KEY ITEMS pocket.$"
