import { describe, it, expect } from "vitest";
import { addCoordEvent } from "./add-coord-event.js";
import { createTestContext, makeMapJson } from "./test-helpers.js";

function setup(overrides: Parameters<typeof makeMapJson>[0] = {}) {
  return createTestContext(
    { TestMap: makeMapJson(overrides) },
    { TestMap: { width: 20, height: 20 } },
  );
}

describe("addCoordEvent", () => {
  it("appends a trigger event", async () => {
    const { ctx, store } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "trigger",
      x: 5,
      y: 10,
      elevation: 3,
      var: "VAR_TEMP_1",
      var_value: "0",
      script: "TestMap_EventScript_Trigger",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.event.type).toBe("trigger");
    expect(result.data.event.var).toBe("VAR_TEMP_1");
    expect(result.data.event.script).toBe("TestMap_EventScript_Trigger");
    expect(store.written.TestMap.coord_events).toHaveLength(1);
  });

  it("appends a weather event", async () => {
    const { ctx, store } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "weather",
      x: 0,
      y: 0,
      elevation: 0,
      weather: "WEATHER_RAIN",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.event.type).toBe("weather");
    expect(result.data.event.weather).toBe("WEATHER_RAIN");
    expect(store.written.TestMap.coord_events).toHaveLength(1);
  });

  it("rejects trigger without var", async () => {
    const { ctx } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "trigger",
      x: 5,
      y: 10,
      elevation: 0,
      var_value: "0",
      script: "TestScript",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Variable constant is required");
  });

  it("rejects trigger without var_value", async () => {
    const { ctx } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "trigger",
      x: 5,
      y: 10,
      elevation: 0,
      var: "VAR_TEMP_1",
      script: "TestScript",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Variable value is required");
  });

  it("rejects trigger without script", async () => {
    const { ctx } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "trigger",
      x: 5,
      y: 10,
      elevation: 0,
      var: "VAR_TEMP_1",
      var_value: "0",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Script is required");
  });

  it("rejects weather without constant", async () => {
    const { ctx } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "weather",
      x: 0,
      y: 0,
      elevation: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Weather constant is required");
  });

  it("rejects invalid weather constant", async () => {
    const { ctx } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "weather",
      x: 0,
      y: 0,
      elevation: 0,
      weather: "WEATHER_TORNADO",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Unknown weather");
  });

  it("rejects out-of-bounds coords", async () => {
    const { ctx } = setup();
    const result = await addCoordEvent(ctx, {
      name: "TestMap",
      type: "trigger",
      x: 25,
      y: 10,
      elevation: 0,
      var: "VAR_TEMP_1",
      var_value: "0",
      script: "TestScript",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("out of bounds");
  });

  it("rejects nonexistent map", async () => {
    const { ctx } = setup();
    const result = await addCoordEvent(ctx, {
      name: "FakeMap",
      type: "trigger",
      x: 5,
      y: 10,
      elevation: 0,
      var: "VAR_TEMP_1",
      var_value: "0",
      script: "TestScript",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Map not found");
  });
});
