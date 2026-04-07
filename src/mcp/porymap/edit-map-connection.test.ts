import { describe, it, expect } from "vitest";
import { editMapConnection } from "./edit-map-connection.js";
import { createTestContext, makeMapJson } from "./test-helpers.js";

function setup() {
  return createTestContext({
    TestMap: makeMapJson({
      connections: [
        { map: "MAP_ROUTE101", offset: 0, direction: "left" },
        { map: "MAP_ROUTE102", offset: 5, direction: "right" },
      ],
    }),
    Route101: makeMapJson({ id: "MAP_ROUTE101" }),
    Route102: makeMapJson({ id: "MAP_ROUTE102" }),
    Route103: makeMapJson({ id: "MAP_ROUTE103" }),
  });
}

describe("editMapConnection", () => {
  it("adds a new connection", async () => {
    const { ctx, store } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "add",
      direction: "up",
      target_map: "MAP_ROUTE103",
      offset: 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.total_connections).toBe(3);
    expect(store.written.TestMap.connections).toHaveLength(3);
  });

  it("rejects add when direction already exists", async () => {
    const { ctx } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "add",
      direction: "left",
      target_map: "MAP_ROUTE103",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("already exists");
  });

  it("rejects add without target_map", async () => {
    const { ctx } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "add",
      direction: "up",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("target_map is required");
  });

  it("updates existing connection", async () => {
    const { ctx, store } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "update",
      direction: "left",
      target_map: "MAP_ROUTE103",
      offset: 10,
    });
    expect(result.ok).toBe(true);
    const leftConn = store.written.TestMap.connections.find(
      (c) => c.direction === "left",
    );
    expect(leftConn!.map).toBe("MAP_ROUTE103");
    expect(leftConn!.offset).toBe(10);
  });

  it("preserves offset on update when not provided", async () => {
    const { ctx, store } = setup();
    await editMapConnection(ctx, {
      name: "TestMap",
      action: "update",
      direction: "right",
      target_map: "MAP_ROUTE103",
    });
    const rightConn = store.written.TestMap.connections.find(
      (c) => c.direction === "right",
    );
    expect(rightConn!.offset).toBe(5);
  });

  it("rejects update when no existing connection", async () => {
    const { ctx } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "update",
      direction: "up",
      target_map: "MAP_ROUTE103",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("No existing connection");
  });

  it("removes connection by direction", async () => {
    const { ctx, store } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "remove",
      direction: "left",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.total_connections).toBe(1);
    expect(store.written.TestMap.connections).toHaveLength(1);
    expect(store.written.TestMap.connections[0].direction).toBe("right");
  });

  it("rejects remove when no connection in direction", async () => {
    const { ctx } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "remove",
      direction: "up",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("No connection in direction");
  });

  it("validates target map exists", async () => {
    const { ctx } = setup();
    const result = await editMapConnection(ctx, {
      name: "TestMap",
      action: "add",
      direction: "up",
      target_map: "MAP_NONEXISTENT",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("not found");
  });

  it("rejects nonexistent source map", async () => {
    const { ctx } = setup();
    const result = await editMapConnection(ctx, {
      name: "FakeMap",
      action: "add",
      direction: "up",
      target_map: "MAP_ROUTE103",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Map not found");
  });
});
