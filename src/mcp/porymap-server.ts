#!/usr/bin/env node
/**
 * Porymap MCP Server — Phase 1 (Read) + Phase 2 (Write)
 *
 * Provides structured access to pokeemerald map data, giving the agent
 * the ability to inspect and safely modify maps, events, layouts,
 * blockdata, and tilesets.
 *
 * Read tools:
 *   list_maps              — list all maps, optionally filtered by group
 *   get_map_info           — metadata, connections, dimensions for a map
 *   get_map_events         — all events (NPCs, warps, triggers, signs, hidden items)
 *   get_map_connections    — which maps connect to a given map
 *   get_blockdata          — tile grid as a 2D array of {metatile, collision, elevation}
 *   get_layout_info        — layout dimensions, tileset references
 *   list_tilesets           — list available primary and secondary tilesets
 *   get_metatile_attributes — behavior/collision for metatiles in a tileset
 *
 * Write tools (strict validation — reject invalid edits):
 *   set_map_properties     — modify map metadata (weather, music, flags, etc.)
 *   add_object_event       — add an NPC/item/trainer to a map
 *   add_warp_event         — add a door/exit warp
 *   add_bg_event           — add a sign, hidden item, or secret base entrance
 *   add_coord_event        — add a step trigger or weather trigger
 *   remove_event           — remove an event by type + index or local_id
 *   edit_map_connection    — add, remove, or modify a map connection
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import {
  POKEEMERALD_ROOT,
  MAPS_DIR,
  LAYOUTS_DIR,
  TILESETS_DIR,
  MAP_GROUPS_PATH,
  LAYOUTS_JSON_PATH,
} from "./porymap/constants.js";
import {
  readBlockdata,
  readBorder,
  readMetatileAttributes,
  readMetatiles,
  type Block,
} from "./porymap/blockdata.js";
import { type MapJson } from "./porymap/validation.js";
import {
  createWriteContext,
  createDryRunContext,
  type WriteContext,
  type ToolResult,
} from "./porymap/write-context.js";
import { setMapProperties } from "./porymap/set-map-properties.js";
import { addObjectEvent } from "./porymap/add-object-event.js";
import { addWarpEvent } from "./porymap/add-warp-event.js";
import { addBgEvent } from "./porymap/add-bg-event.js";
import { addCoordEvent } from "./porymap/add-coord-event.js";
import { removeEvent } from "./porymap/remove-event.js";
import { editMapConnection } from "./porymap/edit-map-connection.js";
import { unifiedDiff } from "./porymap/diff.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function readJson(filePath: string): Promise<unknown> {
  const text = await fs.readFile(filePath, "utf-8");
  return JSON.parse(text);
}

interface MapGroups {
  group_order: string[];
  [groupName: string]: string[] | string;
}

async function getMapGroups(): Promise<MapGroups> {
  return (await readJson(MAP_GROUPS_PATH)) as MapGroups;
}

interface LayoutEntry {
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

let layoutsCache: LayoutsJson | null = null;

async function getLayouts(): Promise<LayoutsJson> {
  if (!layoutsCache) {
    layoutsCache = (await readJson(LAYOUTS_JSON_PATH)) as LayoutsJson;
  }
  return layoutsCache;
}

async function findLayout(layoutId: string): Promise<LayoutEntry | undefined> {
  const layouts = await getLayouts();
  return layouts.layouts.find((l) => l.id === layoutId);
}

// Local readMapJson for Phase 1 read tools (uses local types, no validation import needed)
async function readMapJson(mapName: string): Promise<MapJson> {
  const mapPath = path.join(MAPS_DIR, mapName, "map.json");
  return (await readJson(mapPath)) as MapJson;
}

function text(str: string) {
  return { content: [{ type: "text" as const, text: str }] };
}

function jsonText(data: unknown) {
  return text(JSON.stringify(data, null, 2));
}

// ─── Server setup ────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "porymap",
  version: "2.0.0",
});

// ─── Tool: list_maps ─────────────────────────────────────────────────────────

server.registerTool(
  "list_maps",
  {
    title: "List Maps",
    description:
      "List all maps in the pokeemerald project, organized by map group. " +
      "Optionally filter to a specific group.",
    inputSchema: z.object({
      group: z
        .string()
        .optional()
        .describe(
          "Filter to a specific group name (e.g. 'gMapGroup_TownsAndRoutes'). " +
          "Omit to list all groups.",
        ),
    }),
  },
  async ({ group }) => {
    const mapGroups = await getMapGroups();
    const groupOrder: string[] = mapGroups.group_order;

    if (group) {
      const maps = mapGroups[group];
      if (!maps || !Array.isArray(maps)) {
        return text(
          `Unknown group: "${group}". Available groups:\n${groupOrder.join("\n")}`,
        );
      }
      return jsonText({ group, maps, count: maps.length });
    }

    const result: Record<string, { maps: string[]; count: number }> = {};
    let total = 0;
    for (const g of groupOrder) {
      const maps = mapGroups[g];
      if (Array.isArray(maps)) {
        result[g] = { maps, count: maps.length };
        total += maps.length;
      }
    }

    return text(
      `${total} maps across ${groupOrder.length} groups:\n${JSON.stringify(result, null, 2)}`,
    );
  },
);

// ─── Tool: get_map_info ──────────────────────────────────────────────────────

server.registerTool(
  "get_map_info",
  {
    title: "Get Map Info",
    description:
      "Get metadata for a map: weather, music, type, dimensions, tileset references, " +
      "connections, and flags (cycling, running, flash, etc.).",
    inputSchema: z.object({
      name: z
        .string()
        .describe(
          "Map directory name, e.g. 'PetalburgCity', 'Route101', 'LittlerootTown_BrendansHouse_2F'",
        ),
    }),
  },
  async ({ name }) => {
    let mapData: MapJson;
    try {
      mapData = await readMapJson(name);
    } catch {
      return text(`Map not found: "${name}". Use list_maps to see available maps.`);
    }

    const layout = await findLayout(mapData.layout);

    const info = {
      id: mapData.id,
      name: mapData.name,
      layout: mapData.layout,
      dimensions: layout
        ? { width: Number(layout.width), height: Number(layout.height) }
        : null,
      tilesets: layout
        ? {
            primary: layout.primary_tileset,
            secondary: layout.secondary_tileset,
          }
        : null,
      music: mapData.music,
      weather: mapData.weather,
      map_type: mapData.map_type,
      region_map_section: mapData.region_map_section,
      battle_scene: mapData.battle_scene,
      flags: {
        requires_flash: mapData.requires_flash,
        allow_cycling: mapData.allow_cycling,
        allow_escaping: mapData.allow_escaping,
        allow_running: mapData.allow_running,
        show_map_name: mapData.show_map_name,
      },
      connections: mapData.connections ?? [],
      event_counts: {
        object_events: mapData.object_events?.length ?? 0,
        warp_events: mapData.warp_events?.length ?? 0,
        coord_events: mapData.coord_events?.length ?? 0,
        bg_events: mapData.bg_events?.length ?? 0,
      },
    };

    return jsonText(info);
  },
);

// ─── Tool: get_map_events ────────────────────────────────────────────────────

server.registerTool(
  "get_map_events",
  {
    title: "Get Map Events",
    description:
      "Get all events on a map: object events (NPCs/items), warp events (doors), " +
      "coord events (step triggers), and bg events (signs, hidden items). " +
      "Optionally filter by event type.",
    inputSchema: z.object({
      name: z
        .string()
        .describe("Map directory name, e.g. 'PetalburgCity'"),
      event_type: z
        .enum(["object_events", "warp_events", "coord_events", "bg_events"])
        .optional()
        .describe("Filter to a specific event type. Omit for all events."),
    }),
  },
  async ({ name, event_type }) => {
    let mapData: MapJson;
    try {
      mapData = await readMapJson(name);
    } catch {
      return text(`Map not found: "${name}".`);
    }

    if (event_type) {
      const events = (mapData as unknown as Record<string, unknown>)[event_type];
      return jsonText({
        map: name,
        event_type,
        count: Array.isArray(events) ? events.length : 0,
        events: events ?? [],
      });
    }

    return jsonText({
      map: name,
      object_events: {
        count: mapData.object_events?.length ?? 0,
        events: mapData.object_events ?? [],
      },
      warp_events: {
        count: mapData.warp_events?.length ?? 0,
        events: mapData.warp_events ?? [],
      },
      coord_events: {
        count: mapData.coord_events?.length ?? 0,
        events: mapData.coord_events ?? [],
      },
      bg_events: {
        count: mapData.bg_events?.length ?? 0,
        events: mapData.bg_events ?? [],
      },
    });
  },
);

// ─── Tool: get_map_connections ───────────────────────────────────────────────

server.registerTool(
  "get_map_connections",
  {
    title: "Get Map Connections",
    description:
      "Get which maps connect to a given map (up/down/left/right neighbors). " +
      "Also shows offset values for each connection.",
    inputSchema: z.object({
      name: z
        .string()
        .describe("Map directory name, e.g. 'PetalburgCity'"),
    }),
  },
  async ({ name }) => {
    let mapData: MapJson;
    try {
      mapData = await readMapJson(name);
    } catch {
      return text(`Map not found: "${name}".`);
    }

    const connections = mapData.connections ?? [];

    if (connections.length === 0) {
      return text(`Map "${name}" has no connections (likely an indoor/cave map).`);
    }

    return jsonText({
      map: name,
      connections,
    });
  },
);

// ─── Tool: get_blockdata ─────────────────────────────────────────────────────

server.registerTool(
  "get_blockdata",
  {
    title: "Get Map Blockdata",
    description:
      "Read the tile grid for a map layout. Returns a 2D array of blocks, each with " +
      "{metatile, collision, elevation}. For large maps, use x/y/width/height to read a sub-region. " +
      "Metatile IDs reference the map's tileset. Collision: 0=passable, 1=impassable. " +
      "Elevation: 0-15 (layer height for bridges, etc.).",
    inputSchema: z.object({
      name: z
        .string()
        .describe("Map directory name, e.g. 'PetalburgCity'"),
      x: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Start X coordinate for sub-region (default: 0)"),
      y: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Start Y coordinate for sub-region (default: 0)"),
      width: z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Width of sub-region to read (default: full map width)"),
      height: z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Height of sub-region to read (default: full map height)"),
    }),
  },
  async ({ name, x: startX = 0, y: startY = 0, width: reqW, height: reqH }) => {
    let mapData: MapJson;
    try {
      mapData = await readMapJson(name);
    } catch {
      return text(`Map not found: "${name}".`);
    }

    const layout = await findLayout(mapData.layout);
    if (!layout) {
      return text(`Layout "${mapData.layout}" not found for map "${name}".`);
    }

    const mapW = Number(layout.width);
    const mapH = Number(layout.height);
    const blockdataPath = path.join(POKEEMERALD_ROOT, layout.blockdata_filepath);

    let grid: Block[][];
    try {
      grid = await readBlockdata(blockdataPath, mapW, mapH);
    } catch (e) {
      return text(`Failed to read blockdata: ${e instanceof Error ? e.message : e}`);
    }

    // Clamp sub-region to map bounds
    const endX = Math.min(startX + (reqW ?? mapW), mapW);
    const endY = Math.min(startY + (reqH ?? mapH), mapH);
    const clampedX = Math.max(0, Math.min(startX, mapW - 1));
    const clampedY = Math.max(0, Math.min(startY, mapH - 1));

    const subgrid = grid
      .slice(clampedY, endY)
      .map((row) => row.slice(clampedX, endX));

    const actualW = subgrid[0]?.length ?? 0;
    const actualH = subgrid.length;

    return jsonText({
      map: name,
      map_dimensions: { width: mapW, height: mapH },
      region: { x: clampedX, y: clampedY, width: actualW, height: actualH },
      tilesets: {
        primary: layout.primary_tileset,
        secondary: layout.secondary_tileset,
      },
      blocks: subgrid,
    });
  },
);

// ─── Tool: get_layout_info ───────────────────────────────────────────────────

server.registerTool(
  "get_layout_info",
  {
    title: "Get Layout Info",
    description:
      "Get layout details: dimensions, tileset references, and file paths. " +
      "Accepts either a layout ID (e.g. 'LAYOUT_PETALBURG_CITY') or a map name.",
    inputSchema: z.object({
      layout_id: z
        .string()
        .optional()
        .describe("Layout ID, e.g. 'LAYOUT_PETALBURG_CITY'"),
      map_name: z
        .string()
        .optional()
        .describe(
          "Map directory name. If provided instead of layout_id, " +
          "the layout is looked up from the map's map.json.",
        ),
    }),
  },
  async ({ layout_id, map_name }) => {
    let layoutId = layout_id;

    if (!layoutId && map_name) {
      try {
        const mapData = await readMapJson(map_name);
        layoutId = mapData.layout;
      } catch {
        return text(`Map not found: "${map_name}".`);
      }
    }

    if (!layoutId) {
      return text("Provide either layout_id or map_name.");
    }

    const layout = await findLayout(layoutId);
    if (!layout) {
      return text(`Layout not found: "${layoutId}".`);
    }

    // Read border data
    const borderPath = path.join(POKEEMERALD_ROOT, layout.border_filepath);
    let border;
    try {
      border = await readBorder(borderPath);
    } catch {
      border = null;
    }

    return jsonText({
      ...layout,
      width: Number(layout.width),
      height: Number(layout.height),
      border,
    });
  },
);

// ─── Tool: list_tilesets ─────────────────────────────────────────────────────

server.registerTool(
  "list_tilesets",
  {
    title: "List Tilesets",
    description:
      "List all available tilesets (primary and secondary). " +
      "Primary tilesets (general, building, secret_base) are shared across many maps. " +
      "Secondary tilesets are region/area-specific.",
    inputSchema: z.object({
      type: z
        .enum(["primary", "secondary", "all"])
        .optional()
        .describe("Filter by tileset type (default: 'all')"),
    }),
  },
  async ({ type = "all" }) => {
    const result: Record<string, string[]> = {};

    if (type === "primary" || type === "all") {
      try {
        const entries = await fs.readdir(path.join(TILESETS_DIR, "primary"));
        result.primary = entries.filter((e) => !e.startsWith(".")).sort();
      } catch {
        result.primary = [];
      }
    }

    if (type === "secondary" || type === "all") {
      try {
        const entries = await fs.readdir(path.join(TILESETS_DIR, "secondary"));
        result.secondary = entries.filter((e) => !e.startsWith(".")).sort();
      } catch {
        result.secondary = [];
      }
    }

    const counts = Object.entries(result)
      .map(([k, v]) => `${k}: ${v.length}`)
      .join(", ");

    return text(`Tilesets (${counts}):\n${JSON.stringify(result, null, 2)}`);
  },
);

// ─── Tool: get_metatile_attributes ───────────────────────────────────────────

// Common metatile behavior names (from include/constants/metatile_behaviors.h)
const BEHAVIOR_NAMES: Record<number, string> = {
  0x00: "NORMAL",
  0x01: "SECRET_BASE_WALL",
  0x02: "TALL_GRASS",
  0x03: "LONG_GRASS",
  0x06: "DEEP_SAND",
  0x07: "SHORT_GRASS",
  0x08: "CAVE",
  0x0a: "NO_RUNNING",
  0x0b: "INDOOR_ENCOUNTER",
  0x0c: "MOUNTAIN_TOP",
  0x10: "POND_WATER",
  0x11: "INTERIOR_DEEP_WATER",
  0x12: "DEEP_WATER",
  0x13: "WATERFALL",
  0x15: "OCEAN_WATER",
  0x16: "PUDDLE",
  0x17: "SHALLOW_WATER",
  0x20: "ICE",
  0x21: "SAND",
  0x22: "SEAWEED",
  0x24: "ASH_GRASS",
  0x25: "FOOTPRINTS",
  0x26: "THIN_ICE",
  0x27: "CRACKED_ICE",
  0x28: "HOT_SPRINGS",
};

server.registerTool(
  "get_metatile_attributes",
  {
    title: "Get Metatile Attributes",
    description:
      "Get behavior/collision attributes for metatiles in a tileset. " +
      "Each metatile has a behavior byte (e.g. NORMAL, TALL_GRASS, WATER). " +
      "Optionally filter to a specific metatile ID or range.",
    inputSchema: z.object({
      tileset_type: z
        .enum(["primary", "secondary"])
        .describe("Whether this is a primary or secondary tileset"),
      tileset_name: z
        .string()
        .describe("Tileset directory name, e.g. 'general', 'petalburg', 'cave'"),
      start_id: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Start metatile ID (inclusive, default: 0)"),
      end_id: z
        .number()
        .int()
        .optional()
        .describe("End metatile ID (exclusive, default: all)"),
    }),
  },
  async ({ tileset_type, tileset_name, start_id = 0, end_id }) => {
    const attrPath = path.join(
      TILESETS_DIR,
      tileset_type,
      tileset_name,
      "metatile_attributes.bin",
    );

    let attrs;
    try {
      attrs = await readMetatileAttributes(attrPath);
    } catch {
      return text(
        `Tileset not found or no attributes file: ${tileset_type}/${tileset_name}`,
      );
    }

    const endIdx = end_id ?? attrs.length;
    const slice = attrs.slice(start_id, endIdx);

    const result = slice.map((attr, i) => ({
      id: start_id + i,
      behavior: attr.behavior,
      behavior_name: BEHAVIOR_NAMES[attr.behavior] ?? `UNKNOWN_0x${attr.behavior.toString(16).padStart(2, "0")}`,
      raw: `0x${attr.raw.toString(16).padStart(4, "0")}`,
    }));

    return text(
      `Metatile attributes for ${tileset_type}/${tileset_name} ` +
      `(IDs ${start_id}-${endIdx - 1}, ${result.length} metatiles):\n` +
      JSON.stringify(result, null, 2),
    );
  },
);

// ─── Tool: get_metatile_composition ──────────────────────────────────────────

server.registerTool(
  "get_metatile_composition",
  {
    title: "Get Metatile Composition",
    description:
      "Decode metatiles.bin for a tileset, returning the 8 tile entries (tile index, " +
      "hflip, vflip, palette) that compose each metatile. Used for visual map rendering.",
    inputSchema: z.object({
      tileset_type: z
        .enum(["primary", "secondary"])
        .describe("Whether this is a primary or secondary tileset"),
      tileset_name: z
        .string()
        .describe("Tileset directory name, e.g. 'general', 'petalburg', 'cave'"),
    }),
  },
  async ({ tileset_type, tileset_name }) => {
    const metatilePath = path.join(
      TILESETS_DIR,
      tileset_type,
      tileset_name,
      "metatiles.bin",
    );

    let metatiles;
    try {
      metatiles = await readMetatiles(metatilePath);
    } catch {
      return text(
        `Tileset not found or no metatiles file: ${tileset_type}/${tileset_name}`,
      );
    }

    const tilesPerRow = 16;

    return jsonText({
      tileset: `${tileset_type}/${tileset_name}`,
      metatile_count: metatiles.length,
      tiles_per_row: tilesPerRow,
      metatiles: metatiles.map((mt, i) => ({
        id: i,
        tiles: mt.tiles.map((t) => ({
          tile: t.tileIndex,
          hflip: t.hflip,
          vflip: t.vflip,
          pal: t.palette,
        })),
      })),
    });
  },
);

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 2: Write Tools (delegated to handler modules)
// ═══════════════════════════════════════════════════════════════════════════════

const writeCtx = createWriteContext();

function errorText(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWriteHandler = (ctx: WriteContext, params: any) => Promise<ToolResult>;

async function runWriteTool(
  handler: AnyWriteHandler,
  params: { name: string; dry_run?: boolean },
) {
  if (params.dry_run) {
    const { ctx, captures } = createDryRunContext(writeCtx);
    const result = await handler(ctx, params);
    if (!result.ok) return errorText(result.error);
    const capture = captures[0];
    const diff = capture
      ? unifiedDiff(
          JSON.stringify(capture.before, null, 2),
          JSON.stringify(capture.after, null, 2),
          `${params.name}/map.json`,
        )
      : "";
    return jsonText({ ...(result.data as object), status: "dry_run", diff });
  }
  const result = await handler(writeCtx, params);
  return result.ok ? jsonText(result.data) : errorText(result.error);
}

// ─── Tool: set_map_properties ───────────────────────────────────────────────

server.registerTool(
  "set_map_properties",
  {
    title: "Set Map Properties",
    description:
      "Modify map metadata: weather, music, map_type, battle_scene, region_map_section, " +
      "and boolean flags (requires_flash, allow_cycling, allow_escaping, allow_running, show_map_name). " +
      "Only specified properties are changed; others are left untouched.",
    inputSchema: z.object({
      name: z.string().describe("Map directory name, e.g. 'PetalburgCity'"),
      properties: z
        .record(z.string(), z.union([z.string(), z.boolean()]))
        .describe(
          "Key-value pairs to set. Valid keys: music, weather, map_type, region_map_section, " +
          "battle_scene, requires_flash, allow_cycling, allow_escaping, allow_running, show_map_name",
        ),
      dry_run: z.boolean().optional().describe("If true, return a diff instead of writing to disk"),
    }),
  },
  async (params) => runWriteTool(setMapProperties, params),
);

// ─── Tool: add_object_event ─────────────────────────────────────────────────

server.registerTool(
  "add_object_event",
  {
    title: "Add Object Event",
    description:
      "Add an NPC, item, or trainer to a map. Validates coordinates against layout dimensions. " +
      "The event is appended to the object_events array in map.json.",
    inputSchema: z.object({
      name: z.string().describe("Map directory name"),
      graphics_id: z.string().describe("Sprite constant, e.g. 'OBJ_EVENT_GFX_WOMAN_1'"),
      x: z.number().int().describe("X grid position (0-based)"),
      y: z.number().int().describe("Y grid position (0-based)"),
      elevation: z.number().int().min(0).max(15).default(3).describe("Elevation layer (0-15, default 3)"),
      movement_type: z.string().default("MOVEMENT_TYPE_FACE_DOWN").describe("Movement pattern constant"),
      movement_range_x: z.number().int().min(0).max(15).default(0).describe("Horizontal movement range (0-15)"),
      movement_range_y: z.number().int().min(0).max(15).default(0).describe("Vertical movement range (0-15)"),
      trainer_type: z.string().default("TRAINER_TYPE_NONE").describe("Trainer type constant"),
      trainer_sight_or_berry_tree_id: z.string().default("0").describe("Trainer sight range or berry tree ID"),
      script: z.string().describe("Script label (e.g. 'MapName_EventScript_NpcName') or '0x0' for none"),
      flag: z.string().default("0").describe("Visibility flag constant, or '0' for always visible"),
      local_id: z.string().optional().describe("Optional local ID constant (generates #define in map_event_ids.h)"),
      dry_run: z.boolean().optional().describe("If true, return a diff instead of writing to disk"),
    }),
  },
  async (params) => runWriteTool(addObjectEvent, params),
);

// ─── Tool: add_warp_event ───────────────────────────────────────────────────

server.registerTool(
  "add_warp_event",
  {
    title: "Add Warp Event",
    description:
      "Add a door/exit warp to a map. Validates coordinates and that the destination map exists.",
    inputSchema: z.object({
      name: z.string().describe("Source map directory name"),
      x: z.number().int().describe("X grid position"),
      y: z.number().int().describe("Y grid position"),
      elevation: z.number().int().min(0).max(15).default(0).describe("Elevation (0-15, default 0)"),
      dest_map: z.string().describe("Destination map constant, e.g. 'MAP_LITTLEROOT_TOWN'"),
      dest_warp_id: z.string().describe("Warp index in destination map (e.g. '0', '1')"),
      warp_id: z.string().optional().describe("Optional warp ID constant (generates #define)"),
      dry_run: z.boolean().optional().describe("If true, return a diff instead of writing to disk"),
    }),
  },
  async (params) => runWriteTool(addWarpEvent, params),
);

// ─── Tool: add_bg_event ─────────────────────────────────────────────────────

server.registerTool(
  "add_bg_event",
  {
    title: "Add Background Event",
    description:
      "Add a sign, hidden item, or secret base entrance to a map. " +
      "Validates coordinates against layout dimensions.",
    inputSchema: z.object({
      name: z.string().describe("Map directory name"),
      type: z.enum(["sign", "hidden_item", "secret_base"]).describe("Background event type"),
      x: z.number().int().describe("X grid position"),
      y: z.number().int().describe("Y grid position"),
      elevation: z.number().int().min(0).max(15).default(0).describe("Elevation (0-15)"),
      // Sign fields
      player_facing_dir: z.string().default("BG_EVENT_PLAYER_FACING_ANY").describe("For signs: player facing direction"),
      script: z.string().optional().describe("For signs: script label"),
      // Hidden item fields
      item: z.string().optional().describe("For hidden_item: item constant (e.g. 'ITEM_POTION')"),
      hidden_item_flag: z.string().optional().describe("For hidden_item: flag constant"),
      // Secret base fields
      secret_base_id: z.string().optional().describe("For secret_base: secret base ID constant"),
      dry_run: z.boolean().optional().describe("If true, return a diff instead of writing to disk"),
    }),
  },
  async (params) => runWriteTool(addBgEvent, params),
);

// ─── Tool: add_coord_event ──────────────────────────────────────────────────

server.registerTool(
  "add_coord_event",
  {
    title: "Add Coordinate Event",
    description:
      "Add a step trigger or weather trigger to a map. Triggers fire when the player steps on the tile.",
    inputSchema: z.object({
      name: z.string().describe("Map directory name"),
      type: z.enum(["trigger", "weather"]).describe("Coordinate event type"),
      x: z.number().int().describe("X grid position"),
      y: z.number().int().describe("Y grid position"),
      elevation: z.number().int().min(0).max(15).default(0).describe("Elevation (0-15)"),
      // Trigger fields
      var: z.string().optional().describe("For trigger: game variable constant (e.g. 'VAR_TEMP_1')"),
      var_value: z.string().optional().describe("For trigger: variable value that activates the trigger"),
      script: z.string().optional().describe("For trigger: script label"),
      // Weather fields
      weather: z.string().optional().describe("For weather: weather constant (e.g. 'WEATHER_RAIN')"),
      dry_run: z.boolean().optional().describe("If true, return a diff instead of writing to disk"),
    }),
  },
  async (params) => runWriteTool(addCoordEvent, params),
);

// ─── Tool: remove_event ─────────────────────────────────────────────────────

server.registerTool(
  "remove_event",
  {
    title: "Remove Event",
    description:
      "Remove an event from a map by type and index, or by local_id/warp_id. " +
      "Returns the removed event for confirmation.",
    inputSchema: z.object({
      name: z.string().describe("Map directory name"),
      event_type: z
        .enum(["object_events", "warp_events", "coord_events", "bg_events"])
        .describe("Which event array to remove from"),
      index: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("0-based index in the event array"),
      local_id: z
        .string()
        .optional()
        .describe("Find and remove by local_id (object_events) or warp_id (warp_events) instead of index"),
      dry_run: z.boolean().optional().describe("If true, return a diff instead of writing to disk"),
    }),
  },
  async (params) => runWriteTool(removeEvent, params),
);

// ─── Tool: edit_map_connection ──────────────────────────────────────────────

server.registerTool(
  "edit_map_connection",
  {
    title: "Edit Map Connection",
    description:
      "Add, remove, or update a directional map connection (up/down/left/right). " +
      "Validates that the target map exists.",
    inputSchema: z.object({
      name: z.string().describe("Map directory name"),
      action: z.enum(["add", "remove", "update"]).describe("Operation to perform"),
      direction: z.enum(["up", "down", "left", "right"]).describe("Connection direction"),
      target_map: z.string().optional().describe("For add/update: target map constant (e.g. 'MAP_ROUTE101')"),
      offset: z.number().int().optional().describe("For add/update: alignment offset (default 0)"),
      dry_run: z.boolean().optional().describe("If true, return a diff instead of writing to disk"),
    }),
  },
  async (params) => runWriteTool(editMapConnection, params),
);

// ─── Start server ────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
