import { Tool } from "@langchain/core/tools";
import { UniswapService } from "../services/uniswapService";

export class UniswapTool extends Tool {
    private service: UniswapService;

    constructor() {
        super();
        this.service = new UniswapService();
    }

    name = "get_uniswap_metrics";
    description = "Gets trading metrics for a Uniswap pool. Input should be a pool address.";

    async _call(poolAddress: string): Promise<string> {
        try {
            const poolData = await this.service.getPoolMetrics(poolAddress);
            return JSON.stringify({
                token0Price: poolData.token0Price,
                token1Price: poolData.token1Price,
                liquidity: poolData.liquidity,
                volumeUSD: poolData.volumeUSD
            }, null, 2);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return `Error fetching pool data: ${error.message}`;
            }
            return "Error fetching pool data: Unknown error occurred";
        }
    }
} 