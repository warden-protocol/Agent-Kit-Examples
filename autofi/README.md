# AI-Powered DeFi Trading Agent

An AI-powered decentralized finance (DeFi) trading agent that automates buy/sell decisions and executes trades using the Warden Protocol for secure transaction signing. Built with TypeScript, this agent leverages real-time price data, historical trends, and predictive analytics to make informed trading decisions.

---

## Features

- **AI-Driven Decision Making**:
  - Fetches real-time token prices using Warden's `get_price` tool.
  - Predicts future price movements using a linear regression model.
  - Executes trades based on predefined thresholds.

- **Warden Protocol Integration**:
  - Securely signs transactions using Warden's key management system.
  - Utilizes Warden's `get_spaces` tool for transaction authorization.
  - Ensures secure and permissioned access to trading operations.

- **Sepolia Testnet Deployment**:
  - Fully operational on the Sepolia Ethereum testnet.
  - Uses testnet tokens and ETH for safe experimentation.
  - Comprehensive logging and error handling for debugging.

- **Modular and Extensible Design**:
  - Built in TypeScript for type safety and scalability.
  - Modular architecture for easy integration of new strategies or protocols.
  - Includes utilities for price fetching, space management, and transaction processing.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- Sepolia testnet ETH .
- RPC URL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vnitin08/agent-kit-examples.git
   cd autofi
2. Install dependencies:
   ```bash
    yarn install
    # or
    npm install
3. Set up environment variables:
Create a .env file in the root directory:
    ```bash
    PRIVATE_KEY
    RPC_URL
    KEY_ID

## Usage

### Fetching Token Prices

To fetch the current price of a token:
    
    import { getTokenPrice } from './getTokenPrice';
  
    const price = await getTokenPrice('ETH');
    console.log(`Current ETH price: $${price}`);

### Predicting Future Prices

To predict the future price of a token:
    
    import { predictFuturePrice } from './pricePrediction';

    const predictedPrice = await predictFuturePrice('ETH');
    console.log(`Predicted ETH price: $${predictedPrice}`);

# 🔐 Role of Warden Protocol

Warden Protocol provides secure transaction signing and execution for AUTOFI:

Keychain: Stores and manages private keys securely.

Spaces: Enables decentralized, permissionless execution of trade orders.

Automation: Ensures autonomous execution of transactions without user intervention.

# 📜 Future Improvements

✅ Expand AI models for better predictive accuracy

✅ Multi-chain support (Polygon, Arbitrum)

✅ Implement a strategy marketplace for AI-driven trading signals
