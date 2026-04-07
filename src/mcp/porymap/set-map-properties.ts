import {
  EDITABLE_PROPERTIES,
  BOOLEAN_PROPERTIES,
  VALID_WEATHER,
  VALID_MAP_TYPES,
  VALID_BATTLE_SCENES,
  formatErrors,
  type ValidationError,
} from "./validation.js";
import type { WriteContext, ToolResult } from "./write-context.js";

export interface SetMapPropertiesParams {
  name: string;
  properties: Record<string, string | boolean>;
}

export interface SetMapPropertiesData {
  map: string;
  status: "ok";
  changed: Record<string, { from: unknown; to: unknown }>;
}

export async function setMapProperties(
  ctx: WriteContext,
  { name, properties }: SetMapPropertiesParams,
): Promise<ToolResult<SetMapPropertiesData>> {
  if (!(await ctx.mapExists(name))) {
    return {
      ok: false,
      error: `Map not found: "${name}". Use list_maps to see available maps.`,
    };
  }

  const errors: ValidationError[] = [];

  for (const key of Object.keys(properties)) {
    if (!EDITABLE_PROPERTIES.has(key)) {
      errors.push({
        field: key,
        message: `Not an editable property. Valid: ${[...EDITABLE_PROPERTIES].join(", ")}`,
      });
    }
  }

  if (
    properties.weather &&
    typeof properties.weather === "string" &&
    !VALID_WEATHER.has(properties.weather)
  ) {
    errors.push({
      field: "weather",
      message: `Unknown weather constant "${properties.weather}". Known: ${[...VALID_WEATHER].join(", ")}`,
    });
  }
  if (
    properties.map_type &&
    typeof properties.map_type === "string" &&
    !VALID_MAP_TYPES.has(properties.map_type)
  ) {
    errors.push({
      field: "map_type",
      message: `Unknown map type "${properties.map_type}". Known: ${[...VALID_MAP_TYPES].join(", ")}`,
    });
  }
  if (
    properties.battle_scene &&
    typeof properties.battle_scene === "string" &&
    !VALID_BATTLE_SCENES.has(properties.battle_scene)
  ) {
    errors.push({
      field: "battle_scene",
      message: `Unknown battle scene "${properties.battle_scene}". Known: ${[...VALID_BATTLE_SCENES].join(", ")}`,
    });
  }

  for (const key of Object.keys(properties)) {
    if (BOOLEAN_PROPERTIES.has(key) && typeof properties[key] !== "boolean") {
      errors.push({
        field: key,
        message: `Expected boolean, got ${typeof properties[key]}`,
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, error: `Validation failed:\n${formatErrors(errors)}` };
  }

  const mapData = await ctx.readMapJson(name);
  const changed: Record<string, { from: unknown; to: unknown }> = {};

  for (const [key, value] of Object.entries(properties)) {
    const oldValue = (mapData as unknown as Record<string, unknown>)[key];
    (mapData as unknown as Record<string, unknown>)[key] = value;
    changed[key] = { from: oldValue, to: value };
  }

  await ctx.writeMapJson(name, mapData);
  return { ok: true, data: { map: name, status: "ok", changed } };
}
