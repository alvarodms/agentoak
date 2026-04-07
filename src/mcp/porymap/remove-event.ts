import type { WriteContext, ToolResult } from "./write-context.js";

export interface RemoveEventParams {
  name: string;
  event_type: "object_events" | "warp_events" | "coord_events" | "bg_events";
  index?: number;
  local_id?: string;
}

export interface RemoveEventData {
  map: string;
  status: "ok";
  event_type: string;
  removed_index: number;
  removed_event: Record<string, unknown>;
  remaining_count: number;
}

export async function removeEvent(
  ctx: WriteContext,
  { name, event_type, index, local_id }: RemoveEventParams,
): Promise<ToolResult<RemoveEventData>> {
  if (index === undefined && !local_id) {
    return {
      ok: false,
      error:
        "Provide either 'index' or 'local_id' to identify the event to remove.",
    };
  }

  if (!(await ctx.mapExists(name))) {
    return { ok: false, error: `Map not found: "${name}".` };
  }

  const mapData = await ctx.readMapJson(name);
  const events = mapData[event_type] as Record<string, unknown>[];

  let targetIndex: number;

  if (local_id) {
    const idField = event_type === "warp_events" ? "warp_id" : "local_id";
    targetIndex = events.findIndex((e) => e[idField] === local_id);
    if (targetIndex === -1) {
      return {
        ok: false,
        error: `No event with ${idField}="${local_id}" found in ${event_type} of map "${name}".`,
      };
    }
  } else {
    targetIndex = index!;
    if (targetIndex < 0 || targetIndex >= events.length) {
      return {
        ok: false,
        error: `Index ${targetIndex} out of bounds. Map "${name}" has ${events.length} ${event_type} (indices 0-${events.length - 1}).`,
      };
    }
  }

  const [removed] = events.splice(targetIndex, 1);
  await ctx.writeMapJson(name, mapData);

  return {
    ok: true,
    data: {
      map: name,
      status: "ok",
      event_type,
      removed_index: targetIndex,
      removed_event: removed,
      remaining_count: events.length,
    },
  };
}
