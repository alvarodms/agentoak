#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

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
// File handlers — CREATE mode
// ---------------------------------------------------------------------------

function handleOpponentsCreate(cfg) {
  const relPath = 'include/constants/opponents.h';
  let content = readFile(relPath);

  const countRe = /^#define TRAINERS_COUNT\s+\d+.*/m;
  const countNumRe = /^#define TRAINERS_COUNT\s+(\d+)/m;
  const m = content.match(countNumRe);
  if (!m) throw new Error(`${relPath}: cannot find TRAINERS_COUNT`);
  const oldCount = parseInt(m[1]);
  const newId = oldCount;
  const newCount = oldCount + 1;

  const define = genOpponentDefine(cfg.trainerId, newId);
  content = insertBefore(content, m[0], define + '\n');
  if (!content) throw new Error(`${relPath}: insertBefore TRAINERS_COUNT failed`);

  const maxRe = /^#define MAX_TRAINERS_COUNT\s+\d+.*/m;
  content = content.replace(countRe, `#define TRAINERS_COUNT                      ${newCount}  // Count of trainer IDs (0-${newCount - 1})`);
  content = content.replace(maxRe, `#define MAX_TRAINERS_COUNT                  ${newCount}  // Trainer flag space (0x500-0x${(0x500 + newCount - 1).toString(16)} = ${newCount} slots)`);

  return { relPath, content };
}

function handlePartiesCreate(partyName, partyType, normalizedParty) {
  const relPath = 'src/data/trainer_parties.h';
  let content = readFile(relPath);
  const entry = genPartyEntry(partyName, partyType, normalizedParty);
  content = content.trimEnd() + '\n\n' + entry + '\n';
  return { relPath, content };
}

function handleTrainersCreate(cfg, partyType, partyName) {
  const relPath = 'src/data/trainers.h';
  let content = readFile(relPath);
  const entry = genTrainerEntry(cfg, partyType, partyName);

  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${relPath}: cannot find closing };`);
  content = content.slice(0, lastClose) + entry + '\n' + content.slice(lastClose);
  return { relPath, content };
}

// ---------------------------------------------------------------------------
// File handlers — MODIFY mode
// ---------------------------------------------------------------------------

function handlePartiesModify(partyName, partyType, normalizedParty) {
  const relPath = 'src/data/trainer_parties.h';
  let content = readFile(relPath);
  const entry = genPartyEntry(partyName, partyType, normalizedParty);

  const startMarker = new RegExp(
    `static const struct \\w+ ${partyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\] = \\{`
  );
  const startMatch = content.match(startMarker);
  if (!startMatch) throw new Error(`${relPath}: cannot find ${partyName}[]`);

  const blockStart = startMatch.index;
  const endMarker = '};';
  const endIdx = content.indexOf(endMarker, blockStart);
  if (endIdx === -1) throw new Error(`${relPath}: cannot find closing }; for ${partyName}`);

  content = content.slice(0, blockStart) + entry + content.slice(endIdx + endMarker.length);
  return { relPath, content };
}

function handleTrainersModify(cfg, partyType, partyName) {
  const relPath = 'src/data/trainers.h';
  let content = readFile(relPath);
  const macro = TYPE_TO_MACRO[partyType];

  const trainerBlockRe = new RegExp(
    `\\[${cfg.trainerId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`
  );
  const blockMatch = content.match(trainerBlockRe);
  if (!blockMatch) throw new Error(`${relPath}: cannot find [${cfg.trainerId}]`);

  const blockStart = blockMatch.index;
  const partyLineRe = /\.party\s*=\s*\w+\([^)]+\),/;
  const regionAfterBlock = content.slice(blockStart);
  const partyMatch = regionAfterBlock.match(partyLineRe);
  if (!partyMatch) throw new Error(`${relPath}: cannot find .party line for ${cfg.trainerId}`);

  const absIdx = blockStart + partyMatch.index;
  const replacement = `.party = ${macro}(${partyName}),`;
  content = content.slice(0, absIdx) + replacement + content.slice(absIdx + partyMatch[0].length);
  return { relPath, content };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const configPath = args.find(a => !a.startsWith('--'));

  if (!configPath) {
    console.error('Usage: node scripts/generate_trainer.cjs <config.json> [--dry-run]');
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
  console.log(`Trainer:    ${cfg.trainerId}`);
  console.log(`Party:      ${partyName} (${cfg.party.length} mon)`);
  console.log(`Struct:     ${TYPE_TO_STRUCT[partyType]}`);
  console.log(`Macro:      ${TYPE_TO_MACRO[partyType]}`);
  console.log('');

  const results = [];
  let failed = 0;

  if (mode === 'create') {
    const opponentsH = readFile('include/constants/opponents.h');
    if (opponentsH.includes(`#define ${cfg.trainerId} `)) {
      console.log(`Warning: ${cfg.trainerId} already exists in opponents.h — nothing to do.`);
      process.exit(0);
    }

    const handlers = [
      () => handleOpponentsCreate(cfg),
      () => handlePartiesCreate(partyName, partyType, normalizedParty),
      () => handleTrainersCreate(cfg, partyType, partyName),
    ];

    for (const handler of handlers) {
      try {
        results.push(handler());
      } catch (err) {
        console.error(`Error: ${err.message}`);
        failed++;
      }
    }
  } else if (mode === 'modify') {
    const handlers = [
      () => handlePartiesModify(partyName, partyType, normalizedParty),
      () => handleTrainersModify(cfg, partyType, partyName),
    ];

    for (const handler of handlers) {
      try {
        results.push(handler());
      } catch (err) {
        console.error(`Error: ${err.message}`);
        failed++;
      }
    }
  } else {
    console.error(`Unknown mode: ${mode}. Use "create" or "modify".`);
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
    console.log('\nDone. Run `bash scripts/check_trainers.sh` then `make` to validate.');
  }
}

main();
