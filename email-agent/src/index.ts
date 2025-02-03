// src/index.ts
import dotenv from 'dotenv';
import { Agent } from './agent/agent';
import { EmailService } from './offchain/email/service';
import { CONSTANTS } from './config/constants';

// Load environment variables
dotenv.config();

async function main() {
    try {
        // Validate required environment variables
        const requiredEnvVars = ['PRIVATE_KEY', 'TREASURY_EMAIL', 'ETH_ADDRESS', 'RPC_URL'];
        const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
        
        if (missingEnvVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
        }

        // Initialize agent
        console.log('🚀 Initializing Email Treasury Agent...');
        const agent = await Agent.initialize(process.env.PRIVATE_KEY!);

        // Initialize email service
        console.log('📧 Initializing Email Service...');
        const emailService = await EmailService.initialize();

        // Start monitoring
        console.log('\n✨ Agent Status:');
        console.log(`📧 Monitoring inbox: ${process.env.TREASURY_EMAIL}`);
        console.log(`💰 Maximum payment: $${CONSTANTS.MAX_AMOUNT}`);
        console.log(`⏰ Cooldown period: ${CONSTANTS.COOLDOWN_MINUTES} minutes`);
        console.log('\n🔄 Starting email monitoring...');

        // Handle incoming emails
        await emailService.watchInbox(async (email) => {
            const result = await agent.handleRequest(email);
            
            if (result.success) {
                console.log('✅ Payment processed successfully!');
                console.log(`Transaction hash: ${result.transactionHash}`);
            } else {
                console.log('❌ Payment failed:', result.error);
            }
        });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down Email Treasury Agent...');
            process.exit(0);
        });

    } catch (error) {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('\n💥 Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('\n💥 Unhandled rejection:', error);
});

// Start the application
main().catch((error) => {
    console.error('\n💥 Initialization error:', error);
    process.exit(1);
});