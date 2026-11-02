#!/usr/bin/env node
'use strict';

// Pokenav Birch call byte budget (C332).
//
// gStringVar4 is 0x3E8 (1000) bytes. src/match_call.c joins labels from
// data/text/pokedex_rating.inc into it at runtime (BufferPokedexRatingForMatchCall,
// BufferBirchRedInkReport, BufferFieldNotesPage), separated by CHAR_PROMPT_CLEAR.
// check_text_width only sees one .string line at a time, so nothing else checks the
// joined length. This script prices every label and adds up the worst cases.
//
// Cost assumptions (bytes after StringExpandPlaceholders):
//   - each visible character = 1 (charmap: é and … are single bytes)
//   - \n, \l, \p (and any other backslash escape) = 1
//   - {PLAYER} = 7 (PLAYER_NAME_LENGTH)
//   - {KUN} = 0 (gText_ExpandedPlaceholder_Kun/Chan are empty in English)
//   - {STR_VAR_1..3} = 3 (3-digit dex counts, ConvertIntToDecimalStringN n=3)
//   - {COLOR X}, {SHADOW X} = 3 each (EXT_CTRL_CODE_BEGIN, code, value)
//   - any other {...} is an error: add a cost here first
//   - the trailing $ is not counted; EOS is counted once per joined path
//   - every join adds 1 byte (CHAR_PROMPT_CLEAR)
//
// Fails (exit 1) when a required label is missing, a placeholder has no cost, or any
// total exceeds 1000 B. Warns (exit 0) when the Pokenav total exceeds 950 B, or when a
// visible line of a gBirchRedInkText_* label is longer than 28 chars ({PLAYER} = 7).
//
// Usage: node scripts/check_matchcall_len.cjs [--selftest]
//        (run by `make check_matchcall_len`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RATING_INC = path.join(ROOT, 'data/text/pokedex_rating.inc');
const BUDGET = 1000; // sizeof(gStringVar4)
const WARN_AT = 950;
const RED_INK_LINE_MAX = 28;

const PLACEHOLDER_COSTS = {
  PLAYER: 7,
  KUN: 0,
  STR_VAR_1: 3,
  STR_VAR_2: 3,
  STR_VAR_3: 3,
};
const PREFIX_COSTS = { COLOR: 3, SHADOW: 3 };

const REQUIRED = [
  'gBirchDexRatingText_AreYouCurious',
  'gBirchDexRatingText_SoYouveSeenAndCaught',
  'gBirchDexRatingText_OnANationwideBasis',
  'gBirchFieldNoteText_Header',
  'gBirchRedInkText_Open',
  'gBirchRedInkText_Believed',
  'gBirchRedInkText_OnlyYou',
  'gBirchRedInkText_Close',
];
const NOTEBOOK_PAGES = ['Lotad', 'Shroomish', 'Gligar', 'Vulpix', 'Torchic', 'Mudkip', 'Treecko'];

// label -> concatenated .string contents (without the trailing $)
function parseLabels(text) {
  const labels = new Map();
  let current = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    const label = /^(\w+)::?$/.exec(line);
    if (label) {
      current = label[1];
      labels.set(current, '');
      continue;
    }
    const str = /^\s*\.string\s+"((?:[^"\\]|\\.)*)"/.exec(line);
    if (str && current) {
      labels.set(current, labels.get(current) + str[1].replace(/\$$/, ''));
    }
  }
  return labels;
}

function placeholderCost(name, label) {
  if (Object.prototype.hasOwnProperty.call(PLACEHOLDER_COSTS, name)) return PLACEHOLDER_COSTS[name];
  const word = name.split(/\s+/)[0];
  if (Object.prototype.hasOwnProperty.call(PREFIX_COSTS, word) && name.includes(' ')) return PREFIX_COSTS[word];
  throw new Error(`unknown placeholder ${name} in ${label}: add a cost`);
}

// Byte cost of one label's contents, EOS excluded
function cost(contents, label) {
  let n = 0;
  for (let i = 0; i < contents.length; i++) {
    const c = contents[i];
    if (c === '\\') {
      n += 1;
      i++;
    } else if (c === '{') {
      const end = contents.indexOf('}', i);
      if (end < 0) throw new Error(`unclosed { in ${label}`);
      n += placeholderCost(contents.slice(i + 1, end).trim(), label);
      i = end;
    } else {
      n += 1;
    }
  }
  return n;
}

// Visible lines (split on \n \l \p) with placeholders priced as visible width
function visibleLines(contents) {
  return contents.split(/\\[nlp]/).map((line) => {
    let len = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '{') {
        const end = line.indexOf('}', i);
        const name = line.slice(i + 1, end).trim();
        if (name === 'PLAYER') len += 7;
        else if (/^STR_VAR_\d$/.test(name)) len += 3;
        i = end;
      } else {
        len += 1;
      }
    }
    return { line, len };
  });
}

function analyse(labels) {
  const errors = [];
  const warnings = [];
  const lines = [];
  for (const name of REQUIRED) {
    if (!labels.has(name)) errors.push(`required label ${name} is missing`);
  }
  if (errors.length) return { errors, warnings, lines, totals: {} };

  const c = (name) => cost(labels.get(name), name);
  const maxOf = (names) => {
    let best = { name: '-', len: 0 };
    for (const n of names) {
      const len = c(n);
      if (len > best.len) best = { name: n, len };
    }
    return best;
  };
  const all = [...labels.keys()];

  const ratings = maxOf(all.filter((n) => /^gBirchDexRatingText_(LessThan\d+|DexCompleted)$/.test(n)));
  const notes = maxOf(all.filter((n) => n.startsWith('gBirchFieldNoteText_') && n !== 'gBirchFieldNoteText_Header'));
  const fixedInk = new Set(['Open', 'Believed', 'OnlyYou', 'Close'].map((s) => `gBirchRedInkText_${s}`));
  const believers = all.filter((n) => n.startsWith('gBirchRedInkText_') && !fixedInk.has(n));
  const verdict = maxOf(['gBirchRedInkText_Believed', 'gBirchRedInkText_OnlyYou']);

  // In-person report alone: Open + (1 + name)* + 1 + verdict + 1 + Close + EOS
  let report = c('gBirchRedInkText_Open');
  lines.push(`  red ink Open                             ${c('gBirchRedInkText_Open')}`);
  for (const b of believers) {
    report += 1 + c(b);
    lines.push(`  + 1 + ${b.padEnd(34)} ${c(b)}`);
  }
  report += 1 + verdict.len + 1 + c('gBirchRedInkText_Close') + 1;
  lines.push(`  + 1 + max(Believed, OnlyYou) ${verdict.name.padEnd(25)} ${verdict.len}`);
  lines.push(`  + 1 + red ink Close                      ${c('gBirchRedInkText_Close')}`);

  const parts = [
    ['AreYouCurious', c('gBirchDexRatingText_AreYouCurious')],
    ['SoYouveSeenAndCaught', c('gBirchDexRatingText_SoYouveSeenAndCaught')],
    [`max rating ${ratings.name}`, ratings.len],
    ['OnANationwideBasis', c('gBirchDexRatingText_OnANationwideBasis')],
    ['field note Header', c('gBirchFieldNoteText_Header')],
    [`max field note ${notes.name}`, notes.len],
  ];
  const pre = [];
  let pokenav = 0;
  for (const [name, len] of parts) {
    pokenav += len + 1; // label + the CHAR_PROMPT_CLEAR after it
    pre.push(`  ${name.padEnd(40)} ${len} (+1)`);
  }
  pokenav += report; // report already carries its EOS

  // Notebook pages: old + 1 + ink [+ 1 + margin] + EOS
  let longestPage = { name: '-', len: 0 };
  for (const p of NOTEBOOK_PAGES) {
    const old = `gFieldNotesText_${p}`;
    const ink = `gFieldNotesText_${p}Ink`;
    const margin = `gFieldNotesText_${p}Margin`;
    if (!labels.has(old) || !labels.has(ink)) {
      errors.push(`notebook page ${p}: missing ${old} or ${ink}`);
      continue;
    }
    let len = c(old) + 1 + c(ink) + 1;
    if (labels.has(margin)) len += 1 + c(margin);
    if (len > longestPage.len) longestPage = { name: p, len };
  }
  for (const p of ['Cover', 'CoverYours', 'LastPage']) {
    const name = `gFieldNotesText_${p}`;
    if (!labels.has(name)) continue;
    const len = c(name) + 1;
    if (len > longestPage.len) longestPage = { name: p, len };
  }

  for (const n of all.filter((x) => x.startsWith('gBirchRedInkText_'))) {
    for (const { line, len } of visibleLines(labels.get(n))) {
      if (len > RED_INK_LINE_MAX) warnings.push(`${n}: line "${line}" is ${len} chars (> ${RED_INK_LINE_MAX})`);
    }
  }

  if (pokenav > BUDGET) errors.push(`Pokenav Birch call worst case ${pokenav} B exceeds ${BUDGET} B`);
  else if (pokenav > WARN_AT) warnings.push(`Pokenav Birch call worst case ${pokenav} B is within ${BUDGET - pokenav} B of the budget`);
  if (report > BUDGET) errors.push(`in-person report ${report} B exceeds ${BUDGET} B`);
  if (longestPage.len > BUDGET) errors.push(`notebook page ${longestPage.name} ${longestPage.len} B exceeds ${BUDGET} B`);

  return {
    errors,
    warnings,
    lines: ['Pokenav call (each component + 1 B prompt-clear):', ...pre, 'Red ink report:', ...lines],
    totals: { pokenav, report, longestPage },
  };
}

function selftest() {
  const fail = (msg) => {
    console.error(`check_matchcall_len: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  if (cost('{PLAYER}', 't') !== 7) fail('{PLAYER} should cost 7');
  if (cost('\\p', 't') !== 1) fail('\\p should cost 1');
  if (cost('{COLOR RED}{SHADOW LIGHT_RED}ab', 't') !== 8) fail('{COLOR X}{SHADOW X}ab should cost 8');
  if (cost('{PLAYER}{KUN}', 't') !== 7) fail('{KUN} should cost 0');
  let threw = false;
  try {
    cost('{RIVAL}', 't');
  } catch (e) {
    threw = true;
  }
  if (!threw) fail('unknown placeholder {RIVAL} did not raise');

  const fixture = (bigLen) => {
    const m = new Map(REQUIRED.map((n) => [n, 'x']));
    for (const p of NOTEBOOK_PAGES) {
      m.set(`gFieldNotesText_${p}`, 'z');
      m.set(`gFieldNotesText_${p}Ink`, 'z');
    }
    m.set('gBirchRedInkText_Fixture', 'y'.repeat(bigLen));
    return m;
  };
  const small = analyse(fixture(10));
  if (small.errors.length) fail(`small fixture reported ${small.errors.join('; ')}`);
  // 4 one-byte parts x (1+1) + 2 absent maxima x (0+1) = 10; report Open 1 + (1+10) + 1+1 + 1+1 + EOS 1 = 17
  if (small.totals.pokenav !== 27) fail(`small fixture total ${small.totals.pokenav}, expected 27`);
  const big = analyse(fixture(1200));
  if (!big.errors.some((e) => e.includes('exceeds'))) fail('fixture over 1000 B was not reported');
  console.log('check_matchcall_len: selftest OK');
}

function main() {
  let result;
  try {
    result = analyse(parseLabels(fs.readFileSync(RATING_INC, 'utf8')));
  } catch (e) {
    console.error(`check_matchcall_len: ${e.message}`);
    process.exit(1);
  }
  for (const l of result.lines) console.log(l);
  if (result.totals.pokenav !== undefined) {
    const { pokenav, report, longestPage } = result.totals;
    console.log(`Pokénav Birch call worst case: ${pokenav} B of ${BUDGET}`);
    console.log(`In-person report: ${report} B`);
    console.log(`Longest notebook page: ${longestPage.name} ${longestPage.len} B`);
  }
  for (const w of result.warnings) console.log(`WARN ${w}`);
  if (result.errors.length) {
    console.error(`check_matchcall_len: ${result.errors.length} failure(s):`);
    for (const e of result.errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log('check_matchcall_len: OK');
}

if (process.argv.includes('--selftest')) selftest();
else main();
