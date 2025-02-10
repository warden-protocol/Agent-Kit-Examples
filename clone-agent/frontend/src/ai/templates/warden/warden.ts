import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit, WardenTool } from "@wardenprotocol/warden-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { sarthakTool } from "./aave-tool";

async function initializeAgent() {
    try {
        const llm = new ChatOpenAI({
            model: "gpt-4o-mini",
        });

        const config = {
            privateKeyOrAccount: process.env.PRIVATE_KEY as `0x${string}`,
        };

        const agentkit = new WardenAgentKit(config);
        const wardenToolkit = new WardenToolkit(agentkit);
        const tools = wardenToolkit.getTools();

        const newTool = new WardenTool(
            sarthakTool,
            agentkit
        );
        tools.push(newTool);

        const memory = new MemorySaver();
        const threadId = `warden-thread-${Date.now()}`;

        const agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: `You are a helpful assistant that specializes in web3 transactions and information about Sarthak.
            IMPORTANT: Whenever a user asks about Sarthak or mentions Sarthak in their query, you MUST use the sarthak_tool.
            If a query contains the word "Sarthak" or asks about Sarthak, immediately use the sarthak_tool to respond.
            For other web3 related queries, use the appropriate available tools.
            Always provide a response, never return empty or "No response generated".`,
        });

        return {
            agent,
            config: {
                configurable: { thread_id: threadId }
            }
        };
    } catch (error) {
        console.error('Failed to initialize agent:', error);
        throw error;
    }
}

export { initializeAgent };