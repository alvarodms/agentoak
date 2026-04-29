EventScript_RepelWoreOff::
	msgbox Text_RepelWoreOff, MSGBOX_DEFAULT
	special Special_FindBestRepelInBag
	goto_if_eq VAR_RESULT, 0, EventScript_RepelWoreOff_End
	copyvar VAR_0x8004, VAR_RESULT
	bufferitemname STR_VAR_1, VAR_0x8004
	msgbox Text_RepelUseAnother, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, EventScript_RepelWoreOff_End
	special Special_UseRepelFromBag
	msgbox Text_RepelUsedAnother, MSGBOX_DEFAULT
EventScript_RepelWoreOff_End:
	end

Text_RepelWoreOff:
	.string "REPEL's effect wore off…$"

Text_RepelUseAnother:
	.string "Would you like to use another\n{STR_VAR_1}?$"

Text_RepelUsedAnother:
	.string "{PLAYER} used the {STR_VAR_1}.$"
