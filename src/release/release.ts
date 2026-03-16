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
 * Determine the release stage label based on the version.
 * major === 0: Alpha; minor < 5 when major >= 1: Beta; otherwise Stable.
 */
function getReleaseStage(version: GameVersion): string {
  if (version.major === 0) return "Alpha";
  if (version.minor < 5) return "Beta";
  return "Stable";
}

/**
 * Format the IPS patch filename.
 * e.g. "agentoak-v0.0.15-build42.ips"
 */
function patchFilename(version: GameVersion): string {
  return `agentoak-v${version.major}.${version.minor}.${version.cycle}-build${version.build}.ips`;
}

/**
 * Format a player-facing changelog from the cycle summary.
 * Keeps it non-technical and focused on what changed for players.
 *
 * If `cycleChanges` is provided, renders them as a bullet list.
 * Falls back to the narrative `cycleSummary` or `objective` otherwise.
 */
function formatChangelog(
  version: GameVersion,
  cycleSummary: string,
  objective: string,
  cycleChanges: string[],
): string {
  const date = new Date().toISOString().split("T")[0];
  const versionStr = formatVersion(version);

  const whatsNew =
    cycleChanges.length > 0
      ? cycleChanges.map((c) => `- ${c}`).join("\n")
      : cycleSummary || objective;

  return [
    `**Released:** ${date}`,
    "",
    "## What's New",
    "",
    whatsNew,
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
  cycleChanges: string[] = [],
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

  // Tag uses the cycle number as the patch component: v0.0.<cycle>
  const tagName = `v${version.major}.${version.minor}.${version.cycle}`;
  const releaseStage = getReleaseStage(version);
  const releaseName = `Legends of Hoenn v${version.major}.${version.minor}.${version.cycle} ${releaseStage}`;
  const changelog = formatChangelog(version, cycleSummary, objective, cycleChanges);
  const assetName = patchFilename(version);

  const releaseData = {
    owner: repo.owner,
    repo: repo.repo,
    tag_name: tagName,
    name: releaseName,
    body: changelog,
    target_commitish: 'main',
    draft: false,
    prerelease: version.major === 0,
  } as const;

  logger.info(`Preparing to create GitHub release: ${releaseName}`);
  logger.info(`Release tag: ${tagName}`);
  logger.info(`Release target branch: main`);

  try {
    // Create the release
    const release = await octokit.repos.createRelease(releaseData);

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
