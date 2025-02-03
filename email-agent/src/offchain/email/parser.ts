import { EmailRequest } from '../../config/types';

export class EmailParser {
    static parseAmount(body: string): number | undefined {
        // Look for dollar amounts in the format $X or X dollars
        const dollarRegex = /\$(\d+(\.\d{2})?)|(\d+(\.\d{2})?)\s*dollars/i;
        const match = body.match(dollarRegex);
        
        if (match) {
            const amount = parseFloat(match[1] || match[3]);
            return !isNaN(amount) ? amount : undefined;
        }
        
        return undefined;
    }

    static parseRequest(email: any): EmailRequest {
        const body = email.body || '';
        
        return {
            id: email.id,
            from: email.from,
            subject: email.subject,
            body: body,
            amount: this.parseAmount(body),
            timestamp: new Date()
        };
    }
} 