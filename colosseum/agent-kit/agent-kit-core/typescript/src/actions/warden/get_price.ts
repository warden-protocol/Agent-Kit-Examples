import { WardenAction } from "./warden_action";
import { createPublicClient, formatUnits, http } from "viem";
import { z } from "zod";
import slinkyPrecompileAbi from "../../utils/contracts/abi/slinkyPrecompileAbi";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import { primaryChain } from "../../utils/chains";

const slinkyContract = KNOWN_CONTRACTS[primaryChain.id]?.SLINKY;

const GET_PRICE_PROMPT = `This tool should be called when a user wants to get the current price of a token using its symbol.`;

const publicClient = createPublicClient({
    chain: primaryChain,
    transport: http(),
});

if (!slinkyContract?.address) {
    throw new Error("Slinky contract address not found");
}

const getPriceBySymbol = async (symbol?: string) => {
    return publicClient.readContract({
        address: slinkyContract.address,
        args: [symbol!, "USD"],
        abi: slinkyPrecompileAbi,
        functionName: "getPrice",
    });
};

/**
 * Input schema for get price action.
 */
export const GetPriceInput = z.object({
    symbol: z.string().describe("The symbol of the token to check price for"),
});

/**
 * Gets price for a specific currency pair ID.
 *
 * @param args - The input arguments for the action.
 * @returns A message containing the price information.
 */
export async function getPrice(
    args: z.infer<typeof GetPriceInput>
): Promise<string> {
    try {
        const priceData = await getPriceBySymbol(args.symbol);

        const price = priceData.price.price;
        const decimals = Number(priceData.decimals);

        const usd =
            price && decimals ? Number(formatUnits(price, decimals)) : 0;

        return `Current price of ${args.symbol}: $${usd.toFixed(2)}`;
    } catch (error) {
        throw new Error(
            `Failed to fetch price for currency pair ${args.symbol}: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

/**
 * Get price action.
 */
export class GetPriceAction implements WardenAction<typeof GetPriceInput> {
    public name = "get_price";
    public description = GET_PRICE_PROMPT;
    public schema = GetPriceInput;
    public function = getPrice;
}
