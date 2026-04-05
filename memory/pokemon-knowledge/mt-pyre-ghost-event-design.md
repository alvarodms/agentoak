# Mt. Pyre Ghost Event Design — Misdreavus Colony

**Cycle**: 154 | **Status**: IMPLEMENTED

---

## Implementation Summary
- Lv34 Misdreavus with Spell Tag held item on Mt. Pyre Summit
- Pyre Keeper NPC (OBJ_EVENT_GFX_OLD_WOMAN) at (20,25), approaches via walk_right x2
- ShakeCamera + SE_M_CONFUSE_RAY atmospheric effects, Misdreavus cries
- Gated on FLAG_BADGE06_GET, one-shot via FLAG_MT_PYRE_GHOST_EVENT (0x281)
- Post-battle dialogue teases Cave of Origin / Sootopolis (Primal Stirring arc)
