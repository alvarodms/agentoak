/**
 * IPS patch generation and base ROM management.
 *
 * Creates IPS (International Patching System) format patches by comparing
 * the original unmodified pokeemerald ROM against a freshly built ROM.
 * The base ROM is downloaded on first use and cached locally.
 */

import fs from "fs";
import crypto from "crypto";
import path from "path";
import { ARTIFACTS_DIR, POKEEMERALD_DIR } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

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
 * Generate an IPS patch by comparing the base ROM against the built ROM.
 * Returns the patch as a Buffer, or null if generation fails.
 */
export async function generateIPSPatch(): Promise<Buffer | null> {
  const baseRomPath = await ensureBaseRom();
  if (!baseRomPath) return null;

  if (!fs.existsSync(BUILT_ROM_PATH)) {
    logger.error("Built ROM not found — cannot generate patch.");
    return null;
  }

  const original = fs.readFileSync(baseRomPath);
  const modified = fs.readFileSync(BUILT_ROM_PATH);

  const patch = createIPSPatch(original, modified);
  logger.info(`IPS patch generated: ${patch.length} bytes`);
  return patch;
}

/**
 * Create an IPS format patch from two ROM buffers.
 *
 * IPS format:
 *   Header: "PATCH" (5 bytes)
 *   Records: offset(3B) + size(2B) + data(sizeB)
 *   Footer: "EOF" (3 bytes)
 *
 * IPS supports offsets up to 0xFFFFFF (16 MB - 1), which covers
 * the full GBA ROM address space.
 */
function createIPSPatch(original: Buffer, modified: Buffer): Buffer {
  const chunks: Buffer[] = [];
  chunks.push(Buffer.from("PATCH"));

  const maxLen = Math.max(original.length, modified.length);
  // IPS max addressable offset
  const limit = Math.min(maxLen, 0xffffff);

  let i = 0;
  while (i < limit) {
    // Skip identical bytes
    while (
      i < limit &&
      i < original.length &&
      i < modified.length &&
      original[i] === modified[i]
    ) {
      i++;
    }

    if (i >= limit) break;

    // Start of a changed region
    const start = i;
    let matchRun = 0;

    // Extend the region, allowing small gaps of matching bytes (up to 6)
    // to avoid fragmenting into many tiny records.
    while (i < limit && i - start < 0xffff) {
      const origByte = i < original.length ? original[i] : 0;
      const modByte = i < modified.length ? modified[i] : 0;

      if (origByte === modByte) {
        matchRun++;
        if (matchRun > 6) {
          i -= matchRun;
          break;
        }
      } else {
        matchRun = 0;
      }
      i++;
    }

    const size = i - start;
    if (size <= 0) {
      i++;
      continue;
    }

    // Write record: offset (3 bytes BE) + size (2 bytes BE) + data
    const record = Buffer.alloc(3 + 2 + size);
    record.writeUIntBE(start, 0, 3);
    record.writeUInt16BE(size, 3);
    modified.copy(record, 5, start, start + size);

    chunks.push(record);
  }

  chunks.push(Buffer.from("EOF"));
  return Buffer.concat(chunks);
}
