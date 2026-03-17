/**
 * Lightweight fluent builder for composing prompts from reusable sections.
 *
 * Usage:
 *   const prompt = new PromptBuilder()
 *     .heading("Objective", "Fix the build")
 *     .sectionIf(hasIssues, () => formatIssues(issues))
 *     .list("Guidelines", ["Read first", "Edit second"])
 *     .build();
 */
export class PromptBuilder {
  private sections: string[] = [];

  /** Append a markdown heading with a body. Level defaults to 2 (##). */
  heading(title: string, body: string, level: number = 2): this {
    const prefix = "#".repeat(level);
    this.sections.push(`${prefix} ${title}\n\n${body}`);
    return this;
  }

  /** Conditionally append content — only added when condition is truthy. */
  sectionIf(condition: unknown, contentFn: () => string): this {
    if (condition) {
      this.sections.push(contentFn());
    }
    return this;
  }

  /** Append raw text with no heading wrapper. */
  raw(text: string): this {
    this.sections.push(text);
    return this;
  }

  /** Append a bulleted list under a heading. */
  list(title: string, items: string[], level: number = 2): this {
    const prefix = "#".repeat(level);
    this.sections.push(
      `${prefix} ${title}\n\n${items.map((i) => `- ${i}`).join("\n")}`,
    );
    return this;
  }

  /** Render all accumulated sections into a single string separated by double newlines. */
  build(): string {
    return this.sections.join("\n\n").trim();
  }
}
