import { describe, it, expect } from "vitest";
import { digestJournal, formatTokenUsage } from "./writer.js";

const JOURNAL = `# Cycle 0307

**Date**: 2026-05-01T05:50:16.981Z  
**Mode**: feature  
**Objective**: Register Toxapex and add it to Juan's rematch teams  

## Reasoning

${"Long advisor reasoning. ".repeat(200)}

## Community Issues

### Issue Actions

- **#180** — accept: Toxapex ships on Juan's rematch teams this cycle.

## Files Modified

- pokeemerald/src/data/trainer_parties.h

## Build Result

**Result**: ✅ SUCCESS

## Summary

Toxapex joined Juan's team. [REVERTED: build could not be fixed]

## Plan Output

## Champion Redesign — Steven Returns

Plan details.

## Reflection

## Reflection on Cycle 307

Reflection body.

## Next Steps

Bring Steven's design to life.

## Stats

- Tool calls: 89
`;

describe("digestJournal", () => {
  const digest = digestJournal(JOURNAL);

  it("keeps the title, mode, and objective", () => {
    expect(digest).toContain("**Cycle 0307**");
    expect(digest).toContain("**Mode**: feature");
    expect(digest).toContain("**Objective**: Register Toxapex and add it to Juan's rematch teams");
    expect(digest).not.toContain("**Date**");
  });

  it("keeps the outcome sections that sit past the long reasoning", () => {
    expect(digest).toContain("[REVERTED: build could not be fixed]");
    expect(digest).toContain("Bring Steven's design to life.");
    expect(digest).toContain("**Result**: ✅ SUCCESS");
    expect(digest).toContain("#180");
  });

  it("drops reasoning, file lists, plan output, reflection, and stats", () => {
    expect(digest).not.toContain("Long advisor reasoning");
    expect(digest).not.toContain("trainer_parties.h");
    expect(digest).not.toContain("Plan details.");
    expect(digest).not.toContain("Reflection body.");
    expect(digest).not.toContain("Tool calls");
  });

  it("orders the summary before the next steps", () => {
    expect(digest.indexOf("**Summary**")).toBeLessThan(digest.indexOf("**Next Steps**"));
  });
});

describe("formatTokenUsage", () => {
  it("breaks the total down by billing category", () => {
    expect(formatTokenUsage({
      inputTokens: 1_204,
      cacheWriteTokens: 412_000,
      cacheReadTokens: 14_491_394,
      outputTokens: 116_971,
      totalTokens: 15_021_569,
    })).toBe("15,021,569 (input: 1,204, cache write: 412,000, cache read: 14,491,394, output: 116,971)");
  });
});
