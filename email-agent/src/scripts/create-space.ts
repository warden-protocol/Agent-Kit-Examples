import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import dotenv from 'dotenv';

dotenv.config();

async function createSpace() {
    try {
        // Validate environment variables
        if (!process.env.PRIVATE_KEY) {
            throw new Error('PRIVATE_KEY environment variable is not set');
        }

        console.log('Initializing WardenAgentKit...');
        const agentKit = new WardenAgentKit({
            privateKeyOrAccount: process.env.PRIVATE_KEY as `0x${string}`
        });

        console.log('Setting up WardenToolkit...');
        const wardenToolkit = new WardenToolkit(agentKit);
        const tools = wardenToolkit.getTools();

        const createSpaceTool = tools.find(tool => tool.name === 'create_space');
        if (!createSpaceTool) {
            throw new Error('create_space tool not found');
        }

        console.log('Creating new space...');
        const response = await createSpaceTool.call({});
        
        console.log('\nResponse from Warden:');
        console.log(response);

    } catch (error) {
        console.error('\nError creating space:');
        if (error instanceof Error) {
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
        } else {
            console.error('Unknown error:', error);
        }
        process.exit(1);
    }
}

// Execute the function
createSpace();