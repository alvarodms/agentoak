import {
  coordsInBounds,
  formatErrors,
  type ValidationError,
} from "./validation.js";
import type { WriteContext, ToolResult } from "./write-context.js";

export interface AddBgEventParams {
  name: string;
  type: "sign" | "hidden_item" | "secret_base";
  x: number;
  y: number;
  elevation: number;
  player_facing_dir: string;
  script?: string;
  item?: string;
  hidden_item_flag?: string;
  secret_base_id?: string;
}

export interface AddBgEventData {
  map: string;
  status: "ok";
  event_type: "bg_events";
  index: number;
  event: Record<string, unknown>;
}

export async function addBgEvent(
  ctx: WriteContext,
  {
    name,
    type,
    x,
    y,
    elevation,
    player_facing_dir,
    script,
    item,
    hidden_item_flag,
    secret_base_id,
  }: AddBgEventParams,
): Promise<ToolResult<AddBgEventData>> {
  if (!(await ctx.mapExists(name))) {
    return { ok: false, error: `Map not found: "${name}".` };
  }

  const dims = await ctx.getLayoutForMap(name);
  if (!dims) {
    return {
      ok: false,
      error: `Could not resolve layout dimensions for map "${name}".`,
    };
  }

  const errors: ValidationError[] = [];

  if (!coordsInBounds(x, y, dims.width, dims.height)) {
    errors.push({
      field: "x/y",
      message: `Coordinates (${x}, ${y}) out of bounds for ${dims.width}x${dims.height} map`,
    });
  }

  if (type === "sign" && (!script || script.trim() === "")) {
    errors.push({
      field: "script",
      message: "Script is required for sign events",
    });
  }
  if (type === "hidden_item" && !item) {
    errors.push({
      field: "item",
      message: "Item constant is required for hidden_item events",
    });
  }
  if (type === "hidden_item" && !hidden_item_flag) {
    errors.push({
      field: "hidden_item_flag",
      message: "Flag is required for hidden_item events",
    });
  }
  if (type === "secret_base" && !secret_base_id) {
    errors.push({
      field: "secret_base_id",
      message: "Secret base ID is required for secret_base events",
    });
  }

  if (errors.length > 0) {
    return { ok: false, error: `Validation failed:\n${formatErrors(errors)}` };
  }

  const mapData = await ctx.readMapJson(name);

  let event: Record<string, unknown>;
  if (type === "sign") {
    event = { type, x, y, elevation, player_facing_dir, script };
  } else if (type === "hidden_item") {
    event = { type, x, y, elevation, item: item!, flag: hidden_item_flag! };
  } else {
    event = { type, x, y, elevation, secret_base_id: secret_base_id! };
  }

  mapData.bg_events.push(event);
  await ctx.writeMapJson(name, mapData);

  return {
    ok: true,
    data: {
      map: name,
      status: "ok",
      event_type: "bg_events",
      index: mapData.bg_events.length - 1,
      event: mapData.bg_events[mapData.bg_events.length - 1] as Record<
        string,
        unknown
      >,
    },
  };
}
