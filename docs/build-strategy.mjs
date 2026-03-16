#!/usr/bin/env node

/**
 * Build script: parses memory/strategy-notes.md into docs/data/strategy.json
 * Extracts vision statement, starter info, and implementation roadmap.
 * Run: node docs/build-strategy.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STRATEGY_FILE = join(ROOT, 'memory', 'strategy-notes.md');
const OUTPUT_DIR = join(__dirname, 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'strategy.json');

async function main() {
  const md = await readFile(STRATEGY_FILE, 'utf-8');

  const vision = parseVision(md);
  const starters = parseStarters(md);
  const completed = parseCompletedRoadmap(md);
  const upcoming = parseUpcomingRoadmap(md);

  const strategy = {
    generatedAt: new Date().toISOString(),
    vision,
    starters,
    roadmap: { completed, upcoming },
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(strategy, null, 2) + '\n');
  console.log(`✔ Generated ${OUTPUT_FILE}`);
  console.log(`  Vision: ${vision.title}`);
  console.log(`  Starters: ${starters.map(s => s.name).join(', ')}`);
  console.log(`  Completed cycles: ${completed.length}`);
  console.log(`  Upcoming cycles: ${upcoming.length}`);
}

/**
 * Extract the vision statement from "## 1. Vision Statement" section.
 */
function parseVision(md) {
  const match = md.match(/## 1\. Vision Statement\s+([\s\S]*?)(?=\n---|\n## \d)/);
  if (!match) return { title: '', description: '' };

  const text = match[1].trim();

  // Extract the bold title: **Legends of Hoenn** — description  OR  **Legends of Hoenn** is a...
  const titleMatch = text.match(/\*\*(.+?)\*\*\s*(?:[—–-]\s*)?([\s\S]*)/);
  if (titleMatch) {
    return {
      title: titleMatch[1].trim(),
      description: titleMatch[2].trim(),
    };
  }

  return { title: '', description: text };
}

/**
 * Extract starter trio from the table in "## 2. Thematic Identity".
 * Table format: | **Name** | → Evo1 → Evo2 | Type | Identity |
 */
function parseStarters(md) {
  const section = md.match(/### The Three Starter Lines as Identity Choices\s+([\s\S]*?)(?=\n###|\n---|\n## \d)/);
  if (!section) return [];

  const starters = [];
  const tableRows = section[1].match(/\|\s*\*\*(\w+)\*\*\s*\|([^|]*)\|([^|]*)\|([^|]*)\|/g);
  if (!tableRows) return [];

  for (const row of tableRows) {
    const cols = row.match(/\|\s*\*\*(\w+)\*\*\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|/);
    if (!cols) continue;

    const name = cols[1].trim();
    const evolutionLine = cols[2].trim();
    const types = cols[3].trim();
    const identity = cols[4].trim();

    starters.push({ name, evolutionLine, types, identity });
  }

  return starters;
}

/**
 * Extract completed roadmap entries from the "### Completed" table in Section 10.
 * Format: | Cycle N | ✅/❌/⚠️ Description |
 */
function parseCompletedRoadmap(md) {
  const section = md.match(/### Completed\s+([\s\S]*?)(?=\n### Upcoming|\n---|\n## \d)/);
  if (!section) return [];

  const entries = [];
  const rows = section[1].split('\n').filter(line => /^\|/.test(line) && !/^\|[\s-]*\|/.test(line) && !/Cycle\s*\|.*Achievement/i.test(line));

  for (const row of rows) {
    const cols = row.match(/\|\s*Cycle\s+(\d+)\s*\|\s*(.+?)\s*\|/);
    if (!cols) continue;

    const cycle = parseInt(cols[1], 10);
    const rawText = cols[2].trim();
    const status = rawText.startsWith('✅') ? 'completed' : rawText.startsWith('❌') ? 'failed' : rawText.startsWith('⚠️') ? 'partial' : 'completed';
    const description = rawText.replace(/^[✅❌⚠️]\s*/, '').trim();

    entries.push({ cycle, status, description });
  }

  return entries;
}

/**
 * Extract upcoming roadmap entries from the "### Upcoming Roadmap" table.
 * Format: | **N** | Objective | Priority | Complexity |
 */
function parseUpcomingRoadmap(md) {
  const section = md.match(/### Upcoming Roadmap[^|]*([\s\S]*?)(?=\n###|\n---|\n## \d)/);
  if (!section) return [];

  const entries = [];
  const rows = section[1].split('\n').filter(line => /^\|/.test(line) && !/^\|[\s-]*\|/.test(line) && !/Cycle\s*\|.*Objective/i.test(line));

  for (const row of rows) {
    const cols = row.match(/\|\s*\*\*(\d+)\*\*\s*\|\s*(.+?)\s*\|\s*(\w+)\s*\|\s*(.+?)\s*\|/);
    if (!cols) continue;

    const cycle = parseInt(cols[1], 10);
    const objective = cols[2].trim().replace(/\*\*(.+?)\*\*/, '$1');
    const priority = cols[3].trim();
    const complexity = cols[4].trim();

    entries.push({ cycle, objective, priority, complexity });
  }

  return entries;
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
