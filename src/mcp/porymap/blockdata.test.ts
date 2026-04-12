import { describe, it, expect } from "vitest";
import { decodeTileEntry, readMetatiles } from "./blockdata.js";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

describe("decodeTileEntry", () => {
  it("decodes a simple tile entry with no flips", () => {
    const entry = decodeTileEntry(0x0005);
    expect(entry.tileIndex).toBe(5);
    expect(entry.hflip).toBe(false);
    expect(entry.vflip).toBe(false);
    expect(entry.palette).toBe(0);
  });

  it("decodes horizontal flip", () => {
    const entry = decodeTileEntry(0x0400 | 42);
    expect(entry.tileIndex).toBe(42);
    expect(entry.hflip).toBe(true);
    expect(entry.vflip).toBe(false);
  });

  it("decodes vertical flip", () => {
    const entry = decodeTileEntry(0x0800 | 7);
    expect(entry.tileIndex).toBe(7);
    expect(entry.hflip).toBe(false);
    expect(entry.vflip).toBe(true);
  });

  it("decodes both flips and palette", () => {
    // palette 5 = 0x5000, hflip = 0x0400, vflip = 0x0800, tile 100
    const raw = 0x5000 | 0x0400 | 0x0800 | 100;
    const entry = decodeTileEntry(raw);
    expect(entry.tileIndex).toBe(100);
    expect(entry.hflip).toBe(true);
    expect(entry.vflip).toBe(true);
    expect(entry.palette).toBe(5);
  });

  it("handles max tile index (1023)", () => {
    const entry = decodeTileEntry(0x03ff);
    expect(entry.tileIndex).toBe(1023);
  });

  it("handles max palette (15)", () => {
    const entry = decodeTileEntry(0xf000);
    expect(entry.palette).toBe(15);
  });
});

describe("readMetatiles", () => {
  it("decodes a metatiles.bin buffer into metatile entries", async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "blockdata-test-"));
    const filePath = path.join(tmpDir, "metatiles.bin");

    // 2 metatiles, 8 u16 each = 32 bytes
    const buf = Buffer.alloc(32);

    // Metatile 0: tiles [1, 2, 3, 4, 5, 6, 7, 8]
    for (let i = 0; i < 8; i++) {
      buf.writeUInt16LE(i + 1, i * 2);
    }

    // Metatile 1: tile 100 with hflip+palette3, rest zeros
    buf.writeUInt16LE(0x3000 | 0x0400 | 100, 16);
    for (let i = 1; i < 8; i++) {
      buf.writeUInt16LE(0, 16 + i * 2);
    }

    await fs.writeFile(filePath, buf);

    try {
      const metatiles = await readMetatiles(filePath);

      expect(metatiles).toHaveLength(2);

      expect(metatiles[0].tiles).toHaveLength(8);
      expect(metatiles[0].tiles[0].tileIndex).toBe(1);
      expect(metatiles[0].tiles[7].tileIndex).toBe(8);

      expect(metatiles[1].tiles[0].tileIndex).toBe(100);
      expect(metatiles[1].tiles[0].hflip).toBe(true);
      expect(metatiles[1].tiles[0].vflip).toBe(false);
      expect(metatiles[1].tiles[0].palette).toBe(3);
      expect(metatiles[1].tiles[1].tileIndex).toBe(0);
    } finally {
      await fs.unlink(filePath);
      await fs.rmdir(tmpDir);
    }
  });

  it("handles empty file", async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "blockdata-test-"));
    const filePath = path.join(tmpDir, "metatiles.bin");
    await fs.writeFile(filePath, Buffer.alloc(0));

    try {
      const metatiles = await readMetatiles(filePath);
      expect(metatiles).toHaveLength(0);
    } finally {
      await fs.unlink(filePath);
      await fs.rmdir(tmpDir);
    }
  });

  it("ignores trailing bytes that don't form a complete metatile", async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "blockdata-test-"));
    const filePath = path.join(tmpDir, "metatiles.bin");

    // 1 full metatile (16 bytes) + 4 extra bytes = 20 bytes
    const buf = Buffer.alloc(20);
    for (let i = 0; i < 8; i++) {
      buf.writeUInt16LE(i + 10, i * 2);
    }
    buf.writeUInt16LE(0xffff, 16);
    buf.writeUInt16LE(0xffff, 18);

    await fs.writeFile(filePath, buf);

    try {
      const metatiles = await readMetatiles(filePath);
      expect(metatiles).toHaveLength(1);
      expect(metatiles[0].tiles[0].tileIndex).toBe(10);
    } finally {
      await fs.unlink(filePath);
      await fs.rmdir(tmpDir);
    }
  });
});
