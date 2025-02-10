import { StructuredTool } from "@langchain/core/tools";
import {
    XAgentKit,
    XAction,
    XActionSchemaAny,
} from "@wardenprotocol/warden-agent-kit-core";
import { z } from "zod";

export class XTool<
    TActionSchema extends XActionSchemaAny
> extends StructuredTool {
    public schema: TActionSchema;
    public name: string;
    public description: string;
    private agentkit: XAgentKit;
    private action: XAction<TActionSchema>;

    constructor(action: XAction<TActionSchema>, agentkit: XAgentKit) {
        super();
        this.action = action;
        this.agentkit = agentkit;
        this.name = action.name;
        this.description = action.description;
        this.schema = action.schema;
    }

    protected async _call(
        input: z.infer<typeof this.schema> & Record<string, unknown>
    ): Promise<string> {
        try {
            let args: any;
            if (this.schema) {
                try {
                    const validatedInput = this.schema.parse(input);
                    args = validatedInput;
                } catch (validationError) {
                    args = input;
                }
            } else {
                args = input;
            }

            return await this.agentkit.run(this.action, args);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return `Error executing ${this.name}: ${error.message}`;
            }
            return `Error executing ${this.name}: Unknown error occurred`;
        }
    }
}
