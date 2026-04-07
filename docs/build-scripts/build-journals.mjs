#!/usr/bin/env node

/**
 * Build script: parses journal/cycle-*.md files into docs/data/journals.json
 * Run: node docs/build-journals.mjs
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..');
const ROOT = join(DOCS_DIR, '..');
const JOURNAL_DIR = join(ROOT, 'journal');
const OUTPUT_DIR = join(DOCS_DIR, 'public', 'data');
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
  const filesModified = parseFilesList(sections['Files Modified'] || '');
  const buildResult = parseBuildResult(sections['Build Result'] || '');
  const summary = (sections['Summary'] || '').trim();
  const nextSteps = (sections['Next Steps'] || '').trim();
  const stats = parseStats(sections['Stats'] || '');
  const validationStatus = parseValidationStatus(sections['Validation Warnings'] || '');
  const isReverted = /\[REVERTED/.test(summary);
  const cycleResult = computeCycleResult({ isReverted, validationStatus, buildResult, mode });

  // Plan output: first try the journal section, then fall back to git diff
  let planOutput = (sections['Plan Output'] || '').trim();
  if (!planOutput && mode === 'planning') {
    planOutput = extractPlanOutputFromGit(cycle);
  }

  return {
    cycle,
    date,
    mode,
    objective,
    reasoning,
    filesModified,
    buildResult,
    summary,
    nextSteps,
    stats,
    ...(cycleResult ? { cycleResult } : {}),
    ...(planOutput ? { planOutput } : {}),
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
 * Parse validation warnings section for status.
 */
function parseValidationStatus(text) {
  if (!text.trim()) return null;
  const m = text.match(/\*\*Status\*\*:\s*(INCOMPLETE|UNSUBSTANTIATED)/i);
  return m ? m[1].toUpperCase() : null;
}

/**
 * Compute the overall cycle result from all available signals.
 * Priority: reverted > validation warning > build result > planning mode.
 */
function computeCycleResult({ isReverted, validationStatus, buildResult, mode }) {
  if (isReverted) return { status: 'reverted', label: 'REVERTED' };
  if (validationStatus === 'INCOMPLETE') return { status: 'incomplete', label: 'INCOMPLETE' };
  if (validationStatus === 'UNSUBSTANTIATED') return { status: 'unsubstantiated', label: 'UNSUBSTANTIATED' };
  if (buildResult?.status === 'failure') return { status: 'build-failed', label: 'BUILD FAILED' };
  if (buildResult?.status === 'success') return { status: 'build-passed', label: 'BUILD PASSED' };
  if (mode === 'planning') return { status: 'plan-designed', label: 'PLAN DESIGNED' };
  return null;
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

  const tokensMatch = text.match(/Tokens used:\s*([\d,]+)/i);
  if (tokensMatch) stats.tokensUsed = parseInt(tokensMatch[1].replace(/,/g, ''), 10);

  return Object.keys(stats).length > 0 ? stats : null;
}

/**
 * For planning cycles without a ## Plan Output section in the journal,
 * extract the strategy-notes additions from the git diff of that cycle's commit.
 */
function extractPlanOutputFromGit(cycle) {
  try {
    const padded = String(cycle).padStart(4, '0');
    const hash = execSync(
      `git log --all --format=%H --grep="cycle ${padded}" -- journal/`,
      { cwd: ROOT, encoding: 'utf-8', timeout: 10000 },
    ).trim().split('\n')[0];
    if (!hash) return '';

    const diff = execSync(
      `git diff ${hash}^..${hash} -- memory/strategy-notes.md`,
      { cwd: ROOT, encoding: 'utf-8', timeout: 10000 },
    );
    if (!diff) return '';

    // Extract only added lines (skip diff headers like +++ and @@)
    return diff
      .split('\n')
      .filter(line => line.startsWith('+') && !line.startsWith('+++'))
      .map(line => line.slice(1))
      .join('\n')
      .trim();
  } catch {
    return '';
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
