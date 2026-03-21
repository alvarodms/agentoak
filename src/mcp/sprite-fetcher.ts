/**
 * Pokémon Sprite Fetcher
 *
 * Downloads sprite files for a Pokémon from the pokeemerald-expansion
 * GitHub repository and saves them to the local pokeemerald graphics directory.
 * Also generates front.png by cropping the top half of anim_front.png
 * using raw PNG chunk manipulation (preserves indexed color format).
 *
 * Source: https://github.com/rh-hideout/pokeemerald-expansion
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const EXPANSION_RAW_BASE =
  "https://raw.githubusercontent.com/rh-hideout/pokeemerald-expansion/master/graphics/pokemon";

/** Files to download from the expansion repo (excluding front.png which is generated) */
const SPRITE_FILES = [
  "anim_front.png",
  "back.png",
  "normal.pal",
  "shiny.pal",
  "icon.png",
  "footprint.png",
] as const;

export interface SpriteResult {
  success: boolean;
  pokemon: string;
  outputDir: string;
  filesDownloaded: string[];
  filesSkipped: string[];
  filesFailed: string[];
  frontPngGenerated: boolean;
  errors: string[];
}

// ─── PNG chunk manipulation ─────────────────────────────────────────────────

interface PngChunk {
  type: string;
  data: Buffer;
}

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function parsePngChunks(buf: Buffer): PngChunk[] {
  // Verify PNG signature
  if (buf.subarray(0, 8).compare(PNG_SIGNATURE) !== 0) {
    throw new Error("Not a valid PNG file");
  }

  const chunks: PngChunk[] = [];
  let offset = 8; // skip signature

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buf.subarray(offset + 8, offset + 8 + length);
    // Skip CRC (4 bytes after data)
    chunks.push({ type, data });
    offset += 12 + length; // 4 (length) + 4 (type) + data + 4 (crc)
  }

  return chunks;
}

function computeCrc32(type: Buffer, data: Buffer): number {
  // CRC-32 over type + data
  const combined = Buffer.concat([type, data]);

  // Use zlib's crc32
  let crc = 0xffffffff;
  const table = getCrc32Table();
  for (let i = 0; i < combined.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ combined[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

let crc32Table: Uint32Array | null = null;

function getCrc32Table(): Uint32Array {
  if (crc32Table) return crc32Table;

  crc32Table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    crc32Table[n] = c >>> 0;
  }
  return crc32Table;
}

function buildPngBuffer(chunks: PngChunk[]): Buffer {
  const parts: Buffer[] = [PNG_SIGNATURE];

  for (const chunk of chunks) {
    const lengthBuf = Buffer.alloc(4);
    lengthBuf.writeUInt32BE(chunk.data.length, 0);

    const typeBuf = Buffer.from(chunk.type, "ascii");
    const crc = computeCrc32(typeBuf, chunk.data);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);

    parts.push(lengthBuf, typeBuf, chunk.data, crcBuf);
  }

  return Buffer.concat(parts);
}

/**
 * Crop a PNG to its top half, preserving the exact format (indexed color,
 * bit depth, palette, transparency). Only IHDR height and IDAT data change.
 */
function cropPngTopHalf(pngBuffer: Buffer): Buffer {
  const chunks = parsePngChunks(pngBuffer);

  const ihdrChunk = chunks.find((c) => c.type === "IHDR");
  if (!ihdrChunk) throw new Error("PNG missing IHDR chunk");

  const width = ihdrChunk.data.readUInt32BE(0);
  const height = ihdrChunk.data.readUInt32BE(4);
  const bitDepth = ihdrChunk.data[8];
  const colorType = ihdrChunk.data[9];

  if (height < 2) throw new Error("PNG too small to crop");
  const newHeight = Math.floor(height / 2);

  // Calculate bytes per scanline (filter byte + pixel data)
  let bytesPerPixel: number;
  switch (colorType) {
    case 0: // Grayscale
      bytesPerPixel = bitDepth / 8;
      break;
    case 2: // RGB
      bytesPerPixel = (bitDepth / 8) * 3;
      break;
    case 3: // Indexed
      bytesPerPixel = bitDepth / 8;
      break;
    case 4: // Grayscale + Alpha
      bytesPerPixel = (bitDepth / 8) * 2;
      break;
    case 6: // RGBA
      bytesPerPixel = (bitDepth / 8) * 4;
      break;
    default:
      throw new Error(`Unsupported PNG color type: ${colorType}`);
  }

  // For sub-byte pixels (1, 2, 4 bit), calculate row bytes properly
  const bitsPerRow = width * (colorType === 3 ? bitDepth : bitDepth * (bytesPerPixel * 8 / bitDepth));
  const bytesPerRow = Math.ceil(bitsPerRow / 8);
  const scanlineSize = 1 + bytesPerRow; // 1 filter byte + row data

  // Decompress all IDAT data
  const idatData = Buffer.concat(
    chunks.filter((c) => c.type === "IDAT").map((c) => c.data),
  );
  const rawData = zlib.inflateSync(idatData);

  // Verify expected size
  const expectedSize = scanlineSize * height;
  if (rawData.length !== expectedSize) {
    // Try simpler calculation for indexed color
    const simpleBytesPerRow = Math.ceil((width * bitDepth) / 8);
    const simpleScanline = 1 + simpleBytesPerRow;
    const simpleExpected = simpleScanline * height;
    if (rawData.length === simpleExpected) {
      // Use the simpler calculation
      const croppedData = rawData.subarray(0, simpleScanline * newHeight);
      const newCompressed = zlib.deflateSync(croppedData);

      return rebuildPng(chunks, ihdrChunk, newHeight, newCompressed);
    }
    throw new Error(
      `PNG raw data size mismatch: expected ${expectedSize}, got ${rawData.length}`,
    );
  }

  // Take top half scanlines
  const croppedData = rawData.subarray(0, scanlineSize * newHeight);
  const newCompressed = zlib.deflateSync(croppedData);

  return rebuildPng(chunks, ihdrChunk, newHeight, newCompressed);
}

function rebuildPng(
  chunks: PngChunk[],
  ihdrChunk: PngChunk,
  newHeight: number,
  newIdatData: Buffer,
): Buffer {
  const newChunks: PngChunk[] = [];

  for (const chunk of chunks) {
    if (chunk.type === "IHDR") {
      // Clone IHDR with updated height
      const newIhdr = Buffer.from(ihdrChunk.data);
      newIhdr.writeUInt32BE(newHeight, 4);
      newChunks.push({ type: "IHDR", data: newIhdr });
    } else if (chunk.type === "IDAT") {
      // Replace all IDAT chunks with a single new one (skip duplicates)
      if (!newChunks.some((c) => c.type === "IDAT")) {
        newChunks.push({ type: "IDAT", data: newIdatData });
      }
    } else {
      // Pass through PLTE, tRNS, IEND, and all other chunks unchanged
      newChunks.push(chunk);
    }
  }

  return buildPngBuffer(newChunks);
}

// ─── File download ──────────────────────────────────────────────────────────

async function fetchSingleFile(url: string): Promise<Buffer | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url);

      if (response.status === 404) return null;

      if (response.status === 429) {
        // Rate limited — wait and retry once
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        return null;
      }

      if (!response.ok) return null;

      return Buffer.from(await response.arrayBuffer());
    } catch {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      return null;
    }
  }
  return null;
}

// ─── Main export ────────────────────────────────────────────────────────────

/**
 * Fetch sprite files for a Pokémon from the pokeemerald-expansion repository
 * and save them to the local pokeemerald graphics directory.
 *
 * Downloads: anim_front.png, back.png, normal.pal, shiny.pal, icon.png, footprint.png
 * Generates: front.png (top half of anim_front.png)
 */
export async function fetchPokemonSprites(
  pokemonName: string,
  pokeemeraldRoot: string,
  overwrite: boolean = false,
): Promise<SpriteResult> {
  const name = pokemonName.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  const outputDir = path.join(pokeemeraldRoot, "graphics", "pokemon", name);
  const result: SpriteResult = {
    success: false,
    pokemon: name,
    outputDir,
    filesDownloaded: [],
    filesSkipped: [],
    filesFailed: [],
    frontPngGenerated: false,
    errors: [],
  };

  // Create output directory
  try {
    fs.mkdirSync(outputDir, { recursive: true });
  } catch (err) {
    result.errors.push(
      `Failed to create directory ${outputDir}: ${err instanceof Error ? err.message : String(err)}`,
    );
    return result;
  }

  // Download each sprite file
  let animFrontBuffer: Buffer | null = null;

  for (const filename of SPRITE_FILES) {
    const outputPath = path.join(outputDir, filename);

    // Skip if file exists and not overwriting
    if (!overwrite && fs.existsSync(outputPath)) {
      result.filesSkipped.push(filename);
      // Still read anim_front.png for front.png generation
      if (filename === "anim_front.png") {
        try {
          animFrontBuffer = fs.readFileSync(outputPath);
        } catch {
          // Will try to download anyway for front.png generation
        }
      }
      continue;
    }

    const url = `${EXPANSION_RAW_BASE}/${name}/${filename}`;
    const data = await fetchSingleFile(url);

    if (data === null) {
      result.filesFailed.push(filename);
      if (filename === "anim_front.png") {
        result.errors.push(
          `Could not download anim_front.png — the Pokémon "${name}" may not exist in the expansion repo. ` +
            `Check the directory name at: https://github.com/rh-hideout/pokeemerald-expansion/tree/master/graphics/pokemon`,
        );
      }
      continue;
    }

    try {
      fs.writeFileSync(outputPath, data);
      result.filesDownloaded.push(`${filename} (${data.length} bytes)`);

      if (filename === "anim_front.png") {
        animFrontBuffer = data;
      }
    } catch (err) {
      result.filesFailed.push(filename);
      result.errors.push(
        `Failed to write ${filename}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Generate front.png from anim_front.png
  const frontPath = path.join(outputDir, "front.png");
  if (animFrontBuffer && (overwrite || !fs.existsSync(frontPath))) {
    try {
      const frontPng = cropPngTopHalf(animFrontBuffer);
      fs.writeFileSync(frontPath, frontPng);
      result.frontPngGenerated = true;
      result.filesDownloaded.push(`front.png (generated, ${frontPng.length} bytes)`);
    } catch (err) {
      result.errors.push(
        `Failed to generate front.png from anim_front.png: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  } else if (!animFrontBuffer) {
    result.errors.push(
      "Could not generate front.png — anim_front.png was not available",
    );
  } else {
    result.filesSkipped.push("front.png");
  }

  // Determine overall success
  result.success =
    result.filesFailed.length === 0 && result.errors.length === 0;

  return result;
}

/**
 * Format a SpriteResult into a human-readable summary string.
 */
export function formatSpriteResult(result: SpriteResult): string {
  const lines: string[] = [];

  if (result.filesDownloaded.length === 0 && result.filesFailed.length === 0 && result.filesSkipped.length > 0) {
    lines.push(
      `All sprite files for "${result.pokemon}" already exist in ${result.outputDir}`,
    );
    lines.push(`Skipped: ${result.filesSkipped.join(", ")}`);
    lines.push(`Use overwrite: true to re-download.`);
    return lines.join("\n");
  }

  lines.push(
    result.success
      ? `Successfully fetched sprites for "${result.pokemon}":`
      : `Partially fetched sprites for "${result.pokemon}":`,
  );

  if (result.filesDownloaded.length > 0) {
    lines.push("\nDownloaded:");
    for (const f of result.filesDownloaded) {
      lines.push(`  + ${f}`);
    }
  }

  if (result.filesSkipped.length > 0) {
    lines.push("\nSkipped (already exist):");
    for (const f of result.filesSkipped) {
      lines.push(`  ~ ${f}`);
    }
  }

  if (result.filesFailed.length > 0) {
    lines.push("\nFailed:");
    for (const f of result.filesFailed) {
      lines.push(`  x ${f}`);
    }
  }

  if (result.errors.length > 0) {
    lines.push("\nErrors:");
    for (const e of result.errors) {
      lines.push(`  ! ${e}`);
    }
  }

  lines.push(`\nOutput directory: ${result.outputDir}`);

  return lines.join("\n");
}
