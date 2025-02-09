import { startWardenAgent } from "./warden/agent.js";
import { logInfo } from "./utils/logger.js";
import "./server.js";
import "./services/updateService.js";

async function main() {
    logInfo("Warden AI Agent is starting...");
    await startWardenAgent();
}

main();