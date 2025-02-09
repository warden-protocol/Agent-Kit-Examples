import { getGasPrice } from "../services/gasPriceService.js";
import { analyzeGasTrends } from "./aiService.js";
import { addRealGasPrice, addPredictedGasPrice } from "../utils/dataStore.js";
import { logInfo, logError } from "../utils/logger.js";
import { getAgent } from "../services/agentManager.js";

async function updateGasPrices() {
    try {
        const { agent, config, tools } = getAgent();
        const livePrice = await getGasPrice(tools);
        if (livePrice) {
            addRealGasPrice(livePrice);
        }
    } catch (error) {
        logError("Error updating gas price", error);
    }
}

async function updateGasPredictions() {
    try {
        const { agent, config, tools  } = getAgent();
        const predictedPrice = await analyzeGasTrends(agent, config);
        if (predictedPrice) {
            addPredictedGasPrice(predictedPrice);
        }
    } catch (error) {
        logError("Error updating gas price predictions", error);
    }
}
setInterval(updateGasPrices, 3000);
setInterval(updateGasPredictions, 10000);
