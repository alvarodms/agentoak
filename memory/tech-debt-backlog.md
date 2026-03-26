# Tech Debt Backlog

Engineering investment opportunities identified by the Tech Lead across cycles.
The Producer should review this list when planning — picking up even one item per few cycles compounds over time.

| Cycle | Investment | Status |
|-------|-----------|--------|
| 104 | Dialogue integrity checker script (scripts/check_dialogue.sh): grep all .inc files for common dialogue errors — non-ASCII/smart quotes, missing $ terminators, lines over 35 chars. Would catch the #1 recurring build failure class (smart quote corruption, seen in Cycles 26, 64, 65, 94) before make is even run. ~15 min to implement. Proposed by Tech Lead in Cycle 104. | pending |
