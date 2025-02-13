import { aaveSupplyUSDCTool } from "./aave/supply-usdc-sepolia";
import { vrfTool } from "./flow/vrf-tool";
import { thirdwebTool } from "./thirdweb-nebula/thirdweb-tool";
import { bridgeTool } from "./gasyard-bridge/bridge-base-eth";
import { quoteTools } from "./gasyard-bridge/get-quotes";
import { retrieveCastTool } from "./social/analyze-cast";
import { retrieveTweetTool } from "./social/analyze-tweet";
import { deployErc20Tool } from "./token/deploy-token";
import { pumpFlowBuyTool, pumpFlowLaunchTool, pumpFlowListTool, pumpFlowSellTool } from "./flow/pump-flow";
export interface ToolConfig<T = any> {
    definition: {
        type: 'function';
        function: {
            name: string;
            description: string;
            parameters: {
                type: 'object';
                properties: Record<string, unknown>;
                required: string[];
            };
        };
    };
    handler: (args: T) => Promise<any>;
};

export const tools: Record<string, ToolConfig> = {
    // Flow
    "query_vrf": vrfTool,
    "launch_pump_token": pumpFlowLaunchTool,
    "buy_pump_tokens": pumpFlowBuyTool,
    "sell_pump_tokens": pumpFlowSellTool,
    "list_pump_tokens": pumpFlowListTool,

    // Aave
    "supply_usdc_aave": aaveSupplyUSDCTool,

    // Thirdweb
    "query_thirdweb": thirdwebTool,

    // Bridge
    "get_bridge_quote": quoteTools,
    "bridge_tokens": bridgeTool,

    // Social
    "get_cast_data": retrieveCastTool,
    "get_tweet_data": retrieveTweetTool,

    // Token
    "deploy_erc20": deployErc20Tool,
}