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
import { BUTTONS, EmulatorSession, type Button, type RomBuild, type StartOptions } from "./session.js";
import type { Facing } from "./state.js";

const ButtonName = z.enum(Object.keys(BUTTONS) as [Button, ...Button[]]);
const Direction = z.enum(["up", "down", "left", "right"]);
const Strings = z.union([z.string(), z.array(z.string())]);

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
      }),
    )
    .optional(),
  bag: z.record(z.string(), z.number().int()).optional(),
  caught: z.array(z.string()).optional(),
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
    /** Walk back and forth (one tile per direction, in order) until a wild battle starts. */
    findWildBattle: z.strictObject({ directions: z.array(Direction).min(1), maxSteps: z.number().int().positive().optional() }),
  }),
  z.strictObject({
    talk: z.union([
      z.literal(true),
      z.strictObject({
        maxPresses: z.number().int().positive().optional(),
        /** false: don't press A to start; pick up a script that resumes after a battle. */
        start: z.boolean().optional(),
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
  z.strictObject({ expectScreen: z.string() }),
  z.strictObject({
    /** "battle", "overworld" (field script finished too), or a gMain.callback2 name like "CB2_BagMenuRun". */
    waitFor: z.string(),
    maxFrames: z.number().int().positive().optional(),
  }),
  z.strictObject({ waitForBattleText: z.string(), maxFrames: z.number().int().positive().optional() }),
  z.strictObject({
    expectBattle: z.strictObject({ opponent: z.string().optional(), level: z.number().int().optional() }),
  }),
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

export function loadPlaytests(paths: string[]): { file: string; test: Playtest }[] {
  const files = paths.flatMap((p) =>
    fs.statSync(p).isDirectory()
      ? fs.readdirSync(p).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(p, f))
      : [p],
  );
  return files.map((file) => ({ file, test: parsePlaytest(JSON.parse(fs.readFileSync(file, "utf8")), file) }));
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
      const before = await s.readState();
      const [dx, dy] = DELTA[step.walk];
      await s.hold(DIR_BUTTON[step.walk]);
      let moved = false;
      for (let f = 0; f < 40 && !moved; f += 2) {
        await s.run(2);
        const now = await s.readState();
        moved = now.x === before.x + dx && now.y === before.y + dy;
      }
      await s.hold([]);
      await s.run(8);
      if (!moved) fail(`walk ${step.walk}: blocked at ${before.x},${before.y} (tile ${i + 1} of ${step.tiles ?? 1})`);
    }
    return;
  }

  if ("findWildBattle" in step) {
    const { directions, maxSteps = 100 } = step.findWildBattle;
    for (let i = 0; i < maxSteps; i++) {
      await s.hold(DIR_BUTTON[directions[i % directions.length]]);
      await s.run(16);
      await s.hold([]);
      await s.run(4);
      if ((await s.callbacks()).callback2 !== "CB2_Overworld") return;
    }
    fail(`no wild battle after ${maxSteps} steps`);
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
    result.transcripts.push(await talk(s, opts.maxPresses ?? 200, opts.start ?? true));
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
    // Battle messages wait for a button. B advances them and does nothing
    // on the action menu, so tapping it while waiting is safe.
    const want = flatten(step.waitForBattleText);
    const max = step.maxFrames ?? 1800;
    let text = "";
    for (let f = 0; f <= max; f += 30) {
      text = flatten(await s.readText("gDisplayedStringBattle", 300));
      if (text.includes(want)) {
        await s.run(30); // let the menu that follows the message take input
        return;
      }
      await s.press("B", { hold: 2, release: 28 });
    }
    fail(`battle text never showed ${JSON.stringify(step.waitForBattleText)} in ${max} frames; last ${JSON.stringify(text)}`);
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

/**
 * Presses A to interact (unless `start` is false), then keeps pressing A until the field script ends
 * (or a battle starts), collecting each distinct message box. Message boxes
 * are read from gStringVar4, where the game expands every field message
 * before printing it, so each entry is a whole box, not what had scrolled.
 */
async function talk(s: EmulatorSession, maxPresses: number, start: boolean): Promise<string[]> {
  const buffer = s.symbols.address("gStringVar4");
  const boxes: string[] = [];
  let last = "";
  if (start) {
    await s.write(buffer, Uint8Array.of(0xff)); // forget the previous message
    await s.press("A", { hold: 2, release: 6 });
  } else {
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
      return boxes;
    }
    const text = await s.readText(buffer);
    if (text.trim() && text !== last) {
      boxes.push(text);
      last = text;
    }
    if (await s.scriptIdle()) return boxes;
    await s.press("A", { hold: 2, release: 10 });
  }
  fail(`talk: script still running after ${maxPresses} presses; text so far ${JSON.stringify(boxes)}`);
}
