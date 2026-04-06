/**
 * Validation helpers for porymap write tools.
 *
 * Provides coordinate bounds checking, constant resolution, enum validation,
 * and safe JSON read/write for map.json files.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { POKEEMERALD_ROOT, MAPS_DIR, LAYOUTS_DIR } from "./constants.js";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MapJson {
  id: string;
  name: string;
  layout: string;
  music: string;
  region_map_section: string;
  requires_flash: boolean | string;
  weather: string;
  map_type: string;
  allow_cycling: boolean | string;
  allow_escaping: boolean | string;
  allow_running: boolean | string;
  show_map_name: boolean | string;
  battle_scene: string;
  connections: Array<{
    map: string;
    offset: number;
    direction: string;
  }>;
  object_events: Record<string, unknown>[];
  warp_events: Record<string, unknown>[];
  coord_events: Record<string, unknown>[];
  bg_events: Record<string, unknown>[];
  shared_events_map?: string;
  shared_scripts_map?: string;
}

export interface LayoutEntry {
  id: string;
  name: string;
  width: number | string;
  height: number | string;
  primary_tileset: string;
  secondary_tileset: string;
  border_filepath: string;
  blockdata_filepath: string;
}

interface LayoutsJson {
  layouts_table_label: string;
  layouts: LayoutEntry[];
}

interface MapGroups {
  group_order: string[];
  [groupName: string]: string[] | string;
}

// ─── Caches ─────────────────────────────────────────────────────────────────

let layoutsCache: LayoutsJson | null = null;
let mapGroupsCache: MapGroups | null = null;
/** Maps MAP_CONSTANT → directory name (e.g. MAP_LITTLEROOT_TOWN → LittlerootTown) */
let mapConstantIndex: Map<string, string> | null = null;

export function invalidateCaches(): void {
  layoutsCache = null;
  mapGroupsCache = null;
  mapConstantIndex = null;
}

// ─── JSON I/O ───────────────────────────────────────────────────────────────

async function readJson(filePath: string): Promise<unknown> {
  const text = await fs.readFile(filePath, "utf-8");
  return JSON.parse(text);
}

export async function readMapJson(mapName: string): Promise<MapJson> {
  const mapPath = path.join(MAPS_DIR, mapName, "map.json");
  return (await readJson(mapPath)) as MapJson;
}

/**
 * Write map.json atomically (write to temp, then rename).
 * Preserves pokeemerald's 2-space indent JSON format.
 */
export async function writeMapJson(
  mapName: string,
  data: MapJson,
): Promise<void> {
  const mapPath = path.join(MAPS_DIR, mapName, "map.json");
  const tmpPath = mapPath + ".tmp";
  const content = JSON.stringify(data, null, 2) + "\n";
  await fs.writeFile(tmpPath, content, "utf-8");
  await fs.rename(tmpPath, mapPath);
}

// ─── Layout Helpers ─────────────────────────────────────────────────────────

async function getLayouts(): Promise<LayoutsJson> {
  if (!layoutsCache) {
    const layoutsPath = path.join(LAYOUTS_DIR, "layouts.json");
    layoutsCache = (await readJson(layoutsPath)) as LayoutsJson;
  }
  return layoutsCache;
}

export async function findLayout(
  layoutId: string,
): Promise<LayoutEntry | undefined> {
  const layouts = await getLayouts();
  return layouts.layouts.find((l) => l.id === layoutId);
}

export async function getLayoutForMap(
  mapName: string,
): Promise<{ width: number; height: number } | null> {
  try {
    const mapData = await readMapJson(mapName);
    const layout = await findLayout(mapData.layout);
    if (!layout) return null;
    return { width: Number(layout.width), height: Number(layout.height) };
  } catch {
    return null;
  }
}

// ─── Map Existence / Groups ─────────────────────────────────────────────────

async function getMapGroups(): Promise<MapGroups> {
  if (!mapGroupsCache) {
    const groupsPath = path.join(MAPS_DIR, "map_groups.json");
    mapGroupsCache = (await readJson(groupsPath)) as MapGroups;
  }
  return mapGroupsCache;
}

export async function mapExists(mapName: string): Promise<boolean> {
  try {
    await fs.access(path.join(MAPS_DIR, mapName, "map.json"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Build an index of MAP_CONSTANT → directory name by reading every map.json.
 * Cached after first call.
 */
async function buildMapConstantIndex(): Promise<Map<string, string>> {
  if (mapConstantIndex) return mapConstantIndex;

  const groups = await getMapGroups();
  const index = new Map<string, string>();

  for (const groupName of groups.group_order) {
    const maps = groups[groupName];
    if (!Array.isArray(maps)) continue;
    for (const dirName of maps) {
      try {
        const mapData = await readMapJson(dirName);
        index.set(mapData.id, dirName);
      } catch {
        // Skip maps that can't be read
      }
    }
  }

  mapConstantIndex = index;
  return index;
}

/**
 * Resolve a MAP_* constant to a directory name.
 * Returns null if the map doesn't exist.
 */
export async function resolveMapConstant(
  mapConstant: string,
): Promise<string | null> {
  const index = await buildMapConstantIndex();
  return index.get(mapConstant) ?? null;
}

// ─── Coordinate Validation ──────────────────────────────────────────────────

export function coordsInBounds(
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  return x >= 0 && x < width && y >= 0 && y < height;
}

// ─── Uniqueness Checks ─────────────────────────────────────────────────────

export function isUniqueLocalId(
  mapData: MapJson,
  localId: string,
): boolean {
  return !mapData.object_events.some(
    (e) => (e as Record<string, unknown>).local_id === localId,
  );
}

export function isUniqueWarpId(
  mapData: MapJson,
  warpId: string,
): boolean {
  return !mapData.warp_events.some(
    (e) => (e as Record<string, unknown>).warp_id === warpId,
  );
}

// ─── Known Constants (best-effort enum validation) ──────────────────────────

export const VALID_WEATHER = new Set([
  "WEATHER_NONE",
  "WEATHER_SUNNY_CLOUDS",
  "WEATHER_SUNNY",
  "WEATHER_RAIN",
  "WEATHER_SNOW",
  "WEATHER_RAIN_THUNDERSTORM",
  "WEATHER_FOG_HORIZONTAL",
  "WEATHER_VOLCANIC_ASH",
  "WEATHER_SANDSTORM",
  "WEATHER_FOG_DIAGONAL",
  "WEATHER_UNDERWATER",
  "WEATHER_SHADE",
  "WEATHER_DROUGHT",
  "WEATHER_DOWNPOUR",
  "WEATHER_UNDERWATER_BUBBLES",
  "WEATHER_ABNORMAL",
  "WEATHER_ROUTE119_CYCLE",
  "WEATHER_ROUTE123_CYCLE",
]);

export const VALID_MAP_TYPES = new Set([
  "MAP_TYPE_NONE",
  "MAP_TYPE_TOWN",
  "MAP_TYPE_CITY",
  "MAP_TYPE_ROUTE",
  "MAP_TYPE_UNDERGROUND",
  "MAP_TYPE_UNDERWATER",
  "MAP_TYPE_OCEAN_ROUTE",
  "MAP_TYPE_UNKNOWN",
  "MAP_TYPE_INDOOR",
  "MAP_TYPE_SECRET_BASE",
]);

export const VALID_BATTLE_SCENES = new Set([
  "MAP_BATTLE_SCENE_NORMAL",
  "MAP_BATTLE_SCENE_GYM",
  "MAP_BATTLE_SCENE_MAGMA",
  "MAP_BATTLE_SCENE_AQUA",
  "MAP_BATTLE_SCENE_SIDNEY",
  "MAP_BATTLE_SCENE_PHOEBE",
  "MAP_BATTLE_SCENE_GLACIA",
  "MAP_BATTLE_SCENE_DRAKE",
  "MAP_BATTLE_SCENE_FRONTIER",
]);

export const VALID_DIRECTIONS = new Set(["up", "down", "left", "right"]);

/** Properties that are safe to modify via set_map_properties. */
export const EDITABLE_PROPERTIES = new Set([
  "music",
  "weather",
  "map_type",
  "region_map_section",
  "battle_scene",
  "requires_flash",
  "allow_cycling",
  "allow_escaping",
  "allow_running",
  "show_map_name",
]);

/** Boolean-typed properties. */
export const BOOLEAN_PROPERTIES = new Set([
  "requires_flash",
  "allow_cycling",
  "allow_escaping",
  "allow_running",
  "show_map_name",
]);

// ─── Validation Result ──────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export function formatErrors(errors: ValidationError[]): string {
  return errors.map((e) => `  - ${e.field}: ${e.message}`).join("\n");
}
