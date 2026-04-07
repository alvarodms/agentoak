#!/usr/bin/env bash
# check_encounters.sh — Validate wild encounter table data integrity.
# Run from pokeemerald root: bash scripts/check_encounters.sh

set -uo pipefail

ENCOUNTERS="src/data/wild_encounters.json"
SPECIES_H="include/constants/species.h"

for f in "$ENCOUNTERS" "$SPECIES_H"; do
    if [[ ! -f "$f" ]]; then
        echo "ERROR: Required file $f not found. Run from pokeemerald root."
        exit 2
    fi
done

node - "$ENCOUNTERS" "$SPECIES_H" << 'JSEOF'
const fs = require('fs');

const encountersPath = process.argv[2];
const speciesHPath = process.argv[3];

// Load species constants
const speciesH = fs.readFileSync(speciesHPath, 'utf8');
const speciesDefs = new Set(speciesH.match(/#define\s+(SPECIES_\w+)/g)?.map(m => m.split(/\s+/)[1]) || []);

// Load encounters
const data = JSON.parse(fs.readFileSync(encountersPath, 'utf8'));

let errors = 0;
let warnings = 0;

const EXPECTED_COUNTS = {
    land_mons: 12,
    water_mons: 5,
    fishing_mons: 10,
    rock_smash_mons: 5,
};

for (const group of (data.wild_encounter_groups || [])) {
    const groupLabel = group.label || 'unknown';
    const seenMaps = {};

    for (const entry of (group.encounters || [])) {
        const mapName = entry.map || 'UNKNOWN';
        const baseLabel = entry.base_label || mapName;

        // Check 4: duplicate maps
        if (mapName in seenMaps) {
            console.log(`WARN: Duplicate map '${mapName}' in group '${groupLabel}' (first: ${seenMaps[mapName]}, also: ${baseLabel})`);
            warnings++;
        }
        seenMaps[mapName] = baseLabel;

        for (const [monType, expectedCount] of Object.entries(EXPECTED_COUNTS)) {
            const monsData = entry[monType];
            if (!monsData) continue;
            const mons = monsData.mons || [];

            // Check 2: slot counts
            if (mons.length !== expectedCount) {
                console.log(`ERROR: ${mapName} ${monType} has ${mons.length} entries (expected ${expectedCount})`);
                errors++;
            }

            mons.forEach((mon, i) => {
                const species = mon.species || '';
                const minLv = mon.min_level || 0;
                const maxLv = mon.max_level || 0;

                // Check 1: species exists
                if (species && !speciesDefs.has(species)) {
                    console.log(`ERROR: ${mapName} ${monType}[${i}] references ${species} which is not defined in species.h`);
                    errors++;
                }

                // Check 3: level sanity
                if (minLv > maxLv) {
                    console.log(`ERROR: ${mapName} ${monType}[${i}] min_level (${minLv}) > max_level (${maxLv})`);
                    errors++;
                }
                if (minLv < 2 || maxLv > 70) {
                    console.log(`WARN: ${mapName} ${monType}[${i}] level range ${minLv}-${maxLv} outside expected 2-70`);
                    warnings++;
                }
            });
        }
    }
}

console.log(`check_encounters: ${errors} errors, ${warnings} warnings`);
process.exit(errors > 0 ? 1 : 0);
JSEOF
