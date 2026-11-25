GraniteCave_B2F_MapScripts::
	map_script MAP_SCRIPT_ON_RESUME, GraniteCave_B2F_OnResume
	map_script MAP_SCRIPT_ON_FRAME_TABLE, GraniteCave_B2F_OnFrame
	.byte 0

@ C396: page 3 ink cue (First Ink or pen sound)
GraniteCave_B2F_OnResume:
	setvar VAR_0x8004, 3
	specialvar VAR_TEMP_7, GetFieldNotesInkCue
	end

GraniteCave_B2F_OnFrame:
	map_script_2 VAR_TEMP_7, 1, GraniteCave_B2F_EventScript_FirstInk
	map_script_2 VAR_TEMP_7, 2, GraniteCave_B2F_EventScript_PenScratch
	.2byte 0

GraniteCave_B2F_EventScript_FirstInk::
	setvar VAR_0x8004, 3
	goto FieldNotes_EventScript_FirstInk

GraniteCave_B2F_EventScript_PenScratch::
	setvar VAR_0x8004, 3
	goto FieldNotes_EventScript_PenScratch
