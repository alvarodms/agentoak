import fs from "fs";
import path from "path";
import { ARTIFACTS_DIR } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

const VERSION_FILE = path.join(ARTIFACTS_DIR, "version.json");

export interface GameVersion {
  /** Major version — incremented for milestone releases / large feature sets */
  major: number;
  /** Minor version — incremented for notable gameplay changes */
  minor: number;
  /** Patch version — incremented for bug fixes and small tweaks */
  patch: number;
  /** Auto-incrementing build number, bumped on every successful ROM build */
  build: number;
  /** Cycle number that produced this build */
  cycle: number;
  /** ISO timestamp of the last successful build */
  builtAt: string;
  /**
   * Optional release stage label declared by the agent (e.g. "Alpha", "Beta", "Stable").
   * When set, this overrides the auto-computed stage in release names.
   */
  releaseStage?: string;
}

/** Default initial version for a fresh project */
const INITIAL_VERSION: GameVersion = {
  major: 0,
  minor: 0,
  patch: 0,
  build: 0,
  cycle: 0,
  builtAt: "",
};

/** Read the current game version from disk, or return the initial version */
export function loadVersion(): GameVersion {
  try {
    const raw = fs.readFileSync(VERSION_FILE, "utf-8");
    return { ...INITIAL_VERSION, ...JSON.parse(raw) };
  } catch {
    return { ...INITIAL_VERSION };
  }
}

/** Format the version as a human-readable string: v0.0.15+build.42 */
export function formatVersion(v: GameVersion): string {
  return `v${v.major}.${v.minor}.${v.cycle}+build.${v.build}`;
}

/**
 * Record a successful build by incrementing the build number
 * and writing the updated version to disk.
 */
export function recordSuccessfulBuild(cycleNumber: number): GameVersion {
  const version = loadVersion();

  version.build += 1;
  version.cycle = cycleNumber;
  version.patch = cycleNumber;
  version.builtAt = new Date().toISOString();

  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(VERSION_FILE, JSON.stringify(version, null, 2) + "\n", "utf-8");

  logger.info(`Game version: ${formatVersion(version)} (cycle ${cycleNumber})`);
  return version;
}

/**
 * Apply a major or minor version bump declared by the agent, and optionally
 * set a release stage label at the same time.
 * - "major": increment major, reset minor to 0.
 * - "minor": increment minor, keep major unchanged.
 *
 * Call this after recordSuccessfulBuild, once the agent's CYCLE_COMPLETE
 * marker has been parsed and a version bump has been declared.
 */
export function applyVersionBump(bump: "major" | "minor", releaseStage?: string): GameVersion {
  const version = loadVersion();

  if (bump === "major") {
    version.major += 1;
    version.minor = 0;
  } else {
    version.minor += 1;
  }

  if (releaseStage) {
    version.releaseStage = releaseStage;
  }

  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(VERSION_FILE, JSON.stringify(version, null, 2) + "\n", "utf-8");

  logger.info(`Version bump (${bump}): ${formatVersion(version)}${releaseStage ? ` [${releaseStage}]` : ""}`);
  return version;
}

/**
 * Set the release stage label without changing the version numbers.
 * Use when the agent declares a stage name but no numeric bump.
 */
export function setReleaseStage(releaseStage: string): GameVersion {
  const version = loadVersion();
  version.releaseStage = releaseStage;

  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(VERSION_FILE, JSON.stringify(version, null, 2) + "\n", "utf-8");

  logger.info(`Release stage set to: ${releaseStage}`);
  return version;
}
