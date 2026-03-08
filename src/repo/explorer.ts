import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { POKEEMERALD_DIR } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

/** Resolve and validate a path is within pokeemerald/ */
function safePath(relativePath: string): string {
  const resolved = path.resolve(POKEEMERALD_DIR, relativePath);
  if (!resolved.startsWith(POKEEMERALD_DIR)) {
    throw new Error(`Path escapes pokeemerald directory: ${relativePath}`);
  }
  return resolved;
}

/** Read the full contents of a file */
export function readFile(relativePath: string): string {
  const fullPath = safePath(relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relativePath}`);
  }
  const stat = fs.statSync(fullPath);
  if (stat.size > 1024 * 1024) {
    throw new Error(`File too large (${stat.size} bytes): ${relativePath}. Use readLines instead.`);
  }
  return fs.readFileSync(fullPath, "utf-8");
}

/** Read specific lines from a file (1-indexed, inclusive) */
export function readLines(relativePath: string, startLine: number, endLine: number): string {
  const content = readFile(relativePath);
  const lines = content.split("\n");
  const start = Math.max(0, startLine - 1);
  const end = Math.min(lines.length, endLine);
  return lines.slice(start, end).join("\n");
}

/** List files and directories in a path */
export function listFiles(relativePath: string, maxDepth: number = 2): string[] {
  const fullPath = safePath(relativePath || ".");
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Directory not found: ${relativePath}`);
  }

  const results: string[] = [];

  function walk(dir: string, depth: number) {
    if (depth > maxDepth) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      // Skip build artifacts and hidden dirs
      if (entry.name === "build" || entry.name.startsWith(".")) continue;

      const rel = path.relative(POKEEMERALD_DIR, path.join(dir, entry.name));
      if (entry.isDirectory()) {
        results.push(rel + "/");
        walk(path.join(dir, entry.name), depth + 1);
      } else {
        results.push(rel);
      }
    }
  }

  walk(fullPath, 0);
  return results;
}

export interface SearchResult {
  file: string;
  line: number;
  content: string;
}

/** Search for a pattern across the codebase using grep */
export function searchCode(
  pattern: string,
  options: { filePattern?: string; maxResults?: number } = {},
): SearchResult[] {
  const { filePattern, maxResults = 50 } = options;
  const maxArg = `--max-count=5`; // per file

  // Sanitize pattern to prevent command injection
  if (/[;&|`$(){}]/.test(pattern)) {
    throw new Error("Pattern contains disallowed characters");
  }

  let cmd = `grep -rn ${maxArg} --include='*.c' --include='*.h' --include='*.s' --include='*.inc' --include='*.mk'`;

  if (filePattern) {
    if (/[;&|`$(){}]/.test(filePattern)) {
      throw new Error("File pattern contains disallowed characters");
    }
    cmd = `grep -rn ${maxArg} --include='${filePattern}'`;
  }

  cmd += ` -- ${JSON.stringify(pattern)} .`;

  try {
    const output = execSync(cmd, {
      cwd: POKEEMERALD_DIR,
      encoding: "utf-8",
      maxBuffer: 1024 * 1024,
      timeout: 15000,
    });

    const results: SearchResult[] = [];
    for (const line of output.split("\n")) {
      if (!line.trim()) continue;
      const match = line.match(/^\.\/(.+?):(\d+):(.*)$/);
      if (match) {
        results.push({
          file: match[1],
          line: parseInt(match[2], 10),
          content: match[3].trim(),
        });
        if (results.length >= maxResults) break;
      }
    }
    return results;
  } catch (err: unknown) {
    // grep exits with code 1 when no matches found
    if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 1) {
      return [];
    }
    throw err;
  }
}

/** Get basic info about a file */
export function getFileInfo(relativePath: string): {
  exists: boolean;
  size: number;
  lines: number;
  lastModified: string;
} {
  const fullPath = safePath(relativePath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, size: 0, lines: 0, lastModified: "" };
  }
  const stat = fs.statSync(fullPath);
  const content = fs.readFileSync(fullPath, "utf-8");
  return {
    exists: true,
    size: stat.size,
    lines: content.split("\n").length,
    lastModified: stat.mtime.toISOString(),
  };
}
