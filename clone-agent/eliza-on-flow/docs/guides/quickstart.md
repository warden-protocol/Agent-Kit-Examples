---
sidebar_position: 2
---

# Quickstart Guide

## Prerequisites

Before getting started with Eliza, ensure you have:

- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (using [nvm](https://github.com/nvm-sh/nvm) is recommended)
- [pnpm 9+](https://pnpm.io/installation)
- Git for version control
- A code editor ([VS Code](https://code.visualstudio.com/), [Cursor](https://cursor.com/) or [VSCodium](https://vscodium.com) recommended)
- [Flow-cli](https://developers.flow.com/tools/flow-cli) for Flow blockchain interaction.

> **Note for Windows Users:** [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install-manual) is required.

## Installation

ElizaOnFlow is a Flow-dedicated Eliza extension, so:

- The plugins from this repository are also compatible with the origin [Eliza](https://github.com/elizaOs/eliza).
- You can also use any plugins from origin Eliza in this repository.

```bash
# Clone the repository, with origin Eliza as submodule
git clone --recurse-submodules https://github.com/fixes-world/elizaOnFlow.git

# Enter directory
cd elizaOnFlow

# If you already cloned without submodules, please run:
git submodule update --init --recursive
```

<!--
> **Note:** This project iterates fast, so we recommend checking out the latest release.

```bash
# Checkout the latest release
git checkout $(git describe --tags --abbrev=0)
``` -->

Install dependencies

```bash
pnpm install --no-frozen-lockfile
```

> **Note:** Please only use the `--no-frozen-lockfile` option when you're initially instantiating the repo or are bumping the version of a package or adding a new package to your package.json. This practice helps maintain consistency in your project's dependencies and prevents unintended changes to the lockfile.

Install Flow Cadence contracts dependencies

```bash
flow deps install
```

Build the local libraries

```bash
pnpm build
```

## Configure Environment

Copy .env.example to .env and fill in the appropriate values.

```bash
cp .env.example .env
```

> **Note:** `.env` is optional. If you're planning to run multiple distinct agents, you can pass secrets through the character JSON. But the following guide will use `.env` as example.

Edit `.env` and add your values. Do NOT add this file to version control.

### Choose Your Model

Eliza supports multiple AI models and you set which model to use inside the character JSON file.
But remember, once you chosed a model, you need to set up the relevent configuration.

Check full list of supported LLMs in origin Eliza: [Models.ts](https://github.com/elizaOS/eliza/blob/main/packages/core/src/models.ts)

Suggested models:

- Use API to access LLM providers
  - OpenAI: set modelProvider as `openai`, and set `OPENAI_API_KEY` in `.env`
  - Deepseek: set modelProvider as `deepseek`, and set `DEEPSEEK_API_KEY` in `.env`
  - Grok: set modelProvider as `grok`, and set `GROK_API_KEY` in `.env`
- Use local inference
  - Ollama: set modelProvider as `ollama`, and set `OLLAMA_MODEL` in `.env` to the model name you are using in ollama.

> To choose model, you need to set in charactor configuration. For example: OPENAI, please set `modelProvider: "openai"` in charactor JSON file or `modelProvider: ModelProviderName.OPENAI` in `charactor.ts`

### Setup Agent's Flow Account

Create a new Flow account for the Agent, [doc](https://developers.flow.com/tools/flow-cli/accounts/create-accounts)

```bash
flow accounts create
```

Set Flow blockchain configuration in `.env` with new generated Flow account.

```bash
FLOW_ADDRESS=
FLOW_PRIVATE_KEY=
FLOW_NETWORK=       # Default: mainnet
FLOW_ENDPOINT_URL=  # Default: <https://mainnet.onflow.org>
```

## Create Your First Agent

### **Create a Character File**

Check out the `deps/eliza/characters/` directory for a number of character files to try out.
Additionally you can override Eliza's `defaultCharacter` by editting [charactor.ts](../../agent/src/character.ts) which will be default used if no character json provided.

Copy one of the example character files and make it your own

```bash
cp deps/eliza/characters/sbf.character.json characters/deep-thought.character.json
```

📝 [Character Documentation](https://elizaos.github.io/eliza/docs/core/characterfile/)

### **Start the Agent**

Inform it which character you want to run:

```bash
pnpm start --character="characters/deep-thought.character.json"
```

Or you can use `pnpm start:debug` for more debugging logs.

```bash
pnpm start:debug --character="characters/deep-thought.character.json"
```

You can load multiple characters with a comma-separated list:

```bash
pnpm start --characters="characters/deep-thought.character.json, deps/eliza/characters/sbf.character.json"
```

#### Additional Requirements

You may need to install Sharp. If you see an error when starting up, try installing it with the following command:

```bash
pnpm install --include=optional sharp
```

### **Interact with the Agent**

Now you're ready to start a conversation with your agent.

Open a new terminal window and run the client's http server.

```bash
pnpm start:client
```

Once the client is running, you'll see a message like this:

```bash
➜  Local:   http://localhost:5173/
```

Simply click the link or open your browser to `http://localhost:5173/`. You'll see the chat interface connect to the system, and you can begin interacting with your character.

## Social Platform Integration

You can also connect your agent to social platforms like Twitter, Discord, and Telegram.

For example, connect with X (Twitter) by using `@elizaos/client-twitter`:

- change `"clients": []` to `"clients": ["twitter"]` in the character file to connect with X

For more details, please check the orgin Eliza's [Platform Integration](https://elizaos.github.io/eliza/docs/quickstart/#platform-integration)

## Common Issues & Solutions

Please check the orgin Eliza's [Common Issues & Solutions](https://elizaos.github.io/eliza/docs/quickstart/#common-issues--solutions)
