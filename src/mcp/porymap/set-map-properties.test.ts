import { describe, it, expect } from "vitest";
import { setMapProperties } from "./set-map-properties.js";
import { createTestContext, makeMapJson } from "./test-helpers.js";

function setup(overrides: Parameters<typeof makeMapJson>[0] = {}) {
  return createTestContext(
    { TestMap: makeMapJson(overrides) },
    { TestMap: { width: 20, height: 20 } },
  );
}

describe("setMapProperties", () => {
  it("updates weather and records before/after", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: { weather: "WEATHER_RAIN" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.changed.weather).toEqual({
      from: "WEATHER_SUNNY",
      to: "WEATHER_RAIN",
    });
  });

  it("updates music and persists to store", async () => {
    const { ctx, store } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: { music: "MUS_SLATEPORT" },
    });
    expect(result.ok).toBe(true);
    expect(store.written.TestMap.music).toBe("MUS_SLATEPORT");
  });

  it("updates boolean flags", async () => {
    const { ctx, store } = setup();
    await setMapProperties(ctx, {
      name: "TestMap",
      properties: { allow_cycling: false, requires_flash: true },
    });
    expect(store.written.TestMap.allow_cycling).toBe(false);
    expect(store.written.TestMap.requires_flash).toBe(true);
  });

  it("updates multiple properties at once", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: {
        weather: "WEATHER_SANDSTORM",
        battle_scene: "MAP_BATTLE_SCENE_GYM",
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.changed.weather.to).toBe("WEATHER_SANDSTORM");
    expect(result.data.changed.battle_scene.to).toBe("MAP_BATTLE_SCENE_GYM");
  });

  it("preserves untouched properties", async () => {
    const { ctx, store } = setup();
    await setMapProperties(ctx, {
      name: "TestMap",
      properties: { weather: "WEATHER_RAIN" },
    });
    expect(store.written.TestMap.music).toBe("MUS_TEST");
    expect(store.written.TestMap.map_type).toBe("MAP_TYPE_TOWN");
  });

  it("rejects unknown property keys", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: { id: "MAP_NEW" },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Not an editable property");
  });

  it("rejects invalid weather constant", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: { weather: "WEATHER_TORNADO" },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("weather");
  });

  it("rejects invalid map_type", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: { map_type: "MAP_TYPE_SPACE" },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("map_type");
  });

  it("rejects invalid battle_scene", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: { battle_scene: "MAP_BATTLE_SCENE_SPACE" },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("battle_scene");
  });

  it("rejects string value for boolean property", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "TestMap",
      properties: { allow_cycling: "yes" as unknown as boolean },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Expected boolean");
  });

  it("rejects nonexistent map", async () => {
    const { ctx } = setup();
    const result = await setMapProperties(ctx, {
      name: "NonExistent",
      properties: { weather: "WEATHER_RAIN" },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Map not found");
  });
});
