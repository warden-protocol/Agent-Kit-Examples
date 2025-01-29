// src/index.ts
import { EmailService } from './services/email/service';
import { PaymentProcessor } from './services/payments/processor';
import { Database } from './services/database/client';
import { validateEmailDomain } from './utils/validation';
import { EmailRequest } from './services/email/types';
import { CONSTANTS } from './config/constants';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    if (!process.env.PRIVATE_KEY || !process.env.TREASURY_EMAIL || !process.env.KEY_ID || !process.env.ETH_ADDRESS) {
        throw new Error('Missing required environment variables. Check PRIVATE_KEY, TREASURY_EMAIL, KEY_ID, ETH_ADDRESS');
    }

    const emailService = await EmailService.initialize();
    const paymentProcessor = new PaymentProcessor(process.env.PRIVATE_KEY);
    const database = new Database();

    async function handleEmailRequest(request: EmailRequest) {
        try {
            console.log('\n--- New Request ---');
            console.log('From:', request.from);
            console.log('Subject:', request.subject);
            console.log('Requested Amount:', request.amount ? `$${request.amount}` : 'No amount specified');
            console.log('Timestamp:', request.timestamp);

            if (!validateEmailDomain(request.from)) {
                console.log('❌ Request rejected: Unauthorized email domain');
                return;
            }

            if (!request.amount || request.amount <= 0 || request.amount > CONSTANTS.MAX_AMOUNT) {
                console.log(`❌ Request rejected: Invalid amount $${request.amount}`);
                return;
            }

            const canRequest = await database.canRequestPayment(request.from);
            if (!canRequest) {
                console.log('❌ Request rejected: Cooldown period active');
                return;
            }

            const ethAmount = request.amount / 1000;

            console.log('\n🔄 Processing Payment');
            console.log(`Converting $${request.amount} to ${ethAmount} ETH`);
            console.log(`Recipient address: ${process.env.ETH_ADDRESS}`);

            const result = await paymentProcessor.sendPayment(process.env.ETH_ADDRESS!, ethAmount);

            console.log('\n✅ Payment Processed');
            console.log(result);

            await database.recordRequest(request.from, request.amount);
            console.log('\n📝 Request recorded in database');
            console.log('--- Request Complete ---\n');
        } catch (error) {
            console.error('\n❌ Error processing request:');
            if (error instanceof Error) {
                console.error('Error type:', error.name);
                console.error('Error message:', error.message);
                console.error('Stack trace:', error.stack);
            } else {
                console.error('Unknown error:', error);
            }
            console.log('--- Request Failed ---\n');
        }
    }

    console.log('\n🚀 Starting Email Treasury Agent');
    console.log('📧 Monitoring inbox:', process.env.TREASURY_EMAIL);
    console.log(`💰 Maximum payment: $${CONSTANTS.MAX_AMOUNT}`);
    console.log(`⏰ Cooldown period: ${CONSTANTS.COOLDOWN_MINUTES} minutes`);
    console.log('✨ Treasury agent is running...\n');

    await emailService.watchInbox(handleEmailRequest);

    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down Treasury Agent...');
        process.exit(0);
    });
}

process.on('uncaughtException', (error) => {
    console.error('\n💥 Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('\n💥 Unhandled rejection:', error);
});

main().catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
});