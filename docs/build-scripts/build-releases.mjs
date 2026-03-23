#!/usr/bin/env node

/**
 * Build script: fetches the latest GitHub releases and writes docs/public/data/releases.json
 *
 * In CI, a dedicated pipeline step runs this script with GITHUB_TOKEN set so the
 * request is authenticated (5 000 req/h instead of 60). The subsequent `npm run build`
 * invocation detects the already-generated file and skips re-fetching.
 *
 * For local dev the script still works without a token (unauthenticated fallback).
 *
 * Run: node docs/build-scripts/build-releases.mjs
 */

import { writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..');
const OUTPUT_DIR = join(DOCS_DIR, 'public', 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'releases.json');

const REPO = process.env.GITHUB_REPOSITORY || 'alvarodms/agentoak';
const API_URL = `https://api.github.com/repos/${REPO}/releases?per_page=5`;

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function main() {
  if (await fileExists(OUTPUT_FILE)) {
    console.log(`✔ ${OUTPUT_FILE} already exists — skipping fetch`);
    return;
  }

  let releases = [];

  const headers = { 'Accept': 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(API_URL, { headers });

    if (!res.ok) {
      console.warn(`⚠ GitHub API returned ${res.status} — writing empty releases`);
    } else {
      const data = await res.json();
      releases = data.map(release => {
        const ipsAsset = release.assets?.find(a => a.name.endsWith('.ips'));
        return {
          tag: release.tag_name,
          name: release.name || release.tag_name,
          date: release.published_at,
          body: release.body || '',
          url: release.html_url,
          ipsUrl: ipsAsset?.browser_download_url || null,
          ipsName: ipsAsset?.name || null,
        };
      });
    }
  } catch (err) {
    console.warn(`⚠ Failed to fetch releases: ${err.message} — writing empty array`);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(releases, null, 2) + '\n');
  console.log(`✔ Generated ${OUTPUT_FILE} (${releases.length} releases)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
