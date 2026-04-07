/**
 * Minimal unified-diff generator for pretty-printed JSON strings.
 *
 * Uses a simple LCS (longest common subsequence) approach to produce
 * a unified diff with context lines, suitable for rendering in the
 * debug UI's preview mode.
 */

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

interface DiffLine {
  tag: " " | "+" | "-";
  text: string;
}

function diffLines(a: string[], b: string[]): DiffLine[] {
  const dp = lcs(a, b);
  const result: DiffLine[] = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.push({ tag: " ", text: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ tag: "+", text: b[j - 1] });
      j--;
    } else {
      result.push({ tag: "-", text: a[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

/**
 * Produce a unified diff string from two multi-line texts.
 *
 * @param oldText  - Original file content
 * @param newText  - Modified file content
 * @param filename - Label for the diff header
 * @param context  - Number of context lines around each hunk (default 3)
 */
export function unifiedDiff(
  oldText: string,
  newText: string,
  filename: string,
  context = 3,
): string {
  if (oldText === newText) return "";

  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const diff = diffLines(oldLines, newLines);

  const hunks: string[] = [];
  hunks.push(`--- a/${filename}`);
  hunks.push(`+++ b/${filename}`);

  // Collect changed regions and emit hunks with context
  let hunkLines: string[] = [];
  let hunkOldStart = 0;
  let hunkNewStart = 0;
  let hunkOldCount = 0;
  let hunkNewCount = 0;
  let oldPos = 0;
  let newPos = 0;
  let lastChangeEnd = -1;

  for (let idx = 0; idx < diff.length; idx++) {
    const line = diff[idx];
    const isChange = line.tag !== " ";

    if (isChange) {
      // Start a new hunk if this change is far from the last one
      if (lastChangeEnd === -1 || idx - lastChangeEnd > context * 2) {
        // Flush previous hunk
        if (hunkLines.length > 0) {
          // Add trailing context from after last change
          const trailingStart = lastChangeEnd;
          const trailingEnd = Math.min(trailingStart + context, diff.length);
          for (let t = trailingStart; t < trailingEnd; t++) {
            if (diff[t].tag === " ") {
              hunkLines.push(` ${diff[t].text}`);
              hunkOldCount++;
              hunkNewCount++;
            }
          }
          hunks.push(
            `@@ -${hunkOldStart + 1},${hunkOldCount} +${hunkNewStart + 1},${hunkNewCount} @@`,
          );
          hunks.push(...hunkLines);
          hunkLines = [];
        }

        // Determine leading context for this new hunk
        const leadStart = Math.max(0, idx - context);
        oldPos = 0;
        newPos = 0;
        for (let k = 0; k < leadStart; k++) {
          if (diff[k].tag === " " || diff[k].tag === "-") oldPos++;
          if (diff[k].tag === " " || diff[k].tag === "+") newPos++;
        }
        hunkOldStart = oldPos;
        hunkNewStart = newPos;
        hunkOldCount = 0;
        hunkNewCount = 0;

        for (let k = leadStart; k < idx; k++) {
          if (diff[k].tag === " ") {
            hunkLines.push(` ${diff[k].text}`);
            hunkOldCount++;
            hunkNewCount++;
          }
        }
      } else if (lastChangeEnd < idx) {
        // Bridge context between two nearby changes
        for (let t = lastChangeEnd; t < idx; t++) {
          if (diff[t].tag === " ") {
            hunkLines.push(` ${diff[t].text}`);
            hunkOldCount++;
            hunkNewCount++;
          }
        }
      }

      hunkLines.push(`${line.tag}${line.text}`);
      if (line.tag === "-") hunkOldCount++;
      else hunkNewCount++;

      lastChangeEnd = idx + 1;
    }
  }

  // Flush final hunk
  if (hunkLines.length > 0) {
    const trailingEnd = Math.min(lastChangeEnd + context, diff.length);
    for (let t = lastChangeEnd; t < trailingEnd; t++) {
      if (diff[t].tag === " ") {
        hunkLines.push(` ${diff[t].text}`);
        hunkOldCount++;
        hunkNewCount++;
      }
    }
    hunks.push(
      `@@ -${hunkOldStart + 1},${hunkOldCount} +${hunkNewStart + 1},${hunkNewCount} @@`,
    );
    hunks.push(...hunkLines);
  }

  return hunks.join("\n");
}
