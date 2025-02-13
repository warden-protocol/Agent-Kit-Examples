import { StructuredToolInterface, BaseToolkit } from "@langchain/core/tools";
import {
    WARDEN_ACTIONS,
    WardenAgentKit,
} from "@wardenprotocol/warden-agent-kit-core";
import { WardenTool } from "./warden_tool";

export class WardenToolkit extends BaseToolkit {
    tools: StructuredToolInterface[];

    constructor(agentkit: WardenAgentKit) {
        super();
        const actions = WARDEN_ACTIONS;
        const tools = actions.map((action) => new WardenTool(action, agentkit));
        this.tools = tools;
    }
}
