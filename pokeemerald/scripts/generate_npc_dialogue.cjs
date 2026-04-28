#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

// ---------------------------------------------------------------------------
// Charmap validation
// ---------------------------------------------------------------------------

const VALID_ESCAPES = new Set(['n', 'l', 'p']);

function validateDialogue(text, label) {
  const errors = [];

  if (!text.endsWith('$')) {
    errors.push(`${label}: dialogue must end with $ terminator`);
  }

  // Reject invalid escape sequences (\X where X is not n, l, p)
  const escapeRe = /\\(.)/g;
  let match;
  while ((match = escapeRe.exec(text)) !== null) {
    if (!VALID_ESCAPES.has(match[1])) {
      errors.push(`${label}: invalid escape \\${match[1]} at position ${match.index} (only \\n, \\l, \\p allowed)`);
    }
  }

  // Reject em-dash and en-dash
  if (text.includes('—')) {
    errors.push(`${label}: em-dash (—) not in charmap — use --`);
  }
  if (text.includes('–')) {
    errors.push(`${label}: en-dash (–) not in charmap — use -`);
  }

  // Reject smart/curly quotes
  if (/[“”]/.test(text)) {
    errors.push(`${label}: curly double quotes found — not in charmap`);
  }
  if (/[‘’]/.test(text)) {
    errors.push(`${label}: curly single quotes found — not in charmap`);
  }

  // Reject ASCII double-quote inside content (0x22 is not in charmap)
  if (text.includes('"')) {
    errors.push(`${label}: ASCII double-quote (") inside dialogue — not in charmap`);
  }

  // Warn on long lines (soft limit)
  const content = text.replace(/\$$/,'');
  const lines = content.split(/\\[nlp]/);
  lines.forEach((line, i) => {
    if (line.length > 35) {
      console.log(`  Warning: ${label} line ${i + 1} is ${line.length} chars (soft limit 35): "${line.slice(0, 40)}..."`);
    }
  });

  return errors;
}

// ---------------------------------------------------------------------------
// Script generation
// ---------------------------------------------------------------------------

function genScript(mapName, npc) {
  const scriptLabel = `${mapName}_EventScript_${npc.label}`;
  const textLabel = `${mapName}_Text_${npc.label}`;
  const lines = [];

  lines.push(`${scriptLabel}::`);

  if (npc.scriptType === 'MSGBOX_DEFAULT') {
    lines.push(`\tlock`);
    lines.push(`\tfaceplayer`);
    lines.push(`\tmsgbox ${textLabel}, MSGBOX_DEFAULT`);
    lines.push(`\trelease`);
  } else {
    lines.push(`\tmsgbox ${textLabel}, MSGBOX_NPC`);
  }

  lines.push(`\tend`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// String generation
// ---------------------------------------------------------------------------

function genString(mapName, npc) {
  const textLabel = `${mapName}_Text_${npc.label}`;
  const dialogue = Array.isArray(npc.dialogue) ? npc.dialogue[0] : npc.dialogue;
  const lines = [];

  lines.push(`${textLabel}:`);
  lines.push(`\t.string "${dialogue}"`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Map JSON handler
// ---------------------------------------------------------------------------

function handleMapJson(mapName, npcsForThisMap) {
  const relPath = `data/maps/${mapName}/map.json`;
  let data;
  try {
    data = JSON.parse(readFile(relPath));
  } catch (err) {
    throw new Error(`${relPath}: ${err.message}`);
  }

  if (!data.object_events) {
    if (!data.events) data.events = {};
    if (!data.events.object_events) data.events.object_events = [];
  }

  const objEvents = data.object_events || (data.events && data.events.object_events);
  if (!objEvents) {
    throw new Error(`${relPath}: cannot find object_events array`);
  }

  for (const npc of npcsForThisMap) {
    const scriptRef = `${mapName}_EventScript_${npc.label}`;

    // Idempotency: skip if this script already referenced
    const exists = objEvents.some(e => e.script === scriptRef);
    if (exists) {
      console.log(`  Skip map.json: ${scriptRef} already exists in object_events`);
      continue;
    }

    const entry = {
      graphics_id: npc.graphicsId,
      x: npc.x,
      y: npc.y,
      elevation: npc.elevation !== undefined ? npc.elevation : 3,
      movement_type: npc.movementType || 'MOVEMENT_TYPE_FACE_DOWN',
      movement_range_x: npc.movementRangeX || 0,
      movement_range_y: npc.movementRangeY || 0,
      trainer_type: npc.trainerType || 'TRAINER_TYPE_NONE',
      trainer_sight_or_berry_tree_id: npc.trainerSightOrBerryTreeId || '0',
      script: scriptRef,
      flag: npc.flag || '0',
    };

    objEvents.push(entry);
  }

  return { relPath, content: JSON.stringify(data, null, 2) + '\n' };
}

// ---------------------------------------------------------------------------
// Scripts.inc handler
// ---------------------------------------------------------------------------

function handleScriptsInc(mapName, npcsForThisMap) {
  const relPath = `data/maps/${mapName}/scripts.inc`;
  let content;
  try {
    content = readFile(relPath);
  } catch (err) {
    throw new Error(`${relPath}: ${err.message}`);
  }

  const newBlocks = [];

  for (const npc of npcsForThisMap) {
    const scriptLabel = `${mapName}_EventScript_${npc.label}::`;

    // Idempotency: skip if label already present
    if (content.includes(scriptLabel)) {
      console.log(`  Skip scripts.inc: ${scriptLabel} already exists`);
      continue;
    }

    newBlocks.push(genScript(mapName, npc));
    newBlocks.push('');
    newBlocks.push(genString(mapName, npc));
  }

  if (newBlocks.length > 0) {
    content = content.trimEnd() + '\n\n' + newBlocks.join('\n') + '\n';
  }

  return { relPath, content };
}

// ---------------------------------------------------------------------------
// Update mode — in-place dialogue replacement
// ---------------------------------------------------------------------------

function updateDialogue(args) {
  let filePath = null;
  let label = null;
  let text = null;
  const dryRun = args.includes('--dry-run');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) filePath = args[++i];
    else if (args[i] === '--label' && args[i + 1]) label = args[++i];
    else if (args[i] === '--text' && args[i + 1]) text = args[++i];
  }

  if (!filePath || !label || !text) {
    console.error('Usage: node scripts/generate_npc_dialogue.cjs --update --file <path/to/scripts.inc> --label <SCRIPT_LABEL> --text "dialogue text$"');
    process.exit(1);
  }

  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  const errors = validateDialogue(text, label);
  if (errors.length > 0) {
    console.error('Validation errors:');
    errors.forEach(e => console.error(`  ${e}`));
    process.exit(1);
  }

  let content = fs.readFileSync(absPath, 'utf8');

  const textLabel = label.replace('EventScript_', 'Text_');
  const textRe = new RegExp(
    `(${textLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*\\n\\t\\.string )"[^"]*"`,
    'm'
  );

  const match = content.match(textRe);
  if (!match) {
    console.error(`Label ${textLabel} with .string directive not found in ${filePath}`);
    process.exit(1);
  }

  const oldLine = match[0];
  const newLine = `${match[1]}"${text}"`;

  if (oldLine === newLine) {
    console.log(`No change needed — dialogue already matches.`);
    process.exit(0);
  }

  content = content.replace(oldLine, newLine);

  if (dryRun) {
    console.log(`[dry-run] Would replace in ${filePath}:`);
    console.log(`  Old: ${oldLine.split('\n').pop().trim()}`);
    console.log(`  New: ${newLine.split('\n').pop().trim()}`);
  } else {
    fs.writeFileSync(absPath, content, 'utf8');
    console.log(`Updated ${textLabel} in ${filePath}`);
    console.log(`  Old: ${match[0].split('\n').pop().trim()}`);
    console.log(`  New: ${newLine.split('\n').pop().trim()}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--update')) {
    return updateDialogue(args);
  }

  const dryRun = args.includes('--dry-run');
  const validateOnly = args.includes('--validate');
  const configPath = args.find(a => !a.startsWith('--'));

  if (!configPath) {
    console.error('Usage: node scripts/generate_npc_dialogue.cjs <config.json> [--dry-run] [--validate]');
    console.error('       node scripts/generate_npc_dialogue.cjs --update --file <path> --label <LABEL> --text "dialogue$"');
    process.exit(1);
  }

  const fullConfigPath = path.isAbsolute(configPath)
    ? configPath
    : path.join(process.cwd(), configPath);
  let cfg = JSON.parse(fs.readFileSync(fullConfigPath, 'utf8'));

  // Single-NPC shorthand: wrap if top-level has map + label
  if (cfg.map && cfg.label && !cfg.npcs) {
    cfg = { npcs: [cfg] };
  }

  if (!cfg.npcs || !Array.isArray(cfg.npcs) || cfg.npcs.length === 0) {
    console.error('Config must have a non-empty "npcs" array (or be a single NPC object with "map" and "label").');
    process.exit(1);
  }

  console.log(`NPCs: ${cfg.npcs.length}`);
  console.log('');

  // Validate all dialogue
  const allErrors = [];
  for (const npc of cfg.npcs) {
    const label = `${npc.map}/${npc.label}`;
    const dialogue = Array.isArray(npc.dialogue) ? npc.dialogue[0] : npc.dialogue;

    if (!npc.map || !npc.label) {
      allErrors.push(`NPC missing required "map" or "label" field`);
      continue;
    }
    if (!npc.graphicsId) {
      allErrors.push(`${label}: missing required "graphicsId"`);
    }
    if (npc.x === undefined || npc.y === undefined) {
      allErrors.push(`${label}: missing required "x" or "y" coordinates`);
    }
    if (!npc.scriptType) {
      allErrors.push(`${label}: missing required "scriptType" (MSGBOX_NPC or MSGBOX_DEFAULT)`);
    }
    if (!dialogue) {
      allErrors.push(`${label}: missing required "dialogue"`);
      continue;
    }

    const errs = validateDialogue(dialogue, label);
    allErrors.push(...errs);
  }

  if (validateOnly) {
    if (allErrors.length > 0) {
      console.error('Validation errors:');
      allErrors.forEach(e => console.error(`  ${e}`));
      process.exit(1);
    }
    console.log('Validation passed.');
    process.exit(0);
  }

  if (allErrors.length > 0) {
    console.error('Validation errors — aborting:');
    allErrors.forEach(e => console.error(`  ${e}`));
    process.exit(1);
  }

  // Group NPCs by map
  const byMap = {};
  for (const npc of cfg.npcs) {
    if (!byMap[npc.map]) byMap[npc.map] = [];
    byMap[npc.map].push(npc);
  }

  // Compute all file changes
  const results = [];
  let failed = 0;

  for (const [mapName, npcs] of Object.entries(byMap)) {
    console.log(`Map: ${mapName} (${npcs.length} NPC${npcs.length > 1 ? 's' : ''})`);

    try {
      results.push(handleScriptsInc(mapName, npcs));
    } catch (err) {
      console.error(`  Error (scripts.inc): ${err.message}`);
      failed++;
    }

    try {
      results.push(handleMapJson(mapName, npcs));
    } catch (err) {
      console.error(`  Error (map.json): ${err.message}`);
      failed++;
    }
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
    console.log('\nDone. Run `bash scripts/check_dialogue.sh` then `make` to validate.');
  }
}

main();
