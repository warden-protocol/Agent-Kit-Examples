import { CONSTANTS } from '../../config/constants';

interface CooldownRecord {
    email: string;
    timestamp: number;
}

export class CooldownManager {
    private cooldowns: CooldownRecord[] = [];

    canMakeRequest(email: string): boolean {
        const lastRequest = this.cooldowns.find(record => record.email === email);
        
        if (!lastRequest) {
            return true;
        }

        const timeSinceLastRequest = Date.now() - lastRequest.timestamp;
        const cooldownPeriod = CONSTANTS.COOLDOWN_MINUTES * 60 * 1000;

        return timeSinceLastRequest >= cooldownPeriod;
    }

    recordRequest(email: string): void {
        const existingIndex = this.cooldowns.findIndex(record => record.email === email);
        
        if (existingIndex !== -1) {
            this.cooldowns[existingIndex].timestamp = Date.now();
        } else {
            this.cooldowns.push({
                email,
                timestamp: Date.now()
            });
        }

        // Cleanup old records
        this.cleanup();
    }

    private cleanup(): void {
        const cooldownPeriod = CONSTANTS.COOLDOWN_MINUTES * 60 * 1000;
        const cutoff = Date.now() - cooldownPeriod;
        
        this.cooldowns = this.cooldowns.filter(record => 
            record.timestamp > cutoff
        );
    }
} 