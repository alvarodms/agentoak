# Pokémon Knowledge Base

Research findings about Pokémon games, ROM hacks, community expectations, and design patterns — gathered via web search by the Pokémon Specialist advisor.

---

## Physical/Special Split in Late Development (March 2026)

**Research Question**: Is implementing the physical/special split worth it late in ROM hack development?

**Findings**: The physical/special split has been successfully implemented in top-tier ROM hacks and is generally well-received by the community, even when added late in development.

**Evidence from Successful Hacks**:
- **Radical Red** and **Inclement Emerald** both feature the split and are among the most praised ROM hacks
- Technical implementation is feasible with existing tools like "Gen3Tools" for modifying the 11th byte of move data
- **Strategic Benefits**: Enhances movepool viability (Salamence can use physical Dragon moves, Sharpedo gets physical STAB, Swampert becomes fully physical)

**Trade-offs**: Some early-game Pokémon lose viability (Aron, Electrike, Plusle/Minun struggle more), requiring rebalancing consideration.

**Community Reception**: Positive - players appreciate the enhanced strategic depth and see it as a quality-of-life improvement.

**Sources**: [PokemonCoders Physical Special Split](https://www.pokemoncoders.com/best-pokemon-rom-hacks-physical-special-split/), [Smogon Gen3 PSS Discussion](https://www.smogon.com/forums/threads/3rd-gen-with-physical-special-split-retiering.3643953/), [ROMHacking.net PSS Discussion](https://www.romhacking.net/forum/index.php?topic=35467.0)

## ROM Hack Polish and Finishing Touches (March 2026)

**Research Question**: What finishing touches make ROM hacks memorable and beloved?

**Key Polish Features That Elevate ROM Hacks**:

1. **Completion and Stability**: Players heavily prioritize completed, bug-free experiences over feature-rich but incomplete hacks
2. **Quality of Life Improvements**: Reusable TMs, running shoes from start, battle speed-ups, unlimited bag space, auto-run features
3. **Narrative Cohesion**: Environmental storytelling, consistent dialogue, and mature themes that feel authentic
4. **Strategic Depth**: Enhanced AI, competitive movesets, proper held item usage, and balanced difficulty scaling

**Community Priorities (2024-2025)**:
- **Complete experiences over new features**: "Pokémon Unbound consistently ranks as the top choice due to its polish"
- **Strategic battle mechanics**: Players value "champion-level AI, competitive movesets, and better held items"
- **Mature narratives**: Community appreciates "dark storylines reflecting manga's mature tone"

**Examples of Excellent Polish**:
- **Pokémon Unbound**: "Most customizable Pokémon game ever" - focuses on customization and quality
- **Pokémon Gaia**: "Rich lore and modern mechanics" with comprehensive implementation
- **Emerald Seaglass**: "Smart, subtle tweaks" that make it feel like a "polished, lost classic"

**What NOT to Focus On**: Feature creep, unnecessary complexity, or architectural changes that risk stability in mature projects.

**Sources**: [DualShockers Best ROM Hacks](https://www.dualshockers.com/best-pokemon-rom-hacks-2024/), [ScreenRant ROM Hacks Ranking](https://screenrant.com/best-pokemon-rom-hacks/), [PokéHarbor 2024 Completed Hacks](https://www.pokeharbor.com/2024/03/20-best-completed-pokemon-rom-hacks-of-2024/), [ROM Hacks Showcase](https://www.pokecommunity.com/forums/rom-hacks-showcase.184/)

## Wild Held Items vs Trainer Held Items Priority

**Key Finding**: The community values held items primarily for **strategic trainer battles** rather than wild Pokémon collection. Players appreciate when "gym leaders and boss trainers use competitive-style teams with optimized movesets and weather strategies."

**Implementation Focus**: Strategic held items on trainers > wild Pokémon held items for discovery.

## Trainer Held Items: The Hallmark of Elite ROM Hacks (March 2026)

**Research Question**: How do top-tier hacks implement trainer held items and how does the community respond?

**Key Findings from Inclement Emerald & Radical Red**:

- **Inclement Emerald Challenge Mode** documents complete trainer data: each gym leader has 4 Pokémon with abilities, natures, IVs, EVs, and held items specifically chosen for their role. This level of detail is heavily praised.
- **Radical Red** is praised for being "hard but reasonably paced and properly balanced" — distinct from "troll hard" Kaizo-style games. The key distinction: gym leaders have strong held items AND strong movesets, but the player has fair access to counter-strategies.
- Community notes that "properly balanced" difficulty (Radical Red) > "troll difficulty" (Kaizo). Players want to feel outplayed by smart trainer design, not overwhelmed by cheap cheap mechanics.
- Frisk/CompoundEyes increasing wild held item encounter rate is a QoL mechanic players appreciate for item farming.

**Design Pattern for Trainer Held Items**:
- Early gyms: simple boosts (X-item equivalents like Oran Berry, type-enhancing plates)
- Mid gyms: Choice items, Leftovers, Lum Berry for status prevention
- Late gyms/Elite Four: Focus Sash, Life Orb, Choice Band/Specs — full competitive sets
- Champion: Full EV-trained competitive team with optimized held items

**Critical Rule**: Hard = smart, not cheap. Trainers should have items that reward the player for thinking, not items that feel unfair (no Sleep Powder + Bright Powder spam).

**Sources**: [Inclement Emerald PokéCommunity Thread](https://www.pokecommunity.com/threads/pokémon-inclement-emerald-a-decomp-difficulty-hack-version-1-13.457039/), [Inclement Emerald Challenge Mode Docs](https://www.scribd.com/document/598841293/Inclement-Emerald-Challenge-Mode-Trainers-Docs), [Radical Red PokéCommunity Thread](https://www.pokecommunity.com/threads/pokémon-radical-red-version-4-1-released-gen-9-dlc-pokemon-character-customization-now-available.437688/)

## Gym Leader Dialogue & Elite Four Narrative (March 2026)

**Research Question**: How much does dialogue quality matter for gym leaders and the Elite Four, and what patterns work best?

**Key Findings**:

- **Dialogue is a top differentiator**: Community consistently praises hacks where gym leaders have "cinematic flair" and unique characterization — not just battle mechanics. Pokémon Reborn is lauded for gym leaders being "part of underground rings" with distinct personalities embedded in their dialogue.
- **Gym gimmicks + thematic dialogue = memorability**: Pokémon Unbound's gym leaders are remembered for having clear identities reinforced by both puzzle design *and* dialogue. The two reinforce each other.
- **Narrative continuity through late-game is critical**: The Elite Four and Champion are the emotional climax. Players who felt the story built toward something (Reborn, Unbound) are far more satisfied than those who experienced dialogue drop-off after the 6th gym.
- **The Champion speech is the most-remembered dialogue in any Pokémon game**: Wallace/Steven moments in Emerald are among the franchise's most iconic. A ROM hack Champion who speaks to the hack's themes (migration, ecological change) will leave a lasting impression.

**Design Patterns That Work**:
- Each Elite Four member should reference the hack's central theme (migration crisis) in their opening and defeat lines
- Wallace as Champion should feel like a culmination — his dialogue should tie migration, ocean, and the player's journey together
- Post-battle dialogue (after the player wins) is often overlooked but highly memorable when well-written; players replay Elite Four to experience it

**Comparison to Cycle 32 Work**: Brawly through Winona now have migration-aware dialogue. Tate & Liza, Juan, the entire Elite Four (Sidney, Phoebe, Glacia, Drake), and Champion Wallace still lack custom dialogue — these are the highest-visibility battles in the game.

**Sources**: [DualShockers ROM Hacks 2024](https://www.dualshockers.com/best-pokemon-rom-hacks-2024/), [Oreate AI ROM Hacks 2024](https://www.oreateai.com/blog/beyond-the-mainline-diving-into-the-best-pok%C3%A9mon-rom-hacks-of-2024/71d82543839887286765a eb9bc1117e7), [The Game Slayer Best ROM Hacks 2025](https://thegameslayer.com/lists/best-pokemon-rom-hacks-of-2025-ranked/)

## Elite Four & Late-Game Content: Player Retention Factors (March 2026)

**Research Question**: What late-game content patterns drive player satisfaction and retention in ROM hacks?

**Key Findings**:

- **The "empty feeling" problem**: Vanilla Pokémon games feel hollow after the Champion — most ROM hacks that don't address this lose player momentum at the finish line.
- **Elite Four rematches with new teams** are specifically praised in Refined Platinum: "new teams and alternate text" make returning worth it and are a low-effort, high-reward addition.
- **The Champion is the narrative climax**: For hacks without postgame, the Champion fight and credits are the entire emotional payoff. This makes Champion dialogue and team presentation disproportionately important.
- **Postgame depth is the top differentiator for standout hacks** (Unbound, Radical Red) — but for a first release, a well-crafted main story with a satisfying climax outperforms a rushed postgame.

**Implications for Legends of Hoenn**:
- Completing the full dialogue arc through Wallace Champion is the most impactful remaining task — it closes the narrative loop the migration story opened in Birch's intro
- Late-game NPC flavor (Mossdeep, Sootopolis, Ever Grande) supports emotional buildup to the final battles
- Postgame content (rematches, new areas) is a v2.0 feature — don't delay v1.0 for it

**Sources**: [DualShockers Postgame ROM Hacks](https://www.dualshockers.com/best-pokmon-rom-hacks-with-extensive-post-game-content/), [Oreate AI Pokémon Unbound Postgame](https://www.oreateai.com/blog/beyond-the-elite-four-unlocking-the-rich-postgame-of-pok%C3%A9mon-unbound/3c6c742b38562a8f85cc0a8531fe07e6), [Player.One Best ROM Hacks Postgame](https://www.player.one/top-5-best-pokemon-rom-hacks-incredible-post-game-content-161858)

## pokeemerald-expansion Migration: Risk Assessment (March 2026)

**Research Question**: Should a late-stage project migrate to pokeemerald-expansion, and what are the concrete risks?

**What expansion adds**: Physical/special split, following Pokémon, Mega Evolutions, Fairy type, modern EXP share, advanced AI, HM alternatives — essentially all the QoL features players expect in 2025. Community recommends it over vanilla pokeemerald for any new project.

**Migration Risks for a 33-cycle project**:
- **Merge conflicts at scale**: 33 cycles of custom C code, script edits, data modifications will require manual conflict resolution across hundreds of files
- **Breaking changes**: Recent updates include audio format migrations (.aif → .wav), data structure changes, script API changes — each requires a migration script or manual fix
- **No clear rollback**: Once merged, reverting is impractical — this is a one-way door decision
- **Build system disruption**: The expansion has its own build configuration; a project with agbcc toolchain tweaks may need reconfiguration

**Community guidance**: "If your project is a bit old, you might get merge conflicts that you need to solve manually." For a project with 33 cycles of modifications, "a bit old" is a significant understatement.

**Verdict**: Migration is a v2.0 or standalone-rebase decision, not a mid-development patch. The risk of breaking a working, near-complete v1.0 is too high. Defer until after a stable v1.0 release.

**QoL features achievable WITHOUT expansion** (relevant for near-v1.0):
- Reusable TMs: data patch to item properties
- Auto-run from start: simple flag change in scripts
- Expanded bag: memory adjustment (already in many vanilla pokeemerald hacks)
- Physical/special split: can be done via move data edits without expansion

**Sources**: [pokeemerald-expansion GitHub](https://github.com/rh-hideout/pokeemerald-expansion), [PokemonCoders Best ROM Hacks 2026](https://www.pokemoncoders.com/best-pokemon-rom-hacks/), [DualShockers Best New ROM Hacks 2025](https://www.dualshockers.com/best-new-pokmon-rom-hacks-in-2025/)

## 2025 Must-Have QoL Checklist for ROM Hacks

**What players now consider baseline expectations**:

1. **Reusable TMs** — single-use TMs are widely considered outdated; this is the #1 QoL request
2. **Auto-run** — no one wants to hold B; running shoes from game start is standard
3. **Physical/Special split** — brings Gen 3 in line with modern mechanics; top-requested feature
4. **Following Pokémon** — beloved feature from HGSS; increasingly expected in quality hacks
5. **Modernized EXP share** — party-wide EXP distribution like Gen 6+
6. **No forced HM slaves** — players expect HM alternatives or field move items
7. **All Pokémon obtainable** — no trade evolutions locked behind link cable

**For Legends of Hoenn specifically**: Items 1, 2, and 3 are achievable on vanilla pokeemerald without expansion. Items 4–7 require expansion or significant custom C work. A planning cycle should prioritize which subset to include in v1.0 vs defer.

**Sources**: [PokemonCoders Best ROM Hacks 2026](https://www.pokemoncoders.com/best-pokemon-rom-hacks/), [Oreate AI ROM Hacks 2025 GBA](https://www.oreateai.com/blog/pokemon-rom-hacks-2025-gba/0b8c07b946322e509061cdf7d8213fbc), [DualShockers Best New ROM Hacks 2025](https://www.dualshockers.com/best-new-pokmon-rom-hacks-in-2025/)

## Custom Events vs. Dialogue: Narrative Differentiation from Base Game (March 2026)

**Research Question**: How do top ROM hacks successfully make their games feel distinct from the base game beyond just changed dialogue? How do custom scripted events change the player experience?

**The Core Problem (raised by Issue #23)**: Changing NPC dialogue creates flavor, but if story *triggers* and *beats* remain identical to vanilla, the game still feels like vanilla with a new coat of paint. The player still does the same things in the same order — the narrative only changes in what characters say, not what happens.

**How Top Hacks Solve This**:

- **Pokémon Unbound** (the gold standard): Added a Mission Log system, scripted boss events, side quests with custom NPCs, and daily events. The player encounters story beats that couldn't exist in the base game. Even minor NPCs have quests tied to the world's lore. This is what makes Unbound feel like "a completely new game."
- **Pokémon Gaia**: Custom scripted events tied to the ancient civilization mystery — players walk into ruins and trigger lore-revealing scenes. The *world* reacts to the story, not just talking NPCs.
- **Pokémon Adventures Red Chapter**: Fully scripted cinematic battles and unique missions that follow the manga. The base game's trigger structure is almost entirely replaced.

**Spectrum of Effort for "Custom Events" in pokeemerald**:
1. **Low effort (1-2 cycles)**: Add script tiles that trigger migration-themed NPC spawns/cutscenes at key route entrances. A Pokémon Ranger appears at Route 110 to warn of aggressive migrants. A researcher at Mossdeep mentions unusual readings. These add beats without replacing existing ones.
2. **Medium effort (3-5 cycles)**: Modify post-gym-badge sequences — instead of just "you got the badge" text, add a brief cutscene where a town NPC reacts to the migration event tied to that gym's type/theme.
3. **High effort (full rewrite)**: Replace major story triggers (Team Magma/Aqua events) with migration-themed equivalents. This is v2.0 scope, not v1.0.

**Community Lesson**: Players can tell the difference between "themed dialogue" (flavor) and "custom events" (substance). The former is appreciated; the latter is what earns the "doesn't feel like vanilla" verdict. Even 3-5 small custom-triggered scenes at key moments elevate perception dramatically.

**Recommendation for Legends of Hoenn v1.0**: Low-effort scripted events at 4-6 key locations (route transitions, post-badge moments) would directly address Issue #23 without endangering v1.0 stability. This is a patch-mode task, not a feature rewrite.

**Sources**: [PokéCommunity Unbound Thread](https://www.pokecommunity.com/threads/pok%C3%A9mon-unbound-completed.382178/), [RetroHandhelds Unbound Review](https://retrohandhelds.gg/pokemon-unbound-the-very-best-rom-hack/), [PokemonCoders New Story Hacks](https://www.pokemoncoders.com/pokemon-rom-hacks-with-new-story/), [RomHaven Top ROM Hacks 2026](https://romhaven.com/pokemon-rom-hacks/top-10-best-pokemon-rom-hacks-2026.html)

## ROM Hack Release: Final QA & Community Announcement Best Practices (March 2026)

**Research Question**: What do community members check for before a release, and what makes a strong release post?

**Pre-Release Bug Checklist (community-derived)**:

- **Battle UI**: HP bar display bugs (BW-style bars can fail to update first digit when dropping below 100); double battle level display issues
- **Shiny display**: Shiny Pokémon appearing in normal colors is a commonly missed pre-release bug — always test a known shiny
- **Naming screen**: Gift Pokémon nicknames not saving; expanded species showing incorrect names during nicknaming
- **Emulator/BIOS compatibility**: Bag menu crashes on certain BIOS configurations; test on mGBA and VBA-M
- **Script/event flags**: Warp tile collisions, NPC flag states — especially in modified gym scripts and villain events
- **Base ROM version**: Confirm the patch applies cleanly to the correct base ROM (Emerald's specific CRC)

**What Makes a Strong Release Post on PokéCommunity**:

1. **Compelling narrative hook** — lead with what's different and why it's worth playing (the migration premise is exactly this)
2. **Clear feature bullet list** — complete trainer teams, encounter overhaul, held items, reusable TMs, thematic dialogue
3. **Completion status upfront** — "beatable through Champion, no postgame yet" is better than leaving players to discover missing content
4. **Patching instructions** — specify the exact base ROM (Pokémon Emerald, correct CRC) and recommended emulator
5. **Bug report channel** — even just a GitHub issues link signals maturity and seriousness
6. **Credits** — acknowledge any tools/resources used; community values attribution

**Community Red Flags (things that hurt reception)**:
- Releasing with known crashes/softlocks — even minor ones tank reviews
- "Beta" or "incomplete" tag when content is mostly done — undersells the work
- Missing credits — community takes plagiarism seriously
- No patching instructions — causes immediate support requests that overwhelm the thread

**PokéCommunity note**: AI-generated content (art, summaries, dialogue) is explicitly prohibited on PokéCommunity as of 2025. Release posts should not contain AI-generated assets.

**Sources**: [PokéCommunity ROM Hacks Showcase](https://www.pokecommunity.com/forums/rom-hacks-showcase.184/), [PokéCommunity Phoenix Red Release](https://www.pokecommunity.com/threads/pokemon-phoenix-red-complete-v1-0.541255/), [PokéCommunity Emerald Imperium Release](https://www.pokecommunity.com/threads/new-release-pokemon-emerald-imperium.534582/), [DualShockers Best New ROM Hacks 2025](https://www.dualshockers.com/best-new-pokmon-rom-hacks-in-2025/)
