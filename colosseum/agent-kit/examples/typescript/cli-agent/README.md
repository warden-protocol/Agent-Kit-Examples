# Warden Agent Kit Langchain Extension Example - CLI Agent

A terminal agent with access to the full set of Warden Agent Kit actions.

## Requirements

-   [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)
-   Node.js 18+

## Installation

```bash
npm install
```

## Run the agent

### Set ENV Vars

-   Ensure the following ENV Vars are set:

```bash
export PRIVATE_KEY=<your-wallet-private-key>
export OPENAI_API_KEY=<your-openai-api-key>
export FAUCET_TOKEN=<faucet-token>  # Optional: Only required if you are using the faucet tool
```

```bash
npm start
```
