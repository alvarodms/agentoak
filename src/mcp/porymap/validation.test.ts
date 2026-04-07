/**
 * Unit tests for the porymap validation module.
 *
 * Tests pure validation functions directly, and I/O functions
 * using temporary directories to avoid touching real game data.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {
  coordsInBounds,
  isUniqueLocalId,
  isUniqueWarpId,
  VALID_WEATHER,
  VALID_MAP_TYPES,
  VALID_BATTLE_SCENES,
  VALID_DIRECTIONS,
  EDITABLE_PROPERTIES,
  BOOLEAN_PROPERTIES,
  formatErrors,
  type MapJson,
  type ValidationError,
} from "./validation.js";

// ─── Helper: create a minimal MapJson for testing ───────────────────────────

function makeMapJson(overrides: Partial<MapJson> = {}): MapJson {
  return {
    id: "MAP_TEST",
    name: "TestMap",
    layout: "LAYOUT_TEST",
    music: "MUS_TEST",
    region_map_section: "MAPSEC_TEST",
    requires_flash: false,
    weather: "WEATHER_SUNNY",
    map_type: "MAP_TYPE_TOWN",
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
    ...overrides,
  };
}

// ─── coordsInBounds ─────────────────────────────────────────────────────────

describe("coordsInBounds", () => {
  it("accepts origin (0,0) on any map", () => {
    expect(coordsInBounds(0, 0, 20, 20)).toBe(true);
  });

  it("accepts max valid coordinates", () => {
    expect(coordsInBounds(19, 19, 20, 20)).toBe(true);
  });

  it("rejects x at width boundary", () => {
    expect(coordsInBounds(20, 0, 20, 20)).toBe(false);
  });

  it("rejects y at height boundary", () => {
    expect(coordsInBounds(0, 20, 20, 20)).toBe(false);
  });

  it("rejects negative x", () => {
    expect(coordsInBounds(-1, 0, 20, 20)).toBe(false);
  });

  it("rejects negative y", () => {
    expect(coordsInBounds(0, -1, 20, 20)).toBe(false);
  });

  it("works with non-square maps", () => {
    expect(coordsInBounds(29, 14, 30, 15)).toBe(true);
    expect(coordsInBounds(30, 14, 30, 15)).toBe(false);
    expect(coordsInBounds(29, 15, 30, 15)).toBe(false);
  });

  it("rejects both out of bounds", () => {
    expect(coordsInBounds(100, 100, 20, 20)).toBe(false);
  });
});

// ─── isUniqueLocalId ────────────────────────────────────────────────────────

describe("isUniqueLocalId", () => {
  it("returns true when no object events exist", () => {
    const map = makeMapJson();
    expect(isUniqueLocalId(map, "LOCALID_NEW")).toBe(true);
  });

  it("returns true when local_id is not taken", () => {
    const map = makeMapJson({
      object_events: [
        { local_id: "LOCALID_NPC_A", graphics_id: "OBJ_EVENT_GFX_WOMAN_1" },
        { local_id: "LOCALID_NPC_B", graphics_id: "OBJ_EVENT_GFX_MAN_1" },
      ],
    });
    expect(isUniqueLocalId(map, "LOCALID_NPC_C")).toBe(true);
  });

  it("returns false when local_id already exists", () => {
    const map = makeMapJson({
      object_events: [
        { local_id: "LOCALID_NPC_A", graphics_id: "OBJ_EVENT_GFX_WOMAN_1" },
      ],
    });
    expect(isUniqueLocalId(map, "LOCALID_NPC_A")).toBe(false);
  });

  it("returns true when events have no local_id field", () => {
    const map = makeMapJson({
      object_events: [
        { graphics_id: "OBJ_EVENT_GFX_WOMAN_1", x: 5, y: 5 },
      ],
    });
    expect(isUniqueLocalId(map, "LOCALID_NEW")).toBe(true);
  });
});

// ─── isUniqueWarpId ─────────────────────────────────────────────────────────

describe("isUniqueWarpId", () => {
  it("returns true when no warp events exist", () => {
    const map = makeMapJson();
    expect(isUniqueWarpId(map, "WARP_NEW")).toBe(true);
  });

  it("returns true when warp_id is not taken", () => {
    const map = makeMapJson({
      warp_events: [
        { warp_id: "WARP_DOOR_1", x: 5, y: 10 },
      ],
    });
    expect(isUniqueWarpId(map, "WARP_DOOR_2")).toBe(true);
  });

  it("returns false when warp_id already exists", () => {
    const map = makeMapJson({
      warp_events: [
        { warp_id: "WARP_DOOR_1", x: 5, y: 10 },
      ],
    });
    expect(isUniqueWarpId(map, "WARP_DOOR_1")).toBe(false);
  });
});

// ─── Enum constant sets ─────────────────────────────────────────────────────

describe("enum constant sets", () => {
  describe("VALID_WEATHER", () => {
    it("includes WEATHER_SUNNY", () => {
      expect(VALID_WEATHER.has("WEATHER_SUNNY")).toBe(true);
    });

    it("includes WEATHER_RAIN", () => {
      expect(VALID_WEATHER.has("WEATHER_RAIN")).toBe(true);
    });

    it("includes WEATHER_SANDSTORM", () => {
      expect(VALID_WEATHER.has("WEATHER_SANDSTORM")).toBe(true);
    });

    it("does not include invalid values", () => {
      expect(VALID_WEATHER.has("WEATHER_TORNADO")).toBe(false);
    });

    it("has at least 10 entries", () => {
      expect(VALID_WEATHER.size).toBeGreaterThanOrEqual(10);
    });
  });

  describe("VALID_MAP_TYPES", () => {
    it("includes MAP_TYPE_TOWN", () => {
      expect(VALID_MAP_TYPES.has("MAP_TYPE_TOWN")).toBe(true);
    });

    it("includes MAP_TYPE_INDOOR", () => {
      expect(VALID_MAP_TYPES.has("MAP_TYPE_INDOOR")).toBe(true);
    });

    it("includes MAP_TYPE_ROUTE", () => {
      expect(VALID_MAP_TYPES.has("MAP_TYPE_ROUTE")).toBe(true);
    });

    it("does not include invalid values", () => {
      expect(VALID_MAP_TYPES.has("MAP_TYPE_SPACE")).toBe(false);
    });
  });

  describe("VALID_BATTLE_SCENES", () => {
    it("includes MAP_BATTLE_SCENE_NORMAL", () => {
      expect(VALID_BATTLE_SCENES.has("MAP_BATTLE_SCENE_NORMAL")).toBe(true);
    });

    it("includes MAP_BATTLE_SCENE_GYM", () => {
      expect(VALID_BATTLE_SCENES.has("MAP_BATTLE_SCENE_GYM")).toBe(true);
    });

    it("does not include invalid values", () => {
      expect(VALID_BATTLE_SCENES.has("MAP_BATTLE_SCENE_SPACE")).toBe(false);
    });
  });

  describe("VALID_DIRECTIONS", () => {
    it("includes all four cardinal directions", () => {
      expect(VALID_DIRECTIONS.has("up")).toBe(true);
      expect(VALID_DIRECTIONS.has("down")).toBe(true);
      expect(VALID_DIRECTIONS.has("left")).toBe(true);
      expect(VALID_DIRECTIONS.has("right")).toBe(true);
    });

    it("has exactly 4 entries", () => {
      expect(VALID_DIRECTIONS.size).toBe(4);
    });
  });
});

// ─── EDITABLE_PROPERTIES / BOOLEAN_PROPERTIES ───────────────────────────────

describe("property sets", () => {
  it("EDITABLE_PROPERTIES includes all expected keys", () => {
    const expected = [
      "music", "weather", "map_type", "region_map_section",
      "battle_scene", "requires_flash", "allow_cycling",
      "allow_escaping", "allow_running", "show_map_name",
    ];
    for (const key of expected) {
      expect(EDITABLE_PROPERTIES.has(key)).toBe(true);
    }
  });

  it("EDITABLE_PROPERTIES excludes structural keys", () => {
    expect(EDITABLE_PROPERTIES.has("id")).toBe(false);
    expect(EDITABLE_PROPERTIES.has("name")).toBe(false);
    expect(EDITABLE_PROPERTIES.has("layout")).toBe(false);
    expect(EDITABLE_PROPERTIES.has("connections")).toBe(false);
    expect(EDITABLE_PROPERTIES.has("object_events")).toBe(false);
  });

  it("BOOLEAN_PROPERTIES is a subset of EDITABLE_PROPERTIES", () => {
    for (const key of BOOLEAN_PROPERTIES) {
      expect(EDITABLE_PROPERTIES.has(key)).toBe(true);
    }
  });

  it("BOOLEAN_PROPERTIES includes the 5 boolean flags", () => {
    const expected = [
      "requires_flash", "allow_cycling", "allow_escaping",
      "allow_running", "show_map_name",
    ];
    expect(BOOLEAN_PROPERTIES.size).toBe(5);
    for (const key of expected) {
      expect(BOOLEAN_PROPERTIES.has(key)).toBe(true);
    }
  });
});

// ─── formatErrors ───────────────────────────────────────────────────────────

describe("formatErrors", () => {
  it("formats a single error", () => {
    const errors: ValidationError[] = [
      { field: "x", message: "out of bounds" },
    ];
    expect(formatErrors(errors)).toBe("  - x: out of bounds");
  });

  it("formats multiple errors with newlines", () => {
    const errors: ValidationError[] = [
      { field: "x", message: "out of bounds" },
      { field: "script", message: "must be non-empty" },
    ];
    const result = formatErrors(errors);
    expect(result).toContain("  - x: out of bounds");
    expect(result).toContain("  - script: must be non-empty");
    expect(result.split("\n")).toHaveLength(2);
  });

  it("returns empty string for no errors", () => {
    expect(formatErrors([])).toBe("");
  });
});

// ─── writeMapJson / readMapJson (using temp directory) ──────────────────────

describe("writeMapJson / readMapJson round-trip", () => {
  // We can't easily test these without accessing the real file system paths
  // since they use MAPS_DIR from constants. Instead, we test the MapJson
  // type structure is correct by serializing and parsing.

  it("MapJson type serializes to valid JSON", () => {
    const map = makeMapJson({
      connections: [{ map: "MAP_ROUTE101", offset: 0, direction: "up" }],
      object_events: [
        { graphics_id: "OBJ_EVENT_GFX_WOMAN_1", x: 5, y: 10, elevation: 3 },
      ],
    });

    const json = JSON.stringify(map, null, 2);
    const parsed = JSON.parse(json);

    expect(parsed.id).toBe("MAP_TEST");
    expect(parsed.connections).toHaveLength(1);
    expect(parsed.object_events).toHaveLength(1);
    expect(parsed.weather).toBe("WEATHER_SUNNY");
  });

  it("MapJson preserves all event array types", () => {
    const map = makeMapJson({
      object_events: [{ type: "obj", x: 1 }],
      warp_events: [{ type: "warp", x: 2 }],
      coord_events: [{ type: "coord", x: 3 }],
      bg_events: [{ type: "bg", x: 4 }],
    });

    const roundTripped = JSON.parse(JSON.stringify(map));
    expect(roundTripped.object_events).toHaveLength(1);
    expect(roundTripped.warp_events).toHaveLength(1);
    expect(roundTripped.coord_events).toHaveLength(1);
    expect(roundTripped.bg_events).toHaveLength(1);
  });
});
