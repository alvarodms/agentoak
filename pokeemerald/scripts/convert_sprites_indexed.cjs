const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { PNG } = require('pngjs');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dirPath = args.find(a => a !== '--dry-run');

if (!dirPath) {
  console.error('Usage: node convert_sprites_indexed.cjs <directory-path> [--dry-run]');
  process.exit(1);
}

if (!fs.existsSync(dirPath)) {
  console.error(`Directory not found: ${dirPath}`);
  process.exit(1);
}

const MAX_OPAQUE_COLORS = 14;
const PALETTE_SIZE = 16;

function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function luminance(c) {
  return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
}

function reduceColors(colors, target) {
  let palette = colors.map(c => ({ color: [...c], members: [c] }));

  while (palette.length > target) {
    let minDist = Infinity;
    let mergeA = 0, mergeB = 1;
    for (let i = 0; i < palette.length; i++) {
      for (let j = i + 1; j < palette.length; j++) {
        const d = colorDistance(palette[i].color, palette[j].color);
        if (d < minDist) {
          minDist = d;
          mergeA = i;
          mergeB = j;
        }
      }
    }
    const allMembers = [...palette[mergeA].members, ...palette[mergeB].members];
    const avg = [0, 0, 0];
    for (const m of allMembers) {
      avg[0] += m[0]; avg[1] += m[1]; avg[2] += m[2];
    }
    avg[0] = Math.round(avg[0] / allMembers.length);
    avg[1] = Math.round(avg[1] / allMembers.length);
    avg[2] = Math.round(avg[2] / allMembers.length);
    palette[mergeA] = { color: avg, members: allMembers };
    palette.splice(mergeB, 1);
  }

  return palette.map(p => p.color);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([len, typeAndData, crc]);
}

function writeIndexedPng(width, height, indexedData, palette, trns) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 3;  // color type: indexed
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rawData = Buffer.alloc(height * (1 + width));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width)] = 0; // filter: none
    indexedData.copy(rawData, y * (1 + width) + 1, y * width, (y + 1) * width);
  }
  const compressed = zlib.deflateSync(rawData);

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('PLTE', palette),
    pngChunk('tRNS', trns),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function processFile(filePath) {
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);

  if (png.colorType === 3) {
    console.log(`  ${path.basename(filePath)}: already indexed, skipping`);
    return true;
  }

  const opaqueColors = new Map();
  const pixels = png.data;
  const pixelCount = png.width * png.height;

  for (let i = 0; i < pixelCount; i++) {
    const off = i * 4;
    const a = pixels[off + 3];
    if (a < 128) continue;
    const key = `${pixels[off]},${pixels[off + 1]},${pixels[off + 2]}`;
    if (!opaqueColors.has(key)) {
      opaqueColors.set(key, [pixels[off], pixels[off + 1], pixels[off + 2]]);
    }
  }

  const uniqueCount = opaqueColors.size;
  let reduced = false;
  let finalColors;

  if (uniqueCount <= MAX_OPAQUE_COLORS) {
    finalColors = Array.from(opaqueColors.values());
  } else {
    finalColors = reduceColors(Array.from(opaqueColors.values()), MAX_OPAQUE_COLORS);
    reduced = true;
  }

  finalColors.sort((a, b) => luminance(a) - luminance(b));

  console.log(`  ${path.basename(filePath)}: ${uniqueCount} unique colors -> ${finalColors.length + 1} palette entries${reduced ? ' (reduced)' : ''}`);

  if (dryRun) return true;

  const palette = Buffer.alloc(PALETTE_SIZE * 3);
  palette[0] = 0; palette[1] = 0; palette[2] = 0;
  for (let i = 0; i < finalColors.length; i++) {
    palette[(i + 1) * 3] = finalColors[i][0];
    palette[(i + 1) * 3 + 1] = finalColors[i][1];
    palette[(i + 1) * 3 + 2] = finalColors[i][2];
  }
  for (let i = finalColors.length + 1; i < PALETTE_SIZE; i++) {
    palette[i * 3] = 0; palette[i * 3 + 1] = 0; palette[i * 3 + 2] = 0;
  }

  const trns = Buffer.alloc(PALETTE_SIZE, 255);
  trns[0] = 0;

  const indexedData = Buffer.alloc(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const off = i * 4;
    const a = pixels[off + 3];
    if (a < 128) {
      indexedData[i] = 0;
      continue;
    }
    const r = pixels[off], g = pixels[off + 1], b = pixels[off + 2];
    let bestIdx = 1, bestDist = Infinity;
    for (let j = 0; j < finalColors.length; j++) {
      const d = colorDistance([r, g, b], finalColors[j]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = j + 1;
      }
    }
    indexedData[i] = bestIdx;
  }

  const outBuf = writeIndexedPng(png.width, png.height, indexedData, palette, trns);
  fs.writeFileSync(filePath, outBuf);
  return true;
}

console.log(`${dryRun ? '[DRY RUN] ' : ''}Processing PNGs in: ${dirPath}`);

const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));
if (files.length === 0) {
  console.log('No PNG files found.');
  process.exit(0);
}

let hasError = false;
for (const file of files) {
  try {
    processFile(path.join(dirPath, file));
  } catch (err) {
    console.error(`  ERROR processing ${file}: ${err.message}`);
    hasError = true;
  }
}

process.exit(hasError ? 1 : 0);
