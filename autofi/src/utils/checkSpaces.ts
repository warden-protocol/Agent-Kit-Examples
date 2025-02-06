import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import dotenv from 'dotenv';
dotenv.config();

async function checkSpaces() {
    try {
        // Validate environment variables first
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

        const getSpacesTool = tools.find(tool => tool.name === 'get_spaces');
        if (!getSpacesTool) {
            throw new Error('get_spaces tool not found');
        }

        console.log('Fetching spaces...');
        const spacesResponse = await getSpacesTool.call({});
        
        // The response will be a string containing space information
        // Example output: "These are all the spaces: - 1\n- 2\n"
        console.log('\nResponse from Warden:');
        console.log(spacesResponse);

        // Parse and display the spaces in a more readable format
        const spaces = spacesResponse
            .replace('These are all the spaces:', '')
            .trim()
            .split('\n')
            .map((space: string) => space.replace('- ', ''))
            .filter((space: string) => space);

        console.log('\nYour Space IDs:', spaces);
        
        if (spaces.length === 0) {
            console.log('\nNo spaces found. You may need to create a new space.');
        }

        return spaces;
    } catch (error) {
        console.error('\nError checking spaces:');
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
checkSpaces();