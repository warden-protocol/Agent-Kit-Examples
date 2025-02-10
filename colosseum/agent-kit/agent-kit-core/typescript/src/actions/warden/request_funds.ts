import { WardenAction } from "./warden_action";
import { Account } from "viem";
import { z } from "zod";
import { primaryChain } from "../../utils/chains";
import converter from "bech32-converting";

const REQUEST_FUNDS_PROMPT = `This tool should be called when a user wants to request tokens from the faucet.`;

export const RequestFundsInput = z.object({});

/**
 * Requests funds from the faucet for a specific key ID.
 *
 * @param args - The input arguments for the action.
 * @returns A message indicating the request status.
 */
export async function requestFunds(
    account: Account,
    args: z.infer<typeof RequestFundsInput>
): Promise<string> {
    const faucetURL = `https://fapi.${
        primaryChain.network
    }.wardenprotocol.org/request/${converter("warden").toBech32(
        account.address
    )}`;
    try {
        const response = await fetch(faucetURL, {
            method: "GET",
            headers: {
                token: process.env.FAUCET_TOKEN ?? "",
            },
        });

        if (!response.ok) {
            throw new Error(`Faucet request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return `Faucet request completed: ${data.txHash}`;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to request tokens from faucet: ${errorMessage}`
        );
    }
}

/**
 * Request funds action.
 */
export class RequestFundsAction
    implements WardenAction<typeof RequestFundsInput>
{
    public name = "request_funds";
    public description = REQUEST_FUNDS_PROMPT;
    public schema = RequestFundsInput;
    public function = requestFunds;
}
