import { logInfo, logError } from "../utils/logger.js";

function parseGasPrice(priceString) {
    const match = priceString.match(/\$([\d,]+(?:\.\d+)?)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) : null;
}

export async function getGasPrice(tools) {
    try {
        const getPriceTool = tools.find(tool => tool.name === "get_price");
        if (!getPriceTool) {
            throw new Error("get_price tool not found in toolkit.");
        }

        const response = await getPriceTool.call({ symbol: "ETH" });
        const gasPrice = parseGasPrice(response);
        logInfo(`Live Gas Price: ${gasPrice}`);

        return gasPrice;
    } catch (error) {
        logError("Failed to fetch gas price", error);
        return null;
    }
}