import { WardenAction } from "./warden_action";
import { Account, createPublicClient, http } from "viem";
import { z } from "zod";
import wardenPrecompileAbi from "../../utils/contracts/abi/wardenPrecompileAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";
import { DEFAULT_PAGINATION } from "../../utils/contracts/constants/common";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

const GET_SPACES_PROMPT = `This tool should be called when a user wants to get all their spaces.`;

/**
 * Input schema for get spaces action.
 */
export const GetSpacesInput = z.object({});

/**
 * Gets spaces for a given account.
 *
 * @param account - The account to get the spaces for.
 * @returns A message containing the spaces information.
 */
export async function getSpaces(
    account: Account,
    args: z.infer<typeof GetSpacesInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: primaryChain,
            transport: http(),
        });

        if (!wardenContract?.address) {
            throw new Error("Warden contract address not found");
        }

        const data = await publicClient.readContract({
            address: wardenContract.address,
            args: [DEFAULT_PAGINATION, account.address],
            abi: wardenPrecompileAbi,
            functionName: "spacesByOwner",
        });

        return `These are all the spaces:\n\n${data[0].map(
            (space) => `- ${space.id.toString()}\n`
        )}`;
    } catch (error) {
        return `Error getting spaces: ${error}`;
    }
}

/**
 * Get spaces action.
 */
export class GetSpacesAction implements WardenAction<typeof GetSpacesInput> {
    public name = "get_spaces";
    public description = GET_SPACES_PROMPT;
    public schema = GetSpacesInput;
    public function = getSpaces;
}
