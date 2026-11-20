#!/usr/bin/env node
'use strict';

// Trainer generator (C266; reclaim mode + pure transforms C385).
//
// Modes (config "mode"):
//   create   appends a new trainer: raises TRAINERS_COUNT, which the trainer
//            flag space forbids in this hack. Do not use; reclaim instead.
//   modify   rewrites an existing party array and the trainer's .party line.
//   reclaim  renames an unreferenced trainer ID (fromId -> trainerId) in place,
//            keeping its number, and replaces its trainers.h block and party
//            array. Refuses (writes nothing) when fromId is undefined, a
//            DATA_ONLY link-battle placeholder (check_trainer_slots.cjs), still
//            referenced outside opponents.h/trainers.h/trainer_parties.h, or
//            when trainerId already exists. Appends trainerId to
//            check_trainer_slots.cjs RECLAIMED, so a map script must battle it.
//
// Every file edit is a pure text -> text transform; only main() reads/writes.
//
// Usage: node scripts/generate_trainer.cjs <config.json> [--dry-run] | --selftest
//        (selftest run by `make check_generate_trainer`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const slots = require('./check_trainer_slots.cjs');

const ROOT = path.join(__dirname, '..');
const OPPONENTS_REL = 'include/constants/opponents.h';
const TRAINERS_REL = 'src/data/trainers.h';
const PARTIES_REL = 'src/data/trainer_parties.h';
const SLOTS_REL = 'scripts/check_trainer_slots.cjs';

// ---------------------------------------------------------------------------
// Utility helpers (same patterns as generate_species.cjs)
// ---------------------------------------------------------------------------

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function insertBefore(content, marker, insertion) {
  const idx = content.indexOf(marker);
  if (idx === -1) return null;
  return content.slice(0, idx) + insertion + content.slice(idx);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Party type detection
// ---------------------------------------------------------------------------

function detectPartyType(party) {
  const anyItem = party.some(m => m.heldItem);
  const anyMoves = party.some(m => m.moves && m.moves.length > 0);
  if (anyItem && anyMoves) return 'ItemCustomMoves';
  if (anyItem && !anyMoves) return 'ItemDefaultMoves';
  if (!anyItem && anyMoves) return 'NoItemCustomMoves';
  return 'NoItemDefaultMoves';
}

const TYPE_TO_MACRO = {
  NoItemDefaultMoves: 'NO_ITEM_DEFAULT_MOVES',
  NoItemCustomMoves: 'NO_ITEM_CUSTOM_MOVES',
  ItemDefaultMoves: 'ITEM_DEFAULT_MOVES',
  ItemCustomMoves: 'ITEM_CUSTOM_MOVES',
};

const TYPE_TO_STRUCT = {
  NoItemDefaultMoves: 'TrainerMonNoItemDefaultMoves',
  NoItemCustomMoves: 'TrainerMonNoItemCustomMoves',
  ItemDefaultMoves: 'TrainerMonItemDefaultMoves',
  ItemCustomMoves: 'TrainerMonItemCustomMoves',
};

// ---------------------------------------------------------------------------
// Normalize party — fill missing fields based on detected type
// ---------------------------------------------------------------------------

function normalizeParty(party, partyType) {
  const needsItem = partyType === 'ItemDefaultMoves' || partyType === 'ItemCustomMoves';
  const needsMoves = partyType === 'NoItemCustomMoves' || partyType === 'ItemCustomMoves';

  return party.map(mon => {
    const norm = { iv: mon.iv, lvl: mon.lvl, species: mon.species };
    if (needsItem) {
      norm.heldItem = mon.heldItem || 'ITEM_NONE';
    }
    if (needsMoves) {
      const moves = mon.moves ? [...mon.moves] : [];
      while (moves.length < 4) moves.push('MOVE_NONE');
      norm.moves = moves.slice(0, 4);
    }
    return norm;
  });
}

// ---------------------------------------------------------------------------
// Code generation — trainer_parties.h
// ---------------------------------------------------------------------------

function genPartyEntry(partyName, partyType, normalizedParty) {
  const structName = TYPE_TO_STRUCT[partyType];
  const lines = [`static const struct ${structName} ${partyName}[] = {`];

  normalizedParty.forEach((mon, i) => {
    const isLast = i === normalizedParty.length - 1;
    lines.push('    {');
    lines.push(`    .iv = ${mon.iv},`);
    lines.push(`    .lvl = ${mon.lvl},`);

    if (mon.heldItem && mon.moves) {
      lines.push(`    .species = ${mon.species},`);
      lines.push(`    .heldItem = ${mon.heldItem},`);
      lines.push(`    .moves = {${mon.moves.join(', ')}}`);
    } else if (mon.heldItem) {
      lines.push(`    .species = ${mon.species},`);
      lines.push(`    .heldItem = ${mon.heldItem}`);
    } else if (mon.moves) {
      lines.push(`    .species = ${mon.species},`);
      lines.push(`    .moves = {${mon.moves.join(', ')}}`);
    } else {
      lines.push(`    .species = ${mon.species},`);
    }

    lines.push(isLast ? '    }' : '    },');
  });

  lines.push('};');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Code generation — trainers.h
// ---------------------------------------------------------------------------

function genTrainerEntry(cfg, partyType, partyName) {
  const macro = TYPE_TO_MACRO[partyType];
  const aiStr = cfg.aiFlags.join(' | ');
  const itemsStr = cfg.items && cfg.items.length > 0
    ? `{${cfg.items.join(', ')}}`
    : '{}';
  const dblStr = cfg.doubleBattle ? 'TRUE' : 'FALSE';

  return [
    '',
    `    [${cfg.trainerId}] =`,
    '    {',
    `        .trainerClass = ${cfg.trainerClass},`,
    `        .encounterMusic_gender = ${cfg.encounterMusic},`,
    `        .trainerPic = ${cfg.trainerPic},`,
    `        .trainerName = _("${cfg.trainerName}"),`,
    `        .items = ${itemsStr},`,
    `        .doubleBattle = ${dblStr},`,
    `        .aiFlags = ${aiStr},`,
    `        .party = ${macro}(${partyName}),`,
    '    },',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Code generation — opponents.h
// ---------------------------------------------------------------------------

function genOpponentDefine(trainerId, numericId) {
  const padLen = Math.max(1, 40 - trainerId.length);
  return `#define ${trainerId}${' '.repeat(padLen)}${numericId}`;
}

// ---------------------------------------------------------------------------
// Pure transforms — CREATE mode (text in -> text out)
// ---------------------------------------------------------------------------

function transformOpponentsCreate(content, cfg) {
  const countRe = /^#define TRAINERS_COUNT\s+\d+.*/m;
  const countNumRe = /^#define TRAINERS_COUNT\s+(\d+)/m;
  const m = content.match(countNumRe);
  if (!m) throw new Error(`${OPPONENTS_REL}: cannot find TRAINERS_COUNT`);
  const oldCount = parseInt(m[1]);
  const newId = oldCount;
  const newCount = oldCount + 1;

  const define = genOpponentDefine(cfg.trainerId, newId);
  content = insertBefore(content, m[0], define + '\n');
  if (!content) throw new Error(`${OPPONENTS_REL}: insertBefore TRAINERS_COUNT failed`);

  const maxRe = /^#define MAX_TRAINERS_COUNT\s+\d+.*/m;
  content = content.replace(countRe, `#define TRAINERS_COUNT                      ${newCount}  // Count of trainer IDs (0-${newCount - 1})`);
  content = content.replace(maxRe, `#define MAX_TRAINERS_COUNT                  ${newCount}  // Trainer flag space (0x500-0x${(0x500 + newCount - 1).toString(16)} = ${newCount} slots)`);
  return content;
}

function transformPartiesCreate(content, partyName, partyType, normalizedParty) {
  const entry = genPartyEntry(partyName, partyType, normalizedParty);
  return content.trimEnd() + '\n\n' + entry + '\n';
}

function transformTrainersCreate(content, cfg, partyType, partyName) {
  const entry = genTrainerEntry(cfg, partyType, partyName);
  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${TRAINERS_REL}: cannot find closing };`);
  return content.slice(0, lastClose) + entry + '\n' + content.slice(lastClose);
}

// ---------------------------------------------------------------------------
// Pure transforms — MODIFY mode
// ---------------------------------------------------------------------------

// partyName[] array -> { start, end } (end is just past its closing `};`)
function findPartyArray(content, partyName) {
  const startMarker = new RegExp(`static const struct \\w+ ${escapeRe(partyName)}\\[\\] = \\{`);
  const startMatch = content.match(startMarker);
  if (!startMatch) throw new Error(`${PARTIES_REL}: cannot find ${partyName}[]`);
  const start = startMatch.index;
  const endIdx = content.indexOf('};', start);
  if (endIdx === -1) throw new Error(`${PARTIES_REL}: cannot find closing }; for ${partyName}`);
  return { start, end: endIdx + 2 };
}

function transformPartiesModify(content, partyName, partyType, normalizedParty) {
  const entry = genPartyEntry(partyName, partyType, normalizedParty);
  const { start, end } = findPartyArray(content, partyName);
  return content.slice(0, start) + entry + content.slice(end);
}

function transformTrainersModify(content, cfg, partyType, partyName) {
  const macro = TYPE_TO_MACRO[partyType];
  const trainerBlockRe = new RegExp(`\\[${escapeRe(cfg.trainerId)}\\]`);
  const blockMatch = content.match(trainerBlockRe);
  if (!blockMatch) throw new Error(`${TRAINERS_REL}: cannot find [${cfg.trainerId}]`);

  const blockStart = blockMatch.index;
  const partyLineRe = /\.party\s*=\s*\w+\([^)]+\),/;
  const partyMatch = content.slice(blockStart).match(partyLineRe);
  if (!partyMatch) throw new Error(`${TRAINERS_REL}: cannot find .party line for ${cfg.trainerId}`);

  const absIdx = blockStart + partyMatch.index;
  const replacement = `.party = ${macro}(${partyName}),`;
  return content.slice(0, absIdx) + replacement + content.slice(absIdx + partyMatch[0].length);
}

// ---------------------------------------------------------------------------
// Pure transforms — RECLAIM mode
// ---------------------------------------------------------------------------

const COUNT_LINES_RE = /^#define (?:MAX_)?TRAINERS_COUNT\b.*$/gm;

// Refusal reasons for a reclaim (empty = OK). refs: [{ file, n }] references
// to fromId outside opponents.h/trainers.h/trainer_parties.h.
function reclaimRefusals(cfg, opponentsText, partiesText, refs) {
  const errors = [];
  const defined = (id) => new RegExp(`^#define\\s+${escapeRe(id)}\\s+\\d+`, 'm').test(opponentsText);
  if (!cfg.fromId || !defined(cfg.fromId)) errors.push(`${cfg.fromId} is not defined in ${OPPONENTS_REL}`);
  else if (slots.DATA_ONLY.test(cfg.fromId)) errors.push(`${cfg.fromId} is a placeholder slot: edit data only, use modify mode`);
  if (!cfg.trainerId) errors.push('config has no trainerId');
  else if (new RegExp(`\\b${escapeRe(cfg.trainerId)}\\b`).test(opponentsText)) errors.push(`${cfg.trainerId} already exists in ${OPPONENTS_REL}`);
  if (refs.length) {
    errors.push(`${cfg.fromId} is still referenced outside the trainer tables: ${refs.map((r) => `${r.file} (${r.n})`).join(', ')}`);
  }
  if (cfg.partyName && new RegExp(`\\b${escapeRe(cfg.partyName)}\\[\\]`).test(partiesText)) {
    errors.push(`party ${cfg.partyName}[] already exists in ${PARTIES_REL}`);
  }
  return errors;
}

// opponents.h: rename fromId's define in place, same number and column.
function transformOpponentsReclaim(content, cfg) {
  const lineRe = new RegExp(`^#define (${escapeRe(cfg.fromId)})(\\s+)(\\d+)[^\\n]*$`, 'm');
  const m = content.match(lineRe);
  if (!m) throw new Error(`${OPPONENTS_REL}: cannot find #define ${cfg.fromId}`);
  const column = '#define '.length + m[1].length + m[2].length;
  const head = `#define ${cfg.trainerId}`;
  const tag = cfg.cycle ? `C${cfg.cycle}` : 'reclaim';
  const newLine = `${head}${' '.repeat(Math.max(1, column - head.length))}${m[3]}  // ${tag}: reclaimed ex-${cfg.fromId.replace(/^TRAINER_/, '')}`;
  const out = content.slice(0, m.index) + newLine + content.slice(m.index + m[0].length);
  if ((content.match(COUNT_LINES_RE) || []).join('\n') !== (out.match(COUNT_LINES_RE) || []).join('\n')) {
    throw new Error(`${OPPONENTS_REL}: TRAINERS_COUNT/MAX_TRAINERS_COUNT changed (must not)`);
  }
  return { content: out, oldBlock: m[0], newBlock: newLine };
}

// trainers.h: replace the whole [fromId] block; returns the old party name.
function transformTrainersReclaim(content, cfg, partyType, partyName) {
  const blockRe = new RegExp(`^[ \\t]*\\[${escapeRe(cfg.fromId)}\\][^\\n]*\\n[ \\t]*\\{[\\s\\S]*?\\n[ \\t]*\\},`, 'm');
  const m = content.match(blockRe);
  if (!m) throw new Error(`${TRAINERS_REL}: cannot find the [${cfg.fromId}] block`);
  const party = m[0].match(/\.party\s*=\s*\w+\(\s*(\w+)\s*\)/);
  if (!party) throw new Error(`${TRAINERS_REL}: cannot find .party in [${cfg.fromId}]`);
  const oldPartyName = party[1];
  const uses = content.match(new RegExp(`\\b${escapeRe(oldPartyName)}\\b`, 'g')).length;
  if (uses !== 1) throw new Error(`${TRAINERS_REL}: ${oldPartyName} is used by ${uses - 1} other trainer(s); reclaim would orphan them`);
  const newBlock = genTrainerEntry(cfg, partyType, partyName).replace(/^\n/, '');
  return {
    content: content.slice(0, m.index) + newBlock + content.slice(m.index + m[0].length),
    oldBlock: m[0],
    newBlock,
    oldPartyName,
  };
}

// trainer_parties.h: replace the old party array with the new one.
function transformPartiesReclaim(content, oldPartyName, partyName, partyType, normalizedParty) {
  const { start, end } = findPartyArray(content, oldPartyName);
  const newBlock = genPartyEntry(partyName, partyType, normalizedParty);
  return { content: content.slice(0, start) + newBlock + content.slice(end), oldBlock: content.slice(start, end), newBlock };
}

// check_trainer_slots.cjs: append trainerId to RECLAIMED.
function transformSlotsReclaim(content, trainerId) {
  const m = content.match(/^const RECLAIMED = \[([^\]]*)\];/m);
  if (!m) throw new Error(`${SLOTS_REL}: cannot find const RECLAIMED = [...]`);
  const newBlock = `const RECLAIMED = [${m[1]}${m[1].trim() ? ', ' : ''}'${trainerId}'];`;
  return { content: content.slice(0, m.index) + newBlock + content.slice(m.index + m[0].length), oldBlock: m[0], newBlock };
}

// All four reclaim edits. texts: { opponents, trainers, parties, slots }, refs as in
// reclaimRefusals. -> { errors } or { results: [{ relPath, content, oldBlock, newBlock }] }
function planReclaim(cfg, texts, refs) {
  const errors = reclaimRefusals(cfg, texts.opponents, texts.parties, refs);
  if (errors.length) return { errors };
  const partyType = detectPartyType(cfg.party);
  const normalizedParty = normalizeParty(cfg.party, partyType);
  try {
    const opp = transformOpponentsReclaim(texts.opponents, cfg);
    const tr = transformTrainersReclaim(texts.trainers, cfg, partyType, cfg.partyName);
    const pa = transformPartiesReclaim(texts.parties, tr.oldPartyName, cfg.partyName, partyType, normalizedParty);
    const sl = transformSlotsReclaim(texts.slots, cfg.trainerId);
    return {
      errors: [],
      results: [
        { relPath: OPPONENTS_REL, ...opp },
        { relPath: TRAINERS_REL, ...tr },
        { relPath: PARTIES_REL, ...pa },
        { relPath: SLOTS_REL, ...sl },
      ],
    };
  } catch (err) {
    return { errors: [err.message] };
  }
}

// References to fromId in the check_trainer_slots scan set (opponents.h,
// trainers.h and trainer_parties.h excluded) -> [{ file, n }]
function scanRefs(fromId) {
  const refs = [];
  for (const dir of slots.SCAN_DIRS) {
    for (const file of slots.walk(dir, [])) {
      const counts = new Map([[fromId, 0]]);
      slots.countRefs(fs.readFileSync(file, 'utf8'), counts);
      if (counts.get(fromId)) refs.push({ file: path.relative(ROOT, file), n: counts.get(fromId) });
    }
  }
  return refs;
}

// ---------------------------------------------------------------------------
// Selftest
// ---------------------------------------------------------------------------

function selftest() {
  const fail = (msg) => {
    console.error(`generate_trainer: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const opponents = [
    '#define TRAINER_NONE                        0',
    '#define TRAINER_OLD_HIKER                   1',
    '#define TRAINER_USED                        2',
    '#define TRAINER_FAKE_PLACEHOLDER            3',
    '',
    '#define TRAINERS_COUNT                      4  // Count of trainer IDs (0-3)',
    '#define MAX_TRAINERS_COUNT                  4  // Trainer flag space',
    '',
  ].join('\n');
  const block = (id, name, macro, party) => [
    `    [${id}] =`,
    '    {',
    '        .trainerClass = TRAINER_CLASS_HIKER,',
    '        .encounterMusic_gender = TRAINER_ENCOUNTER_MUSIC_HIKER,',
    '        .trainerPic = TRAINER_PIC_HIKER,',
    `        .trainerName = _("${name}"),`,
    '        .items = {},',
    '        .doubleBattle = FALSE,',
    '        .aiFlags = AI_SCRIPT_CHECK_BAD_MOVE,',
    `        .party = ${macro}(${party}),`,
    '    },',
  ].join('\n');
  const trainers = [
    'const struct Trainer gTrainers[] = {',
    block('TRAINER_USED', 'USED', 'NO_ITEM_DEFAULT_MOVES', 'sParty_Used'),
    '',
    block('TRAINER_OLD_HIKER', 'OLDIE', 'NO_ITEM_CUSTOM_MOVES', 'sParty_OldHiker'),
    '',
    block('TRAINER_FAKE_PLACEHOLDER', 'UNUSED', 'NO_ITEM_DEFAULT_MOVES', 'sParty_FakePlaceholder'),
    '};',
    '',
  ].join('\n');
  const partyArr = (struct, name, species, extra) => [
    `static const struct ${struct} ${name}[] = {`,
    '    {',
    '    .iv = 0,',
    '    .lvl = 9,',
    `    .species = ${species},`,
    ...(extra ? [extra] : []),
    '    }',
    '};',
  ].join('\n');
  const parties = [
    partyArr('TrainerMonNoItemDefaultMoves', 'sParty_Used', 'SPECIES_ZUBAT'),
    '',
    partyArr('TrainerMonNoItemCustomMoves', 'sParty_OldHiker', 'SPECIES_WAILMER', '    .moves = {MOVE_SPLASH, MOVE_NONE, MOVE_NONE, MOVE_NONE}'),
    '',
    partyArr('TrainerMonNoItemDefaultMoves', 'sParty_FakePlaceholder', 'SPECIES_ZUBAT'),
    '',
  ].join('\n');
  const slotsText = "const RECLAIMED = ['TRAINER_A', 'TRAINER_B'];  // C368: note\n";
  const texts = { opponents, trainers, parties, slots: slotsText };
  const cfg = {
    mode: 'reclaim',
    cycle: 999,
    fromId: 'TRAINER_OLD_HIKER',
    trainerId: 'TRAINER_NEW_ROCKY',
    trainerClass: 'TRAINER_CLASS_HIKER',
    encounterMusic: 'TRAINER_ENCOUNTER_MUSIC_HIKER',
    trainerPic: 'TRAINER_PIC_HIKER',
    trainerName: 'ROCKY',
    items: [],
    doubleBattle: false,
    aiFlags: ['AI_SCRIPT_CHECK_BAD_MOVE'],
    partyName: 'sParty_NewRocky',
    party: [{ species: 'SPECIES_GEODUDE', lvl: 20, iv: 0 }],
  };
  const countLines = (t) => (t.match(COUNT_LINES_RE) || []).join('\n');

  const plan = planReclaim(cfg, texts, []);
  if (plan.errors.length) fail(`valid reclaim refused: ${plan.errors.join('; ')}`);
  const out = Object.fromEntries(plan.results.map((r) => [r.relPath, r.content]));
  const opp = out[OPPONENTS_REL];
  if (!/^#define TRAINER_NEW_ROCKY {19}1 {2}\/\/ C999: reclaimed ex-OLD_HIKER$/m.test(opp)) fail(`define not renamed in place:\n${opp}`);
  if (opp.replace(/\/\/.*$/gm, '').includes('TRAINER_OLD_HIKER')) fail('old define still present');
  if (countLines(opp) !== countLines(opponents)) fail('TRAINERS_COUNT/MAX_TRAINERS_COUNT lines changed');
  if (opp.split('\n').length !== opponents.split('\n').length) fail('opponents.h line count changed');
  const tr = out[TRAINERS_REL];
  const expectTr = trainers.replace(block('TRAINER_OLD_HIKER', 'OLDIE', 'NO_ITEM_CUSTOM_MOVES', 'sParty_OldHiker'),
    genTrainerEntry(cfg, 'NoItemDefaultMoves', 'sParty_NewRocky').replace(/^\n/, ''));
  if (tr !== expectTr) fail(`trainers.h changed outside the target block:\n${tr}`);
  if (!tr.includes(block('TRAINER_USED', 'USED', 'NO_ITEM_DEFAULT_MOVES', 'sParty_Used'))) fail('neighbour block changed');
  const pa = out[PARTIES_REL];
  if (/sParty_OldHiker/.test(pa)) fail('old party array still present');
  if (!pa.includes('sParty_NewRocky[] = {') || !pa.includes('.species = SPECIES_GEODUDE,')) fail('new party array missing');
  if (!pa.includes(partyArr('TrainerMonNoItemDefaultMoves', 'sParty_Used', 'SPECIES_ZUBAT'))) fail('neighbour party array changed');
  if (out[SLOTS_REL] !== "const RECLAIMED = ['TRAINER_A', 'TRAINER_B', 'TRAINER_NEW_ROCKY'];  // C368: note\n") fail(`RECLAIMED not appended: ${out[SLOTS_REL]}`);

  const refused = (label, c, refs, needle) => {
    const p = planReclaim(c, texts, refs);
    if (p.results || !p.errors.some((e) => e.includes(needle))) fail(`${label}: expected refusal '${needle}', got ${JSON.stringify(p.errors)}`);
  };
  refused('referenced slot', cfg, [{ file: 'data/maps/X/scripts.inc', n: 1 }], 'still referenced');
  refused('placeholder slot', { ...cfg, fromId: 'TRAINER_FAKE_PLACEHOLDER' }, [], 'placeholder slot: edit data only, use modify mode');
  refused('existing trainerId', { ...cfg, trainerId: 'TRAINER_USED' }, [], 'already exists');
  refused('undefined fromId', { ...cfg, fromId: 'TRAINER_GHOST' }, [], 'not defined');

  // modify mode: only the target .party line and party array change
  const modCfg = { trainerId: 'TRAINER_USED' };
  const modParty = normalizeParty([{ species: 'SPECIES_GOLBAT', lvl: 30, iv: 100, heldItem: 'ITEM_ORAN_BERRY' }], 'ItemDefaultMoves');
  const modTr = transformTrainersModify(trainers, modCfg, 'ItemDefaultMoves', 'sParty_Used');
  if (modTr !== trainers.replace('.party = NO_ITEM_DEFAULT_MOVES(sParty_Used),', '.party = ITEM_DEFAULT_MOVES(sParty_Used),')) fail('modify changed more than the .party line');
  const modPa = transformPartiesModify(parties, 'sParty_Used', 'ItemDefaultMoves', modParty);
  if (modPa !== parties.replace(partyArr('TrainerMonNoItemDefaultMoves', 'sParty_Used', 'SPECIES_ZUBAT'), genPartyEntry('sParty_Used', 'ItemDefaultMoves', modParty))) {
    fail('modify changed more than the party array');
  }
  console.log('generate_trainer: selftest ok');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const configPath = args.find(a => !a.startsWith('--'));

  if (!configPath) {
    console.error('Usage: node scripts/generate_trainer.cjs <config.json> [--dry-run] | --selftest');
    console.error('       config "mode": create | modify | reclaim');
    process.exit(1);
  }

  const fullConfigPath = path.isAbsolute(configPath)
    ? configPath
    : path.join(process.cwd(), configPath);
  const cfg = JSON.parse(fs.readFileSync(fullConfigPath, 'utf8'));

  const mode = cfg.mode || 'create';
  const partyName = cfg.partyName;
  const partyType = detectPartyType(cfg.party);
  const normalizedParty = normalizeParty(cfg.party, partyType);

  console.log(`Mode:       ${mode}`);
  if (mode === 'reclaim') console.log(`From:       ${cfg.fromId}`);
  console.log(`Trainer:    ${cfg.trainerId}`);
  console.log(`Party:      ${partyName} (${cfg.party.length} mon)`);
  console.log(`Struct:     ${TYPE_TO_STRUCT[partyType]}`);
  console.log(`Macro:      ${TYPE_TO_MACRO[partyType]}`);
  console.log('');

  const results = [];
  let failed = 0;
  const apply = (relPath, transform) => {
    try {
      results.push({ relPath, content: transform(readFile(relPath)) });
    } catch (err) {
      console.error(`Error: ${err.message}`);
      failed++;
    }
  };

  if (mode === 'create') {
    const opponentsH = readFile(OPPONENTS_REL);
    if (opponentsH.includes(`#define ${cfg.trainerId} `)) {
      console.log(`Warning: ${cfg.trainerId} already exists in opponents.h — nothing to do.`);
      process.exit(0);
    }
    apply(OPPONENTS_REL, (t) => transformOpponentsCreate(t, cfg));
    apply(PARTIES_REL, (t) => transformPartiesCreate(t, partyName, partyType, normalizedParty));
    apply(TRAINERS_REL, (t) => transformTrainersCreate(t, cfg, partyType, partyName));
  } else if (mode === 'modify') {
    apply(PARTIES_REL, (t) => transformPartiesModify(t, partyName, partyType, normalizedParty));
    apply(TRAINERS_REL, (t) => transformTrainersModify(t, cfg, partyType, partyName));
  } else if (mode === 'reclaim') {
    const texts = {
      opponents: readFile(OPPONENTS_REL),
      trainers: readFile(TRAINERS_REL),
      parties: readFile(PARTIES_REL),
      slots: readFile(SLOTS_REL),
    };
    const plan = planReclaim(cfg, texts, cfg.fromId ? scanRefs(cfg.fromId) : []);
    if (plan.errors.length) {
      console.error(`Refusing to reclaim ${cfg.fromId} -> ${cfg.trainerId} (nothing written):`);
      for (const e of plan.errors) console.error(`  ${e}`);
      process.exit(1);
    }
    if (dryRun) {
      for (const r of plan.results) {
        console.log(`--- ${r.relPath} (old) ---`);
        console.log(r.oldBlock);
        console.log(`+++ ${r.relPath} (new) +++`);
        console.log(r.newBlock);
        console.log('');
      }
      console.log(`Reminder: a map script must trainerbattle ${cfg.trainerId} or check_trainer_slots G2 fails.`);
      console.log('Dry run complete — no files modified.');
      return;
    }
    results.push(...plan.results);
  } else {
    console.error(`Unknown mode: ${mode}. Use "create", "modify" or "reclaim".`);
    process.exit(1);
  }

  if (failed > 0) {
    console.error(`\n${failed} file(s) failed — aborting without writing.`);
    process.exit(1);
  }

  if (dryRun) {
    for (const r of results) {
      console.log(`--- ${r.relPath} ---`);
      console.log(r.content);
      console.log('');
    }
    console.log('Dry run complete — no files modified.');
  } else {
    for (const r of results) {
      fs.writeFileSync(path.join(ROOT, r.relPath), r.content, 'utf8');
      console.log(`  OK ${r.relPath}`);
    }
    if (mode === 'reclaim') {
      console.log(`\nReminder: a map script must trainerbattle ${cfg.trainerId} or check_trainer_slots G2 fails.`);
    }
    console.log('\nDone. Run `bash scripts/check_trainers.sh` then `make` to validate.');
  }
}

module.exports = {
  detectPartyType, normalizeParty, genPartyEntry, genTrainerEntry,
  transformOpponentsCreate, transformPartiesCreate, transformTrainersCreate,
  transformPartiesModify, transformTrainersModify,
  reclaimRefusals, transformOpponentsReclaim, transformTrainersReclaim, transformPartiesReclaim, transformSlotsReclaim, planReclaim,
};

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
