import { ToolConfig } from "../index";
import axios from "axios";
import { parseEther } from "viem";

const NETWORK_IDS = {
  "BASE_SEPOLIA": { id: 84532, apiId: 902 },
  "SEPOLIA": { id: 11155111, apiId: 901 },
  "BASE": { id: 8453, apiId: 902 },
  "ETH": { id: 1, apiId: 901 }
} as const;

interface QuoteArgs {
  fromNetwork: keyof typeof NETWORK_IDS;
  toNetwork: keyof typeof NETWORK_IDS;
  amount: string;
}

const convertAmountToWei = (amount: string): string => {
  const [value] = amount.split(" ");
  return parseEther(value).toString();
};

const getPriceQuote = async (args: QuoteArgs): Promise<string> => {
  try {
    console.log('[DEBUG] Quote request:', args);
    const weiAmount = convertAmountToWei(args.amount);
    console.log('[DEBUG] Amount in Wei:', weiAmount);

    const quotePayload = {
      inputNetwork: NETWORK_IDS[args.fromNetwork].apiId,
      outputNetwork: NETWORK_IDS[args.toNetwork].apiId,
      inputTokenAmount: weiAmount
    };
    console.log('[DEBUG] Quote payload:', quotePayload);

    const response = await axios.post('https://gasyard-backendapi-v2-production-27d5.up.railway.app/api/quote', quotePayload);
    console.log('[DEBUG] Quote response:', response.data);

    return `
Quote Details:
Amount: ${args.amount}
From: ${args.fromNetwork} (${NETWORK_IDS[args.fromNetwork].id})
To: ${args.toNetwork} (${NETWORK_IDS[args.toNetwork].id})
Output Amount: ${response.data.outputTokenAmount}
Output Value: $${response.data.outputValueInUSD}
Fees: $${response.data.feesInUSD}
`.trim();

  } catch (error) {
    console.error('[DEBUG] Quote error:', error);
    if (axios.isAxiosError(error)) {
      console.error('[DEBUG] Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return `Quote Error: ${error.response?.data?.message || error.message}`;
    }
    return `Quote Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const quoteTools: ToolConfig = {
  definition: {
    type: "function",
    function: {
      name: "get_bridge_quote",
      description: "Get bridge quote between networks",
      parameters: {
        type: "object",
        properties: {
          fromNetwork: {
            type: "string",
            enum: Object.keys(NETWORK_IDS),
            description: "Source network"
          },
          toNetwork: {
            type: "string",
            enum: Object.keys(NETWORK_IDS),
            description: "Destination network"
          },
          amount: {
            type: "string", 
            description: "Amount in ETH (e.g. '0.1 ETH')"
          }
        },
        required: ["fromNetwork", "toNetwork", "amount"]
      }
    }
  },
  handler: getPriceQuote
};