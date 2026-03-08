import fs from "fs";
import path from "path";
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

/** Write content to a file (creates parent directories as needed) */
export function writeFile(relativePath: string, content: string): void {
  const fullPath = safePath(relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
  logger.info(`Wrote file: ${relativePath} (${content.length} bytes)`);
}

/** Find and replace text within a file */
export function editFile(relativePath: string, search: string, replace: string): { replacements: number } {
  const fullPath = safePath(relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relativePath}`);
  }
  const content = fs.readFileSync(fullPath, "utf-8");
  const count = content.split(search).length - 1;
  if (count === 0) {
    throw new Error(`Search string not found in ${relativePath}`);
  }
  const newContent = content.replaceAll(search, replace);
  fs.writeFileSync(fullPath, newContent, "utf-8");
  logger.info(`Edited file: ${relativePath} (${count} replacement${count > 1 ? "s" : ""})`);
  return { replacements: count };
}

/** Insert text at a specific line number (1-indexed) */
export function insertLines(relativePath: string, lineNumber: number, text: string): void {
  const fullPath = safePath(relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relativePath}`);
  }
  const content = fs.readFileSync(fullPath, "utf-8");
  const lines = content.split("\n");
  const insertAt = Math.max(0, Math.min(lines.length, lineNumber - 1));
  const newLines = text.split("\n");
  lines.splice(insertAt, 0, ...newLines);
  fs.writeFileSync(fullPath, lines.join("\n"), "utf-8");
  logger.info(`Inserted ${newLines.length} line(s) at line ${lineNumber} in ${relativePath}`);
}

/** Delete a file */
export function deleteFile(relativePath: string): void {
  const fullPath = safePath(relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relativePath}`);
  }
  fs.unlinkSync(fullPath);
  logger.info(`Deleted file: ${relativePath}`);
}
