import { formatErrors, type ValidationError } from "./validation.js";
import type { WriteContext, ToolResult } from "./write-context.js";

export interface EditMapConnectionParams {
  name: string;
  action: "add" | "remove" | "update";
  direction: "up" | "down" | "left" | "right";
  target_map?: string;
  offset?: number;
}

export async function editMapConnection(
  ctx: WriteContext,
  { name, action, direction, target_map, offset }: EditMapConnectionParams,
): Promise<ToolResult<Record<string, unknown>>> {
  if (!(await ctx.mapExists(name))) {
    return { ok: false, error: `Map not found: "${name}".` };
  }

  const mapData = await ctx.readMapJson(name);
  const connections = mapData.connections ?? [];
  const existingIdx = connections.findIndex((c) => c.direction === direction);

  const errors: ValidationError[] = [];

  if (action === "add") {
    if (existingIdx !== -1) {
      errors.push({
        field: "direction",
        message: `Connection in direction "${direction}" already exists. Use action="update" to modify it.`,
      });
    }
    if (!target_map) {
      errors.push({
        field: "target_map",
        message: "target_map is required for add action",
      });
    }
  }

  if (action === "update") {
    if (existingIdx === -1) {
      errors.push({
        field: "direction",
        message: `No existing connection in direction "${direction}". Use action="add" to create one.`,
      });
    }
    if (!target_map) {
      errors.push({
        field: "target_map",
        message: "target_map is required for update action",
      });
    }
  }

  if (action === "remove") {
    if (existingIdx === -1) {
      errors.push({
        field: "direction",
        message: `No connection in direction "${direction}" to remove.`,
      });
    }
  }

  if (target_map) {
    const destDir = await ctx.resolveMapConstant(target_map);
    if (!destDir) {
      errors.push({
        field: "target_map",
        message: `Target map "${target_map}" not found.`,
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, error: `Validation failed:\n${formatErrors(errors)}` };
  }

  let result: Record<string, unknown>;

  if (action === "add") {
    const conn = { map: target_map!, offset: offset ?? 0, direction };
    connections.push(conn);
    mapData.connections = connections;
    result = { action: "added", connection: conn };
  } else if (action === "update") {
    const old = { ...connections[existingIdx] };
    connections[existingIdx] = {
      map: target_map!,
      offset: offset ?? connections[existingIdx].offset,
      direction,
    };
    mapData.connections = connections;
    result = {
      action: "updated",
      old_connection: old,
      new_connection: connections[existingIdx],
    };
  } else {
    const [removed] = connections.splice(existingIdx, 1);
    mapData.connections = connections;
    result = { action: "removed", removed_connection: removed };
  }

  await ctx.writeMapJson(name, mapData);

  return {
    ok: true,
    data: {
      map: name,
      status: "ok",
      ...result,
      total_connections: mapData.connections.length,
    },
  };
}
