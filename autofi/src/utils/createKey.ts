import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import dotenv from 'dotenv';
dotenv.config();

async function createKey(spaceId: string) {
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

        // Find create_key tool
        const createKeyTool = tools.find(tool => tool.name === 'create_key');
        if (!createKeyTool) {
            throw new Error('create_key tool not found');
        }

        // Execute key creation with proper number types
        const keyResponse = await createKeyTool.call({
            spaceId: parseInt(spaceId),    // Convert string to number
            keychainId: 1                  // Use number directly, not string
        });

        console.log('\nKey creation response:', keyResponse);
        
        // Only try to parse if the response is a JSON string
        try {
            const keyData = JSON.parse(keyResponse);
            console.log('\nSuccessfully created key:');
            console.log(`Key ID: ${keyData.keyId}`);
            console.log(`Public Address: ${keyData.publicKey}`);
            return keyData;
        } catch {
            // If response isn't JSON, just return it as is
            console.log('\nOperation result:', keyResponse);
            return keyResponse;
        }

    } catch (error) {
        console.error('\nError creating key:');
        if (error instanceof Error) {
            console.error('Error message:', error.message);
        }
        throw error;  // Re-throw to handle error in calling code
    }
}

// Execute with space ID from previous step
const spaceId = process.argv[2];
if (!spaceId) {
    console.error('Usage: npx ts-node src/utils/createKey.ts <spaceId>');
    process.exit(1);
}

createKey(spaceId).catch(error => {
    console.error('Failed to create key:', error);
    process.exit(1);
});