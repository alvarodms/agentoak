# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming (FLAG_QUEST_{name}_{STAGE}), validation script, 3-state flag recipe. Not causing friction — revisit if quest-heavy cycles resume. | pending |
| 217→230 | **Pipeline rewrite**: Replace add_regional_form.cjs with config-driven species generator. Gap-filler (C222) partially addresses. 17 species added without full rewrite. Revisit if species velocity increases in v2.2. | pending |
| 227→234 | **Palette recolor helper**: CLI tool (reads .pal + color mapping JSON → recolored output). Also handles PNG embedded palettes. Deferred 7 cycles. Not blocking — Sprite Designer handles palette creation programmatically. Lower priority than RGBA script. | pending |
| 227→239 | **RGBA auto-conversion script** (scripts/convert_sprites_indexed.cjs): Reads RGBA PNGs, extracts 16-color palette, writes indexed PNGs. Eliminates 5-10 manual actions per species cycle. | **done** — shipped C239 |
| 239 | Config-driven species generator (pipeline rewrite from C217): Replace the ad-hoc 19-file manual pipeline with a JSON config that generates species boilerplate. With 19 custom species shipped and 3+ more planned for v2.2, this is the biggest velocity bottleneck. Would reduce species addition from 3-4 cycles to 1. Revisit after Deoxys_Hoenn validates the pipeline for fully custom (non-variant) species in C240. | pending |
| 240 | Config-driven species generator (4th flag, C217→C230→C239→C240): With Deoxys_Hoenn as the 20th manual species addition and 3+ more planned for v2.2, the 19-file manual pipeline remains the single biggest velocity bottleneck. C240 validates the pipeline for fully custom (non-variant) species — use that experience to spec the config format. Target C244 or C250: 1 JSON config in → 19 files out. Every future species cycle drops from 3-4 cycles to 1. | pending |
