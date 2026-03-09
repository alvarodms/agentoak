/**
 * GitHub release creation for Agent Oak.
 *
 * After a successful build that includes pokeemerald changes, this module:
 * 1. Generates an IPS patch (base ROM → modified ROM)
 * 2. Creates a GitHub release tagged with the game version
 * 3. Uploads the IPS patch as a release asset
 * 4. Includes a player-facing changelog in the release body
 */

import { getGitHubClient, getRepoInfo } from "../github/client.js";
import { generateIPSPatch } from "./patcher.js";
import type { GameVersion } from "../repo/version.js";
import { formatVersion } from "../repo/version.js";
import { logger } from "../utils/logger.js";

/**
 * Format the IPS patch filename.
 * e.g. "agentoak-v0.1.0-build42.ips"
 */
function patchFilename(version: GameVersion): string {
  return `agentoak-v${version.major}.${version.minor}.${version.patch}-build${version.build}.ips`;
}

/**
 * Format a player-facing changelog from the cycle summary.
 * Keeps it non-technical and focused on what changed for players.
 */
function formatChangelog(
  version: GameVersion,
  cycleSummary: string,
  objective: string,
): string {
  const date = new Date().toISOString().split("T")[0];
  const versionStr = formatVersion(version);

  return [
    `## ${versionStr}`,
    `**Released:** ${date}`,
    "",
    "### What's New",
    "",
    cycleSummary || objective,
    "",
    "---",
    `*This patch was generated automatically by Agent Oak (cycle ${version.cycle}).*`,
    `*Apply this .ips patch to a clean Pokémon Emerald (U) ROM to play.*`,
  ].join("\n");
}

/**
 * Create a GitHub release with the IPS patch attached.
 *
 * Returns the release URL on success, or null if release creation
 * was skipped or failed.
 */
export async function createCycleRelease(
  version: GameVersion,
  commitHash: string,
  cycleSummary: string,
  objective: string,
): Promise<string | null> {
  const octokit = getGitHubClient();
  const repo = getRepoInfo();
  if (!octokit || !repo) {
    logger.info("GitHub not configured — skipping release creation.");
    return null;
  }

  // Generate IPS patch
  const patchBuffer = await generateIPSPatch();
  if (!patchBuffer) {
    logger.warn("Could not generate IPS patch — skipping release.");
    return null;
  }

  const tagName = formatVersion(version);
  const releaseName = `Agent Oak v${version.major}.${version.minor}.${version.patch} Build ${version.build}`;
  const changelog = formatChangelog(version, cycleSummary, objective);
  const assetName = patchFilename(version);

  try {
    // Create the release
    const release = await octokit.repos.createRelease({
      owner: repo.owner,
      repo: repo.repo,
      tag_name: tagName,
      name: releaseName,
      body: changelog,
      target_commitish: commitHash,
      draft: false,
      prerelease: version.major === 0,
    });

    logger.info(`Created GitHub release: ${releaseName} (${release.data.html_url})`);

    // Upload the IPS patch as a release asset
    await octokit.repos.uploadReleaseAsset({
      owner: repo.owner,
      repo: repo.repo,
      release_id: release.data.id,
      name: assetName,
      // Octokit types expect string but accepts Buffer for binary data
      data: patchBuffer as unknown as string,
      headers: {
        "content-type": "application/octet-stream",
        "content-length": patchBuffer.length,
      },
    });

    logger.info(`Uploaded release asset: ${assetName} (${patchBuffer.length} bytes)`);
    return release.data.html_url;
  } catch (err) {
    logger.error(
      `Failed to create release: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}
