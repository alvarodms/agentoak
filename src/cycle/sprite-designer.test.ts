import { describe, it, expect } from "vitest";
import { stripSpriteMetadataBlock, extractSpriteReport, parseSpriteFeedbackMetadata } from "./sprite-designer.js";

describe("stripSpriteMetadataBlock", () => {
  it("removes the sprite-metadata fenced block", () => {
    const input = `Some report text\n\n\`\`\`sprite-metadata\n{"speciesName":"Corsola"}\n\`\`\``;
    expect(stripSpriteMetadataBlock(input)).toBe("Some report text");
  });

  it("returns the report unchanged when no metadata block exists", () => {
    const input = "Just a plain report with no metadata";
    expect(stripSpriteMetadataBlock(input)).toBe(input);
  });

  it("handles metadata block with extra whitespace after tag", () => {
    const input = `Report\n\n\`\`\`sprite-metadata  \n{"key":"val"}\n\`\`\`\n`;
    expect(stripSpriteMetadataBlock(input)).toBe("Report");
  });

  it("handles multiline JSON in metadata block", () => {
    const input = `Report\n\n\`\`\`sprite-metadata\n{\n  "speciesName": "Corsola",\n  "typing": "Ghost/Rock"\n}\n\`\`\``;
    expect(stripSpriteMetadataBlock(input)).toBe("Report");
  });
});

describe("extractSpriteReport", () => {
  it("extracts the Sprite Report section and stops before metadata block", () => {
    const input = [
      "Working notes: analysed palette...",
      "Python output: [0] 200 pixels",
      "",
      "## Sprite Report",
      "",
      "**Species**: Corsola",
      "**Version**: v1",
      "",
      "```sprite-metadata",
      '{"speciesName":"Corsola","typing":"Ghost/Rock","version":1,"isIteration":false}',
      "```",
    ].join("\n");

    const result = extractSpriteReport(input);
    expect(result).toContain("## Sprite Report");
    expect(result).toContain("**Species**: Corsola");
    expect(result).not.toContain("sprite-metadata");
    expect(result).not.toContain("Working notes");
    expect(result).not.toContain("Python output");
  });

  it("handles ### header variant", () => {
    const input = "Noise\n\n### Sprite Report\n\nContent here\n\n```sprite-metadata\n{}\n```";
    const result = extractSpriteReport(input);
    expect(result).toBe("### Sprite Report\n\nContent here");
    expect(result).not.toContain("Noise");
  });

  it("falls back to full text minus metadata when no header found", () => {
    const input = "No header here, just report text\n\n```sprite-metadata\n{}\n```";
    const result = extractSpriteReport(input);
    expect(result).toBe("No header here, just report text");
    expect(result).not.toContain("sprite-metadata");
  });

  it("falls back to full text when neither header nor metadata exists", () => {
    const input = "Plain text report with no structure";
    expect(extractSpriteReport(input)).toBe(input);
  });

  it("handles Sprite Report header at the very start", () => {
    const input = "## Sprite Report\n\nClean report\n\n```sprite-metadata\n{}\n```";
    const result = extractSpriteReport(input);
    expect(result).toBe("## Sprite Report\n\nClean report");
  });

  it("handles Sprite Report header without subsequent metadata block", () => {
    const input = "Noise\n\n## Sprite Report\n\nClean report without metadata";
    const result = extractSpriteReport(input);
    expect(result).toBe("## Sprite Report\n\nClean report without metadata");
  });
});

describe("parseSpriteFeedbackMetadata", () => {
  it("parses valid fresh sprite metadata", () => {
    const input = 'Report\n\n```sprite-metadata\n{"speciesName":"Corsola","typing":"Ghost/Rock","version":1,"isIteration":false}\n```';
    const meta = parseSpriteFeedbackMetadata(input);
    expect(meta).toEqual({
      speciesName: "Corsola",
      typing: "Ghost/Rock",
      version: 1,
      isIteration: false,
      existingIssueNumber: undefined,
    });
  });

  it("parses valid iteration metadata", () => {
    const input = '```sprite-metadata\n{"speciesName":"Arcanine","typing":"Water/Fire","version":2,"isIteration":true,"existingIssueNumber":142}\n```';
    const meta = parseSpriteFeedbackMetadata(input);
    expect(meta).toEqual({
      speciesName: "Arcanine",
      typing: "Water/Fire",
      version: 2,
      isIteration: true,
      existingIssueNumber: 142,
    });
  });

  it("returns null when no metadata block exists", () => {
    expect(parseSpriteFeedbackMetadata("No metadata here")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    const input = "```sprite-metadata\nnot json\n```";
    expect(parseSpriteFeedbackMetadata(input)).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    const input = '```sprite-metadata\n{"speciesName":"Corsola"}\n```';
    expect(parseSpriteFeedbackMetadata(input)).toBeNull();
  });

  it("returns null when isIteration is true but existingIssueNumber missing", () => {
    const input = '```sprite-metadata\n{"speciesName":"Corsola","typing":"Ghost/Rock","version":2,"isIteration":true}\n```';
    expect(parseSpriteFeedbackMetadata(input)).toBeNull();
  });
});
