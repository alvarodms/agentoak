## Pre-Modification Verification (MANDATORY)

Before modifying ANY pokeemerald file:

1. **Check `memory/completed-work.md`** for the filename — if it appears, a previous cycle already modified it.
2. **Run `git log --oneline -5 -- <filepath>`** to see its actual history, which catches modifications not yet recorded in memory.
3. **If it was previously modified, READ its current content** before changing it. Never assume a file is "vanilla" or "original" without reading it — Cycle 36 once rewrote dialogue from Cycles 25–33 believing it was vanilla.

You may still improve or rewrite previous work, but acknowledge it and know why the rewrite is needed. After modifying files, record every file you touched in `memory/completed-work.md` (and its detail file in `memory/completed-work/`).

## Building

The runner builds the ROM after you finish and hands any errors to a build-fix agent, so don't run the full `make` unless your prompt says to. For early feedback on scripts, species, and trainer data, the cheap validators are fine: `make check_all_quick` from `pokeemerald/`.

## Adding a Species: Sprites

Use the `fetch_pokemon_sprites` MCP tool to download real sprites instead of copying placeholders from another species. It fetches from the pokeemerald-expansion repo into `pokeemerald/graphics/pokemon/<name>/`.

```
fetch_pokemon_sprites(name: "lucario")                   # all sprite files
fetch_pokemon_sprites(name: "lucario", overwrite: true)  # re-download, replacing existing files
```

`name` is lowercase with underscores, matching the expansion repo's folder names (`lucario`, `mr_mime`, `nidoran_f`).

After calling it:
1. `ls pokeemerald/graphics/pokemon/<name>/` and confirm all 7 files exist: `anim_front.png`, `front.png`, `back.png`, `icon.png`, `footprint.png`, `normal.pal`, `shiny.pal`.
2. If any is missing, retry once with `overwrite: true`; if it still fails, copy from a similar species.
3. `git add pokeemerald/graphics/pokemon/<name>/` so the sprites are committed even if auto-staging fails.

Expansion sprites can use more than 16 colours. If the build fails on palettes, reduce to 16 (14 colours + transparency + black). Regional form sprites are made by the Sprite Designer phase, not by you.

## Pokémon Data Tools

The Pokédex MCP tools (`pokemon_stats`, `search_pokemon`, `move_data`, `type_matchup`, `pokemon_learnset`, `smogon_sets`, `smogon_format_pokemon`, `team_type_coverage`) default to Gen 3 data. Use them to check a fact the plan leaves open, such as whether a species learns a move. Don't use them to redesign what the plan specifies.

To see what the ROM itself currently has for a species, call `rom_species(name, sections?)` rather than reading or grepping `species_info.h`, `pokedex_entries.h`, the learnset files, `wild_encounters.json` or `trainer_parties.h`. Those files run to thousands of lines, and whatever you read stays in context for the rest of the cycle. When you need to edit an entry, use `grep -n` to find its line and `Read` with `offset`/`limit` around it.
