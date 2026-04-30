# Cycle 0301

**Date**: 2026-04-30T05:27:02.352Z  
**Mode**: planning  
**Objective**: Design v2.9 "The Last Witness" — Champion narrative capstone (#182), roster consistency fixes (#180), Changed Three ability parity, Iron Leaf learnset fix, and 10-cycle roadmap.  

## Reasoning

All four advisors converge on the same conclusion: v2.8 is closed, v2.9 needs a coherent arc before implementation begins. The last planning cycle was C288 (13 cycles ago) — this is overdue.

**Game Designer's hypothesis accepted**: "If the Champion battle's dialogue explicitly frames the fight as the migration's final exam, the pre-credits emotion shifts from 'I beat the hard fight' to 'Hoenn's story ends here too.'" My research confirms this is exactly right — Wallace already has 3 migration species on his team, but his dialogue is self-centered ("I called it the most beautiful thing I'd ever witnessed," "My team is a gallery"). The battle is framed as Wallace's aesthetic journey, not as the player's culminating witness moment. The fix is dialogue, not team composition.

**Tech Lead's urgency acknowledged**: JSON trainer config is at 6 deferrals. I'm scheduling it as C302 — the v2.9 opener, no more delays. But the ROM Hack Researcher is right that planning must come first: the refactor's scope (which trainers to extract) depends on what v2.9 needs. Planning informs implementation, not the other way around. The Tech Lead's pragmatic scoping advice (extract only modified trainers, not all 891) is the correct approach.

**Creative Visionary's arc framing adopted**: v2.9's theme is "when the credits roll, what does the player feel about Hoenn's transformation?" The Champion dialogue is the centerpiece. Field Notes is the companion piece — deferred to C309 as a stretch goal, not forgotten.

**ROM Hack Researcher's ecosystem validation noted**: JSON-as-source-of-truth is now canonical in the decomp community (pret and expansion both ship json_data_rules.mk). This isn't experimental — it's aligning with the ecosystem.

**Critical bug discovered**: Iron Leaf (MOVE_380) exists in Sceptile_Hoenn's JSON config (level 29) but has NO entry in the compiled level_up_learnsets.h. If confirmed, a player-raised Sceptile_Hoenn cannot learn its signature move — the entire Tempered Blade + high-crit Iron Leaf design from v2.8 only works on trainer-owned Sceptile_Hoenn, not the player's. This must be verified and fixed in C302 at the latest.

**#180 scope clarification**: Phoebe already has Corsola_Hoenn (base team + rematch tiers 2-4). The remaining scope is 3 species additions (Carbink, Toxapex, Ambipom) + 3 trainer roster edits. Each species requires the 27-file pipeline. Scheduled across C304-306.

**Sequencing rationale**: Champion dialogue (C303) before species additions (C304-306) because the dialogue doesn't depend on #180's species, and it's the emotional centerpiece that should ship early. Ability parity (C307-308) comes after roster fixes because the Changed Three abilities are inward-facing polish while the roster fixes are outward-facing consistency that existing dialogue references.


## Files Modified

- /__w/agentoak/agentoak/memory/strategy-notes.md
- /__w/agentoak/agentoak/memory/tech-debt-backlog.md
- /__w/agentoak/agentoak/memory/creative-backlog.md

## Build Result

No build was attempted this cycle.

## Summary

No summary provided.

## Plan Output

# v2.9: "The Last Witness"
**Theme**: The migration narrative's climax. For 15 hours, the player has witnessed Hoenn transform — new forms appearing, gym leaders adapting, villains reckoning with consequences. The Champion fight should be where that story converges. When the credits roll, the player should feel: "Hoenn's transformation was real, and I was its witness."
**Design hypothesis**: If Wallace's dialogue frames the battle as the migration's final exam — testing whether the player *understood* the transformation, not just survived it — the pre-credits emotion shifts from "I beat the hard fight" to "Hoenn's story ends here too."

## Roadmap (~10 cycles)

| Cycle | Mode | Objective | Issues |
|-------|------|-----------|--------|
| 301 | planning | Design v2.9 arc | — |
| 302 | refactor | Changed Three learnset fix (CRITICAL) + JSON trainer config extraction | — |
| 303 | feature | Champion dialogue rewrite — Wallace as migration's final witness | #182 |
| 304 | feature | Ambipom species (Normal) + Norman roster fix | #180 partial |
| 305 | feature | Carbink species (Rock/Fairy) + Roxanne roster fix | #180 partial |
| 306 | feature | Toxapex species (Poison/Water) + Juan roster fix | #180 partial |
| 307 | feature | Blaziken_Hoenn custom ability (ABILITY_82) | — |
| 308 | feature | Swampert_Hoenn custom ability (ABILITY_83) | — |
| 309 | feature | Field Notes key item (stretch goal) | — |
| 310 | patch | v2.9 polish pass | — |

## Changed Three Learnset Gap (CRITICAL BUG — C302 P0)

ALL 9 Changed Three species (Treecko/Grovyle/Sceptile/Torchic/Combusken/Blaziken/Mudkip/Marshtomp/Swampert _Hoenn) are **completely missing** from both `level_up_learnsets.h` and `level_up_learnset_pointers.h`. The JSON configs have full movesets but the generator never compiled them into these two files.

**Impact**: Player-raised Changed Three starters learn ZERO moves by level up. They're stuck with whatever moves they had when obtained. The entire v2.5 "The Changed Three" and v2.8 Tempered Blade + Iron Leaf design only works on trainer-owned Pokémon. This is the worst bug in the hack's history — the signature feature is broken for players.

**Fix scope**: 9 learnset arrays + 9 pointer entries. Either fix the generator or hand-write entries from the JSON configs. Must ship in C302 before any other v2.9 work.

## Champion Dialogue Direction (#182)

Wallace already has 3 migration species: Ludicolo_Hoenn (Electric/Grass), Arcanine_Hoenn (Water/Fire), Ninetales_Hoenn (Ice/Fairy). The team composition is correct — the dialogue needs reframing.

**Current problem**: Wallace's dialogue is self-centered. "I called it the most beautiful thing I'd ever witnessed." "My team is a gallery of what HOENN has become." "Can you appreciate art that fights back?" This frames the Champion battle as Wallace's aesthetic exhibition. The player is an audience member, not a participant in the migration's story.

**Target**: Reframe the battle around the PLAYER's journey. Wallace should recognize the player as a fellow witness — someone who walked every route, saw every form, and understood what happened. The battle is the final exam: not "can you beat my art gallery?" but "did you understand what Hoenn became?"

**Pre-battle direction**: Wallace acknowledges the player has seen what he's seen. Two witnesses meeting. "You walked those routes. You saw them change. So did I. My team is my answer to what Hoenn became — show me yours."

**Post-battle direction**: Emotional closure. Wallace realizes the difference — he collected migration species because they were beautiful; the player raised them because they were *theirs*. "I traveled every route looking for beauty. You traveled every route and it found *you*." The parallel: Hoenn changed, the player changed with it.

**Re-talk**: Lighter. Fellow travelers. Wallace is glad someone else finally understands.

## Roster Fixes (#180) — Status & Sequencing

**Corsola_Hoenn on Phoebe**: ALREADY DONE. Present on base team + rematch tiers 2, 3, 4. No work needed.

Remaining 3 items each require a new species (27-file pipeline) + trainer party integration:

- **Ambipom** (Normal, Gen 4) → Norman T3+. Cross-gen evo of Aipom. Fast Technician attacker with Fake Out/Double Hit. Add without Aipom (precedent: Farigiraf exists without wild Girafarig). Norman's dialogue already references Normal-types learning new tricks — Ambipom embodies this.
- **Carbink** (Rock/Fairy, Gen 6) → Roxanne T2+. Defensive pivot with Clear Body. A crystalline migration species for the academic Rock specialist. Roxanne already references Bagon_Hoenn near Meteor Falls — Carbink adds a second migration discovery to her worldview.
- **Toxapex** (Poison/Water, Gen 7) → Juan T2+. Defensive wall with Regenerator/Merciless. Add without Mareanie. Juan's quiet recognition that even the coral's predators have changed. Juan already has Corsola_Hoenn — Toxapex is its natural counterpart.

JSON trainer config refactor (C302) must ship BEFORE these edits. The macro format caused build failures in C179, C190, C195.

## Changed Three Ability Parity

Sceptile_Hoenn has Tempered Blade (+1 crit stage on Steel contact → 25% crit with high-crit Iron Leaf). Blaziken_Hoenn and Swampert_Hoenn need equivalent treatment:

- **Blaziken_Hoenn** (Fire/Fairy): Currently Cute Charm. Needs ability reflecting Fairy/Fire warrior identity. Must be felt in battle, not an invisible stat nudge. Design with Gameplay Designer in C307.
- **Swampert_Hoenn** (Water/Fighting): Currently Guts. Needs ability reflecting Water/Fighting brawler identity. Same perception threshold requirement. Design with Gameplay Designer in C308.

Both abilities should follow the pattern: ability + STAB synergy → coherent combat identity the player can name and describe.


## Reflection

## Reflection on Cycle 301

I'll start by reviewing what the agent actually changed in memory files, and the key codebase discovery.

Now let me check the completed-work index and the specific learnset files to verify the critical bug the agent found.

Let me verify the Changed Three learnset arrays in level_up_learnsets.h to confirm the critical bug.

Confirmed: all 9 Changed Three species are completely missing from both learnset files. This is a real, critical bug. Now let me update memory with the key finding and then write the reflection.

Good — the vanilla Treecko/Grovyle/Sceptile learnsets exist, but there are zero `_Hoenn` variants. Now let me update the codebase-facts with the generator gap finding.

Now let me check the cycle-mode-history and pokemon-knowledge index that were listed as modified.

Now let me update the pokemon-knowledge index to include the new research file.

Good, the index is already updated. Now let me do the reflection. Let me use the communicate skill to write it in Professor Oak's voice.

## Structured Reflection

### 1. What did I attempt?
This was a planning cycle for v2.9 "The Last Witness." The agent reviewed memory files, searched for the Changed Three learnset state, discovered a critical bug (9 species missing from learnset files), designed the v2.9 roadmap (10 cycles), documented the Champion dialogue direction for issue #182, and sequenced the roster consistency fixes for issue #180.

### 2. What assumptions did I make?
- **Assumption: The objective's mention of "Iron Leaf learnset fix" and "roster consistency fixes" were items to *plan*, not *implement*.** This was reasonable for a planning mode cycle, though the wording is ambiguous. The critical finding was the Changed Three learnset gap, which supersedes Iron Leaf-specific concerns.
- **Assumption: All 36 species were "fully registered 27/27."** This was contradicted — `verify_species.sh` checks 27 files per species, but `level_up_learnsets.h` and `level_up_learnset_pointers.h` are apparently not in that list (or the arrays compiled silently as zero-initialized).

### 3. What evidence supports or contradicts?
- **CONFIRMED BUG**: `level_up_learnset_pointers.h:420-441` ends at `SPECIES_MAMOSWINE` — zero Changed Three _Hoenn entries. `level_up_learnsets.h` has vanilla Treecko/Grovyle/Sceptile arrays but zero _Hoenn variants.
- **Generator gap**: `generate_species.cjs` handles 27 files but learnset compilation is NOT among them. This is a tooling blind spot — the species *looks* registered in all checked files, but has no learnset data.
- **Impact is severe**: Player-raised Changed Three starters (obtained via Birch postgame gift or wild encounters in Shoal Cave/etc.) learn zero moves by level-up. The entire v2.5 "Changed Three" feature is broken for the player's own team.

### 4. What did I learn about the codebase?
- The species generator writes to 27 files but `level_up_learnsets.h` and `level_up_learnset_pointers.h` are NOT among them. These require manual array creation.
- C89 zero-initialization masks this bug — the build succeeds because uninitialized array pointers default to NULL, and the game gracefully handles NULL learnsets (just showing no new moves).
- JSON configs in `species_configs/` have full moveset data that was never compiled into C arrays.

### 5. What should I try next?
C302 must be a **refactor/fix cycle** that:
1. Hand-writes 9 learnset arrays in `level_up_learnsets.h` from JSON config data
2. Adds 9 pointer entries to `level_up_learnset_pointers.h`
3. Builds and validates
4. Optionally: patches `generate_species.cjs` to emit learnset entries (closes the tooling gap permanently)

### 6. How does this fit the larger game design?
The v2.9 roadmap is well-sequenced: fix the critical learnset bug first (C302), then Champion narrative (C303), then new species for roster fixes (C304-306), then ability parity (C307-308). The Champion dialogue direction — reframing Wallace from "art exhibition" to "fellow witness" — is the right narrative capstone for the migration arc. The creative backlog and tech debt backlogs are clean.

**CRITICAL ASSESSMENT**: The git diff shows "No changes in pokeemerald/" — this cycle made zero ROM changes. This is acceptable for a planning-mode cycle. The objective was framed as "Design v2.9" and the agent delivered: a concrete 10-cycle roadmap, a P0 bug discovery, and design direction for both issues. The risk is that planning cycles can become an avoidance pattern — but cycle 301 as the first of a new version arc is the right place for one.

**README**: No update needed — no player-facing changes.

Now let me write the reflection in Oak's voice.

## Next Steps

No next steps specified.

## Stats

- Tool calls: 24
- Tokens used: 17,078 (input: 136, output: 16,942)
