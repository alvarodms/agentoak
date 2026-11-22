#!/usr/bin/env node
'use strict';

// Memory claim checker (C390, tech-debt 375).
//
// Memory written by a cycle that was later LOST (C374) or simply drifted can
// say work is DONE when the tree disagrees (failure-patterns "Crashed-cycle
// memory claims"). This lint checks memory/ against the tree so that drift fails
// a target instead of being caught by hand at planning time.
//
// Rules (each a pure function over text + a tree lookup, so --selftest can
// feed fixtures):
//   M1. Artifact tags. Every memory/**/*.md HTML comment
//       `<!-- artifact: SPEC; SPEC -->` (not preceded by a backtick, so docs can
//       quote the syntax) holds `;`-separated specs:
//         path              the file or dir exists under pokeemerald/
//         grep:PAT@path     the file contains PAT (literal substring)
//         absent:PAT@path   the file exists and does NOT contain PAT
//       A path starting `repo:` is relative to the repo root instead
//       (e.g. grep:expectBattleSummary@repo:src/emulator/playtest.ts).
//   M2. memory/claims.json: [{id, file, contains | absent | exists, why, root?}],
//       literal substring tests on pokeemerald/<file> (root "repo": repo root).
//       `exists: false` means the path must not exist.
//   M3. Symbol references in memory/strategy-notes.md, memory/codebase-facts.md
//       and memory/codebase-facts/*.md: TRAINER_* must be in opponents.h,
//       FLAG_* in any include/constants/*.h, VAR_* in vars.h, and every
//       `make check_*` must be a Makefile target. Lines with a historical marker
//       (HISTORY_MARKERS) are skipped, as are placeholders (TRAINER_X) and
//       tokens cut short by the regex (ending `_`). Exceptions go in ALLOWLIST
//       with a reason. Fewer than MIN_REFS parsed refs = parser failure (C323).
//
// Fails (exit 1) on any FAIL line.
//
// Usage: node scripts/check_memory_claims.cjs [--selftest]
//        (run by `make check_memory`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const POKEEMERALD = path.resolve(__dirname, '..');
const REPO = path.resolve(__dirname, '../..');
const MEMORY = path.join(REPO, 'memory');
const CLAIMS_JSON = path.join(MEMORY, 'claims.json');
const MIN_REFS = 30;

const HISTORY_MARKERS = ['(was', 'ex-', 'renamed', 'LOST', 'dropped', 'retired'];

// Tokens M3 finds that live in a different header than their prefix suggests.
// `in` (pokeemerald-relative) must still contain the token, so a stale row fails.
const ALLOWLIST = [
  { token: 'TRAINER_FLAGS_START', in: 'include/constants/flags.h', reason: 'trainer flag block bound, defined in flags.h' },
  { token: 'TRAINER_FLAGS_END', in: 'include/constants/flags.h', reason: 'trainer flag block bound, defined in flags.h' },
  { token: 'TRAINER_REGISTERED_FLAGS_START', in: 'include/constants/flags.h', reason: 'Match Call registered block, defined in flags.h' },
  { token: 'TRAINER_BATTLE_SINGLE_NO_INTRO_TEXT', in: 'include/constants/battle_setup.h', reason: 'trainerbattle mode constant' },
  { token: 'TRAINER_LINK_OPPONENT', in: 'include/constants/trainers.h', reason: 'link-battle opponent id (2048), outside the trainer table' },
  { token: 'TRAINER_HILL', in: 'include/constants/battle.h', reason: 'shorthand for BATTLE_TYPE_TRAINER_HILL in a list of battle types' },
];

const TAG_RE = /(?<!`)<!--\s*artifact:\s*([\s\S]*?)\s*-->/g;
const SYMBOL_RE = /\b(TRAINER|FLAG|VAR)_[A-Z0-9_]+\b/g;
const MAKE_RE = /\bmake (check_[a-z_]+)/g;
const PLACEHOLDER_SEGMENTS = new Set(['X', 'Y', 'N', 'NN', 'NNN', 'NAME']);

// ---------- tree lookup ----------

// path spec -> { root: 'pokeemerald' | 'repo', rel }
function splitRoot(p) {
  const s = p.trim();
  if (s.startsWith('repo:')) return { root: 'repo', rel: s.slice(5) };
  return { root: 'pokeemerald', rel: s };
}

// Real filesystem tree: { exists(root, rel), read(root, rel) -> string | null }
function fsTree() {
  const abs = (root, rel) => path.join(root === 'repo' ? REPO : POKEEMERALD, rel);
  return {
    exists: (root, rel) => fs.existsSync(abs(root, rel)),
    read: (root, rel) => {
      const p = abs(root, rel);
      if (!fs.existsSync(p) || !fs.statSync(p).isFile()) return null;
      return fs.readFileSync(p, 'utf8');
    },
  };
}

// In-memory tree for the selftest: keys 'pokeemerald:rel' / 'repo:rel' -> text
function fakeTree(files) {
  return {
    exists: (root, rel) => Object.prototype.hasOwnProperty.call(files, `${root}:${rel}`),
    read: (root, rel) => (Object.prototype.hasOwnProperty.call(files, `${root}:${rel}`) ? files[`${root}:${rel}`] : null),
  };
}

// ---------- M1 artifact tags ----------

// one spec string -> error message or null
function checkSpec(spec, tree) {
  let kind = 'path';
  let body = spec;
  if (spec.startsWith('grep:')) { kind = 'grep'; body = spec.slice(5); }
  else if (spec.startsWith('absent:')) { kind = 'absent'; body = spec.slice(7); }
  if (kind === 'path') {
    const { root, rel } = splitRoot(body);
    if (!rel) return 'empty path';
    return tree.exists(root, rel) ? null : `${root === 'repo' ? 'repo:' : ''}${rel} does not exist`;
  }
  const at = body.lastIndexOf('@');
  if (at <= 0) return `bad ${kind} spec (want ${kind}:PATTERN@path)`;
  const pattern = body.slice(0, at);
  const { root, rel } = splitRoot(body.slice(at + 1));
  const text = tree.read(root, rel);
  if (text === null) return `${rel} is not a file`;
  if (kind === 'grep' && !text.includes(pattern)) return `${rel} does not contain ${pattern}`;
  if (kind === 'absent' && text.includes(pattern)) return `${rel} still contains ${pattern}`;
  return null;
}

// files [{ name, text }] -> { count, errors }
function checkArtifactTags(files, tree) {
  const errors = [];
  let count = 0;
  for (const { name, text } of files) {
    text.split('\n').forEach((line, i) => {
      TAG_RE.lastIndex = 0;
      let m;
      while ((m = TAG_RE.exec(line)) !== null) {
        count++;
        const specs = m[1].split(';').map((s) => s.trim()).filter(Boolean);
        if (specs.length === 0) errors.push(`FAIL M1 ${name}:${i + 1} (empty artifact tag)`);
        for (const spec of specs) {
          const err = checkSpec(spec, tree);
          if (err) errors.push(`FAIL M1 ${name}:${i + 1} ${spec} (${err})`);
        }
      }
    });
  }
  return { count, errors };
}

// ---------- M2 claims.json ----------

// claims array -> { count, errors }
function checkClaims(claims, tree) {
  const errors = [];
  if (!Array.isArray(claims)) return { count: 0, errors: ['FAIL M2 claims.json is not an array'] };
  for (const c of claims) {
    const id = c && c.id ? c.id : '(no id)';
    const modes = ['contains', 'absent', 'exists'].filter((k) => c && k in c);
    if (!c || typeof c.file !== 'string' || !c.why || modes.length !== 1) {
      errors.push(`FAIL M2 ${id}: needs id, file, why and exactly one of contains/absent/exists`);
      continue;
    }
    const root = c.root === 'repo' ? 'repo' : 'pokeemerald';
    if (modes[0] === 'exists') {
      if (tree.exists(root, c.file) !== Boolean(c.exists)) {
        errors.push(`FAIL M2 ${id}: ${c.file} ${c.exists ? 'does not exist' : 'exists'} (${c.why})`);
      }
      continue;
    }
    const text = tree.read(root, c.file);
    if (text === null) errors.push(`FAIL M2 ${id}: ${c.file} is not a file`);
    else if (modes[0] === 'contains' && !text.includes(c.contains)) errors.push(`FAIL M2 ${id}: ${c.file} does not contain ${c.contains} (${c.why})`);
    else if (modes[0] === 'absent' && text.includes(c.absent)) errors.push(`FAIL M2 ${id}: ${c.file} still contains ${c.absent} (${c.why})`);
  }
  return { count: claims.length, errors };
}

// ---------- M3 symbol references ----------

function identifiers(text) {
  return new Set(text.match(/\b[A-Za-z0-9_]+\b/g) || []);
}

function makeTargets(makefileText) {
  const out = new Set();
  for (const m of makefileText.matchAll(/^([A-Za-z0-9_]+)\s*:(?!=)/gm)) out.add(m[1]);
  return out;
}

function isPlaceholder(token) {
  if (token.endsWith('_')) return true;
  return token.split('_').slice(1).some((seg) => PLACEHOLDER_SEGMENTS.has(seg));
}

// files [{ name, text }], headers { opponents, flags (all constants/*.h), vars, makefile }
// -> { count, allowlisted, errors }
function checkRefs(files, headers, allowlist = ALLOWLIST, minRefs = MIN_REFS) {
  const sets = {
    TRAINER: { ids: identifiers(headers.opponents), header: 'include/constants/opponents.h' },
    FLAG: { ids: identifiers(headers.flags), header: 'include/constants/*.h' },
    VAR: { ids: identifiers(headers.vars), header: 'include/constants/vars.h' },
  };
  const targets = makeTargets(headers.makefile);
  const allowed = new Set(allowlist.map((a) => a.token));
  const errors = [];
  let count = 0;
  let allowlisted = 0;
  for (const { name, text } of files) {
    text.split('\n').forEach((line, i) => {
      if (HISTORY_MARKERS.some((h) => line.includes(h))) return;
      for (const m of line.matchAll(SYMBOL_RE)) {
        const token = m[0];
        if (isPlaceholder(token)) continue;
        count++;
        const set = sets[m[1]];
        if (set.ids.has(token)) continue;
        if (allowed.has(token)) { allowlisted++; continue; }
        errors.push(`FAIL M3 ${name}:${i + 1} ${token} not in ${set.header}`);
      }
      for (const m of line.matchAll(MAKE_RE)) {
        count++;
        if (targets.has(m[1])) continue;
        if (allowed.has(m[1])) { allowlisted++; continue; }
        errors.push(`FAIL M3 ${name}:${i + 1} ${m[1]} not in Makefile`);
      }
    });
  }
  if (count < minRefs) errors.push(`FAIL M3 parsed only ${count} refs (< ${minRefs}): parser failure?`);
  return { count, allowlisted, errors };
}

// allowlist rows -> errors for rows with no reason or whose `in` file lost the token
function checkAllowlist(allowlist, tree) {
  const errors = [];
  for (const a of allowlist) {
    if (!a.reason) errors.push(`FAIL M3 ALLOWLIST ${a.token}: no reason`);
    if (!a.in) continue;
    const text = tree.read('pokeemerald', a.in);
    if (text === null || !text.includes(a.token)) errors.push(`FAIL M3 ALLOWLIST ${a.token}: not in ${a.in} (stale row)`);
  }
  return errors;
}

// ---------- selftest ----------

function selftest() {
  let passed = 0;
  let total = 0;
  const failures = [];
  const expect = (label, ok) => {
    total++;
    if (ok) passed++;
    else failures.push(label);
  };
  const tree = fakeTree({
    'pokeemerald:include/constants/opponents.h': '#define TRAINER_REAL 1\n',
    'pokeemerald:scripts/real.cjs': 'reclaim mode\n',
    'repo:src/emulator/playtest.ts': 'faintCauses\n',
  });
  const tag = (s) => [{ name: 'fixture.md', text: `| 1 | row | done <!-- artifact: ${s} --> |` }];
  const m1 = (s) => checkArtifactTags(tag(s), tree);

  // must FAIL
  expect('M1 missing path fails', m1('scripts/not_real.cjs').errors.some((e) => e.startsWith('FAIL M1 fixture.md:1')));
  expect('M1 missing grep pattern fails', m1('grep:PLANTED_NOT_REAL@include/constants/opponents.h').errors.length === 1);
  expect('M1 absent pattern present fails', m1('absent:TRAINER_REAL@include/constants/opponents.h').errors.length === 1);
  expect('M2 missing contains fails', checkClaims([{ id: 'x', file: 'scripts/real.cjs', contains: 'not here', why: 't' }], tree).errors.length === 1);
  expect('M2 exists:false on a real file fails', checkClaims([{ id: 'x', file: 'scripts/real.cjs', exists: false, why: 't' }], tree).errors.length === 1);
  const headers = { opponents: '#define TRAINER_REAL 1\n', flags: '#define FLAG_REAL 1\n', vars: '#define VAR_REAL 1\n', makefile: 'check_real:\n\t@true\n' };
  const filler = Array.from({ length: 30 }, () => 'TRAINER_REAL').join(' ');
  const refs = (line, min) => checkRefs([{ name: 'notes.md', text: `${filler}\n${line}` }], headers, [], min);
  expect('M3 planted trainer fails', refs('uses TRAINER_PLANTED_NOT_REAL here').errors.some((e) => e === 'FAIL M3 notes.md:2 TRAINER_PLANTED_NOT_REAL not in include/constants/opponents.h'));
  expect('M3 missing make target fails', refs('run make check_planted').errors.length === 1);
  expect('M3 stale allowlist row fails', checkAllowlist([{ token: 'TRAINER_GONE', in: 'include/constants/opponents.h', reason: 't' }], tree).length === 1);
  expect('M3 parse count < 30 fails', checkRefs([{ name: 'n.md', text: 'TRAINER_REAL' }], headers).errors.some((e) => e.includes('parsed only 1 refs')));

  // must PASS
  expect('M1 valid tag passes', m1('scripts/real.cjs; grep:reclaim@scripts/real.cjs; absent:create@scripts/real.cjs; grep:faintCauses@repo:src/emulator/playtest.ts').errors.length === 0);
  expect('M1 backtick-quoted tag is ignored', checkArtifactTags([{ name: 'd.md', text: 'syntax `<!-- artifact: nope -->`' }], tree).count === 0);
  expect('M2 valid claims pass', checkClaims([
    { id: 'a', file: 'scripts/real.cjs', contains: 'reclaim', why: 't' },
    { id: 'b', file: 'scripts/real.cjs', absent: 'create', why: 't' },
    { id: 'c', file: 'src/emulator/playtest.ts', root: 'repo', contains: 'faint', why: 't' },
    { id: 'd', file: 'playtests/gone.json', exists: false, why: 't' },
  ], tree).errors.length === 0);
  expect('M3 historical (was TRAINER_OLD) passes', refs('slot 486 (was TRAINER_OLD) now FLAG_REAL VAR_REAL, make check_real').errors.length === 0);
  expect('M3 placeholders skipped', refs('TRAINER_X and FLAG_HIDE_* and FLAG_TEMP_').errors.length === 0);
  expect('M3 live allowlist row passes', checkAllowlist([{ token: 'TRAINER_REAL', in: 'include/constants/opponents.h', reason: 't' }], tree).length === 0);
  expect('M3 allowlist works', checkRefs([{ name: 'n.md', text: `${filler} TRAINER_OK_ALLOWED` }], headers, [{ token: 'TRAINER_OK_ALLOWED', reason: 't' }]).allowlisted === 1);

  for (const f of failures) console.error(`check_memory selftest FAILED: ${f}`);
  console.log(`check_memory selftest: ${passed}/${total}`);
  if (passed !== total) process.exit(1);
}

// ---------- real run ----------

function walkMd(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out.sort();
}

function memFile(p) {
  return { name: path.relative(REPO, p), text: fs.readFileSync(p, 'utf8') };
}

function main() {
  const tree = fsTree();
  const errors = [];

  const m1 = checkArtifactTags(walkMd(MEMORY).map(memFile), tree);
  errors.push(...m1.errors);

  let claims = [];
  try {
    claims = JSON.parse(fs.readFileSync(CLAIMS_JSON, 'utf8'));
  } catch (e) {
    errors.push(`FAIL M2 memory/claims.json: ${e.message}`);
  }
  const m2 = checkClaims(claims, tree);
  errors.push(...m2.errors);

  const constantsDir = path.join(POKEEMERALD, 'include/constants');
  const read = (rel) => fs.readFileSync(path.join(POKEEMERALD, rel), 'utf8');
  const headers = {
    opponents: read('include/constants/opponents.h'),
    flags: fs.readdirSync(constantsDir).filter((f) => f.endsWith('.h')).map((f) => fs.readFileSync(path.join(constantsDir, f), 'utf8')).join('\n'),
    vars: read('include/constants/vars.h'),
    makefile: read('Makefile'),
  };
  const refFiles = [
    path.join(MEMORY, 'strategy-notes.md'),
    path.join(MEMORY, 'codebase-facts.md'),
    ...walkMd(path.join(MEMORY, 'codebase-facts')),
  ].map(memFile);
  const m3 = checkRefs(refFiles, headers);
  errors.push(...m3.errors, ...checkAllowlist(ALLOWLIST, tree));

  if (errors.length) {
    for (const e of errors) console.error(e);
    console.error(`check_memory: ${errors.length} failure(s)`);
    process.exit(1);
  }
  console.log(`check_memory: M1 ${m1.count} tags, M2 ${m2.count} claims, M3 ${m3.count} refs (${m3.allowlisted} allowlisted): OK`);
}

module.exports = { checkSpec, checkArtifactTags, checkClaims, checkRefs, checkAllowlist, makeTargets, isPlaceholder, fakeTree, ALLOWLIST };

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
