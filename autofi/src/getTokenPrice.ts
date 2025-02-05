import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Path to the prices.json file
const PRICES_FILE_PATH = path.join(__dirname, '../data/prices.json');

/**
 * Fetches the real-time price of a token using the Warden `get_price` tool.
 * @param tokenSymbol - The symbol of the token (e.g., "ETH", "USDT").
 * @returns The price of the token as a number.
 */
export async function getTokenPrice(tokenSymbol: string): Promise<number> {
    try {
        // Validate environment variables
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('PRIVATE_KEY environment variable is not set');
        }

        const hexPrivateKey = privateKey.slice(2); // Remove 0x prefix
        if (!/^[0-9a-fA-F]{64}$/.test(hexPrivateKey)) {
            throw new Error('Private key must be 64 hexadecimal characters after 0x prefix');
        }

        console.log('Initializing WardenAgentKit...');
        const agentKit = new WardenAgentKit({
            privateKeyOrAccount: privateKey as `0x${string}`
        });

        console.log('Setting up WardenToolkit...');
        const wardenToolkit = new WardenToolkit(agentKit);
        const tools = wardenToolkit.getTools();

        // Find the `get_price` tool
        const getPriceTool = tools.find(tool => tool.name === 'get_price');
        if (!getPriceTool) {
            throw new Error('get_price tool not found');
        }

        console.log(`Fetching price for token: ${tokenSymbol}...`);
        const response = await getPriceTool.call({ symbol: tokenSymbol });

        console.log('\nResponse from Warden:');
        console.log(response);

        // The response will be a string like "Current price of ETH: $2000.00"
        // We need to extract the numeric value
        const priceMatch = response.match(/\$(\d+(\.\d+)?)/);
        if (!priceMatch) {
            throw new Error('Could not parse price from response');
        }

        const price = parseFloat(priceMatch[1]);
        if (isNaN(price)) {
            throw new Error('Invalid price returned from Warden');
        }

        // Store the price in the historical data
        storePriceData(tokenSymbol, price);

        return price;
        
    } catch (error) {
        console.error('\nError fetching token price:');
        if (error instanceof Error) {
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
        } else {
            console.error('Unknown error:', error);
        }
        process.exit(1);
    }
}

/**
 * Stores the fetched price in the historical data.
 * @param tokenSymbol - The symbol of the token (e.g., "ETH", "USDT").
 * @param price - The price of the token.
 */
function storePriceData(tokenSymbol: string, price: number): void {
    try {
        // Read the existing data
        const data = fs.readFileSync(PRICES_FILE_PATH, 'utf-8');
        const pricesData = JSON.parse(data);

        // Add the new price to the historical data
        if (!pricesData[tokenSymbol]) {
            pricesData[tokenSymbol] = [];
        }
        pricesData[tokenSymbol].push({ timestamp: Date.now(), price });

        // Write the updated data back to the file
        fs.writeFileSync(PRICES_FILE_PATH, JSON.stringify(pricesData, null, 2));
        // console.log(`Stored price for ${tokenSymbol}: $${price}`);
    } catch (error) {
        console.error('Error storing price data:', error);
    }
}
