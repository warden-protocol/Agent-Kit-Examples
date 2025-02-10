import { StructuredToolInterface, BaseToolkit } from "@langchain/core/tools";
import { X_ACTIONS, XAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { XTool } from "./x_tool";

export class WardenToolkit extends BaseToolkit {
    tools: StructuredToolInterface[];

    constructor(agentkit: XAgentKit) {
        super();
        const actions = X_ACTIONS;
        const tools = actions.map((action) => new XTool(action, agentkit));
        this.tools = tools;
    }
}
