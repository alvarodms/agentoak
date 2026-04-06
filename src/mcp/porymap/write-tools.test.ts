/**
 * Integration tests for porymap write tool logic.
 *
 * These tests exercise the JSON manipulation and validation that the write
 * tools perform, using temporary copies of fixture data. Since the MCP tool
 * handlers use hardcoded paths, we test the underlying validation + I/O
 * functions directly rather than going through the MCP protocol.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import {
  coordsInBounds,
  isUniqueLocalId,
  isUniqueWarpId,
  VALID_WEATHER,
  VALID_MAP_TYPES,
  VALID_BATTLE_SCENES,
  EDITABLE_PROPERTIES,
  BOOLEAN_PROPERTIES,
  type MapJson,
} from "./validation.js";

// ─── Fixture loading ────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "__fixtures__");

async function loadFixtureMap(mapName: string): Promise<MapJson> {
  const text = await fs.readFile(
    path.join(FIXTURES, "maps", mapName, "map.json"),
    "utf-8",
  );
  return JSON.parse(text) as MapJson;
}

// ─── Temp directory for write tests ─────────────────────────────────────────

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "porymap-write-test-"));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function writeTestMap(mapName: string, data: MapJson): Promise<string> {
  const dir = path.join(tmpDir, mapName);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, "map.json");
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  return filePath;
}

async function readTestMap(mapName: string): Promise<MapJson> {
  const filePath = path.join(tmpDir, mapName, "map.json");
  const text = await fs.readFile(filePath, "utf-8");
  return JSON.parse(text) as MapJson;
}

// ─── set_map_properties logic ───────────────────────────────────────────────

describe("set_map_properties — logic", () => {
  it("updates weather property", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    expect(map.weather).toBe("WEATHER_SUNNY");

    map.weather = "WEATHER_RAIN";
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.weather).toBe("WEATHER_RAIN");
    // Other properties unchanged
    expect(result.music).toBe("MUS_PETALBURG");
    expect(result.map_type).toBe("MAP_TYPE_CITY");
  });

  it("updates music property", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    map.music = "MUS_SLATEPORT";
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");
    expect(result.music).toBe("MUS_SLATEPORT");
  });

  it("updates boolean flags", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    map.allow_cycling = false;
    map.requires_flash = true;
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");
    expect(result.allow_cycling).toBe(false);
    expect(result.requires_flash).toBe(true);
  });

  it("updates multiple properties at once", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    map.weather = "WEATHER_SANDSTORM";
    map.battle_scene = "MAP_BATTLE_SCENE_GYM";
    map.show_map_name = false;
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");
    expect(result.weather).toBe("WEATHER_SANDSTORM");
    expect(result.battle_scene).toBe("MAP_BATTLE_SCENE_GYM");
    expect(result.show_map_name).toBe(false);
  });

  it("rejects unknown property keys via EDITABLE_PROPERTIES check", () => {
    expect(EDITABLE_PROPERTIES.has("id")).toBe(false);
    expect(EDITABLE_PROPERTIES.has("layout")).toBe(false);
    expect(EDITABLE_PROPERTIES.has("object_events")).toBe(false);
    expect(EDITABLE_PROPERTIES.has("connections")).toBe(false);
  });

  it("validates weather constant via VALID_WEATHER", () => {
    expect(VALID_WEATHER.has("WEATHER_RAIN")).toBe(true);
    expect(VALID_WEATHER.has("WEATHER_TORNADO")).toBe(false);
  });

  it("validates map_type via VALID_MAP_TYPES", () => {
    expect(VALID_MAP_TYPES.has("MAP_TYPE_CITY")).toBe(true);
    expect(VALID_MAP_TYPES.has("MAP_TYPE_SPACE")).toBe(false);
  });

  it("validates battle_scene via VALID_BATTLE_SCENES", () => {
    expect(VALID_BATTLE_SCENES.has("MAP_BATTLE_SCENE_NORMAL")).toBe(true);
    expect(VALID_BATTLE_SCENES.has("MAP_BATTLE_SCENE_SPACE")).toBe(false);
  });

  it("validates boolean properties via BOOLEAN_PROPERTIES", () => {
    for (const prop of BOOLEAN_PROPERTIES) {
      expect(EDITABLE_PROPERTIES.has(prop)).toBe(true);
    }
    // music is NOT a boolean property
    expect(BOOLEAN_PROPERTIES.has("music")).toBe(false);
  });
});

// ─── add_object_event logic ─────────────────────────────────────────────────

describe("add_object_event — logic", () => {
  it("appends a new object event to map data", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.object_events.length;

    const newEvent = {
      graphics_id: "OBJ_EVENT_GFX_WOMAN_1",
      x: 15,
      y: 20,
      elevation: 3,
      movement_type: "MOVEMENT_TYPE_FACE_DOWN",
      movement_range_x: 0,
      movement_range_y: 0,
      trainer_type: "TRAINER_TYPE_NONE",
      trainer_sight_or_berry_tree_id: "0",
      script: "PetalburgCity_EventScript_NewNpc",
      flag: "0",
    };

    map.object_events.push(newEvent);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.object_events).toHaveLength(originalCount + 1);
    const added = result.object_events[result.object_events.length - 1] as Record<string, unknown>;
    expect(added.graphics_id).toBe("OBJ_EVENT_GFX_WOMAN_1");
    expect(added.x).toBe(15);
    expect(added.y).toBe(20);
    expect(added.script).toBe("PetalburgCity_EventScript_NewNpc");
  });

  it("appends event with local_id first", async () => {
    const map = await loadFixtureMap("PetalburgCity");

    const newEvent = {
      local_id: "LOCALID_TEST_NPC",
      graphics_id: "OBJ_EVENT_GFX_MAN_1",
      x: 10,
      y: 10,
      elevation: 3,
      movement_type: "MOVEMENT_TYPE_LOOK_AROUND",
      movement_range_x: 1,
      movement_range_y: 1,
      trainer_type: "TRAINER_TYPE_NONE",
      trainer_sight_or_berry_tree_id: "0",
      script: "TestScript",
      flag: "0",
    };

    map.object_events.push(newEvent);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    const added = result.object_events[result.object_events.length - 1] as Record<string, unknown>;
    expect(added.local_id).toBe("LOCALID_TEST_NPC");
    // Verify local_id is the first key
    const keys = Object.keys(added);
    expect(keys[0]).toBe("local_id");
  });

  it("rejects coordinates outside map bounds", () => {
    // PetalburgCity is 30x30
    expect(coordsInBounds(29, 29, 30, 30)).toBe(true);
    expect(coordsInBounds(30, 29, 30, 30)).toBe(false);
    expect(coordsInBounds(29, 30, 30, 30)).toBe(false);
    expect(coordsInBounds(-1, 5, 30, 30)).toBe(false);
  });

  it("rejects duplicate local_id", async () => {
    const map = await loadFixtureMap("PetalburgCity");

    // Find an existing local_id
    const existingEvent = map.object_events.find(
      (e) => (e as Record<string, unknown>).local_id,
    ) as Record<string, unknown> | undefined;

    if (existingEvent?.local_id) {
      expect(isUniqueLocalId(map, existingEvent.local_id as string)).toBe(false);
    }

    // A fresh ID should be unique
    expect(isUniqueLocalId(map, "LOCALID_DEFINITELY_NEW_12345")).toBe(true);
  });
});

// ─── add_warp_event logic ───────────────────────────────────────────────────

describe("add_warp_event — logic", () => {
  it("appends a new warp event", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.warp_events.length;

    const newWarp = {
      x: 20,
      y: 25,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
    };

    map.warp_events.push(newWarp);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.warp_events).toHaveLength(originalCount + 1);
    const added = result.warp_events[result.warp_events.length - 1] as Record<string, unknown>;
    expect(added.dest_map).toBe("MAP_LITTLEROOT_TOWN");
    expect(added.x).toBe(20);
    expect(added.y).toBe(25);
  });

  it("appends warp with warp_id", async () => {
    const map = await loadFixtureMap("PetalburgCity");

    const newWarp = {
      warp_id: "WARP_TEST_DOOR",
      x: 15,
      y: 18,
      elevation: 0,
      dest_map: "MAP_ROUTE101",
      dest_warp_id: "1",
    };

    map.warp_events.push(newWarp);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    const added = result.warp_events[result.warp_events.length - 1] as Record<string, unknown>;
    expect(added.warp_id).toBe("WARP_TEST_DOOR");
  });

  it("rejects duplicate warp_id", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    // Add a warp with an ID, then check uniqueness
    map.warp_events.push({ warp_id: "WARP_UNIQUE", x: 1, y: 1, elevation: 0, dest_map: "MAP_TEST", dest_warp_id: "0" });
    expect(isUniqueWarpId(map, "WARP_UNIQUE")).toBe(false);
    expect(isUniqueWarpId(map, "WARP_OTHER")).toBe(true);
  });
});

// ─── add_bg_event logic ─────────────────────────────────────────────────────

describe("add_bg_event — logic", () => {
  it("appends a sign event", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.bg_events.length;

    const newSign = {
      type: "sign",
      x: 10,
      y: 15,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_NORTH",
      script: "PetalburgCity_EventScript_TestSign",
    };

    map.bg_events.push(newSign);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.bg_events).toHaveLength(originalCount + 1);
    const added = result.bg_events[result.bg_events.length - 1] as Record<string, unknown>;
    expect(added.type).toBe("sign");
    expect(added.script).toBe("PetalburgCity_EventScript_TestSign");
  });

  it("appends a hidden_item event", async () => {
    const map = await loadFixtureMap("PetalburgCity");

    const newItem = {
      type: "hidden_item",
      x: 5,
      y: 8,
      elevation: 0,
      item: "ITEM_POTION",
      flag: "FLAG_HIDDEN_ITEM_PETALBURG_POTION",
    };

    map.bg_events.push(newItem);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    const added = result.bg_events[result.bg_events.length - 1] as Record<string, unknown>;
    expect(added.type).toBe("hidden_item");
    expect(added.item).toBe("ITEM_POTION");
    expect(added.flag).toBe("FLAG_HIDDEN_ITEM_PETALBURG_POTION");
  });

  it("appends a secret_base event", async () => {
    const map = await loadFixtureMap("PetalburgCity");

    const newBase = {
      type: "secret_base",
      x: 20,
      y: 5,
      elevation: 0,
      secret_base_id: "SECRET_BASE_PETALBURG_1",
    };

    map.bg_events.push(newBase);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    const added = result.bg_events[result.bg_events.length - 1] as Record<string, unknown>;
    expect(added.type).toBe("secret_base");
    expect(added.secret_base_id).toBe("SECRET_BASE_PETALBURG_1");
  });
});

// ─── add_coord_event logic ──────────────────────────────────────────────────

describe("add_coord_event — logic", () => {
  it("appends a trigger event", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.coord_events.length;

    const newTrigger = {
      type: "trigger",
      x: 12,
      y: 14,
      elevation: 3,
      var: "VAR_TEMP_1",
      var_value: "0",
      script: "PetalburgCity_EventScript_TestTrigger",
    };

    map.coord_events.push(newTrigger);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.coord_events).toHaveLength(originalCount + 1);
    const added = result.coord_events[result.coord_events.length - 1] as Record<string, unknown>;
    expect(added.type).toBe("trigger");
    expect(added.var).toBe("VAR_TEMP_1");
    expect(added.script).toBe("PetalburgCity_EventScript_TestTrigger");
  });

  it("appends a weather event", async () => {
    const map = await loadFixtureMap("PetalburgCity");

    const newWeather = {
      type: "weather",
      x: 0,
      y: 0,
      elevation: 0,
      weather: "WEATHER_RAIN",
    };

    map.coord_events.push(newWeather);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    const added = result.coord_events[result.coord_events.length - 1] as Record<string, unknown>;
    expect(added.type).toBe("weather");
    expect(added.weather).toBe("WEATHER_RAIN");
  });

  it("validates weather constants", () => {
    expect(VALID_WEATHER.has("WEATHER_RAIN")).toBe(true);
    expect(VALID_WEATHER.has("WEATHER_RAIN_THUNDERSTORM")).toBe(true);
    expect(VALID_WEATHER.has("WEATHER_INVALID")).toBe(false);
  });
});

// ─── remove_event logic ─────────────────────────────────────────────────────

describe("remove_event — logic", () => {
  it("removes an object event by index", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.object_events.length;
    const removedEvent = map.object_events[0];

    map.object_events.splice(0, 1);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.object_events).toHaveLength(originalCount - 1);
    // First event should now be the original second
    expect(result.object_events[0]).not.toEqual(removedEvent);
  });

  it("removes an object event by local_id", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.object_events.length;

    // Find an event with a local_id
    const idx = map.object_events.findIndex(
      (e) => (e as Record<string, unknown>).local_id != null,
    );

    if (idx !== -1) {
      map.object_events.splice(idx, 1);
      await writeTestMap("PetalburgCity", map);
      const result = await readTestMap("PetalburgCity");
      expect(result.object_events).toHaveLength(originalCount - 1);
    }
  });

  it("removes a warp event by index", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.warp_events.length;

    map.warp_events.splice(2, 1); // Remove 3rd warp
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.warp_events).toHaveLength(originalCount - 1);
  });

  it("removes a bg_event by index", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.bg_events.length;

    map.bg_events.splice(0, 1);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.bg_events).toHaveLength(originalCount - 1);
  });

  it("removes a coord_event by index", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.coord_events.length;

    map.coord_events.splice(0, 1);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.coord_events).toHaveLength(originalCount - 1);
  });

  it("preserves other events when one is removed", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalObjectCount = map.object_events.length;
    const originalWarpCount = map.warp_events.length;

    // Remove first bg_event
    map.bg_events.splice(0, 1);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    // Other arrays unchanged
    expect(result.object_events).toHaveLength(originalObjectCount);
    expect(result.warp_events).toHaveLength(originalWarpCount);
  });
});

// ─── edit_map_connection logic ──────────────────────────────────────────────

describe("edit_map_connection — logic", () => {
  it("adds a new connection", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const originalCount = map.connections.length;

    map.connections.push({ map: "MAP_ROUTE103", offset: 0, direction: "up" });
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.connections).toHaveLength(originalCount + 1);
    const added = result.connections[result.connections.length - 1];
    expect(added.map).toBe("MAP_ROUTE103");
    expect(added.direction).toBe("up");
    expect(added.offset).toBe(0);
  });

  it("removes a connection by direction", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    // PetalburgCity has left (Route104) and right (Route102)
    expect(map.connections).toHaveLength(2);

    const leftIdx = map.connections.findIndex((c) => c.direction === "left");
    expect(leftIdx).not.toBe(-1);

    map.connections.splice(leftIdx, 1);
    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    expect(result.connections).toHaveLength(1);
    expect(result.connections[0].direction).toBe("right");
  });

  it("updates an existing connection", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const leftIdx = map.connections.findIndex((c) => c.direction === "left");
    expect(leftIdx).not.toBe(-1);

    map.connections[leftIdx] = {
      map: "MAP_ROUTE103",
      offset: 10,
      direction: "left",
    };

    await writeTestMap("PetalburgCity", map);
    const result = await readTestMap("PetalburgCity");

    const leftConn = result.connections.find((c) => c.direction === "left");
    expect(leftConn).toBeDefined();
    expect(leftConn!.map).toBe("MAP_ROUTE103");
    expect(leftConn!.offset).toBe(10);
  });

  it("detects duplicate direction on add", () => {
    const map = loadFixtureMap("PetalburgCity");
    // Test the detection logic inline
    return map.then((mapData) => {
      const existingDirections = new Set(mapData.connections.map((c) => c.direction));
      expect(existingDirections.has("left")).toBe(true);
      expect(existingDirections.has("right")).toBe(true);
      expect(existingDirections.has("up")).toBe(false);
      expect(existingDirections.has("down")).toBe(false);
    });
  });
});

// ─── JSON format preservation ───────────────────────────────────────────────

describe("JSON format preservation", () => {
  it("writes with 2-space indent and trailing newline", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    await writeTestMap("PetalburgCity", map);

    const raw = await fs.readFile(
      path.join(tmpDir, "PetalburgCity", "map.json"),
      "utf-8",
    );

    // Should end with newline
    expect(raw.endsWith("\n")).toBe(true);

    // Should use 2-space indent (check first indented line)
    const lines = raw.split("\n");
    const firstIndented = lines.find((l) => l.startsWith("  "));
    expect(firstIndented).toBeDefined();
    // Should NOT use tab indent
    const tabIndented = lines.find((l) => l.startsWith("\t"));
    expect(tabIndented).toBeUndefined();
  });

  it("round-trips fixture map.json without data loss", async () => {
    const original = await loadFixtureMap("PetalburgCity");
    await writeTestMap("PetalburgCity", original);
    const roundTripped = await readTestMap("PetalburgCity");

    expect(roundTripped.id).toBe(original.id);
    expect(roundTripped.name).toBe(original.name);
    expect(roundTripped.layout).toBe(original.layout);
    expect(roundTripped.music).toBe(original.music);
    expect(roundTripped.weather).toBe(original.weather);
    expect(roundTripped.map_type).toBe(original.map_type);
    expect(roundTripped.connections).toEqual(original.connections);
    expect(roundTripped.object_events).toHaveLength(original.object_events.length);
    expect(roundTripped.warp_events).toHaveLength(original.warp_events.length);
    expect(roundTripped.coord_events).toHaveLength(original.coord_events.length);
    expect(roundTripped.bg_events).toHaveLength(original.bg_events.length);
  });
});

// ─── Edge cases ─────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("handles map with empty event arrays", async () => {
    const map: MapJson = {
      id: "MAP_EMPTY",
      name: "EmptyMap",
      layout: "LAYOUT_EMPTY",
      music: "MUS_NONE",
      region_map_section: "MAPSEC_NONE",
      requires_flash: false,
      weather: "WEATHER_NONE",
      map_type: "MAP_TYPE_NONE",
      allow_cycling: false,
      allow_escaping: false,
      allow_running: false,
      show_map_name: false,
      battle_scene: "MAP_BATTLE_SCENE_NORMAL",
      connections: [],
      object_events: [],
      warp_events: [],
      coord_events: [],
      bg_events: [],
    };

    await writeTestMap("EmptyMap", map);
    const result = await readTestMap("EmptyMap");

    expect(result.object_events).toHaveLength(0);
    expect(result.warp_events).toHaveLength(0);
    expect(result.coord_events).toHaveLength(0);
    expect(result.bg_events).toHaveLength(0);
    expect(result.connections).toHaveLength(0);
  });

  it("handles map with null connections", async () => {
    const map = await loadFixtureMap("LittlerootTown_BrendansHouse_2F");
    // Indoor maps have null connections
    await writeTestMap("IndoorMap", map);
    const result = await readTestMap("IndoorMap");

    // null connections should be preserved
    expect(result.connections).toBeNull();
  });

  it("adds event to map with no prior events of that type", async () => {
    const map: MapJson = {
      id: "MAP_FRESH",
      name: "FreshMap",
      layout: "LAYOUT_FRESH",
      music: "MUS_NONE",
      region_map_section: "MAPSEC_NONE",
      requires_flash: false,
      weather: "WEATHER_SUNNY",
      map_type: "MAP_TYPE_ROUTE",
      allow_cycling: true,
      allow_escaping: false,
      allow_running: true,
      show_map_name: true,
      battle_scene: "MAP_BATTLE_SCENE_NORMAL",
      connections: [],
      object_events: [],
      warp_events: [],
      coord_events: [],
      bg_events: [],
    };

    // Add first-ever object event
    map.object_events.push({
      graphics_id: "OBJ_EVENT_GFX_WOMAN_1",
      x: 5,
      y: 5,
      elevation: 3,
      movement_type: "MOVEMENT_TYPE_FACE_DOWN",
      movement_range_x: 0,
      movement_range_y: 0,
      trainer_type: "TRAINER_TYPE_NONE",
      trainer_sight_or_berry_tree_id: "0",
      script: "FreshMap_EventScript_FirstNpc",
      flag: "0",
    });

    await writeTestMap("FreshMap", map);
    const result = await readTestMap("FreshMap");

    expect(result.object_events).toHaveLength(1);
    expect((result.object_events[0] as Record<string, unknown>).script).toBe(
      "FreshMap_EventScript_FirstNpc",
    );
  });

  it("handles removing the last event in an array", async () => {
    const map: MapJson = {
      id: "MAP_SINGLE",
      name: "SingleEvent",
      layout: "LAYOUT_SINGLE",
      music: "MUS_NONE",
      region_map_section: "MAPSEC_NONE",
      requires_flash: false,
      weather: "WEATHER_SUNNY",
      map_type: "MAP_TYPE_ROUTE",
      allow_cycling: true,
      allow_escaping: false,
      allow_running: true,
      show_map_name: true,
      battle_scene: "MAP_BATTLE_SCENE_NORMAL",
      connections: [],
      object_events: [{ graphics_id: "OBJ_EVENT_GFX_WOMAN_1", x: 5, y: 5 }],
      warp_events: [],
      coord_events: [],
      bg_events: [],
    };

    map.object_events.splice(0, 1);
    await writeTestMap("SingleEvent", map);
    const result = await readTestMap("SingleEvent");

    expect(result.object_events).toHaveLength(0);
    expect(result.object_events).toEqual([]);
  });

  it("coordsInBounds works for 1x1 map", () => {
    expect(coordsInBounds(0, 0, 1, 1)).toBe(true);
    expect(coordsInBounds(1, 0, 1, 1)).toBe(false);
    expect(coordsInBounds(0, 1, 1, 1)).toBe(false);
  });
});
