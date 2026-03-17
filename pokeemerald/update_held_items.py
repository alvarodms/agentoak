#!/usr/bin/env python3
"""
Script to update wild Pokemon held items in species_info.h
Based on type-based assignments and special cases
"""

import re
import json
import os

# Define the item mappings
TYPE_ITEMS = {
    'TYPE_FIRE': 'ITEM_CHARCOAL',
    'TYPE_ELECTRIC': 'ITEM_MAGNET',
    'TYPE_WATER': 'ITEM_MYSTIC_WATER',
    'TYPE_GRASS': 'ITEM_MIRACLE_SEED',
    'TYPE_PSYCHIC': 'ITEM_TWISTED_SPOON',
    'TYPE_FIGHTING': 'ITEM_BLACK_BELT',
    'TYPE_POISON': 'ITEM_POISON_BARB',
    'TYPE_GROUND': 'ITEM_SOFT_SAND',
    'TYPE_FLYING': 'ITEM_SHARP_BEAK',
    'TYPE_BUG': 'ITEM_SILVER_POWDER',
    'TYPE_ROCK': 'ITEM_HARD_STONE',
    'TYPE_GHOST': 'ITEM_SPELL_TAG',
    'TYPE_DRAGON': 'ITEM_DRAGON_FANG',
    'TYPE_DARK': 'ITEM_BLACK_GLASSES',
    'TYPE_STEEL': 'ITEM_METAL_COAT',
    'TYPE_ICE': 'ITEM_NEVER_MELT_ICE',
    'TYPE_NORMAL': 'ITEM_ORAN_BERRY'  # Fallback for Normal types
}

# Special case assignments
SPECIAL_CASES = {
    'SPECIES_MAGMAR': {'common': 'ITEM_CHARCOAL', 'rare': 'ITEM_FIRE_STONE'},
    'SPECIES_ELECTABUZZ': {'common': 'ITEM_MAGNET', 'rare': 'ITEM_THUNDER_STONE'},
    'SPECIES_SCYTHER': {'common': 'ITEM_METAL_COAT', 'rare': 'ITEM_METAL_COAT'},
    'SPECIES_DRATINI': {'common': 'ITEM_DRAGON_FANG', 'rare': 'ITEM_LEFTOVERS'},
    'SPECIES_DRAGONAIR': {'common': 'ITEM_DRAGON_FANG', 'rare': 'ITEM_LEFTOVERS'},
    'SPECIES_LARVITAR': {'common': 'ITEM_HARD_STONE', 'rare': 'ITEM_LEFTOVERS'},
    'SPECIES_PUPITAR': {'common': 'ITEM_HARD_STONE', 'rare': 'ITEM_LEFTOVERS'},
    'SPECIES_BAGON': {'common': 'ITEM_DRAGON_FANG', 'rare': 'ITEM_LEFTOVERS'},
    'SPECIES_SHELGON': {'common': 'ITEM_DRAGON_FANG', 'rare': 'ITEM_LEFTOVERS'}
}

FALLBACK_BERRIES = ['ITEM_ORAN_BERRY', 'ITEM_PECHA_BERRY', 'ITEM_CHERI_BERRY']

def get_wild_encounter_species():
    """Extract all unique species from wild encounters JSON"""
    with open('pokeemerald/src/data/wild_encounters.json', 'r') as f:
        data = json.load(f)

    species_set = set()
    for group in data['wild_encounter_groups']:
        for encounter in group['encounters']:
            for area in ['land_mons', 'water_mons', 'rock_smash_mons', 'fishing_mons']:
                if area in encounter:
                    for mon in encounter[area]['mons']:
                        species_set.add(mon['species'])

    return species_set

def determine_held_items(species_name, types):
    """Determine itemCommon and itemRare based on species and types"""

    # Check special cases first
    if species_name in SPECIAL_CASES:
        return SPECIAL_CASES[species_name]['common'], SPECIAL_CASES[species_name]['rare']

    # Type-based assignment - prioritize first type, then second type
    item_common = None
    item_rare = None

    if types[0] in TYPE_ITEMS:
        item_common = TYPE_ITEMS[types[0]]
        item_rare = TYPE_ITEMS[types[0]]
    elif len(types) > 1 and types[1] in TYPE_ITEMS:
        item_common = TYPE_ITEMS[types[1]]
        item_rare = TYPE_ITEMS[types[1]]
    else:
        # Fallback to berry
        item_common = 'ITEM_ORAN_BERRY'
        item_rare = 'ITEM_ORAN_BERRY'

    return item_common, item_rare

def update_species_info():
    """Update the species_info.h file with held items"""

    # Get wild encounter species
    wild_species = get_wild_encounter_species()
    print(f"Found {len(wild_species)} species in wild encounters")

    # Read the species_info.h file
    with open('pokeemerald/src/data/pokemon/species_info.h', 'r') as f:
        content = f.read()

    updated_count = 0

    # Process each wild encounter species
    for species in wild_species:
        # Find the species definition using regex
        pattern = rf'(\[{species}\]\s*=\s*\{{[^}}]*?\.types\s*=\s*\{{\s*([A-Z_]+),\s*([A-Z_]+)\s*\}}[^}}]*?)(\.itemCommon\s*=\s*[^,]+,\s*\.itemRare\s*=\s*[^,]+,)'

        match = re.search(pattern, content, re.DOTALL)
        if match:
            full_match = match.group(0)
            prefix = match.group(1)
            type1 = match.group(2)
            type2 = match.group(3)
            old_items = match.group(4)

            # Determine new held items
            types = [type1, type2] if type2 != type1 else [type1]
            item_common, item_rare = determine_held_items(species, types)

            # Create new item lines
            new_items = f'.itemCommon = {item_common},\n        .itemRare   = {item_rare},'

            # Replace in content
            new_definition = full_match.replace(old_items, new_items)
            content = content.replace(full_match, new_definition)

            print(f"Updated {species}: {type1}/{type2} -> {item_common}/{item_rare}")
            updated_count += 1
        else:
            print(f"WARNING: Could not find definition for {species}")

    # Write the updated content
    with open('pokeemerald/src/data/pokemon/species_info.h', 'w') as f:
        f.write(content)

    print(f"\nUpdated {updated_count} species with held items")
    return updated_count

if __name__ == "__main__":
    os.chdir('/home/runner/work/agentoak/agentoak')
    updated_count = update_species_info()
    print(f"Held item update complete: {updated_count} species updated")