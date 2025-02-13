import { WardenAction } from "./warden_action";
import { createPublicClient, formatEther, http } from "viem";
import { z } from "zod";
import wardenPrecompileAbi from "../../utils/contracts/abi/wardenPrecompileAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";
import { sepolia } from "viem/chains";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

const GET_BALANCE_PROMPT = `This tool should be called when a user wants to get the balance of sepolia eth for a specific key.`;

const sepoliaPublicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

const primaryChainPublicClient = createPublicClient({
    chain: primaryChain,
    transport: http(),
});

enum AddressType {
    Unspecified = 0,
    Ethereum = 1,
    Osmosis = 2,
}

const types = [AddressType.Ethereum];

if (!wardenContract?.address) {
    throw new Error("Warden contract address not found");
}

const getKeyById = async (keyId: bigint) => {
    return primaryChainPublicClient.readContract({
        address: wardenContract.address,
        args: [keyId, types],
        abi: wardenPrecompileAbi,
        functionName: "keyById",
    });
};

/**
 * Input schema for get balance action.
 */
export const GetBalanceInput = z.object({
    keyId: z.number().describe("The ID of the key to check balances for"),
});

/**
 * Gets balance for a specific key ID.
 *
 * @param args - The input arguments for the action.
 * @returns A message containing the balance information.
 */
export async function getBalance(
    args: z.infer<typeof GetBalanceInput>
): Promise<string> {
    try {
        const key = await getKeyById(BigInt(args.keyId));

        const balance = await sepoliaPublicClient.getBalance({
            address: key.addresses[0].addressValue as `0x${string}`,
            blockTag: "safe",
        });
        const balanceAsEther = formatEther(balance);

        return `${balanceAsEther} Sepolia ETH`;
    } catch (error) {
        throw new Error(
            `Failed to fetch balance for key ${args.keyId}: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

/**
 * Get balance action.
 */
export class GetBalanceAction implements WardenAction<typeof GetBalanceInput> {
    public name = "get_balance";
    public description = GET_BALANCE_PROMPT;
    public schema = GetBalanceInput;
    public function = getBalance;
}
