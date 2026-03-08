import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Root of the agent-oak project */
export const PROJECT_ROOT = path.resolve(__dirname, "../..");

/** Root of the pokeemerald ROM source */
export const POKEEMERALD_DIR = path.join(PROJECT_ROOT, "pokeemerald");

/** Directory for persistent memory files */
export const MEMORY_DIR = path.join(PROJECT_ROOT, "memory");

/** Directory for cycle journal entries */
export const JOURNAL_DIR = path.join(PROJECT_ROOT, "journal");

/** Directory for build artifacts */
export const ARTIFACTS_DIR = path.join(PROJECT_ROOT, "artifacts");

/** Directory for build log files */
export const BUILD_LOGS_DIR = path.join(ARTIFACTS_DIR, "build-logs");

/** Directory for agent logs */
export const LOGS_DIR = path.join(PROJECT_ROOT, "logs");
