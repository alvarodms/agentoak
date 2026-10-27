#!/bin/bash
# Palette regression guard for Hoenn regional forms (C314, #201/#163).
#   Check 1: no *_hoenn/normal.pal may be byte-identical to its vanilla species (FAIL);
#            an identical shiny.pal is only a WARN.
#   Check 2: every *_hoenn/{normal,shiny}.pal must match scripts/palette_manifest.sha256.
# After an INTENTIONAL palette change, regenerate the manifest:
#   bash scripts/check_palettes.sh --update
cd "$(dirname "$0")/.."

MANIFEST=scripts/palette_manifest.sha256

if [ "$1" = "--update" ]; then
    sha256sum graphics/pokemon/*_hoenn/normal.pal graphics/pokemon/*_hoenn/shiny.pal | sort -k2 > "$MANIFEST"
    echo "Palette manifest updated ($(wc -l < "$MANIFEST") files)"
    exit 0
fi

errors=0
count=0

# Check 1: vanilla reversion
for d in graphics/pokemon/*_hoenn; do
    base=${d%_hoenn}
    if [ -f "$base/normal.pal" ] && cmp -s "$base/normal.pal" "$d/normal.pal"; then
        echo "FAIL: $d/normal.pal identical to vanilla $base"
        errors=$((errors + 1))
    fi
    if [ -f "$base/shiny.pal" ] && cmp -s "$base/shiny.pal" "$d/shiny.pal"; then
        echo "WARN: $d/shiny.pal identical to vanilla $base"
    fi
done

# Check 2: checksum manifest
if [ ! -f "$MANIFEST" ]; then
    echo "FAIL: $MANIFEST missing (run with --update)"
    errors=$((errors + 1))
else
    if ! mismatches=$(sha256sum -c --quiet "$MANIFEST" 2>&1); then
        echo "$mismatches"
        echo "FAIL: palette changed — if intentional, run bash scripts/check_palettes.sh --update"
        errors=$((errors + 1))
    fi
    for f in graphics/pokemon/*_hoenn/*.pal; do
        count=$((count + 1))
        if ! grep -qF "  $f" "$MANIFEST"; then
            echo "FAIL: $f not in $MANIFEST (run with --update)"
            errors=$((errors + 1))
        fi
    done
fi

if [ "$errors" -gt 0 ]; then
    echo "Palette check FAILED ($errors error(s))"
    exit 1
fi
echo "Palette check passed ($count files)"
exit 0
