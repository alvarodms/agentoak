#!/bin/bash
# Dialogue integrity checker for .inc script files
# Catches the #1 recurring build failure class: smart quotes and missing terminators
ERRORS=0

# Smart quotes (curly quotes that break the build)
SMART=$(grep -rn $'[\xe2\x80\x9c\xe2\x80\x9d\xe2\x80\x98\xe2\x80\x99]' data/maps/*/scripts.inc data/scripts/*.inc 2>/dev/null)
if [ -n "$SMART" ]; then
    echo "ERROR: Smart quotes found (replace with straight quotes):"
    echo "$SMART"
    ERRORS=$((ERRORS + 1))
fi

# Missing $ terminators in .string blocks
MISSING=$(grep -Pn '\.string\s+"[^"]*[^$\\]"' data/maps/*/scripts.inc data/scripts/*.inc 2>/dev/null | grep -v '\$"' | grep -v '\\n"' | grep -v '\\l"' | grep -v '\\p"')
if [ -n "$MISSING" ]; then
    echo "WARNING: Possible missing \$ terminator in .string:"
    echo "$MISSING"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
    echo "Dialogue check passed."
fi
exit $ERRORS
