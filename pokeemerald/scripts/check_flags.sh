#!/usr/bin/env bash
# check_flags.sh — Detect flags that are checked but never set in map scripts.
# Run from pokeemerald root: bash scripts/check_flags.sh

set -uo pipefail

SCRIPT_DIRS="data/maps"

# Verify we're in the right directory
if [[ ! -d "$SCRIPT_DIRS" ]]; then
    echo "ERROR: $SCRIPT_DIRS not found. Run from pokeemerald root."
    exit 2
fi

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

# --- Allowlisted flag prefixes ---
# These flags are set by C code, the engine, or subsystems — not by script setflag commands.
# Add new prefixes here as needed.
ALLOWED_PREFIXES=(
    "FLAG_SYS_"
    "FLAG_BADGE"
    "FLAG_DEFEATED_"
    "FLAG_RECEIVED_"
    "FLAG_HIDDEN_ITEM_"
    "FLAG_ITEM_"
    "FLAG_VISITED_"
    "FLAG_LANDMARK_"
    "FLAG_MAP_SCRIPT_"
    "FLAG_TEMP_"
    "FLAG_DAILY_"
    "FLAG_UNUSED_"
    "FLAG_LATIOS_OR_LATIAS_ROAMING"
    "FLAG_HIDE_"
    "FLAG_RYU_"
    "FLAG_HAS_MATCH_CALL"
    "FLAG_ENABLE_"
    "FLAG_INTERACTED_"
    "FLAG_REGI_"
    "FLAG_CANCEL_"
    "FLAG_CHOSEN_"
    "FLAG_SHOWN_"
    "FLAG_GROUDON_"
    "FLAG_KYOGRE_"
    "FLAG_LEGEND_"
    "FLAG_FORCE_"
    "FLAG_COLLECTED_"
    "FLAG_OPENED_"
    "FLAG_TRICK_"
    "FLAG_ENCOUNTERED_"
    "FLAG_GOOD_"
    "FLAG_SET_"
    "FLAG_SEALED_"
    "FLAG_REGISTERED_"
    "FLAG_UNLOCKED_"
    "FLAG_DECORATION_"
    "FLAG_DEVON_GOODS_STOLEN"
    "FLAG_RECOVERED_DEVON_GOODS"
    "FLAG_MET_DEVON_EMPLOYEE"
    "FLAG_RESCUED_PEEKO"
    "FLAG_DELIVERED_STEVEN_LETTER"
    "FLAG_RECEIVED_POKENAV"
    "FLAG_ADDED_"
    "FLAG_BEAST_"
    "FLAG_MIRAGE_"
    "FLAG_PENDING_"
    "FLAG_PETALBURG_MART_"
    "FLAG_RUSTURF_TUNNEL_"
    "FLAG_ADVENTURE_STARTED"
)

# Build a grep pattern from the prefixes for filtering
is_allowed() {
    local flag="$1"
    for prefix in "${ALLOWED_PREFIXES[@]}"; do
        if [[ "$flag" == ${prefix}* ]]; then
            return 0
        fi
    done
    return 1
}

# --- Collect all flags that are CHECKED in scripts ---
# Patterns: checkflag, goto_if_set, goto_if_unset (which is goto_if_not_set alias)
grep -rPohn '(?:checkflag|goto_if_set|goto_if_unset|goto_if_not_set)\s+(FLAG_\w+)' \
    "$SCRIPT_DIRS" --include='*.inc' 2>/dev/null \
    | sed 's/:\([0-9]*\):/:\1\t/' \
    > "$tmpdir/checked_raw.txt" || true

# Extract just the flag names (unique)
grep -oP 'FLAG_\w+' "$tmpdir/checked_raw.txt" | sort -u > "$tmpdir/checked_flags.txt"

# --- Collect all flags that are SET in scripts ---
grep -rPoh '(?:setflag|clearflag)\s+(FLAG_\w+)' \
    "$SCRIPT_DIRS" --include='*.inc' 2>/dev/null \
    | grep -oP 'FLAG_\w+' | sort -u > "$tmpdir/set_flags.txt" || true

# --- Find flags checked but never set ---
errors=0

while IFS= read -r flag; do
    # Skip allowlisted flags
    if is_allowed "$flag"; then
        continue
    fi
    # Check if this flag is ever set
    if ! grep -q "^${flag}$" "$tmpdir/set_flags.txt"; then
        # Report each location where it's checked
        grep -rPn "(?:checkflag|goto_if_set|goto_if_unset|goto_if_not_set)\s+${flag}" \
            "$SCRIPT_DIRS" --include='*.inc' 2>/dev/null | while IFS= read -r line; do
            echo "ERROR: $flag is checked but never set by any script setflag: $line"
        done
        ((errors++))
    fi
done < "$tmpdir/checked_flags.txt"

if [[ "$errors" -gt 0 ]]; then
    echo "check_flags: $errors flag(s) checked but never set"
    exit 1
else
    echo "check_flags: all flag references verified"
    exit 0
fi
