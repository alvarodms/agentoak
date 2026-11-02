/**
 * End-to-end check of the emulator stack against the real ROM. It needs a
 * built pokeemerald.gba/.elf/.map and an mgba-driver binary (on PATH in the
 * runner image, or MGBA_DRIVER=/path/to/mgba-driver), and skips otherwise.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { driverBinary } from "./driver.js";
import { EmulatorSession, buttonMask, defaultBuild } from "./session.js";
import { SymbolTable } from "./symbols.js";

function driverAvailable(): boolean {
  try {
    execFileSync(driverBinary(), [], { input: "quit\n", stdio: ["pipe", "ignore", "ignore"], timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

const build = defaultBuild();
const haveBuild = [build.rom, build.elf, build.map].every((f) => fs.existsSync(f));
const runnable = haveBuild && driverAvailable();

describe("buttonMask", () => {
  it("ORs the GBA key bits", () => {
    expect(buttonMask("A")).toBe(1);
    expect(buttonMask(["START", "DOWN", "L"])).toBe(8 | 128 | 512);
    expect(() => buttonMask(["Z" as never])).toThrow(/unknown button/);
  });
});

describe.skipIf(!runnable)("EmulatorSession on the built ROM", () => {
  let symbols: SymbolTable;
  let tmp: string;

  beforeAll(() => {
    symbols = SymbolTable.load(build.elf, build.map);
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "oak-emu-"));
  });
  afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

  /** Boots, skips the intro with START, and returns on the title screen. */
  async function toTitle(): Promise<EmulatorSession> {
    const session = await EmulatorSession.start(build, { symbols });
    await session.run(1200);
    await session.press("START", { hold: 2, release: 120 });
    return session;
  }

  it("reaches the title screen and names the callback", async () => {
    const session = await toTitle();
    try {
      const { callback1, callback2 } = await session.callbacks();
      expect(callback1).toBe("NULL");
      expect(callback2).toBe("MainCB2 (src/title_screen.o)");
      expect(session.frame).toBe(1322);
    } finally {
      await session.close();
    }
  }, 60_000);

  it("decodes text from the ROM by symbol", async () => {
    const session = await EmulatorSession.start(build, { symbols });
    try {
      expect(await session.readText("gText_Yes")).toBe("YES");
      expect(await session.readText("gText_UsedVar2WildLured")).toBe(
        "{PLAYER} used the\n{STR_VAR_2}.\n\nWild POKéMON will be lured.",
      );
    } finally {
      await session.close();
    }
  }, 60_000);

  it("is deterministic across runs and across a savestate round trip", async () => {
    const a = path.join(tmp, "a.png");
    const b = path.join(tmp, "b.png");
    const c = path.join(tmp, "c.png");
    const state = path.join(tmp, "title.ss0");

    const first = await toTitle();
    try {
      await first.saveState(state);
      await first.run(600);
      await first.screenshot(a);
      await first.loadState(state);
      expect(first.frame).toBe(1322);
      await first.run(600);
      await first.screenshot(b);
    } finally {
      await first.close();
    }

    const second = await toTitle();
    try {
      await second.run(600);
      await second.screenshot(c);
    } finally {
      await second.close();
    }

    const png = fs.readFileSync(a);
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(fs.readFileSync(b).equals(png)).toBe(true);
    expect(fs.readFileSync(c).equals(png)).toBe(true);
  }, 120_000);
});
