#!/usr/bin/env node
/**
 * MCP Debug Web UI
 *
 * Spawns one or more MCP servers as child processes, connects to them via
 * the MCP client SDK over stdio, and serves a browser-based tool explorer
 * at http://localhost:3333 (configurable via PORT env var).
 *
 * Usage:
 *   npx tsx src/mcp/debug-ui.ts            # pokedex server (default)
 *   npx tsx src/mcp/debug-ui.ts porymap    # porymap server
 *   npx tsx src/mcp/debug-ui.ts all        # both servers
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? "3555", 10);

const PORYMAP_WRITE_TOOLS = new Set([
  "set_map_properties",
  "add_object_event",
  "add_warp_event",
  "add_bg_event",
  "add_coord_event",
  "remove_event",
  "edit_map_connection",
]);

// ─── Server Registry ────────────────────────────────────────────────────────

interface ServerConfig {
  key: string;
  label: string;
  scriptPath: string;
  description: string;
}

const SERVER_REGISTRY: ServerConfig[] = [
  {
    key: "pokedex",
    label: "Pokédex",
    scriptPath: "pokedex-server.ts",
    description: "Pokémon game data (stats, moves, types, sets)",
  },
  {
    key: "porymap",
    label: "Porymap",
    scriptPath: "porymap-server.ts",
    description: "Map data inspection (layouts, events, tilesets)",
  },
];

// ─── CLI Argument Parsing ───────────────────────────────────────────────────

const arg = process.argv[2] ?? "pokedex";
const requestedServers =
  arg === "all"
    ? SERVER_REGISTRY
    : SERVER_REGISTRY.filter((s) => s.key === arg);

if (requestedServers.length === 0) {
  const keys = SERVER_REGISTRY.map((s) => s.key).join(", ");
  console.error(`Unknown server: "${arg}". Available: ${keys}, all`);
  process.exit(1);
}

// ─── MCP Client ─────────────────────────────────────────────────────────────

async function createMcpClient(config: ServerConfig): Promise<Client> {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", path.resolve(__dirname, config.scriptPath)],
    cwd: path.resolve(__dirname, "../.."),
    stderr: "inherit",
  });

  const client = new Client({
    name: `debug-ui-${config.key}`,
    version: "1.0.0",
  });
  await client.connect(transport);
  return client;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

function json(res: http.ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const clients = new Map<
    string,
    { client: Client; config: ServerConfig }
  >();

  for (const config of requestedServers) {
    console.log(`Connecting to ${config.label} MCP server...`);
    const client = await createMcpClient(config);
    clients.set(config.key, { client, config });
    console.log(`${config.label} connected.`);
  }

  function resolveClient(serverKey: string | undefined) {
    if (clients.size === 1 && !serverKey) {
      return clients.values().next().value!;
    }
    if (!serverKey) return undefined;
    return clients.get(serverKey);
  }

  const htmlPath = path.resolve(__dirname, "debug-ui.html");

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    try {
      if (url.pathname === "/" && req.method === "GET") {
        const html = fs.readFileSync(htmlPath, "utf-8");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
        return;
      }

      // List connected servers
      if (url.pathname === "/api/servers" && req.method === "GET") {
        const serverList = Array.from(clients.values()).map(({ config }) => ({
          key: config.key,
          label: config.label,
          description: config.description,
        }));
        json(res, serverList);
        return;
      }

      // List tools for a server
      if (url.pathname === "/api/tools" && req.method === "GET") {
        const serverKey = url.searchParams.get("server") ?? undefined;
        const entry = resolveClient(serverKey);
        if (!entry) {
          json(
            res,
            { error: "Missing or invalid 'server' query parameter" },
            400,
          );
          return;
        }
        const result = await entry.client.listTools();
        const annotated = result.tools.map((t) => ({
          ...t,
          _write: PORYMAP_WRITE_TOOLS.has(t.name),
        }));
        json(res, annotated);
        return;
      }

      // Call a tool
      if (url.pathname === "/api/call" && req.method === "POST") {
        const body = JSON.parse(await readBody(req));
        const {
          server: serverKey,
          tool,
          arguments: args,
        } = body as {
          server?: string;
          tool: string;
          arguments: Record<string, unknown>;
        };

        if (!tool) {
          json(res, { error: "Missing 'tool' field" }, 400);
          return;
        }

        const entry = resolveClient(serverKey);
        if (!entry) {
          json(
            res,
            { error: "Missing or invalid 'server' field" },
            400,
          );
          return;
        }

        const finalArgs = { ...(args ?? {}) };
        if (PORYMAP_WRITE_TOOLS.has(tool)) {
          finalArgs.dry_run = true;
        }

        const result = await entry.client.callTool({
          name: tool,
          arguments: finalArgs,
        });

        json(res, result);
        return;
      }

      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Request error:", message);
      json(res, { error: message }, 500);
    }
  });

  server.listen(PORT, () => {
    const serverNames = Array.from(clients.values())
      .map(({ config }) => config.label)
      .join(" + ");
    console.log(`\nMCP Debug UI (${serverNames}): http://localhost:${PORT}\n`);
  });

  const shutdown = async () => {
    console.log("\nShutting down...");
    server.close();
    for (const { client } of clients.values()) {
      await client.close();
    }
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
