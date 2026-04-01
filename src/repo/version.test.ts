import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatVersion, type GameVersion } from "./version.js";

/** Build a minimal GameVersion */
function makeVersion(overrides: Partial<GameVersion> = {}): GameVersion {
  return {
    major: 0,
    minor: 0,
    patch: 0,
    build: 0,
    cycle: 0,
    builtAt: "",
    ...overrides,
  };
}

describe("formatVersion", () => {
  it("formats a basic version", () => {
    expect(formatVersion(makeVersion({ major: 0, minor: 3, cycle: 42, build: 7 }))).toBe(
      "v0.3.42+build.7",
    );
  });

  it("formats initial version", () => {
    expect(formatVersion(makeVersion())).toBe("v0.0.0+build.0");
  });

  it("formats a major release", () => {
    expect(formatVersion(makeVersion({ major: 1, minor: 0, cycle: 100, build: 50 }))).toBe(
      "v1.0.100+build.50",
    );
  });

  it("uses cycle number as the third segment, not patch", () => {
    // The format is v{major}.{minor}.{cycle}+build.{build}
    const v = makeVersion({ major: 2, minor: 5, patch: 99, cycle: 42, build: 10 });
    expect(formatVersion(v)).toBe("v2.5.42+build.10");
  });
});

// For the I/O-dependent functions (loadVersion, recordSuccessfulBuild, applyVersionBump,
// setReleaseStage), we test them using fs mocking. We dynamically import the module
// after mocking to ensure the mocks are in place.

describe("version I/O functions", () => {
  const mockFs = {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  };

  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  // Using vi.doMock for dynamic ESM mocking
  async function importVersionModule() {
    vi.doMock("fs", () => ({ default: mockFs }));
    // Also mock the logger to avoid winston initialization issues
    vi.doMock("../utils/logger.js", () => ({
      logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    }));
    const mod = await import("./version.js");
    return mod;
  }

  it("loadVersion returns initial version when file does not exist", async () => {
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error("ENOENT");
    });
    const { loadVersion } = await importVersionModule();
    const v = loadVersion();
    expect(v.major).toBe(0);
    expect(v.minor).toBe(0);
    expect(v.build).toBe(0);
  });

  it("loadVersion reads and parses existing version file", async () => {
    const stored = { major: 1, minor: 2, patch: 5, build: 10, cycle: 5, builtAt: "2025-01-01" };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored));
    const { loadVersion } = await importVersionModule();
    const v = loadVersion();
    expect(v.major).toBe(1);
    expect(v.minor).toBe(2);
    expect(v.build).toBe(10);
  });

  it("recordSuccessfulBuild increments build and sets cycle", async () => {
    const stored = { major: 0, minor: 1, patch: 3, build: 5, cycle: 3, builtAt: "" };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored));
    const { recordSuccessfulBuild } = await importVersionModule();
    const v = recordSuccessfulBuild(7);
    expect(v.build).toBe(6);
    expect(v.cycle).toBe(7);
    expect(v.patch).toBe(7);
    expect(mockFs.writeFileSync).toHaveBeenCalledOnce();
  });

  it("applyVersionBump 'major' increments major and resets minor", async () => {
    const stored = { major: 0, minor: 3, patch: 10, build: 15, cycle: 10, builtAt: "" };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored));
    const { applyVersionBump } = await importVersionModule();
    const v = applyVersionBump("major");
    expect(v.major).toBe(1);
    expect(v.minor).toBe(0);
  });

  it("applyVersionBump 'minor' increments minor only", async () => {
    const stored = { major: 1, minor: 3, patch: 10, build: 15, cycle: 10, builtAt: "" };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored));
    const { applyVersionBump } = await importVersionModule();
    const v = applyVersionBump("minor");
    expect(v.major).toBe(1);
    expect(v.minor).toBe(4);
  });

  it("applyVersionBump sets release stage when provided", async () => {
    const stored = { major: 0, minor: 1, patch: 5, build: 8, cycle: 5, builtAt: "" };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored));
    const { applyVersionBump } = await importVersionModule();
    const v = applyVersionBump("minor", "Beta");
    expect(v.releaseStage).toBe("Beta");
  });

  it("setReleaseStage sets label without changing numbers", async () => {
    const stored = { major: 1, minor: 2, patch: 5, build: 10, cycle: 5, builtAt: "" };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored));
    const { setReleaseStage } = await importVersionModule();
    const v = setReleaseStage("Demo");
    expect(v.releaseStage).toBe("Demo");
    expect(v.major).toBe(1);
    expect(v.minor).toBe(2);
  });
});
