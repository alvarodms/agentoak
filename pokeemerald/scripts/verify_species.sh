#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: bash scripts/verify_species.sh <SPECIES_NAME>"
  echo "  e.g. bash scripts/verify_species.sh LOTAD_HOENN"
  exit 1
fi

NAME=$(echo "$1" | tr '[:lower:]' '[:upper:]')
SPECIES="SPECIES_${NAME}"

# Build PascalCase for files that use it (e.g., gMonFrontPic_LotadHoenn)
to_pascal() {
  echo "$1" | awk -F'_' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS=''
}
PASCAL=$(to_pascal "$NAME")

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

TARGET_FILES=(
  "include/constants/species.h"
  "include/constants/pokedex.h"
  "src/data/pokemon/species_info.h"
  "src/data/pokemon/level_up_learnsets.h"
  "src/data/pokemon/level_up_learnset_pointers.h"
  "src/data/pokemon/tmhm_learnsets.h"
  "src/data/pokemon/egg_moves.h"
  "src/data/pokemon/pokedex_text.h"
  "src/data/pokemon/pokedex_entries.h"
  "src/data/pokemon/pokedex_orders.h"
  "src/data/graphics/pokemon.h"
  "include/graphics.h"
  "src/data/pokemon_graphics/front_pic_anims.h"
  "src/pokemon_icon.c"
  "src/pokemon.c"
  "src/data/pokemon/cry_ids.h"
  "src/data/pokemon/evolution.h"
  "src/anim_mon_front_pics.c"
  "src/data/pokemon_graphics/front_pic_table.h"
  "src/data/pokemon_graphics/back_pic_table.h"
  "src/data/pokemon_graphics/front_pic_coordinates.h"
  "src/data/pokemon_graphics/back_pic_coordinates.h"
  "src/data/pokemon_graphics/palette_table.h"
  "src/data/pokemon_graphics/shiny_palette_table.h"
  "src/data/pokemon_graphics/footprint_table.h"
  "src/data/pokemon_graphics/still_front_pic_table.h"
  "src/data/text/species_names.h"
)

FOUND=0
MISSING=0
TOTAL=${#TARGET_FILES[@]}

echo "Verifying ${SPECIES} across ${TOTAL} files..."
echo ""

for file in "${TARGET_FILES[@]}"; do
  full="${ROOT}/${file}"
  if [ ! -f "$full" ]; then
    echo "  MISSING (file not found) ${file}"
    MISSING=$((MISSING + 1))
    continue
  fi
  if grep -qE "${NAME}|${PASCAL}" "$full" 2>/dev/null; then
    echo "  FOUND   ${file}"
    FOUND=$((FOUND + 1))
  else
    echo "  MISSING ${file}"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
echo "${FOUND}/${TOTAL} files contain ${SPECIES}"

if [ "$MISSING" -gt 0 ]; then
  echo "⚠ ${MISSING} file(s) missing — species registration may be incomplete"
  exit 1
else
  echo "✓ All ${TOTAL} files verified"
  exit 0
fi
