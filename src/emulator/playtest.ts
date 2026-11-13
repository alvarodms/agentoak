/**
 * Scripted playtests: a scenario plus steps plus expectations, stored as
 * JSON in pokeemerald/playtests/ (where the agent can write them) and replayed
 * against every build. No LLM is involved in a replay.
 *
 *   {
 *     "name": "route104-skeptic-caught",
 *     "checks": "C327: with LOTAD_HOENN caught the skeptic reads the corrected line",
 *     "scenario": { "map": "MAP_ROUTE104", "x": 33, "y": 50, "caught": ["SPECIES_LOTAD_HOENN"] },
 *     "steps": [
 *       { "expectObject": { "id": "LOCALID_ROUTE104_LOTAD_SKEPTIC", "x": 33, "y": 49, "facing": "right" } },
 *       { "face": "up" },
 *       { "talk": true },
 *       { "expectText": "PROF. BIRCH never wrote that." }
 *     ]
 *   }
 */

import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { SAVEBLOCK1_REGISTERED_ITEM } from "./scenario.js";
import { BUTTONS, EmulatorSession, type Button, type RomBuild, type StartOptions } from "./session.js";
import { SCRIPT_CONTEXT_SHUTDOWN, type Facing } from "./state.js";

export { SAVEBLOCK1_REGISTERED_ITEM };

const ButtonName = z.enum(Object.keys(BUTTONS) as [Button, ...Button[]]);
const Direction = z.enum(["up", "down", "left", "right"]);
const Strings = z.union([z.string(), z.array(z.string())]);
const ItemName = z.string().regex(/^ITEM_[A-Z0-9_]+$/);
const SpeciesName = z.string().regex(/^SPECIES_[A-Z0-9_]+$/);

const ScenarioSchema = z.strictObject({
  map: z.string(),
  x: z.number().int(),
  y: z.number().int(),
  name: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  money: z.number().int().optional(),
  flags: z.array(z.string()).optional(),
  clearFlags: z.array(z.string()).optional(),
  vars: z.record(z.string(), z.number().int()).optional(),
  party: z
    .array(
      z.strictObject({
        species: z.string(),
        level: z.number().int(),
        item: z.string().optional(),
        moves: z.array(z.string()).optional(),
        ability: z.union([z.literal(1), z.literal(2)]).optional(),
      }),
    )
    .optional(),
  bag: z.record(z.string(), z.number().int()).optional(),
  caught: z.array(z.string()).optional(),
  defeatedTrainers: z.array(z.string()).optional(),
  /** ITEM_* already registered to SELECT (it should also be in the bag). */
  registeredItem: ItemName.optional(),
});

const StepSchema = z.union([
  z.strictObject({ comment: z.string() }),
  z.strictObject({
    press: z.union([ButtonName, z.array(ButtonName)]),
    hold: z.number().int().optional(),
    release: z.number().int().optional(),
    times: z.number().int().positive().optional(),
  }),
  z.strictObject({ wait: z.number().int().positive() }),
  z.strictObject({ walk: Direction, tiles: z.number().int().positive().optional() }),
  z.strictObject({ face: Direction }),
  z.strictObject({
    /**
     * Walk to a tile on this map: along the row first (x), then the column (y), or the column
     * first with yFirst. For a start tile that isn't fixed, e.g. after findWildBattle. Fails if blocked.
     */
    walkTo: z.strictObject({ x: z.number().int(), y: z.number().int(), yFirst: z.boolean().optional() }),
  }),
  z.strictObject({
    /**
     * Jump to a tile on another map mid-test, like walking there off-screen:
     * the map loads fresh, so its ON_TRANSITION and ON_LOAD scripts run.
     */
    warp: z.strictObject({ map: z.string().regex(/^MAP_[A-Z0-9_]+$/), x: z.number().int(), y: z.number().int() }),
  }),
  z.strictObject({
    /**
     * Walk back and forth (one tile per direction, in order) until a wild battle starts.
     * species: run from any other wild Pokémon and keep walking (lead must be fast enough to flee).
     */
    findWildBattle: z.strictObject({
      directions: z.array(Direction).min(1),
      maxSteps: z.number().int().positive().optional(),
      species: SpeciesName.optional(),
    }),
  }),
  z.strictObject({
    /**
     * In a wild battle: BAG, Poké Balls pocket, throw this ball, decline the
     * nickname and close the Pokédex page. Fails unless the catch succeeds.
     */
    catchWild: z.strictObject({ ball: ItemName, nickname: z.literal(false).optional() }),
  }),
  z.strictObject({
    talk: z.union([
      z.literal(true),
      z.strictObject({
        maxPresses: z.number().int().positive().optional(),
        /** false: don't press A to start; pick up a script that resumes after a battle. */
        start: z.boolean().optional(),
        /**
         * Answers for the script's YES/NO boxes, in order ("no" presses B).
         * Boxes after the last answer get YES. Unused answers fail the step.
         */
        answers: z.array(z.enum(["yes", "no"])).min(1).optional(),
      }),
    ]),
  }),
  z.strictObject({
    /** Registers an ITEM_* (it must be in the bag) and presses SELECT. read: record its boxes like talk. */
    useKeyItem: z.union([
      ItemName,
      z.strictObject({
        item: ItemName,
        read: z.boolean().optional(),
        maxPresses: z.number().int().positive().optional(),
        /** false: don't register it; fail unless the game already put it on SELECT. */
        register: z.boolean().optional(),
      }),
    ]),
  }),
  z.strictObject({ expectText: Strings }),
  z.strictObject({ expectNoText: Strings }),
  z.strictObject({ expectBattleText: Strings }),
  z.strictObject({
    expectPlayer: z.strictObject({
      map: z.string().optional(),
      x: z.number().int().optional(),
      y: z.number().int().optional(),
      facing: Direction.optional(),
    }),
  }),
  z.strictObject({
    expectObject: z.strictObject({
      id: z.union([z.number().int(), z.string()]),
      absent: z.boolean().optional(),
      x: z.number().int().optional(),
      y: z.number().int().optional(),
      facing: Direction.optional(),
      visible: z.boolean().optional(),
    }),
  }),
  z.strictObject({ expectFlag: z.record(z.string(), z.boolean()) }),
  z.strictObject({ expectVar: z.record(z.string(), z.number().int()) }),
  /** Set saved VAR_*s mid-test, e.g. VAR_REPEL_STEP_COUNT after a catch so the walk back meets no wild battle. */
  z.strictObject({ setVar: z.record(z.string().regex(/^VAR_[A-Z0-9_]+$/), z.number().int().min(0).max(0xffff)) }),
  z.strictObject({ expectScreen: z.string() }),
  z.strictObject({
    /** "battle", "overworld" (field script finished too), or a gMain.callback2 name like "CB2_BagMenuRun". */
    waitFor: z.string(),
    maxFrames: z.number().int().positive().optional(),
  }),
  z.strictObject({
    waitForBattleText: z.string(),
    maxFrames: z.number().int().positive().optional(),
    /** Ignore the message already showing; wait for a new one (e.g. the next "What will"). */
    fresh: z.boolean().optional(),
  }),
  z.strictObject({
    expectBattle: z.strictObject({ opponent: z.string().optional(), level: z.number().int().optional() }),
  }),
  /** The battle's current weather (gBattleWeather), e.g. after the foe uses Hail. */
  z.strictObject({ expectBattleWeather: z.enum(["none", "rain", "sun", "sandstorm", "hail"]) }),
  z.strictObject({ screenshot: z.string().regex(/^[\w-]+$/) }),
]);

export const PlaytestSchema = z.strictObject({
  name: z.string().regex(/^[\w-]+$/),
  /** What this test proves, with the cycle or checklist it comes from. */
  checks: z.string(),
  scenario: ScenarioSchema,
  steps: z.array(StepSchema).min(1),
});

export type Playtest = z.infer<typeof PlaytestSchema>;
export type Step = z.infer<typeof StepSchema>;

export function parsePlaytest(json: unknown, source = "playtest"): Playtest {
  const result = PlaytestSchema.safeParse(json);
  if (!result.success) throw new Error(`${source}: ${z.prettifyError(result.error)}`);
  return result.data;
}

export interface LoadedPlaytest {
  file: string;
  /** The playtest's name, or the file's base name when it could not be parsed. */
  name: string;
  test?: Playtest;
  /** Why the file is not a valid playtest. */
  error?: string;
}

/** Loads every playtest, keeping unparseable files as entries with an error. */
export function loadPlaytestFiles(paths: string[]): LoadedPlaytest[] {
  const files = paths.flatMap((p) =>
    fs.statSync(p).isDirectory()
      ? fs.readdirSync(p).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(p, f))
      : [p],
  );
  return files.map((file) => {
    try {
      const test = parsePlaytest(JSON.parse(fs.readFileSync(file, "utf8")), file);
      return { file, name: test.name, test };
    } catch (err) {
      return { file, name: path.basename(file, ".json"), error: (err as Error).message };
    }
  });
}

/** Loads every playtest, throwing on the first invalid file. */
export function loadPlaytests(paths: string[]): { file: string; test: Playtest }[] {
  return loadPlaytestFiles(paths).map(({ file, test, error }) => {
    if (!test) throw new Error(error);
    return { file, test };
  });
}

export interface PlaytestResult {
  name: string;
  file?: string;
  checks: string;
  passed: boolean;
  /** 0-based index of the failing step, or -1 when booting failed. */
  failedStep?: number;
  error?: string;
  /** Each talk step's text boxes, in order. */
  transcripts: string[][];
  screenshots: string[];
  frames: number;
  ms: number;
}

class StepFailure extends Error {}

function fail(msg: string): never {
  throw new StepFailure(msg);
}

const DIR_BUTTON: Record<z.infer<typeof Direction>, Button> = { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT" };
const DELTA: Record<z.infer<typeof Direction>, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const asList = (s: string | string[]) => (typeof s === "string" ? [s] : s);
/**
 * Text is compared with line breaks flattened and curly quotes straightened
 * (the charmap prints ' as ’), so expectations need not match wrapping or
 * typography.
 */
const flatten = (s: string) =>
  s.replace(/\s+/g, " ").replace(/[’‘]/g, "'").replace(/[“”]/g, '"');

export interface RunOptions extends StartOptions {
  /** Directory for this test's screenshots (created on demand). */
  outDir?: string;
}

/** Runs one playtest. Never throws for test failures; they come back in the result. */
export async function runPlaytest(test: Playtest, build: RomBuild, opts: RunOptions = {}): Promise<PlaytestResult> {
  const started = Date.now();
  const result: PlaytestResult = {
    name: test.name,
    checks: test.checks,
    passed: false,
    transcripts: [],
    screenshots: [],
    frames: 0,
    ms: 0,
  };
  let session: EmulatorSession | undefined;
  let step = -1;

  const shot = async (name: string) => {
    if (!session || !opts.outDir) return;
    fs.mkdirSync(opts.outDir, { recursive: true });
    const file = path.join(opts.outDir, `${name}.png`);
    await session.screenshot(file);
    result.screenshots.push(file);
  };

  try {
    session = await EmulatorSession.bootScenario(test.scenario, build, opts);
    for (step = 0; step < test.steps.length; step++) {
      await runStep(session, test.steps[step], result, shot);
    }
    result.passed = true;
  } catch (err) {
    result.failedStep = step;
    result.error = err instanceof StepFailure ? err.message : `${(err as Error).message}`;
    try {
      await shot("failure");
    } catch {
      // the driver may be gone; the error above is what matters
    }
  } finally {
    if (session) {
      result.frames = session.frame;
      await session.close();
    }
    result.ms = Date.now() - started;
  }
  return result;
}

async function runStep(
  s: EmulatorSession,
  step: Step,
  result: PlaytestResult,
  shot: (name: string) => Promise<void>,
): Promise<void> {
  if ("comment" in step) return;

  if ("press" in step) {
    for (let i = 0; i < (step.times ?? 1); i++) {
      await s.press(step.press, { hold: step.hold, release: step.release });
    }
    return;
  }

  if ("wait" in step) return s.run(step.wait);

  if ("walk" in step) {
    for (let i = 0; i < (step.tiles ?? 1); i++) {
      await walkOneTile(s, step.walk, `walk ${step.walk}`, `tile ${i + 1} of ${step.tiles ?? 1}`);
    }
    return;
  }

  if ("walkTo" in step) {
    const { x, y, yFirst } = step.walkTo;
    const from = await s.readState();
    const dirs = walkToDirections(from.x, from.y, x, y, yFirst ?? false);
    for (const [i, dir] of dirs.entries()) {
      await walkOneTile(s, dir, `walkTo ${x},${y}`, `step ${i + 1} of ${dirs.length}, going ${dir}`);
    }
    return;
  }

  if ("setVar" in step) {
    for (const [name, value] of Object.entries(step.setVar)) await s.setVar(name, value);
    return;
  }

  if ("warp" in step) {
    await warp(s, step.warp.map, step.warp.x, step.warp.y);
    return;
  }

  if ("findWildBattle" in step) {
    const { directions, maxSteps = 100, species } = step.findWildBattle;
    const fled: string[] = [];
    for (let i = 0; i < maxSteps; i++) {
      await s.hold(DIR_BUTTON[directions[i % directions.length]]);
      await s.run(16);
      await s.hold([]);
      await s.run(4);
      if ((await s.callbacks()).callback2 === "CB2_Overworld") continue;
      if (!species) return;
      await waitForBattleText(s, "What will", 1800);
      const foe = (await s.readState()).battle?.[1]?.speciesName ?? "?";
      if (foe === species) return;
      fled.push(foe);
      await fleeWildBattle(s);
    }
    const ran = fled.length ? `; ran from ${fled.join(", ")}` : "";
    fail(`no wild ${species ? `${species} ` : ""}battle after ${maxSteps} steps${ran}`);
  }

  if ("catchWild" in step) {
    result.transcripts.push(await catchWild(s, step.catchWild.ball));
    return;
  }

  if ("face" in step) {
    // A one-frame tap turns the player in place without taking a step.
    await s.press(DIR_BUTTON[step.face], { hold: 1, release: 8 });
    const { facing } = await s.readState();
    if (facing !== step.face) fail(`face ${step.face}: player faces ${facing}`);
    return;
  }

  if ("talk" in step) {
    const opts = step.talk === true ? {} : step.talk;
    const start = opts.start === false ? "resume" : "press";
    result.transcripts.push(await talk(s, opts.maxPresses ?? 200, start, opts.answers ?? []));
    return;
  }

  if ("useKeyItem" in step) {
    const opts = typeof step.useKeyItem === "string" ? { item: step.useKeyItem } : step.useKeyItem;
    const id = s.constant(opts.item);
    const sb1 = await s.deref("gSaveBlock1Ptr");
    if (opts.register === false) {
      const registered = await s.readU16(sb1 + SAVEBLOCK1_REGISTERED_ITEM);
      if (registered !== id) fail(`useKeyItem ${opts.item}: SELECT holds item ${registered}, not ${opts.item} (${id})`);
    } else {
      await s.write(sb1 + SAVEBLOCK1_REGISTERED_ITEM, Uint8Array.of(id & 0xff, id >> 8));
    }
    await s.write(s.symbols.address("gStringVar4"), Uint8Array.of(0xff)); // forget the previous message
    await s.press("SELECT", { hold: 2, release: 6 });
    let started = !(await s.scriptIdle());
    for (let f = 0; f < 120 && !started; f += 2) {
      await s.run(2);
      started = !(await s.scriptIdle());
    }
    if (!started) fail(`useKeyItem ${opts.item}: SELECT started no script (is it in the bag, and is the player free to move?)`);
    if (opts.read ?? true) result.transcripts.push(await talk(s, opts.maxPresses ?? 200, "none"));
    return;
  }

  if ("expectText" in step || "expectNoText" in step) {
    const transcript = result.transcripts.at(-1);
    if (!transcript) fail("no talk step ran before this text check");
    const text = flatten(transcript.join(" "));
    for (const want of asList("expectText" in step ? step.expectText : [])) {
      if (!text.includes(flatten(want))) fail(`text missing ${JSON.stringify(want)}; got ${JSON.stringify(transcript)}`);
    }
    for (const unwanted of asList("expectNoText" in step ? step.expectNoText : [])) {
      if (text.includes(flatten(unwanted))) fail(`text should not include ${JSON.stringify(unwanted)}`);
    }
    return;
  }

  if ("expectBattleWeather" in step) {
    const got = battleWeatherName(await s.readU16(s.symbols.address("gBattleWeather")));
    if (got !== step.expectBattleWeather) fail(`battle weather is ${got}, expected ${step.expectBattleWeather}`);
    return;
  }

  if ("expectBattleText" in step) {
    const text = flatten(await s.readText("gDisplayedStringBattle", 300));
    for (const want of asList(step.expectBattleText)) {
      if (!text.includes(flatten(want))) fail(`battle text missing ${JSON.stringify(want)}; got ${JSON.stringify(text)}`);
    }
    return;
  }

  if ("expectPlayer" in step) {
    const st = await s.readState();
    const want = step.expectPlayer;
    const got = { map: st.map, x: st.x, y: st.y, facing: st.facing as Facing };
    for (const key of Object.keys(want) as (keyof typeof want)[]) {
      if (want[key] !== got[key]) fail(`player ${key} is ${got[key]}, expected ${want[key]}`);
    }
    return;
  }

  if ("expectObject" in step) {
    const { id, absent, ...want } = step.expectObject;
    const obj = await s.object(id);
    if (absent) {
      if (obj) fail(`object ${id} should be absent but is at ${obj.x},${obj.y}`);
      return;
    }
    if (!obj) fail(`object ${id} is not on the map (hidden by its flag?)`);
    for (const key of Object.keys(want) as (keyof typeof want)[]) {
      if (want[key] !== obj[key]) fail(`object ${id} ${key} is ${obj[key]}, expected ${want[key]}`);
    }
    return;
  }

  if ("expectFlag" in step) {
    for (const [name, want] of Object.entries(step.expectFlag)) {
      const got = await s.flag(name);
      if (got !== want) fail(`${name} is ${got ? "set" : "clear"}, expected ${want ? "set" : "clear"}`);
    }
    return;
  }

  if ("expectVar" in step) {
    for (const [name, want] of Object.entries(step.expectVar)) {
      const got = await s.getVar(name);
      if (got !== want) fail(`${name} is ${got}, expected ${want}`);
    }
    return;
  }

  if ("expectScreen" in step) {
    const { callback2 } = await s.callbacks();
    if (callback2 !== step.expectScreen) fail(`screen is ${callback2}, expected ${step.expectScreen}`);
    return;
  }

  if ("waitFor" in step) {
    const screen = step.waitFor === "battle" ? "BattleMainCB2" : step.waitFor === "overworld" ? "CB2_Overworld" : step.waitFor;
    try {
      await s.runUntilScreen(screen, step.maxFrames ?? 1200);
    } catch (err) {
      fail((err as Error).message);
    }
    if (step.waitFor === "overworld") {
      for (let f = 0; f < 600 && !(await s.scriptIdle()); f += 10) await s.run(10);
    }
    return;
  }

  if ("waitForBattleText" in step) {
    const stale = step.fresh ? await battleText(s) : undefined;
    await waitForBattleText(s, step.waitForBattleText, step.maxFrames ?? 1800, stale);
    return;
  }

  if ("expectBattle" in step) {
    // gBattleMons fills in a few frames after the battle screen appears.
    let battle = (await s.readState()).battle;
    for (let f = 0; f < 600 && battle && !(battle[1]?.species > 0); f += 10) {
      await s.run(10);
      battle = (await s.readState()).battle;
    }
    if (!battle) fail("no battle is running");
    const foe = battle[1];
    if (step.expectBattle.opponent && foe?.speciesName !== step.expectBattle.opponent) {
      fail(`opponent is ${foe?.speciesName}, expected ${step.expectBattle.opponent}`);
    }
    if (step.expectBattle.level !== undefined && foe?.level !== step.expectBattle.level) {
      fail(`opponent level is ${foe?.level}, expected ${step.expectBattle.level}`);
    }
    return;
  }

  if ("screenshot" in step) return shot(step.screenshot);
}

const battleText = async (s: EmulatorSession) => flatten(await s.readText("gDisplayedStringBattle", 300));

/**
 * Taps B until the battle message contains `want` (and differs from
 * `stale`). Battle messages wait for a button; B advances them and does
 * nothing on the action menu, so tapping it while waiting is safe.
 */
async function waitForBattleText(s: EmulatorSession, want: string, max: number, stale?: string): Promise<void> {
  let text = "";
  for (let f = 0; f <= max; f += 30) {
    text = await battleText(s);
    if (text.includes(flatten(want)) && text !== stale) {
      await s.run(30); // let the menu that follows the message take input
      return;
    }
    await s.press("B", { hold: 2, release: 28 });
  }
  fail(`battle text never showed ${JSON.stringify(want)} in ${max} frames; last ${JSON.stringify(text)}`);
}

/** Taps B until the battle has handed back to the field, collecting each battle message. */
async function leaveBattle(s: EmulatorSession, what: string, seen: string[] = []): Promise<string[]> {
  for (let f = 0; (await s.callbacks()).callback2 !== "CB2_Overworld"; f += 30) {
    const text = await battleText(s);
    if (text.trim() && text !== seen.at(-1)) seen.push(text);
    if (f >= 3600) fail(`${what}: still not back in the field after 3600 frames; battle text ${JSON.stringify(seen)}`);
    await s.press("B", { hold: 2, release: 28 });
  }
  return seen;
}

/** Walks one tile; fails with `label: blocked at x,y (detail)` if the player didn't move. */
async function walkOneTile(s: EmulatorSession, dir: z.infer<typeof Direction>, label: string, detail: string): Promise<void> {
  const before = await s.readState();
  const [dx, dy] = DELTA[dir];
  await s.hold(DIR_BUTTON[dir]);
  let moved = false;
  for (let f = 0; f < 40 && !moved; f += 2) {
    await s.run(2);
    const now = await s.readState();
    // Crossing a map connection or stepping onto a warp changes the map,
    // and with it the coordinate system: that counts as a step taken.
    moved = now.map !== before.map || (now.x === before.x + dx && now.y === before.y + dy);
  }
  await s.hold([]);
  await s.run(8);
  if (!moved) fail(`${label}: blocked at ${before.x},${before.y} (${detail})`);
}

/** The walkTo route: one direction per tile, the row (x) first unless yFirst. */
export function walkToDirections(fromX: number, fromY: number, toX: number, toY: number, yFirst: boolean): z.infer<typeof Direction>[] {
  const across = Array<z.infer<typeof Direction>>(Math.abs(toX - fromX)).fill(toX < fromX ? "left" : "right");
  const along = Array<z.infer<typeof Direction>>(Math.abs(toY - fromY)).fill(toY < fromY ? "up" : "down");
  return yFirst ? [...along, ...across] : [...across, ...along];
}

/** Waits until the field is free to walk, or a field script (ON_FRAME, a trainer) has taken over. */
async function settleField(s: EmulatorSession, what: string): Promise<void> {
  const status = s.symbols.address("sGlobalScriptContextStatus");
  let idleChecks = 0;
  for (let f = 0; f < 600; f += 10) {
    if ((await s.readU8(status)) !== SCRIPT_CONTEXT_SHUTDOWN) return;
    // Free for two checks in a row: an ON_FRAME script would have started by now.
    idleChecks = (await s.scriptIdle()) ? idleChecks + 1 : 0;
    if (idleChecks >= 2) return;
    await s.run(10);
  }
  fail(`${what}: the field never settled after the battle`);
}

/** From the action menu: RUN (bottom right; RIGHT then DOWN reaches it from any slot). */
async function fleeWildBattle(s: EmulatorSession): Promise<void> {
  await s.press("RIGHT");
  await s.press("DOWN");
  await s.press("A");
  await leaveBattle(s, "findWildBattle (running away)");
  await settleField(s, "findWildBattle (running away)");
}

/** Offsets of pos and location in struct SaveBlock1 (include/global.h marks them; a unit test checks). */
export const SAVEBLOCK1_POS = 0x00;
export const SAVEBLOCK1_LOCATION = 0x04;
/** Offset of gMain.state (include/main.h marks it 0x438; a unit test checks). */
export const MAIN_STATE = 0x438;
const MAIN_CALLBACK2 = 0x04;
const WARP_ID_NONE = -1;

/** struct WarpData (include/global.h): s8 mapGroup, mapNum, warpId, pad, s16 x, y. `map` as MAP_* resolves: num | group << 8. */
export function encodeWarpData(map: number, x: number, y: number): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeInt8(map >> 8, 0);
  buf.writeInt8(map & 0xff, 1);
  buf.writeInt8(WARP_ID_NONE, 2);
  buf.writeInt16LE(x, 4);
  buf.writeInt16LE(y, 6);
  return buf;
}

/**
 * Warps the player to `map` x,y the way the game does after a warp tile's
 * fade (WarpIntoMap, then CB2_LoadMap in Task_WarpAndLoadMap), so the new
 * map runs its ON_TRANSITION / ON_LOAD scripts and spawns objects fresh.
 */
async function warp(s: EmulatorSession, map: string, x: number, y: number): Promise<void> {
  if (!(await s.scriptIdle())) fail(`warp ${map}: a field script is still running (finish it with talk first)`);
  const sb1 = await s.deref("gSaveBlock1Ptr");
  const dest = encodeWarpData(s.constant(map), x, y);
  // WarpIntoMap(): remember where we were, apply the destination, put the player on its tile.
  await s.write(s.symbols.address("gLastUsedWarp"), await s.read(sb1 + SAVEBLOCK1_LOCATION, 8));
  await s.write(s.symbols.address("sWarpDestination"), dest);
  await s.write(sb1 + SAVEBLOCK1_LOCATION, dest);
  const pos = Buffer.alloc(4);
  pos.writeInt16LE(x, 0);
  pos.writeInt16LE(y, 2);
  await s.write(sb1 + SAVEBLOCK1_POS, pos);
  // SetMainCallback2(CB2_LoadMap): gMain.state drives DoMapLoadLoop, so it starts at 0.
  const main = s.symbols.address("gMain");
  await s.write(main + MAIN_STATE, Uint8Array.of(0));
  const cb = Buffer.alloc(4);
  cb.writeUInt32LE((s.symbols.address("CB2_LoadMap") | 1) >>> 0); // Thumb
  await s.write(main + MAIN_CALLBACK2, cb);
  await s.run(10);
  try {
    await s.runUntilScreen("CB2_Overworld", 1800);
  } catch (err) {
    fail(`warp ${map}: ${(err as Error).message}`);
  }
  await s.run(60); // the map fades in, like bootScenario
  for (let f = 0; f < 300 && !(await s.scriptIdle()); f += 10) await s.run(10);
  const st = await s.readState();
  if (st.map !== map || st.x !== x || st.y !== y) fail(`warp: player is on ${st.map} ${st.x},${st.y}, expected ${map} ${x},${y}`);
}

/** gBagPosition (include/item_menu.h struct BagPosition): pocket, cursorPosition[5], scrollPosition[5]. */
export const BAG_POSITION = { pocket: 5, cursorPosition: 8, scrollPosition: 18 } as const;
/** Offset of bagPocket_PokeBalls in struct SaveBlock1 (include/global.h marks it 0x650; a unit test checks). */
export const SAVEBLOCK1_POKEBALLS = 0x650;
const BAG_POKEBALLS_COUNT = 16;
const BALLS_POCKET = 1;
const B_OUTCOME_CAUGHT = 7;

/** Index of `itemId` in the Poké Balls pocket list (slots are ItemSlot {u16 id, u16 quantity}), or -1. */
export function ballListIndex(pocket: Buffer, itemId: number): number {
  let index = 0;
  for (let i = 0; i < BAG_POKEBALLS_COUNT; i++) {
    const id = pocket.readUInt16LE(i * 4);
    if (id === 0) continue;
    if (id === itemId) return index;
    index++;
  }
  return -1;
}

/** catchWild: throw `ball` from the bag and see the catch through to the field. Returns the battle text seen. */
async function catchWild(s: EmulatorSession, ball: string): Promise<string[]> {
  const what = `catchWild ${ball}`;
  const id = s.constant(ball);
  const sb1 = await s.deref("gSaveBlock1Ptr");
  const target = ballListIndex(await s.read(sb1 + SAVEBLOCK1_POKEBALLS, BAG_POKEBALLS_COUNT * 4), id);
  if (target < 0) fail(`${what}: not in the Poké Balls pocket`);
  if ((await s.callbacks()).callback2 === "CB2_Overworld") fail(`${what}: no battle is running`);

  await waitForBattleText(s, "What will", 1800);
  // BAG is top right: UP then RIGHT reaches it from any slot.
  await s.press("UP");
  await s.press("RIGHT");
  await s.press("A");
  try {
    await s.runUntilScreen("CB2_BagMenuRun", 300);
  } catch {
    fail(`${what}: BAG did not open`);
  }
  await s.run(60); // the bag fades in before it takes input

  const bag = s.symbols.address("gBagPosition");
  for (let tries = 0; (await s.readU8(bag + BAG_POSITION.pocket)) !== BALLS_POCKET; tries++) {
    if (tries >= 6) fail(`${what}: could not reach the Poké Balls pocket`);
    const pocket = await s.readU8(bag + BAG_POSITION.pocket);
    await s.press(pocket > BALLS_POCKET ? "LEFT" : "RIGHT", { hold: 2, release: 30 });
  }
  const position = async () =>
    (await s.readU16(bag + BAG_POSITION.cursorPosition + BALLS_POCKET * 2)) +
    (await s.readU16(bag + BAG_POSITION.scrollPosition + BALLS_POCKET * 2));
  for (let tries = 0; (await position()) !== target; tries++) {
    if (tries >= BAG_POKEBALLS_COUNT * 2) fail(`${what}: could not move the bag cursor to it`);
    await s.press((await position()) < target ? "DOWN" : "UP", { hold: 2, release: 12 });
  }
  await s.press("A", { hold: 2, release: 20 }); // context menu: USE / CANCEL
  await s.press("A", { hold: 2, release: 20 }); // USE
  try {
    await s.runUntilScreen("BattleMainCB2", 300);
  } catch {
    fail(`${what}: the bag did not hand the ball back to the battle`);
  }

  // B advances "Gotcha!" and the Pokédex messages, closes the new Pokédex
  // page and answers NO to the nickname box. If the ball misses, the action
  // menu comes back instead.
  const seen: string[] = [];
  for (let f = 0; (await s.callbacks()).callback2 !== "CB2_Overworld"; f += 30) {
    const text = await battleText(s);
    if (text.trim() && text !== seen.at(-1)) seen.push(text);
    if (seen.length > 1 && text.includes("What will")) fail(`${what}: the ball did not catch it; battle text ${JSON.stringify(seen)}`);
    if (f >= 3600) fail(`${what}: still not back in the field after 3600 frames; battle text ${JSON.stringify(seen)}`);
    await s.press("B", { hold: 2, release: 28 });
  }
  const outcome = await s.readU8(s.symbols.address("gBattleOutcome"));
  if (outcome !== B_OUTCOME_CAUGHT) fail(`${what}: battle ended with outcome ${outcome}, not a catch; battle text ${JSON.stringify(seen)}`);
  await s.write(s.symbols.address("gStringVar4"), Uint8Array.of(0xff)); // a following talk records only field text
  await settleField(s, what);
  return seen;
}

/**
 * Starts the script ("press": A to interact; "resume": pick it up after a
 * battle; "none": already running, e.g. from useKeyItem), then keeps pressing A until the field script ends
 * (or a battle starts), collecting each distinct message box. Message boxes
 * are read from gStringVar4, where the game expands every field message
 * before printing it, so each entry is a whole box, not what had scrolled.
 */
async function talk(
  s: EmulatorSession,
  maxPresses: number,
  start: "press" | "resume" | "none",
  answers: readonly ("yes" | "no")[] = [],
): Promise<string[]> {
  const buffer = s.symbols.address("gStringVar4");
  const boxes: string[] = [];
  const pending = [...answers];
  const done = (): string[] => {
    if (pending.length) {
      fail(`talk: ${pending.length} answer(s) unused (${pending.join(", ")}); only ${answers.length - pending.length} YES/NO box(es) appeared; text ${JSON.stringify(boxes)}`);
    }
    return boxes;
  };
  let last = "";
  if (start === "press") {
    await s.write(buffer, Uint8Array.of(0xff)); // forget the previous message
    await s.press("A", { hold: 2, release: 6 });
  } else if (start === "resume") {
    // Resuming after a battle: tap B through its closing messages ("Got
    // away safely!" and the like) until the field comes back.
    for (let f = 0; (await s.callbacks()).callback2 !== "CB2_Overworld"; f += 30) {
      if (f >= 2400) fail("talk: the battle did not return to the field within 2400 frames");
      await s.press("B", { hold: 2, release: 28 });
    }
  }
  for (let i = 0; i < maxPresses; i++) {
    await s.run(6);
    const { callback2 } = await s.callbacks();
    if (callback2 !== "CB2_Overworld") {
      boxes.push(`[screen: ${callback2}]`);
      return done();
    }
    const text = await s.readText(buffer);
    if (text.trim() && text !== last) {
      boxes.push(text);
      last = text;
    }
    if (await s.scriptIdle()) return done();
    if (pending.length && (await yesNoBoxOpen(s))) {
      const answer = pending.shift()!;
      boxes.push(`[answered ${answer.toUpperCase()}]`);
      await s.press(answer === "no" ? "B" : "A", { hold: 2, release: 10 });
      continue;
    }
    await s.press("A", { hold: 2, release: 10 });
  }
  fail(`talk: script still running after ${maxPresses} presses; text so far ${JSON.stringify(boxes)}`);
}


const NUM_TASKS = 16;
/** sizeof(struct Task): func (4), isActive/prev/next/priority (4), data[16] (32). */
const TASK_SIZE = 40;

/** True while a script's YES/NO box (Task_HandleYesNoInput in script_menu.c) waits for input. */
async function yesNoBoxOpen(s: EmulatorSession): Promise<boolean> {
  const handler = s.symbols.address("Task_HandleYesNoInput", "src/script_menu.o");
  const tasks = await s.read(s.symbols.address("gTasks"), NUM_TASKS * TASK_SIZE);
  for (let i = 0; i < NUM_TASKS; i++) {
    const func = tasks.readUInt32LE(i * TASK_SIZE) & ~1;
    const active = tasks.readUInt8(i * TASK_SIZE + 4) !== 0;
    if (active && func === (handler & ~1)) return true;
  }
  return false;
}

/** B_WEATHER_* bits (include/constants/battle.h) as one name. */
export function battleWeatherName(bits: number): "none" | "rain" | "sun" | "sandstorm" | "hail" {
  if (bits & 0x07) return "rain";
  if (bits & 0x18) return "sandstorm";
  if (bits & 0x60) return "sun";
  if (bits & 0x80) return "hail";
  return "none";
}
