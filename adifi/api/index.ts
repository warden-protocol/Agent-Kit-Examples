import express from 'express';
import cors from 'cors';
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";
import { UniswapTool } from '../src/tools/uniswapTool';
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// CORS setup as per Vercel docs
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://agentaiblockchainadifi-juls95-juls95s-projects.vercel.app"
    ],
  })
);

app.use(express.json());

// Initialize agent
let agent: any = null;
let isInitializing = false;

async function initializeAgent() {
    if (isInitializing) return;
    isInitializing = true;
    
    try {
        const llm = new ChatAnthropic({
            modelName: "claude-3-sonnet-20240229",
            anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        });

        const config = {
            privateKeyOrAccount: process.env.PRIVATE_KEY as `0x${string}` || undefined,
        };

        const agentkit = new WardenAgentKit(config);
        const uniswapTool = new UniswapTool();
        const wardenToolkit = new WardenToolkit(agentkit as any);
        const tools = [...wardenToolkit.getTools(), uniswapTool];

        const memory = new MemorySaver();
        
        agent = await createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: `
                You're a specialized Uniswap trading analyst. When users ask about Uniswap pools:
                1. ALWAYS use the get_uniswap_metrics tool with the exact pool address first
                2. Analyze the metrics and provide:
                   - Current market conditions
                   - Trading recommendation (Buy/Sell/Hold)
                   - Suggested entry price
                   - Recommended stop-loss level (usually 2-5% below entry for buys)
                   - Target price for taking profits
                3. Include a confidence level (Low/Medium/High) based on:
                   - Volume trends
                   - Price stability
                   - Liquidity depth
                4. Add risk warnings and remind users this is not financial advice
                
                Format your response like this:
                Market Analysis: [your analysis of current metrics]
                Trading Setup:
                - Recommendation: [Buy/Sell/Hold]
                - Entry Price: [price]
                - Stop Loss: [price]
                - Take Profit: [price]
                Confidence Level: [Low/Medium/High]
                Risk Warning: [your risk warning]
            `
        });

        console.log('Trading analysis agent initialized successfully');
        return agent;
    } catch (error) {
        console.error('Failed to initialize agent:', error);
        throw error;
    } finally {
        isInitializing = false;
    }
}

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!agent) {
            await initializeAgent();
        }

        if (!agent) {
            return res.status(503).json({ error: 'Agent not initialized' });
        }

        const stream = await agent.stream(
            { messages: [new HumanMessage(message)] },
            { configurable: { thread_id: "Warden Agent Kit API!" } }
        );

        let response = '';
        for await (const chunk of stream) {
            if ("agent" in chunk) {
                response = chunk.agent.messages[0].content;
            } else if ("tools" in chunk) {
                response = chunk.tools.messages[0].content;
            }
        }

        res.json({ response });
    } catch (error: unknown) {
        console.error('Chat error:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

// Only start the server if we're running locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('Environment:', process.env.NODE_ENV || 'development');
    });
}

export default app; 