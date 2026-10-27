# New Species — Completed Work

> Collapsed C310 maintenance. 40 custom species, all verified 27/27 (C308). Per-cycle detail in git history.

## Roster (ID · type · source)

| ID | Species | Type | Source / Notes |
|---|---|---|---|
| 412-413 | Riolu → Lucario | Fight → Fight/Steel | R116 8% Lv8-10, friendship evo (C60-70) |
| 414 | Weavile | Dark/Ice | Mt Pyre Summit 4% Lv32-33; Sneasel Lv40 |
| 415-417 | Gible → Gabite → Garchomp | Dragon/Ground | Meteor Falls B1F_1R 2%; Gabite VR B2F 2% Lv44-46; Garchomp evo only |
| 418 | Corsola_Hoenn | Ghost/Rock | Pacifidlog Quest 1 Lv45; Phoebe R1. Rock Head/Levitate |
| 419-420 | Growlithe_H → Arcanine_H | Water → Water/Fire | Weather Inst. Quest 2 Lv40 + R118 wild; Water Stone. Arcanine_H: Intimidate/Scalding Touch, Tidal Flare L45. Wallace Gym |
| 421-424, 428 | Dusknoir, Honchkrow, Froslass, Mamoswine, Farigiraf | cross-gen evos | E4 usage (Phoebe/Sidney/Glacia/Tate&Liza) |
| 425 | Bagon_Hoenn | Dragon/Rock | Meteor Falls B1F_2R 5%. Rock Head/Sturdy |
| 426-427 | Vulpix_H → Ninetales_H | Ice/Fairy | R113 4%; Moon Stone. Natural Cure/Serene Grace |
| 429 | Pinsir_Hoenn | Bug/Fire | R112 5%. Guts/Flame Body |
| 430 | Stantler_Hoenn | Ghost/Grass | R119 4%. Intimidate/Effect Spore |
| 431 | Deoxys_Hoenn | Poison/Fairy | Quest III Lv70. Toxic Touch/Pressure |
| 432-433 | Gligar_H → Gliscor_H | Water/Rock | Granite Cave B2F 5%; Lv35. Swift Swim/Water Absorb |
| 434/436/438 | Lotad_H → Lombre_H → Ludicolo_H | Electric/Grass | R102 10% Lv3-4; Leaf Stone final |
| 435/437 | Shroomish_H → Breloom_H | Poison/Ice | Petalburg Woods 4%; Lv23. Breloom_H: Frozen Spore/Thick Fat, Spore Fist L36 |
| 439-441 | Treecko/Grovyle/Sceptile_H | Grass/Steel | "The Blade". Tempered Blade/Overgrow. Iron Leaf L29 |
| 442-444 | Torchic/Combusken/Blaziken_H | Fire/Fairy | "The Dancer" (Blaziken 80/85/70/120/80/95). **Fey Flame/Blaze (C310)** |
| 445-447 | Mudkip/Marshtomp/Swampert_H | Water/Fighting | "Immovable Force" (Swampert 105/115/100/65/90/55). Torrent/Guts — custom ability C311. Shoal Cave low tide wild |
| 448 | Ambipom | Normal | Aipom Lv32; Norman T3+ |
| 449 | Carbink | Rock/Fairy | Roxanne T2+; Steven T4 |
| 450 | Toxapex | Poison/Water | Sootopolis Gym T2+ (Wallace) |

EGG=451, NUM_SPECIES=451.

## Lessons (keep)

- Generator idempotency skips species whose constant already exists → use `--fill-missing` (C270, C293, C308 repairs all came from partial registrations).
- Run `scripts/verify_species.sh` / `make check_all_quick` after any species work; C310 fixed its cry_tables false positive so it's now trustworthy (18/18).
- Changed Three learnsets (C302): Treecko_H Metal Claw→Iron Leaf→Leaf Blade→SD; Torchic_H Charm→Dazzling Gleam→CM→Moonblast→Fire Blast; Mudkip_H Low Kick→Bulk Up→Waterfall→Cross Chop.
- C311 Will-O-Wisp rider (level_up_learnsets.h): Torchic_H + Combusken_H learn WILL_O_WISP at Lv24 (Torchic between Sand Attack 19 and Fire Spin 25; Combusken between Sand Attack 21 and Calm Mind 28) so player-raised Blaziken_H can use Fey Flame. Blaziken_H unchanged (Lv1 Will-O-Wisp). tmhm_learnsets.h untouched.
- C311 sprite lint (#201): graphics/pokemon/{mudkip,marshtomp,swampert}_hoenn/back.png PLTE re-synced to normal.pal; marshtomp_hoenn front.png + anim_front.png jaggies fixed. Details in sprite-iterations.md.
- C312 sprite lint + palette restore (#201): graphics/pokemon/{torchic,combusken,blaziken}_hoenn/{front,back,anim_front}.png + normal.pal + shiny.pal — palettes had regressed to vanilla orange/red; starlit violet-gold rebuilt, jaggies fixed. Details in sprite-iterations.md.
- Sprites for Changed Three, Toxapex front are placeholders (vanilla base / Tentacruel).
