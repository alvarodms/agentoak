#!/usr/bin/env node

/**
 * Build script: parses journal/cycle-*.md files into docs/data/journals.json
 * Run: node docs/build-journals.mjs
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const JOURNAL_DIR = join(ROOT, 'journal');
const OUTPUT_DIR = join(__dirname, 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'journals.json');

async function main() {
  const files = (await readdir(JOURNAL_DIR))
    .filter(f => /^cycle-\d+\.md$/.test(f))
    .sort();

  const entries = [];

  for (const file of files) {
    const md = await readFile(join(JOURNAL_DIR, file), 'utf-8');
    try {
      const entry = parseJournal(md, file);
      entries.push(entry);
    } catch (err) {
      console.error(`⚠ Failed to parse ${file}: ${err.message}`);
    }
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(entries, null, 2) + '\n');
  console.log(`✔ Generated ${OUTPUT_FILE} (${entries.length} entries)`);
}

/**
 * Parse a cycle journal markdown file into a structured object.
 */
function parseJournal(md, filename) {
  const cycleMatch = filename.match(/cycle-(\d+)\.md/);
  const cycle = cycleMatch ? parseInt(cycleMatch[1], 10) : 0;

  // Split into sections by ## headings
  const sections = splitSections(md);

  // Parse header metadata (before first ##)
  const header = sections['_header'] || '';
  const date = extractField(header, 'Date');
  const mode = extractField(header, 'Mode');
  const objective = extractField(header, 'Objective');

  // Parse each section
  const reasoning = (sections['Reasoning'] || '').trim();
  const actionsRaw = sections['Actions Taken'] || '';
  const actions = parseActions(actionsRaw);
  const filesModified = parseFilesList(sections['Files Modified'] || '');
  const buildResult = parseBuildResult(sections['Build Result'] || '');
  const summary = (sections['Summary'] || '').trim();
  const nextSteps = (sections['Next Steps'] || '').trim();
  const stats = parseStats(sections['Stats'] || '');

  return {
    cycle,
    date,
    mode,
    objective,
    reasoning,
    actions,
    filesModified,
    buildResult,
    summary,
    nextSteps,
    stats,
  };
}

/**
 * Split markdown by ## headings into { sectionName: content }.
 * Content before the first ## goes into '_header'.
 */
function splitSections(md) {
  const result = {};
  const lines = md.split('\n');
  let currentSection = '_header';
  let currentLines = [];

  for (const line of lines) {
    const headingMatch = line.match(/^## (.+)/);
    if (headingMatch) {
      result[currentSection] = currentLines.join('\n');
      currentSection = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  result[currentSection] = currentLines.join('\n');
  return result;
}

/**
 * Extract a **Key**: Value field from header text.
 */
function extractField(text, key) {
  const re = new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+?)\\s*$`, 'm');
  const m = text.match(re);
  return m ? m[1].replace(/\s+$/, '') : '';
}

/**
 * Parse numbered action lines into human-readable descriptions.
 * Format: `ToolType` — key: value, key: value  \n   → result
 */
function parseActions(text) {
  const actions = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const actionMatch = line.match(/^\d+\.\s+(.+)/);
    if (!actionMatch) continue;

    let raw = actionMatch[1];
    // Strip arrow result on same line
    const arrowIdx = raw.indexOf('→');
    if (arrowIdx > 0) raw = raw.substring(0, arrowIdx).trim();
    raw = raw.replace(/,\s*$/, '');

    // Extract tool type and params
    const toolMatch = raw.match(/^`(\w+)`\s*—\s*(.*)/);
    if (!toolMatch) {
      actions.push(truncate(raw, 150));
      continue;
    }

    const toolType = toolMatch[1];
    const params = toolMatch[2];

    const desc = formatAction(toolType, params);
    if (desc) actions.push(desc);
  }
  return actions;
}

/** Turn raw tool type + params into a readable action string. */
function formatAction(toolType, params) {
  const shortPath = (p) => {
    if (!p) return p;
    // Strip trailing ... and whitespace from truncated journal paths
    p = p.replace(/\.{3}\s*$/, '').trim();
    // Strip long absolute CI/runner paths, keep from pokeemerald/ or memory/ onward
    for (const prefix of ['pokeemerald/', 'memory/', 'journal/']) {
      const idx = p.indexOf(prefix);
      if (idx >= 0) {
        let result = p.substring(idx);
        // If the path is truncated (no extension), it won't be useful as-is;
        // try to show the last meaningful directory segment
        if (!/\.\w+$/.test(result) && result.length < 25) {
          return result + '…';
        }
        return result;
      }
    }
    // Fallback: take last path segments
    const parts = p.split('/').filter(Boolean);
    const tail = parts.slice(-2).join('/');
    return tail || p;
  };

  const getParam = (key) => {
    const re = new RegExp(`${key}:\\s*(.+?)(?:,\\s*\\w+:|$)`);
    const m = params.match(re);
    return m ? m[1].trim().replace(/\.\.\.$/, '').trim() : null;
  };

  switch (toolType) {
    case 'Bash': {
      const cmd = getParam('command');
      if (!cmd) return `Ran shell command`;
      // Extract the base command
      const base = cmd.replace(/^cd\s+\S+\s*&&\s*/, '').split(/\s/)[0];
      const desc = getParam('description');
      if (desc) return desc;
      return `Ran: ${truncate(cmd, 120)}`;
    }
    case 'Read': {
      const fp = getParam('file_path');
      return `Read ${shortPath(fp || 'file')}`;
    }
    case 'Write': {
      const fp = getParam('file_path');
      return `Wrote ${shortPath(fp || 'file')}`;
    }
    case 'Edit': {
      const fp = getParam('file_path');
      return `Edited ${shortPath(fp || 'file')}`;
    }
    case 'Grep': {
      const pattern = getParam('pattern');
      return `Searched for "${truncate(pattern || '...', 60)}"`;
    }
    case 'Glob': {
      const pattern = getParam('pattern');
      return `Found files matching ${truncate(pattern || '...', 60)}`;
    }
    case 'Agent': {
      const desc = getParam('description');
      return desc ? `Subagent: ${truncate(desc, 100)}` : 'Ran subagent';
    }
    case 'ToolSearch':
      return null; // Skip internal tool lookups
    default:
      return truncate(`${toolType}: ${params}`, 150);
  }
}

function truncate(s, max) {
  if (!s || s.length <= max) return s;
  return s.substring(0, max - 3) + '...';
}

/**
 * Parse file list from "- path" bullet points.
 */
function parseFilesList(text) {
  const files = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^-\s+(.+)/);
    if (m) {
      // Strip absolute build paths, keep relative from project root
      let filePath = m[1].trim();
      const projIdx = filePath.indexOf('pokeemerald/');
      if (projIdx >= 0) filePath = filePath.substring(projIdx);
      const memIdx = filePath.indexOf('memory/');
      if (memIdx >= 0 && projIdx < 0) filePath = filePath.substring(memIdx);
      files.push(filePath);
    }
  }
  return files;
}

/**
 * Parse build result section.
 */
function parseBuildResult(text) {
  if (!text.trim()) return null;
  const success = /✅\s*SUCCESS/i.test(text);
  const failure = /❌\s*FAIL/i.test(text);
  if (!success && !failure) return null;
  return {
    status: success ? 'success' : 'failure',
    errors: [],
  };
}

/**
 * Parse stats section.
 */
function parseStats(text) {
  const stats = {};
  const toolCallsMatch = text.match(/Tool calls:\s*(\d+)/i);
  if (toolCallsMatch) stats.toolCalls = parseInt(toolCallsMatch[1], 10);

  const tokensMatch = text.match(/Tokens used:\s*([\d,]+)/i);
  if (tokensMatch) stats.tokensUsed = parseInt(tokensMatch[1].replace(/,/g, ''), 10);

  return Object.keys(stats).length > 0 ? stats : null;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
