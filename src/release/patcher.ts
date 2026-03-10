/**
 * IPS patch generation and base ROM management.
 *
 * Creates IPS (International Patching System) format patches using Flips
 * (Floating IPS), installed via Flatpak as com.github.Alcaro.Flips.
 * The base ROM is downloaded on first use and cached locally.
 */

import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ARTIFACTS_DIR, POKEEMERALD_DIR } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

const execFileAsync = promisify(execFile);

const BASE_ROM_DIR = path.join(ARTIFACTS_DIR, "base-rom");
const BASE_ROM_PATH = path.join(BASE_ROM_DIR, "base.gba");
const BUILT_ROM_PATH = path.join(POKEEMERALD_DIR, "pokeemerald.gba");

/** Expected SHA-1 of the original Pokémon Emerald (U) ROM */
const EXPECTED_SHA1 = "f3ae088181bf583e55daf962a92bb46f4f1d07b7";

/**
 * Download the base (unmodified) Pokémon Emerald ROM and cache it locally.
 * The URL is read from the BASE_ROM_URL environment variable.
 * Returns the path to the cached ROM, or null on failure.
 */
export async function ensureBaseRom(): Promise<string | null> {
  // Already cached and verified
  if (fs.existsSync(BASE_ROM_PATH)) {
    const sha1 = hashFile(BASE_ROM_PATH);
    if (sha1 === EXPECTED_SHA1) {
      logger.info("Base ROM already cached and verified.");
      return BASE_ROM_PATH;
    }
    logger.warn("Cached base ROM has wrong hash — re-downloading.");
    fs.unlinkSync(BASE_ROM_PATH);
  }

  const url = process.env.BASE_ROM_URL;
  if (!url) {
    logger.warn("BASE_ROM_URL not set — cannot download base ROM for patch generation.");
    return null;
  }

  logger.info("Downloading base ROM...");
  fs.mkdirSync(BASE_ROM_DIR, { recursive: true });

  try {
    const response = await fetch(url);
    if (!response.ok) {
      logger.error(`Base ROM download failed: HTTP ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(BASE_ROM_PATH, buffer);

    // Verify integrity
    const sha1 = hashFile(BASE_ROM_PATH);
    if (sha1 !== EXPECTED_SHA1) {
      logger.error(`Base ROM hash mismatch: expected ${EXPECTED_SHA1}, got ${sha1}`);
      fs.unlinkSync(BASE_ROM_PATH);
      return null;
    }

    logger.info("Base ROM downloaded and verified.");
    return BASE_ROM_PATH;
  } catch (err) {
    logger.error(`Base ROM download error: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/** SHA-1 hash of a file */
function hashFile(filePath: string): string {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(data).digest("hex");
}

/**
 * Generate an IPS patch by comparing the base ROM against the built ROM
 * using Flips (com.github.Alcaro.Flips) installed via Flatpak.
 * Returns the patch as a Buffer, or null if generation fails.
 */
export async function generateIPSPatch(): Promise<Buffer | null> {
  const baseRomPath = await ensureBaseRom();
  if (!baseRomPath) return null;

  if (!fs.existsSync(BUILT_ROM_PATH)) {
    logger.error("Built ROM not found — cannot generate patch.");
    return null;
  }

  const patchPath = path.join(BASE_ROM_DIR, "patch.ips");

  try {
    await execFileAsync("flatpak", [
      "run",
      "com.github.Alcaro.Flips",
      "--create-ips",
      baseRomPath,
      BUILT_ROM_PATH,
      patchPath,
    ]);

    if (!fs.existsSync(patchPath)) {
      logger.error("Flips did not produce an output patch file.");
      return null;
    }

    const patch = fs.readFileSync(patchPath);
    fs.unlinkSync(patchPath);
    logger.info(`IPS patch generated via Flips: ${patch.length} bytes`);
    return patch;
  } catch (err) {
    logger.error(
      `Flips patch generation failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}
