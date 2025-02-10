import { SpaceManager } from '../onchain/space/manager';
import { PaymentProcessor } from '../onchain/payment/processor';
import { EmailParser } from '../offchain/email/parser';
import { DomainValidator } from '../offchain/validation/domain';
import { CooldownManager } from '../offchain/rate-limiting/cooldown';
import { EmailRequest, PaymentResult } from '../config/types';
import { CONSTANTS } from '../config/constants';

export class Agent {
    private spaceManager: SpaceManager;
    private paymentProcessor: PaymentProcessor;
    private cooldownManager: CooldownManager;
    private currentSpaceId?: number;

    private constructor(
        spaceManager: SpaceManager,
        paymentProcessor: PaymentProcessor
    ) {
        this.spaceManager = spaceManager;
        this.paymentProcessor = paymentProcessor;
        this.cooldownManager = new CooldownManager();
    }

    static async initialize(privateKey: string): Promise<Agent> {
        const spaceManager = new SpaceManager(privateKey);
        const paymentProcessor = new PaymentProcessor(privateKey);
        
        const agent = new Agent(spaceManager, paymentProcessor);
        await agent.setup();
        
        return agent;
    }

    private async setup() {
        console.log('Setting up agent...');
        this.currentSpaceId = await this.spaceManager.getOrCreateSpace();
        console.log(`Using space ID: ${this.currentSpaceId}`);
    }

    async handleRequest(email: any): Promise<PaymentResult> {
        try {
            console.log('\n--- Processing New Request ---');
            
            // Parse email request
            const request = await EmailParser.parseRequest(email);
            console.log('From:', request.from);
            console.log('Subject:', request.subject);
            console.log('Amount:', request.amount ? `$${request.amount}` : 'No amount specified');
            
            // Validate request
            const validationError = this.validateRequest(request);
            if (validationError) {
                return {
                    success: false,
                    error: validationError
                };
            }

            // Process payment
            console.log('\n🔄 Processing payment...');
            const result = await this.paymentProcessor.processPayment(
                process.env.ETH_ADDRESS!,
                request.amount!
            );

            // Record successful request
            if (result.success) {
                this.cooldownManager.recordRequest(request.from);
            }

            return result;

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private validateRequest(request: EmailRequest): string | null {
        // Check domain
        if (!DomainValidator.isValidDomain(request.from)) {
            console.log('❌ Invalid email domain');
            return 'Unauthorized email domain';
        }

        // Check amount
        if (!request.amount || request.amount <= 0 || request.amount > CONSTANTS.MAX_AMOUNT) {
            console.log('❌ Invalid amount');
            return `Invalid amount. Must be between 0 and ${CONSTANTS.MAX_AMOUNT}`;
        }

        // Check cooldown
        if (!this.cooldownManager.canMakeRequest(request.from)) {
            console.log('❌ Cooldown period active');
            return `Please wait ${CONSTANTS.COOLDOWN_MINUTES} minutes between requests`;
        }

        return null;
    }

    getStatus(): { spaceId: number } {
        if (!this.currentSpaceId) {
            throw new Error('Agent not properly initialized');
        }
        return { spaceId: this.currentSpaceId };
    }
} 