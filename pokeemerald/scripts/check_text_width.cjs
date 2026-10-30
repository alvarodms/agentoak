#!/usr/bin/env node
'use strict';

// C321: dialogue width lint. Measures every display line of `.string` text in
// FONT_NORMAL pixels (widths from gFontNormalLatinGlyphWidths in src/fonts.c,
// glyph bytes from charmap.txt) and fails on any line wider than 208px
// (the 26-tile battle message window; the field box is 27 tiles).
//
// Usage:
//   node scripts/check_text_width.cjs <file.inc> [...]   check all text in files
//   node scripts/check_text_width.cjs --diff             only text blocks with an
//       added .string line vs HEAD under data/, plus untracked data/**/*.inc

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MAX_WIDTH = 208;
const PLACEHOLDER_WIDTHS = { PLAYER: 42, RIVAL: 42, KUN: 0, STR_VAR_1: 60, STR_VAR_2: 60, STR_VAR_3: 60 };

// --- glyph tables ----------------------------------------------------------
const widths = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'src/fonts.c'), 'utf8');
  const m = src.match(/gFontNormalLatinGlyphWidths\[\]\s*=\s*\{([^}]*)\}/);
  if (!m) throw new Error('gFontNormalLatinGlyphWidths not found in src/fonts.c');
  return m[1].split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n)).slice(0, 256);
})();

const charBytes = new Map();  // 'c' -> byte
const namedBytes = new Map(); // NAME -> [bytes]
for (const line of fs.readFileSync(path.join(ROOT, 'charmap.txt'), 'utf8').split('\n')) {
  let m = line.match(/^'((?:\\.|[^'])+)'\s*=\s*([0-9A-Fa-f]{2})\b/);
  if (m) {
    const ch = /^\\[^nlp]$/.test(m[1]) ? m[1][1] : m[1];
    if (!charBytes.has(ch)) charBytes.set(ch, parseInt(m[2], 16));
    continue;
  }
  m = line.match(/^([A-Z0-9_]+)\s*=\s*((?:[0-9A-Fa-f]{2}\s*)+)/);
  if (m && !namedBytes.has(m[1])) namedBytes.set(m[1], m[2].trim().split(/\s+/).map(h => parseInt(h, 16)));
}

// --- measuring -------------------------------------------------------------
const warnings = new Set();
const END = '$';

// Splits one text block (its .string parts) into display lines: [{ text, width, lineNo }]
function measure(parts, where) {
  const lines = [];
  let cur = '', w = 0, lineNo = 0, fresh = true;
  const flush = () => { lines.push({ text: cur, width: w, lineNo }); cur = ''; w = 0; fresh = true; };
  for (const part of parts) {
    const text = part.text;
    for (let i = 0; i < text.length; i++) {
      if (fresh) { lineNo = part.lineNo; fresh = false; }
      const c = text[i];
      if (c === END) { flush(); return lines; }
      if (c === '\\' && i + 1 < text.length) {
        const e = text[++i];
        if ('nlp'.includes(e)) { flush(); continue; }
        const b = charBytes.get(e);
        if (b === undefined) warnings.add(`${where}: unknown escape \\${e}`);
        else { w += widths[b]; cur += e; }
        continue;
      }
      if (c === '{') {
        const end = text.indexOf('}', i);
        const token = text.slice(i + 1, end).trim();
        const name = token.split(/\s+/)[0];
        i = end;
        cur += `{${token}}`;
        if (name in PLACEHOLDER_WIDTHS) { w += PLACEHOLDER_WIDTHS[name]; continue; }
        const bytes = namedBytes.get(name);
        if (bytes && bytes[0] === 0xFC) continue; // control code (color, pause, ...): no width
        if (bytes && bytes[0] !== 0xFD) { for (const b of bytes) w += widths[b]; continue; }
        warnings.add(`${where}: {${token}} counted as 0px`);
        continue;
      }
      const b = charBytes.get(c);
      if (b === undefined) { warnings.add(`${where}: non-charmap character '${c}'`); continue; }
      w += widths[b];
      cur += c;
    }
  }
  if (!fresh) flush();
  return lines;
}

// Returns [{ label, startLine, parts: [{ lineNo, text }] }] for every run of .string lines.
function textBlocks(file) {
  const blocks = [];
  let label = '?', block = null;
  fs.readFileSync(file, 'utf8').split('\n').forEach((raw, idx) => {
    const lm = raw.match(/^([A-Za-z_][A-Za-z0-9_]*)::?/);
    if (lm) label = lm[1];
    const sm = raw.match(/^\s*\.string\s+"((?:\\.|[^"\\])*)"/);
    if (!sm) { block = null; return; }
    if (!block) { block = { label, startLine: idx + 1, parts: [] }; blocks.push(block); }
    block.parts.push({ lineNo: idx + 1, text: sm[1] });
  });
  return blocks;
}

// --- file selection --------------------------------------------------------
const git = cmd => execSync(cmd, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
const args = process.argv.slice(2);
const targets = new Map(); // file -> Set(added line numbers), or null for "every block"
if (args.includes('--diff')) {
  let file = null;
  for (const line of git('git diff -U0 --relative HEAD -- data/').split('\n')) {
    if (line.startsWith('+++ ')) { file = line === '+++ /dev/null' ? null : line.slice(6); continue; }
    const hm = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/);
    if (hm && file && file.endsWith('.inc')) {
      const start = +hm[1], count = hm[2] === undefined ? 1 : +hm[2];
      if (!targets.has(file)) targets.set(file, new Set());
      for (let n = start; n < start + count; n++) targets.get(file).add(n);
    }
  }
  for (const f of git('git ls-files --others --exclude-standard -- data/').split('\n'))
    if (f.endsWith('.inc')) targets.set(f, null);
} else {
  for (const f of args) targets.set(path.relative(ROOT, path.resolve(f)), null);
}

// --- run -------------------------------------------------------------------
let failures = 0, checked = 0, widest = { width: 0 };
for (const [file, added] of targets) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) continue;
  for (const blk of textBlocks(abs)) {
    if (added && !blk.parts.some(pt => added.has(pt.lineNo))) continue;
    checked++;
    for (const ln of measure(blk.parts, `${file}:${blk.startLine} ${blk.label}`)) {
      if (ln.width > widest.width) widest = { ...ln, file, label: blk.label };
      if (ln.width <= MAX_WIDTH) continue;
      failures++;
      console.log(`${file}:${ln.lineNo} ${blk.label} "${ln.text}" = ${ln.width}px`);
    }
  }
}
for (const w of warnings) console.log(`warning: ${w}`);
console.log(`check_text_width: ${checked} text block(s) checked` +
  (widest.file ? `; widest line ${widest.width}px (${widest.file}:${widest.lineNo} "${widest.text}")` : ''));
if (failures) {
  console.log(`check_text_width: ${failures} line(s) wider than ${MAX_WIDTH}px`);
  process.exit(1);
}
