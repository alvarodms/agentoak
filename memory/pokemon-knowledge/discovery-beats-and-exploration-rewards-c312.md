# Discovery Beats & Exploration Rewards — What Works

**Cycle**: 399 | **Date**: November 2026

---

## Evidence gathered (C312 web search — results thin, mostly listicles)
- **SoulGold hacks / HGSS-style Hidden Grottoes**: reviewers single out grottoes holding rare items + Pokémon that **reset daily**. The reset is what keeps players coming back to the spot. (pokemoncoders "50 Best ROM Hacks 2026")
- **Pokémon Gaia**: listed for exploration specifically: climbable walls, full underwater Dive maps, "Hidden Grottoes and Secret Temples" with rare items. Reviews name these as the hack's exploration identity.
- **Unbound**: praised for new areas and collection completion postgame. Search found no specific static-encounter praise (SEO pages only).
- **Gen IV Journal key item** (Bulbapedia/Dittobase): it auto-logs your activities, and the series dropped it after Gen IV. A passive log doesn't count as discovery. Players don't remember reading it.
- **PokéCommunity "common pitfalls of ROM hacks"**: general difficulty debate. Nothing specific to encounters.
- **Pokémon GO Special Research complaints**: players resent a grindy "catch N common species" task that pays out a weak reward. That's an anti-pattern for task-style notes.

## Known reference points (prior knowledge, not re-verified this cycle)
- **Vanilla Emerald Mirage Island** is the classic anti-pattern. It needs a daily random value to match a party Pokémon's PID, and it's widely mocked as "never seen it". The game gives no signal, so it feels like no reward at all.
- **Legends: Arceus research tasks** are well liked because each entry asks for a *specific observed behaviour* (see it use move X, catch it asleep) and the notes double as lore.

## Design takeaways for Legends of Hoenn
1. A discovery reward has to be **legible**: a visible cue (sparkle, NPC rumor, Field Notes hint) that points to a place, not a hidden RNG roll.
2. Give **one specific payoff per note**: a species, a lore line, or a Changed-form behaviour. Avoid "catch 10 Zigzagoon".
3. A **daily/conditional reset** (time of day, weather, tide like Shoal Cave) gives players a reason to come back. Reuse existing tide/time hooks instead of building a new system.
4. Notes should tell the migration story in the world (Tell:Show ratio rule from C298).

## C315 addendum: static encounters that can be missed (searched Oct 2026)
- **Bulbapedia's "List of permanently missable Pokémon"** exists mainly because statics don't respawn after fainting or fleeing. The community treats this as a design flaw, and a whole wiki page exists to warn players about it.
- **The official fix is a respawn after the Champion.** FRLG/Emerald brought back fainted Mew/Lugia/Ho-Oh after the Hall of Fame. From Platinum on, fainted legendaries return after you beat the Champion. Static Pokémon stopped being permanently missable.
- **Hack practice varies per script.** Infinite Fusion's wiki says statics "will not respawn (unless specified otherwise)", meaning a capture, defeat or flee removes them. A PokeCommunity [Emerald] help thread shows a modder making a KO'd legendary come back with a small flag edit, so players do ask for this.
- **Inclement Emerald** (pokeemerald decomp): every wild, gift and static encounter has at least 3 perfect IVs, guaranteed since v1.7. A hand-placed static is a *better* mon than a random wild one, which is what players expect from an encounter that was placed on purpose.
- Takeaway: a den static should (a) set its hide flag only on catch, (b) never be lost to a KO or flee, and (c) feel "special" in its stats (fixed IVs/held item), not just in where it sits.
- Searches found no named hack that puts Regis on Steven's postgame team. Still no external precedent (see steven-rematch-and-regi-question-c308.md).

## C318 addendum: "titan" framing + verifying dens without a human (searched Oct 2026)
- **SV Titans** are bigger and stronger guardians, and they're beaten, not caught. Each later Titan is higher level. The **v2.0.1 patch let players catch former Titans they'd accidentally KO'd.** Game Freak patched that one-shot loss out, which confirms our catch-only hide flag (missable-static rule above).
- In SV, "titan" means a *boss fight*. If the Shoal Cave Mudkip is called a titan, players will expect the fight to feel different, not just a plain Lv-X static. Cheap ways to deliver that in vanilla engine: a higher level than the earlier dens (Torchic 30, Treecko 40), a held item, fixed IVs (the Inclement precedent above), and a tide-gated appearance (takeaway 3).
- **Automated emulator checks:** mGBA has had Lua scripting since 0.10 (`emu:read8(addr)` and similar). Third-party tools (mgba-mcp, mcp-mgba) run it headless as `xvfb-run mgba-qt --script x.lua`, wait for a DONE marker file, and collect a screenshot and JSON. A script could load a save state, step frames, and read the den flag bytes. pokeemerald-expansion also has an in-ROM test runner (mgba-rom-test style, which reports exit status through an SWI). Not verified: whether mgba is installable in our CI.
- Our own help request for den playtesters (C317) has had no response so far. Gating new content on human playtesting stalls the roadmap.

## C393 addendum: quiet "unease → dread" beats (searched Nov 2026; results mostly listicles)
- **Lavender Town** is the canonical quiet beat. Its dread comes from the place (atonal music, a grave site, Pokémon too afraid to fight), not from text. Most of the legend is later fan creepypasta. The game itself says very little.
- **XY/ORAS ghost girl** (Kotaku, "you probably missed Pokémon's new ghost girl"): she says one line, "No, you're not the one.", then she is gone. It is never explained. Fans built theories (a trainer-ID check, Phoebe's relative) *because* nothing answers them. Kotaku's headline also shows the cost: many players never saw her.
- **Mt. Pyre's register is grief, not dread.** Forum posters call it "just depressing" rather than scary. A beat set there reads as mourning by default.
- Takeaways: (1) a dread beat needs a place that is *normally safe* to turn wrong; a graveyard is already sad, so it won't feel like a change. (2) Show one unexplained thing and answer nothing (this matches D1 and "react to outcomes, not causes"). (3) Put it on the critical path, or the Kotaku "you probably missed" problem applies.
- Searches found no ROM hack known for an event-driven overworld change that players noticed (Unbound/Crystal Clear/Crimson pages list map changes, not quiet beats). This remains an open niche.

## C394 addendum: will a small sprite read in the summit fog? (searched Nov 2026; web thin, code-verified)
- Bulbapedia (Fog): Gen III fog is overworld-only and "makes the area difficult to see, especially obstacles and Trainers". Mt. Pyre is listed as always foggy, and the summit has its own fog colours. PokeCommunity weather threads: of the fog types, only "steady mist" brightens block animations to match.
- **Code (pokeemerald/src/field_weather.c)**: MtPyre_Summit is WEATHER_FOG_HORIZONTAL. In that weather every sprite palette is pulled about 75% toward pale mint RGB(28,31,28). A palette loaded on fade-in is marked by MarkFogSpritePalToLighten (:821), then lightened by ApplyFogBlend (:674-676, `(28-r)*3>>2`). A palette loaded later, when an object spawns, gets `BlendPalette(.., 12, RGB(28,31,28))` (:842). So every 5-bit channel ends up between about 21 and 31, and sprite contrast drops to about a quarter.
- Effect on the CABLE_CAR palette: glow 11 (255,255,148) → near white; amber 14 → (26,26,21); iron 8 (41,49,90) → (22,24,23). Hue barely survives, so a "warm yellow glow" reads as cream. Only light vs dark and the silhouette survive.
- **The NPC_2 fallback cannot fix this**: the fog blends every sprite palette slot the same way. The fix is in the art: the darkest index (8) as a full outline, the brightest index (11) in one solid core, and a lantern shape (top ring + cage) recognisable in two values. Judge the screenshot against the summit Old Woman, which gets the same blend.
- Takeaway: for any object placed on a fog map (Mt. Pyre summit/exterior, Route 120 fog), design for luminance and shape, not hue.

## C399 addendum: quiet beats for Hours 10-15 (searched Nov 2026; thin)
- **ORAS Memory Girl** (Bulbapedia "Memory (game mechanic)") stands outside the *Lilycove* Pokémon Center and tells the player a Pokémon's memory of their journey, made from data the game already holds (where it was met). Emerald has no such NPC (it has the Pokémon Center Ladies instead). It is a quiet "the world remembers you" precedent built from save data, with no new flags. Lilycove is D1-sensitive (page 3), so a beat like this belongs on Route 124 or in Mossdeep.
- Vanilla already rewrites the dialogue of Lilycove/Mossdeep outdoor NPCs once Kyogre wakes (Bulbapedia Route 124/Lilycove), so the Hours 13-15 "world reacts" layer is taken. A quiet beat should sit *before* Space Center/Seafloor, not compete with that rewrite. No search found a hack with a quiet beat that players remember in these hours.

## C396 addendum: a sound-only "correction confirmed" cue (searched Nov 2026; web thin on Pokémon SE names, songs.h read locally)
- **Return of the Obra Dinn** is the closest precedent for a ledger the player corrects. A correct fate gets a jingle only in batches of three (reviewers: DualShockers, the TV Tropes page), so the sound stays rare and stays earned. A cue that fires on every entry loses its weight.
- **Audio fatigue** (uxdesign.cc "Disruptive Audio"): a cue annoys players when it repeats and when it no longer tells them anything new. One sound per real event that never repeats is the safe pattern.
- **pokeemerald songs.h**: SE_DEX_PAGE (109) already plays on every page the FIELD NOTES opens AND on the C361 first-ink pen moment, so it can't be the "pen" sound. The vanilla drawing sound is **SE_M_SKETCH (205, SE_W166, Smeargle's Sketch)**. Fallbacks: SE_M_SCRATCH (155), SE_CLICK (36). No pen SE exists in Gen 3 (web searches found no hack precedent for one).
