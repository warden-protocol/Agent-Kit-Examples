import { ChatAnthropic } from '@langchain/anthropic';
import { UniswapService } from './uniswapService';
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";


export class MonitoringService {
    private llm: ChatAnthropic;
    private uniswap: UniswapService;
    private wardenKit: WardenAgentKit;

    constructor(anthropicKey: string, wardenConfig: any) {
        this.llm = new ChatAnthropic({
            modelName: "claude-3-sonnet-20240229",
            anthropicApiKey: anthropicKey
        });
        this.uniswap = new UniswapService();
        this.wardenKit = new WardenAgentKit(wardenConfig);
    }

    async analyzeMarket(poolAddress: string) {
        // Get market data
        const metrics = await this.uniswap.getPoolMetrics(poolAddress);
        
        // Analyze with Claude
        const analysis = await this.llm.invoke(
            `Analyze this Uniswap pool data and recommend trading actions:\n${JSON.stringify(metrics, null, 2)}`
        );

        // Store in Warden blockchain
        await this.wardenKit.storeData({
            metrics,
            analysis: analysis.content,
            timestamp: Date.now()
        });

        return {
            metrics,
            analysis: analysis.content
        };
    }
} 