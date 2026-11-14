import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CHECKPOINTS, CHECKPOINT_NAMES, applyCheckpoint, type Checkpoint } from "./checkpoints.js";
import { LIMITS, type Scenario } from "./scenario.js";

const POKEEMERALD = path.resolve(__dirname, "../../pokeemerald");

const FAKE: Record<string, Checkpoint> = {
  dock: {
    flags: ["FLAG_A", "FLAG_B"],
    clearFlags: ["FLAG_HIDE_X"],
    vars: { VAR_STORY: 3, VAR_OTHER: 1 },
    map: "MAP_ROUTE109",
    x: 21,
    y: 23,
  },
};

describe("applyCheckpoint", () => {
  it("leaves a scenario without a checkpoint alone", () => {
    const s: Scenario = { map: "MAP_ROUTE104", x: 1, y: 2, flags: ["FLAG_A"] };
    expect(applyCheckpoint(s, FAKE)).toBe(s);
  });

  it("puts the checkpoint underneath and lets the test win", () => {
    const merged = applyCheckpoint(
      {
        checkpoint: "dock" as Scenario["checkpoint"],
        flags: ["FLAG_HIDE_X", "FLAG_C"],
        clearFlags: ["FLAG_B"],
        vars: { VAR_STORY: 5 },
        caught: ["SPECIES_LOTAD_HOENN"],
      },
      FAKE,
    );
    expect(merged).toEqual({
      map: "MAP_ROUTE109",
      x: 21,
      y: 23,
      flags: ["FLAG_A", "FLAG_HIDE_X", "FLAG_C"],
      clearFlags: ["FLAG_B"],
      vars: { VAR_STORY: 5, VAR_OTHER: 1 },
      caught: ["SPECIES_LOTAD_HOENN"],
    });
    expect(merged.checkpoint).toBeUndefined();
  });

  it("uses the test's tile when it gives map, x and y, and rejects a partial one", () => {
    const merged = applyCheckpoint({ checkpoint: "dock" as Scenario["checkpoint"], map: "MAP_SLATEPORT_CITY", x: 5, y: 6 }, FAKE);
    expect([merged.map, merged.x, merged.y]).toEqual(["MAP_SLATEPORT_CITY", 5, 6]);
    expect(() => applyCheckpoint({ checkpoint: "dock" as Scenario["checkpoint"], x: 5 }, FAKE)).toThrow(/all of map, x and y/);
  });

  it("refuses temp flags and vars, which every warp resets", () => {
    const temp = { bad: { ...FAKE.dock, flags: ["FLAG_TEMP_1"] } };
    expect(() => applyCheckpoint({ checkpoint: "bad" as Scenario["checkpoint"] }, temp)).toThrow(
      "checkpoint bad: temp key FLAG_TEMP_1 is reset on every warp",
    );
    const tempVar = { bad: { ...FAKE.dock, vars: { VAR_TEMP_0: 1 } } };
    expect(() => applyCheckpoint({ checkpoint: "bad" as Scenario["checkpoint"] }, tempVar)).toThrow(/temp key VAR_TEMP_0/);
    expect(() => applyCheckpoint({ checkpoint: "nowhere" as Scenario["checkpoint"] }, FAKE)).toThrow(/unknown checkpoint/);
  });
});

describe("CHECKPOINTS", () => {
  const flagsH = fs.readFileSync(path.join(POKEEMERALD, "include/constants/flags.h"), "utf8");
  const varsH = fs.readFileSync(path.join(POKEEMERALD, "include/constants/vars.h"), "utf8");
  const defined = (h: string, name: string) => new RegExp(`#define ${name}\\b`).test(h);

  it.each(CHECKPOINT_NAMES)("%s fits the scenario limits with room for 20 more flags", (name) => {
    const cp = CHECKPOINTS[name];
    expect(cp.flags.length + (cp.clearFlags ?? []).length + 20).toBeLessThanOrEqual(LIMITS.flags);
    expect(Object.keys(cp.vars).length).toBeLessThanOrEqual(LIMITS.vars);
    expect(new Set(cp.flags).size).toBe(cp.flags.length);
    expect(() => applyCheckpoint({ checkpoint: name })).not.toThrow();
  });

  it.each(CHECKPOINT_NAMES)("%s names only flags and vars defined in include/constants", (name) => {
    const cp = CHECKPOINTS[name];
    for (const flag of [...cp.flags, ...(cp.clearFlags ?? [])]) expect(defined(flagsH, flag), flag).toBe(true);
    for (const v of Object.keys(cp.vars)) expect(defined(varsH, v), v).toBe(true);
  });
});
