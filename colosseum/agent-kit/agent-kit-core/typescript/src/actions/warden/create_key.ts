import { WardenAction } from "./warden_action";
import { createPublicClient, http, createWalletClient, Account } from "viem";
import { z } from "zod";
import wardenPrecompileAbi from "../../utils/contracts/abi/wardenPrecompileAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";
import { DEFAULT_EXPRESSION } from "../../utils/contracts/constants/common";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

if (!wardenContract?.address) {
    throw new Error("Warden contract address not found");
}

const publicClient = createPublicClient({
    chain: primaryChain,
    transport: http(),
});

const getSpaceById = async (spaceId: bigint) => {
    return publicClient.readContract({
        address: wardenContract.address,
        args: [spaceId],
        abi: wardenPrecompileAbi,
        functionName: "spaceById",
    });
};

const CREATE_KEY_PROMPT = `This tool should be called when a user wants to create a key. The user must specify the spaceId and keychainId and only one key can be created at a time.`;

/**
 * Input schema for create key action.
 */
export const CreateKeyInput = z.object({
    spaceId: z.number(),
    keychainId: z.number(),
});

/**
 * Creates a new key for a given space.
 *
 * @param account - The account to create the key for.
 * @param args - The input arguments for the action.
 * @returns A message containing the created key information.
 */
export async function createKey(
    account: Account,
    args: z.infer<typeof CreateKeyInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: primaryChain,
            transport: http(),
        });

        const walletClient = createWalletClient({
            account,
            chain: primaryChain,
            transport: http(),
        });

        if (!wardenContract?.address) {
            throw new Error("Warden contract address not found");
        }

        const space = await getSpaceById(BigInt(args.spaceId));

        const hash = await walletClient.writeContract({
            address: wardenContract.address,
            args: [
                BigInt(args.spaceId ?? 0),
                BigInt(args.keychainId ?? 0),
                1, //warden.warden.v1beta3.KeyType.KEY_TYPE_ECDSA_SECP256K1,
                space?.approveSignTemplateId ?? 0,
                space?.rejectSignTemplateId ?? 0,
                [],
                BigInt(space?.nonce ?? 0),
                BigInt(0),
                DEFAULT_EXPRESSION, // TODO: replace with approveTemplate
                DEFAULT_EXPRESSION, // TODO: replace with rejectTemplate
            ],
            abi: wardenPrecompileAbi,
            functionName: "newKeyRequest",
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash,
        });

        if (receipt.status === "success") {
            return `Successfully created key for space ${args.spaceId}. Transaction hash: ${receipt.transactionHash}`;
        } else {
            throw new Error("Transaction failed");
        }
    } catch (error) {
        return `Error creating key: ${error}`;
    }
}

/**
 * Create key action.
 */
export class CreateKeyAction implements WardenAction<typeof CreateKeyInput> {
    public name = "create_key";
    public description = CREATE_KEY_PROMPT;
    public schema = CreateKeyInput;
    public function = createKey;
}
