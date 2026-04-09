@ Difficulty-Aware Dialogue Macro
@ Convenience wrapper for NPC dialogue that branches on Challenge Mode.
@ Reduces the 12-line difficulty-branching pattern to a single call.
@
@ Usage:
@   EventMacro_DifficultyDialogue NormalText, ChallengeText
@
@ Equivalent to:
@   EventMacro_ConditionalDialogue FLAG_DIFFICULTY_CHALLENGE, NormalText, ChallengeText
@
@ The macro handles lock, faceplayer, branching, release, and end.
@ Use for NPCs whose sole purpose is difficulty-mode commentary.

	.macro EventMacro_DifficultyDialogue text_normal:req, text_challenge:req
	lock
	faceplayer
	goto_if_set FLAG_DIFFICULTY_CHALLENGE, .Ldiff_challenge_\@
	msgbox \text_normal, MSGBOX_DEFAULT
	goto .Ldiff_end_\@
.Ldiff_challenge_\@:
	msgbox \text_challenge, MSGBOX_DEFAULT
.Ldiff_end_\@:
	release
	end
	.endm
