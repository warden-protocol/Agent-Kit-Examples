import { http, createPublicClient } from "viem";
import { mainnet, sepolia, baseSepolia, flowTestnet } from "viem/chains";

const ETH_SEPOLIA_RPC = process.env.ETH_SEPOLIA_RPC;
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC;
const FLOW_TESTNET_RPC = process.env.FLOW_TESTNET_RPC;

if (!ETH_SEPOLIA_RPC || !BASE_SEPOLIA_RPC || !FLOW_TESTNET_RPC) {
  throw new Error("Missing required RPC endpoints in environment variables");
}

export const publicClient = [
  createPublicClient({
    chain: mainnet,
    transport: http(), 
  }),
  createPublicClient({
    chain: sepolia,
    transport: http(ETH_SEPOLIA_RPC),
    batch: {
      multicall: true,
    },
  }),
  createPublicClient({
    chain: baseSepolia,
    transport: http(BASE_SEPOLIA_RPC),
    batch: {
      multicall: true,
    },
  }),
  createPublicClient({
    chain: flowTestnet,
    transport: http(FLOW_TESTNET_RPC),
    batch: {
      multicall: true,
    },
  }),
] as const;

export const enum ChainIndex {
  MAINNET = 0,
  SEPOLIA = 1,
  BASE_SEPOLIA = 3,
}