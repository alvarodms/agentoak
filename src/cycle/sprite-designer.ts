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

export interface SpriteDesignResult {
  /** Report of what was created/modified, techniques used, notes for community */
  spriteReport: string;
  /** List of sprite files created or modified */
  filesCreated: string[];
  /** Number of tool calls made during design */
  toolCallCount: number;
  /** Token usage for this phase */
  tokenUsage: TokenUsage;
  /** Structured metadata parsed from the agent's report. Null when the agent
   *  omitted or malformed the sprite-metadata block — the runner logs a warning
   *  in that case and skips the feedback issue. */
  metadata: SpriteFeedbackMetadata | null;
}

const SPRITE_DESIGNER_MAX_TURNS = 80;

/** Self-review CLI (critic, previews, index dump, ramps); run from the project root. */
const SPRITEKIT = "npx tsx src/sprite-tools/spritekit.ts";
export const SPRITE_DESIGNER_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

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
  options: { timeout?: number } = {},
): Promise<SpriteDesignResult> {
  const prompt = buildSpriteDesignerPrompt(objective, brief, implementationPlan);

  logger.info("[Sprite Designer] Starting sprite design phase...");
  logger.info(`[Sprite Designer] Brief: ${brief.slice(0, 200)}${brief.length > 200 ? "..." : ""}`);

  const result = await runClaudeCode(prompt, {
    phase: "sprite-designer",
    maxTurns: SPRITE_DESIGNER_MAX_TURNS,
    timeout: options.timeout ?? SPRITE_DESIGNER_TIMEOUT_MS,
    tools: SPRITE_DESIGNER_TOOLS,
    model: process.env.ANTHROPIC_MODEL,
  });

  const rawReport = result.narrativeText || result.resultText || "";

  if (!rawReport.trim()) {
    throw new Error("Sprite Designer produced no output");
  }

  // Extract file paths from the result's modified files list
  const filesCreated = result.filesModified.filter(
    (f) => f.includes("graphics/pokemon/") || f.endsWith(".py"),
  );

  // Parse metadata from raw report BEFORE stripping, then extract clean report
  const metadata = parseSpriteFeedbackMetadata(rawReport);
  const spriteReport = extractSpriteReport(rawReport);

  logger.info(
    `[Sprite Designer] Design complete: ${result.toolCallCount} tool calls, ${filesCreated.length} files created/modified`,
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
    spriteReport,
    filesCreated,
    toolCallCount: result.toolCallCount,
    tokenUsage: result.tokenUsage,
    metadata,
  };
}

/** Regex matching the ```sprite-metadata``` fenced block. */
const SPRITE_METADATA_BLOCK_RE = /```sprite-metadata\s*\n[\s\S]*?\n```/;

/**
 * Remove the ```sprite-metadata``` fenced block from a sprite report string.
 */
export function stripSpriteMetadataBlock(report: string): string {
  return report.replace(SPRITE_METADATA_BLOCK_RE, "").trimEnd();
}

/**
 * Extract the clean "Sprite Report" section from the full agent narrative.
 *
 * The Sprite Designer is instructed to end its output with a "## Sprite Report"
 * section. This function finds that header and returns content from there up to
 * the sprite-metadata block (exclusive) or end of text.
 *
 * Falls back to stripping just the metadata block when no header is found.
 */
export function extractSpriteReport(rawReport: string): string {
  const headerMatch = rawReport.match(/^(#{1,4}\s+Sprite Report.*)/im);
  if (!headerMatch) {
    return stripSpriteMetadataBlock(rawReport);
  }
  const headerIndex = rawReport.indexOf(headerMatch[0]);
  const afterHeader = rawReport.slice(headerIndex);

  const metaBlockIndex = afterHeader.search(/```sprite-metadata\s*\n/);
  if (metaBlockIndex !== -1) {
    return afterHeader.slice(0, metaBlockIndex).trimEnd();
  }
  return stripSpriteMetadataBlock(afterHeader);
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
): string {
  return `You are the **Sprite Designer** for a Pokémon Emerald ROM hack called Legends of Hoenn.

Your job: create or iterate on regional form sprites based on the Producer's brief. You produce the sprite FILES (PNGs and PAL files) — the implementation agent will handle species registration in the codebase.

## Your Brief
${brief}

## Cycle Objective
${objective}

## Implementation Context
The Producer has outlined these implementation steps. Your sprite work feeds into this plan:
${implementationPlan}

## Your Capabilities

You work **programmatically** — you can't draw freehand, but you CAN:
1. **Recolor sprites** by editing JASC-PAL palette files and applying them to PNGs via Pillow
2. **Add pixel accents** by writing Python scripts that stamp glyphs (lightning bolts, ice crystals, flame patterns) onto sprite canvases
3. **Remap palette indices** to change which colors map to which body parts
4. **Review your own work with \`spritekit\`** — upscaled comparison previews you \`Read\`, a pixel critic, an index dump with rulers, and hue-shifted ramps (see below). Never judge a sprite from the raw 64×64 PNG: at 1× it is too small to see stray pixels or flat shading.
5. **Fetch base sprites** using the \`fetch_pokemon_sprites\` MCP tool (optional \`output_dir\` to write straight into a regional form folder)

## Sprite Format Constraints (GBA)

- **Dimensions**: 64×64 pixels (front/back), 64×128 (anim_front, 2 frames stacked), 32×64 (icon, 2 frames), 16×16 (footprint)
- **Color mode**: 4-bit indexed (16 palette entries max)
- **Palette**: JASC-PAL format text file. Entry 0 = background (transparent). Entry 15 = outline (usually black 16 16 16)
- **Critical**: The \`.pal\` file is what the GBA uses in-game. The PNG also has an embedded palette — you must update BOTH.

## Workflow

### For Fresh Sprites (new regional form)

1. **Fetch base sprites into the regional folder**: Call \`fetch_pokemon_sprites\` with \`name\` = expansion-repo folder for the **base** species (e.g. \`corsola\`) and \`output_dir\` = your variant under \`graphics/pokemon/\` (e.g. \`corsola_hoenn\`). The tool creates the directory if needed and writes all sprite files there — no separate copy from the base folder.
2. **Analyse the base palette**: Read \`normal.pal\`, then run a pixel map analysis to understand which palette indices map to which body parts:
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
3. **Design the new palette**: Pick an anchor color per material from the type table, then build each material's shades with \`${SPRITEKIT} ramp <anchor> --n <shades>\` and assign them to the base's indices for that material in the same dark→light order. Be AGGRESSIVE with color shifts — subtle changes are invisible at 64×64.
4. **Write new .pal files**: Both \`normal.pal\` and \`shiny.pal\` in JASC-PAL format
5. **Apply palette to PNGs**: Use Pillow to update the embedded PNG palettes:
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
6. **Add pixel accents** (optional): Stamp type-specific glyphs on body canvas areas
7. **Self-review** (see "Self-Review Gate" below): preview, critique, lint, fix, repeat until lint passes.
8. **Write sprite report**: Document what you did, what techniques worked, and what the community should look for

### For Iteration Sprites (community feedback round)

1. **Read the feedback** from the brief — the Producer includes specific community comments
2. **Read the current sprites**: View the existing variant PNGs and .pal files
3. **Interpret the feedback**: What specific changes are being asked for? Map feedback to actionable palette/pixel changes
4. **Make targeted modifications**: Only change what the feedback addresses — don't redo everything
5. **Self-review**: Run the Self-Review Gate below; in the preview, check each feedback point against the base and previous look
6. **Write iteration report**: Document what changed and why, referencing the specific feedback addressed

## spritekit

\`<variant>\` is a folder name under \`pokeemerald/graphics/pokemon\` (e.g. \`corsola_hoenn\`); the base defaults to the same name without \`_hoenn\`.

| Command | What it gives you |
|---------|-------------------|
| \`${SPRITEKIT} preview <variant>\` | Writes a PNG to \`Read\`: rows = front, back, each anim_front frame; columns = base, variant (normal.pal), variant (shiny.pal); 5× zoom, pixel grid (stronger every 8 px), checkerboard transparency, stray pixels boxed magenta, jaggies cyan |
| \`${SPRITEKIT} lint <variant>\` | The critic: stray-pixel noise and doubled corners in 1-px lines compared with the base, pillow shading, used colors the GBA's 15-bit color can't tell apart, PNG palettes that disagree with normal.pal. Prints coordinates; exits 1 on FAIL |
| \`${SPRITEKIT} ascii <png> [--frame 2] [--region x,y,w,h]\` | Palette indices as hex digits (\`.\` = transparent) with x/y rulers. Use it to find exact coordinates before a pixel edit and to verify the edit after — cheaper and more precise than an image |
| \`${SPRITEKIT} ramp <#rrggbb or r,g,b> [--n 5] [--shift 24] [--spread 0.56]\` | A hue-shifted dark→light ramp as JASC-PAL lines: shadows rotate toward blue-violet and get more saturated, lights rotate toward warm yellow and paler. Lower \`--shift\` for subtle materials (stone, steel), lower \`--spread\` for low-contrast ones |

## Self-Review Gate

Before writing the report:
1. Run \`preview\` and \`Read\` the sheet. Judge the variant against the base: does the silhouette read, does the type read, does the shading still come from one direction (top-left in Gen 3), are accents visible, does the shiny hold up?
2. Run \`lint\` and fix every FAIL:
   - **stray pixels / jaggies**: \`ascii\` the region, then merge each flagged pixel into a neighboring color, group it into a shape, or remove the doubled corner. Accent glyphs and emanations are the usual source.
   - **near-duplicate colors**: they waste one of 15 usable slots and flatten the shading. Re-derive that material's ramp or merge the indices and free a slot for an accent. (Identical entries that the other palette splits apart are allowed: that is a deliberate normal/shiny split.)
   - **embedded palette differs from normal.pal**: apply the .pal to that PNG (back.png is the one usually missed).
3. Repeat until \`lint\` prints \`RESULT: PASS\`. If a FAIL is intentional (e.g. a deliberate sparkle texture), say which one and why in the report.

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
- Brightness-only ramps (one hue, lighter and darker) — they read flat and washed out; use \`ramp\`

## Palette Design Reference

Anchor colors are the mid shade of a material's ramp; feed them to \`ramp\`. Each material gets 3–5 shades, and the darkest shade of each ramp should stay clearly lighter than the outline.

| Type | Anchor | Type | Anchor | Type | Anchor |
|------|--------|------|--------|------|--------|
| Electric | #e6c805 gold | Ghost | #6e4b96 dusk purple | Psychic | #e8508c pink |
| Fire | #e66419 orange | Steel | #a8b4c8 cool silver | Fighting | #b8402c brick |
| Ice | #8cc8f0 pale blue | Dragon | #6955be indigo | Rock | #a8905a sandstone |
| Water | #468cdc blue | Dark | #4b2d37 maroon | Ground | #c8a050 ochre |
| Grass | #69cd55 green | Fairy | #f0a0d0 rose | Bug | #98b820 lime |
| Poison | #aa55be purple | Normal | #b8b090 beige | Flying | #98a8f0 sky |

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
5. **Self-assessment**: What looks good, what might need community feedback, and the final \`lint\` result (PASS, or each remaining FAIL with why it stays)
6. **Feedback questions**: 2-3 specific questions for the community (e.g., "Does the gold read as Electric or just yellow?", "Are the lightning glyph accents visible enough?")

This report will be posted to a GitHub issue for community feedback.

### Required: sprite-metadata block

After the Sprite Report, you MUST end your output with a fenced JSON block tagged \`sprite-metadata\`. The runner parses this block to create the sprite-feedback GitHub issue — without it, the community never sees your work.

For a fresh sprite:
\`\`\`sprite-metadata
{"speciesName": "Corsola", "typing": "Ghost/Rock", "version": 1, "isIteration": false}
\`\`\`

For an iteration on an existing sprite-feedback issue (read the existing issue number from your brief — the Producer includes it when quoting community feedback):
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
