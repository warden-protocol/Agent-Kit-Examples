import { ToolConfig } from "../index";
import { parseEther } from "viem";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, baseSepolia } from "viem/chains";
import axios from "axios";

const NETWORKS = {
  SEPOLIA: {
    id: 11155111,
    apiId: 901,
    chainId: 901,
    chain: sepolia,
    rpcUrl: process.env.ETH_SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com",
  },
  BASE_SEPOLIA: {
    id: 84532,
    apiId: 902,
    chainId: 902,
    chain: baseSepolia,
    rpcUrl: process.env.BASE_SEPOLIA_RPC || "https://base-sepolia-rpc.publicnode.com",
  },
} as const;

const GATEWAY_CONTRACTS: Record<keyof typeof NETWORKS, `0x${string}`> = {
  SEPOLIA: "0x58A6a7d6b16b2c7A276d7901AB65596A1BEaa25B",
  BASE_SEPOLIA: "0xf011B7B9e72CD1C530BaA6e583aa19e6E43Dc1Be",
};

const BRIDGE_ABI = [
  {
    inputs: [
      { internalType: "uint32", name: "destinationChainId", type: "uint32" },
      { internalType: "bytes32", name: "inputToken", type: "bytes32" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes32", name: "destinationAddress", type: "bytes32" },
      { internalType: "bytes32", name: "outputToken", type: "bytes32" },
    ],
    name: "bridge",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

interface BridgeArgs {
  amount: string;
  network: keyof typeof NETWORKS;
  toNetwork: keyof typeof NETWORKS;
  receiver: `0x${string}`;
}

const cleanAmount = (amount: string): string => {
  return amount.replace(/\s*ETH\s*/i, '').trim();
};

const evmAddressToBytes32 = (address: `0x${string}`): `0x${string}` => {
  console.log("[DEBUG] Converting address:", address);
  const result = `0x000000000000000000000000${address.slice(2)}` as `0x${string}`;
  console.log("[DEBUG] Converted address result:", result);
  return result;
};

const getPrivateKeyFromEnv = (): `0x${string}` => {
  const privateKeyEnv = process.env.PRIVATE_KEY;
  if (!privateKeyEnv) {
    throw new Error('Private key is not defined in environment variables');
  }

  const privateKey = privateKeyEnv.startsWith('0x') 
    ? (privateKeyEnv as `0x${string}`)
    : `0x${privateKeyEnv}` as `0x${string}`;

  return privateKey;
};

export const bridgeTool: ToolConfig = {
  definition: {
    type: "function",
    function: {
      name: "bridge_tokens",
      description: "Bridge tokens between networks",
      parameters: {
        type: "object",
        properties: {
          amount: {
            type: "string",
            description: "Amount to bridge (e.g., '0.02' or '0.02 ETH')",
          },
          network: {
            type: "string",
            enum: Object.keys(NETWORKS),
            description: "Source network",
          },
          toNetwork: {
            type: "string",
            enum: Object.keys(NETWORKS),
            description: "Destination network",
          },
          receiver: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
            description: "Receiver address (0x...)",
          },
        },
        required: ["amount", "network", "toNetwork", "receiver"],
      },
    },
  },
  handler: async (args: BridgeArgs): Promise<string> => {
    try {
      console.log("[DEBUG] Starting bridge with args:", JSON.stringify(args));

      if (!NETWORKS[args.network]) {
        throw new Error(`Invalid source network: ${args.network}`);
      }
      if (!NETWORKS[args.toNetwork]) {
        throw new Error(`Invalid destination network: ${args.toNetwork}`);
      }

      const cleanedAmount = cleanAmount(args.amount);
      console.log("[DEBUG] Cleaned amount:", cleanedAmount);

      const weiAmount = parseEther(cleanedAmount);
      console.log("[DEBUG] Converted amount to Wei:", weiAmount.toString());

      const fromNetwork = NETWORKS[args.network];
      const destNetwork = NETWORKS[args.toNetwork];

      console.log("[DEBUG] Network config:", {
        from: args.network,
        to: args.toNetwork,
        sourceChainId: fromNetwork.chainId,
        destChainId: destNetwork.chainId,
      });

      let bridgeStatus = {
        step: "quote",
        details: null as any,
        error: null as string | null,
      };

      try {
        const quote = await axios.post(
          "https://gasyard-backendapi-v2-production-27d5.up.railway.app/api/quote",
          {
            inputNetwork: fromNetwork.apiId,
            outputNetwork: destNetwork.apiId,
            inputTokenAmount: weiAmount.toString(),
          }
        );
        bridgeStatus.details = { quote: quote.data };

        const privateKey = getPrivateKeyFromEnv();
        const account = privateKeyToAccount(privateKey);

        bridgeStatus.step = "transaction";
        const walletClient = createWalletClient({
          account,
          chain: fromNetwork.chain,
          transport: http(fromNetwork.rpcUrl),
        });

        const bridgeArgs = [
          destNetwork.chainId,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          weiAmount,
          evmAddressToBytes32(args.receiver),
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        ] as const;

        const hash = await walletClient.writeContract({
          address: GATEWAY_CONTRACTS[args.network],
          abi: BRIDGE_ABI,
          functionName: "bridge",
          args: bridgeArgs,
          value: weiAmount,
        });

        bridgeStatus.step = "confirmation";
        const provider = createPublicClient({
          chain: fromNetwork.chain,
          transport: http(fromNetwork.rpcUrl),
        });

        const receipt = await provider.waitForTransactionReceipt({ hash });
        bridgeStatus.details = {
          ...bridgeStatus.details,
          hash: receipt.transactionHash,
          status: receipt.status,
        };

        return JSON.stringify({
          success: true,
          message: `Successfully bridged ${cleanedAmount} ETH from ${args.network} to ${args.toNetwork}`,
          details: {
            amount: cleanedAmount,
            from: args.network,
            to: args.toNetwork,
            receiver: args.receiver,
            hash: receipt.transactionHash,
            output: quote.data.outputValueInUSD,
            fees: quote.data.feesInUSD,
          },
        });
      } catch (innerError) {
        bridgeStatus.error = innerError instanceof Error ? innerError.message : String(innerError);
        throw new Error(`Bridge failed at ${bridgeStatus.step}: ${bridgeStatus.error}`);
      }
    } catch (error) {
      console.error("[DEBUG] Bridge error:", error);

      return JSON.stringify({
        success: false,
        message: axios.isAxiosError(error)
          ? `Bridge failed: ${error.response?.data?.message || error.message}`
          : `Bridge failed: ${error instanceof Error ? error.message : String(error)}`,
        error: true,
      });
    }
  },
};