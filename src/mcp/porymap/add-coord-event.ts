import {
  coordsInBounds,
  VALID_WEATHER,
  formatErrors,
  type ValidationError,
} from "./validation.js";
import type { WriteContext, ToolResult } from "./write-context.js";

export interface AddCoordEventParams {
  name: string;
  type: "trigger" | "weather";
  x: number;
  y: number;
  elevation: number;
  var?: string;
  var_value?: string;
  script?: string;
  weather?: string;
}

export interface AddCoordEventData {
  map: string;
  status: "ok";
  event_type: "coord_events";
  index: number;
  event: Record<string, unknown>;
}

export async function addCoordEvent(
  ctx: WriteContext,
  {
    name,
    type,
    x,
    y,
    elevation,
    var: varName,
    var_value,
    script,
    weather,
  }: AddCoordEventParams,
): Promise<ToolResult<AddCoordEventData>> {
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

  if (type === "trigger") {
    if (!varName)
      errors.push({
        field: "var",
        message: "Variable constant is required for trigger events",
      });
    if (!var_value)
      errors.push({
        field: "var_value",
        message: "Variable value is required for trigger events",
      });
    if (!script || script.trim() === "")
      errors.push({
        field: "script",
        message: "Script is required for trigger events",
      });
  }

  if (type === "weather") {
    if (!weather) {
      errors.push({
        field: "weather",
        message: "Weather constant is required for weather events",
      });
    } else if (!VALID_WEATHER.has(weather)) {
      errors.push({
        field: "weather",
        message: `Unknown weather "${weather}". Known: ${[...VALID_WEATHER].join(", ")}`,
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, error: `Validation failed:\n${formatErrors(errors)}` };
  }

  const mapData = await ctx.readMapJson(name);

  let event: Record<string, unknown>;
  if (type === "trigger") {
    event = { type, x, y, elevation, var: varName, var_value, script };
  } else {
    event = { type, x, y, elevation, weather };
  }

  mapData.coord_events.push(event);
  await ctx.writeMapJson(name, mapData);

  return {
    ok: true,
    data: {
      map: name,
      status: "ok",
      event_type: "coord_events",
      index: mapData.coord_events.length - 1,
      event: mapData.coord_events[mapData.coord_events.length - 1] as Record<
        string,
        unknown
      >,
    },
  };
}
