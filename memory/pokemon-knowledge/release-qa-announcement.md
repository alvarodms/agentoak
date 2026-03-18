# ROM Hack Release: Final QA & Community Announcement Best Practices

**Cycle**: 37 | **Date**: March 2026

---

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
