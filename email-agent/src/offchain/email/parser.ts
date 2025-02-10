import { EmailRequest } from '../../config/types';
import { PDFParser } from '../document/pdf-parser';

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

    static async parseRequest(email: any): Promise<EmailRequest> {
        const body = email.body || '';
        let amount = this.parseAmount(body);

        // If no amount found in body, check PDFs
        if (!amount && email.attachments) {
            for (const attachment of email.attachments) {
                if (attachment.filename.toLowerCase().endsWith('.pdf')) {
                    amount = await PDFParser.extractAmountFromPDF(attachment.data);
                    if (amount) break;
                }
            }
        }

        return {
            id: email.id,
            from: email.from,
            subject: email.subject,
            body: body,
            amount: amount,
            timestamp: new Date()
        };
    }
} 