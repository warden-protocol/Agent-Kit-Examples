import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import { CONFIG } from "../config/config.js";
import { logInfo, logError } from "../utils/logger.js";
import { HumanMessage } from "@langchain/core/messages";
import { getRealGasPriceHistory } from "../utils/dataStore.js";

const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    openAIApiKey: CONFIG.OPENAI_API_KEY,
});

const memory = new MemorySaver();

export function createAI(tools) {
    try {
        const agentConfig = {
            configurable: { thread_id: "Warden-Gas-Forecaster" },
        };

        const agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier:
                "You're a helpful assistant for Web3 gas price forecasting. " +
                "Analyze historical data, predict gas fees, and suggest best transaction times.",
        });

        logInfo("AI Agent initialized successfully!");
        return { agent, config: agentConfig };

    } catch (error) {
        logError("AI Agent Initialization Failed", error);
        return null;
    }
}

export async function analyzeGasTrends(agent, config) {
    try {
        const gasHistory = getRealGasPriceHistory();
        if (gasHistory.length === 0) {
            logInfo("No historical gas price data available.");
            return "No historical gas price data available.";
        }

        const formattedHistory = gasHistory.map(entry => entry.price).join(", ");

        const prompt = `Here is the Ethereum gas price history over time: [${formattedHistory}]. 
        Predict the gas price for the next hour. 
        Return **only** a number, no text, no symbols.`;

        const stream = await agent.stream(
            { messages: [new HumanMessage(prompt)] },
            config
        );

        let responseText = "";

        for await (const chunk of stream) {
            if ("agent" in chunk) {
                responseText += chunk.agent.messages[0].content;
            } else if ("tools" in chunk) {
                responseText += chunk.tools.messages[0].content;
            }
        }

        if (!responseText.trim()) {
            logError("AI response was empty.");
            return null;
        }

        const match = responseText.match(/(\d+(\.\d+)?)/);
        if (match) {
            const predictedPrice = parseFloat(match[0]);
            logInfo(`AI Predicted Gas Price: ${predictedPrice}`);

            return predictedPrice;
        } else {
            logError(`Invalid AI response: ${responseText}`);
            return null;
        }
    } catch (error) {
        logError("Failed to analyze gas trends", error);
        return null;
    }
}