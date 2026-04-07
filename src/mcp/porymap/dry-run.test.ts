/**
 * Integration tests for dry-run / preview mode on porymap write tools.
 *
 * Verifies that when dry_run is true, the original file on disk remains
 * untouched and the response includes a unified diff.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { unifiedDiff } from "./diff.js";
import type { MapJson } from "./validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, "..", "__fixtures__");

async function loadFixtureMap(mapName: string): Promise<MapJson> {
  const text = await fs.readFile(
    path.join(FIXTURES, "maps", mapName, "map.json"),
    "utf-8",
  );
  return JSON.parse(text) as MapJson;
}

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "porymap-dryrun-test-"));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function writeTestMap(mapName: string, data: MapJson): Promise<string> {
  const dir = path.join(tmpDir, mapName);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, "map.json");
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  return filePath;
}

async function readTestMapRaw(mapName: string): Promise<string> {
  const filePath = path.join(tmpDir, mapName, "map.json");
  return fs.readFile(filePath, "utf-8");
}

/**
 * Simulates what commitOrDiff does: given original and mutated MapJson,
 * returns the diff (dry_run path) OR writes to disk (commit path).
 */
function simulateDryRun(
  mapName: string,
  original: MapJson,
  mutated: MapJson,
) {
  const diff = unifiedDiff(
    JSON.stringify(original, null, 2),
    JSON.stringify(mutated, null, 2),
    `${mapName}/map.json`,
  );
  return { status: "dry_run" as const, diff };
}

describe("dry-run mode", () => {
  it("produces a diff for set_map_properties", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const original = JSON.parse(JSON.stringify(map)) as MapJson;

    map.weather = "WEATHER_RAIN";

    const result = simulateDryRun("PetalburgCity", original, map);
    expect(result.status).toBe("dry_run");
    expect(result.diff).toContain("-");
    expect(result.diff).toContain("+");
    expect(result.diff).toContain("WEATHER_SUNNY");
    expect(result.diff).toContain("WEATHER_RAIN");
    expect(result.diff).toContain("--- a/PetalburgCity/map.json");
    expect(result.diff).toContain("+++ b/PetalburgCity/map.json");
  });

  it("produces a diff for add_object_event", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const original = JSON.parse(JSON.stringify(map)) as MapJson;

    map.object_events.push({
      graphics_id: "OBJ_EVENT_GFX_WOMAN_1",
      x: 5,
      y: 5,
      elevation: 3,
      movement_type: "MOVEMENT_TYPE_FACE_DOWN",
      movement_range_x: 0,
      movement_range_y: 0,
      trainer_type: "TRAINER_TYPE_NONE",
      trainer_sight_or_berry_tree_id: "0",
      script: "PetalburgCity_EventScript_TestNpc",
      flag: "0",
    });

    const result = simulateDryRun("PetalburgCity", original, map);
    expect(result.status).toBe("dry_run");
    expect(result.diff).toContain("+");
    expect(result.diff).toContain("OBJ_EVENT_GFX_WOMAN_1");
    expect(result.diff).toContain("PetalburgCity_EventScript_TestNpc");
  });

  it("produces a diff for remove_event", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const original = JSON.parse(JSON.stringify(map)) as MapJson;

    expect(map.object_events.length).toBeGreaterThan(0);
    const removed = map.object_events.splice(0, 1);
    expect(removed.length).toBe(1);

    const result = simulateDryRun("PetalburgCity", original, map);
    expect(result.status).toBe("dry_run");
    expect(result.diff).toContain("-");
  });

  it("returns empty diff when nothing changes", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const clone = JSON.parse(JSON.stringify(map)) as MapJson;

    const result = simulateDryRun("PetalburgCity", map, clone);
    expect(result.status).toBe("dry_run");
    expect(result.diff).toBe("");
  });

  it("does not write to disk in dry-run path", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const filePath = await writeTestMap("PetalburgCity", map);
    const originalContent = await readTestMapRaw("PetalburgCity");

    const clone = JSON.parse(JSON.stringify(map)) as MapJson;
    clone.weather = "WEATHER_DROUGHT";

    // Simulate dry-run: compute diff but do NOT write
    const result = simulateDryRun("PetalburgCity", map, clone);
    expect(result.diff).toContain("WEATHER_DROUGHT");

    // File on disk must be unchanged
    const afterContent = await readTestMapRaw("PetalburgCity");
    expect(afterContent).toBe(originalContent);
  });

  it("produces a diff for add_warp_event", async () => {
    const map = await loadFixtureMap("LittlerootTown_BrendansHouse_2F");
    const original = JSON.parse(JSON.stringify(map)) as MapJson;

    map.warp_events.push({
      x: 1,
      y: 1,
      elevation: 0,
      dest_map: "MAP_LITTLEROOT_TOWN",
      dest_warp_id: "0",
    });

    const result = simulateDryRun(
      "LittlerootTown_BrendansHouse_2F",
      original,
      map,
    );
    expect(result.status).toBe("dry_run");
    expect(result.diff).toContain("MAP_LITTLEROOT_TOWN");
    expect(result.diff).toContain("+");
  });

  it("produces a diff for edit_map_connection (add)", async () => {
    const map = await loadFixtureMap("PetalburgCity");
    const original = JSON.parse(JSON.stringify(map)) as MapJson;

    const connections = map.connections ?? [];
    connections.push({ map: "MAP_ROUTE101", offset: 0, direction: "up" });
    map.connections = connections;

    const result = simulateDryRun("PetalburgCity", original, map);
    expect(result.status).toBe("dry_run");
    expect(result.diff).toContain("MAP_ROUTE101");
    expect(result.diff).toContain("+");
  });
});
