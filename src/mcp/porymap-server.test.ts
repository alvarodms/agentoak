/**
 * Unit tests for the Porymap MCP server modules.
 *
 * Tests run against frozen fixture data copied from pokeemerald
 * (in __fixtures__/) so they remain deterministic even if the
 * game data is modified by future agent cycles.
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  decodeBlock,
  encodeBlock,
  readBlockdata,
  readBorder,
  readMetatileAttributes,
  type Block,
} from "./porymap/blockdata.js";

// ─── Fixture paths (frozen copies of pokeemerald data) ───────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "__fixtures__");
const FIX_MAPS = path.join(FIXTURES, "maps");
const FIX_LAYOUTS = path.join(FIXTURES, "layouts");
const FIX_TILESETS = path.join(FIXTURES, "tilesets");
const FIX_MAP_GROUPS = path.join(FIX_MAPS, "map_groups.json");
const FIX_LAYOUTS_JSON = path.join(FIX_LAYOUTS, "layouts.json");

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
    // raw = 427 | (2 << 10) | (12 << 12) = 0xC9AB
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
  const blockdataPath = path.join(FIX_LAYOUTS, "PetalburgCity", "map.bin");

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
  const borderPath = path.join(FIX_LAYOUTS, "PetalburgCity", "border.bin");

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
    FIX_TILESETS,
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

// ─── fixture files exist ─────────────────────────────────────────────────────

describe("fixture files exist", () => {
  it("map_groups.json", async () => {
    const stat = await fs.stat(FIX_MAP_GROUPS);
    expect(stat.isFile()).toBe(true);
  });

  it("layouts.json", async () => {
    const stat = await fs.stat(FIX_LAYOUTS_JSON);
    expect(stat.isFile()).toBe(true);
  });

  it("PetalburgCity map.json", async () => {
    const stat = await fs.stat(
      path.join(FIX_MAPS, "PetalburgCity", "map.json"),
    );
    expect(stat.isFile()).toBe(true);
  });

  it("PetalburgCity map.bin", async () => {
    const stat = await fs.stat(
      path.join(FIX_LAYOUTS, "PetalburgCity", "map.bin"),
    );
    expect(stat.isFile()).toBe(true);
  });

  it("metatile_attributes.bin", async () => {
    const stat = await fs.stat(
      path.join(FIX_TILESETS, "primary", "general", "metatile_attributes.bin"),
    );
    expect(stat.isFile()).toBe(true);
  });
});

// ─── map_groups.json structure ───────────────────────────────────────────────

describe("map_groups.json", () => {
  async function loadGroups() {
    const text = await fs.readFile(FIX_MAP_GROUPS, "utf-8");
    return JSON.parse(text) as Record<string, unknown>;
  }

  it("parses as valid JSON with group_order array", async () => {
    const data = await loadGroups();
    expect(Array.isArray(data.group_order)).toBe(true);
    expect((data.group_order as string[]).length).toBeGreaterThan(10);
  });

  it("has 34 groups", async () => {
    const data = await loadGroups();
    expect((data.group_order as string[])).toHaveLength(34);
  });

  it("gMapGroup_TownsAndRoutes contains PetalburgCity", async () => {
    const data = await loadGroups();
    const towns = data.gMapGroup_TownsAndRoutes as string[];
    expect(towns).toContain("PetalburgCity");
  });

  it("gMapGroup_TownsAndRoutes contains Route101", async () => {
    const data = await loadGroups();
    const towns = data.gMapGroup_TownsAndRoutes as string[];
    expect(towns).toContain("Route101");
  });
});

// ─── PetalburgCity map.json ──────────────────────────────────────────────────

describe("PetalburgCity map.json", () => {
  async function loadMap() {
    const text = await fs.readFile(
      path.join(FIX_MAPS, "PetalburgCity", "map.json"),
      "utf-8",
    );
    return JSON.parse(text);
  }

  it("has expected map ID", async () => {
    const data = await loadMap();
    expect(data.id).toBe("MAP_PETALBURG_CITY");
  });

  it("references LAYOUT_PETALBURG_CITY", async () => {
    const data = await loadMap();
    expect(data.layout).toBe("LAYOUT_PETALBURG_CITY");
  });

  it("has sunny weather", async () => {
    const data = await loadMap();
    expect(data.weather).toBe("WEATHER_SUNNY");
  });

  it("is MAP_TYPE_CITY", async () => {
    const data = await loadMap();
    expect(data.map_type).toBe("MAP_TYPE_CITY");
  });

  it("has exactly 2 connections (Route104 left, Route102 right)", async () => {
    const data = await loadMap();
    const conns = data.connections as Array<{
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
    const data = await loadMap();
    expect(data.object_events).toHaveLength(9);
  });

  it("has 6 warp events", async () => {
    const data = await loadMap();
    expect(data.warp_events).toHaveLength(6);
  });

  it("first warp leads to HOUSE1 at (10, 19)", async () => {
    const data = await loadMap();
    expect(data.warp_events[0]).toMatchObject({
      dest_map: "MAP_PETALBURG_CITY_HOUSE1",
      x: 10,
      y: 19,
    });
  });

  it("has 8 bg events", async () => {
    const data = await loadMap();
    expect(data.bg_events).toHaveLength(8);
  });

  it("has 8 coord events", async () => {
    const data = await loadMap();
    expect(data.coord_events).toHaveLength(8);
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
    const text = await fs.readFile(FIX_LAYOUTS_JSON, "utf-8");
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

  it("blockdata fixture file matches expected size", async () => {
    const fixtureBin = path.join(FIX_LAYOUTS, "PetalburgCity", "map.bin");
    const stat = await fs.stat(fixtureBin);
    expect(stat.size).toBe(30 * 30 * 2); // 1800 bytes
  });
});

// ─── Indoor map: LittlerootTown_BrendansHouse_2F ─────────────────────────────

describe("LittlerootTown_BrendansHouse_2F — indoor map without connections", () => {
  async function loadMap() {
    const text = await fs.readFile(
      path.join(FIX_MAPS, "LittlerootTown_BrendansHouse_2F", "map.json"),
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

// ─── Cross-validation: map.bin size matches layout dimensions ────────────────

describe("blockdata file sizes match layout dimensions", () => {
  const testCases = [
    { name: "PetalburgCity", width: 30, height: 30 },
    { name: "LittlerootTown", width: 20, height: 20 },
    { name: "Route101", width: 20, height: 20 },
  ];

  for (const { name, width, height } of testCases) {
    it(`${name}: map.bin is ${width}×${height}×2 = ${width * height * 2} bytes`, async () => {
      const blockdataPath = path.join(FIX_LAYOUTS, name, "map.bin");
      const stat = await fs.stat(blockdataPath);
      expect(stat.size).toBe(width * height * 2);
    });
  }
});
