@ =============================================
@ Event Macros — Reusable high-level script patterns
@ Created: Cycle 179
@ =============================================
@ These macros compose event.inc script commands into
@ common multi-line patterns used across map scripts.
@ Available to all data/maps/*/scripts.inc files.
@ =============================================

@ GlimpseEvent — One-shot coord_event (walk-over trigger)
@ Pattern: player steps on tile, sees exclamation + 2 messages, never repeats.
@ Used by migration glimpse events on Routes 101, 102, 104, 116.
@
@ prereq_flag: must be SET for event to fire (e.g., FLAG_ADVENTURE_STARTED)
@ glimpse_flag: SET after viewing to prevent repeat
@ text1: first message text label
@ text2: second message text label (shown after brief delay)
	.macro EventMacro_GlimpseEvent prereq_flag:req, glimpse_flag:req, text1:req, text2:req
	lock
	goto_if_unset \prereq_flag, .Lglimpse_end_\@
	goto_if_set \glimpse_flag, .Lglimpse_end_\@
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	msgbox \text1, MSGBOX_DEFAULT
	delay 20
	msgbox \text2, MSGBOX_DEFAULT
	setflag \glimpse_flag
.Lglimpse_end_\@:
	release
	end
	.endm

@ BadgeGateShow — Reveal hidden NPC and set weather after badge obtained
@ Pattern: called from OnTransition via call_if_set. Clears hide flag + sets weather.
@ Used by weather omen NPCs on Routes 111, 119, 120, 125.
@
@ Caller must first: setflag <hide_flag> (default hidden)
@ Then: call_if_set <badge_flag>, <label_using_this_macro>
@
@ hide_flag: NPC visibility flag to clear (making NPC appear)
@ weather_id: weather constant to set (e.g., WEATHER_SNOW, WEATHER_SANDSTORM)
	.macro EventMacro_BadgeGateShow hide_flag:req, weather_id:req
	setweather \weather_id
	doweather
	clearflag \hide_flag
	return
	.endm

@ ConditionalDialogue — Two-state NPC with flag-dependent text
@ Pattern: NPC says one thing before flag is set, different thing after.
@ Used by route identity NPCs and narrative-reactive NPCs.
@
@ flag: condition flag to check
@ text_before: text label shown when flag is NOT set
@ text_after: text label shown when flag IS set
	.macro EventMacro_ConditionalDialogue flag:req, text_before:req, text_after:req
	lock
	faceplayer
	goto_if_set \flag, .Lcond_after_\@
	msgbox \text_before, MSGBOX_DEFAULT
	goto .Lcond_end_\@
.Lcond_after_\@:
	msgbox \text_after, MSGBOX_DEFAULT
.Lcond_end_\@:
	release
	end
	.endm
