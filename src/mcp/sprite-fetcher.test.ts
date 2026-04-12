/**
 * Unit tests for sprite path validation and resolution (fetch_pokemon_sprites).
 */

import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getSpriteGraphicsSubpath,
  normalizeExpansionSlug,
  resolvePokemonSpriteOutputDir,
  validateGraphicsPokemonSubpath,
} from "./sprite-fetcher.js";

describe("normalizeExpansionSlug", () => {
  it("lowercases and normalizes separators", () => {
    expect(normalizeExpansionSlug("Mr. Mime")).toBe("mr._mime");
    expect(normalizeExpansionSlug("Lucario")).toBe("lucario");
    expect(normalizeExpansionSlug("Type-Null")).toBe("type_null");
  });
});

describe("validateGraphicsPokemonSubpath", () => {
  it("accepts simple and nested relative paths", () => {
    expect(validateGraphicsPokemonSubpath("corsola_hoenn")).toEqual({
      ok: true,
      subpathPosix: "corsola_hoenn",
    });
    expect(validateGraphicsPokemonSubpath("forms/corsola/hoenn")).toEqual({
      ok: true,
      subpathPosix: "forms/corsola/hoenn",
    });
  });

  it("normalizes redundant segments inside the tree", () => {
    expect(validateGraphicsPokemonSubpath("foo/../bar")).toEqual({
      ok: true,
      subpathPosix: "bar",
    });
  });

  it("rejects empty, dot-only, parent escapes, and absolutes", () => {
    expect(validateGraphicsPokemonSubpath("  ").ok).toBe(false);
    expect(validateGraphicsPokemonSubpath(".").ok).toBe(false);
    expect(validateGraphicsPokemonSubpath("..").ok).toBe(false);
    expect(validateGraphicsPokemonSubpath("../secret").ok).toBe(false);
    expect(validateGraphicsPokemonSubpath("foo/../../outside").ok).toBe(false);
    expect(validateGraphicsPokemonSubpath("/abs").ok).toBe(false);
    expect(validateGraphicsPokemonSubpath("C:/windows").ok).toBe(false);
  });
});

describe("getSpriteGraphicsSubpath", () => {
  it("defaults to expansion slug when output_dir omitted", () => {
    expect(getSpriteGraphicsSubpath("Lucario", undefined)).toBe("lucario");
    expect(getSpriteGraphicsSubpath("Lucario", "   ")).toBe("lucario");
  });

  it("returns validated subpath when output_dir set", () => {
    expect(getSpriteGraphicsSubpath("corsola", "corsola_hoenn")).toBe(
      "corsola_hoenn",
    );
  });

  it("returns null when output_dir is invalid", () => {
    expect(getSpriteGraphicsSubpath("corsola", "../x")).toBeNull();
  });
});

describe("resolvePokemonSpriteOutputDir", () => {
  const fakeRoot = path.resolve("/tmp/agent-oak-test-pokeemerald");

  it("uses species slug as default folder", () => {
    const r = resolvePokemonSpriteOutputDir(fakeRoot, "lucario");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.subpathPosix).toBe("lucario");
      expect(r.outputDirAbs).toBe(
        path.join(fakeRoot, "graphics", "pokemon", "lucario"),
      );
    }
  });

  it("resolves custom output_dir under graphics/pokemon", () => {
    const r = resolvePokemonSpriteOutputDir(
      fakeRoot,
      "corsola",
      "corsola_hoenn",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.subpathPosix).toBe("corsola_hoenn");
      expect(r.outputDirAbs).toBe(
        path.join(fakeRoot, "graphics", "pokemon", "corsola_hoenn"),
      );
    }
  });

  it("rejects parent-directory escapes in output_dir", () => {
    const r = resolvePokemonSpriteOutputDir(fakeRoot, "x", "../outside");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain("..");
    }
  });
});
