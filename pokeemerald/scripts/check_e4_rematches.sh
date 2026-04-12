#!/bin/bash
# E4 Rematch Validation Script
# Validates level progression, species uniqueness, and regional form placement
# across all 20 E4 rematch parties (5 members x 4 tiers).
#
# Usage: bash scripts/check_e4_rematches.sh
# Run from the pokeemerald/ directory.

PARTIES_FILE="src/data/trainer_parties.h"
PASS=0
FAIL=0

if [ ! -f "$PARTIES_FILE" ]; then
    echo "ERROR: $PARTIES_FILE not found. Run from pokeemerald/ directory."
    exit 1
fi

echo "=== E4 Rematch Validation ==="
echo ""

MEMBERS="Sidney Phoebe Glacia Drake Wallace"

check_pass() {
    echo "  PASS: $1"
    PASS=$((PASS + 1))
}

check_fail() {
    echo "  FAIL: $1"
    FAIL=$((FAIL + 1))
}

# Extract a single party block (from static... to first };)
extract_block() {
    local block_name="$1"
    grep -A 50 "^static.*${block_name}\[\]" "$PARTIES_FILE" | awk '
        /^static/ { found=1 }
        found { print }
        found && /^\};/ { exit }
    '
}

# --- Check 1: No duplicate species within any single party ---
echo "--- Check 1: No duplicate species within a party ---"
for member in $MEMBERS; do
    for tier in 1 2 3 4; do
        block="sParty_${member}Rematch${tier}"
        block_data=$(extract_block "$block")
        species=$(echo "$block_data" | grep '\.species' | sed 's/.*= //;s/,$//' | sed 's/[[:space:]]//g')
        dupes=$(echo "$species" | sort | uniq -d)
        if [ -n "$dupes" ]; then
            check_fail "${member} R${tier} has duplicate species: $(echo $dupes | tr '\n' ' ')"
        else
            check_pass "${member} R${tier} — no duplicate species"
        fi
    done
done
echo ""

# --- Check 2: Level progression across tiers ---
echo "--- Check 2: Level progression (ace T(N) <= lowest T(N+1)) ---"
for member in $MEMBERS; do
    prev_ace=0
    all_ok=true
    for tier in 1 2 3 4; do
        block="sParty_${member}Rematch${tier}"
        block_data=$(extract_block "$block")
        levels=$(echo "$block_data" | grep '\.lvl' | sed 's/.*= //;s/,$//' | sed 's/[[:space:]]//g')
        if [ -z "$levels" ]; then
            check_fail "${member} R${tier} — no levels found"
            all_ok=false
            continue
        fi
        lowest=$(echo "$levels" | sort -n | head -1)
        highest=$(echo "$levels" | sort -n | tail -1)
        if [ "$tier" -gt 1 ] && [ "$lowest" -lt "$prev_ace" ]; then
            check_fail "${member} R${tier} lowest ($lowest) < R$((tier-1)) ace ($prev_ace)"
            all_ok=false
        fi
        prev_ace=$highest
    done
    if [ "$all_ok" = true ]; then
        check_pass "${member} — level progression valid across all tiers"
    fi
done
echo ""

# --- Check 3: Corsola_Hoenn on Phoebe Rematch 2+ ---
echo "--- Check 3: Corsola_Hoenn on Phoebe R2+ ---"
for tier in 2 3 4; do
    block="sParty_PhoebeRematch${tier}"
    block_data=$(extract_block "$block")
    if echo "$block_data" | grep -q 'SPECIES_CORSOLA_HOENN'; then
        check_pass "Phoebe R${tier} has Corsola_Hoenn"
    else
        check_fail "Phoebe R${tier} missing Corsola_Hoenn"
    fi
done
echo ""

# --- Check 4: Arcanine_Hoenn on Wallace Rematch 2+ ---
echo "--- Check 4: Arcanine_Hoenn on Wallace R2+ ---"
for tier in 2 3 4; do
    block="sParty_WallaceRematch${tier}"
    block_data=$(extract_block "$block")
    if echo "$block_data" | grep -q 'SPECIES_ARCANINE_HOENN'; then
        check_pass "Wallace R${tier} has Arcanine_Hoenn"
    else
        check_fail "Wallace R${tier} missing Arcanine_Hoenn"
    fi
done
echo ""

# --- Check 5: Garchomp on Drake Rematch 3+ ---
echo "--- Check 5: Garchomp on Drake R3+ ---"
for tier in 3 4; do
    block="sParty_DrakeRematch${tier}"
    block_data=$(extract_block "$block")
    if echo "$block_data" | grep -q 'SPECIES_GARCHOMP'; then
        check_pass "Drake R${tier} has Garchomp"
    else
        check_fail "Drake R${tier} missing Garchomp"
    fi
done
echo ""

# --- Summary ---
echo "=== Results ==="
echo "PASSED: $PASS"
echo "FAILED: $FAIL"
if [ "$FAIL" -gt 0 ]; then
    echo "STATUS: FAIL"
    exit 1
else
    echo "STATUS: PASS"
    exit 0
fi
