#!/usr/bin/env bash
# check_trainers.sh — Cross-reference trainer constants, entries, and party data.
# Run from pokeemerald root: bash scripts/check_trainers.sh

set -uo pipefail

OPPONENTS="include/constants/opponents.h"
TRAINERS="src/data/trainers.h"
PARTIES="src/data/trainer_parties.h"

errors=0
warnings=0

for f in "$OPPONENTS" "$TRAINERS" "$PARTIES"; do
    if [[ ! -f "$f" ]]; then
        echo "ERROR: Required file $f not found. Run from pokeemerald root."
        exit 2
    fi
done

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

# Extract all TRAINER_ constants from opponents.h (skip TRAINER_NONE and guards)
grep -oP '#define\s+\K(TRAINER_\w+)' "$OPPONENTS" | grep -v '^TRAINER_NONE$' | sort -u > "$tmpdir/opp_constants.txt"

# Extract all [TRAINER_*] entries from trainers.h
grep -oP '\[\K(TRAINER_\w+)(?=\])' "$TRAINERS" | sort -u > "$tmpdir/trainer_entries.txt"

# --- Check 1: Every TRAINER_ constant in opponents.h has a [TRAINER_] entry in trainers.h ---
while IFS= read -r name; do
    echo "ERROR: $name ($OPPONENTS) has no entry in $TRAINERS"
    ((errors++))
done < <(comm -23 "$tmpdir/opp_constants.txt" "$tmpdir/trainer_entries.txt")

# Extract trainer-to-party mappings from trainers.h (trainer name -> macro(party))
# Approach: awk to pair each [TRAINER_X] with its .party line
awk '
/\[TRAINER_[A-Z0-9_]+\]/ {
    s = $0
    gsub(/.*\[/, "", s)
    gsub(/\].*/, "", s)
    trainer = s
}
/(NO_ITEM_DEFAULT_MOVES|NO_ITEM_CUSTOM_MOVES|ITEM_DEFAULT_MOVES|ITEM_CUSTOM_MOVES)\(sParty_/ {
    match($0, /(NO_ITEM_DEFAULT_MOVES|NO_ITEM_CUSTOM_MOVES|ITEM_DEFAULT_MOVES|ITEM_CUSTOM_MOVES)/)
    macro = substr($0, RSTART, RLENGTH)
    match($0, /sParty_[A-Za-z0-9_]+/)
    party = substr($0, RSTART, RLENGTH)
    print trainer "\t" macro "\t" party
}
' "$TRAINERS" > "$tmpdir/trainer_party_map.txt"

# Extract all party array definitions from trainer_parties.h
grep -oP 'sParty_\w+(?=\s*\[\])' "$PARTIES" | sort -u > "$tmpdir/party_defs.txt"

# Build a map of party name -> struct type
awk '/sParty_.*\[\]/ {
    match($0, /struct\s+\w+/)
    stype = substr($0, RSTART+7, RLENGTH-7)
    match($0, /sParty_[A-Za-z0-9_]+/)
    party = substr($0, RSTART, RLENGTH)
    print party "\t" stype
}' "$PARTIES" > "$tmpdir/party_struct_map.txt"

# --- Check 2: Every trainer's party reference exists in trainer_parties.h ---
while IFS=$'\t' read -r trainer macro party; do
    if ! grep -q "^${party}$" "$tmpdir/party_defs.txt"; then
        echo "ERROR: $TRAINERS entry for $trainer references party $party but it doesn't exist in $PARTIES"
        ((errors++))
    fi
done < "$tmpdir/trainer_party_map.txt"

# --- Check 3: Every party array in trainer_parties.h is referenced by at least one trainer ---
cut -f3 "$tmpdir/trainer_party_map.txt" | sort -u > "$tmpdir/referenced_parties.txt"
while IFS= read -r party; do
    echo "WARN: $party in $PARTIES is not referenced by any trainer in $TRAINERS"
    ((warnings++))
done < <(comm -23 "$tmpdir/party_defs.txt" "$tmpdir/referenced_parties.txt")

# --- Check 4: Party macro matches struct type ---
declare -A MACRO_TO_STRUCT=(
    [NO_ITEM_DEFAULT_MOVES]="TrainerMonNoItemDefaultMoves"
    [NO_ITEM_CUSTOM_MOVES]="TrainerMonNoItemCustomMoves"
    [ITEM_DEFAULT_MOVES]="TrainerMonItemDefaultMoves"
    [ITEM_CUSTOM_MOVES]="TrainerMonItemCustomMoves"
)

while IFS=$'\t' read -r trainer macro party; do
    expected="${MACRO_TO_STRUCT[$macro]:-}"
    if [[ -z "$expected" ]]; then
        continue
    fi
    actual=$(awk -F'\t' -v p="$party" '$1 == p {print $2}' "$tmpdir/party_struct_map.txt")
    if [[ -n "$actual" && "$actual" != "$expected" ]]; then
        echo "ERROR: $party uses macro $macro (expects $expected) but is declared as $actual"
        ((errors++))
    fi
done < "$tmpdir/trainer_party_map.txt"

echo "check_trainers: $errors errors, $warnings warnings"
if [[ "$errors" -gt 0 ]]; then
    exit 1
fi
exit 0
