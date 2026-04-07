/**
 * Dependency-injection context for write tool handlers.
 *
 * Production code uses createWriteContext() which delegates to the real
 * filesystem-backed functions in validation.ts. Tests supply a mock context
 * backed by in-memory data.
 */

import {
  readMapJson,
  writeMapJson,
  mapExists,
  getLayoutForMap,
  resolveMapConstant,
  type MapJson,
} from "./validation.js";

export type { MapJson };

export interface WriteContext {
  mapExists(name: string): Promise<boolean>;
  readMapJson(name: string): Promise<MapJson>;
  writeMapJson(name: string, data: MapJson): Promise<void>;
  getLayoutForMap(
    name: string,
  ): Promise<{ width: number; height: number } | null>;
  resolveMapConstant(constant: string): Promise<string | null>;
}

export type ToolResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function createWriteContext(): WriteContext {
  return {
    mapExists,
    readMapJson,
    writeMapJson,
    getLayoutForMap,
    resolveMapConstant,
  };
}

// ─── Dry-run support ────────────────────────────────────────────────────────

export interface DryRunCapture {
  mapName: string;
  before: MapJson;
  after: MapJson;
}

/**
 * Wraps a WriteContext so that writeMapJson captures before/after snapshots
 * instead of writing to disk. Used by the server for dry_run mode.
 */
export function createDryRunContext(inner: WriteContext): {
  ctx: WriteContext;
  captures: DryRunCapture[];
} {
  const readCache = new Map<string, MapJson>();
  const captures: DryRunCapture[] = [];

  const ctx: WriteContext = {
    mapExists: inner.mapExists,
    readMapJson: async (name) => {
      const data = await inner.readMapJson(name);
      if (!readCache.has(name)) {
        readCache.set(name, structuredClone(data));
      }
      return data;
    },
    writeMapJson: async (name, data) => {
      captures.push({
        mapName: name,
        before: readCache.get(name) ?? structuredClone(data),
        after: structuredClone(data),
      });
    },
    getLayoutForMap: inner.getLayoutForMap,
    resolveMapConstant: inner.resolveMapConstant,
  };

  return { ctx, captures };
}
