import {
  coordsInBounds,
  isUniqueLocalId,
  formatErrors,
  type ValidationError,
} from "./validation.js";
import type { WriteContext, ToolResult } from "./write-context.js";

export interface AddObjectEventParams {
  name: string;
  graphics_id: string;
  x: number;
  y: number;
  elevation: number;
  movement_type: string;
  movement_range_x: number;
  movement_range_y: number;
  trainer_type: string;
  trainer_sight_or_berry_tree_id: string;
  script: string;
  flag: string;
  local_id?: string;
}

export interface AddObjectEventData {
  map: string;
  status: "ok";
  event_type: "object_events";
  index: number;
  event: Record<string, unknown>;
}

export async function addObjectEvent(
  ctx: WriteContext,
  {
    name,
    graphics_id,
    x,
    y,
    elevation,
    movement_type,
    movement_range_x,
    movement_range_y,
    trainer_type,
    trainer_sight_or_berry_tree_id,
    script,
    flag,
    local_id,
  }: AddObjectEventParams,
): Promise<ToolResult<AddObjectEventData>> {
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

  if (!script || script.trim() === "") {
    errors.push({
      field: "script",
      message: "Script must be non-empty (use '0x0' for no script)",
    });
  }

  const mapData = await ctx.readMapJson(name);

  if (local_id && !isUniqueLocalId(mapData, local_id)) {
    errors.push({
      field: "local_id",
      message: `"${local_id}" already exists in this map's object events`,
    });
  }

  if (errors.length > 0) {
    return { ok: false, error: `Validation failed:\n${formatErrors(errors)}` };
  }

  const event: Record<string, unknown> = {
    graphics_id,
    x,
    y,
    elevation,
    movement_type,
    movement_range_x,
    movement_range_y,
    trainer_type,
    trainer_sight_or_berry_tree_id,
    script,
    flag,
  };

  if (local_id) {
    // local_id goes first to match pokeemerald convention
    const ordered: Record<string, unknown> = { local_id };
    for (const [k, v] of Object.entries(event)) {
      ordered[k] = v;
    }
    mapData.object_events.push(ordered);
  } else {
    mapData.object_events.push(event);
  }

  await ctx.writeMapJson(name, mapData);

  const added = mapData.object_events[mapData.object_events.length - 1] as Record<string, unknown>;
  return {
    ok: true,
    data: {
      map: name,
      status: "ok",
      event_type: "object_events",
      index: mapData.object_events.length - 1,
      event: added,
    },
  };
}
