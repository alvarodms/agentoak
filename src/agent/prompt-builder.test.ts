import { describe, it, expect } from "vitest";
import { PromptBuilder } from "./prompt-builder.js";

describe("PromptBuilder", () => {
  it("builds empty string from empty builder", () => {
    expect(new PromptBuilder().build()).toBe("");
  });

  it("creates heading with default level 2", () => {
    const result = new PromptBuilder().heading("Title", "Body text").build();
    expect(result).toBe("## Title\n\nBody text");
  });

  it("creates heading with custom level", () => {
    const result = new PromptBuilder().heading("Title", "Body", 3).build();
    expect(result).toBe("### Title\n\nBody");
  });

  it("creates heading with level 1", () => {
    const result = new PromptBuilder().heading("Title", "Body", 1).build();
    expect(result).toBe("# Title\n\nBody");
  });

  it("includes content when sectionIf condition is truthy", () => {
    const result = new PromptBuilder().sectionIf(true, () => "included").build();
    expect(result).toBe("included");
  });

  it("excludes content when sectionIf condition is falsy (false)", () => {
    const result = new PromptBuilder().sectionIf(false, () => "excluded").build();
    expect(result).toBe("");
  });

  it("excludes content when sectionIf condition is null", () => {
    const result = new PromptBuilder().sectionIf(null, () => "excluded").build();
    expect(result).toBe("");
  });

  it("excludes content when sectionIf condition is undefined", () => {
    const result = new PromptBuilder().sectionIf(undefined, () => "excluded").build();
    expect(result).toBe("");
  });

  it("excludes content when sectionIf condition is 0", () => {
    const result = new PromptBuilder().sectionIf(0, () => "excluded").build();
    expect(result).toBe("");
  });

  it("excludes content when sectionIf condition is empty string", () => {
    const result = new PromptBuilder().sectionIf("", () => "excluded").build();
    expect(result).toBe("");
  });

  it("includes content when sectionIf condition is non-empty string", () => {
    const result = new PromptBuilder().sectionIf("yes", () => "included").build();
    expect(result).toBe("included");
  });

  it("appends raw text verbatim", () => {
    const result = new PromptBuilder().raw("some raw text").build();
    expect(result).toBe("some raw text");
  });

  it("creates bulleted list under heading", () => {
    const result = new PromptBuilder().list("Items", ["A", "B", "C"]).build();
    expect(result).toBe("## Items\n\n- A\n- B\n- C");
  });

  it("creates bulleted list with custom level", () => {
    const result = new PromptBuilder().list("Items", ["X"], 3).build();
    expect(result).toBe("### Items\n\n- X");
  });

  it("creates numbered list under heading", () => {
    const result = new PromptBuilder().numberedList("Steps", ["First", "Second"]).build();
    expect(result).toBe("## Steps\n\n1. First\n2. Second");
  });

  it("creates numbered list with custom level", () => {
    const result = new PromptBuilder().numberedList("Steps", ["Only"], 4).build();
    expect(result).toBe("#### Steps\n\n1. Only");
  });

  it("joins multiple sections with double newlines", () => {
    const result = new PromptBuilder()
      .heading("One", "Body1")
      .raw("Middle")
      .heading("Two", "Body2")
      .build();
    expect(result).toBe("## One\n\nBody1\n\nMiddle\n\n## Two\n\nBody2");
  });

  it("supports fluent chaining (all methods return this)", () => {
    const builder = new PromptBuilder();
    const r1 = builder.heading("T", "B");
    const r2 = builder.sectionIf(true, () => "x");
    const r3 = builder.raw("y");
    const r4 = builder.list("L", ["a"]);
    const r5 = builder.numberedList("N", ["b"]);
    expect(r1).toBe(builder);
    expect(r2).toBe(builder);
    expect(r3).toBe(builder);
    expect(r4).toBe(builder);
    expect(r5).toBe(builder);
  });
});
