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
import { CHECKPOINT_NAMES } from "./checkpoints.js";
import { SAVEBLOCK1_REGISTERED_ITEM } from "./scenario.js";
import { BUTTONS, EmulatorSession, type Button, type RomBuild, type StartOptions } from "./session.js";
import { SE_PLAYERS, findSoundStart, sampleSePlayers, songHeaderAddress } from "./sound.js";
import { SCRIPT_CONTEXT_SHUTDOWN, decodeBattleMon, decodePartyMon, type Facing } from "./state.js";

export { SAVEBLOCK1_REGISTERED_ITEM };

const ButtonName = z.enum(Object.keys(BUTTONS) as [Button, ...Button[]]);
const Direction = z.enum(["up", "down", "left", "right"]);
const Strings = z.union([z.string(), z.array(z.string())]);
const ItemName = z.string().regex(/^ITEM_[A-Z0-9_]+$/);
const SpeciesName = z.string().regex(/^SPECIES_[A-Z0-9_]+$/);
const BattleTarget = z.enum(["opponentLeft", "opponentRight"]);
type BattleTarget = z.infer<typeof BattleTarget>;

/**
 * Match Call contacts pokenavCall can ring. header: their MC_HEADER_* (include/pokenav.h; a unit
 * test checks). identity: a line every call from them contains, so a wrong row fails loudly.
 */
export const MATCH_CALL_CONTACTS = {
  BIRCH: { header: 1, identity: "Are you curious" },
} as const;
const PokenavContact = z.enum(Object.keys(MATCH_CALL_CONTACTS) as [keyof typeof MATCH_CALL_CONTACTS]);

const ScenarioSchema = z
  .strictObject({
    /** A story save state from checkpoints.ts; the fields below go on top of it. */
    checkpoint: z.enum(CHECKPOINT_NAMES).optional(),
    /** map, x and y: required unless checkpoint is set (then all three or none). */
    map: z.string().optional(),
    x: z.number().int().optional(),
    y: z.number().int().optional(),
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
          /** Current HP as a percent of max (1-100), set right after boot. */
          hpPercent: z.number().int().min(1).max(100).optional(),
        }),
      )
      .optional(),
    bag: z.record(z.string(), z.number().int()).optional(),
    caught: z.array(z.string()).optional(),
    defeatedTrainers: z.array(z.string()).optional(),
    /** ITEM_* already registered to SELECT (it should also be in the bag). */
    registeredItem: ItemName.optional(),
  })
  .refine((s) => (s.map !== undefined && s.x !== undefined && s.y !== undefined) || s.checkpoint !== undefined, {
    message: "map, x and y are required unless checkpoint is set",
  })
  .refine((s) => [s.map, s.x, s.y].every((v) => v === undefined) || [s.map, s.x, s.y].every((v) => v !== undefined), {
    message: "give all of map, x and y, or none",
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
        /**
         * Stop, without pressing A, once the shown message box contains any of these (e.g. to check an object's
         * facing or take a screenshot mid-script). The text so far, that box included, is the step's text; a later
         * `talk: {"start": false}` resumes (its text starts with that box again). Fails if the script ends first.
         */
        until: Strings.optional(),
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
  z.strictObject({
    /**
     * START → POKéNAV → MATCH CALL → the contact → CALL, then record the call like talk and go back
     * to the field. read: false stops right after CALL, for wait/screenshot mid-call.
     */
    pokenavCall: z.union([
      PokenavContact,
      z.strictObject({
        contact: PokenavContact,
        read: z.boolean().optional(),
        maxPresses: z.number().int().positive().optional(),
      }),
    ]),
  }),
  z.strictObject({ expectText: Strings }),
  /** Field message boxes the last talk showed; its [screen: …] and [answered …] markers don't count. */
  z.strictObject({ expectBoxCount: z.number().int().min(0) }),
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
  z.strictObject({
    /**
     * Advance frame by frame until a sound effect (an SE_* from include/constants/songs.h) starts on one of
     * the m4a SE players; fails after maxFrames (default 240). A start since the last sound check (or since
     * the field appeared at boot) counts too, e.g. an SE the boot settle or a warp already played.
     */
    expectSound: z.strictObject({ song: z.string().regex(/^(SE|MUS)_[A-Z0-9_]+$/), maxFrames: z.number().int().positive().optional() }),
  }),
  z.strictObject({
    /** Advance `frames` frames (default 240); fails if the SE starts, or started since the last sound check. */
    expectNoSound: z.strictObject({ song: z.string().regex(/^(SE|MUS)_[A-Z0-9_]+$/), frames: z.number().int().positive().optional() }),
  }),
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
    /** Fail if any message seen while waiting contains one of these. */
    forbid: Strings.optional(),
  }),
  z.strictObject({
    /**
     * In a battle: each turn pick FIGHT → move slot `move` (1-4, cursor reset to slot 1 first), then tap B through
     * the turn's messages, until every `until` string has shown in a battle message (across turns). Fails if a
     * `forbid` string shows, if the battle ends first, or after `maxTurns` turns (default 10).
     * `any`: stop at the first `until` string instead of waiting for all (e.g. a win line or "whited out").
     * `replace`: when a fainted Pokémon's party menu opens, send out the first healthy one in that menu's order.
     * `moveFor`: per-foe slot override, keyed by the foe's species constant as expectBattle reads it
     * (e.g. {"SPECIES_STANTLER_HOENN": 2}); each turn uses `moveFor[foe] ?? move`. Line the party's moves
     * up by role (e.g. slot 2 = the anti-Grass move on every mon) so one slot fits whoever is out.
     * Double battles are detected: both of the player's battlers pick FIGHT → the same slot, and a
     * single-target move's target prompt is answered with `target` (default "opponentLeft"; the other
     * foe when that one is gone). Spread moves (SURF, EARTHQUAKE) have no prompt.
     * `retargetAfter`: once a battle message containing `text` has shown, every later turn's target prompt uses `target` instead (a player reacting to a tell). Logged as `[retarget TARGET after turn N]`.
     * In-game partner battles (Steven): only your left battler is prompted; the partner's AI picks, and the summary
     * splits faints and foe KOs between you and the partner (see BattleSummary).
     */
    battleTurns: z.strictObject({
      move: z.number().int().min(1).max(4),
      moveFor: z.record(z.string(), z.number().int().min(1).max(4)).optional(),
      target: BattleTarget.optional(),
      until: Strings,
      maxTurns: z.number().int().positive().optional(),
      forbid: Strings.optional(),
      any: z.boolean().optional(),
      replace: z.boolean().optional(),
      retargetAfter: z.strictObject({ text: z.string().min(1), target: BattleTarget }).optional(),
    }),
  }),
  z.strictObject({
    /**
     * In a battle: at the next "What will" pick POKéMON, then the party member in `slot` (2-6, party position
     * like the scenario's party array) and SHIFT, then tap B through the turn to the next "What will".
     * Fails if a `forbid` string shows or the battle ends during the turn.
     */
    battleSwitch: z.strictObject({
      slot: z.number().int().min(2).max(6),
      forbid: Strings.optional(),
    }),
  }),
  z.strictObject({
    /**
     * The "choose 3 for battle" party menu (special ChooseHalfPartyForBattle, e.g. Steven's Space Center multi
     * battle): for each 1-based party `slots` entry, in order, move the cursor there and pick ENTER; then CONFIRM.
     * Fails if the menu isn't the choose-half one, an ENTER doesn't register, or the menu doesn't close into a battle.
     */
    chooseHalfParty: z.strictObject({
      slots: z
        .array(z.number().int().min(1).max(6))
        .length(3)
        .refine((s) => new Set(s).size === s.length, { message: "slots must be different" }),
      maxFrames: z.number().int().positive().optional(),
    }),
  }),
  z.strictObject({
    expectBattle: z.strictObject({ opponent: z.string().optional(), level: z.number().int().optional() }),
  }),
  /** The battle's current weather (gBattleWeather), e.g. after the foe uses Hail. */
  z.strictObject({ expectBattleWeather: z.enum(["none", "rain", "sun", "sandstorm", "hail"]) }),
  /** The saved field weather (gSaveBlock1Ptr->weather, what setweather writes), as a WEATHER_* name or number. */
  z.strictObject({ expectFieldWeather: z.union([z.string().regex(/^WEATHER_[A-Z0-9_]+$/), z.number().int().min(0).max(255)]) }),
  z.strictObject({
    /**
     * Checks a battle's summary (battleSummaries in report.json): `battle` is its 0-based index (default: the last
     * battle so far). Fails with the actual summary.
     */
    expectBattleSummary: z.strictObject({
      battle: z.number().int().min(0).optional(),
      outcome: z.enum(["win", "loss"]).optional(),
      minTurns: z.number().int().min(0).optional(),
      maxTurns: z.number().int().min(0).optional(),
      minPlayerFaints: z.number().int().min(0).optional(),
      maxPlayerFaints: z.number().int().min(0).optional(),
      /** true: the battle had an in-game partner (its summary has partnerFaints, foeKOsBy, partnerGuards, partnerHitsAlly). */
      partner: z.boolean().optional(),
      /** Partner battles: your own Pokémon landed at least this many foe KOs (foeKOsBy.player). */
      minPlayerKOs: z.number().int().min(0).optional(),
      /** Partner battles: the partner landed at most this many foe KOs (foeKOsBy.partner). */
      maxPartnerKOs: z.number().int().min(0).optional(),
      /** Partner battles: some partnerGuards entry came by this turn, using `move` (e.g. "REFLECT") when given. */
      guardByTurn: z.strictObject({ move: z.string().min(1).optional(), byTurn: z.number().int().min(0) }).optional(),
      /** Partner battles: at most this many partner moves harmed one of your Pokémon (partnerHitsAlly). */
      maxPartnerHitsAlly: z.number().int().min(0).optional(),
      /** The first foe to faint (foeKOOrder[0]) is this one, by its battle-text name, e.g. "MINUN". */
      firstFoeKO: z.string().min(1).optional(),
      /**
       * Some foe used `move` (battle-text name, e.g. "HELPING HAND") by turn `byTurn` (foeMoveFirstTurn): a use
       * answered by "But it failed!" doesn't count.
       */
      foeMoveByTurn: z.strictObject({ move: z.string().min(1), byTurn: z.number().int().min(0) }).optional(),
    }),
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
  /** Every battle message battleTurns saw, in order (for counting turns and faints in report.json). */
  battleLog?: string[];
  /** One summary per battle in battleLog (summarizeBattles), refreshed after every battleTurns step. */
  battleSummaries?: BattleSummary[];
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

/** A talk transcript without its `[screen: …]`, `[answered …]` and `[sound: …]` markers: the message boxes alone. */
export const messageBoxes = (transcript: readonly string[]) =>
  transcript.filter((b) => !b.startsWith("[screen:") && !b.startsWith("[answered") && !b.startsWith("[sound:"));

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
    result.transcripts.push(await talk(s, opts.maxPresses ?? 200, start, opts.answers ?? [], opts.until === undefined ? undefined : asList(opts.until)));
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

  if ("pokenavCall" in step) {
    const opts = typeof step.pokenavCall === "string" ? { contact: step.pokenavCall } : step.pokenavCall;
    const boxes = await pokenavCall(s, opts.contact, opts.read ?? true, opts.maxPresses ?? 300);
    if (boxes) result.transcripts.push(boxes);
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

  if ("expectBoxCount" in step) {
    const transcript = result.transcripts.at(-1);
    if (!transcript) fail("no talk step ran before this box count");
    const boxes = messageBoxes(transcript);
    if (boxes.length !== step.expectBoxCount) {
      fail(`expected ${step.expectBoxCount} box(es), got ${boxes.length}: ${JSON.stringify(boxes)}`);
    }
    return;
  }

  if ("expectBattleWeather" in step) {
    const got = battleWeatherName(await s.readU16(s.symbols.address("gBattleWeather")));
    if (got !== step.expectBattleWeather) fail(`battle weather is ${got}, expected ${step.expectBattleWeather}`);
    return;
  }

  if ("expectFieldWeather" in step) {
    const sb1 = await s.deref("gSaveBlock1Ptr");
    checkFieldWeather(await s.readU8(sb1 + SAVEBLOCK1_WEATHER), step.expectFieldWeather, (name) => s.constant(name));
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

  if ("expectSound" in step) {
    const { song, maxFrames = 240 } = step.expectSound;
    const header = await songHeaderAddress(s, song);
    let prev = s.seSamples ?? (await sampleSePlayers(s));
    for (let f = 0; ; f++) {
      const cur = await sampleSePlayers(s);
      const player = findSoundStart(prev, cur, header);
      s.seSamples = cur;
      if (player >= 0) {
        const when = f === 0 ? "before this step (since the last sound check)" : `at +${f} frames`;
        result.transcripts.push([`[sound: ${song} started ${when} on ${SE_PLAYERS[player]}]`]);
        return;
      }
      if (f >= maxFrames) fail(`expectSound ${song}: did not start within ${maxFrames} frames`);
      prev = cur;
      await s.run(1);
    }
  }

  if ("expectNoSound" in step) {
    const { song, frames = 240 } = step.expectNoSound;
    const header = await songHeaderAddress(s, song);
    let prev = s.seSamples ?? (await sampleSePlayers(s));
    for (let f = 0; f <= frames; f++) {
      if (f > 0) await s.run(1);
      const cur = await sampleSePlayers(s);
      const player = findSoundStart(prev, cur, header);
      s.seSamples = cur;
      if (player >= 0) {
        const when = f === 0 ? "before this step (since the last sound check)" : `at +${f} frames`;
        fail(`expectNoSound ${song}: it started ${when} on ${SE_PLAYERS[player]}`);
      }
      prev = cur;
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
    await waitForBattleText(s, step.waitForBattleText, step.maxFrames ?? 1800, stale, asList(step.forbid ?? []));
    return;
  }

  if ("battleTurns" in step) {
    const { move, moveFor, target, until, maxTurns = 10, forbid = [], any = false, replace = false, retargetAfter } = step.battleTurns;
    result.battleLog ??= [];
    await battleTurns(s, move, asList(until), maxTurns, asList(forbid), { any, replace, moveFor, target, retargetAfter, log: result.battleLog });
    const hp = (await s.readState()).party.map((mon) => (mon.maxHp ? Math.round((100 * mon.hp) / mon.maxHp) : 0));
    result.battleLog.push(`${PARTY_HP_MARK}${hp.join(",")}]`);
    result.battleSummaries = summarizeBattles(result.battleLog);
    return;
  }

  if ("expectBattleSummary" in step) {
    checkBattleSummary(result.battleSummaries ?? [], step.expectBattleSummary);
    return;
  }

  if ("battleSwitch" in step) {
    await battleSwitch(s, step.battleSwitch.slot, asList(step.battleSwitch.forbid ?? []));
    return;
  }

  if ("chooseHalfParty" in step) {
    await chooseHalfParty(s, step.chooseHalfParty.slots, step.chooseHalfParty.maxFrames ?? 1800);
    return;
  }

  if ("expectBattle" in step) {
    // gBattleMons fills in a few frames after the battle screen appears; until then a second battle
    // in one test still holds the last battle's mons, so wait for the expected ones too.
    const { opponent, level } = step.expectBattle;
    const settled = (b: Awaited<ReturnType<EmulatorSession["readState"]>>["battle"]) => {
      const foe = b?.[1];
      return !!foe && foe.species > 0 && (opponent === undefined || foe.speciesName === opponent) && (level === undefined || foe.level === level);
    };
    let battle = (await s.readState()).battle;
    for (let f = 0; f < 600 && battle && !settled(battle); f += 10) {
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

/** The first of `forbid` that `text` contains, if any. */
const forbidden = (text: string, forbid: readonly string[]) => forbid.find((x) => text.includes(flatten(x)));

/**
 * Taps B until the battle message contains `want` (and differs from
 * `stale`). Battle messages wait for a button; B advances them and does
 * nothing on the action menu, so tapping it while waiting is safe.
 * Fails if a message seen on the way (not `stale`) contains a `forbid` string.
 */
async function waitForBattleText(s: EmulatorSession, want: string, max: number, stale?: string, forbid: readonly string[] = []): Promise<void> {
  let text = "";
  const seen: string[] = [];
  for (let f = 0; f <= max; f += 30) {
    text = await battleText(s);
    if (text.trim() && text !== stale && text !== seen.at(-1)) {
      seen.push(text);
      const bad = forbidden(text, forbid);
      if (bad) fail(`waitForBattleText ${JSON.stringify(want)}: a message showed forbidden ${JSON.stringify(bad)}; seen ${JSON.stringify(seen)}`);
    }
    if (text.includes(flatten(want)) && text !== stale) {
      await s.run(30); // let the menu that follows the message take input
      return;
    }
    await s.press("B", { hold: 2, release: 28 });
  }
  fail(`battle text never showed ${JSON.stringify(want)} in ${max} frames; last ${JSON.stringify(text)}`);
}

/** Move menu cursor moves from slot 1 (top left) to each slot: 1 2 on top, 3 4 below. */
const MOVE_SLOT_PATH: Record<number, Button[]> = { 1: [], 2: ["RIGHT"], 3: ["DOWN"], 4: ["DOWN", "RIGHT"] };

/** battleTurns' move slot for this turn: `moveFor[foe species]` when listed, else the default `move`. */
export function pickMoveSlot(moveFor: Readonly<Record<string, number>> | undefined, speciesName: string | undefined, move: number): number {
  return (speciesName !== undefined ? moveFor?.[speciesName] : undefined) ?? move;
}

/**
 * battleTurns' `retargetAfter`: the target to switch to when `message` contains the rule's text (flattened like
 * every text match), else undefined. Fires once: `fired` means an earlier message already switched it.
 */
export function retargetFor(
  rule: { text: string; target: BattleTarget } | undefined,
  message: string,
  fired: boolean,
): BattleTarget | undefined {
  if (!rule || fired || !flatten(message).includes(flatten(rule.text))) return undefined;
  return rule.target;
}

/** gBattleTypeFlags bit for a double battle (include/constants/battle.h). */
const BATTLE_TYPE_DOUBLE = 1 << 0;
/** Battler ids in a double battle (B_POSITION_*): the player's 0 (left) and 2 (right), the foe's 1 (left) and 3 (right). */
const OPPONENT_LEFT = 1;
const OPPONENT_RIGHT = 3;
/** Offset of s8 slotId in struct PartyMenu (include/party_menu.h: two pointers, a bitfield byte, then slotId). */
export const PARTY_MENU_SLOT_ID = 9;

/**
 * Doubles: the foe battler a single-target move will hit, from gBattleMons HP in battler order.
 * `target`'s side when that foe is standing, else the other foe (the game's own fallback).
 */
export function pickTargetBattler(battleHp: readonly (number | undefined)[], target: BattleTarget = "opponentLeft"): number {
  const [want, other] = target === "opponentRight" ? [OPPONENT_RIGHT, OPPONENT_LEFT] : [OPPONENT_LEFT, OPPONENT_RIGHT];
  return (battleHp[want] ?? 0) <= 0 && (battleHp[other] ?? 0) > 0 ? other : want;
}

/**
 * The send-out party menu's pick: the first healthy Pokémon after the ones on the field (index 1 in singles,
 * where index 0 is the fainted one; index 2 in doubles, where indexes 0-1 are both battlers) and after `after`,
 * before index `end` (partner battles: PARTNER_MENU_BENCH_END). -1 when there is none.
 */
export function pickSendOutIndex(partyHp: readonly number[], doubles: boolean, after = -1, end = partyHp.length): number {
  const first = Math.max(doubles ? 2 : 1, after + 1);
  for (let i = first; i < Math.min(end, partyHp.length); i++) if (partyHp[i] > 0) return i;
  return -1;
}

/** "What will LINOONE do?" → "LINOONE" (the battleLog partner marker must not repeat "What will"). */
const promptName = (text: string) => /What will (.*?) do\?/.exec(text)?.[1] ?? text.replace("What will", "").trim();

const isDoubleBattle = async (s: EmulatorSession) => ((await s.readU32(s.symbols.address("gBattleTypeFlags"))) & BATTLE_TYPE_DOUBLE) !== 0;

/** gBattleTypeFlags bit for an AI partner on the player's side (Steven at the Space Center; include/constants/battle.h). */
export const BATTLE_TYPE_INGAME_PARTNER = 1 << 22;
/** In such a battle gPlayerParty[0..2] are the player's and [3..5] the partner's (FillPartnerParty, MULTI_PARTY_SIZE). */
const MULTI_PARTY_SIZE = 3;
/** gSpeciesNames rows: POKEMON_NAME_LENGTH + 1 bytes (include/constants/global.h). */
const SPECIES_NAME_SIZE = 11;
/**
 * battleLog marker a partner battle's battleTurns writes before its first prompt: who is whose, by the names the
 * battle text prints (no "Foe" prefix on either). summarizeBattle reads it to split faints and KOs by owner.
 */
export const PARTNER_PARTY_MARK = "[in-game partner: ";

const isPartnerBattle = async (s: EmulatorSession) =>
  ((await s.readU32(s.symbols.address("gBattleTypeFlags"))) & BATTLE_TYPE_INGAME_PARTNER) !== 0;

/** The partner marker: `[in-game partner: METANG,SKARMORY,AGGRON; player: SHELGON,LINOONE,WHISCASH]`. */
export const partnerPartyMarker = (partner: readonly string[], player: readonly string[]) =>
  `${PARTNER_PARTY_MARK}${partner.join(",")}; player: ${player.join(",")}]`;

export function parsePartnerPartyMarker(m: string): { partner: string[]; player: string[] } | undefined {
  if (!m.startsWith(PARTNER_PARTY_MARK)) return undefined;
  const [partner, player = ""] = m.slice(PARTNER_PARTY_MARK.length, -1).split("; player: ");
  const names = (s: string) => s.split(",").filter(Boolean);
  return { partner: names(partner), player: names(player) };
}

/**
 * Partner battles: the display names of gPlayerParty[0..2] (the player's) and [3..5] (the partner's), read from
 * gSpeciesNames as the battle text prints them (no nicknames in playtests). Fails if a name is on both sides,
 * since the battle text could not tell their faints and moves apart.
 */
async function readPartnerSides(s: EmulatorSession, label: string): Promise<{ partner: string[]; player: string[] }> {
  // All six slots, not readState's gPlayerPartyCount: the partner's three sit after the player's.
  const layout = await s.getLayout();
  const raw = await s.read(s.symbols.address("gPlayerParty"), 2 * MULTI_PARTY_SIZE * layout.pokemonSize);
  const names = s.symbols.address("gSpeciesNames");
  const player: string[] = [];
  const partner: string[] = [];
  for (let i = 0; i < 2 * MULTI_PARTY_SIZE; i++) {
    const { species } = decodePartyMon(raw.subarray(i * layout.pokemonSize, (i + 1) * layout.pokemonSize), layout);
    if (!species) continue;
    (i < MULTI_PARTY_SIZE ? player : partner).push(await s.readText(names + species * SPECIES_NAME_SIZE, SPECIES_NAME_SIZE));
  }
  checkPartnerSides(label, { partner, player });
  return { partner, player };
}

/** Fails if a display name is on both sides of a partner battle: the battle text could not tell their faints and moves apart. */
export function checkPartnerSides(label: string, sides: { partner: readonly string[]; player: readonly string[] }): void {
  const shared = sides.player.filter((n) => sides.partner.includes(n));
  if (shared.length) fail(`${label}: ${shared.join(", ")} is on both your side and the partner's; the battle text can't tell them apart (pick a different species)`);
}

/**
 * Partner battles' send-out menu (PARTY_LAYOUT_MULTI) lists the party in battle order: your battler, the partner's,
 * your two bench Pokémon (indexes 2-3), the partner's bench (4-5). Picks stop before this index.
 */
export const PARTNER_MENU_BENCH_END = 4;

/** True unless the current battle in `log` (after its last win or loss message) already has a partner marker. */
export function needsPartnerMarker(log: readonly string[]): boolean {
  let lastEnd = -1;
  let lastMark = -1;
  log.forEach((m, i) => {
    if (isWin(m) || isLoss(m)) lastEnd = i;
    if (m.startsWith(PARTNER_PARTY_MARK)) lastMark = i;
  });
  return lastMark < 0 || lastMark < lastEnd;
}

/** True if the player's left battler (0) runs battle_controller_player.c's `fn` right now. */
async function playerLeftControllerIs(s: EmulatorSession, fn: string): Promise<boolean> {
  const want = (s.symbols.address(fn, "src/battle_controller_player.o") & ~1) >>> 0;
  return ((await s.readU32(s.symbols.address("gBattlerControllerFuncs"))) & ~1) >>> 0 === want;
}

/**
 * Partner battles: FIGHT on the player's action menu, pressed only once the menu takes input
 * (HandleInputChooseAction) and repeated until the move menu is open (HandleInputChooseMove). The first prompt
 * after a send-out shows its text before the menu takes input, and a FIGHT pressed then was lost (C391).
 */
async function openFightMenu(s: EmulatorSession, label: string): Promise<void> {
  for (let f = 0; !(await playerLeftControllerIs(s, "HandleInputChooseAction")); f += 10) {
    if (await playerLeftControllerIs(s, "HandleInputChooseMove")) return;
    if (f >= 600) fail(`${label}: the action menu never took input; battle text ${JSON.stringify(await battleText(s))}`);
    await s.run(10);
  }
  for (let tries = 0; ; tries++) {
    // Only on the action menu: an A that lands in the move menu would pick a move.
    if (await playerLeftControllerIs(s, "HandleInputChooseAction")) {
      await s.press("UP");
      await s.press("LEFT");
      await s.press("A");
    }
    for (let f = 0; f < 60; f += 10) {
      if (await playerLeftControllerIs(s, "HandleInputChooseMove")) {
        await s.run(10); // let the move menu draw its text
        return;
      }
      await s.run(10);
    }
    if (tries >= 5) fail(`${label}: FIGHT never opened the move menu; battle text ${JSON.stringify(await battleText(s))}`);
  }
}

/** True if one of the player's battlers (0, 2) runs battle_controller_player.c's `fn` right now. */
async function playerControllerIs(s: EmulatorSession, fn: string): Promise<boolean> {
  const want = (s.symbols.address(fn, "src/battle_controller_player.o") & ~1) >>> 0;
  const funcs = await s.read(s.symbols.address("gBattlerControllerFuncs"), 4 * 4);
  return [0, 2].some((b) => ((funcs.readUInt32LE(b * 4) & ~1) >>> 0) === want);
}

/**
 * Doubles, right after A on a move: if the game opened the target prompt (HandleInputChooseTarget; it prints no
 * text), answer it. The cursor starts on opponent-left, or opponent-right when the left is gone; for
 * "opponentRight" LEFT moves it there (sTargetIdentities order), checked with gMultiUsePlayerCursor.
 */
async function answerTargetPrompt(s: EmulatorSession, target: BattleTarget, label: string, log?: string[]): Promise<void> {
  if (!(await playerControllerIs(s, "HandleInputChooseTarget"))) return; // spread or self move, or one foe left
  const cursor = s.symbols.address("gMultiUsePlayerCursor");
  if (target === "opponentRight") {
    const battle = (await s.readState()).battle;
    if ((battle?.[OPPONENT_RIGHT]?.hp ?? 0) > 0) {
      if ((await s.readU8(cursor)) !== OPPONENT_RIGHT) await s.press("LEFT");
      const got = await s.readU8(cursor);
      if (got !== OPPONENT_RIGHT) fail(`${label}: target prompt cursor is on battler ${got} after LEFT, expected opponent-right (${OPPONENT_RIGHT})`);
      log?.push("[target opponentRight]");
    }
  }
  await s.press("A");
}

/**
 * Logs a new battle message. Partner battles (C395, foeHitsBySide) first log a BATTLER_HP_MARK when any battler's
 * species or HP changed since the last one, so the HP a move took sits between its "used" message and the next.
 */
async function logBattleMessage(s: EmulatorSession, log: string[] | undefined, text: string, partner: boolean): Promise<void> {
  if (!log) return;
  if (partner) {
    const layout = await s.getLayout();
    const count = Math.min(await s.readU8(s.symbols.address("gBattlersCount")), 4);
    const raw = await s.read(s.symbols.address("gBattleMons"), count * layout.battlePokemonSize);
    const mons = Array.from({ length: count }, (_, i) => decodeBattleMon(raw.subarray(i * layout.battlePokemonSize), layout));
    const mark = battlerHpMarker(mons);
    if (mark !== lastBattlerHpMarker(log)) log.push(mark);
  }
  log.push(text);
}

/** The current battle's last BATTLER_HP_MARK (none before this battle's partner marker). */
function lastBattlerHpMarker(log: readonly string[]): string | undefined {
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].startsWith(BATTLER_HP_MARK)) return log[i];
    if (log[i].startsWith(PARTNER_PARTY_MARK)) return undefined;
  }
  return undefined;
}

/** battleTurns: the most frames one turn may take, however many messages it shows. */
const TURN_FRAME_CAP = 14400;

/**
 * battleTurns' start: taps B to the next "What will" like waitForBattleText, logging the messages on the way
 * (the rest of a turn an earlier battleTurns stopped in) and checking `forbid`. With `replace`, a faint in that
 * rest of the turn gets its send-out instead of stalling on the party menu.
 */
async function finishTurn(s: EmulatorSession, label: string, doubles: boolean, replace: boolean, forbid: readonly string[], log?: string[], partner = false): Promise<void> {
  let text = "";
  // The message an earlier battleTurns stopped on is still showing and already logged.
  const seen = [...(log ?? []).filter((m) => !m.startsWith("[")).slice(-1)];
  const stale = seen.length;
  for (let f = 0; f <= 3600; f += 30) {
    const cb = (await s.callbacks()).callback2;
    if (replace && cb !== "BattleMainCB2" && cb !== "CB2_Overworld") {
      log?.push(`[sent out party menu slot ${await sendOutNext(s, label, doubles, partner)}]`);
      continue;
    }
    text = await battleText(s);
    if (text.includes("What will")) {
      await s.run(30); // let the menu that follows the message take input
      return;
    }
    if (text.trim() && text !== seen.at(-1)) {
      seen.push(text);
      await logBattleMessage(s, log, text, partner);
      const bad = forbidden(text, forbid);
      if (bad) fail(`${label}: the turn it started in showed forbidden ${JSON.stringify(bad)}; seen ${JSON.stringify(seen.slice(stale))}`);
    }
    await s.press("B", { hold: 2, release: 28 });
  }
  fail(`${label}: battle text never showed "What will" in 3600 frames; last ${JSON.stringify(text)}`);
}

/**
 * battleTurns: each turn FIGHT → move slot `move`, then B through the turn, until every
 * `until` string has shown in some message. Returns right after the message that completes
 * the set (mid-turn), so a following waitForBattleText or battleTurns picks up from there.
 * In a double battle the second battler's action menu (a new "What will … do?") gets the same
 * choice, logged as `[partner NAME]` so the turn is counted once, and target prompts are answered.
 */
async function battleTurns(
  s: EmulatorSession,
  move: number,
  until: readonly string[],
  maxTurns: number,
  forbid: readonly string[],
  opts: {
    any?: boolean;
    replace?: boolean;
    moveFor?: Record<string, number>;
    target?: BattleTarget;
    retargetAfter?: { text: string; target: BattleTarget };
    log?: string[];
  } = {},
): Promise<void> {
  const label = `battleTurns move ${move}`;
  const seen: string[] = [];
  const missing = () => {
    const left = until.filter((u) => !seen.some((m) => m.includes(flatten(u))));
    return opts.any && left.length < until.length ? [] : left;
  };
  const doubles = await isDoubleBattle(s);
  // An in-game partner (Steven) is the player's right battler: one player prompt per turn, the AI picks for him.
  const partner = doubles && (await isPartnerBattle(s));
  if (partner && opts.log && needsPartnerMarker(opts.log)) {
    const sides = await readPartnerSides(s, label);
    opts.log.push(partnerPartyMarker(sides.partner, sides.player));
  }
  await finishTurn(s, label, doubles, opts.replace ?? false, forbid, opts.log, partner);
  // `let`: retargetAfter switches it mid-battle, and fight() reads the current value each time it runs.
  let target: BattleTarget = opts.target ?? "opponentLeft";
  let retargeted = false;
  /** FIGHT → this turn's slot for the battler whose action menu is open; returns the move menu's text. */
  const fight = async (): Promise<{ slot: number; menu: string }> => {
    let slot = move;
    if (opts.moveFor) {
      const battle = (await s.readState()).battle;
      const foe = battle?.[doubles ? pickTargetBattler(battle.map((m) => m.hp), target) : 1]?.speciesName;
      slot = pickMoveSlot(opts.moveFor, foe, move);
      opts.log?.push(`[moveFor ${foe} → slot ${slot}]`);
    }
    // FIGHT is top left: UP then LEFT reaches it from any action, and slot 1 from any move.
    if (partner) await openFightMenu(s, label);
    else {
      await s.press("UP");
      await s.press("LEFT");
      await s.press("A");
      await s.run(30);
    }
    await s.press("UP");
    await s.press("LEFT");
    for (const b of MOVE_SLOT_PATH[slot]) await s.press(b);
    const menu = await battleText(s);
    await s.press("A");
    if (doubles) await answerTargetPrompt(s, target, label, opts.log);
    return { slot, menu };
  };
  for (let turn = 1; turn <= maxTurns; turn++) {
    const prompt = await battleText(s);
    await logBattleMessage(s, opts.log, prompt, partner); // the "What will … do?" prompt: summarizeBattle counts these as turns
    let { slot, menu } = await fight();
    let partnerDone = !doubles || partner;
    // B in the move menu would cancel the choice: wait for the turn's first message before tapping it.
    let text = await battleText(s);
    for (let f = 0; text.includes("What will") || text === menu; f += 10) {
      if (!partnerDone && text.includes("What will") && text !== prompt) {
        // Doubles: the second battler's action menu.
        partnerDone = true;
        opts.log?.push(`[partner ${promptName(text)}]`);
        await s.run(30); // let the action menu take input
        ({ slot, menu } = await fight());
        f = -10;
        text = await battleText(s);
        continue;
      }
      if (f >= 600) {
        const twin = doubles && !partnerDone ? " In a double battle this also happens when both of your battlers share a display name." : "";
        fail(`${label}: turn ${turn} never started (is slot ${slot} empty, or out of PP?); battle text ${JSON.stringify(text)}.${twin}`);
      }
      await s.run(10);
      text = await battleText(s);
    }
    // The stall clock restarts at each new message: a doubles turn with two faints, EXP and send-outs runs past
    // 3600 frames on its own (C389 Y7-GROUND turn 4); TURN_FRAME_CAP still bounds a turn that never settles.
    for (let f = 0, idle = 0; ; f += 30, idle += 30) {
      const cb = (await s.callbacks()).callback2;
      if (cb !== "BattleMainCB2" && opts.replace && cb !== "CB2_Overworld") {
        const sent = await sendOutNext(s, label, doubles, partner);
        seen.push(`[sent out party menu slot ${sent}]`);
        opts.log?.push(seen.at(-1)!);
        continue;
      }
      if (cb !== "BattleMainCB2") {
        fail(`${label}: battle ended before ${JSON.stringify(missing())} showed; seen ${JSON.stringify(seen)}`);
      }
      text = await battleText(s);
      if (text.includes("What will")) break; // the next turn's action menu
      if (text.trim() && text !== seen.at(-1)) {
        idle = 0;
        seen.push(text);
        await logBattleMessage(s, opts.log, text, partner);
        const bad = forbidden(text, forbid);
        if (bad) fail(`${label}: turn ${turn} showed forbidden ${JSON.stringify(bad)}; seen ${JSON.stringify(seen)}`);
        const next = retargetFor(opts.retargetAfter, text, retargeted);
        if (next) {
          target = next;
          retargeted = true;
          opts.log?.push(`[retarget ${target} after turn ${turn}]`);
        }
        if (missing().length === 0) {
          await s.run(30);
          return;
        }
      }
      if (idle >= 3600) fail(`${label}: turn ${turn} showed no new message for 3600 frames; seen ${JSON.stringify(seen.slice(-12))}`);
      if (f >= TURN_FRAME_CAP) fail(`${label}: turn ${turn} still running after ${TURN_FRAME_CAP} frames; seen ${JSON.stringify(seen.slice(-12))}`);
      await s.press("B", { hold: 2, release: 28 });
    }
    await s.run(30); // let the action menu take input
  }
  fail(`${label}: after ${maxTurns} turn(s) still missing ${JSON.stringify(missing())}; last messages ${JSON.stringify(seen.slice(-12))}`);
}

/**
 * After a faint the game opens the party menu itself (B can't close it). While it is open gPlayerParty is in the
 * menu's order (UpdatePartyToBattleOrder), with the fainted Pokémon on slot 1. Picks the first healthy one below it,
 * then SEND OUT, and waits for the battle. Returns the 1-based menu slot it sent out.
 * Doubles: slots 1-2 are both battlers, so it picks from slot 3 on, moving the cursor until gPartyMenu.slotId is
 * there. When two of yours faint in one turn the second menu refuses the first one's pick ("already been
 * selected"); it then dismisses the message and takes the next healthy one.
 */
async function sendOutNext(s: EmulatorSession, label: string, doubles = false, partner = false): Promise<number> {
  for (let f = 0; !(await s.callbacks()).callback2.startsWith("CB2_UpdatePartyMenu"); f += 10) {
    if (f >= 600) fail(`${label}: left the battle screen but no party menu opened (callback2 ${(await s.callbacks()).callback2})`);
    await s.run(10);
  }
  await s.run(60); // let the party menu fade in and take input
  const partyHp = (await s.readState()).party.map((mon) => mon.hp);
  // Partner battles (PARTY_LAYOUT_MULTI, battle order 0,3,1,2,4,5): menu slots 3-4 are your bench, 2/5-6 the partner's.
  const end = partner ? PARTNER_MENU_BENCH_END : partyHp.length;
  let index = pickSendOutIndex(partyHp, doubles, -1, end);
  if (index < 0) fail(`${label}: the send-out party menu opened with no healthy Pokémon to pick`);
  if (!doubles) {
    for (let i = 0; i < index; i++) await s.press("DOWN");
    await s.press("A"); // opens SEND OUT / SUMMARY / CANCEL, SEND OUT first
    await s.run(20);
    await s.press("A");
    for (let f = 0; (await s.callbacks()).callback2 !== "BattleMainCB2"; f += 10) {
      if (f >= 600) fail(`${label}: never returned to battle after sending out menu slot ${index + 1}`);
      await s.run(10);
    }
    return index + 1;
  }
  const slotId = s.symbols.address("gPartyMenu") + PARTY_MENU_SLOT_ID;
  const message = s.symbols.address("gStringVar4");
  for (;;) {
    for (let i = 0; ; i++) {
      const at = await s.readU8(slotId);
      if (at === index) break;
      if (i >= 12) fail(`${label}: the doubles party menu cursor is on slot ${at + 1}, not ${index + 1}, after ${i} presses`);
      await s.press(at < index || at > 5 ? "DOWN" : "UP");
    }
    await s.write(message, Uint8Array.of(0xff)); // a refusal prints into gStringVar4
    await s.press("A"); // opens SEND OUT / SUMMARY / CANCEL, SEND OUT first
    await s.run(20);
    await s.press("A");
    let refused = false;
    for (let f = 0; (await s.callbacks()).callback2 !== "BattleMainCB2"; f += 10) {
      if (f >= 600) fail(`${label}: never returned to battle after sending out menu slot ${index + 1}`);
      if (f >= 60 && (await s.readText(message, 60)).trim()) {
        refused = true;
        break;
      }
      await s.run(10);
    }
    if (!refused) return index + 1;
    const why = flatten(await s.readText(message, 60));
    await s.press("B", { hold: 2, release: 28 }); // dismiss the message; the menu is back on the party list
    await s.run(30);
    const next = pickSendOutIndex(partyHp, true, index, end);
    if (next < 0) fail(`${label}: the send-out menu refused slot ${index + 1} (${JSON.stringify(why)}) and no other healthy Pokémon is left`);
    index = next;
  }
}

/**
 * battleSwitch: at the next "What will" action menu pick POKéMON (bottom left of
 * FIGHT / BAG / POKéMON / RUN), move the party menu cursor from slot 1 down to
 * `slot` (party position, 1-based), choose SHIFT, then tap B through the turn until
 * the next "What will" (returns there). Fails if the party menu never opens or closes,
 * if the battle ends during the turn, or if a message shows a `forbid` string.
 */
async function battleSwitch(s: EmulatorSession, slot: number, forbid: readonly string[]): Promise<void> {
  const label = `battleSwitch slot ${slot}`;
  await waitForBattleText(s, "What will", 1800);
  await s.press("DOWN");
  await s.press("LEFT");
  await s.press("A");
  let cb = (await s.callbacks()).callback2;
  for (let f = 0; cb === "BattleMainCB2"; f += 10) {
    if (f >= 300) fail(`${label}: the party menu never opened (callback2 ${cb}; battle text ${JSON.stringify(await battleText(s))})`);
    await s.run(10);
    cb = (await s.callbacks()).callback2;
  }
  await s.run(60); // let the party menu fade in and take input
  for (let i = 1; i < slot; i++) await s.press("DOWN");
  await s.press("A"); // opens SHIFT / SUMMARY / CANCEL, SHIFT first
  await s.run(20);
  await s.press("A");
  for (let f = 0; cb !== "BattleMainCB2"; f += 10) {
    if (f >= 600) fail(`${label}: never returned to battle (callback2 ${cb}); is slot ${slot} empty, fainted or already out?`);
    await s.run(10);
    cb = (await s.callbacks()).callback2;
  }
  const seen: string[] = [];
  let text = await battleText(s);
  // The action menu's "What will" may still be the displayed string until the switch message prints.
  const stale = text;
  for (let f = 0; ; f += 30) {
    if ((await s.callbacks()).callback2 !== "BattleMainCB2") fail(`battleSwitch: battle ended during the switch turn; seen ${JSON.stringify(seen)}`);
    text = await battleText(s);
    if (text.includes("What will") && text !== stale) {
      await s.run(30); // let the action menu take input
      return;
    }
    if (text.trim() && text !== stale && text !== seen.at(-1)) {
      seen.push(text);
      const bad = forbidden(text, forbid);
      if (bad) fail(`${label}: the switch turn showed forbidden ${JSON.stringify(bad)}; seen ${JSON.stringify(seen)}`);
    }
    if (f >= 3600) fail(`${label}: switch turn still running after 3600 frames; seen ${JSON.stringify(seen.slice(-12))}`);
    await s.press("B", { hold: 2, release: 28 });
  }
}

/** Offset of the `menuType:4, layout:2` bitfield byte in struct PartyMenu (include/party_menu.h: two pointers, then it). */
export const PARTY_MENU_TYPE_BYTE = 8;
/** PARTY_MENU_TYPE_CHOOSE_HALF (include/constants/party_menu.h; a unit test checks). */
export const PARTY_MENU_TYPE_CHOOSE_HALF = 4;
/** gPartyMenu.slotId of CONFIRM in the choose-half menu (PARTY_SIZE; CANCEL is PARTY_SIZE + 1). */
export const PARTY_MENU_CONFIRM = 6;

/**
 * Party menu, single layout (src/party_menu.c UpdatePartySelectionSingleLayout): DOWN walks 0 → … → last mon →
 * CONFIRM (6) → CANCEL (7) → 0, UP walks back, so DOWN reaches a higher slotId and UP a lower one.
 */
export const partyCursorButton = (at: number, want: number): Button => (at < want ? "DOWN" : "UP");

/**
 * chooseHalfParty: in the choose-half party menu, ENTER each 1-based party slot in order (the submenu is
 * ENTER / SUMMARY / CANCEL, ENTER first; the third ENTER moves the cursor to CONFIRM itself), checking
 * gSelectedOrderFromParty after each, then CONFIRM and wait for the battle screen.
 */
async function chooseHalfParty(s: EmulatorSession, slots: readonly number[], maxFrames: number): Promise<void> {
  const label = `chooseHalfParty ${slots.join(",")}`;
  for (let f = 0; !(await s.callbacks()).callback2.startsWith("CB2_UpdatePartyMenu"); f += 10) {
    if (f >= 600) fail(`${label}: no party menu opened (callback2 ${(await s.callbacks()).callback2}); talk to the partner and answer YES first`);
    await s.run(10);
  }
  await s.run(60); // let the party menu fade in and take input
  const menu = s.symbols.address("gPartyMenu");
  const type = (await s.readU8(menu + PARTY_MENU_TYPE_BYTE)) & 0xf;
  if (type !== PARTY_MENU_TYPE_CHOOSE_HALF) fail(`${label}: the party menu is type ${type}, not the choose-half menu (${PARTY_MENU_TYPE_CHOOSE_HALF})`);
  const count = await s.readU8(s.symbols.address("gPlayerPartyCount"));
  const order = s.symbols.address("gSelectedOrderFromParty");
  const moveTo = async (want: number) => {
    for (let i = 0; ; i++) {
      const at = await s.readU8(menu + PARTY_MENU_SLOT_ID);
      if (at === want) return;
      if (i >= 12) fail(`${label}: the party menu cursor is on slotId ${at}, not ${want}, after ${i} presses`);
      await s.press(partyCursorButton(at, want));
    }
  };
  for (const [k, slot] of slots.entries()) {
    if (slot > count) fail(`${label}: party slot ${slot} is empty (the party has ${count})`);
    await moveTo(slot - 1);
    await s.press("A"); // opens ENTER / SUMMARY / CANCEL
    await s.run(20);
    await s.press("A"); // ENTER
    await s.run(20);
    const picked = [...(await s.read(order, slots.length))];
    if (picked[k] !== slot) fail(`${label}: ENTER on slot ${slot} did not register (gSelectedOrderFromParty ${JSON.stringify(picked)}); is it fainted or an egg?`);
  }
  await moveTo(PARTY_MENU_CONFIRM);
  await s.press("A");
  let cb = (await s.callbacks()).callback2;
  for (let f = 0; cb !== "BattleMainCB2"; f += 10) {
    if (f >= maxFrames) {
      const why = cb.startsWith("CB2_UpdatePartyMenu") ? `the menu refused CONFIRM (${JSON.stringify(flatten(await s.readText("gStringVar4", 120)))})` : `callback2 ${cb}`;
      fail(`${label}: the party menu did not close into a battle within ${maxFrames} frames; ${why}`);
    }
    await s.run(10);
    cb = (await s.callbacks()).callback2;
  }
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

export interface BattleSummary {
  index: number;
  outcome: "win" | "loss" | "unknown";
  /** "What will … do?" prompts battleTurns answered. */
  turns: number;
  /** "X fainted!" for the player; "Foe X fainted!" / "Wild X fainted!" for the opponent. */
  playerFaints: number;
  opponentFaints: number;
  /** Foe names in the order they fainted ("Foe MINUN fainted!" → "MINUN"; wild ones too). */
  foeKOOrder: string[];
  /** The turn (prompts so far) of each foeKOOrder faint, same order. */
  foeKOTurns: number[];
  /** Each foe move (battle-text name) → the first turn a foe used it; a use followed by "But it failed!" doesn't count. */
  foeMoveFirstTurn: Record<string, number>;
  /** Party HP % (party order) read when the battle's last battleTurns step returned. */
  playerEndHpPercent?: number[];
  /** Player faints keyed "FOE/MOVE" by the last "Foe X used MOVE!" before each faint ("?" if none); chip damage (Leech Seed, poison) counts toward that last move. */
  faintCauses?: Record<string, number>;
  /**
   * In-game partner battles only (the log has a PARTNER_PARTY_MARK). The partner's faints ("METANG fainted!"), which
   * playerFaints and faintCauses leave out.
   */
  partnerFaints?: number;
  /** Each "Foe X fainted!" credited to whoever of your side used a move last before it ("unknown" if nobody had yet). */
  foeKOsBy?: { player: number; partner: number; unknown?: number };
  /** The partner's REFLECT / LIGHT SCREEN / PROTECT, with the turn (prompts so far) they came in. */
  partnerGuards?: { turn: number; message: string }[];
  /** Partner moves followed, before the next move or prompt, by a status or stat drop on one of YOUR Pokémon (e.g. TOXIC → "SHELGON was badly poisoned!"). */
  partnerHitsAlly?: number;
  /**
   * Partner battles with BATTLER_HP_MARK lines in the log (C395): each damaging foe move, keyed by the foe's name as the
   * battle text prints it ("RHYDON"), counted by the side it took HP from: "player" = your battler (0), "partner" = the
   * partner's (2). A spread move (ROCK SLIDE) that hits both counts once for each side. Read from gBattleMons HP drops
   * between "Foe X used Y!" and the next move, prompt or residual-damage message, so misses, immunities and
   * Substitute hits don't count.
   */
  foeHitsBySide?: Record<string, { player: number; partner: number }>;
}

/** battleLog marker battleTurns appends with the party's HP % when it returns. */
const PARTY_HP_MARK = "[party hp% ";
/**
 * battleLog marker a partner battle writes before a new message when any battler's HP changed since the last one:
 * `[battlers 112:85,376:120,375:0,229:96]` = species:hp per battler in gBattleMons order. foeHitsBySide reads it.
 */
export const BATTLER_HP_MARK = "[battlers ";
export const battlerHpMarker = (mons: readonly { species: number; hp: number }[]) =>
  `${BATTLER_HP_MARK}${mons.map((m) => `${m.species}:${m.hp}`).join(",")}]`;
export function parseBattlerHpMarker(m: string): { species: number; hp: number }[] | undefined {
  if (!m.startsWith(BATTLER_HP_MARK)) return undefined;
  return m.slice(BATTLER_HP_MARK.length, -1).split(",").map((x) => {
    const [species, hp] = x.split(":").map(Number);
    return { species, hp };
  });
}
/** Battler ids of your side in a partner battle: yours on the left (0), the partner's on the right (2). */
const SIDE_OF_BATTLER: Record<number, "player" | "partner"> = { 0: "player", 2: "partner" };
/** Messages after which an HP drop is no longer the last foe move's (end-of-turn and status damage, battle_message.c). */
const RESIDUAL_DAMAGE = /(hurt by|buffeted by|pelted by|sapped by|hurt itself|is hurt|afflicted by|locked in a nightmare|restored|regained)/;
const isWin = (m: string) => /\bdefeated\b/.test(m);
const isLoss = (m: string) => m.includes("whited out") || m.includes("out of usable");

/** The partner moves partnerGuards lists. */
const PARTNER_GUARD_MOVES = ["REFLECT", "LIGHT SCREEN", "PROTECT"];
/** Status and stat-drop messages partnerHitsAlly looks for on your Pokémon (battle text, src/battle_message.c). */
const ALLY_HARM = /(was poisoned|badly poisoned|was burned|is paralyzed|was paralyzed|fell asleep|became confused|was frozen|fell!$)/;
const isFoe = (m: string) => /^(Foe|Wild) /.test(m);

/** Counts one battle's turns, faints and outcome from its battleLog messages. */
export function summarizeBattle(log: readonly string[], index = 0): BattleSummary {
  const sides = log.map(parsePartnerPartyMarker).filter((x) => x !== undefined).at(-1);
  const partnerNames = new Set(sides?.partner ?? []);
  const isPartnerFaint = (m: string) => !isFoe(m) && partnerNames.has(/^(.*) fainted!$/.exec(m)?.[1] ?? "");
  const fainted = log.map((m) => m.trim()).filter((m) => m.endsWith("fainted!"));
  const opponentFaints = fainted.filter(isFoe).length;
  const partnerFaints = fainted.filter(isPartnerFaint).length;
  const hp = log.filter((m) => m.startsWith(PARTY_HP_MARK)).at(-1);
  const faintCauses: Record<string, number> = {};
  let lastFoeMove: string | undefined;
  for (const m of log.map((x) => x.trim())) {
    const used = /^Foe (\S+) used (.+?)!$/.exec(m);
    if (used) lastFoeMove = `${used[1]}/${used[2]}`;
    else if (m.endsWith("fainted!") && !isFoe(m) && !isPartnerFaint(m)) faintCauses[lastFoeMove ?? "?"] = (faintCauses[lastFoeMove ?? "?"] ?? 0) + 1;
  }
  const playerFaints = fainted.length - opponentFaints - partnerFaints;
  return {
    index,
    outcome: log.some(isLoss) ? "loss" : log.some(isWin) ? "win" : "unknown",
    turns: log.filter((m) => m.includes("What will")).length,
    playerFaints,
    opponentFaints,
    ...summarizeFoeTurns(log),
    ...(hp &&{ playerEndHpPercent: hp.slice(PARTY_HP_MARK.length, -1).split(",").map(Number) }),
    ...(playerFaints > 0 && { faintCauses }),
    ...(sides && { partnerFaints, ...summarizePartner(log, sides) }),
  };
}

/** foeKOOrder, foeKOTurns and foeMoveFirstTurn (see BattleSummary): turn = "What will" prompts so far. */
export function summarizeFoeTurns(log: readonly string[]): Pick<BattleSummary, "foeKOOrder" | "foeKOTurns" | "foeMoveFirstTurn"> {
  const foeKOOrder: string[] = [];
  const foeKOTurns: number[] = [];
  const foeMoveFirstTurn: Record<string, number> = {};
  let turn = 0;
  /** The last foe move, until the next message shows whether it failed. */
  let pending: string | undefined;
  for (const m of log.map((x) => x.trim())) {
    if (m.startsWith("[")) continue; // harness markers ([party hp% …], [partner …], [battlers …])
    if (pending !== undefined && m !== "But it failed!") foeMoveFirstTurn[pending] ??= turn;
    pending = undefined;
    if (m.includes("What will")) turn++;
    const used = /^Foe .+? used (.+?)!$/.exec(m);
    if (used) pending = used[1];
    const ko = /^(?:Foe|Wild) (.+) fainted!$/.exec(m);
    if (ko) {
      foeKOOrder.push(ko[1]);
      foeKOTurns.push(turn);
    }
  }
  if (pending !== undefined) foeMoveFirstTurn[pending] ??= turn;
  return { foeKOOrder, foeKOTurns, foeMoveFirstTurn };
}

/** The partner-battle fields of a summary: foeKOsBy, partnerGuards, partnerHitsAlly (see BattleSummary). */
export function summarizePartner(
  log: readonly string[],
  sides: { partner: readonly string[]; player: readonly string[] },
): Required<Pick<BattleSummary, "foeKOsBy" | "partnerGuards" | "partnerHitsAlly">> & Pick<BattleSummary, "foeHitsBySide"> {
  const foeKOsBy: { player: number; partner: number; unknown?: number } = { player: 0, partner: 0 };
  const partnerGuards: { turn: number; message: string }[] = [];
  let partnerHitsAlly = 0;
  let turn = 0;
  let lastUser: "player" | "partner" | undefined;
  /** A partner move whose messages are still showing and haven't hit one of yours yet. */
  let partnerMoveOpen = false;
  const foeHitsBySide: Record<string, { player: number; partner: number }> = {};
  let sawHpMark = false;
  let lastHp: { species: number; hp: number }[] | undefined;
  /** The foe move whose HP drops are being collected, and the sides it has hit so far. */
  let foeMove: { foe: string; hit: Set<"player" | "partner"> } | undefined;
  const closeFoeMove = () => {
    if (foeMove?.hit.size) {
      const row = (foeHitsBySide[foeMove.foe] ??= { player: 0, partner: 0 });
      for (const side of foeMove.hit) row[side]++;
    }
    foeMove = undefined;
  };
  for (const m of log.map((x) => x.trim())) {
    const hp = parseBattlerHpMarker(m);
    if (hp) {
      sawHpMark = true;
      if (foeMove && lastHp) {
        for (const [b, side] of Object.entries(SIDE_OF_BATTLER)) {
          const was = lastHp[Number(b)];
          const now = hp[Number(b)];
          if (was && now && was.species === now.species && now.hp < was.hp) foeMove.hit.add(side);
        }
      }
      lastHp = hp;
      continue;
    }
    if (m.includes("What will") || RESIDUAL_DAMAGE.test(m)) closeFoeMove();
    if (m.includes("What will")) {
      turn++;
      partnerMoveOpen = false;
      continue;
    }
    const used = /^(.+?) used (.+?)!$/.exec(m);
    if (used) {
      partnerMoveOpen = false;
      closeFoeMove();
      if (isFoe(m)) {
        foeMove = { foe: used[1].replace(/^Foe /, ""), hit: new Set() };
        continue;
      }
      const mine = sides.partner.includes(used[1]);
      lastUser = mine ? "partner" : "player";
      partnerMoveOpen = mine;
      if (mine && PARTNER_GUARD_MOVES.includes(used[2])) partnerGuards.push({ turn, message: m });
      continue;
    }
    if (isFoe(m) && m.endsWith("fainted!")) {
      if (lastUser) foeKOsBy[lastUser]++;
      else foeKOsBy.unknown = (foeKOsBy.unknown ?? 0) + 1;
      continue;
    }
    if (partnerMoveOpen && ALLY_HARM.test(m) && sides.player.some((n) => m.startsWith(`${n} `) || m.startsWith(`${n}'s `))) {
      partnerHitsAlly++;
      partnerMoveOpen = false;
    }
  }
  closeFoeMove();
  return { foeKOsBy, partnerGuards, partnerHitsAlly, ...(sawHpMark && { foeHitsBySide }) };
}

/**
 * Splits battleLog into battles: a new one starts at the first "What will" prompt (or a partner battle's
 * PARTNER_PARTY_MARK, written just before it) after a win or loss message.
 */
export function summarizeBattles(log: readonly string[]): BattleSummary[] {
  const battles: string[][] = [[]];
  for (const m of log) {
    const cur = battles.at(-1)!;
    if ((m.includes("What will") || m.startsWith(PARTNER_PARTY_MARK)) && cur.some((x) => isWin(x) || isLoss(x))) battles.push([m]);
    else cur.push(m);
  }
  return battles.filter((b) => b.length).map((b, i) => summarizeBattle(b, i));
}

type SummaryBounds = {
  battle?: number;
  outcome?: "win" | "loss";
  minTurns?: number;
  maxTurns?: number;
  minPlayerFaints?: number;
  maxPlayerFaints?: number;
  partner?: boolean;
  minPlayerKOs?: number;
  maxPartnerKOs?: number;
  guardByTurn?: { move?: string; byTurn: number };
  maxPartnerHitsAlly?: number;
  firstFoeKO?: string;
  foeMoveByTurn?: { move: string; byTurn: number };
};

/** expectBattleSummary: fails, printing the summary, unless the chosen battle (default: the last) meets every bound. */
export function checkBattleSummary(summaries: readonly BattleSummary[], want: SummaryBounds): void {
  const got = summaries[want.battle ?? summaries.length - 1];
  if (!got) fail(`expectBattleSummary: no battle ${want.battle ?? "(last)"}; battleTurns logged ${summaries.length} battle(s)`);
  const bad = [
    want.outcome !== undefined && got.outcome !== want.outcome && `outcome ${got.outcome}, expected ${want.outcome}`,
    want.minTurns !== undefined && got.turns < want.minTurns && `${got.turns} turns < minTurns ${want.minTurns}`,
    want.maxTurns !== undefined && got.turns > want.maxTurns && `${got.turns} turns > maxTurns ${want.maxTurns}`,
    want.minPlayerFaints !== undefined && got.playerFaints < want.minPlayerFaints && `${got.playerFaints} player faints < min ${want.minPlayerFaints}`,
    want.maxPlayerFaints !== undefined && got.playerFaints > want.maxPlayerFaints && `${got.playerFaints} player faints > max ${want.maxPlayerFaints}`,
    want.partner !== undefined && (got.foeKOsBy !== undefined) !== want.partner && (want.partner ? "no in-game partner summary (partnerFaints, foeKOsBy, …)" : "an in-game partner summary, expected none"),
    want.firstFoeKO !== undefined && got.foeKOOrder[0] !== want.firstFoeKO && `first foe KO ${got.foeKOOrder[0] ?? "(none)"}, expected ${want.firstFoeKO}`,
    want.foeMoveByTurn !== undefined &&
      !((got.foeMoveFirstTurn[want.foeMoveByTurn.move] ?? Infinity) <= want.foeMoveByTurn.byTurn) &&
      `no foe ${want.foeMoveByTurn.move} by turn ${want.foeMoveByTurn.byTurn} (first: turn ${got.foeMoveFirstTurn[want.foeMoveByTurn.move] ?? "never"})`,
    ...partnerBounds(got, want),
  ].filter(Boolean);
  if (bad.length) fail(`expectBattleSummary: ${bad.join("; ")}; summary ${JSON.stringify(got)}`);
}

/** The partner-only bounds of expectBattleSummary (minPlayerKOs, maxPartnerKOs, guardByTurn, maxPartnerHitsAlly). */
function partnerBounds(got: BattleSummary, want: SummaryBounds): (string | false)[] {
  const asked = ["minPlayerKOs", "maxPartnerKOs", "guardByTurn", "maxPartnerHitsAlly"].filter((k) => want[k as keyof SummaryBounds] !== undefined);
  if (!asked.length) return [];
  const { foeKOsBy, partnerGuards, partnerHitsAlly } = got;
  if (!foeKOsBy || !partnerGuards || partnerHitsAlly === undefined) return [`${asked.join(", ")}: no in-game partner summary`];
  const g = want.guardByTurn;
  return [
    want.minPlayerKOs !== undefined && foeKOsBy.player < want.minPlayerKOs && `${foeKOsBy.player} player KOs < minPlayerKOs ${want.minPlayerKOs}`,
    want.maxPartnerKOs !== undefined && foeKOsBy.partner > want.maxPartnerKOs && `${foeKOsBy.partner} partner KOs > maxPartnerKOs ${want.maxPartnerKOs}`,
    g !== undefined &&
      !partnerGuards.some((x) => x.turn <= g.byTurn && (g.move === undefined || x.message.includes(`used ${g.move}!`))) &&
      `no partner ${g.move ?? "guard"} by turn ${g.byTurn}`,
    want.maxPartnerHitsAlly !== undefined && partnerHitsAlly > want.maxPartnerHitsAlly && `${partnerHitsAlly} partner hits on yours > maxPartnerHitsAlly ${want.maxPartnerHitsAlly}`,
  ];
}

/** Offsets of pos and location in struct SaveBlock1 (include/global.h marks them; a unit test checks). */
export const SAVEBLOCK1_POS = 0x00;
export const SAVEBLOCK1_LOCATION = 0x04;
/** Offset of u8 weather in struct SaveBlock1 (include/global.h marks it 0x2E; a unit test checks). */
export const SAVEBLOCK1_WEATHER = 0x2e;

/** expectFieldWeather: fails unless the saved weather id `got` is `want` (a number, or a WEATHER_* name for `resolve`). */
export function checkFieldWeather(got: number, want: string | number, resolve: (name: string) => number): void {
  const id = typeof want === "number" ? want : resolve(want);
  if (got !== id) fail(`field weather is ${got}, expected ${want} (${id})`);
}
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

/** talk `until`: true once the shown message box contains one of the substrings (compared like expectText). */
export const talkStopsAt = (box: string, until: readonly string[]): boolean =>
  until.some((u) => flatten(box).includes(flatten(u)));

/** Frames a talk `until` stop waits, without pressing anything, so the box finishes printing (mid speed). */
const TALK_UNTIL_SETTLE_FRAMES = 300;

/**
 * Starts the script ("press": A to interact; "resume": pick it up after a
 * battle; "none": already running, e.g. from useKeyItem), then keeps pressing A until the field script ends
 * (or a battle starts), collecting each distinct message box. Message boxes
 * are read from gStringVar4, where the game expands every field message
 * before printing it, so each entry is a whole box, not what had scrolled.
 * With `until`, stops pressing as soon as a box contains one of its strings (the script stays paused on it).
 */
async function talk(
  s: EmulatorSession,
  maxPresses: number,
  start: "press" | "resume" | "none",
  answers: readonly ("yes" | "no")[] = [],
  until?: readonly string[],
): Promise<string[]> {
  const buffer = s.symbols.address("gStringVar4");
  const boxes: string[] = [];
  const pending = [...answers];
  const done = (): string[] => {
    if (until) fail(`talk: the script ended before a box with ${until.map((u) => JSON.stringify(u)).join(" or ")}; text ${JSON.stringify(boxes)}`);
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
    if (until && text.trim() && talkStopsAt(text, until)) {
      await s.run(TALK_UNTIL_SETTLE_FRAMES);
      if (pending.length) fail(`talk: stopped at ${JSON.stringify(text)} with ${pending.length} answer(s) unused (${pending.join(", ")})`);
      return boxes;
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

/** MENU_ACTION_POKENAV in src/start_menu.c's action enum (a unit test checks). */
export const START_MENU_ACTION_POKENAV = 3;
/**
 * Byte offsets the Pokénav path reads (unit tests check the field order in the C structs).
 * struct PokenavResources (src/pokenav.c): currentMenuCb1, currentMenuIndex, u16 mode, u16 conditionSearchId, hasAnyRibbons, substructPtrs[].
 * struct Pokenav_Menu (src/pokenav_menu_handler.c): u16 menuType, s16 cursorPos, ...
 * struct Pokenav_MatchCallMenu (src/pokenav_match_call_list.c): u16 optionCursorPos, u16 maxOptionId,
 *   matchCallOptions, u16 headerId, u16 numRegistered, u16 numSpecialTrainers, initFinished, loopedTaskId,
 *   callback, then PokenavMatchCallEntry {u8 isSpecialTrainer, u8 mapSec, u16 headerId}[].
 */
export const POKENAV = {
  currentMenuIndex: 4,
  substructPtrs: 16,
  substructMainMenuHandler: 1,
  substructMatchCallMain: 5,
  menuType: 0,
  menuCursorPos: 2,
  mcOptionCursorPos: 0,
  mcNumRegistered: 10,
  mcInitFinished: 16,
  mcCallback: 24,
  mcEntries: 28,
  mcEntrySize: 4,
  /** currentMenuIndex = POKENAV_* menu id - POKENAV_MENU_IDS_START (include/pokenav.h). */
  mainMenuIndexes: [0, 1, 4, 5],
  matchCallMenuIndex: 11,
  /** POKENAV_MENU_TYPE_UNLOCK_MC and _RIBBONS put MATCH CALL third (sMenuItems). */
  matchCallCursorPos: 2,
} as const;

interface PokenavView {
  /** Task_Pokenav's tState: 3 waits for input, 2 runs a menu animation. */
  taskState: number;
  menuIndex: number;
  resources: number;
}

/** Reads where the Pokénav is, or null once it has shut down. */
async function pokenavView(s: EmulatorSession): Promise<PokenavView | null> {
  const resources = await s.deref("gPokenavResources");
  const task = s.symbols.address("Task_Pokenav", "src/pokenav.o") & ~1;
  const tasks = await s.read(s.symbols.address("gTasks"), NUM_TASKS * TASK_SIZE);
  for (let i = 0; i < NUM_TASKS; i++) {
    const active = tasks.readUInt8(i * TASK_SIZE + 4) !== 0;
    if (!active || (tasks.readUInt32LE(i * TASK_SIZE) & ~1) !== task) continue;
    if (!resources) return null;
    const taskState = tasks.readInt16LE(i * TASK_SIZE + 8);
    return { taskState, menuIndex: await s.readU32(resources + POKENAV.currentMenuIndex), resources };
  }
  return null;
}

/** Runs until the Pokénav waits for input on one of `menus`; fails naming `stage`. */
async function pokenavReady(s: EmulatorSession, menus: readonly number[], stage: string, maxFrames = 600): Promise<PokenavView> {
  let view: PokenavView | null = null;
  for (let f = 0; f <= maxFrames; f += 4) {
    view = await pokenavView(s);
    if (view && view.taskState === 3 && menus.includes(view.menuIndex)) return view;
    await s.run(4);
  }
  const { callback2 } = await s.callbacks();
  fail(`pokenavCall (${stage}): not ready after ${maxFrames} frames; screen ${callback2}, pokenav ${JSON.stringify(view)}`);
}

async function pokenavSubstruct(s: EmulatorSession, view: PokenavView, index: number): Promise<number> {
  return s.readU32(view.resources + POKENAV.substructPtrs + index * 4);
}

/**
 * pokenavCall: rings a Match Call contact through the real menus and returns the call's text
 * boxes (split at each \p), or null with read: false.
 */
async function pokenavCall(
  s: EmulatorSession,
  contact: keyof typeof MATCH_CALL_CONTACTS,
  read: boolean,
  maxPresses: number,
): Promise<string[] | null> {
  const what = `pokenavCall ${contact}`;
  const { header, identity } = MATCH_CALL_CONTACTS[contact];
  const buffer = s.symbols.address("gStringVar4");
  if (!(await s.scriptIdle())) fail(`${what} (start menu): a field script is running; the player must be free to press START`);
  await s.write(buffer, Uint8Array.of(0xff));

  // Start menu: its action list and cursor are statics in src/start_menu.o.
  const menuCallback = s.symbols.address("gMenuCallback");
  const handleInput = s.symbols.address("HandleStartMenuInput", "src/start_menu.o") & ~1;
  const startMenuOpen = async () => ((await s.readU32(menuCallback)) & ~1) === handleInput;
  await s.press("START", { hold: 2, release: 8 });
  for (let f = 0; f < 120 && !(await startMenuOpen()); f += 4) await s.run(4);
  if (!(await startMenuOpen())) fail(`${what} (start menu): START opened no menu`);
  const count = await s.readU8(s.symbols.address("sNumStartMenuActions", "src/start_menu.o"));
  const actions = [...(await s.read(s.symbols.address("sCurrentStartMenuActions", "src/start_menu.o"), count))];
  const target = actions.indexOf(START_MENU_ACTION_POKENAV);
  if (target < 0) fail(`${what} (start menu): no POKéNAV entry (FLAG_SYS_POKENAV_GET?); actions ${JSON.stringify(actions)}`);
  const cursor = s.symbols.address("sStartMenuCursorPos", "src/start_menu.o");
  for (let tries = 0; (await s.readU8(cursor)) !== target; tries++) {
    if (tries >= count * 2) fail(`${what} (start menu): could not move the cursor to POKéNAV`);
    await s.press((await s.readU8(cursor)) < target ? "DOWN" : "UP", { hold: 2, release: 8 });
  }
  await s.press("A", { hold: 2, release: 8 });

  // Pokénav main menu: MATCH CALL is the third item once it is unlocked.
  let view = await pokenavReady(s, POKENAV.mainMenuIndexes, "pokenav main", 900);
  const menu = await pokenavSubstruct(s, view, POKENAV.substructMainMenuHandler);
  const menuType = await s.readU16(menu + POKENAV.menuType);
  if (menuType === 0) fail(`${what} (pokenav main): no MATCH CALL item (FLAG_ADDED_MATCH_CALL_TO_POKENAV?)`);
  for (let tries = 0; ; tries++) {
    const pos = (await s.read(menu + POKENAV.menuCursorPos, 2)).readInt16LE(0);
    if (pos === POKENAV.matchCallCursorPos) break;
    if (tries >= 8) fail(`${what} (pokenav main): could not move the cursor to MATCH CALL (at ${pos})`);
    await s.press(pos < POKENAV.matchCallCursorPos ? "DOWN" : "UP", { hold: 2, release: 4 });
    view = await pokenavReady(s, POKENAV.mainMenuIndexes, "pokenav main");
  }
  await s.press("A", { hold: 2, release: 4 });

  // Match Call list: find the contact's row in the entries the list was built from.
  view = await pokenavReady(s, [POKENAV.matchCallMenuIndex], "match call list", 900);
  const mc = await pokenavSubstruct(s, view, POKENAV.substructMatchCallMain);
  if (!(await s.readU32(mc + POKENAV.mcInitFinished))) fail(`${what} (match call list): the list never finished building`);
  const registered = await s.readU16(mc + POKENAV.mcNumRegistered);
  const entries = await s.read(mc + POKENAV.mcEntries, registered * POKENAV.mcEntrySize);
  const rows: string[] = [];
  let row = -1;
  for (let i = 0; i < registered; i++) {
    const special = entries.readUInt8(i * POKENAV.mcEntrySize) !== 0;
    const id = entries.readUInt16LE(i * POKENAV.mcEntrySize + 2);
    rows.push(`${special ? "header" : "rematch"} ${id}`);
    if (special && id === header && row < 0) row = i;
  }
  if (row < 0) fail(`${what} (match call list): ${contact} is not registered (its FLAG_ENABLE_*_MATCH_CALL?); rows ${JSON.stringify(rows)}`);
  for (let i = 0; i < row; i++) {
    await s.press("DOWN", { hold: 2, release: 4 });
    view = await pokenavReady(s, [POKENAV.matchCallMenuIndex], "match call list");
  }
  const mcCallback = async () => s.symbols.describe(await s.readU32(mc + POKENAV.mcCallback));
  await s.press("A", { hold: 2, release: 4 }); // the row: CALL / CHECK / CANCEL
  await pokenavReady(s, [POKENAV.matchCallMenuIndex], "match call list");
  if (!(await mcCallback()).startsWith("CB2_HandleMatchCallOptionsInput")) {
    fail(`${what} (match call list): row ${row} opened no CALL menu; handler ${await mcCallback()}`);
  }
  if ((await s.readU16(mc + POKENAV.mcOptionCursorPos)) !== 0) fail(`${what} (match call list): option cursor is not on CALL`);
  await s.write(buffer, Uint8Array.of(0xff)); // the menus print through gStringVar4 too
  await s.press("A", { hold: 2, release: 4 }); // CALL
  if (!read) return null;

  // The call: A turns each page until the message is done and the call waits to be hung up.
  let presses = 0;
  for (;;) {
    await s.run(6);
    const v = await pokenavView(s);
    if (v && v.taskState === 3 && (await mcCallback()).startsWith("CB2_HandleCallExitInput")) break;
    if (++presses > maxPresses) fail(`${what} (call): still running after ${maxPresses} presses; text ${JSON.stringify(await s.readText(buffer))}`);
    await s.press("A", { hold: 2, release: 10 });
  }
  if ((await s.readU8(buffer)) === 0xff) fail(`${what} (call): the call wrote nothing to gStringVar4`);
  const boxes = (await s.readText(buffer)).split("\n\n").filter((b) => b.trim());
  if (!flatten(boxes.join(" ")).includes(identity)) {
    fail(`${what} (call): this is not ${contact}'s call (no ${JSON.stringify(identity)}); text ${JSON.stringify(boxes)}`);
  }

  // Hang up, leave the list, the Pokénav and the start menu: B at each until the field is free.
  for (let f = 0; !((await s.callbacks()).callback2 === "CB2_Overworld" && (await s.scriptIdle())); f += 24) {
    if (f >= 2400) fail(`${what} (back to field): still on ${(await s.callbacks()).callback2} after 2400 frames`);
    await s.press("B", { hold: 2, release: 22 });
  }
  return boxes;
}

/** B_WEATHER_* bits (include/constants/battle.h) as one name. */
export function battleWeatherName(bits: number): "none" | "rain" | "sun" | "sandstorm" | "hail" {
  if (bits & 0x07) return "rain";
  if (bits & 0x18) return "sandstorm";
  if (bits & 0x60) return "sun";
  if (bits & 0x80) return "hail";
  return "none";
}
