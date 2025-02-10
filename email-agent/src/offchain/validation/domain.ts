import { EMAIL_CONFIG } from '../../config/email';

export class DomainValidator {
    static isValidDomain(email: string): boolean {
        try {
            console.log('Validating email:', email);
            
            // Extract email from format: "Display Name <email@domain.com>"
            const emailMatch = email.match(/<(.+?)>/);
            const cleanEmail = emailMatch ? emailMatch[1] : email;
            console.log('Cleaned email:', cleanEmail);
            
            const domain = cleanEmail.split('@')[1].toLowerCase();
            console.log('Extracted domain:', domain);
            console.log('Allowed domains:', EMAIL_CONFIG.ALLOWED_DOMAINS);
            
            const isValid = EMAIL_CONFIG.ALLOWED_DOMAINS.includes(domain);
            console.log('Is valid?', isValid);
            return isValid;
        } catch (error) {
            console.error('Error validating domain:', error);
            return false;
        }
    }

    static getEmailDomain(email: string): string | null {
        try {
            const emailMatch = email.match(/<(.+?)>/);
            const cleanEmail = emailMatch ? emailMatch[1] : email;
            return cleanEmail.split('@')[1].toLowerCase();
        } catch {
            return null;
        }
    }
} 