import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { listCommittedSpriteImages } from "./committer.js";

let repo: string;

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: repo, encoding: "utf-8" }).trim();
}

function write(rel: string, content = "x\n"): void {
  const file = path.join(repo, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function commitAll(message: string): string {
  git("add", "--all");
  git("commit", "-q", "-m", message);
  return git("rev-parse", "HEAD");
}

beforeEach(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), "committer-"));
  git("init", "-q", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");
  write("pokeemerald/graphics/pokemon/treecko_hoenn/front.png", "old\n");
  write("pokeemerald/graphics/pokemon/treecko_hoenn/back.png", "old\n");
  write("pokeemerald/graphics/pokemon/mudkip_hoenn/front.png", "old\n");
  commitAll("baseline");
});

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

describe("listCommittedSpriteImages", () => {
  it("lists sprite PNGs the commit added or modified, without palettes, footprints or deletions", async () => {
    write("pokeemerald/graphics/pokemon/treecko_hoenn/front.png", "new\n");
    write("pokeemerald/graphics/pokemon/treecko_hoenn/anim_front.png");
    write("pokeemerald/graphics/pokemon/treecko_hoenn/footprint.png");
    write("pokeemerald/graphics/pokemon/treecko_hoenn/normal.pal");
    write("pokeemerald/graphics/trainers/front_pics/oak.png");
    write("memory/sprite-iterations.md");
    fs.rmSync(path.join(repo, "pokeemerald/graphics/pokemon/mudkip_hoenn/front.png"));
    const hash = commitAll("cycle");

    expect(await listCommittedSpriteImages(hash, repo)).toEqual([
      "pokeemerald/graphics/pokemon/treecko_hoenn/anim_front.png",
      "pokeemerald/graphics/pokemon/treecko_hoenn/front.png",
    ]);
  });

  it("returns nothing for a commit that touched no sprites", async () => {
    write("memory/sprite-iterations.md");
    const hash = commitAll("memory only");

    expect(await listCommittedSpriteImages(hash, repo)).toEqual([]);
  });
});
