---
name: Expansion Migration Planning
description: C40 research on pokeemerald-expansion migration. Decision: NOT migrating — staying on vanilla pokeemerald. Archived for reference.
type: reference
---

# Expansion Migration — Decision Record

**Decision (C41)**: NOT migrating to pokeemerald-expansion. Staying on vanilla pokeemerald.

**Why**: Vanilla and expansion are architecturally incompatible. The overlay approach (copy expansion onto vanilla) fails — BattleResources struct, battle AI, trainer format all completely different. Correct migration requires starting fresh from expansion and porting LoH content in. With 40+ cycles of customizations, this would cost 5-8 cycles minimum.

**What we did instead**: Implemented P/S split, Fairy type, and modern features directly in vanilla pokeemerald (C43-46). This gave us the gameplay benefits without the migration cost.

**Key lesson**: Research findings must be verified by searching the actual codebase. C40's claim that `COMPETITIVE_PARTY_SYNTAX` existed was a hallucination — it doesn't exist in expansion v1.15.0.

**If reconsidering**: Start from fresh expansion clone, port encounters/trainers/dialogue/QoL in. Budget 5-8 cycles. Trainer format conversion is the biggest task (`.party` files via `trainerproc` tool).
