// src/services/payments/processor.ts
import { ethers } from 'ethers';
import { SendTokenInput } from '../../services/email/types';

export class PaymentProcessor {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;

    constructor(privateKey: string) {
        if (!process.env.RPC_URL) {
            throw new Error('RPC_URL not set in environment variables');
        }
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
    }

    async sendPayment(to: string, amount: number): Promise<string> {
        try {
            const transaction = {
                to,
                value: ethers.parseEther(amount.toString()),
                gasLimit: 21000, // Standard gas limit for simple ETH transfers
            };

            console.log('\nTransaction Details:', transaction);

            const txResponse = await this.wallet.sendTransaction(transaction);
            console.log('Transaction sent. Waiting for confirmation...');

            const receipt = await txResponse.wait();
            if (!receipt) {
                throw new Error('Transaction failed: No receipt received');
            }
            console.log('Transaction confirmed:', receipt);

            if (receipt.status !== 1) {
                throw new Error('Transaction failed. Receipt status: ' + receipt.status);
            }

            return `Successfully sent ${amount} ETH to ${to}. Transaction Hash: ${receipt.hash}`;
        } catch (error) {
            console.error('Error in sendPayment:', error);
            throw error;
        }
    }
}