import express from 'express';
import cors from 'cors';
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";
import { UniswapTool } from '../tools/uniswapTool';
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import * as dotenv from 'dotenv';

// Load environment variables first
dotenv.config({ path: '../../../.env' });

// Validate required environment variables
const requiredEnvVars = ['ANTHROPIC_API_KEY', 'GRAPH_API_KEY'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not set in environment variables`);
        process.exit(1);
    }
}

const app = express();

// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Initialize agent once for reuse
let agent: any = null;
let isInitializing = false;

async function initializeAgent() {
    if (isInitializing) return;
    isInitializing = true;
    
    try {
        if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
        }

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
            messageModifier:
                "You're a helpful assistant specialized in Uniswap data analysis. " +
                "When users ask about Uniswap pools, ALWAYS use the get_uniswap_metrics tool with the exact pool address. " +
                "After getting the data, explain what the metrics mean in a clear way.",
        });

        console.log('Agent initialized successfully');
        return agent;
    } catch (error) {
        console.error('Failed to initialize agent:', error);
        throw error;
    } finally {
        isInitializing = false;
    }
}

// Initialize agent when server starts
initializeAgent().catch(error => {
    console.error('Fatal error during agent initialization:', error);
    process.exit(1);
});

app.get('/', (req, res) => {
    res.json({ 
        status: 'Server is running',
        agentStatus: agent ? 'Agent initialized' : isInitializing ? 'Agent initializing...' : 'Agent not initialized',
        initialized: !!agent
    });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
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
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 