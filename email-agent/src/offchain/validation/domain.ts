import { EMAIL_CONFIG } from '../../config/email';

export class DomainValidator {
    static isValidDomain(email: string): boolean {
        try {
            const domain = email.split('@')[1].toLowerCase();
            return EMAIL_CONFIG.ALLOWED_DOMAINS.includes(domain);
        } catch {
            return false;
        }
    }

    static getEmailDomain(email: string): string | null {
        try {
            return email.split('@')[1].toLowerCase();
        } catch {
            return null;
        }
    }
} 