let agentInstance = null;
let agentConfig = null;
let agentTools = null;

export function setAgent(agent, config, tools) {
    agentInstance = agent;
    agentConfig = config;
    agentTools = tools;
}

export function getAgent() {
    if (!agentInstance) {
        throw new Error("Agent is not initialized yet.");
    }
    return { agent: agentInstance, config: agentConfig, tools: agentTools };
}
