/**
 * Configurable personality system for Agent Oak.
 *
 * Loads personality traits from `personality.json` at the project root
 * and translates numeric 0-100 sliders into qualitative prompt guidance
 * injected at key decision points (planner, issue evaluation, reflection).
 */

import { z } from "zod";
import { readFileSync } from "fs";
import path from "path";
import { PROJECT_ROOT } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const PersonalitySchema = z.object({
  /** 0 = very cautious, 100 = very bold. Influences mode selection, feature scope, risk assessment. */
  riskTolerance: z.number().min(0).max(100).default(40),
  /** 0 = mostly rejects community ideas, 100 = eagerly accepts. Influences issue evaluation. */
  communityOpenness: z.number().min(0).max(100).default(55),
  /** 0 = small patches, 100 = multi-system features. Influences objective scope. */
  ambitionLevel: z.number().min(0).max(100).default(45),
});

export type Personality = z.infer<typeof PersonalitySchema>;

// ---------------------------------------------------------------------------
// Loading & caching
// ---------------------------------------------------------------------------

const PERSONALITY_PATH = path.join(PROJECT_ROOT, "personality.json");

let cached: Personality | null = null;

/** Load personality from `personality.json`. Falls back to defaults if missing. Cached after first call. */
export function loadPersonality(): Personality {
  if (cached) return cached;

  try {
    const raw = readFileSync(PERSONALITY_PATH, "utf-8");
    cached = PersonalitySchema.parse(JSON.parse(raw));
    logger.info(
      `[Personality] Loaded: riskTolerance=${cached.riskTolerance}, communityOpenness=${cached.communityOpenness}, ambitionLevel=${cached.ambitionLevel}`,
    );
  } catch (err) {
    cached = PersonalitySchema.parse({});
    const reason = (err as NodeJS.ErrnoException).code === "ENOENT"
      ? "file not found"
      : `parse error: ${err instanceof Error ? err.message : String(err)}`;
    logger.info(`[Personality] Using defaults (${reason})`);
  }

  return cached;
}

/** Get the raw personality values. */
export function getPersonality(): Personality {
  return loadPersonality();
}

// ---------------------------------------------------------------------------
// Bucket classification
// ---------------------------------------------------------------------------

type Bucket = "very-low" | "low" | "moderate" | "high" | "very-high";

function traitBucket(value: number): Bucket {
  if (value <= 20) return "very-low";
  if (value <= 40) return "low";
  if (value <= 60) return "moderate";
  if (value <= 80) return "high";
  return "very-high";
}

// ---------------------------------------------------------------------------
// Prompt guidance generators
// ---------------------------------------------------------------------------

const RISK_GUIDANCE: Record<Bucket, string> = {
  "very-low":
    "You are extremely risk-averse. Choose the safest, most well-understood approach available. Prefer research and patch modes over feature mode. When the Tech Lead flags any complexity or risk, defer to their caution. Only attempt changes you are highly confident will succeed on the first try.",
  "low":
    "You lean toward caution. Prefer well-tested approaches and smaller-scope changes. When the Tech Lead raises risk concerns, give those concerns significant weight. Feature mode is fine when prerequisites are solid, but default to patch or research when uncertain.",
  "moderate":
    "Balance risk and caution. Weigh the Tech Lead's risk concerns against the Creative Visionary's ambition and make a judgment call. Don't shy away from feature mode when the objective warrants it, but don't ignore genuine technical risks either.",
  "high":
    "You have a high tolerance for risk. Prefer ambitious changes that touch multiple systems over safe single-file patches. When the Tech Lead flags complexity or risk, acknowledge it but don't let it default you to the conservative option. Feature and planning modes are preferable to patch and research when the objective warrants it.",
  "very-high":
    "You thrive on bold, high-risk moves. Push for transformative changes even when the path is uncertain. The Tech Lead's risk warnings are noted but should rarely override an exciting creative direction. Prefer feature and planning modes. Safe patches are a last resort.",
};

const COMMUNITY_GUIDANCE: Record<Bucket, string> = {
  "very-low":
    "Be very selective about community suggestions. Only accept issues that are perfectly aligned with the current roadmap and have zero implementation risk. Default to deferring or rejecting unless the value is overwhelming. Protect the creative vision above all.",
  "low":
    "Be selective about community suggestions. Accept issues that clearly align with the current roadmap and strategic vision. Prefer to defer or request more information rather than accepting uncertain ideas. Quality over quantity.",
  "moderate":
    "Evaluate community suggestions on their merits. Accept ideas that align with the project vision, defer ones that need more thought, and reject those that don't fit. No strong bias in either direction.",
  "high":
    "Default to accepting community suggestions unless they clearly conflict with the project vision. Give contributors the benefit of the doubt — if a suggestion is partially aligned, accept the aligned parts rather than deferring the whole thing. Only reject ideas that fundamentally contradict the creative direction.",
  "very-high":
    "Embrace community input enthusiastically. Accept most suggestions and find ways to incorporate even unconventional ideas. The community often sees opportunities the planner misses. Only reject suggestions that would actively harm the project. Treat every contributor as a valued collaborator.",
};

const AMBITION_GUIDANCE: Record<Bucket, string> = {
  "very-low":
    "Scope objectives conservatively. Single-file data edits and targeted value tweaks are ideal. Avoid multi-system changes. A cycle that safely modifies one thing is better than one that ambitiously attempts many.",
  "low":
    "Scope objectives modestly. A well-executed small change is preferable to a sprawling ambitious one. When the Creative Visionary proposes something bold, scale it down to what can be confidently delivered in one cycle.",
  "moderate":
    "Balance ambition with feasibility. A cycle can touch multiple files if the changes are cohesive, but don't overextend. When the Creative Visionary proposes something bold, consider whether a scaled-down version captures the core value.",
  "high":
    "Scope objectives ambitiously. A cycle that transforms an entire game system is more valuable than one that tweaks a single value. When the Creative Visionary proposes something bold, lean into it. Multi-cycle feature arcs are encouraged.",
  "very-high":
    "Go big. Every cycle should aim for a transformative impact on the player experience. Multi-system overhauls, new mechanics, sweeping redesigns — this is the standard. When forced to choose, prefer an ambitious attempt that might need repair over a safe patch that moves the needle barely at all.",
};

/**
 * Build the combined personality guidance section for the Producer/planner prompt.
 * Returns a markdown section or empty string if all traits are moderate (minimal guidance).
 */
export function getPersonalityGuidance(): string {
  const p = loadPersonality();
  const risk = traitBucket(p.riskTolerance);
  const community = traitBucket(p.communityOpenness);
  const ambition = traitBucket(p.ambitionLevel);

  // At all-moderate, skip the section to avoid prompt bloat
  if (risk === "moderate" && community === "moderate" && ambition === "moderate") {
    return "";
  }

  const parts: string[] = [];

  if (risk !== "moderate") {
    parts.push(`**Risk tolerance** (${risk}): ${RISK_GUIDANCE[risk]}`);
  }
  if (community !== "moderate") {
    parts.push(`**Community openness** (${community}): ${COMMUNITY_GUIDANCE[community]}`);
  }
  if (ambition !== "moderate") {
    parts.push(`**Ambition level** (${ambition}): ${AMBITION_GUIDANCE[ambition]}`);
  }

  return parts.join("\n\n");
}

/**
 * Build issue-evaluation-specific guidance based on communityOpenness.
 * Appended to the planner's closing instructions.
 */
export function getIssueEvaluationGuidance(): string {
  const p = loadPersonality();
  const bucket = traitBucket(p.communityOpenness);

  // Only inject extra guidance when the trait deviates from moderate
  if (bucket === "moderate") return "";

  return `\n\n**Community issue disposition**: ${COMMUNITY_GUIDANCE[bucket]}`;
}

/**
 * Brief personality-aware nudge for the reflection prompt.
 */
export function getReflectionPersonalityNudge(): string {
  const p = loadPersonality();
  const ambition = traitBucket(p.ambitionLevel);
  const risk = traitBucket(p.riskTolerance);

  if (ambition === "moderate" && risk === "moderate") return "";

  const nudges: string[] = [];

  if (ambition === "high" || ambition === "very-high") {
    nudges.push("Consider whether this cycle was ambitious enough — did it push the ROM hack's creative identity forward meaningfully?");
  } else if (ambition === "low" || ambition === "very-low") {
    nudges.push("Consider whether the scope was appropriately focused — was the cycle well-contained and deliverable?");
  }

  if (risk === "high" || risk === "very-high") {
    nudges.push("Reflect on any bold choices made — even if some didn't work out, were they worth the attempt?");
  } else if (risk === "low" || risk === "very-low") {
    nudges.push("Evaluate whether risks were adequately managed — were there any surprises that better caution could have avoided?");
  }

  return nudges.join(" ");
}
