import { describe, it, expect } from "vitest";
import { parseSpriteFeedbackMetadata } from "./sprite-designer.js";

describe("parseSpriteFeedbackMetadata", () => {
  it("parses a valid fresh-sprite metadata block", () => {
    const report = `# Sprite Report

Did the sprite work. It looks great.

\`\`\`sprite-metadata
{"speciesName": "Corsola", "typing": "Ghost/Rock", "version": 1, "isIteration": false}
\`\`\`
`;
    const meta = parseSpriteFeedbackMetadata(report);
    expect(meta).toEqual({
      speciesName: "Corsola",
      typing: "Ghost/Rock",
      version: 1,
      isIteration: false,
      existingIssueNumber: undefined,
    });
  });

  it("parses a valid iteration metadata block with existingIssueNumber", () => {
    const report = `
Sprite iteration complete.

\`\`\`sprite-metadata
{"speciesName": "Corsola", "typing": "Ghost/Rock", "version": 2, "isIteration": true, "existingIssueNumber": 116}
\`\`\`
`;
    const meta = parseSpriteFeedbackMetadata(report);
    expect(meta).toEqual({
      speciesName: "Corsola",
      typing: "Ghost/Rock",
      version: 2,
      isIteration: true,
      existingIssueNumber: 116,
    });
  });

  it("returns null when the metadata block is missing (cycle 204 regression)", () => {
    const report = `# Sprite Report

Made a lovely new sprite but forgot to emit the metadata block.
`;
    expect(parseSpriteFeedbackMetadata(report)).toBeNull();
  });

  it("returns null when the metadata block is not valid JSON", () => {
    const report = `
\`\`\`sprite-metadata
{speciesName: Corsola, typing: Ghost/Rock}
\`\`\`
`;
    expect(parseSpriteFeedbackMetadata(report)).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    const report = `
\`\`\`sprite-metadata
{"speciesName": "Corsola", "typing": "Ghost/Rock"}
\`\`\`
`;
    expect(parseSpriteFeedbackMetadata(report)).toBeNull();
  });

  it("returns null when isIteration=true but existingIssueNumber is missing", () => {
    const report = `
\`\`\`sprite-metadata
{"speciesName": "Corsola", "typing": "Ghost/Rock", "version": 2, "isIteration": true}
\`\`\`
`;
    expect(parseSpriteFeedbackMetadata(report)).toBeNull();
  });

  it("returns null when the block is not an object", () => {
    const report = `
\`\`\`sprite-metadata
"not an object"
\`\`\`
`;
    expect(parseSpriteFeedbackMetadata(report)).toBeNull();
  });
});
