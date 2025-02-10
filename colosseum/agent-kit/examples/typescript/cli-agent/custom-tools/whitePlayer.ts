import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, Account, Chain, ChainDisconnectedError } from "viem";
import { contract_address } from "./address";

export const getWhitePlayerInput = z.object({});

/**
 * Gets balance for a specific key ID.
 *
 * @param args - The input arguments for the action.
 * @returns A message containing the balance information.
 */
export async function getWhitePlayer(
    args: z.infer<typeof getWhitePlayerInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: chains.sepolia,
            transport: http()
          });
          const data = await publicClient.readContract({
            address: contract_address,
            abi: wagmiAbi,
            functionName: 'whitePlayer',
          })
          return `the address of the whitePlayer ${data}`;
    } catch (error) {
        throw new Error(
            `Failed to fetch the address of the whitePlayer`
        );
    }
}

