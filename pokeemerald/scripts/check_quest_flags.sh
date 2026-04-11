#!/bin/bash
# check_quest_flags.sh — Verify all FLAG_QUEST_* are properly used
#
# For each FLAG_QUEST_* in flags.h, checks that it appears in:
#   1. At least one setflag call
#   2. At least one goto_if_set (or checkflag/compare) call
#
# Reports orphaned flags that may indicate incomplete quest wiring.
# Created: Cycle 202

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FLAGS_H="$ROOT/include/constants/flags.h"

if [ ! -f "$FLAGS_H" ]; then
    echo "ERROR: Cannot find $FLAGS_H"
    exit 1
fi

# Extract all FLAG_QUEST_* names
FLAGS=$(grep -oP 'FLAG_QUEST_\w+' "$FLAGS_H" | sort -u)
COUNT=$(echo "$FLAGS" | wc -l)

echo "=== Quest Flag Validation ==="
echo "Found $COUNT FLAG_QUEST_* definitions"
echo ""

ERRORS=0

for FLAG in $FLAGS; do
    # Check setflag usage (in .inc script files)
    SET_COUNT=$(grep -rl "setflag $FLAG" "$ROOT/data/" "$ROOT/src/" 2>/dev/null | wc -l || true)

    # Check goto_if_set / checkflag usage
    CHECK_COUNT=$(grep -rl "$FLAG" "$ROOT/data/" "$ROOT/src/" 2>/dev/null \
        | xargs grep -l "goto_if_set\|checkflag\|compare\|goto_if_unset" 2>/dev/null \
        | wc -l || true)

    if [ "$SET_COUNT" -eq 0 ] && [ "$CHECK_COUNT" -eq 0 ]; then
        echo "  [ORPHAN]  $FLAG — never set, never checked"
        ERRORS=$((ERRORS + 1))
    elif [ "$SET_COUNT" -eq 0 ]; then
        echo "  [NO SET]  $FLAG — checked but never set"
        ERRORS=$((ERRORS + 1))
    elif [ "$CHECK_COUNT" -eq 0 ]; then
        echo "  [NO CHK]  $FLAG — set but never checked"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [OK]      $FLAG (set: $SET_COUNT, check: $CHECK_COUNT)"
    fi
done

echo ""
if [ "$ERRORS" -gt 0 ]; then
    echo "Found $ERRORS issue(s)."
    exit 1
else
    echo "All $COUNT quest flags are properly wired."
fi
