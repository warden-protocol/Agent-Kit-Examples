import { WardenAction } from "./warden_action";
import { createPublicClient, http } from "viem";
import { z } from "zod";
import wardenPrecompileAbi from "../../utils/contracts/abi/wardenPrecompileAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";
import { DEFAULT_PAGINATION } from "../../utils/contracts/constants/common";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

const GET_KEYCHAINS_PROMPT = `This tool should be called when a user wants to get all the available keychains.`;

interface Keychain {
    id: bigint;
    name: string;
    description: string;
}

const publicClient = createPublicClient({
    chain: primaryChain,
    transport: http(),
});

/**
 * Input schema for get keychains action.
 */
export const GetKeychainsInput = z.object({});

/**
 * Gets all the available keychains.
 *
 * @returns A message containing the keychains information.
 */
export async function getKeychains(): Promise<string> {
    if (!wardenContract?.address) {
        throw new Error("Warden contract address not found");
    }

    try {
        const data = await publicClient.readContract({
            address: wardenContract.address,
            args: [DEFAULT_PAGINATION],
            abi: wardenPrecompileAbi,
            functionName: "keychains",
        });

        if (!data?.[0] || !Array.isArray(data[0])) {
            throw new Error("Invalid response from contract");
        }

        const keychains = data[0] as Keychain[];

        const formattedList = keychains
            .map(
                (keychain) =>
                    `• ID: ${keychain.id.toString()} - Name: ${
                        keychain.name
                    } - Description: ${keychain.description}`
            )
            .join("\n");

        return `Available Keychains:\n\n${formattedList}`;
    } catch (error) {
        throw new Error(
            `Failed to fetch keychains: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

/**
 * Get keychains action.
 */
export class GetKeychainsAction
    implements WardenAction<typeof GetKeychainsInput>
{
    public name = "get_keychains";
    public description = GET_KEYCHAINS_PROMPT;
    public schema = GetKeychainsInput;
    public function = getKeychains;
}
