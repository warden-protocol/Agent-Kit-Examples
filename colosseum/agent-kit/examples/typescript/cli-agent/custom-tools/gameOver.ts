import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http } from "viem";
import { contract_address } from "./address";

// Zod schema for input validation (empty in this case)
export const getGameOverInput = z.object({});

/**
 * Fetches the gameOver status from the contract.
 *
 * @param args - The input arguments (currently none required).
 * @returns A message containing the gameOver status.
 */
export async function getGameOver(
    args: z.infer<typeof getGameOverInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: chains.sepolia,
            transport: http(),
        });

        // Read the `gameOver` from the contract
        const data: boolean = await publicClient.readContract({
            address: contract_address, // Contract address
            abi: wagmiAbi,  // ABI
            functionName: 'gameOver',  // Contract function to read
        });

        // Return the game over status
        return `Game over: ${data}`;
    } catch (error) {
        throw new Error(`Failed to fetch game over status`);
    }
}


