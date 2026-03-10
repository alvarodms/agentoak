import "dotenv/config";
import { runCycle } from "./cycle/runner.js";
import { logger } from "./utils/logger.js";

async function main() {
  logger.info("Agent Oak starting up...");
  logger.info(`Model: ${process.env.ANTHROPIC_MODEL ?? "(default)"}`);
  logger.info(`Anthropic Base URL: ${process.env.ANTHROPIC_BASE_URL ?? "(default)"}`);
  logger.info(`Max tool calls/cycle: ${process.env.MAX_TOOL_CALLS_PER_CYCLE ?? "50"}`);

  try {
    await runCycle();
    logger.info("Agent Oak cycle finished successfully.");
    process.exit(0);
  } catch (err) {
    logger.error(`Agent Oak cycle failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
