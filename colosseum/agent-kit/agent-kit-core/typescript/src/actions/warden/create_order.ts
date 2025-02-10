import { WardenAction } from "./warden_action";
import { createPublicClient, http, createWalletClient, Account } from "viem";
import { z } from "zod";
import { primaryChain } from "../../utils/chains";
import { KNOWN_CONTRACTS } from "../../utils/contracts/constants/known";
import wardenPrecompileAbi from "../../utils/contracts/abi/wardenPrecompileAbi";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

if (!wardenContract?.address) {
    throw new Error("Warden contract address not found");
}

const CREATE_ORDER_PROMPT = `This tool should be called when a user wants to create a new order.`;

/**
 * Input schema for create order action.
 */
export const CreateOrderInput = z.object({});

/**
 * Creates a new order in the marketplace.
 *
 * @param account - The account creating the order.
 * @param args - The input arguments for the action.
 * @returns A message containing the order creation status.
 */
export async function createOrder(
    account: Account,
    args: z.infer<typeof CreateOrderInput>
): Promise<string> {
    try {
        return `Feature coming soon! Keep an eye out for updates.`;
    } catch (error) {
        return `Error creating order: ${error}`;
    }
}

/**
 * Create order action.
 */
export class CreateOrderAction
    implements WardenAction<typeof CreateOrderInput>
{
    public name = "create_order";
    public description = CREATE_ORDER_PROMPT;
    public schema = CreateOrderInput;
    public function = createOrder;
}
