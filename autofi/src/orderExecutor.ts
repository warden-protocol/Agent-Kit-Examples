import { ethers } from 'ethers';
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit } from "@wardenprotocol/warden-langchain";
import { getTokenPrice } from './getTokenPrice';
import { predictFuturePrice } from './pricePrediction';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configuration interface
interface OrderConfig {
    upperThreshold: number;  // Percentage above current price to trigger sell
    lowerThreshold: number;  // Percentage below current price to trigger buy
    tradeSizeETH: number;    // ETH amount per trade
    cooldownMinutes: number; // Minimum time between trades
}

export class OrderExecutor {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private agentKit: WardenAgentKit;
    private lastTradeTime: number = 0;
    private config: OrderConfig;
    private tokenSymbol: string;

    constructor(
        tokenSymbol: string,
        config: OrderConfig,
        privateKey: string,
        rpcUrl: string
    ) {
        this.tokenSymbol = tokenSymbol;
        this.config = config;
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.agentKit = new WardenAgentKit({
            privateKeyOrAccount: privateKey as `0x${string}`
        });
    }

    async initialize(): Promise<void> {
        console.log('Initializing Order Executor...');
        await this.verifyBalances();
    }

    private async verifyBalances(): Promise<void> {
        const balance = await this.provider.getBalance(this.wallet.address);
        console.log(`Initial ETH Balance: ${ethers.formatEther(balance)}`);
    }

    async monitorPrices(): Promise<void> {
        try {
            if (this.isInCooldown()) {
                console.log('System in cooldown period');
                return;
            }

            const [currentPrice] = await Promise.all([
                getTokenPrice(this.tokenSymbol),
            ]);

            const [predictedPrice] = await Promise.all([
                predictFuturePrice(this.tokenSymbol)
            ]);    
            console.log(`Predicted Price: $${predictedPrice}`);

            const priceRatio = (predictedPrice / currentPrice - 1) * 100;
            console.log(`Price Change Prediction: ${priceRatio.toFixed(2)}%`);

            if (priceRatio >= this.config.upperThreshold) {
                await this.executeSellOrder();
                this.lastTradeTime = Date.now();
            } else if (priceRatio <= -this.config.lowerThreshold) {
                await this.executeBuyOrder();
                this.lastTradeTime = Date.now();
            }
        } catch (error) {
            console.error('Price monitoring error:', error);
        }
    }

    private async executeBuyOrder(): Promise<void> {
        console.log('\n🚀 Executing BUY order');
        const ethAmount = this.config.tradeSizeETH;
        
        try {
            const tx = {
                to: process.env.TREASURY_ADDRESS,
                value: ethers.parseEther(ethAmount.toString()),
                gasLimit: 21000
            };

            console.log('Transaction Details:', tx);
            const txResponse = await this.wallet.sendTransaction(tx);
            console.log('Transaction sent. Waiting for confirmation...');

            const receipt = await txResponse.wait();
            if (!receipt) {
                throw new Error('Transaction failed: No receipt received');
            }
            console.log('Transaction confirmed:', receipt);
            console.log('\nansaction sent:', txResponse.hash);

            await this.logTrade('BUY', ethAmount, txResponse, receipt);
            // await this.updateWardenActivity('BUY', ethAmount);
        } catch (error) {
            console.error('Buy order failed:', error);
        }
    }

    private async executeSellOrder(): Promise<void> {
        console.log('Executing SELL order');
        try {
            const simulatedTxResponse = {
                hash: `0x${Math.random().toString(16).slice(2)}`,
                from: this.wallet.address,
                to: process.env.TREASURY_ADDRESS || '',
                nonce: Date.now(),
            } as ethers.TransactionResponse;
    
            const simulatedReceipt = {
                blockNumber: await this.provider.getBlockNumber(),
                blockHash: ethers.id(Date.now().toString()),
                transactionIndex: 0,
                gasUsed: 21000n,
                effectiveGasPrice: ethers.parseUnits('20', 'gwei'),
                status: 1,
                from: this.wallet.address,
                to: process.env.TREASURY_ADDRESS || '',
            } as unknown as ethers.TransactionReceipt;
    
            await this.logTrade('SELL', this.config.tradeSizeETH, simulatedTxResponse, simulatedReceipt);
            // await this.updateWardenActivity('SELL', this.config.tradeSizeETH);
            console.log('Sell order simulated');
        } catch (error) {
            console.error('Sell order failed:', error);
        }
    }

    private async logTrade(action: string, amount: number, txResponse: ethers.TransactionResponse, receipt?: ethers.TransactionReceipt | null): Promise<void> {
        const tradeLog = {
            timestamp: new Date().toISOString(),
            action,
            amount,
            token: this.tokenSymbol,
            txHash: txResponse.hash,
            receipt: receipt ? {
                blockNumber: receipt.blockNumber,
                blockHash: receipt.blockHash,
                gasUsed: receipt.gasUsed.toString(),
                status: receipt.status === 1 ? 'SUCCESS' : 'FAILED',
                from: receipt.from,
                to: receipt.to
            } : null
        };
    
        const logPath = path.join(__dirname, '../data/trades.json');
        
        // Ensure the directory exists
        const logDir = path.dirname(logPath);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    
        const trades = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];
        trades.push(tradeLog);
        
        // Write with pretty formatting and ensure atomic write
        const tempLogPath = `${logPath}.tmp`;
        fs.writeFileSync(tempLogPath, JSON.stringify(trades, null, 2));
        fs.renameSync(tempLogPath, logPath);
    }


    private isInCooldown(): boolean {
        const elapsed = Date.now() - this.lastTradeTime;
        return elapsed < (this.config.cooldownMinutes * 60 * 1000);
    }
}

// Configuration
const DEFAULT_CONFIG: OrderConfig = {
    upperThreshold: 2.5,    // Trigger sell at 2.5% above current price
    lowerThreshold: 0.5,    // Trigger buy at 0.5% below current price
    tradeSizeETH: 0.0001,  // Trade 0.0001 ETH per transaction
    cooldownMinutes: 5     // 5 minutes between trades
};

// Initialize in main application
export async function startTradingBot() {
    if (!process.env.PRIVATE_KEY || !process.env.RPC_URL) {
        throw new Error('Missing required environment variables');
    }

    const executor = new OrderExecutor(
        'ETH',
        DEFAULT_CONFIG,
        process.env.PRIVATE_KEY,
        process.env.RPC_URL
    );

    await executor.initialize();
    
    // Run every 5 minutes
    setInterval(() => executor.monitorPrices(), 20000);
    console.log('🔄 Automated trading bot started');
}