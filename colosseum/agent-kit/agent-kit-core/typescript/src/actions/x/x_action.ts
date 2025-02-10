import { z } from "zod";
import { TwitterApi } from "twitter-api-v2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type XActionSchemaAny = z.ZodObject<any, any, any, any>;

/**
 * Represents the base structure for X Actions.
 */
export interface XAction<TActionSchema extends XActionSchemaAny> {
    /**
     * The name of the action.
     */
    name: string;

    /**
     * A description of what the action does
     */
    description: string;

    /**
     * Schema for validating action arguments
     */
    schema: TActionSchema;

    /**
     * The function to execute for this action
     */
    func:
        | ((
              client: TwitterApi,
              args: z.infer<TActionSchema>
          ) => Promise<string>)
        | ((args: z.infer<TActionSchema>) => Promise<string>);
}
