# Warden Agent Kit Extension - Langchain

The **Warden Agent Kit Extension - Langchain** is a powerful package designed to integrate the capabilities of Langchain into the Warden Agent Kit. This extension enables developers to build, deploy, and manage intelligent agents that leverage natural language processing (NLP) and language models (LLMs) for advanced decision-making and automation.

This package is part of the broader **Warden Agent Kit**, a suite of tools for building autonomous agents and decentralized applications. The Langchain extension provides seamless integration with Langchain's ecosystem, allowing developers to harness the power of language models in their Warden-based applications.

---

## Features

-   **Langchain Integration**: Easily integrate Langchain's language models and NLP tools into your Warden Agent Kit projects.
-   **Pre-built Tools**: Includes pre-built tools and utilities for common Warden Protocol releated tasks.
-   **Agent Orchestration**: Combine Langchain and Warden Protocol capabilities for advanced multi-agent systems.
-   **Extensible Architecture**: Designed to be modular and extensible, allowing developers to add custom functionality as needed.

---

### Prerequisites

-   [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)
-   Node.js 18 or higher

## Installation

To install the Warden Agent Kit Extension - Langchain, use the following command:

```bash
npm install @wardenprotocol/warden-langchain @langchain/openai @langchain/langgraph
```

Or, if you're using Yarn:

```bash
yarn add @wardenprotocol/warden-langchain @langchain/openai @langchain/langgraph
```

### Environment Setup

Set the following environment variables:

```bash
export PRIVATE_KEY=<your-wallet-private-key>
export OPENAI_API_KEY=<your-openai-api-key>
export FAUCET_TOKEN=<faucet-token>  # Optional: Only required if you are using the faucet tool
```

---

## Quick Start

### 1. Import the Packages

```javascript
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
```

### 2. Initialize the Agent Kit

```javascript
// Configure Warden Agent Kit
const config = {
    privateKeyOrAccount:
        (process.env.PRIVATE_KEY as `0x${string}`) || undefined,
};

// Initialize Warden Agent Kit
const agentkit = new WardenAgentKit(config);

// Initialize Warden Agent Kit Toolkit and get tools
const wardenToolkit = new WardenToolkit(agentkit);
const tools = wardenToolkit.getTools();
```

### 3. Use Langchain Tools in Your Agent

```javascript
// Initialize LLM
const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
});

// Store buffered conversation history in memory
const memory = new MemorySaver();
const agentConfig = {
    configurable: { thread_id: "Warden Agent Kit CLI Agent Example!" },
};

// Create React Agent using the LLM and Warden Agent Kit tools
const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier:
        "You're a helpful assistant that can help with a variety of tasks related to web3 tranactions." +
        "You should only use the provided tools to carry out tasks, interperate the users input" +
        "and select the correct tool to use for the required tasks or tasks.",
});

return { agent, config: agentConfig };
```

---

## Examples

### TODO: Add links and explainers to examples here

---

## Documentation

For detailed documentation, including API references, tutorials, and advanced usage, visit the [Warden Agent Kit Documentation](https://docs.warden-protocol.org/agent-kit). TODO: replace with correct link

---

## Contributing

We welcome contributions from the community! If you'd like to contribute to the Warden Agent Kit Extension - Langchain, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

For more information, see our [Contributing Guidelines](https://github.com/warden-protocol/agent-kit/blob/main/CONTRIBUTING.md).

---

## Support

For support, questions, or feature requests, please open an issue on the [GitHub repository](https://github.com/warden-protocol/agent-kit/issues) or join our [community Discord](https://discord.gg/warden-protocol).

---

Happy coding! 🚀
