/**
 * Tech-debt and creative backlogs: markdown tables of ideas the Producer
 * captured but deferred. The Producer re-captures a deferred idea every cycle
 * it is still deferred, so an item whose title matches a pending row updates
 * that row instead of adding a duplicate.
 */

import fs from "fs";
import path from "path";

/**
 * The title an item is matched on: the text before its first ":", " — ", " (",
 * or "." with markdown emphasis removed, lowercased.
 * "**JSON trainer config extraction**: move …" → "json trainer config extraction".
 */
export function backlogItemKey(text: string): string {
  const plain = text.replace(/\*\*|__|`/g, "").trim();
  const title = plain.split(/:| — | \(|\. /)[0];
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Add `text` to the backlog table at `filePath`, or update the pending row with
 * the same title. An updated row keeps its first cycle and spans to
 * `cycleNumber` (e.g. "304-307"), so its age stays visible.
 */
export function upsertBacklogItem(
  filePath: string,
  header: string,
  cycleNumber: number,
  text: string,
): void {
  const sanitized = text.replace(/\|/g, "—").replace(/\n/g, " ").trim();
  const key = backlogItemKey(sanitized);

  let content: string;
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf-8");
  } else {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    content = header;
  }

  const lines = content.split("\n");
  // Rows are "| Cycle | Text | Status |"; match the last pending row with this title
  const rowPattern = /^\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*$/;
  let matchIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(rowPattern);
    if (m && m[3].toLowerCase().startsWith("pending") && key && backlogItemKey(m[2]) === key) {
      matchIndex = i;
    }
  }

  if (matchIndex >= 0) {
    const firstCycle = lines[matchIndex].match(rowPattern)![1].match(/\d+/)?.[0] ?? String(cycleNumber);
    const span = firstCycle === String(cycleNumber) ? firstCycle : `${firstCycle}-${cycleNumber}`;
    lines[matchIndex] = `| ${span} | ${sanitized} | pending |`;
    content = lines.join("\n");
  } else {
    if (!content.endsWith("\n")) content += "\n";
    content += `| ${cycleNumber} | ${sanitized} | pending |\n`;
  }

  fs.writeFileSync(filePath, content, "utf-8");
}
