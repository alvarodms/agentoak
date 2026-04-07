import { describe, it, expect } from "vitest";
import { addBgEvent } from "./add-bg-event.js";
import { createTestContext, makeMapJson } from "./test-helpers.js";

function setup(overrides: Parameters<typeof makeMapJson>[0] = {}) {
  return createTestContext(
    { TestMap: makeMapJson(overrides) },
    { TestMap: { width: 20, height: 20 } },
  );
}

describe("addBgEvent", () => {
  it("appends a sign event", async () => {
    const { ctx, store } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "sign",
      x: 5,
      y: 10,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_NORTH",
      script: "TestMap_EventScript_Sign",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.event.type).toBe("sign");
    expect(result.data.event.script).toBe("TestMap_EventScript_Sign");
    expect(store.written.TestMap.bg_events).toHaveLength(1);
  });

  it("appends a hidden_item event with flag stored as 'flag'", async () => {
    const { ctx, store } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "hidden_item",
      x: 5,
      y: 8,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
      item: "ITEM_POTION",
      hidden_item_flag: "FLAG_HIDDEN_ITEM_TEST",
    });
    expect(result.ok).toBe(true);
    const event = store.written.TestMap.bg_events[0] as Record<
      string,
      unknown
    >;
    expect(event.item).toBe("ITEM_POTION");
    expect(event.flag).toBe("FLAG_HIDDEN_ITEM_TEST");
  });

  it("appends a secret_base event", async () => {
    const { ctx, store } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "secret_base",
      x: 10,
      y: 5,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
      secret_base_id: "SECRET_BASE_TEST_1",
    });
    expect(result.ok).toBe(true);
    const event = store.written.TestMap.bg_events[0] as Record<
      string,
      unknown
    >;
    expect(event.secret_base_id).toBe("SECRET_BASE_TEST_1");
  });

  it("rejects sign without script", async () => {
    const { ctx } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "sign",
      x: 5,
      y: 10,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Script is required");
  });

  it("rejects hidden_item without item", async () => {
    const { ctx } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "hidden_item",
      x: 5,
      y: 10,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
      hidden_item_flag: "FLAG_TEST",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Item constant is required");
  });

  it("rejects hidden_item without flag", async () => {
    const { ctx } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "hidden_item",
      x: 5,
      y: 10,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
      item: "ITEM_POTION",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Flag is required");
  });

  it("rejects secret_base without id", async () => {
    const { ctx } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "secret_base",
      x: 5,
      y: 10,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Secret base ID is required");
  });

  it("rejects out-of-bounds coords", async () => {
    const { ctx } = setup();
    const result = await addBgEvent(ctx, {
      name: "TestMap",
      type: "sign",
      x: 25,
      y: 10,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
      script: "TestScript",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("out of bounds");
  });

  it("rejects nonexistent map", async () => {
    const { ctx } = setup();
    const result = await addBgEvent(ctx, {
      name: "FakeMap",
      type: "sign",
      x: 5,
      y: 10,
      elevation: 0,
      player_facing_dir: "BG_EVENT_PLAYER_FACING_ANY",
      script: "TestScript",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("Map not found");
  });
});
