import type Anthropic from "@anthropic-ai/sdk";

/** All tool definitions for Claude's tool_use API */
export const AGENT_TOOLS: Anthropic.Tool[] = [
  // ── Exploration ──
  {
    name: "read_file",
    description:
      "Read the full contents of a file in the pokeemerald repository. Returns the file content as text. For large files, use read_lines instead.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Relative path from pokeemerald root, e.g. 'src/main.c' or 'include/global.h'",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "read_lines",
    description:
      "Read specific lines from a file (1-indexed, inclusive). Useful for large files or when you know the line range you need.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path from pokeemerald root" },
        start_line: { type: "number", description: "First line to read (1-indexed)" },
        end_line: { type: "number", description: "Last line to read (inclusive)" },
      },
      required: ["path", "start_line", "end_line"],
    },
  },
  {
    name: "list_files",
    description:
      "List files and directories at a given path. Directories end with '/'. Skips build artifacts and hidden files.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Relative directory path from pokeemerald root. Use '' or '.' for the root.",
        },
        max_depth: {
          type: "number",
          description: "Maximum directory depth to traverse (default: 2)",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "search_code",
    description:
      "Search for a text pattern across source files in the repository. Returns matching file, line number, and content.",
    input_schema: {
      type: "object" as const,
      properties: {
        pattern: {
          type: "string",
          description: "Text pattern to search for (literal string, not regex)",
        },
        file_pattern: {
          type: "string",
          description: "Optional glob to narrow file types, e.g. '*.c' or '*.h'",
        },
        max_results: {
          type: "number",
          description: "Maximum results to return (default: 50)",
        },
      },
      required: ["pattern"],
    },
  },
  {
    name: "get_file_info",
    description: "Get metadata about a file: existence, size in bytes, line count, last modified date.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path from pokeemerald root" },
      },
      required: ["path"],
    },
  },

  // ── Editing ──
  {
    name: "write_file",
    description:
      "Write content to a file, creating it if it doesn't exist or overwriting if it does. Creates parent directories as needed.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path from pokeemerald root" },
        content: { type: "string", description: "Full file content to write" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "edit_file",
    description:
      "Find and replace text within an existing file. The search string must exist in the file. All occurrences are replaced.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path from pokeemerald root" },
        search: { type: "string", description: "Exact text to find" },
        replace: { type: "string", description: "Text to replace it with" },
      },
      required: ["path", "search", "replace"],
    },
  },
  {
    name: "insert_lines",
    description: "Insert new lines at a specific position in a file (1-indexed).",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path from pokeemerald root" },
        line_number: { type: "number", description: "Line number to insert before (1-indexed)" },
        text: { type: "string", description: "Text to insert (can be multi-line)" },
      },
      required: ["path", "line_number", "text"],
    },
  },
  {
    name: "delete_file",
    description: "Delete a file from the repository.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path from pokeemerald root" },
      },
      required: ["path"],
    },
  },

  // ── Build ──
  {
    name: "run_build",
    description:
      "Run 'make' to build the ROM. Returns success/failure, exit code, stdout, stderr, and parsed errors. May take several minutes.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },

  // ── Memory ──
  {
    name: "read_memory",
    description:
      "Read a memory file to review accumulated knowledge. Returns the full markdown content.",
    input_schema: {
      type: "object" as const,
      properties: {
        file: {
          type: "string",
          enum: ["codebase-facts", "failure-patterns", "strategy-notes", "project-facts"],
          description: "Which memory file to read",
        },
      },
      required: ["file"],
    },
  },
  {
    name: "update_memory",
    description:
      "Overwrite a memory file with new content. Use this when you want to reorganize or rewrite a memory file. The content should be valid markdown starting with a # heading.",
    input_schema: {
      type: "object" as const,
      properties: {
        file: {
          type: "string",
          enum: ["codebase-facts", "failure-patterns", "strategy-notes", "project-facts"],
          description: "Which memory file to update",
        },
        content: {
          type: "string",
          description: "Full markdown content for the file",
        },
      },
      required: ["file", "content"],
    },
  },
  {
    name: "append_to_memory",
    description:
      "Append a new section to a memory file. Use this to add new facts, patterns, or notes without rewriting the whole file.",
    input_schema: {
      type: "object" as const,
      properties: {
        file: {
          type: "string",
          enum: ["codebase-facts", "failure-patterns", "strategy-notes", "project-facts"],
          description: "Which memory file to append to",
        },
        heading: {
          type: "string",
          description: "Section heading (## level) for the new entry",
        },
        content: {
          type: "string",
          description: "Markdown content for the new section",
        },
      },
      required: ["file", "heading", "content"],
    },
  },

  // ── Cycle control ──
  {
    name: "complete_cycle",
    description:
      "Signal that the current cycle is complete. Call this when you have finished all intended work for this cycle. Provide a summary of what was accomplished and what to consider next.",
    input_schema: {
      type: "object" as const,
      properties: {
        summary: {
          type: "string",
          description: "Brief summary of what was accomplished this cycle",
        },
        next_steps: {
          type: "string",
          description: "Suggestions for what to explore or attempt in the next cycle",
        },
      },
      required: ["summary"],
    },
  },
];
