/**
 * GitHub integration for Agent Oak — v2 stub.
 *
 * In v2, Agent Oak will:
 * - Read issues labeled "suggestion" or "trainer-tip" for community ideas
 * - Open issues labeled "agent-help-request" when it needs human guidance
 */

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  labels: string[];
  state: "open" | "closed";
  createdAt: string;
}

export interface GitHubComment {
  id: number;
  body: string;
  author: string;
  createdAt: string;
}

/** Fetch issues with community suggestions (v2) */
export async function fetchSuggestions(): Promise<GitHubIssue[]> {
  throw new Error("GitHub integration not implemented yet — planned for v2");
}

/** Open a help request issue on GitHub (v2) */
export async function openHelpRequest(_title: string, _body: string): Promise<number> {
  throw new Error("GitHub integration not implemented yet — planned for v2");
}
