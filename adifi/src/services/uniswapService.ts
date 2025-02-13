import { request, gql } from 'graphql-request';

interface PoolData {
    pool: {
        token0Price: string;
        token1Price: string;
        liquidity: string;
        volumeUSD: string;
    }
}

export class UniswapService {
    private getApiUrl() {
        const apiKey = process.env.GRAPH_API_KEY;
        if (!apiKey) {
            throw new Error("GRAPH_API_KEY is not set in .env file");
        }
        return `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;
    }

    async getPoolMetrics(poolAddress: string) {
        const UNISWAP_API = this.getApiUrl();
        console.log('API Key:', process.env.GRAPH_API_KEY);
        console.log('UNISWAP_API URL:', UNISWAP_API);

        const query = gql`
            query getPoolData($poolAddress: String!) {
                pool(id: $poolAddress) {
                    token0Price
                    token1Price
                    liquidity
                    volumeUSD
                }
            }
        `;

        const variables = { poolAddress };
        const data = await request<PoolData>(UNISWAP_API, query, variables);
        return data.pool;
    }
} 