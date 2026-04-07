import { describe, it, expect } from "vitest";
import { addWarpEvent } from "./add-warp-event.js";
import { createTestContext, makeMapJson } from "./test-helpers.js";

function setup(
  sourceOverrides: Parameters<typeof makeMapJson>[0] = {},
) {
  return createTestContext(
    {
      TestMap: makeMapJson(sourceOverrides),
      LittlerootTown: makeMapJson({
        id: "MAP_LITTLEROOT_TOWN",
        name: "LittlerootTown",
      }),
    },
    { TestMap: { width: 20, height: 20 } },
  );
}

describe("addWarpEvent", () => {
  it("appends warp event", async () => {
    const { ctx, store } = setup();
    const result = await addWarpEvent(ctx, {
      name: "TestMap",
      x: 5,
      y: 10,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.index).toBe(0);
    expect(result.data.event.dest_map).toBe("MAP_LITTLEROOT_TOWN");
    expect(store.written.TestMap.warp_events).toHaveLength(1);
  });

  it("includes warp_id when provided", async () => {
    const { ctx, store } = setup();
    await addWarpEvent(ctx, {
      name: "TestMap",
      x: 5,
      y: 10,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
      warp_id: "WARP_TEST_DOOR",
    });
    const warp = store.written.TestMap.warp_events[0] as Record<
      string,
      unknown
    >;
    expect(warp.warp_id).toBe("WARP_TEST_DOOR");
  });

  it("omits warp_id key when not provided", async () => {
    const { ctx, store } = setup();
    await addWarpEvent(ctx, {
      name: "TestMap",
      x: 5,
      y: 10,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
    });
    const warp = store.written.TestMap.warp_events[0] as Record<
      string,
      unknown
    >;
    expect("warp_id" in warp).toBe(false);
  });

  it("rejects out-of-bounds coords", async () => {
    const { ctx } = setup();
    const result = await addWarpEvent(ctx, {
      name: "TestMap",
      x: 25,
      y: 10,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("out of bounds");
  });

  it("rejects nonexistent dest_map", async () => {
    const { ctx } = setup();
    const result = await addWarpEvent(ctx, {
      name: "TestMap",
      x: 5,
      y: 10,
      elevation: 0,
      dest_map: "MAP_NONEXISTENT",
      dest_warp_id: "0",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("not found");
  });

  it("rejects duplicate warp_id", async () => {
    const { ctx } = setup({
      warp_events: [
        {
          warp_id: "WARP_DOOR_1",
          x: 1,
          y: 1,
          elevation: 0,
          dest_map: "MAP_TEST",
          dest_warp_id: "0",
        },
      ],
    });
    const result = await addWarpEvent(ctx, {
      name: "TestMap",
      x: 5,
      y: 10,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
      warp_id: "WARP_DOOR_1",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("already exists");
  });

  it("rejects nonexistent source map", async () => {
    const { ctx } = setup();
    const result = await addWarpEvent(ctx, {
      name: "FakeMap",
      x: 5,
      y: 10,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Map not found");
  });
});
