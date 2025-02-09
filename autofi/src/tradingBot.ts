import dotenv from 'dotenv';
import { startTradingBot } from './orderExecutor';

dotenv.config();

async function main() {
    try {
        await startTradingBot();
    } catch (error) {
        console.error('Failed to start trading bot:', error);
        process.exit(1);
    }
}

main();