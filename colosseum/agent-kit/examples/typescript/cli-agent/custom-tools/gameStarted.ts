import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http } from "viem";
import { contract_address } from "./address";

// Zod schema for input validation (empty in this case)
export const getGameStartedInput = z.object({});

/**
 * Fetches the gameStarted status from the contract.
 *
 * @param args - The input arguments (currently none required).
 * @returns A message containing the gameStarted status.
 */
export async function getGameStarted(
    args: z.infer<typeof getGameStartedInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: chains.sepolia,
            transport: http(),
        });

        // Read the `gameStarted` from the contract
        const data: boolean = await publicClient.readContract({
            address: contract_address, // Contract address
            abi: wagmiAbi,  // ABI
            functionName: 'gameStarted',  // Contract function to read
        });

        // Return the game started status
        return `Game started: ${data}`;
    } catch (error) {
        throw new Error(`Failed to fetch game started status`);
    }
}


