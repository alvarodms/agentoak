# Discovery Beats (visible static encounters + environmental cues)

Pattern: a visible overworld Pokémon (OBJ_EVENT_GFX_*_DOLL stand-in) that becomes a one-time static battle, hinted by optional sign-type bg_event "cues". Recipe in codebase-facts.md → "Static Encounter Recipe".

| File | Change | Cycle | Notes |
|------|--------|-------|-------|
| `include/constants/flags.h` | `FLAG_UNUSED_0x2B5` → `FLAG_HIDE_MT_PYRE_STARLIGHT_TORCHIC` (0x2B5) | **312** | Set ONLY on catch. Next free flag: 0x2B6 |
| `data/maps/MtPyre_Exterior/map.json` | +object TORCHIC_DOLL at (22,13) elev 3, FACE_DOWN, flag FLAG_HIDE_MT_PYRE_STARLIGHT_TORCHIC; +sign bg_event ScorchMark at (11,31) (rock beside the 2-wide x=9-10 corridor, sunny lower half); +sign FrostPrints at (27,21) (rock next to fog trigger (26,21)) | **312** | (22,13) sits in a 6-wide fog area (rows 12-14), doesn't block summit warps (19/20,10) or item ball (27,15) |
| `data/maps/MtPyre_Exterior/scripts.inc` | +ON_RESUME (TryRemoveStarlightTorchic), +StarlightTorchic static (SPECIES_TORCHIC_HOENN Lv30 @ ITEM_STAR_PIECE), +Faded branch (won/ran/teleported → Common_EventScript_RemoveStaticPokemon, flag NOT set so it returns on next map load), +ScorchMark/FrostPrints MSGBOX_SIGN texts | **312** | Coral Mourner (earlier cycle) untouched. No faceplayer: doll sprite is single-frame |

Map also has Torchic_Hoenn as a 4% wild slot (C279, wild-encounters.md); the static is the visible, guaranteed route.

Future beats using the same pattern (strategy-notes roadmap): Meteor Falls crystal Treecko den, Shoal Cave titan Mudkip den.
