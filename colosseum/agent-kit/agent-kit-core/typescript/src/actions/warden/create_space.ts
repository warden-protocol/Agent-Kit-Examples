import { WardenAction } from "./warden_action";
import { Account, createPublicClient, createWalletClient, http } from "viem";
import { z } from "zod";
import wardenPrecompileAbi from "../../utils/contracts/abi/wardenPrecompileAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

const CREATE_SPACE_PROMPT = `This tool should be called when a user wants to create a new space.`;

/**
 * Input schema for create space action.
 */
export const CreateSpaceInput = z.object({});

/**
 * Creates a new space with the given name.
 *
 * @param account - The account creating the space.
 * @returns A message confirming the space creation.
 */
export async function createSpace(
    account: Account,
    args: z.infer<typeof CreateSpaceInput>
): Promise<string> {
    try {
        if (!wardenContract?.address) {
            throw new Error("Warden contract address not found");
        }

        const walletClient = createWalletClient({
            account,
            chain: primaryChain,
            transport: http(),
        });

        const hash = await walletClient.writeContract({
            address: wardenContract.address,
            abi: wardenPrecompileAbi,
            functionName: "newSpace",
            args: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), []],
        });

        const publicClient = createPublicClient({
            chain: primaryChain,
            transport: http(),
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === "success") {
            return `Successfully created space`;
        } else {
            throw new Error("Transaction failed");
        }
    } catch (error) {
        return `Error creating space: ${error}`;
    }
}

/**
 * Create space action.
 */
export class CreateSpaceAction
    implements WardenAction<typeof CreateSpaceInput>
{
    public name = "create_space";
    public description = CREATE_SPACE_PROMPT;
    public schema = CreateSpaceInput;
    public function = createSpace;
}
