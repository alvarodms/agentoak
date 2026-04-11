/**
 * Sprite Designer agent — a specialist that creates and iterates on regional
 * form sprites using palette recoloring, pixel-level scripting (Pillow), and
 * community feedback.
 *
 * Runs as Phase 1.75 between Gameplay Design and Implementation, only when the
 * Producer signals sprite work is needed via `spriteDesignBrief`.
 *
 * The Spriter creates/modifies sprite files only (PNGs + PALs). Species
 * registration (the 13-file pipeline) stays with the implementation agent.
 */

import { runClaudeCode, extractMcpTools } from "../agent/claude-cli.js";
import { logger } from "../utils/logger.js";
import type { TokenUsage } from "../memory/types.js";
import type { ActionRecord } from "../agent/output-parser.js";

/**
 * Structured metadata the Sprite Designer emits alongside its narrative report
 * so the runner can post the sprite-feedback GitHub issue without parsing prose.
 *
 * The agent is instructed to end its report with a fenced `sprite-metadata`
 * JSON block — see the `## Output` section of the prompt.
 */
export interface SpriteFeedbackMetadata {
  /** Base species name, e.g. "Corsola" — NO "Hoenn" prefix (the issue helper adds it). */
  speciesName: string;
  /** Type line, e.g. "Ghost/Rock". */
  typing: string;
  /** 1 for a fresh sprite, 2+ for iteration rounds. */
  version: number;
  /** True when this cycle iterates on an existing sprite-feedback issue. */
  isIteration: boolean;
  /** Required when isIteration === true — the existing sprite-feedback issue number. */
  existingIssueNumber?: number;
}

/**
 * Pre-filled iteration context the runner injects into the Sprite Designer
 * prompt when the Producer signalled this is an iteration on an existing
 * sprite-feedback issue. Supplying this out-of-band lets the runner hard-pin
 * `existingIssueNumber` in the expected metadata block, instead of relying on
 * the agent to parse it from free-text in the brief (which has historically
 * failed — see the cycle 204 post-mortem).
 */
export interface SpriteIterationContext {
  /** Base species name (e.g. "Corsola"). */
  speciesName: string;
  /** Existing sprite-feedback GitHub issue number to comment on. */
  existingIssueNumber: number;
  /** The version number this iteration will produce (previous + 1). */
  nextVersion: number;
}

export interface SpriteDesignResult {
  /** Report of what was created/modified, techniques used, notes for community */
  spriteReport: string;
  /** List of sprite files created or modified */
  filesCreated: string[];
  /** Number of tool calls made during design */
  toolCallCount: number;
  /** Token usage for this phase */
  tokenUsage: TokenUsage;
  /** Structured action log from the Sprite Designer agent — merged into the
   *  journal's tool-call accounting so Phase 1.75 isn't invisible. */
  actions: ActionRecord[];
  /** Structured metadata parsed from the agent's report. Null when the agent
   *  omitted or malformed the sprite-metadata block — the runner logs a warning
   *  in that case and skips the feedback issue. */
  metadata: SpriteFeedbackMetadata | null;
}

const SPRITE_DESIGNER_MAX_TURNS = 80;
const SPRITE_DESIGNER_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/** MCP tool for fetching base sprites from the expansion repo. */
const SPRITE_MCP_TOOL = "mcp__pokedex__fetch_pokemon_sprites";

/** Built-in + MCP tools the Sprite Designer is allowed to use. */
const SPRITE_DESIGNER_TOOLS = [
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Glob",
  "Grep",
  SPRITE_MCP_TOOL,
].join(",");

/**
 * Run the Sprite Designer agent to create or iterate on regional form sprites.
 *
 * The agent has access to Pillow (via Bash), the sprite fetcher MCP tool,
 * and file manipulation tools. It works programmatically — writing Python
 * scripts to modify indexed-color PNGs and JASC-PAL palette files.
 *
 * If the agent fails, the caller should fall back to the placeholder copy
 * approach (copy sprites from the base species).
 */
export async function runSpriteDesigner(
  objective: string,
  brief: string,
  implementationPlan: string,
  iterationContext?: SpriteIterationContext,
): Promise<SpriteDesignResult> {
  const prompt = buildSpriteDesignerPrompt(
    objective,
    brief,
    implementationPlan,
    iterationContext,
  );

  logger.info("[Sprite Designer] Starting sprite design phase...");
  logger.info(`[Sprite Designer] Brief: ${brief.slice(0, 200)}${brief.length > 200 ? "..." : ""}`);
  if (iterationContext) {
    logger.info(
      `[Sprite Designer] Iteration context: ${iterationContext.speciesName} v${iterationContext.nextVersion} (existing issue #${iterationContext.existingIssueNumber})`,
    );
  }

  const result = await runClaudeCode(prompt, {
    maxTurns: SPRITE_DESIGNER_MAX_TURNS,
    timeout: SPRITE_DESIGNER_TIMEOUT_MS,
    tools: SPRITE_DESIGNER_TOOLS,
    model: process.env.ANTHROPIC_MODEL,
  });

  const spriteReport = result.narrativeText || result.resultText || "";

  if (!spriteReport.trim()) {
    throw new Error("Sprite Designer produced no output");
  }

  // Extract file paths from the result's modified files list
  const filesCreated = result.filesModified.filter(
    (f) => f.includes("graphics/pokemon/") || f.endsWith(".py"),
  );

  let metadata = parseSpriteFeedbackMetadata(spriteReport);
  let finalReport = spriteReport;
  let totalToolCalls = result.toolCallCount;
  let totalTokenUsage = result.tokenUsage;
  const allActions: ActionRecord[] = [...result.actions];

  // Retry once if metadata parsing failed — historically a silent failure mode
  // that left Phase 3.6 unable to post the feedback issue (see cycle 204).
  if (!metadata) {
    logger.warn(
      "[Sprite Designer] No valid sprite-metadata block in first report — retrying with a focused metadata prompt.",
    );
    try {
      const retryPrompt = buildMetadataRetryPrompt(
        finalReport,
        iterationContext,
      );
      const retry = await runClaudeCode(retryPrompt, {
        maxTurns: 5,
        timeout: 2 * 60 * 1000,
        tools: "Read",
        model: process.env.ANTHROPIC_MODEL,
      });
      const retryText = retry.narrativeText || retry.resultText || "";
      const retryMetadata = parseSpriteFeedbackMetadata(retryText);
      totalToolCalls += retry.toolCallCount;
      allActions.push(...retry.actions);
      totalTokenUsage = {
        inputTokens: totalTokenUsage.inputTokens + retry.tokenUsage.inputTokens,
        outputTokens:
          totalTokenUsage.outputTokens + retry.tokenUsage.outputTokens,
        totalTokens: totalTokenUsage.totalTokens + retry.tokenUsage.totalTokens,
      };
      if (retryMetadata) {
        metadata = retryMetadata;
        finalReport = `${finalReport}\n\n${retryText.trim()}`;
        logger.info(
          "[Sprite Designer] Metadata retry succeeded — sprite-feedback issue posting will proceed.",
        );
      } else {
        logger.warn(
          "[Sprite Designer] Metadata retry still produced no valid sprite-metadata block.",
        );
      }
    } catch (err) {
      logger.warn(
        `[Sprite Designer] Metadata retry failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  logger.info(
    `[Sprite Designer] Design complete: ${totalToolCalls} tool calls, ${filesCreated.length} files created/modified`,
  );
  if (metadata) {
    logger.info(
      `[Sprite Designer] Metadata: ${metadata.speciesName} ${metadata.typing} v${metadata.version}${metadata.isIteration ? ` (iteration of #${metadata.existingIssueNumber ?? "?"})` : ""}`,
    );
  } else {
    logger.warn(
      "[Sprite Designer] No sprite-metadata block found in report — the runner will not be able to post a sprite-feedback issue for this sprite.",
    );
  }

  return {
    spriteReport: finalReport,
    filesCreated,
    toolCallCount: totalToolCalls,
    tokenUsage: totalTokenUsage,
    actions: allActions,
    metadata,
  };
}

/**
 * Focused prompt used as a retry pass when the Sprite Designer forgot to emit
 * (or malformed) the `sprite-metadata` block. Asks only for the block — no
 * file edits, no re-design work.
 */
function buildMetadataRetryPrompt(
  previousReport: string,
  iterationContext?: SpriteIterationContext,
): string {
  const exampleBlock = iterationContext
    ? `\`\`\`sprite-metadata
{"speciesName": "${iterationContext.speciesName}", "typing": "<REPLACE WITH TYPING FROM YOUR REPORT>", "version": ${iterationContext.nextVersion}, "isIteration": true, "existingIssueNumber": ${iterationContext.existingIssueNumber}}
\`\`\``
    : `\`\`\`sprite-metadata
{"speciesName": "<base species name, no 'Hoenn' prefix>", "typing": "<type line>", "version": 1, "isIteration": false}
\`\`\``;

  return `You previously ran as the Sprite Designer and produced this report:

---
${previousReport.slice(-4000)}
---

The report is missing (or has a malformed) \`sprite-metadata\` JSON block. The runner cannot post the sprite-feedback GitHub issue without it, so the community will never see your work.

Your ONLY job right now is to output a single valid \`sprite-metadata\` block that describes the sprite you already created. Do NOT re-edit any files. Do NOT re-analyze the sprites.

Output format — copy this exactly, filling in the values based on the report above:

${exampleBlock}

Rules:
- \`speciesName\` is the BASE species name, no "Hoenn" prefix.
- \`typing\` is the full type line (e.g. "Ghost/Rock" or "Water").
- \`version\` is an integer (1 for fresh, 2+ for iterations).
- \`isIteration\` is true for iteration rounds, false for fresh sprites.
- When \`isIteration\` is true, \`existingIssueNumber\` is REQUIRED.

Respond with just the fenced \`sprite-metadata\` block. No prose.`;
}

/**
 * Extract a `sprite-metadata` fenced JSON block from the Sprite Designer's
 * report. Returns null (and logs a warning) if the block is missing, malformed,
 * or fails validation — the cycle still completes, but no feedback issue is
 * posted.
 */
export function parseSpriteFeedbackMetadata(
  report: string,
): SpriteFeedbackMetadata | null {
  const match = report.match(/```sprite-metadata\s*\n([\s\S]*?)\n```/);
  if (!match) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[1]);
  } catch (err) {
    logger.warn(
      `[Sprite Designer] sprite-metadata block is not valid JSON: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
  if (!parsed || typeof parsed !== "object") {
    logger.warn("[Sprite Designer] sprite-metadata block is not an object");
    return null;
  }
  const m = parsed as Record<string, unknown>;
  if (
    typeof m.speciesName !== "string" ||
    typeof m.typing !== "string" ||
    typeof m.version !== "number" ||
    typeof m.isIteration !== "boolean"
  ) {
    logger.warn(
      "[Sprite Designer] sprite-metadata block missing required fields (speciesName, typing, version, isIteration)",
    );
    return null;
  }
  if (m.isIteration && typeof m.existingIssueNumber !== "number") {
    logger.warn(
      "[Sprite Designer] sprite-metadata marks isIteration=true but existingIssueNumber is missing",
    );
    return null;
  }
  return {
    speciesName: m.speciesName,
    typing: m.typing,
    version: m.version,
    isIteration: m.isIteration,
    existingIssueNumber:
      typeof m.existingIssueNumber === "number"
        ? m.existingIssueNumber
        : undefined,
  };
}

function buildSpriteDesignerPrompt(
  objective: string,
  brief: string,
  implementationPlan: string,
  iterationContext?: SpriteIterationContext,
): string {
  const iterationContextSection = iterationContext
    ? `
## Iteration Context (from the runner)

**This is an iteration on an existing sprite-feedback issue.** The Producer flagged this cycle as a feedback round, and the runner has resolved the exact issue number for you so you don't have to guess.

- **Base species**: ${iterationContext.speciesName}
- **Existing sprite-feedback issue**: #${iterationContext.existingIssueNumber}
- **This iteration's version number**: v${iterationContext.nextVersion}

When you emit the required \`sprite-metadata\` block below, use EXACTLY these values:
- \`speciesName\`: \`"${iterationContext.speciesName}"\`
- \`version\`: \`${iterationContext.nextVersion}\`
- \`isIteration\`: \`true\`
- \`existingIssueNumber\`: \`${iterationContext.existingIssueNumber}\`

Fill in \`typing\` from the brief. Do not invent a different issue number or version.
`
    : "";

  return `You are the **Sprite Designer** for a Pokémon Emerald ROM hack called Legends of Hoenn.

Your job: create or iterate on regional form sprites based on the Producer's brief. You produce the sprite FILES (PNGs and PAL files) — the implementation agent will handle species registration in the codebase.

## Your Brief
${brief}

## Cycle Objective
${objective}

## Implementation Context
The Producer has outlined these implementation steps. Your sprite work feeds into this plan:
${implementationPlan}
${iterationContextSection}

## Your Capabilities

You work **programmatically** — you can't draw freehand, but you CAN:
1. **Recolor sprites** by editing JASC-PAL palette files and applying them to PNGs via Pillow
2. **Add pixel accents** by writing Python scripts that stamp glyphs (lightning bolts, ice crystals, flame patterns) onto sprite canvases
3. **Remap palette indices** to change which colors map to which body parts
4. **View your own work** — after modifying a sprite, \`Read\` the PNG file to visually assess the result (you are multimodal)
5. **Fetch base sprites** using the \`fetch_pokemon_sprites\` MCP tool

## Sprite Format Constraints (GBA)

- **Dimensions**: 64×64 pixels (front/back), 64×128 (anim_front, 2 frames stacked), 32×64 (icon, 2 frames), 16×16 (footprint)
- **Color mode**: 4-bit indexed (16 palette entries max)
- **Palette**: JASC-PAL format text file. Entry 0 = background (transparent). Entry 15 = outline (usually black 16 16 16)
- **Critical**: The \`.pal\` file is what the GBA uses in-game. The PNG also has an embedded palette — you must update BOTH.

## Workflow

### For Fresh Sprites (new regional form)

1. **Fetch base sprites**: Use \`fetch_pokemon_sprites(name)\` to download the base species' sprites
2. **Create variant directory**: \`pokeemerald/graphics/pokemon/<name>_hoenn/\`
3. **Copy base sprites**: Copy all PNGs from the base species directory to the variant directory
4. **Analyse the base palette**: Read \`normal.pal\`, then run a pixel map analysis to understand which palette indices map to which body parts:
\`\`\`python
from PIL import Image
img = Image.open("front.png")
px = img.load()
counts = {}
for y in range(img.height):
    for x in range(img.width):
        counts.setdefault(px[x,y], []).append((x,y))
for idx in sorted(counts):
    print(f"[{idx:2d}] {len(counts[idx]):4d} pixels")
\`\`\`
5. **Design the new palette**: Map type → color family (see reference table). Be AGGRESSIVE with color shifts — subtle changes are invisible at 64×64.
6. **Write new .pal files**: Both \`normal.pal\` and \`shiny.pal\` in JASC-PAL format
7. **Apply palette to PNGs**: Use Pillow to update the embedded PNG palettes:
\`\`\`python
from PIL import Image

def apply_pal_to_png(png_path, pal_colors):
    """pal_colors: list of 16 (R,G,B) tuples from the .pal file."""
    img = Image.open(png_path)
    old = img.getpalette()
    new = list(old)
    for i, (r, g, b) in enumerate(pal_colors):
        new[i*3], new[i*3+1], new[i*3+2] = r, g, b
    img.putpalette(new)
    img.save(png_path)

# Apply to: front.png, back.png, anim_front.png, icon.png
# Do NOT apply to footprint.png (1-bit monochrome, no palette)
\`\`\`
8. **Add pixel accents** (optional): Stamp type-specific glyphs on body canvas areas
9. **Self-review**: \`Read\` each modified PNG. Check: Are the colors distinct from the original? Are accents visible? Does the overall impression match the target type?
10. **Write sprite report**: Document what you did, what techniques worked, and what the community should look for

### For Iteration Sprites (community feedback round)

1. **Read the feedback** from the brief — the Producer includes specific community comments
2. **Read the current sprites**: View the existing variant PNGs and .pal files
3. **Interpret the feedback**: What specific changes are being asked for? Map feedback to actionable palette/pixel changes
4. **Make targeted modifications**: Only change what the feedback addresses — don't redo everything
5. **Self-review**: View the updated sprites and compare mentally to the feedback
6. **Write iteration report**: Document what changed and why, referencing the specific feedback addressed

## Pixel Accent Techniques

| Technique | How | Quality |
|-----------|-----|---------|
| **Glyph stamping** | Design small shapes (bolts, crystals) as coordinate lists; place on body canvas areas | Good — clearly visible |
| **Index repurposing** | Change a low-usage palette index to an accent color; existing pixels change automatically | Excellent — free detail |
| **Edge emanations** | Find outline pixels with background beside them; place accent pixels beyond the silhouette | Decent — adds dynamism |
| **Palette index remapping** | Change which index specific pixels use (swap stripe→body color) | Good for pattern changes |

**What doesn't work well** (avoid these):
- Organic silhouette changes (reshaping manes, adding appendages) — looks wrong
- Freeform pixel painting without a plan — can't preview the aesthetic result reliably
- Very subtle changes — invisible at 64×64; be bold

## Palette Design Reference

| Type | Dominant Color | RGB Range | Key Principle |
|------|---------------|-----------|---------------|
| Electric | Saturated yellow/gold | R:190-255, G:155-236, B:0-10 | Push blue to near-zero |
| Fire | Orange/red | R:200-255, G:60-140, B:0-50 | High red, low blue |
| Ice | Light blue/white | R:150-220, G:200-240, B:230-255 | High blue, moderate R+G |
| Water | Deep blue | R:40-100, G:100-180, B:180-255 | Low red, high blue |
| Grass | Green | R:60-150, G:180-230, B:50-120 | Green dominant |
| Poison | Purple | R:140-200, G:50-120, B:160-220 | High R+B, low G |
| Ghost | Dark purple | R:80-140, G:50-100, B:120-180 | Muted, desaturated |
| Steel | Silver/chrome | R:170-210, G:170-210, B:180-220 | Nearly equal channels |
| Dragon | Deep indigo | R:80-130, G:60-110, B:160-220 | Blue-shifted purple |
| Dark | Near-black/maroon | R:40-90, G:20-50, B:20-50 | Very low values |

## Memory

Read \`memory/sprite-knowledge.md\` for accumulated sprite techniques and community feedback patterns from previous iterations. **Update this file** after completing your work — record what techniques you used, what worked, and any new insights.

Read \`memory/sprite-iterations.md\` to check the version history for the species you're working on.

Read \`memory/regional-variant-pipeline.md\` for the full technical pipeline reference.

## Output

End your work with a clear **Sprite Report** section that includes:
1. **Species**: Which regional form was created/iterated
2. **Version**: v1, v2, etc.
3. **Files created/modified**: List every file path
4. **Techniques used**: What palette changes, pixel edits, etc.
5. **Self-assessment**: What looks good, what might need community feedback
6. **Feedback questions**: 2-3 specific questions for the community (e.g., "Does the gold read as Electric or just yellow?", "Are the lightning glyph accents visible enough?")

This report will be posted to a GitHub issue for community feedback.

### Required: sprite-metadata block

After the Sprite Report, you MUST end your output with a fenced JSON block tagged \`sprite-metadata\`. The runner parses this block to create the sprite-feedback GitHub issue — without it, the community never sees your work.

For a fresh sprite:
\`\`\`sprite-metadata
{"speciesName": "Corsola", "typing": "Ghost/Rock", "version": 1, "isIteration": false}
\`\`\`

For an iteration on an existing sprite-feedback issue, use the \`existingIssueNumber\` and \`version\` from the **Iteration Context** section above (the runner injects them for you). Example:
\`\`\`sprite-metadata
{"speciesName": "Arcanine", "typing": "Water/Fire", "version": 2, "isIteration": true, "existingIssueNumber": 142}
\`\`\`

**Rules for the metadata block:**
- \`speciesName\` is the BASE species name with no region prefix — e.g. \`"Corsola"\`, not \`"Hoenn Corsola"\` or \`"Corsola Hoenn"\`. The issue helper adds the "Hoenn" prefix automatically.
- \`typing\` is the type line exactly as it should appear in the issue title, e.g. \`"Ghost/Rock"\` or \`"Water"\` (single type).
- \`version\` is an integer. v1 for a fresh sprite, v2+ for iterations.
- \`isIteration\` is \`true\` only when you're refining an existing sprite based on community feedback quoted in your brief. Otherwise \`false\`.
- When \`isIteration\` is \`true\`, \`existingIssueNumber\` is required and must match the sprite-feedback issue number from your brief.

The block must be the LAST fenced code block in your output.`;
}
