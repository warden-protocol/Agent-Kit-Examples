import { ethers } from 'ethers';
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import { PaymentResult } from '../../config/types';

export class PaymentProcessor {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private wardenToolkit: WardenToolkit;
    private tools: any[];

    constructor(privateKey: string) {
        if (!process.env.RPC_URL) {
            throw new Error('RPC_URL not set in environment variables');
        }

        // Setup blockchain connection
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.wallet = new ethers.Wallet(privateKey, this.provider);

        // Setup Warden toolkit for price fetching
        const agentKit = new WardenAgentKit({
            privateKeyOrAccount: privateKey as `0x${string}`
        });
        this.wardenToolkit = new WardenToolkit(agentKit as any);
        this.tools = this.wardenToolkit.getTools();
    }

    async processPayment(to: string, amountUSD: number): Promise<PaymentResult> {
        try {
            // Get current ETH price and calculate amount
            const ethAmount = await this.convertUSDtoETH(amountUSD);
            console.log(`Converting $${amountUSD} to ${ethAmount} ETH`);
            
            const tx = await this.wallet.sendTransaction({
                to,
                value: ethers.parseEther(ethAmount.toString()),
                gasLimit: 21000
            });

            const receipt = await tx.wait();
            
            return {
                success: true,
                transactionHash: receipt?.hash
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private async convertUSDtoETH(usdAmount: number): Promise<number> {
        try {
            // Get the price tool
            const tool = this.tools.find(t => t.name === 'get_price');
            if (!tool) throw new Error('get_price tool not found');

            // Get current ETH price in USD
            console.log('Calling get_price tool...');
            const response = await tool.call({ symbol: 'ETH' });
            console.log('Raw price response:', response);

            // Parse the response more carefully
            let ethPrice: number;
            if (typeof response === 'string') {
                // Try different parsing approaches
                const priceMatch = response.match(/\$?([\d,]+\.?\d*)/);
                if (priceMatch) {
                    ethPrice = parseFloat(priceMatch[1].replace(',', ''));
                } else {
                    throw new Error(`Unable to parse price from response: ${response}`);
                }
            } else if (typeof response === 'number') {
                ethPrice = response;
            } else {
                throw new Error(`Unexpected response type: ${typeof response}`);
            }

            if (isNaN(ethPrice) || ethPrice <= 0) {
                throw new Error(`Invalid ETH price: ${ethPrice}`);
            }

            console.log('Parsed ETH price:', `$${ethPrice}`);
            
            // Calculate ETH amount
            const ethAmount = usdAmount / ethPrice;
            console.log('Calculated ETH amount:', ethAmount);
            
            // Round to 6 decimal places for precision
            return Number(ethAmount.toFixed(6));
        } catch (error) {
            console.error('Error getting ETH price:', error);
            console.error('Error details:', {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined
            });
            throw new Error('Failed to convert USD to ETH');
        }
    }
} 