import { z } from "zod";
import { Account } from "viem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WardenActionSchemaAny = z.ZodObject<any, any, any, any>;

/**
 * Represents the base structure for Warden Actions.
 */
export interface WardenAction<TActionSchema extends WardenActionSchemaAny> {
    /**
     * Name of the action
     */
    name: string;

    /**
     * Description of what the action does
     */
    description: string;

    /**
     * Schema for validating action arguments
     */
    schema: TActionSchema;

    /**
     * Function to execute for this action
     */
    function:
        | ((account: Account, args: z.infer<TActionSchema>) => Promise<string>)
        | ((args: z.infer<TActionSchema>) => Promise<string>);
}
