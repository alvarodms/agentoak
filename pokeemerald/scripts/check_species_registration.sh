#!/bin/bash
# Species Registration Verification Script
# Checks all required files for a SPECIES_* constant.
# Usage: ./scripts/check_species_registration.sh SPECIES_LUCARIO
# Exit 0 if all present, exit 1 if any missing.

if [ -z "$1" ]; then
    echo "Usage: $0 SPECIES_NAME"
    echo "Example: $0 SPECIES_LUCARIO"
    exit 1
fi

SPECIES="$1"
PASS=0
FAIL=0

check() {
    local file="$1"
    local label="$2"
    if [ ! -f "$file" ]; then
        echo "? $label — FILE NOT FOUND"
        ((FAIL++))
        return
    fi
    if grep -q "$SPECIES" "$file" 2>/dev/null; then
        echo "✓ $label"
        ((PASS++))
    else
        echo "✗ $label — MISSING"
        ((FAIL++))
    fi
}

check "include/constants/species.h" "species.h"
check "include/constants/pokedex.h" "pokedex.h"
check "src/data/pokemon/species_info.h" "species_info.h"
check "src/data/pokemon/level_up_learnsets.h" "level_up_learnsets.h"
check "src/data/pokemon/level_up_learnset_pointers.h" "level_up_learnset_pointers.h"
check "src/data/pokemon/tmhm_learnsets.h" "tmhm_learnsets.h"
check "src/data/pokemon/egg_moves.h" "egg_moves.h"
check "src/data/pokemon/pokedex_text.h" "pokedex_text.h"
check "src/data/pokemon/pokedex_entries.h" "pokedex_entries.h"
check "src/data/pokemon/pokedex_orders.h" "pokedex_orders.h"
check "src/data/graphics/pokemon.h" "pokemon.h (graphics)"
check "include/graphics.h" "graphics.h (extern decls)"
check "src/data/pokemon_graphics/front_pic_anims.h" "front_pic_anims.h"
check "src/pokemon_icon.c" "pokemon_icon.c"
check "src/pokemon.c" "pokemon.c (species mappings)"
check "sound/cry_tables.inc" "cry_tables.inc"
check "src/data/pokemon/cry_ids.h" "cry_ids.h"
check "src/data/pokemon/evolution.h" "evolution.h"
check "src/anim_mon_front_pics.c" "anim_mon_front_pics.c"

echo ""
echo "Results: $PASS passed, $FAIL missing"
[ $FAIL -eq 0 ] && echo "All registrations complete!" && exit 0
exit 1
