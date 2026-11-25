import { describe, expect, it } from "vitest";
import { findSoundStart, sePlayerActive, type SePlayerSample } from "./sound.js";
import { messageBoxes, parsePlaytest } from "./playtest.js";

const SKETCH = 0x086f0000;
const OTHER = 0x086e0000;
const idle: SePlayerSample = { header: 0, status: 0 };
const playing = (header: number): SePlayerSample => ({ header, status: 0x3 });
const finished = (header: number): SePlayerSample => ({ header, status: 0x80000000 });

describe("sePlayerActive", () => {
  it("needs a track bit and no pause bit", () => {
    expect(sePlayerActive(idle)).toBe(false);
    expect(sePlayerActive(playing(SKETCH))).toBe(true);
    expect(sePlayerActive(finished(SKETCH))).toBe(false);
    expect(sePlayerActive({ header: SKETCH, status: 0x80000001 })).toBe(false);
  });
});

describe("findSoundStart", () => {
  it("sees the song appear on a player", () => {
    expect(findSoundStart([idle, idle, idle], [idle, playing(SKETCH), idle], SKETCH)).toBe(1);
  });

  it("ignores other songs", () => {
    expect(findSoundStart([idle, idle, idle], [playing(OTHER), idle, idle], SKETCH)).toBe(-1);
  });

  it("does not count a song that keeps playing", () => {
    expect(findSoundStart([playing(SKETCH), idle, idle], [playing(SKETCH), idle, idle], SKETCH)).toBe(-1);
  });

  it("does not count a song that only stopped", () => {
    expect(findSoundStart([playing(SKETCH), idle, idle], [finished(SKETCH), idle, idle], SKETCH)).toBe(-1);
  });

  it("counts the same song played again after it finished", () => {
    expect(findSoundStart([finished(SKETCH), idle, idle], [playing(SKETCH), idle, idle], SKETCH)).toBe(0);
  });

  it("counts a song that started and finished between two far-apart samples", () => {
    expect(findSoundStart([finished(OTHER), idle, idle], [finished(SKETCH), idle, idle], SKETCH)).toBe(0);
  });

  it("treats a missing earlier sample as a different song", () => {
    expect(findSoundStart([], [playing(SKETCH)], SKETCH)).toBe(0);
  });
});

describe("sound steps", () => {
  const scenario = { map: "MAP_ROUTE102", x: 1, y: 1 };
  it("parses expectSound and expectNoSound with their defaults left out", () => {
    const t = parsePlaytest({
      name: "s",
      checks: "x",
      scenario,
      steps: [{ expectSound: { song: "SE_M_SKETCH" } }, { expectNoSound: { song: "SE_M_SKETCH", frames: 60 } }],
    });
    expect(t.steps).toEqual([{ expectSound: { song: "SE_M_SKETCH" } }, { expectNoSound: { song: "SE_M_SKETCH", frames: 60 } }]);
  });

  it("rejects a song that is not a constant name", () => {
    expect(() => parsePlaytest({ name: "s", checks: "x", scenario, steps: [{ expectSound: { song: "sketch" } }] })).toThrow();
    expect(() => parsePlaytest({ name: "s", checks: "x", scenario, steps: [{ expectNoSound: { song: "SE_M_SKETCH", frames: 0 } }] })).toThrow();
  });

  it("keeps the sound marker out of message box counts", () => {
    expect(messageBoxes(["[sound: SE_M_SKETCH started at +31 frames on gMPlayInfo_SE1]"])).toEqual([]);
  });
});
