/**
 * One running copy of the ROM under mgba-driver, with the build's symbols
 * and charmap attached, so callers can say "read gPlayerParty" or "what is
 * the game's main callback" instead of handling raw addresses.
 *
 * Emulated time only moves inside run()/press(), and the driver pins the
 * RTC, so the same calls on the same ROM always produce the same frames.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { POKEEMERALD_DIR } from "../utils/paths.js";
import { decodeGameText, loadCharmap, type Charmap } from "./charmap.js";
import { ConstantNames, resolveConstants } from "./constants.js";
import { MgbaDriver, driverBinary } from "./driver.js";
import { LAYOUT_VERSION, resolveScenario, writeScenarioRom, type Scenario } from "./scenario.js";
import {
  LAYOUT_COUNT,
  MAP_OFFSET,
  OBJECT_EVENT_ACTIVE,
  OBJECT_EVENT_FACING_OFFSET,
  OBJECT_EVENT_INVISIBLE,
  SCRIPT_CONTEXT_SHUTDOWN,
  decodeBattleMon,
  decodePartyMon,
  facingName,
  parseLayout,
  type Facing,
  type Layout,
  type PartyMon,
} from "./state.js";
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

export interface BootScenarioOptions extends StartOptions {
  /** Give up if the overworld has not appeared after this many frames. Default 1800. */
  maxFrames?: number;
  /** Frames to let the map fade in once the overworld is running. Default 60. */
  settleFrames?: number;
}

export interface PartyMember extends PartyMon {
  speciesName: string;
}

export interface MapObject {
  localId: number;
  graphicsId: number;
  x: number;
  y: number;
  facing: Facing;
  visible: boolean;
}

export interface GameState {
  frame: number;
  /** gMain.callback2, named: "CB2_Overworld", "BattleMainCB2", ... */
  screen: string;
  map: string;
  /** Player tile in map coordinates (what porymap shows). */
  x: number;
  y: number;
  facing: Facing;
  party: PartyMember[];
  /** Battlers in gBattleMons order, while a battle is running. */
  battle: PartyMember[] | null;
}

/** Longest text read in one go; gStringVar4 is 1000 bytes. */
const MAX_TEXT = 1000;

export class EmulatorSession {
  private layout: Layout | undefined;
  private names: ConstantNames | undefined;
  /** Temp dirs (patched ROMs) removed on close. */
  private readonly cleanup: string[] = [];

  private constructor(
    private readonly driver: MgbaDriver,
    readonly symbols: SymbolTable,
    readonly charmap: Charmap,
    private frameCount: number,
    /** pokeemerald/ checkout the ROM was built from, for constant lookups. */
    private readonly sourceDir: string,
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
    return new EmulatorSession(driver, symbols, charmap, 0, path.dirname(build.charmap));
  }

  /**
   * Boots a copy of the ROM with `scenario` patched in and returns once the
   * player is standing on the scenario's tile with the map faded in.
   */
  static async bootScenario(
    scenario: Scenario,
    build: RomBuild = defaultBuild(),
    opts: BootScenarioOptions = {},
  ): Promise<EmulatorSession> {
    const symbols = opts.symbols ?? SymbolTable.load(build.elf, build.map);
    const encoded = resolveScenario(scenario, loadCharmap(build.charmap), {
      pokeemeraldDir: path.dirname(build.charmap),
    });
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "oak-scenario-"));
    const rom = path.join(tmp, "scenario.gba");
    let session: EmulatorSession | undefined;
    try {
      writeScenarioRom(build.rom, rom, encoded, symbols);
      session = await EmulatorSession.start({ ...build, rom }, { ...opts, symbols });
      session.cleanup.push(tmp);
      await session.runUntilScreen("CB2_Overworld", opts.maxFrames ?? 1800);
      await session.run(opts.settleFrames ?? 60);
      return session;
    } catch (err) {
      if (session) await session.close();
      else fs.rmSync(tmp, { recursive: true, force: true });
      throw err;
    }
  }

  /** Runs until gMain.callback2 is `screen`, checking every 10 frames. */
  async runUntilScreen(screen: string, maxFrames: number): Promise<void> {
    const deadline = this.frameCount + maxFrames;
    for (;;) {
      const { callback2 } = await this.callbacks();
      if (callback2 === screen) return;
      if (this.frameCount >= deadline) {
        throw new Error(`screen ${screen} not reached within ${maxFrames} frames (still on ${callback2})`);
      }
      await this.run(10);
    }
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

  /** Where the player is, who is in the party, and what is on screen. */
  async readState(): Promise<GameState> {
    const layout = await this.getLayout();
    const names = this.getNames();
    const { callback2 } = await this.callbacks();

    const sb1 = await this.deref("gSaveBlock1Ptr");
    const location = await this.read(sb1 + layout.saveBlock1Location, 2);
    const map = names.mapName(location.readInt8(0), location.readInt8(1));

    const playerObjectId = await this.readU8(this.symbols.address("gPlayerAvatar") + layout.playerAvatarObjectEventId);
    const player = await this.read(
      this.symbols.address("gObjectEvents") + playerObjectId * layout.objectEventSize,
      layout.objectEventSize,
    );
    const x = player.readInt16LE(layout.objectEventCoords) - MAP_OFFSET;
    const y = player.readInt16LE(layout.objectEventCoords + 2) - MAP_OFFSET;
    const facing = facingName(player.readUInt8(OBJECT_EVENT_FACING_OFFSET) & 0xf);

    const named = (mon: PartyMon): PartyMember => ({ ...mon, speciesName: names.speciesName(mon.species) });
    const partyCount = Math.min(await this.readU8(this.symbols.address("gPlayerPartyCount")), 6);
    const partyRaw = await this.read(this.symbols.address("gPlayerParty"), partyCount * layout.pokemonSize);
    const party: PartyMember[] = [];
    for (let i = 0; i < partyCount; i++) {
      const raw = partyRaw.subarray(i * layout.pokemonSize, (i + 1) * layout.pokemonSize);
      party.push(named(decodePartyMon(raw, layout)));
    }

    let battle: PartyMember[] | null = null;
    if (callback2 === "BattleMainCB2") {
      const count = Math.min(await this.readU8(this.symbols.address("gBattlersCount")), 4);
      const raw = await this.read(this.symbols.address("gBattleMons"), count * layout.battlePokemonSize);
      battle = [];
      for (let i = 0; i < count; i++) {
        battle.push(named(decodeBattleMon(raw.subarray(i * layout.battlePokemonSize), layout)));
      }
    }

    return { frame: this.frameCount, screen: callback2, map, x, y, facing, party, battle };
  }

  /**
   * Object events loaded for the current map (NPCs, item balls, dolls),
   * excluding the player. Objects hidden by their flag are not loaded at all.
   */
  async objects(): Promise<MapObject[]> {
    const layout = await this.getLayout();
    const sb1 = await this.deref("gSaveBlock1Ptr");
    const location = await this.read(sb1 + layout.saveBlock1Location, 2);
    const playerObjectId = await this.readU8(this.symbols.address("gPlayerAvatar") + layout.playerAvatarObjectEventId);
    const raw = await this.read(this.symbols.address("gObjectEvents"), layout.objectEventsCount * layout.objectEventSize);
    const out: MapObject[] = [];
    for (let i = 0; i < layout.objectEventsCount; i++) {
      if (i === playerObjectId) continue;
      const obj = raw.subarray(i * layout.objectEventSize, (i + 1) * layout.objectEventSize);
      if (!(obj[OBJECT_EVENT_ACTIVE.byte] & OBJECT_EVENT_ACTIVE.mask)) continue;
      if (obj[layout.objectEventMapGroup] !== location[0] || obj[layout.objectEventMapNum] !== location[1]) continue;
      out.push({
        localId: obj[layout.objectEventLocalId],
        graphicsId: obj[layout.objectEventGraphicsId],
        x: obj.readInt16LE(layout.objectEventCoords) - MAP_OFFSET,
        y: obj.readInt16LE(layout.objectEventCoords + 2) - MAP_OFFSET,
        facing: facingName(obj[OBJECT_EVENT_FACING_OFFSET] & 0xf),
        visible: !(obj[OBJECT_EVENT_INVISIBLE.byte] & OBJECT_EVENT_INVISIBLE.mask),
      });
    }
    return out;
  }

  /** One object by local id (a number or a LOCALID_* name), or null if it is not loaded. */
  async object(localId: number | string): Promise<MapObject | null> {
    const id = typeof localId === "number" ? localId : this.constant(localId);
    return (await this.objects()).find((o) => o.localId === id) ?? null;
  }

  /** True when no field script is running and the player has control. */
  async scriptIdle(): Promise<boolean> {
    const status = await this.readU8(this.symbols.address("sGlobalScriptContextStatus"));
    const locked = await this.readU8(this.symbols.address("sLockFieldControls"));
    return status === SCRIPT_CONTEXT_SHUTDOWN && locked === 0;
  }

  /** Reads a FLAG_* from the save block (not the special/temporary 0x4000+ range). */
  async flag(name: string): Promise<boolean> {
    const layout = await this.getLayout();
    const id = this.constant(name);
    if (id >= layout.flagsCount) throw new Error(`${name} (0x${id.toString(16)}) is not a saved flag`);
    const sb1 = await this.deref("gSaveBlock1Ptr");
    const byte = await this.readU8(sb1 + layout.saveBlock1Flags + (id >> 3));
    return ((byte >> (id & 7)) & 1) === 1;
  }

  /** Reads a VAR_* from the save block (not the special 0x8000+ vars). */
  async getVar(name: string): Promise<number> {
    const layout = await this.getLayout();
    const id = this.constant(name);
    if (id < layout.varsStart || id >= layout.varsStart + layout.varsCount) {
      throw new Error(`${name} (0x${id.toString(16)}) is not a saved var`);
    }
    const sb1 = await this.deref("gSaveBlock1Ptr");
    return this.readU16(sb1 + layout.saveBlock1Vars + (id - layout.varsStart) * 2);
  }

  async close(): Promise<void> {
    try {
      await this.driver.close();
    } finally {
      for (const dir of this.cleanup.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  /** Resolves a pokeemerald constant name (ITEM_*, FLAG_*, ...) against the ROM's headers. */
  constant(name: string): number {
    const value = resolveConstants([name], { pokeemeraldDir: this.sourceDir }).get(name);
    if (value === undefined) throw new Error(`could not resolve ${name}`);
    return value;
  }

  private async getLayout(): Promise<Layout> {
    if (!this.layout) {
      this.layout = parseLayout(await this.readSymbol("gPlaytestLayout", LAYOUT_COUNT * 2), LAYOUT_VERSION);
    }
    return this.layout;
  }

  private getNames(): ConstantNames {
    this.names ??= ConstantNames.load({ pokeemeraldDir: this.sourceDir });
    return this.names;
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
