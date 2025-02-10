import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import { SpaceKey } from '../../config/types';

export class SpaceManager {
    private agentKit: WardenAgentKit;
    private wardenToolkit: WardenToolkit;
    private tools: any[];

    constructor(privateKey: string) {
        this.agentKit = new WardenAgentKit({
            privateKeyOrAccount: privateKey as `0x${string}`
        });
        this.wardenToolkit = new WardenToolkit(this.agentKit as any);
        this.tools = this.wardenToolkit.getTools();
    }

    async getOrCreateSpace(): Promise<number> {
        const spaces = await this.getSpaces();
        
        if (spaces.length === 0) {
            return await this.createSpace();
        }
        
        return Math.max(...spaces); // Return latest space
    }

    private async getSpaces(): Promise<number[]> {
        const tool = this.tools.find(t => t.name === 'get_spaces');
        if (!tool) throw new Error('get_spaces tool not found');

        const response = await tool.call({});
        return response
            .replace('These are all the spaces:', '')
            .trim()
            .split('\n')
            .map((space: string) => parseInt(space.replace('- ', '')))
            .filter((space: number) => !isNaN(space));
    }

    private async createSpace(): Promise<number> {
        const tool = this.tools.find(t => t.name === 'create_space');
        if (!tool) throw new Error('create_space tool not found');

        await tool.call({});
        const spaces = await this.getSpaces();
        return Math.max(...spaces);
    }

    async getOrCreateKey(spaceId: number): Promise<SpaceKey> {
        const keys = await this.getKeys(spaceId);
        
        if (keys.length === 0) {
            return await this.createKey(spaceId);
        }
        
        // Use the latest key
        return keys[keys.length - 1];
    }

    private async getKeys(spaceId: number): Promise<SpaceKey[]> {
        const tool = this.tools.find(t => t.name === 'get_keys');
        if (!tool) throw new Error('get_keys tool not found');

        const response = await tool.call({ spaceId });
        // Parse the response to extract keys
        // Format: "Key ID: X, Created At: Y"
        return response.split('\n')
            .filter((line: string) => line.includes('Key ID:'))
            .map((line: string) => {
                const id = parseInt(line.match(/Key ID: (\d+)/)?.[1] || '0');
                const createdAt = line.match(/Created At: (.+)/)?.[1] || new Date().toISOString();
                return { id, spaceId, createdAt };
            });
    }

    private async createKey(spaceId: number): Promise<SpaceKey> {
        const tool = this.tools.find(t => t.name === 'create_key');
        if (!tool) throw new Error('create_key tool not found');

        await tool.call({ spaceId });
        const keys = await this.getKeys(spaceId);
        return keys[keys.length - 1];
    }
} 