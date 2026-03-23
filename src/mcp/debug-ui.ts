#!/usr/bin/env node
/**
 * MCP Debug Web UI
 *
 * Spawns the Pokédex MCP server as a child process, connects to it via
 * the MCP client SDK over stdio, and serves a browser-based tool explorer
 * at http://localhost:3333 (configurable via PORT env var).
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? "3333", 10);

async function createMcpClient(): Promise<Client> {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", path.resolve(__dirname, "pokedex-server.ts")],
    cwd: path.resolve(__dirname, "../.."),
    stderr: "inherit",
  });

  const client = new Client({ name: "debug-ui", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

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

async function main() {
  console.log("Connecting to Pokédex MCP server...");
  const client = await createMcpClient();
  console.log("MCP client connected.");

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

      if (url.pathname === "/api/tools" && req.method === "GET") {
        const result = await client.listTools();
        json(res, result.tools);
        return;
      }

      if (url.pathname === "/api/call" && req.method === "POST") {
        const body = JSON.parse(await readBody(req));
        const { tool, arguments: args } = body as {
          tool: string;
          arguments: Record<string, unknown>;
        };

        if (!tool) {
          json(res, { error: "Missing 'tool' field" }, 400);
          return;
        }

        const result = await client.callTool({
          name: tool,
          arguments: args ?? {},
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
    console.log(`\nMCP Debug UI: http://localhost:${PORT}\n`);
  });

  const shutdown = async () => {
    console.log("\nShutting down...");
    server.close();
    await client.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
