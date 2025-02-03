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
        this.wardenToolkit = new WardenToolkit(this.agentKit);
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
            .map(space => parseInt(space.replace('- ', '')))
            .filter(space => !isNaN(space));
    }

    private async createSpace(): Promise<number> {
        const tool = this.tools.find(t => t.name === 'create_space');
        if (!tool) throw new Error('create_space tool not found');

        await tool.call({});
        const spaces = await this.getSpaces();
        return Math.max(...spaces);
    }
} 