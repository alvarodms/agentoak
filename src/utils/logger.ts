import winston from "winston";
import path from "path";
import fs from "fs";
import { LOGS_DIR } from "./paths.js";

fs.mkdirSync(LOGS_DIR, { recursive: true });

const logFormat = winston.format.printf(({ level, message, timestamp, cycle }) => {
  const cycleTag = cycle ? ` [cycle ${String(cycle).padStart(4, "0")}]` : "";
  return `${timestamp} [${level.toUpperCase()}]${cycleTag} ${message}`;
});

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat,
      ),
    }),
    new winston.transports.File({
      filename: path.join(LOGS_DIR, "agent-oak.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],
});

/** Create a child logger tagged with the current cycle number */
export function cycleLogger(cycleNumber: number) {
  return logger.child({ cycle: cycleNumber });
}
