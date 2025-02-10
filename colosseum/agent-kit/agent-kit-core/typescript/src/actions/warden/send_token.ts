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

const SEND_TOKEN_PROMPT = `This tool should be called when a user wants to send tokens to another address. The user must specify the recipient address and the amount of tokens to send.`;

/**
 * Input schema for send token action.
 */
export const SendTokenInput = z.object({
    recipient: z.string(),
    amount: z.number().positive(),
    keyId: z.number().positive(),
});

/**
 * Sends tokens to a specified address.
 *
 * @param account - The account to send tokens from.
 * @param args - The input arguments for the action.
 * @returns A message containing the transaction status.
 */
export async function sendToken(
    account: Account,
    args: z.infer<typeof SendTokenInput>
): Promise<string> {
    try {
        return `Feature coming soon! Keep an eye out for updates.`;
        // const publicClient = createPublicClient({
        //     chain: primaryChain,
        //     transport: http(),
        // });

        // const walletClient = createWalletClient({
        //     account,
        //     chain: primaryChain,
        //     transport: http(),
        // });

        // // Native token transfer
        // const hash = await walletClient.sendTransaction({
        //     to: args.recipient as `0x${string}`,
        //     value: BigInt(args.amount),
        // });

        // const receipt = await publicClient.waitForTransactionReceipt({
        //     hash,
        // });

        // if (receipt.status === "success") {
        //     return `Successfully sent ${args.amount} tokens to ${args.recipient}. Transaction hash: ${receipt.transactionHash}`;
        // } else {
        //     throw new Error("Transaction failed");
        // }
    } catch (error) {
        return `Error sending tokens: ${error}`;
    }
}

/**
 * Send token action.
 */
export class SendTokenAction implements WardenAction<typeof SendTokenInput> {
    public name = "send_token";
    public description = SEND_TOKEN_PROMPT;
    public schema = SendTokenInput;
    public function = sendToken;
}
