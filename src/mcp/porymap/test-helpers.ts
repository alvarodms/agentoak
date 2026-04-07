/**
 * Shared test utilities for write-tool handler tests.
 *
 * Provides an in-memory WriteContext mock and a MapJson factory so tests
 * don't touch the real filesystem.
 */

import type { MapJson } from "./validation.js";
import type { WriteContext } from "./write-context.js";

export function makeMapJson(overrides: Partial<MapJson> = {}): MapJson {
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

export interface TestStore {
  maps: Record<string, MapJson>;
  layouts: Record<string, { width: number; height: number }>;
  /** Snapshots of maps written via writeMapJson. */
  written: Record<string, MapJson>;
}

export function createTestContext(
  maps: Record<string, MapJson>,
  layouts: Record<string, { width: number; height: number }> = {},
): { ctx: WriteContext; store: TestStore } {
  const store: TestStore = {
    maps: structuredClone(maps),
    layouts,
    written: {},
  };

  const ctx: WriteContext = {
    mapExists: async (name) => name in store.maps,

    readMapJson: async (name) => {
      if (!(name in store.maps)) throw new Error(`Map not found: ${name}`);
      return structuredClone(store.maps[name]);
    },

    writeMapJson: async (name, data) => {
      store.maps[name] = structuredClone(data);
      store.written[name] = structuredClone(data);
    },

    getLayoutForMap: async (name) => store.layouts[name] ?? null,

    resolveMapConstant: async (constant) => {
      for (const [dirName, mapData] of Object.entries(store.maps)) {
        if (mapData.id === constant) return dirName;
      }
      return null;
    },
  };

  return { ctx, store };
}
