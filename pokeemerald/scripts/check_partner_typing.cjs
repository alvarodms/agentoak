#!/usr/bin/env node
'use strict';

// C393: partner-typing analyzer (report-only, never fails the build).
//
// For every in-game partner battle (a map script that runs a SPECIAL_BATTLE_*
// listed in PARTNER_BATTLES with TRAINER_BATTLE_SET_TRAINER_A/B foes), reads
// the foe parties (src/data/trainers.h + trainer_parties.h), the partner party
// (src/battle_tower.c), moves (src/data/battle_moves.h: power, type, .category,
// this hack has the P/S split), species types and abilities
// (src/data/pokemon/species_info.h) and the type chart (gTypeEffectiveness,
// src/battle_main.c), then reports:
//   (a) PRESSURE: a foe damaging move every partner Pokémon is immune to or
//       resists (x0.5 or less), so the AI can only aim it at the player's side.
//       C395: moves whose .target is MOVE_TARGET_BOTH / MOVE_TARGET_FOES_AND_ALLY
//       hit both opposing battlers at once, so they cannot be aimed away from the
//       partner; they are listed as INFO, never PRESSURE;
//   (b) SCREEN: a partner REFLECT (physical) / LIGHT_SCREEN (special) whose side
//       is not the majority category of the foes' damaging moves.
// Why: v3.10 (C392) Steven's all-Steel team made every WEEZING SLUDGE BOMB land
// on the player, and METANG's REFLECT does nothing against special moves.
//
// Usage:
//   node scripts/check_partner_typing.cjs              report, exit 0 always
//   node scripts/check_partner_typing.cjs --selftest   planted cases must be flagged (exit 1 if not)
//   node scripts/check_partner_typing.cjs --party <trainer_config.json>
//       C395: analyse a candidate party without editing the ROM: the config's
//       trainerId/party replaces that trainer's parsed trainer_parties.h party.
// Make: `make report_partner_typing` (selftest + report; deliberately NOT in check_all).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// SPECIAL_BATTLE_* id -> the fixed partner party array in src/battle_tower.c and
// the partner trainer FillPartnerParty() must be called with in that case.
// Frontier multi battles (gPartnerTrainerId) pick a random partner and are skipped.
const PARTNER_BATTLES = {
  SPECIAL_BATTLE_STEVEN: { array: 'sStevenMons', partnerTrainer: 'TRAINER_STEVEN_PARTNER' },
};

const SCREENS = { MOVE_REFLECT: 'PHYSICAL', MOVE_LIGHT_SCREEN: 'SPECIAL' };
// Spread targets that hit both opposing battlers (battle_moves.h .target).
const SPREAD_TARGETS = new Set(['MOVE_TARGET_BOTH', 'MOVE_TARGET_FOES_AND_ALLY']);

// ---------- parsing ----------

function blockAfter(text, start) {
  const open = text.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return text.slice(open, i + 1);
  }
  throw new Error(`unbalanced block at ${start}`);
}

function parseTypeChart(src) {
  const body = blockAfter(src, src.indexOf('gTypeEffectiveness['));
  const chart = new Map();
  const re = /(TYPE_\w+),\s*(TYPE_\w+),\s*(TYPE_MUL_\w+)/g;
  const MUL = { TYPE_MUL_NO_EFFECT: 0, TYPE_MUL_NOT_EFFECTIVE: 0.5, TYPE_MUL_NORMAL: 1, TYPE_MUL_SUPER_EFFECTIVE: 2 };
  let m;
  while ((m = re.exec(body))) {
    if (m[1] === 'TYPE_ENDTABLE') break;
    if (m[1] === 'TYPE_FORESIGHT') continue; // marker: later rows are skipped only under Foresight
    chart.set(`${m[1]}>${m[2]}`, MUL[m[3]]);
  }
  if (chart.size < 100) throw new Error(`type chart: only ${chart.size} rows parsed`);
  return chart;
}

function parseMoves(src) {
  const moves = new Map();
  const re = /\[(MOVE_\w+)\]\s*=\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const f = (k) => (m[2].match(new RegExp(`\\.${k}\\s*=\\s*(\\w+)`)) || [])[1];
    moves.set(m[1], { power: Number(f('power') || 0), type: f('type'), category: (f('category') || '').replace('MOVE_CATEGORY_', ''), target: f('target') });
  }
  if (moves.size < 300) throw new Error(`battle_moves.h: only ${moves.size} moves parsed`);
  return moves;
}

function parseSpecies(src, wanted) {
  const out = new Map();
  for (const sp of wanted) {
    const at = src.indexOf(`[${sp}] =`);
    if (at < 0) throw new Error(`species_info.h: no [${sp}]`);
    const body = blockAfter(src, at);
    const types = (body.match(/\.types\s*=\s*\{\s*(TYPE_\w+)\s*,\s*(TYPE_\w+)\s*\}/) || []).slice(1);
    const abilities = ((body.match(/\.abilities\s*=\s*\{([^}]*)\}/) || [])[1] || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (types.length !== 2) throw new Error(`species_info.h: no .types for ${sp}`);
    out.set(sp, { types: [...new Set(types)], abilities });
  }
  return out;
}

function parseMonList(body) {
  return [...body.matchAll(/\.species\s*=\s*(SPECIES_\w+)[\s\S]*?\.moves\s*=\s*\{([^}]*)\}/g)].map((m) => ({
    species: m[1],
    moves: m[2].split(',').map((s) => s.trim()).filter((s) => s && s !== 'MOVE_NONE'),
  }));
}

function trainerParty(trainersH, partiesH, trainer) {
  const at = trainersH.indexOf(`[${trainer}] =`);
  if (at < 0) throw new Error(`trainers.h: no [${trainer}]`);
  const party = (blockAfter(trainersH, at).match(/\.party\s*=\s*(\w+)\((sParty_\w+)\)/) || []);
  if (!party[2]) throw new Error(`trainers.h: no .party for ${trainer}`);
  if (!/CUSTOM_MOVES/.test(party[1])) return { array: party[2], mons: null }; // default moves: not analysed
  const p = partiesH.indexOf(` ${party[2]}[]`);
  if (p < 0) throw new Error(`trainer_parties.h: no ${party[2]}`);
  return { array: party[2], mons: parseMonList(blockAfter(partiesH, p)) };
}

// C395 --party: a trainer_configs/*.json party in the same shape trainerParty() returns.
function loadScratchParty(file) {
  const cfg = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  if (!cfg.trainerId || !Array.isArray(cfg.party)) throw new Error(`${file}: needs trainerId and party`);
  return {
    file,
    trainerId: cfg.trainerId,
    array: cfg.partyName || '(scratch)',
    mons: cfg.party.map((m) => ({ species: m.species, moves: (m.moves || []).filter((mv) => mv && mv !== 'MOVE_NONE') })),
  };
}

// Pure: swap the scratch party in for its trainer wherever that trainer is a foe.
// Returns how many foe slots were replaced (0 = the config's trainer fights no partner battle).
function applyScratch(battles, scratch) {
  let replaced = 0;
  for (const b of battles) {
    b.foes = b.foes.map((f) => {
      if (f.name !== scratch.trainerId) return f;
      replaced++;
      return { name: f.name, array: scratch.array, mons: scratch.mons, scratch: scratch.file };
    });
  }
  return replaced;
}

function findBattles() {
  const tower = read('src/battle_tower.c');
  const trainersH = read('src/data/trainers.h');
  const partiesH = read('src/data/trainer_parties.h');
  const mapsDir = path.join(ROOT, 'data/maps');
  const battles = [];
  for (const map of fs.readdirSync(mapsDir).sort()) {
    const file = path.join(mapsDir, map, 'scripts.inc');
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const [special, cfg] of Object.entries(PARTNER_BATTLES)) {
      if (!new RegExp(`setvar\\s+VAR_0x8004,\\s*${special}\\b`).test(text)) continue;
      const caseAt = tower.indexOf(`case ${special}:`);
      const caseBody = tower.slice(caseAt, tower.indexOf('break;', caseAt));
      if (caseAt < 0 || !caseBody.includes(`FillPartnerParty(${cfg.partnerTrainer})`)) {
        throw new Error(`battle_tower.c: case ${special} no longer calls FillPartnerParty(${cfg.partnerTrainer})`);
      }
      const arrAt = tower.indexOf(`${cfg.array}[`);
      if (arrAt < 0) throw new Error(`battle_tower.c: no ${cfg.array}`);
      const foes = [...text.matchAll(/trainerbattle\s+TRAINER_BATTLE_SET_TRAINER_[AB],\s*(TRAINER_\w+)/g)].map((m) => m[1]);
      battles.push({
        name: `${map} (${special})`,
        partner: { name: cfg.array, mons: parseMonList(blockAfter(tower, arrAt)) },
        foes: foes.map((t) => ({ name: t, ...trainerParty(trainersH, partiesH, t) })),
      });
    }
  }
  return battles;
}

// ---------- analysis (pure: the selftest feeds it planted data) ----------

function multiplier(chart, moveType, defender) {
  if (moveType === 'TYPE_GROUND' && defender.abilities.length && defender.abilities.every((a) => a === 'ABILITY_LEVITATE' || a === 'ABILITY_NONE')) return 0;
  return defender.types.reduce((acc, t) => acc * (chart.has(`${moveType}>${t}`) ? chart.get(`${moveType}>${t}`) : 1), 1);
}

function analyze(battle, { chart, moves, species }) {
  const findings = [];
  const counts = { PHYSICAL: 0, SPECIAL: 0 };
  const partnerMons = battle.partner.mons;
  for (const foe of battle.foes) {
    if (!foe.mons) {
      findings.push({ kind: 'SKIP', text: `${foe.name} (${foe.array}) uses default moves; not analysed` });
      continue;
    }
    for (const mon of foe.mons) {
      for (const mv of mon.moves) {
        const d = moves.get(mv);
        if (!d) throw new Error(`no move data for ${mv}`);
        if (d.power <= 0) continue;
        if (counts[d.category] !== undefined) counts[d.category]++;
        const muls = partnerMons.map((p) => multiplier(chart, d.type, species.get(p.species)));
        if (muls.every((x) => x <= 0.5)) {
          const detail = partnerMons.map((p, i) => `${p.species.replace('SPECIES_', '')} x${muls[i]}`).join(', ');
          if (SPREAD_TARGETS.has(d.target)) {
            findings.push({ kind: 'INFO', text: `${foe.name} ${mon.species.replace('SPECIES_', '')} ${mv.replace('MOVE_', '')} (${d.type.replace('TYPE_', '')}, ${d.category.toLowerCase()} ${d.power}) is resisted by every partner (${detail}) but is a spread move (${d.target.replace('MOVE_TARGET_', '')}): it hits both sides, so it is not PRESSURE` });
            continue;
          }
          findings.push({ kind: 'PRESSURE', text: `${foe.name} ${mon.species.replace('SPECIES_', '')} ${mv.replace('MOVE_', '')} (${d.type.replace('TYPE_', '')}, ${d.category.toLowerCase()} ${d.power}): every partner resists or is immune (${detail}), so ${muls.every((x) => x === 0) ? "it can only land on the player's side" : "the player's side is always the better target"}` });
        }
      }
    }
  }
  const majority = counts.PHYSICAL === counts.SPECIAL ? null : counts.PHYSICAL > counts.SPECIAL ? 'PHYSICAL' : 'SPECIAL';
  for (const p of partnerMons) {
    for (const mv of p.moves) {
      if (!SCREENS[mv] || !majority || SCREENS[mv] === majority) continue;
      findings.push({ kind: 'SCREEN', text: `${battle.partner.name} ${p.species.replace('SPECIES_', '')} ${mv.replace('MOVE_', '')} guards ${SCREENS[mv].toLowerCase()} hits, but the foes' damaging moves are mostly ${majority.toLowerCase()} (${counts.PHYSICAL} physical / ${counts.SPECIAL} special)` });
    }
  }
  return { findings, counts };
}

function printReport(battle, result) {
  const scratch = battle.foes.find((f) => f.scratch);
  console.log(`== ${battle.name}${scratch ? ` (scratch: ${scratch.scratch})` : ''}: partner ${battle.partner.name} [${battle.partner.mons.map((m) => m.species.replace('SPECIES_', '')).join(', ')}] vs ${battle.foes.map((f) => f.name).join(' + ')}`);
  console.log(`   foe damaging moves: ${result.counts.PHYSICAL} physical / ${result.counts.SPECIAL} special (one count per move slot)`);
  if (!result.findings.length) console.log('   no findings');
  for (const f of result.findings) console.log(`   ${f.kind}: ${f.text}`);
}

function selftest() {
  const chart = new Map([['TYPE_POISON>TYPE_STEEL', 0], ['TYPE_FIRE>TYPE_STEEL', 2], ['TYPE_WATER>TYPE_STEEL', 1]]);
  const moves = new Map([
    ['MOVE_PLANT_POISON', { power: 90, type: 'TYPE_POISON', category: 'SPECIAL' }],
    ['MOVE_PLANT_FIRE', { power: 90, type: 'TYPE_FIRE', category: 'SPECIAL' }],
    ['MOVE_PLANT_SPLASH', { power: 0, type: 'TYPE_WATER', category: 'STATUS' }],
    ['MOVE_PLANT_SPREAD', { power: 75, type: 'TYPE_POISON', category: 'PHYSICAL', target: 'MOVE_TARGET_BOTH' }],
    ['MOVE_PLANT_SCRATCH', { power: 80, type: 'TYPE_POISON', category: 'SPECIAL', target: 'MOVE_TARGET_SELECTED' }],
    ['MOVE_REFLECT', { power: 0, type: 'TYPE_PSYCHIC', category: 'STATUS' }],
  ]);
  const species = new Map([['SPECIES_PLANT_STEEL', { types: ['TYPE_STEEL'], abilities: [] }]]);
  const battle = {
    name: 'planted',
    partner: { name: 'sPlantedPartner', mons: [{ species: 'SPECIES_PLANT_STEEL', moves: ['MOVE_REFLECT'] }] },
    foes: [
      { name: 'TRAINER_PLANTED', array: 'sParty_Planted', mons: [{ species: 'SPECIES_PLANT_FOE', moves: ['MOVE_PLANT_POISON', 'MOVE_PLANT_FIRE', 'MOVE_PLANT_SPLASH', 'MOVE_PLANT_SPREAD'] }] },
      { name: 'TRAINER_PLANTED_B', array: 'sParty_PlantedB', mons: [{ species: 'SPECIES_PLANT_OLD', moves: ['MOVE_PLANT_FIRE'] }] },
    ],
  };
  // Scratch override (--party): written to a temp file so loadScratchParty's JSON path runs too.
  const tmp = path.join(require('os').tmpdir(), `check_partner_typing_selftest_${process.pid}.json`);
  fs.writeFileSync(tmp, JSON.stringify({ trainerId: 'TRAINER_PLANTED_B', partyName: 'sParty_PlantedB', party: [{ species: 'SPECIES_PLANT_NEW', moves: ['MOVE_PLANT_SCRATCH', 'MOVE_NONE'] }] }));
  let replaced;
  try { replaced = applyScratch([battle], loadScratchParty(tmp)); } finally { fs.unlinkSync(tmp); }
  const { findings } = analyze(battle, { chart, moves, species });
  const kinds = findings.map((f) => `${f.kind}:${f.text.split(' ').slice(0, 3).join(' ')}`);
  if (replaced !== 1) kinds.push(`SCRATCH:replaced ${replaced} foe slot(s), want 1`);
  const want = [
    'PRESSURE:TRAINER_PLANTED PLANT_FOE PLANT_POISON',
    'INFO:TRAINER_PLANTED PLANT_FOE PLANT_SPREAD',
    'PRESSURE:TRAINER_PLANTED_B PLANT_NEW PLANT_SCRATCH',
    'SCREEN:sPlantedPartner PLANT_STEEL REFLECT',
  ];
  const missing = want.filter((w) => !kinds.includes(w));
  const extra = kinds.filter((k) => !want.includes(k));
  if (missing.length || extra.length) {
    console.error(`check_partner_typing selftest FAIL: missing ${JSON.stringify(missing)}, unexpected ${JSON.stringify(extra)}`);
    process.exit(1);
  }
  console.log('check_partner_typing selftest: 4/4 planted findings flagged (PRESSURE poison vs Steel, spread move INFO not PRESSURE, scratch-party PRESSURE, SCREEN reflect vs special), 0 false positives');
}

function main() {
  if (process.argv.includes('--selftest')) return selftest();
  try {
    const battles = findBattles();
    const partyAt = process.argv.indexOf('--party');
    if (partyAt >= 0) {
      const file = process.argv[partyAt + 1];
      if (!file) throw new Error('--party needs a trainer_config.json path');
      const scratch = loadScratchParty(file);
      if (!applyScratch(battles, scratch)) throw new Error(`--party ${file}: ${scratch.trainerId} is not a foe in any partner battle`);
    }
    const ctx = {
      chart: parseTypeChart(read('src/battle_main.c')),
      moves: parseMoves(read('src/data/battle_moves.h')),
    };
    const all = new Set(battles.flatMap((b) => b.partner.mons.map((m) => m.species)));
    ctx.species = parseSpecies(read('src/data/pokemon/species_info.h'), all);
    let total = 0;
    for (const b of battles) {
      const r = analyze(b, ctx);
      printReport(b, r);
      total += r.findings.filter((f) => f.kind !== 'SKIP' && f.kind !== 'INFO').length;
    }
    console.log(`check_partner_typing: ${battles.length} partner battle(s), ${total} finding(s) (INFO/SKIP lines not counted; report-only)`);
  } catch (e) {
    console.log(`check_partner_typing: could not analyse (${e.message}); report-only, exit 0`);
  }
  process.exit(0);
}

main();
