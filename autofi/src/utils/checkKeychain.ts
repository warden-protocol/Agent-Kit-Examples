import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import dotenv from 'dotenv';
dotenv.config();

async function checkKeychains() {
    try {
        // Validate environment variables
        if (!process.env.PRIVATE_KEY) {
            throw new Error('PRIVATE_KEY environment variable is not set');
        }

        // Initialize Agent Kit
        const agentKit = new WardenAgentKit({
            privateKeyOrAccount: process.env.PRIVATE_KEY as `0x${string}`
        });

        // Setup Toolkit
        const wardenToolkit = new WardenToolkit(agentKit);
        const tools = wardenToolkit.getTools();

        // Find get_keychains tool
        const getKeychainsTool = tools.find(tool => tool.name === 'get_keychains');
        if (!getKeychainsTool) {
            throw new Error('get_keychains tool not found');
        }

        // Execute keychain check - note that this tool doesn't require any input parameters
        const keychainsResponse = await getKeychainsTool.call({});

        // Log the response
        console.log('\nKeychain Information:');
        console.log(keychainsResponse);

        return keychainsResponse;

    } catch (error) {
        console.error('\nError checking keychains:');
        if (error instanceof Error) {
            console.error('Error message:', error.message);
        }
        throw error;
    }
}

// Execute the script
checkKeychains().catch(error => {
    console.error('Failed to check keychains:', error);
    process.exit(1);
});