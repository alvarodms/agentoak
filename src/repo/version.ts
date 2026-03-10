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
