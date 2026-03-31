/**
 * Path resolution and constants for the pokeemerald map data format.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Root of the pokeemerald decompilation source tree. */
export const POKEEMERALD_ROOT = path.resolve(__dirname, "../../../pokeemerald");

/** Directory containing all map data (map.json, scripts.inc per map). */
export const MAPS_DIR = path.join(POKEEMERALD_ROOT, "data/maps");

/** Directory containing all layout data (map.bin, border.bin per layout). */
export const LAYOUTS_DIR = path.join(POKEEMERALD_ROOT, "data/layouts");

/** Directory containing tileset data. */
export const TILESETS_DIR = path.join(POKEEMERALD_ROOT, "data/tilesets");

/** Path to the master map groups JSON file. */
export const MAP_GROUPS_PATH = path.join(MAPS_DIR, "map_groups.json");

/** Path to the master layouts JSON file. */
export const LAYOUTS_JSON_PATH = path.join(LAYOUTS_DIR, "layouts.json");
