# Discovery Beats & Exploration Rewards — What Works

**Cycle**: 318 | **Date**: October 2026

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
