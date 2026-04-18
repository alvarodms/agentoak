# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
Review when planning — items deferred 5+ cycles signal recurring friction.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 211 | **Quest scaffolding system**: Standardized flag naming (FLAG_QUEST_{name}_{STAGE}), validation script, 3-state flag recipe. Not causing friction — revisit if quest-heavy cycles resume. | pending |
| 217→230 | **Pipeline rewrite**: Replace add_regional_form.cjs with config-driven species generator. Gap-filler (C222) partially addresses. 17 species added without full rewrite. Revisit if species velocity increases in v2.2. | pending |
| 227→234 | **Palette recolor helper**: CLI tool (reads .pal + color mapping JSON → recolored output). Also handles PNG embedded palettes. Deferred 7 cycles. Not blocking — Sprite Designer handles palette creation programmatically. Lower priority than RGBA script. | pending |
| 227→234 | **RGBA auto-conversion script** (scripts/convert_sprites_indexed.cjs): Reads RGBA PNGs, extracts 16-color palette, writes indexed PNGs. Eliminates 5-10 manual actions per species cycle. Deferred 7 cycles. **Priority: HIGH — must ship before v2.2 custom species work.** | pending — target C239 |
| 235 | RGBA auto-conversion script (scripts/convert_sprites_indexed.cjs): Node.js + pngjs tool that reads RGBA PNGs, extracts 16-color palette, writes indexed PNGs. Eliminates 5-10 manual actions per species addition. Deferred 8 cycles now. MUST ship before v2.2 custom species work — target C239. The longer this is deferred, the more manual sprite conversion debt accumulates across v2.2's planned 5+ new species. | pending |
