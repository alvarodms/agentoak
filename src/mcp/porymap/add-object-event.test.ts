import { describe, it, expect } from "vitest";
import { addObjectEvent } from "./add-object-event.js";
import { createTestContext, makeMapJson } from "./test-helpers.js";

const BASE_EVENT = {
  graphics_id: "OBJ_EVENT_GFX_WOMAN_1",
  x: 5,
  y: 5,
  elevation: 3,
  movement_type: "MOVEMENT_TYPE_FACE_DOWN",
  movement_range_x: 0,
  movement_range_y: 0,
  trainer_type: "TRAINER_TYPE_NONE",
  trainer_sight_or_berry_tree_id: "0",
  script: "TestMap_EventScript_Npc",
  flag: "0",
};

function setup(overrides: Parameters<typeof makeMapJson>[0] = {}) {
  return createTestContext(
    { TestMap: makeMapJson(overrides) },
    { TestMap: { width: 20, height: 20 } },
  );
}

describe("addObjectEvent", () => {
  it("appends event to empty array", async () => {
    const { ctx, store } = setup();
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.index).toBe(0);
    expect(result.data.event.graphics_id).toBe("OBJ_EVENT_GFX_WOMAN_1");
    expect(store.written.TestMap.object_events).toHaveLength(1);
  });

  it("appends event to existing array", async () => {
    const { ctx, store } = setup({
      object_events: [{ graphics_id: "OBJ_EVENT_GFX_MAN_1", x: 1, y: 1 }],
    });
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
    });
    expect(result.ok).toBe(true);
    expect(store.written.TestMap.object_events).toHaveLength(2);
  });

  it("places local_id as first key when provided", async () => {
    const { ctx, store } = setup();
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
      local_id: "LOCALID_TEST_NPC",
    });
    expect(result.ok).toBe(true);
    const event = store.written.TestMap.object_events[0] as Record<
      string,
      unknown
    >;
    expect(Object.keys(event)[0]).toBe("local_id");
    expect(event.local_id).toBe("LOCALID_TEST_NPC");
  });

  it("omits local_id key when not provided", async () => {
    const { ctx, store } = setup();
    await addObjectEvent(ctx, { name: "TestMap", ...BASE_EVENT });
    const event = store.written.TestMap.object_events[0] as Record<
      string,
      unknown
    >;
    expect("local_id" in event).toBe(false);
  });

  it("rejects out-of-bounds coordinates", async () => {
    const { ctx } = setup();
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
      x: 20,
      y: 5,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("out of bounds");
  });

  it("rejects negative coordinates", async () => {
    const { ctx } = setup();
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
      x: -1,
      y: 5,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects empty script", async () => {
    const { ctx } = setup();
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
      script: "",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Script");
  });

  it("rejects whitespace-only script", async () => {
    const { ctx } = setup();
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
      script: "   ",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects duplicate local_id", async () => {
    const { ctx } = setup({
      object_events: [
        { local_id: "LOCALID_EXISTING", graphics_id: "OBJ_EVENT_GFX_MAN_1" },
      ],
    });
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
      local_id: "LOCALID_EXISTING",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("already exists");
  });

  it("rejects nonexistent map", async () => {
    const { ctx } = setup();
    const result = await addObjectEvent(ctx, {
      name: "FakeMap",
      ...BASE_EVENT,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Map not found");
  });

  it("rejects when layout cannot be resolved", async () => {
    const { ctx } = createTestContext({ TestMap: makeMapJson() }, {});
    const result = await addObjectEvent(ctx, {
      name: "TestMap",
      ...BASE_EVENT,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("layout dimensions");
  });
});
