import { describe, it, expect } from "vitest";
import { removeEvent } from "./remove-event.js";
import { createTestContext, makeMapJson } from "./test-helpers.js";

function setup() {
  return createTestContext({
    TestMap: makeMapJson({
      object_events: [
        {
          local_id: "LOCALID_NPC_A",
          graphics_id: "OBJ_EVENT_GFX_WOMAN_1",
          x: 5,
          y: 5,
        },
        {
          local_id: "LOCALID_NPC_B",
          graphics_id: "OBJ_EVENT_GFX_MAN_1",
          x: 10,
          y: 10,
        },
        { graphics_id: "OBJ_EVENT_GFX_BOY_1", x: 15, y: 15 },
      ],
      warp_events: [
        {
          warp_id: "WARP_DOOR_1",
          x: 1,
          y: 1,
          elevation: 0,
          dest_map: "MAP_OTHER",
          dest_warp_id: "0",
        },
        {
          x: 3,
          y: 3,
          elevation: 0,
          dest_map: "MAP_OTHER",
          dest_warp_id: "1",
        },
      ],
      bg_events: [{ type: "sign", x: 2, y: 2, script: "TestScript" }],
      coord_events: [
        {
          type: "trigger",
          x: 4,
          y: 4,
          var: "VAR_TEMP_1",
          var_value: "0",
          script: "TriggerScript",
        },
      ],
    }),
  });
}

describe("removeEvent", () => {
  it("removes object event by index", async () => {
    const { ctx, store } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "object_events",
      index: 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.removed_index).toBe(0);
    expect(result.data.removed_event.local_id).toBe("LOCALID_NPC_A");
    expect(result.data.remaining_count).toBe(2);
    expect(store.written.TestMap.object_events).toHaveLength(2);
  });

  it("removes object event by local_id", async () => {
    const { ctx, store } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "object_events",
      local_id: "LOCALID_NPC_B",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.removed_index).toBe(1);
    expect(result.data.removed_event.local_id).toBe("LOCALID_NPC_B");
    expect(store.written.TestMap.object_events).toHaveLength(2);
  });

  it("removes warp event by warp_id via local_id param", async () => {
    const { ctx, store } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "warp_events",
      local_id: "WARP_DOOR_1",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.removed_event.warp_id).toBe("WARP_DOOR_1");
    expect(store.written.TestMap.warp_events).toHaveLength(1);
  });

  it("removes bg_event by index", async () => {
    const { ctx, store } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "bg_events",
      index: 0,
    });
    expect(result.ok).toBe(true);
    expect(store.written.TestMap.bg_events).toHaveLength(0);
  });

  it("removes coord_event by index", async () => {
    const { ctx, store } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "coord_events",
      index: 0,
    });
    expect(result.ok).toBe(true);
    expect(store.written.TestMap.coord_events).toHaveLength(0);
  });

  it("rejects when neither index nor local_id provided", async () => {
    const { ctx } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "object_events",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Provide either");
  });

  it("rejects out-of-bounds index", async () => {
    const { ctx } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "object_events",
      index: 10,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("out of bounds");
  });

  it("rejects nonexistent local_id", async () => {
    const { ctx } = setup();
    const result = await removeEvent(ctx, {
      name: "TestMap",
      event_type: "object_events",
      local_id: "LOCALID_FAKE",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("No event with");
  });

  it("rejects nonexistent map", async () => {
    const { ctx } = setup();
    const result = await removeEvent(ctx, {
      name: "FakeMap",
      event_type: "object_events",
      index: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Map not found");
  });

  it("preserves other event arrays when removing", async () => {
    const { ctx, store } = setup();
    await removeEvent(ctx, {
      name: "TestMap",
      event_type: "object_events",
      index: 0,
    });
    expect(store.written.TestMap.warp_events).toHaveLength(2);
    expect(store.written.TestMap.bg_events).toHaveLength(1);
    expect(store.written.TestMap.coord_events).toHaveLength(1);
  });
});
