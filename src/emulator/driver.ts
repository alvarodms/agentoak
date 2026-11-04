/**
 * Process wrapper for `mgba-driver` (built into the runner image from
 * .github/docker/mgba-driver/). The driver reads one command per line on
 * stdin and answers each with one JSON line on stdout, in order, so this
 * class keeps a FIFO of pending replies and matches them up.
 */

import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import readline from "node:readline";

export interface DriverReply {
  ok: boolean;
  error?: string;
  [key: string]: unknown;
}

interface Pending {
  command: string;
  resolve: (reply: DriverReply) => void;
  reject: (err: Error) => void;
}

/** Binary to spawn: `MGBA_DRIVER` overrides the copy on PATH. */
export function driverBinary(): string {
  return process.env.MGBA_DRIVER?.trim() || "mgba-driver";
}

export class DriverError extends Error {}

export class MgbaDriver {
  private readonly proc: ChildProcessWithoutNullStreams;
  private readonly pending: Pending[] = [];
  private readonly stderrTail: string[] = [];
  private exited: Error | null = null;
  private readonly ready: Promise<DriverReply>;

  private constructor(binary: string) {
    this.proc = spawn(binary, [], { stdio: ["pipe", "pipe", "pipe"] });

    let resolveReady!: (r: DriverReply) => void;
    let rejectReady!: (e: Error) => void;
    this.ready = new Promise((res, rej) => {
      resolveReady = res;
      rejectReady = rej;
    });
    // The first line is the driver's greeting, not a reply to a command.
    this.pending.push({ command: "<startup>", resolve: resolveReady, reject: rejectReady });

    readline.createInterface({ input: this.proc.stdout }).on("line", (line) => this.onLine(line));
    readline.createInterface({ input: this.proc.stderr }).on("line", (line) => {
      this.stderrTail.push(line);
      if (this.stderrTail.length > 20) this.stderrTail.shift();
    });
    this.proc.on("error", (err) => this.fail(new DriverError(`mgba-driver failed to start (${binary}): ${err.message}`)));
    this.proc.on("exit", (code, signal) => {
      const why = signal ? `signal ${signal}` : `code ${code}`;
      const tail = this.stderrTail.length ? `\n${this.stderrTail.join("\n")}` : "";
      this.fail(new DriverError(`mgba-driver exited (${why})${tail}`));
    });
  }

  /** Spawns the driver and waits for its greeting. */
  static async start(binary = driverBinary()): Promise<MgbaDriver> {
    const driver = new MgbaDriver(binary);
    await driver.ready;
    return driver;
  }

  /**
   * Sends one command and resolves with its reply. Rejects when the driver
   * answers `ok: false` or dies. Arguments must not contain whitespace or
   * newlines (the protocol is whitespace-separated).
   */
  send(command: string, ...args: (string | number)[]): Promise<DriverReply> {
    const parts = [command, ...args.map(String)];
    for (const part of parts) {
      if (part === "" || /\s/.test(part)) {
        return Promise.reject(new DriverError(`invalid driver argument ${JSON.stringify(part)} in ${command}`));
      }
    }
    if (this.exited) return Promise.reject(this.exited);
    const line = parts.join(" ");
    return new Promise((resolve, reject) => {
      this.pending.push({ command: line, resolve, reject });
      this.proc.stdin.write(`${line}\n`);
    });
  }

  /** Asks the driver to exit and waits for it. Safe to call twice. */
  async close(): Promise<void> {
    if (this.exited) return;
    const exited = new Promise<void>((res) => this.proc.once("exit", () => res()));
    this.proc.stdin.end("quit\n");
    const timer = setTimeout(() => this.proc.kill("SIGKILL"), 5000);
    await exited;
    clearTimeout(timer);
  }

  private onLine(line: string): void {
    const waiter = this.pending.shift();
    if (!waiter) return; // reply to "quit" after close(), or stray output
    let reply: DriverReply;
    try {
      reply = JSON.parse(line) as DriverReply;
    } catch {
      waiter.reject(new DriverError(`unparseable reply to "${waiter.command}": ${line}`));
      return;
    }
    if (reply.ok) waiter.resolve(reply);
    else waiter.reject(new DriverError(`${waiter.command}: ${reply.error ?? "unknown error"}`));
  }

  private fail(err: Error): void {
    if (this.exited) return;
    this.exited = err;
    for (const waiter of this.pending.splice(0)) waiter.reject(err);
  }
}
