/**
 * Unit tests for the Porymap MCP server modules.
 *
 * Tests run against real pokeemerald game data (PetalburgCity, Route101, etc.)
 * to verify that parsing produces correct, known values.
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import {
  decodeBlock,
  encodeBlock,
  readBlockdata,
  readBorder,
  readMetatileAttributes,
  type Block,
} from "./porymap/blockdata.js";
import {
  POKEEMERALD_ROOT,
  MAPS_DIR,
  LAYOUTS_DIR,
  TILESETS_DIR,
  MAP_GROUPS_PATH,
  LAYOUTS_JSON_PATH,
} from "./porymap/constants.js";

// ─── blockdata: encode/decode round-trip ─────────────────────────────────────

describe("decodeBlock / encodeBlock", () => {
  it("decodes a known raw value correctly", () => {
    // 0x05D4 = metatile 468, collision 1, elevation 0
    const block = decodeBlock(0x05d4);
    expect(block.metatile).toBe(468);
    expect(block.collision).toBe(1);
    expect(block.elevation).toBe(0);
  });

  it("decodes all bit fields independently", () => {
    // metatile=0x1AB (427), collision=2, elevation=0xC (12)
    // raw = 427 | (2 << 10) | (12 << 12) = 427 | 2048 | 49152 = 0xC9AB
    const block = decodeBlock(0xc9ab);
    expect(block.metatile).toBe(427);
    expect(block.collision).toBe(2);
    expect(block.elevation).toBe(12);
  });

  it("round-trips encode → decode for arbitrary values", () => {
    const original: Block = { metatile: 789, collision: 3, elevation: 15 };
    const raw = encodeBlock(original);
    const decoded = decodeBlock(raw);
    expect(decoded).toEqual(original);
  });

  it("round-trips all zeros", () => {
    const block: Block = { metatile: 0, collision: 0, elevation: 0 };
    expect(decodeBlock(encodeBlock(block))).toEqual(block);
  });

  it("round-trips max values", () => {
    const block: Block = { metatile: 1023, collision: 3, elevation: 15 };
    expect(decodeBlock(encodeBlock(block))).toEqual(block);
  });

  it("masks out-of-range values", () => {
    // metatile > 1023 should be masked to 10 bits
    const raw = encodeBlock({ metatile: 1024, collision: 0, elevation: 0 });
    expect(decodeBlock(raw).metatile).toBe(0); // 1024 & 0x3FF = 0
  });
});

// ─── blockdata: readBlockdata against PetalburgCity ──────────────────────────

describe("readBlockdata — PetalburgCity", () => {
  const blockdataPath = path.join(
    LAYOUTS_DIR,
    "PetalburgCity",
    "map.bin",
  );

  it("reads a 30×30 map (1800 bytes)", async () => {
    const grid = await readBlockdata(blockdataPath, 30, 30);
    expect(grid).toHaveLength(30); // 30 rows
    expect(grid[0]).toHaveLength(30); // 30 columns
  });

  it("first block is metatile 468, collision 1, elevation 0", async () => {
    const grid = await readBlockdata(blockdataPath, 30, 30);
    expect(grid[0][0]).toEqual({
      metatile: 468,
      collision: 1,
      elevation: 0,
    });
  });

  it("second block is metatile 469, collision 1, elevation 0", async () => {
    const grid = await readBlockdata(blockdataPath, 30, 30);
    expect(grid[0][1]).toEqual({
      metatile: 469,
      collision: 1,
      elevation: 0,
    });
  });

  it("rejects wrong dimensions", async () => {
    await expect(readBlockdata(blockdataPath, 10, 10)).rejects.toThrow(
      "Blockdata size mismatch",
    );
  });
});

// ─── blockdata: readBorder ───────────────────────────────────────────────────

describe("readBorder — PetalburgCity", () => {
  const borderPath = path.join(
    LAYOUTS_DIR,
    "PetalburgCity",
    "border.bin",
  );

  it("reads 4 border blocks (8 bytes)", async () => {
    const blocks = await readBorder(borderPath);
    expect(blocks).toHaveLength(4);
  });

  it("each block has valid metatile/collision/elevation fields", async () => {
    const blocks = await readBorder(borderPath);
    for (const block of blocks) {
      expect(block.metatile).toBeGreaterThanOrEqual(0);
      expect(block.metatile).toBeLessThanOrEqual(1023);
      expect(block.collision).toBeGreaterThanOrEqual(0);
      expect(block.collision).toBeLessThanOrEqual(3);
      expect(block.elevation).toBeGreaterThanOrEqual(0);
      expect(block.elevation).toBeLessThanOrEqual(15);
    }
  });
});

// ─── blockdata: readMetatileAttributes ───────────────────────────────────────

describe("readMetatileAttributes — general tileset", () => {
  const attrPath = path.join(
    TILESETS_DIR,
    "primary",
    "general",
    "metatile_attributes.bin",
  );

  it("reads 512 metatile attributes (1024 bytes)", async () => {
    const attrs = await readMetatileAttributes(attrPath);
    expect(attrs).toHaveLength(512);
  });

  it("first metatile has behavior 0 (NORMAL)", async () => {
    const attrs = await readMetatileAttributes(attrPath);
    expect(attrs[0].behavior).toBe(0);
  });

  it("all behaviors are valid bytes (0-255)", async () => {
    const attrs = await readMetatileAttributes(attrPath);
    for (const attr of attrs) {
      expect(attr.behavior).toBeGreaterThanOrEqual(0);
      expect(attr.behavior).toBeLessThanOrEqual(255);
    }
  });
});

// ─── constants: paths exist on disk ──────────────────────────────────────────

describe("constants — path resolution", () => {
  it("POKEEMERALD_ROOT exists", async () => {
    const stat = await fs.stat(POKEEMERALD_ROOT);
    expect(stat.isDirectory()).toBe(true);
  });

  it("MAP_GROUPS_PATH exists", async () => {
    const stat = await fs.stat(MAP_GROUPS_PATH);
    expect(stat.isFile()).toBe(true);
  });

  it("LAYOUTS_JSON_PATH exists", async () => {
    const stat = await fs.stat(LAYOUTS_JSON_PATH);
    expect(stat.isFile()).toBe(true);
  });

  it("MAPS_DIR contains PetalburgCity", async () => {
    const entries = await fs.readdir(MAPS_DIR);
    expect(entries).toContain("PetalburgCity");
  });

  it("TILESETS_DIR contains primary and secondary", async () => {
    const entries = await fs.readdir(TILESETS_DIR);
    expect(entries).toContain("primary");
    expect(entries).toContain("secondary");
  });
});

// ─── map_groups.json structure ───────────────────────────────────────────────

describe("map_groups.json", () => {
  let mapGroups: Record<string, unknown>;

  it("parses as valid JSON", async () => {
    const text = await fs.readFile(MAP_GROUPS_PATH, "utf-8");
    mapGroups = JSON.parse(text);
    expect(mapGroups).toBeDefined();
  });

  it("has a group_order array", async () => {
    const text = await fs.readFile(MAP_GROUPS_PATH, "utf-8");
    mapGroups = JSON.parse(text);
    expect(Array.isArray(mapGroups.group_order)).toBe(true);
    expect((mapGroups.group_order as string[]).length).toBeGreaterThan(10);
  });

  it("gMapGroup_TownsAndRoutes contains PetalburgCity", async () => {
    const text = await fs.readFile(MAP_GROUPS_PATH, "utf-8");
    mapGroups = JSON.parse(text);
    const towns = mapGroups.gMapGroup_TownsAndRoutes as string[];
    expect(towns).toContain("PetalburgCity");
  });

  it("gMapGroup_TownsAndRoutes contains Route101", async () => {
    const text = await fs.readFile(MAP_GROUPS_PATH, "utf-8");
    mapGroups = JSON.parse(text);
    const towns = mapGroups.gMapGroup_TownsAndRoutes as string[];
    expect(towns).toContain("Route101");
  });
});

// ─── PetalburgCity map.json integration ──────────────────────────────────────

describe("PetalburgCity map.json", () => {
  let mapData: Record<string, unknown>;

  async function loadMap() {
    const text = await fs.readFile(
      path.join(MAPS_DIR, "PetalburgCity", "map.json"),
      "utf-8",
    );
    return JSON.parse(text);
  }

  it("has expected map ID", async () => {
    mapData = await loadMap();
    expect(mapData.id).toBe("MAP_PETALBURG_CITY");
  });

  it("references LAYOUT_PETALBURG_CITY", async () => {
    mapData = await loadMap();
    expect(mapData.layout).toBe("LAYOUT_PETALBURG_CITY");
  });

  it("has sunny weather", async () => {
    mapData = await loadMap();
    expect(mapData.weather).toBe("WEATHER_SUNNY");
  });

  it("is MAP_TYPE_CITY", async () => {
    mapData = await loadMap();
    expect(mapData.map_type).toBe("MAP_TYPE_CITY");
  });

  it("has exactly 2 connections (Route104 left, Route102 right)", async () => {
    mapData = await loadMap();
    const conns = mapData.connections as Array<{
      map: string;
      direction: string;
    }>;
    expect(conns).toHaveLength(2);
    expect(conns[0]).toMatchObject({
      map: "MAP_ROUTE104",
      direction: "left",
    });
    expect(conns[1]).toMatchObject({
      map: "MAP_ROUTE102",
      direction: "right",
    });
  });

  it("has 9 object events", async () => {
    mapData = await loadMap();
    expect(mapData.object_events).toHaveLength(9);
  });

  it("has 6 warp events", async () => {
    mapData = await loadMap();
    expect(mapData.warp_events).toHaveLength(6);
  });

  it("first warp leads to HOUSE1", async () => {
    mapData = await loadMap();
    const warps = mapData.warp_events as Array<{
      dest_map: string;
      x: number;
      y: number;
    }>;
    expect(warps[0].dest_map).toBe("MAP_PETALBURG_CITY_HOUSE1");
    expect(warps[0].x).toBe(10);
    expect(warps[0].y).toBe(19);
  });

  it("has 8 bg events", async () => {
    mapData = await loadMap();
    expect(mapData.bg_events).toHaveLength(8);
  });

  it("has 8 coord events", async () => {
    mapData = await loadMap();
    expect(mapData.coord_events).toHaveLength(8);
  });
});

// ─── layouts.json — PetalburgCity layout ─────────────────────────────────────

describe("layouts.json — LAYOUT_PETALBURG_CITY", () => {
  interface Layout {
    id: string;
    width: number | string;
    height: number | string;
    primary_tileset: string;
    secondary_tileset: string;
    blockdata_filepath: string;
    border_filepath: string;
  }

  async function findLayout(id: string): Promise<Layout | undefined> {
    const text = await fs.readFile(LAYOUTS_JSON_PATH, "utf-8");
    const data = JSON.parse(text);
    return data.layouts.find((l: Layout) => l.id === id);
  }

  it("exists in layouts.json", async () => {
    const layout = await findLayout("LAYOUT_PETALBURG_CITY");
    expect(layout).toBeDefined();
  });

  it("is 30×30", async () => {
    const layout = await findLayout("LAYOUT_PETALBURG_CITY");
    expect(Number(layout!.width)).toBe(30);
    expect(Number(layout!.height)).toBe(30);
  });

  it("uses gTileset_General as primary", async () => {
    const layout = await findLayout("LAYOUT_PETALBURG_CITY");
    expect(layout!.primary_tileset).toBe("gTileset_General");
  });

  it("uses gTileset_Petalburg as secondary", async () => {
    const layout = await findLayout("LAYOUT_PETALBURG_CITY");
    expect(layout!.secondary_tileset).toBe("gTileset_Petalburg");
  });

  it("blockdata_filepath points to an existing file", async () => {
    const layout = await findLayout("LAYOUT_PETALBURG_CITY");
    const fullPath = path.join(POKEEMERALD_ROOT, layout!.blockdata_filepath);
    const stat = await fs.stat(fullPath);
    expect(stat.isFile()).toBe(true);
    expect(stat.size).toBe(30 * 30 * 2); // 1800 bytes
  });
});

// ─── Indoor map: LittlerootTown_BrendansHouse_2F ─────────────────────────────

describe("LittlerootTown_BrendansHouse_2F — indoor map without connections", () => {
  async function loadMap() {
    const text = await fs.readFile(
      path.join(MAPS_DIR, "LittlerootTown_BrendansHouse_2F", "map.json"),
      "utf-8",
    );
    return JSON.parse(text);
  }

  it("has null connections", async () => {
    const data = await loadMap();
    expect(data.connections).toBeNull();
  });

  it("is MAP_TYPE_INDOOR", async () => {
    const data = await loadMap();
    expect(data.map_type).toBe("MAP_TYPE_INDOOR");
  });

  it("has exactly 1 warp event leading to 1F", async () => {
    const data = await loadMap();
    expect(data.warp_events).toHaveLength(1);
    expect(data.warp_events[0].dest_map).toBe(
      "MAP_LITTLEROOT_TOWN_BRENDANS_HOUSE_1F",
    );
  });

  it("has 4 bg events (all signs)", async () => {
    const data = await loadMap();
    expect(data.bg_events).toHaveLength(4);
    for (const bg of data.bg_events) {
      expect(bg.type).toBe("sign");
    }
  });

  it("disallows cycling and running", async () => {
    const data = await loadMap();
    expect(data.allow_cycling).toBe(false);
    expect(data.allow_running).toBe(false);
  });
});

// ─── Tileset directory structure ─────────────────────────────────────────────

describe("tileset directory structure", () => {
  it("primary/general has expected files", async () => {
    const entries = await fs.readdir(
      path.join(TILESETS_DIR, "primary", "general"),
    );
    expect(entries).toContain("tiles.png");
    expect(entries).toContain("metatiles.bin");
    expect(entries).toContain("metatile_attributes.bin");
    expect(entries).toContain("palettes");
  });

  it("secondary has at least 60 tilesets", async () => {
    const entries = await fs.readdir(path.join(TILESETS_DIR, "secondary"));
    expect(entries.length).toBeGreaterThanOrEqual(60);
  });

  it("secondary/petalburg exists", async () => {
    const stat = await fs.stat(
      path.join(TILESETS_DIR, "secondary", "petalburg"),
    );
    expect(stat.isDirectory()).toBe(true);
  });
});

// ─── Cross-validation: map.bin size matches layout dimensions ────────────────

describe("blockdata file sizes match layout dimensions", () => {
  const testCases = [
    { name: "PetalburgCity", width: 30, height: 30 },
    { name: "LittlerootTown", width: 20, height: 20 },
    { name: "Route101", width: 20, height: 20 },
  ];

  for (const { name, width, height } of testCases) {
    it(`${name}: map.bin is ${width}×${height}×2 = ${width * height * 2} bytes`, async () => {
      const blockdataPath = path.join(LAYOUTS_DIR, name, "map.bin");
      const stat = await fs.stat(blockdataPath);
      expect(stat.size).toBe(width * height * 2);
    });
  }
});
