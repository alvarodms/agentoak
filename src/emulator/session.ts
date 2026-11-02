/**
 * One running copy of the ROM under mgba-driver, with the build's symbols
 * and charmap attached, so callers can say "read gPlayerParty" or "what is
 * the game's main callback" instead of handling raw addresses.
 *
 * Emulated time only moves inside run()/press(), and the driver pins the
 * RTC, so the same calls on the same ROM always produce the same frames.
 */

import path from "node:path";
import { POKEEMERALD_DIR } from "../utils/paths.js";
import { decodeGameText, loadCharmap, type Charmap } from "./charmap.js";
import { MgbaDriver, driverBinary } from "./driver.js";
import { SymbolTable } from "./symbols.js";

export const BUTTONS = {
  A: 1 << 0,
  B: 1 << 1,
  SELECT: 1 << 2,
  START: 1 << 3,
  RIGHT: 1 << 4,
  LEFT: 1 << 5,
  UP: 1 << 6,
  DOWN: 1 << 7,
  R: 1 << 8,
  L: 1 << 9,
} as const;

export type Button = keyof typeof BUTTONS;

export function buttonMask(buttons: Button | readonly Button[]): number {
  const list = typeof buttons === "string" ? [buttons] : buttons;
  let mask = 0;
  for (const b of list) {
    if (!(b in BUTTONS)) throw new Error(`unknown button ${b}`);
    mask |= BUTTONS[b];
  }
  return mask;
}

/** The files a session needs from one build. */
export interface RomBuild {
  rom: string;
  elf: string;
  map: string;
  charmap: string;
}

/** The build outputs `make` leaves in pokeemerald/. */
export function defaultBuild(dir = POKEEMERALD_DIR): RomBuild {
  return {
    rom: path.join(dir, "pokeemerald.gba"),
    elf: path.join(dir, "pokeemerald.elf"),
    map: path.join(dir, "pokeemerald.map"),
    charmap: path.join(dir, "charmap.txt"),
  };
}

export interface StartOptions {
  /** Flash save to load (created if missing). Omit for a fresh, unsaved game. */
  save?: string;
  /** RTC start, ms since the epoch. Defaults to the driver's fixed date. */
  rtcEpochMs?: number;
  driverBinary?: string;
  /** Reuse an already-loaded table (nm on a 50 MB ELF takes a moment). */
  symbols?: SymbolTable;
}

export interface PressOptions {
  /** Frames to hold the buttons. Default 2. */
  hold?: number;
  /** Frames to wait after releasing. Default 8. */
  release?: number;
}

/** Longest text read in one go; gStringVar4 is 1000 bytes. */
const MAX_TEXT = 1000;

export class EmulatorSession {
  private constructor(
    private readonly driver: MgbaDriver,
    readonly symbols: SymbolTable,
    readonly charmap: Charmap,
    private frameCount: number,
  ) {}

  static async start(build: RomBuild = defaultBuild(), opts: StartOptions = {}): Promise<EmulatorSession> {
    const symbols = opts.symbols ?? SymbolTable.load(build.elf, build.map);
    const charmap = loadCharmap(build.charmap);
    const driver = await MgbaDriver.start(opts.driverBinary ?? driverBinary());
    try {
      if (opts.rtcEpochMs !== undefined) await driver.send("rtc", Math.trunc(opts.rtcEpochMs));
      await driver.send("load", build.rom, ...(opts.save ? [opts.save] : []));
    } catch (err) {
      await driver.close();
      throw err;
    }
    return new EmulatorSession(driver, symbols, charmap, 0);
  }

  /** Frames emulated since the last load or reset. */
  get frame(): number {
    return this.frameCount;
  }

  async reset(): Promise<void> {
    await this.driver.send("reset");
    this.frameCount = 0;
  }

  /** Runs `frames` frames with whatever keys are currently held. */
  async run(frames: number): Promise<void> {
    const reply = await this.driver.send("run", nonNegativeInt(frames, "frames"));
    this.frameCount = reply.frame as number;
  }

  /** Taps buttons: hold them for `hold` frames, release, then wait `release` frames. */
  async press(buttons: Button | readonly Button[], opts: PressOptions = {}): Promise<void> {
    const hold = nonNegativeInt(opts.hold ?? 2, "hold");
    const release = nonNegativeInt(opts.release ?? 8, "release");
    const reply = await this.driver.send("press", buttonMask(buttons), hold, release);
    this.frameCount = reply.frame as number;
  }

  /** Sets the held buttons until changed (an empty list releases everything). */
  async hold(buttons: Button | readonly Button[]): Promise<void> {
    await this.driver.send("keys", buttonMask(buttons));
  }

  /** Writes the current frame as a 240x160 PNG. */
  async screenshot(file: string): Promise<void> {
    await this.driver.send("screenshot", noSpaces(path.resolve(file)));
  }

  /** States are tied to the exact ROM that made them; reload fails across builds. */
  async saveState(file: string): Promise<void> {
    await this.driver.send("save_state", noSpaces(path.resolve(file)));
  }

  async loadState(file: string): Promise<void> {
    await this.driver.send("load_state", noSpaces(path.resolve(file)));
    this.frameCount = (await this.driver.send("info")).frame as number;
  }

  async read(address: number, length: number): Promise<Buffer> {
    const reply = await this.driver.send("read", hex(address), nonNegativeInt(length, "length"));
    return Buffer.from(reply.data as string, "hex");
  }

  async write(address: number, data: Uint8Array): Promise<void> {
    await this.driver.send("write", hex(address), Buffer.from(data).toString("hex"));
  }

  async readU8(address: number): Promise<number> {
    return (await this.read(address, 1)).readUInt8(0);
  }

  async readU16(address: number): Promise<number> {
    return (await this.read(address, 2)).readUInt16LE(0);
  }

  async readU32(address: number): Promise<number> {
    return (await this.read(address, 4)).readUInt32LE(0);
  }

  /** Reads a variable by name; `length` defaults to the symbol's size. */
  async readSymbol(name: string, length?: number): Promise<Buffer> {
    const sym = this.symbols.get(name);
    const len = length ?? sym.size;
    if (!len) throw new Error(`symbol ${name} has no size; pass a length`);
    return this.read(sym.address, len);
  }

  /** Follows a pointer variable such as gSaveBlock1Ptr. */
  async deref(name: string): Promise<number> {
    return this.readU32(this.symbols.address(name));
  }

  /** Decodes game text at an address or symbol (stops at EOS). */
  async readText(where: number | string, maxLength = MAX_TEXT): Promise<string> {
    const address = typeof where === "number" ? where : this.symbols.address(where);
    return decodeGameText(await this.read(address, maxLength), this.charmap);
  }

  /**
   * gMain's two callbacks, named. callback2 identifies the current screen:
   * "CB2_Overworld", "BattleMainCB2", "MainCB2 (src/title_screen.o)", ...
   */
  async callbacks(): Promise<{ callback1: string; callback2: string }> {
    const raw = await this.read(this.symbols.address("gMain"), 8);
    return {
      callback1: this.symbols.describe(raw.readUInt32LE(0)),
      callback2: this.symbols.describe(raw.readUInt32LE(4)),
    };
  }

  async close(): Promise<void> {
    await this.driver.close();
  }
}

function hex(n: number): string {
  return `0x${(n >>> 0).toString(16)}`;
}

function nonNegativeInt(n: number, what: string): number {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${what} must be a non-negative integer, got ${n}`);
  return n;
}

function noSpaces(file: string): string {
  if (/\s/.test(file)) throw new Error(`mgba-driver paths cannot contain whitespace: ${file}`);
  return file;
}
