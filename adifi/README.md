# Adifi - AI-Powered Uniswap Trading Assistant

Adifi is an intelligent trading assistant that provides real-time analysis and recommendations for Uniswap pools. Built with AI technology powered by Claude 3 Sonnet, it helps traders make informed decisions by analyzing pool metrics and market conditions.

## Features

- 🤖 AI-powered trading analysis
- 📊 Real-time Uniswap pool metrics
- 💡 Smart trading recommendations
- ⚠️ Risk assessment and warnings
- 🎯 Entry, exit, and stop-loss suggestions

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Express.js + Node.js
- AI: Anthropic's Claude 3 + LangChain
- DeFi: Uniswap + The Graph Protocol
- Infrastructure: Vercel

## Prerequisites

- Node.js 18.x
- npm 8.x or higher
- An Anthropic API key
- A Graph Protocol API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd examples/typescript/cli-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
GRAPH_API_KEY=your_graph_api_key
```

## Running Locally

1. Start the development server:
```bash
npm run dev
```
This will start both the frontend and backend servers concurrently.

Or start them separately:
```bash
# Terminal 1 - Start API server
npm run dev:server

# Terminal 2 - Start frontend
npm run dev:web
```

2. Open your browser and navigate to:
- Frontend: http://localhost:5173
- API: http://localhost:3001

## Usage Guide

1. **Basic Query**
   - Enter a Uniswap pool address in the chat
   - Example: "Analyze the trading setup for the ETH/USDC pool at 0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"

2. **Understanding Responses**
   The AI will provide:
   - Market Analysis
   - Trading Recommendation (Buy/Sell/Hold)
   - Entry Price
   - Stop Loss Level
   - Take Profit Target
   - Confidence Level
   - Risk Warning

3. **Example Queries**
   - "Should I enter a position in the ETH/USDC pool now?"
   - "What's the current market condition for the USDC/ETH pool?"
   - "Analyze the trading setup for [pool address]"

## Production Build

To create a production build:
```bash
npm run build
npm run preview
```

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude 3
- `GRAPH_API_KEY`: Your Graph Protocol API key
- `VITE_API_URL`: API URL for production (set automatically)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

This tool provides trading analysis and suggestions based on AI interpretations of market data. All trading decisions should be made with careful consideration of your own research and risk tolerance. This is not financial advice.

## License

This project is licensed under the Apache-2.0 License - see the LICENSE file for details.

## Support

From Latam to the world 🌎

For support, please open an issue in the repository or contact the development team.