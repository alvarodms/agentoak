#!/bin/bash
# Evolution Consistency Validator
# Checks evolution.h for orphaned species, invalid methods, and branching evo issues.
# Usage: bash scripts/check_evolution_consistency.sh
# Run from the pokeemerald/ directory.

EVOLUTION_H="src/data/pokemon/evolution.h"
SPECIES_H="include/constants/species.h"
POKEMON_H="include/constants/pokemon.h"

for f in "$EVOLUTION_H" "$SPECIES_H" "$POKEMON_H"; do
    if [ ! -f "$f" ]; then
        echo "ERROR: Required file $f not found. Run from pokeemerald/ directory."
        exit 2
    fi
done

echo "=== Evolution Consistency Validation ==="
echo ""

PASS=0
FAIL=0

check_pass() {
    echo "  PASS: $1"
    PASS=$((PASS + 1))
}

check_fail() {
    echo "  FAIL: $1"
    FAIL=$((FAIL + 1))
}

# Load all defined SPECIES_* constants
DEFINED_SPECIES=$(grep -oP '#define\s+\KSPECIES_\w+' "$SPECIES_H")

# Load all defined EVO_* method constants (exclude EVO_MODE_*)
DEFINED_METHODS=$(grep -oP '#define\s+\KEVO_(?!MODE_)\w+' "$POKEMON_H")

# --- Check 1: Source species exist in species.h ---
echo "--- Check 1: Source species exist in species.h ---"
SOURCE_SPECIES=$(grep -oP '^\s*\[(\KSPECIES_\w+)(?=\])' "$EVOLUTION_H")
SRC_FAIL=0
for sp in $SOURCE_SPECIES; do
    if ! echo "$DEFINED_SPECIES" | grep -qx "$sp"; then
        check_fail "Source species $sp not defined in species.h"
        SRC_FAIL=1
    fi
done
if [ "$SRC_FAIL" -eq 0 ]; then
    COUNT=$(echo "$SOURCE_SPECIES" | wc -l)
    check_pass "All $COUNT source species exist in species.h"
fi
echo ""

# --- Check 2: Target species exist in species.h ---
echo "--- Check 2: Evolution target species exist in species.h ---"
TARGET_SPECIES=$(grep -v '^\s*//' "$EVOLUTION_H" | grep -oP 'SPECIES_\w+' | grep -v '^\s*\[' | sort -u)
# More precise: extract the third field from {EVO_*, value, SPECIES_TARGET} tuples
TARGET_SPECIES=$(grep -v '^\s*//' "$EVOLUTION_H" | grep -oP '\{EVO_\w+,\s*\w+,\s*\KSPECIES_\w+' | sort -u)
TGT_FAIL=0
for sp in $TARGET_SPECIES; do
    if ! echo "$DEFINED_SPECIES" | grep -qx "$sp"; then
        check_fail "Target species $sp not defined in species.h"
        TGT_FAIL=1
    fi
done
if [ "$TGT_FAIL" -eq 0 ]; then
    COUNT=$(echo "$TARGET_SPECIES" | wc -l)
    check_pass "All $COUNT evolution target species exist in species.h"
fi
echo ""

# --- Check 3: Evolution methods are valid ---
echo "--- Check 3: Evolution methods are valid ---"
USED_METHODS=$(grep -v '^\s*//' "$EVOLUTION_H" | grep -oP '\{\KEVO_\w+' | sort -u)
MTH_FAIL=0
for method in $USED_METHODS; do
    if ! echo "$DEFINED_METHODS" | grep -qx "$method"; then
        check_fail "Evolution method $method not defined in pokemon.h"
        MTH_FAIL=1
    fi
done
if [ "$MTH_FAIL" -eq 0 ]; then
    COUNT=$(echo "$USED_METHODS" | wc -l)
    check_pass "All $COUNT evolution methods are valid"
fi
echo ""

# --- Check 4: No duplicate evolution methods for same source ---
echo "--- Check 4: No duplicate evolution entries for same source ---"
DUP_FAIL=0
for sp in $SOURCE_SPECIES; do
    # Extract all {EVO_METHOD, value, TARGET} tuples for this source
    BLOCK=$(sed -n "/\[$sp\]/,/\]/p" "$EVOLUTION_H" | grep -v '^\s*//')
    ENTRIES=$(echo "$BLOCK" | grep -oP '\{EVO_\w+,\s*\w+,\s*SPECIES_\w+\}')
    if [ -n "$ENTRIES" ]; then
        # Check for exact duplicate entries
        DUPES=$(echo "$ENTRIES" | sort | uniq -d)
        if [ -n "$DUPES" ]; then
            check_fail "$sp has duplicate evolution entries: $(echo $DUPES | tr '\n' ' ')"
            DUP_FAIL=1
        fi
    fi
done
if [ "$DUP_FAIL" -eq 0 ]; then
    check_pass "No duplicate evolution entries found"
fi
echo ""

# --- Check 5: Gender-gated evolutions target valid species ---
echo "--- Check 5: Gender-gated evolutions (EVO_LEVEL_FEMALE) ---"
GENDER_EVOS=$(grep -v '^\s*//' "$EVOLUTION_H" | grep 'EVO_LEVEL_FEMALE')
GEN_FAIL=0
if [ -n "$GENDER_EVOS" ]; then
    while IFS= read -r line; do
        TARGET=$(echo "$line" | grep -oP '\{EVO_LEVEL_FEMALE,\s*\w+,\s*\KSPECIES_\w+')
        SOURCE=$(echo "$line" | grep -oP '^\s*\[\KSPECIES_\w+' || true)
        # If no source on this line, find it from context (multi-line block)
        if [ -z "$SOURCE" ]; then
            # Find the source by looking at surrounding context
            LINE_NUM=$(grep -n "EVO_LEVEL_FEMALE" "$EVOLUTION_H" | grep -v '^\s*//' | head -1 | cut -d: -f1)
            SOURCE=$(head -n "$LINE_NUM" "$EVOLUTION_H" | grep -oP '^\s*\[\KSPECIES_\w+' | tail -1)
        fi
        if [ -n "$TARGET" ]; then
            if ! echo "$DEFINED_SPECIES" | grep -qx "$TARGET"; then
                check_fail "Gender-gated evo target $TARGET (from $SOURCE) not in species.h"
                GEN_FAIL=1
            fi
        fi
    done <<< "$GENDER_EVOS"
    if [ "$GEN_FAIL" -eq 0 ]; then
        COUNT=$(echo "$GENDER_EVOS" | wc -l)
        check_pass "All $COUNT gender-gated evolution targets are valid"
    fi
else
    check_pass "No gender-gated evolutions to check"
fi
echo ""

# --- Check 6: Branching evo targets are all unique ---
echo "--- Check 6: Branching evo targets are unique per source ---"
BRANCH_FAIL=0
for sp in $SOURCE_SPECIES; do
    BLOCK=$(sed -n "/\[$sp\]/,/\]/p" "$EVOLUTION_H" | grep -v '^\s*//')
    TARGETS=$(echo "$BLOCK" | grep -oP '\{EVO_\w+,\s*\w+,\s*\KSPECIES_\w+')
    if [ -n "$TARGETS" ]; then
        TARGET_COUNT=$(echo "$TARGETS" | wc -l)
        UNIQUE_COUNT=$(echo "$TARGETS" | sort -u | wc -l)
        if [ "$TARGET_COUNT" -ne "$UNIQUE_COUNT" ]; then
            DUPES=$(echo "$TARGETS" | sort | uniq -d)
            check_fail "$sp has duplicate target species: $(echo $DUPES | tr '\n' ' ')"
            BRANCH_FAIL=1
        fi
    fi
done
if [ "$BRANCH_FAIL" -eq 0 ]; then
    check_pass "All branching evolutions have unique targets"
fi
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
