import type { Account, Hex } from "viem";
import {
    WardenAction,
    WardenActionSchemaAny,
} from "./actions/warden/warden_action";
import { z } from "zod";
import { privateKeyToAccount } from "viem/accounts";

/**
 * Configuration options for the Warden Agent Kit
 */
interface WardenAgentKitOptions {
    privateKeyOrAccount: Hex | Account;
}

/**
 * Warden Agent Kit
 */
export class WardenAgentKit {
    private account: Account;

    public constructor({ privateKeyOrAccount }: WardenAgentKitOptions) {
        if (typeof privateKeyOrAccount === "string") {
            this.account = privateKeyToAccount(privateKeyOrAccount);
        } else {
            this.account = privateKeyOrAccount;
        }
    }

    async run<TActionSchema extends WardenActionSchemaAny>(
        action: WardenAction<TActionSchema>,
        args: TActionSchema
    ): Promise<string> {
        if (action.function.length > 1) {
            if (!this.account) {
                return `Unable to run Warden Action: ${action.name}. An account is required. Please configure Warden Agent Kit with an account to run this action.`;
            }

            return await action.function(this.account!, args);
        }

        return await (
            action.function as (args: z.infer<TActionSchema>) => Promise<string>
        )(args);
    }
}
