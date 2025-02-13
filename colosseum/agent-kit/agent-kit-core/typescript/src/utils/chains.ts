import { defineChain, type Chain } from "viem";
import * as chains from "viem/chains";

// Chain IDs as constants for type safety and reusability
export const CHAIN_IDS = {
    WARDEN_CHIADO: 10010,
    WARDEN_DEVNET: 12345,
} as const;

/**
 * Warden Protocol's Chiado testnet configuration
 */
export const wardenChiado = defineChain({
    id: CHAIN_IDS.WARDEN_CHIADO,
    name: "Warden Chiado",
    network: "chiado",
    nativeCurrency: { name: "Ward", symbol: "WARD", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://evm.chiado.wardenprotocol.org"],
        },
    },
});

/**
 * Warden Protocol's development network configuration
 */
export const wardenDevnet = defineChain({
    id: CHAIN_IDS.WARDEN_DEVNET,
    name: "Warden Devnet",
    network: "devnet",
    nativeCurrency: { name: "Ward", symbol: "WARD", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://evm.devnet.wardenprotocol.org"],
        },
    },
});

// Create a type-safe lookup object for chains by ID
const chainsByID = new Map<number, Chain>([
    ...Object.entries(chains).map(([_, chain]) => [chain.id, chain] as const),
    [wardenChiado.id, wardenChiado],
    [wardenDevnet.id, wardenDevnet],
]);

/**
 * Get chain configuration by chain ID
 */
export const getChainById = (id: number): Chain | undefined =>
    chainsByID.get(id);

/**
 * List of enabled chains for the application
 */
export const enabledChains: [Chain, ...Chain[]] = [
    wardenChiado,
    wardenDevnet,
    chains.mainnet,
    chains.sepolia,
];

/**
 * Primary chain for the application, determined by environment
 */
export const primaryChain =
    process.env.PRIMARY_CHAIN === "chiado" ? wardenChiado : wardenDevnet;
