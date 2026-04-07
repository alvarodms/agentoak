import {
  coordsInBounds,
  isUniqueWarpId,
  formatErrors,
  type ValidationError,
} from "./validation.js";
import type { WriteContext, ToolResult } from "./write-context.js";

export interface AddWarpEventParams {
  name: string;
  x: number;
  y: number;
  elevation: number;
  dest_map: string;
  dest_warp_id: string;
  warp_id?: string;
}

export interface AddWarpEventData {
  map: string;
  status: "ok";
  event_type: "warp_events";
  index: number;
  event: Record<string, unknown>;
}

export async function addWarpEvent(
  ctx: WriteContext,
  { name, x, y, elevation, dest_map, dest_warp_id, warp_id }: AddWarpEventParams,
): Promise<ToolResult<AddWarpEventData>> {
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

  const destDir = await ctx.resolveMapConstant(dest_map);
  if (!destDir) {
    errors.push({
      field: "dest_map",
      message: `Destination map "${dest_map}" not found. Use a MAP_* constant that corresponds to an existing map.`,
    });
  }

  const mapData = await ctx.readMapJson(name);

  if (warp_id && !isUniqueWarpId(mapData, warp_id)) {
    errors.push({
      field: "warp_id",
      message: `"${warp_id}" already exists in this map's warp events`,
    });
  }

  if (errors.length > 0) {
    return { ok: false, error: `Validation failed:\n${formatErrors(errors)}` };
  }

  const event: Record<string, unknown> = {
    x,
    y,
    elevation,
    dest_map,
    dest_warp_id,
  };
  if (warp_id) {
    event.warp_id = warp_id;
  }

  mapData.warp_events.push(event);
  await ctx.writeMapJson(name, mapData);

  return {
    ok: true,
    data: {
      map: name,
      status: "ok",
      event_type: "warp_events",
      index: mapData.warp_events.length - 1,
      event: mapData.warp_events[mapData.warp_events.length - 1] as Record<
        string,
        unknown
      >,
    },
  };
}
