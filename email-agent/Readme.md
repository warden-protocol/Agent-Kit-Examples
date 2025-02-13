This tutorial will guide you through setting up and running the **Email Treasury Agent**, which monitors a Gmail inbox for payment requests and processes them using the Warden Agent Kit.

## Prerequisites

- Basic understanding of Warden Agent Kit
- Node.js installed (v16 or higher)
- Gmail account with API access configured
- Ethereum wallet private key
- Basic understanding of TypeScript and Solidity

## Step 1: Clone the Repository

```bash
git clone https://github.com/warden-protocol/agent-kit-examples
cd email-treasury-agent
npm install
```

## Step 2: Configure Gmail Authentication

1. Set up Gmail API credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the Gmail API
   - Create OAuth 2.0 credentials
   - Download the credentials.json file

   For detailed instructions, follow the [Gmail API Quickstart Guide](https://developers.google.com/gmail/api/quickstart/nodejs)

2. Place the downloaded `credentials.json` file in your project root directory

## Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
PRIVATE_KEY=your_ethereum_private_key
TREASURY_EMAIL=your_treasury_email@wardenprotocol.org // Replace with your treasury email
RPC_URL=your_ethereum_rpc_url
ETH_ADDRESS=recipient_eth_address
KEY_ID=your_space_id  # Add this line
```

Note: This example assumes `KEY_ID` (space id) and `ETH_ADDRESS` (recipient address) to be static. You can make it dynamic too.

## Step 4: Set Up Your Space

`manager.ts` under onchain checks for spaces. If a space exists, no actions are required. If a space doesn't exist, it will create a new space. You will need to add this `space_id` in `.env`

## Step 5: Run the Agent

### Start the agent

```bash
npx ts-node src/index.ts 
```

The agent will authenticate your email. Please use the same Gmail account as your **treasury email** defined `.env` file.

Once authenticated, you will see the following output on your terminal:

```bash
🚀 Starting Email Treasury Agent
📧 Monitoring inbox: aliasgar.merchant28@gmail.com
💰 Maximum payment: $100
⏰ Cooldown period: 5 minutes
✨ Treasury agent is running...
```

### Send an Email

From your preapproved email domain, (defined in `src/utils/validation.ts`) send an email requesting funds. For example: *Please send $10 for office supplies*

**Note:** *You can also send a pdf as an invoice.*

You should see the following output on your terminal:

```bash
--- New Request ---
From: Ali Merchant <ali@wardenprotocol.org>
Subject: Payment Request
Requested Amount: $10
Timestamp: 2025-01-29T13:08:03.000Z

🔄 Processing Payment
Converting $10 to 0.01 ETH
Recipient Address: 0x0ab9fe066F73d2081e66b32E0D1ac432443dA0DF

Transaction Details: {
  to: '0x0ab9fe066F73d2081e66b32E0D1ac432443dA0DF',
  value: 10000000000000000n,
  gas limit: 21000
}
Transaction sent. Waiting for confirmation...
Transaction confirmed: TransactionReceipt {
  provider: JsonRpcProvider {},
  to: '0x0ab9fe066F73d2081e66b32E0D1ac432443dA0DF',
  from: '0xc00d0c1255883B9c0D8D3a17927F5b8a06802937',
  contractAddress: null,
  hash: '0x60b5dacdd90fd6d381be138902c58b45301371faa26ffa781c67acf10afa56de',
  index: 162,
  blockHash: '0x0375a7296637aefec45c97580a7f6db528358427063843bd35171fdd79ba67c7',
  blockNumber: 7596113,
  logsBloom: '0x000...
  logsBloom: '0x00000...',
  gasUsed: 21000n,
  blobGasUsed: null,
  cumulativeGasUsed: 14660719n,
  gasPrice: 6063438644n,
  blobGasPrice: null,
  type: 2,
  status: 1,
  root: undefined
}

✅ Payment Processed
Successfully sent 0.01 ETH to 0x0ab9fe066F73d2081e66b32E0D1ac432443dA0DF. Transaction Hash: 0x60b5dacdd90fd6d381be138902c58b45301371faa26ffa781c67acf10afa56de

📝 Request recorded in database
--- Request Complete ---
```

## Configuration Options

You can modify the following constants in `src/config/constants.ts`:

```typescript
export const CONSTANTS = {
    MAX_AMOUNT: 100,  // Maximum payment amount in USD
    COOLDOWN_MINUTES: 5  // Cooldown period between requests
};
```

## Security Considerations

1. Keep your private key secure and never commit it to version control
2. Use environment variables for sensitive data
3. Implement proper email domain validation
4. Set appropriate payment limits and cooldown periods
5. Monitor the agent's logs for any suspicious activity

## Troubleshooting

Common issues and solutions:

1. Gmail Authentication Errors:
   - Ensure credentials.json is in the correct location
   - Check if OAuth scope is correctly configured
   - Verify the token.json file is generated after first authentication

2. Transaction Failures:
   - Check RPC URL is valid and responsive
   - Ensure sufficient ETH balance for gas fees
   - Verify recipient address format

3. Space Access Issues:
   - Confirm PRIVATE_KEY has necessary permissions
   - Verify space ID exists and is accessible
   - Check if key ID is correctly configured

## Next Steps

Customize the agent for your needs. Tag @wardenprotocol in your socials and let us know what have you built!
