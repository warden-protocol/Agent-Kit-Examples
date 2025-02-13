import { WardenAction } from "./warden_action";
import { createPublicClient, http } from "viem";
import { z } from "zod";
import wardenPrecompileAbi from "../../utils/contracts/abi/wardenPrecompileAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";
import { DEFAULT_PAGINATION } from "../../utils/contracts/constants/common";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

const EMPTY_ARR: any[] = [];

enum AddressType {
    Unspecified = 0,
    Ethereum = 1,
    Osmosis = 2,
}

const GET_KEYS_PROMPT = `This tool should be called when a user wants to get all their keys for a given space.`;

interface GetKeysBySpaceIdRequest {
    pagination?: typeof DEFAULT_PAGINATION;
    spaceId: bigint;
    deriveAddresses?: AddressType[];
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
const writable = <T>(obj: T): Writeable<T> => obj;

export const getKeysBySpaceIdArgs = (request: GetKeysBySpaceIdRequest) => {
    const pagination = request?.pagination ?? DEFAULT_PAGINATION;
    const deriveAddresses =
        request?.deriveAddresses ?? (EMPTY_ARR as AddressType[]);

    return writable([pagination, request.spaceId, deriveAddresses] as const);
};

const publicClient = createPublicClient({
    chain: primaryChain,
    transport: http(),
});

/**
 * Input schema for get keys action.
 */
export const GetKeysInput = z.object({
    spaceId: z.number(),
});

/**
 * Gets keys for a given space.
 *
 * @param args - The input arguments for the action.
 * @returns A message containing the keys information.
 */
export async function getKeys(
    args: z.infer<typeof GetKeysInput>
): Promise<string> {
    try {
        if (!wardenContract?.address) {
            throw new Error("Warden contract address not found");
        }

        const data = await publicClient.readContract({
            address: wardenContract.address,
            args: getKeysBySpaceIdArgs({
                spaceId: BigInt(args.spaceId ?? 0),
                pagination: DEFAULT_PAGINATION,
                deriveAddresses: [AddressType.Ethereum, AddressType.Osmosis],
            }),
            abi: wardenPrecompileAbi,
            functionName: "keysBySpaceId",
        });

        return `These are all the keys:\n\n${data[0].map(
            (key) =>
                `KeyId - ${key.key.id} Key Addresses- ${key.addresses
                    .map((address) => address.addressValue)
                    .join(", ")}\n`
        )}`;
    } catch (error) {
        return `Error getting keys: ${error}`;
    }
}

/**
 * Get keys action.
 */
export class GetKeysAction implements WardenAction<typeof GetKeysInput> {
    public name = "get_keys";
    public description = GET_KEYS_PROMPT;
    public schema = GetKeysInput;
    public function = getKeys;
}
