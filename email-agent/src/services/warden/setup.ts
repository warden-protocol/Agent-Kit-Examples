// src/services/warden/setup.ts
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";

export async function getSpaceKeys(privateKey: string, spaceId: number) {
    try {
        const agentKit = new WardenAgentKit({
            privateKeyOrAccount: privateKey as `0x${string}`
        });

        const wardenToolkit = new WardenToolkit(agentKit);
        const tools = wardenToolkit.getTools();

        // Get keys in our space
        const getKeysTool = tools.find(tool => tool.name === 'get_keys');
        if (!getKeysTool) {
            throw new Error('get_keys tool not found');
        }

        console.log('Getting keys for space:', spaceId);
        const keysResponse = await getKeysTool.call({
            spaceId: spaceId
        });

        return keysResponse;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}